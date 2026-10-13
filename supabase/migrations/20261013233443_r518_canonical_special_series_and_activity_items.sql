CREATE OR REPLACE FUNCTION public.cinetracker_ufc_event_key_v518(p_title text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
with x as (
  select public.cinetracker_norm_title_v1(coalesce(p_title,'')) n
)
select case
  when n ~ '^ufc[0-9]+' then 'ppv:' || substring(n from '^ufc([0-9]+)')
  when n ~ '^ufcfightnight' then 'fn:' || regexp_replace(n,'^ufcfightnight[0-9]*','')
  when n ~ '^ufcon(espn|abc|fox)' then 'fn:' || regexp_replace(n,'^ufcon(espn|abc|fox)[0-9]*','')
  else n
end from x;
$function$;

revoke all on function public.cinetracker_ufc_event_key_v518(text) from public, anon;

grant execute on function public.cinetracker_ufc_event_key_v518(text) to authenticated, service_role;

CREATE OR REPLACE FUNCTION public.cinetracker_ufc_series_v518(p_season integer DEFAULT NULL::integer, p_today date DEFAULT CURRENT_DATE, p_recent_days integer DEFAULT 21)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select
    coalesce(p_season,extract(year from coalesce(p_today,current_date))::int) season,
    extract(year from coalesce(p_today,current_date))::int current_season,
    greatest(7,least(coalesce(p_recent_days,21),60))::int recent_days,
    ((coalesce(p_today,current_date)+1)::timestamp at time zone 'America/Sao_Paulo') released_before,
    (coalesce(p_today,current_date)-greatest(7,least(coalesce(p_recent_days,21),60)))::date recent_from
),
series_media as (
  select id from public.media where tmdb_id=-510 and media_type='tv' limit 1
),
ufc_comp as (
  select id,logo_url from public.sport_entities
  where sport_slug='mma' and entity_type='competition' and upper(trim(name))='UFC'
  order by id limit 1
),
legacy0 as materialized (
  select
    m.id legacy_media_id,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::int tmdb_id,
    100000+m.id::int legacy_episode_number,
    m.title,
    public.cinetracker_ufc_event_key_v518(coalesce(nullif(m.title,''),m.original_title)) event_key,
    coalesce(
      case when coalesce(m.raw_tmdb->>'release_date','') ~ '^\d{4}-\d{2}-\d{2}$'
        then ((m.raw_tmdb->>'release_date')::date::timestamp at time zone 'America/Sao_Paulo') end,
      make_timestamptz(coalesce(m.release_year,(select season from cfg)),12,31,12,0,0,'America/Sao_Paulo')
    ) starts_at,
    coalesce(nullif(m.runtime_minutes,0),180)::int runtime_minutes,
    m.poster_path image_url,
    (
      exists(select 1 from public.watch_history h where h.profile_id=auth.uid() and h.media_id=m.id and h.item_type='movie')
      or exists(select 1 from public.media_overrides mo where mo.profile_id=auth.uid() and mo.media_id=m.id and mo.state in ('AlreadySeen','Completed'))
    ) legacy_watched
  from public.media m
  where m.media_type='movie' and m.release_year=(select season from cfg)
    and (
      lower(m.title) ~ '^ufc[[:space:]]+[0-9]+'
      or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+[0-9]+'
      or lower(m.title) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
      or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
      or lower(m.title) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)'
      or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)'
    )
),
sport0 as materialized (
  select
    ev.id event_id,
    ev.provider,
    ev.provider_event_id,
    ev.title,
    public.cinetracker_ufc_event_key_v518(ev.title) event_key,
    ev.starts_at,
    coalesce(nullif(round(extract(epoch from (ev.ends_at-ev.starts_at))/60)::int,0),180)::int runtime_minutes,
    case
      when lower(ev.title) ~ '^ufc[[:space:]]+[0-9]+' then 'PPV'
      when lower(ev.title) ~ '^ufc[[:space:]]+fight[[:space:]]+night' then 'Fight Night'
      when lower(ev.title) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)' then 'Fight Night'
      else 'UFC'
    end event_kind,
    ev.venue,
    ev.image_url,
    (ev.starts_at < (select released_before from cfg)) released,
    wh.watched_at sport_watched_at,
    coalesce(ep.watched,false) ep_watched
  from public.sport_events ev
  join ufc_comp uc on uc.id=ev.competition_entity_id
  left join public.user_sport_watch_history wh on wh.profile_id=auth.uid() and wh.event_id=ev.id
  left join public.episode_progress ep on ep.profile_id=auth.uid()
    and ep.media_id=(select id from series_media)
    and ep.season_number=(select season from cfg)
    and ep.episode_number=3000000+ev.id::int
  where ev.sport_slug='mma'
    and coalesce(nullif(ev.season,'')::int,extract(year from ev.starts_at)::int)=(select season from cfg)
    and (
      lower(ev.title) ~ '^ufc[[:space:]]+[0-9]+'
      or lower(ev.title) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
      or lower(ev.title) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)'
    )
),
sport_match as materialized (
  select
    s.*,
    l.legacy_media_id,
    l.tmdb_id,
    l.legacy_watched,
    row_number() over(
      partition by s.event_key
      order by
        (s.sport_watched_at is not null or s.ep_watched) desc,
        (s.provider='thesportsdb') desc,
        s.event_id
    ) rn
  from sport0 s
  left join lateral (
    select l.*
    from legacy0 l
    where l.event_key=s.event_key
    order by l.legacy_watched desc,l.legacy_media_id
    limit 1
  ) l on true
),
sport_rows as materialized (
  select
    'sport'::text source,
    event_id,
    legacy_media_id,
    tmdb_id,
    3000000+event_id::int episode_number,
    title,
    starts_at,
    runtime_minutes,
    event_kind,
    venue,
    image_url,
    released,
    (sport_watched_at is not null or ep_watched or coalesce(legacy_watched,false)) is_watched,
    sport_watched_at,
    event_key
  from sport_match
  where rn=1
),
movie_rows as materialized (
  select
    'movie'::text source,
    null::bigint event_id,
    l.legacy_media_id,
    l.tmdb_id,
    l.legacy_episode_number episode_number,
    l.title,
    l.starts_at,
    l.runtime_minutes,
    case
      when lower(l.title) ~ '^ufc[[:space:]]+[0-9]+' then 'PPV'
      else 'Fight Night'
    end event_kind,
    null::text venue,
    l.image_url,
    true released,
    (
      l.legacy_watched
      or coalesce(ep.watched,false)
    ) is_watched,
    null::timestamptz sport_watched_at,
    l.event_key
  from legacy0 l
  left join public.episode_progress ep on ep.profile_id=auth.uid()
    and ep.media_id=(select id from series_media)
    and ep.season_number=(select season from cfg)
    and ep.episode_number=l.legacy_episode_number
  where not exists(select 1 from sport_rows s where s.event_key=l.event_key)
),
all_rows as materialized (
  select * from sport_rows
  union all
  select * from movie_rows
),
stats as (
  select
    count(*)::int total_episodes,
    count(*) filter(where released)::int released_episodes,
    count(*) filter(where released and is_watched)::int watched_episodes,
    count(*) filter(
      where released and not is_watched
        and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
    )::int available_episodes
  from all_rows
),
next_recent as (
  select * from all_rows
  where released and not is_watched
    and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
  order by starts_at desc,episode_number desc limit 1
),
next_upcoming as (
  select * from all_rows where not released order by starts_at,episode_number limit 1
)
select jsonb_build_object(
  'series',jsonb_strip_nulls(jsonb_build_object(
    'series_key','ufc',
    'media_id',(select id from series_media),
    'media_type','tv',
    'media_kind','series',
    'title','UFC',
    'season',(select season from cfg),
    'poster_url',coalesce((select logo_url from ufc_comp),''),
    'total_episodes',coalesce((select total_episodes from stats),0),
    'released_episodes',coalesce((select released_episodes from stats),0),
    'watched_episodes',coalesce((select watched_episodes from stats),0),
    'available_episodes',case when (select season from cfg)=(select current_season from cfg)
      then coalesce((select available_episodes from stats),0) else 0 end,
    'home_bucket',case when (select season from cfg)=(select current_season from cfg)
      and coalesce((select available_episodes from stats),0)>0 then 'continue' else 'up_to_date' end,
    'next_episode_number',(select episode_number from next_recent),
    'next_episode_title',(select title from next_recent),
    'next_episode_air_date',(select starts_at from next_recent),
    'upcoming_episode_number',(select episode_number from next_upcoming),
    'upcoming_episode_title',(select title from next_upcoming),
    'upcoming_episode_air_date',(select starts_at from next_upcoming)
  )),
  'seasons',(select jsonb_agg(y order by y desc) from generate_series(1993,(select current_season from cfg)) y),
  'events',coalesce((
    select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
      'source',source,
      'event_id',event_id,
      'legacy_media_id',legacy_media_id,
      'tmdb_id',tmdb_id,
      'title',title,
      'season',(select season from cfg),
      'episode_number',episode_number,
      'event_kind',event_kind,
      'starts_at',starts_at,
      'runtime_minutes',runtime_minutes,
      'venue',venue,
      'image_url',image_url,
      'released',released,
      'is_watched',is_watched,
      'sport_watched_at',sport_watched_at
    )) order by starts_at desc,episode_number desc)
    from all_rows
  ),'[]'::jsonb),
  'generated_at',now(),
  'source','ufc-v518-canonical-season'
);
$function$;

revoke all on function public.cinetracker_ufc_series_v518(integer,date,integer) from public, anon;

grant execute on function public.cinetracker_ufc_series_v518(integer,date,integer) to authenticated, service_role;

CREATE OR REPLACE FUNCTION public.cinetracker_special_series_progress_v518()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with uid as (
  select auth.uid() profile_id
),
f1_seen as materialized (
  select distinct ep.season_number::int season,ep.episode_number::int episode_number
  from public.episode_progress ep,uid
  where ep.profile_id=uid.profile_id and ep.media_id=865 and ep.watched=true
    and ep.season_number is not null and ep.episode_number is not null
  union
  select distinct wh.season_number::int,wh.episode_number::int
  from public.watch_history wh,uid
  where wh.profile_id=uid.profile_id and wh.media_id=865 and wh.item_type='episode'
    and wh.season_number is not null and wh.episode_number is not null
  union
  select distinct m.season::int,m.episode_number::int
  from public.user_f1_session_watch fw
  join public.f1_episode_map_v423 m on m.canonical_provider_event_id=fw.provider_event_id
  cross join uid
  where fw.profile_id=uid.profile_id
),
ufc_comp as (
  select id from public.sport_entities
  where sport_slug='mma' and entity_type='competition' and upper(trim(name))='UFC'
  order by id limit 1
),
ufc_catalog as materialized (
  select public.cinetracker_ufc_event_key_v518(ev.title) event_key
  from public.sport_events ev
  where ev.sport_slug='mma' and ev.competition_entity_id=(select id from ufc_comp)
    and public.cinetracker_ufc_event_key_v518(ev.title)<>''
  union
  select public.cinetracker_ufc_event_key_v518(coalesce(nullif(m.title,''),m.original_title))
  from public.media m
  where m.media_type='movie' and (
    lower(coalesce(m.title,'')) ~ '^ufc[[:space:]]+[0-9]+'
    or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+[0-9]+'
    or lower(coalesce(m.title,'')) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
    or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
    or lower(coalesce(m.title,'')) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)'
    or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)'
  )
),
ufc_seen as materialized (
  select distinct public.cinetracker_ufc_event_key_v518(ev.title) event_key
  from public.user_sport_watch_history wh
  join public.sport_events ev on ev.id=wh.event_id
  cross join uid
  where wh.profile_id=uid.profile_id and ev.sport_slug='mma'
    and ev.competition_entity_id=(select id from ufc_comp)
  union
  select distinct public.cinetracker_ufc_event_key_v518(coalesce(nullif(m.title,''),m.original_title))
  from public.media m
  cross join uid
  where m.media_type='movie'
    and (
      exists(select 1 from public.watch_history wh where wh.profile_id=uid.profile_id and wh.media_id=m.id and wh.item_type='movie')
      or exists(select 1 from public.media_overrides mo where mo.profile_id=uid.profile_id and mo.media_id=m.id and mo.state in ('AlreadySeen','Completed'))
    )
    and (
      lower(coalesce(m.title,'')) ~ '^ufc[[:space:]]+[0-9]+'
      or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+[0-9]+'
      or lower(coalesce(m.title,'')) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
      or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
      or lower(coalesce(m.title,'')) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)'
      or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)'
    )
  union
  select distinct public.cinetracker_ufc_event_key_v518(ev.title)
  from public.episode_progress ep
  join public.media sm on sm.id=ep.media_id and sm.tmdb_id=-510 and sm.media_type='tv'
  join public.sport_events ev on ep.episode_number>=3000000 and ev.id=(ep.episode_number-3000000)
  cross join uid
  where ep.profile_id=uid.profile_id and ep.watched=true
  union
  select distinct public.cinetracker_ufc_event_key_v518(coalesce(nullif(m.title,''),m.original_title))
  from public.episode_progress ep
  join public.media sm on sm.id=ep.media_id and sm.tmdb_id=-510 and sm.media_type='tv'
  join public.media m on ep.episode_number>=100000 and ep.episode_number<3000000 and m.id=(ep.episode_number-100000)
  cross join uid
  where ep.profile_id=uid.profile_id and ep.watched=true
),
f1_map_stats as (
  select count(*)::int mapped_sessions,
         count(*) filter(where session_kind='race')::int mapped_races,
         count(distinct season)::int mapped_seasons
  from public.f1_episode_map_v423
)
select jsonb_build_object(
  'f1',jsonb_build_object(
    'watched',coalesce((select count(*) from f1_seen),0),
    'mapped_sessions',coalesce((select mapped_sessions from f1_map_stats),0),
    'mapped_races',coalesce((select mapped_races from f1_map_stats),0),
    'mapped_seasons',coalesce((select mapped_seasons from f1_map_stats),0)
  ),
  'ufc',jsonb_build_object(
    'watched',coalesce((select count(*) from ufc_seen where event_key<>''),0),
    'known_events',coalesce((select count(*) from ufc_catalog where event_key<>''),0)
  ),
  'generated_at',now(),
  'source','special-progress-v518-canonical'
);
$function$;

revoke all on function public.cinetracker_special_series_progress_v518() from public, anon;

grant execute on function public.cinetracker_special_series_progress_v518() to authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_activity_items_by_day_v518(p_day date, p_tz text DEFAULT 'America/Sao_Paulo'::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select auth.uid() uid, coalesce(nullif(trim(p_tz),''),'America/Sao_Paulo') zone, p_day target_date
),
play_rows as (
  select
    (2000000000::bigint + pe.id::bigint) sort_id,
    pe.played_at watched_at,
    pe.item_type,
    pe.season_number,
    pe.episode_number,
    coalesce(nullif(pe.runtime_minutes,0),nullif(m.runtime_minutes,0),0)::integer runtime_minutes,
    m.id media_id,
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) tmdb_id,
    m.title media_title,
    m.poster_path,
    coalesce(
      (
        select nullif(wh.title,'')
        from public.watch_history wh
        where wh.profile_id=pe.profile_id
          and wh.media_id=pe.media_id
          and wh.item_type=pe.item_type
          and coalesce(wh.season_number,0)=coalesce(pe.season_number,0)
          and coalesce(wh.episode_number,0)=coalesce(pe.episode_number,0)
        order by abs(extract(epoch from (wh.watched_at-pe.played_at))) asc
        limit 1
      ),
      m.title
    ) title,
    coalesce(m.release_year,0)::integer release_year,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end vote_average,
    1::integer plays,
    0::integer remaining_episodes,
    'play_event'::text source_kind,
    null::bigint event_id
  from public.watch_play_events_v0994 pe
  join public.media m on m.id=pe.media_id
  cross join cfg c
  where pe.profile_id=c.uid
    and pe.item_type in ('episode','movie')
    and pe.played_at >= (c.target_date::timestamp at time zone c.zone)
    and pe.played_at < ((c.target_date+1)::timestamp at time zone c.zone)
),
history_rows as (
  select
    (1000000000::bigint + wh.id::bigint) sort_id,
    wh.watched_at,
    wh.item_type,
    wh.season_number,
    wh.episode_number,
    coalesce(m.runtime_minutes,0)::integer runtime_minutes,
    m.id media_id,
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) tmdb_id,
    m.title media_title,
    m.poster_path,
    coalesce(wh.title,m.title) title,
    coalesce(m.release_year,0)::integer release_year,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0::numeric end vote_average,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$'
      then greatest(1,(wh.external_ids->>'plays')::integer) else 1 end plays,
    0::integer remaining_episodes,
    'home_history'::text source_kind,
    null::bigint event_id
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  cross join cfg c
  where wh.profile_id=c.uid
    and wh.item_type in ('episode','movie')
    and not coalesce(wh.external_ids ? 'v0994_managed',false)
    and wh.watched_at >= (c.target_date::timestamp at time zone c.zone)
    and wh.watched_at < ((c.target_date+1)::timestamp at time zone c.zone)
),
sport_rows as (
  select
    sh.id::bigint sort_id,
    coalesce(sh.watched_at,sh.created_at) watched_at,
    'sport'::text item_type,
    null::integer season_number,
    null::integer episode_number,
    coalesce(sh.duration_minutes,0)::integer runtime_minutes,
    null::bigint media_id,
    null::text media_type,
    null::integer tmdb_id,
    se.title media_title,
    se.image_url poster_path,
    se.title title,
    extract(year from coalesce(sh.watched_at,sh.created_at))::integer release_year,
    0::numeric vote_average,
    1::integer plays,
    0::integer remaining_episodes,
    'sport'::text source_kind,
    sh.event_id::bigint event_id
  from public.user_sport_watch_history sh
  join public.sport_events se on se.id=sh.event_id
  cross join cfg c
  where sh.profile_id=c.uid
    and coalesce(sh.watched_at,sh.created_at) >= (c.target_date::timestamp at time zone c.zone)
    and coalesce(sh.watched_at,sh.created_at) < ((c.target_date+1)::timestamp at time zone c.zone)
)
select coalesce(jsonb_agg(to_jsonb(a) order by a.watched_at desc,a.sort_id desc),'[]'::jsonb)
from (
  select * from play_rows
  union all
  select * from history_rows
  union all
  select * from sport_rows
) a;
$function$;

revoke all on function public.cinetracker_activity_items_by_day_v518(date,text) from public, anon;

grant execute on function public.cinetracker_activity_items_by_day_v518(date,text) to authenticated;

notify pgrst,'reload schema';
