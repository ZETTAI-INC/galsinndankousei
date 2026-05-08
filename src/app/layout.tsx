import type { Metadata, Viewport } from "next"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
  title: "ギャル神の沼り診断",
  description:
    "好きになる人、毎回似てない？ギャル神があなたが沼る16タイプを見抜きます。",
  openGraph: {
    title: "ギャル神の沼り診断",
    description: "てかさ、それ偶然じゃないから。あなたが沼る人格、全部見えてる。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ギャル神の沼り診断",
    description: "てかさ、それ偶然じゃないから。あなたが沼る人格、全部見えてる。",
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
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
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
