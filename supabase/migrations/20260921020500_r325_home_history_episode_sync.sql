CREATE OR REPLACE FUNCTION public.cinetracker_home_history_v324(p_limit integer DEFAULT 50)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select (select auth.uid()) as uid,least(greatest(coalesce(p_limit,50),1),100)::int as lim
),
ep_latest as materialized (
  select wh.id,wh.media_id,wh.title,wh.watched_at,wh.season_number,wh.episode_number,wh.external_ids
  from public.watch_history wh cross join cfg c
  where wh.profile_id=c.uid and wh.item_type='episode'
  order by wh.watched_at desc,wh.id desc
  limit (select lim from cfg)
),
episodes as (
  select wh.id,wh.media_id,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,
    m.title as media_title,m.poster_path,
    case when nullif(wh.title,'') is not null and lower(wh.title)<>lower(m.title) then wh.title else null end as episode_title,
    wh.watched_at,wh.season_number,wh.episode_number,coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end as plays,
    case when coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)=wh.season_number
           and coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)=wh.episode_number
      then m.raw_tmdb->'last_episode_to_air'->>'name' end as cached_episode_title,
    case when coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)=wh.season_number
           and coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)=wh.episode_number
      then nullif(m.raw_tmdb->'last_episode_to_air'->>'vote_average','')::numeric end as episode_rating,
    case when coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)=wh.season_number
           and coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)=wh.episode_number
      then nullif(m.raw_tmdb->'last_episode_to_air'->>'air_date','') end as episode_air_date
  from ep_latest wh
  left join public.media m on m.id=wh.media_id
)
select jsonb_build_object(
  'history_episodes',coalesce((select jsonb_agg(to_jsonb(e) order by e.watched_at asc,e.id asc) from episodes e),'[]'::jsonb),
  'history_movies',public.cinetracker_home_movie_history_v323((select lim from cfg)),
  'limit',(select lim from cfg)
);
$function$
;

CREATE OR REPLACE FUNCTION public.cinetracker_home_series_watch_state_v2(p_tmdb_ids bigint[])
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with requested as materialized (
  select distinct x::bigint as tmdb_id
  from unnest(coalesce(p_tmdb_ids,'{}'::bigint[])) x
  where x is not null and x>0
  limit 200
),
media_ids as materialized (
  select r.tmdb_id,m.id as media_id,
         (m.tmdb_id>0 and m.tmdb_id=r.tmdb_id) as direct_tmdb,
         coalesce(m.raw_tmdb,'{}'::jsonb) as raw_tmdb,
         m.updated_at
  from requested r
  join public.media m on public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=r.tmdb_id
  where (select auth.uid()) is not null and m.media_type='tv'
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
  select tmdb_id,season_number,episode_number,max(watched_at) as watched_at
  from watched
  group by tmdb_id,season_number,episode_number
),
last_key as materialized (
  select distinct on (tmdb_id)
         tmdb_id,season_number,episode_number,watched_at
  from keys
  order by tmdb_id,season_number desc,episode_number desc,watched_at desc nulls last
),
per_media as materialized (
  select mi.tmdb_id,mi.media_id,mi.direct_tmdb,mi.raw_tmdb,mi.updated_at,
         count(distinct (w.season_number,w.episode_number))::int as own_watched_count,
         max(w.watched_at) as own_last_watched_at
  from media_ids mi
  left join watched w on w.tmdb_id=mi.tmdb_id and w.media_id=mi.media_id
  group by mi.tmdb_id,mi.media_id,mi.direct_tmdb,mi.raw_tmdb,mi.updated_at
),
canonical as materialized (
  select distinct on (tmdb_id) tmdb_id,media_id
  from per_media
  order by tmdb_id,
    direct_tmdb desc,
    ((raw_tmdb->>'enriched_at') is not null) desc,
    coalesce((raw_tmdb->>'enriched_at')::timestamptz,updated_at) desc nulls last,
    own_last_watched_at desc nulls last,
    own_watched_count desc,
    media_id desc
)
select coalesce(jsonb_agg(jsonb_build_object(
  'tmdb_id',r.tmdb_id,
  'canonical_media_id',c.media_id,
  'media_ids',coalesce((select jsonb_agg(mi.media_id order by mi.media_id) from media_ids mi where mi.tmdb_id=r.tmdb_id),'[]'::jsonb),
  'watched_episodes',coalesce((select count(*) from keys k where k.tmdb_id=r.tmdb_id),0),
  'watched_keys',coalesce((select jsonb_agg(jsonb_build_object('s',k.season_number,'e',k.episode_number,'at',k.watched_at) order by k.season_number,k.episode_number) from keys k where k.tmdb_id=r.tmdb_id),'[]'::jsonb),
  'last_season_number',lk.season_number,
  'last_episode_number',lk.episode_number,
  'last_watched_at',lk.watched_at
) order by r.tmdb_id),'[]'::jsonb)
from requested r
left join canonical c on c.tmdb_id=r.tmdb_id
left join last_key lk on lk.tmdb_id=r.tmdb_id;
$function$
;
revoke execute on function public.cinetracker_home_series_watch_state_v2(bigint[]) from public,anon;
grant execute on function public.cinetracker_home_series_watch_state_v2(bigint[]) to authenticated;
revoke execute on function public.cinetracker_home_history_v324(integer) from public,anon;
grant execute on function public.cinetracker_home_history_v324(integer) to authenticated;
notify pgrst,'reload schema';
