import type { AnalysisScores } from "./types"

// Mulberry32 - 高速な seeded PRNG
export function createSeededRandom(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), 1 | t)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// スコアからハッシュを生成（同じスコア = 同じシード）
export function hashScores(scores: AnalysisScores): number {
  let hash = 5381
  const entries = Object.entries(scores)
    .filter(([, v]) => v !== 0)
    .sort(([a], [b]) => a.localeCompare(b))
  for (const [key, value] of entries) {
    const str = `${key}:${Math.round(value * 10)}`
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
    }
  }
  return Math.abs(hash) || 1
}

// シードベースのシャッフル（同じシード = 同じ順序）
export function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const rng = createSeededRandom(seed)
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// シードベースの選択
export function seededPick<T>(arr: readonly T[], seed: number): T {
  if (arr.length === 0) throw new Error("empty array")
  const rng = createSeededRandom(seed)
  return arr[Math.floor(rng() * arr.length)] as T
}
