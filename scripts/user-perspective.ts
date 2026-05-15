/**
 * 100回診断やってみる、ユーザー目線の監査。
 * - 同じ MBTI が何回出るか
 * - 同じ予測が何人に出るか（被りすぎ感）
 * - 質問のたった1個変えただけで結果が変わるか（ロバスト性）
 * - サンプル結果を3つ読んで「これ刺さる?」評価
 */

import {
  phase1Questions,
  determinePhase1Type,
  determinePhase3Type,
} from "../src/lib/questions"
import { selectAdaptivePhase2, selectAdaptivePhase3 } from "../src/lib/adaptive"
import { selectPredictions } from "../src/lib/predictions"
import { getRarityHighlights } from "../src/lib/calibration"
import type { AnalysisScores, Question } from "../src/lib/types"

const N = 100
let s = 42
const rng = () => {
  s = (s * 1664525 + 1013904223) >>> 0
  return s / 0x100000000
}

function applyChoice(scores: Record<string, number>, q: Question, idx: number) {
  for (const [k, v] of Object.entries(q.choices[idx].scores)) {
    scores[k] = (scores[k] ?? 0) + (v ?? 0)
  }
}

interface Session {
  scores: AnalysisScores
  p1: string
  p3: string
  predictionIds: string[]
  predictionTexts: string[]
  rarityAxes: string[]
  answers: { qid: number; choice: string }[]
}

function simulateOne(): Session {
  const scores: Record<string, number> = {}
  const answers: { qid: number; choice: string }[] = []

  for (const q of phase1Questions) {
    const idx = Math.floor(rng() * q.choices.length)
    applyChoice(scores, q, idx)
    answers.push({ qid: q.id, choice: q.choices[idx].id })
  }
  const p1 = determinePhase1Type(scores as AnalysisScores)
  for (const q of selectAdaptivePhase2(p1, scores as AnalysisScores)) {
    const idx = Math.floor(rng() * q.choices.length)
    applyChoice(scores, q, idx)
    answers.push({ qid: q.id, choice: q.choices[idx].id })
  }
  const p3 = determinePhase3Type(scores as AnalysisScores)
  for (const q of selectAdaptivePhase3(p3, scores as AnalysisScores)) {
    const idx = Math.floor(rng() * q.choices.length)
    applyChoice(scores, q, idx)
    answers.push({ qid: q.id, choice: q.choices[idx].id })
  }

  const preds = selectPredictions(scores as AnalysisScores, 5, 2)
  const rarities = getRarityHighlights(scores as AnalysisScores, 3)

  return {
    scores: scores as AnalysisScores,
    p1,
    p3,
    predictionIds: preds.map((p) => p.id),
    predictionTexts: preds.map((p) => p.text),
    rarityAxes: rarities.map((r) => r.axis),
    answers,
  }
}

const sessions = Array.from({ length: N }, () => simulateOne())

// ━━━ 1. 予測の被り具合（同じ予測がn人に出てる?）━━━
const predOccurrences: Record<string, number> = {}
for (const sess of sessions) {
  for (const id of sess.predictionIds) {
    predOccurrences[id] = (predOccurrences[id] ?? 0) + 1
  }
}
const sortedPreds = Object.entries(predOccurrences).sort((a, b) => b[1] - a[1])

console.log("━━━ 1. 「同じ予測ばっかり出てくる」問題 ━━━")
console.log("Top 10 出現予測:")
for (const [id, n] of sortedPreds.slice(0, 10)) {
  const pct = ((n / N) * 100).toFixed(0)
  const text = sessions.find((s) => s.predictionIds.includes(id))?.predictionTexts[
    sessions.find((s) => s.predictionIds.includes(id))!.predictionIds.indexOf(id)
  ] ?? id
  console.log(`  ${pct.padStart(3)}% (${id}) ${text.slice(0, 40)}`)
}
const dead = 65 - Object.keys(predOccurrences).length
console.log(`\n発火しなかった予測: ${dead} / 65`)

// ━━━ 2. 友達5人やったら同じMBTIになる問題 ━━━
const mbtiPair: Record<string, number> = {}
for (const sess of sessions) {
  const key = `${sess.p1}-${sess.p3}`
  mbtiPair[key] = (mbtiPair[key] ?? 0) + 1
}
console.log("\n━━━ 2. 「友達と同じ結果になる」問題 ━━━")
console.log("Phase1-Phase3 の組み合わせ:")
for (const [k, n] of Object.entries(mbtiPair).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k}: ${n}人 (${((n / N) * 100).toFixed(0)}%)`)
}

// ━━━ 3. 「全員に出る予測」(50%超) があるか ━━━
console.log("\n━━━ 3. 「これ占いの定番セリフだろ」になる予測 ━━━")
const veryCommon = sortedPreds.filter(([, n]) => n >= 30)
if (veryCommon.length === 0) {
  console.log("  該当なし（30%超に出る予測なし、健全）")
} else {
  console.log("  30%超のユーザーに出る予測:")
  for (const [id, n] of veryCommon) {
    const text = sessions
      .map((s) => {
        const i = s.predictionIds.indexOf(id)
        return i >= 0 ? s.predictionTexts[i] : null
      })
      .filter(Boolean)[0]
    console.log(`    ${((n / N) * 100).toFixed(0)}%  ${text}`)
  }
}

// ━━━ 4. 同じ MBTI の中で結果がどれだけバラけるか ━━━
console.log("\n━━━ 4. 同じMBTIでも予測がバラける? ━━━")
// Phase1-Phase3 が同じ「分岐型」のグループで、何種類の予測が出てるか
const groupPredVariety: Record<string, Set<string>> = {}
const groupSize: Record<string, number> = {}
for (const sess of sessions) {
  const key = `${sess.p1}-${sess.p3}`
  if (!groupPredVariety[key]) groupPredVariety[key] = new Set()
  for (const id of sess.predictionIds) groupPredVariety[key].add(id)
  groupSize[key] = (groupSize[key] ?? 0) + 1
}
for (const [key, set] of Object.entries(groupPredVariety).sort((a, b) => groupSize[b[0]] - groupSize[a[0]])) {
  if (groupSize[key] < 3) continue
  console.log(`  ${key} (n=${groupSize[key]}): ${set.size}種類の予測が登場`)
}

// ━━━ 5. サンプル結果3つ読んで「これ刺さる?」自評価 ━━━
console.log("\n━━━ 5. サンプル3セッションの予測内容（人間が評価する用） ━━━")
const samples = [sessions[0], sessions[33], sessions[66]]
samples.forEach((sess, i) => {
  console.log(`\n--- Sample ${i + 1}: ${sess.p1}-${sess.p3} ---`)
  console.log(`  最希少軸: ${sess.rarityAxes.join(", ")}`)
  console.log(`  予測:`)
  for (const t of sess.predictionTexts) console.log(`    - ${t}`)
})

// ━━━ 6. 1問だけ変えると結果がどう変わる? (Robustness) ━━━
console.log("\n━━━ 6. ロバスト性: 1問だけ変えると ━━━")
console.log("(Phase 1 の Q1 を変えてみて、最終 MBTI が変わるか確認)")
const q1 = phase1Questions[0]
let changedCount = 0
for (let i = 0; i < 50; i++) {
  // 同じ seed で2回流して、Q1 だけ別の選択肢にする
  s = 100 + i
  const r1 = simulateOne()
  s = 100 + i
  const scoresB: Record<string, number> = {}
  // Q1 を別選択肢で
  applyChoice(scoresB, q1, (Math.floor(rng() * 4) + 1) % 4)
  for (let j = 1; j < phase1Questions.length; j++) {
    applyChoice(scoresB, phase1Questions[j], Math.floor(rng() * 4))
  }
  const p1B = determinePhase1Type(scoresB as AnalysisScores)
  for (const q of selectAdaptivePhase2(p1B, scoresB as AnalysisScores)) {
    applyChoice(scoresB, q, Math.floor(rng() * 4))
  }
  const p3B = determinePhase3Type(scoresB as AnalysisScores)
  if (`${r1.p1}-${r1.p3}` !== `${p1B}-${p3B}`) changedCount++
}
console.log(`  Q1の選択肢変えただけで分岐タイプ変化: ${changedCount} / 50 (${(changedCount * 2).toFixed(0)}%)`)
