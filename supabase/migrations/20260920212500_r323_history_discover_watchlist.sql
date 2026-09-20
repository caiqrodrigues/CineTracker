CREATE OR REPLACE FUNCTION public.cinetracker_discover_filter_v323(p_items jsonb)
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
      then 'movie:'||x.tmdb_id::text
      else 'tv:'||x.tmdb_id::text
    end as candidate_key,
    array_remove(array[
      nullif(lower(regexp_replace(coalesce(x.title,''),'[^[:alnum:]]+','','g')),''),
      nullif(lower(regexp_replace(coalesce(x.name,''),'[^[:alnum:]]+','','g')),''),
      nullif(lower(regexp_replace(coalesce(x.original_title,''),'[^[:alnum:]]+','','g')),''),
      nullif(lower(regexp_replace(coalesce(x.original_name,''),'[^[:alnum:]]+','','g')),'')
    ],null) as aliases
  from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb))
    as x(
      media_type text,
      tmdb_id integer,
      title text,
      name text,
      original_title text,
      original_name text,
      release_year integer
    )
  where coalesce(x.tmdb_id,0)>0
),
direct_match as materialized (
  select i.candidate_key,m.id as media_id
  from items i
  join public.media m
    on (
      case
        when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
          then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
        else m.media_type||':id:'||m.id::text
      end
    )=i.candidate_key
),
user_media_ids as materialized (
  select distinct mo.media_id
  from public.media_overrides mo cross join me
  where mo.profile_id=me.uid
    and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate','NotInterested')
  union
  select distinct wh.media_id
  from public.watch_history wh cross join me
  where wh.profile_id=me.uid and wh.item_type in ('movie','episode') and wh.media_id is not null
  union
  select distinct ep.media_id
  from public.episode_progress ep cross join me
  where ep.profile_id=me.uid and ep.watched=true and ep.media_id is not null
),
legacy_user_media as materialized (
  select
    m.id as media_id,
    m.media_type,
    m.release_year,
    array_remove(array[
      nullif(lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g')),''),
      nullif(lower(regexp_replace(coalesce(m.raw_tmdb->>'title',''),'[^[:alnum:]]+','','g')),''),
      nullif(lower(regexp_replace(coalesce(m.raw_tmdb->>'name',''),'[^[:alnum:]]+','','g')),''),
      nullif(lower(regexp_replace(coalesce(m.raw_tmdb->>'original_title',''),'[^[:alnum:]]+','','g')),''),
      nullif(lower(regexp_replace(coalesce(m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g')),'')
    ],null) as aliases
  from user_media_ids u
  join public.media m on m.id=u.media_id
  where coalesce(public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),0)<=0
),
alias_match as materialized (
  select distinct i.candidate_key,l.media_id
  from items i
  join legacy_user_media l
    on l.media_type=i.media_type
   and (coalesce(i.release_year,0)=0 or coalesce(l.release_year,0)=0 or l.release_year=i.release_year)
   and i.aliases && l.aliases
  where not exists(select 1 from direct_match d where d.candidate_key=i.candidate_key)
),
matched_media as materialized (
  select * from direct_match
  union
  select * from alias_match
),
state as (
  select
    i.candidate_key,
    exists(
      select 1
      from matched_media mm
      join public.media_overrides mo on mo.media_id=mm.media_id
      cross join me
      where mm.candidate_key=i.candidate_key
        and mo.profile_id=me.uid
        and mo.state in ('AddedToWatchlist','WatchLater')
    ) as is_watchlist,
    (
      exists(
        select 1
        from matched_media mm
        join public.watch_history wh on wh.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and wh.profile_id=me.uid
          and wh.item_type in ('episode','movie')
      )
      or exists(
        select 1
        from matched_media mm
        join public.episode_progress ep on ep.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and ep.profile_id=me.uid
          and ep.watched=true
      )
      or exists(
        select 1
        from matched_media mm
        join public.media_overrides mo on mo.media_id=mm.media_id
        cross join me
        where mm.candidate_key=i.candidate_key
          and mo.profile_id=me.uid
          and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')
      )
    ) as is_seen,
    exists(
      select 1
      from matched_media mm
      join public.media_overrides mo on mo.media_id=mm.media_id
      cross join me
      where mm.candidate_key=i.candidate_key
        and mo.profile_id=me.uid
        and mo.state='NotInterested'
    ) as is_not_interested
  from items i
),
final as (
  select
    candidate_key,
    is_watchlist,
    is_seen,
    is_not_interested,
    (is_watchlist or is_seen or is_not_interested) as is_blocked
  from state
)
select jsonb_build_object(
  'blocked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_blocked),'[]'::jsonb),
  'watch_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_watchlist),'[]'::jsonb),
  'seen_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_seen),'[]'::jsonb),
  'not_interested_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_not_interested),'[]'::jsonb),
  'checked_count',(select count(*) from items),
  'blocked_count',(select count(*) from final where is_blocked),
  'alias_matches',(select count(*) from alias_match),
  'generated_at',now()
);
$function$


CREATE OR REPLACE FUNCTION public.cinetracker_home_movie_history_v323(p_limit integer DEFAULT 50)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select auth.uid() uid,least(greatest(coalesce(p_limit,50),1),100) lim
),
play_stats as materialized (
  select
    pe.media_id,
    max(pe.played_at) as watched_at,
    count(*)::integer as play_events
  from public.watch_play_events_v0994 pe cross join cfg c
  where pe.profile_id=c.uid and pe.item_type='movie'
  group by pe.media_id
),
history_movie as materialized (
  select distinct on (wh.media_id)
    wh.media_id,
    wh.id,
    wh.watched_at,
    wh.title,
    wh.external_ids
  from public.watch_history wh cross join cfg c
  where wh.profile_id=c.uid and wh.item_type='movie' and wh.media_id is not null
  order by wh.media_id,wh.watched_at desc,wh.id desc
),
combined as (
  select
    coalesce(h.id,0)::bigint as id,
    p.media_id,
    p.watched_at,
    coalesce(h.title,m.title) as history_title,
    greatest(
      p.play_events,
      case when coalesce(h.external_ids->>'plays','') ~ '^[0-9]+$'
        then (h.external_ids->>'plays')::integer else 1 end
    )::integer as plays
  from play_stats p
  join public.media m on m.id=p.media_id
  left join history_movie h on h.media_id=p.media_id

  union all

  select
    h.id,
    h.media_id,
    h.watched_at,
    coalesce(h.title,m.title) as history_title,
    case when coalesce(h.external_ids->>'plays','') ~ '^[0-9]+$'
      then greatest(1,(h.external_ids->>'plays')::integer) else 1 end as plays
  from history_movie h
  join public.media m on m.id=h.media_id
  where not exists(select 1 from play_stats p where p.media_id=h.media_id)
),
ranked as materialized (
  select *
  from combined
  order by watched_at desc,id desc
  limit (select lim from cfg)
)
select coalesce(jsonb_agg(
  jsonb_build_object(
    'id',r.id,
    'media_id',m.id,
    'tmdb_id',public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),
    'media_type','movie',
    'media_title',m.title,
    'poster_path',m.poster_path,
    'title',r.history_title,
    'watched_at',r.watched_at,
    'release_year',m.release_year,
    'runtime_minutes',coalesce(m.runtime_minutes,0),
    'genres',coalesce(m.genres,'[]'::jsonb),
    'vote_average',case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else null end,
    'release_date',nullif(m.raw_tmdb->>'release_date',''),
    'plays',r.plays,
    'history_source','play-events+legacy'
  ) order by r.watched_at asc,r.id asc
),'[]'::jsonb)
from ranked r
join public.media m on m.id=r.media_id;
$function$

revoke execute on function public.cinetracker_discover_filter_v323(jsonb) from public,anon;
grant execute on function public.cinetracker_discover_filter_v323(jsonb) to authenticated;
revoke execute on function public.cinetracker_home_movie_history_v323(integer) from public,anon;
grant execute on function public.cinetracker_home_movie_history_v323(integer) to authenticated;
notify pgrst,'reload schema';
