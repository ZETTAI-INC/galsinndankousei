import type { Question } from "./types"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 気になる人診断: 12問
// 思い浮かべている特定の他人のMBTI（E/I, J/P, T/F, S/N）を測定
// 4軸 × 3問 = 12問
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const otherQuestions: readonly Question[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // E/I: 外向 vs 内向（3問）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 601,
    text: "あの人は飲み会で、\nどんな感じでいる？",
    choices: [
      { id: "601a", text: "場の中心で笑ってる", scores: { otherE: 3 } },
      { id: "601b", text: "端で静かに飲んでる", scores: { otherI: 3 } },
      { id: "601c", text: "色んな人と話してる", scores: { otherE: 2 } },
      { id: "601d", text: "聞き役に回ってる", scores: { otherI: 2 } },
    ],
  },
  {
    id: 602,
    text: "初対面の人と会ったとき、\nあの人は？",
    choices: [
      { id: "602a", text: "自分から話しかけてる", scores: { otherE: 3 } },
      { id: "602b", text: "黙って様子を見てる", scores: { otherI: 3 } },
      { id: "602c", text: "明るく挨拶できる", scores: { otherE: 2 } },
      { id: "602d", text: "緊張で表情が固い", scores: { otherI: 2 } },
    ],
  },
  {
    id: 603,
    text: "週末のあの人、\nどっちっぽい？",
    choices: [
      { id: "603a", text: "誰かと遊ぶ予定が入ってる", scores: { otherE: 3 } },
      { id: "603b", text: "家にこもってそう", scores: { otherI: 3 } },
      { id: "603c", text: "イベントに顔を出してる", scores: { otherE: 2 } },
      { id: "603d", text: "一人カフェで本読んでそう", scores: { otherI: 2 } },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // J/P: 計画 vs 即興（3問）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 604,
    text: "あの人と会う約束、\nどう決まる？",
    choices: [
      { id: "604a", text: "日時も場所もきっちり決める", scores: { otherJ: 3 } },
      { id: "604b", text: "「いつでもいいよ」が多い", scores: { otherP: 3 } },
      { id: "604c", text: "予定をすぐ確定させたがる", scores: { otherJ: 2 } },
      { id: "604d", text: "当日「今から行ける？」が来る", scores: { otherP: 2 } },
    ],
  },
  {
    id: 605,
    text: "あの人のデスクや部屋、\nイメージは？",
    choices: [
      { id: "605a", text: "整ってて物の位置が決まってる", scores: { otherJ: 3 } },
      { id: "605b", text: "わりと散らかってそう", scores: { otherP: 3 } },
      { id: "605c", text: "几帳面に見える", scores: { otherJ: 2 } },
      { id: "605d", text: "「あとでやる」が口癖っぽい", scores: { otherP: 2 } },
    ],
  },
  {
    id: 606,
    text: "あの人の時間感覚、\nどっち？",
    choices: [
      { id: "606a", text: "待ち合わせには必ず早めに着く", scores: { otherJ: 3 } },
      { id: "606b", text: "ちょっと遅れてくる", scores: { otherP: 3 } },
      { id: "606c", text: "スケジュールを管理してる", scores: { otherJ: 2 } },
      { id: "606d", text: "気分で予定が変わる", scores: { otherP: 2 } },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // T/F: 論理 vs 共感（3問）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 607,
    text: "誰かが悩み相談してきたら、\nあの人は？",
    choices: [
      { id: "607a", text: "解決策を冷静に提案する", scores: { otherT: 3 } },
      { id: "607b", text: "まず気持ちに寄り添う", scores: { otherF: 3 } },
      { id: "607c", text: "状況を整理して聞き返す", scores: { otherT: 2 } },
      { id: "607d", text: "「わかるよ」って共感する", scores: { otherF: 2 } },
    ],
  },
  {
    id: 608,
    text: "意見が割れたとき、\nあの人は？",
    choices: [
      { id: "608a", text: "正しいと思う方をはっきり言う", scores: { otherT: 3 } },
      { id: "608b", text: "場の空気を読んで合わせる", scores: { otherF: 3 } },
      { id: "608c", text: "理屈で議論を整理する", scores: { otherT: 2 } },
      { id: "608d", text: "みんなが納得する着地を探す", scores: { otherF: 2 } },
    ],
  },
  {
    id: 609,
    text: "あの人のLINEや表情、\nどっちが多い？",
    choices: [
      { id: "609a", text: "短文で淡々としてる", scores: { otherT: 3 } },
      { id: "609b", text: "感情がそのまま出てる", scores: { otherF: 3 } },
      { id: "609c", text: "事実ベースで返してくる", scores: { otherT: 2 } },
      { id: "609d", text: "絵文字や「！」が多い", scores: { otherF: 2 } },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // S/N: 現実 vs 直感（3問）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 610,
    text: "あの人がよく話す話題、\nどっち？",
    choices: [
      { id: "610a", text: "今日あった具体的な出来事", scores: { otherS: 3 } },
      { id: "610b", text: "「もしも」みたいな空想話", scores: { otherN: 3 } },
      { id: "610c", text: "おすすめのお店や物の話", scores: { otherS: 2 } },
      { id: "610d", text: "未来や哲学っぽい話", scores: { otherN: 2 } },
    ],
  },
  {
    id: 611,
    text: "あの人の説明の仕方、\nどっちっぽい？",
    choices: [
      { id: "611a", text: "順番に具体例で話す", scores: { otherS: 3 } },
      { id: "611b", text: "比喩や例えが多い", scores: { otherN: 3 } },
      { id: "611c", text: "数字やデータを出す", scores: { otherS: 2 } },
      { id: "611d", text: "話があちこちに飛ぶ", scores: { otherN: 2 } },
    ],
  },
  {
    id: 612,
    text: "あの人の興味の方向、\nどっち？",
    choices: [
      { id: "612a", text: "実生活で役立つことが好き", scores: { otherS: 3 } },
      { id: "612b", text: "まだ誰も知らない発想に惹かれる", scores: { otherN: 3 } },
      { id: "612c", text: "目の前のことを丁寧にやる", scores: { otherS: 2 } },
      { id: "612d", text: "見えないものの意味を探す", scores: { otherN: 2 } },
    ],
  },
]

export const OTHER_QUESTION_COUNT = 12
