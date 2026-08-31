create or replace function public.cinetracker_profile_quick_stats_v1()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with st as (
  select * from public.cinetracker_profile_stats() limit 1
), ss as (
  select * from public.cinetracker_series_state_stats() limit 1
), watchlist_ids as (
  select distinct mo.media_id
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
    and mo.state in ('AddedToWatchlist','WatchLater')
), watched_keys as (
  select wh.media_id,wh.season_number,wh.episode_number
  from public.watch_history wh
  where wh.profile_id=auth.uid()
    and wh.item_type='episode'
    and coalesce(wh.season_number,0)>0
    and coalesce(wh.episode_number,0)>0
  union
  select ep.media_id,ep.season_number,ep.episode_number
  from public.episode_progress ep
  where ep.profile_id=auth.uid()
    and ep.watched=true
    and coalesce(ep.season_number,0)>0
    and coalesce(ep.episode_number,0)>0
), watched as (
  select media_id,count(*)::bigint as watched_episodes
  from watched_keys
  group by media_id
), wl as (
  select m.id,m.media_type,coalesce(m.runtime_minutes,0)::int runtime_minutes,
         coalesce(m.total_episodes,0)::int total_episodes,
         coalesce(m.raw_tmdb,'{}'::jsonb) raw_tmdb,
         coalesce(w.watched_episodes,0)::bigint watched_episodes
  from watchlist_ids i
  join public.media m on m.id=i.media_id
  left join watched w on w.media_id=m.id
), series_calc as (
  select wl.*,
    case
      when media_type<>'tv' then 0
      when coalesce(nullif(raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)>0 then
        coalesce((select sum(case
          when coalesce(nullif(se->>'season_number','')::int,0) < coalesce(nullif(raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)
            then greatest(coalesce(nullif(se->>'episode_count','')::int,0),0)
          when coalesce(nullif(se->>'season_number','')::int,0) = coalesce(nullif(raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)
            then greatest(coalesce(nullif(raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0),0)
          else 0 end)
        from jsonb_array_elements(case when jsonb_typeof(raw_tmdb->'seasons')='array' then raw_tmdb->'seasons' else '[]'::jsonb end) se
        where coalesce(nullif(se->>'season_number','')::int,0)>0),0)::int
      else greatest(total_episodes,watched_episodes::int)
    end released_episodes
  from wl
), rem as (
  select
    count(*) filter(where media_type='tv')::bigint watchlist_series,
    count(*) filter(where media_type='movie')::bigint watchlist_movies,
    coalesce(sum(greatest(released_episodes-watched_episodes::int,0)*greatest(runtime_minutes,0)) filter(where media_type='tv'),0)::bigint watchlist_series_remaining_minutes,
    coalesce(sum(greatest(runtime_minutes,0)) filter(where media_type='movie'),0)::bigint watchlist_movie_minutes
  from series_calc
)
select jsonb_build_object(
  'stats',coalesce((select to_jsonb(x) from st x),'{}'::jsonb),
  'series_stats',coalesce((select to_jsonb(x) from ss x),'{}'::jsonb),
  'remaining',jsonb_build_object(
    'watchlist_series',coalesce(rem.watchlist_series,0),
    'watchlist_movies',coalesce(rem.watchlist_movies,0),
    'watchlist_series_remaining_minutes',coalesce(rem.watchlist_series_remaining_minutes,0),
    'series_remaining_minutes',coalesce(rem.watchlist_series_remaining_minutes,0),
    'watchlist_movie_minutes',coalesce(rem.watchlist_movie_minutes,0)
  ),
  'sports_stats',public.cinetracker_sport_stats_v1(),
  'dashboard','[]'::jsonb,
  'favorite_actors','[]'::jsonb,
  'activity','[]'::jsonb,
  'quick',true,
  'generated_at',now()
)
from rem;
$function$;
