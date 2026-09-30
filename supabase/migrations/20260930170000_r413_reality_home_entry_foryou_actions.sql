-- CineTracker r413 / Web 1.0.204
-- Extends strict recommendation/discovery eligibility with Reality exclusion.

create or replace function public.cinetracker_recommendation_eligible_v413(
  p_media_type text,p_media_kind text,p_title text,p_runtime_minutes integer,p_genres jsonb,p_raw_tmdb jsonb,
  p_exclude_wwe boolean default true,p_require_movie_runtime boolean default false
)
returns boolean language sql immutable set search_path to 'public' as $function$
with v as (
  select
    lower(coalesce(p_media_kind,'')) media_kind,
    lower(coalesce(p_genres,'[]'::jsonb)::text) genres_text,
    lower(coalesce(p_raw_tmdb->'genre_ids','[]'::jsonb)::text) genre_ids_text,
    lower(coalesce(p_raw_tmdb->'genres','[]'::jsonb)::text) raw_genres_text
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
from v;
$function$;

create or replace function public.cinetracker_discover_fresh_v413(p_kind text,p_limit integer default 48)
returns jsonb language sql stable set search_path to 'public' as $function$
with cfg as (
 select lower(coalesce(p_kind,'movie')) kind,
        least(greatest(coalesce(p_limit,48),1),48)::int lim,
        least(96,greatest(coalesce(p_limit,48),1)*3)::int scan_lim
), src as materialized (
 select x.item,x.ord,m.*
 from cfg
 cross join lateral jsonb_array_elements(public.cinetracker_discover_fresh_v387(cfg.kind,cfg.scan_lim)) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v413(
   m.media_type,m.media_kind,m.title,
   greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
   coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,true,(cfg.kind='movie')
 )
), picked as (
 select * from src order by ord limit (select lim from cfg)
)
select coalesce(jsonb_agg(item || jsonb_strip_nulls(jsonb_build_object(
 '__ct412_eligible',true,'__ct413_eligible',true,
 'runtime_minutes',greatest(coalesce(runtime_minutes,0),case when coalesce(raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (raw_tmdb->>'runtime')::int else 0 end),
 'genres',coalesce(nullif(genres,'[]'::jsonb),raw_tmdb->'genres'),
 'networks',raw_tmdb->'networks','production_companies',raw_tmdb->'production_companies',
 'keywords',raw_tmdb->'keywords','homepage',nullif(raw_tmdb->>'homepage','')
)) order by ord),'[]'::jsonb) from picked;
$function$;

create or replace function public.cinetracker_discover_watch_unseen_v413(p_kind text,p_limit integer default 30)
returns jsonb language sql stable set search_path to 'public' as $function$
with cfg as (
 select lower(coalesce(p_kind,'movie')) kind,
        least(greatest(coalesce(p_limit,30),1),30)::int lim,
        least(60,greatest(coalesce(p_limit,30),1)*3)::int scan_lim
), src as materialized (
 select x.item,x.ord,m.*
 from cfg
 cross join lateral jsonb_array_elements(public.cinetracker_discover_watch_unseen_v396(cfg.kind,cfg.scan_lim)) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v413(
   m.media_type,m.media_kind,m.title,
   greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
   coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,true,(cfg.kind='movie')
 )
), picked as (
 select * from src order by ord limit (select lim from cfg)
)
select coalesce(jsonb_agg(item || jsonb_strip_nulls(jsonb_build_object(
 '__ct412_eligible',true,'__ct413_eligible',true,
 'runtime_minutes',greatest(coalesce(runtime_minutes,0),case when coalesce(raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (raw_tmdb->>'runtime')::int else 0 end),
 'genres',coalesce(nullif(genres,'[]'::jsonb),raw_tmdb->'genres'),
 'networks',raw_tmdb->'networks','production_companies',raw_tmdb->'production_companies',
 'keywords',raw_tmdb->'keywords','homepage',nullif(raw_tmdb->>'homepage','')
)) order by ord),'[]'::jsonb) from picked;
$function$;

create or replace function public.cinetracker_home_series_v413(p_today date default current_date)
returns jsonb language sql stable set search_path to 'public' as $function$
with src as materialized (
 select x.item,x.ord,m.*
 from jsonb_array_elements(public.cinetracker_home_series_v406(coalesce(p_today,current_date))) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v413(
   m.media_type,m.media_kind,m.title,
   greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
   coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,false,false
 )
)
select coalesce(jsonb_agg(item || jsonb_build_object('__ct412_eligible',true,'__ct413_eligible',true) order by ord),'[]'::jsonb) from src;
$function$;

grant execute on function public.cinetracker_recommendation_eligible_v413(text,text,text,integer,jsonb,jsonb,boolean,boolean) to authenticated;
grant execute on function public.cinetracker_discover_fresh_v413(text,integer) to authenticated;
grant execute on function public.cinetracker_discover_watch_unseen_v413(text,integer) to authenticated;
grant execute on function public.cinetracker_home_series_v413(date) to authenticated;
