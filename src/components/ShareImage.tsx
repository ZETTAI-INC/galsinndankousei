"use client"

import { forwardRef } from "react"
import type { AnalysisResult } from "@/lib/types"

interface ShareImageProps {
  readonly result: AnalysisResult
}

export const ShareImage = forwardRef<HTMLDivElement, ShareImageProps>(
  function ShareImage({ result }, ref) {
    return (
      <div
        ref={ref}
        className="share-image-container"
        style={{
          background: "#0a0710",
          color: "#f5f0f7",
          padding: "56px 36px",
          width: "600px",
          fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "0.4em",
            color: "rgba(236, 72, 153, 0.5)",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          沼り診断
        </div>

        {/* Display name (hero) */}
        <div
          style={{
            fontSize: "26px",
            fontWeight: 500,
            lineHeight: "1.5",
            background: "linear-gradient(135deg, #ec4899 0%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {result.displayName}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontStyle: "italic",
            fontFamily: "'Times New Roman', serif",
            fontSize: "13px",
            lineHeight: "1.9",
            color: "rgba(245, 240, 247, 0.7)",
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          「{result.tagline}」
        </div>

        {/* Rarity */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(236, 72, 153, 0.25)",
              padding: "8px 18px",
              fontSize: "11px",
              color: "rgba(245, 240, 247, 0.7)",
              letterSpacing: "0.15em",
            }}
          >
            希少度 {result.rarityPercent}%
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.3), transparent)",
            marginBottom: "28px",
          }}
        />

        {/* Top MBTI ranking */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "10px",
              color: "rgba(236, 72, 153, 0.5)",
              marginBottom: "16px",
              letterSpacing: "0.25em",
            }}
          >
            沼りやすいMBTI
          </div>
          {result.mbtiRanking.slice(0, 4).map((mbti, i) => (
            <div
              key={mbti.type}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "14px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "rgba(236, 72, 153, 0.4)",
                  minWidth: "20px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "15px",
                  color: "rgba(245, 240, 247, 0.85)",
                  letterSpacing: "0.15em",
                }}
              >
                {mbti.type}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "rgba(245, 240, 247, 0.4)",
                }}
              >
                {mbti.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(245, 240, 247, 0.06)",
            fontSize: "10px",
            color: "rgba(245, 240, 247, 0.3)",
            letterSpacing: "0.2em",
            textAlign: "center",
          }}
        >
          沼り診断
        </div>
      </div>
    )
  }
)
