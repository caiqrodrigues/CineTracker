drop function if exists public.cinetracker_profile_media_dashboard_v0991();

create function public.cinetracker_profile_media_dashboard_v0991()
returns table (
  media_id bigint,
  media_type text,
  media_kind text,
  tmdb_id integer,
  title text,
  poster_path text,
  release_year integer,
  runtime_minutes integer,
  total_episodes integer,
  watched_episodes bigint,
  last_watched_at timestamptz,
  plays bigint,
  raw_tmdb jsonb,
  is_favorite boolean,
  is_added_to_watchlist boolean,
  is_watch_later boolean,
  is_watchlist boolean,
  is_in_progress boolean,
  is_up_to_date boolean,
  is_completed boolean,
  is_not_started boolean,
  is_seen boolean
)
language sql
stable
security invoker
set search_path = public
as $$
  with user_media as (
    select wh.media_id from public.watch_history wh where wh.profile_id = auth.uid() and wh.media_id is not null
    union
    select ep.media_id from public.episode_progress ep where ep.profile_id = auth.uid()
    union
    select mo.media_id from public.media_overrides mo where mo.profile_id = auth.uid()
  ), history as (
    select
      wh.media_id,
      max(wh.watched_at) as last_watched_at,
      sum(greatest(coalesce(nullif(wh.external_ids->>'plays','')::integer, 1), 1))::bigint as plays,
      count(distinct (wh.season_number, wh.episode_number)) filter (
        where wh.item_type = 'episode' and wh.season_number is not null and wh.episode_number is not null
      )::bigint as watched_episodes,
      bool_or(wh.item_type = 'movie') as has_movie_history,
      bool_or(wh.item_type = 'episode') as has_episode_history
    from public.watch_history wh
    where wh.profile_id = auth.uid()
    group by wh.media_id
  ), progress as (
    select
      ep.media_id,
      count(*) filter (where ep.watched)::bigint as watched_episodes,
      max(ep.watched_at) filter (where ep.watched) as last_watched_at
    from public.episode_progress ep
    where ep.profile_id = auth.uid()
    group by ep.media_id
  ), states as (
    select
      mo.media_id,
      bool_or(mo.state = 'Liked') as is_favorite,
      bool_or(mo.state = 'AddedToWatchlist') as is_added_to_watchlist,
      bool_or(mo.state = 'WatchLater') as is_watch_later,
      bool_or(mo.state = 'InProgress') as is_in_progress,
      bool_or(mo.state = 'UpToDate') as is_up_to_date,
      bool_or(mo.state = 'Completed') as is_completed,
      bool_or(mo.state = 'AlreadySeen') as is_already_seen,
      max(mo.watched_at) filter (where mo.state = 'AlreadySeen') as last_override_watch
    from public.media_overrides mo
    where mo.profile_id = auth.uid()
    group by mo.media_id
  ), joined as (
    select
      m.id as media_id,
      m.media_type,
      m.media_kind,
      m.tmdb_id,
      m.title,
      m.poster_path,
      m.release_year,
      coalesce(m.runtime_minutes, 0)::integer as runtime_minutes,
      coalesce(m.total_episodes, 0)::integer as total_episodes,
      greatest(coalesce(h.watched_episodes,0), coalesce(p.watched_episodes,0))::bigint as watched_episodes,
      greatest(h.last_watched_at, p.last_watched_at, s.last_override_watch) as last_watched_at,
      coalesce(h.plays,0)::bigint as plays,
      coalesce(m.raw_tmdb, '{}'::jsonb) as raw_tmdb,
      coalesce(s.is_favorite,false) as is_favorite,
      coalesce(s.is_added_to_watchlist,false) as is_added_to_watchlist,
      coalesce(s.is_watch_later,false) as is_watch_later,
      coalesce(s.is_in_progress,false) as is_in_progress,
      coalesce(s.is_up_to_date,false) as is_up_to_date,
      coalesce(s.is_completed,false) as is_completed,
      coalesce(s.is_already_seen,false) as is_already_seen,
      coalesce(h.has_movie_history,false) as has_movie_history,
      coalesce(h.has_episode_history,false) as has_episode_history
    from user_media u
    join public.media m on m.id = u.media_id
    left join history h on h.media_id = m.id
    left join progress p on p.media_id = m.id
    left join states s on s.media_id = m.id
  )
  select
    j.media_id,
    j.media_type,
    j.media_kind,
    j.tmdb_id,
    j.title,
    j.poster_path,
    j.release_year,
    j.runtime_minutes,
    j.total_episodes,
    j.watched_episodes,
    j.last_watched_at,
    j.plays,
    j.raw_tmdb,
    j.is_favorite,
    j.is_added_to_watchlist,
    j.is_watch_later,
    (j.is_added_to_watchlist or j.is_watch_later) as is_watchlist,
    j.is_in_progress,
    j.is_up_to_date,
    j.is_completed,
    (
      j.media_type = 'tv'
      and j.watched_episodes = 0
      and not j.has_episode_history
      and (j.is_added_to_watchlist or j.is_watch_later)
      and not (j.is_in_progress or j.is_up_to_date or j.is_completed)
    ) as is_not_started,
    case
      when j.media_type = 'movie' then (j.has_movie_history or j.is_already_seen)
      else (j.has_episode_history or j.watched_episodes > 0)
    end as is_seen
  from joined j
  order by j.last_watched_at desc nulls last, j.media_id desc;
$$;

grant execute on function public.cinetracker_profile_media_dashboard_v0991() to authenticated;
