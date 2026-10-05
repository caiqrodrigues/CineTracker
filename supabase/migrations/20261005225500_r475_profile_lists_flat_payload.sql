-- CineTracker Web r475 — flatten the lightweight Profile list payload for the existing summary mapper.

create or replace function public.cinetracker_profile_lists_v475()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with states as materialized (
  select
    mo.media_id,
    bool_or(mo.state='Liked') as is_favorite,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) as is_watchlist,
    bool_or(mo.state='Completed') as is_completed,
    bool_or(mo.state='InProgress') as is_in_progress,
    bool_or(mo.state='UpToDate') as is_up_to_date,
    bool_or(mo.state='AlreadySeen') as is_already_seen,
    max(mo.watched_at) as last_override_watch,
    max(coalesce(mo.updated_at,mo.created_at)) as state_updated_at
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
  group by mo.media_id
), episode_keys as materialized (
  select distinct wh.media_id,wh.season_number,wh.episode_number,wh.watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid()
    and wh.item_type='episode'
    and wh.media_id is not null
    and coalesce(wh.season_number,0)>0
    and coalesce(wh.episode_number,0)>0
  union
  select distinct ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at)
  from public.episode_progress ep
  where ep.profile_id=auth.uid()
    and ep.watched=true
    and coalesce(ep.season_number,0)>0
    and coalesce(ep.episode_number,0)>0
), episodes as materialized (
  select media_id,count(distinct (season_number,episode_number))::bigint as watched_episodes,max(watched_at) as last_episode_watch
  from episode_keys
  group by media_id
), movie_history as materialized (
  select wh.media_id,max(wh.watched_at) as last_movie_watch
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.item_type='movie' and wh.media_id is not null
  group by wh.media_id
), ids as materialized (
  select media_id from states
  union select media_id from episodes
  union select media_id from movie_history
), base as materialized (
  select
    m.id as media_id,
    m.media_type,
    m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer as tmdb_id,
    m.title,
    m.poster_path,
    m.release_year,
    coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    coalesce(m.total_episodes,0)::integer as total_episodes,
    coalesce(e.watched_episodes,0)::bigint as watched_episodes,
    greatest(e.last_episode_watch,mh.last_movie_watch,s.last_override_watch) as last_watched_at,
    coalesce(s.is_favorite,false) as is_favorite,
    coalesce(s.is_watchlist,false) as is_watchlist,
    coalesce(s.is_in_progress,false) as is_in_progress,
    coalesce(s.is_up_to_date,false) as is_up_to_date,
    coalesce(s.is_completed,false) as is_completed,
    case when m.media_type='movie'
      then (mh.media_id is not null or coalesce(s.is_already_seen,false))
      else coalesce(e.watched_episodes,0)>0
    end as is_seen,
    s.state_updated_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end as vote_average,
    nullif(m.raw_tmdb->>'release_date','') as release_date,
    nullif(m.raw_tmdb->>'first_air_date','') as first_air_date
  from ids i
  join public.media m on m.id=i.media_id
  left join states s on s.media_id=m.id
  left join episodes e on e.media_id=m.id
  left join movie_history mh on mh.media_id=m.id
), relevant as (
  select * from base
  where
    (media_type='tv' and (is_completed or is_in_progress or is_up_to_date or watched_episodes>0))
    or (media_type='movie' and is_seen)
    or is_favorite
)
select coalesce(
  jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.state_updated_at desc nulls last,x.media_id desc),
  '[]'::jsonb
)
from relevant x;
$$;

revoke all on function public.cinetracker_profile_lists_v475() from public,anon;
grant execute on function public.cinetracker_profile_lists_v475() to authenticated;
notify pgrst,'reload schema';
