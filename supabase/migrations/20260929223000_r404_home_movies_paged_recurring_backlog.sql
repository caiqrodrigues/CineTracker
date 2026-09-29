-- r404: paged Home movie watchlist + total backlog for Raw/SmackDown.
create or replace function public.cinetracker_home_movies_v404(
  p_limit integer default 120,
  p_offset integer default 0
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $function$
with payload as materialized (
  select public.cinetracker_home_movies_v402() as j
), cfg as materialized (
  select
    j,
    greatest(1, least(coalesce(p_limit,120),240))::int as lim,
    greatest(coalesce(p_offset,0),0)::int as off
  from payload
), page_rows as materialized (
  select e.item,e.ord
  from cfg c
  cross join lateral jsonb_array_elements(coalesce(c.j->'rows','[]'::jsonb)) with ordinality as e(item,ord)
  where e.ord>c.off and e.ord<=c.off+c.lim
)
select jsonb_build_object(
  'rows',coalesce((select jsonb_agg(item order by ord) from page_rows),'[]'::jsonb),
  'count',coalesce(nullif(c.j->>'count','')::int,jsonb_array_length(coalesce(c.j->'rows','[]'::jsonb))),
  'offset',c.off,
  'limit',c.lim,
  'generated_at',coalesce(c.j->>'generated_at',now()::text)
)
from cfg c;
$function$;

create or replace function public.cinetracker_home_series_v404(p_today date default current_date)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $function$
select coalesce(
  jsonb_agg(
    case
      when (
        lower(coalesce(item->>'title','')) ~ '(^|[^[:alnum:]])raw([^[:alnum:]]|$)'
        or lower(coalesce(item->>'title','')) like '%smackdown%'
      ) then
        jsonb_set(
          jsonb_set(
            item,
            '{recent_available_episodes}',
            to_jsonb(greatest(0,coalesce(nullif(item->>'available_episodes','')::int,0))),
            true
          ),
          '{available_episodes}',
          to_jsonb(
            greatest(
              0,
              greatest(
                coalesce(nullif(item->>'total_episodes','')::int,0),
                coalesce(nullif(item->>'released_episodes','')::int,0)
              ) - coalesce(nullif(item->>'watched_episodes','')::int,0)
            )
          ),
          true
        )
      else item
    end
    order by ord
  ),
  '[]'::jsonb
)
from jsonb_array_elements(public.cinetracker_home_series_v403(p_today)) with ordinality as src(item,ord);
$function$;

revoke all on function public.cinetracker_home_movies_v404(integer,integer) from public,anon;
grant execute on function public.cinetracker_home_movies_v404(integer,integer) to authenticated;
revoke all on function public.cinetracker_home_series_v404(date) from public,anon;
grant execute on function public.cinetracker_home_series_v404(date) to authenticated;
notify pgrst,'reload schema';
