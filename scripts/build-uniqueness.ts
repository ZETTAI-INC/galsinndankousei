/**
 * 各軸の「ユニーク度」を算出して calibration.ts に追記。
 *
 * 高相関軸ペア（例: lowTempEmotion ↔ distanceSense）は同じ選択肢で同時加点される回数が多い。
 * その結果、scoreMbti で同じ信号が複数軸として二重三重にカウントされ、
 * 特定 MBTI（軸4本がすべて lowTempEmotion 系の INFP/ISFP 等）に偏る。
 *
 * uniqueness = 1 / (1 + 平均共起率) でスケーリング → scoreMbti の重みに掛ける。
 */
import * as fs from "fs"
import * as path from "path"

import {
  phase1Questions,
  phase2Questions,
  phase3Questions,
} from "../src/lib/questions"
import { allExtraQuestions } from "../src/lib/questions-extra"
import type { Question } from "../src/lib/types"

const allQuestions: Question[] = [
  ...phase1Questions,
  ...phase2Questions.EJ,
  ...phase2Questions.EP,
  ...phase2Questions.IJ,
  ...phase2Questions.IP,
  ...phase3Questions.NF,
  ...phase3Questions.NT,
  ...phase3Questions.SF,
  ...phase3Questions.ST,
  ...allExtraQuestions,
]

// MBTI 次元軸（attract系）はユニーク度補正の対象外
function isMbtiDim(ax: string): boolean {
  return ax.startsWith("attract")
}

const choiceCount = allQuestions.reduce((s, q) => s + q.choices.length, 0)
const axisCount: Record<string, number> = {}
const coCount: Record<string, Record<string, number>> = {}

for (const q of allQuestions) {
  for (const c of q.choices) {
    const axes = Object.keys(c.scores).filter((k) => !isMbtiDim(k))
    for (const a of axes) {
      axisCount[a] = (axisCount[a] ?? 0) + 1
      if (!coCount[a]) coCount[a] = {}
      for (const b of axes) {
        if (a === b) continue
        coCount[a][b] = (coCount[a][b] ?? 0) + 1
      }
    }
  }
}

// uniqueness: その軸が出現したとき、他軸と重複していない割合
//   uniqueness = (1 - 平均同時出現度合) を 0.4..1.0 にスケーリング
const uniqueness: Record<string, number> = {}
const personalityAxes = Object.keys(axisCount).sort()

for (const ax of personalityAxes) {
  const partners = coCount[ax] ?? {}
  // 同時加点された他軸の数 / その軸が出現した選択肢数
  const totalCoOccurrences = Object.values(partners).reduce((a, b) => a + b, 0)
  const myCount = axisCount[ax]
  const avgPartnersPerAppearance = totalCoOccurrences / Math.max(myCount, 1)
  // 平均5本くらいと一緒に書かれている → 1/5=0.2 がベース
  // 0.4..1.0 にクリップ。減衰しすぎると軸が死ぬので下限を設ける
  const u = 1 / (1 + avgPartnersPerAppearance / 5)
  uniqueness[ax] = Math.max(0.4, Math.min(1.0, u))
}

console.log(`Total choices: ${choiceCount}`)
console.log(`Personality axes: ${personalityAxes.length}`)
console.log("\nAxis uniqueness (lower = more redundant):")
const sorted = Object.entries(uniqueness).sort((a, b) => a[1] - b[1])
for (const [k, v] of sorted) {
  console.log(`  ${k.padEnd(35)} ${v.toFixed(3)}  (n=${axisCount[k]})`)
}

// 既存 calibration.ts に AXIS_UNIQUENESS を追記
const calibPath = path.join(__dirname, "..", "src", "lib", "calibration.ts")
let calib = fs.readFileSync(calibPath, "utf-8")

const block = [
  "",
  "// 各 personality 軸の \"ユニーク度\" 係数。",
  "// 他軸と同時加点される頻度が高い（= 信号が重複してる）軸ほど低い値。",
  "// scoreMbti / 各種マッチングで重みに掛けて、二重カウントを抑制する。",
  "export const AXIS_UNIQUENESS: Readonly<Record<string, number>> = {",
  ...personalityAxes.map((ax) => `  ${ax}: ${uniqueness[ax].toFixed(3)},`),
  "}",
  "",
  "// 軸の \"独立な信号としての重み\"。MBTI 次元軸（attract系）は 1.0、",
  "// personality 軸は AXIS_UNIQUENESS をそのまま使う。",
  "export function axisUniqueness(axis: string): number {",
  "  if (axis.startsWith(\"attract\")) return 1.0",
  "  return AXIS_UNIQUENESS[axis] ?? 1.0",
  "}",
  "",
].join("\n")

// 既存ブロックがあれば置き換え、無ければ末尾に追加
if (calib.includes("AXIS_UNIQUENESS")) {
  calib = calib.replace(
    /\n\/\/ 各 personality 軸[\s\S]*?(?=\n\/\/[^\n]*\n|$)/,
    block
  )
} else {
  calib = calib.trimEnd() + "\n" + block
}
fs.writeFileSync(calibPath, calib)
console.log(`\nWrote AXIS_UNIQUENESS to ${calibPath}`)
