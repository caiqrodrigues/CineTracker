CREATE OR REPLACE FUNCTION public.cinetracker_home_payload_v328(p_today date DEFAULT CURRENT_DATE, p_history_limit integer DEFAULT 50, p_series_limit integer DEFAULT 120, p_movie_limit integer DEFAULT 120)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with base as materialized (
  select public.cinetracker_profile_home_payload_v0997_r6(
    p_today,
    least(greatest(coalesce(p_history_limit,50),1),100),
    least(greatest(coalesce(p_series_limit,120),1),200),
    least(greatest(coalesce(p_movie_limit,120),1),240)
  ) as payload
),
hist as materialized (
  select public.cinetracker_home_history_v324(
    least(greatest(coalesce(p_history_limit,50),1),100)
  ) as history
)
select
  (base.payload - 'history_episodes' - 'history_movies')
  || jsonb_build_object(
       'history_episodes',coalesce(hist.history->'history_episodes','[]'::jsonb),
       'history_movies',coalesce(hist.history->'history_movies','[]'::jsonb),
       '__ct_history_authority','v328-single-rpc'
     )
from base cross join hist;
$function$
;
revoke execute on function public.cinetracker_home_payload_v328(date,integer,integer,integer) from public,anon;
grant execute on function public.cinetracker_home_payload_v328(date,integer,integer,integer) to authenticated;
notify pgrst,'reload schema';
