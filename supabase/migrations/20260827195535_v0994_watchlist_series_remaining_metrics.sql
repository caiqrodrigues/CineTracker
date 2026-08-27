create or replace function public.cinetracker_profile_remaining_v0994()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with d as (
  select * from public.cinetracker_profile_media_dashboard_v0991()
), series_calc as (
  select d.*,
    case
      when d.media_type <> 'tv' then 0
      when coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)>0 then
        coalesce((select sum(case
          when coalesce(nullif(s->>'season_number','')::int,0) < coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)
            then greatest(coalesce(nullif(s->>'episode_count','')::int,0),0)
          when coalesce(nullif(s->>'season_number','')::int,0) = coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)
            then greatest(coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0),0)
          else 0 end)
        from jsonb_array_elements(case when jsonb_typeof(d.raw_tmdb->'seasons')='array' then d.raw_tmdb->'seasons' else '[]'::jsonb end) s
        where coalesce(nullif(s->>'season_number','')::int,0)>0),0)::int
      else greatest(coalesce(d.total_episodes,0),d.watched_episodes::int)
    end as released_episodes
  from d
), series_remaining as (
  select
    count(*) filter(where media_type='tv' and is_watchlist)::bigint as watchlist_count,
    coalesce(sum(greatest(released_episodes-watched_episodes::int,0)) filter(where media_type='tv' and is_watchlist),0)::bigint as remaining_episodes,
    coalesce(sum(greatest(released_episodes-watched_episodes::int,0) * greatest(coalesce(runtime_minutes,0),0)) filter(where media_type='tv' and is_watchlist),0)::bigint as minutes,
    count(*) filter(where media_type='tv' and is_watchlist and (coalesce(runtime_minutes,0)=0 or coalesce(released_episodes,0)=0))::bigint as metadata_pending
  from series_calc
), movies as (
  select
    count(*) filter(where media_type='movie' and is_watchlist)::bigint as watchlist_count,
    count(*) filter(where media_type='movie' and is_watchlist and not is_seen)::bigint as watchlist_unseen_count,
    coalesce(sum(greatest(coalesce(runtime_minutes,0),0)) filter(where media_type='movie' and is_watchlist),0)::bigint as watchlist_minutes,
    coalesce(sum(greatest(coalesce(runtime_minutes,0),0)) filter(where media_type='movie' and is_watchlist and not is_seen),0)::bigint as unseen_minutes,
    count(*) filter(where media_type='movie' and is_watchlist and coalesce(runtime_minutes,0)=0)::bigint as runtime_pending
  from d
)
select jsonb_build_object(
  'watchlist_movies',m.watchlist_count,
  'watchlist_movies_unseen',m.watchlist_unseen_count,
  'watchlist_movie_minutes',m.watchlist_minutes,
  'watchlist_unseen_movie_minutes',m.unseen_minutes,
  'watchlist_movie_runtime_pending',m.runtime_pending,
  'watchlist_series',s.watchlist_count,
  'watchlist_series_remaining_episodes',s.remaining_episodes,
  'watchlist_series_remaining_minutes',s.minutes,
  'series_remaining_minutes',s.minutes,
  'series_metadata_pending',s.metadata_pending
)
from movies m cross join series_remaining s;
$function$;
