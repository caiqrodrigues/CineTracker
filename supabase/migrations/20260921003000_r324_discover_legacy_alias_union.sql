CREATE OR REPLACE FUNCTION public.cinetracker_discover_filter_v324(p_items jsonb)
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
;
revoke execute on function public.cinetracker_discover_filter_v324(jsonb) from public,anon;
grant execute on function public.cinetracker_discover_filter_v324(jsonb) to authenticated;
notify pgrst,'reload schema';
