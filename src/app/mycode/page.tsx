"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getMyCode } from "@/lib/code"
import type { SharedData } from "@/lib/code"

export default function MyCodePage() {
  const [code, setCode] = useState<string>("")
  const [data, setData] = useState<SharedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const result = getMyCode()
    if (!result) {
      setError("まず診断を受けてください")
      return
    }
    setCode(result.code)
    setData(result.data)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Copy failed:", e)
    }
  }

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/match-with?code=${encodeURIComponent(code)}`
    : ""

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Copy failed:", e)
    }
  }

  const handleShareLine = () => {
    const text = `私のNUMARIコード送るね、相性見て\n\n${shareUrl}`
    window.open(`https://line.me/R/share?text=${encodeURIComponent(text)}`, "_blank")
  }

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="serif mb-8 text-[14px] text-white/60">{error}</p>
        <Link href="/diagnosis" className="btn-primary">
          診断をはじめる
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-dvh px-6 py-20">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="animate-fade-in mb-10">
            <span className="heading-eyebrow">あなたのコード</span>
          </div>

          <h1 className="title-editorial animate-blur-in mb-8 text-[36px] sm:text-[40px]">
            <em>マイコード</em>
          </h1>

          <div className="mx-auto mb-8 h-px w-16 bg-[var(--accent)] opacity-50" />

          <p className="serif animate-fade-in mb-3 text-[14px] font-light leading-[2.1] tracking-wide text-white/85">
            このコードを送ると、
            <br />
            相手は詳しい相性を見れる。
          </p>
        </div>

        {/* Data badges */}
        {data && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {data.hasAttraction && (
              <span
                className="border border-[var(--accent)]/30 px-3 py-1 text-[10px] tracking-[0.15em] text-[var(--accent)]"
                style={{ background: "rgba(212, 165, 184, 0.05)" }}
              >
                ♡ 恋愛MBTI診断
              </span>
            )}
            {data.hasSelf && (
              <span
                className="border border-[var(--accent)]/30 px-3 py-1 text-[10px] tracking-[0.15em] text-[var(--accent)]"
                style={{ background: "rgba(212, 165, 184, 0.05)" }}
              >
                ✦ 自己診断
              </span>
            )}
          </div>
        )}

        {/* The code */}
        <div className="mb-8 border border-white/10 bg-white/[0.02] p-6">
          <p className="mb-3 text-[10px] tracking-[0.3em] text-white/40">CODE</p>
          <p
            className="serif break-all text-[12px] leading-[1.7] tracking-wide text-white/85"
            style={{ fontFamily: "var(--font-noto-serif-jp), monospace" }}
          >
            {code}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={handleCopy} className="btn-primary w-full">
            {copied ? "コピーしました ✓" : "コードをコピー"}
          </button>

          <button onClick={handleCopyLink} className="btn-secondary w-full">
            診断リンクをコピー
          </button>

          <button onClick={handleShareLine} className="btn-secondary w-full">
            LINEで送る
          </button>
        </div>

        {/* Notes */}
        <div className="mt-12 border border-white/8 bg-white/[0.015] p-5">
          <p className="serif mb-2 text-[11px] tracking-wide text-white/50">
            診断完了の数で精度が変わる
          </p>
          <p className="serif text-[11px] font-light leading-[1.9] tracking-wide text-white/40">
            両方完了 → 高精度マッチ
            <br />
            片方のみ → 中精度
            <br />
            （もう一つの診断を受けると、相性精度が上がる）
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <Link href="/match-with" className="btn-ghost">
            相手のコードを入力する
          </Link>
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
