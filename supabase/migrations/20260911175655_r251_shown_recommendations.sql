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

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='shown_recommendations' and policyname='shown_recommendations_select_own') then
    create policy shown_recommendations_select_own on public.shown_recommendations for select using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='shown_recommendations' and policyname='shown_recommendations_insert_own') then
    create policy shown_recommendations_insert_own on public.shown_recommendations for insert with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='shown_recommendations' and policyname='shown_recommendations_update_own') then
    create policy shown_recommendations_update_own on public.shown_recommendations for update using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end $$;

grant select, insert, update on public.shown_recommendations to authenticated;