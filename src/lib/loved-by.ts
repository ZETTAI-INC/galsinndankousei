import type { AnalysisScores, AttractedType, LovedByResult } from "./types"
import { createSeededRandom, hashScores } from "./seed"

function high(scores: AnalysisScores, axis: string, threshold = 4): boolean {
  return (scores[axis] ?? 0) >= threshold
}

function low(scores: AnalysisScores, axis: string, threshold = 2): boolean {
  return (scores[axis] ?? 0) <= threshold
}

function highSelf(
  scores: AnalysisScores,
  letter: "E" | "I" | "J" | "P" | "T" | "F" | "S" | "N"
): boolean {
  const a = scores[`self${letter}`] ?? 0
  const opposite: Record<string, string> = {
    E: "selfI", I: "selfE", J: "selfP", P: "selfJ",
    T: "selfF", F: "selfT", S: "selfN", N: "selfS",
  }
  const b = scores[opposite[letter]] ?? 0
  return a >= b && a > 0
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// あなたを好きになるタイプ：パターン定義
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface AttractorPattern {
  readonly condition: (s: AnalysisScores) => boolean
  readonly priority: number
  readonly type: AttractedType
}

const ATTRACTOR_PATTERNS: readonly AttractorPattern[] = [
  {
    condition: (s) => highSelf(s, "I") && high(s, "lowTempEmotion", 4),
    priority: 8,
    type: {
      title: "深く語れる相手を探してる人",
      mbtiHint: "INFJ系・INFP系",
      description: "あなたの静けさの奥にある『何か』を読み取れる人。あなたが見せない部分にこそ価値を見出す、観察力の高いタイプ。表面的な会話より、深夜の本音を求めてる。",
    },
  },
  {
    condition: (s) => highSelf(s, "F") && high(s, "humanity", 4),
    priority: 7,
    type: {
      title: "あなたの優しさに救われたい人",
      mbtiHint: "ISFP系・INFP系",
      description: "他人に優しい姿、店員に丁寧に話す姿、誰も見てないとこでの気遣い。あなたが当たり前にやってる優しさに、心の底から癒される人。",
    },
  },
  {
    condition: (s) => highSelf(s, "T") && highSelf(s, "I"),
    priority: 7,
    type: {
      title: "知性の壁を破りたい人",
      mbtiHint: "ENFP系・ENTP系",
      description: "クールで近寄りがたいあなたを『面白そう』と感じる人。あなたの理屈っぽさを否定せず、楽しんで会話を仕掛けてくる、エネルギーがある相手。",
    },
  },
  {
    condition: (s) => highSelf(s, "E") && highSelf(s, "F"),
    priority: 6,
    type: {
      title: "あなたの太陽に当たりたい人",
      mbtiHint: "INFJ系・ISFJ系",
      description: "あなたの明るさに、自分も照らされたい人。普段は静かなのに、あなたの前では笑える。あなたが救ってる自覚なく救ってる相手。",
    },
  },
  {
    condition: (s) => highSelf(s, "J") && highSelf(s, "T"),
    priority: 6,
    type: {
      title: "あなたの安定に頼りたい人",
      mbtiHint: "ISFP系・INFP系",
      description: "感情で揺れがちなタイプが、あなたの揺るがなさを安全地帯に感じる。『この人といれば大丈夫』と思わせるあなたの空気。",
    },
  },
  {
    condition: (s) => highSelf(s, "N") && high(s, "lateNightVibe", 3),
    priority: 6,
    type: {
      title: "あなたの世界観に飲まれたい人",
      mbtiHint: "INTP系・ENTP系",
      description: "あなたの独特な視点、夜に出るちょっとした言葉。それだけで『この人といたい』と思う、感性ベースの相手。",
    },
  },
  {
    condition: (s) => highSelf(s, "P") && high(s, "innocenceTolerance", 3),
    priority: 5,
    type: {
      title: "あなたに振り回されたい人",
      mbtiHint: "INTJ系・ISTJ系",
      description: "計画的すぎる自分の世界に、あなたの自由さを取り入れたい人。コントロールできない相手に魅力を感じる、堅実派。",
    },
  },
  {
    condition: (s) => high(s, "saveDesire", 3) || high(s, "emotionalInstabilityTolerance", 3),
    priority: 5,
    type: {
      title: "あなたの脆さに惹かれる人",
      mbtiHint: "ENFJ系・ISFJ系",
      description: "強そうに見えるあなたの、ふとした影。それを見つけた瞬間に『私が支えたい』となる、世話焼きタイプ。",
    },
  },
  {
    condition: (s) => high(s, "edginessTolerance", 4) || high(s, "lateNightVibe", 5),
    priority: 5,
    type: {
      title: "あなたの危うさに惹かれる人",
      mbtiHint: "INFP系・ISFP系",
      description: "整ってない、少し崩れてる、その美しさを見抜く人。安定だけじゃ満足できない、深みを求める感性派。",
    },
  },
  {
    condition: (s) => highSelf(s, "S") && highSelf(s, "J"),
    priority: 4,
    type: {
      title: "あなたの誠実さを見抜ける人",
      mbtiHint: "ISFJ系・ISTJ系",
      description: "派手じゃないけど、約束を守る、小さな気遣いを忘れない。そういうあなたを『本物』と判断できる、目の肥えた相手。",
    },
  },
  {
    condition: (s) => high(s, "loveExpression", 4) && highSelf(s, "F"),
    priority: 6,
    type: {
      title: "あなたの愛情の温度に救われる人",
      mbtiHint: "ISFP系・INFJ系",
      description: "感情を出すのが下手な相手にとって、あなたの率直な愛情表現は救い。普段冷たい人ほど、あなたの温度に弱い。",
    },
  },
  {
    condition: (s) => high(s, "understandDesire", 4),
    priority: 5,
    type: {
      title: "あなたに理解されたい人",
      mbtiHint: "INFJ系・INTJ系",
      description: "誰にも本当のところを見せない人ほど、あなたの『見抜く目』に弱い。秘めたものを当てられたとき、もう逃げられない。",
    },
  },
  // ─── 新規追加パターン ───
  {
    condition: (s) => highSelf(s, "J") && high(s, "humanity", 3),
    priority: 7,
    type: {
      title: "あなたの一貫性に救われる人",
      mbtiHint: "ISFJ系・INFJ系",
      description: "言うこととやることがブレないあなたは、揺れる世界に疲れた人の止まり木。派手な約束より、当たり前の継続を尊いと感じるタイプが寄ってくる。",
    },
  },
  {
    condition: (s) => highSelf(s, "P") && high(s, "independence", 4),
    priority: 6,
    type: {
      title: "あなたの自由さに憧れる人",
      mbtiHint: "ISTJ系・ESTJ系",
      description: "自分の枠を持て余してる人ほど、あなたの『縛られなさ』に惚れる。同じ自由は手に入らないと知ってるからこそ、隣にいたい。",
    },
  },
  {
    condition: (s) => high(s, "lateNightVibe", 4) && high(s, "silenceDependency", 3),
    priority: 7,
    type: {
      title: "あなたの夜の顔を独り占めしたい人",
      mbtiHint: "INFP系・INTP系",
      description: "昼のあなたしか知らない人たちを内心で見下しながら、夜のあなただけが本物だと信じる人。秘密の共有が愛になるタイプ。",
    },
  },
  {
    condition: (s) => high(s, "awkwardness", 4) && highSelf(s, "I"),
    priority: 6,
    type: {
      title: "あなたの口下手さに惚れる人",
      mbtiHint: "ENFP系・ENFJ系",
      description: "うまく喋れずに詰まる瞬間、目線が泳ぐ間、その不器用さが愛しくて仕方ない人。流暢さより誠実さに価値を置く、相手を読みたがるタイプ。",
    },
  },
  {
    condition: (s) => high(s, "awkwardness", 3) && high(s, "humanity", 4),
    priority: 6,
    type: {
      title: "あなたの不器用な誠実さに惹かれる人",
      mbtiHint: "ISFJ系・ISTJ系",
      description: "気の利いたことが言えないのに、ちゃんと考えてる。その時間差に本気を感じる人。器用な人間に飽きた、本物を見極めたい相手。",
    },
  },
  {
    condition: (s) => highSelf(s, "T") && high(s, "humanity", 3),
    priority: 5,
    type: {
      title: "あなたの突き放した優しさが刺さる人",
      mbtiHint: "INTJ系・INFJ系",
      description: "甘やかさないのに見捨てない。距離があるのに見守ってる。その『冷たさの中の温度』に救われる、依存を嫌うタイプ。",
    },
  },
  {
    condition: (s) => high(s, "distanceSense", 4) && highSelf(s, "I"),
    priority: 5,
    type: {
      title: "あなたの距離感に呼吸を取り戻す人",
      mbtiHint: "INTJ系・INTP系",
      description: "近すぎる人間関係に窒息してきた人。あなたの『詰めすぎない』が、息継ぎになる。逆にあなたの方へ歩き出す。",
    },
  },
  {
    condition: (s) => high(s, "lineTemperature", 4) && highSelf(s, "F"),
    priority: 5,
    type: {
      title: "あなたの文字の温度を握り締めたい人",
      mbtiHint: "INFP系・ISFP系",
      description: "夜に届くあなたの一文を、何度も読み返してしまう人。声より文字の方があなたの本質が出ると気づいた、文字派の相手。",
    },
  },
  {
    condition: (s) => high(s, "dailyLifeFeel", 4) && high(s, "humanity", 3),
    priority: 5,
    type: {
      title: "あなたの生活に混ざりたい人",
      mbtiHint: "ISFJ系・ISFP系",
      description: "ドラマチックな恋より、平日の夜にコンビニ行く関係を求めてる人。あなたの匂いのする日常を、自分のものにしたいタイプ。",
    },
  },
  {
    condition: (s) => high(s, "urbanSense", 4) && highSelf(s, "N"),
    priority: 4,
    type: {
      title: "あなたのセンスに並びたい人",
      mbtiHint: "ENTP系・INTP系",
      description: "選ぶ音楽、置く本、座る席。あなたの選択基準に同化したい人。所有じゃなく『感性の隣接』を求めるタイプ。",
    },
  },
  {
    condition: (s) => high(s, "neglectTolerance", 4) && highSelf(s, "I"),
    priority: 5,
    type: {
      title: "あなたの放っといてくれる感じに惚れる人",
      mbtiHint: "INTP系・INTJ系",
      description: "詮索しない、急かさない、勝手に決めない。あなたの『放置力』が、自由を奪われ慣れた相手には恋に見える。",
    },
  },
  {
    condition: (s) => high(s, "vibeMatch", 4) && highSelf(s, "E"),
    priority: 4,
    type: {
      title: "あなたのノリの中で素になりたい人",
      mbtiHint: "ESFP系・ENFP系",
      description: "テンションの上げ下げが自然なあなたの隣で、自分を取り繕う必要がなくなる人。気が楽になりすぎて、もう離れられない。",
    },
  },
  {
    condition: (s) => high(s, "conversationDensity", 4) && highSelf(s, "N"),
    priority: 5,
    type: {
      title: "あなたとの会話の密度に中毒する人",
      mbtiHint: "INFJ系・ENTP系",
      description: "雑談で終わらない、毎回どこかに着地する。あなたとの会話を経験すると、他の会話が水っぽく感じる。戻れない相手。",
    },
  },
  {
    condition: (s) => high(s, "caretakerDependency", 4) && highSelf(s, "F"),
    priority: 4,
    type: {
      title: "あなたの世話に甘えたい人",
      mbtiHint: "ISFP系・ESFP系",
      description: "気づいたら世話されてる、押し付けがましくないのに行き届いてる。気を抜くと骨抜きにされてる、依存型のタイプ。",
    },
  },
  {
    condition: (s) => high(s, "emotionalInstabilityTolerance", 4) && highSelf(s, "F"),
    priority: 4,
    type: {
      title: "あなたの揺らがなさに泣きたい人",
      mbtiHint: "INFP系・ENFP系",
      description: "自分の感情の波を受け止めても引かないあなた。重さで人を逃がしてきた相手ほど、あなたの『動じなさ』に泣く。",
    },
  },
  {
    condition: (s) => high(s, "innocenceTolerance", 4) && highSelf(s, "T"),
    priority: 4,
    type: {
      title: "あなたの大人さに守られたい人",
      mbtiHint: "ENFP系・ESFP系",
      description: "無邪気さを否定せず、ちゃんと大人として振る舞ってくれるあなた。子どもっぽい部分を出せる相手として唯一無二になる。",
    },
  },
]

function selectAttractedTypes(scores: AnalysisScores): readonly AttractedType[] {
  const matched = ATTRACTOR_PATTERNS
    .filter((p) => p.condition(scores))
    .sort((a, b) => b.priority - a.priority)

  if (matched.length >= 3) {
    return matched.slice(0, 3).map((m) => m.type)
  }

  // フォールバック
  const fallback: AttractedType[] = [
    {
      title: "あなたの空気に溶ける人",
      mbtiHint: "INFP系",
      description: "派手じゃないけど、隣にいると落ち着く。そう感じてくれる人が、あなたを好きになりやすい。",
    },
    {
      title: "あなたを理解したい人",
      mbtiHint: "INFJ系",
      description: "あなたの中にある、誰にも言ってない部分を読み取りたい人。",
    },
    {
      title: "あなたの隣で笑いたい人",
      mbtiHint: "ENFP系",
      description: "あなたといると、自分が自然になれる。そんな感覚を覚える人。",
    },
  ]

  return [...matched.map((m) => m.type), ...fallback].slice(0, 3)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 無意識のサイン：あなたが出してる「魅力」
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SignalPattern {
  readonly condition: (s: AnalysisScores) => boolean
  readonly text: string
}

const SIGNAL_PATTERNS: readonly SignalPattern[] = [
  // 内向系のサイン
  { condition: (s) => highSelf(s, "I"), text: "話しかけられた時、ほんの一瞬間が空く" },
  { condition: (s) => highSelf(s, "I"), text: "目が合うとスッと先にそらしてしまう" },
  { condition: (s) => highSelf(s, "I"), text: "自分の話より相手の話を引き出してる" },
  { condition: (s) => highSelf(s, "I"), text: "誰もいない時の表情がいちばん柔らかい" },
  { condition: (s) => highSelf(s, "I"), text: "電車で本当に近い距離になっても動じない" },
  { condition: (s) => highSelf(s, "I"), text: "人見知りなのに、初対面で印象に残る" },
  { condition: (s) => highSelf(s, "I"), text: "大人数より、二人になった瞬間の方が饒舌になる" },
  { condition: (s) => highSelf(s, "I"), text: "イヤホン外す動作に、なぜか妙な間がある" },
  // 外向系のサイン
  { condition: (s) => highSelf(s, "E"), text: "誰にでも話しかけるけど、深い話は数人だけ" },
  { condition: (s) => highSelf(s, "E"), text: "場の温度を一秒で変えられる" },
  { condition: (s) => highSelf(s, "E"), text: "笑い声が、その場の音量を引き上げる" },
  { condition: (s) => highSelf(s, "E"), text: "知らない人にも自然に道を聞かれる" },
  { condition: (s) => highSelf(s, "E"), text: "別れ際の手の振り方に、見送られた側が引きずる何かがある" },
  // 論理系
  { condition: (s) => highSelf(s, "T"), text: "感情で動いてないのに、なぜか優しく見える" },
  { condition: (s) => highSelf(s, "T"), text: "決断が早くて、相手を不思議と安心させる" },
  { condition: (s) => highSelf(s, "T"), text: "正論を言うのに、なぜか嫌味に聞こえない" },
  { condition: (s) => highSelf(s, "T"), text: "怒らないのに、なぜか侮られない" },
  // 共感系
  { condition: (s) => highSelf(s, "F"), text: "相手の感情の変化に、本人より早く気づく" },
  { condition: (s) => highSelf(s, "F"), text: "聞き上手だと言われるけど、本当は感じすぎてる" },
  { condition: (s) => highSelf(s, "F"), text: "誰かが落ち込んでると、無意識に隣に行く" },
  { condition: (s) => highSelf(s, "F"), text: "『大丈夫？』が頻繁だけど、自分のことは言わない" },
  { condition: (s) => highSelf(s, "F"), text: "他人の自慢話を上手に聞ける" },
  // 計画系
  { condition: (s) => highSelf(s, "J"), text: "細かい約束を忘れない（相手はそれに気づいてる）" },
  { condition: (s) => highSelf(s, "J"), text: "予定を立てる声が、なぜか頼もしい" },
  { condition: (s) => highSelf(s, "J"), text: "返信の早さに、思ってる以上の意味を読まれてる" },
  // 即興系
  { condition: (s) => highSelf(s, "P"), text: "急に思いつきで誘って、相手をワクワクさせる" },
  { condition: (s) => highSelf(s, "P"), text: "予定を変えても許されてしまう空気がある" },
  { condition: (s) => highSelf(s, "P"), text: "物事を始めるのが遅いけど、始めると深い" },
  // 直感系
  { condition: (s) => highSelf(s, "N"), text: "急に変なこと言って、相手の頭に残る" },
  { condition: (s) => highSelf(s, "N"), text: "見てる視点が独特で、話してると面白い" },
  { condition: (s) => highSelf(s, "N"), text: "比喩の選び方に、相手が一瞬考え込む瞬間がある" },
  // 現実系
  { condition: (s) => highSelf(s, "S"), text: "今この瞬間を大事にする姿勢が、安心感を与える" },
  { condition: (s) => highSelf(s, "S"), text: "細部に気づく目が、相手に『見られてる』感覚を与える" },
  { condition: (s) => highSelf(s, "S"), text: "物を取る時、指先の動きが丁寧" },
  { condition: (s) => highSelf(s, "S"), text: "食べる時の所作に、人柄が滲んでる" },
  // 性格軸
  { condition: (s) => high(s, "lowTempEmotion", 4), text: "感情をあまり出さないのに、たまに見せる笑顔の破壊力" },
  { condition: (s) => high(s, "lowTempEmotion", 4), text: "テンションが上がりすぎないから、隣にいて疲れない" },
  { condition: (s) => high(s, "lateNightVibe", 4), text: "夜にだけ見せる別人みたいな顔" },
  { condition: (s) => high(s, "lateNightVibe", 4), text: "深夜の声のトーンが、昼と1オクターブ違う" },
  { condition: (s) => high(s, "silenceDependency", 4), text: "沈黙を共有できる相手だと、相手は無意識に楽になる" },
  { condition: (s) => high(s, "silenceDependency", 3), text: "会話を埋めようとしない強さがある" },
  { condition: (s) => high(s, "humanity", 4), text: "店員に対して優しい瞬間に、誰かが見てる" },
  { condition: (s) => high(s, "humanity", 4), text: "弱い立場の人への態度に、選ばれる理由が出てる" },
  { condition: (s) => high(s, "awkwardness", 4), text: "言葉が詰まる瞬間に、相手の心拍が上がる" },
  { condition: (s) => high(s, "awkwardness", 3), text: "うまく言えなかった後の、ちょっとした自嘲が刺さる" },
  { condition: (s) => high(s, "understandDesire", 4), text: "相手の話の核を、本人より早く言語化する" },
  { condition: (s) => high(s, "understandDesire", 4), text: "質問の角度が独特で、答えながら本音が出てしまう" },
  { condition: (s) => high(s, "loveExpression", 4), text: "感情を直接伝えられる強さは、それだけで武器" },
  { condition: (s) => high(s, "loveExpression", 4), text: "『ありがとう』の言い方に妙な余韻がある" },
  { condition: (s) => high(s, "innocenceTolerance", 4), text: "好きなものを語る時の表情に、相手はやられてる" },
  { condition: (s) => high(s, "innocenceTolerance", 3), text: "笑うとき、目尻のシワに本気が見える" },
  { condition: (s) => high(s, "edginessTolerance", 3), text: "ちょっと崩れた一面が、なぜか魅力的に映る" },
  { condition: (s) => high(s, "edginessTolerance", 4), text: "完璧じゃない部分を隠さない潔さがある" },
  { condition: (s) => high(s, "dailyLifeFeel", 4), text: "生活の匂いが、安心と色気を同時に運ぶ" },
  { condition: (s) => high(s, "dailyLifeFeel", 3), text: "コンビニの袋を持ってる姿に、なぜか見惚れられる" },
  { condition: (s) => high(s, "urbanSense", 4), text: "持ち物・服装に、説明できない『センス』を感じさせる" },
  { condition: (s) => high(s, "urbanSense", 3), text: "選ぶ店・流す音楽に、相手が記憶を持ち帰る" },
  { condition: (s) => high(s, "independence", 4), text: "一人で全然平気そうな姿に、相手は逆に近づきたくなる" },
  { condition: (s) => high(s, "independence", 4), text: "誰かに頼らずに済ませちゃう手際が、惚れさせる" },
  { condition: (s) => high(s, "caretakerDependency", 4), text: "気遣いがさりげなくて、相手は気づいた時にはもう手遅れ" },
  { condition: (s) => high(s, "caretakerDependency", 3), text: "相手の飲み物が減る前に、自然に動いてる" },
  { condition: (s) => high(s, "saveDesire", 4), text: "誰かを救おうとしてる姿勢に、相手は救われてる" },
  { condition: (s) => high(s, "saveDesire", 3), text: "弱ってる人の前で、声色が一段下がる" },
  { condition: (s) => high(s, "distanceSense", 4), text: "詰めすぎない距離感が、逆に近づきたくさせる" },
  { condition: (s) => high(s, "distanceSense", 3), text: "踏み込まないけど、置いていかれた感じもしない絶妙さ" },
  { condition: (s) => high(s, "vibeMatch", 4), text: "ノリがいいのに、ちゃんと一線を保ってる" },
  { condition: (s) => high(s, "vibeMatch", 3), text: "場の空気を読みすぎないのに、外さない" },
  { condition: (s) => high(s, "conversationDensity", 4), text: "会話の濃度に、相手は気づいたら何時間も話してる" },
  { condition: (s) => high(s, "conversationDensity", 3), text: "話のオチを急がない姿勢が、相手を安心させる" },
  { condition: (s) => high(s, "neglectTolerance", 4), text: "返信が遅くても、相手は不安より信頼を感じる" },
  { condition: (s) => high(s, "neglectTolerance", 3), text: "詮索しない態度が、逆に話したくさせる" },
  { condition: (s) => high(s, "lineTemperature", 4), text: "LINEの一文に、声よりはっきり温度が出てる" },
  { condition: (s) => high(s, "lineTemperature", 3), text: "LINEで絵文字を使わないけど、句読点が独特" },
  { condition: (s) => high(s, "emotionalInstabilityTolerance", 4), text: "重い話を聞いた後の表情が、変わらないから救われる" },
  // 低温・反対系
  { condition: (s) => low(s, "loveExpression", 2), text: "感情を出さないのに、行動でだけ示す癖がある" },
  { condition: (s) => low(s, "vibeMatch", 2), text: "ノリで返さない誠実さが、軽い人間関係を一掃する" },
  // 一般・観察ベース
  { condition: () => true, text: "相手の話をちゃんと最後まで聞ける（やってる人少ない）" },
  { condition: () => true, text: "笑う時の歯の見せ方に、見てる側がドキッとする瞬間がある" },
  { condition: () => true, text: "ふとした横顔が、相手の記憶に焼きつく" },
  { condition: () => true, text: "写真より映像で人に伝えたがる" },
  { condition: () => true, text: "カバンの中身を見せたがらない" },
  { condition: () => true, text: "他人の褒め言葉を素直に受け取れない" },
  { condition: () => true, text: "ペンを置く音、ドアを閉める音が静か" },
  { condition: () => true, text: "席を立つタイミングが、いつも自然" },
  { condition: () => true, text: "笑う前に、一回だけ瞬きが入る" },
  { condition: () => true, text: "歩く速度が、相手によって無意識に変わる" },
  { condition: () => true, text: "店員さんに『ありがとうございます』を返す声が、ちゃんと届いてる" },
  { condition: () => true, text: "首を傾ける角度に、相手は意味を読みすぎてる" },
]

function selectSignals(scores: AnalysisScores): readonly string[] {
  const matched = SIGNAL_PATTERNS.filter((p) => p.condition(scores))
  // 決定論的シャッフル
  const rng = createSeededRandom(hashScores(scores))
  const shuffled = [...matched]
    .map((p) => ({ p, r: rng() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.p)
  return [...new Set(shuffled.map((p) => p.text))].slice(0, 12)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 総評の vibe と無意識の罠
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function generateVibe(scores: AnalysisScores): string {
  const intro = highSelf(scores, "I") ? "静かで読みづらい" : "明るく親しみやすい"
  const second = highSelf(scores, "F") ? "感情の温度が高い" : "理屈で動く"

  let third = "つかみどころのない"
  if (high(scores, "lateNightVibe", 4)) {
    third = "夜になると別の顔を見せる"
  } else if (high(scores, "dailyLifeFeel", 4)) {
    third = "生活の匂いがちゃんとある"
  } else if (high(scores, "urbanSense", 4)) {
    third = "都市の影をまとってる"
  } else if (high(scores, "awkwardness", 4)) {
    third = "ちょっと不器用さが滲む"
  } else if (high(scores, "independence", 4)) {
    third = "誰にも寄りかからない"
  } else if (high(scores, "silenceDependency", 4)) {
    third = "沈黙にすら意味を持たせる"
  } else if (high(scores, "edginessTolerance", 4)) {
    third = "どこか危うさを抱えてる"
  } else if (high(scores, "humanity", 4)) {
    third = "人間の体温が手放せない"
  }

  return `あなたが放ってるのは「${intro}のに${second}、しかも${third}」という、矛盾した磁場。これが特定のタイプを強く引き寄せてる。`
}

function generateTrap(scores: AnalysisScores): string {
  if (highSelf(scores, "I") && high(scores, "lowTempEmotion", 4)) {
    return "あなたが何も発信してないつもりの『無関心の壁』が、攻略したい人を呼び寄せてる。あなたの沈黙は招待状。"
  }
  if (highSelf(scores, "F") && high(scores, "humanity", 4)) {
    return "他人に優しいあなたを見て、『私にも同じ温度をくれるかも』と期待する人が集まる。あなたが相手を選んでないだけ。"
  }
  if (highSelf(scores, "T") && high(scores, "independence", 4)) {
    return "一人で完結してる強さが、『この人を崩したい』という挑戦欲を呼び起こす。あなたは自覚なく挑発してる。"
  }
  if (high(scores, "saveDesire", 4) || high(scores, "emotionalInstabilityTolerance", 4)) {
    return "あなたの中の『救いたい欲』が、なぜか『救って欲しい人』ばかりを引き寄せる。同じ磁場で響き合ってる。"
  }
  if (high(scores, "loveExpression", 4)) {
    return "あなたの率直な愛情表現は、感情を出せない人にとって致命傷。あなたが本気で愛した相手は、たぶん逃げられない。"
  }
  if (high(scores, "lateNightVibe", 4) && high(scores, "silenceDependency", 3)) {
    return "夜にだけ見せるあなたの素顔は、見た側の中で『自分だけが知ってる』という物語に変換される。沈黙の共犯は、抜け出しにくい。"
  }
  if (high(scores, "awkwardness", 4) && highSelf(scores, "F")) {
    return "うまく伝えられない不器用さが、『この人を理解できるのは自分だけ』という独占欲を相手に植えつけてる。"
  }
  if (high(scores, "distanceSense", 4) && highSelf(scores, "I")) {
    return "踏み込まない優しさが、踏み込まれたい相手の飢えを刺激してる。あなたの『程よさ』が、相手にとっては喉の渇き。"
  }
  if (high(scores, "neglectTolerance", 4)) {
    return "あなたの『放っといてくれる感』は、束縛慣れした人ほど依存させる。自由を与えた相手ほど、自由を返したくなくなる。"
  }
  if (high(scores, "understandDesire", 4) && highSelf(scores, "N")) {
    return "あなたが何気なく当てた相手の本音は、相手の中で『見透かされた瞬間』として焼き付く。理解は、一度味わうと中毒になる。"
  }
  if (high(scores, "urbanSense", 4) && high(scores, "lowTempEmotion", 3)) {
    return "都市的な空気とクールな温度が組み合わさると、相手の中で『手の届かない存在』として神格化される。届かないからこそ追いかけられる。"
  }
  if (high(scores, "dailyLifeFeel", 4) && high(scores, "humanity", 4)) {
    return "生活感と人間味が同居してるあなたは、『この人と暮らしたい』を一瞬で想像させる。長期戦の引力。"
  }
  if (high(scores, "innocenceTolerance", 4) && highSelf(scores, "T")) {
    return "大人なのに、無邪気を許す。そのギャップが、相手の中で『この人の前でだけは素になれる』という錯覚を生む。"
  }
  return "あなたの空気に、なぜか同じパターンの人が引き寄せられる。それは偶然じゃなく、あなたの磁場の必然。"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// メイン関数
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function generateLovedByResult(scores: AnalysisScores): LovedByResult {
  return {
    attractedTypes: selectAttractedTypes(scores),
    signals: selectSignals(scores),
    vibe: generateVibe(scores),
    trap: generateTrap(scores),
  }
}
