-- CineTracker r251: harden and optimize shown_recommendations access.
alter table public.shown_recommendations enable row level security;

revoke all privileges on table public.shown_recommendations from anon;
revoke all privileges on table public.shown_recommendations from authenticated;
grant select, insert, update on table public.shown_recommendations to authenticated;

drop policy if exists shown_recommendations_select_own on public.shown_recommendations;
drop policy if exists shown_recommendations_insert_own on public.shown_recommendations;
drop policy if exists shown_recommendations_update_own on public.shown_recommendations;

create policy shown_recommendations_select_own
  on public.shown_recommendations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy shown_recommendations_insert_own
  on public.shown_recommendations
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy shown_recommendations_update_own
  on public.shown_recommendations
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
