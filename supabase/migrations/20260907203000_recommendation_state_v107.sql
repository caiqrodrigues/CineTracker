create or replace function public.cinetracker_recommendation_state_v107()
returns jsonb
language sql
stable
set search_path=public
as $$
with me as (select auth.uid() as profile_id),
fresh_excluded as (
  select distinct m.tmdb_id, m.media_type
  from public.media m
  join public.media_overrides mo on mo.media_id=m.id
  join me on me.profile_id=mo.profile_id
  where mo.state in ('AlreadySeen','Completed','InProgress','UpToDate','NotInterested','AddedToWatchlist','WatchLater')
  union
  select distinct m.tmdb_id, m.media_type
  from public.media m
  join public.watch_history wh on wh.media_id=m.id
  join me on me.profile_id=wh.profile_id
  union
  select distinct m.tmdb_id, m.media_type
  from public.media m
  join public.episode_progress ep on ep.media_id=m.id and ep.watched=true
  join me on me.profile_id=ep.profile_id
),
watchlist as (
  select distinct m.tmdb_id, m.media_type
  from public.media m
  join public.media_overrides mo on mo.media_id=m.id
  join me on me.profile_id=mo.profile_id
  where mo.state in ('AddedToWatchlist','WatchLater')
)
select jsonb_build_object(
  'fresh_excluded', coalesce((select jsonb_agg(jsonb_build_object('tmdb_id',tmdb_id,'media_type',media_type)) from fresh_excluded),'[]'::jsonb),
  'watchlist', coalesce((select jsonb_agg(jsonb_build_object('tmdb_id',tmdb_id,'media_type',media_type)) from watchlist),'[]'::jsonb)
);
$$;
grant execute on function public.cinetracker_recommendation_state_v107() to authenticated;
