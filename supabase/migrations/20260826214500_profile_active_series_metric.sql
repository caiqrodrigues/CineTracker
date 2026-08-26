-- Keep the existing RPC contract, but for verified Bingers imports interpret
-- series_watched as the active/accompanied-series metric shown by the client.
-- Profiles without this authoritative metric continue to fall back to series
-- that have episode history.

create or replace function public.cinetracker_profile_stats()
returns table(
  episodes_watched bigint,
  movies_watched bigint,
  series_watched bigint,
  series_minutes bigint,
  movie_minutes bigint,
  total_minutes bigint
)
language sql
set search_path to 'public'
as $function$
with profile_import as (
  select
    case
      when settings->'bingers_import'->>'phase' = 'completed'
       and coalesce(settings->'bingers_import'->>'series_minutes','') ~ '^[0-9]+$'
      then (settings->'bingers_import'->>'series_minutes')::bigint
    end as series_minutes,
    case
      when settings->'bingers_import'->>'phase' = 'completed'
       and coalesce(settings->'bingers_import'->>'movie_minutes','') ~ '^[0-9]+$'
      then (settings->'bingers_import'->>'movie_minutes')::bigint
    end as movie_minutes,
    case
      when settings->'bingers_import'->>'phase' = 'completed'
       and coalesce(settings->'bingers_import'->>'total_minutes','') ~ '^[0-9]+$'
      then (settings->'bingers_import'->>'total_minutes')::bigint
    end as total_minutes,
    case
      when settings->'bingers_import'->>'phase' = 'completed'
       and coalesce(settings->'bingers_import'->>'in_progress_series','') ~ '^[0-9]+$'
      then (settings->'bingers_import'->>'in_progress_series')::bigint
    end as in_progress_series
  from public.profiles
  where id = auth.uid()
),
wh_ep as (
  select
    wh.media_id,
    wh.season_number,
    wh.episode_number,
    case
      when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$'
        then greatest(1,(wh.external_ids->>'plays')::int)
      else 1
    end::bigint as plays,
    coalesce(
      m.runtime_minutes,
      nullif(m.raw_tmdb->>'runtime','')::int,
      nullif(m.raw_tmdb->'episode_run_time'->>0,'')::int,
      45
    )::bigint as runtime_minutes
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid()
    and wh.item_type='episode'
),
ep_extra as (
  select
    e.media_id,
    coalesce(
      m.runtime_minutes,
      nullif(m.raw_tmdb->>'runtime','')::int,
      nullif(m.raw_tmdb->'episode_run_time'->>0,'')::int,
      45
    )::bigint as runtime_minutes
  from public.episode_progress e
  join public.media m on m.id=e.media_id
  where e.profile_id=auth.uid()
    and e.watched=true
    and not exists (
      select 1
      from public.watch_history wh
      where wh.profile_id=e.profile_id
        and wh.media_id=e.media_id
        and wh.item_type='episode'
        and wh.season_number=e.season_number
        and wh.episode_number=e.episode_number
    )
),
ep_series as (
  select media_id from wh_ep
  union
  select media_id from ep_extra
),
ep as (
  select
    (coalesce((select sum(plays) from wh_ep),0)+coalesce((select count(*) from ep_extra),0))::bigint as episodes_watched,
    (coalesce((select sum(plays*runtime_minutes) from wh_ep),0)+coalesce((select sum(runtime_minutes) from ep_extra),0))::bigint as series_minutes,
    (select count(*) from ep_series)::bigint as history_series
),
wh_mv as (
  select
    wh.media_id,
    case
      when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$'
        then greatest(1,(wh.external_ids->>'plays')::int)
      else 1
    end::bigint as plays,
    coalesce(m.runtime_minutes,nullif(m.raw_tmdb->>'runtime','')::int,0)::bigint as runtime_minutes
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid()
    and wh.item_type='movie'
    and m.media_type='movie'
),
mv_extra as (
  select distinct mo.media_id,
    coalesce(m.runtime_minutes,nullif(m.raw_tmdb->>'runtime','')::int,0)::bigint as runtime_minutes
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where mo.profile_id=auth.uid()
    and m.media_type='movie'
    and mo.state in ('AlreadySeen','Completed')
    and not exists (
      select 1 from public.watch_history wh
      where wh.profile_id=mo.profile_id
        and wh.media_id=mo.media_id
        and wh.item_type='movie'
    )
),
mv as (
  select
    (coalesce((select sum(plays) from wh_mv),0)+coalesce((select count(*) from mv_extra),0))::bigint as movies_watched,
    (coalesce((select sum(plays*runtime_minutes) from wh_mv),0)+coalesce((select sum(runtime_minutes) from mv_extra),0))::bigint as movie_minutes
),
base as (
  select ep.episodes_watched, mv.movies_watched, ep.history_series,
         ep.series_minutes as calculated_series_minutes,
         mv.movie_minutes as calculated_movie_minutes
  from ep cross join mv
)
select
  base.episodes_watched,
  base.movies_watched,
  coalesce(pi.in_progress_series, base.history_series)::bigint as series_watched,
  coalesce(pi.series_minutes, base.calculated_series_minutes)::bigint as series_minutes,
  coalesce(pi.movie_minutes, base.calculated_movie_minutes)::bigint as movie_minutes,
  coalesce(
    pi.total_minutes,
    coalesce(pi.series_minutes, base.calculated_series_minutes)
      + coalesce(pi.movie_minutes, base.calculated_movie_minutes)
  )::bigint as total_minutes
from base
left join profile_import pi on true;
$function$;
