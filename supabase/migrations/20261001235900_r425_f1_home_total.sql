-- CineTracker Web r425: Formula 1 Home total uses the imported 2015-2026 session universe (5 sessions per Grand Prix).
CREATE OR REPLACE FUNCTION public.cinetracker_home_series_v425(p_today date DEFAULT CURRENT_DATE)
RETURNS jsonb
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
WITH base AS MATERIALIZED (
  SELECT x FROM jsonb_array_elements(coalesce(public.cinetracker_home_series_v424(coalesce(p_today,current_date)),'[]'::jsonb)) x
),
patched AS MATERIALIZED (
  SELECT CASE
    WHEN coalesce(x->>'media_id','') ~ '^[0-9]+$' AND (x->>'media_id')::bigint = 865
      THEN x || jsonb_build_object(
        'total_episodes',1280,
        'released_episodes',1280,
        'available_episodes',greatest(0,1280-coalesce(nullif(x->>'watched_episodes','')::int,0)),
        '__ct425_f1_total',true
      )
    ELSE x
  END AS x
  FROM base
)
SELECT coalesce(jsonb_agg(x ORDER BY
  CASE x->>'home_bucket' WHEN 'continue' THEN 1 WHEN 'dust' THEN 2 WHEN 'up_to_date' THEN 3 WHEN 'not_started' THEN 4 WHEN 'completed' THEN 5 ELSE 9 END,
  (x->>'state_updated_at') DESC NULLS LAST,
  CASE WHEN coalesce(x->>'media_id','') ~ '^[0-9]+$' THEN (x->>'media_id')::bigint ELSE 0 END DESC
),'[]'::jsonb)
FROM patched;
$function$;
REVOKE ALL ON FUNCTION public.cinetracker_home_series_v425(date) FROM public;
GRANT EXECUTE ON FUNCTION public.cinetracker_home_series_v425(date) TO authenticated;