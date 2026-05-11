"use client"

import { useEffect, useState } from "react"

const LOADING_MESSAGES = [
  "ちょっと待ってね",
  "だんだん見えてきた",
  "あー、なるほどね",
  "結構わかりやすいかも",
  "もう少しで出るよ",
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
          <span className="loading-dot h-1.5 w-1.5 rounded-full" />
          <span className="loading-dot h-1.5 w-1.5 rounded-full" />
          <span className="loading-dot h-1.5 w-1.5 rounded-full" />
        </div>
        <p
          key={messageIndex}
          className="serif animate-fade-in text-center text-[16px] font-light italic tracking-wide text-white/80"
        >
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  )
}
