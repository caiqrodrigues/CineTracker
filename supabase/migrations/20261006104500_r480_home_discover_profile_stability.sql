-- CineTracker Web r480 — Home stability support, non-repeating strict discovery and pure Profile contract.

create or replace function public.cinetracker_discover_fresh_v480(
  p_kind text,
  p_limit integer default 48
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
  select coalesce(public.cinetracker_discover_fresh_v479(p_kind,p_limit),'[]'::jsonb);
$$;

create or replace function public.cinetracker_discover_watch_smart_v480(
  p_kind text,
  p_limit integer default 30
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
  select coalesce(public.cinetracker_discover_watch_smart_v479(p_kind,p_limit),'[]'::jsonb);
$$;

create or replace function public.cinetracker_record_recommendations_v480(p_items jsonb)
returns jsonb
language sql
volatile
security invoker
set search_path=public
as $$
  select coalesce(public.cinetracker_record_recommendations_v479(p_items),'{}'::jsonb)
    || jsonb_build_object('source','v480');
$$;

create or replace function public.cinetracker_profile_lists_v480()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
  select coalesce(public.cinetracker_profile_lists_v479(),'{}'::jsonb)
    || jsonb_build_object('source','v480-history-pure');
$$;

revoke all on function public.cinetracker_discover_fresh_v480(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v480(text,integer) to authenticated;
revoke all on function public.cinetracker_discover_watch_smart_v480(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_watch_smart_v480(text,integer) to authenticated;
revoke all on function public.cinetracker_record_recommendations_v480(jsonb) from public,anon;
grant execute on function public.cinetracker_record_recommendations_v480(jsonb) to authenticated;
revoke all on function public.cinetracker_profile_lists_v480() from public,anon;
grant execute on function public.cinetracker_profile_lists_v480() to authenticated;

notify pgrst,'reload schema';
