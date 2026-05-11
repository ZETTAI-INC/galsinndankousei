import type { AnalysisScores, AttractedType, LovedByResult } from "./types"

function high(scores: AnalysisScores, axis: string, threshold = 4): boolean {
  return (scores[axis] ?? 0) >= threshold
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
  // 外向系のサイン
  { condition: (s) => highSelf(s, "E"), text: "誰にでも話しかけるけど、深い話は数人だけ" },
  { condition: (s) => highSelf(s, "E"), text: "場の温度を一秒で変えられる" },
  { condition: (s) => highSelf(s, "E"), text: "笑い声が、その場の音量を引き上げる" },
  { condition: (s) => highSelf(s, "E"), text: "知らない人にも自然に道を聞かれる" },
  // 論理系
  { condition: (s) => highSelf(s, "T"), text: "感情で動いてないのに、なぜか優しく見える" },
  { condition: (s) => highSelf(s, "T"), text: "決断が早くて、相手を不思議と安心させる" },
  { condition: (s) => highSelf(s, "T"), text: "正論を言うのに、なぜか嫌味に聞こえない" },
  // 共感系
  { condition: (s) => highSelf(s, "F"), text: "相手の感情の変化に、本人より早く気づく" },
  { condition: (s) => highSelf(s, "F"), text: "聞き上手だと言われるけど、本当は感じすぎてる" },
  { condition: (s) => highSelf(s, "F"), text: "誰かが落ち込んでると、無意識に隣に行く" },
  // 計画系
  { condition: (s) => highSelf(s, "J"), text: "細かい約束を忘れない（相手はそれに気づいてる）" },
  { condition: (s) => highSelf(s, "J"), text: "予定を立てる声が、なぜか頼もしい" },
  // 即興系
  { condition: (s) => highSelf(s, "P"), text: "急に思いつきで誘って、相手をワクワクさせる" },
  { condition: (s) => highSelf(s, "P"), text: "予定を変えても許されてしまう空気がある" },
  // 直感系
  { condition: (s) => highSelf(s, "N"), text: "急に変なこと言って、相手の頭に残る" },
  { condition: (s) => highSelf(s, "N"), text: "見てる視点が独特で、話してると面白い" },
  // 現実系
  { condition: (s) => highSelf(s, "S"), text: "今この瞬間を大事にする姿勢が、安心感を与える" },
  { condition: (s) => highSelf(s, "S"), text: "細部に気づく目が、相手に『見られてる』感覚を与える" },
  // 性格軸
  { condition: (s) => high(s, "lowTempEmotion", 4), text: "感情をあまり出さないのに、たまに見せる笑顔の破壊力" },
  { condition: (s) => high(s, "lateNightVibe", 4), text: "夜にだけ見せる別人みたいな顔" },
  { condition: (s) => high(s, "silenceDependency", 4), text: "沈黙を共有できる相手だと、相手は無意識に楽になる" },
  { condition: (s) => high(s, "humanity", 4), text: "店員に対して優しい瞬間に、誰かが見てる" },
  { condition: (s) => high(s, "awkwardness", 4), text: "言葉が詰まる瞬間に、相手の心拍が上がる" },
  { condition: (s) => high(s, "understandDesire", 4), text: "相手の話の核を、本人より早く言語化する" },
  { condition: (s) => high(s, "loveExpression", 4), text: "感情を直接伝えられる強さは、それだけで武器" },
  { condition: (s) => high(s, "innocenceTolerance", 4), text: "好きなものを語る時の表情に、相手はやられてる" },
  { condition: (s) => high(s, "edginessTolerance", 3), text: "ちょっと崩れた一面が、なぜか魅力的に映る" },
  { condition: (s) => high(s, "dailyLifeFeel", 4), text: "生活の匂いが、安心と色気を同時に運ぶ" },
  { condition: (s) => high(s, "urbanSense", 4), text: "持ち物・服装に、説明できない『センス』を感じさせる" },
  { condition: (s) => high(s, "independence", 4), text: "一人で全然平気そうな姿に、相手は逆に近づきたくなる" },
  { condition: (s) => high(s, "caretakerDependency", 4), text: "気遣いがさりげなくて、相手は気づいた時にはもう手遅れ" },
  { condition: (s) => high(s, "saveDesire", 4), text: "誰かを救おうとしてる姿勢に、相手は救われてる" },
  { condition: (s) => high(s, "distanceSense", 4), text: "詰めすぎない距離感が、逆に近づきたくさせる" },
  { condition: (s) => high(s, "vibeMatch", 4), text: "ノリがいいのに、ちゃんと一線を保ってる" },
  { condition: (s) => high(s, "conversationDensity", 4), text: "会話の濃度に、相手は気づいたら何時間も話してる" },
  // 一般
  { condition: () => true, text: "相手の話をちゃんと最後まで聞ける（やってる人少ない）" },
  { condition: () => true, text: "笑う時の歯の見せ方に、見てる側がドキッとする瞬間がある" },
  { condition: () => true, text: "ふとした横顔が、相手の記憶に焼きつく" },
]

function selectSignals(scores: AnalysisScores): readonly string[] {
  const matched = SIGNAL_PATTERNS.filter((p) => p.condition(scores))
  // 上位を優先しつつ、ランダム性も入れる
  const shuffled = [...matched].sort(() => Math.random() - 0.5)
  return [...new Set(shuffled.map((p) => p.text))].slice(0, 12)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 総評の vibe と無意識の罠
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function generateVibe(scores: AnalysisScores): string {
  const intro = highSelf(scores, "I") ? "静かで読みづらい" : "明るく親しみやすい"
  const second = highSelf(scores, "F") ? "感情の温度が高い" : "理屈で動く"
  const third = high(scores, "lateNightVibe", 4)
    ? "夜になると別の顔を見せる"
    : high(scores, "dailyLifeFeel", 4)
      ? "生活の匂いがちゃんとある"
      : "つかみどころのない"

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
