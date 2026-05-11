import type { Question } from "./types"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 自己診断: 16問
// ユーザー自身のMBTI（E/I, J/P, T/F, S/N）を測定
// 4軸 × 4問 = 16問
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const selfQuestions: readonly Question[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // E/I: 外向 vs 内向（4問）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 501,
    text: "自分は飲み会で、\nどっちが多い？",
    choices: [
      { id: "501a", text: "話を回してる側", scores: { selfE: 3 } },
      { id: "501b", text: "聞き役に回ってる", scores: { selfI: 3 } },
      { id: "501c", text: "誰とでも雑談してる", scores: { selfE: 2 } },
      { id: "501d", text: "気の合う人とだけ深く話す", scores: { selfI: 2 } },
    ],
  },
  {
    id: 502,
    text: "理想の休日、\n自分はどう過ごしてる？",
    choices: [
      { id: "502a", text: "誰かと予定を入れてる", scores: { selfE: 3 } },
      { id: "502b", text: "家で一人、好きなことしてる", scores: { selfI: 3 } },
      { id: "502c", text: "新しい場所に出かけてる", scores: { selfE: 2 } },
      { id: "502d", text: "近所をふらっと散歩してる", scores: { selfI: 2 } },
    ],
  },
  {
    id: 503,
    text: "疲れたとき、自分が\nエネルギー回復するのは？",
    choices: [
      { id: "503a", text: "誰かに会って話す", scores: { selfE: 3 } },
      { id: "503b", text: "一人で静かに過ごす", scores: { selfI: 3 } },
      { id: "503c", text: "賑やかな場所に行く", scores: { selfE: 2 } },
      { id: "503d", text: "部屋を暗くして寝る", scores: { selfI: 2 } },
    ],
  },
  {
    id: 504,
    text: "初対面の人と話すとき、\n自分は？",
    choices: [
      { id: "504a", text: "気づいたら盛り上がってる", scores: { selfE: 3 } },
      { id: "504b", text: "緊張して言葉が出ない", scores: { selfI: 3 } },
      { id: "504c", text: "とりあえず明るく振る舞う", scores: { selfE: 2 } },
      { id: "504d", text: "相手から話しかけてくれるのを待つ", scores: { selfI: 2 } },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // J/P: 計画 vs 即興（4問）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 505,
    text: "自分の旅行スタイル、\nどれに近い？",
    choices: [
      { id: "505a", text: "事前に全部決めとく", scores: { selfJ: 3 } },
      { id: "505b", text: "ノープランで現地で決める", scores: { selfP: 3 } },
      { id: "505c", text: "ざっくり計画＋ちょっと余白", scores: { selfJ: 2 } },
      { id: "505d", text: "気分で行き先まで変える", scores: { selfP: 2 } },
    ],
  },
  {
    id: 506,
    text: "自分の部屋、\n今こんな感じ？",
    choices: [
      { id: "506a", text: "だいたい片付いてる", scores: { selfJ: 3 } },
      { id: "506b", text: "わりと散らかってる", scores: { selfP: 3 } },
      { id: "506c", text: "ものの定位置が決まってる", scores: { selfJ: 2 } },
      { id: "506d", text: "「あとで片付ける」が口癖", scores: { selfP: 2 } },
    ],
  },
  {
    id: 507,
    text: "友達との約束、\n自分はどう動く？",
    choices: [
      { id: "507a", text: "日時も場所もきっちり決めたい", scores: { selfJ: 3 } },
      { id: "507b", text: "「とりあえず会お」で済ませる", scores: { selfP: 3 } },
      { id: "507c", text: "予定はカレンダーで管理してる", scores: { selfJ: 2 } },
      { id: "507d", text: "当日の気分で決まる", scores: { selfP: 2 } },
    ],
  },
  {
    id: 508,
    text: "締め切りがあるとき、\n自分のスタイルは？",
    choices: [
      { id: "508a", text: "早めに終わらせて余裕を持つ", scores: { selfJ: 3 } },
      { id: "508b", text: "ギリギリで一気に仕上げる", scores: { selfP: 3 } },
      { id: "508c", text: "計画立ててコツコツ進める", scores: { selfJ: 2 } },
      { id: "508d", text: "追い込まれてから本気出す", scores: { selfP: 2 } },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // T/F: 論理 vs 共感（4問）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 509,
    text: "友達が悩んでるとき、\n自分はまず何をする？",
    choices: [
      { id: "509a", text: "解決策を一緒に考える", scores: { selfT: 3 } },
      { id: "509b", text: "とにかく話を聞いて共感する", scores: { selfF: 3 } },
      { id: "509c", text: "状況を整理して原因を探す", scores: { selfT: 2 } },
      { id: "509d", text: "「つらかったね」って寄り添う", scores: { selfF: 2 } },
    ],
  },
  {
    id: 510,
    text: "意見が割れたとき、\n自分はどっち？",
    choices: [
      { id: "510a", text: "正しい方をはっきり言う", scores: { selfT: 3 } },
      { id: "510b", text: "場の空気を優先する", scores: { selfF: 3 } },
      { id: "510c", text: "論理で議論を整理する", scores: { selfT: 2 } },
      { id: "510d", text: "みんなが納得する着地を探す", scores: { selfF: 2 } },
    ],
  },
  {
    id: 511,
    text: "何かを決めるとき、\n自分の基準は？",
    choices: [
      { id: "511a", text: "メリット・デメリットで判断", scores: { selfT: 3 } },
      { id: "511b", text: "自分や周りの気持ちを優先", scores: { selfF: 3 } },
      { id: "511c", text: "客観的なデータを見る", scores: { selfT: 2 } },
      { id: "511d", text: "直感的に「こっちがいい」", scores: { selfF: 2 } },
    ],
  },
  {
    id: 512,
    text: "誰かが泣いてる。\n自分はどう反応する？",
    choices: [
      { id: "512a", text: "落ち着いて状況を聞く", scores: { selfT: 3 } },
      { id: "512b", text: "もらい泣きしそうになる", scores: { selfF: 3 } },
      { id: "512c", text: "何ができるか考える", scores: { selfT: 2 } },
      { id: "512d", text: "そっと隣にいる", scores: { selfF: 2 } },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // S/N: 現実 vs 直感（4問）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 513,
    text: "話してて楽しいのは\nどんな話題？",
    choices: [
      { id: "513a", text: "今日あった具体的な出来事", scores: { selfS: 3 } },
      { id: "513b", text: "「もしも」みたいな空想話", scores: { selfN: 3 } },
      { id: "513c", text: "おすすめのお店や物の話", scores: { selfS: 2 } },
      { id: "513d", text: "未来や哲学っぽい話", scores: { selfN: 2 } },
    ],
  },
  {
    id: 514,
    text: "本や映画を見るとき、\n自分は？",
    choices: [
      { id: "514a", text: "ストーリーを順番に追う", scores: { selfS: 3 } },
      { id: "514b", text: "裏のテーマを考える", scores: { selfN: 3 } },
      { id: "514c", text: "細かい描写を味わう", scores: { selfS: 2 } },
      { id: "514d", text: "世界観に入り込む", scores: { selfN: 2 } },
    ],
  },
  {
    id: 515,
    text: "未来について、\n自分の感覚はどっち？",
    choices: [
      { id: "515a", text: "目の前のことを着実に積む", scores: { selfS: 3 } },
      { id: "515b", text: "大きなビジョンを描いてる", scores: { selfN: 3 } },
      { id: "515c", text: "現実的な計画を立てる", scores: { selfS: 2 } },
      { id: "515d", text: "可能性を広く考える", scores: { selfN: 2 } },
    ],
  },
  {
    id: 516,
    text: "好奇心が向くのは、\nどっち？",
    choices: [
      { id: "516a", text: "実際に役立つ知識やスキル", scores: { selfS: 3 } },
      { id: "516b", text: "まだ誰も見てない発想", scores: { selfN: 3 } },
      { id: "516c", text: "今ある世界を深く知ること", scores: { selfS: 2 } },
      { id: "516d", text: "見えないものの意味を探ること", scores: { selfN: 2 } },
    ],
  },
]

export const SELF_QUESTION_COUNT = 16
