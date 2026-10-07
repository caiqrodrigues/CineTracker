create or replace function public.cinetracker_profile_screen_v491(
  p_tz text default 'America/Sao_Paulo'
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with base as materialized (
  select public.cinetracker_profile_v380(coalesce(nullif(p_tz,''),'America/Sao_Paulo')) j
),
summary as materialized (
  select public.cinetracker_profile_summary_v489() j
),
sports as materialized (
  select coalesce((select to_jsonb(x) from public.cinetracker_sport_stats_v421() x limit 1),'{}'::jsonb) j
),
stadium as materialized (
  select coalesce((select to_jsonb(x) from public.cinetracker_sports_stadium_summary_v296() x limit 1),'{}'::jsonb) j
)
select jsonb_build_object(
  'stats',coalesce((select j->'stats' from base),'{}'::jsonb),
  'series_stats',coalesce((select j->'series_stats' from base),'{}'::jsonb),
  'remaining',coalesce((select j->'remaining' from base),'{}'::jsonb),
  'activity',coalesce((select j->'activity' from base),'[]'::jsonb),
  'summary',coalesce((select j from summary),'{}'::jsonb),
  'sports',coalesce((select j from sports),'{}'::jsonb),
  'stadium',coalesce((select j from stadium),'{}'::jsonb),
  'source','v491-screen'
);
$$;
revoke all on function public.cinetracker_profile_screen_v491(text) from public,anon;
grant execute on function public.cinetracker_profile_screen_v491(text) to authenticated;
notify pgrst,'reload schema';
