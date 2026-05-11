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
          <span className="heading-eyebrow">恋愛人格診断</span>
        </div>

        {/* Hero title */}
        <h1
          className="title-editorial animate-blur-in mb-12 text-[42px] sm:text-[48px]"
          style={{ animationDelay: "0.6s" }}
        >
          好きになる人、
          <br />
          <em>毎回似てない？</em>
        </h1>

        {/* Sub-copy */}
        <p
          className="serif animate-fade-in-up mb-16 text-[14px] font-light leading-[2.4] tracking-wide text-white/70"
          style={{ animationDelay: "1.4s" }}
        >
          24の質問で、あなたが
          <br />
          無意識に選んでしまう人を紐解く。
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
          className="animate-fade-in mb-10 flex items-center justify-center gap-3 text-[10px] tracking-[0.3em] text-white/30"
          style={{ animationDelay: "2.4s" }}
        >
          <span>24 QUESTIONS</span>
          <span>·</span>
          <span>3 MIN</span>
        </div>

        <div
          className="animate-fade-in"
          style={{ animationDelay: "2.7s" }}
        >
          <Link
            href="/mypage"
            className="text-[11px] tracking-[0.3em] text-white/30 transition-colors hover:text-[var(--accent)]"
          >
            診断シートを見る →
          </Link>
        </div>
      </div>
    </div>
  )
}
