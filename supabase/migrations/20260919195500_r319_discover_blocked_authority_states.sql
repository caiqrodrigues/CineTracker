create or replace function public.cinetracker_discover_blocked_v319()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
with dashboard as materialized (
  select *
  from public.cinetracker_profile_media_dashboard_v0991()
),
dashboard_rows as (
  select
    d.media_type,
    d.tmdb_id,
    d.title,
    d.release_year,
    d.raw_tmdb,
    d.is_watchlist as is_watchlist,
    (
      d.is_seen
      or d.is_in_progress
      or d.is_up_to_date
      or d.is_completed
      or coalesce(d.watched_episodes,0) > 0
      or d.last_watched_at is not null
    ) as is_seen,
    (
      d.is_watchlist
      or d.is_seen
      or d.is_in_progress
      or d.is_up_to_date
      or d.is_completed
      or coalesce(d.watched_episodes,0) > 0
      or d.last_watched_at is not null
    ) as is_blocked
  from dashboard d
  where d.tmdb_id > 0
),
not_interested as (
  select distinct
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,
    m.title,
    m.release_year,
    coalesce(m.raw_tmdb,'{}'::jsonb) as raw_tmdb,
    false as is_watchlist,
    false as is_seen,
    true as is_blocked
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where mo.profile_id=(select auth.uid())
    and mo.state='NotInterested'
    and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) > 0
),
combined as (
  select * from dashboard_rows
  union all
  select * from not_interested
),
agg as (
  select
    media_type,
    tmdb_id,
    bool_or(is_watchlist) as is_watchlist,
    bool_or(is_seen) as is_seen,
    bool_or(is_blocked) as is_blocked
  from combined
  group by media_type,tmdb_id
),
meta as (
  select distinct on (media_type,tmdb_id)
    media_type,
    tmdb_id,
    title,
    release_year,
    raw_tmdb
  from combined
  order by media_type,tmdb_id,
    (coalesce(raw_tmdb,'{}'::jsonb) <> '{}'::jsonb) desc,
    (coalesce(title,'') <> '') desc
),
dedup as (
  select
    a.media_type,a.tmdb_id,m.title,m.release_year,m.raw_tmdb,
    a.is_watchlist,a.is_seen,a.is_blocked
  from agg a
  join meta m using(media_type,tmdb_id)
)
select jsonb_build_object(
  'blocked_keys',coalesce((
    select jsonb_agg(media_type||':'||tmdb_id::text order by media_type,tmdb_id)
    from dedup where is_blocked
  ),'[]'::jsonb),
  'watch_keys',coalesce((
    select jsonb_agg(media_type||':'||tmdb_id::text order by media_type,tmdb_id)
    from dedup where is_watchlist
  ),'[]'::jsonb),
  'seen_keys',coalesce((
    select jsonb_agg(media_type||':'||tmdb_id::text order by media_type,tmdb_id)
    from dedup where is_seen
  ),'[]'::jsonb),
  'movie_ids',coalesce((
    select jsonb_agg(tmdb_id order by tmdb_id)
    from dedup where media_type='movie' and is_blocked
  ),'[]'::jsonb),
  'tv_ids',coalesce((
    select jsonb_agg(tmdb_id order by tmdb_id)
    from dedup where media_type='tv' and is_blocked
  ),'[]'::jsonb),
  'aliases',coalesce((
    select jsonb_agg(jsonb_build_object(
      'media_type',media_type,
      'tmdb_id',tmdb_id,
      'title',title,
      'release_year',release_year,
      'localized_title',raw_tmdb->>'title',
      'localized_name',raw_tmdb->>'name',
      'original_title',raw_tmdb->>'original_title',
      'original_name',raw_tmdb->>'original_name',
      'is_watchlist',is_watchlist,
      'is_seen',is_seen
    ))
    from dedup where is_blocked
  ),'[]'::jsonb),
  'count',(select count(*) from dedup where is_blocked),
  'generated_at',now()
);
$$;

revoke execute on function public.cinetracker_discover_blocked_v319() from public, anon;
grant execute on function public.cinetracker_discover_blocked_v319() to authenticated;
notify pgrst, 'reload schema';
