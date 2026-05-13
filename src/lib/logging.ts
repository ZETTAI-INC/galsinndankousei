/**
 * 匿名診断ログ。
 *
 * Phase 1: localStorage に貯める（オフライン優先・privacy配慮）。
 * Phase 2: Supabase / 自前API へ flush（後で配線するだけ）。
 *
 * 何を取るか:
 *   - answer: どの質問でどの選択肢を選んだか（軸の偏りや人気選択肢の把握）
 *   - phase_complete: フェーズ完了タイミング（離脱率分析）
 *   - result: 最終 MBTI と全 scores（タイプ分布・実ユーザー上位X% 計算用）
 *
 * 個人情報は一切載せない。匿名 sessionId のみで紐付け。
 */

import type { AnalysisScores, Gender } from "./types"

type LogEvent =
  | {
      readonly type: "answer"
      readonly questionId: number
      readonly choiceId: string
      readonly phaseIndex: number
      readonly stage: string
    }
  | {
      readonly type: "phase_complete"
      readonly phase: number
    }
  | {
      readonly type: "result"
      readonly mbti: string
      readonly gender: Gender
      readonly scores: AnalysisScores
    }
  | {
      readonly type: "diagnosis_start"
      readonly gender: Gender
    }

interface StoredEvent extends Record<string, unknown> {
  readonly ts: number
  readonly sid: string
}

const STORAGE_KEY = "diag_events_v1"
const SID_KEY = "diag_sid_v1"
const MAX_EVENTS = 2000 // localStorage 上限対策。古いものから捨てる

function getOrCreateSid(): string {
  if (typeof window === "undefined") return "ssr"
  try {
    let sid = localStorage.getItem(SID_KEY)
    if (!sid) {
      sid =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      localStorage.setItem(SID_KEY, sid)
    }
    return sid
  } catch {
    return "no-storage"
  }
}

function appendToStorage(event: LogEvent) {
  if (typeof window === "undefined") return
  try {
    const sid = getOrCreateSid()
    const stored: StoredEvent = { ...event, ts: Date.now(), sid }
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr: StoredEvent[] = raw ? JSON.parse(raw) : []
    arr.push(stored)
    const trimmed = arr.length > MAX_EVENTS ? arr.slice(-MAX_EVENTS) : arr
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // QuotaExceeded など。サイレントに失敗
  }
}

// 後で Supabase 等に差し替えるための fire-and-forget hook。
// 今はネットワーク呼び出ししない（プライバシー / 余計なコスト避け）。
function sendRemote(_event: LogEvent): void {
  // TODO: Supabase 設定後にここで insert する
  //   await supabase.from('diag_events').insert({...})
}

export function logEvent(event: LogEvent): void {
  appendToStorage(event)
  sendRemote(event)
}

// デバッグ・開発用: 蓄積イベントを取り出す
export function readStoredEvents(): readonly StoredEvent[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredEvent[]) : []
  } catch {
    return []
  }
}

export function clearStoredEvents(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* noop */
  }
}
