CREATE OR REPLACE FUNCTION public.cinetracker_discover_filter_v333(p_items jsonb)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with me as (
  select auth.uid() as uid
),
items as materialized (
  select distinct
    case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end as media_type,
    x.tmdb_id,
    x.release_year,
    case when lower(coalesce(x.media_type,''))='movie'
      then 'movie:'||x.tmdb_id::text else 'tv:'||x.tmdb_id::text end as candidate_key,
    array_remove(array[
      nullif(regexp_replace(translate(lower(coalesce(x.title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(x.name,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(x.original_title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(x.original_name,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),'')
    ],null) aliases
  from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb))
    as x(media_type text,tmdb_id integer,title text,name text,original_title text,original_name text,release_year integer)
  where coalesce(x.tmdb_id,0)>0
),
signals as materialized (
  select z.media_id,
    bool_or(z.is_watchlist) as is_watchlist,
    bool_or(z.is_seen) as is_seen,
    bool_or(z.is_not_interested) as is_not_interested
  from (
    select mo.media_id,
      (mo.state in ('AddedToWatchlist','WatchLater')) as is_watchlist,
      (mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')) as is_seen,
      (mo.state='NotInterested') as is_not_interested
    from public.media_overrides mo cross join me
    where mo.profile_id=me.uid
      and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate','NotInterested')
    union all
    select wh.media_id,false,true,false
    from public.watch_history wh cross join me
    where wh.profile_id=me.uid and wh.item_type in ('movie','episode') and wh.media_id is not null
    union all
    select pe.media_id,false,true,false
    from public.watch_play_events_v0994 pe cross join me
    where pe.profile_id=me.uid and pe.item_type in ('movie','episode') and pe.media_id is not null
    union all
    select ep.media_id,false,true,false
    from public.episode_progress ep cross join me
    where ep.profile_id=me.uid and ep.watched=true and ep.media_id is not null
  ) z
  group by z.media_id
),
catalog as materialized (
  select
    s.media_id,m.media_type,m.release_year,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as effective_tmdb_id,
    array_remove(array[
      nullif(regexp_replace(translate(lower(coalesce(m.title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.original_title,'')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'title','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'name','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'original_title','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),''),
      nullif(regexp_replace(translate(lower(coalesce(m.raw_tmdb->>'original_name','')),'áàãâäéèêëíìîïóòõôöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),'[^[:alnum:]]+','','g'),'')
    ],null) aliases,
    s.is_watchlist,s.is_seen,s.is_not_interested
  from signals s join public.media m on m.id=s.media_id
),
matched as materialized (
  select
    i.candidate_key,
    bool_or(c.is_watchlist) as is_watchlist,
    bool_or(c.is_seen) as is_seen,
    bool_or(c.is_not_interested) as is_not_interested
  from items i
  left join catalog c
    on c.media_type=i.media_type
   and (
      c.effective_tmdb_id=i.tmdb_id
      or (
        i.aliases && c.aliases
        and (
          coalesce(i.release_year,0)=0
          or coalesce(c.release_year,0)=0
          or abs(c.release_year-i.release_year)<=1
        )
      )
   )
  group by i.candidate_key
),
final as (
  select candidate_key,
    coalesce(is_watchlist,false) is_watchlist,
    coalesce(is_seen,false) is_seen,
    coalesce(is_not_interested,false) is_not_interested
  from matched
)
select jsonb_build_object(
  'blocked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_watchlist or is_seen or is_not_interested),'[]'::jsonb),
  'watch_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_watchlist),'[]'::jsonb),
  'seen_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_seen),'[]'::jsonb),
  'not_interested_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_not_interested),'[]'::jsonb),
  'checked_count',(select count(*) from items),
  'blocked_count',(select count(*) from final where is_watchlist or is_seen or is_not_interested),
  'generated_at',now()
);
$function$
;

CREATE OR REPLACE FUNCTION public.cinetracker_home_payload_v333(p_today date DEFAULT CURRENT_DATE, p_history_limit integer DEFAULT 50, p_series_limit integer DEFAULT 120, p_movie_limit integer DEFAULT 120)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select
    least(greatest(coalesce(p_history_limit,50),1),100)::int history_lim,
    least(greatest(coalesce(p_series_limit,120),1),200)::int series_lim,
    least(greatest(coalesce(p_movie_limit,120),1),240)::int movie_lim,
    coalesce(p_today,current_date)::date today
),
base as materialized (
  select public.cinetracker_home_payload_v332(
    (select today from cfg),
    (select history_lim from cfg),
    (select series_lim from cfg),
    (select movie_lim from cfg)
  ) payload
),
series_raw as materialized (
  select e.value obj,e.ordinality::int ord,
         nullif(e.value->>'tmdb_id','')::bigint tmdb_id,
         nullif(e.value->>'media_id','')::bigint media_id,
         coalesce(nullif(e.value->>'released_episodes','')::int,0) released,
         coalesce(nullif(e.value->>'watched_episodes','')::int,0) watched,
         coalesce(nullif(e.value->>'total_episodes','')::int,0) total_eps,
         coalesce(e.value->>'home_bucket','') bucket
  from base
  cross join lateral jsonb_array_elements(coalesce(base.payload->'series','[]'::jsonb)) with ordinality e(value,ordinality)
),
series_ids as materialized (
  select coalesce(array_agg(distinct tmdb_id) filter(where tmdb_id>0),'{}'::bigint[]) ids from series_raw
),
state_json as materialized (
  select public.cinetracker_home_series_watch_state_v2((select ids from series_ids)) j
),
states as materialized (
  select x.*
  from state_json
  cross join lateral jsonb_to_recordset(coalesce(state_json.j,'[]'::jsonb)) x(
    tmdb_id bigint,canonical_media_id bigint,media_ids jsonb,watched_episodes int,watched_keys jsonb,
    last_season_number int,last_episode_number int,last_watched_at timestamptz
  )
),
series_patched as materialized (
  select
    r.ord,r.tmdb_id,
    case when s.tmdb_id is null then r.obj else
      r.obj
      || jsonb_build_object(
        'media_id',coalesce(nullif(s.canonical_media_id,0),r.media_id),
        'watched_episodes',coalesce(s.watched_episodes,r.watched),
        'released_episodes',greatest(r.released,coalesce(s.watched_episodes,r.watched)),
        'available_episodes',greatest(0,greatest(r.released,coalesce(s.watched_episodes,r.watched))-coalesce(s.watched_episodes,r.watched)),
        'last_season_number',s.last_season_number,
        'last_episode_number',s.last_episode_number,
        'last_watched_at',s.last_watched_at
      )
      || case
        when coalesce(s.watched_episodes,r.watched)>0
         and greatest(r.released,coalesce(s.watched_episodes,r.watched))<=coalesce(s.watched_episodes,r.watched)
        then jsonb_build_object(
          'home_bucket',case when r.bucket='completed' then 'completed' else 'up_to_date' end,
          'available_episodes',0,
          'next_season_number',null,
          'next_episode_number',null,
          'next_episode_title',null,
          'next_episode_rating',null,
          'next_episode_air_date',null
        )
        else '{}'::jsonb end
    end obj,
    coalesce(s.canonical_media_id,r.media_id) canonical_media_id,
    coalesce(s.watched_episodes,r.watched) watched_episodes
  from series_raw r
  left join states s on s.tmdb_id=r.tmdb_id
),
series_ranked as materialized (
  select *,
         row_number() over(
           partition by case when tmdb_id>0 then 'tmdb:'||tmdb_id::text else 'media:'||coalesce(canonical_media_id,0)::text end
           order by
             ((obj->>'media_id')::bigint=canonical_media_id) desc,
             watched_episodes desc,
             coalesce((obj->>'total_episodes')::int,0) desc,
             ord asc
         ) rn
  from series_patched
),
series_final as materialized (
  select coalesce(jsonb_agg(obj order by ord),'[]'::jsonb) rows from series_ranked where rn=1
),
wl as materialized (
  select public.cinetracker_watchlist_full_v119() payload
),
watch_rows as materialized (
  select x.*
  from wl
  cross join lateral jsonb_to_recordset(coalesce(wl.payload->'rows','[]'::jsonb)) x(
    media_id bigint,media_type text,tmdb_id integer,title text,poster_path text,release_year integer,
    raw_tmdb jsonb,added_at timestamptz
  )
  where x.media_type='movie'
),
eligible_movies as materialized (
  select
    w.media_id,'movie'::text media_type,w.tmdb_id,w.title,w.poster_path,w.release_year,
    nullif(w.raw_tmdb->>'release_date','') release_date,
    coalesce(m.runtime_minutes,
      case when coalesce(w.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (w.raw_tmdb->>'runtime')::int else 0 end,0
    )::int runtime_minutes,
    coalesce(w.raw_tmdb->'genres','[]'::jsonb) genres,
    case when coalesce(w.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (w.raw_tmdb->>'vote_average')::numeric else null end vote_average,
    w.added_at,
    case
      when coalesce(w.raw_tmdb->>'release_date','') ~ '^\d{4}-\d{2}-\d{2}$'
        then (w.raw_tmdb->>'release_date')::date <= (select today from cfg)
      when coalesce(w.release_year,0)>0
        then w.release_year < extract(year from (select today from cfg))::int
             or (w.release_year=extract(year from (select today from cfg))::int and lower(coalesce(w.raw_tmdb->>'status',''))='released')
      else false
    end is_released
  from watch_rows w
  left join public.media m on m.id=w.media_id
  where not exists(
    select 1 from public.watch_history wh
    where wh.profile_id=(select auth.uid()) and wh.media_id=w.media_id and wh.item_type='movie'
  )
  and not exists(
    select 1 from public.watch_play_events_v0994 pe
    where pe.profile_id=(select auth.uid()) and pe.media_id=w.media_id and pe.item_type='movie'
  )
  and not exists(
    select 1 from public.media_overrides mo
    where mo.profile_id=(select auth.uid()) and mo.media_id=w.media_id
      and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')
  )
),
eligible_keyed as materialized (
  select e.*,
    case
      when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
        then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else 'legacy:'||lower(regexp_replace(coalesce(e.title,''),'[^[:alnum:]]+','','g'))||':'||coalesce(e.release_year,0)::text
    end logical_key
  from eligible_movies e
  left join public.media m on m.id=e.media_id
  where e.is_released
),
eligible_dedup as materialized (
  select distinct on (logical_key) *
  from eligible_keyed
  order by logical_key,added_at desc nulls last,media_id desc
),
movie_rows as materialized (
  select coalesce(jsonb_agg(to_jsonb(z)-'logical_key'-'is_released' order by z.added_at desc nulls last,z.media_id desc),'[]'::jsonb) rows
  from (select * from eligible_dedup order by added_at desc nulls last,media_id desc limit (select movie_lim from cfg)) z
),
movie_count as materialized (
  select count(*)::int n from eligible_dedup
)
select
  (base.payload - 'series' - 'movie_watchlist' - 'movie_watchlist_total')
  || jsonb_build_object(
    'series',(select rows from series_final),
    'movie_watchlist',(select rows from movie_rows),
    'movie_watchlist_total',(select n from movie_count),
    '__ct_home_authority','home-v333-logical-series+released-unseen-movies',
    '__ct_series_watch_state','v2-dedup-first-paint',
    '__ct_movie_watchlist_rule','released+unseen-only'
  )
from base;
$function$
;
revoke execute on function public.cinetracker_discover_filter_v333(jsonb) from public,anon;
grant execute on function public.cinetracker_discover_filter_v333(jsonb) to authenticated;
revoke execute on function public.cinetracker_home_payload_v333(date,integer,integer,integer) from public,anon;
grant execute on function public.cinetracker_home_payload_v333(date,integer,integer,integer) to authenticated;
notify pgrst,'reload schema';
