-- CineTracker Web r420 — stand-up exclusion, F1 pure-series semantics and truthful Profile times.

create or replace function public.cinetracker_recommendation_eligible_v420(
  p_media_type text,
  p_media_kind text,
  p_title text,
  p_runtime_minutes integer,
  p_genres jsonb,
  p_raw_tmdb jsonb,
  p_exclude_wwe boolean default true,
  p_require_movie_runtime boolean default false
) returns boolean
language sql immutable security invoker set search_path=public
as $$
with v as (
  select
    lower(coalesce(p_media_type,'')) media_type,
    lower(coalesce(p_media_kind,'')) media_kind,
    lower(coalesce(p_genres,'[]'::jsonb)::text) genres_text,
    lower(coalesce(p_raw_tmdb->'genre_ids','[]'::jsonb)::text) genre_ids_text,
    lower(coalesce(p_raw_tmdb->'genres','[]'::jsonb)::text) raw_genres_text,
    lower(concat_ws(' ',
      coalesce(p_title,''),coalesce(p_media_kind,''),
      coalesce(p_raw_tmdb->>'title',''),coalesce(p_raw_tmdb->>'name',''),
      coalesce(p_raw_tmdb->>'original_title',''),coalesce(p_raw_tmdb->>'original_name',''),
      coalesce(p_raw_tmdb->>'overview',''),coalesce(p_raw_tmdb->>'tagline',''),
      coalesce(p_raw_tmdb->>'type',''),coalesce(p_raw_tmdb->>'media_kind',''),
      coalesce(p_raw_tmdb->'keywords','[]'::jsonb)::text
    )) standup_text
)
select
  public.cinetracker_recommendation_eligible_v412(
    p_media_type,p_media_kind,p_title,p_runtime_minutes,p_genres,p_raw_tmdb,p_exclude_wwe,p_require_movie_runtime
  )
  and not (
    genre_ids_text ~ '(^|[^0-9])10764([^0-9]|$)'
    or genres_text ~ '(^|[^[:alnum:]])reality([^[:alnum:]]|$)'
    or raw_genres_text ~ '(^|[^[:alnum:]])reality([^[:alnum:]]|$)'
    or media_kind ~ '(^|[^[:alnum:]])reality([^[:alnum:]]|$)'
  )
  and not (
    standup_text ~ '(^|[^[:alnum:]])stand[ -]?up([^[:alnum:]]|$)'
    or standup_text ~ '(^|[^[:alnum:]])standup([^[:alnum:]]|$)'
    or standup_text like '%comedy special%'
    or standup_text like '%especial de comedia%'
    or standup_text like '%especial de comédia%'
    or standup_text like '%show de comedia%'
    or standup_text like '%show de comédia%'
    or (
      media_type='movie'
      and standup_text ~ '(^|[^[:alnum:]])(comedian|comediante)([^[:alnum:]]|$)'
      and standup_text ~ '(^|[^[:alnum:]])(special|especial)([^[:alnum:]]|$)'
    )
  )
from v;
$$;

create or replace function public.cinetracker_recommendation_eligible_v413(
  p_media_type text,
  p_media_kind text,
  p_title text,
  p_runtime_minutes integer,
  p_genres jsonb,
  p_raw_tmdb jsonb,
  p_exclude_wwe boolean default true,
  p_require_movie_runtime boolean default false
) returns boolean
language sql immutable security invoker set search_path=public
as $$
  select public.cinetracker_recommendation_eligible_v420(
    p_media_type,p_media_kind,p_title,p_runtime_minutes,p_genres,p_raw_tmdb,p_exclude_wwe,p_require_movie_runtime
  );
$$;

create or replace function public.cinetracker_discover_fresh_v420(p_kind text,p_limit integer default 48)
returns jsonb
language sql stable security invoker set search_path=public
as $$
with cfg as (
 select lower(coalesce(p_kind,'movie')) kind,
        least(greatest(coalesce(p_limit,48),1),48)::int lim,
        least(96,greatest(coalesce(p_limit,48),1)*3)::int scan_lim
), src as materialized (
 select x.item,x.ord,m.*
 from cfg
 cross join lateral jsonb_array_elements(public.cinetracker_discover_fresh_v387(cfg.kind,cfg.scan_lim)) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v420(
   m.media_type,m.media_kind,m.title,
   greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
   coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,true,(cfg.kind='movie')
 )
), picked as (
 select * from src order by ord limit (select lim from cfg)
)
select coalesce(jsonb_agg(item || jsonb_strip_nulls(jsonb_build_object(
 '__ct412_eligible',true,'__ct413_eligible',true,'__ct420_eligible',true,
 'runtime_minutes',greatest(coalesce(runtime_minutes,0),case when coalesce(raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (raw_tmdb->>'runtime')::int else 0 end),
 'genres',coalesce(nullif(genres,'[]'::jsonb),raw_tmdb->'genres'),
 'networks',raw_tmdb->'networks','production_companies',raw_tmdb->'production_companies',
 'keywords',raw_tmdb->'keywords','homepage',nullif(raw_tmdb->>'homepage','')
)) order by ord),'[]'::jsonb) from picked;
$$;

create or replace function public.cinetracker_discover_watch_unseen_v420(p_kind text,p_limit integer default 30)
returns jsonb
language sql stable security invoker set search_path=public
as $$
with cfg as (
 select lower(coalesce(p_kind,'movie')) kind,
        least(greatest(coalesce(p_limit,30),1),30)::int lim,
        least(60,greatest(coalesce(p_limit,30),1)*3)::int scan_lim
), src as materialized (
 select x.item,x.ord,m.*
 from cfg
 cross join lateral jsonb_array_elements(public.cinetracker_discover_watch_unseen_v396(cfg.kind,cfg.scan_lim)) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v420(
   m.media_type,m.media_kind,m.title,
   greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
   coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,true,(cfg.kind='movie')
 )
), picked as (
 select * from src order by ord limit (select lim from cfg)
)
select coalesce(jsonb_agg(item || jsonb_strip_nulls(jsonb_build_object(
 '__ct412_eligible',true,'__ct413_eligible',true,'__ct420_eligible',true,
 'runtime_minutes',greatest(coalesce(runtime_minutes,0),case when coalesce(raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (raw_tmdb->>'runtime')::int else 0 end),
 'genres',coalesce(nullif(genres,'[]'::jsonb),raw_tmdb->'genres'),
 'networks',raw_tmdb->'networks','production_companies',raw_tmdb->'production_companies',
 'keywords',raw_tmdb->'keywords','homepage',nullif(raw_tmdb->>'homepage','')
)) order by ord),'[]'::jsonb) from picked;
$$;

create or replace function public.cinetracker_profile_watchlist_runtime_v420()
returns jsonb
language sql stable security invoker set search_path=public
as $$
with wl as materialized (
  select distinct mo.media_id
  from public.media_overrides mo
  where mo.profile_id=auth.uid() and mo.state in ('AddedToWatchlist','WatchLater')
), watched_keys as materialized (
  select ep.media_id,ep.season_number,ep.episode_number
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true
  union
  select wh.media_id,wh.season_number,wh.episode_number
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.item_type='episode'
    and wh.media_id is not null and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
), watched as materialized (
  select media_id,count(*)::int watched_episodes from watched_keys group by media_id
), base as materialized (
  select m.id,m.media_type,m.media_kind,
    coalesce(
      nullif(m.runtime_minutes,0),
      case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then nullif((m.raw_tmdb->>'runtime')::int,0) end,
      case when coalesce(m.raw_tmdb#>>'{last_episode_to_air,runtime}','') ~ '^[0-9]+$' then nullif((m.raw_tmdb#>>'{last_episode_to_air,runtime}')::int,0) end,
      case when jsonb_typeof(m.raw_tmdb->'episode_run_time')='array' and coalesce(m.raw_tmdb->'episode_run_time'->>0,'') ~ '^[0-9]+$' then nullif((m.raw_tmdb->'episode_run_time'->>0)::int,0) end,
      0
    )::int effective_runtime,
    greatest(
      coalesce(m.total_episodes,0),
      case when coalesce(m.raw_tmdb->>'number_of_episodes','') ~ '^[0-9]+$' then (m.raw_tmdb->>'number_of_episodes')::int else 0 end,
      coalesce((
        select sum(case when coalesce(s->>'episode_count','') ~ '^[0-9]+$' then (s->>'episode_count')::int else 0 end)::int
        from jsonb_array_elements(case when jsonb_typeof(m.raw_tmdb->'seasons')='array' then m.raw_tmdb->'seasons' else '[]'::jsonb end) s
        where coalesce(s->>'season_number','0') <> '0'
      ),0)
    )::int effective_total_episodes,
    coalesce(w.watched_episodes,0)::int watched_episodes
  from wl
  join public.media m on m.id=wl.media_id
  left join watched w on w.media_id=m.id
), agg as (
  select
    coalesce(sum(effective_runtime) filter(where media_type='movie'),0)::bigint watchlist_movie_minutes,
    coalesce(sum((effective_runtime::bigint)*greatest(effective_total_episodes-watched_episodes,0)) filter(where media_type='tv'),0)::bigint watchlist_series_remaining_minutes,
    count(*) filter(where media_type='movie')::bigint watchlist_movies,
    count(*) filter(where media_type='tv')::bigint watchlist_series
  from base
)
select jsonb_build_object(
  'watchlist_movie_minutes',watchlist_movie_minutes,
  'watchlist_series_remaining_minutes',watchlist_series_remaining_minutes,
  'series_remaining_minutes',watchlist_series_remaining_minutes,
  'watchlist_total_minutes',watchlist_movie_minutes+watchlist_series_remaining_minutes,
  'watchlist_movies',watchlist_movies,
  'watchlist_series',watchlist_series
) from agg;
$$;

create or replace function public.cinetracker_sport_stats_v420()
returns table(watched_events bigint,sports_minutes bigint)
language sql stable security invoker set search_path=public
as $$
  select count(*)::bigint as watched_events,
         coalesce(sum(wh.duration_minutes),0)::bigint as sports_minutes
  from public.user_sport_watch_history wh
  join public.sport_events ev on ev.id=wh.event_id
  where wh.profile_id=auth.uid()
    and coalesce(ev.sport_slug,'') <> 'formula_1';
$$;

create or replace function public.cinetracker_f1_episode_watch_set_v420(
  p_season integer,
  p_episode integer,
  p_title text,
  p_runtime_minutes integer default 60,
  p_released_episodes integer default null,
  p_watched boolean default true,
  p_watched_at timestamptz default now()
) returns jsonb
language plpgsql volatile security invoker set search_path=public
as $$
declare v jsonb;
begin
  v:=public.cinetracker_f1_episode_watch_set_v418(
    p_season,p_episode,p_title,p_runtime_minutes,p_released_episodes,p_watched,p_watched_at
  );
  return coalesce(v,'{}'::jsonb) || jsonb_build_object(
    'media_id',865,'media_type','tv','media_kind','series','series_title','Formula 1','source','f1-series-r420'
  );
end;
$$;

revoke all on function public.cinetracker_recommendation_eligible_v420(text,text,text,integer,jsonb,jsonb,boolean,boolean) from public,anon;
grant execute on function public.cinetracker_recommendation_eligible_v420(text,text,text,integer,jsonb,jsonb,boolean,boolean) to authenticated;
revoke all on function public.cinetracker_discover_fresh_v420(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v420(text,integer) to authenticated;
revoke all on function public.cinetracker_discover_watch_unseen_v420(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_watch_unseen_v420(text,integer) to authenticated;
revoke all on function public.cinetracker_profile_watchlist_runtime_v420() from public,anon;
grant execute on function public.cinetracker_profile_watchlist_runtime_v420() to authenticated;
revoke all on function public.cinetracker_sport_stats_v420() from public,anon;
grant execute on function public.cinetracker_sport_stats_v420() to authenticated;
revoke all on function public.cinetracker_f1_episode_watch_set_v420(integer,integer,text,integer,integer,boolean,timestamptz) from public,anon;
grant execute on function public.cinetracker_f1_episode_watch_set_v420(integer,integer,text,integer,integer,boolean,timestamptz) to authenticated;

notify pgrst,'reload schema';
