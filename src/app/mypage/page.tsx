"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { AnalysisScores } from "@/lib/types"
import { ScrollReveal } from "@/components/ScrollReveal"
import { determineSelfMbti, getSelfMbtiInfo } from "@/lib/match"
import { determineOtherMbti } from "@/lib/other-match"

interface StampStatus {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly icon: string
  readonly path: string
  readonly diagnosisPath: string
  readonly completed: boolean
  readonly result?: string // 完了時の結果テキスト
  readonly resetKeys?: readonly string[] // やり直し時に削除するlocalStorageキー
}

export default function MyPage() {
  const [stamps, setStamps] = useState<StampStatus[]>([])
  const [otherName, setOtherName] = useState<string>("")

  useEffect(() => {
    if (typeof window === "undefined") return

    const attractionScores = localStorage.getItem("diagnosis-scores")
    const selfScores = localStorage.getItem("self-scores")
    const otherScores = localStorage.getItem("other-scores")
    const otherNameStored = localStorage.getItem("other-name") ?? ""
    setOtherName(otherNameStored)

    const attractionResultCache = localStorage.getItem("attraction-result-cache")
    let attractionLabel = ""
    if (attractionResultCache) {
      try {
        const cached = JSON.parse(attractionResultCache)
        attractionLabel = cached.displayName ?? cached.displayType ?? ""
      } catch {
        // ignore
      }
    }

    let selfLabel = ""
    if (selfScores) {
      try {
        const scores: AnalysisScores = JSON.parse(selfScores)
        const mbti = determineSelfMbti(scores)
        const info = getSelfMbtiInfo(mbti)
        selfLabel = `${mbti} · ${info.label}`
      } catch {
        // ignore
      }
    }

    let otherLabel = ""
    if (otherScores) {
      try {
        const scores: AnalysisScores = JSON.parse(otherScores)
        const mbti = determineOtherMbti(scores)
        const info = getSelfMbtiInfo(mbti)
        otherLabel = `${mbti} · ${info.label}`
      } catch {
        // ignore
      }
    }

    const data: StampStatus[] = [
      {
        id: "attraction",
        title: "恋愛MBTI診断",
        subtitle: "あなたが惹かれるタイプ",
        icon: "♡",
        path: "/result",
        diagnosisPath: "/diagnosis",
        completed: !!attractionScores,
        result: attractionLabel,
        resetKeys: ["diagnosis-scores", "attraction-result-cache"],
      },
      {
        id: "self",
        title: "自己診断",
        subtitle: "あなた自身のタイプ",
        icon: "✦",
        path: "/match",
        diagnosisPath: "/diagnosis-self",
        completed: !!selfScores,
        result: selfLabel,
        resetKeys: ["self-scores"],
      },
      {
        id: "loved-by",
        title: "逆診断",
        subtitle: "あなたを好きになる人",
        icon: "✿",
        path: "/loved-by",
        diagnosisPath: "/loved-by",
        completed: !!attractionScores || !!selfScores, // どちらかあれば見れる
        result: "あなたに惹かれる人を解析",
      },
      {
        id: "match",
        title: "相性診断",
        subtitle: "理想 × 自分",
        icon: "❋",
        path: "/match",
        diagnosisPath: "/diagnosis-self",
        completed: !!attractionScores && !!selfScores,
        result: !!attractionScores && !!selfScores ? "両方の診断完了" : "",
      },
      {
        id: "other",
        title: "あの人を診断",
        subtitle: "気になる人を診断",
        icon: "✶",
        path: "/match-other",
        diagnosisPath: "/diagnosis-other",
        completed: !!otherScores,
        result: otherScores && otherNameStored ? `${otherNameStored} · ${otherLabel.split(" · ")[0] ?? ""}` : otherLabel,
        resetKeys: ["other-scores", "other-name"],
      },
    ]

    setStamps(data)
  }, [])

  const completedCount = stamps.filter((s) => s.completed).length
  const totalCount = stamps.length

  const handleReset = () => {
    if (!confirm("すべての診断結果を削除します。よろしいですか？")) return
    if (typeof window === "undefined") return
    localStorage.removeItem("diagnosis-scores")
    localStorage.removeItem("self-scores")
    localStorage.removeItem("other-scores")
    localStorage.removeItem("attraction-result-cache")
    localStorage.removeItem("other-name")
    localStorage.removeItem("diagnosis-gender")
    window.location.reload()
  }

  return (
    <div className="min-h-dvh px-6 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Compact Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="title-editorial mb-1 text-[28px] sm:text-[34px]">
              <em>マイページ</em>
            </h1>
            <p className="serif text-[12px] tracking-wide text-white/55">
              診断履歴のシート
            </p>
          </div>

          {/* Progress badge - inline */}
          <div className="rarity-badge">
            <span className="text-[9px] tracking-[0.2em] text-white/50">
              取得
            </span>
            <span className="serif text-[20px] font-light text-[var(--accent)]">
              {completedCount}
            </span>
            <span className="text-[10px] text-white/40">/{totalCount}</span>
          </div>
        </div>

        {/* Stamp Grid */}
        <ScrollReveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {stamps.map((stamp, i) => (
              <StampCard key={stamp.id} stamp={stamp} index={i} />
            ))}
          </div>
        </ScrollReveal>

        {/* Quick actions */}
        {completedCount > 0 && (
          <ScrollReveal>
            <div className="mt-20 flex flex-col items-center gap-3">
              <div className="divider-soft mx-auto mb-8 w-24" />

              {!stamps.find((s) => s.id === "attraction")?.completed && (
                <Link href="/diagnosis" className="btn-primary w-full max-w-xs text-center">
                  まず恋愛MBTI診断から
                </Link>
              )}

              {stamps.find((s) => s.id === "attraction")?.completed && completedCount < totalCount && (
                <p className="serif mb-2 text-[13px] font-light italic tracking-wide text-white/60">
                  あと{totalCount - completedCount}つの診断で全部揃う
                </p>
              )}

              {completedCount === totalCount && (
                <p className="serif mb-2 text-[14px] font-light tracking-wide text-[var(--accent)]">
                  全部コンプリート ✓
                </p>
              )}

              <Link
                href="/diagnosis-other"
                className="btn-secondary w-full max-w-xs text-center"
              >
                別の人を診断する
              </Link>

              <div className="divider-soft mx-auto my-6 w-24" />

              <p className="serif mb-2 text-[12px] font-light italic tracking-wide text-white/50">
                友達と相性偏差値を出す
              </p>

              <Link
                href="/mycode"
                className="btn-primary w-full max-w-xs text-center"
              >
                マイコードを発行
              </Link>

              <Link
                href="/match-with"
                className="btn-secondary w-full max-w-xs text-center"
              >
                相手のコードを入力
              </Link>

              <button
                onClick={handleReset}
                className="mt-8 text-[10px] tracking-[0.3em] text-white/25 transition-colors hover:text-[var(--accent)]/60"
              >
                すべてリセット
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* Empty state */}
        {completedCount === 0 && (
          <ScrollReveal>
            <div className="mt-20 text-center">
              <p className="serif mb-8 text-[14px] font-light italic tracking-wide text-white/60">
                まだ何も診断してないみたい
              </p>
              <Link href="/diagnosis" className="btn-primary">
                最初の診断をはじめる
              </Link>
            </div>
          </ScrollReveal>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-[11px] tracking-[0.3em] text-white/30 transition-colors hover:text-[var(--accent)]"
          >
            トップに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

function StampCard({ stamp, index }: { stamp: StampStatus; index: number }) {
  const handleRetake = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!stamp.resetKeys) return
    const message = `「${stamp.title}」をやり直しますか？\n現在の結果は削除されます。`
    if (!confirm(message)) return
    for (const key of stamp.resetKeys) {
      localStorage.removeItem(key)
    }
    window.location.href = stamp.diagnosisPath
  }

  return (
    <div
      className="group relative overflow-hidden border border-white/10 transition-all duration-500 hover:border-[var(--accent)]/40"
      style={{
        background: stamp.completed
          ? "linear-gradient(135deg, rgba(212, 165, 184, 0.06), rgba(184, 168, 212, 0.03))"
          : "rgba(255, 255, 255, 0.015)",
        animationDelay: `${index * 100}ms`,
      }}
    >
      <Link
        href={stamp.completed ? stamp.path : stamp.diagnosisPath}
        className="block p-6"
      >
        {/* Stamp icon */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className="serif text-[36px] leading-none"
            style={{
              color: stamp.completed
                ? "rgba(212, 165, 184, 0.9)"
                : "rgba(245, 237, 229, 0.15)",
            }}
          >
            {stamp.icon}
          </span>
          {stamp.completed ? (
            <span
              className="serif inline-flex h-7 w-7 items-center justify-center rounded-full text-[12px]"
              style={{
                background: "rgba(212, 165, 184, 0.2)",
                border: "1px solid rgba(212, 165, 184, 0.5)",
                color: "var(--accent)",
              }}
            >
              ✓
            </span>
          ) : (
            <span className="text-[10px] tracking-[0.25em] text-white/25">
              未取得
            </span>
          )}
        </div>

        <h3
          className="serif mb-1 text-[18px] font-light tracking-wide"
          style={{ color: stamp.completed ? "#fff" : "rgba(245, 237, 229, 0.5)" }}
        >
          {stamp.title}
        </h3>
        <p
          className="serif mb-4 text-[11px] tracking-wide"
          style={{ color: stamp.completed ? "rgba(245, 237, 229, 0.55)" : "rgba(245, 237, 229, 0.3)" }}
        >
          {stamp.subtitle}
        </p>

        {/* Result preview */}
        {stamp.completed && stamp.result && (
          <div className="border-t border-white/8 pt-4">
            <p className="serif text-[11px] font-light italic leading-[1.6] tracking-wide text-[var(--accent)]/85">
              {stamp.result}
            </p>
          </div>
        )}

        {/* Action label */}
        <div className="mt-4 flex items-center justify-end text-[11px] tracking-[0.2em] text-white/30 transition-all group-hover:translate-x-1 group-hover:text-[var(--accent)]">
          {stamp.completed ? "結果を見る →" : "やってみる →"}
        </div>
      </Link>

      {/* Retake button (完了時のみ、独自のresetKeysがある時のみ) */}
      {stamp.completed && stamp.resetKeys && (
        <button
          onClick={handleRetake}
          className="block w-full border-t border-white/8 py-3 text-[10px] tracking-[0.25em] text-white/30 transition-colors hover:bg-[var(--accent)]/5 hover:text-[var(--accent)]"
        >
          ↻ やり直す
        </button>
      )}
    </div>
  )
}
