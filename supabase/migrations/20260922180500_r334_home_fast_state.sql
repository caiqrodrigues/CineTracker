CREATE OR REPLACE FUNCTION public.cinetracker_home_payload_v334(p_today date DEFAULT CURRENT_DATE, p_history_limit integer DEFAULT 50, p_series_limit integer DEFAULT 120, p_movie_limit integer DEFAULT 120)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select
    least(greatest(coalesce(p_history_limit,50),1),100)::int history_lim,
    least(greatest(coalesce(p_series_limit,120),1),200)::int series_lim,
    least(greatest(coalesce(p_movie_limit,120),1),240)::int movie_lim,
    coalesce(p_today,current_date)::date today
),
base as materialized (
  select public.cinetracker_home_payload_v332(
    (select today from cfg),
    (select history_lim from cfg),
    (select series_lim from cfg),
    (select movie_lim from cfg)
  ) payload
),
series_raw as materialized (
  select e.value obj,e.ordinality::int ord,
         nullif(e.value->>'tmdb_id','')::bigint tmdb_id,
         nullif(e.value->>'media_id','')::bigint media_id,
         coalesce(nullif(e.value->>'released_episodes','')::int,0) released,
         coalesce(nullif(e.value->>'watched_episodes','')::int,0) watched,
         coalesce(nullif(e.value->>'total_episodes','')::int,0) total_eps,
         coalesce(e.value->>'home_bucket','') bucket
  from base
  cross join lateral jsonb_array_elements(coalesce(base.payload->'series','[]'::jsonb)) with ordinality e(value,ordinality)
),
series_ids as materialized (
  select coalesce(array_agg(distinct tmdb_id) filter(where tmdb_id>0),'{}'::bigint[]) ids from series_raw
),
state_json as materialized (
  select public.cinetracker_home_series_watch_state_v4((select ids from series_ids)) j
),
states as materialized (
  select x.*
  from state_json
  cross join lateral jsonb_to_recordset(coalesce(state_json.j,'[]'::jsonb)) x(
    tmdb_id bigint,canonical_media_id bigint,media_ids jsonb,watched_episodes int,watched_keys jsonb,
    last_season_number int,last_episode_number int,last_watched_at timestamptz
  )
),
series_patched as materialized (
  select
    r.ord,r.tmdb_id,
    case when s.tmdb_id is null then r.obj else
      r.obj
      || jsonb_build_object(
        'media_id',coalesce(nullif(s.canonical_media_id,0),r.media_id),
        'watched_episodes',coalesce(s.watched_episodes,r.watched),
        'released_episodes',greatest(r.released,coalesce(s.watched_episodes,r.watched)),
        'available_episodes',greatest(0,greatest(r.released,coalesce(s.watched_episodes,r.watched))-coalesce(s.watched_episodes,r.watched)),
        'last_season_number',s.last_season_number,
        'last_episode_number',s.last_episode_number,
        'last_watched_at',s.last_watched_at
      )
      || case
        when coalesce(s.watched_episodes,r.watched)>0
         and greatest(r.released,coalesce(s.watched_episodes,r.watched))<=coalesce(s.watched_episodes,r.watched)
        then jsonb_build_object(
          'home_bucket',case when r.bucket='completed' then 'completed' else 'up_to_date' end,
          'available_episodes',0,
          'next_season_number',null,
          'next_episode_number',null,
          'next_episode_title',null,
          'next_episode_rating',null,
          'next_episode_air_date',null
        )
        else '{}'::jsonb end
    end obj,
    coalesce(s.canonical_media_id,r.media_id) canonical_media_id,
    coalesce(s.watched_episodes,r.watched) watched_episodes
  from series_raw r
  left join states s on s.tmdb_id=r.tmdb_id
),
series_ranked as materialized (
  select *,
         row_number() over(
           partition by case when tmdb_id>0 then 'tmdb:'||tmdb_id::text else 'media:'||coalesce(canonical_media_id,0)::text end
           order by
             ((obj->>'media_id')::bigint=canonical_media_id) desc,
             watched_episodes desc,
             coalesce((obj->>'total_episodes')::int,0) desc,
             ord asc
         ) rn
  from series_patched
),
series_final as materialized (
  select coalesce(jsonb_agg(obj order by ord),'[]'::jsonb) rows from series_ranked where rn=1
),
wl as materialized (
  select public.cinetracker_watchlist_full_v119() payload
),
watch_rows as materialized (
  select x.*
  from wl
  cross join lateral jsonb_to_recordset(coalesce(wl.payload->'rows','[]'::jsonb)) x(
    media_id bigint,media_type text,tmdb_id integer,title text,poster_path text,release_year integer,
    raw_tmdb jsonb,added_at timestamptz
  )
  where x.media_type='movie'
),
eligible_movies as materialized (
  select
    w.media_id,'movie'::text media_type,w.tmdb_id,w.title,w.poster_path,w.release_year,
    nullif(w.raw_tmdb->>'release_date','') release_date,
    coalesce(m.runtime_minutes,
      case when coalesce(w.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (w.raw_tmdb->>'runtime')::int else 0 end,0
    )::int runtime_minutes,
    coalesce(w.raw_tmdb->'genres','[]'::jsonb) genres,
    case when coalesce(w.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (w.raw_tmdb->>'vote_average')::numeric else null end vote_average,
    w.added_at,
    case
      when coalesce(w.raw_tmdb->>'release_date','') ~ '^\d{4}-\d{2}-\d{2}$'
        then (w.raw_tmdb->>'release_date')::date <= (select today from cfg)
      when coalesce(w.release_year,0)>0
        then w.release_year < extract(year from (select today from cfg))::int
             or (w.release_year=extract(year from (select today from cfg))::int and lower(coalesce(w.raw_tmdb->>'status',''))='released')
      else false
    end is_released
  from watch_rows w
  left join public.media m on m.id=w.media_id
  where not exists(
    select 1 from public.watch_history wh
    where wh.profile_id=(select auth.uid()) and wh.media_id=w.media_id and wh.item_type='movie'
  )
  and not exists(
    select 1 from public.watch_play_events_v0994 pe
    where pe.profile_id=(select auth.uid()) and pe.media_id=w.media_id and pe.item_type='movie'
  )
  and not exists(
    select 1 from public.media_overrides mo
    where mo.profile_id=(select auth.uid()) and mo.media_id=w.media_id
      and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')
  )
),
eligible_keyed as materialized (
  select e.*,
    case
      when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
        then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else 'legacy:'||lower(regexp_replace(coalesce(e.title,''),'[^[:alnum:]]+','','g'))||':'||coalesce(e.release_year,0)::text
    end logical_key
  from eligible_movies e
  left join public.media m on m.id=e.media_id
  where e.is_released
),
eligible_dedup as materialized (
  select distinct on (logical_key) *
  from eligible_keyed
  order by logical_key,added_at desc nulls last,media_id desc
),
movie_rows as materialized (
  select coalesce(jsonb_agg(to_jsonb(z)-'logical_key'-'is_released' order by z.added_at desc nulls last,z.media_id desc),'[]'::jsonb) rows
  from (select * from eligible_dedup order by added_at desc nulls last,media_id desc limit (select movie_lim from cfg)) z
),
movie_count as materialized (
  select count(*)::int n from eligible_dedup
)
select
  (base.payload - 'series' - 'movie_watchlist' - 'movie_watchlist_total')
  || jsonb_build_object(
    'series',(select rows from series_final),
    'movie_watchlist',(select rows from movie_rows),
    'movie_watchlist_total',(select n from movie_count),
    '__ct_home_authority','home-v334-fast-logical-series+released-unseen-movies',
    '__ct_series_watch_state','v4-fast-dedup-first-paint',
    '__ct_movie_watchlist_rule','released+unseen-only'
  )
from base;
$function$


CREATE OR REPLACE FUNCTION public.cinetracker_home_series_watch_state_v4(p_tmdb_ids bigint[])
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with requested as materialized (
  select distinct x::bigint tmdb_id
  from unnest(coalesce(p_tmdb_ids,'{}'::bigint[])) x
  where x is not null and x>0
  limit 200
),
media_ids as materialized (
  select
    r.tmdb_id,m.id media_id,
    (m.tmdb_id>0 and m.tmdb_id=r.tmdb_id) direct_tmdb,
    coalesce(m.raw_tmdb,'{}'::jsonb) raw_tmdb,
    m.updated_at
  from requested r
  join public.media m on (
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end
  )=('tv:'||r.tmdb_id::text)
  where (select auth.uid()) is not null
),
watched as materialized (
  select distinct mi.tmdb_id,ep.media_id,ep.season_number,ep.episode_number,ep.watched_at
  from media_ids mi
  join public.episode_progress ep on ep.media_id=mi.media_id
  where ep.profile_id=(select auth.uid()) and ep.watched=true
    and ep.season_number>0 and ep.episode_number>0
  union
  select distinct mi.tmdb_id,wh.media_id,wh.season_number,wh.episode_number,wh.watched_at
  from media_ids mi
  join public.watch_history wh on wh.media_id=mi.media_id
  where wh.profile_id=(select auth.uid()) and wh.item_type='episode'
    and wh.season_number>0 and wh.episode_number>0
),
keys as materialized (
  select tmdb_id,season_number,episode_number,max(watched_at) watched_at
  from watched
  group by tmdb_id,season_number,episode_number
),
last_key as materialized (
  select distinct on (tmdb_id)
    tmdb_id,season_number,episode_number,watched_at
  from keys
  order by tmdb_id,season_number desc,episode_number desc,watched_at desc nulls last
),
media_stats as materialized (
  select
    mi.tmdb_id,mi.media_id,
    count(distinct (w.season_number,w.episode_number))::int own_watched_count,
    max(w.watched_at) own_last_watched_at
  from media_ids mi
  left join watched w on w.tmdb_id=mi.tmdb_id and w.media_id=mi.media_id
  group by mi.tmdb_id,mi.media_id
),
canonical as materialized (
  select distinct on (mi.tmdb_id)
    mi.tmdb_id,mi.media_id
  from media_ids mi
  left join media_stats st on st.tmdb_id=mi.tmdb_id and st.media_id=mi.media_id
  order by
    mi.tmdb_id,
    mi.direct_tmdb desc,
    ((mi.raw_tmdb->>'enriched_at') is not null) desc,
    coalesce(
      case when coalesce(mi.raw_tmdb->>'enriched_at','') ~ '^\d{4}-\d{2}-\d{2}T'
        then (mi.raw_tmdb->>'enriched_at')::timestamptz end,
      mi.updated_at
    ) desc nulls last,
    st.own_last_watched_at desc nulls last,
    coalesce(st.own_watched_count,0) desc,
    mi.media_id desc
),
media_rollup as materialized (
  select
    r.tmdb_id,
    c.media_id canonical_media_id,
    coalesce(jsonb_agg(mi.media_id order by mi.media_id) filter(where mi.media_id is not null),'[]'::jsonb) media_ids
  from requested r
  left join canonical c on c.tmdb_id=r.tmdb_id
  left join media_ids mi on mi.tmdb_id=r.tmdb_id
  group by r.tmdb_id,c.media_id
),
key_rollup as materialized (
  select
    r.tmdb_id,
    count(k.*)::int watched_episodes,
    coalesce(
      jsonb_agg(jsonb_build_object('s',k.season_number,'e',k.episode_number,'at',k.watched_at)
        order by k.season_number,k.episode_number) filter(where k.tmdb_id is not null),
      '[]'::jsonb
    ) watched_keys
  from requested r
  left join keys k on k.tmdb_id=r.tmdb_id
  group by r.tmdb_id
)
select coalesce(jsonb_agg(jsonb_build_object(
  'tmdb_id',r.tmdb_id,
  'canonical_media_id',r.canonical_media_id,
  'media_ids',r.media_ids,
  'watched_episodes',coalesce(k.watched_episodes,0),
  'watched_keys',coalesce(k.watched_keys,'[]'::jsonb),
  'last_season_number',lk.season_number,
  'last_episode_number',lk.episode_number,
  'last_watched_at',lk.watched_at
) order by r.tmdb_id),'[]'::jsonb)
from media_rollup r
left join key_rollup k on k.tmdb_id=r.tmdb_id
left join last_key lk on lk.tmdb_id=r.tmdb_id;
$function$

;
revoke execute on function public.cinetracker_home_series_watch_state_v4(bigint[]) from public,anon;
grant execute on function public.cinetracker_home_series_watch_state_v4(bigint[]) to authenticated;
revoke execute on function public.cinetracker_home_payload_v334(date,integer,integer,integer) from public,anon;
grant execute on function public.cinetracker_home_payload_v334(date,integer,integer,integer) to authenticated;
notify pgrst,'reload schema';
