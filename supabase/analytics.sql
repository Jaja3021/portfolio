-- Site-visit tracking for the admin Overview dashboard.
-- Run once in the SQL Editor (safe to re-run — idempotent, same pattern as schema.sql).

create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null default '/',
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on page_views(created_at);

alter table page_views enable row level security;

drop policy if exists "page_views_public_insert" on page_views;
drop policy if exists "page_views_admin_select" on page_views;

create policy "page_views_public_insert"
  on page_views for insert
  to anon, authenticated
  with check (true);

create policy "page_views_admin_select"
  on page_views for select
  to authenticated
  using (true);
