-- r406: restore the canonical recent-episode count and recurring-series bucket.
-- r404 incorrectly replaced Raw/SmackDown recent available_episodes with the full historical backlog.
create or replace function public.cinetracker_home_series_v406(p_today date default current_date)
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
from jsonb_array_elements(public.cinetracker_home_series_v403(p_today)) with ordinality as src(item,ord);
$function$;

revoke all on function public.cinetracker_home_series_v406(date) from public,anon;
grant execute on function public.cinetracker_home_series_v406(date) to authenticated,service_role;
comment on function public.cinetracker_home_series_v406(date)
is 'CineTracker r406: preserves v402/v403 recent available episode counts; Raw/SmackDown with a released unseen current episode are Continue Watching.';
notify pgrst,'reload schema';
