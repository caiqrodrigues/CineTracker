create or replace function public.cinetracker_discover_filter_v320(p_items jsonb)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with me as (
  select auth.uid() as uid
),
items as (
  select
    case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end as media_type,
    x.tmdb_id,
    nullif(trim(x.title),'') as title,
    x.release_year,
    case when lower(coalesce(x.media_type,''))='movie' then 'movie:'||x.tmdb_id::text else 'tv:'||x.tmdb_id::text end as candidate_key,
    lower(regexp_replace(coalesce(x.title,''),'[^[:alnum:]]+','','g')) as norm_title
  from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb))
    as x(media_type text,tmdb_id integer,title text,release_year integer)
  where coalesce(x.tmdb_id,0)>0
),
matched as (
  select distinct i.candidate_key,i.media_type,i.tmdb_id,m.id as media_id
  from items i
  join public.media m
    on m.media_type=i.media_type
   and (
      public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=i.tmdb_id
      or (
        i.norm_title<>''
        and (
          lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g'))=i.norm_title
          or lower(regexp_replace(coalesce(m.raw_tmdb->>'title',''),'[^[:alnum:]]+','','g'))=i.norm_title
          or lower(regexp_replace(coalesce(m.raw_tmdb->>'name',''),'[^[:alnum:]]+','','g'))=i.norm_title
          or lower(regexp_replace(coalesce(m.raw_tmdb->>'original_title',''),'[^[:alnum:]]+','','g'))=i.norm_title
          or lower(regexp_replace(coalesce(m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=i.norm_title
        )
        and (
          coalesce(i.release_year,0)=0
          or coalesce(m.release_year,0)=0
          or m.release_year=i.release_year
        )
      )
   )
),
state as (
  select i.candidate_key,
    exists(
      select 1
      from matched mm
      join public.media_overrides mo on mo.media_id=mm.media_id
      cross join me
      where mm.candidate_key=i.candidate_key
        and mo.profile_id=me.uid
        and mo.state in ('AddedToWatchlist','WatchLater')
    ) as is_watchlist,
    (
      exists(
        select 1
        from matched mm
        join public.watch_history wh on wh.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and wh.profile_id=me.uid
          and wh.item_type in ('episode','movie')
      )
      or exists(
        select 1
        from matched mm
        join public.episode_progress ep on ep.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and ep.profile_id=me.uid
          and ep.watched=true
      )
      or exists(
        select 1
        from matched mm
        join public.media_overrides mo on mo.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and mo.profile_id=me.uid
          and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')
      )
    ) as is_seen,
    exists(
      select 1
      from matched mm
      join public.media_overrides mo on mo.media_id=mm.media_id
      cross join me
      where mm.candidate_key=i.candidate_key
        and mo.profile_id=me.uid
        and mo.state='NotInterested'
    ) as is_not_interested
  from items i
),
final as (
  select
    candidate_key,
    is_watchlist,
    is_seen,
    is_not_interested,
    (is_watchlist or is_seen or is_not_interested) as is_blocked
  from state
)
select jsonb_build_object(
  'blocked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_blocked),'[]'::jsonb),
  'watch_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_watchlist),'[]'::jsonb),
  'seen_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_seen),'[]'::jsonb),
  'not_interested_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_not_interested),'[]'::jsonb),
  'checked_count',(select count(*) from items),
  'blocked_count',(select count(*) from final where is_blocked),
  'generated_at',now()
);
$$;

revoke execute on function public.cinetracker_discover_filter_v320(jsonb) from public,anon;
grant execute on function public.cinetracker_discover_filter_v320(jsonb) to authenticated;

create or replace function public.cinetracker_activity_by_day_v320(
  p_days integer default 15,
  p_tz text default 'America/Sao_Paulo'
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select
    greatest(1,least(coalesce(p_days,15),60))::integer as day_count,
    (now() at time zone coalesce(nullif(p_tz,''),'America/Sao_Paulo'))::date as today_date,
    auth.uid() as uid,
    coalesce(nullif(p_tz,''),'America/Sao_Paulo') as zone
),
date_days as (
  select generate_series(c.today_date-(c.day_count-1),c.today_date,interval '1 day')::date as day_key
  from cfg c
),
media_counts as (
  select
    (wh.watched_at at time zone c.zone)::date as day_key,
    count(*) filter(where wh.item_type='episode')::integer as episodes,
    count(*) filter(where wh.item_type='movie')::integer as movies
  from public.watch_history wh
  cross join cfg c
  where wh.profile_id=c.uid
    and wh.item_type in ('episode','movie')
    and wh.watched_at>=((c.today_date-(c.day_count-1))::timestamp at time zone c.zone)
    and wh.watched_at<((c.today_date+1)::timestamp at time zone c.zone)
  group by 1
),
sport_counts as (
  select
    (sh.watched_at at time zone c.zone)::date as day_key,
    count(*)::integer as sports
  from public.user_sport_watch_history sh
  cross join cfg c
  where sh.profile_id=c.uid
    and sh.watched_at>=((c.today_date-(c.day_count-1))::timestamp at time zone c.zone)
    and sh.watched_at<((c.today_date+1)::timestamp at time zone c.zone)
  group by 1
)
select coalesce(jsonb_agg(
  jsonb_build_object(
    'day',d.day_key,
    'episodes',coalesce(m.episodes,0),
    'movies',coalesce(m.movies,0),
    'sports',coalesce(s.sports,0),
    'count',coalesce(m.episodes,0)+coalesce(m.movies,0)+coalesce(s.sports,0)
  ) order by d.day_key
),'[]'::jsonb)
from date_days d
left join media_counts m using(day_key)
left join sport_counts s using(day_key);
$$;

revoke execute on function public.cinetracker_activity_by_day_v320(integer,text) from public,anon;
grant execute on function public.cinetracker_activity_by_day_v320(integer,text) to authenticated;

create or replace function public.cinetracker_activity_items_by_day_v320(
  p_day date,
  p_tz text default 'America/Sao_Paulo'
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select auth.uid() as uid,
         coalesce(nullif(p_tz,''),'America/Sao_Paulo') as zone,
         p_day as target_date
),
dashboard as materialized (
  select d.*,
         public.cinetracker_effective_tmdb_id(d.tmdb_id,d.raw_tmdb) as effective_tmdb_id,
         case when d.media_type='tv'
           then public.cinetracker_released_episodes_v0997(d.raw_tmdb,d.total_episodes,d.watched_episodes,(select target_date from cfg))
           else 0 end as released_episodes
  from public.cinetracker_profile_media_dashboard_v0991() d
),
media_rows as (
  select
    wh.id::bigint as sort_id,
    wh.watched_at,
    wh.item_type,
    wh.season_number,
    wh.episode_number,
    coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    m.id as media_id,
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,
    m.title as media_title,
    m.poster_path,
    coalesce(wh.title,m.title) as title,
    coalesce(m.release_year,0)::integer as release_year,
    coalesce(nullif(m.raw_tmdb->>'vote_average','')::numeric,0) as vote_average,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$'
      then greatest(1,(wh.external_ids->>'plays')::integer)
      else 1 end as plays,
    case when m.media_type='tv'
      then greatest(0,coalesce(d.released_episodes,0)-coalesce(d.watched_episodes,0))
      else 0 end::integer as remaining_episodes,
    'home_history'::text as source_kind
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  cross join cfg c
  left join dashboard d
    on d.media_type=m.media_type
   and d.effective_tmdb_id=public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)
  where wh.profile_id=c.uid
    and wh.item_type in ('episode','movie')
    and wh.watched_at>=(c.target_date::timestamp at time zone c.zone)
    and wh.watched_at<((c.target_date+1)::timestamp at time zone c.zone)
),
sport_rows as (
  select
    sh.id::bigint as sort_id,
    sh.watched_at,
    'sport'::text as item_type,
    null::integer as season_number,
    null::integer as episode_number,
    coalesce(sh.duration_minutes,0)::integer as runtime_minutes,
    null::bigint as media_id,
    null::text as media_type,
    null::integer as tmdb_id,
    se.title as media_title,
    se.image_url as poster_path,
    se.title as title,
    extract(year from sh.watched_at)::integer as release_year,
    0::numeric as vote_average,
    1::integer as plays,
    0::integer as remaining_episodes,
    'sport'::text as source_kind
  from public.user_sport_watch_history sh
  join public.sport_events se on se.id=sh.event_id
  cross join cfg c
  where sh.profile_id=c.uid
    and sh.watched_at>=(c.target_date::timestamp at time zone c.zone)
    and sh.watched_at<((c.target_date+1)::timestamp at time zone c.zone)
),
all_rows as (
  select * from media_rows
  union all
  select * from sport_rows
)
select coalesce(jsonb_agg(to_jsonb(a) order by a.watched_at desc,a.sort_id desc),'[]'::jsonb)
from all_rows a;
$$;

revoke execute on function public.cinetracker_activity_items_by_day_v320(date,text) from public,anon;
grant execute on function public.cinetracker_activity_items_by_day_v320(date,text) to authenticated;

notify pgrst,'reload schema';
