import type { AnalysisScores } from "./types"
import { determineSelfMbti, getSelfMbtiInfo } from "./match"

export type PrecisionLevel = "high" | "medium" | "low"

export interface PairMatchResult {
  readonly matchPercent: number // 0-100
  readonly deviation: number // 偏差値 (50=平均)
  readonly precision: PrecisionLevel
  readonly precisionLabel: string
  readonly precisionDetail: string
  readonly verdict: string
  readonly verdictDetail: string
  readonly insights: readonly string[]
  readonly youInfo: {
    readonly selfMbti?: string
    readonly attractionMbti?: string
    readonly selfLabel?: string
  }
  readonly themInfo: {
    readonly selfMbti?: string
    readonly attractionMbti?: string
    readonly selfLabel?: string
  }
  readonly directionalScores: {
    readonly youToThem?: number // あなたが相手をどれだけ好きそうか
    readonly themToYou?: number // 相手があなたをどれだけ好きそうか
  }
}

function hasAttractionScores(s: AnalysisScores): boolean {
  return Object.keys(s).some((k) => k.startsWith("attract"))
}
function hasSelfScores(s: AnalysisScores): boolean {
  return Object.keys(s).some((k) => k.startsWith("self"))
}

function getMbti(scores: AnalysisScores, prefix: "self" | "attract"): string | undefined {
  const e = scores[`${prefix}E`] ?? 0
  const i = scores[`${prefix}I`] ?? 0
  const j = scores[`${prefix}J`] ?? 0
  const p = scores[`${prefix}P`] ?? 0
  const t = scores[`${prefix}T`] ?? 0
  const f = scores[`${prefix}F`] ?? 0
  const s = scores[`${prefix}S`] ?? 0
  const n = scores[`${prefix}N`] ?? 0
  if (e + i + j + p + t + f + s + n === 0) return undefined
  return (
    (e >= i ? "E" : "I") +
    (n >= s ? "N" : "S") +
    (f >= t ? "F" : "T") +
    (j >= p ? "J" : "P")
  )
}

// Aの「惹かれるタイプ」と Bの「自分」 がどれだけ合うか (0-100)
function scoreAttractionVsSelf(
  attractionScores: AnalysisScores,
  selfScores: AnalysisScores
): number {
  const dimensions: [string, string, string, string][] = [
    ["attractE", "attractI", "selfE", "selfI"],
    ["attractJ", "attractP", "selfJ", "selfP"],
    ["attractT", "attractF", "selfT", "selfF"],
    ["attractS", "attractN", "selfS", "selfN"],
  ]
  let alignment = 0
  let count = 0
  for (const [aA, aB, sA, sB] of dimensions) {
    const aDiff = (attractionScores[aA] ?? 0) - (attractionScores[aB] ?? 0)
    const sDiff = (selfScores[sA] ?? 0) - (selfScores[sB] ?? 0)
    if (Math.abs(aDiff) === 0 && Math.abs(sDiff) === 0) continue
    // -10〜10想定で正規化
    const aN = Math.max(-1, Math.min(1, aDiff / 10))
    const sN = Math.max(-1, Math.min(1, sDiff / 10))
    alignment += aN * sN
    count++
  }
  if (count === 0) return 50
  // -1〜1 → 0〜100
  return Math.round((alignment / count + 1) * 50)
}

// 自分の人格軸 vs 相手の人格軸の類似度 (0-100)
function scorePersonalityAlignment(
  yourScores: AnalysisScores,
  theirScores: AnalysisScores
): number {
  const axes = [
    "lowTempEmotion", "lateNightVibe", "urbanSense", "dailyLifeFeel",
    "awkwardness", "neglectTolerance", "loveExpression", "lineTemperature",
    "humanity", "silenceDependency", "innocenceTolerance", "conversationDensity",
    "distanceSense", "independence", "vibeMatch", "edginessTolerance",
    "caretakerDependency", "understandDesire", "saveDesire",
  ]
  let totalDiff = 0
  let count = 0
  for (const axis of axes) {
    const y = yourScores[axis] ?? 0
    const t = theirScores[axis] ?? 0
    if (y === 0 && t === 0) continue
    const diff = Math.abs(y - t)
    totalDiff += diff
    count++
  }
  if (count === 0) return 50
  const avgDiff = totalDiff / count
  // 平均差0 → 100、平均差10 → 0
  return Math.max(0, Math.min(100, Math.round(100 - avgDiff * 8)))
}

function getVerdict(percent: number): { verdict: string; detail: string } {
  if (percent >= 80) {
    return {
      verdict: "運命級",
      detail: "ここまで合うのは、なかなかない。お互いに惹かれ合う基盤が完璧に整ってる。",
    }
  }
  if (percent >= 70) {
    return {
      verdict: "相性最高",
      detail: "ほぼ理想のマッチ。お互いを自然に補完し合える関係。",
    }
  }
  if (percent >= 60) {
    return {
      verdict: "良い感じ",
      detail: "悪くない。お互いに惹かれる要素はあるし、関係を築く土台もある。",
    }
  }
  if (percent >= 50) {
    return {
      verdict: "ふつう",
      detail: "極端に良くも悪くもない。一緒にいる中で惹かれ合うかどうかは、お互い次第。",
    }
  }
  if (percent >= 40) {
    return {
      verdict: "微妙",
      detail: "好みも性格もちょっとズレてる。惹かれることはあっても、長く続けるには工夫が要る。",
    }
  }
  if (percent >= 30) {
    return {
      verdict: "難しめ",
      detail: "好みが合わない。それでもお互いを選ぶなら、相当な引力がある。",
    }
  }
  return {
    verdict: "別世界",
    detail: "好みも性格もほぼ真逆。お互いを理解しようとする努力が、関係の全て。",
  }
}

function detectInsights(
  yourScores: AnalysisScores,
  theirScores: AnalysisScores,
  youToThem: number | undefined,
  themToYou: number | undefined
): string[] {
  const insights: string[] = []

  // 双方向分析
  if (youToThem !== undefined && themToYou !== undefined) {
    if (Math.abs(youToThem - themToYou) > 25) {
      const stronger = youToThem > themToYou ? "あなた" : "相手"
      const weaker = youToThem > themToYou ? "相手" : "あなた"
      insights.push(
        `${stronger}の方が${weaker}に強く惹かれる関係。一方通行になりやすいから、温度差に気をつけて。`
      )
    } else if (youToThem > 70 && themToYou > 70) {
      insights.push("お互いを理想と感じる、双方向の引力。ここまで揃うのは奇跡に近い。")
    } else if (youToThem < 40 && themToYou > 65) {
      insights.push("相手はあなたを好きになりやすい。でもあなたは相手を選ばないかも。")
    } else if (themToYou < 40 && youToThem > 65) {
      insights.push("あなたが相手を好きになるパターン。相手はあなたをそこまで意識してないかも。")
    }
  }

  // 軸ごとの細かいズレ・一致
  const axisChecks: { axes: [string, string]; insight: string }[] = [
    {
      axes: ["lowTempEmotion", "loveExpression"],
      insight: "感情の温度差がある。冷たい方と熱い方で、ぶつかりやすい。",
    },
    {
      axes: ["independence", "caretakerDependency"],
      insight: "自立 vs 世話焼きのバランス。お互いに頼り方が違う。",
    },
    {
      axes: ["silenceDependency", "conversationDensity"],
      insight: "沈黙派 vs 会話派。一緒にいる時間の使い方が違う。",
    },
    {
      axes: ["lateNightVibe", "dailyLifeFeel"],
      insight: "夜型 vs 生活感。リズムが噛み合うかどうかで変わる。",
    },
  ]

  for (const check of axisChecks) {
    const yMax = Math.max(yourScores[check.axes[0]] ?? 0, yourScores[check.axes[1]] ?? 0)
    const tMax = Math.max(theirScores[check.axes[0]] ?? 0, theirScores[check.axes[1]] ?? 0)
    const yWhich = (yourScores[check.axes[0]] ?? 0) > (yourScores[check.axes[1]] ?? 0) ? 0 : 1
    const tWhich = (theirScores[check.axes[0]] ?? 0) > (theirScores[check.axes[1]] ?? 0) ? 0 : 1
    if (yMax >= 4 && tMax >= 4 && yWhich !== tWhich) {
      insights.push(check.insight)
    }
  }

  // 共通の強い軸
  const sharedStrong: string[] = []
  const sharedAxisLabels: Record<string, string> = {
    lateNightVibe: "深夜の引力",
    silenceDependency: "沈黙への安心",
    understandDesire: "理解したい欲",
    awkwardness: "不器用さの色気",
    humanity: "人間味",
    edginessTolerance: "危うさへの耐性",
  }
  for (const [axis, label] of Object.entries(sharedAxisLabels)) {
    if ((yourScores[axis] ?? 0) >= 4 && (theirScores[axis] ?? 0) >= 4) {
      sharedStrong.push(label)
    }
  }
  if (sharedStrong.length >= 2) {
    insights.push(
      `共通の強い磁場：「${sharedStrong.slice(0, 2).join("」「")}」。深く分かり合える土台がある。`
    )
  }

  // データなしのフォールバック
  if (insights.length === 0) {
    insights.push("二人の組み合わせは、強い偏りも目立つズレもないニュートラルな関係。")
  }

  return insights.slice(0, 5)
}

// メイン関数
export function calculatePairMatch(
  yourScores: AnalysisScores,
  theirScores: AnalysisScores
): PairMatchResult {
  const yHasAttract = hasAttractionScores(yourScores)
  const yHasSelf = hasSelfScores(yourScores)
  const tHasAttract = hasAttractionScores(theirScores)
  const tHasSelf = hasSelfScores(theirScores)

  // 精度判定
  let precision: PrecisionLevel = "low"
  let precisionLabel = "簡易判定"
  let precisionDetail = "片方のデータだけでの計算なので参考程度。"
  if (yHasAttract && yHasSelf && tHasAttract && tHasSelf) {
    precision = "high"
    precisionLabel = "高精度"
    precisionDetail = "両方が両診断を完了。最も信頼できるマッチング。"
  } else if ((yHasAttract && yHasSelf) || (tHasAttract && tHasSelf)) {
    precision = "medium"
    precisionLabel = "中精度"
    precisionDetail = "片方が両診断、片方が片方のみ。十分な分析が可能。"
  } else if ((yHasAttract && tHasSelf) || (yHasSelf && tHasAttract)) {
    precision = "medium"
    precisionLabel = "中精度"
    precisionDetail = "好みと相手の性質を交差比較。ある程度の精度。"
  } else {
    precision = "low"
    precisionLabel = "簡易判定"
    precisionDetail = "もう片方も診断を増やすと、精度が上がる。"
  }

  // 方向別スコア
  let youToThem: number | undefined = undefined
  let themToYou: number | undefined = undefined
  if (yHasAttract && tHasSelf) {
    youToThem = scoreAttractionVsSelf(yourScores, theirScores)
  }
  if (tHasAttract && yHasSelf) {
    themToYou = scoreAttractionVsSelf(theirScores, yourScores)
  }

  // 性格軸の類似度
  const personalityScore = scorePersonalityAlignment(yourScores, theirScores)

  // 統合マッチ%計算
  const components: number[] = []
  if (youToThem !== undefined) components.push(youToThem)
  if (themToYou !== undefined) components.push(themToYou)
  components.push(personalityScore * 0.5 + 25) // 性格軸は補助的に（25-75の範囲に絞る）

  const matchPercent = Math.round(
    components.reduce((sum, v) => sum + v, 0) / components.length
  )

  // 偏差値: matchPercent 50 → 50、80 → 70、20 → 30 みたいな
  const deviation = Math.max(20, Math.min(80, Math.round(50 + (matchPercent - 50) * 0.7)))

  // Verdict
  const { verdict, detail: verdictDetail } = getVerdict(matchPercent)

  // インサイト
  const insights = detectInsights(yourScores, theirScores, youToThem, themToYou)

  // MBTI情報
  const yourSelfMbti = getMbti(yourScores, "self")
  const yourAttractMbti = getMbti(yourScores, "attract")
  const theirSelfMbti = getMbti(theirScores, "self")
  const theirAttractMbti = getMbti(theirScores, "attract")

  return {
    matchPercent,
    deviation,
    precision,
    precisionLabel,
    precisionDetail,
    verdict,
    verdictDetail,
    insights,
    youInfo: {
      selfMbti: yourSelfMbti,
      attractionMbti: yourAttractMbti,
      selfLabel: yourSelfMbti ? getSelfMbtiInfo(yourSelfMbti).label : undefined,
    },
    themInfo: {
      selfMbti: theirSelfMbti,
      attractionMbti: theirAttractMbti,
      selfLabel: theirSelfMbti ? getSelfMbtiInfo(theirSelfMbti).label : undefined,
    },
    directionalScores: { youToThem, themToYou },
  }
}
