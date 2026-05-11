import type { AnalysisScores } from "./types"

const VERSION = 1
const PREFIX = "NMR"

export interface SharedData {
  readonly version: number
  readonly gender?: string
  readonly scores: AnalysisScores
  readonly otherName?: string
  readonly hasAttraction: boolean
  readonly hasSelf: boolean
  readonly hasOther: boolean
}

// 0スコアの軸を除外して圧縮
function compactScores(scores: AnalysisScores): AnalysisScores {
  const result: Record<string, number> = {}
  for (const [k, v] of Object.entries(scores)) {
    if (v && v !== 0) result[k] = v
  }
  return result
}

function hasPrefix(scores: AnalysisScores, prefix: string): boolean {
  return Object.keys(scores).some((k) => k.startsWith(prefix))
}

export function encodeShareCode(input: {
  scores: AnalysisScores
  gender?: string
  otherName?: string
}): string {
  const compact = {
    v: VERSION,
    g: input.gender,
    s: compactScores(input.scores),
    n: input.otherName,
  }
  const json = JSON.stringify(compact)
  let b64: string
  if (typeof window !== "undefined") {
    b64 = btoa(unescape(encodeURIComponent(json)))
  } else {
    b64 = Buffer.from(json, "utf-8").toString("base64")
  }
  // URL-safe base64
  const safe = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  return `${PREFIX}-${safe}`
}

export function decodeShareCode(code: string): SharedData | null {
  try {
    // 全角文字・空白を正規化
    const normalized = code
      .trim()
      .replace(/[－‐-―]/g, "-") // 全角ハイフン類
      .replace(/[　\s]+/g, "") // 全角空白・改行など
    const cleaned = normalized.replace(new RegExp(`^${PREFIX}-?`, "i"), "")
    if (!cleaned) return null
    // Restore base64 padding & chars
    let b64 = cleaned.replace(/-/g, "+").replace(/_/g, "/")
    while (b64.length % 4) b64 += "="

    let json: string
    if (typeof window !== "undefined") {
      json = decodeURIComponent(escape(atob(b64)))
    } else {
      json = Buffer.from(b64, "base64").toString("utf-8")
    }
    const data = JSON.parse(json)
    if (!data || typeof data !== "object") return null
    const scores: AnalysisScores = data.s ?? {}

    return {
      version: data.v ?? 1,
      gender: data.g,
      otherName: data.n,
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
    version: VERSION,
    gender,
    scores,
    hasAttraction: hasPrefix(scores, "attract"),
    hasSelf: hasPrefix(scores, "self"),
    hasOther: hasPrefix(scores, "other"),
  }
  return { code, data }
}
