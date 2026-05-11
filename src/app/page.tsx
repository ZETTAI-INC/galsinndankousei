"use client"

import Link from "next/link"

export default function TopPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8 py-20">
      <div className="w-full max-w-md text-center">
        {/* Eyebrow */}
        <div
          className="animate-fade-in mb-12"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="heading-eyebrow">恋愛MBTI診断</span>
        </div>

        {/* Hero title */}
        <h1
          className="title-editorial animate-blur-in mb-12 text-[42px] sm:text-[48px]"
          style={{ animationDelay: "0.6s" }}
        >
          あなたが
          <br />
          惹かれる
          <br />
          <em>16タイプ</em>
        </h1>

        {/* Sub-copy */}
        <p
          className="serif animate-fade-in-up mb-6 text-[14px] font-light leading-[2.4] tracking-wide text-white/70"
          style={{ animationDelay: "1.4s" }}
        >
          24の質問で、あなたが
          <br />
          無意識に選んでしまう人を紐解く。
        </p>

        {/* 重要な前提を明示 */}
        <p
          className="animate-fade-in mb-12 text-[11px] tracking-[0.1em] text-[var(--accent)]/70"
          style={{ animationDelay: "1.6s" }}
        >
          ※ あなたが惹かれる相手のMBTIを当てる診断です
          <br />
          （自分自身のMBTIを当てるものではありません）
        </p>

        <div
          className="animate-fade-in-up mb-12"
          style={{ animationDelay: "1.9s" }}
        >
          <Link href="/diagnosis" className="btn-primary">
            診断をはじめる
          </Link>
        </div>

        <div
          className="animate-fade-in mb-12 flex items-center justify-center gap-3 text-[10px] tracking-[0.3em] text-white/30"
          style={{ animationDelay: "2.4s" }}
        >
          <span>24 QUESTIONS</span>
          <span>·</span>
          <span>3 MIN</span>
        </div>

        {/* セカンダリナビ - もう診断済みの人向け */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "2.7s" }}
        >
          <div className="divider-soft mx-auto mb-8 w-16" />
          <p className="serif mb-4 text-[11px] font-light tracking-wide text-white/40">
            すでに診断済みなら
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/mypage"
              className="btn-secondary"
            >
              📋 診断シート
            </Link>
            <Link
              href="/mycode"
              className="btn-secondary"
            >
              ⌘ マイコード発行
            </Link>
          </div>
          <div className="mt-3 flex justify-center">
            <Link href="/daily" className="btn-ghost">
              ✦ 今日の沼り危険度
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
