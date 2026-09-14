-- Web r274: keep Home under the authenticated statement timeout by bounding the
-- hot-path working set and covering the recent-history access pattern.

create index if not exists idx_watch_history_profile_episode_recent_r274
  on public.watch_history(profile_id, watched_at desc, id desc)
  include (media_id, season_number, episode_number, title, external_ids)
  where item_type='episode';

create index if not exists idx_watch_history_profile_movie_recent_r274
  on public.watch_history(profile_id, watched_at desc, id desc)
  include (media_id, title, external_ids)
  where item_type='movie';

create index if not exists idx_media_overrides_profile_state_updated_r274
  on public.media_overrides(profile_id, state, updated_at desc, media_id);

create or replace function public.cinetracker_profile_home_payload_v0997_r6(
  p_today date,
  p_history_limit integer default 20,
  p_series_limit integer default 120,
  p_movie_limit integer default 120
) returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with params as materialized (
  select auth.uid() as profile_id,
    least(greatest(coalesce(p_history_limit,20),1),50) as history_limit,
    least(greatest(coalesce(p_series_limit,120),20),200) as series_limit,
    least(greatest(coalesce(p_movie_limit,120),20),200) as movie_limit
),
series_seed as materialized (
  (select mo.media_id,0 as priority,coalesce(mo.updated_at,mo.watched_at,now()) as touched_at
   from public.media_overrides mo join public.media m on m.id=mo.media_id cross join params p
   where mo.profile_id=p.profile_id and m.media_type='tv' and mo.state='InProgress'
   order by mo.updated_at desc nulls last,mo.id desc limit 80)
  union all
  (select wh.media_id,1,wh.watched_at
   from public.watch_history wh join public.media m on m.id=wh.media_id cross join params p
   where wh.profile_id=p.profile_id and wh.item_type='episode' and m.media_type='tv'
   order by wh.watched_at desc,wh.id desc limit 120)
  union all
  (select mo.media_id,2,coalesce(mo.updated_at,mo.watched_at,now())
   from public.media_overrides mo join public.media m on m.id=mo.media_id cross join params p
   where mo.profile_id=p.profile_id and m.media_type='tv' and mo.state='UpToDate'
   order by mo.updated_at desc nulls last,mo.id desc limit 100)
  union all
  (select mo.media_id,3,coalesce(mo.updated_at,mo.watched_at,now())
   from public.media_overrides mo join public.media m on m.id=mo.media_id cross join params p
   where mo.profile_id=p.profile_id and m.media_type='tv' and mo.state in ('AddedToWatchlist','WatchLater')
   order by mo.updated_at desc nulls last,mo.id desc limit 160)
  union all
  (select mo.media_id,4,coalesce(mo.updated_at,mo.watched_at,now())
   from public.media_overrides mo join public.media m on m.id=mo.media_id cross join params p
   where mo.profile_id=p.profile_id and m.media_type='tv' and mo.state='Completed'
   order by mo.updated_at desc nulls last,mo.id desc limit 100)
),
series_ids as materialized (
  select media_id,min(priority) as priority,max(touched_at) as touched_at
  from series_seed group by media_id
  order by min(priority),max(touched_at) desc nulls last,media_id desc
  limit (select series_limit from params)
),
series_states as materialized (
  select si.media_id,
    bool_or(mo.state='AddedToWatchlist') as is_added_to_watchlist,
    bool_or(mo.state='WatchLater') as is_watch_later,
    bool_or(mo.state='InProgress') as is_in_progress,
    bool_or(mo.state='UpToDate') as is_up_to_date,
    bool_or(mo.state='Completed') as is_completed,
    bool_or(mo.state='AlreadySeen') as is_already_seen,
    max(mo.watched_at) filter(where mo.state='AlreadySeen') as last_override_watch
  from series_ids si cross join params p
  left join public.media_overrides mo on mo.profile_id=p.profile_id and mo.media_id=si.media_id
  group by si.media_id
),
watched_keys as materialized (
  select ep.media_id,ep.season_number,ep.episode_number
  from public.episode_progress ep join series_ids si on si.media_id=ep.media_id cross join params p
  where ep.profile_id=p.profile_id and ep.watched=true and ep.season_number>0 and ep.episode_number>0
  union
  select wh.media_id,wh.season_number,wh.episode_number
  from public.watch_history wh join series_ids si on si.media_id=wh.media_id cross join params p
  where wh.profile_id=p.profile_id and wh.item_type='episode' and wh.season_number>0 and wh.episode_number>0
),
watched_count as (
  select media_id,count(*)::bigint as watched_episodes from watched_keys group by media_id
),
watched_last as (
  select distinct on(media_id) media_id,season_number,episode_number
  from watched_keys order by media_id,season_number desc,episode_number desc
),
watch_times as (
  select q.media_id,max(q.watched_at) as last_watched_at from (
    select ep.media_id,ep.watched_at from public.episode_progress ep join series_ids si on si.media_id=ep.media_id cross join params p
      where ep.profile_id=p.profile_id and ep.watched=true
    union all
    select wh.media_id,wh.watched_at from public.watch_history wh join series_ids si on si.media_id=wh.media_id cross join params p
      where wh.profile_id=p.profile_id and wh.item_type='episode'
  ) q group by q.media_id
),
series_base as materialized (
  select m.id as media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,m.media_type,m.media_kind,
    m.title,m.poster_path,m.release_year,coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    coalesce(m.total_episodes,0)::integer as total_episodes,coalesce(m.raw_tmdb,'{}'::jsonb) as raw_tmdb,
    coalesce(wc.watched_episodes,0)::bigint as watched_episodes,wt.last_watched_at,
    coalesce(ss.is_added_to_watchlist,false) as is_added_to_watchlist,coalesce(ss.is_watch_later,false) as is_watch_later,
    coalesce(ss.is_in_progress,false) as is_in_progress,coalesce(ss.is_up_to_date,false) as is_up_to_date,
    coalesce(ss.is_completed,false) as is_completed,coalesce(ss.is_already_seen,false) as is_already_seen,
    wl.season_number as last_season_number,wl.episode_number as last_episode_number,
    lr.season_number as latest_released_season_number,lr.episode_number as latest_released_episode_number,
    public.cinetracker_released_episodes_v0997(m.raw_tmdb,m.total_episodes,coalesce(wc.watched_episodes,0),p_today) as released_episodes,
    (public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0 and (
      coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)>0 or
      coalesce(nullif(m.raw_tmdb->'next_episode_to_air'->>'season_number','')::int,0)>0 or coalesce(m.total_episodes,0)>0)) as metadata_ready
  from series_ids si join public.media m on m.id=si.media_id
  left join series_states ss on ss.media_id=si.media_id
  left join watched_count wc on wc.media_id=si.media_id
  left join watched_last wl on wl.media_id=si.media_id
  left join watch_times wt on wt.media_id=si.media_id
  left join lateral public.cinetracker_latest_released_episode_v0997(m.raw_tmdb,p_today) lr on true
),
series_eval as materialized (
  select b.*,greatest(0,coalesce(b.released_episodes,0)-coalesce(b.watched_episodes,0)) as history_missing_episodes,
    case
      when coalesce(b.watched_episodes,0)<=0 then false
      when coalesce(b.latest_released_season_number,0)>0 and coalesce(b.last_season_number,0)>0 then
        b.last_season_number>b.latest_released_season_number or (b.last_season_number=b.latest_released_season_number and coalesce(b.last_episode_number,0)>=coalesce(b.latest_released_episode_number,0))
      when b.metadata_ready then coalesce(b.released_episodes,0)<=coalesce(b.watched_episodes,0)
      else coalesce(b.is_up_to_date,false)
    end as is_caught_up
  from series_base b
),
series_rows as materialized (
  select e.*,
    case
      when e.is_completed then 'completed'
      when coalesce(e.watched_episodes,0)=0 and (e.is_added_to_watchlist or e.is_watch_later) then 'not_started'
      when coalesce(e.watched_episodes,0)>0 and e.is_caught_up then case when lower(coalesce(e.raw_tmdb->>'status','')) in ('ended','canceled','cancelled') then 'completed' else 'up_to_date' end
      when coalesce(e.watched_episodes,0)>0 and e.metadata_ready and not e.is_caught_up and (coalesce(e.is_up_to_date,false) or e.last_watched_at>=now()-interval '30 days') then 'continue'
      when coalesce(e.watched_episodes,0)>0 and e.metadata_ready and not e.is_caught_up then 'dust'
      when coalesce(e.watched_episodes,0)>0 and not e.metadata_ready and coalesce(e.is_up_to_date,false) then 'up_to_date'
      when coalesce(e.watched_episodes,0)>0 and not e.metadata_ready and coalesce(e.is_in_progress,false) and e.last_watched_at>=now()-interval '30 days' then 'continue'
      when coalesce(e.watched_episodes,0)>0 and not e.metadata_ready and coalesce(e.is_in_progress,false) then 'dust'
      else null end as home_bucket,
    case when e.is_caught_up then 0 else greatest(1,greatest(0,coalesce(e.released_episodes,0)-coalesce(e.watched_episodes,0))) end as available_episodes,
    case when e.is_caught_up then null
      when coalesce(e.last_season_number,0)>0 and e.latest_released_season_number=e.last_season_number then e.last_season_number
      when coalesce(e.last_season_number,0)>0 and coalesce(e.latest_released_season_number,0)>e.last_season_number then e.last_season_number+1
      else nullif(e.latest_released_season_number,0) end as next_season_number,
    case when e.is_caught_up then null
      when coalesce(e.last_season_number,0)>0 and e.latest_released_season_number=e.last_season_number then coalesce(e.last_episode_number,0)+1
      when coalesce(e.last_season_number,0)>0 and coalesce(e.latest_released_season_number,0)>e.last_season_number then 1
      else 1 end as next_episode_number
  from series_eval e
),
movie_seed as materialized (
  select mo.media_id,max(mo.updated_at) as touched_at
  from public.media_overrides mo join public.media m on m.id=mo.media_id cross join params p
  where mo.profile_id=p.profile_id and m.media_type='movie' and mo.state in ('AddedToWatchlist','WatchLater')
    and not exists(select 1 from public.media_overrides seen where seen.profile_id=p.profile_id and seen.media_id=mo.media_id and seen.state in ('AlreadySeen','Completed'))
  group by mo.media_id
  order by max(mo.updated_at) desc nulls last,mo.media_id desc
  limit (select movie_limit from params)
),
movie_watch as (
  select m.id as media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,m.title,m.poster_path,m.release_year,
    coalesce(m.runtime_minutes,0)::integer as runtime_minutes,coalesce(m.genres,'[]'::jsonb) as genres,
    nullif(m.raw_tmdb->>'vote_average','')::numeric as vote_average,
    nullif(m.raw_tmdb->>'release_date','') as release_date
  from movie_seed s join public.media m on m.id=s.media_id
),
history_ep_latest as materialized (
  select wh.id,wh.media_id,wh.title,wh.watched_at,wh.season_number,wh.episode_number,wh.external_ids
  from public.watch_history wh cross join params p
  where wh.profile_id=p.profile_id and wh.item_type='episode'
  order by wh.watched_at desc,wh.id desc limit (select history_limit from params)
),
history_ep as (
  select wh.id,wh.media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,m.title as media_title,m.poster_path,
    case when nullif(wh.title,'') is not null and lower(wh.title)<>lower(m.title) then wh.title else null end as episode_title,
    wh.watched_at,wh.season_number,wh.episode_number,coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end as plays,
    case when coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)=wh.season_number and coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)=wh.episode_number then m.raw_tmdb->'last_episode_to_air'->>'name' end as cached_episode_title,
    case when coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)=wh.season_number and coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)=wh.episode_number then nullif(m.raw_tmdb->'last_episode_to_air'->>'vote_average','')::numeric end as episode_rating,
    case when coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)=wh.season_number and coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)=wh.episode_number then nullif(m.raw_tmdb->'last_episode_to_air'->>'air_date','') end as episode_air_date
  from history_ep_latest wh left join public.media m on m.id=wh.media_id
),
history_mv_latest as materialized (
  select wh.id,wh.media_id,wh.title,wh.watched_at,wh.external_ids
  from public.watch_history wh cross join params p
  where wh.profile_id=p.profile_id and wh.item_type='movie'
  order by wh.watched_at desc,wh.id desc limit (select history_limit from params)
),
history_mv as (
  select wh.id,wh.media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,m.title as media_title,m.poster_path,wh.title,wh.watched_at,
    m.release_year,coalesce(m.runtime_minutes,0)::integer as runtime_minutes,coalesce(m.genres,'[]'::jsonb) as genres,
    nullif(m.raw_tmdb->>'vote_average','')::numeric as vote_average,nullif(m.raw_tmdb->>'release_date','') as release_date,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end as plays
  from history_mv_latest wh left join public.media m on m.id=wh.media_id
),
seen_movies as (
  select distinct public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id
  from public.media_overrides mo join public.media m on m.id=mo.media_id cross join params p
  where mo.profile_id=p.profile_id and m.media_type='movie' and mo.state in ('AlreadySeen','Completed') and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
  limit 2000
)
select jsonb_build_object(
  'series',coalesce((select jsonb_agg(jsonb_build_object(
    'media_id',s.media_id,'tmdb_id',s.tmdb_id,'media_type','tv','media_kind',s.media_kind,'title',s.title,'poster_path',s.poster_path,
    'release_year',s.release_year,'runtime_minutes',s.runtime_minutes,'total_episodes',s.total_episodes,'released_episodes',s.released_episodes,
    'watched_episodes',s.watched_episodes,'history_missing_episodes',s.history_missing_episodes,'available_episodes',s.available_episodes,'is_caught_up',s.is_caught_up,
    'last_watched_at',s.last_watched_at,'last_season_number',s.last_season_number,'last_episode_number',s.last_episode_number,
    'latest_released_season_number',s.latest_released_season_number,'latest_released_episode_number',s.latest_released_episode_number,
    'next_season_number',s.next_season_number,'next_episode_number',s.next_episode_number,
    'next_episode_title',case when coalesce(nullif(s.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)=s.next_season_number and coalesce(nullif(s.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)=s.next_episode_number then s.raw_tmdb->'last_episode_to_air'->>'name' end,
    'next_episode_rating',case when coalesce(nullif(s.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)=s.next_season_number and coalesce(nullif(s.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)=s.next_episode_number then nullif(s.raw_tmdb->'last_episode_to_air'->>'vote_average','')::numeric end,
    'next_episode_air_date',case when coalesce(nullif(s.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)=s.next_season_number and coalesce(nullif(s.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)=s.next_episode_number then nullif(s.raw_tmdb->'last_episode_to_air'->>'air_date','') end,
    'home_bucket',s.home_bucket
  ) order by case s.home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 when 'completed' then 5 else 9 end,s.last_watched_at desc nulls last,s.media_id desc)
    from series_rows s where s.home_bucket is not null),'[]'::jsonb),
  'movie_watchlist',coalesce((select jsonb_agg(to_jsonb(m) order by m.release_year desc nulls last,m.media_id desc) from movie_watch m),'[]'::jsonb),
  'seen_movie_tmdb_ids',coalesce((select jsonb_agg(tmdb_id) from seen_movies),'[]'::jsonb),
  'history_episodes',coalesce((select jsonb_agg(to_jsonb(h) order by h.watched_at asc,h.id asc) from history_ep h),'[]'::jsonb),
  'history_movies',coalesce((select jsonb_agg(to_jsonb(h) order by h.watched_at asc,h.id asc) from history_mv h),'[]'::jsonb),
  'limits',jsonb_build_object('history',(select history_limit from params),'series',(select series_limit from params),'movies',(select movie_limit from params))
);
$$;

revoke all on function public.cinetracker_profile_home_payload_v0997_r6(date,integer,integer,integer) from public;
grant execute on function public.cinetracker_profile_home_payload_v0997_r6(date,integer,integer,integer) to authenticated,service_role;
