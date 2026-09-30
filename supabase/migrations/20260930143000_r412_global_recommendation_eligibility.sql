-- CineTracker r412 / Web 1.0.203
-- Strict recommendation/discovery eligibility: no short-form movies/specials (<40m), YouTube/web originals, novelas/soap.

create or replace function public.cinetracker_recommendation_eligible_v412(
  p_media_type text,p_media_kind text,p_title text,p_runtime_minutes integer,p_genres jsonb,p_raw_tmdb jsonb,
  p_exclude_wwe boolean default true,p_require_movie_runtime boolean default false
)
returns boolean language sql immutable set search_path to 'public' as $function$
with v as (
  select lower(coalesce(p_media_type,'')) media_type,lower(coalesce(p_media_kind,'')) media_kind,lower(coalesce(p_title,'')) title,
    greatest(coalesce(p_runtime_minutes,0),case when coalesce(p_raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (p_raw_tmdb->>'runtime')::int else 0 end)::int runtime_minutes,
    lower(coalesce(p_genres,'[]'::jsonb)::text) genres_text,
    lower(coalesce(p_raw_tmdb->'genre_ids','[]'::jsonb)::text) genre_ids_text,
    lower(coalesce(p_raw_tmdb->'genres','[]'::jsonb)::text) raw_genres_text,
    lower(coalesce(p_raw_tmdb->'networks','[]'::jsonb)::text) networks_text,
    lower(coalesce(p_raw_tmdb->'production_companies','[]'::jsonb)::text) companies_text,
    lower(coalesce(p_raw_tmdb->'keywords','[]'::jsonb)::text) keywords_text,
    lower(coalesce(p_raw_tmdb->>'homepage','')) homepage,
    lower(coalesce(p_raw_tmdb->>'episode_type',p_raw_tmdb->>'type','')) raw_kind
)
select not (
  (coalesce(p_exclude_wwe,true) and title ~ '(^|[^[:alnum:]])(wwe|wwe raw|monday night raw|friday night smackdown|smackdown)([^[:alnum:]]|$)')
  or genre_ids_text ~ '(^|[^0-9])10766([^0-9]|$)'
  or genres_text ~ '(soap opera|telenovela|novela|"soap")'
  or raw_genres_text ~ '(soap opera|telenovela|novela|"soap")'
  or media_kind ~ '(soap|telenovela|novela)'
  or networks_text ~ '(youtube|youtube originals|youtube premium|youtube red)'
  or companies_text ~ '(youtube|youtube originals|youtube premium|youtube red)'
  or homepage ~ '(youtube[.]com|youtu[.]be)'
  or keywords_text ~ '(youtube|youtube original|web series|webseries|web video|internet video|video blog|vlog)'
  or (media_type='movie' and ((runtime_minutes>0 and runtime_minutes<40) or (coalesce(p_require_movie_runtime,false) and runtime_minutes<40)))
  or ((media_kind ~ '(special|short)' or raw_kind ~ '(special|short)') and runtime_minutes>0 and runtime_minutes<40)
) from v;
$function$;

create or replace function public.cinetracker_discover_fresh_v412(p_kind text,p_limit integer default 48)
returns jsonb language sql stable set search_path to 'public' as $function$
with cfg as (
 select lower(coalesce(p_kind,'movie')) kind,least(greatest(coalesce(p_limit,48),1),48)::int lim,
        least(96,greatest(coalesce(p_limit,48),1)*3)::int scan_lim
), src as materialized (
 select x.item,x.ord,m.*
 from cfg
 cross join lateral jsonb_array_elements(public.cinetracker_discover_fresh_v387(cfg.kind,cfg.scan_lim)) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v412(
   m.media_type,m.media_kind,m.title,
   greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
   coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,true,(cfg.kind='movie')
 )
), picked as (select * from src order by ord limit (select lim from cfg))
select coalesce(jsonb_agg(item || jsonb_strip_nulls(jsonb_build_object(
 '__ct412_eligible',true,
 'runtime_minutes',greatest(coalesce(runtime_minutes,0),case when coalesce(raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (raw_tmdb->>'runtime')::int else 0 end),
 'genres',coalesce(nullif(genres,'[]'::jsonb),raw_tmdb->'genres'),
 'networks',raw_tmdb->'networks','production_companies',raw_tmdb->'production_companies',
 'keywords',raw_tmdb->'keywords','homepage',nullif(raw_tmdb->>'homepage','')
)) order by ord),'[]'::jsonb) from picked;
$function$;

create or replace function public.cinetracker_discover_watch_unseen_v412(p_kind text,p_limit integer default 30)
returns jsonb language sql stable set search_path to 'public' as $function$
with cfg as (
 select lower(coalesce(p_kind,'movie')) kind,least(greatest(coalesce(p_limit,30),1),30)::int lim,
        least(60,greatest(coalesce(p_limit,30),1)*3)::int scan_lim
), src as materialized (
 select x.item,x.ord,m.*
 from cfg
 cross join lateral jsonb_array_elements(public.cinetracker_discover_watch_unseen_v396(cfg.kind,cfg.scan_lim)) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v412(
   m.media_type,m.media_kind,m.title,
   greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
   coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,true,(cfg.kind='movie')
 )
), picked as (select * from src order by ord limit (select lim from cfg))
select coalesce(jsonb_agg(item || jsonb_strip_nulls(jsonb_build_object(
 '__ct412_eligible',true,
 'runtime_minutes',greatest(coalesce(runtime_minutes,0),case when coalesce(raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (raw_tmdb->>'runtime')::int else 0 end),
 'genres',coalesce(nullif(genres,'[]'::jsonb),raw_tmdb->'genres'),
 'networks',raw_tmdb->'networks','production_companies',raw_tmdb->'production_companies',
 'keywords',raw_tmdb->'keywords','homepage',nullif(raw_tmdb->>'homepage','')
)) order by ord),'[]'::jsonb) from picked;
$function$;

create or replace function public.cinetracker_home_series_v412(p_today date default current_date)
returns jsonb language sql stable set search_path to 'public' as $function$
with src as materialized (
 select x.item,x.ord,m.*
 from jsonb_array_elements(public.cinetracker_home_series_v406(coalesce(p_today,current_date))) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v412(
   m.media_type,m.media_kind,m.title,
   greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
   coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,false,false
 )
)
select coalesce(jsonb_agg(item || jsonb_build_object('__ct412_eligible',true) order by ord),'[]'::jsonb) from src;
$function$;

grant execute on function public.cinetracker_recommendation_eligible_v412(text,text,text,integer,jsonb,jsonb,boolean,boolean) to authenticated;
grant execute on function public.cinetracker_discover_fresh_v412(text,integer) to authenticated;
grant execute on function public.cinetracker_discover_watch_unseen_v412(text,integer) to authenticated;
grant execute on function public.cinetracker_home_series_v412(date) to authenticated;
