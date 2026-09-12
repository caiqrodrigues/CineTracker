-- r259: fast, security-invoker recommendation state for Discover.
-- Avoids the full profile dashboard on the critical path and returns only IDs plus
-- a bounded set of usable Watchlist candidates.
create or replace function public.cinetracker_recommendation_state_v108()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with me as (
  select auth.uid() as profile_id
),
hard_excluded as materialized (
  select distinct m.tmdb_id, m.media_type
  from public.media m
  join public.media_overrides mo on mo.media_id=m.id
  join me on me.profile_id=mo.profile_id
  where mo.state in ('AlreadySeen','Completed','InProgress','UpToDate','NotInterested')
    and m.tmdb_id>0
  union
  select distinct m.tmdb_id, m.media_type
  from public.media m
  join public.watch_history wh on wh.media_id=m.id
  join me on me.profile_id=wh.profile_id
  where m.tmdb_id>0
  union
  select distinct m.tmdb_id, m.media_type
  from public.media m
  join public.episode_progress ep on ep.media_id=m.id and ep.watched=true
  join me on me.profile_id=ep.profile_id
  where m.tmdb_id>0
),
watchlist_keys as materialized (
  select distinct m.tmdb_id, m.media_type
  from public.media m
  join public.media_overrides mo on mo.media_id=m.id
  join me on me.profile_id=mo.profile_id
  where mo.state in ('AddedToWatchlist','WatchLater')
    and m.tmdb_id>0
),
fresh_excluded as (
  select * from hard_excluded
  union
  select * from watchlist_keys
),
watch_candidates as (
  select distinct on (m.media_type,m.tmdb_id)
    m.id as media_id,
    m.media_type,
    m.media_kind,
    m.tmdb_id,
    m.title,
    m.poster_path,
    m.release_year,
    coalesce(nullif(m.raw_tmdb->>'vote_average','')::numeric,0) as vote_average,
    coalesce(m.raw_tmdb->'genre_ids','[]'::jsonb) as genre_ids,
    coalesce(m.raw_tmdb->>'original_language','') as original_language,
    coalesce(m.raw_tmdb->'origin_country','[]'::jsonb) as origin_country,
    coalesce(mo.updated_at,mo.created_at) as added_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  join me on me.profile_id=mo.profile_id
  left join hard_excluded h on h.media_type=m.media_type and h.tmdb_id=m.tmdb_id
  where mo.state in ('AddedToWatchlist','WatchLater')
    and m.tmdb_id>0
    and h.tmdb_id is null
  order by m.media_type,m.tmdb_id,
    (m.poster_path is not null) desc,
    (coalesce(m.raw_tmdb,'{}'::jsonb)<>'{}'::jsonb) desc,
    coalesce(mo.updated_at,mo.created_at) desc,
    m.id desc
  limit 80
)
select jsonb_build_object(
  'hard_excluded',coalesce((
    select jsonb_agg(jsonb_build_object('tmdb_id',tmdb_id,'media_type',media_type))
    from hard_excluded
  ),'[]'::jsonb),
  'fresh_excluded',coalesce((
    select jsonb_agg(jsonb_build_object('tmdb_id',tmdb_id,'media_type',media_type))
    from fresh_excluded
  ),'[]'::jsonb),
  'watchlist',coalesce((
    select jsonb_agg(jsonb_build_object(
      'media_id',media_id,
      'media_type',media_type,
      'media_kind',media_kind,
      'tmdb_id',tmdb_id,
      'title',title,
      'poster_path',poster_path,
      'release_year',release_year,
      'vote_average',vote_average,
      'genre_ids',genre_ids,
      'original_language',original_language,
      'origin_country',origin_country,
      'added_at',added_at
    ) order by added_at desc nulls last)
    from watch_candidates
  ),'[]'::jsonb),
  'generated_at',now()
);
$function$;

revoke all on function public.cinetracker_recommendation_state_v108() from public;
revoke all on function public.cinetracker_recommendation_state_v108() from anon;
grant execute on function public.cinetracker_recommendation_state_v108() to authenticated;
grant execute on function public.cinetracker_recommendation_state_v108() to service_role;
