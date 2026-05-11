"use client"

import { useEffect, useState } from "react"

const PHASE_MESSAGES: Record<number, readonly string[]> = {
  1: [
    "ふんふん、なるほど",
    "あなた向けの質問選んでるね",
    "もうちょっと聞かせて",
  ],
  2: [
    "あー、見えてきた",
    "結構わかりやすいタイプかも",
    "最後の確認ね",
  ],
}

interface PhaseLoadingProps {
  readonly phase: number
  readonly onComplete: () => void
}

export function PhaseLoading({ phase, onComplete }: PhaseLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const messages = PHASE_MESSAGES[phase] ?? PHASE_MESSAGES[1]

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      )
    }, 1000)

    const timer = setTimeout(() => {
      onComplete()
    }, 3500)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [messages.length, onComplete])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="animate-fade-in flex flex-col items-center">
        <div className="mb-12 flex gap-2">
          <span className="loading-dot h-1.5 w-1.5 rounded-full" />
          <span className="loading-dot h-1.5 w-1.5 rounded-full" />
          <span className="loading-dot h-1.5 w-1.5 rounded-full" />
        </div>
        <p
          key={messageIndex}
          className="serif animate-fade-in text-center text-[16px] font-light italic tracking-wide text-white/80"
        >
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  )
}
