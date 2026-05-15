-- 診断匿名ログテーブル。
-- Supabase Dashboard の SQL Editor にペーストして1回実行する。
--
-- 設計:
--   - id: bigserial（時系列で自然に並ぶ）
--   - ts: イベント発生時刻（サーバー側 default）
--   - sid: 端末ローカルで生成した匿名 sessionId（UUID）
--   - type: 'diagnosis_start' | 'answer' | 'phase_complete' | 'result'
--   - payload: 残りのフィールドを丸ごと jsonb
--
-- RLS:
--   - anon は INSERT のみ可（読み取り禁止 = ダッシュボード経由でしか集計できない）
--   - service_role は何でも可（管理用）

create table if not exists public.diag_events (
  id          bigserial primary key,
  ts          timestamptz not null default now(),
  sid         text not null,
  type        text not null,
  payload     jsonb not null default '{}'::jsonb,
  user_agent  text
);

create index if not exists diag_events_ts_idx   on public.diag_events (ts);
create index if not exists diag_events_type_idx on public.diag_events (type);
create index if not exists diag_events_sid_idx  on public.diag_events (sid);

-- type 別 GIN index（payload の中の特定キーで集計したい場合に効く）
create index if not exists diag_events_payload_gin on public.diag_events using gin (payload);

-- Row Level Security
alter table public.diag_events enable row level security;

-- 匿名 INSERT は許可。読み取りはダッシュボード（service_role）のみ。
drop policy if exists "anon insert diag_events" on public.diag_events;
create policy "anon insert diag_events"
  on public.diag_events
  for insert
  to anon
  with check (true);

-- 匿名読み取りは禁止（明示的にポリシー作らない）。

-- ━━━ よく使う集計クエリの例（コメントアウト） ━━━

-- MBTI 分布（直近1000人）
-- select payload->>'mbti' as mbti, count(*)
-- from diag_events
-- where type = 'result'
-- order by id desc limit 1000;
-- group by mbti order by count(*) desc;

-- 完走率（diagnosis_start 数 ÷ result 数）
-- select
--   (select count(*) from diag_events where type = 'diagnosis_start') as starts,
--   (select count(*) from diag_events where type = 'result') as completes;

-- 各質問の選択肢別人気（answer ログから）
-- select payload->>'questionId' as q, payload->>'choiceId' as c, count(*)
-- from diag_events
-- where type = 'answer'
-- group by q, c order by q, count(*) desc;
