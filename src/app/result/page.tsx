"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { toPng } from "html-to-image"
import type { AnalysisResult, AnalysisScores } from "@/lib/types"
import { LoadingAnalysis } from "@/components/LoadingAnalysis"
import { ShareImage } from "@/components/ShareImage"
import { ScrollReveal } from "@/components/ScrollReveal"

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const shareRef = useRef<HTMLDivElement>(null)

  const siteUrl = typeof window !== "undefined" ? window.location.origin : ""

  useEffect(() => {
    const stored = localStorage.getItem("diagnosis-scores")
    if (!stored) {
      setError("診断データが見つかりません")
      setIsLoading(false)
      return
    }

    const scores: AnalysisScores = JSON.parse(stored)
    const gender = localStorage.getItem("diagnosis-gender") ?? "female"

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scores, gender }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("分析に失敗しました")
        return res.json()
      })
      .then((data: AnalysisResult) => {
        setResult(data)
        setIsLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  const handleSaveImage = useCallback(async () => {
    if (!shareRef.current) return
    try {
      const dataUrl = await toPng(shareRef.current, {
        backgroundColor: "#050505",
        pixelRatio: 2,
      })
      const link = document.createElement("a")
      link.download = "gyaru-shindan.png"
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Share image generation failed:", err)
    }
  }, [])

  const handleShareTwitter = useCallback(() => {
    if (!result) return
    const topType = result.mbtiRanking[0]?.type ?? ""
    const text = `私が沼るタイプは${topType}らしい。ギャル神に見抜かれた。`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(siteUrl)}`
    window.open(url, "_blank")
  }, [result, siteUrl])

  const handleShareLINE = useCallback(() => {
    if (!result) return
    const topType = result.mbtiRanking[0]?.type ?? ""
    const text = `私が沼るタイプは${topType}だって。マジで当たってて怖い。やってみて\n${siteUrl}`
    const url = `https://line.me/R/share?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }, [result, siteUrl])

  if (isLoading) return <LoadingAnalysis />

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <p className="mb-8 text-[13px] text-white/40">{error}</p>
        <Link
          href="/"
          className="border border-white/15 px-8 py-3 text-[13px] text-white/50 transition-all hover:border-white/30 hover:text-white/80"
        >
          トップに戻る
        </Link>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="animate-fade-in-up mb-16 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-pink-300/30 uppercase">
            Divine Gyaru Result
          </p>
          <h1 className="text-glow-pink mb-3 text-[18px] font-medium tracking-wider text-pink-100">
            はい、出たよ
          </h1>
          <p className="text-[12px] text-purple-200/40">
            あんたが沼る人格、全部見えた
          </p>
        </div>

        {/* Core Analysis */}
        <section className="mb-20">
          {result.coreAnalysis.map((analysis, i) => (
            <ScrollReveal key={i} className="mb-12" delay={i * 200}>
              <div className="divider-glow mb-4" />
              <p className="text-[14px] font-light leading-[2.4] tracking-wide text-purple-100/75">
                {analysis}
              </p>
            </ScrollReveal>
          ))}
        </section>

        {/* MBTI Analysis */}
        <section className="mb-20">
          <ScrollReveal>
            <p className="mb-10 text-[10px] tracking-[0.2em] text-pink-300/25 uppercase">
              Type Breakdown
            </p>
          </ScrollReveal>

          {result.mbtiAnalysis.map((item, i) => (
            <ScrollReveal
              key={item.type}
              className="accent-border-left mb-10 pl-5"
              delay={i * 150}
            >
              <div className="mb-1 flex items-baseline gap-3">
                <span className="text-[13px] tracking-wider text-pink-300/50">
                  {item.type}系の
                </span>
              </div>
              <p className="text-glow-purple mb-3 text-[15px] font-light tracking-wider text-purple-200/80">
                &ldquo;{item.trait}&rdquo;
              </p>
              <p className="text-[13px] font-light leading-[2] tracking-wide text-purple-100/45">
                {item.description}
              </p>
            </ScrollReveal>
          ))}
        </section>

        {/* Micro Traits */}
        <section className="mb-20">
          <ScrollReveal>
            <p className="mb-4 text-[10px] tracking-[0.2em] text-pink-300/25 uppercase">
              Micro Attractions
            </p>
            <p className="mb-6 text-[13px] tracking-wider text-purple-200/50">
              あんたが惹かれやすい人の特徴：
            </p>
          </ScrollReveal>

          <div className="flex flex-col gap-2">
            {result.microTraits.map((trait, i) => (
              <ScrollReveal
                key={i}
                className="flex items-start gap-3 py-1"
                delay={i * 40}
              >
                <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full bg-pink-400/30" />
                <span className="text-[13px] font-light leading-[1.8] tracking-wide text-purple-100/50">
                  {trait}
                </span>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* MBTI Ranking */}
        <section className="mb-20">
          <ScrollReveal>
            <p className="mb-4 text-[10px] tracking-[0.2em] text-pink-300/25 uppercase">
              MBTI Ranking
            </p>
            <p className="mb-6 text-[13px] tracking-wider text-purple-200/50">
              あんたが沼りやすいMBTI：
            </p>
          </ScrollReveal>

          {result.mbtiRanking.map((mbti, i) => (
            <ScrollReveal key={mbti.type} className="mb-6 flex items-start gap-4" delay={i * 100}>
              <span className="mt-1 text-[20px] font-light text-pink-400/15">
                {i + 1}
              </span>
              <div>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-[16px] tracking-wider text-pink-200/70">
                    {mbti.type}
                  </span>
                  <span className="text-[11px] text-purple-300/30">
                    {mbti.label}
                  </span>
                </div>
                <p className="text-[12px] font-light leading-[1.9] tracking-wide text-purple-100/40">
                  {mbti.reason}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </section>

        {/* Share & Actions */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 pb-16">
            <p className="mb-2 text-[11px] text-purple-200/30">
              友達にもやらせてみ
            </p>

            {/* Twitter */}
            <button
              onClick={handleShareTwitter}
              className="border-glow w-full border px-8 py-4 text-[13px] tracking-[0.1em] text-pink-200/60 transition-all duration-300 hover:text-pink-100"
            >
              Xでシェア
            </button>

            {/* LINE */}
            <button
              onClick={handleShareLINE}
              className="border-glow w-full border px-8 py-4 text-[13px] tracking-[0.1em] text-pink-200/60 transition-all duration-300 hover:text-pink-100"
            >
              LINEで送る
            </button>

            {/* Save image */}
            <button
              onClick={handleSaveImage}
              className="w-full border border-purple-500/10 px-8 py-3 text-[12px] tracking-[0.1em] text-purple-300/30 transition-all duration-300 hover:border-purple-500/20 hover:text-purple-200/50"
            >
              結果を画像で保存
            </button>

            <Link
              href="/"
              className="mt-4 text-[11px] tracking-wider text-purple-300/20 transition-colors hover:text-pink-300/40"
            >
              もう一度診断する
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Hidden share image */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <ShareImage ref={shareRef} result={result} />
      </div>
    </div>
  )
}
