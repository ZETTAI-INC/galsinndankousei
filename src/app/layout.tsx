import type { Metadata, Viewport } from "next"
import { Noto_Sans_JP, Noto_Serif_JP, Yusei_Magic, RocknRoll_One } from "next/font/google"
import "./globals.css"

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

export const metadata: Metadata = {
  title: "沼り診断",
  description:
    "好きになる人、毎回似てない？それ、偶然じゃないから。あなたが沼る16タイプを見せてあげる。",
  openGraph: {
    title: "沼り診断",
    description: "好きになる人、毎回似てない？それ、偶然じゃないから。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "沼り診断",
    description: "好きになる人、毎回似てない？それ、偶然じゃないから。",
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
        <main className="relative z-10 flex-1">{children}</main>
      </body>
    </html>
  )
}
