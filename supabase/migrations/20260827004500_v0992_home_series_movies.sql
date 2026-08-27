create table if not exists public.daily_movie_recommendations_v0992 (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  recommendation_date date not null,
  tmdb_id integer not null,
  title text,
  poster_path text,
  raw_tmdb jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (profile_id, recommendation_date),
  unique (profile_id, tmdb_id)
);
alter table public.daily_movie_recommendations_v0992 enable row level security;
drop policy if exists daily_movie_recommendations_v0992_select on public.daily_movie_recommendations_v0992;
create policy daily_movie_recommendations_v0992_select on public.daily_movie_recommendations_v0992 for select to authenticated using (profile_id = auth.uid());
drop policy if exists daily_movie_recommendations_v0992_insert on public.daily_movie_recommendations_v0992;
create policy daily_movie_recommendations_v0992_insert on public.daily_movie_recommendations_v0992 for insert to authenticated with check (profile_id = auth.uid());

drop function if exists public.cinetracker_profile_home_dashboard_v0992();
create function public.cinetracker_profile_home_dashboard_v0992()
returns table (
  media_id bigint, media_type text, media_kind text, tmdb_id integer, title text, poster_path text,
  release_year integer, runtime_minutes integer, total_episodes integer, watched_episodes bigint,
  last_watched_at timestamptz, last_season_number integer, last_episode_number integer,
  plays bigint, raw_tmdb jsonb, state_updated_at timestamptz,
  is_favorite boolean, is_watchlist boolean, is_in_progress boolean, is_up_to_date boolean,
  is_completed boolean, is_not_started boolean, is_seen boolean
)
language sql stable security invoker set search_path=public as $$
with user_media as (
  select wh.media_id from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id is not null
  union select ep.media_id from public.episode_progress ep where ep.profile_id=auth.uid()
  union select mo.media_id from public.media_overrides mo where mo.profile_id=auth.uid()
), hist as (
  select wh.media_id,
    max(wh.watched_at) last_watched_at,
    sum(greatest(coalesce(nullif(wh.external_ids->>'plays','')::integer,1),1))::bigint plays,
    count(distinct (wh.season_number,wh.episode_number)) filter(where wh.item_type='episode' and wh.season_number is not null and wh.episode_number is not null)::bigint watched_episodes,
    bool_or(wh.item_type='movie') has_movie_history,
    bool_or(wh.item_type='episode') has_episode_history
  from public.watch_history wh where wh.profile_id=auth.uid() group by wh.media_id
), last_ep as (
  select distinct on (wh.media_id) wh.media_id, wh.season_number, wh.episode_number
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.media_id is not null
  order by wh.media_id, wh.watched_at desc, wh.id desc
), prog as (
  select ep.media_id,count(*) filter(where ep.watched)::bigint watched_episodes,max(ep.watched_at) filter(where ep.watched) last_watched_at
  from public.episode_progress ep where ep.profile_id=auth.uid() group by ep.media_id
), states as (
  select mo.media_id,
    bool_or(mo.state='Liked') is_favorite,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,
    bool_or(mo.state='InProgress') is_in_progress,
    bool_or(mo.state='UpToDate') is_up_to_date,
    bool_or(mo.state='Completed') is_completed,
    bool_or(mo.state='AlreadySeen') is_already_seen,
    max(mo.watched_at) filter(where mo.state='AlreadySeen') last_override_watch,
    max(mo.updated_at) state_updated_at
  from public.media_overrides mo where mo.profile_id=auth.uid() group by mo.media_id
), joined as (
  select m.id media_id,m.media_type,m.media_kind,m.tmdb_id,m.title,m.poster_path,m.release_year,
    coalesce(m.runtime_minutes,0)::integer runtime_minutes,coalesce(m.total_episodes,0)::integer total_episodes,
    greatest(coalesce(h.watched_episodes,0),coalesce(p.watched_episodes,0))::bigint watched_episodes,
    greatest(h.last_watched_at,p.last_watched_at,s.last_override_watch) last_watched_at,
    le.season_number last_season_number,le.episode_number last_episode_number,
    coalesce(h.plays,0)::bigint plays,coalesce(m.raw_tmdb,'{}'::jsonb) raw_tmdb,s.state_updated_at,
    coalesce(s.is_favorite,false) is_favorite,coalesce(s.is_watchlist,false) is_watchlist,
    coalesce(s.is_in_progress,false) is_in_progress,coalesce(s.is_up_to_date,false) is_up_to_date,
    coalesce(s.is_completed,false) is_completed,coalesce(s.is_already_seen,false) is_already_seen,
    coalesce(h.has_movie_history,false) has_movie_history,coalesce(h.has_episode_history,false) has_episode_history
  from user_media u join public.media m on m.id=u.media_id
  left join hist h on h.media_id=m.id left join prog p on p.media_id=m.id left join states s on s.media_id=m.id left join last_ep le on le.media_id=m.id
)
select j.media_id,j.media_type,j.media_kind,j.tmdb_id,j.title,j.poster_path,j.release_year,j.runtime_minutes,j.total_episodes,
  j.watched_episodes,j.last_watched_at,j.last_season_number,j.last_episode_number,j.plays,j.raw_tmdb,j.state_updated_at,
  j.is_favorite,j.is_watchlist,j.is_in_progress,j.is_up_to_date,j.is_completed,
  (j.media_type='tv' and j.watched_episodes=0 and not j.has_episode_history and j.is_watchlist and not(j.is_in_progress or j.is_up_to_date or j.is_completed)) is_not_started,
  case when j.media_type='movie' then (j.has_movie_history or j.is_already_seen) else (j.has_episode_history or j.watched_episodes>0) end is_seen
from joined j order by j.last_watched_at desc nulls last,j.media_id desc;
$$;
grant execute on function public.cinetracker_profile_home_dashboard_v0992() to authenticated;
