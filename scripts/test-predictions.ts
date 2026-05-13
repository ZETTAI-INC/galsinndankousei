/**
 * predictions.ts と getRarityHighlights が実際の診断結果で発火するか確認。
 * 1000人ランダム回答を流して、予測がいくつ発火したかと、
 * 希少ポイントの分布をざっと出す。
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

const N = 1000
let s = 12345
const rng = () => {
  s = (s * 1664525 + 1013904223) >>> 0
  return s / 0x100000000
}

function applyChoice(scores: Record<string, number>, q: Question, idx: number) {
  for (const [k, v] of Object.entries(q.choices[idx].scores)) {
    scores[k] = (scores[k] ?? 0) + (v ?? 0)
  }
}

function simulateOne(): AnalysisScores {
  const scores: Record<string, number> = {}
  for (const q of phase1Questions) applyChoice(scores, q, Math.floor(rng() * q.choices.length))
  const p1 = determinePhase1Type(scores as AnalysisScores)
  for (const q of selectAdaptivePhase2(p1, scores as AnalysisScores))
    applyChoice(scores, q, Math.floor(rng() * q.choices.length))
  const p3 = determinePhase3Type(scores as AnalysisScores)
  for (const q of selectAdaptivePhase3(p3, scores as AnalysisScores))
    applyChoice(scores, q, Math.floor(rng() * q.choices.length))
  return scores as AnalysisScores
}

const predHistogram: Record<string, number> = {}
const rarityAxisHistogram: Record<string, number> = {}
let totalPredictions = 0
let respondentsWithFivePredictions = 0

for (let i = 0; i < N; i++) {
  const scores = simulateOne()
  const preds = selectPredictions(scores, 5, 2)
  totalPredictions += preds.length
  if (preds.length >= 5) respondentsWithFivePredictions++
  for (const p of preds) predHistogram[p.id] = (predHistogram[p.id] ?? 0) + 1

  const rarities = getRarityHighlights(scores, 3)
  for (const r of rarities) rarityAxisHistogram[r.axis] = (rarityAxisHistogram[r.axis] ?? 0) + 1
}

console.log(`N=${N}`)
console.log(`Average predictions per respondent: ${(totalPredictions / N).toFixed(2)}`)
console.log(`Respondents with full 5 predictions: ${respondentsWithFivePredictions} (${((respondentsWithFivePredictions / N) * 100).toFixed(1)}%)`)

console.log("\n## Prediction trigger frequency (top 20)")
const predSorted = Object.entries(predHistogram).sort((a, b) => b[1] - a[1])
for (const [id, n] of predSorted.slice(0, 20)) {
  console.log(`  ${id}  ${String(n).padStart(4)}  (${((n / N) * 100).toFixed(1)}%)`)
}

console.log(`\nTotal unique predictions used: ${predSorted.length}`)
const dead = predSorted.filter(([, n]) => n === 0)
console.log(`Predictions never triggered: ${dead.length}`)

console.log("\n## Rarity highlight axis frequency (which axes appear in top3)")
const raritySorted = Object.entries(rarityAxisHistogram).sort((a, b) => b[1] - a[1])
for (const [ax, n] of raritySorted) {
  console.log(`  ${ax.padEnd(35)} ${String(n).padStart(4)}  (${((n / (N * 3)) * 100).toFixed(1)}%)`)
}
