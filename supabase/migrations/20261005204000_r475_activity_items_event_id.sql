create or replace function public.cinetracker_activity_items_by_day_v475(
  p_day date,
  p_tz text default 'America/Sao_Paulo'
)
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with cfg as (
  select auth.uid() uid, coalesce(nullif(p_tz,''),'America/Sao_Paulo') zone, p_day target_date
), media_rows as (
  select
    wh.id::bigint sort_id, wh.watched_at, wh.item_type, wh.season_number, wh.episode_number,
    coalesce(m.runtime_minutes,0)::integer runtime_minutes, m.id media_id, m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) tmdb_id,
    m.title media_title, m.poster_path, coalesce(wh.title,m.title) title,
    coalesce(m.release_year,0)::integer release_year,
    coalesce(nullif(m.raw_tmdb->>'vote_average','')::numeric,0) vote_average,
    case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$'
      then greatest(1,(wh.external_ids->>'plays')::integer) else 1 end plays,
    0::integer remaining_episodes, 'home_history'::text source_kind,
    null::bigint event_id
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  cross join cfg c
  where wh.profile_id=c.uid and wh.item_type in ('episode','movie')
    and wh.watched_at >= (c.target_date::timestamp at time zone c.zone)
    and wh.watched_at < ((c.target_date+1)::timestamp at time zone c.zone)
), sport_rows as (
  select
    sh.id::bigint sort_id, sh.watched_at, 'sport'::text item_type,
    null::integer season_number, null::integer episode_number,
    coalesce(sh.duration_minutes,0)::integer runtime_minutes,
    null::bigint media_id, null::text media_type, null::integer tmdb_id,
    se.title media_title, se.image_url poster_path, se.title title,
    extract(year from sh.watched_at)::integer release_year, 0::numeric vote_average,
    1::integer plays, 0::integer remaining_episodes, 'sport'::text source_kind,
    sh.event_id::bigint event_id
  from public.user_sport_watch_history sh
  join public.sport_events se on se.id=sh.event_id
  cross join cfg c
  where sh.profile_id=c.uid
    and sh.watched_at >= (c.target_date::timestamp at time zone c.zone)
    and sh.watched_at < ((c.target_date+1)::timestamp at time zone c.zone)
)
select coalesce(jsonb_agg(to_jsonb(a) order by a.watched_at desc,a.sort_id desc),'[]'::jsonb)
from (select * from media_rows union all select * from sport_rows) a;
$function$;

grant execute on function public.cinetracker_activity_items_by_day_v475(date,text) to authenticated;
