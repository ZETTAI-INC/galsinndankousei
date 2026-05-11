import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const displayName = searchParams.get("name") ?? "あなたが惹かれる16タイプ"
    const mbti = searchParams.get("mbti") ?? ""
    const rarity = searchParams.get("rarity") ?? ""

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(ellipse 60% 40% at 30% 30%, rgba(212, 165, 184, 0.4), transparent 70%), radial-gradient(ellipse 50% 50% at 70% 70%, rgba(184, 168, 212, 0.3), transparent 70%), #0a0810",
            fontFamily: "sans-serif",
            color: "#f5ede5",
            padding: "80px",
            position: "relative",
          }}
        >
          {/* Top eyebrow */}
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "0.5em",
              color: "rgba(212, 165, 184, 0.7)",
              marginBottom: "40px",
              display: "flex",
            }}
          >
            恋愛MBTI診断
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: mbti ? "60px" : "72px",
              fontWeight: 300,
              textAlign: "center",
              lineHeight: 1.3,
              marginBottom: "40px",
              background: "linear-gradient(135deg, #f5ede5 0%, #d4a5b8 50%, #b8a8d4 100%)",
              backgroundClip: "text",
              color: "transparent",
              maxWidth: "1000px",
              display: "flex",
              whiteSpace: "pre-wrap",
            }}
          >
            {displayName}
          </div>

          {/* MBTI letter */}
          {mbti && (
            <div
              style={{
                fontSize: "36px",
                color: "#d4a5b8",
                letterSpacing: "0.3em",
                marginBottom: "30px",
                display: "flex",
              }}
            >
              {mbti}
            </div>
          )}

          {/* Rarity */}
          {rarity && (
            <div
              style={{
                fontSize: "24px",
                color: "rgba(245, 237, 229, 0.6)",
                letterSpacing: "0.2em",
                display: "flex",
                gap: "12px",
              }}
            >
              <span>希少度</span>
              <span style={{ color: "#d4a5b8" }}>{rarity}%</span>
            </div>
          )}

          {/* Bottom divider + tagline */}
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "1px",
                background: "rgba(212, 165, 184, 0.6)",
                marginBottom: "20px",
              }}
            />
            <div
              style={{
                fontSize: "18px",
                color: "rgba(245, 237, 229, 0.5)",
                letterSpacing: "0.2em",
                display: "flex",
              }}
            >
              あなたが惹かれる16タイプ
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error("OG image generation failed:", e)
    return new Response("Failed to generate image", { status: 500 })
  }
}
