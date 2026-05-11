import type { AnalysisScores } from "./types"
import { getSelfMbtiInfo } from "./match"

// 気になる人のMBTIを判定
export function determineOtherMbti(scores: AnalysisScores): string {
  const e = scores["otherE"] ?? 0
  const i = scores["otherI"] ?? 0
  const j = scores["otherJ"] ?? 0
  const p = scores["otherP"] ?? 0
  const t = scores["otherT"] ?? 0
  const f = scores["otherF"] ?? 0
  const s = scores["otherS"] ?? 0
  const n = scores["otherN"] ?? 0

  return (
    (e >= i ? "E" : "I") +
    (n >= s ? "N" : "S") +
    (f >= t ? "F" : "T") +
    (j >= p ? "J" : "P")
  )
}

export interface OtherMatchResult {
  readonly otherMbti: string
  readonly otherLabel: string
  readonly otherTagline: string
  readonly matchPercent: number
  readonly matchVerdict: string // 一言判定
  readonly description: string // 詳細
  readonly insights: readonly string[] // この人の特徴
  readonly relationship: string // この関係性の予測
  readonly axisCompare: readonly {
    readonly label: string
    readonly attraction: number // あなたの理想（attractE - attractI を正規化）
    readonly other: number // 相手の実態
  }[]
}

// MBTI4文字一致数
function countMatchingLetters(a: string, b: string): number {
  let count = 0
  for (let i = 0; i < 4; i++) if (a[i] === b[i]) count++
  return count
}

// 「あなたが惹かれるタイプ」と「実際の相手」のMBTI比較
function calculateAttractionMatch(scores: AnalysisScores): {
  attractionMbti: string
  otherMbti: string
  matchCount: number
} {
  const otherMbti = determineOtherMbti(scores)

  const e = scores["attractE"] ?? 0
  const i = scores["attractI"] ?? 0
  const n = scores["attractN"] ?? 0
  const s = scores["attractS"] ?? 0
  const f = scores["attractF"] ?? 0
  const t = scores["attractT"] ?? 0
  const j = scores["attractJ"] ?? 0
  const p = scores["attractP"] ?? 0

  const attractionMbti =
    (e >= i ? "E" : "I") +
    (n >= s ? "N" : "S") +
    (f >= t ? "F" : "T") +
    (j >= p ? "J" : "P")

  return {
    attractionMbti,
    otherMbti,
    matchCount: countMatchingLetters(attractionMbti, otherMbti),
  }
}

const VERDICTS: Record<number, { verdict: string; description: string; relationship: string }> = {
  4: {
    verdict: "完全に好み。",
    description: "この人、あなたが惹かれるタイプとほぼ完全に一致してる。今ハマってないなら、たぶんもうすぐ。すでにハマってるなら、抜け出すのは難しい。",
    relationship: "好きになる前提で動いていい関係。ただ、好きすぎて主導権を取られないように注意。あなたが見えすぎてる分、距離をコントロールする力が問われる。",
  },
  3: {
    verdict: "ほぼ好み。",
    description: "あなたが惹かれるタイプの主要な要素を持ってる。完璧じゃないけど、惹かれる十分な理由がある。一緒にいる時間が増えれば、確実に深まる。",
    relationship: "向こうから動いてくれる可能性も十分。ただ、足りない要素があるから、そこを相手に求めすぎないこと。理想を押し付けると壊れる。",
  },
  2: {
    verdict: "半分好み、半分違う。",
    description: "あなたの理想と被る部分があるけど、半分は違うタイプ。気になる理由はちゃんとある、でも『運命の人』ってほどじゃないかも。",
    relationship: "友達としては最高、恋愛になると物足りなさが残る可能性。距離感を間違えると、惜しい関係で終わる。",
  },
  1: {
    verdict: "ほぼ違うのに、なぜか気になる。",
    description: "あなたの理想とは違うタイプ。でも気になってるってことは、その違いに何か意味がある。表面的な好みじゃない、深いところで反応してる。",
    relationship: "理性で否定したくなる関係。でもそれが続くなら、それはあなたの中の新しい扉。今までと違う恋愛に踏み込むサイン。",
  },
  0: {
    verdict: "完全に好みじゃない。",
    description: "あなたが惹かれるタイプとは真逆。それでも気になってるなら、それは『今までの自分のパターンを壊したい』という無意識の欲求。",
    relationship: "うまくいくかは、あなたが今までの恋愛パターンをどれだけ手放せるかにかかってる。ハードモードだけど、その分得るものは大きい。",
  },
}

const OTHER_INSIGHT_PATTERNS: { condition: (s: AnalysisScores) => boolean; text: string }[] = [
  { condition: (s) => (s.otherI ?? 0) >= 5, text: "この人は、自分の世界を持ってる。簡単に踏み込ませない。" },
  { condition: (s) => (s.otherE ?? 0) >= 5, text: "この人は、人と話すことでエネルギーを得るタイプ。一人だと枯れる。" },
  { condition: (s) => (s.otherJ ?? 0) >= 5, text: "この人は、計画と秩序を愛してる。予定が狂うと一瞬イラつく。" },
  { condition: (s) => (s.otherP ?? 0) >= 5, text: "この人は、自由を奪われると逃げる。縛らないことが鍵。" },
  { condition: (s) => (s.otherT ?? 0) >= 5, text: "この人は、感情より論理で動く。慰めより解決策を求めてる。" },
  { condition: (s) => (s.otherF ?? 0) >= 5, text: "この人は、感情を大事にする。正論よりまず共感を求めてる。" },
  { condition: (s) => (s.otherS ?? 0) >= 5, text: "この人は、現実的で地に足ついてる。空想より具体を好む。" },
  { condition: (s) => (s.otherN ?? 0) >= 5, text: "この人は、抽象や可能性を見る。今より未来を語りたがる。" },
  { condition: (s) => (s.otherI ?? 0) >= 4 && (s.otherT ?? 0) >= 4, text: "知的で内向的。理解されたいと思いながら、簡単には心を開かない。" },
  { condition: (s) => (s.otherI ?? 0) >= 4 && (s.otherF ?? 0) >= 4, text: "感受性が高くて、内に秘めるタイプ。気づかれない優しさを持ってる。" },
  { condition: (s) => (s.otherE ?? 0) >= 4 && (s.otherF ?? 0) >= 4, text: "明るくて世話焼き。みんなに好かれるけど、自分の本音は見せない。" },
  { condition: (s) => (s.otherE ?? 0) >= 4 && (s.otherT ?? 0) >= 4, text: "リーダー気質。決断力があって、人を引っ張る。でも繊細な部分もある。" },
  { condition: (s) => (s.otherJ ?? 0) >= 4 && (s.otherT ?? 0) >= 4, text: "効率と結果を求めるタイプ。無駄を嫌う。だからこそ、選んだ相手は大事にする。" },
  { condition: (s) => (s.otherP ?? 0) >= 4 && (s.otherN ?? 0) >= 4, text: "発想が自由で、予測がつかない。退屈は最大の敵。" },
]

export function generateOtherMatch(scores: AnalysisScores): OtherMatchResult {
  const { attractionMbti, otherMbti, matchCount } = calculateAttractionMatch(scores)
  const otherInfo = getSelfMbtiInfo(otherMbti) // 同じMBTIラベル使い回し
  const verdict = VERDICTS[matchCount] ?? VERDICTS[2]

  // %計算: 軸ごとの一致度も加味
  const dimensions = [
    ["attractE", "attractI", "otherE", "otherI"],
    ["attractJ", "attractP", "otherJ", "otherP"],
    ["attractT", "attractF", "otherT", "otherF"],
    ["attractS", "attractN", "otherS", "otherN"],
  ] as const
  let alignment = 0
  for (const [aA, aB, oA, oB] of dimensions) {
    const aDir = ((scores[aA] ?? 0) - (scores[aB] ?? 0)) / 10
    const oDir = ((scores[oA] ?? 0) - (scores[oB] ?? 0)) / 10
    alignment += aDir * oDir
  }
  alignment = alignment / 4 // -1 to 1
  const baseByCount = [25, 40, 58, 76, 92][matchCount]
  const matchPercent = Math.max(8, Math.min(98, Math.round(baseByCount + alignment * 8)))

  // インサイト
  const matchedInsights = OTHER_INSIGHT_PATTERNS.filter((p) => p.condition(scores))
  const insights = [...matchedInsights]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((p) => p.text)

  // 軸比較（MBTI順: E/I → S/N → T/F → J/P）
  const orderedDims = [
    ["attractE", "attractI", "otherE", "otherI", "E 外向 — 内向 I"],
    ["attractS", "attractN", "otherS", "otherN", "S 現実 — 直感 N"],
    ["attractT", "attractF", "otherT", "otherF", "T 論理 — 共感 F"],
    ["attractJ", "attractP", "otherJ", "otherP", "J 計画 — 即興 P"],
  ] as const
  const axisCompare = orderedDims.map(([aA, aB, oA, oB, label]) => {
    const aScore = (scores[aA] ?? 0) - (scores[aB] ?? 0)
    const oScore = (scores[oA] ?? 0) - (scores[oB] ?? 0)
    return {
      label,
      attraction: Math.round(((aScore + 10) / 20) * 100),
      other: Math.round(((oScore + 10) / 20) * 100),
    }
  })

  return {
    otherMbti,
    otherLabel: otherInfo.label,
    otherTagline: otherInfo.tagline,
    matchPercent,
    matchVerdict: verdict.verdict,
    description: verdict.description,
    insights,
    relationship: verdict.relationship,
    axisCompare,
  }
}
