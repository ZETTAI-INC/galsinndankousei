import type { AnalysisScores, MatchResult } from "./types"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MBTI判定
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function determineSelfMbti(scores: AnalysisScores): string {
  const e = scores["selfE"] ?? 0
  const i = scores["selfI"] ?? 0
  const j = scores["selfJ"] ?? 0
  const p = scores["selfP"] ?? 0
  const t = scores["selfT"] ?? 0
  const f = scores["selfF"] ?? 0
  const s = scores["selfS"] ?? 0
  const n = scores["selfN"] ?? 0

  return (
    (e >= i ? "E" : "I") +
    (n >= s ? "N" : "S") +
    (f >= t ? "F" : "T") +
    (j >= p ? "J" : "P")
  )
}

const SELF_MBTI_LABELS: Record<string, { readonly label: string; readonly tagline: string }> = {
  INFP: { label: "感情を内側に秘める人", tagline: "言葉にならない気持ちを抱えてる。" },
  INTP: { label: "思考の迷宮に住む人", tagline: "頭の中の対話が一番濃い。" },
  INFJ: { label: "見透かす静寂の人", tagline: "言わずに分かってしまう。" },
  INTJ: { label: "揺るがない設計者", tagline: "全部、頭の中で組み立ててから動く。" },
  ISFP: { label: "静かな美意識の人", tagline: "感じ取ってから動くタイプ。" },
  ISTP: { label: "観察と行動の人", tagline: "言葉より、まず手が動く。" },
  ISFJ: { label: "静かに気を配る人", tagline: "気づくのが速くて、言わない。" },
  ISTJ: { label: "揺るぎない誠実な人", tagline: "決めたことは曲げない。" },
  ENFP: { label: "感情の嵐を生きる人", tagline: "テンションで世界を変えてる。" },
  ENTP: { label: "発想で遊ぶ人", tagline: "ひらめきで会話を回してる。" },
  ENFJ: { label: "人を動かす温かい人", tagline: "誰かの幸せが自分の燃料。" },
  ENTJ: { label: "覇道を進む人", tagline: "迷いより、決断が早い。" },
  ESFP: { label: "瞬間を生きる人", tagline: "今この瞬間が全部。" },
  ESTP: { label: "本能で動く人", tagline: "考える前に体が動いてる。" },
  ESFJ: { label: "みんなの太陽", tagline: "気を配って、空気を作る。" },
  ESTJ: { label: "頼れる仕切り屋", tagline: "決めて、動かして、整える。" },
}

export function getSelfMbtiInfo(mbti: string) {
  return SELF_MBTI_LABELS[mbti] ?? SELF_MBTI_LABELS.INFP
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 軸ベース：細かい人格分析
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PERSONALITY_AXES = [
  "lowTempEmotion", "lateNightVibe", "urbanSense", "dailyLifeFeel",
  "awkwardness", "neglectTolerance", "loveExpression", "lineTemperature",
  "humanity", "emotionalInstabilityTolerance", "silenceDependency",
  "innocenceTolerance", "conversationDensity", "distanceSense",
  "independence", "vibeMatch", "edginessTolerance", "caretakerDependency",
  "understandDesire", "saveDesire",
] as const

function high(scores: AnalysisScores, axis: string, threshold = 4): boolean {
  return (scores[axis] ?? 0) >= threshold
}

function highSelf(scores: AnalysisScores, mbtiLetter: "E" | "I" | "J" | "P" | "T" | "F" | "S" | "N"): boolean {
  const a = scores[`self${mbtiLetter}`] ?? 0
  const opposite: Record<string, string> = {
    E: "selfI", I: "selfE", J: "selfP", P: "selfJ",
    T: "selfF", F: "selfT", S: "selfN", N: "selfS",
  }
  const b = scores[opposite[mbtiLetter]] ?? 0
  return a >= b && a > 0
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 罠パターン：自分 × 惹かれるタイプ の危ない組み合わせ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface TrapPattern {
  readonly condition: (s: AnalysisScores) => boolean
  readonly text: string
}

const TRAP_PATTERNS: readonly TrapPattern[] = [
  {
    condition: (s) => highSelf(s, "F") && high(s, "lowTempEmotion"),
    text: "感情豊かなあなたが、冷たい人ばかり選んでる。一方的に与え続ける関係になりがちで、最後には『私ばっかり』で疲れる。",
  },
  {
    condition: (s) => highSelf(s, "I") && high(s, "lateNightVibe") && high(s, "emotionalInstabilityTolerance"),
    text: "静かな自分のはずが、夜になると不安定になる人に惹かれてる。深夜の連絡で振り回されて、自分の生活ペースを崩されるパターン。",
  },
  {
    condition: (s) => highSelf(s, "J") && high(s, "edginessTolerance"),
    text: "計画的なあなたが、生活の崩れた人を選んでる。最初は『立て直してあげたい』、最後は『なんで私が』。何度も繰り返してない？",
  },
  {
    condition: (s) => highSelf(s, "T") && high(s, "saveDesire"),
    text: "論理派のあなたが、救いたい欲を刺激する人を選んでる。冷静に判断してるつもりが、相手の脆さに引きずられて感情で動いてる。",
  },
  {
    condition: (s) => high(s, "independence") && highSelf(s, "F") && high(s, "loveExpression"),
    text: "自立した強い相手を求めながら、自分の感情はちゃんと受け止めてほしい。でも自立した人ほど距離を保つから、結局あなたが寂しくなる。",
  },
  {
    condition: (s) => high(s, "neglectTolerance") && highSelf(s, "F"),
    text: "放置されても平気なふり、できてない。本当は構ってほしいのに、構ってと言えない人に惹かれてる。永遠に満たされない仕組み。",
  },
  {
    condition: (s) => high(s, "silenceDependency") && highSelf(s, "F") && highSelf(s, "E"),
    text: "おしゃべりな自分のはずが、沈黙が好きな人に惹かれてる。話したいのに話せない、合わせてしまう癖がない？",
  },
  {
    condition: (s) => high(s, "edginessTolerance") && highSelf(s, "J") && highSelf(s, "S"),
    text: "現実的で計画的なあなたが、危うい人にときめく。スリルが欲しいわけじゃなくて、『安定を提供する側』に回りたい欲求の表れ。",
  },
  {
    condition: (s) => high(s, "lowTempEmotion") && high(s, "understandDesire"),
    text: "感情を出さない人を選んで『自分だけが理解できる』と思いたい。でもそれは恋愛じゃなく、解読ゲーム。終わりがない。",
  },
  {
    condition: (s) => high(s, "caretakerDependency") && highSelf(s, "I"),
    text: "世話焼きな人が好き、と言いつつ、自分は静かにいたい。最初は嬉しい世話焼きが、やがて干渉に感じる典型パターン。",
  },
  {
    condition: (s) => high(s, "lateNightVibe") && highSelf(s, "S") && highSelf(s, "J"),
    text: "規則正しい自分のはずが、夜型・気まぐれな人に惹かれる。生活リズムが合わなくて、最後は会えなくなる。",
  },
  {
    condition: (s) => high(s, "innocenceTolerance") && highSelf(s, "T"),
    text: "理屈で動く自分が、無邪気でテンション高い人に弱い。最初は癒されるけど、深い話ができなくて物足りなくなる。",
  },
]

function detectTraps(scores: AnalysisScores): readonly string[] {
  const matched = TRAP_PATTERNS.filter((p) => p.condition(scores))
  return matched.slice(0, 3).map((p) => p.text)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 細かい洞察：軸ごとのギャップから読み取る
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface InsightPattern {
  readonly condition: (s: AnalysisScores) => boolean
  readonly text: string
}

const INSIGHT_PATTERNS: readonly InsightPattern[] = [
  {
    condition: (s) => highSelf(s, "I") && high(s, "attractE", 6),
    text: "静かな自分が、社交的な人に惹かれる。相手の人脈や明るさを通じて、自分が一歩外に出られる感覚を求めてる。",
  },
  {
    condition: (s) => highSelf(s, "E") && high(s, "attractI", 6),
    text: "外向的な自分が、内向的な人を選ぶ。賑やかな自分を静かに受け止めてくれる存在を求めてる。",
  },
  {
    condition: (s) => highSelf(s, "P") && high(s, "attractJ", 6),
    text: "気まぐれな自分が、計画的な人に惹かれる。自分の生活を整えてくれる安定感を、無意識に求めてる。",
  },
  {
    condition: (s) => highSelf(s, "J") && high(s, "attractP", 6),
    text: "きっちりした自分が、自由な人に惹かれる。規則正しい日常の中で、ちょっとした逸脱を相手に求めてる。",
  },
  {
    condition: (s) => highSelf(s, "T") && high(s, "attractF", 6),
    text: "論理的な自分が、感情豊かな人を選ぶ。普段抑えてる感情の領域を、相手を通して感じたい。",
  },
  {
    condition: (s) => highSelf(s, "F") && high(s, "attractT", 6),
    text: "感情で動く自分が、冷静な人に惹かれる。揺れる自分の軸を、相手の論理で支えてもらいたい欲求。",
  },
  {
    condition: (s) => highSelf(s, "S") && high(s, "attractN", 6),
    text: "現実的な自分が、夢を語る人に惹かれる。地に足ついた日常から、相手の理想で連れ出してほしい。",
  },
  {
    condition: (s) => highSelf(s, "N") && high(s, "attractS", 6),
    text: "理想を追う自分が、地に足ついた人を選ぶ。ふわふわした自分を、現実に着地させてくれる人を求めてる。",
  },
  {
    condition: (s) => high(s, "understandDesire", 5) && high(s, "lowTempEmotion", 5),
    text: "「この人のことを理解できるのは自分だけ」という感覚が、あなたの恋愛の中心にある。一度それを味わうと、他の関係が物足りなくなる。",
  },
  {
    condition: (s) => high(s, "saveDesire", 5),
    text: "壊れた何かを直したい欲求が強い。健全な相手より、少し問題を抱えた人に惹かれやすい。これは克服課題でもある。",
  },
  {
    condition: (s) => high(s, "loveExpression", 6) && high(s, "neglectTolerance", 5),
    text: "愛情表現してくれる人が好き、なのに放置されても平気。矛盾してるけど、結局『自分から欲しがらなくても与えてくれる人』を求めてる。",
  },
  {
    condition: (s) => high(s, "silenceDependency", 5) && high(s, "conversationDensity", 5),
    text: "沈黙も会話も両方欲しいタイプ。普段は黙ってていいけど、二人になったら深く話せる人を求めてる。要求が高い。",
  },
  {
    condition: (s) => high(s, "lateNightVibe", 6) && high(s, "dailyLifeFeel", 5),
    text: "深夜と生活感、両方に弱い。夜中に本音を見せる相手で、かつ生活がしっかりしてる人。これは見つけるのが難しい組み合わせ。",
  },
  {
    condition: (s) => high(s, "distanceSense", 6) && high(s, "loveExpression", 5),
    text: "適度な距離を保ちたいくせに、ちゃんと愛されたい。ベタベタはいや、でも放っておかれるのもいや。中間が一番難しい。",
  },
  {
    condition: (s) => high(s, "edginessTolerance", 5) && high(s, "humanity", 5),
    text: "ちょっと危うい人と、優しい人。両方に惹かれる傾向。あなたが本当に好きなのは『危うさを内に秘めた優しい人』。条件厳しい。",
  },
  {
    condition: (s) => highSelf(s, "I") && high(s, "loveExpression", 6),
    text: "自分は感情を表に出さないのに、相手にはストレートな感情表現を求める。アンバランスだけど、あなたの安心の構造はそうなってる。",
  },
]

function detectInsights(scores: AnalysisScores): readonly string[] {
  const matched = INSIGHT_PATTERNS.filter((p) => p.condition(scores))
  // ランダム要素入れて毎回違う組み合わせにする
  const shuffled = [...matched].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 4).map((p) => p.text)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 理想の相手タイプ：自己MBTIから補完型を提案
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface IdealMatch {
  readonly mbti: string
  readonly label: string
  readonly reason: string
}

const IDEAL_TYPE_MAP: Record<string, IdealMatch> = {
  INFP: { mbti: "ENFJ", label: "あなたを理解して支えてくれる人", reason: "感情の海を泳ぐあなたを、優しく岸まで導いてくれる包容力のあるタイプ。" },
  INTP: { mbti: "ENTJ", label: "あなたの思考を行動に変えてくれる人", reason: "頭の中で完結しがちなあなたを、現実に引き出してくれる決断力のあるタイプ。" },
  INFJ: { mbti: "ENFP", label: "あなたの世界に色を足してくれる人", reason: "深く沈みがちなあなたに、明るさと無邪気さを運んでくれるタイプ。" },
  INTJ: { mbti: "ENFP", label: "あなたの設計を生かしてくれる人", reason: "完璧主義なあなたに、遊びと感情の余白を与えてくれるタイプ。" },
  ISFP: { mbti: "ENFJ", label: "あなたの感性を言葉にしてくれる人", reason: "言葉が足りないあなたを、ちゃんと言語化して支えてくれるタイプ。" },
  ISTP: { mbti: "ESFJ", label: "あなたの孤独を埋めてくれる人", reason: "一人で完結しがちなあなたに、温かい日常をくれるタイプ。" },
  ISFJ: { mbti: "ESTP", label: "あなたを外に連れ出してくれる人", reason: "気を遣いすぎるあなたを、強引に楽しませてくれるタイプ。" },
  ISTJ: { mbti: "ESFP", label: "あなたの規律を緩めてくれる人", reason: "真面目すぎるあなたに、笑いと遊びをくれるタイプ。" },
  ENFP: { mbti: "INFJ", label: "あなたの感情を深く受け止めてくれる人", reason: "テンションで生きるあなたを、静かに理解してくれる深みのあるタイプ。" },
  ENTP: { mbti: "INFJ", label: "あなたの発想を形にしてくれる人", reason: "アイデアを散らかすあなたを、深い洞察で整理してくれるタイプ。" },
  ENFJ: { mbti: "INFP", label: "あなただけが理解できる人", reason: "誰かを支えたいあなたに、本当に支えが必要な繊細な相手。" },
  ENTJ: { mbti: "INTP", label: "あなたの思考の相棒になる人", reason: "決断するあなたに、別角度の視点を与えてくれる頭脳派。" },
  ESFP: { mbti: "ISFJ", label: "あなたを優しく支えてくれる人", reason: "今を生きるあなたを、静かに見守ってくれる温かいタイプ。" },
  ESTP: { mbti: "ISFJ", label: "あなたの帰る場所になる人", reason: "刺激を求め続けるあなたに、安心して帰れる温度をくれるタイプ。" },
  ESFJ: { mbti: "ISFP", label: "あなたの世話焼きを受け止める人", reason: "誰かを支えたい欲が強いあなたに、素直に頼れる繊細な相手。" },
  ESTJ: { mbti: "ISFP", label: "あなたを柔らかくしてくれる人", reason: "厳しくなりがちなあなたに、感性と余白を教えてくれるタイプ。" },
}

function getIdealType(selfMbti: string): IdealMatch {
  return IDEAL_TYPE_MAP[selfMbti] ?? IDEAL_TYPE_MAP.INFP
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// マッチパターン：自己 × 惹かれるタイプ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface MatchPattern {
  readonly type: string
  readonly label: string
  readonly basePercent: number
  readonly description: (self: string, attraction: string) => string
  readonly advice: (self: string, attraction: string) => string
}

const MATCH_PATTERNS: readonly MatchPattern[] = [
  {
    type: "鏡写し型",
    label: "自分と似たタイプを愛する",
    basePercent: 82,
    description: (s, a) =>
      `あなた（${s}）が惹かれるのは、ほぼ自分と同じタイプ（${a}）。同じ温度、同じリズムで生きられる相手を選んでる。安心感は最高、でも刺激は最低。お互いの弱点まで似てるから、ぶつかった時に逃げ場がない。`,
    advice: () =>
      "似た者同士の心地よさは、同時に閉塞感の入口でもある。自分と違う部分を持つ人を、月1回くらい意識的に観察してみて。世界が広がる。",
  },
  {
    type: "正反対補完型",
    label: "ないものを求めて惹かれる",
    basePercent: 68,
    description: (s, a) =>
      `あなた（${s}）と惹かれるタイプ（${a}）は、ほぼ真逆。これは自分にないものを補完したい本能。理想化しやすいけど、実際に付き合うと違いが面倒に変わる瞬間がある。`,
    advice: () =>
      "違いに惹かれるのは健全な欲求。ただ『違うから魅力的』と『違うから無理』は紙一重。最初の3ヶ月で違いに疲れてないかチェックを。",
  },
  {
    type: "ねじれ型",
    label: "本来合わない人を選び続けてる",
    basePercent: 35,
    description: (s, a) =>
      `あなた（${s}）の本質と、惹かれるタイプ（${a}）は、噛み合わない部分が多い。それでも惹かれるのは、過去の関係や満たされなかった何かを、無意識に再現しようとしてるから。`,
    advice: () =>
      "「好き」と「合う」は別。今までの恋愛、似たような終わり方をしてないか思い出してみて。次は惹かれる前に『合うか』を考える余地を持つと変わる。",
  },
  {
    type: "半分似てる型",
    label: "近くて遠い相手を求める",
    basePercent: 58,
    description: (s, a) =>
      `あなた（${s}）と惹かれるタイプ（${a}）は、半分似て半分違う。共通点で安心して、違いで飽きない。理論上はバランスがいい組み合わせ。ただ違いの部分でぶつかりやすい。`,
    advice: () =>
      "共通点を喜ぶより、違う部分をどう扱うかが鍵。違いを問題視せず『この人はこういう人』と切り離せると、関係が驚くほど安定する。",
  },
  {
    type: "破滅型",
    label: "合わないと知って惹かれる",
    basePercent: 22,
    description: (s, a) =>
      `あなた（${s}）と惹かれるタイプ（${a}）は、ほぼ全てが違う。これは恋愛における『危ういスリル』を求めてる証拠。難しさそのものが刺激になってるタイプ。`,
    advice: () =>
      "燃え上がるけど続かない、を繰り返してきたなら、それは選び方の問題。穏やかな人と一度向き合ってみると、新しい自分が見えるかも。",
  },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// マッチ％：MBTI一致 + 軸の整合度を組み合わせ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function countMatchingLetters(mbtiA: string, mbtiB: string): number {
  let count = 0
  for (let i = 0; i < 4; i++) {
    if (mbtiA[i] === mbtiB[i]) count++
  }
  return count
}

function calculateAxisAlignment(scores: AnalysisScores): number {
  // self軸とattraction軸の相関度
  // 相手にもとめてる軸 = 自分の軸 → 高アラインメント
  const pairs = [
    ["selfE", "selfI", "attractE", "attractI"],
    ["selfJ", "selfP", "attractJ", "attractP"],
    ["selfT", "selfF", "attractT", "attractF"],
    ["selfS", "selfN", "attractS", "attractN"],
  ] as const

  let alignSum = 0
  for (const [sA, sB, aA, aB] of pairs) {
    const sNorm = ((scores[sA] ?? 0) - (scores[sB] ?? 0)) / 10
    const aNorm = ((scores[aA] ?? 0) - (scores[aB] ?? 0)) / 10
    // 同じ符号 = アラインメント高
    alignSum += sNorm * aNorm
  }
  return alignSum / 4 // -1 to 1
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// メイン関数
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function calculateMatch(
  scores: AnalysisScores,
  attractionMbti: string
): MatchResult {
  const selfMbti = determineSelfMbti(scores)
  const matchCount = countMatchingLetters(selfMbti, attractionMbti)
  const alignment = calculateAxisAlignment(scores)

  // パターン選択
  let pattern: MatchPattern
  if (matchCount === 4) {
    pattern = MATCH_PATTERNS[0]
  } else if (matchCount === 3) {
    pattern = MATCH_PATTERNS[3]
  } else if (matchCount === 2) {
    pattern = alignment > 0.2 ? MATCH_PATTERNS[3] : MATCH_PATTERNS[1]
  } else if (matchCount === 1) {
    pattern = alignment < -0.2 ? MATCH_PATTERNS[2] : MATCH_PATTERNS[1]
  } else {
    pattern = alignment < -0.3 ? MATCH_PATTERNS[4] : MATCH_PATTERNS[1]
  }

  // %計算: ベース + アラインメント補正 + 軸一致ボーナス
  const alignBoost = Math.round(alignment * 12)
  const matchPercent = Math.max(
    15,
    Math.min(96, pattern.basePercent + alignBoost)
  )

  // 軸比較（MBTI順: E/I → S/N → T/F → J/P）
  const dimensions = [
    ["selfE", "selfI", "attractE", "attractI", "E 外向 — 内向 I"],
    ["selfS", "selfN", "attractS", "attractN", "S 現実 — 直感 N"],
    ["selfT", "selfF", "attractT", "attractF", "T 論理 — 共感 F"],
    ["selfJ", "selfP", "attractJ", "attractP", "J 計画 — 即興 P"],
  ] as const
  // ラベル左側の文字が低%、右側の文字が高% になるよう逆算
  const axisCompare = dimensions.map(([sA, sB, aA, aB, label]) => {
    const sScore = (scores[sB] ?? 0) - (scores[sA] ?? 0)
    const aScore = (scores[aB] ?? 0) - (scores[aA] ?? 0)
    return {
      label,
      self: Math.round(((sScore + 10) / 20) * 100),
      attraction: Math.round(((aScore + 10) / 20) * 100),
    }
  })

  // 詳細分析
  const insights = detectInsights(scores)
  const traps = detectTraps(scores)
  const idealType = getIdealType(selfMbti)

  return {
    matchPercent,
    matchType: pattern.type,
    matchLabel: pattern.label,
    description: pattern.description(selfMbti, attractionMbti),
    insights,
    traps,
    idealType,
    advice: pattern.advice(selfMbti, attractionMbti),
    selfMbti,
    attractionMbti,
    axisCompare,
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 自己診断結果
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function generateSelfResult(scores: AnalysisScores) {
  const selfMbti = determineSelfMbti(scores)
  const info = getSelfMbtiInfo(selfMbti)

  const dimensions = [
    ["selfE", "selfI", "外向"],
    ["selfJ", "selfP", "計画"],
    ["selfT", "selfF", "論理"],
    ["selfS", "selfN", "現実"],
    ["selfN", "selfS", "直感"],
    ["selfF", "selfT", "共感"],
  ] as const

  const axisChart = dimensions.map(([a, b, label]) => {
    const score = (scores[a] ?? 0) - (scores[b] ?? 0)
    return {
      label,
      value: Math.max(0, Math.min(100, Math.round(((score + 10) / 20) * 100))),
    }
  })

  return {
    selfMbti,
    selfLabel: info.label,
    selfTagline: info.tagline,
    axisChart,
  }
}
