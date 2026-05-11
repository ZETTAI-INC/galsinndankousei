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
    const cleaned = code.trim().replace(new RegExp(`^${PREFIX}-?`), "")
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

// 自分のlocalStorageからスコアを集めてコードを生成
export function getMyCode(): { code: string; data: SharedData } | null {
  if (typeof window === "undefined") return null

  const attractionStored = localStorage.getItem("diagnosis-scores")
  const selfStored = localStorage.getItem("self-scores")
  const gender = localStorage.getItem("diagnosis-gender") ?? undefined

  if (!attractionStored && !selfStored) return null

  const attractionScores = attractionStored ? JSON.parse(attractionStored) : {}
  const selfScores = selfStored ? JSON.parse(selfStored) : {}
  const scores: AnalysisScores = { ...attractionScores, ...selfScores }

  const code = encodeShareCode({ scores, gender })
  const data: SharedData = {
    version: VERSION,
    gender,
    scores,
    hasAttraction: !!attractionStored,
    hasSelf: !!selfStored,
    hasOther: false,
  }
  return { code, data }
}
