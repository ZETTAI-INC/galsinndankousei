import type { AnalysisResult, AnalysisScores, Gender } from "./types"

interface AxisEntry {
  readonly key: string
  readonly score: number
}

function getSorted(scores: AnalysisScores): readonly AxisEntry[] {
  return Object.entries(scores)
    .map(([key, score]) => ({ key, score }))
    .sort((a, b) => b.score - a.score)
}

function pickRandom<T>(arr: readonly T[], n: number): readonly T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

// ━━━━━━━━━━━━━━━━━━━
// MBTI mapping based on dominant axes
// ━━━━━━━━━━━━━━━━━━━
interface MbtiProfile {
  readonly type: string
  readonly label: string
  readonly axes: readonly string[]
  readonly traits: readonly string[]
  readonly coreDescriptions: readonly string[]
  readonly microTraits: readonly string[]
}

const MBTI_PROFILES: readonly MbtiProfile[] = [
  // ━━━ 既存8タイプ（ガチギャル神トーン） ━━━
  {
    type: "INFP",
    label: "静かな感情の持ち主",
    axes: ["lowTempEmotion", "silenceDependency", "understandDesire", "awkwardness"],
    traits: ["静かな感情", "言葉にならない優しさ", "内側の嵐"],
    coreDescriptions: [
      "いやまって、あんたが沼るの『普段なに考えてるかマジわかんないのに、急に深い話ぶっ込んでくるやつ』でしょ。それな〜。全部言わないからこそ気になるんだよね。言わなかった部分を自分だけが読み取りたいとか、もうそれ趣味じゃん。知らんけど全部見えてるから。",
      "え、待って。あんたさ〜、言葉にするの下手な人のこと放っておけないの草すぎ。スラスラ愛情表現できるやつよりさ、『えっと…その…』って詰まりながら必死に伝えようとしてるやつに全持ちしてるじゃん。あの不器用さに弱いの自覚ないの？は？えぐいて。",
      "完璧なラブレターより書きかけで消した跡あるメモ帳の方が刺さるとか、あんたの性癖マジで面倒くさくて草。うまく言えないけど伝えたい、その矛盾がたまんないんっしょ。てかそれ相手の感情『発掘』したいだけだから。考古学者かよ。",
      "いやまってまって、あんた表面上めっちゃ穏やかなくせに、ふとした瞬間に相手の感情の深さ見えた途端スイッチ入るの怖すぎなんだけど。あの『気づいちゃった…』みたいな顔してるの自分で気づいてる？もう引き返せないやつだから。おわた。",
      "てかさ〜、あんた毎回クール系選んどいて結局めんどくさい恋愛してない？冷たい人の中にある熱探すの好きすぎでしょ。それ恋愛じゃなくて探索だから。知らんけど全部見えてるから。",
    ],
    microTraits: [
      "LINEが遅いのに長文",
      "写真フォルダに空が多い",
      "感情説明が下手",
      "急に弱音を吐く",
      "深夜に散歩する",
      "手書きのメモがある",
      "好きなものを語るとき早口になる",
      "目を見て話すのが少し苦手",
      "ノートの端に落書きがある",
      "急に黙る",
    ],
  },
  {
    type: "INTP",
    label: "思考の迷宮に住む人",
    axes: ["distanceSense", "lowTempEmotion", "independence", "neglectTolerance"],
    traits: ["距離感の美学", "冷たい優しさ", "思考の深度"],
    coreDescriptions: [
      "は？あんたさ〜、ベタベタしてこない人好きなくせに、そいつがふと優しくした瞬間にバグるのマジウケるんだけど。距離あるからこそ1ミリ縮まっただけで心拍爆上がりしてて草。燃費悪すぎてちょっと心配になるレベル。沼すぎ。",
      "いやまって、感情より論理で話す人に安心するとかあんたっぽすぎて草。でもそういうやつがふっと感情的になった瞬間、あんたもう終わりじゃん。ロジカルな人の感情バグ、あれあんた専用トラップだから。毎回引っかかってて学習能力ゼロで草。",
      "え〜、冷静な人が好きなのはわかるよ？でもさ〜、そいつが自分にだけちょっと隙見せた瞬間に全崩壊するのえぐくない？あの『自分だけに見せてくれた』感、一回味わったらもう戻れないっしょ。知ってるよ。全部見えてるから。",
      "てかさ、あんたが惹かれるの結局『頭いいのに生活壊れてるやつ』だから草。思考は完璧なのに冷蔵庫空っぽとか、あの矛盾。放っておけないくせに自分からは絶対踏み込まないの、それ恋愛の迷路じゃんおわた。",
    ],
    microTraits: [
      "既読つけるのが遅い",
      "一人行動に慣れてる",
      "部屋に本が積まれてる",
      "興味ないことへの返事が適当",
      "急に知識を披露する",
      "考え事してると返事しない",
      "カフェで長時間いれる",
      "人混みが苦手",
      "話し始めると止まらない",
      "生活リズムが独特",
    ],
  },
  {
    type: "ISFP",
    label: "静かな生活美の人",
    axes: ["dailyLifeFeel", "humanity", "edginessTolerance", "saveDesire"],
    traits: ["生活感の色気", "崩れた美しさ", "静かな感受性"],
    coreDescriptions: [
      "いやまって、あんた完璧に整った人よりちょっと生活崩れてるやつに惹かれるのえぐすぎ。夜型だったり部屋散らかってたり。完璧じゃない生活感に『自分がここにいていい理由』見つけちゃうとか、それ恋じゃなくて居場所探しだから。知らんけど。",
      "え〜待って、あんたさ〜、整った人より抜けてる人の方が好きなの草。コンビニ弁当の空箱ある部屋とかちょっと伸びた髪とか、そういう生活のほころびに色気感じるとかマジであんたっぽい。不完全の中に美しさ見えちゃうの、才能なのか呪いなのか知らんけど。",
      "は？あんた『ちゃんとした人が好き』とか言うくせに実際ときめくの生活感ダダ漏れのやつじゃん草。財布ボロかったり洗濯物畳んでなかったり。そこに母性出すか恋心出すか自分でもわかってないっしょ？それな〜。",
      "てかさ、あんたの『好き』って相手の生活の隙間に入り込みたい欲だから。きちんとしすぎてる人には入る隙ないじゃん。だからちょっと崩れてるやつ選ぶの。そんでその人の生活を自分色に染めたくなる。えぐ〜。マジで沼すぎ。",
    ],
    microTraits: [
      "「ごめん寝てた」が多い",
      "部屋に少し生活感がある",
      "料理はするけど片付けが遅い",
      "季節の変化に敏感",
      "音楽の趣味に一貫性がある",
      "コンビニで無駄に悩む",
      "少し影がある",
      "夕方が似合う",
      "古着が好き",
      "財布がちょっとボロい",
    ],
  },
  {
    type: "ENFP",
    label: "無邪気な嵐の人",
    axes: ["innocenceTolerance", "vibeMatch", "loveExpression", "lineTemperature"],
    traits: ["無邪気さの破壊力", "真正面の感情", "天然の引力"],
    coreDescriptions: [
      "いやまって、あんた普段は低温な空気感が好きとか言うくせに、真正面から『好き！！！』ってぶつけてくるやつに結局負けるのウケるんだけど草。理屈とか全部吹っ飛ばす直球の感情、あんたの防御全然間に合ってないからね？自覚して？おわた。",
      "え、待って待って。テンション高くてちょっとうるさいやつが急に真剣な顔したとき、あんたもう手遅れじゃん。あのギャップ一回見たら終わりっしょ。ふざけてたのに急に目が本気になるやつ、あれ反則だから。てかあんたそれ毎回やられてて草。",
      "は〜？あんた『静かな恋愛がいい』とか言いながら結局グイグイ来るやつに落ちてんじゃん草草草。自分から行けないからこそ来てくれる人に弱いの、もうそれ全身で『迎えに来て』って叫んでるようなもんだから。それな〜。",
      "いやまって、あんた無邪気にはしゃいでるやつ見ると心拍上がるでしょ。子供みたいにキャッキャしてんのにふと大人の顔する瞬間。あの切り替わりえぐいよね。計算じゃない感情に飢えてんだわあんた。知らんけど全部見えてる。",
    ],
    microTraits: [
      "テンションの波が激しい",
      "スタンプを連打する",
      "「会いたい」をすぐ言う",
      "友達が多い",
      "急に変なこと言う",
      "笑い声が大きい",
      "寂しがり屋なのに隠さない",
      "写真フォルダが友達ばかり",
      "思いつきで行動する",
      "好きな人の前で少し子供になる",
    ],
  },
  {
    type: "INTJ",
    label: "冷静な支配者",
    axes: ["lowTempEmotion", "independence", "urbanSense", "distanceSense"],
    traits: ["知性の冷たさ", "揺るがない軸", "静かな圧"],
    coreDescriptions: [
      "いやまって、あんた自分の世界持ってて簡単に崩れないやつに惹かれるの、それ恋愛っていうかチャレンジだから草。誰にも媚びないあの態度、あんたの中の『崩したい欲』全開にさせるじゃん。崩れない人を崩したいとかもうゲーム感覚じゃん。えぐ。",
      "え〜、あんたさ〜、計画的で感情に振り回されないやつが好きなのわかるけどさ、そういうやつのたまに見せる人間らしさに致命的に弱いのウケるんだけど。完璧な鎧の隙間から感情こぼれた瞬間、あんたの全防御崩壊するっしょ。マジちょろいて草。",
      "は？あんたが惹かれるの『こいつ一人で完結してるじゃん』ってやつでしょ。それな〜。でもそういうやつが自分にだけちょっと頼ってきたとき、もう全部終わりじゃん。『選ばれた感』に弱すぎるんだわ。知らんけど全部見えてる。",
    ],
    microTraits: [
      "スケジュールが整ってる",
      "無駄な会話をしない",
      "部屋が整理されすぎてる",
      "目つきが鋭い",
      "感情を表に出さない",
      "一人でも全く困らない",
      "物事に対して容赦ない",
      "でも急にコーヒーを買ってくる",
      "話に無駄がない",
      "本を読むスピードが異常",
    ],
  },
  {
    type: "INFJ",
    label: "見透かす静寂の人",
    axes: ["understandDesire", "silenceDependency", "saveDesire", "lowTempEmotion"],
    traits: ["見透かす眼差し", "静かな理解", "共鳴する孤独"],
    coreDescriptions: [
      "いやまって、あんた何も言わなくても察してくれる人に惹かれるとか沼すぎ。言葉にする前に理解されるあの感覚に中毒なってるじゃん。でもさ、それ『理解されたい』のか『見透かされたい』のか自分でもわかってないっしょ。は？えぐいて。",
      "え〜待って、あんた自分の内面見抜いてくるやつのこと怖いくせにたまんなく好きなの草。理解されたい欲と見透かされる恐怖の間で毎回揺れてんの、マジであんたの恋愛パターンだから。怖いのに近づくのやめらんないとかもう本能じゃん。おわた。",
      "てかさ〜、あんた『この人なら全部わかってくれる』って思った瞬間に落ちるよね。でもマジで全部わかられるのも怖いんでしょ？だから結局70%くらい理解してくれて残り30%は踏み込まないやつ探してんの。その30%が安全地帯なんだよね。それ見えてるから。知らんけど。",
    ],
    microTraits: [
      "人の変化にすぐ気づく",
      "言葉を選んで話す",
      "一人の時間を大切にする",
      "深い話が好き",
      "人の相談をよく受ける",
      "共感力が異常に高い",
      "でも自分のことは話さない",
      "疲れると急に消える",
      "本質を突く一言が鋭い",
      "目が全部見てる",
    ],
  },
  {
    type: "ISTP",
    label: "不器用な行動派",
    axes: ["awkwardness", "lowTempEmotion", "independence", "dailyLifeFeel"],
    traits: ["言葉より行動", "無骨な優しさ", "読めない距離感"],
    coreDescriptions: [
      "いやまって、あんた口下手なのに行動で全部示してくるやつに弱すぎて草。言葉にしないけどちゃんとそこにいるとか、あの不器用な愛情にやられるの毎回じゃん。学習しろって話だけど、学習したら惹かれなくなるんっしょ。それも知ってる。えぐいわ。",
      "は？あんたが好きなの、感情の言語化壊滅的に下手なくせに行動が全部『好き』って言ってるタイプじゃん草。言わないけど迎えに来る、言わないけど覚えてる。あの行動ひとつひとつに意味読み取りたいんでしょ。それもう解読作業だから。暗号解読班か。",
      "え〜待って、あんた言葉じゃなくて行動信じるタイプじゃん。だから口だけうまいやつには全然落ちないのに、無言で傘差し出してくるやつに全持ちされるの。あんたにとっての『好き』の証明、言葉じゃなくて行動の回数なんだよね。それな〜。知らんけど全部見えてる。",
    ],
    microTraits: [
      "「別に」が口癖",
      "でも迎えに来てくれる",
      "手先が器用",
      "車の運転が上手い",
      "感情の起伏が少ない",
      "でも急に笑う",
      "工具や道具にこだわりがある",
      "人付き合いは最小限",
      "黙って直してくれる",
      "背中で語るタイプ",
    ],
  },
  {
    type: "ENFJ",
    label: "温かい支配者",
    axes: ["caretakerDependency", "loveExpression", "humanity", "conversationDensity"],
    traits: ["包容力の暴力", "世話焼きの沼", "温かい支配"],
    coreDescriptions: [
      "いやまって、あんた世話焼いてくれるやつに弱いのはわかるけどさ〜、その世話焼きの奥に『自分が必要とされたい欲』感じるともっと惹かれるのえぐくない？世話焼く側が実は一番寂しいって見抜いちゃうの、あんたの才能でもあり呪いでもあるから。知らんけど。",
      "は〜？あんたって自分のことより先に人のこと考えるやつに安心するよね。でもそいつが自分を後回しにしてんのがちょっと心配で、だからこそ離れらんなくなるんでしょ。あんたの恋愛だいたい『こいつを守りたい』から始まってて草。沼すぎ。",
      "え、待って。あんた包容力あるやつのこと好きなくせに、そいつが一人で泣いてんの見たら全崩壊するじゃん。強い人の弱さに弱いのマジであんたの恋愛のバグだから草。でもそのバグがあるから深い恋できんだよね。それな〜。えぐいわ。",
    ],
    microTraits: [
      "先にご飯を取り分けてくれる",
      "体調を気にしてくる",
      "「ちゃんと食べた？」が多い",
      "みんなの予定を調整する",
      "気を遣いすぎて疲れてる",
      "でもそれを見せない",
      "相談に乗るのが上手い",
      "自分の弱さは隠す",
      "褒め方が具体的",
      "帰り道の心配をしてくる",
    ],
  },

  // ━━━ 追加8タイプ ━━━
  {
    type: "ISTJ",
    label: "揺るがない土台の人",
    axes: ["independence", "lowTempEmotion", "dailyLifeFeel", "silenceDependency"],
    traits: ["安定の美学", "黙って守る人", "変わらない強さ"],
    coreDescriptions: [
      "いやまって、あんた毎日同じ時間に同じことするやつのこと地味とか思ってないっしょ。むしろ『こいつ絶対ブレない』ってとこに安心してんじゃん。派手さゼロなのにいつの間にか生活の土台になってるやつ。あんたが好きなのそれだから。知らんけど全部見えてる。",
      "は？あんたが惹かれるの言葉少ないけど約束絶対守るやつじゃん草。LINEは事務連絡みたいなくせに、言ったこと全部覚えてて全部やってくれるの。あの信頼感に一回ハマったら抜けらんないっしょ。派手な恋愛より確実な愛取るタイプだよね。えぐ。",
      "え〜待って、あんた変わらないことに安心するタイプなの。流行追わない、ブレない、淡々としてる。でもその淡々の中にちゃんと自分への優先順位あるって気づいた瞬間にもう落ちてるじゃん。地味に見えて地味じゃないんだよねあんたの恋愛。それな〜。",
      "てかさ、あんたが好きなの『黙って全部やっといてくれるやつ』でしょ。派手な愛情表現いらんのよ。ゴミ出ししてくれる、車検予約してくれる。そういう地味な行動の積み重ねがあんたにとっての『好き』の証明なの。マジで沼すぎ。",
    ],
    microTraits: [
      "毎朝同じ時間に起きる",
      "靴がいつも綺麗",
      "財布の中が整理されてる",
      "約束は絶対守る",
      "感情より事実で話す",
      "ルーティンを崩されると不機嫌",
      "でも文句は言わない",
      "持ち物が長持ちする",
      "メモをちゃんと取る",
      "報連相が完璧",
      "時間に正確",
      "言ったことは全部やる",
    ],
  },
  {
    type: "ISFJ",
    label: "静かに支える守り手",
    axes: ["caretakerDependency", "humanity", "silenceDependency", "dailyLifeFeel"],
    traits: ["見えない献身", "静かな愛情", "控えめな強さ"],
    coreDescriptions: [
      "いやまって、あんた派手な愛情表現いらんくせに、さりげなく生活支えてくれるやつに全持ちされるのウケるんだけど。冷蔵庫に勝手にプリン入ってるとか起きたらコーヒー淹れてあるとか。あの『言わないけどやる』に弱すぎでしょ草。沼すぎ。",
      "は？あんたが好きなの自分より先に人のこと考えちゃうやつなの。でもそういうやつが一人で全部抱え込んでんの見ると放っておけないじゃん。世話焼きの世話を焼きたいとか、あんたの恋愛いつもそのパターンだから草。ループじゃん。",
      "え〜待って、あんた控えめな優しさに弱いの？大声で『好き！』とか言わないけど、あんたの好きな食べ物全部覚えてて寒そうにしてたら何も言わず上着かけてくるやつ。あの静かな愛情がたまんないんっしょ。マジでえぐいわ。",
      "てかさ〜、あんたが惹かれるの『自分いなくてもこの人大丈夫だけど、自分いるともっと楽になる』って思える関係じゃん。必要とされたいんじゃなくて役に立ちたいの。その違いわかる人にはわかるから。知らんけど全部見えてる。",
    ],
    microTraits: [
      "冷蔵庫の中身を把握してる",
      "記念日を忘れない",
      "相手の体調の変化に気づく",
      "料理が上手い",
      "部屋がいつも清潔",
      "写真をアルバムにまとめる",
      "「大丈夫？」をよく言う",
      "争いを避ける",
      "自分のことは後回し",
      "手紙を書くのが好き",
      "小さな変化を褒めてくれる",
      "ストックを切らさない",
    ],
  },
  {
    type: "ESTJ",
    label: "頼れる仕切り屋",
    axes: ["independence", "caretakerDependency", "loveExpression", "conversationDensity"],
    traits: ["仕切る力", "責任感の塊", "不器用なリーダー"],
    coreDescriptions: [
      "いやまって、あんた仕切ってくれるやつに弱いの草。『俺がやるから座ってて』とか言われて、表面上は『自分でできるし』って思うくせに内心めっちゃ安心してんじゃん。リードされたいの隠すなって。それな〜。",
      "は？あんたが好きなの責任感の塊みたいなやつでしょ。でもそいつが家ではダラダラしてんの見た瞬間キュンとするのウケるんだけど草。外では完璧なのに家では抜けてるとか、あのギャップに弱いんっしょ。あんた毎回それ。学習しろ。知らんけど。",
      "え〜待って、あんた頼りになるやつに惹かれるくせに、そいつが自分に頼ってきた瞬間にもっと好きになるのえぐすぎ。『こんな強いやつが自分にだけ弱さ見せてくれた』って。それあんたの恋愛スイッチの最強トリガーだから。おわた。",
      "てかさ、あんたが求めてんの結局『安心して任せられるやつ』じゃん。でも全部任せっぱは嫌で二人で決めたいんっしょ。仕切ってくれるけど意見も聞いてくれるやつ。要求高すぎて草。でも見つけたらマジ離さないタイプだよね。えぐ。",
    ],
    microTraits: [
      "予約は絶対自分でする",
      "道に迷わない",
      "後輩の面倒見がいい",
      "締め切りを守る",
      "「任せて」が口癖",
      "ちょっと説教くさい",
      "でも言ってることは正しい",
      "会計をさっとやる",
      "車を出してくれる",
      "困ったときに頼りになる",
      "計画を立てるのが好き",
    ],
  },
  {
    type: "ESFJ",
    label: "みんなの太陽",
    axes: ["caretakerDependency", "humanity", "loveExpression", "lineTemperature"],
    traits: ["世話焼きの天才", "共感の嵐", "温かすぎる距離感"],
    coreDescriptions: [
      "いやまって、あんた自分のこと気にかけてくれるやつに秒で落ちるの草すぎ。『最近疲れてない？』とか『ちゃんと寝てる？』とか、あの温かい言葉のシャワー浴びたら全持ちされるじゃん。あんたが求めてんの恋人じゃなくて『世界一優しい味方』だから。知らんけど。",
      "は？あんた、みんなに優しいやつよりも『みんなに優しいけど自分に一番優しいやつ』に弱いの。差つけてくれるのが嬉しいんっしょ。特別扱いされたいんだよね。全然悪くないから堂々としてて。それな〜。",
      "え〜待って、あんたが好きになるの周りの空気読むの天才的なやつじゃん。でもそいつが空気読みすぎて疲れてんの見たとき『自分だけはこの人の前で素でいさせてあげたい』って思うんっしょ。それもう恋じゃん。えぐいわ。沼すぎ。",
      "てかさ〜、あんた愛情を『量』で測るタイプじゃん。毎日連絡くれる、会うたびに褒めてくれる、覚えてくれてる。その積み重ねがあんたの安心材料なの。一回のデカい告白より毎日の小さな『好き』選ぶじゃん。マジでわかる。知らんけど全部見えてる。",
    ],
    microTraits: [
      "誰かの誕生日を忘れない",
      "グループLINEの盛り上げ役",
      "おすそ分けが多い",
      "「大丈夫？」が口癖",
      "人の話を遮らない",
      "サプライズが好き",
      "みんなの写真を撮る",
      "感謝をちゃんと伝える",
      "空気を読むのが上手い",
      "帰り際に「気をつけてね」",
      "LINEの返信が早い",
      "お土産を必ず買ってくる",
    ],
  },
  {
    type: "ESTP",
    label: "今を生きる挑戦者",
    axes: ["edginessTolerance", "vibeMatch", "independence", "loveExpression"],
    traits: ["瞬発力の魅力", "刺激の中毒", "裏表のない熱量"],
    coreDescriptions: [
      "いやまって、あんた退屈が一番嫌いっしょ。だから安定した恋愛より『次何するかわかんないやつ』に惹かれるの草。思いつきで連れ出してくれるやつ、ノリで遠出するやつ。あの瞬発力にやられるのわかるけど、あんたが求めてんの刺激であって愛情かは別の話だから。知らんけど。",
      "は？あんたが好きなの言葉より行動早いやつでしょ。考える前に動く、失敗しても笑ってる。あの強さに惹かれるのわかるけどさ〜、あんたが本当に沼るのはそいつが一瞬だけ見せる不安な顔じゃん。強い人の弱さ、あんた毎回そこで落ちてて草。ループすぎ。",
      "え〜待って、あんた裏表ないやつが好きなくせに、ちょっとミステリアスな部分あると燃えるのウケるんだけど。全部見せてくれんのにまだ知らない部分ある。その矛盾追いかけてるときが一番楽しいんっしょ。恋愛をアドベンチャーにすんなよ草。えぐ。",
    ],
    microTraits: [
      "フットワークが異常に軽い",
      "「今から行こう」が多い",
      "体を動かすのが好き",
      "決断が早い",
      "退屈すると機嫌が悪くなる",
      "友達が広く浅い",
      "写真よりその瞬間を楽しむ",
      "ノリで買い物する",
      "失敗を引きずらない",
      "声が大きい",
      "目を見て話す",
    ],
  },
  {
    type: "ESFP",
    label: "太陽みたいな存在",
    axes: ["innocenceTolerance", "vibeMatch", "humanity", "loveExpression"],
    traits: ["無条件の明るさ", "全力の今", "愛嬌の天才"],
    coreDescriptions: [
      "いやまって、あんた一緒にいるだけで元気になれるやつに弱いの草。難しい話とかいらんの、ただ笑っててくれればいい。あの無条件の明るさに救われてんの自覚ある？でもさ、そいつが一人で泣いてんの想像したことある？そこまで見れたら本物の恋だから。知らんけど。",
      "は？あんたが好きなの全力で今楽しんでるやつでしょ。計画とか未来とか考えすぎない、今この瞬間が楽しければいいってあの空気感。あんたが普段考えすぎる分そういうやつに引っ張られたいんだよね。それな〜。わかるわかる。沼すぎ。",
      "え〜待って、あんた愛嬌あるやつに弱いの？ちょっとおバカなこと言ってくれるやつ、失敗しても笑い飛ばせるやつ。あの力の抜け加減たまんないんっしょ。でもあんたが本当に惹かれてんのその人の底にある優しさだから。表面だけじゃないのちゃんとわかってるじゃん。えぐいわ。",
      "てかさ、あんたの理想って『こいつといると楽しい』からスタートする恋愛じゃん。条件とか相性とか後回しで、まず一緒にいて楽しいかどうか。シンプルだけどそれが一番難しいの知ってるっしょ。だからこそ見つけたら手放さないタイプだよね。知らんけど全部見えてる。",
    ],
    microTraits: [
      "リアクションが大きい",
      "「楽しい！」をすぐ言う",
      "ダンスが上手い",
      "食べるのが好き",
      "人を褒めるのが自然",
      "パーティーの中心にいる",
      "写真をめっちゃ撮る",
      "服が派手",
      "知らない人ともすぐ仲良くなる",
      "泣くときは号泣",
      "好き嫌いがはっきりしてる",
    ],
  },
  {
    type: "ENTP",
    label: "知的な挑発者",
    axes: ["distanceSense", "vibeMatch", "conversationDensity", "edginessTolerance"],
    traits: ["議論の快感", "飽きない知性", "予測不能の面白さ"],
    coreDescriptions: [
      "いやまって、あんた話してて退屈しないやつに惹かれるのはわかるけどさ〜、反論してくるやつとか予想外の角度から切り込んでくるやつ好きすぎでしょ草。あの知的な刺激ないと恋愛始まんないじゃん。でもさ、議論で勝ちたいくせに負かされた方が燃えるの自分で気づいてる？それ恋愛じゃなくて知的格闘技だから。えぐ。",
      "は？あんたが好きなの頭の回転早いやつでしょ。でもただ頭いいだけじゃダメでユーモアないとあんた5秒で飽きるじゃん草。知性と面白さ両立してるやつめっちゃレア。だからあんたいつも探してんだよね。それな〜。永遠の旅じゃん。",
      "え〜待って、あんた『わかりやすいやつ』に興味ないのウケるんだけど。予測できないやつ、次何言うかわかんないやつ、思考が跳ねるやつ。あのカオスにワクワクすんっしょ。でもそれ裏を返すと安定した恋愛から逃げてるだけかもよ？知らんけど全部見えてる。",
      "てかさ、あんたの恋愛って『こいつと話してると時間溶ける』から始まるじゃん。顔とかスタイルとかじゃなくて会話のテンポとか間の取り方。あんたにとっての相性って全部『会話』に集約されてるから。マジで沼すぎ。おわた。",
    ],
    microTraits: [
      "話が急に飛ぶ",
      "議論すると目が輝く",
      "わざと反対意見を言う",
      "飽き性",
      "アイデアが多いけど実行は別",
      "皮肉が上手い",
      "常識を疑う",
      "いたずら好き",
      "マイナーなものが好き",
      "寝る前に余計なこと考える",
      "ルールを破りたがる",
      "でも根は優しい",
    ],
  },
  {
    type: "ENTJ",
    label: "覇道を行く王者",
    axes: ["independence", "loveExpression", "urbanSense", "conversationDensity"],
    traits: ["圧倒的な推進力", "有言実行の人", "野心の色気"],
    coreDescriptions: [
      "いやまって、あんた目標に向かって突っ走ってるやつに惹かれるのわかるけどさ〜、そいつが自分のために時間作ってくれた瞬間に全崩壊すんのウケるんだけど草。忙しいやつの『空いた時間をあんたに使う』って最強の愛情表現だから。それな〜。えぐいわ。",
      "は？あんたが好きなの野心あるやつっしょ。上目指してるやつ、現状に満足しないやつ、常に成長してるやつ。あの熱量に惹かれるのわかるけど、あんたが本当に沼るのはそいつが自分にだけ見せる甘さじゃん。仕事モードのやつが急にデるの、あんたの最強トリガーだから。知らんけど全部見えてる。",
      "え〜待って、あんた対等な関係求めるタイプじゃん。見下ろされるのも見上げるのも嫌で、横に並んで一緒に走りたい。でもちょっとだけリードしてくれるやつに安心すんっしょ。その微妙なバランス感覚、あんただけの恋愛の公式だから。おわた。沼すぎ。",
    ],
    microTraits: [
      "歩くのが早い",
      "決断が早い",
      "プレゼンが上手い",
      "負けず嫌い",
      "時間を無駄にしない",
      "人を動かすのが上手い",
      "休日も何かしてる",
      "目標を常に持ってる",
      "褒め方がストレート",
      "弱音を吐かない",
      "でもたまに疲れた顔してる",
    ],
  },
]

// ━━━━━━━━━━━━━━━━━━━
// Core analysis: スコア組み合わせで生成
// 3軸以上の条件で、そのパターンの人だけに刺さる結果
// ━━━━━━━━━━━━━━━━━━━
interface ContradictionTemplate {
  readonly condition: (scores: AnalysisScores) => boolean
  readonly specificity: number // 高いほど条件が厳しい = 刺さる
  readonly text: string
}

const CONTRADICTION_POOL: readonly ContradictionTemplate[] = [
  // 3軸以上の高精度テンプレート
  {
    condition: (s) => high(s, "lowTempEmotion") && high(s, "saveDesire") && high(s, "awkwardness"),
    specificity: 9,
    text: "いやまって、あんた毎回同じタイプ選んでんの気づいてる？感情読めないやつ選んどいて、そいつの壊れかけの部分見つけた瞬間に離れらんなくなるじゃん草。あんたの恋愛いっつも『こいつを救えるのは自分だけ』から始まって、『こいつに振り回されてんのも自分だけ』で終わる。そしてまた同じタイプ選ぶ。ループすぎて草。知らんけど全部見えてるから。",
  },
  {
    condition: (s) => high(s, "silenceDependency") && high(s, "loveExpression") && high(s, "lateNightVibe"),
    specificity: 9,
    text: "は？あんた昼間は一緒に黙ってるだけで満足するくせに、深夜になると急に愛情確かめたくなるのえぐすぎ。昼の自分と夜の自分が求めてる人違うじゃん草。でもマジ沼るのは両方を同じ温度で受け止めてくれるやつっしょ。そしてそんなやつほぼいないから、あんたの恋愛いつも片方ずつ満たされて片方ずつ飢えてんの。おわた。",
  },
  {
    condition: (s) => high(s, "distanceSense") && high(s, "understandDesire") && high(s, "neglectTolerance"),
    specificity: 9,
    text: "え、待って。あんた相手のこと全部知りたいくせに自分からは絶対踏み込まないのウケるんだけど。既読無視されても平気なフリしながら相手の投稿くまなくチェックしてんでしょ草。あんたが一番怖いのは『興味持たれなくなること』なのに、興味持ってること悟られるのも怖いとかマジ矛盾の塊じゃん。知らんけど全部見えてるから。",
  },
  {
    condition: (s) => high(s, "caretakerDependency") && high(s, "lowTempEmotion") && high(s, "independence"),
    specificity: 9,
    text: "いやまって、あんたが弱いの『世話焼きだけど愛情表現ド下手なやつ』じゃん草。冷蔵庫に勝手にプリン入れてくるくせに「別に」とか言うやつ。そいつ一人でも全然生きてけるのにあんたの生活だけは気にしてくれるの。その矛盾に何度でも落ちるっしょ。マジであんたそのタイプ専用センサー搭載してるから。えぐ。",
  },
  {
    condition: (s) => high(s, "edginessTolerance") && high(s, "dailyLifeFeel") && high(s, "saveDesire"),
    specificity: 9,
    text: "は〜？あんた生活ちゃんとしてるやつがタイプとか言うくせに、実際惹かれるの冷蔵庫にビールしか入ってないやつじゃん草草草。『こいつの生活立て直したい』っていう欲がいつの間にか恋愛にすり替わってんの。あんたの好きだいたい母性から始まってるから。自覚して。知らんけど全部見えてる。",
  },
  {
    condition: (s) => high(s, "awkwardness") && high(s, "conversationDensity") && high(s, "understandDesire"),
    specificity: 9,
    text: "え、待って待って。普段『うん』しか言わないやつが二人きりになった瞬間30分喋り続けたらあんたもう終わりじゃん草。そいつが他の人には見せない言葉の量を自分にだけ見せてくれてるの。その事実だけであんた3年は引きずれるっしょ。燃費いいのか悪いのかマジわかんない。えぐすぎ。",
  },
  {
    condition: (s) => high(s, "lateNightVibe") && high(s, "emotionalInstabilityTolerance") && high(s, "lineTemperature"),
    specificity: 9,
    text: "いやまって、あんたの恋愛だいたい深夜2時以降に進展してて草。『眠れない』から始まるLINE、夜にだけ崩れる相手の壁、深夜のテンションで送る長文。朝になると『なんであんなこと書いたんだろ』って思うくせにまた夜が来ると同じことすんの。あんたの恋愛太陽が敵じゃん。おわた。知らんけど。",
  },
  {
    condition: (s) => high(s, "innocenceTolerance") && high(s, "lowTempEmotion") && high(s, "vibeMatch"),
    specificity: 8,
    text: "は？あんたクールなやつが好きとか公言しといて無邪気にはしゃいでるやつ見ると心拍上がるのウケるんだけど草。矛盾してるように見えるけど、あんたが本当に弱いの『普段クールなのに自分の前でだけテンションおかしくなるやつ』でしょ。そのギャップ一回見たら最後だから。知らんけど全部見えてる。えぐ。",
  },
  {
    condition: (s) => high(s, "neglectTolerance") && high(s, "lineTemperature") && high(s, "distanceSense"),
    specificity: 8,
    text: "いやまって、あんた3日既読無視されても『まあそういう人だし』って待てるの？それ強さじゃなくて期待しないことで傷つくリスク下げてるだけだから草。だから3日後に急に『今から会える？』来たとき全防御一瞬で崩壊するじゃん。そしてまた3日待つ。あんたの恋愛待機時間の方が長くて草。沼すぎ。",
  },
  {
    condition: (s) => high(s, "independence") && high(s, "caretakerDependency") && high(s, "distanceSense"),
    specificity: 8,
    text: "え〜待って、あんた一人で完結してるやつが好きなくせに、そいつが『お前のことだけは放っておけない』みたいな空気出したとき全持ちされるじゃん草。あんたが欲しいの束縛じゃなくて『選ばれた感覚』。100人の中から自分だけ選ばれるあの特別感に弱すぎるんだわ。知らんけど全部見えてるから。",
  },
  {
    condition: (s) => high(s, "humanity") && high(s, "lowTempEmotion") && high(s, "awkwardness"),
    specificity: 8,
    text: "いやまって、あんたが好きなのって店員に『ありがとうございます』って言えるけど感情言葉にすんのは壊滅的に下手なやつじゃん草。他人には優しくできるのに一番近い人には不器用になるの。あんたはその不器用さを『本物の感情』だと読み取っちゃうんだよね。マジでそれ正解だから安心しな。知らんけど。",
  },
  {
    condition: (s) => high(s, "silenceDependency") && high(s, "understandDesire") && high(s, "distanceSense"),
    specificity: 8,
    text: "は？あんた一緒にいるのに別々のことしてる時間が一番好きとか沼すぎ。でも本当はその沈黙の中で相手が何考えてるか全部知りたいんっしょ。近づきたいのに近づけないの。あんたの理想の距離『手を伸ばせば届くけど伸ばさない距離』だから草。マジ絶妙すぎて相手気づかないよそれ。おわた。",
  },
  {
    condition: (s) => high(s, "saveDesire") && high(s, "emotionalInstabilityTolerance") && high(s, "loveExpression"),
    specificity: 8,
    text: "え〜待って、あんた壊れかけの人に惹かれる自覚あるっしょ。でもやめらんないじゃん草。『大丈夫？』って聞いて『大丈夫』って返されても大丈夫じゃないのわかっちゃう。その『わかってしまう自分』にちょっと酔ってる部分もあるし、それが本気の愛情なのかもわかんなくなってるっしょ。マジ一回冷静になって。知らんけど全部見えてるから。",
  },
  // MBTI次元を使った条件
  {
    condition: (s) => high(s, "attractI") && high(s, "attractP") && high(s, "lateNightVibe"),
    specificity: 7,
    text: "いやまって、あんた自由で内向的なやつ選びがちじゃん草。ノープランで深夜に散歩行けるやつ、既読つけるタイミング読めないやつ、気まぐれだけど一緒にいると不思議と落ち着くやつ。あんたはその『読めなさ』を退屈しない理由にしてるけど、本当は振り回されたいだけっしょ。素直になりなって。知らんけど。",
  },
  {
    condition: (s) => high(s, "attractE") && high(s, "attractJ") && high(s, "awkwardness"),
    specificity: 7,
    text: "は？あんたしっかりしてて社交的なやつがタイプなくせに、惹かれるのそいつの『完璧じゃない部分』でしょ草。予定全部組んでくれるのに自分の感情だけは組み立てらんない。そのほころび見つけた瞬間が恋の始まりじゃん。毎回そこからなの草。ループすぎ。",
  },
  {
    condition: (s) => high(s, "attractI") && high(s, "attractJ") && high(s, "understandDesire"),
    specificity: 7,
    text: "え〜待って、あんたが選ぶの内に秘めたもの多いやつじゃん。整理された部屋、静かな会話、でもその奥にある膨大な感情の蓄積。あんたはそれを一つずつ開けてきたいタイプっしょ。相手にとっての『なんでそこまでわかるの』があんたにとっての最高の褒め言葉だから。知らんけど全部見えてる。えぐ。",
  },
  {
    condition: (s) => high(s, "attractE") && high(s, "attractP") && high(s, "loveExpression"),
    specificity: 7,
    text: "いやまって、あんた感情ストレートにぶつけてくるやつに弱すぎて草。『好き』を迷わず言えるやつ、思いつきで迎えに来るやつ。あんたは自分では絶対それできないからやってくれるやつに何度でも落ちるの。計算じゃない感情に飢えてんだよね。わかるよ、だって自分が計算しちゃうタイプだもん。それな〜。",
  },
  // 2軸（フォールバック用、まだ十分特徴的）
  {
    condition: (s) => high(s, "lowTempEmotion") && high(s, "loveExpression"),
    specificity: 5,
    text: "は〜？あんた感情全部見せないやつに惹かれといてそいつからちゃんと『好き』言ってもらいたいとかマジ注文面倒くさすぎて草。あんたが結局選ぶの99回無表情で1回だけ不意に感情こぼすやつ。その1回のために99回の無表情待てるのマジであんたの才能だよ。普通無理だから。知らんけど全部見えてる。",
  },
  {
    condition: (s) => high(s, "edginessTolerance") && high(s, "caretakerDependency"),
    specificity: 5,
    text: "いやまって、あんたちょっと危ういやつに惹かれるくせにそいつの面倒見たがるのえぐすぎ草。あんたの恋愛には常に『保護者』と『共犯者』の二面性あるから。崩れてる生活立て直してあげたいくせに立て直されたらちょっと物足りなくなるっしょ。あんたは相手が完成する前のバージョンが好きなの。やばいよそれマジで。知らんけど。",
  },
  {
    condition: (s) => high(s, "awkwardness") && high(s, "lineTemperature"),
    specificity: 5,
    text: "え〜待って、あんた不器用なやつが好きなくせにLINEではちゃんと気持ち伝えてほしいとか注文面倒くさすぎて草。それ相手にとってかなりしんどい注文だから。対面では『うん』しか言えないけど夜中に3行の長文来るの。あんたにとっての『愛されてる実感』はその3行じゃん。短いけど重いやつ。知らんけど全部見えてる。",
  },
]

function high(scores: AnalysisScores, axis: string): boolean {
  const val = scores[axis] ?? 0
  const allVals = Object.values(scores).filter((v) => v > 0)
  if (allVals.length === 0) return false
  const sorted = [...allVals].sort((a, b) => b - a)
  const threshold = sorted[Math.min(5, sorted.length - 1)] ?? 0
  return val >= threshold
}

function selectContradictions(scores: AnalysisScores): readonly string[] {
  // specificity順にソートして、最も刺さるものを2つ選ぶ
  const matched = CONTRADICTION_POOL
    .filter((t) => t.condition(scores))
    .sort((a, b) => b.specificity - a.specificity)

  if (matched.length >= 2) {
    return [matched[0].text, matched[1].text]
  }
  if (matched.length === 1) {
    return [matched[0].text]
  }

  // フォールバック：トップ3軸から動的生成
  const sorted = Object.entries(scores)
    .filter(([k]) => !k.startsWith("attract"))
    .sort(([, a], [, b]) => b - a)
  const top3 = sorted.slice(0, 3).map(([k]) => k)

  return [
    `いやまって、あんたのスコアで突出してんの「${axisLabel(top3[0])}」と「${axisLabel(top3[1])}」じゃん草。この組み合わせ、${axisLabel(top3[0])}求めるあまり${axisLabel(top3[1])}に依存するパターン繰り返しやすいから。しかもそれ気づいてんのにやめらんないっしょ。マジループすぎておわた。知らんけど全部見えてるから。`,
  ]
}

function axisLabel(key: string): string {
  const labels: Record<string, string> = {
    lowTempEmotion: "感情を出さない人への執着",
    lateNightVibe: "深夜に本性を見せる人への弱さ",
    urbanSense: "都会的な空気感への渇望",
    dailyLifeFeel: "生活の匂いがする人への安心",
    awkwardness: "不器用さへのときめき",
    neglectTolerance: "放置への耐性",
    loveExpression: "愛情を言葉で求める欲",
    lineTemperature: "連絡頻度への執着",
    humanity: "人間味への渇望",
    emotionalInstabilityTolerance: "情緒不安定な人への共鳴",
    silenceDependency: "沈黙への依存",
    innocenceTolerance: "無邪気さへの弱さ",
    conversationDensity: "深い会話への飢え",
    distanceSense: "距離を保つことへの固執",
    independence: "自立した人への憧れ",
    vibeMatch: "ノリの合う人への引力",
    edginessTolerance: "危うさへの耐性",
    caretakerDependency: "世話を焼かれたい欲",
    understandDesire: "理解したい欲",
    saveDesire: "救いたい欲",
  }
  return labels[key] ?? key
}

// MBTI type → dimension mapping
const MBTI_DIMENSIONS: Record<string, readonly string[]> = {
  INFP: ["attractI", "attractN", "attractF", "attractP"],
  INTP: ["attractI", "attractN", "attractT", "attractP"],
  INFJ: ["attractI", "attractN", "attractF", "attractJ"],
  INTJ: ["attractI", "attractN", "attractT", "attractJ"],
  ISFP: ["attractI", "attractS", "attractF", "attractP"],
  ISTP: ["attractI", "attractS", "attractT", "attractP"],
  ISFJ: ["attractI", "attractS", "attractF", "attractJ"],
  ISTJ: ["attractI", "attractS", "attractT", "attractJ"],
  ENFP: ["attractE", "attractN", "attractF", "attractP"],
  ENTP: ["attractE", "attractN", "attractT", "attractP"],
  ENFJ: ["attractE", "attractN", "attractF", "attractJ"],
  ENTJ: ["attractE", "attractN", "attractT", "attractJ"],
  ESFP: ["attractE", "attractS", "attractF", "attractP"],
  ESTP: ["attractE", "attractS", "attractT", "attractP"],
  ESFJ: ["attractE", "attractS", "attractF", "attractJ"],
  ESTJ: ["attractE", "attractS", "attractT", "attractJ"],
}

function scoreMbti(
  profile: MbtiProfile,
  scores: AnalysisScores
): number {
  // Personality axis score
  const axisScore = profile.axes.reduce((sum, axis, i) => {
    const weight = profile.axes.length - i
    return sum + (scores[axis] ?? 0) * weight
  }, 0)

  // MBTI dimension score (weighted heavily)
  const dims = MBTI_DIMENSIONS[profile.type] ?? []
  const dimScore = dims.reduce((sum, dim) => sum + (scores[dim] ?? 0) * 3, 0)

  return axisScore + dimScore
}

// 性別別の追加microTraits（惹かれる相手のイメージ）
const GENDERED_MICRO_TRAITS: Record<Gender, readonly { readonly trait: string; readonly axes: readonly string[] }[]> = {
  // 男性ユーザー → 惹かれる女性の特徴
  male: [
    { trait: "髪を耳にかける仕草", axes: ["humanity", "innocenceTolerance"] },
    { trait: "ふとした瞬間に香る柔軟剤", axes: ["dailyLifeFeel", "caretakerDependency"] },
    { trait: "笑うと目が三日月になる", axes: ["innocenceTolerance", "humanity"] },
    { trait: "酔うと少しだけ甘えてくる", axes: ["loveExpression", "emotionalInstabilityTolerance"] },
    { trait: "方向音痴だけど一人で行動する", axes: ["independence", "innocenceTolerance"] },
    { trait: "ネイルが控えめ", axes: ["urbanSense", "lowTempEmotion"] },
    { trait: "ヒールじゃなくてスニーカー", axes: ["dailyLifeFeel", "vibeMatch"] },
    { trait: "泣くのを我慢してる顔", axes: ["saveDesire", "awkwardness"] },
    { trait: "声が少し低い", axes: ["lowTempEmotion", "urbanSense"] },
    { trait: "手が小さいのに握力が強い", axes: ["innocenceTolerance", "independence"] },
    { trait: "すっぴんの方がいい", axes: ["dailyLifeFeel", "humanity"] },
    { trait: "古着を着こなしてる", axes: ["urbanSense", "edginessTolerance"] },
    { trait: "天然で気づいてない", axes: ["innocenceTolerance", "humanity"] },
    { trait: "LINEの文末に「。」をつけない", axes: ["lowTempEmotion", "distanceSense"] },
    { trait: "たまにタメ口になる", axes: ["vibeMatch", "innocenceTolerance"] },
    { trait: "鎖骨が綺麗", axes: ["urbanSense", "lowTempEmotion"] },
    { trait: "少し猫背", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "伏し目がちに話す", axes: ["awkwardness", "lowTempEmotion"] },
    { trait: "化粧薄いのに色気がある", axes: ["lowTempEmotion", "urbanSense"] },
    { trait: "本棚に自分と同じ本がある", axes: ["understandDesire", "silenceDependency"] },
  ],
  // 女性ユーザー → 惹かれる男性の特徴
  female: [
    { trait: "腕まくりの仕方が雑", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "運転中にバック見るときの横顔", axes: ["independence", "lowTempEmotion"] },
    { trait: "声が低い", axes: ["lowTempEmotion", "silenceDependency"] },
    { trait: "骨ばった手", axes: ["lowTempEmotion", "urbanSense"] },
    { trait: "横顔のラインが綺麗", axes: ["urbanSense", "lowTempEmotion"] },
    { trait: "ネクタイを緩める仕草", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "怒ってるときに眉間にシワが寄る", axes: ["lowTempEmotion", "edginessTolerance"] },
    { trait: "汗のかき方がきれい", axes: ["dailyLifeFeel", "humanity"] },
    { trait: "荷物を無言で持ってくれる", axes: ["caretakerDependency", "awkwardness"] },
    { trait: "車道側をさりげなく歩く", axes: ["caretakerDependency", "loveExpression"] },
    { trait: "頭ぽんぽんしてくる", axes: ["loveExpression", "innocenceTolerance"] },
    { trait: "シャツのボタンが一個多く開いてる", axes: ["edginessTolerance", "urbanSense"] },
    { trait: "「送るよ」を当然のように言う", axes: ["caretakerDependency", "loveExpression"] },
    { trait: "笑うと急に幼くなる", axes: ["innocenceTolerance", "awkwardness"] },
    { trait: "少しひげが伸びてる", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "香水が控えめ", axes: ["urbanSense", "lowTempEmotion"] },
    { trait: "背筋が伸びてる", axes: ["independence", "urbanSense"] },
    { trait: "めんどくさそうにしながら全部やってくれる", axes: ["awkwardness", "caretakerDependency"] },
    { trait: "酔うと急に目が優しくなる", axes: ["loveExpression", "emotionalInstabilityTolerance"] },
    { trait: "帰り道にコンビニ寄ってくれる", axes: ["caretakerDependency", "dailyLifeFeel"] },
  ],
}

export function generateResult(scores: AnalysisScores, gender: Gender = "female"): AnalysisResult {
  // 1. Core Analysis
  const coreAnalysis = selectContradictions(scores)

  // 2. Rank MBTIs
  const rankedMbtis = [...MBTI_PROFILES]
    .map((profile) => ({
      profile,
      score: scoreMbti(profile, scores),
    }))
    .sort((a, b) => b.score - a.score)

  const top4 = rankedMbtis.slice(0, 4)

  // 3. MBTI Analysis (top 4)
  const mbtiAnalysis = top4.map(({ profile }) => ({
    type: profile.type,
    trait: profile.traits[Math.floor(Math.random() * profile.traits.length)],
    description:
      profile.coreDescriptions[
        Math.floor(Math.random() * profile.coreDescriptions.length)
      ],
  }))

  // 4. Micro Traits - スコアに応じて刺さるものを選ぶ
  const scoredMicroTraits: readonly { readonly trait: string; readonly axes: readonly string[] }[] = [
    // 低温感情系
    { trait: "LINEが遅いのに、来ると長文", axes: ["lowTempEmotion", "awkwardness"] },
    { trait: "「別に」って言いながら迎えに来てくれる", axes: ["lowTempEmotion", "awkwardness"] },
    { trait: "感情の温度が読めないのに、急に優しい", axes: ["lowTempEmotion", "loveExpression"] },
    { trait: "褒め方が下手すぎて逆に刺さる", axes: ["lowTempEmotion", "awkwardness"] },
    { trait: "好きって言えないくせに行動が全部好きって言ってる", axes: ["lowTempEmotion", "loveExpression"] },
    // 深夜系
    { trait: "深夜にだけ本音のLINEが来る", axes: ["lateNightVibe", "lineTemperature"] },
    { trait: "夜になるとテンションが変わる", axes: ["lateNightVibe", "emotionalInstabilityTolerance"] },
    { trait: "「眠れない」って2時に送ってくる", axes: ["lateNightVibe", "emotionalInstabilityTolerance"] },
    { trait: "深夜のコンビニに一緒に行ける", axes: ["lateNightVibe", "dailyLifeFeel"] },
    { trait: "夜の散歩に付き合ってくれる", axes: ["lateNightVibe", "silenceDependency"] },
    // 距離感系
    { trait: "近づきすぎない絶妙な距離感", axes: ["distanceSense", "silenceDependency"] },
    { trait: "用がなくても隣にいる", axes: ["distanceSense", "silenceDependency"] },
    { trait: "既読無視するくせに会うとちゃんと見てくる", axes: ["distanceSense", "neglectTolerance"] },
    { trait: "自分から誘わないけど誘うと必ず来る", axes: ["distanceSense", "awkwardness"] },
    // 不器用系
    { trait: "感情説明が壊滅的に下手", axes: ["awkwardness", "lowTempEmotion"] },
    { trait: "照れると目をそらす", axes: ["awkwardness", "innocenceTolerance"] },
    { trait: "不意に手が触れると固まる", axes: ["awkwardness", "loveExpression"] },
    { trait: "「ごめん寝てた」が口癖", axes: ["awkwardness", "dailyLifeFeel"] },
    { trait: "プレゼント選びで3時間悩んでる", axes: ["awkwardness", "caretakerDependency"] },
    // 生活感系
    { trait: "冷蔵庫に調味料しかない", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "部屋が少し散らかってるけど本だけ整ってる", axes: ["dailyLifeFeel", "understandDesire"] },
    { trait: "洗濯物を畳まずに着る", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "コンビニの袋がキッチンに溜まってる", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "財布がちょっとボロい", axes: ["dailyLifeFeel", "humanity"] },
    // 沈黙系
    { trait: "無言が苦じゃない", axes: ["silenceDependency", "distanceSense"] },
    { trait: "会話が途切れても気まずくならない", axes: ["silenceDependency", "humanity"] },
    { trait: "同じ部屋で別々のことをして満足してる", axes: ["silenceDependency", "independence"] },
    { trait: "目だけで会話が成立する", axes: ["silenceDependency", "understandDesire"] },
    // 愛情表現系
    { trait: "「好き」を言葉じゃなくて行動で見せてくる", axes: ["loveExpression", "awkwardness"] },
    { trait: "急に頭をぽんって触ってくる", axes: ["loveExpression", "innocenceTolerance"] },
    { trait: "寝る前に毎日「おやすみ」だけ送ってくる", axes: ["loveExpression", "lineTemperature"] },
    { trait: "さりげなく車道側を歩く", axes: ["loveExpression", "caretakerDependency"] },
    // 理解欲系
    { trait: "何も言ってないのに考えてることを当ててくる", axes: ["understandDesire", "silenceDependency"] },
    { trait: "前に話したことを全部覚えてる", axes: ["understandDesire", "caretakerDependency"] },
    { trait: "好きなものを語るとき急に早口になる", axes: ["understandDesire", "innocenceTolerance"] },
    { trait: "体調の微妙な変化に気づく", axes: ["understandDesire", "caretakerDependency"] },
    // 救いたい欲系
    { trait: "強がってるけど夜は弱い", axes: ["saveDesire", "emotionalInstabilityTolerance"] },
    { trait: "一人で全部抱え込もうとする", axes: ["saveDesire", "independence"] },
    { trait: "寂しいのに「平気」って言う", axes: ["saveDesire", "awkwardness"] },
    { trait: "泣いてるのを見たことがない（でも泣いてる気がする）", axes: ["saveDesire", "lowTempEmotion"] },
    // 無邪気系
    { trait: "急に変なこと言い出す", axes: ["innocenceTolerance", "vibeMatch"] },
    { trait: "笑い声がうるさい", axes: ["innocenceTolerance", "vibeMatch"] },
    { trait: "好きなものの前でテンションおかしくなる", axes: ["innocenceTolerance", "humanity"] },
    { trait: "思いつきで「行こう」って言ってくる", axes: ["innocenceTolerance", "edginessTolerance"] },
    // 世話焼き系
    { trait: "勝手にご飯作って待ってる", axes: ["caretakerDependency", "dailyLifeFeel"] },
    { trait: "「ちゃんと食べた？」が多い", axes: ["caretakerDependency", "lineTemperature"] },
    { trait: "気づいたら荷物持ってくれてる", axes: ["caretakerDependency", "awkwardness"] },
    // 都市感・独立系
    { trait: "一人でカフェに何時間もいれる", axes: ["urbanSense", "independence"] },
    { trait: "服装に統一感がある", axes: ["urbanSense", "independence"] },
    { trait: "写真フォルダに空が多い", axes: ["urbanSense", "lateNightVibe"] },
    { trait: "SNSのアイコンがたまに変わる", axes: ["urbanSense", "edginessTolerance"] },
    // LINE・連絡系（深掘り）
    { trait: "未読のまま放置するくせに会うと何事もない顔してる", axes: ["neglectTolerance", "lowTempEmotion"] },
    { trait: "スタンプだけで会話成立させてくる", axes: ["lineTemperature", "innocenceTolerance"] },
    { trait: "「了解」だけで終わらせるのに、たまに急に長文", axes: ["lowTempEmotion", "lineTemperature"] },
    { trait: "通話よりテキスト派", axes: ["silenceDependency", "awkwardness"] },
    { trait: "電話出ないくせに折り返しが異常に早い", axes: ["awkwardness", "caretakerDependency"] },
    { trait: "「今何してる？」を絶対自分から送らない", axes: ["distanceSense", "lowTempEmotion"] },
    // 食事・嗜好系
    { trait: "食べるのが遅い", axes: ["silenceDependency", "dailyLifeFeel"] },
    { trait: "好きな食べ物が渋い", axes: ["urbanSense", "independence"] },
    { trait: "コーヒーはブラック", axes: ["lowTempEmotion", "urbanSense"] },
    { trait: "お酒に強いけどあまり飲まない", axes: ["lowTempEmotion", "independence"] },
    { trait: "深夜にカップ麺食べてる", axes: ["lateNightVibe", "dailyLifeFeel"] },
    { trait: "「なんでもいいよ」と言いつつ実は好みがある", axes: ["awkwardness", "lowTempEmotion"] },
    // ファッション・見た目系
    { trait: "服のセンスに統一感がある", axes: ["urbanSense", "independence"] },
    { trait: "黒い服が多い", axes: ["lowTempEmotion", "urbanSense"] },
    { trait: "アクセサリーが少ないけど一つだけこだわりがある", axes: ["lowTempEmotion", "independence"] },
    { trait: "髪が少し長め（もしくは少し伸びてる）", axes: ["edginessTolerance", "dailyLifeFeel"] },
    { trait: "いつも同じ香りがする", axes: ["dailyLifeFeel", "urbanSense"] },
    { trait: "メガネを外した顔にドキッとする", axes: ["awkwardness", "understandDesire"] },
    // 癖・仕草系
    { trait: "考え事のとき唇を触る", axes: ["understandDesire", "humanity"] },
    { trait: "笑うとき口元を隠す", axes: ["awkwardness", "lowTempEmotion"] },
    { trait: "眠くなると急にテンション下がる", axes: ["dailyLifeFeel", "innocenceTolerance"] },
    { trait: "腕まくりの仕方が雑", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "歩くのが少し早い", axes: ["independence", "distanceSense"] },
    { trait: "指が綺麗", axes: ["urbanSense", "lowTempEmotion"] },
    // 音楽・趣味系
    { trait: "イヤホンを片方外してくれる", axes: ["loveExpression", "awkwardness"] },
    { trait: "プレイリストの曲が暗い", axes: ["lateNightVibe", "edginessTolerance"] },
    { trait: "好きなアーティストを語ると止まらない", axes: ["understandDesire", "innocenceTolerance"] },
    { trait: "映画を観た後しばらく黙る", axes: ["silenceDependency", "understandDesire"] },
    { trait: "古い曲を急に流す", axes: ["lateNightVibe", "humanity"] },
    // 感情・関係性系
    { trait: "怒り方が静か", axes: ["lowTempEmotion", "edginessTolerance"] },
    { trait: "嫉妬しても言わない", axes: ["lowTempEmotion", "neglectTolerance"] },
    { trait: "自分の非は認めるけど淡々としてる", axes: ["lowTempEmotion", "independence"] },
    { trait: "泣いてるのを見たことがない", axes: ["lowTempEmotion", "saveDesire"] },
    { trait: "一番辛いときほど笑ってる", axes: ["saveDesire", "emotionalInstabilityTolerance"] },
    { trait: "「ありがとう」の代わりに行動で返す", axes: ["awkwardness", "loveExpression"] },
    // 空間・時間系
    { trait: "帰り道、遠回りを選ぶ", axes: ["lateNightVibe", "silenceDependency"] },
    { trait: "雨の日に少し嬉しそう", axes: ["lateNightVibe", "humanity"] },
    { trait: "朝が弱い", axes: ["lateNightVibe", "dailyLifeFeel"] },
    { trait: "電車で窓の外を見てる", axes: ["silenceDependency", "lateNightVibe"] },
    { trait: "カフェで窓際を選ぶ", axes: ["urbanSense", "silenceDependency"] },
    { trait: "待ち合わせに少し早く来てる", axes: ["caretakerDependency", "awkwardness"] },
    // 対人関係系
    { trait: "「みんな」より「数人」を選ぶ", axes: ["silenceDependency", "distanceSense"] },
    { trait: "店員に少しだけ優しい", axes: ["humanity", "caretakerDependency"] },
    { trait: "子供の扱いが意外とうまい", axes: ["humanity", "innocenceTolerance"] },
    { trait: "動物に話しかける", axes: ["humanity", "innocenceTolerance"] },
    { trait: "人見知りだけど慣れると甘えてくる", axes: ["awkwardness", "loveExpression"] },
    { trait: "急にいなくなる", axes: ["distanceSense", "edginessTolerance"] },
    // 生活系（追加）
    { trait: "冷蔵庫に水とビールしかない", axes: ["edginessTolerance", "dailyLifeFeel"] },
    { trait: "靴が多い", axes: ["urbanSense", "dailyLifeFeel"] },
    { trait: "ベッドの上に物が多い", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "充電器を3本持ってる", axes: ["dailyLifeFeel", "independence"] },
    { trait: "傘を持たない", axes: ["edginessTolerance", "innocenceTolerance"] },
    { trait: "自販機の前で迷う", axes: ["humanity", "innocenceTolerance"] },
    // 知性系
    { trait: "急にWikipediaの話をし始める", axes: ["understandDesire", "innocenceTolerance"] },
    { trait: "考え事してると返事しない", axes: ["independence", "silenceDependency"] },
    { trait: "メモ帳にわけのわからないことが書いてある", axes: ["understandDesire", "edginessTolerance"] },
    { trait: "ニュースより論文を読む", axes: ["independence", "urbanSense"] },
    // SNS系
    { trait: "SNSのアイコンがたまに変わる", axes: ["urbanSense", "edginessTolerance"] },
    { trait: "鍵垢に深夜だけ投稿する", axes: ["lateNightVibe", "distanceSense"] },
    { trait: "フォロワーは多いけど投稿がない", axes: ["distanceSense", "lowTempEmotion"] },
    { trait: "TikTokよりYouTube派", axes: ["silenceDependency", "independence"] },
    { trait: "人の話を最後まで聞く、でも自分の話は短い", axes: ["silenceDependency", "awkwardness"] },
    { trait: "俗っぽすぎない", axes: ["urbanSense", "lowTempEmotion"] },
    { trait: "返信が夜に集中する", axes: ["lateNightVibe", "lineTemperature"] },
  ]

  // スコアに基づいてmicroTraitsを重み付きで選択（性別対応）
  const genderedTraits = GENDERED_MICRO_TRAITS[gender]
  const allScoredTraits = [...scoredMicroTraits, ...genderedTraits]
  const profileTraits = top4.flatMap(({ profile }) => profile.microTraits)
  const weightedTraits = allScoredTraits
    .map((item) => {
      const weight = item.axes.reduce((sum, axis) => sum + (scores[axis] ?? 0), 0)
      return { trait: item.trait, weight }
    })
    .sort((a, b) => b.weight - a.weight)

  const topScoredTraits = weightedTraits.slice(0, 14).map((t) => t.trait)
  const fromProfiles = pickRandom(profileTraits, 8)
  const microTraits = [...new Set([...topScoredTraits, ...fromProfiles])].slice(0, 22)

  // 5. MBTI Ranking
  const mbtiRanking = top4.map(({ profile }) => ({
    type: profile.type,
    label: profile.label,
    reason:
      profile.coreDescriptions[
        Math.floor(Math.random() * profile.coreDescriptions.length)
      ],
  }))

  return {
    coreAnalysis,
    mbtiAnalysis,
    microTraits,
    mbtiRanking,
  }
}
