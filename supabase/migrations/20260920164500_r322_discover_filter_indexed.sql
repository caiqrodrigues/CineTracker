CREATE OR REPLACE FUNCTION public.cinetracker_discover_filter_v322(p_items jsonb)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with me as (
  select auth.uid() as uid
),
items as (
  select distinct
    case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end as media_type,
    x.tmdb_id,
    case when lower(coalesce(x.media_type,''))='movie'
      then 'movie:'||x.tmdb_id::text
      else 'tv:'||x.tmdb_id::text
    end as candidate_key
  from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb))
    as x(media_type text,tmdb_id integer,title text,release_year integer)
  where coalesce(x.tmdb_id,0)>0
),
matched_media as (
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
  'generated_at',now()
);
$function$


revoke execute on function public.cinetracker_discover_filter_v322(jsonb) from public,anon;
grant execute on function public.cinetracker_discover_filter_v322(jsonb) to authenticated;
notify pgrst,'reload schema';
