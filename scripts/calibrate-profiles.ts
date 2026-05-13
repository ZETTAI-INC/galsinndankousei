/**
 * 各 MBTI profile の "ランダム回答時の scoreMbti 分布" を計算して
 * calibration.ts に PROFILE_BASELINE として書き出す。
 *
 * 効果:
 *   profile.axes が高相関軸ばかりだと scoreMbti の std が大きくなり、
 *   勝率が高くなる（narrow profile 過剰勝利問題）。
 *   per-profile mean/std で z-score 化することで均す。
 */
import * as fs from "fs"
import * as path from "path"

import {
  phase1Questions,
  determinePhase1Type,
  determinePhase3Type,
} from "../src/lib/questions"
import { selectAdaptivePhase2, selectAdaptivePhase3 } from "../src/lib/adaptive"
import type { AnalysisScores, Question } from "../src/lib/types"
import { zScore } from "../src/lib/calibration"

// scoreMbti と同等のロジックを再現（per-profile 正規化を入れる前の生スコア）
const MBTI_DIMENSIONS: Record<string, readonly string[]> = {
  INFP: ["attractI", "attractN", "attractF", "attractP"],
  INTP: ["attractI", "attractN", "attractT", "attractP"],
  INFJ: ["attractI", "attractN", "attractF", "attractJ"],
  INTJ: ["attractI", "attractN", "attractT", "attractJ"],
  ISFP: ["attractI", "attractS", "attractF", "attractP"],
  ISTP: ["attractI", "attractS", "attractT", "attractP"],
  ISFJ: ["attractI", "attractS", "attractF", "attractJ"],
  ISTJ: ["attractI", "attractS", "attractT", "attractJ"],
  ENFP: ["attractE", "attractN", "attractF", "attractP"],
  ENTP: ["attractE", "attractN", "attractT", "attractP"],
  ENFJ: ["attractE", "attractN", "attractF", "attractJ"],
  ENTJ: ["attractE", "attractN", "attractT", "attractJ"],
  ESFP: ["attractE", "attractS", "attractF", "attractP"],
  ESTP: ["attractE", "attractS", "attractT", "attractP"],
  ESFJ: ["attractE", "attractS", "attractF", "attractJ"],
  ESTJ: ["attractE", "attractS", "attractT", "attractJ"],
}

// 各 MBTI の personality axes (generate-result.ts MBTI_PROFILES より転記)
const MBTI_AXES: Record<string, readonly string[]> = {
  INFP: ["lowTempEmotion", "silenceDependency", "understandDesire", "awkwardness"],
  INTP: ["distanceSense", "lowTempEmotion", "independence", "neglectTolerance"],
  INFJ: ["dailyLifeFeel", "humanity", "edginessTolerance", "saveDesire"],
  INTJ: ["innocenceTolerance", "vibeMatch", "loveExpression", "lineTemperature"],
  ISFP: ["lowTempEmotion", "independence", "urbanSense", "distanceSense"],
  ISTP: ["understandDesire", "silenceDependency", "saveDesire", "lowTempEmotion"],
  ISFJ: ["awkwardness", "lowTempEmotion", "independence", "dailyLifeFeel"],
  ISTJ: ["caretakerDependency", "loveExpression", "humanity", "conversationDensity"],
  ENFP: ["independence", "lowTempEmotion", "dailyLifeFeel", "silenceDependency"],
  ENTP: ["caretakerDependency", "humanity", "silenceDependency", "dailyLifeFeel"],
  ESTJ: ["independence", "caretakerDependency", "loveExpression", "conversationDensity"],
  ESFJ: ["caretakerDependency", "humanity", "loveExpression", "lineTemperature"],
  ESFP: ["edginessTolerance", "vibeMatch", "independence", "loveExpression"],
  ENFJ: ["innocenceTolerance", "vibeMatch", "humanity", "loveExpression"],
  ESTP: ["distanceSense", "vibeMatch", "conversationDensity", "edginessTolerance"],
  ENTJ: ["independence", "loveExpression", "urbanSense", "conversationDensity"],
}

function rawScoreMbti(type: string, scores: AnalysisScores): number {
  const axes = MBTI_AXES[type] ?? []
  const axisScore = axes.reduce((sum, axis, i) => {
    const weight = axes.length - i
    return sum + zScore(axis, scores[axis] ?? 0) * weight
  }, 0)
  const dims = MBTI_DIMENSIONS[type] ?? []
  const dimScore = dims.reduce((sum, dim) => sum + zScore(dim, scores[dim] ?? 0) * 3, 0)
  return axisScore + dimScore
}

// シミュレーション
const N = 10000
const SEED = 8888

function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0x100000000
  }
}

const rng = makeRng(SEED)

function applyChoice(scores: Record<string, number>, q: Question, idx: number) {
  const choice = q.choices[idx]
  for (const [k, v] of Object.entries(choice.scores)) {
    scores[k] = (scores[k] ?? 0) + (v ?? 0)
  }
}

function simulateOne(): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const q of phase1Questions) applyChoice(scores, q, Math.floor(rng() * q.choices.length))
  const p1 = determinePhase1Type(scores as AnalysisScores)
  const phase2Qs = selectAdaptivePhase2(p1, scores as AnalysisScores)
  for (const q of phase2Qs) applyChoice(scores, q, Math.floor(rng() * q.choices.length))
  const p3 = determinePhase3Type(scores as AnalysisScores)
  const phase3Qs = selectAdaptivePhase3(p3, scores as AnalysisScores)
  for (const q of phase3Qs) applyChoice(scores, q, Math.floor(rng() * q.choices.length))
  return scores
}

const all: Record<string, number>[] = []
for (let i = 0; i < N; i++) all.push(simulateOne())

const types = Object.keys(MBTI_AXES)
const profileScores: Record<string, number[]> = {}
for (const t of types) profileScores[t] = []

for (const s of all) {
  for (const t of types) profileScores[t].push(rawScoreMbti(t, s as AnalysisScores))
}

function mean(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}
function std(xs: number[]) {
  const m = mean(xs)
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)))
}

const stats: Record<string, { mean: number; std: number }> = {}
for (const t of types) {
  stats[t] = {
    mean: Math.round(mean(profileScores[t]) * 100) / 100,
    std: Math.round(std(profileScores[t]) * 100) / 100,
  }
}

console.log("Per-profile baseline (raw scoreMbti on 10000 random respondents):")
for (const t of types) {
  console.log(`  ${t.padEnd(6)} mean=${stats[t].mean.toFixed(2).padStart(7)}  std=${stats[t].std.toFixed(2).padStart(5)}`)
}

// calibration.ts に追記
const calibPath = path.join(__dirname, "..", "src", "lib", "calibration.ts")
let calib = fs.readFileSync(calibPath, "utf-8")

const block = [
  "",
  "// 各 MBTI profile の \"ランダム回答時の scoreMbti 分布\" の mean / std。",
  "// 高相関軸で構成された profile は std が大きくなり、勝率が偏る。",
  "// scoreMbti の最後で (raw - mean) / std を取って per-profile に正規化する。",
  "export const PROFILE_BASELINE_MEAN: Readonly<Record<string, number>> = {",
  ...types.map((t) => `  ${t}: ${stats[t].mean.toFixed(2)},`),
  "}",
  "",
  "export const PROFILE_BASELINE_STD: Readonly<Record<string, number>> = {",
  ...types.map((t) => `  ${t}: ${Math.max(stats[t].std, 0.01).toFixed(2)},`),
  "}",
  "",
  "export function profileZScore(type: string, raw: number): number {",
  "  const m = PROFILE_BASELINE_MEAN[type] ?? 0",
  "  const s = PROFILE_BASELINE_STD[type] ?? 1",
  "  return (raw - m) / s",
  "}",
  "",
].join("\n")

if (calib.includes("PROFILE_BASELINE_MEAN")) {
  calib = calib.replace(
    /\n\/\/ 各 MBTI profile[\s\S]*?(?=\n\/\/[^\n]*\n|$)/,
    block
  )
} else {
  calib = calib.trimEnd() + "\n" + block
}
fs.writeFileSync(calibPath, calib)
console.log(`\nWrote PROFILE_BASELINE to ${calibPath}`)
