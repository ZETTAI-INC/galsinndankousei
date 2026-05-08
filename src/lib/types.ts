export type Gender = "male" | "female"

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

export interface AnalysisResult {
  readonly coreAnalysis: readonly string[]
  readonly mbtiAnalysis: readonly {
    readonly type: string
    readonly trait: string
    readonly description: string
  }[]
  readonly microTraits: readonly string[]
  readonly mbtiRanking: readonly MbtiAttraction[]
}
