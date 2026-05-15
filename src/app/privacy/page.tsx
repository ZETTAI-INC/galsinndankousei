import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "プライバシーポリシー｜あなたが惹かれる16タイプ",
  description: "本サイトの匿名利用ログとデータ取り扱いについて。",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <p className="mb-4">
          <span className="heading-eyebrow">プライバシーポリシー</span>
        </p>
        <h1 className="serif mb-12 text-[28px] font-light tracking-wide text-white/95">
          データの取り扱いについて
        </h1>

        <section className="mb-12 space-y-6 text-[14px] font-light leading-[2.0] tracking-[0.03em] text-white/75">
          <div>
            <h2 className="serif mb-3 text-[16px] text-[var(--accent)]">
              個人情報は集めません
            </h2>
            <p>
              本サイトは氏名・メールアドレス・電話番号などの個人情報を一切収集しません。アカウント登録も不要です。
            </p>
          </div>

          <div>
            <h2 className="serif mb-3 text-[16px] text-[var(--accent)]">
              匿名の診断ログを記録します
            </h2>
            <p>
              診断品質の改善のため、以下を匿名で記録します:
            </p>
            <ul className="ml-4 mt-3 list-disc space-y-1 marker:text-white/30">
              <li>各質問でどの選択肢を選んだか</li>
              <li>診断にかかった時間・離脱したフェーズ</li>
              <li>最終的に判定された MBTI タイプ・全軸スコア</li>
              <li>端末ローカルで自動生成された匿名ID（UUID）</li>
            </ul>
            <p className="mt-3 text-white/55">
              この匿名IDから個人を特定することはできません。ブラウザのデータをクリアするとIDも切断されます。
            </p>
          </div>

          <div>
            <h2 className="serif mb-3 text-[16px] text-[var(--accent)]">
              データの保存先
            </h2>
            <p>
              診断結果は、お使いの端末の localStorage に保存されます。マイコード・マイページ・相性診断機能のために使われ、外部サーバーには送信されません。
            </p>
            <p className="mt-3">
              匿名ログは Supabase（米国/シンガポール/東京リージョン）にて、上記の匿名情報のみが集計目的で記録されます。
            </p>
          </div>

          <div>
            <h2 className="serif mb-3 text-[16px] text-[var(--accent)]">
              第三者提供・広告
            </h2>
            <p>
              第三者への個人情報提供は行いません。広告ネットワークも導入していません。
            </p>
          </div>

          <div>
            <h2 className="serif mb-3 text-[16px] text-[var(--accent)]">
              データの削除
            </h2>
            <p>
              ブラウザの設定から本サイトのデータを削除すれば、端末上の診断結果と匿名IDは消去されます。すでにサーバーへ送信済みの匿名ログを個別削除する手段は提供していません（匿名のため特定できないため）。
            </p>
          </div>

          <div>
            <h2 className="serif mb-3 text-[16px] text-[var(--accent)]">
              本ポリシーの変更
            </h2>
            <p>
              ポリシーを更新する場合は、本ページに反映します。
            </p>
          </div>

          <p className="mt-12 text-[11px] text-white/35">
            最終更新: 2026年5月
          </p>
        </section>

        <Link
          href="/"
          className="inline-block border border-white/15 px-8 py-3 text-[12px] tracking-wide text-white/55 transition-all hover:border-white/30 hover:text-white/85"
        >
          トップに戻る
        </Link>
      </div>
    </div>
  )
}
