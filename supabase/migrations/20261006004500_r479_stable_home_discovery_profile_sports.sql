-- CineTracker Web r479 — strict discovery memory, history-only Profile lists and professional-only Sports.

create or replace function public.cinetracker_discover_fresh_v479(
  p_kind text,
  p_limit integer default 48
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select lower(coalesce(p_kind,'movie')) as kind,
         least(greatest(coalesce(p_limit,48),1),48)::int as lim
), source as materialized (
  select
    x.item,
    x.ord,
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id,
    sr.shown_at
  from cfg
  cross join lateral jsonb_array_elements(public.cinetracker_discover_fresh_v476(cfg.kind,48)) with ordinality x(item,ord)
  join public.media m on m.id=(x.item->>'media_id')::bigint
  left join public.shown_recommendations sr
    on sr.user_id=auth.uid()
   and sr.media_type=m.media_type
   and sr.tmdb_id=public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)
), ranked as (
  select *,
    case when shown_at is null or shown_at < now()-interval '7 days' then 0 else 1 end as recent_penalty
  from source
), picked as (
  select *
  from ranked
  order by
    recent_penalty asc,
    shown_at asc nulls first,
    mod(abs(hashtextextended(coalesce(tmdb_id,ord)::text||current_date::text,0)),100000),
    ord
  limit (select lim from cfg)
)
select coalesce(
  jsonb_agg(
    item || jsonb_build_object(
      '__ct479_strict',true,
      '__ct479_recent_penalty',recent_penalty
    )
    order by
      recent_penalty asc,
      shown_at asc nulls first,
      mod(abs(hashtextextended(coalesce(tmdb_id,ord)::text||current_date::text,0)),100000),
      ord
  ),
  '[]'::jsonb
)
from picked;
$$;

create or replace function public.cinetracker_discover_watch_smart_v479(
  p_kind text,
  p_limit integer default 30
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select lower(coalesce(p_kind,'movie')) as kind,
         least(greatest(coalesce(p_limit,30),1),30)::int as lim
), source as materialized (
  select
    x.item,
    x.ord,
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id,
    sr.shown_at
  from cfg
  cross join lateral jsonb_array_elements(public.cinetracker_discover_watch_smart_v476(cfg.kind,30)) with ordinality x(item,ord)
  join public.media m on m.id=(x.item->>'media_id')::bigint
  left join public.shown_recommendations sr
    on sr.user_id=auth.uid()
   and sr.media_type=m.media_type
   and sr.tmdb_id=public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)
), ranked as (
  select *,
    case when shown_at is null or shown_at < now()-interval '7 days' then 0 else 1 end as recent_penalty
  from source
), picked as (
  select *
  from ranked
  order by
    recent_penalty asc,
    shown_at asc nulls first,
    ord
  limit (select lim from cfg)
)
select coalesce(
  jsonb_agg(
    item || jsonb_build_object(
      '__ct479_smart_watch',true,
      '__ct479_recent_penalty',recent_penalty
    )
    order by recent_penalty asc,shown_at asc nulls first,ord
  ),
  '[]'::jsonb
)
from picked;
$$;

create or replace function public.cinetracker_record_recommendations_v479(p_items jsonb)
returns jsonb
language plpgsql
volatile
security invoker
set search_path=public
as $$
declare
  v_uid uuid:=auth.uid();
  v_count integer:=0;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;

  with src as (
    select
      case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end as media_type,
      x.tmdb_id,
      nullif(trim(x.title),'') as title
    from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb))
      as x(media_type text,tmdb_id bigint,title text)
    where coalesce(x.tmdb_id,0)>0
  ), upserted as (
    insert into public.shown_recommendations(user_id,media_type,tmdb_id,title,shown_at)
    select v_uid,media_type,tmdb_id,title,now()
    from src
    on conflict(user_id,media_type,tmdb_id)
    do update set
      title=coalesce(excluded.title,public.shown_recommendations.title),
      shown_at=excluded.shown_at
    returning 1
  )
  select count(*)::integer into v_count from upserted;

  return jsonb_build_object('recorded',v_count,'shown_at',now());
end;
$$;

create or replace function public.cinetracker_profile_lists_v479()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with states as materialized (
  select
    mo.media_id,
    bool_or(mo.state='Liked') as is_favorite,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) as is_watchlist,
    max(coalesce(mo.updated_at,mo.created_at)) as state_updated_at
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
  group by mo.media_id
), episode_events as materialized (
  select wh.media_id,wh.season_number,wh.episode_number,wh.watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid()
    and wh.item_type='episode'
    and wh.media_id is not null
    and coalesce(wh.season_number,0)>0
    and coalesce(wh.episode_number,0)>0
  union
  select ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at)
  from public.episode_progress ep
  where ep.profile_id=auth.uid()
    and ep.watched=true
    and coalesce(ep.season_number,0)>0
    and coalesce(ep.episode_number,0)>0
  union
  select pe.media_id,pe.season_number,pe.episode_number,pe.played_at
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid()
    and pe.item_type='episode'
    and pe.media_id is not null
    and coalesce(pe.season_number,0)>0
    and coalesce(pe.episode_number,0)>0
), episode_history as materialized (
  select
    media_id,
    count(distinct (season_number,episode_number))::bigint as watched_episodes,
    max(watched_at) as last_watched_at
  from episode_events
  group by media_id
), movie_events as materialized (
  select wh.media_id,wh.watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid()
    and wh.item_type='movie'
    and wh.media_id is not null
  union all
  select pe.media_id,pe.played_at
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid()
    and pe.item_type='movie'
    and pe.media_id is not null
), movie_history as materialized (
  select media_id,max(watched_at) as last_watched_at
  from movie_events
  group by media_id
), ids as materialized (
  select media_id from states
  union select media_id from episode_history
  union select media_id from movie_history
), base as materialized (
  select
    m.id as media_id,
    m.media_type,
    m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer as tmdb_id,
    m.title,
    m.poster_path,
    m.release_year,
    coalesce(m.runtime_minutes,0)::integer as runtime_minutes,
    coalesce(m.total_episodes,0)::integer as total_episodes,
    coalesce(e.watched_episodes,0)::bigint as watched_episodes,
    case when m.media_type='tv' then e.last_watched_at else mh.last_watched_at end as last_watched_at,
    coalesce(s.is_favorite,false) as is_favorite,
    coalesce(s.is_watchlist,false) as is_watchlist,
    (e.media_id is not null and coalesce(e.watched_episodes,0)>0) as has_series_history,
    (mh.media_id is not null) as has_movie_history,
    s.state_updated_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end as vote_average,
    nullif(m.raw_tmdb->>'release_date','') as release_date,
    nullif(m.raw_tmdb->>'first_air_date','') as first_air_date,
    m.raw_tmdb
  from ids i
  join public.media m on m.id=i.media_id
  left join states s on s.media_id=m.id
  left join episode_history e on e.media_id=m.id
  left join movie_history mh on mh.media_id=m.id
), series_rows as materialized (
  select * from base
  where media_type='tv'
    and has_series_history
    and last_watched_at is not null
), movie_rows as materialized (
  select * from base
  where media_type='movie'
    and has_movie_history
    and last_watched_at is not null
), series_favorite_rows as materialized (
  select * from base where media_type='tv' and is_favorite
), movie_favorite_rows as materialized (
  select * from base where media_type='movie' and is_favorite
), actors as materialized (
  select fa.id,fa.tmdb_person_id,fa.actor_name,fa.profile_path,fa.created_at
  from public.favorite_actors fa
  where fa.user_id=auth.uid()
)
select jsonb_build_object(
  'series',coalesce((
    select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc,x.media_id desc)
    from series_rows x
  ),'[]'::jsonb),
  'movies',coalesce((
    select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc,x.media_id desc)
    from movie_rows x
  ),'[]'::jsonb),
  'series_favorites',coalesce((
    select jsonb_agg(to_jsonb(x) order by x.state_updated_at desc nulls last,x.media_id desc)
    from series_favorite_rows x
  ),'[]'::jsonb),
  'movie_favorites',coalesce((
    select jsonb_agg(to_jsonb(x) order by x.state_updated_at desc nulls last,x.media_id desc)
    from movie_favorite_rows x
  ),'[]'::jsonb),
  'actors',coalesce((
    select jsonb_agg(to_jsonb(a) order by a.created_at desc,a.id desc)
    from actors a
  ),'[]'::jsonb),
  'counts',jsonb_build_object(
    'series',(select count(*) from series_rows),
    'movies',(select count(*) from movie_rows),
    'series_favorites',(select count(*) from series_favorite_rows),
    'movie_favorites',(select count(*) from movie_favorite_rows),
    'actors',(select count(*) from actors)
  )
);
$$;

create or replace function public.cinetracker_is_youth_sport_v479(
  p_title text,
  p_competition text,
  p_home text,
  p_away text
)
returns boolean
language sql
immutable
security invoker
set search_path=public
as $$
  select lower(concat_ws(' ',
    coalesce(p_title,''),
    coalesce(p_competition,''),
    coalesce(p_home,''),
    coalesce(p_away,'')
  )) ~ '(^|[^a-z0-9])(u|sub|under)[ -]?(1[4-9]|2[0-3])([^a-z0-9]|$)';
$$;

create or replace function public.cinetracker_sports_payload_v479(
  p_from timestamptz default date_trunc('day',now()),
  p_to timestamptz default date_trunc('day',now())+interval '8 days'
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with b as (
  select public.cinetracker_sports_payload_v1(p_from,p_to) as payload
), ev as (
  select e.item,e.ord
  from b
  cross join lateral jsonb_array_elements(coalesce(b.payload->'events','[]'::jsonb)) with ordinality e(item,ord)
  where not public.cinetracker_is_youth_sport_v479(
    e.item->>'title',e.item->>'competition_name',e.item->>'home_name',e.item->>'away_name'
  )
), wh as (
  select e.item,e.ord
  from b
  cross join lateral jsonb_array_elements(coalesce(b.payload->'watch_history','[]'::jsonb)) with ordinality e(item,ord)
  where not public.cinetracker_is_youth_sport_v479(
    e.item->>'title',e.item->>'competition_name',e.item->>'home_name',e.item->>'away_name'
  )
)
select
  (payload - 'events' - 'watch_history')
  || jsonb_build_object(
    'events',coalesce((select jsonb_agg(item order by ord) from ev),'[]'::jsonb),
    'watch_history',coalesce((select jsonb_agg(item order by ord) from wh),'[]'::jsonb),
    'source','v479-professional-only'
  )
from b;
$$;

create or replace function public.cinetracker_sports_events_v479(
  p_favorite_only boolean default false,
  p_limit integer default 120,
  p_offset integer default 0,
  p_scope text default 'today'
)
returns table(
  id bigint,event_id bigint,sport_slug text,provider text,provider_event_id text,title text,
  starts_at timestamptz,ends_at timestamptz,status text,season text,round text,venue text,
  home_score text,away_score text,image_url text,participants jsonb,
  competition_id bigint,competition_name text,competition_logo text,
  home_id bigint,home_name text,home_logo text,away_id bigint,away_name text,away_logo text,
  has_favorite boolean,is_watched boolean,sport_watched_at timestamptz,watched_duration_minutes integer
)
language sql
stable
security invoker
set search_path=public
as $$
  select e.*
  from public.cinetracker_sports_events_v0997(p_favorite_only,p_limit,p_offset,p_scope) e
  where not public.cinetracker_is_youth_sport_v479(e.title,e.competition_name,e.home_name,e.away_name);
$$;

create or replace function public.cinetracker_sport_favorite_events_v479(
  p_entity_id bigint,
  p_from date default current_date-30,
  p_to date default current_date+14
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with b as (
  select public.cinetracker_sport_favorite_events_v2(p_entity_id,p_from,p_to) as payload
), ev as (
  select e.item,e.ord
  from b
  cross join lateral jsonb_array_elements(coalesce(b.payload->'events','[]'::jsonb)) with ordinality e(item,ord)
  where not public.cinetracker_is_youth_sport_v479(
    e.item->>'title',e.item->>'competition_name',e.item->>'home_name',e.item->>'away_name'
  )
)
select (payload-'events')
  || jsonb_build_object('events',coalesce((select jsonb_agg(item order by ord) from ev),'[]'::jsonb),'source','v479-professional-only')
from b;
$$;

revoke all on function public.cinetracker_discover_fresh_v479(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v479(text,integer) to authenticated;
revoke all on function public.cinetracker_discover_watch_smart_v479(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_watch_smart_v479(text,integer) to authenticated;
revoke all on function public.cinetracker_record_recommendations_v479(jsonb) from public,anon;
grant execute on function public.cinetracker_record_recommendations_v479(jsonb) to authenticated;
revoke all on function public.cinetracker_profile_lists_v479() from public,anon;
grant execute on function public.cinetracker_profile_lists_v479() to authenticated;
revoke all on function public.cinetracker_is_youth_sport_v479(text,text,text,text) from public,anon;
grant execute on function public.cinetracker_is_youth_sport_v479(text,text,text,text) to authenticated;
revoke all on function public.cinetracker_sports_payload_v479(timestamptz,timestamptz) from public,anon;
grant execute on function public.cinetracker_sports_payload_v479(timestamptz,timestamptz) to authenticated;
revoke all on function public.cinetracker_sports_events_v479(boolean,integer,integer,text) from public,anon;
grant execute on function public.cinetracker_sports_events_v479(boolean,integer,integer,text) to authenticated;
revoke all on function public.cinetracker_sport_favorite_events_v479(bigint,date,date) from public,anon;
grant execute on function public.cinetracker_sport_favorite_events_v479(bigint,date,date) to authenticated;

notify pgrst,'reload schema';
