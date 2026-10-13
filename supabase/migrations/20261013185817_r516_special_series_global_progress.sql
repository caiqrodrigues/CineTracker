create or replace function public.cinetracker_special_series_progress_v516()
returns jsonb language sql stable security invoker set search_path=public
as $function$
with uid as (select auth.uid() profile_id),
f1_seen as materialized (
 select distinct ep.season_number::int season,ep.episode_number::int episode_number from public.episode_progress ep,uid where ep.profile_id=uid.profile_id and ep.media_id=865 and ep.watched=true and ep.season_number is not null and ep.episode_number is not null
 union select distinct wh.season_number::int,wh.episode_number::int from public.watch_history wh,uid where wh.profile_id=uid.profile_id and wh.media_id=865 and wh.item_type='episode' and wh.season_number is not null and wh.episode_number is not null
 union select distinct m.season::int,m.episode_number::int from public.user_f1_session_watch fw join public.f1_episode_map_v423 m on m.canonical_provider_event_id=fw.provider_event_id cross join uid where fw.profile_id=uid.profile_id
),
ufc_comp as (select id from public.sport_entities where sport_slug='mma' and entity_type='competition' and upper(trim(name))='UFC' order by id limit 1),
ufc_catalog as materialized (
 select public.cinetracker_ufc_event_key_v513(ev.title) event_key from public.sport_events ev where ev.sport_slug='mma' and ev.competition_entity_id=(select id from ufc_comp) and public.cinetracker_ufc_event_key_v513(ev.title)<>''
 union select public.cinetracker_ufc_event_key_v513(coalesce(nullif(m.title,''),m.original_title)) from public.media m where m.media_type='movie' and (lower(coalesce(m.title,'')) like 'ufc %' or lower(coalesce(m.original_title,'')) like 'ufc %')
),
ufc_seen as materialized (
 select distinct public.cinetracker_ufc_event_key_v513(ev.title) event_key from public.user_sport_watch_history wh join public.sport_events ev on ev.id=wh.event_id cross join uid where wh.profile_id=uid.profile_id and ev.sport_slug='mma' and ev.competition_entity_id=(select id from ufc_comp)
 union select distinct public.cinetracker_ufc_event_key_v513(coalesce(nullif(m.title,''),m.original_title)) from public.media m cross join uid where m.media_type='movie' and (exists(select 1 from public.watch_history wh where wh.profile_id=uid.profile_id and wh.media_id=m.id and wh.item_type='movie') or exists(select 1 from public.media_overrides mo where mo.profile_id=uid.profile_id and mo.media_id=m.id and mo.state in ('AlreadySeen','Completed'))) and (lower(coalesce(m.title,'')) like 'ufc %' or lower(coalesce(m.original_title,'')) like 'ufc %')
 union select distinct public.cinetracker_ufc_event_key_v513(ev.title) from public.episode_progress ep join public.media sm on sm.id=ep.media_id and sm.tmdb_id=-510 and sm.media_type='tv' join public.sport_events ev on ep.episode_number>=3000000 and ev.id=(ep.episode_number-3000000) cross join uid where ep.profile_id=uid.profile_id and ep.watched=true
 union select distinct public.cinetracker_ufc_event_key_v513(coalesce(nullif(m.title,''),m.original_title)) from public.episode_progress ep join public.media sm on sm.id=ep.media_id and sm.tmdb_id=-510 and sm.media_type='tv' join public.media m on ep.episode_number>=100000 and ep.episode_number<3000000 and m.id=(ep.episode_number-100000) cross join uid where ep.profile_id=uid.profile_id and ep.watched=true
),
f1_map_stats as (select count(*)::int mapped_sessions,count(*) filter(where session_kind='race')::int mapped_races,count(distinct season)::int mapped_seasons from public.f1_episode_map_v423)
select jsonb_build_object('f1',jsonb_build_object('watched',coalesce((select count(*) from f1_seen),0),'mapped_sessions',coalesce((select mapped_sessions from f1_map_stats),0),'mapped_races',coalesce((select mapped_races from f1_map_stats),0),'mapped_seasons',coalesce((select mapped_seasons from f1_map_stats),0)),'ufc',jsonb_build_object('watched',coalesce((select count(*) from ufc_seen where event_key<>''),0),'known_events',coalesce((select count(*) from ufc_catalog where event_key<>''),0)),'generated_at',now(),'source','special-progress-v516');
$function$;
revoke all on function public.cinetracker_special_series_progress_v516() from public,anon;
grant execute on function public.cinetracker_special_series_progress_v516() to authenticated,service_role;
notify pgrst,'reload schema';
