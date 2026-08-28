create or replace function public.cinetracker_profile_payload_v0996()
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
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
    'day',g.day::date,
    'count',coalesce(e.cnt,0)
  ) order by g.day),'[]'::jsonb) as value
  from generate_series(current_date - 10,current_date + 3,interval '1 day') g(day)
  left join (
    select wh.watched_at::date as day,
           count(distinct (wh.media_id,wh.season_number,wh.episode_number))::bigint as cnt
    from public.watch_history wh
    where wh.profile_id=auth.uid()
      and wh.item_type='episode'
      and wh.watched_at >= current_date - interval '10 days'
      and wh.watched_at < current_date + interval '4 days'
      and coalesce(wh.season_number,0)>0
      and coalesce(wh.episode_number,0)>0
    group by wh.watched_at::date
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
$function$;
