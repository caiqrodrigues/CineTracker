create or replace function public.cinetracker_released_episodes_v0997(
  p_raw jsonb,
  p_total integer,
  p_watched bigint,
  p_today date
)
returns integer
language sql
immutable
set search_path to 'public'
as $function$
with v as (
  select
    greatest(coalesce(p_total,0),0)::int as total,
    greatest(coalesce(p_watched,0),0)::int as watched,
    coalesce(p_raw,'{}'::jsonb) as raw,
    lower(coalesce(p_raw->>'status','')) as status,
    greatest(coalesce(nullif(p_raw->'last_episode_to_air'->>'season_number','')::int,0),0) as last_s,
    greatest(coalesce(nullif(p_raw->'last_episode_to_air'->>'episode_number','')::int,0),0) as last_e,
    greatest(coalesce(nullif(p_raw->'next_episode_to_air'->>'season_number','')::int,0),0) as next_s,
    greatest(coalesce(nullif(p_raw->'next_episode_to_air'->>'episode_number','')::int,0),0) as next_e,
    case
      when coalesce(p_raw->'next_episode_to_air'->>'air_date','') ~ '^\d{4}-\d{2}-\d{2}$'
        then (p_raw->'next_episode_to_air'->>'air_date')::date
      else null
    end as next_d
), effective as (
  select v.*,
    case when next_d is not null and next_d<=p_today and next_s>0 and next_e>0 then next_s else last_s end as released_s,
    case when next_d is not null and next_d<=p_today and next_s>0 and next_e>0 then next_e else last_e end as released_e
  from v
), counts as (
  select e.*,
    coalesce((
      select sum(greatest(coalesce(nullif(s->>'episode_count','')::int,0),0))
      from jsonb_array_elements(case when jsonb_typeof(e.raw->'seasons')='array' then e.raw->'seasons' else '[]'::jsonb end) s
      where coalesce(nullif(s->>'season_number','')::int,0)>0
        and coalesce(nullif(s->>'season_number','')::int,0)<e.released_s
    ),0)::int as prev_count,
    coalesce((
      select greatest(coalesce(nullif(s->>'episode_count','')::int,0),0)
      from jsonb_array_elements(case when jsonb_typeof(e.raw->'seasons')='array' then e.raw->'seasons' else '[]'::jsonb end) s
      where coalesce(nullif(s->>'season_number','')::int,0)=e.released_s
      limit 1
    ),0)::int as current_count
  from effective e
), calc as (
  select *,
    case
      when status in ('ended','canceled','cancelled') and total>0 then total
      when released_s>0 and released_e>0 then
        case when current_count>0 and released_e>current_count then released_e else prev_count+released_e end
      when total>0 then total
      else watched
    end as raw_released
  from counts
)
select greatest(
  watched,
  case when total>0 then least(total,greatest(raw_released,0)) else greatest(raw_released,0) end
)::int
from calc
$function$;

create or replace function public.cinetracker_released_episodes_v0997(
  p_raw jsonb,
  p_total integer,
  p_watched bigint
)
returns integer
language sql
stable
set search_path to 'public'
as $function$
  select public.cinetracker_released_episodes_v0997(p_raw,p_total,p_watched,current_date);
$function$;

create or replace function public.cinetracker_profile_home_payload_v0997_r3(p_today date)
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with d as (select * from public.cinetracker_profile_media_dashboard_v0991()),
media_keys as materialized (
  select m.id,
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else m.media_type||':id:'||m.id::text end as logical_key
  from public.media m
), watched_keys as (
  select distinct mk.logical_key,wh.season_number,wh.episode_number
  from public.watch_history wh join media_keys mk on mk.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode'
    and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union
  select distinct mk.logical_key,ep.season_number,ep.episode_number
  from public.episode_progress ep join media_keys mk on mk.id=ep.media_id
  where ep.profile_id=auth.uid() and ep.watched=true
    and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), watched_last as (
  select distinct on(logical_key) logical_key,season_number,episode_number
  from watched_keys
  order by logical_key,season_number desc,episode_number desc
), base as materialized (
  select d.*,wl.season_number as last_season_number,wl.episode_number as last_episode_number,
    case when d.media_type='tv'
      then public.cinetracker_released_episodes_v0997(d.raw_tmdb,d.total_episodes,d.watched_episodes,p_today)
      else 0 end as released_episodes,
    case when d.media_type='tv'
      then public.cinetracker_released_episodes_v0997(d.raw_tmdb,d.total_episodes,d.watched_episodes,p_today-1)
      else 0 end as released_previous_day,
    (
      d.media_type='tv' and d.tmdb_id>0 and (
        coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)>0
        or coalesce(nullif(d.raw_tmdb->'next_episode_to_air'->>'season_number','')::int,0)>0
        or coalesce(d.total_episodes,0)>0
      )
    ) as metadata_ready
  from d
  left join watched_last wl on wl.logical_key=(case when d.tmdb_id>0 then d.media_type||':'||d.tmdb_id::text else d.media_type||':id:'||d.media_id::text end)
), series_rows as (
  select b.*,
    case
      when b.is_completed then 'completed'
      when b.watched_episodes=0 and b.is_watchlist then 'not_started'
      when b.metadata_ready and b.watched_episodes>0 and b.released_episodes<=b.watched_episodes then
        case when lower(coalesce(b.raw_tmdb->>'status','')) in ('ended','canceled','cancelled') then 'completed' else 'up_to_date' end
      when b.watched_episodes>0 and b.metadata_ready and b.released_episodes>b.watched_episodes
        and (b.is_up_to_date or b.released_previous_day<=b.watched_episodes) then 'continue'
      when b.watched_episodes>0
        and ((b.metadata_ready and b.released_episodes>b.watched_episodes) or (not b.metadata_ready and b.is_in_progress))
        and b.last_watched_at>=now()-interval '30 days' then 'continue'
      when b.watched_episodes>0
        and ((b.metadata_ready and b.released_episodes>b.watched_episodes) or (not b.metadata_ready and b.is_in_progress)) then 'dust'
      when b.is_up_to_date then 'up_to_date'
      else null
    end as home_bucket
  from base b
  where b.media_type='tv'
), movie_watch as (
  select * from base b where b.media_type='movie' and b.is_watchlist and not b.is_seen
), history_ep as (
  select wh.id,wh.media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,
    m.title as media_title,m.poster_path,wh.title,wh.watched_at,wh.season_number,wh.episode_number,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end as plays
  from public.watch_history wh
  left join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode'
  order by wh.watched_at desc,wh.id desc
  limit 80
), history_mv as (
  select wh.id,wh.media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,
    m.title as media_title,m.poster_path,wh.title,wh.watched_at,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end as plays
  from public.watch_history wh
  left join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='movie'
  order by wh.watched_at desc,wh.id desc
  limit 80
)
select jsonb_build_object(
  'series',coalesce((
    select jsonb_agg(jsonb_build_object(
      'media_id',s.media_id,'tmdb_id',s.tmdb_id,'media_type',s.media_type,'media_kind',s.media_kind,
      'title',s.title,'poster_path',s.poster_path,'release_year',s.release_year,'runtime_minutes',s.runtime_minutes,
      'total_episodes',s.total_episodes,'released_episodes',s.released_episodes,'watched_episodes',s.watched_episodes,
      'last_watched_at',s.last_watched_at,'last_season_number',s.last_season_number,'last_episode_number',s.last_episode_number,
      'state_updated_at',null,'home_bucket',s.home_bucket
    ) order by case s.home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 when 'completed' then 5 else 9 end,
      s.last_watched_at desc nulls last,s.media_id desc)
    from series_rows s where s.home_bucket is not null
  ),'[]'::jsonb),
  'movie_watchlist',coalesce((
    select jsonb_agg(jsonb_build_object(
      'media_id',m.media_id,'tmdb_id',m.tmdb_id,'title',m.title,'poster_path',m.poster_path,
      'release_year',m.release_year,'runtime_minutes',m.runtime_minutes,
      'vote_average',coalesce(nullif(m.raw_tmdb->>'vote_average','')::numeric,0),
      'overview',coalesce(m.raw_tmdb->>'overview','')
    ) order by m.last_watched_at desc nulls last,m.media_id desc)
    from movie_watch m
  ),'[]'::jsonb),
  'seen_movie_tmdb_ids',coalesce((select jsonb_agg(distinct b.tmdb_id) from base b where b.media_type='movie' and b.is_seen and b.tmdb_id>0),'[]'::jsonb),
  'history_episodes',coalesce((select jsonb_agg(to_jsonb(h)) from history_ep h),'[]'::jsonb),
  'history_movies',coalesce((select jsonb_agg(to_jsonb(h)) from history_mv h),'[]'::jsonb)
)
$function$;

create or replace function public.cinetracker_profile_home_payload_v0997_r2()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
  select public.cinetracker_profile_home_payload_v0997_r3(current_date);
$function$;

create or replace function public.cinetracker_home_live_v0997_r3(p_today date)
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
  select public.cinetracker_profile_home_payload_v0997_r3(p_today);
$function$;

create or replace function public.cinetracker_home_live_v0997_r2()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
  select public.cinetracker_profile_home_payload_v0997_r3(current_date);
$function$;

create or replace function public.cinetracker_home_live_v0997()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
  select public.cinetracker_profile_home_payload_v0997_r3(current_date);
$function$;

create or replace function public.cinetracker_calendar_watchlist_v0997(p_from date,p_to date)
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with d as materialized (
  select * from public.cinetracker_profile_media_dashboard_v0991()
  where is_watchlist=true and tmdb_id>0
), movie_events as (
  select d.media_id,d.tmdb_id,d.media_type,d.media_kind,d.title,d.poster_path,d.raw_tmdb,
    (d.raw_tmdb->>'release_date')::date as calendar_date,
    null::integer as season_number,null::integer as episode_number,'movie_release'::text as event_kind
  from d
  where d.media_type='movie'
    and coalesce(d.raw_tmdb->>'release_date','') ~ '^\d{4}-\d{2}-\d{2}$'
    and (d.raw_tmdb->>'release_date')::date between p_from and p_to
), tv_last_events as (
  select d.media_id,d.tmdb_id,d.media_type,d.media_kind,d.title,d.poster_path,d.raw_tmdb,
    (d.raw_tmdb->'last_episode_to_air'->>'air_date')::date as calendar_date,
    nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::integer as season_number,
    nullif(d.raw_tmdb->'last_episode_to_air'->>'episode_number','')::integer as episode_number,
    'episode'::text as event_kind
  from d
  where d.media_type='tv'
    and coalesce(d.raw_tmdb->'last_episode_to_air'->>'air_date','') ~ '^\d{4}-\d{2}-\d{2}$'
    and (d.raw_tmdb->'last_episode_to_air'->>'air_date')::date between p_from and p_to
), tv_next_events as (
  select d.media_id,d.tmdb_id,d.media_type,d.media_kind,d.title,d.poster_path,d.raw_tmdb,
    (d.raw_tmdb->'next_episode_to_air'->>'air_date')::date as calendar_date,
    nullif(d.raw_tmdb->'next_episode_to_air'->>'season_number','')::integer as season_number,
    nullif(d.raw_tmdb->'next_episode_to_air'->>'episode_number','')::integer as episode_number,
    'episode'::text as event_kind
  from d
  where d.media_type='tv'
    and coalesce(d.raw_tmdb->'next_episode_to_air'->>'air_date','') ~ '^\d{4}-\d{2}-\d{2}$'
    and (d.raw_tmdb->'next_episode_to_air'->>'air_date')::date between p_from and p_to
    and not (
      coalesce(d.raw_tmdb->'last_episode_to_air'->>'air_date','')=coalesce(d.raw_tmdb->'next_episode_to_air'->>'air_date','')
      and coalesce(d.raw_tmdb->'last_episode_to_air'->>'season_number','')=coalesce(d.raw_tmdb->'next_episode_to_air'->>'season_number','')
      and coalesce(d.raw_tmdb->'last_episode_to_air'->>'episode_number','')=coalesce(d.raw_tmdb->'next_episode_to_air'->>'episode_number','')
    )
), tv_premiere_events as (
  select d.media_id,d.tmdb_id,d.media_type,d.media_kind,d.title,d.poster_path,d.raw_tmdb,
    (d.raw_tmdb->>'first_air_date')::date as calendar_date,
    1::integer as season_number,1::integer as episode_number,'series_premiere'::text as event_kind
  from d
  where d.media_type='tv'
    and coalesce(d.raw_tmdb->>'first_air_date','') ~ '^\d{4}-\d{2}-\d{2}$'
    and (d.raw_tmdb->>'first_air_date')::date between p_from and p_to
    and not (coalesce(d.raw_tmdb->'next_episode_to_air'->>'air_date','') ~ '^\d{4}-\d{2}-\d{2}$')
), events as (
  select * from movie_events
  union all select * from tv_last_events
  union all select * from tv_next_events
  union all select * from tv_premiere_events
), dedup as (
  select distinct on(media_type,tmdb_id,calendar_date,coalesce(season_number,0),coalesce(episode_number,0)) *
  from events
  order by media_type,tmdb_id,calendar_date,coalesce(season_number,0),coalesce(episode_number,0),event_kind
)
select coalesce(jsonb_agg(jsonb_build_object(
  'id',tmdb_id,
  'media_id',media_id,
  'tmdb_id',tmdb_id,
  'media_type',media_type,
  'media_kind',media_kind,
  'title',title,
  'name',title,
  'poster_path',poster_path,
  'vote_average',coalesce(nullif(raw_tmdb->>'vote_average','')::numeric,0),
  'calendar_date',to_char(calendar_date,'YYYY-MM-DD'),
  'release_date',case when media_type='movie' then to_char(calendar_date,'YYYY-MM-DD') else null end,
  'first_air_date',case when media_type='tv' then to_char(calendar_date,'YYYY-MM-DD') else null end,
  'season_number',season_number,
  'episode_number',episode_number,
  'event_kind',event_kind,
  'raw_tmdb',raw_tmdb
) order by calendar_date,media_type,title,season_number,episode_number),'[]'::jsonb)
from dedup
$function$;

grant execute on function public.cinetracker_released_episodes_v0997(jsonb,integer,bigint,date) to authenticated;
grant execute on function public.cinetracker_profile_home_payload_v0997_r3(date) to authenticated;
grant execute on function public.cinetracker_home_live_v0997_r3(date) to authenticated;
grant execute on function public.cinetracker_calendar_watchlist_v0997(date,date) to authenticated;
