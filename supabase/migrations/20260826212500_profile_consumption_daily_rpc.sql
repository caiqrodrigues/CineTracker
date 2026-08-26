-- Aggregate the consumption graph in PostgreSQL so PostgREST's row cap cannot
-- collapse an imported history into a single 1,000-row bar.

create or replace function public.cinetracker_consumption_daily(p_limit_days integer default 19)
returns table(day date, items bigint, plays bigint)
language sql
set search_path to 'public'
as $function$
with daily as (
  select
    (wh.watched_at at time zone 'America/Sao_Paulo')::date as day,
    count(*)::bigint as items,
    sum(
      case
        when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$'
          then greatest(1,(wh.external_ids->>'plays')::int)
        else 1
      end
    )::bigint as plays
  from public.watch_history wh
  where wh.profile_id = auth.uid()
    and wh.watched_at is not null
  group by 1
), recent as (
  select *
  from daily
  order by day desc
  limit greatest(1, least(coalesce(p_limit_days,19), 90))
)
select day, items, plays
from recent
order by day;
$function$;
