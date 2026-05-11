"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { AnalysisScores } from "@/lib/types"
import { LoadingAnalysis } from "@/components/LoadingAnalysis"
import { ScrollReveal } from "@/components/ScrollReveal"
import { generateOtherMatch, type OtherMatchResult } from "@/lib/other-match"

export default function MatchOtherPage() {
  const [result, setResult] = useState<OtherMatchResult | null>(null)
  const [otherName, setOtherName] = useState<string>("あの人")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const otherStored = localStorage.getItem("other-scores")
    const attractionStored = localStorage.getItem("diagnosis-scores")
    const name = localStorage.getItem("other-name") ?? "あの人"
    setOtherName(name)

    if (!otherStored) {
      setError("気になる人の診断データがありません")
      setIsLoading(false)
      return
    }
    if (!attractionStored) {
      setError("先にあなた自身の恋愛MBTI診断を受けてください")
      setIsLoading(false)
      return
    }

    const otherScores: AnalysisScores = JSON.parse(otherStored)
    const attractionScores: AnalysisScores = JSON.parse(attractionStored)
    const combinedScores = { ...attractionScores, ...otherScores }

    setResult(generateOtherMatch(combinedScores))
    setIsLoading(false)
  }, [])

  if (isLoading) return <LoadingAnalysis />

  if (error || !result) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="serif mb-8 text-[14px] text-white/60">
          {error ?? "データがありません"}
        </p>
        <Link href="/" className="btn-secondary">
          トップに戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-dvh px-6 py-20">
      <div className="mx-auto max-w-lg">
        {/* Hero */}
        <div className="mb-20 text-center">
          <div className="animate-fade-in mb-10">
            <span className="heading-eyebrow">気になる人診断</span>
          </div>

          <p className="serif animate-fade-in mb-2 text-[12px] tracking-[0.3em] text-white/50">
            {otherName} は
          </p>

          {/* Other person's MBTI - editorial */}
          <h1
            className="title-editorial animate-blur-in mb-3 text-[44px] sm:text-[52px]"
            style={{ animationDelay: "0.4s" }}
          >
            {result.otherMbti}
          </h1>

          <p
            className="serif animate-fade-in mx-auto mb-8 max-w-xs text-[14px] font-light tracking-wide text-white/85"
            style={{ animationDelay: "0.9s" }}
          >
            {result.otherLabel}
          </p>

          <p
            className="serif animate-fade-in mb-12 text-[12px] font-light italic tracking-wide text-white/55"
            style={{ animationDelay: "1.2s" }}
          >
            「{result.otherTagline}」
          </p>

          {/* Match percentage */}
          <div className="animate-scale-in mb-2" style={{ animationDelay: "1.6s" }}>
            <p className="mb-3 text-[10px] tracking-[0.4em] text-white/40">
              あなたの好みとの一致
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="serif text-[80px] font-light leading-none text-[var(--accent)]">
                {result.matchPercent}
              </span>
              <span className="serif text-[20px] tracking-[0.1em] text-white/50">%</span>
            </div>
          </div>

          {/* Verdict */}
          <p
            className="serif animate-fade-in mt-6 text-[20px] font-light tracking-wide text-white/95"
            style={{ animationDelay: "2.0s" }}
          >
            <em className="not-italic text-[var(--accent)]">{result.matchVerdict}</em>
          </p>
        </div>

        {/* Description */}
        <ScrollReveal className="mb-20">
          <div className="divider-soft mb-8" />
          <p className="serif text-[15px] font-light leading-[2.3] tracking-wide text-white/90">
            {result.description}
          </p>
        </ScrollReveal>

        {/* Insights about the other person */}
        {result.insights.length > 0 && (
          <ScrollReveal className="mb-20">
            <p className="mb-6">
              <span className="heading-eyebrow">{otherName}という人</span>
            </p>
            <p className="serif mb-8 text-[13px] font-light italic tracking-wide text-white/55">
              診断から見えたこの人の輪郭
            </p>
            <div className="space-y-5">
              {result.insights.map((insight, i) => (
                <div key={i} className="accent-border-left pl-5">
                  <p className="serif text-[14px] font-light leading-[2.1] tracking-wide text-white/85">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Axis comparison: your ideal vs them */}
        <ScrollReveal className="mb-20">
          <p className="mb-4">
            <span className="heading-eyebrow">理想 vs 実際</span>
          </p>
          <p className="serif mb-10 text-[13px] font-light italic tracking-wide text-white/55">
            あなたの理想と、{otherName}の実態
          </p>

          <div className="space-y-12">
            {result.axisCompare.map((axis) => {
              const [leftCode, leftLabel, , rightLabel, rightCode] = axis.label.split(" ")
              return (
                <div key={axis.label}>
                  <div className="mb-4 flex items-baseline justify-between text-[12px] tracking-wider">
                    <span className="serif text-white/85">
                      <span className="text-[var(--accent)] mr-1.5">{leftCode}</span>
                      {leftLabel}
                    </span>
                    <span className="serif text-white/85">
                      {rightLabel}
                      <span className="text-[var(--accent)] ml-1.5">{rightCode}</span>
                    </span>
                  </div>
                  <div className="relative h-px w-full bg-white/10 mt-8 mb-8">
                    <div
                      className="absolute z-10"
                      style={{
                        left: `${axis.attraction}%`,
                        top: "-22px",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="serif text-[10px] tracking-wide text-white whitespace-nowrap mb-1">
                          理想
                        </span>
                        <span className="text-white text-[10px] leading-none">▼</span>
                      </div>
                    </div>
                    <div
                      className="absolute z-10"
                      style={{
                        left: `${axis.other}%`,
                        top: "0",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[var(--accent)] text-[10px] leading-none">▲</span>
                        <span className="serif text-[10px] tracking-wide text-[var(--accent)] whitespace-nowrap mt-1">
                          {otherName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollReveal>

        {/* Relationship prediction */}
        <ScrollReveal className="mb-20">
          <p className="mb-6">
            <span className="heading-eyebrow">この関係の予測</span>
          </p>
          <div
            className="border border-[var(--accent)]/20 p-8"
            style={{ background: "rgba(212, 165, 184, 0.04)" }}
          >
            <p className="serif text-[15px] font-light leading-[2.2] tracking-wide text-white/95">
              {result.relationship}
            </p>
          </div>
        </ScrollReveal>

        {/* Actions */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 pb-16">
            <div className="divider-accent mx-auto mb-10 w-16" />
            <p className="serif mb-2 text-[13px] font-light tracking-wide text-white/85">
              他の人も診断する？
            </p>
            <button
              onClick={() => {
                if (!confirm("この人の診断をやり直しますか？\n現在の結果は削除されます。")) return
                localStorage.removeItem("other-scores")
                localStorage.removeItem("other-name")
                window.location.href = "/diagnosis-other"
              }}
              className="btn-ghost w-full text-center"
            >
              ↻ この人を診断し直す
            </button>

            <Link href="/diagnosis-other" className="btn-primary w-full text-center">
              別の人を診断
            </Link>

            <Link href="/loved-by" className="btn-secondary w-full text-center">
              あなたを好きになる人を見る
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
