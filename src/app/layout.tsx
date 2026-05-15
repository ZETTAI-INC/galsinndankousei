import type { Metadata, Viewport } from "next"
import { Noto_Sans_JP, Noto_Serif_JP, Yusei_Magic, RocknRoll_One } from "next/font/google"
import "./globals.css"
import { TopNav } from "@/components/TopNav"

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

const yuseiMagic = Yusei_Magic({
  variable: "--font-yusei-magic",
  subsets: ["latin"],
  weight: ["400"],
})

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["300", "500", "700", "900"],
})

const rockRoll = RocknRoll_One({
  variable: "--font-rocknroll",
  subsets: ["latin"],
  weight: ["400"],
})

// 本番URLが決まったら NEXT_PUBLIC_SITE_URL で上書き可能
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://admirable-churros-c3294a.netlify.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "あなたが惹かれる16タイプ｜恋愛MBTI診断",
  description:
    "24の質問で、あなたが無意識に選んでしまう人を紐解く。恋愛MBTI診断。",
  openGraph: {
    title: "あなたが惹かれる16タイプ｜恋愛MBTI診断",
    description: "24の質問で、あなたが無意識に選んでしまう人を紐解く。",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "あなたが惹かれる16タイプ｜恋愛MBTI診断",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "あなたが惹かれる16タイプ｜恋愛MBTI診断",
    description: "24の質問で、あなたが無意識に選んでしまう人を紐解く。",
    images: ["/api/og"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${notoSerifJP.variable} ${yuseiMagic.variable} ${rockRoll.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-noto-sans-jp), sans-serif" }}
      >
        <div className="noise-overlay" />
        <div className="gradient-orb-1" />
        <div className="gradient-orb-2" />
        <div className="gradient-orb-3" />
        <TopNav />
        <main className="relative z-10 flex-1">{children}</main>
      </body>
    </html>
  )
}
