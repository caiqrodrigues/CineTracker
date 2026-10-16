-- r538: count-only correction for Naruto Shippuuden, F1, UFC and WWE PPV.
-- No layout, watch-state, catalog, navigation or Android behavior is changed.
update public.media set media_kind='anime',total_episodes=500,raw_tmdb=coalesce(raw_tmdb,'{}'::jsonb)||jsonb_build_object('id',31910,'source_tmdb_id',31910,'number_of_episodes',500,'number_of_seasons',22,'status','Ended','original_name','NARUTO -ナルト- 疾風伝','ct_count_verified_at','2026-10-16'),updated_at=now() where id=2929 and title='Naruto Shippuuden';
update public.media set total_episodes=1166,raw_tmdb=coalesce(raw_tmdb,'{}'::jsonb)||jsonb_build_object('ct_verified_total_episodes',1166,'ct_count_unit','grands_prix','ct_count_verified_at','2026-10-16'),updated_at=now() where id=865 and title='Formula 1';
update public.media set total_episodes=793,raw_tmdb=coalesce(raw_tmdb,'{}'::jsonb)||jsonb_build_object('ct_verified_total_episodes',793,'ct_count_unit','events','ct_count_verified_at','2026-10-16'),updated_at=now() where id=9735 and title='UFC';
update public.media set total_episodes=567,raw_tmdb=coalesce(raw_tmdb,'{}'::jsonb)||jsonb_build_object('ct_verified_total_episodes',567,'ct_count_unit','supercards','ct_count_verified_at','2026-10-16'),updated_at=now() where id=9743 and title='WWE Pay-Per-View';
create or replace function public.cinetracker_special_series_counts_v538() returns jsonb language sql stable security invoker set search_path=public as $$
with progress as (select public.cinetracker_special_series_progress_v520() j),media_totals as (
 select max(total_episodes) filter(where id=865)::int f1_total,max(total_episodes) filter(where id=9735)::int ufc_total,max(total_episodes) filter(where id=9743)::int wwe_total from public.media where id in(865,9735,9743)
),x as (
 select coalesce((p.j->'f1'->>'watched')::int,0) f1_watched,coalesce((p.j->'f1'->>'mapped_races')::int,0) f1_known,
 coalesce((p.j->'ufc'->>'watched')::int,0) ufc_watched,coalesce((p.j->'ufc'->>'known_events')::int,0) ufc_known,
 coalesce((p.j->'wwe_ppv'->>'watched')::int,0) wwe_watched,coalesce((p.j->'wwe_ppv'->>'known_events')::int,0) wwe_known,
 coalesce(m.f1_total,1166) f1_total,coalesce(m.ufc_total,793) ufc_total,coalesce(m.wwe_total,567) wwe_total from progress p cross join media_totals m
)
select jsonb_build_object(
 'f1',jsonb_build_object('watched',f1_watched,'total',greatest(f1_watched,f1_known,f1_total,1166),'catalog_known',f1_known,'unit','grands_prix'),
 'ufc',jsonb_build_object('watched',ufc_watched,'total',greatest(ufc_watched,ufc_known,ufc_total,793),'catalog_known',ufc_known,'unit','events'),
 'wwe_ppv',jsonb_build_object('watched',wwe_watched,'total',greatest(wwe_watched,wwe_known,wwe_total,567),'catalog_known',wwe_known,'unit','supercards'),
 'verified_at','2026-10-16','source','counts-v538-stable-floor') from x;$$;
revoke all on function public.cinetracker_special_series_counts_v538() from public,anon;
grant execute on function public.cinetracker_special_series_counts_v538() to authenticated,service_role;
notify pgrst,'reload schema';
