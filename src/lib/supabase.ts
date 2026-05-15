/**
 * Supabase クライアント。
 *
 * 環境変数が未設定なら `null` を返し、呼び出し側で「未設定なら何もしない」とする。
 * 開発初期に env 設定なしでも動かせるようにするため。
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

if (url && anonKey) {
  client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const supabase = client

export function isSupabaseConfigured(): boolean {
  return supabase !== null
}
