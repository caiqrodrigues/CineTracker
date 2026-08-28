create or replace function public.cinetracker_profile_payload_v0997(p_tz text default 'America/Sao_Paulo')
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with tz as (
  select case
    when exists(select 1 from pg_timezone_names where name=p_tz) then p_tz
    else 'UTC'
  end as name
), today_local as (
  select (timezone(tz.name,now()))::date as day from tz
), d as (
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
), activity_rows as (
  select (timezone(tz.name,wh.watched_at))::date as day,
         count(distinct (wh.media_id,wh.season_number,wh.episode_number))::bigint as cnt
  from public.watch_history wh
  cross join tz
  cross join today_local t
  where wh.profile_id=auth.uid()
    and wh.item_type='episode'
    and coalesce(wh.season_number,0)>0
    and coalesce(wh.episode_number,0)>0
    and wh.watched_at >= ((t.day-10)::timestamp at time zone tz.name)
    and wh.watched_at < ((t.day+4)::timestamp at time zone tz.name)
  group by (timezone(tz.name,wh.watched_at))::date
), activity as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'day',g.day,
    'count',coalesce(a.cnt,0)
  ) order by g.day),'[]'::jsonb) as value
  from today_local t
  cross join lateral generate_series(t.day-10,t.day+3,interval '1 day') g(day)
  left join activity_rows a on a.day=g.day::date
)
select jsonb_build_object(
  'dashboard',coalesce((select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc) from d x),'[]'::jsonb),
  'stats',coalesce((select to_jsonb(x) from st x),'{}'::jsonb),
  'series_stats',coalesce((select to_jsonb(x) from ss x),'{}'::jsonb),
  'remaining',coalesce((select value from rem),'{}'::jsonb),
  'favorite_actors',coalesce((select value from actors),'[]'::jsonb),
  'activity',coalesce((select value from activity),'[]'::jsonb),
  'timezone',(select name from tz),
  'generated_at',now()
);
$function$;

revoke all on function public.cinetracker_profile_payload_v0997(text) from public;
grant execute on function public.cinetracker_profile_payload_v0997(text) to authenticated;
