/**
 * 匿名診断ログ。
 *
 * 二系統:
 *   - localStorage: 端末ローカルにバックアップ（オフライン耐性・最低限）
 *   - Supabase:     リモート集計用。NEXT_PUBLIC_SUPABASE_URL/ANON_KEY が
 *                   設定されている時だけ送る。設定なしでもアプリは動く。
 *
 * 何を取るか:
 *   - diagnosis_start: 開始（gender 選択時）
 *   - answer: どの質問でどの選択肢を選んだか（軸の偏りや人気選択肢の把握）
 *   - phase_complete: フェーズ完了タイミング（離脱率分析）
 *   - result: 最終 MBTI と全 scores（タイプ分布・実ユーザー上位X% 計算用）
 *
 * 個人情報は一切載せない。匿名 sessionId のみで紐付け。
 */

import type { AnalysisScores, Gender } from "./types"
import { supabase } from "./supabase"

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

// Supabase に fire-and-forget で送る。設定なしならスキップ。
// エラーは握り潰す（ログ送信失敗で本体機能を止めたくない）。
function sendRemote(event: LogEvent): void {
  if (!supabase) return
  if (typeof window === "undefined") return
  const sid = getOrCreateSid()
  const { type, ...payload } = event
  void supabase
    .from("diag_events")
    .insert({
      sid,
      type,
      payload,
    })
    .then(({ error }) => {
      if (error && process.env.NODE_ENV !== "production") {
        // 開発時だけコンソールに出す
        // eslint-disable-next-line no-console
        console.warn("[logging] supabase insert failed:", error.message)
      }
    })
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
