create or replace function public.cinetracker_profile_activity_v0994(p_days integer default 30)
returns table(
  activity_day date,
  activity_events bigint,
  raw_rows bigint,
  episode_rows bigint,
  movie_rows bigint,
  imported_baseline_rows bigint
)
language sql
stable
set search_path to 'public'
as $function$
with params as (
  select greatest(7, least(coalesce(p_days,30), 180))::int as days
), src as (
  select
    wh.id,
    wh.media_id,
    wh.item_type,
    wh.watched_at,
    coalesce(wh.external_ids,'{}'::jsonb) as external_ids,
    (coalesce(wh.external_ids,'{}'::jsonb) ? 'baseline_watched_at_v0994') as is_imported_baseline
  from public.watch_history wh, params p
  where wh.profile_id=auth.uid()
    and wh.watched_at >= date_trunc('day', now()) - ((p.days-1)::text || ' days')::interval
    and wh.watched_at < date_trunc('day', now()) + interval '1 day'
), keyed as (
  select
    watched_at::date as activity_day,
    item_type,
    is_imported_baseline,
    case
      when is_imported_baseline then 'baseline:'||coalesce(media_id::text,'0')||':'||watched_at::date::text
      else 'direct:'||id::text
    end as activity_key
  from src
)
select
  activity_day,
  count(distinct activity_key)::bigint as activity_events,
  count(*)::bigint as raw_rows,
  count(*) filter(where item_type='episode')::bigint as episode_rows,
  count(*) filter(where item_type='movie')::bigint as movie_rows,
  count(*) filter(where is_imported_baseline)::bigint as imported_baseline_rows
from keyed
group by activity_day
order by activity_day asc;
$function$;

grant execute on function public.cinetracker_profile_activity_v0994(integer) to authenticated;
