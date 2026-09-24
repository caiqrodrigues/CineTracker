create or replace function public.cinetracker_home_payload_v359(
  p_today date default current_date,
  p_history_limit integer default 50,
  p_series_limit integer default 120,
  p_movie_limit integer default 120
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $function$
with base as materialized (
  select public.cinetracker_home_payload_v334(
    coalesce(p_today,current_date),
    least(greatest(coalesce(p_history_limit,50),1),100),
    least(greatest(coalesce(p_series_limit,120),1),200),
    least(greatest(coalesce(p_movie_limit,120),1),240)
  ) payload
),
series_raw as materialized (
  select
    e.ordinality::int ord,
    e.value obj,
    nullif(e.value->>'tmdb_id','')::bigint tmdb_id,
    coalesce(nullif(e.value->>'watched_episodes','')::int,0) watched_episodes,
    coalesce(nullif(e.value->>'released_episodes','')::int,0) released_episodes,
    coalesce(nullif(e.value->>'latest_released_season_number','')::int,0) latest_s,
    coalesce(nullif(e.value->>'latest_released_episode_number','')::int,0) latest_e,
    coalesce(e.value->>'home_bucket','') bucket
  from base
  cross join lateral jsonb_array_elements(coalesce(base.payload->'series','[]'::jsonb))
    with ordinality e(value,ordinality)
),
series_ids as materialized (
  select coalesce(array_agg(distinct tmdb_id) filter(where tmdb_id>0),'{}'::bigint[]) ids
  from series_raw
),
state_json as materialized (
  select public.cinetracker_home_series_watch_state_v4((select ids from series_ids)) j
),
states as materialized (
  select x.*
  from state_json
  cross join lateral jsonb_to_recordset(coalesce(state_json.j,'[]'::jsonb)) x(
    tmdb_id bigint,
    canonical_media_id bigint,
    media_ids jsonb,
    watched_episodes int,
    watched_keys jsonb,
    last_season_number int,
    last_episode_number int,
    last_watched_at timestamptz
  )
),
patched as materialized (
  select
    r.ord,
    case
      when r.tmdb_id>0
       and r.watched_episodes>0
       and r.bucket in ('continue','dust','up_to_date')
       and ep.show_tmdb_id is not null
      then r.obj || jsonb_build_object(
        'next_season_number',ep.season_number,
        'next_episode_number',ep.episode_number,
        'next_episode_title',coalesce(nullif(ep.name_local,''),nullif(ep.name_en,''),'Episódio '||ep.episode_number::text),
        'next_episode_rating',ep.vote_average,
        'next_episode_air_date',ep.air_date,
        'available_episodes',greatest(
          1,
          coalesce(nullif(r.obj->>'available_episodes','')::int,0),
          greatest(0,r.released_episodes-coalesce(s.watched_episodes,r.watched_episodes))
        ),
        '__ct359_episode_cache',true
      )
      else r.obj
    end obj
  from series_raw r
  left join states s on s.tmdb_id=r.tmdb_id
  left join lateral (
    select e.*
    from public.episode_catalog_v336 e
    where e.show_tmdb_id=r.tmdb_id
      and e.season_number>0
      and e.episode_number>0
      and (
        r.latest_s<=0
        or e.season_number<r.latest_s
        or (e.season_number=r.latest_s and (r.latest_e<=0 or e.episode_number<=r.latest_e))
      )
      and not exists (
        select 1
        from jsonb_array_elements(coalesce(s.watched_keys,'[]'::jsonb)) w
        where coalesce(nullif(w->>'s','')::int,0)=e.season_number
          and coalesce(nullif(w->>'e','')::int,0)=e.episode_number
      )
    order by e.season_number,e.episode_number
    limit 1
  ) ep on true
),
series_final as materialized (
  select coalesce(jsonb_agg(obj order by ord),'[]'::jsonb) rows
  from patched
)
select
  (base.payload - 'series')
  || jsonb_build_object(
    'series',(select rows from series_final),
    '__ct_home_authority','home-v359-episode-cache-first-paint',
    '__ct_episode_metadata_source','episode_catalog_v336',
    '__ct_episode_metadata_first_paint',true
  )
from base;
$function$;

revoke all on function public.cinetracker_home_payload_v359(date,integer,integer,integer) from public;
revoke all on function public.cinetracker_home_payload_v359(date,integer,integer,integer) from anon;
grant execute on function public.cinetracker_home_payload_v359(date,integer,integer,integer) to authenticated;
grant execute on function public.cinetracker_home_payload_v359(date,integer,integer,integer) to service_role;
