-- CineTracker r261: first-class state for imported TV series that do not have a safe TMDB identity.
-- Formula 1 and NFL Super Bowls are real series in the imported library, but use surrogate
-- negative tmdb_id values. This RPC reads their real stored episode progress by media_id
-- without inventing TMDB metadata or marking historical episodes automatically.

create or replace function public.cinetracker_imported_series_state_v1(p_media_id bigint)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $function$
with target as (
  select m.id,m.title,m.media_type,m.media_kind,m.release_year,m.poster_path,
         m.total_seasons,m.total_episodes,coalesce(m.raw_tmdb,'{}'::jsonb) as raw_tmdb
  from public.media m
  where m.id=p_media_id
    and m.media_type='tv'
    and exists (
      select 1 from public.episode_progress ep
      where ep.profile_id=auth.uid() and ep.media_id=m.id
      union all
      select 1 from public.watch_history wh
      where wh.profile_id=auth.uid() and wh.media_id=m.id
      union all
      select 1 from public.media_overrides mo
      where mo.profile_id=auth.uid() and mo.media_id=m.id
    )
  limit 1
), watched_keys as (
  select distinct ep.season_number,ep.episode_number,
         max(ep.watched_at) over(partition by ep.season_number,ep.episode_number) as watched_at
  from public.episode_progress ep,target t
  where ep.profile_id=auth.uid() and ep.media_id=t.id and ep.watched=true
    and coalesce(ep.season_number,0)>=0 and coalesce(ep.episode_number,0)>0
  union
  select distinct wh.season_number,wh.episode_number,
         max(wh.watched_at) over(partition by wh.season_number,wh.episode_number) as watched_at
  from public.watch_history wh,target t
  where wh.profile_id=auth.uid() and wh.media_id=t.id and wh.item_type='episode'
    and coalesce(wh.season_number,0)>=0 and coalesce(wh.episode_number,0)>0
), dedup as (
  select season_number,episode_number,max(watched_at) as watched_at
  from watched_keys group by season_number,episode_number
), season_stats as (
  select season_number,count(*)::int as watched_episodes,max(episode_number)::int as last_episode_number,
         max(watched_at) as last_watched_at
  from dedup group by season_number
)
select case when exists(select 1 from target) then jsonb_build_object(
  'media_id',(select id from target),
  'title',(select title from target),
  'media_type','tv',
  'media_kind',coalesce((select media_kind from target),'series'),
  'release_year',(select release_year from target),
  'poster_path',(select poster_path from target),
  'total_seasons',(select total_seasons from target),
  'total_episodes',(select total_episodes from target),
  'watched_episodes',(select count(*) from dedup),
  'last_watched_at',(select max(watched_at) from dedup),
  'episodes',coalesce((select jsonb_agg(jsonb_build_object(
      'season_number',d.season_number,'episode_number',d.episode_number,'watched_at',d.watched_at
    ) order by d.season_number,d.episode_number) from dedup d),'[]'::jsonb),
  'seasons',coalesce((select jsonb_agg(jsonb_build_object(
      'season_number',s.season_number,'watched_episodes',s.watched_episodes,
      'last_episode_number',s.last_episode_number,'last_watched_at',s.last_watched_at
    ) order by s.season_number) from season_stats s),'[]'::jsonb)
) else jsonb_build_object('media_id',null,'episodes','[]'::jsonb,'seasons','[]'::jsonb) end;
$function$;

revoke all on function public.cinetracker_imported_series_state_v1(bigint) from public, anon;
grant execute on function public.cinetracker_imported_series_state_v1(bigint) to authenticated;
