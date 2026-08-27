create or replace function public.cinetracker_profile_media_dashboard_v0991()
returns table(
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
set search_path to 'public'
as $function$
with user_ids as (
  select wh.media_id from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id is not null
  union
  select ep.media_id from public.episode_progress ep where ep.profile_id=auth.uid() and ep.media_id is not null
  union
  select mo.media_id from public.media_overrides mo where mo.profile_id=auth.uid() and mo.media_id is not null
), seed as (
  select m.*,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as effective_tmdb_id,
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end as logical_key
  from public.media m join user_ids u on u.media_id=m.id
), keys as (
  select distinct logical_key from seed
), members as (
  select m.*,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as effective_tmdb_id,
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end as logical_key
  from public.media m
  join keys k on k.logical_key=(case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end)
), best as (
  select distinct on (logical_key)
    logical_key,id as media_id,media_type,media_kind,effective_tmdb_id as tmdb_id,title,poster_path,release_year,
    coalesce(runtime_minutes,0)::integer as runtime_minutes,coalesce(total_episodes,0)::integer as total_episodes,
    coalesce(raw_tmdb,'{}'::jsonb) as raw_tmdb
  from members
  order by logical_key,
    (tmdb_id>0 and tmdb_id=effective_tmdb_id) desc,
    (coalesce(raw_tmdb,'{}'::jsonb) <> '{}'::jsonb) desc,
    (poster_path is not null) desc,
    (coalesce(runtime_minutes,0)>0) desc,
    coalesce(total_episodes,0) desc,
    id desc
), watched_keys as (
  select distinct mem.logical_key,wh.season_number,wh.episode_number
  from public.watch_history wh join members mem on mem.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode'
    and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union
  select distinct mem.logical_key,ep.season_number,ep.episode_number
  from public.episode_progress ep join members mem on mem.id=ep.media_id
  where ep.profile_id=auth.uid() and ep.watched=true
    and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), watched as (
  select logical_key,count(*)::bigint as watched_episodes from watched_keys group by logical_key
), history as (
  select mem.logical_key,
    max(wh.watched_at) as last_watched_at,
    sum(greatest(case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then (wh.external_ids->>'plays')::int else 1 end,1))::bigint as plays,
    bool_or(wh.item_type='movie') as has_movie_history,
    bool_or(wh.item_type='episode') as has_episode_history
  from public.watch_history wh join members mem on mem.id=wh.media_id
  where wh.profile_id=auth.uid()
  group by mem.logical_key
), progress as (
  select mem.logical_key,max(ep.watched_at) filter(where ep.watched) as last_watched_at
  from public.episode_progress ep join members mem on mem.id=ep.media_id
  where ep.profile_id=auth.uid()
  group by mem.logical_key
), states as (
  select mem.logical_key,
    bool_or(mo.state='Liked') as is_favorite,
    bool_or(mo.state='AddedToWatchlist') as is_added_to_watchlist,
    bool_or(mo.state='WatchLater') as is_watch_later,
    bool_or(mo.state='InProgress') as is_in_progress,
    bool_or(mo.state='UpToDate') as is_up_to_date,
    bool_or(mo.state='Completed') as is_completed,
    bool_or(mo.state='AlreadySeen') as is_already_seen,
    max(mo.watched_at) filter(where mo.state='AlreadySeen') as last_override_watch
  from public.media_overrides mo join members mem on mem.id=mo.media_id
  where mo.profile_id=auth.uid()
  group by mem.logical_key
), joined as (
  select b.*,
    coalesce(w.watched_episodes,0)::bigint as watched_episodes,
    greatest(h.last_watched_at,p.last_watched_at,s.last_override_watch) as last_watched_at,
    coalesce(h.plays,0)::bigint as plays,
    coalesce(s.is_favorite,false) as is_favorite,
    coalesce(s.is_added_to_watchlist,false) as is_added_to_watchlist,
    coalesce(s.is_watch_later,false) as is_watch_later,
    coalesce(s.is_in_progress,false) as is_in_progress,
    coalesce(s.is_up_to_date,false) as is_up_to_date,
    coalesce(s.is_completed,false) as is_completed,
    coalesce(s.is_already_seen,false) as is_already_seen,
    coalesce(h.has_movie_history,false) as has_movie_history,
    coalesce(h.has_episode_history,false) as has_episode_history
  from best b
  left join watched w using(logical_key)
  left join history h using(logical_key)
  left join progress p using(logical_key)
  left join states s using(logical_key)
)
select
  j.media_id,j.media_type,j.media_kind,j.tmdb_id,j.title,j.poster_path,j.release_year,j.runtime_minutes,j.total_episodes,
  j.watched_episodes,j.last_watched_at,j.plays,j.raw_tmdb,j.is_favorite,j.is_added_to_watchlist,j.is_watch_later,
  (j.is_added_to_watchlist or j.is_watch_later) as is_watchlist,
  j.is_in_progress,j.is_up_to_date,j.is_completed,
  (j.media_type='tv' and j.watched_episodes=0 and not j.has_episode_history
    and (j.is_added_to_watchlist or j.is_watch_later)
    and not (j.is_in_progress or j.is_up_to_date or j.is_completed)) as is_not_started,
  case when j.media_type='movie' then (j.has_movie_history or j.is_already_seen)
       else (j.has_episode_history or j.watched_episodes>0) end as is_seen
from joined j
order by j.last_watched_at desc nulls last,j.media_id desc;
$function$;

create or replace function public.cinetracker_profile_home_payload_v0994()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with d as (
  select * from public.cinetracker_profile_media_dashboard_v0991()
), watched_keys as (
  select distinct
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end as logical_key,
    wh.season_number,wh.episode_number
  from public.watch_history wh join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode'
    and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union
  select distinct
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end,
    ep.season_number,ep.episode_number
  from public.episode_progress ep join public.media m on m.id=ep.media_id
  where ep.profile_id=auth.uid() and ep.watched=true
    and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), watched_last as (
  select distinct on (logical_key) logical_key,season_number,episode_number
  from watched_keys
  order by logical_key,season_number desc,episode_number desc
), base as (
  select d.*,
    wl.season_number as last_season_number,wl.episode_number as last_episode_number,
    greatest(
      d.watched_episodes::int,
      case
        when d.media_type<>'tv' then 0
        when coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)>0 then
          coalesce((select sum(case
            when coalesce(nullif(season->>'season_number','')::int,0) < coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)
              then greatest(coalesce(nullif(season->>'episode_count','')::int,0),0)
            when coalesce(nullif(season->>'season_number','')::int,0) = coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)
              then greatest(coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0),0)
            else 0 end)
          from jsonb_array_elements(case when jsonb_typeof(d.raw_tmdb->'seasons')='array' then d.raw_tmdb->'seasons' else '[]'::jsonb end) season
          where coalesce(nullif(season->>'season_number','')::int,0)>0),0)::int
        else greatest(d.total_episodes,d.watched_episodes::int)
      end
    )::int as released_episodes
  from d
  left join watched_last wl on wl.logical_key=(case when d.tmdb_id>0 then d.media_type||':'||d.tmdb_id::text else d.media_type||':id:'||d.media_id::text end)
), series_rows as (
  select b.*,
    case
      when b.is_completed then 'completed'
      when b.watched_episodes=0 and b.is_watchlist then 'not_started'
      when b.watched_episodes>0 and b.released_episodes<=b.watched_episodes
        then case when coalesce(b.raw_tmdb->>'status','') in ('Ended','Canceled') then 'completed' else 'up_to_date' end
      when b.is_up_to_date then 'up_to_date'
      when b.watched_episodes>0 and b.last_watched_at>=now()-interval '30 days' then 'continue'
      when b.watched_episodes>0 then 'dust'
      else null
    end as home_bucket
  from base b where b.media_type='tv'
), movie_watch as (
  select * from base b where b.media_type='movie' and b.is_watchlist and not b.is_seen
), history_ep as (
  select wh.id,wh.media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,m.title as media_title,m.poster_path,wh.title,wh.watched_at,
    wh.season_number,wh.episode_number,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end as plays
  from public.watch_history wh left join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode'
  order by wh.watched_at desc,wh.id desc limit 80
), history_mv as (
  select wh.id,wh.media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,m.title as media_title,m.poster_path,wh.title,wh.watched_at,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end as plays
  from public.watch_history wh left join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='movie'
  order by wh.watched_at desc,wh.id desc limit 80
)
select jsonb_build_object(
  'series',coalesce((select jsonb_agg(jsonb_build_object(
    'media_id',s.media_id,'tmdb_id',s.tmdb_id,'media_type',s.media_type,'media_kind',s.media_kind,
    'title',s.title,'poster_path',s.poster_path,'release_year',s.release_year,'runtime_minutes',s.runtime_minutes,
    'total_episodes',s.total_episodes,'released_episodes',s.released_episodes,'watched_episodes',s.watched_episodes,
    'last_watched_at',s.last_watched_at,'last_season_number',s.last_season_number,'last_episode_number',s.last_episode_number,
    'state_updated_at',null,'home_bucket',s.home_bucket
  ) order by case s.home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 when 'completed' then 5 else 9 end,
  s.last_watched_at desc nulls last,s.media_id desc) from series_rows s where s.home_bucket is not null),'[]'::jsonb),
  'movie_watchlist',coalesce((select jsonb_agg(jsonb_build_object(
    'media_id',m.media_id,'tmdb_id',m.tmdb_id,'title',m.title,'poster_path',m.poster_path,'release_year',m.release_year,
    'runtime_minutes',m.runtime_minutes,'vote_average',coalesce(nullif(m.raw_tmdb->>'vote_average','')::numeric,0),'overview',coalesce(m.raw_tmdb->>'overview','')
  ) order by m.last_watched_at desc nulls last,m.media_id desc) from movie_watch m),'[]'::jsonb),
  'seen_movie_tmdb_ids',coalesce((select jsonb_agg(distinct b.tmdb_id) from base b where b.media_type='movie' and b.is_seen and b.tmdb_id>0),'[]'::jsonb),
  'history_episodes',coalesce((select jsonb_agg(to_jsonb(h)) from history_ep h),'[]'::jsonb),
  'history_movies',coalesce((select jsonb_agg(to_jsonb(h)) from history_mv h),'[]'::jsonb)
);
$function$;

create or replace function public.cinetracker_discovery_exclusions_v0994()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with d as (
  select * from public.cinetracker_profile_media_dashboard_v0991()
), blocked as (
  select * from d
  where is_watchlist or is_seen or is_in_progress or is_up_to_date or is_completed
     or watched_episodes>0 or last_watched_at is not null
)
select jsonb_build_object(
  'movie_ids',coalesce(jsonb_agg(distinct tmdb_id) filter(where media_type='movie' and tmdb_id>0),'[]'::jsonb),
  'tv_ids',coalesce(jsonb_agg(distinct tmdb_id) filter(where media_type='tv' and tmdb_id>0),'[]'::jsonb),
  'aliases',coalesce(jsonb_agg(jsonb_build_object(
    'media_type',media_type,'release_year',release_year,'title',title,
    'localized_title',raw_tmdb->>'title','localized_name',raw_tmdb->>'name',
    'original_title',raw_tmdb->>'original_title','original_name',raw_tmdb->>'original_name'
  )),'[]'::jsonb)
) from blocked;
$function$;

revoke all on function public.cinetracker_discovery_exclusions_v0994() from anon;
grant execute on function public.cinetracker_discovery_exclusions_v0994() to authenticated;
