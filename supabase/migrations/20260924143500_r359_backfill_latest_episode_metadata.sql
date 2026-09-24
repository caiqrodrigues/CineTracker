with src as (
  select distinct on (
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),
    nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,
    nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int
  )
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint show_tmdb_id,
    nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int season_number,
    nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int episode_number,
    case when coalesce(m.raw_tmdb->'last_episode_to_air'->>'id','') ~ '^[0-9]+$'
         then (m.raw_tmdb->'last_episode_to_air'->>'id')::bigint else null end episode_tmdb_id,
    coalesce(nullif(m.raw_tmdb->>'name',''),m.title) show_name,
    nullif(m.raw_tmdb->>'original_name','') show_original_name,
    coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'name',''),
             'Episódio '||coalesce(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')) name_local,
    case when coalesce(m.raw_tmdb->'last_episode_to_air'->>'air_date','') ~ '^\d{4}-\d{2}-\d{2}$'
         then (m.raw_tmdb->'last_episode_to_air'->>'air_date')::date else null end air_date,
    case when coalesce(m.raw_tmdb->'last_episode_to_air'->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
         then (m.raw_tmdb->'last_episode_to_air'->>'vote_average')::numeric else 0 end vote_average,
    nullif(m.raw_tmdb->'last_episode_to_air'->>'still_path','') still_path,
    coalesce(nullif(m.raw_tmdb->>'poster_path',''),m.poster_path) poster_path
  from public.media m
  where m.media_type='tv'
    and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
    and coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0)>0
    and coalesce(nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0)>0
  order by
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),
    nullif(m.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,
    nullif(m.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,
    m.updated_at desc nulls last,
    m.id desc
)
insert into public.episode_catalog_v336(
 show_tmdb_id,season_number,episode_number,episode_tmdb_id,
 show_name,show_original_name,name_local,air_date,vote_average,
 still_path,poster_path,updated_at
)
select show_tmdb_id,season_number,episode_number,episode_tmdb_id,
       show_name,show_original_name,name_local,air_date,vote_average,
       still_path,poster_path,now()
from src
on conflict(show_tmdb_id,season_number,episode_number) do update
set episode_tmdb_id=coalesce(excluded.episode_tmdb_id,public.episode_catalog_v336.episode_tmdb_id),
    show_name=coalesce(excluded.show_name,public.episode_catalog_v336.show_name),
    show_original_name=coalesce(excluded.show_original_name,public.episode_catalog_v336.show_original_name),
    name_local=coalesce(nullif(excluded.name_local,''),public.episode_catalog_v336.name_local),
    air_date=coalesce(excluded.air_date,public.episode_catalog_v336.air_date),
    vote_average=coalesce(excluded.vote_average,public.episode_catalog_v336.vote_average),
    still_path=coalesce(excluded.still_path,public.episode_catalog_v336.still_path),
    poster_path=coalesce(excluded.poster_path,public.episode_catalog_v336.poster_path),
    updated_at=now();
