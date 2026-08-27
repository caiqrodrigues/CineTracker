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
      when b.watched_episodes>0 and b.released_episodes>b.watched_episodes and b.last_watched_at>=now()-interval '30 days' then 'continue'
      when b.watched_episodes>0 and b.released_episodes>b.watched_episodes then 'dust'
      when b.is_up_to_date then 'up_to_date'
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
