-- CineTracker r251: remove unused recommendation helper RPCs created during rollout.
-- The final Web r251 persists recommendation exposure directly through
-- public.shown_recommendations under per-user RLS, so these SECURITY DEFINER
-- helpers are unnecessary attack surface.

drop function if exists public.cinetracker_mark_recommendation_shown_v1(text, bigint, text);
drop function if exists public.cinetracker_recent_recommendations_v1(integer);
