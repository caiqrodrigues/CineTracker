CREATE OR REPLACE FUNCTION public.cinetracker_profile_summary_v489()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with states as materialized (
  select mo.media_id,
    bool_or(mo.state='Liked') is_favorite,
    bool_or(mo.state in ('AlreadySeen','Completed')) is_movie_seen_state,
    max(mo.watched_at) last_override_watch,
    max(coalesce(mo.updated_at,mo.created_at)) state_updated_at
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
  group by mo.media_id
),
series_events as materialized (
  select wh.media_id,wh.season_number,wh.episode_number,wh.watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.media_id is not null
  union all
  select ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at)
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.watched=true and ep.media_id is not null
),
series_activity as materialized (
  select media_id,count(distinct (season_number,episode_number))::bigint watched_episodes,max(watched_at) last_watched_at
  from series_events
  where coalesce(season_number,0)>0 and coalesce(episode_number,0)>0
  group by media_id
),
movie_events as materialized (
  select wh.media_id,wh.watched_at
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.item_type='movie' and wh.media_id is not null
  union all
  select pe.media_id,pe.played_at
  from public.watch_play_events_v0994 pe
  where pe.profile_id=auth.uid() and pe.item_type='movie' and pe.media_id is not null
),
movie_activity as materialized (
  select media_id,max(watched_at) last_watched_at from movie_events group by media_id
),
ids as materialized (
  select media_id from states
  union select media_id from series_activity
  union select media_id from movie_activity
),
base as materialized (
  select
    m.id media_id,m.media_type,m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    m.title,m.poster_path,m.release_year,
    coalesce(m.runtime_minutes,0)::int runtime_minutes,
    coalesce(sa.watched_episodes,0)::bigint watched_episodes,
    greatest(sa.last_watched_at,ma.last_watched_at,s.last_override_watch) last_watched_at,
    coalesce(s.is_favorite,false) is_favorite,
    (ma.media_id is not null or coalesce(s.is_movie_seen_state,false)) is_movie_seen,
    s.state_updated_at
  from ids i
  join public.media m on m.id=i.media_id
  left join states s on s.media_id=m.id
  left join series_activity sa on sa.media_id=m.id
  left join movie_activity ma on ma.media_id=m.id
),
series_rows as materialized (
  select * from base where media_type='tv' and watched_episodes>0
),
movie_rows as materialized (
  select * from base where media_type='movie' and is_movie_seen
),
series_favorite_rows as materialized (
  select * from base where media_type='tv' and is_favorite
),
movie_favorite_rows as materialized (
  select * from base where media_type='movie' and is_favorite
),
actors as materialized (
  select fa.id,fa.tmdb_person_id,fa.actor_name,fa.profile_path,fa.created_at
  from public.favorite_actors fa where fa.user_id=auth.uid()
),
series_top as (
  select * from series_rows order by last_watched_at desc nulls last,media_id desc limit 12
),
movie_top as (
  select * from movie_rows order by last_watched_at desc nulls last,media_id desc limit 12
),
series_fav_top as (
  select * from series_favorite_rows order by state_updated_at desc nulls last,media_id desc limit 12
),
movie_fav_top as (
  select * from movie_favorite_rows order by state_updated_at desc nulls last,media_id desc limit 12
),
actors_top as (
  select * from actors order by created_at desc,id desc limit 12
)
select jsonb_build_object(
 'series',coalesce((select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc) from series_top x),'[]'::jsonb),
 'movies',coalesce((select jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc) from movie_top x),'[]'::jsonb),
 'series_favorites',coalesce((select jsonb_agg(to_jsonb(x) order by x.state_updated_at desc nulls last,x.media_id desc) from series_fav_top x),'[]'::jsonb),
 'movie_favorites',coalesce((select jsonb_agg(to_jsonb(x) order by x.state_updated_at desc nulls last,x.media_id desc) from movie_fav_top x),'[]'::jsonb),
 'actors',coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc,a.id desc) from actors_top a),'[]'::jsonb),
 'counts',jsonb_build_object(
   'series',(select count(*) from series_rows),
   'movies',(select count(*) from movie_rows),
   'series_favorites',(select count(*) from series_favorite_rows),
   'movie_favorites',(select count(*) from movie_favorite_rows),
   'actors',(select count(*) from actors)
 ),
 'source','v489-summary-12'
);
$function$

revoke all on function public.cinetracker_profile_summary_v489() from public,anon;
grant execute on function public.cinetracker_profile_summary_v489() to authenticated;
notify pgrst,'reload schema';
