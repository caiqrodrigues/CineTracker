create or replace function public.cinetracker_home_live_v0997()
returns jsonb
language sql
stable
set search_path to 'public'
as $$
  select public.cinetracker_profile_home_payload_v0994();
$$;

grant execute on function public.cinetracker_home_live_v0997() to authenticated;
