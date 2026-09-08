create or replace function public.cinetracker_watchlist_candidates_v116()
returns jsonb
language sql
stable
set search_path to 'public'
as $$
  select jsonb_build_object(
    'rows', coalesce(jsonb_agg(to_jsonb(d) order by d.media_kind, d.title), '[]'::jsonb),
    'count', count(*)
  )
  from public.cinetracker_profile_media_dashboard_v0991() d
  where d.is_watchlist = true
    and coalesce(d.is_seen,false) = false
    and coalesce(d.is_completed,false) = false
    and coalesce(d.is_in_progress,false) = false
    and coalesce(d.is_up_to_date,false) = false
    and coalesce(d.watched_episodes,0) = 0
    and d.tmdb_id > 0;
$$;

grant execute on function public.cinetracker_watchlist_candidates_v116() to authenticated;
