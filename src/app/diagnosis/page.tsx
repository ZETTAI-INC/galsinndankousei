"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  phase1Questions,
  phase2Questions,
  phase3Questions,
  determinePhase1Type,
  determinePhase3Type,
  TOTAL_QUESTIONS,
  PHASE1_COUNT,
  PHASE2_COUNT,
  PHASE3_COUNT,
} from "@/lib/questions"
import type { AnalysisAxis, AnalysisScores, Gender, Phase1Type, Phase3Type, Question } from "@/lib/types"
import { LoadingAnalysis } from "@/components/LoadingAnalysis"
import { PhaseLoading } from "@/components/PhaseLoading"

type Stage =
  | "gender"
  | "phase1"
  | "loading1"
  | "phase2"
  | "loading2"
  | "phase3"
  | "analyzing"

interface HistoryEntry {
  readonly stage: Stage
  readonly phaseIndex: number
  readonly totalAnswered: number
  readonly scores: AnalysisScores
}

export default function DiagnosisPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>("gender")
  const [gender, setGender] = useState<Gender>("female")
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [scores, setScores] = useState<AnalysisScores>({})
  const [animKey, setAnimKey] = useState(0)
  const historyRef = useRef<HistoryEntry[]>([])

  const [phase1Type, setPhase1Type] = useState<Phase1Type>("IP")
  const [phase3Type, setPhase3Type] = useState<Phase3Type>("NF")

  const progress = (totalAnswered / TOTAL_QUESTIONS) * 100

  const currentQuestions: readonly Question[] = (() => {
    switch (stage) {
      case "phase1":
        return phase1Questions
      case "phase2":
        return phase2Questions[phase1Type]
      case "phase3":
        return phase3Questions[phase3Type]
      default:
        return []
    }
  })()

  const currentQuestion = currentQuestions[phaseIndex]

  const phaseLimit = (() => {
    switch (stage) {
      case "phase1": return PHASE1_COUNT
      case "phase2": return PHASE2_COUNT
      case "phase3": return PHASE3_COUNT
      default: return 0
    }
  })()

  const handleGender = useCallback((g: Gender) => {
    setGender(g)
    setStage("phase1")
    setAnimKey((k) => k + 1)
  }, [])

  const finish = useCallback(
    (finalScores: AnalysisScores, g: Gender) => {
      setStage("analyzing")
      localStorage.setItem("diagnosis-scores", JSON.stringify(finalScores))
      localStorage.setItem("diagnosis-gender", g)
      setTimeout(() => {
        router.push("/result")
      }, 5000)
    },
    [router]
  )

  const handleChoice = useCallback(
    (choiceScores: Readonly<Partial<Record<AnalysisAxis, number>>>) => {
      // 履歴を保存（戻る用）
      historyRef.current = [
        ...historyRef.current,
        { stage, phaseIndex, totalAnswered, scores },
      ]

      const newScores = { ...scores }
      for (const [axis, value] of Object.entries(choiceScores)) {
        newScores[axis] = (newScores[axis] ?? 0) + (value ?? 0)
      }

      const newTotal = totalAnswered + 1
      setScores(newScores)
      setTotalAnswered(newTotal)
      setAnimKey((k) => k + 1)

      if (phaseIndex < phaseLimit - 1) {
        setPhaseIndex((i) => i + 1)
      } else {
        if (stage === "phase1") {
          const type = determinePhase1Type(newScores)
          setPhase1Type(type)
          setStage("loading1")
        } else if (stage === "phase2") {
          const type = determinePhase3Type(newScores)
          setPhase3Type(type)
          setStage("loading2")
        } else if (stage === "phase3") {
          finish(newScores, gender)
        }
      }
    },
    [stage, phaseIndex, phaseLimit, scores, totalAnswered, finish, gender]
  )

  const handleBack = useCallback(() => {
    const history = historyRef.current
    if (history.length === 0) return
    const prev = history[history.length - 1]
    historyRef.current = history.slice(0, -1)
    setStage(prev.stage)
    setPhaseIndex(prev.phaseIndex)
    setTotalAnswered(prev.totalAnswered)
    setScores(prev.scores)
    setAnimKey((k) => k + 1)
  }, [])

  const handlePhaseLoadingComplete = useCallback(() => {
    if (stage === "loading1") {
      setStage("phase2")
      setPhaseIndex(0)
    } else if (stage === "loading2") {
      setStage("phase3")
      setPhaseIndex(0)
    }
  }, [stage])

  // Gender selection
  if (stage === "gender") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div className="animate-fade-in-up flex flex-col items-center">
          <p className="mb-12 text-[15px] font-light tracking-wider text-purple-200/70">
            あなたの性別は？
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleGender("male")}
              className="border-glow border px-12 py-4 text-[14px] tracking-wide text-purple-200/50 transition-all duration-300 hover:text-pink-200/80"
            >
              男性
            </button>
            <button
              onClick={() => handleGender("female")}
              className="border-glow border px-12 py-4 text-[14px] tracking-wide text-purple-200/50 transition-all duration-300 hover:text-pink-200/80"
            >
              女性
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading screens
  if (stage === "loading1") {
    return <PhaseLoading phase={1} onComplete={handlePhaseLoadingComplete} />
  }
  if (stage === "loading2") {
    return <PhaseLoading phase={2} onComplete={handlePhaseLoadingComplete} />
  }
  if (stage === "analyzing") {
    return <LoadingAnalysis />
  }

  if (!currentQuestion) return null

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Back button + Question counter */}
      <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        {totalAnswered > 0 ? (
          <button
            onClick={handleBack}
            className="text-[11px] tracking-wider text-purple-300/25 transition-colors hover:text-pink-300/60"
          >
            ← 戻る
          </button>
        ) : (
          <span />
        )}
        <span className="text-[11px] tracking-wider text-purple-300/25">
          {totalAnswered + 1} / {TOTAL_QUESTIONS}
        </span>
      </div>

      {/* Question */}
      <div className="w-full max-w-lg" key={animKey}>
        <div className="animate-fade-in-up flex flex-col items-center">
          <p className="mb-12 whitespace-pre-line text-center text-[15px] font-light leading-[2] tracking-wider text-purple-100/80">
            {currentQuestion.text}
          </p>

          <div className="flex w-full flex-col gap-3">
            {currentQuestion.choices.map((choice, i) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.scores)}
                className="border-glow animate-fade-in-right group w-full border px-6 py-4 text-left text-[13px] tracking-wide text-purple-200/50 transition-all duration-300 hover:text-pink-100/80 active:scale-[0.98]"
                style={{ animationDelay: `${0.15 + i * 0.08}s` }}
              >
                <span className="mr-3 text-[11px] text-pink-300/25 transition-colors duration-300 group-hover:text-pink-300/50">
                  {String.fromCharCode(65 + i)}
                </span>
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
