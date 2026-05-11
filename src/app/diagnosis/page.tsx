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

  // Gender selection / pre-diagnosis
  if (stage === "gender") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-8">
        <div className="animate-fade-in-up flex flex-col items-center">
          <span className="heading-eyebrow mb-10">01</span>
          <p className="serif mb-16 text-[24px] font-light tracking-wide text-white/95">
            あなたの性別は？
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleGender("male")}
              className="btn-secondary"
            >
              男性
            </button>
            <button
              onClick={() => handleGender("female")}
              className="btn-secondary"
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

      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0a0810]/80 px-6 py-4 backdrop-blur-xl">
        {totalAnswered > 0 ? (
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-[12px] tracking-[0.15em] text-white/60 transition-colors hover:text-[var(--accent)]"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
            <span>1問戻る</span>
          </button>
        ) : (
          <span />
        )}
        <span className="serif text-[13px] tracking-[0.2em] text-white/70">
          <span className="text-[var(--accent)]">{String(totalAnswered + 1).padStart(2, "0")}</span>
          <span className="text-white/25"> / {TOTAL_QUESTIONS}</span>
        </span>
      </div>

      {/* Question */}
      <div className="w-full max-w-lg pt-16" key={animKey}>
        <div className="animate-fade-in-up flex flex-col items-center">
          <p className="serif mb-16 whitespace-pre-line text-center text-[24px] font-light leading-[1.8] tracking-[0.02em] text-white">
            {currentQuestion.text}
          </p>

          <div className="flex w-full flex-col">
            {currentQuestion.choices.map((choice, i) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.scores)}
                className="choice-card animate-fade-in-right group"
                style={{
                  animationDelay: `${0.15 + i * 0.08}s`,
                  borderTop: i === 0 ? "1px solid rgba(245, 237, 229, 0.08)" : "none",
                }}
              >
                <span className="serif text-[12px] tracking-[0.2em] text-[var(--accent)] transition-all group-hover:text-[var(--foreground)]">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-[14px] font-light tracking-wide text-white/85 group-hover:text-white">
                  {choice.text}
                </span>
                <span className="text-[12px] text-white/15 transition-all group-hover:translate-x-1 group-hover:text-[var(--accent)]">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
