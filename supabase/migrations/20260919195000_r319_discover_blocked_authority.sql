create or replace function public.cinetracker_discover_blocked_v319()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
with d as (
  select * from public.cinetracker_profile_media_dashboard_v0991()
), blocked as (
  select * from d
  where is_watchlist or is_seen or is_in_progress or is_up_to_date or is_completed
     or watched_episodes>0 or last_watched_at is not null
)
select jsonb_build_object(
  'keys',coalesce(jsonb_agg(media_type||':'||tmdb_id::text) filter(where tmdb_id>0),'[]'::jsonb),
  'movie_ids',coalesce(jsonb_agg(distinct tmdb_id) filter(where media_type='movie' and tmdb_id>0),'[]'::jsonb),
  'tv_ids',coalesce(jsonb_agg(distinct tmdb_id) filter(where media_type='tv' and tmdb_id>0),'[]'::jsonb),
  'aliases',coalesce(jsonb_agg(jsonb_build_object(
    'media_type',media_type,'release_year',release_year,'title',title,
    'localized_title',raw_tmdb->>'title','localized_name',raw_tmdb->>'name',
    'original_title',raw_tmdb->>'original_title','original_name',raw_tmdb->>'original_name'
  )),'[]'::jsonb)
) from blocked;
$$;

revoke execute on function public.cinetracker_discover_blocked_v319() from public, anon;
grant execute on function public.cinetracker_discover_blocked_v319() to authenticated;
notify pgrst, 'reload schema';
