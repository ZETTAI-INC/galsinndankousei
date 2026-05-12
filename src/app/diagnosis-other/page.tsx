"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { otherQuestions, OTHER_QUESTION_COUNT } from "@/lib/questions-other"
import type { AnalysisAxis, AnalysisScores } from "@/lib/types"
import { LoadingAnalysis } from "@/components/LoadingAnalysis"

type Stage = "intro" | "name" | "questions" | "analyzing"

export default function DiagnosisOtherPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>("intro")
  const [otherName, setOtherName] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState<AnalysisScores>({})
  const [animKey, setAnimKey] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  const question = otherQuestions[currentIndex]
  const progress = (currentIndex / OTHER_QUESTION_COUNT) * 100

  const displayName = otherName.trim() || "あの人"

  const handleStart = useCallback(() => {
    setStage("name")
    setAnimKey((k) => k + 1)
  }, [])

  const handleNameSubmit = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("other-name", displayName)
    }
    setStage("questions")
    setAnimKey((k) => k + 1)
  }, [displayName])

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

      if (currentIndex < OTHER_QUESTION_COUNT - 1) {
        setCurrentIndex((i) => i + 1)
      } else {
        setStage("analyzing")
        if (typeof window !== "undefined") {
          localStorage.setItem("other-scores", JSON.stringify(newScores))
        }
        timeoutRef.current = setTimeout(() => {
          router.push("/match-other")
        }, 3500)
      }
    },
    [currentIndex, scores, router]
  )

  if (stage === "analyzing") return <LoadingAnalysis />

  // Intro
  if (stage === "intro") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 sm:px-8 sm:py-20">
        <div className="w-full max-w-md text-center">
          <div className="animate-fade-in mb-10">
            <span className="heading-eyebrow">気になる人を診断</span>
          </div>

          <h1 className="title-editorial animate-blur-in mb-10 text-[32px] sm:text-[42px]">
            気になるあの人、
            <br />
            <em>どんなタイプ？</em>
          </h1>

          <p className="serif animate-fade-in-up mb-12 text-[14px] font-light leading-[2.4] tracking-wide text-white/75">
            あの人を思い浮かべて12問。
            <br />
            あの人のタイプと、あなたとの相性が見える。
          </p>

          <button onClick={handleStart} className="btn-primary mb-8">
            はじめる
          </button>

          <p className="text-[10px] tracking-[0.3em] text-white/30">
            12 QUESTIONS · 約2分
          </p>
        </div>
      </div>
    )
  }

  // Name input
  if (stage === "name") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 sm:px-8 sm:py-20">
        <div className="w-full max-w-md text-center" key={animKey}>
          <div className="animate-fade-in mb-8">
            <span className="heading-eyebrow">準備</span>
          </div>

          <h2 className="serif animate-fade-in-up mb-8 text-[20px] font-light leading-[1.7] tracking-wide text-white sm:text-[24px]">
            診断する相手の
            <br />
            名前 or ニックネーム
          </h2>

          <p className="serif animate-fade-in mb-10 text-[12px] leading-[1.9] tracking-wide text-white/50">
            （任意。空欄でもOK）
          </p>

          <input
            type="text"
            value={otherName}
            onChange={(e) => setOtherName(e.target.value)}
            placeholder="例：H、推し、◯◯先輩"
            maxLength={20}
            className="serif mb-10 w-full border-b border-white/15 bg-transparent px-2 py-3 text-center text-[18px] tracking-wider text-white placeholder:text-white/20 focus:border-[var(--accent)] focus:outline-none"
            autoFocus
          />

          <button onClick={handleNameSubmit} className="btn-primary">
            12問にすすむ
          </button>
        </div>
      </div>
    )
  }

  // Questions
  if (!question) return null

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-2 border-b border-white/5 bg-[#0a0810]/80 px-4 py-2 backdrop-blur-xl sm:px-6 sm:py-4">
        {currentIndex > 0 ? (
          <button
            onClick={handleBack}
            className="group flex min-h-[44px] items-center gap-2 px-2 text-[12px] tracking-[0.15em] text-white/60 transition-colors hover:text-[var(--accent)]"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
            <span>1問戻る</span>
          </button>
        ) : (
          <span className="max-w-[60%] truncate text-[11px] tracking-wide text-[var(--accent)]/60">
            {displayName} を診断中
          </span>
        )}
        <span className="serif text-[13px] tracking-[0.2em] text-white/70">
          <span className="text-[var(--accent)]">{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/25"> / {OTHER_QUESTION_COUNT}</span>
        </span>
      </div>

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
