create or replace function public.cinetracker_profile_fast_v379(p_tz text default 'America/Sao_Paulo')
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with d as materialized (
  select * from public.cinetracker_profile_media_dashboard_v0991()
),
dash as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc),'[]'::jsonb) value
  from (select * from d order by last_watched_at desc nulls last,media_id desc limit 500) x
),
agg as (
  select
    count(*) filter(where media_type='movie' and is_seen)::bigint movies_watched,
    coalesce(sum(watched_episodes) filter(where media_type='tv'),0)::bigint episodes_watched,
    count(*) filter(where media_type='tv' and is_seen)::bigint series_watched,
    count(*) filter(where media_type='tv' and is_completed)::bigint completed_series,
    count(*) filter(where media_type='tv' and is_up_to_date)::bigint up_to_date_series,
    count(*) filter(where media_type='tv' and is_in_progress)::bigint in_progress_series,
    count(*) filter(where media_type='tv' and is_not_started)::bigint not_started_series,
    count(*) filter(where media_type='movie' and is_watchlist)::bigint watchlist_movies,
    count(*) filter(where media_type='tv' and is_watchlist)::bigint watchlist_series,
    coalesce(sum(greatest(runtime_minutes,0)) filter(where media_type='movie' and is_seen),0)::bigint movie_minutes,
    coalesce(sum(greatest(runtime_minutes,0)*greatest(watched_episodes,0)) filter(where media_type='tv'),0)::bigint series_minutes
  from d
),
actors as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',fa.id,'tmdb_person_id',fa.tmdb_person_id,'actor_name',fa.actor_name,
    'profile_path',fa.profile_path,'created_at',fa.created_at
  ) order by fa.created_at desc),'[]'::jsonb) value
  from public.favorite_actors fa
  where fa.user_id=auth.uid()
),
activity as (
  select public.cinetracker_activity_by_day_v320(15,coalesce(nullif(p_tz,''),'America/Sao_Paulo')) value
)
select jsonb_build_object(
  'dashboard',(select value from dash),
  'stats',jsonb_build_object(
    'episodes_watched',a.episodes_watched,
    'movies_watched',a.movies_watched,
    'series_watched',a.series_watched,
    'series_minutes',a.series_minutes,
    'movie_minutes',a.movie_minutes,
    'total_minutes',a.series_minutes+a.movie_minutes
  ),
  'series_stats',jsonb_build_object(
    'completed_series',a.completed_series,
    'up_to_date_series',a.up_to_date_series,
    'in_progress_series',a.in_progress_series,
    'not_started_series',a.not_started_series,
    'watchlist_movies',a.watchlist_movies,
    'history_series',a.series_watched
  ),
  'remaining',jsonb_build_object(
    'watchlist_movies',a.watchlist_movies,
    'watchlist_series',a.watchlist_series
  ),
  'favorite_actors',(select value from actors),
  'activity',(select value from activity),
  'timezone',coalesce(nullif(p_tz,''),'America/Sao_Paulo'),
  'generated_at',now()
)
from agg a;
$$;
revoke all on function public.cinetracker_profile_fast_v379(text) from public,anon;
grant execute on function public.cinetracker_profile_fast_v379(text) to authenticated;
