import type { AnalysisScores } from "./types"

export interface Contradiction {
  readonly label: string // e.g., "冷たさと熱量の引き裂かれ"
  readonly leftAxis: { readonly key: string; readonly label: string; readonly score: number }
  readonly rightAxis: { readonly key: string; readonly label: string; readonly score: number }
  readonly intensity: number // 0-10
  readonly text: string // 詳細な分析テキスト
  readonly summary: string // 1行要約
}

interface OpposingPair {
  readonly axes: readonly [string, string]
  readonly labels: readonly [string, string]
  readonly contradictionLabel: string
  readonly summary: string // 一行で
  readonly textBuilder: (intensity: number, l: number, r: number) => string
}

const OPPOSING_PAIRS: readonly OpposingPair[] = [
  {
    axes: ["lowTempEmotion", "loveExpression"],
    labels: ["冷たい人好き", "熱い愛情欲しい"],
    contradictionLabel: "冷たさと熱量の引き裂かれ",
    summary: "感情を見せない人が好きなのに、自分にはちゃんと愛されたい。",
    textBuilder: (i, l, r) =>
      `あなたは感情を出さない人を選びがちなのに、その人から${i > 6 ? "強く" : ""}愛情を求めてしまう。これは99回の無表情の中で1回見せてくれる温度を、永遠に待てるタイプの恋愛。${i > 7 ? "気づいてるはずなのに、毎回繰り返してる。" : ""}`,
  },
  {
    axes: ["silenceDependency", "conversationDensity"],
    labels: ["沈黙を求める", "深い会話したい"],
    contradictionLabel: "黙ってたいのに、話したい",
    summary: "静けさが心地いいのに、深い対話も欲しい。",
    textBuilder: (i) =>
      `静かな空間を愛してるくせに、深い対話への飢えもある。${i > 6 ? "つまりあなたが本当に弱いのは「普段口数少ないのに、二人になると饒舌になる人」。" : "矛盾してるけど、それがあなたの好み。"}`,
  },
  {
    axes: ["independence", "caretakerDependency"],
    labels: ["自立してる人好き", "世話焼かれたい"],
    contradictionLabel: "自立 vs 甘えたい",
    summary: "一人で完結してる人が好き、なのに自分には世話を焼いてほしい。",
    textBuilder: (i) =>
      `自立した人がタイプ、と言いながら、結局自分のことだけは構ってくれる人を選ぶ。${i > 6 ? "「他の人には冷たいけど自分には特別」という選ばれた感覚に弱いタイプ。" : ""}`,
  },
  {
    axes: ["distanceSense", "loveExpression"],
    labels: ["適度な距離", "愛情ちゃんと欲しい"],
    contradictionLabel: "距離は欲しい、でも愛されたい",
    summary: "ベタベタしてほしくない、でも愛情は確認したい。",
    textBuilder: (i) =>
      `踏み込まれたくないけど、放っておかれるのは無理。${i > 7 ? "あなたの理想は「手を伸ばせば届くけど、伸ばしてこない距離」。" : "微妙な距離感の調整があなたの恋愛のテーマ。"}`,
  },
  {
    axes: ["lateNightVibe", "dailyLifeFeel"],
    labels: ["深夜の人", "生活感ある人"],
    contradictionLabel: "夜型 × 生活感",
    summary: "深夜に本性を見せる人が好き、でも生活がちゃんとしてる人も好き。",
    textBuilder: () =>
      `深夜2時の本音と、朝のコーヒーが似合う生活感、両方欲しい。これを両立させる相手はかなり少ない。あなたの理想は意外と厳しい。`,
  },
  {
    axes: ["edginessTolerance", "dailyLifeFeel"],
    labels: ["危うい人", "ちゃんとした生活"],
    contradictionLabel: "壊れてる人を救いたい",
    summary: "崩れてる人に惹かれるのに、安定した生活も求める。",
    textBuilder: (i) =>
      `生活が少し崩れてる人に惹かれるくせに、ちゃんとしてほしいと思ってる。${i > 6 ? "「立て直してあげたい」という欲求が、恋愛の入口になってる。母性が強いタイプ。" : ""}`,
  },
  {
    axes: ["neglectTolerance", "lineTemperature"],
    labels: ["放置でも平気", "連絡ほしい"],
    contradictionLabel: "放置 vs 連絡",
    summary: "既読無視されても平気なふり、でも本当は連絡が欲しい。",
    textBuilder: (i) =>
      `放置されても平気を装ってるけど、本当は連絡が来ると安心する。${i > 6 ? "「期待しないことで自分を守ってる」だけ。3日後の長文LINEに全部崩されるタイプ。" : ""}`,
  },
  {
    axes: ["urbanSense", "humanity"],
    labels: ["都会的", "人間味"],
    contradictionLabel: "洗練 vs ぬくもり",
    summary: "クールで洗練された人が好き、でも温かみも欲しい。",
    textBuilder: () =>
      `センスが良くてクールな人がタイプなのに、本当に好きになるのは温かい部分を持ってる人。「冷たそうに見えて実は優しい」が刺さる。`,
  },
  {
    axes: ["awkwardness", "loveExpression"],
    labels: ["不器用な人", "ちゃんと伝えて"],
    contradictionLabel: "不器用 vs 言葉",
    summary: "不器用な人が好きなのに、気持ちはちゃんと言葉にしてほしい。",
    textBuilder: () =>
      `不器用な人にときめくのに、結局は「ちゃんと好きって言ってくれる」を求める。あなたの理想は「対面では口下手、LINEでは素直」というタイプ。なかなか難しい組み合わせ。`,
  },
  {
    axes: ["lowTempEmotion", "innocenceTolerance"],
    labels: ["クール", "無邪気"],
    contradictionLabel: "クール vs 無邪気",
    summary: "感情を見せない人が好きなのに、無邪気さにも弱い。",
    textBuilder: (i) =>
      `クールな人がタイプ、と言いつつ無邪気な笑顔にやられる。${i > 6 ? "あなたが本当に好きなのは「普段は低温なのに、自分の前でだけ子供みたいになる人」。ギャップ最強。" : ""}`,
  },
  {
    axes: ["saveDesire", "independence"],
    labels: ["救いたい", "自立した人"],
    contradictionLabel: "救いたい欲 vs 自立した人",
    summary: "強い人が好き、でも弱い部分も見たい。",
    textBuilder: () =>
      `自立した強い人を選ぶくせに、その人の脆さを見つけた瞬間に距離が縮まる。「強い人の弱さを知ってるのは自分だけ」という感覚に酔うタイプ。`,
  },
  {
    axes: ["distanceSense", "understandDesire"],
    labels: ["距離保ちたい", "全部知りたい"],
    contradictionLabel: "距離 vs 理解欲",
    summary: "距離を保ちたいのに、相手のことは全部知りたい。",
    textBuilder: () =>
      `踏み込みたくないのに、相手のことは全部理解したい。これは「安全な距離から覗き込む」恋愛。近づくのは怖いけど、わからないのはもっと怖い。`,
  },
  {
    axes: ["vibeMatch", "lowTempEmotion"],
    labels: ["ノリいい人", "クール"],
    contradictionLabel: "明るさ vs 静けさ",
    summary: "明るくて楽しい人が好き、でもうるさいのは無理。",
    textBuilder: () =>
      `テンション高くて楽しい人がタイプ、と言いつつ、騒がしすぎる人は疲れる。あなたが本当に弱いのは「明るいけど、芯はクール」というタイプ。`,
  },
]

const AXIS_LABEL_MAP: Record<string, string> = {
  lowTempEmotion: "低温感情",
  loveExpression: "愛情表現",
  silenceDependency: "静けさ依存",
  conversationDensity: "会話密度",
  independence: "自立性",
  caretakerDependency: "世話焼き依存",
  distanceSense: "距離感",
  lateNightVibe: "深夜感",
  dailyLifeFeel: "生活感",
  edginessTolerance: "危うさ耐性",
  neglectTolerance: "放置耐性",
  lineTemperature: "LINE温度",
  urbanSense: "都市感",
  humanity: "人間味",
  awkwardness: "不器用さ",
  innocenceTolerance: "無邪気耐性",
  saveDesire: "救いたい欲",
  understandDesire: "理解したい欲",
  vibeMatch: "ノリ感",
}

export function detectContradictions(
  scores: AnalysisScores
): readonly Contradiction[] {
  const found: Contradiction[] = []

  for (const pair of OPPOSING_PAIRS) {
    const [aKey, bKey] = pair.axes
    const aScore = scores[aKey] ?? 0
    const bScore = scores[bKey] ?? 0

    // 両方が一定以上 = 矛盾あり
    const minScore = Math.min(aScore, bScore)
    if (minScore < 3) continue

    // 矛盾の強度（両方が高いほど強い）
    const intensity = Math.min(10, minScore)

    found.push({
      label: pair.contradictionLabel,
      leftAxis: {
        key: aKey,
        label: pair.labels[0],
        score: Math.round(aScore * 10) / 10,
      },
      rightAxis: {
        key: bKey,
        label: pair.labels[1],
        score: Math.round(bScore * 10) / 10,
      },
      intensity,
      summary: pair.summary,
      text: pair.textBuilder(intensity, aScore, bScore),
    })
  }

  // 強度順にソート、トップ3を返す
  return found.sort((a, b) => b.intensity - a.intensity).slice(0, 3)
}

export { AXIS_LABEL_MAP }
