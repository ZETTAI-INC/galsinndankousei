import type { AnalysisScores } from "./types"
import { createSeededRandom, hashScores } from "./seed"
import { determineSelfMbti } from "./match"

export interface DailyFortune {
  readonly date: string // YYYY-MM-DD
  readonly weekday: string
  readonly numarariskLevel: number // 沼り危険度 0-100
  readonly riskLabel: string // "今日は要注意" 等
  readonly attractionShift: string // 今日特に弱いタイプ
  readonly luckyTrigger: string // 今日の刺さる場面
  readonly avoidTrigger: string // 今日避けるべき
  readonly oneLine: string // 占い的一言
}

// 日付文字列 YYYY-MM-DD
function getDateString(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

// 曜日別の傾向
const WEEKDAY_TENDENCIES: Record<number, { base: number; theme: string }> = {
  0: { base: 35, theme: "穏やかな関係性" }, // 日
  1: { base: 25, theme: "安定志向" }, // 月
  2: { base: 50, theme: "理解欲" }, // 火
  3: { base: 60, theme: "刺激" }, // 水
  4: { base: 55, theme: "深い対話" }, // 木
  5: { base: 80, theme: "危うい人" }, // 金
  6: { base: 70, theme: "感情的な接近" }, // 土
}

const RISK_LABELS = [
  { min: 80, label: "今日は超危険", detail: "ガチ沼りモード" },
  { min: 65, label: "今日は要注意", detail: "判断力落ちてる" },
  { min: 50, label: "ちょっと弱め", detail: "刺激に弱い" },
  { min: 35, label: "標準", detail: "冷静に判断できる" },
  { min: 0, label: "落ち着いてる", detail: "理性的なモード" },
]

const ATTRACTION_SHIFTS = [
  "言葉が少ない人",
  "急に距離を詰めてくる人",
  "夜に弱気になる人",
  "ちょっと崩れた生活感の人",
  "頭の回転が早い人",
  "感情豊かな人",
  "計画的でリードしてくれる人",
  "自由奔放な人",
  "観察力が鋭い人",
  "母性/父性が強い人",
  "ノリが軽い人",
  "孤独を愛する人",
  "深い話ができる人",
  "笑い方が独特な人",
  "やや危うい雰囲気の人",
]

const LUCKY_TRIGGERS = [
  "深夜のLINE",
  "目が合った瞬間",
  "別れ際の沈黙",
  "雨の日のカフェ",
  "急に振り返られた時",
  "二人きりになった瞬間",
  "ふいの肩の触れ合い",
  "電話の最後の『またね』",
  "終電前のホーム",
  "酔って漏らした本音",
  "メッセージの未読が長い時",
  "予定外の遭遇",
  "深い話の途中",
  "誰もいない部屋",
  "朝の挨拶",
]

const AVOID_TRIGGERS = [
  "深夜の感情LINE",
  "酔った勢いの告白",
  "曖昧な関係の継続",
  "既読放置への返信攻撃",
  "理想の押し付け",
  "過去の話の引きずり",
  "嫉妬の表出",
  "重い感情の早すぎる開示",
  "確認のための連投",
  "気を引くための駆け引き",
  "比較しての評価",
  "依存的な行動",
]

const ONE_LINERS = [
  "今日のあなたは、感情が剥き出し。鎧を一枚多めに。",
  "刺激より、安定。今日は『退屈』が薬になる。",
  "誰かに連絡したくなったら、一度深呼吸して。",
  "今日見える景色は、明日の自分への手紙。",
  "心が動いた相手より、心が静まる相手を選んで。",
  "言葉にする前に、本当にそれが必要かもう一度確認。",
  "今日のあなたは、見抜く力が普段の倍。観察に徹して。",
  "近づきたい衝動より、距離を保つ判断を信じて。",
  "深夜の決断は、朝には別物。寝てから動こう。",
  "今日は『手放す』練習日。掴むのは明日。",
  "誰かの言葉より、自分の体感を優先して。",
  "目の前の人をじっくり見ることが、今日の運勢を上げる。",
  "今日のあなたを好きになる人がいる。視野を狭めないで。",
  "急いで決めない。今日得る情報は明日も価値を持つ。",
  "心が騒ぐ時は、たぶん何かを見抜こうとしてる。耳を澄ませて。",
]

export function generateDailyFortune(
  scores: AnalysisScores,
  date = new Date()
): DailyFortune {
  const dateStr = getDateString(date)
  const dayOfWeek = date.getDay()
  const tendency = WEEKDAY_TENDENCIES[dayOfWeek] ?? { base: 50, theme: "" }

  // 日付 + スコア でシード生成
  const dateSeed = hashScores(scores) + parseInt(dateStr.replace(/-/g, ""), 10)
  const rng = createSeededRandom(dateSeed)

  // 沼り危険度 = ベース ± ランダム要素
  const variation = Math.floor(rng() * 30) - 15
  const numarariskLevel = Math.max(10, Math.min(95, tendency.base + variation))

  // ラベル選択
  const riskInfo =
    RISK_LABELS.find((r) => numarariskLevel >= r.min) ?? RISK_LABELS[0]

  // pick from arrays using rng
  const pick = <T>(arr: readonly T[]): T =>
    arr[Math.floor(rng() * arr.length)] as T

  return {
    date: dateStr,
    weekday: WEEKDAYS[dayOfWeek] ?? "",
    numarariskLevel,
    riskLabel: `${riskInfo.label}（${riskInfo.detail}）`,
    attractionShift: pick(ATTRACTION_SHIFTS),
    luckyTrigger: pick(LUCKY_TRIGGERS),
    avoidTrigger: pick(AVOID_TRIGGERS),
    oneLine: pick(ONE_LINERS),
  }
}

export function getSelfMbtiSafe(scores: AnalysisScores): string {
  return determineSelfMbti(scores) || "INFP"
}
