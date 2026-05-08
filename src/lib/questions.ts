import type { AnalysisScores, Phase1Type, Phase3Type, Question } from "./types"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Phase 1: コア8問
// E/I × 4問、J/P × 4問で大枠を分類
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const phase1Questions: readonly Question[] = [
  {
    id: 1,
    text: "飲み会の終わり際、\n気になるのはどの人？",
    choices: [
      { id: "1a", text: "まだ盛り上がってる人", scores: { attractE: 3, vibeMatch: 2 } },
      { id: "1b", text: "先に静かに帰った人", scores: { attractI: 3, lowTempEmotion: 2 } },
      { id: "1c", text: "二次会を仕切ってる人", scores: { attractE: 2, caretakerDependency: 1 } },
      { id: "1d", text: "隅で一人スマホ見てる人", scores: { attractI: 2, silenceDependency: 1, edginessTolerance: 1 } },
    ],
  },
  {
    id: 2,
    text: "LINEの返信パターン、\n一番安心するのは？",
    choices: [
      { id: "2a", text: "すぐ既読、すぐ返信", scores: { attractJ: 3, lineTemperature: 2 } },
      { id: "2b", text: "気まぐれだけど来ると長文", scores: { attractP: 3, lateNightVibe: 1 } },
      { id: "2c", text: "毎日だいたい同じ時間に来る", scores: { attractJ: 2, dailyLifeFeel: 1 } },
      { id: "2d", text: "3日空いて急に連投", scores: { attractP: 2, emotionalInstabilityTolerance: 1, neglectTolerance: 1 } },
    ],
  },
  {
    id: 3,
    text: "グループの中で\n目が行くのは？",
    choices: [
      { id: "3a", text: "場の空気を作ってる人", scores: { attractE: 3, loveExpression: 1 } },
      { id: "3b", text: "少し離れたところにいる人", scores: { attractI: 3, distanceSense: 2 } },
      { id: "3c", text: "話を回して盛り上げてる人", scores: { attractE: 2, conversationDensity: 1 } },
      { id: "3d", text: "聞き役に徹してる人", scores: { attractI: 2, silenceDependency: 1, understandDesire: 1 } },
    ],
  },
  {
    id: 4,
    text: "デートの決め方、\n惹かれるのは？",
    choices: [
      { id: "4a", text: "「○日の○時に○○ね」", scores: { attractJ: 3, independence: 1 } },
      { id: "4b", text: "「明日暇？なんかしよ」", scores: { attractP: 3, lateNightVibe: 1 } },
      { id: "4c", text: "お店を予約してくれてる", scores: { attractJ: 2, caretakerDependency: 2 } },
      { id: "4d", text: "「着いてから決めよう」", scores: { attractP: 2, edginessTolerance: 1 } },
    ],
  },
  {
    id: 5,
    text: "週末の過ごし方、\n惹かれるのは？",
    choices: [
      { id: "5a", text: "誰かを誘って出かけてる", scores: { attractE: 3, humanity: 1 } },
      { id: "5b", text: "一人で気ままに散歩してる", scores: { attractI: 3, silenceDependency: 2 } },
      { id: "5c", text: "イベントに顔を出してる", scores: { attractE: 2, innocenceTolerance: 1, vibeMatch: 1 } },
      { id: "5d", text: "家で好きなことに没頭してる", scores: { attractI: 2, lowTempEmotion: 1, lateNightVibe: 1 } },
    ],
  },
  {
    id: 6,
    text: "相手の部屋に入ったとき、\n惹かれるのは？",
    choices: [
      { id: "6a", text: "整理整頓されてて清潔", scores: { attractJ: 3, urbanSense: 1 } },
      { id: "6b", text: "好きなものが雑多に並んでる", scores: { attractP: 3, humanity: 1, understandDesire: 1 } },
      { id: "6c", text: "カレンダーにスケジュールびっしり", scores: { attractJ: 2, independence: 1 } },
      { id: "6d", text: "脱ぎっぱなしだけど居心地いい", scores: { attractP: 2, dailyLifeFeel: 2, edginessTolerance: 1 } },
    ],
  },
  {
    id: 7,
    text: "会話のテンポ、\n惹かれるのは？",
    choices: [
      { id: "7a", text: "ポンポン返ってくる", scores: { attractE: 3, conversationDensity: 2 } },
      { id: "7b", text: "ゆっくり考えてから話す", scores: { attractI: 3, awkwardness: 1 } },
      { id: "7c", text: "話題がどんどん変わる", scores: { attractE: 2, vibeMatch: 1, innocenceTolerance: 1 } },
      { id: "7d", text: "ひとつの話を深く掘る", scores: { attractI: 2, understandDesire: 2, conversationDensity: 1 } },
    ],
  },
  {
    id: 8,
    text: "旅行のスタイル、\n惹かれるのは？",
    choices: [
      { id: "8a", text: "完璧にスケジュール立てる", scores: { attractJ: 3, caretakerDependency: 1 } },
      { id: "8b", text: "ノープランで気の向くまま", scores: { attractP: 3, edginessTolerance: 2 } },
      { id: "8c", text: "行きたい場所リストを共有する", scores: { attractJ: 2, loveExpression: 1 } },
      { id: "8d", text: "「面白そう」で急に行き先変える", scores: { attractP: 2, innocenceTolerance: 1, lateNightVibe: 1 } },
    ],
  },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Phase 2: タイプ別8問 × 4セット = 32問
// Phase1の結果で分岐。T/F、S/Nを判定しつつ深掘り
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// EJ: 計画的で社交的な人に惹かれるタイプ向け
const phase2EJ: readonly Question[] = [
  {
    id: 201,
    text: "リーダーシップを取る人、\n惹かれるスタイルは？",
    choices: [
      { id: "201a", text: "論理的に正しいことを言う", scores: { attractT: 3, lowTempEmotion: 2 } },
      { id: "201b", text: "みんなの気持ちを聞いて決める", scores: { attractF: 3, humanity: 2 } },
      { id: "201c", text: "効率を最優先する", scores: { attractT: 2, urbanSense: 1, independence: 1 } },
      { id: "201d", text: "全員が納得するまで話す", scores: { attractF: 2, conversationDensity: 1, caretakerDependency: 1 } },
    ],
  },
  {
    id: 202,
    text: "デート中の会話、\n惹かれる話題は？",
    choices: [
      { id: "202a", text: "今日あった面白い出来事", scores: { attractS: 3, dailyLifeFeel: 1 } },
      { id: "202b", text: "将来の夢や理想の暮らし", scores: { attractN: 3, understandDesire: 1 } },
      { id: "202c", text: "美味しいお店やおすすめの場所", scores: { attractS: 2, humanity: 1 } },
      { id: "202d", text: "「こういう世界だったら」みたいな空想", scores: { attractN: 2, lateNightVibe: 1 } },
    ],
  },
  {
    id: 203,
    text: "仕事の話をするとき、\n惹かれる人は？",
    choices: [
      { id: "203a", text: "数字や結果で語る人", scores: { attractT: 2, attractS: 1, independence: 1 } },
      { id: "203b", text: "人間関係の話が多い人", scores: { attractF: 2, humanity: 2 } },
      { id: "203c", text: "ビジョンやアイデアで熱くなる人", scores: { attractN: 2, vibeMatch: 1 } },
      { id: "203d", text: "今の仕事の具体的な内容を話す人", scores: { attractS: 2, dailyLifeFeel: 1 } },
    ],
  },
  {
    id: 204,
    text: "相手が怒ったとき、\n惹かれる怒り方は？",
    choices: [
      { id: "204a", text: "冷静に理由を説明する", scores: { attractT: 3, lowTempEmotion: 2 } },
      { id: "204b", text: "感情的になるけどすぐ謝る", scores: { attractF: 3, loveExpression: 1, emotionalInstabilityTolerance: 1 } },
      { id: "204c", text: "黙って距離を置く", scores: { attractT: 1, distanceSense: 2, neglectTolerance: 1 } },
      { id: "204d", text: "「悲しかった」と伝えてくる", scores: { attractF: 2, lineTemperature: 1, awkwardness: 1 } },
    ],
  },
  {
    id: 205,
    text: "プレゼントの選び方、\n惹かれるのは？",
    choices: [
      { id: "205a", text: "実用的で確実に使えるもの", scores: { attractS: 3, dailyLifeFeel: 1 } },
      { id: "205b", text: "意味やストーリーがあるもの", scores: { attractN: 3, understandDesire: 2 } },
      { id: "205c", text: "リサーチして最適なものを選ぶ", scores: { attractS: 2, attractT: 1 } },
      { id: "205d", text: "直感で「これだ」と選ぶ", scores: { attractN: 2, innocenceTolerance: 1 } },
    ],
  },
  {
    id: 206,
    text: "相談されたとき、\n惹かれる対応は？",
    choices: [
      { id: "206a", text: "解決策をすぐ出してくれる", scores: { attractT: 3, independence: 1 } },
      { id: "206b", text: "まず共感してくれる", scores: { attractF: 3, caretakerDependency: 1 } },
      { id: "206c", text: "「それは相手が悪い」とはっきり言う", scores: { attractT: 2, lowTempEmotion: 1 } },
      { id: "206d", text: "一緒に悩んでくれる", scores: { attractF: 2, saveDesire: 1, humanity: 1 } },
    ],
  },
  {
    id: 207,
    text: "褒め方、惹かれるのは？",
    choices: [
      { id: "207a", text: "「すごいね」と素直に言う", scores: { attractS: 2, attractF: 1, innocenceTolerance: 1 } },
      { id: "207b", text: "具体的に何が良かったか言う", scores: { attractS: 2, attractT: 1, understandDesire: 1 } },
      { id: "207c", text: "「才能あるよ」と可能性を言う", scores: { attractN: 3, loveExpression: 1 } },
      { id: "207d", text: "言葉にせず態度で示す", scores: { attractN: 1, awkwardness: 2, lowTempEmotion: 1 } },
    ],
  },
  {
    id: 208,
    text: "お金の使い方、\n惹かれるのは？",
    choices: [
      { id: "208a", text: "しっかり管理してる", scores: { attractS: 2, attractJ: 1, independence: 1 } },
      { id: "208b", text: "好きなことには惜しまない", scores: { attractN: 2, attractP: 1, edginessTolerance: 1 } },
      { id: "208c", text: "奢ってくれる", scores: { attractF: 1, caretakerDependency: 2, loveExpression: 1 } },
      { id: "208d", text: "割り勘をサラッと済ませる", scores: { attractT: 2, distanceSense: 1, lowTempEmotion: 1 } },
    ],
  },
]

// EP: 自由で社交的な人に惹かれるタイプ向け
const phase2EP: readonly Question[] = [
  {
    id: 211,
    text: "ノリで誘ってくるとき、\n惹かれる誘い方は？",
    choices: [
      { id: "211a", text: "「面白い店見つけた、今から行こ」", scores: { attractS: 3, dailyLifeFeel: 1 } },
      { id: "211b", text: "「朝日見に行かない？」", scores: { attractN: 3, lateNightVibe: 2 } },
      { id: "211c", text: "「暇でしょ、迎え行くわ」", scores: { attractT: 1, attractS: 1, loveExpression: 2 } },
      { id: "211d", text: "「なんか寂しくなった」", scores: { attractF: 2, attractN: 1, emotionalInstabilityTolerance: 1, lineTemperature: 1 } },
    ],
  },
  {
    id: 212,
    text: "テンションの上げ方、\n惹かれるのは？",
    choices: [
      { id: "212a", text: "論理的にツッコミを入れてくる", scores: { attractT: 3, conversationDensity: 1 } },
      { id: "212b", text: "感情のまま笑い転げる", scores: { attractF: 3, innocenceTolerance: 2 } },
      { id: "212c", text: "的確にボケて笑わせる", scores: { attractT: 2, vibeMatch: 1 } },
      { id: "212d", text: "一緒にはしゃいでくれる", scores: { attractF: 2, vibeMatch: 2 } },
    ],
  },
  {
    id: 213,
    text: "失敗したとき、\n惹かれる反応は？",
    choices: [
      { id: "213a", text: "すぐ切り替えて笑い飛ばす", scores: { attractT: 2, attractS: 1, vibeMatch: 1 } },
      { id: "213b", text: "「大丈夫？」と心配してくれる", scores: { attractF: 3, caretakerDependency: 1 } },
      { id: "213c", text: "原因を分析して次に活かそうとする", scores: { attractT: 2, attractN: 1, independence: 1 } },
      { id: "213d", text: "「一緒にやり直そう」と言ってくれる", scores: { attractF: 2, attractN: 1, loveExpression: 1, saveDesire: 1 } },
    ],
  },
  {
    id: 214,
    text: "一緒に遊ぶとき、\n惹かれるスタイルは？",
    choices: [
      { id: "214a", text: "アクティブに体を動かす", scores: { attractS: 3, vibeMatch: 1 } },
      { id: "214b", text: "クリエイティブなことをする", scores: { attractN: 3, understandDesire: 1 } },
      { id: "214c", text: "新しい場所を探検する", scores: { attractS: 2, attractN: 1, edginessTolerance: 1 } },
      { id: "214d", text: "ただ一緒にいてダラダラする", scores: { attractF: 1, silenceDependency: 1, dailyLifeFeel: 2 } },
    ],
  },
  {
    id: 215,
    text: "口喧嘩になったとき、\n惹かれる返し方は？",
    choices: [
      { id: "215a", text: "正論で黙らせてくる", scores: { attractT: 3, lowTempEmotion: 1 } },
      { id: "215b", text: "途中で笑い出す", scores: { attractF: 2, innocenceTolerance: 2, vibeMatch: 1 } },
      { id: "215c", text: "「もうええわ」と切り上げる", scores: { attractT: 1, distanceSense: 2, neglectTolerance: 1 } },
      { id: "215d", text: "急に抱きしめてくる", scores: { attractF: 3, loveExpression: 2 } },
    ],
  },
  {
    id: 216,
    text: "写真の撮り方、\n惹かれるのは？",
    choices: [
      { id: "216a", text: "日常の何気ない瞬間を撮る", scores: { attractS: 3, dailyLifeFeel: 2 } },
      { id: "216b", text: "構図や光にこだわる", scores: { attractN: 3, urbanSense: 1 } },
      { id: "216c", text: "人をよく撮る", scores: { attractF: 1, attractS: 1, humanity: 1 } },
      { id: "216d", text: "あまり撮らない、目で見る派", scores: { attractT: 1, lowTempEmotion: 1, distanceSense: 1 } },
    ],
  },
  {
    id: 217,
    text: "酔ったときの変化、\n惹かれるのは？",
    choices: [
      { id: "217a", text: "テンション上がって面白くなる", scores: { attractS: 1, attractF: 1, innocenceTolerance: 2, vibeMatch: 1 } },
      { id: "217b", text: "急に本音を言い出す", scores: { attractN: 2, attractF: 1, lateNightVibe: 1, emotionalInstabilityTolerance: 1 } },
      { id: "217c", text: "変わらない", scores: { attractT: 2, lowTempEmotion: 2 } },
      { id: "217d", text: "甘えてくる", scores: { attractF: 2, loveExpression: 2, lineTemperature: 1 } },
    ],
  },
  {
    id: 218,
    text: "音楽の聴き方、\n惹かれるのは？",
    choices: [
      { id: "218a", text: "流行りをチェックしてる", scores: { attractS: 2, dailyLifeFeel: 1, vibeMatch: 1 } },
      { id: "218b", text: "マイナーな曲を深掘りする", scores: { attractN: 3, lateNightVibe: 1 } },
      { id: "218c", text: "歌詞の意味を考える", scores: { attractN: 2, attractF: 1, understandDesire: 1 } },
      { id: "218d", text: "ノリで聴く、深く考えない", scores: { attractS: 2, attractT: 1, vibeMatch: 1 } },
    ],
  },
]

// IJ: 計画的で内向的な人に惹かれるタイプ向け
const phase2IJ: readonly Question[] = [
  {
    id: 221,
    text: "沈黙の質、\n惹かれるのは？",
    choices: [
      { id: "221a", text: "考え事してるのが伝わる沈黙", scores: { attractT: 2, attractN: 1, understandDesire: 2 } },
      { id: "221b", text: "安心してるのが伝わる沈黙", scores: { attractF: 3, silenceDependency: 2 } },
      { id: "221c", text: "何も考えてなさそうな沈黙", scores: { attractS: 2, dailyLifeFeel: 1 } },
      { id: "221d", text: "言いたいことがありそうな沈黙", scores: { attractF: 2, attractN: 1, awkwardness: 2 } },
    ],
  },
  {
    id: 222,
    text: "知識の深さ、\n惹かれるのは？",
    choices: [
      { id: "222a", text: "一つの分野を極めてる", scores: { attractS: 2, attractT: 1, independence: 2 } },
      { id: "222b", text: "幅広くいろんなことを知ってる", scores: { attractN: 3, conversationDensity: 1 } },
      { id: "222c", text: "実用的な知識が豊富", scores: { attractS: 3, dailyLifeFeel: 1 } },
      { id: "222d", text: "哲学的なことを考えてる", scores: { attractN: 2, attractT: 1, lateNightVibe: 1 } },
    ],
  },
  {
    id: 223,
    text: "本の読み方、\n惹かれるのは？",
    choices: [
      { id: "223a", text: "論理的に分析しながら読む", scores: { attractT: 3, urbanSense: 1 } },
      { id: "223b", text: "感情移入して泣いたり笑ったり", scores: { attractF: 3, humanity: 1, emotionalInstabilityTolerance: 1 } },
      { id: "223c", text: "実用書やノンフィクション中心", scores: { attractS: 2, attractT: 1 } },
      { id: "223d", text: "小説の世界に入り込む", scores: { attractN: 2, attractF: 1, understandDesire: 1 } },
    ],
  },
  {
    id: 224,
    text: "気遣いの仕方、\n惹かれるのは？",
    choices: [
      { id: "224a", text: "言わなくても察してくれる", scores: { attractF: 3, attractN: 1, understandDesire: 2 } },
      { id: "224b", text: "「何かあった？」と直接聞く", scores: { attractT: 2, attractF: 1, loveExpression: 1 } },
      { id: "224c", text: "さりげなく環境を整えてくれる", scores: { attractS: 2, caretakerDependency: 2 } },
      { id: "224d", text: "距離を保って見守ってくれる", scores: { attractT: 2, distanceSense: 2, lowTempEmotion: 1 } },
    ],
  },
  {
    id: 225,
    text: "感情の見せ方、\n惹かれるのは？",
    choices: [
      { id: "225a", text: "表情に出ないけど行動に出る", scores: { attractT: 2, awkwardness: 2, lowTempEmotion: 1 } },
      { id: "225b", text: "目だけで伝わる", scores: { attractF: 2, attractN: 1, understandDesire: 2 } },
      { id: "225c", text: "文章では素直になる", scores: { attractF: 2, attractI: 1, lineTemperature: 1, awkwardness: 1 } },
      { id: "225d", text: "感情をコントロールしてる", scores: { attractT: 3, lowTempEmotion: 2, independence: 1 } },
    ],
  },
  {
    id: 226,
    text: "約束の守り方、\n惹かれるのは？",
    choices: [
      { id: "226a", text: "絶対に守る、誠実", scores: { attractS: 2, attractJ: 1, independence: 1 } },
      { id: "226b", text: "守るけど理由があれば柔軟", scores: { attractN: 2, attractT: 1 } },
      { id: "226c", text: "小さい約束も全部覚えてる", scores: { attractS: 2, attractF: 1, understandDesire: 1 } },
      { id: "226d", text: "言葉にしなくても暗黙の了解がある", scores: { attractN: 2, attractF: 1, silenceDependency: 2 } },
    ],
  },
  {
    id: 227,
    text: "将来の話、\n惹かれるのは？",
    choices: [
      { id: "227a", text: "具体的なプランがある", scores: { attractS: 3, attractJ: 1, independence: 1 } },
      { id: "227b", text: "大きなビジョンを語る", scores: { attractN: 3, vibeMatch: 1 } },
      { id: "227c", text: "現実的に考えてる", scores: { attractS: 2, attractT: 1, dailyLifeFeel: 1 } },
      { id: "227d", text: "「二人でどうなりたい？」と聞く", scores: { attractF: 2, attractN: 1, loveExpression: 1 } },
    ],
  },
  {
    id: 228,
    text: "弱さの見せ方、\n惹かれるのは？",
    choices: [
      { id: "228a", text: "理由を論理的に説明してくる", scores: { attractT: 3, understandDesire: 1 } },
      { id: "228b", text: "黙って寄りかかってくる", scores: { attractF: 3, saveDesire: 2 } },
      { id: "228c", text: "「疲れた」とだけ言う", scores: { attractS: 1, attractT: 1, awkwardness: 2 } },
      { id: "228d", text: "普段と微妙に違うだけ", scores: { attractN: 1, attractI: 1, lowTempEmotion: 2, understandDesire: 1 } },
    ],
  },
]

// IP: 自由で内向的な人に惹かれるタイプ向け
const phase2IP: readonly Question[] = [
  {
    id: 231,
    text: "独自の世界観、\n惹かれるのは？",
    choices: [
      { id: "231a", text: "理論や仕組みに没頭してる", scores: { attractT: 3, attractN: 1, independence: 2 } },
      { id: "231b", text: "感性や美意識にこだわりがある", scores: { attractF: 3, attractN: 1, urbanSense: 1 } },
      { id: "231c", text: "手を動かして何かを作ってる", scores: { attractS: 3, dailyLifeFeel: 1 } },
      { id: "231d", text: "内面の感情を創作に変えてる", scores: { attractF: 2, attractN: 2, lateNightVibe: 1, understandDesire: 1 } },
    ],
  },
  {
    id: 232,
    text: "距離の詰め方、\n惹かれるのは？",
    choices: [
      { id: "232a", text: "気づいたら隣にいる", scores: { attractF: 2, silenceDependency: 2, loveExpression: 1 } },
      { id: "232b", text: "知識や趣味を共有してくる", scores: { attractT: 2, attractN: 1, understandDesire: 1, conversationDensity: 1 } },
      { id: "232c", text: "何も言わず同じ空間にいる", scores: { attractT: 1, silenceDependency: 3 } },
      { id: "232d", text: "深夜に急に本音を送ってくる", scores: { attractF: 3, lateNightVibe: 2, lineTemperature: 1 } },
    ],
  },
  {
    id: 233,
    text: "集中してるとき、\n惹かれる姿は？",
    choices: [
      { id: "233a", text: "周りが見えなくなってる", scores: { attractT: 2, attractN: 1, independence: 2, lowTempEmotion: 1 } },
      { id: "233b", text: "没頭してるけどこっちにも気づく", scores: { attractF: 2, attractS: 1, caretakerDependency: 1 } },
      { id: "233c", text: "手先が器用に何かを組み立ててる", scores: { attractS: 3, dailyLifeFeel: 1 } },
      { id: "233d", text: "表情が変わって別人みたい", scores: { attractN: 2, attractF: 1, understandDesire: 2 } },
    ],
  },
  {
    id: 234,
    text: "夜、連絡が来るとしたら\n惹かれる内容は？",
    choices: [
      { id: "234a", text: "面白い記事や動画のリンク", scores: { attractT: 2, attractS: 1, distanceSense: 1 } },
      { id: "234b", text: "「今日の月きれいだよ」", scores: { attractF: 2, attractN: 2, lateNightVibe: 2 } },
      { id: "234c", text: "「この前話してたやつ見つけた」", scores: { attractS: 2, attractF: 1, understandDesire: 1 } },
      { id: "234d", text: "「眠れない」とだけ", scores: { attractF: 2, awkwardness: 2, emotionalInstabilityTolerance: 1, saveDesire: 1 } },
    ],
  },
  {
    id: 235,
    text: "人付き合いの仕方、\n惹かれるのは？",
    choices: [
      { id: "235a", text: "必要最小限で合理的", scores: { attractT: 3, distanceSense: 2, lowTempEmotion: 1 } },
      { id: "235b", text: "少数を大切にする", scores: { attractF: 2, humanity: 2 } },
      { id: "235c", text: "誰とでもそつなくこなす", scores: { attractS: 2, attractT: 1, urbanSense: 1 } },
      { id: "235d", text: "合わない人とは無理しない", scores: { attractN: 1, independence: 2, lowTempEmotion: 1 } },
    ],
  },
  {
    id: 236,
    text: "創作や趣味、\n惹かれるのは？",
    choices: [
      { id: "236a", text: "プログラミングやパズル的なもの", scores: { attractT: 3, attractS: 1, independence: 1 } },
      { id: "236b", text: "音楽や絵など感性的なもの", scores: { attractF: 2, attractN: 2, lateNightVibe: 1 } },
      { id: "236c", text: "DIYや料理など実用的なもの", scores: { attractS: 3, dailyLifeFeel: 2 } },
      { id: "236d", text: "文章を書くこと", scores: { attractN: 2, attractF: 1, understandDesire: 1 } },
    ],
  },
  {
    id: 237,
    text: "笑い方、惹かれるのは？",
    choices: [
      { id: "237a", text: "口元だけで笑う", scores: { attractT: 1, lowTempEmotion: 2, urbanSense: 1 } },
      { id: "237b", text: "目が先に笑う", scores: { attractF: 2, humanity: 2, awkwardness: 1 } },
      { id: "237c", text: "声を出さずに肩が揺れる", scores: { attractT: 1, attractI: 1, silenceDependency: 1, awkwardness: 1 } },
      { id: "237d", text: "不意に声出して笑う（普段笑わないのに）", scores: { attractF: 2, attractN: 1, innocenceTolerance: 1, understandDesire: 1 } },
    ],
  },
  {
    id: 238,
    text: "「好き」の伝え方、\n惹かれるのは？",
    choices: [
      { id: "238a", text: "言葉にしないけど行動でわかる", scores: { attractT: 2, attractS: 1, awkwardness: 2, lowTempEmotion: 1 } },
      { id: "238b", text: "深夜に急に「好きだよ」", scores: { attractF: 3, lateNightVibe: 1, lineTemperature: 2, loveExpression: 2 } },
      { id: "238c", text: "考え抜いた言葉で伝える", scores: { attractT: 1, attractN: 2, understandDesire: 1 } },
      { id: "238d", text: "目を見てぼそっと言う", scores: { attractF: 2, awkwardness: 3, loveExpression: 1 } },
    ],
  },
]

export const phase2Questions: Readonly<Record<Phase1Type, readonly Question[]>> = {
  EJ: phase2EJ,
  EP: phase2EP,
  IJ: phase2IJ,
  IP: phase2IP,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Phase 3: 最終深掘り8問 × 4セット = 32問
// 16問の結果からT/F × S/N = NF/NT/SF/STで分岐
// ここが一番刺さる質問。占い師レベル
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// NF: 直感的で感情豊かな人に惹かれるタイプ向け
const phase3NF: readonly Question[] = [
  {
    id: 301,
    text: "その人の\u201C特別な瞬間\u201D\nどこに一番ときめく？",
    choices: [
      { id: "301a", text: "自分にだけ見せる表情があったとき", scores: { understandDesire: 3, loveExpression: 2 } },
      { id: "301b", text: "自分の話を全部覚えていたとき", scores: { caretakerDependency: 2, humanity: 2 } },
      { id: "301c", text: "普段笑わない人が笑ったとき", scores: { awkwardness: 2, lowTempEmotion: 2, saveDesire: 1 } },
      { id: "301d", text: "「いてくれてよかった」と言われたとき", scores: { loveExpression: 3, lineTemperature: 1 } },
    ],
  },
  {
    id: 302,
    text: "「この人、本心見えないな」\nと思う瞬間はどれ？",
    choices: [
      { id: "302a", text: "何考えてるかわからない顔で笑ってるとき", scores: { understandDesire: 3, lowTempEmotion: 1 } },
      { id: "302b", text: "急に距離を取られたとき", scores: { distanceSense: 2, lineTemperature: 1, neglectTolerance: 1 } },
      { id: "302c", text: "こっちの話をやんわり流されたとき", scores: { saveDesire: 2, caretakerDependency: 1 } },
      { id: "302d", text: "「大丈夫」としか言わないとき", scores: { loveExpression: 2, emotionalInstabilityTolerance: 1 } },
    ],
  },
  {
    id: 303,
    text: "深夜、あなたが泣いてたとき。\n一番救われる相手の反応は？",
    choices: [
      { id: "303a", text: "何も聞かず抱きしめてくれる", scores: { loveExpression: 3, silenceDependency: 1 } },
      { id: "303b", text: "「話して」と静かに言ってくれる", scores: { understandDesire: 3, conversationDensity: 1 } },
      { id: "303c", text: "温かい飲み物を黙って出してくれる", scores: { caretakerDependency: 3, awkwardness: 1 } },
      { id: "303d", text: "隣に座って同じ方向を見てくれてる", scores: { silenceDependency: 3, distanceSense: 1 } },
    ],
  },
  {
    id: 304,
    text: "好きな人の「癖」、\n一番記憶に残るのは？",
    choices: [
      { id: "304a", text: "考え事するとき唇を触る", scores: { understandDesire: 2, humanity: 1 } },
      { id: "304b", text: "寂しいとき急に甘えてくる", scores: { emotionalInstabilityTolerance: 2, loveExpression: 1, saveDesire: 1 } },
      { id: "304c", text: "照れると目をそらす", scores: { awkwardness: 3, innocenceTolerance: 1 } },
      { id: "304d", text: "嬉しいとき無言で微笑む", scores: { silenceDependency: 2, lowTempEmotion: 1, humanity: 1 } },
    ],
  },
  {
    id: 305,
    text: "「この人にとっての自分って何だろう」\nどの関係に一番憧れる？",
    choices: [
      { id: "305a", text: "言わなくても全部わかってくれる人", scores: { understandDesire: 3, saveDesire: 1 } },
      { id: "305b", text: "一緒にいるだけで安心する人", scores: { silenceDependency: 2, caretakerDependency: 2 } },
      { id: "305c", text: "隣に並んで歩ける人", scores: { independence: 2, distanceSense: 1 } },
      { id: "305d", text: "何があっても絶対離れない人", scores: { loveExpression: 2, saveDesire: 2 } },
    ],
  },
  {
    id: 306,
    text: "「やばい、好きだ」ってなる\n相手の瞬間、どれが一番刺さる？",
    choices: [
      { id: "306a", text: "何も言ってないのにこっちの考えを当ててきたとき", scores: { silenceDependency: 2, understandDesire: 3 } },
      { id: "306b", text: "ふいに弱いところを見せてきたとき", scores: { saveDesire: 3, emotionalInstabilityTolerance: 1 } },
      { id: "306c", text: "「一緒にいると安心する」って言ってきたとき", scores: { loveExpression: 2, caretakerDependency: 2 } },
      { id: "306d", text: "二人だけの空気が生まれた瞬間", scores: { silenceDependency: 2, distanceSense: 1, lateNightVibe: 1 } },
    ],
  },
  {
    id: 307,
    text: "相手との理想の夜は？",
    choices: [
      { id: "307a", text: "深い話を朝まで", scores: { conversationDensity: 3, lateNightVibe: 2 } },
      { id: "307b", text: "同じ部屋で別々のことをしてる", scores: { silenceDependency: 3, distanceSense: 1 } },
      { id: "307c", text: "映画を観て感想を言い合う", scores: { understandDesire: 2, conversationDensity: 1, humanity: 1 } },
      { id: "307d", text: "布団の中でスマホ見せ合ってる", scores: { dailyLifeFeel: 2, silenceDependency: 1 } },
    ],
  },
  {
    id: 308,
    text: "好きな人との間で\n一番冷めそうな瞬間は？",
    choices: [
      { id: "308a", text: "こっちのことわかってないなって思ったとき", scores: { understandDesire: 3 } },
      { id: "308b", text: "自分がいなくても全然平気そうなとき", scores: { saveDesire: 2, neglectTolerance: 1, lineTemperature: 1 } },
      { id: "308c", text: "前と雰囲気が変わってしまったとき", scores: { lowTempEmotion: 1, humanity: 1, edginessTolerance: 1 } },
      { id: "308d", text: "気持ちを全然言葉にしてくれないとき", scores: { loveExpression: 2, lineTemperature: 2 } },
    ],
  },
]

// NT: 直感的で論理的な人に惹かれるタイプ向け
const phase3NT: readonly Question[] = [
  {
    id: 311,
    text: "会話の中でゾクッとする\n相手の返し、どれが刺さる？",
    choices: [
      { id: "311a", text: "こっちの考えを一瞬で言い当ててくる", scores: { understandDesire: 3, lowTempEmotion: 1 } },
      { id: "311b", text: "想像もしなかった角度から返してくる", scores: { conversationDensity: 2, vibeMatch: 1, independence: 1 } },
      { id: "311c", text: "矛盾を冷静に突いてくる", scores: { lowTempEmotion: 2, edginessTolerance: 2 } },
      { id: "311d", text: "別ルートで同じ結論にたどり着いてる", scores: { understandDesire: 2, silenceDependency: 1 } },
    ],
  },
  {
    id: 312,
    text: "「冷たいな」と思う相手。\nでも惹かれるのはどのパターン？",
    choices: [
      { id: "312a", text: "冷たいけど理由がちゃんとある", scores: { understandDesire: 3, lowTempEmotion: 2 } },
      { id: "312b", text: "みんなに冷たいけど自分にだけ時々温かい", scores: { lowTempEmotion: 2, loveExpression: 1, distanceSense: 1 } },
      { id: "312c", text: "口は冷たいけど行動は温かい", scores: { awkwardness: 2, lowTempEmotion: 1, loveExpression: 1 } },
      { id: "312d", text: "冷たい人には惹かれない", scores: { loveExpression: 2, lineTemperature: 2 } },
    ],
  },
  {
    id: 313,
    text: "議論が白熱したとき、\n惹かれる反応は？",
    choices: [
      { id: "313a", text: "絶対に折れない", scores: { independence: 3, edginessTolerance: 1 } },
      { id: "313b", text: "論理的に負けを認める", scores: { lowTempEmotion: 2, understandDesire: 1, humanity: 1 } },
      { id: "313c", text: "「面白いね」と楽しんでる", scores: { conversationDensity: 2, vibeMatch: 2 } },
      { id: "313d", text: "急に黙って考え込む", scores: { silenceDependency: 1, awkwardness: 2, understandDesire: 1 } },
    ],
  },
  {
    id: 314,
    text: "天才っぽさ、\nどこに惹かれる？",
    choices: [
      { id: "314a", text: "圧倒的な集中力", scores: { independence: 3, lowTempEmotion: 1 } },
      { id: "314b", text: "常識にとらわれない発想", scores: { edginessTolerance: 2, vibeMatch: 1, innocenceTolerance: 1 } },
      { id: "314c", text: "何でもすぐ習得する", scores: { independence: 2, urbanSense: 1 } },
      { id: "314d", text: "社会不適合なのに結果を出す", scores: { edginessTolerance: 3, saveDesire: 1 } },
    ],
  },
  {
    id: 315,
    text: "相手と過ごす時間、\n一番贅沢だと思うのは？",
    choices: [
      { id: "315a", text: "別々のことをして、時々目が合う", scores: { silenceDependency: 3, distanceSense: 1 } },
      { id: "315b", text: "同じ問題について一緒に考える", scores: { conversationDensity: 2, understandDesire: 2 } },
      { id: "315c", text: "何も話さず同じ景色を見てる", scores: { silenceDependency: 2, lateNightVibe: 1 } },
      { id: "315d", text: "お互いの知らないことを教え合う", scores: { conversationDensity: 3, vibeMatch: 1 } },
    ],
  },
  {
    id: 316,
    text: "愛情表現が少ない相手。\n惹かれるのはどのタイプ？",
    choices: [
      { id: "316a", text: "言葉は少ないけど行動で全部見せてくる", scores: { lowTempEmotion: 3, neglectTolerance: 2 } },
      { id: "316b", text: "たまにぼそっと一言だけ言う", scores: { lowTempEmotion: 2, awkwardness: 1 } },
      { id: "316c", text: "年に一回くらい、不意に刺さること言う", scores: { understandDesire: 2, loveExpression: 1 } },
      { id: "316d", text: "愛情表現少ない人には惹かれない", scores: { lineTemperature: 2, loveExpression: 2 } },
    ],
  },
  {
    id: 317,
    text: "壁を作りがちな相手。\n惹かれる距離の取り方は？",
    choices: [
      { id: "317a", text: "時間をかけてじわじわ近づいてくる", scores: { understandDesire: 3, saveDesire: 1 } },
      { id: "317b", text: "同じ距離を保ってただ待ってる", scores: { distanceSense: 2, silenceDependency: 2, neglectTolerance: 1 } },
      { id: "317c", text: "「なんで壁作るの」と正面から聞いてくる", scores: { conversationDensity: 2, lowTempEmotion: 1 } },
      { id: "317d", text: "壁ごと全部受け入れてくれる", scores: { saveDesire: 2, neglectTolerance: 2 } },
    ],
  },
  {
    id: 318,
    text: "ずっと一緒にいたいと思える\n相手との空気感は？",
    choices: [
      { id: "318a", text: "話すたびに新しい発見がある", scores: { conversationDensity: 2, independence: 2 } },
      { id: "318b", text: "何も言わなくても全部通じてる", scores: { silenceDependency: 3, understandDesire: 1 } },
      { id: "318c", text: "お互いの世界に踏み込みすぎない", scores: { distanceSense: 2, independence: 2 } },
      { id: "318d", text: "一緒にいると自分が強くなれる気がする", scores: { saveDesire: 1, loveExpression: 1, vibeMatch: 1 } },
    ],
  },
]

// SF: 現実的で感情豊かな人に惹かれるタイプ向け
const phase3SF: readonly Question[] = [
  {
    id: 321,
    text: "日常の中で\n一番惹かれる瞬間は？",
    choices: [
      { id: "321a", text: "料理を作ってくれてるとき", scores: { caretakerDependency: 3, dailyLifeFeel: 2 } },
      { id: "321b", text: "「今日どうだった？」と聞いてくれるとき", scores: { humanity: 2, loveExpression: 2 } },
      { id: "321c", text: "疲れて寝てる顔を見たとき", scores: { dailyLifeFeel: 2, saveDesire: 1, silenceDependency: 1 } },
      { id: "321d", text: "さりげなく荷物を持ってくれるとき", scores: { caretakerDependency: 2, awkwardness: 1 } },
    ],
  },
  {
    id: 322,
    text: "もし一緒に暮らしたら。\n一番いいなと思う光景は？",
    choices: [
      { id: "322a", text: "自然に家事が回ってる", scores: { dailyLifeFeel: 2, independence: 1 } },
      { id: "322b", text: "玄関で「いってらっしゃい」がある", scores: { loveExpression: 2, humanity: 2, caretakerDependency: 1 } },
      { id: "322c", text: "同じ時間に眠くなる", scores: { dailyLifeFeel: 3 } },
      { id: "322d", text: "それぞれの部屋がある", scores: { distanceSense: 2, silenceDependency: 1 } },
    ],
  },
  {
    id: 323,
    text: "記念日の過ごし方、\n惹かれるのは？",
    choices: [
      { id: "323a", text: "サプライズを用意してくれる", scores: { loveExpression: 3, caretakerDependency: 1 } },
      { id: "323b", text: "いつも通り過ごす", scores: { dailyLifeFeel: 2, lowTempEmotion: 1, distanceSense: 1 } },
      { id: "323c", text: "手紙を書いてくれる", scores: { loveExpression: 2, understandDesire: 1, lineTemperature: 1 } },
      { id: "323d", text: "覚えてくれてるだけで嬉しい", scores: { humanity: 2, awkwardness: 1 } },
    ],
  },
  {
    id: 324,
    text: "体調を崩したとき、\n一番惹かれる対応は？",
    choices: [
      { id: "324a", text: "すぐ駆けつけてくれる", scores: { caretakerDependency: 3, loveExpression: 2 } },
      { id: "324b", text: "必要なものをLINEで聞いてくれる", scores: { caretakerDependency: 2, lineTemperature: 1 } },
      { id: "324c", text: "「無理すんな」と短く言う", scores: { lowTempEmotion: 2, awkwardness: 2 } },
      { id: "324d", text: "そっとしておいてくれる", scores: { distanceSense: 2, neglectTolerance: 1 } },
    ],
  },
  {
    id: 325,
    text: "何気ない日常の中で\n一番ときめく相手の姿は？",
    choices: [
      { id: "325a", text: "隣を歩いてるとき、ふと歩幅を合わせてくる", scores: { silenceDependency: 2, dailyLifeFeel: 2 } },
      { id: "325b", text: "何も言わず自分のために動いてくれてる", scores: { caretakerDependency: 3, loveExpression: 1 } },
      { id: "325c", text: "目が合って、同時に笑ってる", scores: { humanity: 2, vibeMatch: 2 } },
      { id: "325d", text: "毎晩「おやすみ」が来る", scores: { lineTemperature: 2, dailyLifeFeel: 1, loveExpression: 1 } },
    ],
  },
  {
    id: 326,
    text: "「この人とはずっといられるな」\nと思う瞬間は？",
    choices: [
      { id: "326a", text: "好きなものの温度感が同じだったとき", scores: { dailyLifeFeel: 2, understandDesire: 1 } },
      { id: "326b", text: "沈黙が気まずくなかったとき", scores: { silenceDependency: 2, distanceSense: 1 } },
      { id: "326c", text: "身近な人を大事にしてるのを見たとき", scores: { humanity: 3, caretakerDependency: 1 } },
      { id: "326d", text: "自分のこと一番に考えてくれてるのが伝わったとき", scores: { loveExpression: 2, lineTemperature: 1, caretakerDependency: 1 } },
    ],
  },
  {
    id: 327,
    text: "喧嘩の仲直り、\n一番安心するのは？",
    choices: [
      { id: "327a", text: "「ごめんね」とハグ", scores: { loveExpression: 3, innocenceTolerance: 1 } },
      { id: "327b", text: "好きなご飯を作ってくれる", scores: { caretakerDependency: 2, awkwardness: 1, dailyLifeFeel: 1 } },
      { id: "327c", text: "翌日普通に接してくれる", scores: { lowTempEmotion: 1, neglectTolerance: 1, distanceSense: 1 } },
      { id: "327d", text: "ちゃんと話し合う時間を作る", scores: { conversationDensity: 2, loveExpression: 1 } },
    ],
  },
  {
    id: 328,
    text: "ふと「いいな、この時間」\nと思う瞬間は？",
    choices: [
      { id: "328a", text: "二人でスーパーの惣菜を選んでるとき", scores: { dailyLifeFeel: 3, humanity: 1 } },
      { id: "328b", text: "相手が隣で幸せそうにしてるとき", scores: { saveDesire: 2, caretakerDependency: 1 } },
      { id: "328c", text: "「ただいま」「おかえり」が自然に出たとき", scores: { dailyLifeFeel: 2, loveExpression: 1, caretakerDependency: 1 } },
      { id: "328d", text: "将来の話が普通の会話みたいに出てきたとき", scores: { understandDesire: 1, loveExpression: 1, humanity: 1 } },
    ],
  },
]

// ST: 現実的で論理的な人に惹かれるタイプ向け
const phase3ST: readonly Question[] = [
  {
    id: 331,
    text: "頼りになる瞬間、\n一番惹かれるのは？",
    choices: [
      { id: "331a", text: "トラブルを冷静に処理するとき", scores: { lowTempEmotion: 3, independence: 2 } },
      { id: "331b", text: "何も言わず問題を解決してくれるとき", scores: { caretakerDependency: 2, awkwardness: 2 } },
      { id: "331c", text: "的確な判断を一瞬でするとき", scores: { independence: 2, lowTempEmotion: 1, urbanSense: 1 } },
      { id: "331d", text: "「任せて」の一言", scores: { loveExpression: 1, independence: 2 } },
    ],
  },
  {
    id: 332,
    text: "不器用さ、\nどこに惹かれる？",
    choices: [
      { id: "332a", text: "褒め方が下手", scores: { awkwardness: 3, lowTempEmotion: 1 } },
      { id: "332b", text: "甘え方がわからない", scores: { awkwardness: 2, saveDesire: 2 } },
      { id: "332c", text: "感謝の言葉が出てこない", scores: { awkwardness: 2, lowTempEmotion: 2 } },
      { id: "332d", text: "プレゼント選びに困ってる", scores: { awkwardness: 2, humanity: 1, innocenceTolerance: 1 } },
    ],
  },
  {
    id: 333,
    text: "「この人といると安心する」\nどの瞬間にそう思う？",
    choices: [
      { id: "333a", text: "生活がちゃんと回ってる人だとわかったとき", scores: { independence: 3, dailyLifeFeel: 1 } },
      { id: "333b", text: "感情の波が少なくて穏やかなとき", scores: { lowTempEmotion: 2, emotionalInstabilityTolerance: 1 } },
      { id: "333c", text: "小さい約束もちゃんと覚えてたとき", scores: { dailyLifeFeel: 2, humanity: 1 } },
      { id: "333d", text: "トラブルの前で表情が変わらなかったとき", scores: { lowTempEmotion: 3, independence: 1 } },
    ],
  },
  {
    id: 334,
    text: "無言の時間。\n一番惹かれる相手の過ごし方は？",
    choices: [
      { id: "334a", text: "隣で別のことしてるけど空気が柔らかい", scores: { silenceDependency: 3, distanceSense: 1 } },
      { id: "334b", text: "運転しながら音楽だけ流してる", scores: { silenceDependency: 2, lateNightVibe: 1 } },
      { id: "334c", text: "一緒にテレビ見て時々つぶやく", scores: { dailyLifeFeel: 2, silenceDependency: 1 } },
      { id: "334d", text: "無言に耐えられず話しかけてくる", scores: { conversationDensity: 2, lineTemperature: 1 } },
    ],
  },
  {
    id: 335,
    text: "「かっこいい」と思う瞬間は？",
    choices: [
      { id: "335a", text: "運転が上手いとき", scores: { dailyLifeFeel: 1, independence: 1, urbanSense: 1 } },
      { id: "335b", text: "仕事に真剣なとき", scores: { independence: 2, lowTempEmotion: 1 } },
      { id: "335c", text: "黙って問題を片付けるとき", scores: { awkwardness: 2, lowTempEmotion: 2 } },
      { id: "335d", text: "クールなのに動物に弱いとき", scores: { humanity: 2, awkwardness: 1, innocenceTolerance: 1 } },
    ],
  },
  {
    id: 336,
    text: "相手のこだわり、\nどれに惹かれる？",
    choices: [
      { id: "336a", text: "道具や持ち物に拘りがある", scores: { dailyLifeFeel: 2, urbanSense: 1, independence: 1 } },
      { id: "336b", text: "仕事の質に妥協しない", scores: { independence: 3, lowTempEmotion: 1 } },
      { id: "336c", text: "自分ルールがある", scores: { edginessTolerance: 1, independence: 2 } },
      { id: "336d", text: "好きなことへの情熱がすごい", scores: { understandDesire: 1, vibeMatch: 1, humanity: 1 } },
    ],
  },
  {
    id: 337,
    text: "愛情を感じるのは\nどんな瞬間？",
    choices: [
      { id: "337a", text: "車道側をさりげなく歩いてくれる", scores: { caretakerDependency: 2, awkwardness: 1 } },
      { id: "337b", text: "体調の小さな変化に気づいてくれる", scores: { understandDesire: 2, caretakerDependency: 1 } },
      { id: "337c", text: "忙しいのに時間を作ってくれる", scores: { caretakerDependency: 2, lowTempEmotion: 1, loveExpression: 1 } },
      { id: "337d", text: "自分の好みを覚えていてくれる", scores: { understandDesire: 1, caretakerDependency: 2, humanity: 1 } },
    ],
  },
  {
    id: 338,
    text: "「離れられないな」と思わせる\n相手の存在感、どれが近い？",
    choices: [
      { id: "338a", text: "一緒にいると何も怖くない", scores: { caretakerDependency: 2, dailyLifeFeel: 1 } },
      { id: "338b", text: "自分にだけ見せる顔がある", scores: { understandDesire: 3, lowTempEmotion: 1 } },
      { id: "338c", text: "この人の代わりは絶対いない", scores: { loveExpression: 1, independence: 1, saveDesire: 1 } },
      { id: "338d", text: "いつの間にか生活の一部になってる", scores: { dailyLifeFeel: 3, silenceDependency: 1 } },
    ],
  },
]

export const phase3Questions: Readonly<Record<Phase3Type, readonly Question[]>> = {
  NF: phase3NF,
  NT: phase3NT,
  SF: phase3SF,
  ST: phase3ST,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 分岐ロジック
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function determinePhase1Type(scores: AnalysisScores): Phase1Type {
  const e = scores["attractE"] ?? 0
  const i = scores["attractI"] ?? 0
  const j = scores["attractJ"] ?? 0
  const p = scores["attractP"] ?? 0

  const isE = e >= i
  const isJ = j >= p

  if (isE && isJ) return "EJ"
  if (isE && !isJ) return "EP"
  if (!isE && isJ) return "IJ"
  return "IP"
}

export function determinePhase3Type(scores: AnalysisScores): Phase3Type {
  const t = scores["attractT"] ?? 0
  const f = scores["attractF"] ?? 0
  const s = scores["attractS"] ?? 0
  const n = scores["attractN"] ?? 0

  const isN = n >= s
  const isF = f >= t

  if (isN && isF) return "NF"
  if (isN && !isF) return "NT"
  if (!isN && isF) return "SF"
  return "ST"
}

export const TOTAL_QUESTIONS = 24
export const PHASE1_COUNT = 8
export const PHASE2_COUNT = 8
export const PHASE3_COUNT = 8
