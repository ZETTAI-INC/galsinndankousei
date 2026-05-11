export type Gender = "male" | "female"
export type Mode = "normal" | "r18"

export interface Choice {
  readonly id: string
  readonly text: string
  readonly scores: Readonly<Partial<Record<AnalysisAxis, number>>>
}

export interface Question {
  readonly id: number
  readonly text: string
  readonly subtext?: string
  readonly choices: readonly Choice[]
}

export type AnalysisAxis =
  // MBTI attraction dimensions (for branching)
  | "attractE"
  | "attractI"
  | "attractJ"
  | "attractP"
  | "attractT"
  | "attractF"
  | "attractS"
  | "attractN"
  // Self MBTI dimensions (for self-diagnosis)
  | "selfE"
  | "selfI"
  | "selfJ"
  | "selfP"
  | "selfT"
  | "selfF"
  | "selfS"
  | "selfN"
  // Other person MBTI dimensions (for "気になる人を診断する" mode)
  | "otherE"
  | "otherI"
  | "otherJ"
  | "otherP"
  | "otherT"
  | "otherF"
  | "otherS"
  | "otherN"
  // Personality detail axes (for result generation)
  | "lowTempEmotion"
  | "lateNightVibe"
  | "urbanSense"
  | "dailyLifeFeel"
  | "awkwardness"
  | "neglectTolerance"
  | "loveExpression"
  | "lineTemperature"
  | "humanity"
  | "emotionalInstabilityTolerance"
  | "silenceDependency"
  | "innocenceTolerance"
  | "conversationDensity"
  | "distanceSense"
  | "independence"
  | "vibeMatch"
  | "edginessTolerance"
  | "caretakerDependency"
  | "understandDesire"
  | "saveDesire"

export const AXIS_LABELS: Readonly<Record<AnalysisAxis, string>> = {
  attractE: "外向性",
  attractI: "内向性",
  attractJ: "計画性",
  attractP: "即興性",
  attractT: "論理性",
  attractF: "共感性",
  attractS: "現実性",
  attractN: "直感性",
  selfE: "自分:外向",
  selfI: "自分:内向",
  selfJ: "自分:計画",
  selfP: "自分:即興",
  selfT: "自分:論理",
  selfF: "自分:共感",
  selfS: "自分:現実",
  selfN: "自分:直感",
  otherE: "相手:外向",
  otherI: "相手:内向",
  otherJ: "相手:計画",
  otherP: "相手:即興",
  otherT: "相手:論理",
  otherF: "相手:共感",
  otherS: "相手:現実",
  otherN: "相手:直感",
  lowTempEmotion: "低温感情",
  lateNightVibe: "深夜感",
  urbanSense: "都市感",
  dailyLifeFeel: "生活感",
  awkwardness: "不器用さ",
  neglectTolerance: "放置耐性",
  loveExpression: "愛情表現",
  lineTemperature: "LINE温度",
  humanity: "人間味",
  emotionalInstabilityTolerance: "情緒不安定耐性",
  silenceDependency: "静けさ依存",
  innocenceTolerance: "無邪気耐性",
  conversationDensity: "会話密度",
  distanceSense: "距離感",
  independence: "自立性",
  vibeMatch: "ノリ感",
  edginessTolerance: "危うさ耐性",
  caretakerDependency: "世話焼き依存",
  understandDesire: "理解したい欲",
  saveDesire: "救いたい欲",
}

export type Phase1Type = "EJ" | "EP" | "IJ" | "IP"
export type Phase3Type = "NF" | "NT" | "SF" | "ST"

export interface AnalysisScores {
  readonly [key: string]: number
}

export interface MbtiAttraction {
  readonly type: string
  readonly label: string
  readonly reason: string
}

export interface AxisChartData {
  readonly label: string
  readonly value: number // 0-100
}

export interface AttractedType {
  readonly title: string // e.g., "繊細で深い人"
  readonly description: string // 詳細
  readonly mbtiHint: string // "INFJ系", "ENFP系" など
}

export interface LovedByResult {
  readonly attractedTypes: readonly AttractedType[] // 3パターン
  readonly signals: readonly string[] // 無意識のサイン15個
  readonly vibe: string // 総評
  readonly trap: string // 無意識に張ってる罠
}

export interface SelfDiagnosisResult {
  readonly selfMbti: string // e.g., "INFJ"
  readonly selfLabel: string // e.g., "見透かす静寂の人"
  readonly selfTagline: string
  readonly axisChart: readonly AxisChartData[]
}

export interface MatchResult {
  readonly matchPercent: number // 0-100
  readonly matchType: string // e.g., "鏡写し型"
  readonly matchLabel: string // sub-label
  readonly description: string // overview
  readonly insights: readonly string[] // 具体的な見抜き 3-5個
  readonly traps: readonly string[] // 危険な繰り返しパターン
  readonly idealType: {
    readonly mbti: string
    readonly label: string
    readonly reason: string
  }
  readonly advice: string // actionable advice
  readonly selfMbti: string
  readonly attractionMbti: string
  readonly axisCompare: readonly {
    readonly label: string
    readonly self: number // 0-100
    readonly attraction: number // 0-100
  }[]
}

export interface AnalysisResult {
  readonly displayName: string
  readonly displayType: string // top MBTI like "INFP"
  readonly tagline: string
  readonly rarityPercent: number // e.g., 3 means top 3%
  readonly axisChart: readonly AxisChartData[]
  readonly coreAnalysis: readonly string[]
  readonly mbtiAnalysis: readonly {
    readonly type: string
    readonly trait: string
    readonly description: string
  }[]
  readonly microTraits: readonly string[]
  readonly mbtiRanking: readonly MbtiAttraction[]
}
