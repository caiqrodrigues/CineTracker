CREATE OR REPLACE FUNCTION public.cinetracker_special_series_counts_v540()
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
f1_count as (
  select
    count(*) filter(where m.session_kind='race')::int watched_races,
    count(*)::int watched_sessions
  from f1_seen s
  join public.f1_episode_map_v423 m
    on m.season=s.season and m.episode_number=s.episode_number
),
ufc_comp as (
  select id from public.sport_entities
  where sport_slug='mma' and entity_type='competition' and upper(trim(name))='UFC'
  order by id limit 1
),
watched_movies as materialized (
  select distinct wh.media_id
  from public.watch_history wh,uid
  where wh.profile_id=uid.profile_id and wh.item_type='movie' and wh.media_id is not null
  union
  select distinct pe.media_id
  from public.watch_play_events_v0994 pe,uid
  where pe.profile_id=uid.profile_id and pe.item_type='movie' and pe.media_id is not null
  union
  select distinct mo.media_id
  from public.media_overrides mo,uid
  where mo.profile_id=uid.profile_id
    and mo.state in ('AlreadySeen','Completed')
    and mo.media_id is not null
),
ufc_seen as materialized (
  select distinct public.cinetracker_ufc_event_key_v520(ev.title) event_key
  from public.user_sport_watch_history wh
  join public.sport_events ev on ev.id=wh.event_id
  cross join uid
  where wh.profile_id=uid.profile_id
    and ev.sport_slug='mma'
    and ev.competition_entity_id=(select id from ufc_comp)
  union
  select distinct public.cinetracker_ufc_event_key_v520(coalesce(nullif(m.title,''),m.original_title))
  from watched_movies w
  join public.media m on m.id=w.media_id
  where m.media_type='movie'
    and lower(concat_ws(' ',m.title,m.original_title)) ~ '(^|[^a-z0-9])(ufc|ultimate fighter)([^a-z0-9]|$)'
  union
  select distinct public.cinetracker_ufc_event_key_v520(ev.title)
  from public.episode_progress ep
  join public.media sm on sm.id=ep.media_id and sm.tmdb_id=-510 and sm.media_type='tv'
  join public.sport_events ev on ep.episode_number>=3000000 and ev.id=(ep.episode_number-3000000)
  cross join uid
  where ep.profile_id=uid.profile_id and ep.watched=true
),
wwe_series as (
  select id from public.media where tmdb_id=-520 and media_type='tv' limit 1
),
wwe_seen as materialized (
  select distinct case
    when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
    else 'title:'||public.cinetracker_wwe_ppv_event_key_v519(coalesce(nullif(m.original_title,''),m.title))
  end event_key
  from watched_movies w
  join public.media m on m.id=w.media_id
  where m.media_type='movie'
    and public.cinetracker_wwe_ppv_eligible_v519(concat_ws(' ',m.title,m.original_title))
  union
  select distinct case
    when ep.episode_number>=2000000 then 'tmdb:'||(ep.episode_number-2000000)::text
    when ep.episode_number>=100000 then coalesce(
      (select case
        when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
          then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
        else 'title:'||public.cinetracker_wwe_ppv_event_key_v519(coalesce(nullif(m.original_title,''),m.title))
       end
       from public.media m
       where m.id=ep.episode_number-100000),
      'episode:'||ep.season_number::text||':'||ep.episode_number::text
    )
    else 'episode:'||ep.season_number::text||':'||ep.episode_number::text
  end event_key
  from public.episode_progress ep
  cross join uid
  where ep.profile_id=uid.profile_id
    and ep.media_id=(select id from wwe_series)
    and ep.watched=true
)
select jsonb_build_object(
  'f1',jsonb_build_object(
    'watched',coalesce((select watched_races from f1_count),0),
    'watched_races',coalesce((select watched_races from f1_count),0),
    'watched_sessions',coalesce((select watched_sessions from f1_count),0),
    'total',1166,
    'unit','grands_prix'
  ),
  'ufc',jsonb_build_object(
    'watched',coalesce((select count(*) from ufc_seen where event_key<>'' and event_key<>'event:'),0),
    'total',793,
    'unit','events'
  ),
  'wwe_ppv',jsonb_build_object(
    'watched',coalesce((select count(*) from wwe_seen where event_key<>''),0),
    'total',567,
    'unit','supercards'
  ),
  'source','counts-v540-fast-auth-safe',
  'generated_at',now()
);
$function$

revoke all on function public.cinetracker_special_series_counts_v540() from public,anon;
grant execute on function public.cinetracker_special_series_counts_v540() to authenticated;
notify pgrst,'reload schema';
