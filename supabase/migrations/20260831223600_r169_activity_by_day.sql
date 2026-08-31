create index if not exists idx_watch_history_profile_watched_type_r169
  on public.watch_history(profile_id, watched_at desc, item_type);

create index if not exists idx_sport_watch_history_profile_watched_r169
  on public.user_sport_watch_history(profile_id, watched_at desc);

create or replace function public.cinetracker_activity_by_day_v1(
  p_days integer default 15,
  p_tz text default 'America/Sao_Paulo'
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
with cfg as (
  select
    greatest(1, least(coalesce(p_days, 15), 60))::integer as days,
    (now() at time zone coalesce(nullif(p_tz,''),'America/Sao_Paulo'))::date as today,
    auth.uid() as uid,
    coalesce(nullif(p_tz,''),'America/Sao_Paulo') as zone
),
days as (
  select generate_series(c.today - (c.days - 1), c.today, interval '1 day')::date as day
  from cfg c
),
media_counts as (
  select
    (wh.watched_at at time zone c.zone)::date as day,
    count(*) filter (where wh.item_type = 'episode')::integer as episodes,
    count(*) filter (where wh.item_type = 'movie')::integer as movies
  from public.watch_history wh
  cross join cfg c
  where wh.profile_id = c.uid
    and wh.item_type in ('episode','movie')
    and wh.watched_at >= ((c.today - (c.days - 1))::timestamp at time zone c.zone)
    and wh.watched_at < ((c.today + 1)::timestamp at time zone c.zone)
  group by 1
),
sport_counts as (
  select
    (sh.watched_at at time zone c.zone)::date as day,
    count(*)::integer as sports
  from public.user_sport_watch_history sh
  cross join cfg c
  where sh.profile_id = c.uid
    and sh.watched_at >= ((c.today - (c.days - 1))::timestamp at time zone c.zone)
    and sh.watched_at < ((c.today + 1)::timestamp at time zone c.zone)
  group by 1
)
select coalesce(
  jsonb_agg(
    jsonb_build_object(
      'day', d.day,
      'episodes', coalesce(m.episodes,0),
      'movies', coalesce(m.movies,0),
      'sports', coalesce(s.sports,0),
      'count', coalesce(m.episodes,0) + coalesce(m.movies,0) + coalesce(s.sports,0)
    ) order by d.day
  ),
  '[]'::jsonb
)
from days d
left join media_counts m using(day)
left join sport_counts s using(day);
$$;

grant execute on function public.cinetracker_activity_by_day_v1(integer,text) to authenticated;
comment on function public.cinetracker_activity_by_day_v1(integer,text) is
  'Returns a zero-filled daily timeline ending today, summing watched episodes, movies and sports.';
