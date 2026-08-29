create or replace function public.cinetracker_effective_tmdb_id(p_tmdb integer, p_raw jsonb)
returns integer language sql immutable set search_path to 'public' as $function$
  select case
    when coalesce(p_tmdb,0)>0 then p_tmdb
    when coalesce(p_raw->>'source_tmdb_id','') ~ '^[0-9]+$' and (p_raw->>'source_tmdb_id')::bigint between 1 and 2147483647 then (p_raw->>'source_tmdb_id')::integer
    when coalesce(p_raw->>'id','') ~ '^[0-9]+$' and (p_raw->>'id')::bigint between 1 and 2147483647 then (p_raw->>'id')::integer
    when coalesce(p_raw->>'show_id','') ~ '^[0-9]+$' and (p_raw->>'show_id')::bigint between 1 and 2147483647 then (p_raw->>'show_id')::integer
    when coalesce(p_raw->'last_episode_to_air'->>'show_id','') ~ '^[0-9]+$' and (p_raw->'last_episode_to_air'->>'show_id')::bigint between 1 and 2147483647 then (p_raw->'last_episode_to_air'->>'show_id')::integer
    when coalesce(p_raw->'next_episode_to_air'->>'show_id','') ~ '^[0-9]+$' and (p_raw->'next_episode_to_air'->>'show_id')::bigint between 1 and 2147483647 then (p_raw->'next_episode_to_air'->>'show_id')::integer
    else p_tmdb end
$function$;

create or replace function public.cinetracker_released_episodes_v0997(p_raw jsonb,p_total integer,p_watched bigint)
returns integer language sql immutable set search_path to 'public' as $function$
with v as (
  select greatest(coalesce(p_total,0),0)::int total,greatest(coalesce(p_watched,0),0)::int watched,coalesce(p_raw,'{}'::jsonb) raw,
    lower(coalesce(p_raw->>'status','')) status,
    greatest(coalesce(nullif(p_raw->'last_episode_to_air'->>'season_number','')::int,0),0) last_s,
    greatest(coalesce(nullif(p_raw->'last_episode_to_air'->>'episode_number','')::int,0),0) last_e
), counts as (
  select v.*,
    coalesce((select sum(greatest(coalesce(nullif(s->>'episode_count','')::int,0),0)) from jsonb_array_elements(case when jsonb_typeof(v.raw->'seasons')='array' then v.raw->'seasons' else '[]'::jsonb end) s where coalesce(nullif(s->>'season_number','')::int,0)>0 and coalesce(nullif(s->>'season_number','')::int,0)<v.last_s),0)::int prev_count,
    coalesce((select greatest(coalesce(nullif(s->>'episode_count','')::int,0),0) from jsonb_array_elements(case when jsonb_typeof(v.raw->'seasons')='array' then v.raw->'seasons' else '[]'::jsonb end) s where coalesce(nullif(s->>'season_number','')::int,0)=v.last_s limit 1),0)::int current_count
  from v
), calc as (
  select *,case when status in ('ended','canceled','cancelled') and total>0 then total
    when last_s>0 and last_e>0 then case when current_count>0 and last_e>current_count then last_e else prev_count+last_e end
    when total>0 then total else watched end raw_released from counts
)
select greatest(watched,case when total>0 then least(total,greatest(raw_released,0)) else greatest(raw_released,0) end)::int from calc
$function$;

create or replace function public.cinetracker_profile_home_payload_v0997_r2()
returns jsonb language sql stable set search_path to 'public' as $function$
with d as (select * from public.cinetracker_profile_media_dashboard_v0991()),
media_keys as materialized (
  select m.id,case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0 then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text else m.media_type||':id:'||m.id::text end logical_key from public.media m
), watched_keys as (
  select distinct mk.logical_key,wh.season_number,wh.episode_number from public.watch_history wh join media_keys mk on mk.id=wh.media_id where wh.profile_id=auth.uid() and wh.item_type='episode' and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union
  select distinct mk.logical_key,ep.season_number,ep.episode_number from public.episode_progress ep join media_keys mk on mk.id=ep.media_id where ep.profile_id=auth.uid() and ep.watched=true and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), watched_last as (
  select distinct on(logical_key) logical_key,season_number,episode_number from watched_keys order by logical_key,season_number desc,episode_number desc
), base as materialized (
  select d.*,wl.season_number last_season_number,wl.episode_number last_episode_number,
    case when d.media_type='tv' then public.cinetracker_released_episodes_v0997(d.raw_tmdb,d.total_episodes,d.watched_episodes) else 0 end released_episodes,
    (d.media_type='tv' and d.tmdb_id>0 and (coalesce(nullif(d.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)>0 or coalesce(d.total_episodes,0)>0)) metadata_ready
  from d left join watched_last wl on wl.logical_key=(case when d.tmdb_id>0 then d.media_type||':'||d.tmdb_id::text else d.media_type||':id:'||d.media_id::text end)
), series_rows as (
  select b.*,case when b.is_completed then 'completed' when b.watched_episodes=0 and b.is_watchlist then 'not_started'
    when b.metadata_ready and b.watched_episodes>0 and b.released_episodes<=b.watched_episodes then case when lower(coalesce(b.raw_tmdb->>'status','')) in ('ended','canceled','cancelled') then 'completed' else 'up_to_date' end
    when b.watched_episodes>0 and ((b.metadata_ready and b.released_episodes>b.watched_episodes) or (not b.metadata_ready and b.is_in_progress)) and b.last_watched_at>=now()-interval '30 days' then 'continue'
    when b.watched_episodes>0 and ((b.metadata_ready and b.released_episodes>b.watched_episodes) or (not b.metadata_ready and b.is_in_progress)) then 'dust'
    when b.is_up_to_date then 'up_to_date' else null end home_bucket from base b where b.media_type='tv'
), movie_watch as (select * from base b where b.media_type='movie' and b.is_watchlist and not b.is_seen),
history_ep as (
  select wh.id,wh.media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) tmdb_id,m.title media_title,m.poster_path,wh.title,wh.watched_at,wh.season_number,wh.episode_number,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end plays
  from public.watch_history wh left join public.media m on m.id=wh.media_id where wh.profile_id=auth.uid() and wh.item_type='episode' order by wh.watched_at desc,wh.id desc limit 80
), history_mv as (
  select wh.id,wh.media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) tmdb_id,m.title media_title,m.poster_path,wh.title,wh.watched_at,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end plays
  from public.watch_history wh left join public.media m on m.id=wh.media_id where wh.profile_id=auth.uid() and wh.item_type='movie' order by wh.watched_at desc,wh.id desc limit 80
)
select jsonb_build_object(
  'series',coalesce((select jsonb_agg(jsonb_build_object('media_id',s.media_id,'tmdb_id',s.tmdb_id,'media_type',s.media_type,'media_kind',s.media_kind,'title',s.title,'poster_path',s.poster_path,'release_year',s.release_year,'runtime_minutes',s.runtime_minutes,'total_episodes',s.total_episodes,'released_episodes',s.released_episodes,'watched_episodes',s.watched_episodes,'last_watched_at',s.last_watched_at,'last_season_number',s.last_season_number,'last_episode_number',s.last_episode_number,'state_updated_at',null,'home_bucket',s.home_bucket) order by case s.home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 when 'completed' then 5 else 9 end,s.last_watched_at desc nulls last,s.media_id desc) from series_rows s where s.home_bucket is not null),'[]'::jsonb),
  'movie_watchlist',coalesce((select jsonb_agg(jsonb_build_object('media_id',m.media_id,'tmdb_id',m.tmdb_id,'title',m.title,'poster_path',m.poster_path,'release_year',m.release_year,'runtime_minutes',m.runtime_minutes,'vote_average',coalesce(nullif(m.raw_tmdb->>'vote_average','')::numeric,0),'overview',coalesce(m.raw_tmdb->>'overview','')) order by m.last_watched_at desc nulls last,m.media_id desc) from movie_watch m),'[]'::jsonb),
  'seen_movie_tmdb_ids',coalesce((select jsonb_agg(distinct b.tmdb_id) from base b where b.media_type='movie' and b.is_seen and b.tmdb_id>0),'[]'::jsonb),
  'history_episodes',coalesce((select jsonb_agg(to_jsonb(h)) from history_ep h),'[]'::jsonb),
  'history_movies',coalesce((select jsonb_agg(to_jsonb(h)) from history_mv h),'[]'::jsonb)
)
$function$;

create or replace function public.cinetracker_home_live_v0997_r2()
returns jsonb language sql stable set search_path to 'public' as $function$
  select public.cinetracker_profile_home_payload_v0997_r2();
$function$;

create or replace function public.cinetracker_home_live_v0997()
returns jsonb language sql stable set search_path to 'public' as $function$
  select public.cinetracker_profile_home_payload_v0997_r2();
$function$;
