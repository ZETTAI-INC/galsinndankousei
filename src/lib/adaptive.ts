import type { AnalysisScores, Phase1Type, Phase3Type, Question } from "./types"
import { phase2Questions, phase3Questions } from "./questions"
import { allExtraQuestions } from "./questions-extra"

type MbtiAxisPair = "EI" | "JP" | "TF" | "SN"

// 質問が主にどのMBTI軸を測定してるか自動判定
function inferMbtiAxes(question: Question): MbtiAxisPair[] {
  const axisStrength: Record<MbtiAxisPair, number> = { EI: 0, JP: 0, TF: 0, SN: 0 }
  for (const choice of question.choices) {
    axisStrength.EI +=
      (choice.scores.attractE ?? 0) + (choice.scores.attractI ?? 0)
    axisStrength.JP +=
      (choice.scores.attractJ ?? 0) + (choice.scores.attractP ?? 0)
    axisStrength.TF +=
      (choice.scores.attractT ?? 0) + (choice.scores.attractF ?? 0)
    axisStrength.SN +=
      (choice.scores.attractS ?? 0) + (choice.scores.attractN ?? 0)
  }
  return (Object.keys(axisStrength) as MbtiAxisPair[]).filter(
    (ax) => axisStrength[ax] >= 2
  )
}

// 質問が測定する性格軸の数（情報量）
function getPersonalityAxisCount(question: Question): number {
  const axes = new Set<string>()
  for (const choice of question.choices) {
    for (const k of Object.keys(choice.scores)) {
      if (!k.startsWith("attract") && !k.startsWith("self")) {
        axes.add(k)
      }
    }
  }
  return axes.size
}

// 各MBTI軸の不確実度（0-10、高いほど判別ついてない）
export function calculateMbtiUncertainty(
  scores: AnalysisScores
): Record<MbtiAxisPair, number> {
  const diff = (a: string, b: string) =>
    Math.abs((scores[a] ?? 0) - (scores[b] ?? 0))
  return {
    EI: Math.max(0, 8 - diff("attractE", "attractI")),
    JP: Math.max(0, 8 - diff("attractJ", "attractP")),
    TF: Math.max(0, 8 - diff("attractT", "attractF")),
    SN: Math.max(0, 8 - diff("attractS", "attractN")),
  }
}

// 性格軸の測定不足度（0スコアの軸が多い = まだ測定不足）
function getPersonalityCoverageGap(scores: AnalysisScores): number {
  const personalityAxes = [
    "lowTempEmotion", "lateNightVibe", "urbanSense", "dailyLifeFeel",
    "awkwardness", "loveExpression", "humanity", "silenceDependency",
    "innocenceTolerance", "conversationDensity", "distanceSense",
    "independence", "vibeMatch", "caretakerDependency",
    "understandDesire", "saveDesire",
  ]
  const uncovered = personalityAxes.filter((ax) => (scores[ax] ?? 0) === 0).length
  return uncovered / personalityAxes.length
}

// Phase 2: 適応的に8問選ぶ
export function selectAdaptivePhase2(
  phase1Type: Phase1Type,
  scores: AnalysisScores
): readonly Question[] {
  const uncertainty = calculateMbtiUncertainty(scores)
  const preferredSet = new Set(phase2Questions[phase1Type])

  // 全32問プール + 軸補完用追加6問 = 38問から選択
  const allPhase2: Question[] = [
    ...phase2Questions.EJ,
    ...phase2Questions.EP,
    ...phase2Questions.IJ,
    ...phase2Questions.IP,
    ...allExtraQuestions, // 250-255: neglectTolerance / emotional / saveDesire 補強
  ]

  const scored = allPhase2.map((q) => {
    const axes = inferMbtiAxes(q)
    // 不確実な軸を測る質問ほど高スコア
    const uncertaintyScore = axes.reduce(
      (sum, ax) => sum + (uncertainty[ax] ?? 0),
      0
    )
    // Phase1タイプにマッチするセットの質問は加点（テーマ統一）
    const setBonus = preferredSet.has(q) ? 5 : 0
    return {
      question: q,
      score: uncertaintyScore + setBonus,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 8).map((s) => s.question)
}

// Phase 3: 適応的に8問選ぶ
export function selectAdaptivePhase3(
  phase3Type: Phase3Type,
  scores: AnalysisScores
): readonly Question[] {
  const preferredSet = new Set(phase3Questions[phase3Type])

  // 全32問プールから選択
  const allPhase3: Question[] = [
    ...phase3Questions.NF,
    ...phase3Questions.NT,
    ...phase3Questions.SF,
    ...phase3Questions.ST,
  ]

  const scored = allPhase3.map((q) => {
    // 各選択肢が触れる性格軸のうち、まだ未測定のものを優先
    let unmeasuredScore = 0
    for (const choice of q.choices) {
      for (const k of Object.keys(choice.scores)) {
        if (!k.startsWith("attract") && !k.startsWith("self")) {
          if ((scores[k] ?? 0) < 2) {
            unmeasuredScore += 1
          }
        }
      }
    }
    const axisCount = getPersonalityAxisCount(q)
    const setBonus = preferredSet.has(q) ? 8 : 0
    return {
      question: q,
      score: unmeasuredScore + axisCount + setBonus,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 8).map((s) => s.question)
}
