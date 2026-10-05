create or replace function public.cinetracker_profile_list_v475(
  p_kind text,
  p_limit integer default 60,
  p_offset integer default 0
)
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with cfg as (
  select lower(coalesce(p_kind,'')) as kind,
         least(240,greatest(1,coalesce(p_limit,60)))::int as lim,
         greatest(0,coalesce(p_offset,0))::int as off,
         auth.uid() as uid
), candidate_ids as materialized (
  select x.media_id, max(x.rank_at) as rank_at
  from (
    select wh.media_id, wh.watched_at as rank_at
    from public.watch_history wh cross join cfg c
    join public.media m on m.id=wh.media_id
    where wh.profile_id=c.uid and c.kind='movie_history' and wh.item_type='movie' and m.media_type='movie'
    union all
    select mo.media_id, coalesce(mo.watched_at,mo.updated_at,mo.created_at)
    from public.media_overrides mo cross join cfg c
    join public.media m on m.id=mo.media_id
    where mo.profile_id=c.uid and c.kind='movie_history' and mo.state='AlreadySeen' and m.media_type='movie'
    union all
    select wh.media_id, wh.watched_at
    from public.watch_history wh cross join cfg c
    join public.media m on m.id=wh.media_id
    where wh.profile_id=c.uid and c.kind='series_history' and wh.item_type='episode' and m.media_type='tv'
      and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
    union all
    select ep.media_id, coalesce(ep.watched_at,ep.updated_at)
    from public.episode_progress ep cross join cfg c
    join public.media m on m.id=ep.media_id
    where ep.profile_id=c.uid and c.kind='series_history' and ep.watched=true and m.media_type='tv'
      and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
    union all
    select mo.media_id, coalesce(mo.updated_at,mo.created_at)
    from public.media_overrides mo cross join cfg c
    join public.media m on m.id=mo.media_id
    where mo.profile_id=c.uid and c.kind='series_favorites' and mo.state='Liked' and m.media_type='tv'
    union all
    select mo.media_id, coalesce(mo.updated_at,mo.created_at)
    from public.media_overrides mo cross join cfg c
    join public.media m on m.id=mo.media_id
    where mo.profile_id=c.uid and c.kind='movie_favorites' and mo.state='Liked' and m.media_type='movie'
    union all
    select mo.media_id, coalesce(mo.updated_at,mo.created_at)
    from public.media_overrides mo cross join cfg c
    join public.media m on m.id=mo.media_id
    where mo.profile_id=c.uid and c.kind='series_watchlist' and mo.state in ('AddedToWatchlist','WatchLater') and m.media_type='tv'
    union all
    select mo.media_id, coalesce(mo.updated_at,mo.created_at)
    from public.media_overrides mo cross join cfg c
    join public.media m on m.id=mo.media_id
    where mo.profile_id=c.uid and c.kind='movie_watchlist' and mo.state in ('AddedToWatchlist','WatchLater') and m.media_type='movie'
  ) x
  where x.media_id is not null
  group by x.media_id
), candidate_keys as materialized (
  select
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end as logical_key,
    max(c.rank_at) as rank_at
  from candidate_ids c join public.media m on m.id=c.media_id
  group by 1
), members as materialized (
  select m.*, public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as effective_tmdb_id,
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end as logical_key
  from public.media m
  join candidate_keys k on k.logical_key=(case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end)
), best as materialized (
  select distinct on (mem.logical_key)
    mem.logical_key, mem.id as media_id, mem.media_type, mem.media_kind,
    mem.effective_tmdb_id as tmdb_id, mem.title, mem.poster_path, mem.release_year,
    coalesce(mem.runtime_minutes,0)::int as runtime_minutes,
    coalesce(mem.total_episodes,0)::int as total_episodes,
    coalesce(mem.raw_tmdb,'{}'::jsonb) as raw_tmdb
  from members mem
  order by mem.logical_key,
    (mem.tmdb_id>0 and mem.tmdb_id=mem.effective_tmdb_id) desc,
    (coalesce(mem.raw_tmdb,'{}'::jsonb)<>'{}'::jsonb) desc,
    (mem.poster_path is not null) desc,
    (coalesce(mem.runtime_minutes,0)>0) desc,
    coalesce(mem.total_episodes,0) desc, mem.id desc
), watched_keys as materialized (
  select distinct mem.logical_key, wh.season_number, wh.episode_number
  from public.watch_history wh join members mem on mem.id=wh.media_id cross join cfg c
  where wh.profile_id=c.uid and wh.item_type='episode'
    and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union
  select distinct mem.logical_key, ep.season_number, ep.episode_number
  from public.episode_progress ep join members mem on mem.id=ep.media_id cross join cfg c
  where ep.profile_id=c.uid and ep.watched=true
    and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), watched as materialized (
  select logical_key,count(*)::bigint as watched_episodes from watched_keys group by logical_key
), flags as materialized (
  select mem.logical_key,
    bool_or(mo.state='Liked') as is_favorite,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) as is_watchlist,
    bool_or(mo.state='InProgress') as is_in_progress,
    bool_or(mo.state='UpToDate') as is_up_to_date,
    bool_or(mo.state='Completed') as is_completed
  from public.media_overrides mo join members mem on mem.id=mo.media_id cross join cfg c
  where mo.profile_id=c.uid
  group by mem.logical_key
), page as materialized (
  select b.*, k.rank_at,
    coalesce(w.watched_episodes,0)::bigint as watched_episodes,
    coalesce(f.is_favorite,false) as is_favorite,
    coalesce(f.is_watchlist,false) as is_watchlist,
    coalesce(f.is_in_progress,false) as is_in_progress,
    coalesce(f.is_up_to_date,false) as is_up_to_date,
    coalesce(f.is_completed,false) as is_completed,
    (c.kind in ('movie_history','series_history')) as is_seen
  from best b join candidate_keys k using(logical_key) cross join cfg c
  left join watched w using(logical_key) left join flags f using(logical_key)
  order by k.rank_at desc nulls last,b.media_id desc
  limit (select lim from cfg) offset (select off from cfg)
)
select jsonb_build_object(
  'kind',(select kind from cfg),
  'rows',coalesce((select jsonb_agg(jsonb_strip_nulls(to_jsonb(p)-'logical_key') order by p.rank_at desc nulls last,p.media_id desc) from page p),'[]'::jsonb),
  'count',(select count(*)::int from candidate_keys),
  'offset',(select off from cfg),
  'limit',(select lim from cfg),
  'generated_at',now()
);
$function$;

grant execute on function public.cinetracker_profile_list_v475(text,integer,integer) to authenticated;
