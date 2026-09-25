create or replace function public.cinetracker_watchlist_full_v376()
returns jsonb
language sql
stable
security invoker
set search_path = 'public'
as $$
with chosen as (
  select
    mo.media_id,
    max(coalesce(mo.updated_at,mo.created_at)) as added_at
  from public.media_overrides mo
  where (select auth.uid()) is not null
    and mo.profile_id=(select auth.uid())
    and mo.state in ('AddedToWatchlist','WatchLater')
  group by mo.media_id
), payload as (
  select
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'media_id',m.id,
          'media_type',m.media_type,
          'media_kind',m.media_kind,
          'tmdb_id',public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),
          'title',m.title,
          'poster_path',m.poster_path,
          'release_year',m.release_year,
          'runtime_minutes',coalesce(m.runtime_minutes,0),
          'raw_tmdb',coalesce(m.raw_tmdb,'{}'::jsonb),
          'added_at',c.added_at
        )
        order by c.added_at desc nulls last, m.id desc
      ),
      '[]'::jsonb
    ) as rows,
    count(*) filter(where m.media_type='movie')::bigint as movies,
    count(*) filter(where m.media_type='tv')::bigint as series
  from chosen c
  join public.media m on m.id=c.media_id
)
select jsonb_build_object(
  'rows',rows,
  'counts',jsonb_build_object('movie',movies,'series',series),
  'count',movies+series,
  'generated_at',now()
)
from payload;
$$;

revoke all on function public.cinetracker_watchlist_full_v376() from public;
grant execute on function public.cinetracker_watchlist_full_v376() to authenticated;
