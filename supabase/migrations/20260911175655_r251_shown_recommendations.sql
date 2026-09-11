-- CineTracker r251: persist recommendation exposure for the 7-day no-repeat rule.
create table if not exists public.shown_recommendations (
  user_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null check (media_type in ('movie','tv')),
  tmdb_id bigint not null check (tmdb_id > 0),
  title text,
  shown_at timestamptz not null default now(),
  primary key (user_id, media_type, tmdb_id)
);

create index if not exists shown_recommendations_recent_idx
  on public.shown_recommendations (user_id, shown_at desc);

alter table public.shown_recommendations enable row level security;

revoke all privileges on table public.shown_recommendations from anon;
revoke all privileges on table public.shown_recommendations from authenticated;
grant select, insert, update on table public.shown_recommendations to authenticated;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='shown_recommendations' and policyname='shown_recommendations_select_own') then
    create policy shown_recommendations_select_own on public.shown_recommendations for select to authenticated using ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='shown_recommendations' and policyname='shown_recommendations_insert_own') then
    create policy shown_recommendations_insert_own on public.shown_recommendations for insert to authenticated with check ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='shown_recommendations' and policyname='shown_recommendations_update_own') then
    create policy shown_recommendations_update_own on public.shown_recommendations for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
  end if;
end $$;
