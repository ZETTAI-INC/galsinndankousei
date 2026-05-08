"use client"

import { useEffect, useState } from "react"

const PHASE_MESSAGES: Record<number, readonly string[]> = {
  1: [
    "ふーん、なるほどね",
    "あんた用の質問選んでるから待って",
    "ここからちょっと踏み込むよ",
  ],
  2: [
    "あー、見えてきたわ",
    "てかあんた結構わかりやすいね",
    "最後の確認させて",
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
          <span className="loading-dot h-1 w-1 rounded-full bg-white/30" />
          <span className="loading-dot h-1 w-1 rounded-full bg-white/30" />
          <span className="loading-dot h-1 w-1 rounded-full bg-white/30" />
        </div>
        <p
          key={messageIndex}
          className="animate-fade-in text-center text-[13px] tracking-wider text-purple-200/50"
        >
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  )
}
