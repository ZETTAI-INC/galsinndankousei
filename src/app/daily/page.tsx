"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { generateDailyFortune, type DailyFortune } from "@/lib/daily"
import type { AnalysisScores } from "@/lib/types"
import { ScrollReveal } from "@/components/ScrollReveal"

export default function DailyPage() {
  const [fortune, setFortune] = useState<DailyFortune | null>(null)
  const [hasData, setHasData] = useState(true)

  useEffect(() => {
    let scores: AnalysisScores | null = null
    try {
      const stored =
        localStorage.getItem("diagnosis-scores") ??
        localStorage.getItem("self-scores")
      if (stored) {
        scores = JSON.parse(stored) as AnalysisScores
      }
    } catch {
      // ignore
    }

    if (!scores) {
      setHasData(false)
      return
    }

    setFortune(generateDailyFortune(scores))
  }, [])

  if (!hasData) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="serif mb-8 text-[14px] text-white/60">
          まず診断を受けてください
        </p>
        <Link href="/diagnosis" className="btn-primary">
          診断にすすむ
        </Link>
      </div>
    )
  }

  if (!fortune) return null

  return (
    <div className="min-h-dvh px-6 py-20">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="animate-fade-in mb-8">
            <span className="heading-eyebrow">
              {fortune.date.replace(/-/g, ".")} {fortune.weekday}
            </span>
          </div>

          <h1 className="title-editorial animate-blur-in mb-8 text-[34px] sm:text-[40px]">
            <em>今日の沼り危険度</em>
          </h1>

          <div className="mx-auto mb-6 h-px w-16 bg-[var(--accent)] opacity-50" />

          {/* Risk level - big number */}
          <div className="animate-scale-in mb-4">
            <div className="flex items-baseline justify-center gap-2">
              <span className="number-large">{fortune.numarariskLevel}</span>
              <span className="text-[14px] tracking-[0.1em] text-white/50">%</span>
            </div>
          </div>

          <p className="serif text-[16px] font-light tracking-wide text-white/90">
            {fortune.riskLabel}
          </p>
        </div>

        {/* One-liner */}
        <ScrollReveal className="mb-16">
          <div
            className="border border-[var(--accent)]/20 p-8 text-center"
            style={{ background: "rgba(212, 165, 184, 0.04)" }}
          >
            <p className="serif text-[16px] font-light italic leading-[2.2] tracking-wide text-white/95">
              {fortune.oneLine}
            </p>
          </div>
        </ScrollReveal>

        {/* Today's attraction shift */}
        <ScrollReveal className="mb-12">
          <p className="mb-4">
            <span className="heading-eyebrow">今日特に弱いタイプ</span>
          </p>
          <p className="serif text-[20px] font-light tracking-wide text-[var(--accent)]">
            {fortune.attractionShift}
          </p>
        </ScrollReveal>

        {/* Lucky / Avoid */}
        <ScrollReveal className="mb-12">
          <p className="mb-4">
            <span className="heading-eyebrow">今日のラッキー場面</span>
          </p>
          <p className="serif text-[16px] font-light tracking-wide text-white/85">
            ✦ {fortune.luckyTrigger}
          </p>
        </ScrollReveal>

        <ScrollReveal className="mb-20">
          <p className="mb-4">
            <span className="heading-eyebrow">今日避けたい行動</span>
          </p>
          <p className="serif text-[16px] font-light tracking-wide text-white/85">
            ⚠ {fortune.avoidTrigger}
          </p>
        </ScrollReveal>

        {/* Actions */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 pb-16">
            <div className="divider-accent mx-auto mb-10 w-16" />
            <p className="serif mb-2 text-[12px] tracking-wide text-white/50">
              また明日チェック
            </p>
            <Link href="/mypage" className="btn-secondary w-full text-center">
              診断シートを見る
            </Link>
            <Link href="/result" className="btn-ghost w-full text-center">
              恋愛MBTI結果を見る
            </Link>
            <Link
              href="/"
              className="mt-8 text-[11px] tracking-[0.3em] text-white/30 transition-colors hover:text-[var(--accent)]"
            >
              トップに戻る
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
