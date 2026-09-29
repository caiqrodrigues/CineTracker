create or replace function public.cinetracker_home_movies_v405(
  p_limit integer default 120,
  p_offset integer default 0
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $function$
with cfg as materialized (
  select
    greatest(1, least(coalesce(p_limit,120),240))::int as lim,
    greatest(coalesce(p_offset,0),0)::int as off
),
chosen as materialized (
  select
    m.id as media_id,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id,
    m.title,
    m.poster_path,
    m.release_year,
    coalesce(
      m.runtime_minutes,
      case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$'
        then (m.raw_tmdb->>'runtime')::int end,
      0
    ) as runtime_minutes,
    coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb) as genres,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric end as vote_average,
    nullif(m.raw_tmdb->>'release_date','') as release_date,
    max(coalesce(mo.updated_at,mo.created_at)) as added_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where (select auth.uid()) is not null
    and mo.profile_id=(select auth.uid())
    and mo.state in ('AddedToWatchlist','WatchLater')
    and m.media_type='movie'
  group by
    m.id,m.tmdb_id,m.raw_tmdb,m.title,m.poster_path,m.release_year,
    m.runtime_minutes,m.genres
),
page_rows as materialized (
  select *
  from chosen
  order by added_at desc nulls last,media_id desc
  limit (select lim from cfg)
  offset (select off from cfg)
)
select jsonb_build_object(
  'rows',coalesce((
    select jsonb_agg(
      jsonb_strip_nulls(jsonb_build_object(
        'media_id',media_id,
        'media_type','movie',
        'tmdb_id',tmdb_id,
        'title',title,
        'poster_path',poster_path,
        'release_year',release_year,
        'release_date',release_date,
        'runtime_minutes',runtime_minutes,
        'genres',genres,
        'vote_average',vote_average,
        'added_at',added_at
      ))
      order by added_at desc nulls last,media_id desc
    )
    from page_rows
  ),'[]'::jsonb),
  'count',(select count(*)::int from chosen),
  'offset',(select off from cfg),
  'limit',(select lim from cfg),
  'generated_at',now()
);
$function$;

revoke all on function public.cinetracker_home_movies_v405(integer,integer) from public, anon;
grant execute on function public.cinetracker_home_movies_v405(integer,integer) to authenticated, service_role;

comment on function public.cinetracker_home_movies_v405(integer,integer)
is 'CineTracker r405: true server-side movie Watchlist paging without materializing the legacy full JSON payload first.';
