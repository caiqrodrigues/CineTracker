create or replace function public.cinetracker_home_series_v383(p_today date default current_date)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with relevant as materialized (
  select
    m.id media_id,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else 'media:'||m.id::text end logical_key,
    m.title,m.poster_path,m.release_year,coalesce(m.total_episodes,0)::int total_episodes,
    coalesce(m.raw_tmdb,'{}'::jsonb) raw_tmdb,
    mo.state,mo.updated_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where mo.profile_id=auth.uid()
    and m.media_type='tv'
    and mo.state in ('InProgress','UpToDate','AddedToWatchlist','WatchLater')
), flags as materialized (
  select logical_key,
    bool_or(state='InProgress') is_in_progress,
    bool_or(state='UpToDate') is_up_to_date,
    bool_or(state in ('AddedToWatchlist','WatchLater')) is_watchlist,
    max(updated_at) state_updated_at
  from relevant group by logical_key
), canonical as materialized (
  select distinct on (r.logical_key)
    r.logical_key,r.media_id,r.tmdb_id,r.title,r.poster_path,r.release_year,r.total_episodes,r.raw_tmdb
  from relevant r
  order by r.logical_key,(r.tmdb_id>0) desc,((r.raw_tmdb->>'enriched_at') is not null) desc,r.updated_at desc nulls last,r.media_id desc
), watched_keys as materialized (
  select distinct r.logical_key,wh.season_number,wh.episode_number,wh.watched_at
  from relevant r join public.watch_history wh on wh.media_id=r.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode'
    and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union
  select distinct r.logical_key,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at)
  from relevant r join public.episode_progress ep on ep.media_id=r.media_id
  where ep.profile_id=auth.uid() and ep.watched=true
    and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), watched as materialized (
  select logical_key,count(*)::int watched_episodes,
    max(season_number*100000+episode_number)::int last_key,max(watched_at) last_watched_at,
    (array_agg(season_number order by season_number desc,episode_number desc))[1]::int last_season_number,
    (array_agg(episode_number order by season_number desc,episode_number desc))[1]::int last_episode_number
  from watched_keys group by logical_key
), catalog as materialized (
  select c.logical_key,
    count(e.*) filter(where e.season_number>0 and e.episode_number>0 and (e.air_date is null or e.air_date<=coalesce(p_today,current_date)))::int released_episodes,
    max(e.season_number*100000+e.episode_number) filter(where e.season_number>0 and e.episode_number>0 and (e.air_date is null or e.air_date<=coalesce(p_today,current_date)))::int latest_key
  from canonical c
  left join public.episode_catalog_v336 e on c.tmdb_id>0 and e.show_tmdb_id=c.tmdb_id
  group by c.logical_key
), calc as materialized (
  select c.*,f.is_in_progress,f.is_up_to_date,f.is_watchlist,f.state_updated_at,
    coalesce(w.watched_episodes,0)::int watched_episodes,w.last_key,w.last_watched_at,w.last_season_number,w.last_episode_number,
    greatest(coalesce(cat.released_episodes,0),coalesce(w.watched_episodes,0))::int released_episodes,cat.latest_key,
    nxt.season_number next_season_number,nxt.episode_number next_episode_number,
    coalesce(nullif(nxt.name_local,''),nullif(nxt.name_en,''),case when nxt.episode_number is not null then 'Episódio '||nxt.episode_number::text end) next_episode_title,
    nxt.vote_average next_episode_rating,nxt.air_date next_episode_air_date
  from canonical c
  join flags f on f.logical_key=c.logical_key
  left join watched w on w.logical_key=c.logical_key
  left join catalog cat on cat.logical_key=c.logical_key
  left join lateral (
    select e.season_number,e.episode_number,e.name_local,e.name_en,e.vote_average,e.air_date
    from public.episode_catalog_v336 e
    where c.tmdb_id>0 and e.show_tmdb_id=c.tmdb_id
      and e.season_number>0 and e.episode_number>0
      and (e.air_date is null or e.air_date<=coalesce(p_today,current_date))
      and not exists(select 1 from watched_keys wk where wk.logical_key=c.logical_key and wk.season_number=e.season_number and wk.episode_number=e.episode_number)
    order by e.season_number,e.episode_number limit 1
  ) nxt on true
), bucketed as materialized (
  select x.*,
    case
      when x.watched_episodes=0 and x.is_watchlist then 'not_started'
      when x.watched_episodes>0 and x.next_episode_number is not null then
        case when x.last_watched_at is null or x.last_watched_at>=now()-interval '30 days' then 'continue' else 'dust' end
      when x.watched_episodes>0 and x.is_in_progress then
        case when x.last_watched_at is null or x.last_watched_at>=now()-interval '30 days' then 'continue' else 'dust' end
      when x.watched_episodes>0 then 'up_to_date'
      when x.is_up_to_date then 'up_to_date'
      else 'not_started'
    end home_bucket
  from calc x
)
select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',media_id,'media_type','tv','tmdb_id',tmdb_id,'title',title,'poster_path',poster_path,'release_year',release_year,
  'source_state',case when is_in_progress then 'InProgress' when is_up_to_date then 'UpToDate' when is_watchlist then 'WatchLater' else null end,
  'state_updated_at',state_updated_at,'watched_episodes',watched_episodes,'released_episodes',released_episodes,
  'total_episodes',greatest(total_episodes,released_episodes,watched_episodes),'available_episodes',greatest(0,released_episodes-watched_episodes),
  'last_watched_at',last_watched_at,'last_season_number',last_season_number,'last_episode_number',last_episode_number,
  'latest_released_season_number',case when coalesce(latest_key,0)>0 then (latest_key/100000)::int end,
  'latest_released_episode_number',case when coalesce(latest_key,0)>0 then (latest_key%100000)::int end,
  'next_season_number',next_season_number,'next_episode_number',next_episode_number,'next_episode_title',next_episode_title,
  'next_episode_rating',next_episode_rating,'next_episode_air_date',next_episode_air_date,'home_bucket',home_bucket,'__ct383_first_paint',true
)) order by case home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 else 9 end,
 state_updated_at desc nulls last,media_id desc),'[]'::jsonb)
from bucketed;
$$;
revoke all on function public.cinetracker_home_series_v383(date) from public,anon;
grant execute on function public.cinetracker_home_series_v383(date) to authenticated;
grant execute on function public.cinetracker_home_series_v383(date) to service_role;
notify pgrst,'reload schema';
