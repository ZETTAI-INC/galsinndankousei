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
}

const PREDICTIONS: readonly Prediction[] = [
  // ━━━ Shadow（自覚薄い核心系） ━━━
  { id: "s01", text: "言い当てられた瞬間、急に冷める。", category: "shadow",
    triggers: { awkwardness: { min: 0.3 }, lowTempEmotion: { min: 0.3 } } },
  { id: "s02", text: "「今度は違う」って選んだ人、結局いつも似てる。", category: "shadow",
    triggers: { understandDesire: { min: 0.3 }, emotionalInstabilityTolerance: { min: 0.3 } } },
  { id: "s03", text: "本気で嫌いになる方が、好きになるより疲れる。", category: "shadow",
    triggers: { lowTempEmotion: { min: 0.3 }, independence: { min: 0.3 } } },
  { id: "s04", text: "「ありがとう」言われ慣れてないのに、言われすぎると疲れる。", category: "shadow",
    triggers: { humanity: { min: 0.3 }, awkwardness: { min: 0.3 } } },
  { id: "s05", text: "自分のこと話す時、急に第三人称っぽくなる。", category: "shadow",
    triggers: { lowTempEmotion: { min: 0.3 }, distanceSense: { min: 0.3 } } },
  { id: "s06", text: "好きになる人、必ずどこか「救えそう」なとこある。", category: "shadow",
    triggers: { saveDesire: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "s07", text: "「最近どう?」への答え、3パターンしかない。", category: "shadow",
    triggers: { distanceSense: { min: 0.3 }, silenceDependency: { min: 0.3 } } },
  { id: "s08", text: "本当に伝えたいときほど、言葉が一拍遅れる。", category: "shadow",
    triggers: { awkwardness: { min: 0.3 }, silenceDependency: { min: 0.3 } } },
  { id: "s09", text: "優しさを示すのは得意なのに、受け取るのは下手。", category: "shadow",
    triggers: { humanity: { min: 0.3 }, distanceSense: { min: 0.3 } } },
  { id: "s10", text: "誰かに完全に理解されること、たぶん本気では望んでない。", category: "shadow",
    triggers: { independence: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "s11", text: "「弱い人を放っておけない」って言いつつ、本気で弱い人からは距離取ってる。", category: "shadow",
    triggers: { saveDesire: { min: 0.3 }, emotionalInstabilityTolerance: { max: 0.0 } } },
  { id: "s12", text: "誰かに必要とされる方が、誰かを必要とすることより落ち着く。", category: "shadow",
    triggers: { caretakerDependency: { min: 0.3 }, loveExpression: { max: 0.0 } } },
  { id: "s13", text: "人を褒める時、本人じゃなくて第三者経由で伝わるルートを選びがち。", category: "shadow",
    triggers: { awkwardness: { min: 0.3 }, understandDesire: { min: 0.3 } } },

  // ━━━ SNS / 連絡精密 ━━━
  { id: "n01", text: "既読つけてから、3回読み返してる。", category: "sns",
    triggers: { lowTempEmotion: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "n02", text: "気になる人の投稿、3時間後にこっそり見返してる。", category: "sns",
    triggers: { lateNightVibe: { min: 0.3 }, distanceSense: { min: 0.3 } } },
  { id: "n03", text: "好きな人のストーリー全部見てるのに、リアクションは1個もしてない。", category: "sns",
    triggers: { awkwardness: { min: 0.3 }, silenceDependency: { min: 0.3 } } },
  { id: "n04", text: "グループLINEで自分宛じゃないやつ、既読つけずに長押しで読んでる。", category: "sns",
    triggers: { vibeMatch: { max: 0.0 }, awkwardness: { min: 0.3 } } },
  { id: "n05", text: "電話の着信履歴見て「あ、出れなかったな」と思いつつ折り返さない。", category: "sns",
    triggers: { independence: { min: 0.3 }, lineTemperature: { max: 0.0 } } },
  { id: "n06", text: "相手のフォロー欄、ふと気になって性別の比率を数えたことある。", category: "sns",
    triggers: { caretakerDependency: { min: 0.3 }, loveExpression: { min: 0.3 } } },
  { id: "n07", text: "LINEの「…入力中」が消えた瞬間、見たって悟られない自信がない。", category: "sns",
    triggers: { awkwardness: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "n08", text: "「今ちょうど寝るとこだった」って嘘ついたことある。", category: "sns",
    triggers: { awkwardness: { min: 0.3 }, distanceSense: { min: 0.3 } } },

  // ━━━ 過去の恋愛パターン ━━━
  { id: "p01", text: "「この人は私がいないとダメ」って思った相手、過去に必ずいる。", category: "past_love",
    triggers: { saveDesire: { min: 0.3 }, emotionalInstabilityTolerance: { min: 0.3 } } },
  { id: "p02", text: "告白されたことより、告白できなかった相手の方が記憶に残ってる。", category: "past_love",
    triggers: { awkwardness: { min: 0.3 }, distanceSense: { min: 0.3 } } },
  { id: "p03", text: "別れ話、自分から切り出した方が圧倒的に多い。", category: "past_love",
    triggers: { independence: { min: 0.3 }, loveExpression: { max: 0.0 } } },
  { id: "p04", text: "過去に1回は「なんでこの人?」って周りに止められた相手と付き合ってる。", category: "past_love",
    triggers: { lowTempEmotion: { min: 0.3 }, edginessTolerance: { min: 0.3 } } },
  { id: "p05", text: "連絡頻度が落ちても「今忙しいんだろうな」で1週間は普通に待てる。", category: "past_love",
    triggers: { neglectTolerance: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "p06", text: "「この人だけは違う」と思った相手、結局過去のパターンと同じだった。", category: "past_love",
    triggers: { understandDesire: { min: 0.3 }, lowTempEmotion: { min: 0.3 } } },

  // ━━━ 身体・微細な癖 ━━━
  { id: "b01", text: "人と話してる時、自分の指の関節を無意識に押してる。", category: "physical",
    triggers: { awkwardness: { min: 0.3 }, lateNightVibe: { min: 0.0 } } },
  { id: "b02", text: "考え事してる時、首の後ろに手を当てる癖がある。", category: "physical",
    triggers: { silenceDependency: { min: 0.3 }, lowTempEmotion: { min: 0.3 } } },
  { id: "b03", text: "電車で隣の人との距離、毎回測ってる。", category: "physical",
    triggers: { vibeMatch: { max: 0.0 }, distanceSense: { min: 0.3 } } },
  { id: "b04", text: "人の話を聞いてる時、無意識に首を少し傾けてる。", category: "physical",
    triggers: { understandDesire: { min: 0.3 }, humanity: { min: 0.0 } } },
  { id: "b05", text: "笑うとき、無意識に口元を手で隠してる。", category: "physical",
    triggers: { awkwardness: { min: 0.3 }, innocenceTolerance: { min: 0.0 } } },
  { id: "b06", text: "本気で面白い時、声より先に肩が揺れる。", category: "physical",
    triggers: { silenceDependency: { min: 0.3 }, humanity: { min: 0.0 } } },

  // ━━━ 飲み会・社交 ━━━
  { id: "g01", text: "飲み会で誰かが急に静かになった瞬間、一番先に気づく。", category: "social",
    triggers: { attractI: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "g02", text: "3人以上の飲み会で、結局1人とだけ深く話してる。", category: "social",
    triggers: { vibeMatch: { max: 0.0 }, humanity: { min: 0.0 } } },
  { id: "g03", text: "友達の彼氏の悩み、なぜか自分のとこに集まってくる。", category: "social",
    triggers: { caretakerDependency: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "g04", text: "友達と思ってる人のうち、半年に1回しか連絡しない人が3人以上いる。", category: "social",
    triggers: { independence: { min: 0.3 }, distanceSense: { min: 0.3 } } },
  { id: "g05", text: "全員に向けて喋ってる時間より、隣の人と1対1の時間の方が長い。", category: "social",
    triggers: { vibeMatch: { max: 0.0 }, attractI: { min: 0.0 } } },

  // ━━━ 寝る前・夜 ━━━
  { id: "z01", text: "寝る前にスマホで天井に光当てて遊ぶ時間が、毎晩1分くらいある。", category: "sleep",
    triggers: { lateNightVibe: { min: 0.3 }, emotionalInstabilityTolerance: { min: 0.0 } } },
  { id: "z02", text: "布団入ってから今日の会話、頭の中で1回再生してる。", category: "sleep",
    triggers: { silenceDependency: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "z03", text: "シャワー浴びてる時に、過去の喧嘩の「勝てたセリフ」を思いついてる。", category: "sleep",
    triggers: { awkwardness: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "z04", text: "自分の葬式に来る人を想像したこと、人生で2回以上ある。", category: "sleep",
    triggers: { lowTempEmotion: { min: 0.3 }, silenceDependency: { min: 0.3 } } },

  // ━━━ 怒り・嘘・隠し事 ━━━
  { id: "x01", text: "許してないのに「気にしてないよ」って言ったこと、20回以上。", category: "anger_lie",
    triggers: { awkwardness: { min: 0.3 }, loveExpression: { max: 0.0 } } },
  { id: "x02", text: "「元気」って答えたうちの何割が本当か、自分でも分からない。", category: "anger_lie",
    triggers: { lowTempEmotion: { min: 0.3 }, awkwardness: { min: 0.3 } } },
  { id: "x03", text: "「忙しい」って言って断った予定、本当はただ気分じゃなかった。", category: "anger_lie",
    triggers: { independence: { min: 0.3 }, awkwardness: { min: 0.3 } } },
  { id: "x04", text: "友達の前と恋人の前で、自分の声のトーンが違うこと自覚してる。", category: "anger_lie",
    triggers: { vibeMatch: { min: 0.0 }, distanceSense: { min: 0.3 } } },
  { id: "x05", text: "店員にキレてる人を見ると、見てるこっちが恥ずかしくなる。", category: "anger_lie",
    triggers: { humanity: { min: 0.0 }, distanceSense: { min: 0.3 } } },

  // ━━━ 涙・感情 ━━━
  { id: "e01", text: "映画館で泣いた時、明るくなる前に目元を整えるリハーサルしてる。", category: "emotion",
    triggers: { awkwardness: { min: 0.3 }, distanceSense: { min: 0.3 } } },
  { id: "e02", text: "最後に1人で泣いたシチュエーション、はっきり思い出せる。", category: "emotion",
    triggers: { lowTempEmotion: { min: 0.3 }, understandDesire: { min: 0.3 } } },
  { id: "e03", text: "人前で泣くより、後で1人で振り返って泣く方が多い。", category: "emotion",
    triggers: { independence: { min: 0.3 }, silenceDependency: { min: 0.3 } } },
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

/**
 * scores から該当する predictions を強度順に最大 count 件返す。
 * カテゴリが偏らないよう、同一カテゴリは最大 maxPerCategory 件まで。
 */
export function selectPredictions(
  scores: AnalysisScores,
  count: number = 5,
  maxPerCategory: number = 2
): readonly Prediction[] {
  const matched = PREDICTIONS.filter((p) => matches(p, scores))
    .map((p) => ({ p, s: strength(p, scores) }))
    .sort((a, b) => b.s - a.s)

  const result: Prediction[] = []
  const perCat: Record<string, number> = {}
  for (const { p } of matched) {
    if ((perCat[p.category] ?? 0) >= maxPerCategory) continue
    result.push(p)
    perCat[p.category] = (perCat[p.category] ?? 0) + 1
    if (result.length >= count) break
  }
  return result
}
