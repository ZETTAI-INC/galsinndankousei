import type { AnalysisScores, Gender } from "@/lib/types"
import { generateResult } from "@/lib/generate-result"

export async function POST(request: Request) {
  try {
    const { scores, gender } = (await request.json()) as {
      scores: AnalysisScores
      gender?: Gender
    }

    if (!scores || typeof scores !== "object") {
      return Response.json(
        { error: "スコアデータが不正です" },
        { status: 400 }
      )
    }

    const result = generateResult(scores, gender ?? "female")

    return Response.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json(
      { error: "分析中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
