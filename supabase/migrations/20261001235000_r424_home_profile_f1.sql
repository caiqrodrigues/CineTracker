-- CineTracker Web r424: recurring sports series use the same Home continuation semantics as normal series.
CREATE OR REPLACE FUNCTION public.cinetracker_home_series_v424(p_today date DEFAULT CURRENT_DATE)
RETURNS jsonb
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
WITH base AS MATERIALIZED (
  SELECT x
  FROM jsonb_array_elements(coalesce(public.cinetracker_home_series_v391(coalesce(p_today,current_date)),'[]'::jsonb)) x
),
patched AS MATERIALIZED (
  SELECT CASE
    WHEN coalesce(
      CASE WHEN coalesce(x->>'media_id','') ~ '^[0-9]+$' THEN (x->>'media_id')::bigint ELSE 0 END,
      0
    ) = 865
      AND coalesce(x->>'watched_episodes','0') ~ '^[0-9]+$'
      AND (x->>'watched_episodes')::int > 0
      AND nullif(x->>'next_episode_number','') IS NOT NULL
      THEN x || jsonb_build_object('home_bucket','continue','__ct424_home_authority',true)
    WHEN lower(regexp_replace(coalesce(x->>'title',''),'[^[:alnum:]]+','','g')) ~ '(raw|smackdown|formula1|formulaone)'
      AND coalesce(x->>'watched_episodes','0') ~ '^[0-9]+$'
      AND (x->>'watched_episodes')::int > 0
      AND nullif(x->>'next_episode_number','') IS NOT NULL
      THEN x || jsonb_build_object('home_bucket','continue','__ct424_home_authority',true)
    ELSE x
  END AS x
  FROM base
)
SELECT coalesce(
  jsonb_agg(
    x
    ORDER BY
      CASE x->>'home_bucket'
        WHEN 'continue' THEN 1
        WHEN 'dust' THEN 2
        WHEN 'up_to_date' THEN 3
        WHEN 'not_started' THEN 4
        WHEN 'completed' THEN 5
        ELSE 9
      END,
      (x->>'state_updated_at') DESC NULLS LAST,
      CASE WHEN coalesce(x->>'media_id','') ~ '^[0-9]+$' THEN (x->>'media_id')::bigint ELSE 0 END DESC
  ),
  '[]'::jsonb
)
FROM patched;
$function$;

REVOKE ALL ON FUNCTION public.cinetracker_home_series_v424(date) FROM public;
GRANT EXECUTE ON FUNCTION public.cinetracker_home_series_v424(date) TO authenticated;
