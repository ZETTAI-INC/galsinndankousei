"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { AnalysisScores, MatchResult, SelfDiagnosisResult } from "@/lib/types"
import { LoadingAnalysis } from "@/components/LoadingAnalysis"
import { ScrollReveal } from "@/components/ScrollReveal"
import { calculateMatch, generateSelfResult } from "@/lib/match"

export default function MatchPage() {
  const [match, setMatch] = useState<MatchResult | null>(null)
  const [self, setSelf] = useState<SelfDiagnosisResult | null>(null)
  const [attractionType, setAttractionType] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const selfStored = localStorage.getItem("self-scores")
    const attractionStored = localStorage.getItem("diagnosis-scores")
    const attractionResultStored = localStorage.getItem("attraction-result-cache")

    if (!selfStored || !attractionStored) {
      setError("両方の診断データが必要です")
      setIsLoading(false)
      return
    }

    const selfScores: AnalysisScores = JSON.parse(selfStored)
    const attractionScores: AnalysisScores = JSON.parse(attractionStored)

    // 自己診断結果
    const selfResult = generateSelfResult(selfScores)
    setSelf(selfResult)

    // 惹かれるMBTI（attractionスコアから簡易判定 or キャッシュ）
    let topAttractionMbti = "INFP"
    if (attractionResultStored) {
      try {
        const cached = JSON.parse(attractionResultStored)
        topAttractionMbti = cached.displayType ?? "INFP"
      } catch {
        // ignore
      }
    } else {
      // attractionスコアから直接計算
      const e = attractionScores["attractE"] ?? 0
      const i = attractionScores["attractI"] ?? 0
      const n = attractionScores["attractN"] ?? 0
      const s = attractionScores["attractS"] ?? 0
      const f = attractionScores["attractF"] ?? 0
      const t = attractionScores["attractT"] ?? 0
      const j = attractionScores["attractJ"] ?? 0
      const p = attractionScores["attractP"] ?? 0
      topAttractionMbti =
        (e >= i ? "E" : "I") +
        (n >= s ? "N" : "S") +
        (f >= t ? "F" : "T") +
        (j >= p ? "J" : "P")
    }
    setAttractionType(topAttractionMbti)

    // 統合スコアでマッチ計算
    const combinedScores = { ...attractionScores, ...selfScores }
    const matchResult = calculateMatch(combinedScores, topAttractionMbti)
    setMatch(matchResult)
    setIsLoading(false)
  }, [])

  if (isLoading) return <LoadingAnalysis />

  if (error || !match || !self) {
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
            <span className="heading-eyebrow">相性診断</span>
          </div>

          {/* Match percent - large */}
          <div className="animate-scale-in mb-8" style={{ animationDelay: "0.4s" }}>
            <p className="mb-4 text-[10px] tracking-[0.4em] text-white/40">MATCH</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="serif text-[80px] font-light leading-none text-[var(--accent)]">
                {match.matchPercent}
              </span>
              <span className="serif text-[20px] tracking-[0.1em] text-white/50">%</span>
            </div>
          </div>

          {/* Match type */}
          <div
            className="animate-fade-in-up mb-6"
            style={{ animationDelay: "1.0s" }}
          >
            <h1 className="title-editorial mb-2 text-[28px] sm:text-[32px]">
              <em>{match.matchType}</em>
            </h1>
            <p className="serif text-[13px] tracking-wide text-white/60">
              {match.matchLabel}
            </p>
          </div>

          {/* MBTI vs MBTI */}
          <div
            className="animate-fade-in mt-12 flex items-center justify-center gap-6"
            style={{ animationDelay: "1.4s" }}
          >
            <div className="text-center">
              <p className="mb-2 text-[10px] tracking-[0.3em] text-white/40">YOU</p>
              <p className="serif text-[20px] tracking-[0.2em] text-white/85">
                {match.selfMbti}
              </p>
              <p className="serif mt-1 text-[10px] tracking-wide text-white/40">
                {self.selfLabel}
              </p>
            </div>
            <div className="text-[24px] text-[var(--accent)]/60">×</div>
            <div className="text-center">
              <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--accent)]/70">
                ATTRACTION
              </p>
              <p className="serif text-[20px] tracking-[0.2em] text-[var(--accent)]">
                {match.attractionMbti}
              </p>
              <p className="serif mt-1 text-[10px] tracking-wide text-white/40">
                惹かれるタイプ
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <ScrollReveal className="mb-20">
          <div className="divider-soft mb-8" />
          <p className="serif text-[14px] font-light leading-[2.4] tracking-wide text-white/85">
            {match.description}
          </p>
        </ScrollReveal>

        {/* Axis comparison */}
        <ScrollReveal className="mb-20">
          <p className="mb-4">
            <span className="heading-eyebrow">軸別の比較</span>
          </p>
          <p className="serif mb-10 text-[13px] font-light italic tracking-wide text-white/55">
            あなた自身 と、あなたが惹かれる相手
          </p>

          <div className="space-y-12">
            {match.axisCompare.map((axis) => {
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
                    {/* Self marker - top */}
                    <div
                      className="absolute z-10"
                      style={{
                        left: `${axis.self}%`,
                        top: "-22px",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="serif text-[10px] tracking-wide text-white whitespace-nowrap mb-1">
                          自分
                        </span>
                        <span className="text-white text-[10px] leading-none">▼</span>
                      </div>
                    </div>
                    {/* Attraction marker - bottom */}
                    <div
                      className="absolute z-10"
                      style={{
                        left: `${axis.attraction}%`,
                        top: "0",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[var(--accent)] text-[10px] leading-none">▲</span>
                        <span className="serif text-[10px] tracking-wide text-[var(--accent)] whitespace-nowrap mt-1">
                          惹かれる相手
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollReveal>

        {/* Detected insights - 当てる洞察 */}
        {match.insights.length > 0 && (
          <ScrollReveal className="mb-20">
            <p className="mb-6">
              <span className="heading-eyebrow">見抜かれた癖</span>
            </p>
            <p className="serif mb-8 text-[13px] font-light italic tracking-wide text-white/55">
              あなたの恋愛パターン、こう見える
            </p>
            <div className="space-y-6">
              {match.insights.map((insight, i) => (
                <div key={i} className="accent-border-left pl-5">
                  <p className="serif text-[14px] font-light leading-[2.1] tracking-wide text-white/85">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Trap patterns - 危険な繰り返し */}
        {match.traps.length > 0 && (
          <ScrollReveal className="mb-20">
            <p className="mb-6">
              <span className="heading-eyebrow">繰り返してきた罠</span>
            </p>
            <p className="serif mb-8 text-[13px] font-light italic tracking-wide text-white/55">
              気づいてた？この組み合わせの典型
            </p>
            <div className="space-y-5">
              {match.traps.map((trap, i) => (
                <div
                  key={i}
                  className="border border-[var(--accent)]/15 p-5"
                  style={{ background: "rgba(212, 165, 184, 0.03)" }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="serif text-[10px] tracking-[0.3em] text-[var(--accent)]">
                      PATTERN {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="serif text-[13px] font-light leading-[2] tracking-wide text-white/85">
                    {trap}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Ideal type - 本当に合うタイプ */}
        <ScrollReveal className="mb-20">
          <p className="mb-6">
            <span className="heading-eyebrow">本当に合うタイプ</span>
          </p>
          <p className="serif mb-8 text-[13px] font-light italic tracking-wide text-white/55">
            あなたが惹かれる人とは、別の話
          </p>
          <div className="border border-white/10 bg-white/[0.02] p-8 text-center">
            <p className="mb-2 text-[10px] tracking-[0.4em] text-white/40">
              IDEAL MATCH
            </p>
            <p className="serif mb-4 text-[28px] tracking-[0.2em] text-[var(--accent)]">
              {match.idealType.mbti}
            </p>
            <p className="serif mb-6 text-[14px] font-light tracking-wide text-white/85">
              {match.idealType.label}
            </p>
            <div className="divider-soft mx-auto mb-6 w-12" />
            <p className="serif text-[13px] font-light leading-[2.1] tracking-wide text-white/65">
              {match.idealType.reason}
            </p>
          </div>
        </ScrollReveal>

        {/* Advice */}
        <ScrollReveal className="mb-20">
          <p className="mb-6">
            <span className="heading-eyebrow">アドバイス</span>
          </p>
          <div className="accent-border-left pl-6">
            <p className="serif text-[15px] font-light italic leading-[2.2] tracking-wide text-white/95">
              {match.advice}
            </p>
          </div>
        </ScrollReveal>

        {/* Actions */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 pb-16">
            <div className="divider-accent mx-auto mb-10 w-16" />
            <Link href="/result" className="btn-secondary w-full text-center">
              恋愛タイプの結果を見る
            </Link>
            <Link href="/mypage" className="btn-ghost w-full text-center">
              診断シートを見る
            </Link>
            <button
              onClick={() => {
                if (!confirm("自己診断をやり直しますか？\n現在の結果は削除されます。")) return
                localStorage.removeItem("self-scores")
                window.location.href = "/diagnosis-self"
              }}
              className="mt-4 text-[11px] tracking-[0.3em] text-white/30 transition-colors hover:text-[var(--accent)]"
            >
              ↻ 自己診断をやり直す
            </button>
            <Link
              href="/"
              className="text-[11px] tracking-[0.3em] text-white/25 transition-colors hover:text-[var(--accent)]"
            >
              トップに戻る
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
