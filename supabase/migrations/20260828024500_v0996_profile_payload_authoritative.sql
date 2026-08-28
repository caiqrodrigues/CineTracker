create or replace function public.cinetracker_profile_payload_v0996()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
with d as (
  select * from public.cinetracker_profile_media_dashboard_v0991()
), st as (
  select * from public.cinetracker_profile_stats() limit 1
), ss as (
  select * from public.cinetracker_series_state_stats() limit 1
), rem as (
  select public.cinetracker_profile_remaining_v0994() as value
), actors as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',fa.id,
    'tmdb_person_id',fa.tmdb_person_id,
    'actor_name',fa.actor_name,
    'profile_path',fa.profile_path,
    'created_at',fa.created_at
  ) order by fa.created_at desc),'[]'::jsonb) as value
  from public.favorite_actors fa
  where fa.user_id=auth.uid()
), activity as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'day',g.day,
    'count',coalesce(e.cnt,0)
  ) order by g.day),'[]'::jsonb) as value
  from generate_series(current_date - 10,current_date + 3,interval '1 day') g(day)
  left join (
    select played_at::date as day,count(*)::bigint as cnt
    from public.watch_play_events_v0994
    where profile_id=auth.uid()
      and item_type='episode'
      and played_at >= current_date - interval '10 days'
      and played_at < current_date + interval '4 days'
      and source='manual'
    group by played_at::date
  ) e on e.day=g.day::date
)
select jsonb_build_object(
  'dashboard',coalesce((select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc) from d x),'[]'::jsonb),
  'stats',coalesce((select to_jsonb(x) from st x),'{}'::jsonb),
  'series_stats',coalesce((select to_jsonb(x) from ss x),'{}'::jsonb),
  'remaining',coalesce((select value from rem),'{}'::jsonb),
  'favorite_actors',coalesce((select value from actors),'[]'::jsonb),
  'activity',coalesce((select value from activity),'[]'::jsonb),
  'generated_at',now()
);
$$;

revoke all on function public.cinetracker_profile_payload_v0996() from public;
revoke all on function public.cinetracker_profile_payload_v0996() from anon;
grant execute on function public.cinetracker_profile_payload_v0996() to authenticated;
