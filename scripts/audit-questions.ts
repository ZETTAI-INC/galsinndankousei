/**
 * 全質問を走査して以下を報告:
 *   1. MBTI次元バランス: 各質問が EI/JP/TF/SN それぞれを E vs I, J vs P で
 *      どちらに何点振っているか
 *   2. 軸ペア共起: 同一選択肢内で2つの軸が同時に加点されてる回数
 *      → 軸間相関の原因になる
 */

import {
  phase1Questions,
  phase2Questions,
  phase3Questions,
} from "../src/lib/questions"
import { allExtraQuestions } from "../src/lib/questions-extra"
import type { Question } from "../src/lib/types"

// ━━━ 全プール ━━━
const allQuestions: { phase: string; q: Question }[] = []
phase1Questions.forEach((q) => allQuestions.push({ phase: "P1", q }))
;(["EJ", "EP", "IJ", "IP"] as const).forEach((k) =>
  phase2Questions[k].forEach((q) => allQuestions.push({ phase: `P2-${k}`, q }))
)
;(["NF", "NT", "SF", "ST"] as const).forEach((k) =>
  phase3Questions[k].forEach((q) => allQuestions.push({ phase: `P3-${k}`, q }))
)
allExtraQuestions.forEach((q) => allQuestions.push({ phase: "EXTRA", q }))

console.log(`Total questions: ${allQuestions.length}`)

// ━━━ 1. MBTI次元バランス監査 ━━━
type Dim = "EI" | "JP" | "TF" | "SN"
const PAIR: Record<Dim, [string, string]> = {
  EI: ["attractE", "attractI"],
  JP: ["attractJ", "attractP"],
  TF: ["attractT", "attractF"],
  SN: ["attractS", "attractN"],
}

function dimWeights(q: Question, dim: Dim): { left: number; right: number } {
  const [L, R] = PAIR[dim]
  let left = 0
  let right = 0
  for (const c of q.choices) {
    left += c.scores[L as keyof typeof c.scores] ?? 0
    right += c.scores[R as keyof typeof c.scores] ?? 0
  }
  return { left, right }
}

console.log("\n## MBTI dimension totals across all questions")
for (const dim of Object.keys(PAIR) as Dim[]) {
  let totalL = 0
  let totalR = 0
  for (const { q } of allQuestions) {
    const { left, right } = dimWeights(q, dim)
    totalL += left
    totalR += right
  }
  const ratio = totalL / (totalR || 1)
  console.log(
    `  ${dim}: ${PAIR[dim][0]}=${totalL.toFixed(0)}  ${PAIR[dim][1]}=${totalR.toFixed(0)}  ratio=${ratio.toFixed(2)}`
  )
}

console.log("\n## Per-question imbalance (only flagged: ratio > 2 or < 0.5, on touched dim)")
const flagged: { q: Question; phase: string; issues: string[] }[] = []
for (const { q, phase } of allQuestions) {
  const issues: string[] = []
  for (const dim of Object.keys(PAIR) as Dim[]) {
    const { left, right } = dimWeights(q, dim)
    const total = left + right
    if (total < 1) continue // ほぼ触れてない軸はスキップ
    const ratio = left / Math.max(right, 0.01)
    if (ratio > 2 || ratio < 0.5) {
      issues.push(
        `${dim}: ${PAIR[dim][0]}=${left.toFixed(1)} vs ${PAIR[dim][1]}=${right.toFixed(1)}`
      )
    }
  }
  if (issues.length) flagged.push({ q, phase, issues })
}

console.log(`Flagged: ${flagged.length} / ${allQuestions.length}`)
for (const f of flagged.slice(0, 30)) {
  console.log(`\n  [${f.phase} q${f.q.id}] ${f.q.text.replace(/\n/g, " ")}`)
  for (const iss of f.issues) console.log(`    → ${iss}`)
}
if (flagged.length > 30) console.log(`  ... and ${flagged.length - 30} more`)

// ━━━ 2. 軸ペア共起カウント ━━━
console.log("\n## Top axis co-occurrence within same choice (causes correlation)")
const coOccur: Record<string, number> = {}
for (const { q } of allQuestions) {
  for (const c of q.choices) {
    const axes = Object.keys(c.scores).sort()
    for (let i = 0; i < axes.length; i++) {
      for (let j = i + 1; j < axes.length; j++) {
        const key = `${axes[i]} | ${axes[j]}`
        coOccur[key] = (coOccur[key] ?? 0) + 1
      }
    }
  }
}
const coSorted = Object.entries(coOccur).sort((a, b) => b[1] - a[1])
for (const [k, n] of coSorted.slice(0, 30)) {
  console.log(`  ${String(n).padStart(3)}  ${k}`)
}

// ━━━ 3. 軸ごとの「同時に加点される他軸トップ3」 ━━━
console.log("\n## For high-correlation axes: who they co-occur with most")
const HIGH_CORR_AXES = [
  "independence",
  "urbanSense",
  "humanity",
  "lowTempEmotion",
  "lineTemperature",
  "vibeMatch",
  "innocenceTolerance",
]
for (const ax of HIGH_CORR_AXES) {
  const partners: Record<string, number> = {}
  for (const { q } of allQuestions) {
    for (const c of q.choices) {
      if (!(ax in c.scores)) continue
      for (const k of Object.keys(c.scores)) {
        if (k === ax) continue
        partners[k] = (partners[k] ?? 0) + 1
      }
    }
  }
  const top = Object.entries(partners)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  console.log(`  ${ax}: ${top.map(([k, n]) => `${k}(${n})`).join(", ")}`)
}
