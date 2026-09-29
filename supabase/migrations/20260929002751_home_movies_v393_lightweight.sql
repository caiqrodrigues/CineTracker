create or replace function public.cinetracker_home_movies_v393()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with chosen as materialized (
  select
    m.id as media_id,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id,
    m.title,
    m.poster_path,
    m.release_year,
    coalesce(m.runtime_minutes,
      case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int end,
      0) as runtime_minutes,
    coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb) as genres,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (m.raw_tmdb->>'vote_average')::numeric end as vote_average,
    nullif(m.raw_tmdb->>'release_date','') as release_date,
    max(coalesce(mo.updated_at,mo.created_at)) as added_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where (select auth.uid()) is not null
    and mo.profile_id=(select auth.uid())
    and mo.state in ('AddedToWatchlist','WatchLater')
    and m.media_type='movie'
  group by m.id,m.tmdb_id,m.raw_tmdb,m.title,m.poster_path,m.release_year,m.runtime_minutes,m.genres
),
ordered as materialized (
  select * from chosen order by added_at desc nulls last,media_id desc
)
select jsonb_build_object(
  'rows',coalesce((
    select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
      'media_id',media_id,'media_type','movie','tmdb_id',tmdb_id,'title',title,'poster_path',poster_path,
      'release_year',release_year,'release_date',release_date,'runtime_minutes',runtime_minutes,'genres',genres,
      'vote_average',vote_average,'added_at',added_at
    )) order by added_at desc nulls last,media_id desc)
    from ordered
  ),'[]'::jsonb),
  'count',(select count(*) from ordered),
  'generated_at',now()
);
$$;
