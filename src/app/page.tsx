"use client"

import Link from "next/link"

export default function TopPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p
          className="animate-fade-in-up mb-6 text-[10px] tracking-[0.4em] text-fuchsia-400/50 uppercase"
          style={{ animationDelay: "0.3s" }}
        >
          Divine Gyaru Diagnosis
        </p>

        <h1
          className="text-glow-pink animate-fade-in-up mb-4 text-[28px] font-bold leading-[1.5] tracking-wide"
          style={{
            animationDelay: "0.6s",
            background: "linear-gradient(135deg, #ff0066, #e040fb, #bf5af2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          好きになる人、
          <br />
          毎回似てない？
        </h1>

        <p
          className="animate-fade-in mb-5 text-[15px] font-light leading-[2] tracking-wide text-fuchsia-200/70"
          style={{ animationDelay: "1.0s" }}
        >
          てかさ、それ偶然じゃないから。
        </p>

        <p
          className="animate-fade-in mb-10 text-[12px] font-light leading-[1.9] tracking-wide text-purple-300/35"
          style={{ animationDelay: "1.4s" }}
        >
          回答に応じて質問が変化。
          <br />
          あなたが無意識に沼る16タイプを
          <br />
          ギャル神が見抜きます。
        </p>

        <div
          className="animate-fade-in mb-6"
          style={{ animationDelay: "1.8s" }}
        >
          <Link
            href="/diagnosis"
            className="border-glow inline-block border px-10 py-4 text-[13px] font-medium tracking-[0.25em] text-fuchsia-200/80 transition-all duration-500 hover:text-white"
          >
            診てもらう
          </Link>
        </div>

        <p
          className="animate-fade-in text-[11px] tracking-wider text-purple-400/25"
          style={{ animationDelay: "2.2s" }}
        >
          24問 / 約3分
        </p>
      </div>
    </div>
  )
}
