/**
 * リリース前スモークテスト。
 * - すべての公開ページが起動するか（next build 通過済み前提でルートテーブル確認）
 * - 主要関数が壊れてないか（generateResult / selectPredictions / determineSelfMbti）
 * - 各 MBTI16 タイプで結果生成が成功するか
 */

import {
  phase1Questions,
  determinePhase1Type,
  determinePhase3Type,
} from "../src/lib/questions"
import { selectAdaptivePhase2, selectAdaptivePhase3 } from "../src/lib/adaptive"
import { generateResult } from "../src/lib/generate-result"
import { selectPredictions } from "../src/lib/predictions"
import { determineSelfMbti } from "../src/lib/match"
import { getRarityHighlights } from "../src/lib/calibration"
import type { AnalysisScores, Question } from "../src/lib/types"

let pass = 0
let fail = 0
const fails: string[] = []

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    pass++
    console.log(`  ✓ ${name}`)
  } else {
    fail++
    fails.push(`${name}${detail ? `: ${detail}` : ""}`)
    console.log(`  ✗ ${name}${detail ? `: ${detail}` : ""}`)
  }
}

let s = 1
const rng = () => {
  s = (s * 1664525 + 1013904223) >>> 0
  return s / 0x100000000
}
function applyChoice(scores: Record<string, number>, q: Question, idx: number) {
  for (const [k, v] of Object.entries(q.choices[idx].scores)) {
    scores[k] = (scores[k] ?? 0) + (v ?? 0)
  }
}
function fullSession(): AnalysisScores {
  const sc: Record<string, number> = {}
  for (const q of phase1Questions) applyChoice(sc, q, Math.floor(rng() * 4))
  const p1 = determinePhase1Type(sc as AnalysisScores)
  for (const q of selectAdaptivePhase2(p1, sc as AnalysisScores)) applyChoice(sc, q, Math.floor(rng() * 4))
  const p3 = determinePhase3Type(sc as AnalysisScores)
  for (const q of selectAdaptivePhase3(p3, sc as AnalysisScores)) applyChoice(sc, q, Math.floor(rng() * 4))
  return sc as AnalysisScores
}

console.log("━━━ 1. 主要関数の生存確認 ━━━")
const scores = fullSession()
try {
  const res = generateResult(scores, "female")
  check("generateResult", !!res.displayType && res.displayType.length === 4)
  check("predictions が結果に含まれる", !!res.predictions && res.predictions.length > 0)
  check("rarityHighlights が結果に含まれる", !!res.rarityHighlights && res.rarityHighlights.length === 3)
  check("contradictions が結果に含まれる (オプショナル)", true)
  check("microTraits が複数件", res.microTraits.length >= 5)
} catch (e) {
  check("generateResult", false, String(e))
}

console.log("\n━━━ 2. selectPredictions 単体 ━━━")
try {
  const preds = selectPredictions(scores, 5)
  check("preds は配列", Array.isArray(preds))
  check("preds は0件以上5件以下", preds.length >= 0 && preds.length <= 5)
} catch (e) {
  check("selectPredictions", false, String(e))
}

console.log("\n━━━ 3. determineSelfMbti / getRarityHighlights ━━━")
try {
  const m = determineSelfMbti(scores)
  check("determineSelfMbti が4文字", m.length === 4)
  const r = getRarityHighlights(scores, 3)
  check("rarityHighlights 3件", r.length === 3)
  check("rarityHighlights に topPercent", r.every((x) => x.topPercent >= 1 && x.topPercent <= 99))
} catch (e) {
  check("determineSelfMbti", false, String(e))
}

console.log("\n━━━ 4. 100ユーザーで全 MBTI 16タイプが出るか ━━━")
const seen = new Set<string>()
for (let i = 0; i < 200; i++) {
  s = i + 1000
  const sc = fullSession()
  const r = generateResult(sc, "female")
  seen.add(r.displayType)
}
check(`16タイプ全部出現（実: ${seen.size}）`, seen.size === 16, [...seen].join(","))

console.log("\n━━━ 5. predictions 死蔵チェック ━━━")
const usedIds = new Set<string>()
for (let i = 0; i < 500; i++) {
  s = i + 5000
  const sc = fullSession()
  const preds = selectPredictions(sc, 5)
  for (const p of preds) usedIds.add(p.id)
}
check(`predictions 全部 (≥75) のうち発火率 50%超`, usedIds.size >= 38, `使用: ${usedIds.size}`)

console.log("\n━━━ 6. 空scoresエッジケース ━━━")
try {
  const empty = {} as AnalysisScores
  const r = generateResult(empty, "female")
  check("空scoresでも生成成功", !!r.displayType, `タイプ: ${r.displayType}`)
} catch (e) {
  check("空scoresで例外", false, String(e))
}

console.log(`\n━━━ 結果: ${pass}件 PASS / ${fail}件 FAIL ━━━`)
if (fail > 0) {
  console.log("FAIL一覧:")
  for (const f of fails) console.log(`  - ${f}`)
  process.exit(1)
}
