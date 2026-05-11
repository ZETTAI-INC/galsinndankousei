"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { decodeShareCode, getMyCode, type SharedData } from "@/lib/code"
import { calculatePairMatch, type PairMatchResult } from "@/lib/pair-match"
import { ScrollReveal } from "@/components/ScrollReveal"
import { LoadingAnalysis } from "@/components/LoadingAnalysis"

function MatchWithContent() {
  const searchParams = useSearchParams()
  const initialCode = searchParams.get("code") ?? ""

  const [inputCode, setInputCode] = useState(initialCode)
  const [theirData, setTheirData] = useState<SharedData | null>(null)
  const [myData, setMyData] = useState<SharedData | null>(null)
  const [result, setResult] = useState<PairMatchResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 自分のデータをロード
  useEffect(() => {
    const my = getMyCode()
    if (my) setMyData(my.data)
  }, [])

  const runMatch = useCallback((code: string) => {
    const decoded = decodeShareCode(code)
    if (!decoded) {
      setError("コードが正しくありません")
      return
    }
    setError(null)
    setIsAnalyzing(true)
    setTheirData(decoded)

    const my = getMyCode()
    if (!my) {
      setError("まずあなた自身が診断を受けてください")
      setIsAnalyzing(false)
      return
    }

    setTimeout(() => {
      const matchResult = calculatePairMatch(my.data.scores, decoded.scores)
      setResult(matchResult)
      setIsAnalyzing(false)
    }, 2500)
  }, [])

  // URLパラメータでコードがあれば自動実行
  useEffect(() => {
    if (initialCode && myData) {
      runMatch(initialCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myData, initialCode])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!inputCode.trim()) return
      runMatch(inputCode.trim())
    },
    [inputCode, runMatch]
  )

  if (isAnalyzing) return <LoadingAnalysis />

  // 入力画面
  if (!result) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="animate-fade-in mb-10">
              <span className="heading-eyebrow">相性偏差値</span>
            </div>
            <h1 className="title-editorial animate-blur-in mb-8 text-[34px] sm:text-[40px]">
              相手のコードで
              <br />
              <em>相性を見る</em>
            </h1>

            <p className="serif animate-fade-in mb-2 text-[14px] font-light leading-[2.1] tracking-wide text-white/85">
              気になる人のNUMARIコードを貼って。
              <br />
              詳しい相性偏差値が出る。
            </p>
          </div>

          {/* Status check */}
          {!myData && (
            <div
              className="mb-8 border border-[var(--accent)]/30 p-5"
              style={{ background: "rgba(212, 165, 184, 0.06)" }}
            >
              <p className="serif mb-3 text-[13px] font-light tracking-wide text-white/85">
                まずあなた自身の診断が必要
              </p>
              <Link href="/diagnosis" className="btn-secondary inline-block">
                診断にすすむ
              </Link>
            </div>
          )}

          {/* Form */}
          {myData && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="NMR-..."
                className="serif h-32 w-full resize-none border border-white/15 bg-transparent p-4 text-[12px] leading-[1.6] tracking-wide text-white placeholder:text-white/20 focus:border-[var(--accent)] focus:outline-none"
              />

              {error && (
                <p className="serif text-[12px] text-[var(--accent)]">{error}</p>
              )}

              <button type="submit" className="btn-primary w-full">
                相性を見る
              </button>
            </form>
          )}

          {/* My code link */}
          {myData && (
            <div className="mt-12 border-t border-white/8 pt-8 text-center">
              <p className="serif mb-4 text-[13px] font-light tracking-wide text-white/60">
                あなたのコードを送るには？
              </p>
              <Link href="/mycode" className="btn-ghost">
                自分のコードを表示
              </Link>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/mypage"
              className="text-[11px] tracking-[0.3em] text-white/30 transition-colors hover:text-[var(--accent)]"
            >
              マイページに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 結果画面
  return (
    <div className="min-h-dvh px-6 py-20">
      <div className="mx-auto max-w-lg">
        {/* Hero */}
        <div className="mb-20 text-center">
          <div className="animate-fade-in mb-10">
            <span className="heading-eyebrow">相性結果</span>
          </div>

          {/* Verdict */}
          <h1 className="title-editorial animate-blur-in mb-6 text-[34px] sm:text-[40px]">
            <em>{result.verdict}</em>
          </h1>

          <p
            className="serif animate-fade-in mb-12 text-[13px] font-light italic tracking-wide text-white/65"
            style={{ animationDelay: "0.6s" }}
          >
            {result.verdictDetail}
          </p>

          {/* 偏差値 - 大きく */}
          <div className="animate-scale-in mb-10" style={{ animationDelay: "1.0s" }}>
            <p className="mb-3 text-[10px] tracking-[0.4em] text-white/40">
              相性偏差値
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="serif text-[88px] font-light leading-none text-[var(--accent)]">
                {result.deviation}
              </span>
            </div>
            <p className="serif mt-3 text-[12px] tracking-wide text-white/45">
              （平均 50）
            </p>
          </div>

          {/* マッチ率 */}
          <div
            className="animate-fade-in mb-12"
            style={{ animationDelay: "1.4s" }}
          >
            <p className="mb-2 text-[10px] tracking-[0.3em] text-white/40">MATCH</p>
            <p className="serif text-[28px] font-light text-white/85">
              {result.matchPercent}<span className="text-[16px] text-white/50">%</span>
            </p>
          </div>

          {/* 精度バッジ */}
          <div
            className="animate-fade-in mb-2 inline-flex items-center gap-2 border border-white/15 px-4 py-2"
            style={{ animationDelay: "1.6s" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  result.precision === "high"
                    ? "var(--accent)"
                    : result.precision === "medium"
                      ? "rgba(212, 165, 184, 0.5)"
                      : "rgba(245, 237, 229, 0.3)",
              }}
            />
            <span className="text-[10px] tracking-[0.25em] text-white/70">
              {result.precisionLabel}
            </span>
          </div>
          <p className="serif mt-3 text-[11px] font-light leading-[1.8] tracking-wide text-white/40">
            {result.precisionDetail}
          </p>
        </div>

        {/* MBTI比較 */}
        <ScrollReveal className="mb-16">
          <div className="divider-soft mb-8" />
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="mb-2 text-[10px] tracking-[0.3em] text-white/40">YOU</p>
              {result.youInfo.selfMbti && (
                <p className="serif mb-1 text-[22px] tracking-[0.15em] text-white/90">
                  {result.youInfo.selfMbti}
                </p>
              )}
              {result.youInfo.attractionMbti && (
                <p className="serif text-[10px] tracking-wide text-white/40">
                  → 惹かれる: {result.youInfo.attractionMbti}
                </p>
              )}
            </div>
            <div>
              <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--accent)]/70">
                THEM
              </p>
              {result.themInfo.selfMbti && (
                <p className="serif mb-1 text-[22px] tracking-[0.15em] text-[var(--accent)]">
                  {result.themInfo.selfMbti}
                </p>
              )}
              {result.themInfo.attractionMbti && (
                <p className="serif text-[10px] tracking-wide text-white/40">
                  → 惹かれる: {result.themInfo.attractionMbti}
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* 方向別スコア */}
        {(result.directionalScores.youToThem !== undefined ||
          result.directionalScores.themToYou !== undefined) && (
          <ScrollReveal className="mb-20">
            <p className="mb-8">
              <span className="heading-eyebrow">方向別の引力</span>
            </p>
            <div className="space-y-6">
              {result.directionalScores.youToThem !== undefined && (
                <div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="serif text-[13px] tracking-wide text-white/85">
                      あなた → 相手
                    </span>
                    <span className="serif text-[18px] tracking-[0.1em] text-[var(--accent)]">
                      {result.directionalScores.youToThem}%
                    </span>
                  </div>
                  <div className="h-1 w-full bg-white/5">
                    <div
                      className="h-full bg-[var(--accent)]"
                      style={{ width: `${result.directionalScores.youToThem}%` }}
                    />
                  </div>
                  <p className="serif mt-2 text-[11px] font-light italic tracking-wide text-white/45">
                    あなたが相手をどれだけ「好み」と感じるか
                  </p>
                </div>
              )}
              {result.directionalScores.themToYou !== undefined && (
                <div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="serif text-[13px] tracking-wide text-white/85">
                      相手 → あなた
                    </span>
                    <span className="serif text-[18px] tracking-[0.1em] text-[var(--accent)]">
                      {result.directionalScores.themToYou}%
                    </span>
                  </div>
                  <div className="h-1 w-full bg-white/5">
                    <div
                      className="h-full bg-[var(--accent)]"
                      style={{ width: `${result.directionalScores.themToYou}%` }}
                    />
                  </div>
                  <p className="serif mt-2 text-[11px] font-light italic tracking-wide text-white/45">
                    相手があなたをどれだけ「好み」と感じるか
                  </p>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* インサイト */}
        <ScrollReveal className="mb-20">
          <p className="mb-6">
            <span className="heading-eyebrow">この組み合わせの読み</span>
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

        {/* Improve precision */}
        {result.precision !== "high" && myData && (
          <ScrollReveal className="mb-20">
            <div
              className="border border-[var(--accent)]/20 p-6"
              style={{ background: "rgba(212, 165, 184, 0.04)" }}
            >
              <p className="serif mb-3 text-[13px] font-light tracking-wide text-white/85">
                精度を上げる
              </p>
              <p className="serif mb-4 text-[12px] font-light leading-[2] tracking-wide text-white/60">
                {!myData.hasAttraction && "恋愛MBTI診断を完了すると、相手があなたを好きになる確率が見える。"}
                {!myData.hasSelf && "自己診断を完了すると、あなたが相手を好きになる確率が見える。"}
                {myData.hasAttraction && myData.hasSelf && "相手にも両方の診断を受けてもらうと、最高精度になる。"}
              </p>
              <div className="flex gap-3">
                {!myData.hasAttraction && (
                  <Link href="/diagnosis" className="btn-secondary">
                    恋愛MBTI診断
                  </Link>
                )}
                {!myData.hasSelf && (
                  <Link href="/diagnosis-self" className="btn-secondary">
                    自己診断
                  </Link>
                )}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Actions */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 pb-16">
            <div className="divider-accent mx-auto mb-10 w-16" />
            <Link href="/mycode" className="btn-primary w-full text-center">
              自分のコードを送る
            </Link>
            <button
              onClick={() => {
                setResult(null)
                setInputCode("")
                setTheirData(null)
              }}
              className="btn-secondary w-full"
            >
              別の人と試す
            </button>
            <Link
              href="/mypage"
              className="mt-8 text-[11px] tracking-[0.3em] text-white/30 transition-colors hover:text-[var(--accent)]"
            >
              マイページに戻る
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default function MatchWithPage() {
  return (
    <Suspense fallback={<LoadingAnalysis />}>
      <MatchWithContent />
    </Suspense>
  )
}
