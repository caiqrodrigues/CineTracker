create or replace function public.cinetracker_home_history_v391(p_limit integer default 50)
returns jsonb language sql stable security invoker set search_path=public as $$
with cfg as (select least(greatest(coalesce(p_limit,50),1),100)::int lim),
ep_source as materialized (
 select wh.media_id,wh.season_number,wh.episode_number,wh.watched_at from public.watch_history wh
 where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.media_id is not null and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
 order by wh.watched_at desc nulls last limit 180
), ep_progress as materialized (
 select ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at) watched_at from public.episode_progress ep
 where ep.profile_id=auth.uid() and ep.watched=true and ep.media_id is not null and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
 order by coalesce(ep.watched_at,ep.updated_at) desc nulls last limit 180
), ep_union as materialized (select * from ep_source union all select * from ep_progress),
ep_mapped as materialized (
 select case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0 then 'tv:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text else 'tv:id:'||m.id::text end logical_key,
 public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,e.media_id,e.season_number,e.episode_number,e.watched_at,m.title,m.poster_path,m.updated_at
 from ep_union e join public.media m on m.id=e.media_id
), ep_group as materialized (
 select logical_key,max(tmdb_id)::bigint tmdb_id,season_number,episode_number,max(watched_at) watched_at,count(*)::int plays
 from ep_mapped group by logical_key,season_number,episode_number
), ep_latest as materialized (select * from ep_group order by watched_at desc nulls last limit (select lim from cfg)),
ep_canonical as materialized (
 select distinct on (logical_key) logical_key,media_id,title,poster_path from ep_mapped
 order by logical_key,(poster_path is not null) desc,watched_at desc nulls last,updated_at desc nulls last,media_id desc
), ep_final as materialized (
 select e.*,c.media_id,c.title media_title,c.poster_path,ec.name_local,ec.name_en,ec.vote_average,ec.air_date
 from ep_latest e join ep_canonical c using(logical_key)
 left join public.episode_catalog_v336 ec on ec.show_tmdb_id=e.tmdb_id and ec.season_number=e.season_number and ec.episode_number=e.episode_number
), movie_source as materialized (
 select wh.media_id,wh.watched_at from public.watch_history wh
 where wh.profile_id=auth.uid() and wh.item_type='movie' and wh.media_id is not null order by wh.watched_at desc nulls last limit 160
), movie_seen as materialized (
 select mo.media_id,coalesce(mo.watched_at,mo.updated_at,mo.created_at) watched_at from public.media_overrides mo join public.media m on m.id=mo.media_id
 where mo.profile_id=auth.uid() and m.media_type='movie' and mo.state in ('AlreadySeen','Completed')
 order by coalesce(mo.watched_at,mo.updated_at,mo.created_at) desc nulls last limit 160
), movie_union as materialized (select * from movie_source union all select * from movie_seen),
movie_mapped as materialized (
 select case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0 then 'movie:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text else 'movie:id:'||m.id::text end logical_key,
 public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,e.media_id,e.watched_at,m.title,m.poster_path,m.release_year,m.runtime_minutes,m.genres,m.raw_tmdb,m.updated_at
 from movie_union e join public.media m on m.id=e.media_id
), movie_group as materialized (
 select logical_key,max(tmdb_id)::bigint tmdb_id,max(watched_at) watched_at,count(*)::int plays from movie_mapped group by logical_key
), movie_latest as materialized (select * from movie_group order by watched_at desc nulls last limit (select lim from cfg)),
movie_canonical as materialized (
 select distinct on (logical_key) logical_key,media_id,title,poster_path,release_year,runtime_minutes,genres,raw_tmdb from movie_mapped
 order by logical_key,(poster_path is not null) desc,(coalesce(runtime_minutes,0)>0) desc,watched_at desc nulls last,updated_at desc nulls last,media_id desc
), movie_final as materialized (
 select e.*,c.media_id,c.title,c.poster_path,c.release_year,c.runtime_minutes,c.genres,c.raw_tmdb from movie_latest e join movie_canonical c using(logical_key)
)
select jsonb_build_object(
 'history_episodes',coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',media_id,'media_type','tv','tmdb_id',tmdb_id,'media_title',media_title,'title',media_title,'poster_path',poster_path,
  'season_number',season_number,'episode_number',episode_number,'episode_title',coalesce(nullif(name_local,''),nullif(name_en,''),'Episódio '||episode_number::text),
  'episode_rating',vote_average,'episode_air_date',air_date,'watched_at',watched_at,'plays',plays
 )) order by watched_at asc nulls last) from ep_final),'[]'::jsonb),
 'history_movies',coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',media_id,'media_type','movie','tmdb_id',tmdb_id,'title',title,'poster_path',poster_path,'release_year',release_year,
  'release_date',nullif(raw_tmdb->>'release_date',''),'runtime_minutes',coalesce(runtime_minutes,case when coalesce(raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (raw_tmdb->>'runtime')::int end,0),
  'genres',coalesce(nullif(genres,'[]'::jsonb),raw_tmdb->'genres','[]'::jsonb),
  'vote_average',case when coalesce(raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (raw_tmdb->>'vote_average')::numeric end,
  'watched_at',watched_at,'plays',plays
 )) order by watched_at asc nulls last) from movie_final),'[]'::jsonb),'generated_at',now());
$$;
revoke all on function public.cinetracker_home_history_v391(integer) from public,anon;grant execute on function public.cinetracker_home_history_v391(integer) to authenticated;
notify pgrst,'reload schema';
