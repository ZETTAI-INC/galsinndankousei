"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { selfQuestions, SELF_QUESTION_COUNT } from "@/lib/questions-self"
import type { AnalysisAxis, AnalysisScores } from "@/lib/types"
import { LoadingAnalysis } from "@/components/LoadingAnalysis"

export default function DiagnosisSelfPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState<AnalysisScores>({})
  const [animKey, setAnimKey] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  const question = selfQuestions[currentIndex]
  const progress = (currentIndex / SELF_QUESTION_COUNT) * 100

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return
    setCurrentIndex((i) => i - 1)
    setAnimKey((k) => k + 1)
  }, [currentIndex])

  const handleChoice = useCallback(
    (choiceScores: Readonly<Partial<Record<AnalysisAxis, number>>>) => {
      const newScores = { ...scores }
      for (const [axis, value] of Object.entries(choiceScores)) {
        newScores[axis] = (newScores[axis] ?? 0) + (value ?? 0)
      }
      setScores(newScores)
      setAnimKey((k) => k + 1)

      if (currentIndex < SELF_QUESTION_COUNT - 1) {
        setCurrentIndex((i) => i + 1)
      } else {
        // 自己診断完了
        setIsAnalyzing(true)
        if (typeof window !== "undefined") {
          localStorage.setItem("self-scores", JSON.stringify(newScores))
        }
        timeoutRef.current = setTimeout(() => {
          router.push("/match")
        }, 3500)
      }
    },
    [currentIndex, scores, router]
  )

  if (isAnalyzing) {
    return <LoadingAnalysis />
  }

  if (!question) return null

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0a0810]/80 px-4 py-2 backdrop-blur-xl sm:px-6 sm:py-4">
        {currentIndex > 0 ? (
          <button
            onClick={handleBack}
            className="group flex min-h-[44px] items-center gap-2 px-2 text-[12px] tracking-[0.15em] text-white/60 transition-colors hover:text-[var(--accent)]"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
            <span>1問戻る</span>
          </button>
        ) : (
          <span />
        )}
        <span className="serif text-[13px] tracking-[0.2em] text-white/70">
          <span className="text-[var(--accent)]">{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/25"> / {SELF_QUESTION_COUNT}</span>
        </span>
      </div>

      {/* Question */}
      <div className="w-full max-w-lg pt-20 sm:pt-16" key={animKey}>
        <div className="animate-fade-in-up flex flex-col items-center">
          <p className="serif mb-12 whitespace-pre-line text-center text-[19px] font-light leading-[1.7] tracking-[0.02em] text-white sm:mb-16 sm:text-[24px] sm:leading-[1.8]">
            {question.text}
          </p>

          <div className="flex w-full flex-col">
            {question.choices.map((choice, i) => (
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
