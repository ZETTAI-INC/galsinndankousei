# Supabase セットアップ手順

匿名診断ログを集めるための Supabase 設定。**初回1回だけ**やればOK。

## 1. Supabase プロジェクト作成

1. https://supabase.com/dashboard にアクセス（要 GitHub アカウント等）
2. **New Project** → 名前（例: `gyaru-shindan`）、リージョン（**Tokyo (Northeast Asia)** 推奨）、DBパスワード設定
3. プロジェクト作成完了まで2〜3分待つ

## 2. テーブル作成（SQL 実行）

1. 左メニュー → **SQL Editor**
2. **+ New query**
3. このリポジトリの `supabase/migrations/0001_init.sql` の中身を全部貼り付け
4. **RUN** ボタン
5. `Success. No rows returned` が出ればOK
6. 左メニュー → **Table Editor** で `diag_events` テーブルが出来てるか確認

## 3. API Key を取得

1. 左メニュー → **Project Settings** → **API**
2. 以下2つをコピー:
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **Project API keys → anon public**: `eyJhbGc...`（長い文字列）

## 4. 環境変数を設定

### ローカル開発

リポジトリ直下に `.env.local` を作成:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

`pnpm dev` を再起動して反映。

### Netlify 本番

1. Netlify Dashboard → 該当サイト → **Site settings** → **Environment variables**
2. **Add a variable** で上記2つを追加
3. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

## 5. 動作確認

1. 本番 or ローカルで診断を1回通す
2. Supabase Dashboard → **Table Editor** → `diag_events`
3. 4〜26行くらい増えてるはず:
   - `diagnosis_start` × 1
   - `answer` × 24
   - `phase_complete` × 3
   - `result` × 1

## 集計クエリ例

`supabase/migrations/0001_init.sql` の末尾のコメント参照。SQL Editor で叩ける。

## トラブルシューティング

- **何も入らない**: Service Worker のキャッシュ疑い → ハードリロード or シークレットウィンドウで試す
- **`anon insert` で permission denied**: RLS ポリシー未適用 → SQL を再実行
- **CORS エラー**: Supabase の Project Settings → API で Site URL を Netlify ドメインに登録

## プライバシー

- 個人情報（メアド・名前・端末ID等）は一切送らない
- `sid` は端末ローカルで生成した UUID。サーバー側からは個人特定不可
- localStorage クリアで紐付け切断
