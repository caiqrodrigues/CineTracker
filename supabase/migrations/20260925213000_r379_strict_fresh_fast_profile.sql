create or replace function public.cinetracker_discover_filter_v379(p_items jsonb)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with me as (select auth.uid() uid),
items as (
  select case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end media_type,
         x.tmdb_id,nullif(trim(x.title),'') title,x.release_year,
         case when lower(coalesce(x.media_type,''))='movie' then 'movie:'||x.tmdb_id::text else 'tv:'||x.tmdb_id::text end candidate_key,
         lower(regexp_replace(coalesce(x.title,''),'[^[:alnum:]]+','','g')) norm_title
  from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb))
    as x(media_type text,tmdb_id integer,title text,release_year integer)
  where coalesce(x.tmdb_id,0)>0
),
matched as (
  select distinct i.candidate_key,i.media_type,i.tmdb_id,m.id media_id
  from items i join public.media m
    on m.media_type=i.media_type and (
      public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=i.tmdb_id
      or (i.norm_title<>'' and (
        lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g'))=i.norm_title
        or lower(regexp_replace(coalesce(m.raw_tmdb->>'title',''),'[^[:alnum:]]+','','g'))=i.norm_title
        or lower(regexp_replace(coalesce(m.raw_tmdb->>'name',''),'[^[:alnum:]]+','','g'))=i.norm_title
        or lower(regexp_replace(coalesce(m.raw_tmdb->>'original_title',''),'[^[:alnum:]]+','','g'))=i.norm_title
        or lower(regexp_replace(coalesce(m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=i.norm_title
      ) and (coalesce(i.release_year,0)=0 or coalesce(m.release_year,0)=0 or m.release_year=i.release_year))
    )
),
state as (
  select i.candidate_key,
    exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id cross join me
      where mm.candidate_key=i.candidate_key and mo.profile_id=me.uid and mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,
    (
      exists(select 1 from matched mm join public.watch_history wh on wh.media_id=mm.media_id cross join me
        where mm.candidate_key=i.candidate_key and wh.profile_id=me.uid and wh.item_type in ('episode','movie'))
      or exists(select 1 from matched mm join public.episode_progress ep on ep.media_id=mm.media_id cross join me
        where mm.candidate_key=i.candidate_key and ep.profile_id=me.uid and ep.watched=true)
      or exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id cross join me
        where mm.candidate_key=i.candidate_key and mo.profile_id=me.uid and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate'))
    ) is_seen,
    exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id cross join me
      where mm.candidate_key=i.candidate_key and mo.profile_id=me.uid and mo.state='Liked') is_liked,
    (
      exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id cross join me
        where mm.candidate_key=i.candidate_key and mo.profile_id=me.uid)
      or exists(select 1 from matched mm join public.watch_history wh on wh.media_id=mm.media_id cross join me
        where mm.candidate_key=i.candidate_key and wh.profile_id=me.uid)
      or exists(select 1 from matched mm join public.episode_progress ep on ep.media_id=mm.media_id cross join me
        where mm.candidate_key=i.candidate_key and ep.profile_id=me.uid and ep.watched=true)
    ) is_known
  from items i
),
final as (
  select candidate_key,is_watchlist,is_seen,is_liked,is_known,is_known is_blocked from state
)
select jsonb_build_object(
  'blocked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_blocked),'[]'::jsonb),
  'known_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_known),'[]'::jsonb),
  'watch_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_watchlist),'[]'::jsonb),
  'seen_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_seen),'[]'::jsonb),
  'liked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from final where is_liked),'[]'::jsonb),
  'checked_count',(select count(*) from items),
  'blocked_count',(select count(*) from final where is_blocked),
  'generated_at',now()
);
$$;
revoke all on function public.cinetracker_discover_filter_v379(jsonb) from public,anon;
grant execute on function public.cinetracker_discover_filter_v379(jsonb) to authenticated;

create or replace function public.cinetracker_profile_landing_v379(p_tz text default 'America/Sao_Paulo')
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with quick as materialized (select public.cinetracker_profile_quick_stats_v1() q),
d as materialized (select * from public.cinetracker_profile_media_dashboard_v0991()),
series_recent as (
  select d.*,1 bucket_order from d
  where media_type='tv' and (is_completed or is_in_progress or is_up_to_date or coalesce(watched_episodes,0)>0)
  order by last_watched_at desc nulls last,media_id desc limit 10
),
movie_recent as (
  select d.*,2 bucket_order from d where media_type='movie' and is_seen
  order by last_watched_at desc nulls last,media_id desc limit 10
),
series_fav as (
  select d.*,3 bucket_order from d where media_type='tv' and is_favorite
  order by last_watched_at desc nulls last,media_id desc limit 10
),
movie_fav as (
  select d.*,4 bucket_order from d where media_type='movie' and is_favorite
  order by last_watched_at desc nulls last,media_id desc limit 10
),
chosen_raw as (
  select * from series_recent union all select * from movie_recent union all select * from series_fav union all select * from movie_fav
),
chosen as (select distinct on(media_id) * from chosen_raw order by media_id,bucket_order),
dash as (
  select coalesce(jsonb_agg(to_jsonb(c)-'bucket_order' order by c.bucket_order,c.last_watched_at desc nulls last,c.media_id desc),'[]'::jsonb) v from chosen c
),
actors as (
  select coalesce(jsonb_agg(jsonb_build_object('id',fa.id,'tmdb_person_id',fa.tmdb_person_id,'actor_name',fa.actor_name,'profile_path',fa.profile_path,'created_at',fa.created_at) order by fa.created_at desc),'[]'::jsonb) v
  from (select * from public.favorite_actors where user_id=auth.uid() order by created_at desc limit 10) fa
),
activity as (select public.cinetracker_activity_by_day_v320(15,p_tz) v)
select ((select q from quick)-'dashboard'-'favorite_actors'-'activity')
 || jsonb_build_object('dashboard',(select v from dash),'favorite_actors',(select v from actors),'activity',(select v from activity),'quick',false,'landing',true,'generated_at',now());
$$;
revoke all on function public.cinetracker_profile_landing_v379(text) from public,anon;
grant execute on function public.cinetracker_profile_landing_v379(text) to authenticated;
notify pgrst,'reload schema';
