import type { AnalysisAxis, AnalysisScores } from "./types"

const VERSION = "1"

export interface SharedData {
  readonly version: number
  readonly gender?: string
  readonly scores: AnalysisScores
  readonly otherName?: string
  readonly hasAttraction: boolean
  readonly hasSelf: boolean
  readonly hasOther: boolean
}

// 固定順序の軸（追加時は末尾のみに追加 = 後方互換性維持）
const ENCODE_AXES: readonly AnalysisAxis[] = [
  // attract系（8軸）
  "attractE", "attractI", "attractJ", "attractP",
  "attractT", "attractF", "attractS", "attractN",
  // self系（8軸）
  "selfE", "selfI", "selfJ", "selfP",
  "selfT", "selfF", "selfS", "selfN",
  // 性格軸（20軸）
  "lowTempEmotion", "lateNightVibe", "urbanSense", "dailyLifeFeel",
  "awkwardness", "neglectTolerance", "loveExpression", "lineTemperature",
  "humanity", "emotionalInstabilityTolerance", "silenceDependency",
  "innocenceTolerance", "conversationDensity", "distanceSense",
  "independence", "vibeMatch", "edginessTolerance", "caretakerDependency",
  "understandDesire", "saveDesire",
]
// 計36軸 × 2桁 = 72桁

function hasPrefix(scores: AnalysisScores, prefix: string): boolean {
  return Object.keys(scores).some((k) => k.startsWith(prefix) && (scores[k] ?? 0) !== 0)
}

function computeChecksum(s: string): string {
  let sum = 0
  for (const ch of s) sum += parseInt(ch, 10) || 0
  return (sum % 100).toString().padStart(2, "0")
}

// 数字のみエンコード（4桁ごとに区切り）
export function encodeShareCode(input: {
  scores: AnalysisScores
  gender?: string
}): string {
  const v = VERSION
  const g = input.gender === "male" ? "1" : "0"

  let scoresStr = ""
  for (const axis of ENCODE_AXES) {
    const raw = input.scores[axis] ?? 0
    const score = Math.max(0, Math.min(99, Math.round(raw)))
    scoresStr += score.toString().padStart(2, "0")
  }

  const payload = v + g + scoresStr // 1 + 1 + 72 = 74桁
  const checksum = computeChecksum(payload) // 2桁
  const raw = payload + checksum // 76桁

  // 4桁ごとに「-」で区切る
  return raw.match(/.{1,4}/g)?.join("-") ?? raw
}

export function decodeShareCode(code: string): SharedData | null {
  try {
    // 全角・空白・記号を除去して数字だけにする
    const digits = code
      .trim()
      .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
      .replace(/\D/g, "")

    if (digits.length < 74) return null

    // 末尾2桁がチェックサム
    const payload = digits.slice(0, digits.length - 2)
    const checksum = digits.slice(-2)
    if (computeChecksum(payload) !== checksum) return null

    const v = parseInt(payload.slice(0, 1), 10)
    const gFlag = payload.slice(1, 2)
    const scoresStr = payload.slice(2)

    const scores: Record<string, number> = {}
    for (let i = 0; i < ENCODE_AXES.length; i++) {
      const slice = scoresStr.slice(i * 2, i * 2 + 2)
      if (slice.length !== 2) break
      const score = parseInt(slice, 10)
      if (score > 0) {
        scores[ENCODE_AXES[i]] = score
      }
    }

    return {
      version: v,
      gender: gFlag === "1" ? "male" : "female",
      scores,
      hasAttraction: hasPrefix(scores, "attract"),
      hasSelf: hasPrefix(scores, "self"),
      hasOther: hasPrefix(scores, "other"),
    }
  } catch (e) {
    console.error("Decode error:", e)
    return null
  }
}

function safeLocalGet(key: string): string | null {
  try {
    if (typeof window === "undefined") return null
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeJsonParse<T = unknown>(s: string | null): T | null {
  if (!s) return null
  try {
    return JSON.parse(s) as T
  } catch {
    return null
  }
}

// 自分のlocalStorageからスコアを集めてコードを生成
export function getMyCode(): { code: string; data: SharedData } | null {
  if (typeof window === "undefined") return null

  const attractionStored = safeLocalGet("diagnosis-scores")
  const selfStored = safeLocalGet("self-scores")
  const gender = safeLocalGet("diagnosis-gender") ?? undefined

  const attractionScores = safeJsonParse<AnalysisScores>(attractionStored) ?? {}
  const selfScores = safeJsonParse<AnalysisScores>(selfStored) ?? {}
  const scores: AnalysisScores = { ...attractionScores, ...selfScores }

  if (Object.keys(scores).length === 0) return null

  const code = encodeShareCode({ scores, gender })
  const data: SharedData = {
    version: parseInt(VERSION, 10),
    gender,
    scores,
    hasAttraction: hasPrefix(scores, "attract"),
    hasSelf: hasPrefix(scores, "self"),
    hasOther: hasPrefix(scores, "other"),
  }
  return { code, data }
}
