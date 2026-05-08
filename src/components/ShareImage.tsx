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
          background: "#050505",
          color: "#e8e8e8",
          padding: "48px 32px",
          width: "600px",
          fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.25)",
            marginBottom: "32px",
            textTransform: "uppercase",
          }}
        >
          Persona Attraction Diagnosis
        </div>

        {/* Core Analysis */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "13px",
              lineHeight: "2.2",
              color: "rgba(255,255,255,0.75)",
              whiteSpace: "pre-line",
            }}
          >
            {result.coreAnalysis[0]}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            marginBottom: "32px",
          }}
        />

        {/* Top MBTI */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "16px",
              letterSpacing: "0.15em",
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
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.2)",
                  minWidth: "16px",
                }}
              >
                {i + 1}.
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.1em",
                }}
              >
                {mbti.type}
              </span>
            </div>
          ))}
        </div>

        {/* Micro Traits (top 6) */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            marginBottom: "24px",
          }}
        />
        <div>
          {result.microTraits.slice(0, 6).map((trait) => (
            <div
              key={trait}
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "6px",
                paddingLeft: "12px",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {trait}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "32px",
            fontSize: "9px",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.2em",
          }}
        >
          あなたが沼る人格診断
        </div>
      </div>
    )
  }
)
