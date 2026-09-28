-- r387: Home + Descobrir/Pra Você only.
create or replace function public.cinetracker_home_history_v387()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with episode_events as materialized (
  select wh.media_id,wh.season_number,wh.episode_number,wh.watched_at
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode' and m.media_type='tv'
    and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union all
  select ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at)
  from public.episode_progress ep
  join public.media m on m.id=ep.media_id
  where ep.profile_id=auth.uid() and ep.watched=true and m.media_type='tv'
    and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), episode_mapped as materialized (
  select case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text else 'media:'||m.id::text end logical_key,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    e.media_id,e.season_number,e.episode_number,e.watched_at
  from episode_events e join public.media m on m.id=e.media_id
), episode_group as materialized (
  select logical_key,max(tmdb_id)::bigint tmdb_id,season_number,episode_number,max(watched_at) watched_at,count(*)::int plays
  from episode_mapped group by logical_key,season_number,episode_number
), episode_canonical as materialized (
  select distinct on (g.logical_key) g.logical_key,m.id media_id,g.tmdb_id,m.title,m.poster_path
  from (select distinct logical_key,tmdb_id from episode_group) g
  join public.media m on m.media_type='tv' and (
    (g.tmdb_id>0 and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=g.tmdb_id)
    or (g.tmdb_id<=0 and g.logical_key='media:'||m.id::text)
  )
  order by g.logical_key,(m.poster_path is not null) desc,m.updated_at desc nulls last,m.id desc
), episodes as materialized (
  select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
    'media_id',c.media_id,'media_type','tv','tmdb_id',c.tmdb_id,'media_title',c.title,'title',c.title,'poster_path',c.poster_path,
    'season_number',g.season_number,'episode_number',g.episode_number,
    'episode_title',coalesce(nullif(ec.name_local,''),nullif(ec.name_en,''),'Episódio '||g.episode_number::text),
    'episode_rating',ec.vote_average,'episode_air_date',ec.air_date,'watched_at',g.watched_at,'plays',g.plays
  )) order by g.watched_at asc nulls last),'[]'::jsonb) rows
  from episode_group g join episode_canonical c on c.logical_key=g.logical_key
  left join public.episode_catalog_v336 ec on ec.show_tmdb_id=g.tmdb_id and ec.season_number=g.season_number and ec.episode_number=g.episode_number
), movie_events as materialized (
  select wh.media_id,wh.watched_at
  from public.watch_history wh join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='movie' and m.media_type='movie'
  union all
  select mo.media_id,coalesce(mo.updated_at,mo.created_at)
  from public.media_overrides mo join public.media m on m.id=mo.media_id
  where mo.profile_id=auth.uid() and m.media_type='movie' and mo.state in ('AlreadySeen','Completed')
), movie_mapped as materialized (
  select case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text else 'media:'||m.id::text end logical_key,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,e.media_id,e.watched_at
  from movie_events e join public.media m on m.id=e.media_id
), movie_group as materialized (
  select logical_key,max(tmdb_id)::bigint tmdb_id,max(watched_at) watched_at,count(*)::int plays
  from movie_mapped group by logical_key
), movie_canonical as materialized (
  select distinct on (g.logical_key) g.logical_key,m.id media_id,g.tmdb_id,m.title,m.poster_path,m.release_year,m.runtime_minutes,m.genres,m.raw_tmdb
  from movie_group g
  join public.media m on m.media_type='movie' and (
    (g.tmdb_id>0 and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=g.tmdb_id)
    or (g.tmdb_id<=0 and g.logical_key='media:'||m.id::text)
  )
  order by g.logical_key,(m.poster_path is not null) desc,(coalesce(m.runtime_minutes,0)>0) desc,
    (jsonb_array_length(coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb))>0) desc,
    m.updated_at desc nulls last,m.id desc
), movies as materialized (
  select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
    'media_id',c.media_id,'media_type','movie','tmdb_id',c.tmdb_id,'title',c.title,'poster_path',c.poster_path,
    'release_year',c.release_year,'release_date',nullif(c.raw_tmdb->>'release_date',''),
    'runtime_minutes',coalesce(c.runtime_minutes,case when coalesce(c.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (c.raw_tmdb->>'runtime')::int end,0),
    'genres',coalesce(nullif(c.genres,'[]'::jsonb),c.raw_tmdb->'genres','[]'::jsonb),
    'vote_average',case when coalesce(c.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (c.raw_tmdb->>'vote_average')::numeric end,
    'watched_at',g.watched_at,'plays',g.plays
  )) order by g.watched_at asc nulls last),'[]'::jsonb) rows
  from movie_group g join movie_canonical c on c.logical_key=g.logical_key
)
select jsonb_build_object(
  'history_episodes',(select rows from episodes),
  'history_movies',(select rows from movies),
  'generated_at',now()
);
$$;

create or replace function public.cinetracker_discover_fresh_v387(p_kind text,p_limit integer default 48)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select lower(coalesce(p_kind,'movie')) kind,least(greatest(coalesce(p_limit,48),1),96)::int lim
), candidates as materialized (
  select distinct on (public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb))
    m.id media_id,m.media_type,m.media_kind,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    m.title,m.original_title,m.poster_path,m.release_year,m.raw_tmdb,m.updated_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (m.raw_tmdb->>'vote_average')::numeric else 0 end vote_average
  from public.media m,cfg
  where public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
    and m.poster_path is not null
    and coalesce(m.release_year,0)>1990
    and (
      (cfg.kind='movie' and m.media_type='movie')
      or (cfg.kind='series' and m.media_type='tv' and coalesce(m.media_kind,'series')<>'anime')
      or (cfg.kind='anime' and m.media_type='tv' and m.media_kind='anime')
    )
    and case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (m.raw_tmdb->>'vote_average')::numeric else 0 end >= 7.5
  order by public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),
    (m.poster_path is not null) desc,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (m.raw_tmdb->>'vote_average')::numeric else 0 end desc,
    m.updated_at desc nulls last,m.id desc
), eligible as materialized (
  select c.*
  from candidates c
  where not exists (
    select 1 from public.media mx
    where mx.media_type=c.media_type
      and public.cinetracker_effective_tmdb_id(mx.tmdb_id,mx.raw_tmdb)=c.tmdb_id
      and (
        exists(select 1 from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id=mx.id)
        or exists(select 1 from public.episode_progress ep where ep.profile_id=auth.uid() and ep.media_id=mx.id and ep.watched=true)
        or exists(select 1 from public.media_overrides mo where mo.profile_id=auth.uid() and mo.media_id=mx.id
          and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate'))
      )
  )
)
select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',e.media_id,'media_type',e.media_type,'media_kind',e.media_kind,'tmdb_id',e.tmdb_id,'id',e.tmdb_id,
  'title',case when e.media_type='movie' then e.title else null end,
  'name',case when e.media_type='tv' then e.title else null end,
  'original_title',case when e.media_type='movie' then coalesce(e.original_title,e.raw_tmdb->>'original_title') else null end,
  'original_name',case when e.media_type='tv' then coalesce(e.original_title,e.raw_tmdb->>'original_name') else null end,
  'poster_path',e.poster_path,'vote_average',e.vote_average,
  'release_date',case when e.media_type='movie' then coalesce(nullif(e.raw_tmdb->>'release_date',''),e.release_year::text||'-01-01') else null end,
  'first_air_date',case when e.media_type='tv' then coalesce(nullif(e.raw_tmdb->>'first_air_date',''),e.release_year::text||'-01-01') else null end,
  'genre_ids',case when e.media_kind='anime' then coalesce(e.raw_tmdb->'genre_ids','[16]'::jsonb) else coalesce(e.raw_tmdb->'genre_ids','[]'::jsonb) end,
  'original_language',coalesce(e.raw_tmdb->>'original_language',case when e.media_kind='anime' then 'ja' end),
  'origin_country',coalesce(e.raw_tmdb->'origin_country',case when e.media_kind='anime' then '["JP"]'::jsonb else '[]'::jsonb end)
)) order by e.vote_average desc,e.release_year desc nulls last,e.tmdb_id desc),'[]'::jsonb)
from (select * from eligible order by vote_average desc,release_year desc nulls last,tmdb_id desc limit (select lim from cfg)) e;
$$;

revoke all on function public.cinetracker_home_history_v387() from public,anon;
grant execute on function public.cinetracker_home_history_v387() to authenticated;
revoke all on function public.cinetracker_discover_fresh_v387(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v387(text,integer) to authenticated;
notify pgrst,'reload schema';
