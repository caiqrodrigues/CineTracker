create or replace function public.cinetracker_watchlist_full_v119()
returns jsonb
language sql
stable
security invoker
set search_path = 'public'
as $$
with raw as (
  select
    m.id as media_id,
    m.media_type,
    m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,
    m.title,
    m.poster_path,
    m.release_year,
    coalesce(m.raw_tmdb,'{}'::jsonb) as raw_tmdb,
    max(coalesce(mo.updated_at,mo.created_at)) over (
      partition by m.media_type,
      case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
        then public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
        else 'id:'||m.id::text end
    ) as added_at,
    m.updated_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where (select auth.uid()) is not null
    and mo.profile_id=(select auth.uid())
    and mo.state in ('AddedToWatchlist','WatchLater')
), best as (
  select distinct on (
    media_type,
    case when tmdb_id>0 then tmdb_id::text else 'id:'||media_id::text end
  )
    media_id,media_type,media_kind,tmdb_id,title,poster_path,release_year,raw_tmdb,added_at
  from raw
  order by
    media_type,
    case when tmdb_id>0 then tmdb_id::text else 'id:'||media_id::text end,
    (tmdb_id>0) desc,
    (coalesce(raw_tmdb,'{}'::jsonb)<>'{}'::jsonb) desc,
    (poster_path is not null) desc,
    updated_at desc nulls last,
    media_id desc
), payload as (
  select coalesce(jsonb_agg(to_jsonb(b) order by lower(coalesce(b.title,'')),b.media_id),'[]'::jsonb) as rows,
         count(*) filter(where media_type='movie')::bigint as movies,
         count(*) filter(where media_type='tv')::bigint as series
  from best b
)
select jsonb_build_object(
  'rows',rows,
  'counts',jsonb_build_object('movie',movies,'series',series),
  'count',movies+series,
  'generated_at',now()
)
from payload;
$$;

revoke all on function public.cinetracker_watchlist_full_v119() from public;
grant execute on function public.cinetracker_watchlist_full_v119() to authenticated;
