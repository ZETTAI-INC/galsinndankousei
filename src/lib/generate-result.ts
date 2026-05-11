import type { AnalysisResult, AnalysisScores, Gender } from "./types"
import { detectContradictions } from "./contradictions"

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

// 各MBTIタイプのキャッチーな名前 + ワンライナータグライン + 基準レア度
interface MbtiBadge {
  readonly displayName: string
  readonly tagline: string
  readonly baseRarity: number // 1-15 (低いほどレア)
}

const MBTI_BADGES: Record<string, MbtiBadge> = {
  INFP: {
    displayName: "夜の感情に触れたい型",
    tagline: "言わなかった部分に、いつも惹かれてしまう。",
    baseRarity: 4,
  },
  INTP: {
    displayName: "冷たい奥に火を見つける型",
    tagline: "感情を見せない人の、見せた一瞬に全部もっていかれる。",
    baseRarity: 3,
  },
  INFJ: {
    displayName: "沈黙の中で読み解く型",
    tagline: "察してくれる人に弱いけど、察しすぎる人は怖い。",
    baseRarity: 2,
  },
  INTJ: {
    displayName: "揺るがない人に揺さぶられる型",
    tagline: "崩れない人の、崩れた瞬間がいちばん欲しい。",
    baseRarity: 2,
  },
  ISFP: {
    displayName: "生活のほころびに惹かれる型",
    tagline: "整った人より、少し抜けてる人に安心する。",
    baseRarity: 5,
  },
  ISTP: {
    displayName: "不器用な行動に弱い型",
    tagline: "言葉じゃなくて、行動で全部わかる人がいい。",
    baseRarity: 5,
  },
  ISFJ: {
    displayName: "静かな世話に救われる型",
    tagline: "気づいてくれる小さな優しさが、いちばん効く。",
    baseRarity: 6,
  },
  ISTJ: {
    displayName: "土台が揺るがない人に安心する型",
    tagline: "派手じゃないけど、ずっといてくれる人がいい。",
    baseRarity: 7,
  },
  ENFP: {
    displayName: "直球の感情に堕ちる型",
    tagline: "計算なしの「好き」に、毎回負ける。",
    baseRarity: 6,
  },
  ENTP: {
    displayName: "会話の刺激に酔う型",
    tagline: "頭の回転が早い人の、想定外の返しに弱い。",
    baseRarity: 4,
  },
  ENFJ: {
    displayName: "包まれて溶ける型",
    tagline: "全部受け止めてくれる温度に、いつの間にか沼ってる。",
    baseRarity: 4,
  },
  ENTJ: {
    displayName: "強い意志に溶ける型",
    tagline: "迷わない人の隣で、自分が軽くなる。",
    baseRarity: 3,
  },
  ESFP: {
    displayName: "無邪気さに引きずられる型",
    tagline: "理屈なしのテンションが、いちばん効く薬。",
    baseRarity: 8,
  },
  ESTP: {
    displayName: "自由な熱に巻き込まれる型",
    tagline: "予測不能な人に振り回されたい。本当は。",
    baseRarity: 7,
  },
  ESFJ: {
    displayName: "温かい太陽に焼かれる型",
    tagline: "明るくて優しい人の、ふとした弱さに撃たれる。",
    baseRarity: 9,
  },
  ESTJ: {
    displayName: "頼れる仕切りに弱い型",
    tagline: "全部決めてくれる人に、結局安心しちゃう。",
    baseRarity: 6,
  },
}

const MBTI_PROFILES: readonly MbtiProfile[] = [
  // ━━━ 既存8タイプ（ガチギャル神トーン） ━━━
  {
    type: "INFP",
    label: "静かな感情の持ち主",
    axes: ["lowTempEmotion", "silenceDependency", "understandDesire", "awkwardness"],
    traits: ["静かな感情", "言葉にならない優しさ", "内側の嵐"],
    coreDescriptions: [
      "INFP系の人ってさ、普段穏やかなのに、急に深い話してくることあるじゃん？あなたあれにめっちゃ弱いタイプ。普段見せない顔を自分にだけ見せてくれる、あの感じに毎回やられてる。",
      "あなたってさ、言葉にするの下手な人のこと放っておけないよね。スラスラ愛情表現できる人より、『えっと…その…』って詰まりながら伝えようとしてる人の方がグッとくるタイプ。不器用さに弱いの、自覚ある？",
      "完璧なラブレターより、書きかけで消した跡があるメモの方が刺さるんだよね。うまく言えないけど伝えたい、その矛盾にめっちゃ惹かれる。相手の言葉にならない感情を、自分だけが読み取りたいタイプ。",
      "あなたって表面上は穏やかなのに、ふとした瞬間に相手の感情の深さが見えた途端、スイッチ入っちゃうとこあるよね。『気づいちゃった』みたいな顔、自分でも気づいてないだけで結構出てる。",
      "あなたってさ、感情あんまり出さない人選びがちじゃない？でも実はその人がポロッと弱いとこ見せた瞬間に、もう離れられなくなるタイプ。『この人のこと、自分だけがわかってる』みたいな感覚に酔っちゃうんだよね。気づいてはいるけど、結局毎回同じ恋してる。それがあなたのパターン。",
      "あなたの恋愛、説明しろって言われても説明できないやつだよね。『なんかいいんだよね』『うまく言えないけど』ばっかり。論理じゃ追いつかない次元で人を選んでるから、周りに紹介できる相手が一人もいない。でも本人だけはちゃんと納得してる。それでいいタイプ。",
      "詩集の一行に泣ける人って、たぶんあなた。そういう人ってさ、相手が言わなかった言葉のほうを大事にしちゃうんだよね。沈黙の中に入ってる感情の濃度を読み取る能力が、無駄に高い。だからセリフ多めの恋愛は逆に冷める。",
      "あなたが選ぶ人って、世界の真ん中じゃなくて端っこにいるタイプじゃない？はぐれてる、馴染めない、ちょっと浮いてる。そういう人の中にある『誰にも見せてない世界』を、自分だけが入れる場所だと信じたい。そのロマンが、あなたを動かしてる。",
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
      "小説の好きな一節をそらで言える",
      "嫌いな音にすぐ気づく",
      "プレイリストに季節がある",
      "感情を絵文字で誤魔化す",
      "雨の日だけ饒舌になる",
      "自分のことを話すと急に早口",
      "好きな映画を3回以上観てる",
      "メモアプリに未送信の長文が眠ってる",
    ],
  },
  {
    type: "INTP",
    label: "思考の迷宮に住む人",
    axes: ["distanceSense", "lowTempEmotion", "independence", "neglectTolerance"],
    traits: ["距離感の美学", "冷たい優しさ", "思考の深度"],
    coreDescriptions: [
      "あなたってベタベタしてこない人が好きなのに、その人がふと優しくした瞬間にめっちゃ動揺するタイプじゃない？距離があるからこそ、1ミリ縮まっただけで心拍上がっちゃう感じ。燃費悪いって自分でも思うでしょ。",
      "感情より論理で話す人に安心するの、あなたっぽいよね。でもそういう人がふっと感情的になった瞬間、もうダメになっちゃう。ロジカルな人の感情バグに、毎回ちゃんとやられてる。",
      "冷静な人が好きなのはわかる。でもさ、その人が自分にだけ隙を見せた瞬間に全崩壊するの、自覚あるよね。『自分だけに見せてくれた』っていう特別感、一度味わったらもう戻れないんだよね。",
      "あなたが惹かれるのって結局『頭いいのに生活ちょっと壊れてる人』なんだよね。思考は完璧なのに冷蔵庫は空っぽ、みたいな。放っておけないくせに、自分から踏み込むのは絶対しないっていう、面倒な恋愛してるタイプ。",
      "あなたって会話の『密度』で人を選んでるとこあるよね。喋る量じゃない、一言の中にどれだけ情報が入ってるか。情報量の少ない人とは10分で疲れる。だから恋人候補は基本、無口で頭の良い人になりがち。世間的にはとっつきにくい、と言われるタイプを選ぶ。",
      "あなたが落ちる瞬間って、相手が自分のしょうもないボケに、3秒くらい考えてから真顔で返してきたときじゃない？感情じゃなくて知性で殴り返してくる感じ。あれにキュンとくるの、もはやマニアの域。普通の女子の好きポイントとはちょっと違う。",
      "あなたの好きって、好奇心とほぼ同じ。『この人のこと知りたい』って思った瞬間に好きが始まって、全部わかったと思った瞬間に冷める。だから一生謎を残してくれる人にしか、ハマれない。難易度高すぎる恋愛してる自覚、あった方がいいかも。",
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
      "Wikipediaのリンクを延々と辿ってる",
      "感情論より構造で説明したがる",
      "コーヒーの淹れ方にこだわりがある",
      "服はシンプルなのに一点だけ高い",
      "好きなものを語るとき急に早口",
      "雑談が苦手だけど深い話は好き",
      "通知をオフにしてる",
    ],
  },
  {
    type: "ISFP",
    label: "静かな生活美の人",
    axes: ["dailyLifeFeel", "humanity", "edginessTolerance", "saveDesire"],
    traits: ["生活感の色気", "崩れた美しさ", "静かな感受性"],
    coreDescriptions: [
      "あなたって完璧に整った人より、ちょっと生活崩れてる人に惹かれるよね。夜型だったり部屋が散らかってたり。完璧じゃない生活感の中に『自分がここにいていい理由』を見つけちゃうタイプ。恋っていうより、居場所探しに近いのかも。",
      "整った人より抜けてる人の方が好きなの、あなたっぽい。コンビニ弁当の空箱がある部屋とか、ちょっと伸びた髪とか、そういう生活のほころびに色気を感じるんだよね。不完全さの中に美しさを見つけられるの、ちょっとした才能だと思う。",
      "『ちゃんとした人が好き』とか言いつつ、実際ときめくのは生活感ダダ漏れの人なんだよね。財布がボロかったり、洗濯物畳んでなかったり。そこに母性で反応してるのか恋心で反応してるのか、自分でもわかってないとこある。",
      "あなたの『好き』って、相手の生活の隙間に入り込みたい欲なんだよね。きちんとしすぎてる人には入る隙がないから、ちょっと崩れてる人を選ぶ。で、その人の生活をちょっとずつ自分色に染めたくなる。けっこう深いとこまで入り込みたいタイプ。",
      "あなたって感性で生きてる人じゃない？理屈で恋愛しないし、説明されても響かない。『なんかこの人の匂いが好き』『この人の歩き方がいい』みたいな、説明できない部分に全部詰まってる。だから直感で選んで、周りに止められても聞かないタイプ。",
      "あなたが好きなのって、人前ではちょっと無愛想なのに自分の前ではゆるい人だよね。あの『私限定でゆるくなる感じ』に脳がやられる。逆に万人ウケで誰にでも優しい人は、わざとらしく見えちゃう。隠された顔が見える距離まで近づきたいタイプ。",
      "あなたって相手の『感じてること』を、自分も同じ強度で感じたいタイプ。同じ音楽で同じところで泣ける、同じ映画の同じシーンで同じ感想。会話より共振を求めてる。会話下手な人とでも、感性合えば成立するでしょ、たぶん。",
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
      "靴を踏んで履いてる",
      "ベランダに鉢植えがある",
      "缶ビールよりサワーをよく飲む",
      "服のシワを気にしない",
      "枕元に読みかけの本",
      "アルバム派でシャッフルしない",
      "雨の匂いがわかる",
    ],
  },
  {
    type: "ENFP",
    label: "無邪気な嵐の人",
    axes: ["innocenceTolerance", "vibeMatch", "loveExpression", "lineTemperature"],
    traits: ["無邪気さの破壊力", "真正面の感情", "天然の引力"],
    coreDescriptions: [
      "あなた普段は低温な空気感が好きとか言いつつ、真正面から『好き！』ってぶつけてくる人に結局負けるタイプじゃない？理屈を全部吹っ飛ばす直球の感情に、防御が全然間に合ってないんだよね。",
      "テンション高くてちょっとうるさい人が、急に真剣な顔した瞬間、あなたもう手遅れになるよね。あのギャップ一回見たら、けっこう尾を引くタイプ。ふざけてたのに急に目が本気になる、あの瞬間に弱い。",
      "『静かな恋愛がいい』とか言いつつ、結局グイグイ来る人に落ちてるよね。自分から行けないからこそ、来てくれる人に弱い。実は『迎えに来て』って心の中で結構叫んでる。",
      "無邪気にはしゃいでる人を見ると、ちょっと心拍上がるでしょ。子供みたいにキャッキャしてたのに、ふと大人の顔する瞬間。あの切り替わりがマジで効くよね。計算じゃない感情に飢えてるんだと思う。",
      "あなたが惹かれるのって、感情の振れ幅が大きい人だよね。さっきまでバカ笑いしてたのに、急にしんみりして『でも俺さ』とか言い出すタイプ。あの感情の起伏に、あなたの心は完全にチューニング合っちゃってる。退屈の対義語、それがあなたの好み。",
      "あなたが好きなのって、世界をめっちゃ楽しんでる人。新しい店、新しい音楽、新しい遊び、なんでも飛びついていく人。自分も置いてかれたくないから、必死で追いかけてるうちに恋になってる。動的な恋愛じゃないと、たぶん始まらない。",
      "『この人といると自分が好きになる』って思える人に弱いタイプ。あなたを否定しない、あなたのテンションに乗ってくれる、あなたの変なところを面白がってくれる人。要するに、自己肯定感を上げてくれる人がそのまま運命の相手になる。シンプルな話。",
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
      "好きが止まらないとき手を握ってくる",
      "予定を3つ詰めがち",
      "急に深い話を振ってくる",
      "褒め方がストレートで重い",
      "アイコンがコロコロ変わる",
      "感動するとすぐ泣く",
      "好きな人の癖をすぐ真似する",
    ],
  },
  {
    type: "INTJ",
    label: "冷静な支配者",
    axes: ["lowTempEmotion", "independence", "urbanSense", "distanceSense"],
    traits: ["知性の冷たさ", "揺るがない軸", "静かな圧"],
    coreDescriptions: [
      "自分の世界を持ってて、簡単に崩れない人に惹かれるよね。それって恋愛というよりちょっとチャレンジっぽい。誰にも媚びないあの態度に、あなたの中の『崩したい欲』が全開になる。崩れない人を崩したい、ってもうゲーム感覚に近いとこある。",
      "計画的で感情に振り回されない人が好きなの、わかる。でもそういう人がたまに見せる人間らしさに、致命的に弱いんだよね。完璧な鎧の隙間から感情がこぼれた瞬間、防御が一気に崩壊するタイプ。",
      "あなたが惹かれるのって『この人、一人で完結してるな』って人。でもその人が自分にだけちょっと頼ってきた瞬間、もう全部終わるよね。『選ばれた感』にめちゃくちゃ弱い。",
      "あなたが選ぶ人って、たぶん『感情を見せないこと』を美学にしてる人だよね。喜怒哀楽が顔に出ない、何考えてるかわからない、でもブレない。あの不透明さに、なぜか安心する。読みやすい人は逆に怖い、そういう変な恋愛感覚してる。",
      "あなたって相手の知性に惚れるタイプだよね。会話の中で『あ、この人本物だ』ってわかる瞬間がある。語彙、間、選ぶ単語の精度。表面の優しさより、頭の良さで信頼する。だから恋人候補はだいたい少数精鋭。",
      "強い人の弱さに恋するタイプ。世間からは強キャラ扱いされてる人が、自分の前でだけ『最近ちょっとしんどい』ってこぼした瞬間、もう逃げられない。誰にも見せない弱さを共有された、っていう契約が、あなたにとっての愛情の証明。",
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
      "5年後の話ができる",
      "雑談を切り上げるのが早い",
      "服に流行を入れない",
      "知らないことを知ったかぶりしない",
      "頼まれてもないことを準備してる",
      "他人の評価を気にしない",
      "嘘を見抜く目をしてる",
    ],
  },
  {
    type: "INFJ",
    label: "見透かす静寂の人",
    axes: ["understandDesire", "silenceDependency", "saveDesire", "lowTempEmotion"],
    traits: ["見透かす眼差し", "静かな理解", "共鳴する孤独"],
    coreDescriptions: [
      "あなたって何も言わなくても察してくれる人に惹かれるよね。言葉にする前に理解される、あの感覚にちょっと中毒気味。でもさ、それって『理解されたい』のか『見透かされたい』のか、自分でもわかってないとこあるでしょ。",
      "自分の内面を見抜いてくる人のこと、怖いくせにたまらなく好きだよね。理解されたい欲と、見透かされる恐怖の間で毎回揺れてる。怖いのに近づくのをやめられない、それがあなたの恋愛パターン。",
      "『この人なら全部わかってくれる』って思った瞬間に落ちるタイプ。でも実際に全部わかられるのも怖いんだよね。だから結局、70%くらい理解してくれて、残り30%は踏み込んでこない人を選んでる。その30%が安全地帯になってる。",
      "あなたが恋に落ちるのって、相手と話してる途中で『この人、私の心の中の表現を口にした』って気づいた瞬間。言ったことないのに、わかってる。それを偶然じゃないと信じたい欲がすごい。運命だと思いたがるロマンチスト、自覚あるはず。",
      "あなたって、他人の感情のグラデーションをめっちゃ細かく読み取るくせに、自分の感情だけは説明できないでしょ。だから『あなたって今こう感じてるよね』って言語化してくれる人に出会うと、もう離れられなくなる。翻訳者を恋人にしたいタイプ。",
      "あなたが好きなのって、外では完璧なのに自分の前でだけ『疲れた』って言える人だよね。鎧を脱ぐ場所として選ばれた、っていう事実が、あなたの中で恋を確定させる。要するに、誰かの避難所になりたい欲。けっこう強いと思う。",
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
      "予言みたいなことをポロッと言う",
      "嫌な人とは無言で距離を取る",
      "夢の話を本気で覚えてる",
      "メンタルケアの本を読んでる",
      "感情に名前をつけたがる",
      "サイレントモードを多用する",
      "誕生日より初対面の日付を覚えてる",
    ],
  },
  {
    type: "ISTP",
    label: "不器用な行動派",
    axes: ["awkwardness", "lowTempEmotion", "independence", "dailyLifeFeel"],
    traits: ["言葉より行動", "無骨な優しさ", "読めない距離感"],
    coreDescriptions: [
      "口下手なのに行動で全部示してくる人に、めっちゃ弱いよね。言葉にしないけどちゃんとそこにいる、あの不器用な愛情に毎回やられてる。学習したら惹かれなくなる気がして、ちょっと学習しないままにしてるとこある。",
      "あなたが好きなのって、感情の言語化はド下手なのに行動が全部『好き』って言ってるタイプだよね。言わないけど迎えに来る、言わないけど覚えてる。あの行動ひとつひとつに意味を読み取りたくなる。半分趣味みたいになってるよね。",
      "言葉じゃなくて行動を信じるタイプだから、口だけうまい人には全然落ちないんだよね。でも無言で傘を差し出してくる人には一発で持ってかれる。あなたにとっての『好き』の証明って、言葉じゃなくて行動の回数なんだと思う。",
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
      "世話焼いてくれる人に弱いのはわかるけど、その世話焼きの奥に『自分が必要とされたい欲』を感じると、もっと惹かれちゃうよね。世話を焼く側が実は一番寂しいって見抜けるの、あなたの才能でもあり、ちょっと厄介な特性でもある。",
      "自分のことより先に人のこと考える人に安心するよね。でもその人が自分を後回しにしてるのがちょっと心配で、だからこそ離れられなくなる。あなたの恋愛、だいたい『この人を守りたい』から始まってる気がする。",
      "包容力ある人が好きなのに、その人が一人で泣いてるの見たら全崩壊するよね。強い人の弱さに弱いの、マジであなたの恋愛のバグかも。でもそのバグがあるから、深い恋ができるんだと思う。",
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
      "毎日同じ時間に同じことをする人のこと、地味とか思ってないよね。むしろ『この人、絶対ブレない』ってとこに安心してる。派手さゼロなのに、いつの間にか生活の土台になってる人。あなたが好きなの、たぶんそれ。",
      "あなたが惹かれるのって、言葉は少ないけど約束を絶対守る人だよね。LINEは事務連絡みたいなくせに、言ったことは全部覚えてて全部やってくれる。あの信頼感に一回ハマったら、抜けられないタイプ。派手な恋愛より、確実な愛を取る人。",
      "変わらないことに安心するタイプ。流行追わない、ブレない、淡々としてる。でもその淡々の中に、ちゃんと自分への優先順位があるって気づいた瞬間に落ちてる。地味に見えて、実は地味じゃない恋愛してる。",
      "あなたが好きなの『黙って全部やっといてくれる人』だよね。派手な愛情表現はいらない。ゴミ出ししてくれる、車検の予約をしてくれる。そういう地味な行動の積み重ねが、あなたにとっての『好き』の証明になってる。",
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
      "派手な愛情表現はいらないくせに、さりげなく生活を支えてくれる人に持ってかれるよね。冷蔵庫に勝手にプリンが入ってる、起きたらコーヒーが淹れてある、みたいな。あの『言わないけどやる』に、めっちゃ弱い。",
      "あなたが好きなのって、自分より先に人のこと考えちゃう人だよね。でもそういう人が一人で全部抱え込んでるの見ると、放っておけなくなる。世話焼きの世話を焼きたい、あなたの恋愛いつもそのパターン。",
      "控えめな優しさに弱いんだよね。大声で『好き！』とか言わないけど、好きな食べ物を覚えててくれて、寒そうにしてたら何も言わず上着をかけてくる、みたいな人。あの静かな愛情にたまらなく弱い。",
      "あなたが惹かれるのって『自分がいなくてもこの人は大丈夫だけど、自分がいるともっと楽になる』って思える関係だよね。必要とされたいんじゃなくて、役に立ちたい。その違い、わかる人にはわかる。",
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
      "仕切ってくれる人に弱いよね。『俺がやるから座ってて』とか言われて、表面上は『自分でできるし』って思いつつ、内心めっちゃ安心してる。リードされたい気持ち、もうちょい素直に出していいと思う。",
      "あなたが好きなのって責任感の塊みたいな人だよね。でもその人が家ではダラダラしてるの見た瞬間にキュンとくる。外では完璧なのに家では抜けてる、あのギャップに毎回やられてる。",
      "頼りになる人に惹かれるくせに、その人が自分に頼ってきた瞬間にもっと好きになっちゃう。『こんな強い人が自分にだけ弱さを見せてくれた』っていう、あの感覚があなたの恋愛スイッチの最強トリガー。",
      "あなたが求めてるのって、結局『安心して任せられる人』だよね。でも全部任せっぱなしは嫌で、二人で決めたい。仕切ってくれるけど意見も聞いてくれる人、ちょっと要求高め。でも見つけたら絶対離さないタイプ。",
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
      "自分のことを気にかけてくれる人に、秒で落ちるよね。『最近疲れてない？』とか『ちゃんと寝てる？』とか、あの温かい言葉のシャワー浴びたら一発で持ってかれる。あなたが求めてるの、恋人っていうより『世界一優しい味方』なのかも。",
      "あなたって、みんなに優しい人よりも『みんなに優しいけど自分に一番優しい人』に弱いんだよね。差をつけてくれるのが嬉しい。特別扱いされたい気持ち、全然悪くないと思う。",
      "あなたが好きになるのって、周りの空気を読むのが天才的な人だよね。でもその人が空気を読みすぎて疲れてるのを見たとき、『自分の前でだけは素でいさせてあげたい』って思っちゃう。それ、もう恋だと思う。",
      "あなたは愛情を『量』で測るタイプ。毎日連絡くれる、会うたびに褒めてくれる、覚えてくれてる。その積み重ねが安心材料になる。一回の大きな告白より、毎日の小さな『好き』を選ぶタイプだよね。",
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
      "あなたって退屈が一番嫌いだよね。だから安定した恋愛より『次何するかわかんない人』に惹かれる。思いつきで連れ出してくれる人、ノリで遠出する人。あの瞬発力にやられるのわかるけど、求めてるのが刺激なのか愛情なのかは、ちょっと別の話かも。",
      "あなたが好きなのって、言葉より行動が早い人だよね。考える前に動く、失敗しても笑ってる。あの強さに惹かれるのはわかる。でも本当にハマるのは、その人が一瞬だけ見せる不安な顔。強い人の弱さに、毎回そこで落ちてる。",
      "裏表ない人が好きなくせに、ちょっとミステリアスな部分があると燃えるよね。全部見せてくれてるのに、まだ知らない部分がある。その矛盾を追いかけてる時間が一番楽しい。恋愛をアドベンチャーにしちゃうタイプ。",
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
      "一緒にいるだけで元気になれる人に弱いよね。難しい話はいらない、ただ笑っててくれればいい。あの無条件の明るさに救われてるの、自覚ある？でも、その人が一人で泣いてるとこを想像したことある？そこまで見られたら、本物の恋だと思う。",
      "あなたが好きなのって、全力で今を楽しんでる人だよね。計画とか未来とか考えすぎない、今この瞬間が楽しければいい、っていうあの空気感。あなたが普段考えすぎちゃう分、そういう人に引っ張られたいんだと思う。",
      "愛嬌ある人に弱いタイプ。ちょっとおバカなこと言ってくれる人、失敗しても笑い飛ばせる人。あの力の抜け具合がたまらないんだよね。でも本当に惹かれてるのは、その人の底にある優しさ。表面だけじゃないってちゃんとわかってる。",
      "あなたの理想って『この人といると楽しい』からスタートする恋愛だよね。条件とか相性とかは後回しで、まず一緒にいて楽しいかどうか。シンプルだけど、それが一番難しいのも知ってる。だからこそ見つけたら手放さないタイプ。",
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
      "話してて退屈しない人に惹かれるのはわかるけど、反論してくる人とか、予想外の角度から切り込んでくる人が好きすぎだよね。あの知的な刺激がないと、恋愛が始まらないタイプ。議論で勝ちたいくせに、負かされた方が燃えるの、自分で気づいてる？",
      "あなたが好きなのって頭の回転が早い人だよね。でもただ頭いいだけじゃダメで、ユーモアがないと5秒で飽きちゃう。知性と面白さを両立してる人ってめっちゃレアだから、ずっと探してる感じ。",
      "あなたって『わかりやすい人』に興味ないんだよね。予測できない人、次何を言うかわからない人、思考が跳ねる人。あのカオスにワクワクする。でもそれって裏を返すと、安定した恋愛から逃げてるだけかもしれない。",
      "あなたの恋愛って『この人と話してると時間が溶ける』から始まるよね。顔とかスタイルじゃなくて、会話のテンポとか間の取り方。相性が全部『会話』に集約されてるタイプ。",
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
      "目標に向かって突っ走ってる人に惹かれるよね。でもその人が自分のために時間を作ってくれた瞬間に、全崩壊するタイプ。忙しい人の『空いた時間をあなたに使う』って、けっこう最強の愛情表現だと思う。",
      "あなたが好きなのって野心ある人だよね。上を目指してる、現状に満足しない、常に成長してる。あの熱量に惹かれるのはわかる。でも本当にハマるのは、その人が自分にだけ見せる甘さ。仕事モードの人が急に素を出した瞬間、最強のトリガーになる。",
      "対等な関係を求めるタイプだよね。見下ろされるのも見上げるのも嫌で、横に並んで一緒に走りたい。でもちょっとだけリードしてくれる人に安心しちゃう。その微妙なバランス感覚が、あなただけの恋愛の公式になってる。",
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
    text: "あなたって毎回同じタイプ選んでるの、気づいてる？感情が読めない人を選んで、その人の壊れかけの部分を見つけた瞬間に離れられなくなる。恋愛がいつも『この人を救えるのは自分だけ』から始まって、『この人に振り回されてるのも自分だけ』で終わる。そしてまた同じタイプを選ぶ。けっこう深いループしてるよね。",
  },
  {
    condition: (s) => high(s, "silenceDependency") && high(s, "loveExpression") && high(s, "lateNightVibe"),
    specificity: 9,
    text: "あなたって昼間は一緒に黙ってるだけで満足するくせに、深夜になると急に愛情を確かめたくなるとこあるよね。昼の自分と夜の自分が、求めてる人が違う。本当にハマるのは、両方を同じ温度で受け止めてくれる人。でもそんな人ほぼいないから、いつも片方ずつ満たされて、片方ずつ飢えてる。",
  },
  {
    condition: (s) => high(s, "distanceSense") && high(s, "understandDesire") && high(s, "neglectTolerance"),
    specificity: 9,
    text: "あなたって相手のこと全部知りたいくせに、自分からは絶対踏み込まないよね。既読無視されても平気なフリしながら、相手の投稿はくまなくチェックしてる。本当に怖いのは『興味を持たれなくなること』なのに、興味を持ってることを悟られるのも怖い。けっこう矛盾を抱えてるタイプ。",
  },
  {
    condition: (s) => high(s, "caretakerDependency") && high(s, "lowTempEmotion") && high(s, "independence"),
    specificity: 9,
    text: "あなたが弱いのって『世話焼きだけど愛情表現はド下手な人』だよね。冷蔵庫に勝手にプリン入れてくるくせに『別に』とか言う人。一人でも全然生きていけるのに、あなたの生活だけは気にしてくれる。その矛盾に何度でも落ちる。たぶんそのタイプ専用のセンサーを搭載してる。",
  },
  {
    condition: (s) => high(s, "edginessTolerance") && high(s, "dailyLifeFeel") && high(s, "saveDesire"),
    specificity: 9,
    text: "生活ちゃんとしてる人がタイプとか言うくせに、実際惹かれるのは冷蔵庫にビールしか入ってない人だよね。『この人の生活を立て直したい』っていう欲が、いつの間にか恋愛にすり替わってる。あなたの『好き』ってだいたい母性から始まってる気がする。",
  },
  {
    condition: (s) => high(s, "awkwardness") && high(s, "conversationDensity") && high(s, "understandDesire"),
    specificity: 9,
    text: "普段『うん』しか言わない人が、二人きりになった瞬間に30分喋り続けたら、あなたもう終わりだよね。他の人には見せない言葉の量を、自分にだけ見せてくれてる。その事実だけで3年は引きずれるタイプ。燃費がいいのか悪いのか、よくわかんない。",
  },
  {
    condition: (s) => high(s, "lateNightVibe") && high(s, "emotionalInstabilityTolerance") && high(s, "lineTemperature"),
    specificity: 9,
    text: "あなたの恋愛、だいたい深夜2時以降に進展してるよね。『眠れない』から始まるLINE、夜にだけ崩れる相手の壁、深夜のテンションで送る長文。朝になると『なんであんなこと書いたんだろ』って思うくせに、また夜が来ると同じことしてる。あなたにとって太陽がちょっと敵。",
  },
  {
    condition: (s) => high(s, "innocenceTolerance") && high(s, "lowTempEmotion") && high(s, "vibeMatch"),
    specificity: 8,
    text: "クールな人が好きとか公言しつつ、無邪気にはしゃいでる人を見ると心拍上がるよね。矛盾してるように見えるけど、本当に弱いのは『普段クールなのに自分の前でだけテンションおかしくなる人』。そのギャップ、一回見たら最後だよね。",
  },
  {
    condition: (s) => high(s, "neglectTolerance") && high(s, "lineTemperature") && high(s, "distanceSense"),
    specificity: 8,
    text: "3日既読無視されても『まあそういう人だし』って待てるよね。それって強さじゃなくて、期待しないことで傷つくリスクを下げてるだけかも。だから3日後に急に『今から会える？』が来たとき、全防御が一瞬で崩壊する。そしてまた3日待つ。待機時間の方が長い恋愛してる。",
  },
  {
    condition: (s) => high(s, "independence") && high(s, "caretakerDependency") && high(s, "distanceSense"),
    specificity: 8,
    text: "一人で完結してる人が好きなくせに、その人が『お前のことだけは放っておけない』みたいな空気出したとき、一発で持ってかれるよね。あなたが欲しいのは束縛じゃなくて『選ばれた感覚』。100人の中から自分だけ選ばれる、あの特別感にめちゃくちゃ弱い。",
  },
  {
    condition: (s) => high(s, "humanity") && high(s, "lowTempEmotion") && high(s, "awkwardness"),
    specificity: 8,
    text: "あなたが好きなのって、店員さんに『ありがとうございます』ってちゃんと言えるのに、感情を言葉にするのは壊滅的に下手な人だよね。他人には優しくできるのに、一番近い人には不器用になる。その不器用さを『本物の感情』だと読み取っちゃうタイプ。たぶんその読みは合ってる。",
  },
  {
    condition: (s) => high(s, "silenceDependency") && high(s, "understandDesire") && high(s, "distanceSense"),
    specificity: 8,
    text: "一緒にいるのに別々のことしてる時間が一番好きなタイプだよね。でも本当はその沈黙の中で、相手が何を考えてるか全部知りたい。近づきたいのに近づけない。理想の距離が『手を伸ばせば届くけど伸ばさない距離』。絶妙すぎて、たぶん相手は気づいてない。",
  },
  {
    condition: (s) => high(s, "saveDesire") && high(s, "emotionalInstabilityTolerance") && high(s, "loveExpression"),
    specificity: 8,
    text: "壊れかけの人に惹かれる自覚あるよね。でもやめられない。『大丈夫？』って聞いて『大丈夫』って返されても、大丈夫じゃないのがわかっちゃう。その『わかってしまう自分』にちょっと酔ってる部分もあって、それが本気の愛情なのか自分でもわかんなくなってる。一回冷静になった方がいいかも。",
  },
  // MBTI次元を使った条件
  {
    condition: (s) => high(s, "attractI") && high(s, "attractP") && high(s, "lateNightVibe"),
    specificity: 7,
    text: "あなたって自由で内向的な人、選びがちだよね。ノープランで深夜に散歩できる人、既読つけるタイミングが読めない人、気まぐれだけど一緒にいると不思議と落ち着く人。その『読めなさ』を退屈しない理由にしてるけど、本当はちょっと振り回されたいだけかも。",
  },
  {
    condition: (s) => high(s, "attractE") && high(s, "attractJ") && high(s, "awkwardness"),
    specificity: 7,
    text: "しっかりしてて社交的な人がタイプなくせに、惹かれるのはその人の『完璧じゃない部分』だよね。予定は全部組んでくれるのに、自分の感情だけは組み立てられない。そのほころびを見つけた瞬間が、恋の始まり。毎回そこからスタートしてる。",
  },
  {
    condition: (s) => high(s, "attractI") && high(s, "attractJ") && high(s, "understandDesire"),
    specificity: 7,
    text: "あなたが選ぶのって、内に秘めたものが多い人だよね。整理された部屋、静かな会話、でもその奥にある膨大な感情の蓄積。それを一つずつ開けていきたいタイプ。相手にとっての『なんでそこまでわかるの』が、あなたにとっての最高の褒め言葉。",
  },
  {
    condition: (s) => high(s, "attractE") && high(s, "attractP") && high(s, "loveExpression"),
    specificity: 7,
    text: "感情をストレートにぶつけてくる人にめっちゃ弱いよね。『好き』を迷わず言える人、思いつきで迎えに来る人。自分では絶対それができないから、やってくれる人に何度でも落ちる。計算じゃない感情に飢えてるんだよね。だって自分が計算しちゃうタイプだから。",
  },
  // 2軸（フォールバック用、まだ十分特徴的）
  {
    condition: (s) => high(s, "lowTempEmotion") && high(s, "loveExpression"),
    specificity: 5,
    text: "感情を全部見せない人に惹かれつつ、その人からちゃんと『好き』を言ってもらいたい、ってけっこう注文の多いタイプ。結局選ぶのは、99回無表情で1回だけ不意に感情をこぼす人。その1回のために99回の無表情を待てるの、ある意味才能だと思う。",
  },
  {
    condition: (s) => high(s, "edginessTolerance") && high(s, "caretakerDependency"),
    specificity: 5,
    text: "ちょっと危うい人に惹かれるくせに、その人の面倒を見たがるよね。あなたの恋愛には常に『保護者』と『共犯者』の二面性がある。崩れてる生活を立て直してあげたいくせに、立て直されたらちょっと物足りなくなる。相手が完成する前のバージョンが好きなんだよね。けっこう独特なツボしてる。",
  },
  {
    condition: (s) => high(s, "awkwardness") && high(s, "lineTemperature"),
    specificity: 5,
    text: "不器用な人が好きなくせに、LINEではちゃんと気持ち伝えてほしいって、けっこう難しい注文してるよね。対面では『うん』しか言えないのに、夜中に3行の長文が来る。あなたにとっての『愛されてる実感』って、その3行なんだよね。短いけど重い、あの感じ。",
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
    `あなたのスコアで突出してるのって「${axisLabel(top3[0])}」と「${axisLabel(top3[1])}」なんだよね。この組み合わせ、${axisLabel(top3[0])}を求めるあまり、${axisLabel(top3[1])}に依存するパターンを繰り返しやすい。しかもそれ、気づいてはいるけどやめられないタイプ。けっこう深いループにハマってる。`,
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

export function generateResult(
  scores: AnalysisScores,
  gender: Gender = "female"
): AnalysisResult {
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
    // 追加プール（被り軽減）
    // 低温感情系
    { trait: "怒ってもため息ひとつで終わる", axes: ["lowTempEmotion", "neglectTolerance"] },
    { trait: "感想を求めても「うん」しか返ってこない", axes: ["lowTempEmotion", "awkwardness"] },
    { trait: "他の人の話してるとき急に冷たい", axes: ["lowTempEmotion", "distanceSense"] },
    { trait: "目の動きで感情が全部わかる", axes: ["lowTempEmotion", "understandDesire"] },
    { trait: "怒っても声を荒げない", axes: ["lowTempEmotion", "edginessTolerance"] },
    // 深夜系
    { trait: "深夜のドライブに付き合ってくれる", axes: ["lateNightVibe", "loveExpression"] },
    { trait: "夜中に急に画像送ってくる", axes: ["lateNightVibe", "lineTemperature"] },
    { trait: "朝5時のLINEに返信がある", axes: ["lateNightVibe", "neglectTolerance"] },
    { trait: "夜風に当たるのが好き", axes: ["lateNightVibe", "silenceDependency"] },
    { trait: "コンビニの帰り道で何も買わない", axes: ["lateNightVibe", "edginessTolerance"] },
    // 距離感系
    { trait: "誕生日を覚えてないけど好物は覚えてる", axes: ["distanceSense", "understandDesire"] },
    { trait: "「会いたい」を絶対先に言わない", axes: ["distanceSense", "awkwardness"] },
    { trait: "毎週会わなくても全然平気そう", axes: ["distanceSense", "neglectTolerance"] },
    { trait: "二人になると目を見て話す", axes: ["distanceSense", "loveExpression"] },
    // 不器用系
    { trait: "謝るとき視線がずっと床", axes: ["awkwardness", "humanity"] },
    { trait: "気を遣ってるのが見え見え", axes: ["awkwardness", "caretakerDependency"] },
    { trait: "嘘が下手すぎる", axes: ["awkwardness", "innocenceTolerance"] },
    { trait: "感謝されると逆に困った顔する", axes: ["awkwardness", "humanity"] },
    { trait: "電話切るときの「あ、うん」が長い", axes: ["awkwardness", "lineTemperature"] },
    // 生活感系
    { trait: "枕がペちゃんこ", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "歯磨き粉のキャップが閉まってない", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "観葉植物を一個だけ育ててる", axes: ["dailyLifeFeel", "humanity"] },
    { trait: "コップが3つくらい机に並んでる", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "服を畳まずソファに積んでる", axes: ["dailyLifeFeel", "edginessTolerance"] },
    { trait: "シャンプーがいい匂い", axes: ["dailyLifeFeel", "caretakerDependency"] },
    // 沈黙系
    { trait: "話しかけても返事に2秒間がある", axes: ["silenceDependency", "lowTempEmotion"] },
    { trait: "BGMなしの空間が平気", axes: ["silenceDependency", "independence"] },
    { trait: "黙ってるけど全部聞いてる", axes: ["silenceDependency", "understandDesire"] },
    { trait: "図書館でずっといれる", axes: ["silenceDependency", "urbanSense"] },
    // 愛情表現系
    { trait: "髪を直してくれる", axes: ["loveExpression", "caretakerDependency"] },
    { trait: "服のタグを直してくれる", axes: ["loveExpression", "awkwardness"] },
    { trait: "別れ際にもう一回振り返る", axes: ["loveExpression", "lineTemperature"] },
    { trait: "「無理しないで」が口癖", axes: ["loveExpression", "caretakerDependency"] },
    { trait: "誕生日に手書きのカード", axes: ["loveExpression", "humanity"] },
    // 理解欲系
    { trait: "「ぽいよね」が当たる", axes: ["understandDesire", "humanity"] },
    { trait: "言いかけた言葉を最後まで言わせてくれる", axes: ["understandDesire", "silenceDependency"] },
    { trait: "好きな本のジャンルが似てる", axes: ["understandDesire", "urbanSense"] },
    { trait: "感情の細かい違いに気づく", axes: ["understandDesire", "saveDesire"] },
    // 救いたい欲系
    { trait: "笑ってるけど目が笑ってない", axes: ["saveDesire", "emotionalInstabilityTolerance"] },
    { trait: "実家の話をあまりしない", axes: ["saveDesire", "lowTempEmotion"] },
    { trait: "深夜になると過去の話をしてくる", axes: ["saveDesire", "lateNightVibe"] },
    { trait: "人前では絶対泣かない", axes: ["saveDesire", "independence"] },
    // 無邪気系
    { trait: "犬が来ると全部忘れる", axes: ["innocenceTolerance", "humanity"] },
    { trait: "好きなものを語るときキラキラしてる", axes: ["innocenceTolerance", "understandDesire"] },
    { trait: "笑い方がちょっとバカっぽい", axes: ["innocenceTolerance", "vibeMatch"] },
    { trait: "サプライズに弱い", axes: ["innocenceTolerance", "emotionalInstabilityTolerance"] },
    // 世話焼き系
    { trait: "薬の飲み忘れを指摘してくる", axes: ["caretakerDependency", "humanity"] },
    { trait: "「寝た？」のLINEが来る", axes: ["caretakerDependency", "lineTemperature"] },
    { trait: "風邪ひくと付きっきり", axes: ["caretakerDependency", "loveExpression"] },
    // 都市感・独立系
    { trait: "海外旅行を一人で行ける", axes: ["urbanSense", "independence"] },
    { trait: "美術館に一人で行く", axes: ["urbanSense", "silenceDependency"] },
    { trait: "ビールよりワイン派", axes: ["urbanSense", "lowTempEmotion"] },
    { trait: "持ち物が少ない", axes: ["urbanSense", "independence"] },
    // LINE系
    { trait: "LINEのプロフィール写真が空", axes: ["lineTemperature", "distanceSense"] },
    { trait: "BGMが同じ曲ずっと", axes: ["silenceDependency", "lateNightVibe"] },
    { trait: "ステータスメッセージが意味深", axes: ["lateNightVibe", "edginessTolerance"] },
    { trait: "通知音を切ってる", axes: ["distanceSense", "neglectTolerance"] },
    // 食事系
    { trait: "好き嫌いが多い", axes: ["edginessTolerance", "innocenceTolerance"] },
    { trait: "外食より家でカップ麺", axes: ["dailyLifeFeel", "lateNightVibe"] },
    { trait: "コーヒーは絶対この銘柄", axes: ["independence", "urbanSense"] },
    { trait: "甘いものに目がない", axes: ["innocenceTolerance", "humanity"] },
    // ファッション系
    { trait: "シルバーアクセが多い", axes: ["urbanSense", "edginessTolerance"] },
    { trait: "古着のヴィンテージをよく着る", axes: ["urbanSense", "humanity"] },
    { trait: "シンプルなのに目を引く", axes: ["lowTempEmotion", "urbanSense"] },
    { trait: "ピアスホールが多い", axes: ["edginessTolerance", "urbanSense"] },
    { trait: "ロングコートが似合う", axes: ["lowTempEmotion", "urbanSense"] },
    // 仕草系
    { trait: "ペンの先を噛む癖", axes: ["awkwardness", "innocenceTolerance"] },
    { trait: "頬杖をよくつく", axes: ["dailyLifeFeel", "silenceDependency"] },
    { trait: "肩の力が抜けてる", axes: ["lowTempEmotion", "independence"] },
    { trait: "首をかしげる癖", axes: ["innocenceTolerance", "humanity"] },
    { trait: "話すとき指で何かなぞってる", axes: ["awkwardness", "understandDesire"] },
    // 音楽系
    { trait: "サブスクのプレイリスト名が病みっぽい", axes: ["lateNightVibe", "edginessTolerance"] },
    { trait: "ライブハウスの常連", axes: ["edginessTolerance", "vibeMatch"] },
    { trait: "クラシックを意外と聴く", axes: ["urbanSense", "silenceDependency"] },
    { trait: "Spotifyのリピート再生が同じ曲", axes: ["lateNightVibe", "saveDesire"] },
    // 感情系
    { trait: "怒ってないのに「怒った？」と聞かれる", axes: ["lowTempEmotion", "awkwardness"] },
    { trait: "感謝の言葉が「あざす」", axes: ["awkwardness", "vibeMatch"] },
    { trait: "好きなものへの執着がえぐい", axes: ["understandDesire", "edginessTolerance"] },
    { trait: "嫉妬を遠回しにしか言わない", axes: ["awkwardness", "lowTempEmotion"] },
    // 空間系
    { trait: "夕暮れの時間に外にいる", axes: ["lateNightVibe", "humanity"] },
    { trait: "風呂に異常に長く入る", axes: ["silenceDependency", "dailyLifeFeel"] },
    { trait: "電車の窓側を譲ってくれる", axes: ["caretakerDependency", "humanity"] },
    { trait: "信号待ちで空を見てる", axes: ["lateNightVibe", "silenceDependency"] },
    // 対人系
    { trait: "知り合いと街でばったり会っても焦らない", axes: ["lowTempEmotion", "independence"] },
    { trait: "後輩から「優しい」って言われる", axes: ["humanity", "caretakerDependency"] },
    { trait: "親友が3人くらい", axes: ["distanceSense", "humanity"] },
    { trait: "敵を作らない", axes: ["humanity", "lowTempEmotion"] },
    // 知性系
    { trait: "雑学が異常に多い", axes: ["understandDesire", "vibeMatch"] },
    { trait: "本の感想が独特", axes: ["understandDesire", "independence"] },
    { trait: "意見を求めると遠慮なく言う", axes: ["independence", "edginessTolerance"] },
    { trait: "難しい単語を会話に混ぜてくる", axes: ["urbanSense", "understandDesire"] },
    // SNS系（追加）
    { trait: "Instagramのストーリーに音楽だけ載せる", axes: ["lateNightVibe", "urbanSense"] },
    { trait: "投稿の文章が一行詩みたい", axes: ["urbanSense", "understandDesire"] },
    { trait: "顔出ししない", axes: ["distanceSense", "lowTempEmotion"] },
    { trait: "ハイライトが整理されてる", axes: ["urbanSense", "independence"] },
    // 体・触感系
    { trait: "手のひらが温かい", axes: ["humanity", "loveExpression"] },
    { trait: "頬がひんやりしてる", axes: ["lowTempEmotion", "urbanSense"] },
    { trait: "髪がいつもサラサラ", axes: ["dailyLifeFeel", "caretakerDependency"] },
    { trait: "体温が低い", axes: ["lowTempEmotion", "distanceSense"] },
    // 性格系（追加）
    { trait: "「めんどくさい」と言いつつ動いてくれる", axes: ["awkwardness", "caretakerDependency"] },
    { trait: "誕生日プレゼントのセンスが良すぎる", axes: ["understandDesire", "urbanSense"] },
    { trait: "頼みごとを断れない", axes: ["humanity", "saveDesire"] },
    { trait: "自虐ネタが多い", axes: ["awkwardness", "saveDesire"] },
    { trait: "他人を簡単に褒めない", axes: ["lowTempEmotion", "independence"] },
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

  // 上位スコアの中からランダムサンプリング（毎回違う組み合わせに）
  const topPool = weightedTraits.slice(0, 40).map((t) => t.trait)
  const sampledTop = pickRandom(topPool, 12)
  const fromProfiles = pickRandom(profileTraits, 8)
  const microTraits = [...new Set([...sampledTop, ...fromProfiles])].slice(0, 16)

  // 5. MBTI Ranking
  const mbtiRanking = top4.map(({ profile }) => ({
    type: profile.type,
    label: profile.label,
    reason:
      profile.coreDescriptions[
        Math.floor(Math.random() * profile.coreDescriptions.length)
      ],
  }))

  // 6. ヒーロー情報（型名・タグライン・レア度）
  const topProfile = top4[0]?.profile
  const topType = topProfile?.type ?? "INFP"
  const badge = MBTI_BADGES[topType] ?? MBTI_BADGES.INFP

  // レア度計算: ベースレア度 × スコアの突出度
  const sortedScores = Object.entries(scores)
    .filter(([k]) => !k.startsWith("attract"))
    .map(([, v]) => v)
    .sort((a, b) => b - a)
  const top3Avg = sortedScores.slice(0, 3).reduce((s, v) => s + v, 0) / 3
  const allAvg = sortedScores.reduce((s, v) => s + v, 0) / Math.max(sortedScores.length, 1)
  const concentration = allAvg > 0 ? top3Avg / allAvg : 1
  // concentrationが高いほど（特定軸に偏ってる）レアになる
  const rarityMultiplier = Math.max(0.3, Math.min(1.4, 2 - concentration * 0.4))
  const rarityPercent = Math.max(1, Math.min(15, Math.round(badge.baseRarity * rarityMultiplier)))

  // 7. レーダーチャート用データ（上位6軸）
  const personalityAxes = [
    "lowTempEmotion", "lateNightVibe", "silenceDependency", "loveExpression",
    "understandDesire", "saveDesire", "dailyLifeFeel", "edginessTolerance",
    "caretakerDependency", "innocenceTolerance", "distanceSense", "humanity",
  ]
  const axisScoresSorted = personalityAxes
    .map((axis) => ({ axis, score: scores[axis] ?? 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
  const maxScore = axisScoresSorted[0]?.score || 1
  const axisLabels: Record<string, string> = {
    lowTempEmotion: "低温",
    lateNightVibe: "深夜",
    silenceDependency: "沈黙",
    loveExpression: "愛情",
    understandDesire: "理解",
    saveDesire: "救済",
    dailyLifeFeel: "生活感",
    edginessTolerance: "危うさ",
    caretakerDependency: "世話",
    innocenceTolerance: "無邪気",
    distanceSense: "距離感",
    humanity: "人間味",
    lineTemperature: "LINE",
    neglectTolerance: "放置",
    independence: "自立",
    vibeMatch: "ノリ",
    conversationDensity: "会話",
    urbanSense: "都会",
    awkwardness: "不器用",
    emotionalInstabilityTolerance: "情緒",
  }
  const axisChart = axisScoresSorted.map(({ axis, score }) => ({
    label: axisLabels[axis] ?? axis,
    // 全ゼロでもチャートが潰れないよう最低15%表示
    value: Math.max(15, Math.round((score / maxScore) * 100)),
  }))

  // 矛盾検出
  const contradictions = detectContradictions(scores)

  return {
    displayName: badge.displayName,
    displayType: topType,
    tagline: badge.tagline,
    rarityPercent,
    axisChart,
    coreAnalysis,
    mbtiAnalysis,
    microTraits,
    mbtiRanking,
    contradictions,
  }
}
