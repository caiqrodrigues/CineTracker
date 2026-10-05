-- CineTracker Web r475 — strict fresh/daily exclusion by TMDB identity and title aliases.

create or replace function public.cinetracker_discover_fresh_v475(p_kind text,p_limit integer default 48)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select
    lower(coalesce(p_kind,'movie')) as kind,
    least(greatest(coalesce(p_limit,48),1),48)::int as lim
), known_ids as materialized (
  select mo.media_id
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
    and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate')
  union
  select wh.media_id
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id is not null
  union
  select ep.media_id
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true
), known as materialized (
  select distinct
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer as tmdb_id,
    a.alias
  from known_ids k
  join public.media m on m.id=k.media_id
  cross join lateral unnest(array[
    nullif(lower(trim(m.title)),''),
    nullif(lower(trim(m.raw_tmdb->>'title')),''),
    nullif(lower(trim(m.raw_tmdb->>'name')),''),
    nullif(lower(trim(m.raw_tmdb->>'original_title')),''),
    nullif(lower(trim(m.raw_tmdb->>'original_name')),'')
  ]) a(alias)
  where a.alias is not null
), source as materialized (
  select x.item,x.ord,m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer as tmdb_id,
    array_remove(array[
      nullif(lower(trim(m.title)),''),
      nullif(lower(trim(m.raw_tmdb->>'title')),''),
      nullif(lower(trim(m.raw_tmdb->>'name')),''),
      nullif(lower(trim(m.raw_tmdb->>'original_title')),''),
      nullif(lower(trim(m.raw_tmdb->>'original_name')),'')
    ],null) as aliases
  from cfg
  cross join lateral jsonb_array_elements(public.cinetracker_discover_fresh_v421(cfg.kind,48)) with ordinality x(item,ord)
  join public.media m on m.id=(x.item->>'media_id')::bigint
), eligible as (
  select s.*
  from source s
  where not exists (
    select 1
    from known k
    where k.media_type=s.media_type
      and (
        (s.tmdb_id>0 and k.tmdb_id=s.tmdb_id)
        or k.alias=any(s.aliases)
      )
  )
)
select coalesce(
  jsonb_agg(item || jsonb_build_object('__ct475_strict_fresh',true) order by ord),
  '[]'::jsonb
)
from (
  select item,ord
  from eligible
  order by ord
  limit (select lim from cfg)
) picked;
$$;

revoke all on function public.cinetracker_discover_fresh_v475(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v475(text,integer) to authenticated;

notify pgrst,'reload schema';
