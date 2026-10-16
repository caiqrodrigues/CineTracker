-- r539: use matching all-time units for the three recurring special series.
-- F1 numerator is race-only (Grand Prix), while session progress remains available separately.
create or replace function public.cinetracker_special_series_counts_v539()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with uid as (select auth.uid() profile_id),
f1_seen as materialized (
 select distinct ep.season_number::int season,ep.episode_number::int episode_number from public.episode_progress ep,uid where ep.profile_id=uid.profile_id and ep.media_id=865 and ep.watched=true and ep.season_number is not null and ep.episode_number is not null
 union
 select distinct wh.season_number::int,wh.episode_number::int from public.watch_history wh,uid where wh.profile_id=uid.profile_id and wh.media_id=865 and wh.item_type='episode' and wh.season_number is not null and wh.episode_number is not null
 union
 select distinct m.season::int,m.episode_number::int from public.user_f1_session_watch fw join public.f1_episode_map_v423 m on m.canonical_provider_event_id=fw.provider_event_id cross join uid where fw.profile_id=uid.profile_id
),
f1_stats as (
 select count(*) filter(where m.session_kind='race')::int watched_races,(select count(*)::int from f1_seen) watched_sessions,(select count(*)::int from public.f1_episode_map_v423 where session_kind='race') mapped_races
 from f1_seen s join public.f1_episode_map_v423 m on m.season=s.season and m.episode_number=s.episode_number
),
progress as (select public.cinetracker_special_series_progress_v520() j),
media_totals as (
 select max(total_episodes) filter(where id=865)::int f1_total,max(total_episodes) filter(where id=9735)::int ufc_total,max(total_episodes) filter(where id=9743)::int wwe_total from public.media where id in(865,9735,9743)
),
x as (
 select coalesce(fs.watched_races,0) f1_watched,coalesce(fs.watched_sessions,0) f1_watched_sessions,coalesce(fs.mapped_races,0) f1_known,
 coalesce((p.j->'ufc'->>'watched')::int,0) ufc_watched,coalesce((p.j->'ufc'->>'known_events')::int,0) ufc_known,
 coalesce((p.j->'wwe_ppv'->>'watched')::int,0) wwe_watched,coalesce((p.j->'wwe_ppv'->>'known_events')::int,0) wwe_known,
 coalesce(mt.f1_total,1166) f1_total,coalesce(mt.ufc_total,793) ufc_total,coalesce(mt.wwe_total,567) wwe_total
 from progress p cross join media_totals mt cross join f1_stats fs
)
select jsonb_build_object(
 'f1',jsonb_build_object('watched',f1_watched,'watched_races',f1_watched,'watched_sessions',f1_watched_sessions,'total',greatest(f1_watched,f1_known,f1_total,1166),'catalog_known',f1_known,'unit','grands_prix'),
 'ufc',jsonb_build_object('watched',ufc_watched,'total',greatest(ufc_watched,ufc_known,ufc_total,793),'catalog_known',ufc_known,'unit','events'),
 'wwe_ppv',jsonb_build_object('watched',wwe_watched,'total',greatest(wwe_watched,wwe_known,wwe_total,567),'catalog_known',wwe_known,'unit','supercards'),
 'verified_at','2026-10-16','source','counts-v539-global-progress-units'
) from x;
$$;
revoke all on function public.cinetracker_special_series_counts_v539() from public,anon;
grant execute on function public.cinetracker_special_series_counts_v539() to authenticated,service_role;
notify pgrst,'reload schema';
