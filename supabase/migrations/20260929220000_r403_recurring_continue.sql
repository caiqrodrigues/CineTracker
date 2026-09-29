-- r403: Raw/SmackDown with a recent released unseen episode belong in Continue Watching.
create or replace function public.cinetracker_home_series_v403(p_today date default current_date)
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
      )
      and coalesce(nullif(item->>'available_episodes','')::int,0)>0
      and coalesce(nullif(item->>'next_episode_number','')::int,0)>0
      then jsonb_set(item,'{home_bucket}',to_jsonb('continue'::text),true)
      else item
    end
    order by ord
  ),
  '[]'::jsonb
)
from jsonb_array_elements(public.cinetracker_home_series_v402(p_today)) with ordinality as src(item,ord);
$function$;

revoke all on function public.cinetracker_home_series_v403(date) from public,anon;
grant execute on function public.cinetracker_home_series_v403(date) to authenticated;
notify pgrst,'reload schema';
