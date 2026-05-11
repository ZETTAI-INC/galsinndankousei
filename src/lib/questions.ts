import type { AnalysisScores, Phase1Type, Phase3Type, Question } from "./types"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Phase 1: コア8問
// 観察可能な行動から E/I × J/P を測定。全選択肢が魅力的。
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const phase1Questions: readonly Question[] = [
  {
    id: 1,
    text: "写真フォルダに、\n何が多い人？",
    choices: [
      { id: "1a", text: "空や夕焼けばっかり", scores: { attractI: 3, lateNightVibe: 2, lowTempEmotion: 1 } },
      { id: "1b", text: "友達と撮った集合写真", scores: { attractE: 3, humanity: 2, vibeMatch: 1 } },
      { id: "1c", text: "食べ物と手元のクローズアップ", scores: { attractS: 2, dailyLifeFeel: 2, caretakerDependency: 1 } },
      { id: "1d", text: "知らない街の路地ばっかり", scores: { attractI: 2, urbanSense: 2, independence: 1 } },
    ],
  },
  {
    id: 2,
    text: "朝の挨拶の\nテンポはどんな感じ？",
    choices: [
      { id: "2a", text: "「おはよ！」と声が一段高い", scores: { attractE: 3, vibeMatch: 2, innocenceTolerance: 1 } },
      { id: "2b", text: "目を合わせて軽く頷くだけ", scores: { attractI: 3, lowTempEmotion: 2, distanceSense: 1 } },
      { id: "2c", text: "「ねむ…」って溶けてる", scores: { attractP: 2, dailyLifeFeel: 2, awkwardness: 1 } },
      { id: "2d", text: "「おはよう」と丁寧に言う", scores: { attractJ: 2, urbanSense: 1, humanity: 1 } },
    ],
  },
  {
    id: 3,
    text: "LINEのトーク画面、\n惹かれるのはどれ？",
    choices: [
      { id: "3a", text: "短文と絵文字でテンポよく続く", scores: { attractE: 2, lineTemperature: 2, vibeMatch: 1 } },
      { id: "3b", text: "数日空くけど長文が来る", scores: { attractP: 3, lateNightVibe: 1, neglectTolerance: 1 } },
      { id: "3c", text: "毎晩同じ時間に「おやすみ」", scores: { attractJ: 3, dailyLifeFeel: 1, loveExpression: 1 } },
      { id: "3d", text: "深夜にぽつりと一言だけ", scores: { attractI: 2, lateNightVibe: 2, awkwardness: 1 } },
    ],
  },
  {
    id: 4,
    text: "歩き方で、\nつい目で追うのは？",
    choices: [
      { id: "4a", text: "背筋が真っ直ぐで歩幅が一定", scores: { attractJ: 3, independence: 2, urbanSense: 1 } },
      { id: "4b", text: "リズムよくふらっと寄り道する", scores: { attractP: 3, edginessTolerance: 1, vibeMatch: 1 } },
      { id: "4c", text: "少し前を歩いて振り返ってくれる", scores: { attractE: 2, caretakerDependency: 2, loveExpression: 1 } },
      { id: "4d", text: "ポケットに手を入れて静かに歩く", scores: { attractI: 2, lowTempEmotion: 2, distanceSense: 1 } },
    ],
  },
  {
    id: 5,
    text: "持ってるバッグの中、\n惹かれる中身は？",
    choices: [
      { id: "5a", text: "ポーチで仕切りがきっちり", scores: { attractJ: 3, independence: 1, dailyLifeFeel: 1 } },
      { id: "5b", text: "文庫本とイヤホンが入ってる", scores: { attractI: 3, silenceDependency: 2, lateNightVibe: 1 } },
      { id: "5c", text: "誰かに渡せる小さなお菓子", scores: { attractE: 2, caretakerDependency: 2, humanity: 1 } },
      { id: "5d", text: "全部ぐちゃっと突っ込まれてる", scores: { attractP: 2, dailyLifeFeel: 1, awkwardness: 1 } },
    ],
  },
  {
    id: 6,
    text: "休日の予定の立て方、\n惹かれるのは？",
    choices: [
      { id: "6a", text: "1週間前に「○日空けといて」", scores: { attractJ: 3, loveExpression: 2, caretakerDependency: 1 } },
      { id: "6b", text: "前日の夜に「明日どこ行く？」", scores: { attractP: 3, vibeMatch: 1, lateNightVibe: 1 } },
      { id: "6c", text: "金曜の昼に何件もLINEで盛り上がる", scores: { attractE: 2, conversationDensity: 2, humanity: 1 } },
      { id: "6d", text: "「家でいい？」と静かに送ってくる", scores: { attractI: 2, silenceDependency: 2, dailyLifeFeel: 1 } },
    ],
  },
  {
    id: 7,
    text: "カフェで一人でいるとき、\n惹かれる姿は？",
    choices: [
      { id: "7a", text: "ノートに何か書き込んでる", scores: { attractJ: 2, independence: 2, understandDesire: 1 } },
      { id: "7b", text: "本を読みながら時々窓の外を見てる", scores: { attractI: 3, lateNightVibe: 1, silenceDependency: 1 } },
      { id: "7c", text: "スマホで誰かに長文を返してる", scores: { attractE: 2, lineTemperature: 2, conversationDensity: 1 } },
      { id: "7d", text: "ぼーっと一点を見つめてる", scores: { attractP: 2, lowTempEmotion: 2, edginessTolerance: 1 } },
    ],
  },
  {
    id: 8,
    text: "服装に出る雰囲気、\n惹かれるのは？",
    choices: [
      { id: "8a", text: "毎回シルエットが計算されてる", scores: { attractJ: 3, urbanSense: 2, independence: 1 } },
      { id: "8b", text: "気分でテイストがコロコロ変わる", scores: { attractP: 3, edginessTolerance: 2, innocenceTolerance: 1 } },
      { id: "8c", text: "「これ似合うって言われた」と着てる", scores: { attractE: 2, humanity: 2, vibeMatch: 1 } },
      { id: "8d", text: "同じ服を何枚も持ってそう", scores: { attractI: 2, lowTempEmotion: 2, dailyLifeFeel: 1 } },
    ],
  },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Phase 2: タイプ別8問 × 4セット = 32問
// Phase1の結果で分岐。T/F、S/Nを判定しつつ性格軸も加点
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// EJ: 計画的で社交的なタイプに惹かれる人向け
const phase2EJ: readonly Question[] = [
  {
    id: 201,
    text: "気になる人のスマホ、\n待ち受け画面は？",
    choices: [
      { id: "201a", text: "シンプルな黒一色や時計だけ", scores: { attractT: 3, lowTempEmotion: 2, urbanSense: 1 } },
      { id: "201b", text: "家族やペットの写真", scores: { attractF: 3, humanity: 2, loveExpression: 1 } },
      { id: "201c", text: "目標を書いた壁紙", scores: { attractT: 2, attractS: 1, independence: 2 } },
      { id: "201d", text: "推しの写真や好きな絵", scores: { attractF: 2, attractN: 1, innocenceTolerance: 1 } },
    ],
  },
  {
    id: 202,
    text: "会話で\n「面白いな」と思う瞬間は？",
    choices: [
      { id: "202a", text: "数字や事実をすらっと出してくる", scores: { attractT: 2, attractS: 2, urbanSense: 1 } },
      { id: "202b", text: "「実はこの間ね」と日常を話す", scores: { attractS: 3, dailyLifeFeel: 2, humanity: 1 } },
      { id: "202c", text: "「もしも」の話で盛り上がれる", scores: { attractN: 3, lateNightVibe: 1, vibeMatch: 1 } },
      { id: "202d", text: "誰かの気持ちを丁寧に読み解く", scores: { attractF: 2, attractN: 1, understandDesire: 2 } },
    ],
  },
  {
    id: 203,
    text: "失敗した時の口癖、\n惹かれるのは？",
    choices: [
      { id: "203a", text: "「次はこうするわ」と即切り替え", scores: { attractT: 3, independence: 2, lowTempEmotion: 1 } },
      { id: "203b", text: "「ごめん、迷惑かけた」と先に謝る", scores: { attractF: 3, humanity: 1, awkwardness: 1 } },
      { id: "203c", text: "黙って原因をメモしてる", scores: { attractT: 2, attractS: 1, lowTempEmotion: 1, independence: 1 } },
      { id: "203d", text: "「あー！」と頭抱えて笑い出す", scores: { attractF: 1, vibeMatch: 2, innocenceTolerance: 2 } },
    ],
  },
  {
    id: 204,
    text: "怒ってる時の表情、\n惹かれるのは？",
    choices: [
      { id: "204a", text: "表情を変えず淡々と言葉だけ強くなる", scores: { attractT: 3, lowTempEmotion: 3, distanceSense: 1 } },
      { id: "204b", text: "目が潤んで声が震える", scores: { attractF: 3, emotionalInstabilityTolerance: 2, awkwardness: 1 } },
      { id: "204c", text: "口数が減って黙る", scores: { attractT: 1, attractI: 1, silenceDependency: 2, distanceSense: 1 } },
      { id: "204d", text: "「悲しかった」とだけ言ってくる", scores: { attractF: 2, attractN: 1, lineTemperature: 1, loveExpression: 1 } },
    ],
  },
  {
    id: 205,
    text: "プレゼントを渡す時の言い方、\n惹かれるのは？",
    choices: [
      { id: "205a", text: "「これ、絶対使うと思って」", scores: { attractS: 3, caretakerDependency: 2, understandDesire: 1 } },
      { id: "205b", text: "「意味があるから後で話す」", scores: { attractN: 3, understandDesire: 2, loveExpression: 1 } },
      { id: "205c", text: "黙ってすっと差し出してくる", scores: { attractT: 1, attractI: 1, awkwardness: 3, lowTempEmotion: 1 } },
      { id: "205d", text: "「自分も同じやつ買った」", scores: { attractF: 2, humanity: 2, vibeMatch: 1 } },
    ],
  },
  {
    id: 206,
    text: "相談に乗ってくれる時、\n惹かれる聞き方は？",
    choices: [
      { id: "206a", text: "「事実だけ整理して」と紙にまとめる", scores: { attractT: 3, attractS: 1, independence: 2 } },
      { id: "206b", text: "「うん、しんどかったね」と頷く", scores: { attractF: 3, humanity: 2, caretakerDependency: 1 } },
      { id: "206c", text: "「で、どうしたい？」と最初に聞く", scores: { attractT: 2, attractN: 1, understandDesire: 1, distanceSense: 1 } },
      { id: "206d", text: "「私も同じことあった」と話し始める", scores: { attractF: 2, attractS: 1, humanity: 1, vibeMatch: 1 } },
    ],
  },
  {
    id: 207,
    text: "褒め方で、\n一番嬉しいのは？",
    choices: [
      { id: "207a", text: "「ここの○○が良かった」と具体的", scores: { attractT: 2, attractS: 2, understandDesire: 1 } },
      { id: "207b", text: "「すごい！」と即リアクション", scores: { attractF: 2, attractS: 1, innocenceTolerance: 2 } },
      { id: "207c", text: "「君なら出来ると思ってた」", scores: { attractN: 3, loveExpression: 1, understandDesire: 1 } },
      { id: "207d", text: "何も言わずただ満足そうに頷く", scores: { attractT: 1, awkwardness: 2, lowTempEmotion: 2 } },
    ],
  },
  {
    id: 208,
    text: "会計の時の振る舞い、\n惹かれるのは？",
    choices: [
      { id: "208a", text: "黙って先に払って何も言わない", scores: { attractT: 2, awkwardness: 2, loveExpression: 1, caretakerDependency: 1 } },
      { id: "208b", text: "「次は奢ってね」と笑って払う", scores: { attractF: 2, vibeMatch: 2, humanity: 1 } },
      { id: "208c", text: "割り勘を一瞬で計算してくる", scores: { attractT: 3, attractS: 1, urbanSense: 1, distanceSense: 1 } },
      { id: "208d", text: "ポイントカードを当然のように出す", scores: { attractS: 3, dailyLifeFeel: 2, independence: 1 } },
    ],
  },
]

// EP: 自由で社交的なタイプに惹かれる人向け
const phase2EP: readonly Question[] = [
  {
    id: 211,
    text: "急に誘ってくる時の\n第一声、惹かれるのは？",
    choices: [
      { id: "211a", text: "「今近くにいる、出てこれる？」", scores: { attractS: 3, dailyLifeFeel: 1, vibeMatch: 1 } },
      { id: "211b", text: "「朝焼け見に行かない？」", scores: { attractN: 3, lateNightVibe: 2, edginessTolerance: 1 } },
      { id: "211c", text: "「お腹空いた、付き合って」", scores: { attractS: 2, attractF: 1, caretakerDependency: 1, innocenceTolerance: 1 } },
      { id: "211d", text: "「声聞きたくなった」とだけ", scores: { attractF: 3, lineTemperature: 2, emotionalInstabilityTolerance: 1 } },
    ],
  },
  {
    id: 212,
    text: "盛り上がってる時の\n笑い方、惹かれるのは？",
    choices: [
      { id: "212a", text: "ツボに入って肩を震わせる", scores: { attractT: 2, awkwardness: 1, vibeMatch: 2 } },
      { id: "212b", text: "声を上げて手を叩いて笑う", scores: { attractF: 3, innocenceTolerance: 2, humanity: 1 } },
      { id: "212c", text: "「いや待って」とツッコみながら笑う", scores: { attractT: 3, conversationDensity: 2, vibeMatch: 1 } },
      { id: "212d", text: "目を細めて静かに笑ってる", scores: { attractF: 1, lowTempEmotion: 2, understandDesire: 1, silenceDependency: 1 } },
    ],
  },
  {
    id: 213,
    text: "失敗を打ち明けられた時、\n惹かれる反応は？",
    choices: [
      { id: "213a", text: "「で、原因は？」と冷静に整理", scores: { attractT: 3, lowTempEmotion: 1, independence: 1 } },
      { id: "213b", text: "「大丈夫？」と先に体を心配する", scores: { attractF: 3, caretakerDependency: 2, humanity: 1 } },
      { id: "213c", text: "「あるある、自分もやった」と笑う", scores: { attractS: 2, attractF: 1, vibeMatch: 2 } },
      { id: "213d", text: "「次どうしようか」と未来を見る", scores: { attractN: 3, saveDesire: 1, loveExpression: 1 } },
    ],
  },
  {
    id: 214,
    text: "二人で遊ぶ時、\n惹かれる過ごし方は？",
    choices: [
      { id: "214a", text: "とりあえず街に出てぶらぶら歩く", scores: { attractS: 3, urbanSense: 2, vibeMatch: 1 } },
      { id: "214b", text: "二人で何かを作ったり描いたり", scores: { attractN: 3, understandDesire: 2, innocenceTolerance: 1 } },
      { id: "214c", text: "知らない駅で降りて探検", scores: { attractS: 2, attractN: 1, edginessTolerance: 2 } },
      { id: "214d", text: "家で並んでダラダラ画面見てる", scores: { attractF: 1, dailyLifeFeel: 3, silenceDependency: 1 } },
    ],
  },
  {
    id: 215,
    text: "ちょっとした口論、\n惹かれる返し方は？",
    choices: [
      { id: "215a", text: "正論を一発、淡々と置いてくる", scores: { attractT: 3, lowTempEmotion: 2, distanceSense: 1 } },
      { id: "215b", text: "途中で噴き出して終わる", scores: { attractF: 2, innocenceTolerance: 3, vibeMatch: 1 } },
      { id: "215c", text: "「もうええわ」と立ち上がる", scores: { attractT: 1, distanceSense: 2, neglectTolerance: 2, edginessTolerance: 1 } },
      { id: "215d", text: "ふいに抱きしめて止めてくる", scores: { attractF: 3, loveExpression: 3 } },
    ],
  },
  {
    id: 216,
    text: "気になる人の\nSNSの投稿で惹かれるのは？",
    choices: [
      { id: "216a", text: "今日食べたものを淡々と", scores: { attractS: 3, dailyLifeFeel: 2, humanity: 1 } },
      { id: "216b", text: "夜の街の写真にぽつりと一言", scores: { attractN: 2, lateNightVibe: 3, urbanSense: 1 } },
      { id: "216c", text: "友達と映ってる集合写真", scores: { attractF: 1, humanity: 2, vibeMatch: 2 } },
      { id: "216d", text: "投稿はないけどたまにストーリー", scores: { attractT: 1, distanceSense: 2, lowTempEmotion: 2 } },
    ],
  },
  {
    id: 217,
    text: "お酒が入った時の変化、\n惹かれるのは？",
    choices: [
      { id: "217a", text: "ボケのキレが上がる", scores: { attractT: 2, vibeMatch: 2, conversationDensity: 1 } },
      { id: "217b", text: "急に本音をぽろっと言い出す", scores: { attractN: 2, attractF: 1, lateNightVibe: 2, emotionalInstabilityTolerance: 1 } },
      { id: "217c", text: "何も変わらない、目だけ赤い", scores: { attractT: 3, lowTempEmotion: 3 } },
      { id: "217d", text: "やたらくっついてくる", scores: { attractF: 3, loveExpression: 2, lineTemperature: 1 } },
    ],
  },
  {
    id: 218,
    text: "車の中でかける音楽、\n惹かれるのは？",
    choices: [
      { id: "218a", text: "今週のチャート上位を流してる", scores: { attractS: 3, dailyLifeFeel: 1, vibeMatch: 2 } },
      { id: "218b", text: "誰も知らないアーティストばかり", scores: { attractN: 3, lateNightVibe: 1, independence: 1 } },
      { id: "218c", text: "歌詞を口ずさみながら運転してる", scores: { attractF: 2, attractN: 1, humanity: 1, understandDesire: 1 } },
      { id: "218d", text: "音楽より会話、無音率高め", scores: { attractT: 1, attractS: 1, silenceDependency: 2, conversationDensity: 1 } },
    ],
  },
]

// IJ: 計画的で内向的なタイプに惹かれる人向け
const phase2IJ: readonly Question[] = [
  {
    id: 221,
    text: "二人で黙ってる時、\n惹かれる空気感は？",
    choices: [
      { id: "221a", text: "考え事してるのが背中で伝わる", scores: { attractT: 2, attractN: 1, understandDesire: 2, silenceDependency: 1 } },
      { id: "221b", text: "安心して目を閉じてる", scores: { attractF: 3, silenceDependency: 3 } },
      { id: "221c", text: "本のページをめくる音だけ聞こえる", scores: { attractS: 2, attractI: 1, dailyLifeFeel: 1, lowTempEmotion: 1 } },
      { id: "221d", text: "何か言いたそうに口を開きかける", scores: { attractF: 2, attractN: 1, awkwardness: 3 } },
    ],
  },
  {
    id: 222,
    text: "持ってる本の種類、\n惹かれるのは？",
    choices: [
      { id: "222a", text: "同じ著者の作品が全巻揃ってる", scores: { attractS: 3, independence: 2, dailyLifeFeel: 1 } },
      { id: "222b", text: "ジャンルがバラバラに散らばってる", scores: { attractN: 3, conversationDensity: 1, edginessTolerance: 1 } },
      { id: "222c", text: "実用書と参考書ばっかり", scores: { attractS: 2, attractT: 2, independence: 1 } },
      { id: "222d", text: "哲学書と詩集が混ざってる", scores: { attractN: 2, attractT: 1, lateNightVibe: 2, lowTempEmotion: 1 } },
    ],
  },
  {
    id: 223,
    text: "字の書き方、\n惹かれるのは？",
    choices: [
      { id: "223a", text: "角ばっててはっきり読める", scores: { attractT: 3, urbanSense: 1, independence: 1 } },
      { id: "223b", text: "丸くて少し感情がにじむ", scores: { attractF: 3, humanity: 2, emotionalInstabilityTolerance: 1 } },
      { id: "223c", text: "小さくて整列してる", scores: { attractS: 2, attractT: 1, lowTempEmotion: 1, awkwardness: 1 } },
      { id: "223d", text: "線が長くて流れるよう", scores: { attractN: 2, attractF: 1, lateNightVibe: 1, understandDesire: 1 } },
    ],
  },
  {
    id: 224,
    text: "気遣いの仕方、\n惹かれるのは？",
    choices: [
      { id: "224a", text: "言わないけど飲み物がいつも置いてある", scores: { attractF: 2, attractS: 1, caretakerDependency: 3 } },
      { id: "224b", text: "「眠そうだね」と先に気づく", scores: { attractT: 1, attractF: 2, understandDesire: 2, loveExpression: 1 } },
      { id: "224c", text: "ドアを開ける、椅子を引く、自然", scores: { attractS: 2, urbanSense: 1, caretakerDependency: 1, awkwardness: 1 } },
      { id: "224d", text: "話したくない時はそっとしてくれる", scores: { attractT: 2, distanceSense: 3, neglectTolerance: 1 } },
    ],
  },
  {
    id: 225,
    text: "感情の出方、\n惹かれるのは？",
    choices: [
      { id: "225a", text: "顔は変わらないけど指先が動く", scores: { attractT: 2, awkwardness: 3, lowTempEmotion: 2 } },
      { id: "225b", text: "目だけで全部伝えてくる", scores: { attractF: 2, attractN: 1, understandDesire: 3 } },
      { id: "225c", text: "LINEだけ素直になる", scores: { attractF: 2, lineTemperature: 2, awkwardness: 1, lateNightVibe: 1 } },
      { id: "225d", text: "ずっと一定、笑顔のまま", scores: { attractT: 3, lowTempEmotion: 3, distanceSense: 1 } },
    ],
  },
  {
    id: 226,
    text: "約束に対する姿勢、\n惹かれるのは？",
    choices: [
      { id: "226a", text: "10分前には必ず着いてる", scores: { attractS: 3, independence: 2, loveExpression: 1 } },
      { id: "226b", text: "理由を説明できれば変更も柔軟", scores: { attractN: 2, attractT: 2, urbanSense: 1 } },
      { id: "226c", text: "「来週話したいことある」を忘れない", scores: { attractS: 2, attractF: 1, understandDesire: 2, humanity: 1 } },
      { id: "226d", text: "予定を共有しなくても合う", scores: { attractN: 2, attractF: 1, silenceDependency: 2 } },
    ],
  },
  {
    id: 227,
    text: "将来の話の仕方、\n惹かれるのは？",
    choices: [
      { id: "227a", text: "数字と年単位で具体的に話す", scores: { attractS: 3, independence: 2, urbanSense: 1 } },
      { id: "227b", text: "「こういう暮らしがしたい」と絵を描く", scores: { attractN: 3, vibeMatch: 1, understandDesire: 1 } },
      { id: "227c", text: "「現実的にはこうかな」と冷静", scores: { attractS: 2, attractT: 2, lowTempEmotion: 1, dailyLifeFeel: 1 } },
      { id: "227d", text: "「二人ならどうしたい？」と聞く", scores: { attractF: 2, attractN: 1, loveExpression: 2 } },
    ],
  },
  {
    id: 228,
    text: "疲れてる時の見せ方、\n惹かれるのは？",
    choices: [
      { id: "228a", text: "理由を話して整理しながら愚痴る", scores: { attractT: 3, conversationDensity: 1, understandDesire: 1 } },
      { id: "228b", text: "黙って肩にもたれてくる", scores: { attractF: 3, saveDesire: 3 } },
      { id: "228c", text: "「ちょっと寝るわ」とだけ言う", scores: { attractS: 1, attractT: 1, awkwardness: 2, dailyLifeFeel: 1 } },
      { id: "228d", text: "いつもより一言だけ言葉が短い", scores: { attractN: 1, lowTempEmotion: 2, understandDesire: 2 } },
    ],
  },
]

// IP: 自由で内向的なタイプに惹かれる人向け
const phase2IP: readonly Question[] = [
  {
    id: 231,
    text: "気になる人の\n部屋にあるもの、惹かれるのは？",
    choices: [
      { id: "231a", text: "床に積まれた本と参考資料", scores: { attractT: 3, attractN: 1, independence: 2 } },
      { id: "231b", text: "好きな絵やポスターが壁いっぱい", scores: { attractF: 2, attractN: 2, urbanSense: 1, innocenceTolerance: 1 } },
      { id: "231c", text: "整頓されたデスクと観葉植物", scores: { attractS: 3, dailyLifeFeel: 2, lowTempEmotion: 1 } },
      { id: "231d", text: "書きかけのノートが机に開きっぱなし", scores: { attractF: 2, attractN: 2, lateNightVibe: 2 } },
    ],
  },
  {
    id: 232,
    text: "距離が縮まる瞬間、\n惹かれるのは？",
    choices: [
      { id: "232a", text: "気づくと隣に座ってる", scores: { attractF: 2, silenceDependency: 3, loveExpression: 1 } },
      { id: "232b", text: "好きな本の話を急にしてくる", scores: { attractT: 2, attractN: 1, understandDesire: 2, conversationDensity: 1 } },
      { id: "232c", text: "同じ空間で別のことをしてる", scores: { attractT: 1, silenceDependency: 3, distanceSense: 1 } },
      { id: "232d", text: "深夜に長文LINEが来る", scores: { attractF: 3, lateNightVibe: 3 } },
    ],
  },
  {
    id: 233,
    text: "集中してる時の姿、\n惹かれるのは？",
    choices: [
      { id: "233a", text: "声をかけても気づかないほど没頭", scores: { attractT: 2, attractN: 1, independence: 3 } },
      { id: "233b", text: "没頭してるけどこっちの気配は察する", scores: { attractF: 2, attractS: 1, caretakerDependency: 2 } },
      { id: "233c", text: "手元がせっせと動いてる", scores: { attractS: 3, dailyLifeFeel: 2 } },
      { id: "233d", text: "目の色が普段と全然違う", scores: { attractN: 3, understandDesire: 2 } },
    ],
  },
  {
    id: 234,
    text: "深夜の連絡、\n惹かれる内容は？",
    choices: [
      { id: "234a", text: "「これ読んでみて」と記事のリンク", scores: { attractT: 2, attractS: 1, distanceSense: 1, conversationDensity: 1 } },
      { id: "234b", text: "「月きれいだよ」の一言と写真", scores: { attractF: 2, attractN: 2, lateNightVibe: 3 } },
      { id: "234c", text: "「この前話してたやつ見つけた」", scores: { attractS: 2, attractF: 2, understandDesire: 2 } },
      { id: "234d", text: "「眠れない」だけ送ってくる", scores: { attractF: 2, awkwardness: 2, emotionalInstabilityTolerance: 2, saveDesire: 1 } },
    ],
  },
  {
    id: 235,
    text: "知らない人といる時、\n惹かれる振る舞いは？",
    choices: [
      { id: "235a", text: "必要なことだけ静かに話す", scores: { attractT: 3, distanceSense: 2, lowTempEmotion: 2 } },
      { id: "235b", text: "少数の人とだけ深く話してる", scores: { attractF: 2, humanity: 3, conversationDensity: 1 } },
      { id: "235c", text: "誰とでも当たり障りなくこなす", scores: { attractS: 2, attractT: 1, urbanSense: 2 } },
      { id: "235d", text: "合わないと判断したら早めに離れる", scores: { attractN: 1, independence: 3, edginessTolerance: 1 } },
    ],
  },
  {
    id: 236,
    text: "趣味の続け方、\n惹かれるのは？",
    choices: [
      { id: "236a", text: "一つを何年も静かに続けてる", scores: { attractT: 2, attractS: 1, independence: 3 } },
      { id: "236b", text: "気分で楽器や絵を行き来する", scores: { attractF: 2, attractN: 2, lateNightVibe: 1, innocenceTolerance: 1 } },
      { id: "236c", text: "料理やDIYでものを増やしてる", scores: { attractS: 3, dailyLifeFeel: 3 } },
      { id: "236d", text: "誰にも見せないノートを書き続けてる", scores: { attractN: 3, understandDesire: 2 } },
    ],
  },
  {
    id: 237,
    text: "笑う時の顔、\n惹かれるのは？",
    choices: [
      { id: "237a", text: "口角だけがすっと上がる", scores: { attractT: 1, lowTempEmotion: 3, urbanSense: 1 } },
      { id: "237b", text: "目尻にしわが寄って目が消える", scores: { attractF: 3, humanity: 3 } },
      { id: "237c", text: "声を立てずに肩が震えてる", scores: { attractT: 1, silenceDependency: 2, awkwardness: 2 } },
      { id: "237d", text: "普段クールなのにツボると壊れる", scores: { attractF: 2, attractN: 1, innocenceTolerance: 2, understandDesire: 1 } },
    ],
  },
  {
    id: 238,
    text: "「好き」の伝え方、\n惹かれるのは？",
    choices: [
      { id: "238a", text: "言葉にしない、ただ行動で示す", scores: { attractT: 2, attractS: 1, awkwardness: 3, lowTempEmotion: 1 } },
      { id: "238b", text: "深夜に突然「好きだよ」とLINE", scores: { attractF: 3, lateNightVibe: 2, lineTemperature: 2 } },
      { id: "238c", text: "考え抜いた一言で伝えてくる", scores: { attractT: 2, attractN: 2, understandDesire: 2 } },
      { id: "238d", text: "目を見てぼそっと小声で言う", scores: { attractF: 2, awkwardness: 3, loveExpression: 1 } },
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
// このフェーズは性格軸のみ。MBTI軸は使わない。
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// NF: 直感的で感情豊かなタイプに惹かれる人向け
const phase3NF: readonly Question[] = [
  {
    id: 301,
    text: "ふいに「特別だ」と感じる\n相手の瞬間は？",
    choices: [
      { id: "301a", text: "自分にだけ見せる横顔があるとき", scores: { understandDesire: 3, loveExpression: 2, distanceSense: 1 } },
      { id: "301b", text: "前話した小さい話を覚えてくれてたとき", scores: { caretakerDependency: 2, humanity: 2, understandDesire: 1 } },
      { id: "301c", text: "普段笑わない人がふっと笑ったとき", scores: { awkwardness: 2, lowTempEmotion: 2, saveDesire: 2 } },
      { id: "301d", text: "「いてくれてよかった」と言われたとき", scores: { loveExpression: 3, lineTemperature: 2, humanity: 1 } },
    ],
  },
  {
    id: 302,
    text: "「この人、本心が見えないな」\nと感じる瞬間は？",
    choices: [
      { id: "302a", text: "何も言わずにいつも通り笑ってるとき", scores: { understandDesire: 3, lowTempEmotion: 2, awkwardness: 1 } },
      { id: "302b", text: "返信が急にそっけなくなったとき", scores: { distanceSense: 2, lineTemperature: 2, neglectTolerance: 2 } },
      { id: "302c", text: "こっちの話をやんわり流したとき", scores: { saveDesire: 2, caretakerDependency: 1, distanceSense: 1 } },
      { id: "302d", text: "「大丈夫」しか返ってこないとき", scores: { loveExpression: 1, emotionalInstabilityTolerance: 2, awkwardness: 2 } },
    ],
  },
  {
    id: 303,
    text: "深夜、自分が泣いてた時。\n一番救われる相手の動きは？",
    choices: [
      { id: "303a", text: "何も聞かず黙って抱きしめてくる", scores: { loveExpression: 3, silenceDependency: 2, saveDesire: 1 } },
      { id: "303b", text: "「話して」と静かに隣に座る", scores: { understandDesire: 3, conversationDensity: 1, caretakerDependency: 1 } },
      { id: "303c", text: "温かい飲み物だけ置いてくれる", scores: { caretakerDependency: 3, awkwardness: 2, humanity: 1 } },
      { id: "303d", text: "隣で同じ方向を向いて座る", scores: { silenceDependency: 3, distanceSense: 1, lateNightVibe: 1 } },
    ],
  },
  {
    id: 304,
    text: "好きな人の癖で、\n記憶に焼き付くのは？",
    choices: [
      { id: "304a", text: "考え事で唇を触ってる", scores: { understandDesire: 2, humanity: 1, lateNightVibe: 1 } },
      { id: "304b", text: "寂しい時に急に甘えてくる", scores: { emotionalInstabilityTolerance: 2, loveExpression: 2, saveDesire: 1 } },
      { id: "304c", text: "照れると目をそらして耳が赤い", scores: { awkwardness: 3, innocenceTolerance: 2 } },
      { id: "304d", text: "嬉しい時に無言で微笑む", scores: { silenceDependency: 2, lowTempEmotion: 2, humanity: 1 } },
    ],
  },
  {
    id: 305,
    text: "「こうあれたら」と思う\n関係に近いのは？",
    choices: [
      { id: "305a", text: "言わなくても全部わかる関係", scores: { understandDesire: 3, silenceDependency: 1, saveDesire: 1 } },
      { id: "305b", text: "一緒にいるだけで呼吸が緩む関係", scores: { silenceDependency: 2, caretakerDependency: 2, dailyLifeFeel: 1 } },
      { id: "305c", text: "対等に並んで歩ける関係", scores: { independence: 3, distanceSense: 2 } },
      { id: "305d", text: "何があっても絶対離れない関係", scores: { loveExpression: 2, saveDesire: 3 } },
    ],
  },
  {
    id: 306,
    text: "「やばい、好きだ」と\n決定的になる瞬間は？",
    choices: [
      { id: "306a", text: "言ってないのに考えを当てられた時", scores: { silenceDependency: 2, understandDesire: 3 } },
      { id: "306b", text: "ふいに弱さを見せてきた時", scores: { saveDesire: 3, emotionalInstabilityTolerance: 2 } },
      { id: "306c", text: "「君といると安心する」と言われた時", scores: { loveExpression: 3, caretakerDependency: 2 } },
      { id: "306d", text: "二人にしか分からない空気が生まれた時", scores: { silenceDependency: 2, distanceSense: 1, lateNightVibe: 2 } },
    ],
  },
  {
    id: 307,
    text: "理想の夜の過ごし方、\n惹かれるのは？",
    choices: [
      { id: "307a", text: "深い話を朝までしてる", scores: { conversationDensity: 3, lateNightVibe: 2, understandDesire: 1 } },
      { id: "307b", text: "同じ部屋で別々のことしてる", scores: { silenceDependency: 3, distanceSense: 1, dailyLifeFeel: 1 } },
      { id: "307c", text: "映画を観終わって感想を言い合う", scores: { understandDesire: 2, conversationDensity: 2, humanity: 1 } },
      { id: "307d", text: "布団でスマホ見せ合ってる", scores: { dailyLifeFeel: 3, silenceDependency: 1, innocenceTolerance: 1 } },
    ],
  },
  {
    id: 308,
    text: "「冷めてしまうかも」と\n思う相手の瞬間は？",
    choices: [
      { id: "308a", text: "こっちのこと全然わかってないと気づいた時", scores: { understandDesire: 3, distanceSense: 1 } },
      { id: "308b", text: "自分がいなくても平気そうな時", scores: { saveDesire: 2, neglectTolerance: 2, lineTemperature: 1 } },
      { id: "308c", text: "前と雰囲気が変わってしまった時", scores: { lowTempEmotion: 1, humanity: 1, edginessTolerance: 2 } },
      { id: "308d", text: "気持ちを全然言葉にしてくれない時", scores: { loveExpression: 3, lineTemperature: 2 } },
    ],
  },
]

// NT: 直感的で論理的なタイプに惹かれる人向け
const phase3NT: readonly Question[] = [
  {
    id: 311,
    text: "会話でゾクッとする\n相手の返し、惹かれるのは？",
    choices: [
      { id: "311a", text: "考えを一瞬で言い当ててくる", scores: { understandDesire: 3, lowTempEmotion: 1, edginessTolerance: 1 } },
      { id: "311b", text: "想像してなかった角度から切り返す", scores: { conversationDensity: 2, vibeMatch: 1, independence: 2 } },
      { id: "311c", text: "矛盾を冷静に指摘してくる", scores: { lowTempEmotion: 3, edginessTolerance: 2 } },
      { id: "311d", text: "別ルートで同じ結論にたどり着く", scores: { understandDesire: 2, silenceDependency: 2, distanceSense: 1 } },
    ],
  },
  {
    id: 312,
    text: "「冷たい人だな」と思う相手。\n惹かれるのはどの冷たさ？",
    choices: [
      { id: "312a", text: "冷たいけど理由が論理的", scores: { understandDesire: 3, lowTempEmotion: 2, independence: 1 } },
      { id: "312b", text: "みんなに冷たいけど自分にだけ柔らかい", scores: { lowTempEmotion: 2, loveExpression: 2, distanceSense: 1 } },
      { id: "312c", text: "口は冷たいけど行動は温かい", scores: { awkwardness: 3, lowTempEmotion: 1, loveExpression: 1 } },
      { id: "312d", text: "「冷たい」ように見えて実は不器用", scores: { awkwardness: 2, humanity: 2, saveDesire: 1 } },
    ],
  },
  {
    id: 313,
    text: "議論が白熱した時の\n相手の振る舞い、惹かれるのは？",
    choices: [
      { id: "313a", text: "絶対に折れずに立ち続ける", scores: { independence: 3, edginessTolerance: 2, lowTempEmotion: 1 } },
      { id: "313b", text: "途中で「君が正しい」と認める", scores: { lowTempEmotion: 2, understandDesire: 2, humanity: 1 } },
      { id: "313c", text: "「面白くなってきた」と笑う", scores: { conversationDensity: 2, vibeMatch: 2, edginessTolerance: 1 } },
      { id: "313d", text: "急に黙って深く考え込む", scores: { silenceDependency: 2, awkwardness: 2, understandDesire: 1 } },
    ],
  },
  {
    id: 314,
    text: "天才っぽさを感じる瞬間、\n惹かれるのは？",
    choices: [
      { id: "314a", text: "圧倒的な集中で時間を忘れてる", scores: { independence: 3, lowTempEmotion: 2 } },
      { id: "314b", text: "常識にない発想がぽろっと出る", scores: { edginessTolerance: 2, vibeMatch: 1, innocenceTolerance: 2 } },
      { id: "314c", text: "何でもすぐ習得していく", scores: { independence: 2, urbanSense: 2, distanceSense: 1 } },
      { id: "314d", text: "社会に馴染めないのに結果は出す", scores: { edginessTolerance: 3, saveDesire: 2 } },
    ],
  },
  {
    id: 315,
    text: "一緒に過ごす時間で\n一番贅沢に感じるのは？",
    choices: [
      { id: "315a", text: "別々のことをしながら時々目が合う", scores: { silenceDependency: 3, distanceSense: 2 } },
      { id: "315b", text: "同じ問題について一緒に考えてる", scores: { conversationDensity: 3, understandDesire: 2 } },
      { id: "315c", text: "何も話さず同じ景色を見てる", scores: { silenceDependency: 2, lateNightVibe: 2, lowTempEmotion: 1 } },
      { id: "315d", text: "お互い知らないことを教え合ってる", scores: { conversationDensity: 2, vibeMatch: 1, independence: 1 } },
    ],
  },
  {
    id: 316,
    text: "愛情表現が少ない相手、\n惹かれるパターンは？",
    choices: [
      { id: "316a", text: "言葉は少ないけど行動で全部出す", scores: { lowTempEmotion: 3, neglectTolerance: 1, loveExpression: 1 } },
      { id: "316b", text: "たまに一言だけぼそっと言う", scores: { lowTempEmotion: 2, awkwardness: 3 } },
      { id: "316c", text: "年に一回くらい刺さる事を言う", scores: { understandDesire: 2, loveExpression: 1, lineTemperature: 1 } },
      { id: "316d", text: "表現が下手で照れて避けてる", scores: { awkwardness: 3, innocenceTolerance: 2, saveDesire: 1 } },
    ],
  },
  {
    id: 317,
    text: "壁を作る相手への\n惹かれる近づき方は？",
    choices: [
      { id: "317a", text: "時間をかけて静かに距離を詰めてくる", scores: { understandDesire: 3, saveDesire: 1, silenceDependency: 1 } },
      { id: "317b", text: "同じ距離でじっと待ち続ける", scores: { distanceSense: 2, silenceDependency: 2, neglectTolerance: 2 } },
      { id: "317c", text: "「なんで壁作るの」と正面から聞く", scores: { conversationDensity: 2, lowTempEmotion: 1, edginessTolerance: 1 } },
      { id: "317d", text: "壁ごと全部受け入れて笑う", scores: { saveDesire: 3, neglectTolerance: 2 } },
    ],
  },
  {
    id: 318,
    text: "ずっと一緒にいたい\nと思える空気感は？",
    choices: [
      { id: "318a", text: "話すたびに新しい発見がある", scores: { conversationDensity: 3, independence: 1, understandDesire: 1 } },
      { id: "318b", text: "何も言わなくても通じてる", scores: { silenceDependency: 3, understandDesire: 2 } },
      { id: "318c", text: "お互いの世界に踏み込みすぎない", scores: { distanceSense: 3, independence: 2 } },
      { id: "318d", text: "一緒にいると自分が強くなれる", scores: { saveDesire: 2, loveExpression: 2, vibeMatch: 1 } },
    ],
  },
]

// SF: 現実的で感情豊かなタイプに惹かれる人向け
const phase3SF: readonly Question[] = [
  {
    id: 321,
    text: "日常で「いいな」と思う\n相手の動きは？",
    choices: [
      { id: "321a", text: "鍋の蓋を開けて湯気の匂いを嗅いでる", scores: { caretakerDependency: 3, dailyLifeFeel: 2, humanity: 1 } },
      { id: "321b", text: "「今日どうだった？」と先に聞く", scores: { humanity: 2, loveExpression: 2, lineTemperature: 1 } },
      { id: "321c", text: "ソファで疲れて寝ちゃってる", scores: { dailyLifeFeel: 3, saveDesire: 1, silenceDependency: 1 } },
      { id: "321d", text: "重い荷物をさりげなく持ち替えてくれる", scores: { caretakerDependency: 3, awkwardness: 1 } },
    ],
  },
  {
    id: 322,
    text: "もし一緒に暮らしたら\n一番惹かれる光景は？",
    choices: [
      { id: "322a", text: "気づくと家事が自然に回ってる", scores: { dailyLifeFeel: 3, independence: 1, caretakerDependency: 1 } },
      { id: "322b", text: "玄関で「いってらっしゃい」がある", scores: { loveExpression: 2, humanity: 2, caretakerDependency: 1 } },
      { id: "322c", text: "同じ時間に自然と眠くなる", scores: { dailyLifeFeel: 2, silenceDependency: 2, distanceSense: 1 } },
      { id: "322d", text: "それぞれの趣味の部屋がある", scores: { distanceSense: 2, silenceDependency: 1, independence: 2 } },
    ],
  },
  {
    id: 323,
    text: "記念日の過ごし方、\n惹かれるのは？",
    choices: [
      { id: "323a", text: "前から計画してサプライズを用意してる", scores: { loveExpression: 3, caretakerDependency: 2 } },
      { id: "323b", text: "あえていつも通り穏やかに過ごす", scores: { dailyLifeFeel: 2, lowTempEmotion: 2, distanceSense: 1 } },
      { id: "323c", text: "手紙を書いて渡してくれる", scores: { loveExpression: 2, understandDesire: 2, lineTemperature: 1 } },
      { id: "323d", text: "「覚えててくれたんだ」と相手が照れる", scores: { humanity: 2, awkwardness: 2, innocenceTolerance: 1 } },
    ],
  },
  {
    id: 324,
    text: "体調を崩した時の対応、\n惹かれるのは？",
    choices: [
      { id: "324a", text: "何も言わず家まで来てくれる", scores: { caretakerDependency: 3, loveExpression: 2 } },
      { id: "324b", text: "「何要る？」とLINEで何度も聞く", scores: { caretakerDependency: 2, lineTemperature: 2, humanity: 1 } },
      { id: "324c", text: "「無理すんなよ」と短く言う", scores: { lowTempEmotion: 2, awkwardness: 3 } },
      { id: "324d", text: "「寝てて」とそっとしておいてくれる", scores: { distanceSense: 2, neglectTolerance: 2, silenceDependency: 1 } },
    ],
  },
  {
    id: 325,
    text: "何気ない日常で\n一番ときめく姿は？",
    choices: [
      { id: "325a", text: "歩いてる時、ふっと歩幅が合った", scores: { silenceDependency: 2, dailyLifeFeel: 2, humanity: 1 } },
      { id: "325b", text: "何も言わず先に動いて準備してくれてる", scores: { caretakerDependency: 3, loveExpression: 1, awkwardness: 1 } },
      { id: "325c", text: "目が合って同時に吹き出した", scores: { humanity: 2, vibeMatch: 3 } },
      { id: "325d", text: "毎晩決まった時間に「おやすみ」が来る", scores: { lineTemperature: 3, dailyLifeFeel: 2 } },
    ],
  },
  {
    id: 326,
    text: "「この人とは続くな」\nと思う瞬間は？",
    choices: [
      { id: "326a", text: "好きなものの温度感が似てるとき", scores: { dailyLifeFeel: 2, understandDesire: 2, vibeMatch: 1 } },
      { id: "326b", text: "沈黙が気まずくないと気づいたとき", scores: { silenceDependency: 3, distanceSense: 1 } },
      { id: "326c", text: "身近な人を大事にしてる姿を見たとき", scores: { humanity: 3, caretakerDependency: 1 } },
      { id: "326d", text: "自分のことを一番に考えてくれてるとわかったとき", scores: { loveExpression: 2, lineTemperature: 1, caretakerDependency: 2 } },
    ],
  },
  {
    id: 327,
    text: "喧嘩の仲直り、\n一番安心するのは？",
    choices: [
      { id: "327a", text: "「ごめん」と先に黙ってハグ", scores: { loveExpression: 3, innocenceTolerance: 1, awkwardness: 1 } },
      { id: "327b", text: "好きなご飯を作って待っててくれる", scores: { caretakerDependency: 3, awkwardness: 1, dailyLifeFeel: 1 } },
      { id: "327c", text: "翌朝、何事もなかったように接する", scores: { lowTempEmotion: 2, neglectTolerance: 2, distanceSense: 1 } },
      { id: "327d", text: "「ちゃんと話そう」と時間を作る", scores: { conversationDensity: 3, loveExpression: 1 } },
    ],
  },
  {
    id: 328,
    text: "「この時間いいな」\nと感じる瞬間は？",
    choices: [
      { id: "328a", text: "二人でスーパーの惣菜選んでるとき", scores: { dailyLifeFeel: 3, humanity: 2 } },
      { id: "328b", text: "相手が隣で幸せそうに笑ってるとき", scores: { saveDesire: 2, caretakerDependency: 2, loveExpression: 1 } },
      { id: "328c", text: "「ただいま」「おかえり」が自然に出たとき", scores: { dailyLifeFeel: 2, loveExpression: 2, caretakerDependency: 1 } },
      { id: "328d", text: "将来の話が普通の会話に紛れてたとき", scores: { understandDesire: 2, loveExpression: 1, humanity: 2 } },
    ],
  },
]

// ST: 現実的で論理的なタイプに惹かれる人向け
const phase3ST: readonly Question[] = [
  {
    id: 331,
    text: "頼りになる瞬間、\n一番惹かれるのは？",
    choices: [
      { id: "331a", text: "トラブルを淡々と片付けていく", scores: { lowTempEmotion: 3, independence: 3 } },
      { id: "331b", text: "何も言わず先に問題だけ解決してる", scores: { caretakerDependency: 2, awkwardness: 2, loveExpression: 1 } },
      { id: "331c", text: "状況判断が一瞬で的確", scores: { independence: 2, lowTempEmotion: 2, urbanSense: 1 } },
      { id: "331d", text: "「任せて」と短く一言だけ言う", scores: { loveExpression: 2, independence: 2, awkwardness: 1 } },
    ],
  },
  {
    id: 332,
    text: "不器用さで\nつい惹かれてしまうのは？",
    choices: [
      { id: "332a", text: "褒め方が下手で言葉に詰まる", scores: { awkwardness: 3, lowTempEmotion: 1, humanity: 1 } },
      { id: "332b", text: "甘え方を知らない", scores: { awkwardness: 2, saveDesire: 3 } },
      { id: "332c", text: "感謝が口に出てこない", scores: { awkwardness: 3, lowTempEmotion: 2 } },
      { id: "332d", text: "プレゼント選びで本気で困ってる", scores: { awkwardness: 2, humanity: 2, innocenceTolerance: 2 } },
    ],
  },
  {
    id: 333,
    text: "「安心するな」\nと感じる瞬間は？",
    choices: [
      { id: "333a", text: "生活がちゃんと回ってる人だと気づいた時", scores: { independence: 3, dailyLifeFeel: 2 } },
      { id: "333b", text: "感情の波が少なくて穏やかな時", scores: { lowTempEmotion: 3, emotionalInstabilityTolerance: 1 } },
      { id: "333c", text: "小さい約束をちゃんと覚えてた時", scores: { dailyLifeFeel: 2, humanity: 2, understandDesire: 1 } },
      { id: "333d", text: "トラブル中も表情が変わらなかった時", scores: { lowTempEmotion: 3, independence: 2 } },
    ],
  },
  {
    id: 334,
    text: "無言の時間で\n一番惹かれる相手の過ごし方は？",
    choices: [
      { id: "334a", text: "隣で別のことしてるけど空気が柔らかい", scores: { silenceDependency: 3, distanceSense: 2 } },
      { id: "334b", text: "運転しながら静かに音楽だけ流してる", scores: { silenceDependency: 2, lateNightVibe: 2, urbanSense: 1 } },
      { id: "334c", text: "テレビ見ながら時々独り言が漏れる", scores: { dailyLifeFeel: 3, silenceDependency: 1, humanity: 1 } },
      { id: "334d", text: "無言が長くなるとちょっかい出してくる", scores: { conversationDensity: 2, lineTemperature: 1, innocenceTolerance: 2 } },
    ],
  },
  {
    id: 335,
    text: "「かっこいい」と思う瞬間は？",
    choices: [
      { id: "335a", text: "運転で迷わず判断してる時", scores: { dailyLifeFeel: 1, independence: 2, urbanSense: 2 } },
      { id: "335b", text: "仕事の話をする時、目つきが変わる", scores: { independence: 3, lowTempEmotion: 1, understandDesire: 1 } },
      { id: "335c", text: "黙って問題を片付けて結果を出す", scores: { awkwardness: 2, lowTempEmotion: 3 } },
      { id: "335d", text: "クールなのに動物に弱い", scores: { humanity: 3, awkwardness: 1, innocenceTolerance: 1 } },
    ],
  },
  {
    id: 336,
    text: "相手のこだわり、\nどれに惹かれる？",
    choices: [
      { id: "336a", text: "道具や持ち物のラインが一貫してる", scores: { dailyLifeFeel: 2, urbanSense: 2, independence: 1 } },
      { id: "336b", text: "仕事の質に絶対妥協しない", scores: { independence: 3, lowTempEmotion: 2 } },
      { id: "336c", text: "細かい自分ルールがある", scores: { edginessTolerance: 2, independence: 2, awkwardness: 1 } },
      { id: "336d", text: "好きなものを語る時だけ熱が漏れる", scores: { understandDesire: 2, vibeMatch: 1, humanity: 2 } },
    ],
  },
  {
    id: 337,
    text: "愛情を感じるのは\nどの瞬間？",
    choices: [
      { id: "337a", text: "車道側を自然に歩いてくれる", scores: { caretakerDependency: 3, awkwardness: 1, loveExpression: 1 } },
      { id: "337b", text: "体調の小さい変化を先に気づく", scores: { understandDesire: 3, caretakerDependency: 1 } },
      { id: "337c", text: "忙しいのに時間を作ってくれる", scores: { caretakerDependency: 2, lowTempEmotion: 1, loveExpression: 2 } },
      { id: "337d", text: "好みや習慣を全部覚えてる", scores: { understandDesire: 2, caretakerDependency: 2, humanity: 1 } },
    ],
  },
  {
    id: 338,
    text: "「離れたくない」\nと思う相手の存在感は？",
    choices: [
      { id: "338a", text: "隣にいるだけで何も怖くなくなる", scores: { caretakerDependency: 3, dailyLifeFeel: 1, silenceDependency: 1 } },
      { id: "338b", text: "自分にだけ見せる顔があるとわかった", scores: { understandDesire: 3, lowTempEmotion: 1, distanceSense: 1 } },
      { id: "338c", text: "この人の代わりは絶対いないと感じた", scores: { loveExpression: 2, independence: 1, saveDesire: 2 } },
      { id: "338d", text: "いつの間にか生活の一部になってた", scores: { dailyLifeFeel: 3, silenceDependency: 2 } },
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
