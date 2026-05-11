import type { Question } from "./types"

// 軸カバレッジ補強用の追加質問
// Phase 2 のプールに追加する想定
// 主軸: neglectTolerance / emotionalInstabilityTolerance / saveDesire

export const extraNeglectQuestions: readonly Question[] = [
  {
    id: 250,
    text: "3日連絡なくても気にならない、\nそんな相手の特徴は？",
    choices: [
      { id: "250a", text: "自分の時間に没頭してて連絡を忘れてる", scores: { neglectTolerance: 3, independence: 2, lowTempEmotion: 1, distanceSense: 0.5, silenceDependency: 0.5 } },
      { id: "250b", text: "「元気？」じゃなく急に深い話から戻ってくる", scores: { distanceSense: 3, neglectTolerance: 2, lateNightVibe: 1, understandDesire: 0.5, conversationDensity: 0.5 } },
      { id: "250c", text: "戻ってきた時に普通に笑ってる", scores: { lowTempEmotion: 3, neglectTolerance: 2, humanity: 1, lineTemperature: 0.5, vibeMatch: 0.5 } },
      { id: "250d", text: "「ごめん」より「会いたい」が先に来る", scores: { lineTemperature: 3, loveExpression: 2, awkwardness: 1, humanity: 0.5, neglectTolerance: 0.5 } },
    ],
  },
  {
    id: 251,
    text: "連絡が途絶えた時、\n惹かれる態度は？",
    choices: [
      { id: "251a", text: "理由は聞かず「お疲れ」だけ返してくる", scores: { neglectTolerance: 3, distanceSense: 2, lowTempEmotion: 1, lineTemperature: 0.5, independence: 0.5 } },
      { id: "251b", text: "「待ってたよ」と一言だけ送ってくる", scores: { loveExpression: 3, lineTemperature: 2, humanity: 1, awkwardness: 0.5, neglectTolerance: 0.5 } },
      { id: "251c", text: "自分のペースを崩さず普段通りに接する", scores: { independence: 3, lowTempEmotion: 2, neglectTolerance: 2, distanceSense: 1, silenceDependency: 0.5 } },
      { id: "251d", text: "「大丈夫だった？」と心配を先に出す", scores: { caretakerDependency: 3, saveDesire: 2, humanity: 1, understandDesire: 0.5, loveExpression: 0.5 } },
    ],
  },
]

export const extraEmotionalQuestions: readonly Question[] = [
  {
    id: 252,
    text: "相手の感情の浮き沈み、\nどこに惹かれる？",
    choices: [
      { id: "252a", text: "落ちてる時にぽつりと本音を漏らす", scores: { emotionalInstabilityTolerance: 3, lateNightVibe: 2, understandDesire: 1, awkwardness: 0.5, saveDesire: 0.5 } },
      { id: "252b", text: "急に静かになる瞬間がある", scores: { lowTempEmotion: 3, silenceDependency: 2, emotionalInstabilityTolerance: 1, distanceSense: 0.5, awkwardness: 0.5 } },
      { id: "252c", text: "笑顔と泣き顔の切り替えが早い", scores: { innocenceTolerance: 3, humanity: 2, emotionalInstabilityTolerance: 1, vibeMatch: 0.5, loveExpression: 0.5 } },
      { id: "252d", text: "不機嫌でも理由を言葉にしてくれる", scores: { conversationDensity: 3, understandDesire: 2, humanity: 1, lineTemperature: 0.5, emotionalInstabilityTolerance: 0.5 } },
    ],
  },
  {
    id: 253,
    text: "夜に弱気になる相手の姿、\nどれが好き？",
    choices: [
      { id: "253a", text: "「眠れない」とだけ送ってくる", scores: { emotionalInstabilityTolerance: 3, lateNightVibe: 2, lineTemperature: 1, awkwardness: 0.5, saveDesire: 0.5 } },
      { id: "253b", text: "昔の話をぽつぽつ始める", scores: { lateNightVibe: 3, understandDesire: 2, humanity: 1, conversationDensity: 0.5, emotionalInstabilityTolerance: 0.5 } },
      { id: "253c", text: "「ごめん、変なこと言った」と後で謝る", scores: { awkwardness: 3, emotionalInstabilityTolerance: 2, humanity: 1, loveExpression: 0.5, understandDesire: 0.5 } },
      { id: "253d", text: "声だけ聞かせてと電話してくる", scores: { loveExpression: 3, lineTemperature: 2, lateNightVibe: 1, emotionalInstabilityTolerance: 0.5, saveDesire: 0.5 } },
    ],
  },
]

export const extraSaveDesireQuestions: readonly Question[] = [
  {
    id: 254,
    text: "相手の脆さ、\nどこに惹かれる？",
    choices: [
      { id: "254a", text: "強がってるのに手だけ震えてる", scores: { saveDesire: 3, caretakerDependency: 2, humanity: 1, emotionalInstabilityTolerance: 0.5, awkwardness: 0.5 } },
      { id: "254b", text: "誰にも見せない弱さを自分にだけ見せる", scores: { understandDesire: 3, saveDesire: 2, loveExpression: 1, lineTemperature: 0.5, lateNightVibe: 0.5 } },
      { id: "254c", text: "傷ついた話を笑いながら話してくる", scores: { awkwardness: 3, humanity: 2, saveDesire: 1, lowTempEmotion: 0.5, emotionalInstabilityTolerance: 0.5 } },
      { id: "254d", text: "「平気」って言いながら目を逸らす", scores: { emotionalInstabilityTolerance: 3, saveDesire: 2, awkwardness: 1, understandDesire: 0.5, lateNightVibe: 0.5 } },
    ],
  },
  {
    id: 255,
    text: "「この人、放っておけない」\nと思う瞬間は？",
    choices: [
      { id: "255a", text: "ご飯を抜いてまで仕事してる時", scores: { saveDesire: 3, caretakerDependency: 2, humanity: 1, dailyLifeFeel: 0.5, loveExpression: 0.5 } },
      { id: "255b", text: "夜中に意味深なSNS投稿をしてる時", scores: { lateNightVibe: 3, saveDesire: 2, edginessTolerance: 1, emotionalInstabilityTolerance: 0.5, understandDesire: 0.5 } },
      { id: "255c", text: "人前では明るいのに帰り道で黙る時", scores: { understandDesire: 3, saveDesire: 2, silenceDependency: 1, lowTempEmotion: 0.5, emotionalInstabilityTolerance: 0.5 } },
      { id: "255d", text: "「自分でやるから大丈夫」と頼ってこない時", scores: { independence: 3, saveDesire: 2, distanceSense: 1, awkwardness: 0.5, caretakerDependency: 0.5 } },
    ],
  },
]

export const allExtraQuestions: readonly Question[] = [
  ...extraNeglectQuestions,
  ...extraEmotionalQuestions,
  ...extraSaveDesireQuestions,
]
