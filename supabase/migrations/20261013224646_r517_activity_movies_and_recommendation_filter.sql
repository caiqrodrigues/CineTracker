CREATE OR REPLACE FUNCTION public.cinetracker_activity_by_day_v517(p_days integer DEFAULT 15, p_tz text DEFAULT 'America/Sao_Paulo'::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select greatest(1,least(coalesce(p_days,15),60))::int as num_days,
         coalesce(nullif(trim(p_tz),''),'America/Sao_Paulo') as tz
),
calendar as (
  select generate_series(
    (current_timestamp at time zone (select tz from cfg))::date - ((select num_days from cfg)-1),
    (current_timestamp at time zone (select tz from cfg))::date,
    interval '1 day'
  )::date as d
),
media_events as materialized (
  select (pe.played_at at time zone (select tz from cfg))::date as d,
         case when pe.item_type='movie' then 'movie' else 'episode' end as item_type
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid()
    and pe.item_type in ('movie','episode')
    and (pe.played_at at time zone (select tz from cfg))::date >= (select min(d) from calendar)
  union all
  select (wh.watched_at at time zone (select tz from cfg))::date as d,
         case when wh.item_type='movie' then 'movie' else 'episode' end as item_type
  from public.watch_history wh
  where wh.profile_id=auth.uid()
    and wh.item_type in ('movie','episode')
    and (wh.watched_at at time zone (select tz from cfg))::date >= (select min(d) from calendar)
    and not coalesce(wh.external_ids ? 'v0994_managed',false)
),
media_daily as (
  select d,
         count(*) filter(where item_type='episode')::int as episodes,
         count(*) filter(where item_type='movie')::int as movies
  from media_events group by d
),
sports_daily as (
  select (coalesce(h.watched_at,h.created_at) at time zone (select tz from cfg))::date as d,
         count(*)::int as sports
  from public.user_sport_watch_history h
  where h.profile_id=auth.uid()
    and (coalesce(h.watched_at,h.created_at) at time zone (select tz from cfg))::date >= (select min(d) from calendar)
  group by 1
)
select coalesce(jsonb_agg(jsonb_build_object(
  'day',to_char(c.d,'YYYY-MM-DD'),
  'episodes',coalesce(m.episodes,0),
  'movies',coalesce(m.movies,0),
  'sports',coalesce(s.sports,0),
  'count',coalesce(m.episodes,0)+coalesce(m.movies,0)+coalesce(s.sports,0)
) order by c.d),'[]'::jsonb)
from calendar c
left join media_daily m on m.d=c.d
left join sports_daily s on s.d=c.d;
$function$

revoke all on function public.cinetracker_activity_by_day_v517(integer,text) from public,anon;
grant execute on function public.cinetracker_activity_by_day_v517(integer,text) to authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_recommendation_filter_v517(p_items jsonb)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with me as (select auth.uid() as uid),
items as (
  select
    case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end as media_type,
    x.tmdb_id,
    nullif(trim(x.title),'') as title,
    x.release_year,
    case when lower(coalesce(x.media_type,''))='movie' then 'movie:'||x.tmdb_id::text else 'tv:'||x.tmdb_id::text end as candidate_key,
    public.cinetracker_norm_title_v1(coalesce(x.title,'')) as norm_title
  from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb))
    as x(media_type text,tmdb_id integer,title text,release_year integer)
  where coalesce(x.tmdb_id,0)>0
),
matched as materialized (
  select distinct i.candidate_key,m.id as media_id
  from items i
  join public.media m
    on m.media_type=i.media_type
   and (
     public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=i.tmdb_id
     or (
       i.norm_title<>''
       and i.norm_title in (
         public.cinetracker_norm_title_v1(coalesce(m.title,'')),
         public.cinetracker_norm_title_v1(coalesce(m.original_title,'')),
         public.cinetracker_norm_title_v1(coalesce(m.raw_tmdb->>'title','')),
         public.cinetracker_norm_title_v1(coalesce(m.raw_tmdb->>'name','')),
         public.cinetracker_norm_title_v1(coalesce(m.raw_tmdb->>'original_title','')),
         public.cinetracker_norm_title_v1(coalesce(m.raw_tmdb->>'original_name',''))
       )
       and (coalesce(i.release_year,0)=0 or coalesce(m.release_year,0)=0 or m.release_year=i.release_year)
     )
   )
),
state as (
  select i.candidate_key,
    exists(
      select 1 from matched mm
      join public.media_overrides mo on mo.media_id=mm.media_id
      cross join me
      where mm.candidate_key=i.candidate_key
        and mo.profile_id=me.uid
        and mo.state in ('AddedToWatchlist','WatchLater')
    ) as is_watchlist,
    (
      exists(
        select 1 from matched mm
        join public.watch_play_events_v0994 pe on pe.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and pe.profile_id=me.uid
          and pe.item_type in ('episode','movie')
      )
      or exists(
        select 1 from matched mm
        join public.watch_history wh on wh.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and wh.profile_id=me.uid
          and wh.item_type in ('episode','movie')
      )
      or exists(
        select 1 from matched mm
        join public.episode_progress ep on ep.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and ep.profile_id=me.uid and ep.watched=true
      )
      or exists(
        select 1 from matched mm
        join public.media_overrides mo on mo.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and mo.profile_id=me.uid
          and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')
      )
    ) as is_seen,
    exists(
      select 1 from matched mm
      join public.media_overrides mo on mo.media_id=mm.media_id
      cross join me
      where mm.candidate_key=i.candidate_key
        and mo.profile_id=me.uid and mo.state='NotInterested'
    ) as is_not_interested
  from items i
),
final as (
  select candidate_key,is_watchlist,is_seen,is_not_interested,
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
  'source','v517-play-events+alias-safe',
  'generated_at',now()
);
$function$

revoke all on function public.cinetracker_recommendation_filter_v517(jsonb) from public,anon;
grant execute on function public.cinetracker_recommendation_filter_v517(jsonb) to authenticated;
notify pgrst,'reload schema';
