/**
 * Cross-axis predictions（「答えてないことを当てる」予測テキスト）
 *
 * 設計思想:
 *   - 質問では聞いていないドメイン（SNS・寝る前・葬式の想像 等）を当てる
 *   - 単一軸じゃなく 2-3 軸の AND 条件で発火
 *   - z-score 閾値で判定（calibration の baseline 基準）
 *   - 文体は淡々とした断定形、句点で置く（「でしょ」「じゃない?」NG）
 */

import type { AnalysisScores } from "./types"
import { zScore } from "./calibration"

type AxisCondition = {
  readonly min?: number // z-score 下限（含む）
  readonly max?: number // z-score 上限（未満）
}

export type PredictionCategory =
  | "shadow"        // 自覚薄い核心系
  | "sns"           // SNS・連絡の精密描写
  | "past_love"     // 過去の恋愛パターン
  | "physical"      // 身体・微細な癖
  | "social"        // 飲み会・社交
  | "sleep"         // 寝る前・夜
  | "anger_lie"     // 怒り・嘘・隠し事
  | "emotion"       // 涙・感情処理

export interface Prediction {
  readonly id: string
  readonly text: string
  readonly category: PredictionCategory
  readonly triggers: Readonly<Record<string, AxisCondition>>
  // 同じ予測を別の言い回しで表示するためのバリエーション。
  // selectPredictions が scores ハッシュを seed にして1つ選ぶ。
  readonly variations?: readonly string[]
}

const PREDICTIONS: readonly Prediction[] = [
  // ━━━ Shadow（自覚薄い核心系） ━━━
  { id: "s01", text: "言い当てられた瞬間、急に冷める。", category: "shadow",
    triggers: { awkwardness: { min: 0.5 }, lowTempEmotion: { min: 0.5 } } },
  { id: "s02", text: "「今度は違う」って選んだ人、結局いつも似てる。", category: "shadow",
    triggers: { understandDesire: { min: 0.5 }, emotionalInstabilityTolerance: { min: 0.5 } } },
  { id: "s03", text: "本気で嫌いになる方が、好きになるより疲れる。", category: "shadow",
    triggers: { lowTempEmotion: { min: 0.5 }, attractF: { min: 0.0 }, independence: { min: 0.5 } },
    variations: [
      "本気で嫌いになる方が、好きになるより疲れる。",
      "誰かを本気で嫌うエネルギーが惜しくて、結局「まあいいか」で終わらせがち。",
      "嫌いな相手を嫌い続けることに、自分が一番疲れてしまう。",
    ]
  },
  { id: "s04", text: "「ありがとう」言われ慣れてないのに、言われすぎると疲れる。", category: "shadow",
    triggers: { humanity: { min: 0.5 }, attractF: { min: 0.0 }, awkwardness: { min: 0.5 } } },
  { id: "s05", text: "自分のこと話す時、急に第三人称っぽくなる。", category: "shadow",
    triggers: { lowTempEmotion: { min: 0.5 }, attractI: { min: 0.0 }, distanceSense: { min: 0.5 } } },
  { id: "s06", text: "好きになる人、必ずどこか「救えそう」なとこある。", category: "shadow",
    triggers: { saveDesire: { min: 0.5 }, attractF: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "s07", text: "「最近どう?」への答え、3パターンしかない。", category: "shadow",
    triggers: { distanceSense: { min: 0.5 }, attractI: { min: 0.0 }, silenceDependency: { min: 0.5 } } },
  { id: "s08", text: "本当に伝えたいときほど、言葉が一拍遅れる。", category: "shadow",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, silenceDependency: { min: 0.5 } } },
  { id: "s09", text: "優しさを示すのは得意なのに、受け取るのは下手。", category: "shadow",
    triggers: { humanity: { min: 0.5 }, attractF: { min: 0.0 }, distanceSense: { min: 0.5 } } },
  { id: "s10", text: "誰かに完全に理解されること、たぶん本気では望んでない。", category: "shadow",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "s11", text: "「弱い人を放っておけない」って言いつつ、本気で弱い人からは距離取ってる。", category: "shadow",
    triggers: { saveDesire: { min: 0.5 }, attractF: { min: 0.0 }, emotionalInstabilityTolerance: { max: -0.2 } } },
  { id: "s12", text: "誰かに必要とされる方が、誰かを必要とすることより落ち着く。", category: "shadow",
    triggers: { caretakerDependency: { min: 0.5 }, attractF: { min: 0.0 }, loveExpression: { max: -0.2 } } },
  { id: "s13", text: "人を褒める時、本人じゃなくて第三者経由で伝わるルートを選びがち。", category: "shadow",
    triggers: { awkwardness: { min: 0.5 }, attractF: { min: 0.0 }, understandDesire: { min: 0.5 } } },

  // ━━━ SNS / 連絡精密 ━━━
  { id: "n01", text: "既読つけてから、3回読み返してる。", category: "sns",
    triggers: { lowTempEmotion: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "n02", text: "気になる人の投稿、3時間後にこっそり見返してる。", category: "sns",
    triggers: { lateNightVibe: { min: 0.5 }, distanceSense: { min: 0.5 } } },
  { id: "n03", text: "好きな人のストーリー全部見てるのに、リアクションは1個もしてない。", category: "sns",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, silenceDependency: { min: 0.5 } } },
  { id: "n04", text: "グループLINEで自分宛じゃないやつ、既読つけずに長押しで読んでる。", category: "sns",
    triggers: { vibeMatch: { max: -0.2 }, attractI: { min: 0.0 }, awkwardness: { min: 0.5 } } },
  { id: "n05", text: "電話の着信履歴見て「あ、出れなかったな」と思いつつ折り返さない。", category: "sns",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, lineTemperature: { max: -0.2 } },
    variations: [
      "電話の着信履歴見て「あ、出れなかったな」と思いつつ折り返さない。",
      "不在着信に気づいてるのに、折り返すまで半日くらい間が空く。",
      "電話に出れなかったとき、折り返す気持ちはあるのに指が動かない。",
    ]
  },
  { id: "n06", text: "相手のフォロー欄、ふと気になって性別の比率を数えたことある。", category: "sns",
    triggers: { caretakerDependency: { min: 0.5 }, loveExpression: { min: 0.5 } },
    variations: [
      "相手のフォロー欄、ふと気になって性別の比率を数えたことある。",
      "気になる人のフォロー欄を、無関係な顔して全部スクロールしたことある。",
      "好きな人のSNS、フォロワー数より「誰をフォローしてるか」のほうが気になる。",
    ]
  },
  { id: "n07", text: "LINEの「…入力中」が消えた瞬間、見たって悟られない自信がない。", category: "sns",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "n08", text: "「今ちょうど寝るとこだった」って嘘ついたことある。", category: "sns",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, distanceSense: { min: 0.5 } } },

  // ━━━ 過去の恋愛パターン ━━━
  { id: "p01", text: "「この人は私がいないとダメ」って思った相手、過去に必ずいる。", category: "past_love",
    triggers: { saveDesire: { min: 0.5 }, attractF: { min: 0.0 }, emotionalInstabilityTolerance: { min: 0.5 } },
    variations: [
      "「この人は私がいないとダメ」って思った相手、過去に必ずいる。",
      "「自分が支えなきゃ」と思って選んだ相手が、過去に1人以上いる。",
      "「私がいないと崩れる」と感じた人を、人生で一度は本気で好きになってる。",
    ]
  },
  { id: "p02", text: "告白されたことより、告白できなかった相手の方が記憶に残ってる。", category: "past_love",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, distanceSense: { min: 0.5 } } },
  { id: "p03", text: "別れ話、自分から切り出した方が圧倒的に多い。", category: "past_love",
    triggers: { independence: { min: 0.5 }, loveExpression: { max: -0.2 } },
    variations: [
      "別れ話、自分から切り出した方が圧倒的に多い。",
      "終わらせる側になることのほうが、自分のパターン上ずっと多い。",
      "「もう無理」と気づいた瞬間に距離を取り始める癖、人生で何度もやってる。",
    ]
  },
  { id: "p04", text: "過去に1回は「なんでこの人?」って周りに止められた相手と付き合ってる。", category: "past_love",
    triggers: { lowTempEmotion: { min: 0.5 }, attractF: { min: 0.0 }, edginessTolerance: { min: 0.5 } } },
  { id: "p05", text: "連絡頻度が落ちても「今忙しいんだろうな」で1週間は普通に待てる。", category: "past_love",
    triggers: { neglectTolerance: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "p06", text: "「この人だけは違う」と思った相手、結局過去のパターンと同じだった。", category: "past_love",
    triggers: { understandDesire: { min: 0.5 }, lowTempEmotion: { min: 0.5 } } },

  // ━━━ 身体・微細な癖 ━━━
  { id: "b01", text: "人と話してる時、自分の指の関節を無意識に押してる。", category: "physical",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, lateNightVibe: { min: 0.0 } },
    variations: [
      "人と話してる時、自分の指の関節を無意識に押してる。",
      "人と向かい合ってる時、気づくと手元の何かを触ってる。",
      "緊張してると、無意識に自分の指や手首を触る癖がある。",
    ]
  },
  { id: "b02", text: "考え事してる時、首の後ろに手を当てる癖がある。", category: "physical",
    triggers: { silenceDependency: { min: 0.5 }, lowTempEmotion: { min: 0.5 } } },
  { id: "b03", text: "電車で隣の人との距離、毎回測ってる。", category: "physical",
    triggers: { vibeMatch: { max: -0.2 }, attractI: { min: 0.0 }, distanceSense: { min: 0.5 } } },
  { id: "b04", text: "人の話を聞いてる時、無意識に首を少し傾けてる。", category: "physical",
    triggers: { understandDesire: { min: 0.5 }, humanity: { min: 0.0 } } },
  { id: "b05", text: "笑うとき、無意識に口元を手で隠してる。", category: "physical",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, innocenceTolerance: { min: 0.0 } } },
  { id: "b06", text: "本気で面白い時、声より先に肩が揺れる。", category: "physical",
    triggers: { silenceDependency: { min: 0.5 }, attractI: { min: 0.0 }, humanity: { min: 0.0 } } },

  // ━━━ 飲み会・社交 ━━━
  { id: "g01", text: "飲み会で誰かが急に静かになった瞬間、一番先に気づく。", category: "social",
    triggers: { attractI: { min: 0.5 }, understandDesire: { min: 0.5 } } },
  { id: "g02", text: "3人以上の飲み会で、結局1人とだけ深く話してる。", category: "social",
    triggers: { vibeMatch: { max: -0.2 }, attractI: { min: 0.0 }, humanity: { min: 0.0 } },
    variations: [
      "3人以上の飲み会で、結局1人とだけ深く話してる。",
      "大人数の場でも、最後は決まった1人と隅で喋ってる。",
      "賑やかな場所にいるのに、頭の中は隣の1人との会話だけ追ってる。",
    ]
  },
  { id: "g03", text: "友達の彼氏の悩み、なぜか自分のとこに集まってくる。", category: "social",
    triggers: { caretakerDependency: { min: 0.5 }, understandDesire: { min: 0.5 } } },
  { id: "g04", text: "友達と思ってる人のうち、半年に1回しか連絡しない人が3人以上いる。", category: "social",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, distanceSense: { min: 0.5 } } },
  { id: "g05", text: "全員に向けて喋ってる時間より、隣の人と1対1の時間の方が長い。", category: "social",
    triggers: { vibeMatch: { max: -0.2 }, attractI: { min: 0.0 } },
    variations: [
      "全員に向けて喋ってる時間より、隣の人と1対1の時間の方が長い。",
      "大勢でいるより、1人を選んでじっくり話すほうが自分らしくいられる。",
      "輪の中心にいる時間より、誰か1人と離れて喋ってる時間が記憶に残ってる。",
    ]
  },

  // ━━━ 寝る前・夜 ━━━
  { id: "z01", text: "寝る前にスマホで天井に光当てて遊ぶ時間が、毎晩1分くらいある。", category: "sleep",
    triggers: { lateNightVibe: { min: 0.5 }, attractI: { min: 0.0 }, emotionalInstabilityTolerance: { min: 0.0 } },
    variations: [
      "寝る前にスマホで天井に光当てて遊ぶ時間が、毎晩1分くらいある。",
      "布団に入ってからもしばらくスマホを意味なく触ってる時間がある。",
      "寝る前の数分、画面を点けたり消したりして時間を潰してる。",
    ]
  },
  { id: "z02", text: "布団入ってから今日の会話、頭の中で1回再生してる。", category: "sleep",
    triggers: { silenceDependency: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "z03", text: "シャワー浴びてる時に、過去の喧嘩の「勝てたセリフ」を思いついてる。", category: "sleep",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "z04", text: "自分の葬式に来る人を想像したこと、人生で2回以上ある。", category: "sleep",
    triggers: { lowTempEmotion: { min: 0.5 }, attractI: { min: 0.0 }, silenceDependency: { min: 0.5 } } },

  // ━━━ 怒り・嘘・隠し事 ━━━
  { id: "x01", text: "許してないのに「気にしてないよ」って言ったこと、20回以上。", category: "anger_lie",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, loveExpression: { max: -0.2 } },
    variations: [
      "許してないのに「気にしてないよ」って言ったこと、20回以上。",
      "本当はモヤモヤしてるのに、その場では「大丈夫」と返してしまう癖。",
      "許してないけど、相手の前では何事もなかったように振る舞える回数が多い。",
    ]
  },
  { id: "x02", text: "「元気」って答えたうちの何割が本当か、自分でも分からない。", category: "anger_lie",
    triggers: { lowTempEmotion: { min: 0.5 }, attractI: { min: 0.0 }, awkwardness: { min: 0.5 } } },
  { id: "x03", text: "「忙しい」って言って断った予定、本当はただ気分じゃなかった。", category: "anger_lie",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, awkwardness: { min: 0.5 } } },
  { id: "x04", text: "友達の前と恋人の前で、自分の声のトーンが違うこと自覚してる。", category: "anger_lie",
    triggers: { vibeMatch: { min: 0.0 }, distanceSense: { min: 0.5 } } },
  { id: "x05", text: "店員にキレてる人を見ると、見てるこっちが恥ずかしくなる。", category: "anger_lie",
    triggers: { humanity: { min: 0.0 }, distanceSense: { min: 0.5 } } },

  // ━━━ 涙・感情 ━━━
  { id: "e01", text: "映画館で泣いた時、明るくなる前に目元を整えるリハーサルしてる。", category: "emotion",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, distanceSense: { min: 0.5 } } },
  { id: "e02", text: "最後に1人で泣いたシチュエーション、はっきり思い出せる。", category: "emotion",
    triggers: { lowTempEmotion: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "e03", text: "人前で泣くより、後で1人で振り返って泣く方が多い。", category: "emotion",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, silenceDependency: { min: 0.5 } } },

  // ━━━ 男性向け追加: 仕事・趣味・行動系（LINE/SNS依存じゃないドメイン） ━━━
  { id: "m01", text: "仕事中、本当は腹立ってるのに『了解です』だけ返したことが何度もある。", category: "anger_lie",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, awkwardness: { min: 0.5 } } },
  { id: "m02", text: "頑張りを誰にも見られてない時の方が、実は集中できる。", category: "shadow",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, distanceSense: { min: 0.5 } } },
  { id: "m03", text: "やる気のスイッチが入るのは、いつも締切3日前。", category: "shadow",
    triggers: { edginessTolerance: { min: 0.5 }, independence: { min: 0.5 } } },
  { id: "m04", text: "趣味の話を本気でしたい相手、人生で2人くらいしかいない。", category: "social",
    triggers: { distanceSense: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "m05", text: "サウナ・ジム・ランニング、何かに『1人で黙々と』やる時間がある。", category: "physical",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, silenceDependency: { min: 0.5 } } },
  { id: "m06", text: "勝負事で負けた時、その日の夜に1人で復習してる。", category: "shadow",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "m07", text: "後輩や年下に弱いところを絶対見せない。", category: "shadow",
    triggers: { independence: { min: 0.5 }, attractT: { min: 0.0 }, awkwardness: { min: 0.5 } } },
  { id: "m08", text: "会議で発言しなかった日、夜に「こう言えばよかった」を反芻してる。", category: "sleep",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, understandDesire: { min: 0.5 } } },
  { id: "m09", text: "実は人の名前を覚えるのが苦手、適当な相槌で乗り切ってる。", category: "shadow",
    triggers: { distanceSense: { min: 0.5 }, attractI: { min: 0.0 }, awkwardness: { min: 0.5 } } },
  { id: "m10", text: "行きつけの店、3年以上同じところに通ってる。", category: "physical",
    triggers: { dailyLifeFeel: { min: 0.5 }, independence: { min: 0.5 } } },
  { id: "m11", text: "「最近どう?」と聞かれた時、近況より天気の話で逃げる頻度が高い。", category: "social",
    triggers: { awkwardness: { min: 0.5 }, attractI: { min: 0.0 }, distanceSense: { min: 0.5 } } },
  { id: "m12", text: "1人で食事する時、メニューを決めるまでが一番楽しい。", category: "physical",
    triggers: { independence: { min: 0.5 }, attractI: { min: 0.0 }, dailyLifeFeel: { min: 0.5 } } },
  { id: "m13", text: "本気で疲れた日、誰とも話さず家でぼーっとする時間が必要。", category: "sleep",
    triggers: { silenceDependency: { min: 0.5 }, attractI: { min: 0.0 }, independence: { min: 0.5 } } },
  { id: "m14", text: "怒ってる時ほど、声がむしろ低くて静かになる。", category: "anger_lie",
    triggers: { lowTempEmotion: { min: 0.5 }, attractT: { min: 0.0 }, awkwardness: { min: 0.5 } } },
  { id: "m15", text: "「すごい」って言われると、嬉しいより先に「いやそんなことない」が口から出る。", category: "shadow",
    triggers: { awkwardness: { min: 0.5 }, attractF: { min: 0.0 }, humanity: { min: 0.5 } } },

  // ━━━ E系（外向）向け追加 — 内向専用予測ばかりだった補正 ━━━
  { id: "e_e1", text: "1人の時間が3日続くと、誰かに連絡したくなって落ち着かない。", category: "sleep",
    triggers: { attractE: { min: 0.0 }, conversationDensity: { min: 0.0 } } },
  { id: "e_e2", text: "ノリで誘ったら来てくれる友達のリスト、頭の中にちゃんとある。", category: "social",
    triggers: { attractE: { min: 0.0 }, vibeMatch: { min: 0.0 } } },
  { id: "e_e3", text: "話してる途中で「あ、これ前にも言った」と気づくことが時々ある。", category: "shadow",
    triggers: { attractE: { min: 0.0 }, conversationDensity: { min: 0.0 } } },
  { id: "e_e4", text: "テンション上がった日の夜、寝る前に「ちょっと喋りすぎたかも」と振り返る。", category: "sleep",
    triggers: { attractE: { min: 0.0 }, vibeMatch: { min: 0.0 } } },
  { id: "e_e5", text: "誰かと話してる時、無意識に身振り手振りが大きくなる。", category: "physical",
    triggers: { attractE: { min: 0.0 }, vibeMatch: { min: 0.0 } } },
  { id: "e_e6", text: "「まあなんとかなるでしょ」が口癖になってる。", category: "shadow",
    triggers: { attractE: { min: 0.0 }, edginessTolerance: { min: 0.0 } } },

  // ━━━ T系（思考）向け追加 ━━━
  { id: "t_t1", text: "感情的な話を聞かされると、つい「で、結論は？」と心の中で思ってる。", category: "shadow",
    triggers: { attractT: { min: 0.0 }, distanceSense: { min: 0.0 } } },
  { id: "t_t2", text: "誰かが間違ったこと言ってると、訂正したい衝動を3秒くらい抑えてる。", category: "shadow",
    triggers: { attractT: { min: 0.0 }, awkwardness: { min: 0.0 } } },
  { id: "t_t3", text: "感謝されるより、ロジックが認められた時の方が嬉しい。", category: "shadow",
    triggers: { attractT: { min: 0.0 }, independence: { min: 0.0 } } },
  { id: "t_t4", text: "話の途中で頭の中で結論が出てるけど、相手が話し終わるまで待つ訓練ができてる。", category: "shadow",
    triggers: { attractT: { min: 0.0 }, distanceSense: { min: 0.0 } } },
  { id: "t_t5", text: "相談されたとき、共感より「で、どうしたいの?」が先に出る。", category: "social",
    triggers: { attractT: { min: 0.0 }, independence: { min: 0.0 } } },
  { id: "t_t6", text: "「気持ちは分かる」って言うとき、本当は分かってないけど話を進めたいだけのことがある。", category: "anger_lie",
    triggers: { attractT: { min: 0.0 }, awkwardness: { min: 0.0 } } },
] as const

function meetsCondition(z: number, cond: AxisCondition): boolean {
  if (cond.min !== undefined && z < cond.min) return false
  if (cond.max !== undefined && z >= cond.max) return false
  return true
}

function matches(prediction: Prediction, scores: AnalysisScores): boolean {
  for (const [axis, cond] of Object.entries(prediction.triggers)) {
    const z = zScore(axis, scores[axis] ?? 0)
    if (!meetsCondition(z, cond)) return false
  }
  return true
}

// 各 trigger 軸の z-score 超過幅を平均（max/min 違反は0）。強くマッチした順に並べる用
function strength(prediction: Prediction, scores: AnalysisScores): number {
  let sum = 0
  let n = 0
  for (const [axis, cond] of Object.entries(prediction.triggers)) {
    const z = zScore(axis, scores[axis] ?? 0)
    if (cond.min !== undefined) sum += Math.max(0, z - cond.min)
    if (cond.max !== undefined) sum += Math.max(0, cond.max - z)
    n++
  }
  return n > 0 ? sum / n : 0
}

// scores ハッシュ。バリエーション選択の seed に使う（同じ人は同じバリエーション）。
function hashScoresForVariant(scores: AnalysisScores): number {
  let h = 0
  for (const [k, v] of Object.entries(scores)) {
    for (const ch of k) h = ((h << 5) - h + ch.charCodeAt(0)) | 0
    h = (h + Math.round(v * 100)) | 0
  }
  return Math.abs(h)
}

// 表示用に variations から1つ選んだ text を持つ Prediction を返す
function pickVariation(p: Prediction, seed: number): Prediction {
  if (!p.variations || p.variations.length === 0) return p
  const idx = seed % p.variations.length
  return { ...p, text: p.variations[idx] }
}

/**
 * scores から該当する predictions を強度順に最大 count 件返す。
 * カテゴリが偏らないよう、同一カテゴリは最大 maxPerCategory 件まで。
 * variations を持つ予測は scores ハッシュをseedに1つ選んで返す（被りを散らす）。
 */
export function selectPredictions(
  scores: AnalysisScores,
  count: number = 5,
  maxPerCategory: number = 2
): readonly Prediction[] {
  const matched = PREDICTIONS.filter((p) => matches(p, scores))
    .map((p) => ({ p, s: strength(p, scores) }))
    .sort((a, b) => b.s - a.s)

  const seed = hashScoresForVariant(scores)
  const result: Prediction[] = []
  const perCat: Record<string, number> = {}
  for (const { p } of matched) {
    if ((perCat[p.category] ?? 0) >= maxPerCategory) continue
    result.push(pickVariation(p, seed + result.length))
    perCat[p.category] = (perCat[p.category] ?? 0) + 1
    if (result.length >= count) break
  }
  return result
}
