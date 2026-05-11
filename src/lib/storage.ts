import type { AnalysisScores } from "./types"

export function safeGet(key: string): string | null {
  try {
    if (typeof window === "undefined") return null
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeSet(key: string, value: string): boolean {
  try {
    if (typeof window === "undefined") return false
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function safeRemove(key: string): void {
  try {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export function safeJsonParse<T = unknown>(s: string | null): T | null {
  if (!s) return null
  try {
    return JSON.parse(s) as T
  } catch {
    return null
  }
}

export function getScores(key: string): AnalysisScores | null {
  return safeJsonParse<AnalysisScores>(safeGet(key))
}
