"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { toPng } from "html-to-image"
import type { AnalysisResult, AnalysisScores } from "@/lib/types"
import { LoadingAnalysis } from "@/components/LoadingAnalysis"
import { ShareImage } from "@/components/ShareImage"
import { ScrollReveal } from "@/components/ScrollReveal"
import { RadarChart } from "@/components/RadarChart"

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const shareRef = useRef<HTMLDivElement>(null)

  const siteUrl = typeof window !== "undefined" ? window.location.origin : ""

  useEffect(() => {
    let scores: AnalysisScores | null = null
    try {
      const stored = typeof window !== "undefined"
        ? localStorage.getItem("diagnosis-scores")
        : null
      if (!stored) {
        setError("診断データが見つかりません")
        setIsLoading(false)
        return
      }
      scores = JSON.parse(stored) as AnalysisScores
    } catch {
      setError("診断データが壊れています。もう一度診断してください。")
      setIsLoading(false)
      return
    }

    const gender = (() => {
      try {
        return localStorage.getItem("diagnosis-gender") ?? "female"
      } catch {
        return "female"
      }
    })()

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
        // 相性診断用にdisplayTypeをキャッシュ
        if (typeof window !== "undefined") {
          localStorage.setItem("attraction-result-cache", JSON.stringify({
            displayType: data.displayType,
            displayName: data.displayName,
          }))
        }
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
    const text = `私が惹かれるタイプ「${result.displayName}」だった。希少度${result.rarityPercent}%。当たりすぎてて笑った`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(siteUrl)}`
    window.open(url, "_blank")
  }, [result, siteUrl])

  const handleShareLINE = useCallback(() => {
    if (!result) return
    const text = `恋愛MBTI診断やったら「${result.displayName}」だった。希少度${result.rarityPercent}%、怖いくらい当たってる\n${siteUrl}`
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
        {/* Hero - Decisive moment */}
        <div className="mb-24 text-center">
          {/* Eyebrow */}
          <div
            className="animate-fade-in mb-10"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="heading-eyebrow">あなたのタイプ</span>
          </div>

          {/* Display name - large serif */}
          <h1
            className="title-editorial animate-blur-in mb-10 text-[36px] sm:text-[42px]"
            style={{ animationDelay: "0.5s" }}
          >
            {result.displayName}
          </h1>

          {/* Divider */}
          <div
            className="animate-fade-in mx-auto mb-10 h-px w-16 bg-[var(--accent)] opacity-50"
            style={{ animationDelay: "1.0s" }}
          />

          {/* Tagline */}
          <p
            className="serif animate-fade-in mx-auto mb-16 max-w-sm text-[16px] font-light leading-[2.1] tracking-wide text-white/85"
            style={{ animationDelay: "1.2s" }}
          >
            「{result.tagline}」
          </p>

          {/* Rarity - large editorial number */}
          <div
            className="animate-scale-in mb-16 flex flex-col items-center"
            style={{ animationDelay: "1.6s" }}
          >
            <p className="mb-4 text-[10px] tracking-[0.4em] text-white/40">
              RARITY
            </p>
            <div className="flex items-baseline gap-2">
              <span className="number-large">{result.rarityPercent}</span>
              <span className="text-[14px] tracking-[0.1em] text-white/50">%</span>
            </div>
          </div>

          {/* Radar chart */}
          <div
            className="animate-fade-in mb-12"
            style={{ animationDelay: "2.0s" }}
          >
            <RadarChart data={result.axisChart} size={280} />
          </div>

          {/* MBTI base */}
          <div
            className="animate-fade-in"
            style={{ animationDelay: "2.4s" }}
          >
            <p className="mb-2 text-[10px] tracking-[0.5em] text-white/30">
              BASE TYPE
            </p>
            <p className="serif text-[20px] tracking-[0.25em] text-[var(--accent)]">
              {result.displayType}
            </p>
          </div>
        </div>

        {/* Core Analysis */}
        <section className="mb-20">
          {result.coreAnalysis.map((analysis, i) => (
            <ScrollReveal key={i} className="mb-12" delay={i * 200}>
              <div className="divider-soft mb-6" />
              <p className="text-[14px] font-light leading-[2.4] tracking-[0.04em] text-white/85">
                {analysis}
              </p>
            </ScrollReveal>
          ))}
        </section>

        {/* MBTI Analysis */}
        <section className="mb-20">
          <ScrollReveal>
            <p className="mb-12">
              <span className="heading-eyebrow">タイプ別分析</span>
            </p>
          </ScrollReveal>

          {result.mbtiAnalysis.map((item, i) => (
            <ScrollReveal
              key={item.type}
              className="accent-border-left mb-10 pl-5"
              delay={i * 150}
            >
              <div className="mb-1 flex items-baseline gap-3">
                <span className="text-[11px] tracking-[0.3em] text-pink-300/55">
                  {item.type}
                </span>
                <span className="text-[10px] text-purple-300/35">系の</span>
              </div>
              <p className="serif-accent mb-4 text-[16px] font-light tracking-wide text-pink-100/85">
                &ldquo;{item.trait}&rdquo;
              </p>
              <p className="text-[13px] font-light leading-[2.1] tracking-[0.03em] text-white/55">
                {item.description}
              </p>
            </ScrollReveal>
          ))}
        </section>

        {/* Micro Traits */}
        <section className="mb-20">
          <ScrollReveal>
            <p className="mb-6">
              <span className="heading-eyebrow">惹かれるポイント</span>
            </p>
            <p className="serif mb-10 text-[18px] font-light tracking-wide text-white/95">
              たぶんこういう人、<span className="highlight-pink">好きでしょ？</span>
            </p>
          </ScrollReveal>

          <div className="flex flex-col gap-2">
            {result.microTraits.map((trait, i) => (
              <ScrollReveal
                key={i}
                className="flex items-start gap-3 py-1"
                delay={i * 40}
              >
                <span className="mt-[10px] h-[1px] w-3 shrink-0 bg-pink-400/40" />
                <span className="text-[13px] font-light leading-[1.9] tracking-[0.03em] text-white/65">
                  {trait}
                </span>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* MBTI Ranking */}
        <section className="mb-20">
          <ScrollReveal>
            <p className="mb-6">
              <span className="heading-eyebrow">MBTIランキング</span>
            </p>
            <p className="serif mb-10 text-[18px] font-light tracking-wide text-white/95">
              あなたが惹かれやすいMBTI
            </p>
          </ScrollReveal>

          {result.mbtiRanking.map((mbti, i) => (
            <ScrollReveal key={mbti.type} className="mb-6 flex items-start gap-4" delay={i * 100}>
              <span className="serif-accent mt-1 text-[24px] font-light text-pink-400/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="text-[15px] tracking-[0.15em] text-pink-100/85">
                    {mbti.type}
                  </span>
                  <span className="text-[10px] tracking-wide text-purple-300/40">
                    {mbti.label}
                  </span>
                </div>
                <p className="text-[12px] font-light leading-[2] tracking-[0.03em] text-white/50">
                  {mbti.reason}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </section>

        {/* Share & Actions */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 pb-16">
            {/* 拡張機能への誘導 */}
            <div className="mb-12 w-full space-y-8">
              {/* 一番目立つ：マイコード発行 */}
              <div
                className="border border-[var(--accent)]/30 p-6"
                style={{
                  background: "linear-gradient(135deg, rgba(212, 165, 184, 0.10), rgba(184, 168, 212, 0.05))",
                }}
              >
                <div className="divider-accent mx-auto mb-6 w-12" />
                <p className="serif mb-3 text-center text-[16px] font-light tracking-wide text-white/95">
                  友達と<em className="text-[var(--accent)] not-italic">相性偏差値</em>出してみる？
                </p>
                <p className="serif mb-6 text-center text-[12px] font-light leading-[1.9] tracking-wide text-white/55">
                  あなたのコードを発行 → 友達に送る。<br />
                  相手も診断したら、自動で相性が出る。
                </p>
                <Link
                  href="/mycode"
                  className="btn-primary inline-block w-full text-center"
                >
                  ⌘ マイコードを発行
                </Link>
              </div>

              <div className="divider-soft" />

              <div>
                <p className="serif mb-3 text-[15px] font-light tracking-wide text-white/85">
                  次は<em className="text-[var(--accent)] not-italic">あなた自身</em>を診断
                </p>
                <p className="serif mb-6 text-[12px] font-light leading-[1.9] tracking-wide text-white/50">
                  惹かれるタイプと自分のタイプ、<br />
                  組み合わせて相性まで見抜く。
                </p>
                <Link
                  href="/diagnosis-self"
                  className="btn-secondary inline-block w-full text-center"
                >
                  自己診断にすすむ
                </Link>
              </div>

              <div className="divider-soft" />

              <div>
                <p className="serif mb-3 text-[15px] font-light tracking-wide text-white/85">
                  <em className="text-[var(--accent)] not-italic">気になるあの人</em>を診断
                </p>
                <p className="serif mb-6 text-[12px] font-light leading-[1.9] tracking-wide text-white/50">
                  好きな人・推し・元カレ。<br />
                  あの人のタイプを当てる。
                </p>
                <Link
                  href="/diagnosis-other"
                  className="btn-secondary inline-block w-full text-center"
                >
                  あの人を診断する
                </Link>
              </div>

              <div className="divider-soft" />

              <div>
                <p className="serif mb-3 text-[15px] font-light tracking-wide text-white/85">
                  <em className="text-[var(--accent)] not-italic">あなたを好きになる人</em>
                </p>
                <p className="serif mb-6 text-[12px] font-light leading-[1.9] tracking-wide text-white/50">
                  逆診断。あなたに惹かれてくる人と、<br />
                  無意識のサインを見抜く。
                </p>
                <Link
                  href="/loved-by"
                  className="btn-secondary inline-block w-full text-center"
                >
                  逆診断にすすむ
                </Link>
              </div>
            </div>

            {/* マイページへの大きな導線 */}
            <div className="mb-8 w-full">
              <Link
                href="/mypage"
                className="block w-full border border-white/15 p-5 text-center transition-all duration-300 hover:border-[var(--accent)]/40 hover:bg-white/[0.02]"
              >
                <span className="serif text-[14px] tracking-wide text-white/85">
                  📋 診断シートを見る
                </span>
                <p className="serif mt-1 text-[11px] tracking-wide text-white/40">
                  これまでの診断結果を一覧で
                </p>
              </Link>
            </div>

            <p className="serif mb-6 text-[12px] font-light tracking-wide text-white/50">
              友達にもやらせよ
            </p>

            <div className="flex w-full flex-col gap-3">
              <button
                onClick={handleShareTwitter}
                className="btn-secondary w-full"
              >
                Xでシェア
              </button>

              <button
                onClick={handleShareLINE}
                className="btn-secondary w-full"
              >
                LINEで送る
              </button>

              <button
                onClick={handleSaveImage}
                className="btn-ghost w-full"
              >
                画像で保存
              </button>
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <Link
                href="/mypage"
                className="text-[11px] tracking-[0.3em] text-[var(--accent)]/70 transition-colors hover:text-[var(--accent)]"
              >
                診断シートを見る
              </Link>
              <button
                onClick={() => {
                  if (!confirm("恋愛MBTI診断をやり直しますか？\n現在の結果は削除されます。")) return
                  localStorage.removeItem("diagnosis-scores")
                  localStorage.removeItem("attraction-result-cache")
                  window.location.href = "/diagnosis"
                }}
                className="text-[11px] tracking-[0.3em] text-white/30 transition-colors hover:text-[var(--accent)]"
              >
                ↻ この診断をやり直す
              </button>
              <Link
                href="/"
                className="text-[11px] tracking-[0.3em] text-white/25 transition-colors hover:text-[var(--accent)]"
              >
                トップに戻る
              </Link>
            </div>
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
