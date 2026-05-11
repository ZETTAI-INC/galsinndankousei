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

// 固定順序の軸（短縮版：MBTI 16軸 + 主要性格軸4つ = 20軸）
// マッチング精度のため厳選した軸のみエンコード
const ENCODE_AXES: readonly AnalysisAxis[] = [
  // attract系（8軸）
  "attractE", "attractI", "attractJ", "attractP",
  "attractT", "attractF", "attractS", "attractN",
  // self系（8軸）
  "selfE", "selfI", "selfJ", "selfP",
  "selfT", "selfF", "selfS", "selfN",
  // 主要性格軸（4軸のみ）
  "lowTempEmotion",
  "loveExpression",
  "silenceDependency",
  "understandDesire",
]
// 計20軸 × 1桁 = 20桁

function hasPrefix(scores: AnalysisScores, prefix: string): boolean {
  return Object.keys(scores).some((k) => k.startsWith(prefix) && (scores[k] ?? 0) !== 0)
}

function computeChecksum(s: string): string {
  let sum = 0
  for (const ch of s) sum += parseInt(ch, 10) || 0
  return (sum % 10).toString()
}

// スコア (0-30+) を 1桁 (0-9) に圧縮
function compressScore(score: number): string {
  const v = Math.max(0, Math.min(30, Math.round(score)))
  // 0→0, 1-3→1, 4-6→2, ..., 28-30→9
  return Math.min(9, Math.floor(v / 3) + (v > 0 && v <= 3 ? 1 : 0))
    .toString()
}

function expandScore(digit: string): number {
  const n = parseInt(digit, 10) || 0
  // 復元時の概算スコア（中央値で近似）
  if (n === 0) return 0
  return n * 3 - 1
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
    scoresStr += compressScore(raw)
  }

  const payload = v + g + scoresStr // 1 + 1 + 20 = 22桁
  const checksum = computeChecksum(payload) // 1桁
  const raw = payload + checksum // 23桁

  // 4桁ごとに「-」で区切る → 6グループ
  return raw.match(/.{1,4}/g)?.join("-") ?? raw
}

export function decodeShareCode(code: string): SharedData | null {
  try {
    // 全角・空白・記号を除去して数字だけにする
    const digits = code
      .trim()
      .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
      .replace(/\D/g, "")

    if (digits.length < 22) return null

    // 末尾1桁がチェックサム
    const payload = digits.slice(0, digits.length - 1)
    const checksum = digits.slice(-1)
    if (computeChecksum(payload) !== checksum) return null

    const v = parseInt(payload.slice(0, 1), 10)
    const gFlag = payload.slice(1, 2)
    const scoresStr = payload.slice(2)

    const scores: Record<string, number> = {}
    for (let i = 0; i < ENCODE_AXES.length; i++) {
      const digit = scoresStr.charAt(i)
      if (!digit) break
      const score = expandScore(digit)
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
