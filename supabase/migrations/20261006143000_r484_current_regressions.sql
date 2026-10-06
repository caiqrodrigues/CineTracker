-- CineTracker Web r484 — recover recommendations, recent-only F1 Home positioning and professional Sports.

create or replace function public.cinetracker_discover_fresh_v484(
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
), favorites as materialized (
  select distinct
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where mo.profile_id=auth.uid()
    and mo.state='Liked'
    and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
), source as materialized (
  select
    x.item,
    x.ord,
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id
  from cfg
  cross join lateral jsonb_array_elements(
    public.cinetracker_discover_fresh_v387(cfg.kind,96)
  ) with ordinality x(item,ord)
  join public.media m on m.id=(x.item->>'media_id')::bigint
  where public.cinetracker_recommendation_eligible_v421(
    m.media_type,m.media_kind,m.title,
    greatest(
      coalesce(m.runtime_minutes,0),
      case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$'
        then (m.raw_tmdb->>'runtime')::int else 0 end
    ),
    coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),
    m.raw_tmdb,true,(cfg.kind='movie')
  )
  and not public.cinetracker_is_wwe_v476(m.title,m.raw_tmdb)
  and not exists (
    select 1
    from favorites f
    where f.media_type=m.media_type
      and f.tmdb_id=public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)
  )
), picked as (
  select *
  from source
  order by ord
  limit (select lim from cfg)
)
select coalesce(
  jsonb_agg(
    item || jsonb_build_object('__ct484_fresh',true)
    order by ord
  ),
  '[]'::jsonb
)
from picked;
$$;

create or replace function public.cinetracker_discover_watch_smart_v484(
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
), watchlist as materialized (
  select
    mo.media_id,
    max(coalesce(mo.updated_at,mo.created_at)) as added_at
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
    and mo.state in ('AddedToWatchlist','WatchLater')
  group by mo.media_id
), seen_media as materialized (
  select mo.media_id
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
    and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')
  union
  select wh.media_id
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id is not null
  union
  select ep.media_id
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true
  union
  select pe.media_id
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.media_id is not null
), seen as materialized (
  select distinct
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id
  from seen_media s
  join public.media m on m.id=s.media_id
  where public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
), candidates as materialized (
  select distinct on (
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)
  )
    m.id as media_id,
    m.media_type,
    m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id,
    m.title,
    m.original_title,
    m.poster_path,
    m.release_year,
    m.runtime_minutes,
    m.genres,
    m.raw_tmdb,
    w.added_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end as vote_average
  from cfg
  join watchlist w on true
  join public.media m on m.id=w.media_id
  where public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
    and m.poster_path is not null
    and (
      (cfg.kind='movie' and m.media_type='movie')
      or (cfg.kind='series' and m.media_type='tv' and coalesce(m.media_kind,'series')<>'anime')
      or (cfg.kind='anime' and m.media_type='tv' and m.media_kind='anime')
    )
    and not exists (
      select 1 from seen s
      where s.media_type=m.media_type
        and s.tmdb_id=public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)
    )
    and public.cinetracker_recommendation_eligible_v421(
      m.media_type,m.media_kind,m.title,
      greatest(
        coalesce(m.runtime_minutes,0),
        case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$'
          then (m.raw_tmdb->>'runtime')::int else 0 end
      ),
      coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),
      m.raw_tmdb,true,(cfg.kind='movie')
    )
    and not public.cinetracker_is_wwe_v476(m.title,m.raw_tmdb)
  order by
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),
    w.added_at desc nulls last,
    m.updated_at desc nulls last,
    m.id desc
), ranked as materialized (
  select c.*,
    mod(
      abs(hashtextextended(c.tmdb_id::text||current_date::text,0)),
      100000
    ) as daily_rank
  from candidates c
), picked as (
  select *
  from ranked
  order by daily_rank,vote_average desc,added_at desc nulls last,tmdb_id desc
  limit (select lim from cfg)
)
select coalesce(
  jsonb_agg(
    jsonb_strip_nulls(jsonb_build_object(
      'media_id',p.media_id,
      'media_type',p.media_type,
      'media_kind',p.media_kind,
      'tmdb_id',p.tmdb_id,
      'id',p.tmdb_id,
      'title',case when p.media_type='movie' then p.title else null end,
      'name',case when p.media_type='tv' then p.title else null end,
      'original_title',case when p.media_type='movie'
        then coalesce(p.original_title,p.raw_tmdb->>'original_title') else null end,
      'original_name',case when p.media_type='tv'
        then coalesce(p.original_title,p.raw_tmdb->>'original_name') else null end,
      'poster_path',p.poster_path,
      'vote_average',p.vote_average,
      'release_date',case when p.media_type='movie'
        then coalesce(nullif(p.raw_tmdb->>'release_date',''),p.release_year::text||'-01-01') else null end,
      'first_air_date',case when p.media_type='tv'
        then coalesce(nullif(p.raw_tmdb->>'first_air_date',''),p.release_year::text||'-01-01') else null end,
      'genre_ids',case when p.media_kind='anime'
        then coalesce(p.raw_tmdb->'genre_ids','[16]'::jsonb)
        else coalesce(p.raw_tmdb->'genre_ids','[]'::jsonb) end,
      'genres',coalesce(nullif(p.genres,'[]'::jsonb),p.raw_tmdb->'genres','[]'::jsonb),
      'runtime_minutes',greatest(
        coalesce(p.runtime_minutes,0),
        case when coalesce(p.raw_tmdb->>'runtime','') ~ '^[0-9]+$'
          then (p.raw_tmdb->>'runtime')::int else 0 end
      ),
      '__ct484_smart_watch',true
    ))
    order by p.daily_rank,p.vote_average desc,p.added_at desc nulls last,p.tmdb_id desc
  ),
  '[]'::jsonb
)
from picked p;
$$;

create or replace function public.cinetracker_home_series_v484(
  p_today date default current_date
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with params as (
  select
    extract(year from coalesce(p_today,current_date))::int as season,
    ((coalesce(p_today,current_date)+1)::timestamp at time zone 'America/Sao_Paulo') as released_before,
    ((coalesce(p_today,current_date)-29)::timestamp at time zone 'America/Sao_Paulo') as recent_after
), base as materialized (
  select x
  from jsonb_array_elements(
    coalesce(public.cinetracker_home_series_v452(coalesce(p_today,current_date)),'[]'::jsonb)
  ) x
), f1_recent_next as materialized (
  select
    m.season,
    m.episode_number,
    m.title,
    m.starts_at,
    m.round,
    m.session_kind
  from public.f1_episode_map_v423 m
  join params p on p.season=m.season
  where m.starts_at>=p.recent_after
    and m.starts_at<p.released_before
    and not exists (
      select 1
      from public.episode_progress ep
      where ep.profile_id=auth.uid()
        and ep.media_id=865
        and ep.season_number=m.season
        and ep.episode_number=m.episode_number
        and ep.watched=true
    )
    and not exists (
      select 1
      from public.watch_history wh
      where wh.profile_id=auth.uid()
        and wh.media_id=865
        and wh.item_type='episode'
        and wh.season_number=m.season
        and wh.episode_number=m.episode_number
    )
  order by m.starts_at,m.episode_number
  limit 1
), f1_started as materialized (
  select (
    exists(
      select 1
      from public.episode_progress ep
      where ep.profile_id=auth.uid() and ep.media_id=865 and ep.watched=true
    )
    or exists(
      select 1
      from public.watch_history wh
      where wh.profile_id=auth.uid() and wh.media_id=865 and wh.item_type='episode'
    )
  ) as started
), patched as (
  select case
    when coalesce(x->>'media_id','')='865' then
      (x - 'next_season_number' - 'next_episode_number' - 'next_episode_title' - 'next_episode_air_date')
      || jsonb_strip_nulls(jsonb_build_object(
        'next_season_number',(select season from f1_recent_next),
        'next_episode_number',(select episode_number from f1_recent_next),
        'next_episode_title',(select title from f1_recent_next),
        'next_episode_air_date',(select starts_at::date from f1_recent_next),
        'home_bucket',case
          when not coalesce((select started from f1_started),false) then 'not_started'
          when exists(select 1 from f1_recent_next) then 'continue'
          else 'up_to_date'
        end,
        '__ct484_f1_recent_only',true,
        '__ct484_f1_recent_days',30
      ))
    else x
  end as x
  from base
)
select coalesce(
  jsonb_agg(
    x order by
      case x->>'home_bucket'
        when 'continue' then 1
        when 'dust' then 2
        when 'up_to_date' then 3
        when 'not_started' then 4
        when 'completed' then 5
        else 9
      end,
      (x->>'state_updated_at') desc nulls last,
      case when coalesce(x->>'media_id','') ~ '^[0-9]+$'
        then (x->>'media_id')::bigint else 0 end desc
  ),
  '[]'::jsonb
)
from patched;
$$;

create or replace function public.cinetracker_is_youth_sport_v484(
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
with v as (
  select
    translate(
      lower(concat_ws(' ',
        coalesce(p_title,''),
        coalesce(p_competition,''),
        coalesce(p_home,''),
        coalesce(p_away,'')
      )),
      'áàâãäéèêëíìîïóòôõöúùûüçñ',
      'aaaaaeeeeiiiiooooouuuucn'
    ) as all_text,
    translate(
      lower(coalesce(p_competition,'')),
      'áàâãäéèêëíìîïóòôõöúùûüçñ',
      'aaaaaeeeeiiiiooooouuuucn'
    ) as competition_text
)
select
  all_text ~ '(^|[^a-z0-9])(u|sub|under)[ -]?(1[4-9]|2[0-3])([^a-z0-9]|$)'
  or competition_text ~ '(^|[^a-z0-9])(junior|juniors|juniores)([^a-z0-9]|$)'
from v;
$$;

create or replace function public.cinetracker_sports_payload_v484(
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
  select public.cinetracker_sports_payload_v479(p_from,p_to) as payload
), ev as (
  select e.item,e.ord
  from b
  cross join lateral jsonb_array_elements(coalesce(b.payload->'events','[]'::jsonb))
    with ordinality e(item,ord)
  where not public.cinetracker_is_youth_sport_v484(
    e.item->>'title',
    e.item->>'competition_name',
    e.item->>'home_name',
    e.item->>'away_name'
  )
), wh as (
  select e.item,e.ord
  from b
  cross join lateral jsonb_array_elements(coalesce(b.payload->'watch_history','[]'::jsonb))
    with ordinality e(item,ord)
  where not public.cinetracker_is_youth_sport_v484(
    e.item->>'title',
    e.item->>'competition_name',
    e.item->>'home_name',
    e.item->>'away_name'
  )
)
select
  (payload - 'events' - 'watch_history')
  || jsonb_build_object(
    'events',coalesce((select jsonb_agg(item order by ord) from ev),'[]'::jsonb),
    'watch_history',coalesce((select jsonb_agg(item order by ord) from wh),'[]'::jsonb),
    'source','v484-professional-no-juniors'
  )
from b;
$$;

create or replace function public.cinetracker_sports_events_v484(
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
  from public.cinetracker_sports_events_v479(
    p_favorite_only,p_limit,p_offset,p_scope
  ) e
  where not public.cinetracker_is_youth_sport_v484(
    e.title,e.competition_name,e.home_name,e.away_name
  );
$$;

create or replace function public.cinetracker_sport_favorite_events_v484(
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
  select public.cinetracker_sport_favorite_events_v479(
    p_entity_id,p_from,p_to
  ) as payload
), ev as (
  select e.item,e.ord
  from b
  cross join lateral jsonb_array_elements(coalesce(b.payload->'events','[]'::jsonb))
    with ordinality e(item,ord)
  where not public.cinetracker_is_youth_sport_v484(
    e.item->>'title',
    e.item->>'competition_name',
    e.item->>'home_name',
    e.item->>'away_name'
  )
)
select
  (payload-'events')
  || jsonb_build_object(
    'events',coalesce((select jsonb_agg(item order by ord) from ev),'[]'::jsonb),
    'source','v484-professional-no-juniors'
  )
from b;
$$;

revoke all on function public.cinetracker_discover_fresh_v484(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v484(text,integer) to authenticated;
revoke all on function public.cinetracker_discover_watch_smart_v484(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_watch_smart_v484(text,integer) to authenticated;
revoke all on function public.cinetracker_home_series_v484(date) from public,anon;
grant execute on function public.cinetracker_home_series_v484(date) to authenticated;
revoke all on function public.cinetracker_is_youth_sport_v484(text,text,text,text) from public,anon;
grant execute on function public.cinetracker_is_youth_sport_v484(text,text,text,text) to authenticated;
revoke all on function public.cinetracker_sports_payload_v484(timestamptz,timestamptz) from public,anon;
grant execute on function public.cinetracker_sports_payload_v484(timestamptz,timestamptz) to authenticated;
revoke all on function public.cinetracker_sports_events_v484(boolean,integer,integer,text) from public,anon;
grant execute on function public.cinetracker_sports_events_v484(boolean,integer,integer,text) to authenticated;
revoke all on function public.cinetracker_sport_favorite_events_v484(bigint,date,date) from public,anon;
grant execute on function public.cinetracker_sport_favorite_events_v484(bigint,date,date) to authenticated;

notify pgrst,'reload schema';
