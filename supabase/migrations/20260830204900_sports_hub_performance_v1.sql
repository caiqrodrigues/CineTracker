-- Sports Hub v1 performance hardening after database advisor review.
create index if not exists idx_sport_events_competition_entity on public.sport_events(competition_entity_id);
create index if not exists idx_sport_events_home_entity on public.sport_events(home_entity_id);
create index if not exists idx_sport_events_away_entity on public.sport_events(away_entity_id);
create index if not exists idx_sport_sync_state_sport on public.sport_sync_state(sport_slug);
create index if not exists idx_user_sport_favorites_entity on public.user_sport_favorites(entity_id);

drop policy if exists user_sport_favorites_select on public.user_sport_favorites;
create policy user_sport_favorites_select on public.user_sport_favorites for select to authenticated using (profile_id=(select auth.uid()));
drop policy if exists user_sport_favorites_insert on public.user_sport_favorites;
create policy user_sport_favorites_insert on public.user_sport_favorites for insert to authenticated with check (profile_id=(select auth.uid()));
drop policy if exists user_sport_favorites_update on public.user_sport_favorites;
create policy user_sport_favorites_update on public.user_sport_favorites for update to authenticated using (profile_id=(select auth.uid())) with check (profile_id=(select auth.uid()));
drop policy if exists user_sport_favorites_delete on public.user_sport_favorites;
create policy user_sport_favorites_delete on public.user_sport_favorites for delete to authenticated using (profile_id=(select auth.uid()));

drop policy if exists user_sport_preferences_select on public.user_sport_preferences;
create policy user_sport_preferences_select on public.user_sport_preferences for select to authenticated using (profile_id=(select auth.uid()));
drop policy if exists user_sport_preferences_insert on public.user_sport_preferences;
create policy user_sport_preferences_insert on public.user_sport_preferences for insert to authenticated with check (profile_id=(select auth.uid()));
drop policy if exists user_sport_preferences_update on public.user_sport_preferences;
create policy user_sport_preferences_update on public.user_sport_preferences for update to authenticated using (profile_id=(select auth.uid())) with check (profile_id=(select auth.uid()));

create or replace function public.cinetracker_sport_preferences_v1(
  p_favorite_sports text[] default null,
  p_timezone text default null,
  p_live_notifications boolean default null,
  p_pre_event_minutes integer default null
) returns public.user_sport_preferences
language plpgsql security invoker set search_path=public
as $$
declare v_row public.user_sport_preferences;
begin
  insert into public.user_sport_preferences(profile_id) values(auth.uid()) on conflict(profile_id) do nothing;
  update public.user_sport_preferences
  set favorite_sports=coalesce(p_favorite_sports,favorite_sports),
      timezone=coalesce(nullif(p_timezone,''),timezone),
      live_notifications=coalesce(p_live_notifications,live_notifications),
      pre_event_minutes=coalesce(p_pre_event_minutes,pre_event_minutes),
      updated_at=now()
  where profile_id=auth.uid()
  returning * into v_row;
  update public.profiles set updated_at=now() where id=auth.uid();
  return v_row;
end;
$$;
grant execute on function public.cinetracker_sport_preferences_v1(text[],text,boolean,integer) to authenticated;
