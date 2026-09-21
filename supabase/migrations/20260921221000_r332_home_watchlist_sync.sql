CREATE OR REPLACE FUNCTION public.cinetracker_home_payload_v332(p_today date DEFAULT CURRENT_DATE, p_history_limit integer DEFAULT 50, p_series_limit integer DEFAULT 120, p_movie_limit integer DEFAULT 120)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select
    least(greatest(coalesce(p_history_limit,50),1),100)::int as history_lim,
    least(greatest(coalesce(p_series_limit,120),1),200)::int as series_lim,
    least(greatest(coalesce(p_movie_limit,120),1),240)::int as movie_lim
),
base as materialized (
  select public.cinetracker_profile_home_payload_v0997_r6(
    p_today,
    (select history_lim from cfg),
    (select series_lim from cfg),
    (select movie_lim from cfg)
  ) as payload
),
hist as materialized (
  select public.cinetracker_home_history_v324((select history_lim from cfg)) as history
),
wl as materialized (
  select public.cinetracker_watchlist_full_v119() as payload
),
watch_rows as materialized (
  select
    x.media_id,
    x.media_type,
    x.tmdb_id,
    x.title,
    x.poster_path,
    x.release_year,
    x.raw_tmdb,
    x.added_at
  from wl
  cross join lateral jsonb_to_recordset(coalesce(wl.payload->'rows','[]'::jsonb)) as x(
    media_id bigint,
    media_type text,
    tmdb_id integer,
    title text,
    poster_path text,
    release_year integer,
    raw_tmdb jsonb,
    added_at timestamptz
  )
),
movie_watchlist as materialized (
  select coalesce(jsonb_agg(to_jsonb(z) order by z.added_at desc nulls last,z.media_id desc),'[]'::jsonb) as rows
  from (
    select
      w.media_id,
      'movie'::text as media_type,
      w.tmdb_id,
      w.title,
      w.poster_path,
      w.release_year,
      nullif(w.raw_tmdb->>'release_date','') as release_date,
      coalesce(m.runtime_minutes,
        case when coalesce(w.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (w.raw_tmdb->>'runtime')::int else 0 end,
        0
      )::int as runtime_minutes,
      coalesce(w.raw_tmdb->'genres','[]'::jsonb) as genres,
      case when coalesce(w.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
        then (w.raw_tmdb->>'vote_average')::numeric else null end as vote_average,
      w.added_at
    from watch_rows w
    left join public.media m on m.id=w.media_id
    where w.media_type='movie'
    order by w.added_at desc nulls last,w.media_id desc
    limit (select movie_lim from cfg)
  ) z
)
select
  (base.payload - 'history_episodes' - 'history_movies' - 'movie_watchlist')
  || jsonb_build_object(
       'history_episodes',coalesce(hist.history->'history_episodes','[]'::jsonb),
       'history_movies',coalesce(hist.history->'history_movies','[]'::jsonb),
       'movie_watchlist',movie_watchlist.rows,
       'movie_watchlist_total',coalesce((wl.payload->'counts'->>'movie')::int,0),
       '__ct_history_authority','home-history-v324',
       '__ct_movie_watchlist_authority','watchlist-full-v119-latest-added'
     )
from base cross join hist cross join wl cross join movie_watchlist;
$function$
;
revoke execute on function public.cinetracker_home_payload_v332(date,integer,integer,integer) from public,anon;
grant execute on function public.cinetracker_home_payload_v332(date,integer,integer,integer) to authenticated;
notify pgrst,'reload schema';
