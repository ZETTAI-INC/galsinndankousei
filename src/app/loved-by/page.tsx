"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { AnalysisScores, LovedByResult } from "@/lib/types"
import { LoadingAnalysis } from "@/components/LoadingAnalysis"
import { ScrollReveal } from "@/components/ScrollReveal"
import { generateLovedByResult } from "@/lib/loved-by"

export default function LovedByPage() {
  const [result, setResult] = useState<LovedByResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const selfStored = localStorage.getItem("self-scores")
    const attractionStored = localStorage.getItem("diagnosis-scores")

    if (!selfStored && !attractionStored) {
      setError("まず診断を受けてください")
      setIsLoading(false)
      return
    }

    const selfScores = selfStored ? JSON.parse(selfStored) : {}
    const attractionScores = attractionStored ? JSON.parse(attractionStored) : {}
    const combinedScores: AnalysisScores = { ...attractionScores, ...selfScores }

    const lovedBy = generateLovedByResult(combinedScores)
    setResult(lovedBy)
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
            <span className="heading-eyebrow">逆診断</span>
          </div>

          <h1
            className="title-editorial animate-blur-in mb-8 text-[36px] sm:text-[40px]"
            style={{ animationDelay: "0.5s" }}
          >
            あなたを
            <br />
            <em>好きになる人</em>
          </h1>

          <div
            className="animate-fade-in mx-auto mb-8 h-px w-16 bg-[var(--accent)] opacity-50"
            style={{ animationDelay: "1.0s" }}
          />

          <p
            className="serif animate-fade-in mx-auto max-w-sm text-[14px] font-light leading-[2] tracking-wide text-white/75"
            style={{ animationDelay: "1.2s" }}
          >
            あなたが惹かれる人じゃなく、
            <br />
            あなたに惹かれてくる人の話。
          </p>
        </div>

        {/* Vibe (overall energy) */}
        <ScrollReveal className="mb-20">
          <div className="divider-soft mb-8" />
          <p className="mb-4">
            <span className="heading-eyebrow">あなたの磁場</span>
          </p>
          <p className="serif text-[15px] font-light leading-[2.3] tracking-wide text-white/90">
            {result.vibe}
          </p>
        </ScrollReveal>

        {/* Attracted types - 3 patterns */}
        <ScrollReveal className="mb-20">
          <p className="mb-6">
            <span className="heading-eyebrow">あなたを好きになる3タイプ</span>
          </p>
          <p className="serif mb-10 text-[13px] font-light italic tracking-wide text-white/55">
            こういう人があなたに弱い
          </p>

          <div className="space-y-8">
            {result.attractedTypes.map((type, i) => (
              <div key={i} className="border border-white/10 bg-white/[0.02] p-6">
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="serif text-[14px] tracking-[0.3em] text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-white/40">
                    {type.mbtiHint}
                  </span>
                </div>
                <h3 className="serif mb-4 text-[18px] font-light tracking-wide text-white">
                  {type.title}
                </h3>
                <p className="serif text-[13px] font-light leading-[2.1] tracking-wide text-white/70">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Unconscious signals */}
        <ScrollReveal className="mb-20">
          <p className="mb-6">
            <span className="heading-eyebrow">無意識のサイン</span>
          </p>
          <p className="serif mb-10 text-[13px] font-light italic tracking-wide text-white/55">
            あなたが自覚なく出してる、人を惹きつける癖
          </p>

          <div className="space-y-3">
            {result.signals.map((signal, i) => (
              <div key={i} className="flex items-start gap-4 py-2">
                <span className="serif mt-1 text-[10px] tracking-[0.2em] text-[var(--accent)]/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="serif flex-1 text-[14px] font-light leading-[1.9] tracking-wide text-white/85">
                  {signal}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* The trap */}
        <ScrollReveal className="mb-20">
          <p className="mb-6">
            <span className="heading-eyebrow">無意識に張ってる罠</span>
          </p>
          <div
            className="border border-[var(--accent)]/20 p-8"
            style={{ background: "rgba(212, 165, 184, 0.04)" }}
          >
            <p className="serif text-[15px] font-light leading-[2.2] tracking-wide text-white/95">
              {result.trap}
            </p>
          </div>
        </ScrollReveal>

        {/* Actions */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 pb-16">
            <div className="divider-accent mx-auto mb-10 w-16" />

            <Link href="/diagnosis-other" className="btn-primary w-full text-center">
              気になる人を診断する
            </Link>

            <Link href="/match" className="btn-secondary w-full text-center">
              相性診断を見る
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
