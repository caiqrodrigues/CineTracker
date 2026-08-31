-- r171: robust media_overrides writes, whole-series seen state and clickable activity details

alter table public.media_overrides
  alter column profile_id set default auth.uid();

create or replace function public.cinetracker_mark_series_seen_v1(
  p_media_id bigint,
  p_watched_at timestamptz default now()
) returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
declare
  v_profile uuid:=auth.uid();
  v_media public.media%rowtype;
  v_last_s integer:=0;
  v_last_e integer:=0;
  v_count bigint:=0;
begin
  if v_profile is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_media from public.media where id=p_media_id;
  if not found then raise exception 'MEDIA_NOT_FOUND'; end if;
  if v_media.media_type<>'tv' then raise exception 'TV_MEDIA_REQUIRED'; end if;

  v_last_s:=coalesce(nullif(v_media.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0);
  v_last_e:=coalesce(nullif(v_media.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0);

  insert into public.media_overrides(profile_id,media_id,state,origin,watched_at,updated_at)
  values(v_profile,p_media_id,'AlreadySeen','manual',p_watched_at,p_watched_at)
  on conflict(profile_id,media_id,state) do update
    set origin='manual',watched_at=excluded.watched_at,updated_at=excluded.updated_at;

  delete from public.media_overrides
  where profile_id=v_profile and media_id=p_media_id and state in ('AddedToWatchlist','WatchLater');

  with seasons as (
    select
      coalesce(nullif(s->>'season_number','')::int,0) as season_number,
      greatest(coalesce(nullif(s->>'episode_count','')::int,0),0) as episode_count
    from jsonb_array_elements(
      case when jsonb_typeof(v_media.raw_tmdb->'seasons')='array' then v_media.raw_tmdb->'seasons' else '[]'::jsonb end
    ) s
    where coalesce(nullif(s->>'season_number','')::int,0)>0
  ), released as (
    select season_number,
      case
        when v_last_s>0 and season_number<v_last_s then episode_count
        when v_last_s>0 and season_number=v_last_s then least(episode_count,greatest(v_last_e,0))
        when v_last_s>0 then 0
        else episode_count
      end as max_episode
    from seasons
  ), eps as (
    select r.season_number,g.episode_number
    from released r
    cross join lateral generate_series(1,greatest(r.max_episode,0)) g(episode_number)
  )
  insert into public.episode_progress(profile_id,media_id,season_number,episode_number,watched,watched_at,origin,updated_at)
  select v_profile,p_media_id,e.season_number,e.episode_number,true,p_watched_at,'manual',p_watched_at
  from eps e
  on conflict(profile_id,media_id,season_number,episode_number) do update
    set watched=true,
        watched_at=coalesce(public.episode_progress.watched_at,excluded.watched_at),
        origin=case when public.episode_progress.origin='manual' then public.episode_progress.origin else excluded.origin end,
        updated_at=excluded.updated_at;

  get diagnostics v_count=row_count;
  update public.profiles set updated_at=now() where id=v_profile;
  return jsonb_build_object('media_id',p_media_id,'watched',true,'episodes_ensured',v_count,'watched_at',p_watched_at);
end;
$$;

grant execute on function public.cinetracker_mark_series_seen_v1(bigint,timestamptz) to authenticated;

create or replace function public.cinetracker_activity_by_day_v1(
  p_days integer default 15,
  p_tz text default 'America/Sao_Paulo'
) returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select greatest(1,least(coalesce(p_days,15),60))::integer as day_count,
         (now() at time zone coalesce(nullif(p_tz,''),'America/Sao_Paulo'))::date as today_date,
         auth.uid() as uid,
         coalesce(nullif(p_tz,''),'America/Sao_Paulo') as zone
), date_days as (
  select generate_series(c.today_date-(c.day_count-1),c.today_date,interval '1 day')::date as day_key from cfg c
), play_counts as (
  select (pe.played_at at time zone c.zone)::date as day_key,
         count(*) filter(where pe.item_type='episode')::integer as episodes,
         count(*) filter(where pe.item_type='movie')::integer as movies
  from public.watch_play_events_v0994 pe cross join cfg c
  where pe.profile_id=c.uid
    and pe.played_at>=((c.today_date-(c.day_count-1))::timestamp at time zone c.zone)
    and pe.played_at<((c.today_date+1)::timestamp at time zone c.zone)
  group by 1
), legacy_counts as (
  select (wh.watched_at at time zone c.zone)::date as day_key,
         count(*) filter(where wh.item_type='episode')::integer as episodes,
         count(*) filter(where wh.item_type='movie')::integer as movies
  from public.watch_history wh cross join cfg c
  where wh.profile_id=c.uid
    and wh.item_type in ('episode','movie')
    and not (coalesce(wh.external_ids,'{}'::jsonb) ? 'v0994_managed')
    and wh.watched_at>=((c.today_date-(c.day_count-1))::timestamp at time zone c.zone)
    and wh.watched_at<((c.today_date+1)::timestamp at time zone c.zone)
  group by 1
), media_counts as (
  select x.day_key,sum(x.episodes)::integer as episodes,sum(x.movies)::integer as movies
  from (
    select * from play_counts
    union all
    select * from legacy_counts
  ) x group by x.day_key
), sport_counts as (
  select (sh.watched_at at time zone c.zone)::date as day_key,count(*)::integer as sports
  from public.user_sport_watch_history sh cross join cfg c
  where sh.profile_id=c.uid
    and sh.watched_at>=((c.today_date-(c.day_count-1))::timestamp at time zone c.zone)
    and sh.watched_at<((c.today_date+1)::timestamp at time zone c.zone)
  group by 1
)
select coalesce(jsonb_agg(jsonb_build_object(
  'day',d.day_key,
  'episodes',coalesce(m.episodes,0),
  'movies',coalesce(m.movies,0),
  'sports',coalesce(s.sports,0),
  'count',coalesce(m.episodes,0)+coalesce(m.movies,0)+coalesce(s.sports,0)
) order by d.day_key),'[]'::jsonb)
from date_days d left join media_counts m using(day_key) left join sport_counts s using(day_key);
$$;

grant execute on function public.cinetracker_activity_by_day_v1(integer,text) to authenticated;

create or replace function public.cinetracker_activity_items_by_day_v1(
  p_day date,
  p_tz text default 'America/Sao_Paulo'
) returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select auth.uid() as uid,coalesce(nullif(p_tz,''),'America/Sao_Paulo') as zone,p_day as target_date
), media_plays as (
  select pe.id,pe.played_at as watched_at,pe.item_type,
         pe.season_number,pe.episode_number,pe.runtime_minutes,
         m.id as media_id,m.media_type,m.tmdb_id,m.title as media_title,m.poster_path,
         case when pe.item_type='episode' then coalesce(wh.title,'Episódio '||pe.episode_number::text) else m.title end as title,
         'play'::text as source_kind
  from public.watch_play_events_v0994 pe
  join public.media m on m.id=pe.media_id
  cross join cfg c
  left join public.watch_history wh on wh.profile_id=pe.profile_id and wh.media_id=pe.media_id and wh.item_type=pe.item_type
    and coalesce(wh.season_number,-1)=coalesce(pe.season_number,-1) and coalesce(wh.episode_number,-1)=coalesce(pe.episode_number,-1)
  where pe.profile_id=c.uid
    and pe.played_at>=(c.target_date::timestamp at time zone c.zone)
    and pe.played_at<((c.target_date+1)::timestamp at time zone c.zone)
), legacy_rows as (
  select wh.id,wh.watched_at,wh.item_type,wh.season_number,wh.episode_number,
         coalesce(m.runtime_minutes,0) as runtime_minutes,m.id as media_id,m.media_type,m.tmdb_id,m.title as media_title,m.poster_path,
         coalesce(wh.title,m.title) as title,'legacy'::text as source_kind
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  cross join cfg c
  where wh.profile_id=c.uid and wh.item_type in ('episode','movie')
    and not (coalesce(wh.external_ids,'{}'::jsonb) ? 'v0994_managed')
    and wh.watched_at>=(c.target_date::timestamp at time zone c.zone)
    and wh.watched_at<((c.target_date+1)::timestamp at time zone c.zone)
), sport_rows as (
  select sh.id,sh.watched_at,'sport'::text as item_type,null::integer as season_number,null::integer as episode_number,
         sh.duration_minutes as runtime_minutes,null::bigint as media_id,null::text as media_type,null::integer as tmdb_id,
         se.title as media_title,se.image_url as poster_path,se.title as title,'sport'::text as source_kind
  from public.user_sport_watch_history sh
  join public.sport_events se on se.id=sh.event_id
  cross join cfg c
  where sh.profile_id=c.uid
    and sh.watched_at>=(c.target_date::timestamp at time zone c.zone)
    and sh.watched_at<((c.target_date+1)::timestamp at time zone c.zone)
), all_rows as (
  select * from media_plays union all select * from legacy_rows union all select * from sport_rows
)
select coalesce(jsonb_agg(to_jsonb(a) order by a.watched_at desc),'[]'::jsonb) from all_rows a;
$$;

grant execute on function public.cinetracker_activity_items_by_day_v1(date,text) to authenticated;

create index if not exists idx_play_events_profile_played_r171
  on public.watch_play_events_v0994(profile_id,played_at desc,item_type);
