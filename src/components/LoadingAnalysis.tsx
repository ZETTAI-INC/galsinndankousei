"use client"

import { useEffect, useState } from "react"

const LOADING_MESSAGES = [
  "ちょっと待ってね、見えてきた",
  "あんたの恋愛パターン、えぐいな",
  "マジでこのタイプ好きなんだ...",
  "いや関係ないけどさ、結構面白いよあんた",
  "はい出た。言うよ？覚悟して",
]

export function LoadingAnalysis() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      )
    }, 900)
    return () => clearInterval(interval)
  }, [])

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
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  )
}
