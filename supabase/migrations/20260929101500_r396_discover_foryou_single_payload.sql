create or replace function public.cinetracker_discover_watch_unseen_v396(
  p_kind text,
  p_limit integer default 30
)
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with cfg as (
  select lower(coalesce(p_kind,'movie')) kind,
         least(greatest(coalesce(p_limit,30),1),60)::int lim
),
raw as materialized (
  select
    m.id media_id,
    m.media_type,
    m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    m.title,
    m.original_title,
    m.poster_path,
    m.release_year,
    m.raw_tmdb,
    max(coalesce(mo.updated_at,mo.created_at)) added_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id,
       cfg
  where mo.profile_id=auth.uid()
    and mo.state in ('AddedToWatchlist','WatchLater')
    and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
    and m.poster_path is not null
    and (
      (cfg.kind='movie' and m.media_type='movie')
      or (cfg.kind='series' and m.media_type='tv' and coalesce(m.media_kind,'series')<>'anime')
      or (cfg.kind='anime' and m.media_type='tv' and m.media_kind='anime')
    )
  group by m.id,m.media_type,m.media_kind,m.tmdb_id,m.raw_tmdb,m.title,m.original_title,m.poster_path,m.release_year
),
dedup as materialized (
  select distinct on (tmdb_id) *
  from raw
  order by tmdb_id,added_at desc nulls last,media_id desc
),
eligible as materialized (
  select d.*
  from dedup d
  where not exists (
    select 1
    from public.media mx
    where mx.media_type=d.media_type
      and public.cinetracker_effective_tmdb_id(mx.tmdb_id,mx.raw_tmdb)=d.tmdb_id
      and (
        exists (
          select 1 from public.watch_history wh
          where wh.profile_id=auth.uid()
            and wh.media_id=mx.id
            and wh.item_type in ('episode','movie')
        )
        or exists (
          select 1 from public.episode_progress ep
          where ep.profile_id=auth.uid()
            and ep.media_id=mx.id
            and ep.watched=true
        )
        or exists (
          select 1 from public.media_overrides sx
          where sx.profile_id=auth.uid()
            and sx.media_id=mx.id
            and sx.state in ('AlreadySeen','Completed','InProgress','UpToDate')
        )
      )
  )
),
picked as materialized (
  select *
  from eligible
  order by added_at desc nulls last,media_id desc
  limit (select lim from cfg)
)
select coalesce(
  jsonb_agg(
    jsonb_strip_nulls(
      jsonb_build_object(
        'media_id',media_id,
        'media_type',media_type,
        'media_kind',media_kind,
        'tmdb_id',tmdb_id,
        'id',tmdb_id,
        'title',case when media_type='movie' then title else null end,
        'name',case when media_type='tv' then title else null end,
        'original_title',case when media_type='movie' then coalesce(original_title,raw_tmdb->>'original_title') else null end,
        'original_name',case when media_type='tv' then coalesce(original_title,raw_tmdb->>'original_name') else null end,
        'poster_path',poster_path,
        'vote_average',case when coalesce(raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
          then (raw_tmdb->>'vote_average')::numeric else 0 end,
        'release_date',case when media_type='movie'
          then coalesce(nullif(raw_tmdb->>'release_date',''),release_year::text||'-01-01') else null end,
        'first_air_date',case when media_type='tv'
          then coalesce(nullif(raw_tmdb->>'first_air_date',''),release_year::text||'-01-01') else null end,
        'genre_ids',coalesce(raw_tmdb->'genre_ids',case when media_kind='anime' then '[16]'::jsonb else '[]'::jsonb end),
        'original_language',coalesce(raw_tmdb->>'original_language',case when media_kind='anime' then 'ja' end),
        'origin_country',coalesce(raw_tmdb->'origin_country',case when media_kind='anime' then '["JP"]'::jsonb else '[]'::jsonb end),
        'added_at',added_at
      )
    )
    order by added_at desc nulls last,media_id desc
  ),
  '[]'::jsonb
)
from picked;
$function$;

create or replace function public.cinetracker_discover_foryou_v396(
  p_watch_limit integer default 30,
  p_fresh_limit integer default 24
)
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
select jsonb_build_object(
  'watch',jsonb_build_object(
    'movie',public.cinetracker_discover_watch_unseen_v396('movie',p_watch_limit),
    'series',public.cinetracker_discover_watch_unseen_v396('series',p_watch_limit),
    'anime',public.cinetracker_discover_watch_unseen_v396('anime',p_watch_limit)
  ),
  'fresh',jsonb_build_object(
    'movie',public.cinetracker_discover_fresh_v387('movie',p_fresh_limit),
    'series',public.cinetracker_discover_fresh_v387('series',p_fresh_limit),
    'anime',public.cinetracker_discover_fresh_v387('anime',p_fresh_limit)
  ),
  'generated_at',now()
);
$function$;
