import {
  phase1Questions,
  determinePhase1Type,
  determinePhase3Type,
} from "../src/lib/questions"
import { selectAdaptivePhase2, selectAdaptivePhase3 } from "../src/lib/adaptive"
import { generateResult } from "../src/lib/generate-result"
import type { AnalysisScores, Question } from "../src/lib/types"

const N = 1000
const SEED = 12345

function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0x100000000
  }
}

const rng = makeRng(SEED)

function pickChoiceIdx(q: Question): number {
  return Math.floor(rng() * q.choices.length)
}

function applyChoice(scores: Record<string, number>, q: Question, idx: number) {
  const choice = q.choices[idx]
  for (const [k, v] of Object.entries(choice.scores)) {
    scores[k] = (scores[k] ?? 0) + (v ?? 0)
  }
}

function simulateOne() {
  const scores: Record<string, number> = {}

  for (const q of phase1Questions) {
    applyChoice(scores, q, pickChoiceIdx(q))
  }
  const p1 = determinePhase1Type(scores as AnalysisScores)

  const phase2Qs = selectAdaptivePhase2(p1, scores as AnalysisScores)
  for (const q of phase2Qs) {
    applyChoice(scores, q, pickChoiceIdx(q))
  }
  const p3 = determinePhase3Type(scores as AnalysisScores)

  const phase3Qs = selectAdaptivePhase3(p3, scores as AnalysisScores)
  for (const q of phase3Qs) {
    applyChoice(scores, q, pickChoiceIdx(q))
  }

  const result = generateResult(scores as AnalysisScores, "female")
  return { scores, p1, p3, mbti: result.displayType }
}

type Sim = ReturnType<typeof simulateOne>
const sims: Sim[] = []
for (let i = 0; i < N; i++) sims.push(simulateOne())

function freq<T extends string>(arr: T[]): Record<string, number> {
  const m: Record<string, number> = {}
  for (const x of arr) m[x] = (m[x] ?? 0) + 1
  return m
}

function pct(n: number, total: number): string {
  return `${((n / total) * 100).toFixed(1)}%`
}

const allAxes = Array.from(
  sims.reduce<Set<string>>((set, s) => {
    Object.keys(s.scores).forEach((k) => set.add(k))
    return set
  }, new Set())
).sort()

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}
function std(xs: number[]): number {
  const m = mean(xs)
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)))
}
function corr(xs: number[], ys: number[]): number {
  const mx = mean(xs)
  const my = mean(ys)
  let cov = 0
  let vx = 0
  let vy = 0
  for (let i = 0; i < xs.length; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    cov += dx * dy
    vx += dx * dx
    vy += dy * dy
  }
  if (vx === 0 || vy === 0) return 0
  return cov / Math.sqrt(vx * vy)
}

const axisVecs: Record<string, number[]> = {}
for (const ax of allAxes) {
  axisVecs[ax] = sims.map((s) => s.scores[ax] ?? 0)
}

console.log("=".repeat(60))
console.log(`SIMULATION: ${N} respondents (uniform random choices)`)
console.log("=".repeat(60))

console.log("\n## Final MBTI distribution (16 types)")
const mbtiFreq = freq(sims.map((s) => s.mbti))
const mbtiSorted = Object.entries(mbtiFreq).sort((a, b) => b[1] - a[1])
for (const [t, c] of mbtiSorted) {
  console.log(`  ${t.padEnd(6)} ${String(c).padStart(4)}  ${pct(c, N)}`)
}
console.log(`  (uniform expected ~${(100 / 16).toFixed(1)}%)`)

console.log("\n## Phase1 branch (EI x JP, expect ~25% each)")
const p1f = freq(sims.map((s) => s.p1))
for (const [t, c] of Object.entries(p1f).sort()) {
  console.log(`  ${t}  ${String(c).padStart(4)}  ${pct(c, N)}`)
}

console.log("\n## Phase3 branch (NS x TF, expect ~25% each)")
const p3f = freq(sims.map((s) => s.p3))
for (const [t, c] of Object.entries(p3f).sort()) {
  console.log(`  ${t}  ${String(c).padStart(4)}  ${pct(c, N)}`)
}

console.log("\n## Per-axis stats (mean, std, zero-rate)")
const axisStats = allAxes
  .map((ax) => {
    const v = axisVecs[ax]
    return {
      ax,
      mean: mean(v),
      std: std(v),
      zeroRate: v.filter((x) => x === 0).length / v.length,
    }
  })
  .sort((a, b) => b.mean - a.mean)

for (const s of axisStats) {
  console.log(
    `  ${s.ax.padEnd(32)} mean=${s.mean.toFixed(2).padStart(6)}  std=${s.std.toFixed(2).padStart(5)}  zero=${(s.zeroRate * 100).toFixed(1)}%`
  )
}

console.log("\n## High inter-axis correlations |r| >= 0.5 (excluding MBTI pair opposites)")
const pairs: { a: string; b: string; r: number }[] = []
for (let i = 0; i < allAxes.length; i++) {
  for (let j = i + 1; j < allAxes.length; j++) {
    const r = corr(axisVecs[allAxes[i]], axisVecs[allAxes[j]])
    if (Math.abs(r) >= 0.5) pairs.push({ a: allAxes[i], b: allAxes[j], r })
  }
}
pairs.sort((x, y) => Math.abs(y.r) - Math.abs(x.r))
for (const p of pairs.slice(0, 40)) {
  console.log(`  ${p.r >= 0 ? "+" : "-"}${Math.abs(p.r).toFixed(2)}  ${p.a}  ↔  ${p.b}`)
}
if (pairs.length === 0) console.log("  (none)")
console.log(`  total pairs |r|>=0.5: ${pairs.length}`)

console.log("\n## MBTI dimension separation (E vs I, J vs P, T vs F, S vs N)")
const dims: [string, string][] = [
  ["attractE", "attractI"],
  ["attractJ", "attractP"],
  ["attractT", "attractF"],
  ["attractS", "attractN"],
]
for (const [a, b] of dims) {
  const diffs = sims.map((s) => (s.scores[a] ?? 0) - (s.scores[b] ?? 0))
  const ties = diffs.filter((d) => d === 0).length
  console.log(
    `  ${a}-${b}  mean_diff=${mean(diffs).toFixed(2)}  std=${std(diffs).toFixed(2)}  ties=${ties} (${pct(ties, N)})`
  )
}

console.log("\nDone.")
