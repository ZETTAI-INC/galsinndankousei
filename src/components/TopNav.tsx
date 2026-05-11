"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function TopNav() {
  const pathname = usePathname()

  // 診断中・トップページは非表示
  if (
    pathname === "/" ||
    pathname === "/diagnosis" ||
    pathname === "/diagnosis-self" ||
    pathname === "/diagnosis-other"
  ) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <Link
        href="/mypage"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0a0810]/70 px-4 py-2 text-[11px] tracking-[0.15em] text-white/70 backdrop-blur-xl transition-all hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        <span>📋</span>
        <span>マイページ</span>
      </Link>
    </div>
  )
}
