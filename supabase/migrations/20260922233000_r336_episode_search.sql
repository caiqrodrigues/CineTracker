CREATE OR REPLACE FUNCTION public.cinetracker_episode_search_targets_v336(p_limit integer DEFAULT 16)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select (select auth.uid()) uid,
         least(greatest(coalesce(p_limit,16),1),30)::int lim
),
user_media_ids as materialized (
  select distinct mo.media_id
  from public.media_overrides mo cross join cfg c
  where mo.profile_id=c.uid
  union
  select distinct wh.media_id
  from public.watch_history wh cross join cfg c
  where wh.profile_id=c.uid and wh.media_id is not null
  union
  select distinct pe.media_id
  from public.watch_play_events_v0994 pe cross join cfg c
  where pe.profile_id=c.uid and pe.media_id is not null
  union
  select distinct ep.media_id
  from public.episode_progress ep cross join cfg c
  where ep.profile_id=c.uid and ep.media_id is not null
),
mapped as materialized (
  select m.id media_id,
         public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::int tmdb_id,
         m.title,m.poster_path,m.raw_tmdb,m.updated_at
  from user_media_ids u
  join public.media m on m.id=u.media_id
  where m.media_type='tv'
    and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
),
activity as materialized (
  select mm.tmdb_id,
         max(a.at) last_activity,
         max(a.season_number) filter(where a.season_number>0) max_watched_season
  from mapped mm
  left join lateral (
    select wh.watched_at at,wh.season_number
    from public.watch_history wh cross join cfg c
    where wh.profile_id=c.uid and wh.media_id=mm.media_id and wh.item_type='episode'
    union all
    select pe.played_at,pe.season_number
    from public.watch_play_events_v0994 pe cross join cfg c
    where pe.profile_id=c.uid and pe.media_id=mm.media_id and pe.item_type='episode'
    union all
    select ep.updated_at,ep.season_number
    from public.episode_progress ep cross join cfg c
    where ep.profile_id=c.uid and ep.media_id=mm.media_id
    union all
    select mo.updated_at,null::int
    from public.media_overrides mo cross join cfg c
    where mo.profile_id=c.uid and mo.media_id=mm.media_id
  ) a on true
  group by mm.tmdb_id
),
canonical as materialized (
  select distinct on (tmdb_id)
    tmdb_id,title,poster_path,raw_tmdb,updated_at
  from mapped
  order by tmdb_id,
    ((raw_tmdb->>'enriched_at') is not null) desc,
    case when coalesce(raw_tmdb->>'enriched_at','')~'^\d{4}-\d{2}-\d{2}T'
         then (raw_tmdb->>'enriched_at')::timestamptz end desc nulls last,
    updated_at desc,
    media_id desc
),
final as (
  select
    c.tmdb_id,c.title series_title,c.poster_path,
    greatest(
      1,
      coalesce(a.max_watched_season,0),
      coalesce(nullif(c.raw_tmdb->>'number_of_seasons','')::int,0),
      coalesce(nullif(c.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0),
      coalesce(nullif(c.raw_tmdb->'next_episode_to_air'->>'season_number','')::int,0)
    ) current_season,
    a.last_activity
  from canonical c
  left join activity a using(tmdb_id)
)
select coalesce(jsonb_agg(jsonb_build_object(
  'tmdb_id',tmdb_id,
  'series_title',series_title,
  'poster_path',poster_path,
  'season_numbers',to_jsonb(array_remove(array[current_season,greatest(1,current_season-1)],null)),
  'last_activity',last_activity
) order by last_activity desc nulls last,series_title),'[]'::jsonb)
from (
  select * from final
  order by last_activity desc nulls last,series_title
  limit (select lim from cfg)
) z;
$function$
;

CREATE OR REPLACE FUNCTION public.cinetracker_episode_search_v336(p_query text, p_limit integer DEFAULT 8)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select lower(trim(coalesce(p_query,''))) q,
         least(greatest(coalesce(p_limit,8),1),20)::int lim
),
ranked as (
  select e.*,
    case
      when lower(coalesce(e.name_en,''))=(select q from cfg)
        or lower(coalesce(e.name_local,''))=(select q from cfg) then 0
      when lower(coalesce(e.name_en,'')) like (select q from cfg)||'%'
        or lower(coalesce(e.name_local,'')) like (select q from cfg)||'%' then 1
      else 2
    end exact_rank
  from public.episode_catalog_v336 e
  cross join cfg c
  where length(c.q)>=2
    and (
      lower(coalesce(e.name_en,'')) like '%'||c.q||'%'
      or lower(coalesce(e.name_local,'')) like '%'||c.q||'%'
    )
  order by exact_rank,e.air_date desc nulls last,e.show_name,e.season_number desc,e.episode_number desc
  limit (select lim from cfg)
)
select coalesce(jsonb_agg(jsonb_build_object(
  'media_type','episode',
  'show_tmdb_id',show_tmdb_id,
  'show_name',show_name,
  'show_original_name',show_original_name,
  'season_number',season_number,
  'episode_number',episode_number,
  'episode_tmdb_id',episode_tmdb_id,
  'name',coalesce(nullif(name_local,''),nullif(name_en,''),'Episódio '||episode_number::text),
  'original_name',name_en,
  'air_date',air_date,
  'vote_average',vote_average,
  'still_path',still_path,
  'poster_path',poster_path
) order by exact_rank,air_date desc nulls last,show_name,season_number desc,episode_number desc),'[]'::jsonb)
from ranked;
$function$
;
revoke execute on function public.cinetracker_episode_search_v336(text,integer) from public,anon;
grant execute on function public.cinetracker_episode_search_v336(text,integer) to authenticated;
revoke execute on function public.cinetracker_episode_search_targets_v336(integer) from public,anon;
grant execute on function public.cinetracker_episode_search_targets_v336(integer) to authenticated;
notify pgrst,'reload schema';
