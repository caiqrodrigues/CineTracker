-- r337: seed the searchable episode catalog from canonical watch history and expose normalized search results.
insert into public.episode_catalog_v336(
  show_tmdb_id, season_number, episode_number, episode_tmdb_id,
  show_name, show_original_name, name_local, name_en,
  air_date, vote_average, still_path, poster_path, updated_at
)
select
  x.show_tmdb_id, x.season_number, x.episode_number, null,
  x.show_name, x.show_original_name, x.episode_title, x.episode_title,
  null, null, null, x.poster_path, x.updated_at
from (
  select distinct on (
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),
    wh.season_number, wh.episode_number
  )
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as show_tmdb_id,
    wh.season_number,
    wh.episode_number,
    m.title as show_name,
    m.original_title as show_original_name,
    nullif(trim(wh.title),'') as episode_title,
    m.poster_path,
    greatest(coalesce(wh.watched_at,wh.created_at),m.updated_at) as updated_at
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  where wh.item_type='episode'
    and coalesce(wh.season_number,0)>0
    and coalesce(wh.episode_number,0)>0
    and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
    and nullif(trim(wh.title),'') is not null
  order by
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),
    wh.season_number,wh.episode_number,
    wh.watched_at desc nulls last,wh.id desc
) x
on conflict (show_tmdb_id,season_number,episode_number) do update set
  show_name=coalesce(excluded.show_name,public.episode_catalog_v336.show_name),
  show_original_name=coalesce(excluded.show_original_name,public.episode_catalog_v336.show_original_name),
  name_local=coalesce(excluded.name_local,public.episode_catalog_v336.name_local),
  name_en=coalesce(public.episode_catalog_v336.name_en,excluded.name_en),
  poster_path=coalesce(excluded.poster_path,public.episode_catalog_v336.poster_path),
  updated_at=greatest(public.episode_catalog_v336.updated_at,excluded.updated_at);

revoke insert, update, delete, truncate, references, trigger
  on table public.episode_catalog_v336 from anon, authenticated;
grant select on table public.episode_catalog_v336 to authenticated;

create or replace function public.cinetracker_episode_search_v337(
  p_query text,
  p_limit integer default 12
)
returns jsonb
language sql
stable
security invoker
set search_path to 'public'
as $function$
with cfg as (
  select lower(trim(coalesce(p_query,''))) q,
         least(greatest(coalesce(p_limit,12),1),24)::int lim
),
ranked as (
  select e.*,
    case
      when lower(coalesce(e.name_local,''))=(select q from cfg)
        or lower(coalesce(e.name_en,''))=(select q from cfg) then 0
      when lower(coalesce(e.name_local,'')) like (select q from cfg)||'%'
        or lower(coalesce(e.name_en,'')) like (select q from cfg)||'%' then 1
      else 2
    end as match_rank
  from public.episode_catalog_v336 e
  cross join cfg c
  where length(c.q)>=2
    and (
      lower(coalesce(e.name_local,'')) like '%'||c.q||'%'
      or lower(coalesce(e.name_en,'')) like '%'||c.q||'%'
    )
  order by match_rank,e.air_date desc nulls last,e.updated_at desc
  limit (select lim from cfg)
)
select coalesce(jsonb_agg(jsonb_build_object(
  'media_type','episode',
  'tmdb_id',show_tmdb_id,
  'series_title',show_name,
  'series_original_title',show_original_name,
  'season_number',season_number,
  'episode_number',episode_number,
  'episode_tmdb_id',episode_tmdb_id,
  'episode_title',coalesce(nullif(name_local,''),nullif(name_en,''),'Episódio '||episode_number::text),
  'original_episode_title',name_en,
  'air_date',air_date,
  'vote_average',vote_average,
  'still_path',still_path,
  'poster_path',poster_path,
  'source','catalog',
  'match_score',match_rank
) order by match_rank,air_date desc nulls last,updated_at desc),'[]'::jsonb)
from ranked;
$function$;

revoke execute on function public.cinetracker_episode_search_v337(text,integer) from public,anon;
grant execute on function public.cinetracker_episode_search_v337(text,integer) to authenticated;
notify pgrst,'reload schema';
