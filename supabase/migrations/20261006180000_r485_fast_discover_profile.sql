-- CineTracker Web r485 — direct fast authorities for Descobrir and Perfil.

create or replace function public.cinetracker_discover_fresh_v485(
  p_kind text,
  p_limit integer default 48
)
returns jsonb
language sql
volatile
security invoker
set search_path=public
as $$
with cfg as (
  select lower(coalesce(p_kind,'movie')) as kind,
         least(greatest(coalesce(p_limit,48),1),48)::int as lim
), known_ids as materialized (
  select mo.media_id from public.media_overrides mo
  where mo.profile_id=auth.uid()
    and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate','Liked')
  union
  select wh.media_id from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id is not null
  union
  select ep.media_id from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true
  union
  select pe.media_id from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.media_id is not null
), candidates as materialized (
  select
    m.id as media_id,m.tmdb_id,m.media_type,m.media_kind,m.title,m.poster_path,m.release_year,
    coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    coalesce(m.genres,'[]'::jsonb) as genres,coalesce(m.raw_tmdb,'{}'::jsonb) as raw_tmdb,
    sr.shown_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end as vote_average,
    lower(concat_ws(' ',
      coalesce(m.title,''),coalesce(m.original_title,''),coalesce(m.media_kind,''),
      coalesce(m.raw_tmdb->>'title',''),coalesce(m.raw_tmdb->>'name',''),
      coalesce(m.raw_tmdb->>'original_title',''),coalesce(m.raw_tmdb->>'original_name',''),
      coalesce(m.raw_tmdb->>'overview',''),coalesce(m.raw_tmdb->>'tagline',''),
      coalesce(m.raw_tmdb->'genres','[]'::jsonb)::text,
      coalesce(m.raw_tmdb->'keywords','[]'::jsonb)::text,
      coalesce(m.raw_tmdb->'production_companies','[]'::jsonb)::text
    )) as searchable
  from cfg
  join public.media m on (
    (cfg.kind='movie' and m.media_type='movie')
    or (cfg.kind='anime' and m.media_type='tv' and m.media_kind='anime')
    or (cfg.kind='series' and m.media_type='tv' and coalesce(m.media_kind,'series')<>'anime')
  )
  left join public.shown_recommendations sr
    on sr.user_id=auth.uid() and sr.media_type=m.media_type
   and sr.tmdb_id=coalesce(nullif(m.tmdb_id,0),
     case when coalesce(m.raw_tmdb->>'id','') ~ '^[0-9]+$' then (m.raw_tmdb->>'id')::integer else 0 end)
  where not exists (select 1 from known_ids k where k.media_id=m.id)
), eligible as materialized (
  select c.* from candidates c
  where c.searchable !~ '(^|[^[:alnum:]])(wwe|world wrestling entertainment|nxt|monday night raw|friday night smackdown|smackdown|wrestlemania|royal rumble|summerslam|survivor series|money in the bank|elimination chamber)([^[:alnum:]]|$)'
    and c.searchable !~ '(^|[^[:alnum:]])(youtube|youtube originals?|youtube premium)([^[:alnum:]]|$)'
    and c.searchable !~ '(^|[^[:alnum:]])(reality|reality show|reality tv)([^[:alnum:]]|$)'
    and c.searchable !~ '(^|[^[:alnum:]])stand[ -]?up([^[:alnum:]]|$)'
    and c.searchable not like '%comedy special%'
    and c.searchable not like '%comedy concert%'
    and c.searchable not like '%live comedy%'
    and c.searchable not like '%especial de comedia%'
    and c.searchable not like '%especial de comédia%'
    and c.searchable not like '%show de comedia%'
    and c.searchable not like '%show de comédia%'
    and (c.media_type<>'movie' or c.runtime_minutes>=40)
), picked as (
  select * from eligible
  order by case when shown_at is null or shown_at < now()-interval '7 days' then 0 else 1 end asc,
           shown_at asc nulls first,vote_average desc,random()
  limit (select lim from cfg)
)
select coalesce(jsonb_agg(jsonb_build_object(
  'media_id',media_id,'tmdb_id',tmdb_id,'media_type',media_type,'media_kind',media_kind,
  'title',title,'poster_path',poster_path,'release_year',release_year,
  'runtime_minutes',runtime_minutes,'genres',genres,'raw_tmdb',raw_tmdb,'__ct485_strict',true
)),'[]'::jsonb) from picked;
$$;

create or replace function public.cinetracker_discover_watch_smart_v485(
  p_kind text,
  p_limit integer default 30
)
returns jsonb
language sql
volatile
security invoker
set search_path=public
as $$
with cfg as (
  select lower(coalesce(p_kind,'movie')) as kind,
         least(greatest(coalesce(p_limit,30),1),30)::int as lim
), watch_ids as materialized (
  select mo.media_id,max(coalesce(mo.updated_at,mo.created_at)) as added_at
  from public.media_overrides mo
  where mo.profile_id=auth.uid() and mo.state in ('AddedToWatchlist','WatchLater')
  group by mo.media_id
), seen_ids as materialized (
  select mo.media_id from public.media_overrides mo
  where mo.profile_id=auth.uid() and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')
  union
  select wh.media_id from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id is not null
  union
  select ep.media_id from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true
  union
  select pe.media_id from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.media_id is not null
), candidates as materialized (
  select
    m.id as media_id,m.tmdb_id,m.media_type,m.media_kind,m.title,m.poster_path,m.release_year,
    coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    coalesce(m.genres,'[]'::jsonb) as genres,coalesce(m.raw_tmdb,'{}'::jsonb) as raw_tmdb,
    w.added_at,sr.shown_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end as vote_average,
    lower(concat_ws(' ',
      coalesce(m.title,''),coalesce(m.original_title,''),coalesce(m.media_kind,''),
      coalesce(m.raw_tmdb->>'title',''),coalesce(m.raw_tmdb->>'name',''),
      coalesce(m.raw_tmdb->>'original_title',''),coalesce(m.raw_tmdb->>'original_name',''),
      coalesce(m.raw_tmdb->>'overview',''),coalesce(m.raw_tmdb->>'tagline',''),
      coalesce(m.raw_tmdb->'genres','[]'::jsonb)::text,
      coalesce(m.raw_tmdb->'keywords','[]'::jsonb)::text,
      coalesce(m.raw_tmdb->'production_companies','[]'::jsonb)::text
    )) as searchable
  from cfg
  join watch_ids w on true
  join public.media m on m.id=w.media_id and (
    (cfg.kind='movie' and m.media_type='movie')
    or (cfg.kind='anime' and m.media_type='tv' and m.media_kind='anime')
    or (cfg.kind='series' and m.media_type='tv' and coalesce(m.media_kind,'series')<>'anime')
  )
  left join public.shown_recommendations sr
    on sr.user_id=auth.uid() and sr.media_type=m.media_type
   and sr.tmdb_id=coalesce(nullif(m.tmdb_id,0),
     case when coalesce(m.raw_tmdb->>'id','') ~ '^[0-9]+$' then (m.raw_tmdb->>'id')::integer else 0 end)
  where not exists (select 1 from seen_ids s where s.media_id=m.id)
), eligible as materialized (
  select c.* from candidates c
  where c.searchable !~ '(^|[^[:alnum:]])(wwe|world wrestling entertainment|nxt|monday night raw|friday night smackdown|smackdown|wrestlemania|royal rumble|summerslam|survivor series|money in the bank|elimination chamber)([^[:alnum:]]|$)'
    and c.searchable !~ '(^|[^[:alnum:]])(youtube|youtube originals?|youtube premium)([^[:alnum:]]|$)'
    and c.searchable !~ '(^|[^[:alnum:]])(reality|reality show|reality tv)([^[:alnum:]]|$)'
    and c.searchable !~ '(^|[^[:alnum:]])stand[ -]?up([^[:alnum:]]|$)'
    and c.searchable not like '%comedy special%'
    and c.searchable not like '%comedy concert%'
    and c.searchable not like '%live comedy%'
    and c.searchable not like '%especial de comedia%'
    and c.searchable not like '%especial de comédia%'
    and c.searchable not like '%show de comedia%'
    and c.searchable not like '%show de comédia%'
    and (c.media_type<>'movie' or c.runtime_minutes>=40)
), picked as (
  select * from eligible
  order by case when shown_at is null or shown_at < now()-interval '7 days' then 0 else 1 end asc,
           shown_at asc nulls first,vote_average desc,added_at desc nulls last,random()
  limit (select lim from cfg)
)
select coalesce(jsonb_agg(jsonb_build_object(
  'media_id',media_id,'tmdb_id',tmdb_id,'media_type',media_type,'media_kind',media_kind,
  'title',title,'poster_path',poster_path,'release_year',release_year,
  'runtime_minutes',runtime_minutes,'genres',genres,'raw_tmdb',raw_tmdb,'__ct485_smart_watch',true
)),'[]'::jsonb) from picked;
$$;

create or replace function public.cinetracker_profile_lists_v485()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with states as materialized (
  select mo.media_id,
    bool_or(mo.state='Liked') as is_favorite,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) as is_watchlist,
    bool_or(mo.state='Completed') as is_completed,
    bool_or(mo.state='InProgress') as is_in_progress,
    bool_or(mo.state='UpToDate') as is_up_to_date,
    bool_or(mo.state='AlreadySeen') as is_already_seen,
    max(mo.watched_at) as last_override_watch,
    max(coalesce(mo.updated_at,mo.created_at)) as state_updated_at
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
  group by mo.media_id
), series_events as materialized (
  select wh.media_id,wh.season_number,wh.episode_number,wh.watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.media_id is not null
  union all
  select ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at)
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true
), series_activity as materialized (
  select media_id,count(distinct (season_number,episode_number))::bigint as watched_episodes,max(watched_at) as last_watched_at
  from series_events
  where coalesce(season_number,0)>0 and coalesce(episode_number,0)>0
  group by media_id
), movie_events as materialized (
  select wh.media_id,wh.watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.item_type='movie' and wh.media_id is not null
  union all
  select pe.media_id,pe.played_at
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.item_type='movie' and pe.media_id is not null
), movie_activity as materialized (
  select media_id,max(watched_at) as last_watched_at from movie_events group by media_id
), ids as materialized (
  select media_id from states
  union select media_id from series_activity
  union select media_id from movie_activity
), base as materialized (
  select
    m.id as media_id,m.media_type,m.media_kind,
    coalesce(nullif(m.tmdb_id,0),
      case when coalesce(m.raw_tmdb->>'id','') ~ '^[0-9]+$' then (m.raw_tmdb->>'id')::integer else 0 end) as tmdb_id,
    m.title,m.poster_path,m.release_year,
    coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    coalesce(m.total_episodes,0)::integer as total_episodes,
    coalesce(sa.watched_episodes,0)::bigint as watched_episodes,
    greatest(sa.last_watched_at,ma.last_watched_at,s.last_override_watch) as last_watched_at,
    coalesce(s.is_favorite,false) as is_favorite,
    coalesce(s.is_watchlist,false) as is_watchlist,
    coalesce(s.is_in_progress,false) as is_in_progress,
    coalesce(s.is_up_to_date,false) as is_up_to_date,
    coalesce(s.is_completed,false) as is_completed,
    case when m.media_type='movie'
      then (ma.media_id is not null or coalesce(s.is_already_seen,false) or coalesce(s.is_completed,false))
      else coalesce(sa.watched_episodes,0)>0
    end as is_seen,
    s.state_updated_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end as vote_average,
    nullif(m.raw_tmdb->>'release_date','') as release_date,
    nullif(m.raw_tmdb->>'first_air_date','') as first_air_date,
    coalesce(m.raw_tmdb,'{}'::jsonb) as raw_tmdb
  from ids i join public.media m on m.id=i.media_id
  left join states s on s.media_id=m.id
  left join series_activity sa on sa.media_id=m.id
  left join movie_activity ma on ma.media_id=m.id
), series_rows as materialized (
  select * from base where media_type='tv' and watched_episodes>0
), movie_rows as materialized (
  select * from base where media_type='movie' and is_seen
), series_favorite_rows as materialized (
  select * from base where media_type='tv' and is_favorite
), movie_favorite_rows as materialized (
  select * from base where media_type='movie' and is_favorite
), actors as materialized (
  select fa.id,fa.tmdb_person_id,fa.actor_name,fa.profile_path,fa.created_at
  from public.favorite_actors fa where fa.user_id=auth.uid()
)
select jsonb_build_object(
  'series',coalesce((select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc) from series_rows x),'[]'::jsonb),
  'movies',coalesce((select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc) from movie_rows x),'[]'::jsonb),
  'series_favorites',coalesce((select jsonb_agg(to_jsonb(x) order by x.state_updated_at desc nulls last,x.media_id desc) from series_favorite_rows x),'[]'::jsonb),
  'movie_favorites',coalesce((select jsonb_agg(to_jsonb(x) order by x.state_updated_at desc nulls last,x.media_id desc) from movie_favorite_rows x),'[]'::jsonb),
  'actors',coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc,a.id desc) from actors a),'[]'::jsonb),
  'counts',jsonb_build_object(
    'series',(select count(*) from series_rows),'movies',(select count(*) from movie_rows),
    'series_favorites',(select count(*) from series_favorite_rows),
    'movie_favorites',(select count(*) from movie_favorite_rows),'actors',(select count(*) from actors)
  ),
  'source','v485-direct'
);
$$;

revoke all on function public.cinetracker_discover_fresh_v485(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v485(text,integer) to authenticated;
revoke all on function public.cinetracker_discover_watch_smart_v485(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_watch_smart_v485(text,integer) to authenticated;
revoke all on function public.cinetracker_profile_lists_v485() from public,anon;
grant execute on function public.cinetracker_profile_lists_v485() to authenticated;

notify pgrst,'reload schema';
