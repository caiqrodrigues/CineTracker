create or replace function public.cinetracker_latest_released_episode_v0997(p_raw jsonb,p_today date)
returns table(season_number integer,episode_number integer)
language sql
immutable
set search_path to 'public'
as $$
with candidates as (
  select
    coalesce(nullif(p_raw->'last_episode_to_air'->>'season_number','')::int,0) as s,
    coalesce(nullif(p_raw->'last_episode_to_air'->>'episode_number','')::int,0) as e
  union all
  select
    coalesce(nullif(p_raw->'next_episode_to_air'->>'season_number','')::int,0),
    coalesce(nullif(p_raw->'next_episode_to_air'->>'episode_number','')::int,0)
  where nullif(p_raw->'next_episode_to_air'->>'air_date','')::date <= p_today
)
select c.s,c.e
from candidates c
where c.s>0 and c.e>0
order by c.s desc,c.e desc
limit 1;
$$;

create or replace function public.cinetracker_profile_home_payload_v0997_r3(p_today date)
returns jsonb
language sql
stable
set search_path to 'public'
as $$
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
  select d.*,
    public.cinetracker_effective_tmdb_id(d.tmdb_id,d.raw_tmdb) as effective_tmdb_id,
    wl.season_number as last_season_number,wl.episode_number as last_episode_number,
    lr.season_number as latest_released_season_number,lr.episode_number as latest_released_episode_number,
    case when d.media_type='tv'
      then public.cinetracker_released_episodes_v0997(d.raw_tmdb,d.total_episodes,d.watched_episodes,p_today)
      else 0 end as released_episodes,
    (
      d.media_type='tv' and public.cinetracker_effective_tmdb_id(d.tmdb_id,d.raw_tmdb)>0 and (
        coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)>0
        or coalesce(nullif(d.raw_tmdb->'next_episode_to_air'->>'season_number','')::int,0)>0
        or coalesce(d.total_episodes,0)>0
      )
    ) as metadata_ready
  from d
  left join watched_last wl on wl.logical_key=(case when public.cinetracker_effective_tmdb_id(d.tmdb_id,d.raw_tmdb)>0
    then d.media_type||':'||public.cinetracker_effective_tmdb_id(d.tmdb_id,d.raw_tmdb)::text
    else d.media_type||':id:'||d.media_id::text end)
  left join lateral public.cinetracker_latest_released_episode_v0997(d.raw_tmdb,p_today) lr on d.media_type='tv'
), evaluated as (
  select b.*,
    greatest(0,coalesce(b.released_episodes,0)-coalesce(b.watched_episodes,0)) as history_missing_episodes,
    case
      when coalesce(b.watched_episodes,0)<=0 then false
      when coalesce(b.latest_released_season_number,0)>0 and coalesce(b.last_season_number,0)>0 then
        b.last_season_number>b.latest_released_season_number
        or (b.last_season_number=b.latest_released_season_number and coalesce(b.last_episode_number,0)>=coalesce(b.latest_released_episode_number,0))
      when b.metadata_ready then coalesce(b.released_episodes,0)<=coalesce(b.watched_episodes,0)
      else coalesce(b.is_up_to_date,false)
    end as is_caught_up
  from base b
), series_rows as (
  select e.*,
    case
      when e.is_completed then 'completed'
      when coalesce(e.watched_episodes,0)=0 and e.is_watchlist then 'not_started'
      when coalesce(e.watched_episodes,0)>0 and e.is_caught_up then
        case when lower(coalesce(e.raw_tmdb->>'status','')) in ('ended','canceled','cancelled') then 'completed' else 'up_to_date' end
      when coalesce(e.watched_episodes,0)>0 and e.metadata_ready and not e.is_caught_up
        and (coalesce(e.is_up_to_date,false) or e.last_watched_at>=now()-interval '30 days') then 'continue'
      when coalesce(e.watched_episodes,0)>0 and e.metadata_ready and not e.is_caught_up then 'dust'
      when coalesce(e.watched_episodes,0)>0 and not e.metadata_ready and coalesce(e.is_up_to_date,false) then 'up_to_date'
      when coalesce(e.watched_episodes,0)>0 and not e.metadata_ready and coalesce(e.is_in_progress,false)
        and e.last_watched_at>=now()-interval '30 days' then 'continue'
      when coalesce(e.watched_episodes,0)>0 and not e.metadata_ready and coalesce(e.is_in_progress,false) then 'dust'
      else null
    end as home_bucket
  from evaluated e
  where e.media_type='tv'
), movie_watch as (
  select * from evaluated b where b.media_type='movie' and b.is_watchlist and not b.is_seen
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
      'media_id',s.media_id,
      'tmdb_id',case when s.effective_tmdb_id>0 then s.effective_tmdb_id else s.tmdb_id end,
      'media_type',s.media_type,'media_kind',s.media_kind,
      'title',s.title,'poster_path',s.poster_path,'release_year',s.release_year,'runtime_minutes',s.runtime_minutes,
      'total_episodes',s.total_episodes,'released_episodes',s.released_episodes,'watched_episodes',s.watched_episodes,
      'history_missing_episodes',s.history_missing_episodes,'is_caught_up',s.is_caught_up,
      'last_watched_at',s.last_watched_at,'last_season_number',s.last_season_number,'last_episode_number',s.last_episode_number,
      'latest_released_season_number',s.latest_released_season_number,'latest_released_episode_number',s.latest_released_episode_number,
      'state_updated_at',null,'home_bucket',s.home_bucket
    ) order by case s.home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 when 'completed' then 5 else 9 end,
      s.last_watched_at desc nulls last,s.media_id desc)
    from series_rows s where s.home_bucket is not null
  ),'[]'::jsonb),
  'movie_watchlist',coalesce((
    select jsonb_agg(jsonb_build_object(
      'media_id',m.media_id,'tmdb_id',case when m.effective_tmdb_id>0 then m.effective_tmdb_id else m.tmdb_id end,'title',m.title,'poster_path',m.poster_path,
      'release_year',m.release_year,'runtime_minutes',m.runtime_minutes,
      'vote_average',coalesce(nullif(m.raw_tmdb->>'vote_average','')::numeric,0),
      'overview',coalesce(m.raw_tmdb->>'overview','')
    ) order by m.last_watched_at desc nulls last,m.media_id desc)
    from movie_watch m
  ),'[]'::jsonb),
  'seen_movie_tmdb_ids',coalesce((select jsonb_agg(distinct b.effective_tmdb_id) from evaluated b where b.media_type='movie' and b.is_seen and b.effective_tmdb_id>0),'[]'::jsonb),
  'history_episodes',coalesce((select jsonb_agg(to_jsonb(h)) from history_ep h),'[]'::jsonb),
  'history_movies',coalesce((select jsonb_agg(to_jsonb(h)) from history_mv h),'[]'::jsonb)
)
$$;

create or replace function public.cinetracker_mark_episode_v0994(
  p_media_id bigint,
  p_season_number integer,
  p_episode_number integer,
  p_title text default null,
  p_runtime_minutes integer default null,
  p_released_episodes integer default null,
  p_series_status text default null,
  p_watched_at timestamptz default now()
)
returns jsonb
language plpgsql
set search_path to 'public'
as $$
declare
  v_profile uuid:=auth.uid();
  v_media public.media%rowtype;
  v_result jsonb;
  v_watched bigint:=0;
  v_released integer:=null;
  v_status text:=null;
  v_state text:='InProgress';
  v_bucket text:='continue';
  v_last_s integer:=0;
  v_last_e integer:=0;
  v_latest_s integer:=0;
  v_latest_e integer:=0;
  v_caught_up boolean:=false;
begin
  if v_profile is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_season_number is null or p_episode_number is null then raise exception 'EPISODE_COORDINATES_REQUIRED'; end if;

  select * into v_media from public.media where id=p_media_id;
  if not found then raise exception 'MEDIA_NOT_FOUND'; end if;
  if v_media.media_type<>'tv' then raise exception 'TV_MEDIA_REQUIRED'; end if;

  v_result:=public.cinetracker_mark_watch_v0994(
    p_media_id,'episode',p_season_number,p_episode_number,p_title,p_runtime_minutes,p_released_episodes,p_watched_at
  );

  v_watched:=coalesce(nullif(v_result->>'watched_episodes','')::bigint,0);
  v_released:=coalesce(nullif(v_result->>'released_episodes','')::integer,nullif(p_released_episodes,0));
  v_status:=coalesce(nullif(p_series_status,''),nullif(v_media.raw_tmdb->>'status',''),'');

  select q.season_number,q.episode_number into v_last_s,v_last_e
  from (
    select distinct season_number,episode_number from public.watch_history
    where profile_id=v_profile and media_id=p_media_id and item_type='episode'
      and coalesce(season_number,0)>0 and coalesce(episode_number,0)>0
    union
    select distinct season_number,episode_number from public.episode_progress
    where profile_id=v_profile and media_id=p_media_id and watched=true
      and coalesce(season_number,0)>0 and coalesce(episode_number,0)>0
  ) q
  order by q.season_number desc,q.episode_number desc
  limit 1;

  select season_number,episode_number into v_latest_s,v_latest_e
  from public.cinetracker_latest_released_episode_v0997(v_media.raw_tmdb,(p_watched_at at time zone 'America/Sao_Paulo')::date);

  if coalesce(v_latest_s,0)>0 and coalesce(v_last_s,0)>0 then
    v_caught_up:=v_last_s>v_latest_s or (v_last_s=v_latest_s and coalesce(v_last_e,0)>=coalesce(v_latest_e,0));
  elsif v_released is not null then
    v_caught_up:=v_watched>=v_released;
  else
    v_caught_up:=false;
  end if;

  if v_caught_up then
    if lower(v_status) in ('ended','canceled','cancelled') then
      v_state:='Completed';v_bucket:='completed';
    else
      v_state:='UpToDate';v_bucket:='up_to_date';
    end if;
  else
    v_state:='InProgress';v_bucket:='continue';
  end if;

  delete from public.media_overrides
  where profile_id=v_profile and media_id=p_media_id
    and state in ('InProgress','UpToDate','Completed')
    and origin in ('system','import');

  insert into public.media_overrides(profile_id,media_id,state,origin,updated_at)
  values(v_profile,p_media_id,v_state,'system',p_watched_at)
  on conflict(profile_id,media_id,state) do update
    set updated_at=excluded.updated_at
    where public.media_overrides.origin in ('system','import');

  update public.profiles set updated_at=now() where id=v_profile;

  return v_result || jsonb_build_object(
    'series_status',v_status,'state',v_state,'home_bucket',v_bucket,
    'is_caught_up',v_caught_up,
    'latest_released_season_number',v_latest_s,
    'latest_released_episode_number',v_latest_e
  );
end;
$$;
