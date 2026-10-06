create or replace function public.cinetracker_foryou_payload_v490(
  p_watch_limit integer default 30,
  p_fresh_limit integer default 48
)
returns jsonb
language sql
volatile
security invoker
set search_path=public
as $$
with src as materialized (
  select public.cinetracker_foryou_payload_v489(p_watch_limit,p_fresh_limit) j
),
watch_movie as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'media_id',e->'media_id','tmdb_id',e->'tmdb_id','media_type',e->'media_type','media_kind',e->'media_kind',
    'title',e->'title','poster_path',e->'poster_path','release_year',e->'release_year','runtime_minutes',e->'runtime_minutes',
    'vote_average',coalesce(e->'raw_tmdb'->'vote_average','0'::jsonb)
  )),'[]'::jsonb) a from src,lateral jsonb_array_elements(j->'watch'->'movie') e
), watch_series as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'media_id',e->'media_id','tmdb_id',e->'tmdb_id','media_type',e->'media_type','media_kind',e->'media_kind',
    'title',e->'title','poster_path',e->'poster_path','release_year',e->'release_year','runtime_minutes',e->'runtime_minutes',
    'vote_average',coalesce(e->'raw_tmdb'->'vote_average','0'::jsonb)
  )),'[]'::jsonb) a from src,lateral jsonb_array_elements(j->'watch'->'series') e
), watch_anime as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'media_id',e->'media_id','tmdb_id',e->'tmdb_id','media_type',e->'media_type','media_kind',e->'media_kind',
    'title',e->'title','poster_path',e->'poster_path','release_year',e->'release_year','runtime_minutes',e->'runtime_minutes',
    'vote_average',coalesce(e->'raw_tmdb'->'vote_average','0'::jsonb)
  )),'[]'::jsonb) a from src,lateral jsonb_array_elements(j->'watch'->'anime') e
), fresh_movie as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'media_id',e->'media_id','tmdb_id',e->'tmdb_id','media_type',e->'media_type','media_kind',e->'media_kind',
    'title',e->'title','poster_path',e->'poster_path','release_year',e->'release_year','runtime_minutes',e->'runtime_minutes',
    'vote_average',coalesce(e->'raw_tmdb'->'vote_average','0'::jsonb)
  )),'[]'::jsonb) a from src,lateral jsonb_array_elements(j->'fresh'->'movie') e
), fresh_series as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'media_id',e->'media_id','tmdb_id',e->'tmdb_id','media_type',e->'media_type','media_kind',e->'media_kind',
    'title',e->'title','poster_path',e->'poster_path','release_year',e->'release_year','runtime_minutes',e->'runtime_minutes',
    'vote_average',coalesce(e->'raw_tmdb'->'vote_average','0'::jsonb)
  )),'[]'::jsonb) a from src,lateral jsonb_array_elements(j->'fresh'->'series') e
), fresh_anime as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'media_id',e->'media_id','tmdb_id',e->'tmdb_id','media_type',e->'media_type','media_kind',e->'media_kind',
    'title',e->'title','poster_path',e->'poster_path','release_year',e->'release_year','runtime_minutes',e->'runtime_minutes',
    'vote_average',coalesce(e->'raw_tmdb'->'vote_average','0'::jsonb)
  )),'[]'::jsonb) a from src,lateral jsonb_array_elements(j->'fresh'->'anime') e
)
select jsonb_build_object(
  'watch',jsonb_build_object('movie',(select a from watch_movie),'series',(select a from watch_series),'anime',(select a from watch_anime)),
  'fresh',jsonb_build_object('movie',(select a from fresh_movie),'series',(select a from fresh_series),'anime',(select a from fresh_anime)),
  'source','v490-compact','generated_at',now()
);
$$;
revoke all on function public.cinetracker_foryou_payload_v490(integer,integer) from public,anon;
grant execute on function public.cinetracker_foryou_payload_v490(integer,integer) to authenticated;
notify pgrst,'reload schema';
