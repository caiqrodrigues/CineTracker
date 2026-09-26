create or replace function public.cinetracker_home_payload_v382(
  p_today date default current_date,
  p_history_limit integer default 50,
  p_series_limit integer default 120,
  p_movie_limit integer default 240
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with base as materialized (
  select public.cinetracker_home_payload_v359(
    coalesce(p_today,current_date),
    least(greatest(coalesce(p_history_limit,50),1),100),
    least(greatest(coalesce(p_series_limit,120),1),200),
    least(greatest(coalesce(p_movie_limit,240),1),240)
  ) payload
),
active_json as materialized (
  select public.cinetracker_home_active_v380(coalesce(p_today,current_date)) rows
),
active as materialized (
  select x.*
  from active_json
  cross join lateral jsonb_to_recordset(coalesce(active_json.rows,'[]'::jsonb)) x(
    media_id bigint,media_type text,tmdb_id bigint,title text,poster_path text,release_year integer,
    source_state text,watched_episodes integer,released_episodes integer,total_episodes integer,
    available_episodes integer,home_bucket text,next_season_number integer,next_episode_number integer,
    next_episode_title text,next_episode_rating numeric,next_episode_air_date date,last_watched_at timestamptz
  )
),
series_raw as materialized (
  select e.ordinality::int ord,e.value obj,nullif(e.value->>'tmdb_id','')::bigint tmdb_id
  from base
  cross join lateral jsonb_array_elements(coalesce(base.payload->'series','[]'::jsonb))
    with ordinality e(value,ordinality)
),
patched as materialized (
  select r.ord,
    case when a.tmdb_id is null then r.obj else
      r.obj || jsonb_strip_nulls(jsonb_build_object(
        'watched_episodes',greatest(coalesce(nullif(r.obj->>'watched_episodes','')::int,0),coalesce(a.watched_episodes,0)),
        'released_episodes',greatest(coalesce(nullif(r.obj->>'released_episodes','')::int,0),coalesce(a.released_episodes,0)),
        'total_episodes',greatest(coalesce(nullif(r.obj->>'total_episodes','')::int,0),coalesce(a.total_episodes,0)),
        'available_episodes',coalesce(a.available_episodes,nullif(r.obj->>'available_episodes','')::int),
        'next_season_number',coalesce(a.next_season_number,nullif(r.obj->>'next_season_number','')::int),
        'next_episode_number',coalesce(a.next_episode_number,nullif(r.obj->>'next_episode_number','')::int),
        'next_episode_title',coalesce(a.next_episode_title,nullif(r.obj->>'next_episode_title','')),
        'next_episode_rating',coalesce(a.next_episode_rating,nullif(r.obj->>'next_episode_rating','')::numeric),
        'next_episode_air_date',coalesce(a.next_episode_air_date::text,nullif(r.obj->>'next_episode_air_date','')),
        'last_watched_at',coalesce(a.last_watched_at::text,nullif(r.obj->>'last_watched_at','')),
        '__ct382_active_metadata',true
      ))
    end obj
  from series_raw r left join active a on a.tmdb_id=r.tmdb_id
),
max_ord as materialized (select coalesce(max(ord),0) n from series_raw),
missing as materialized (
  select (select n from max_ord)+row_number() over(order by a.last_watched_at desc nulls last,a.tmdb_id)::int ord,
    jsonb_strip_nulls(jsonb_build_object(
      'media_id',a.media_id,'media_type','tv','tmdb_id',a.tmdb_id,'title',a.title,'poster_path',a.poster_path,'release_year',a.release_year,
      'source_state',a.source_state,'watched_episodes',a.watched_episodes,'released_episodes',a.released_episodes,'total_episodes',a.total_episodes,
      'available_episodes',a.available_episodes,
      'home_bucket',case when a.home_bucket in ('continue','dust','up_to_date','not_started') then a.home_bucket when a.source_state='InProgress' then 'continue' when a.source_state='UpToDate' then 'up_to_date' else 'not_started' end,
      'next_season_number',a.next_season_number,'next_episode_number',a.next_episode_number,'next_episode_title',a.next_episode_title,
      'next_episode_rating',a.next_episode_rating,'next_episode_air_date',a.next_episode_air_date,'last_watched_at',a.last_watched_at,'__ct382_active_insert',true
    )) obj
  from active a
  where a.tmdb_id>0 and not exists(select 1 from series_raw r where r.tmdb_id=a.tmdb_id)
),
series_final as materialized (
  select coalesce(jsonb_agg(obj order by ord),'[]'::jsonb) rows
  from (select ord,obj from patched union all select ord,obj from missing) x
)
select (base.payload-'series') || jsonb_build_object(
  'series',(select rows from series_final),
  '__ct_home_authority','home-v382-full-original-buckets-first-paint',
  '__ct382_metadata_merged',true
) from base;
$$;
revoke all on function public.cinetracker_home_payload_v382(date,integer,integer,integer) from public,anon;
grant execute on function public.cinetracker_home_payload_v382(date,integer,integer,integer) to authenticated;
grant execute on function public.cinetracker_home_payload_v382(date,integer,integer,integer) to service_role;
notify pgrst,'reload schema';
