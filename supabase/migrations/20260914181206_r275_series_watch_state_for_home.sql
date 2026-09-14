create or replace function public.cinetracker_home_series_watch_state_v1(p_tmdb_ids bigint[])
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
with requested as materialized (
  select distinct x::bigint as tmdb_id
  from unnest(coalesce(p_tmdb_ids,'{}'::bigint[])) x
  where x is not null and x>0
  limit 200
),
media_ids as materialized (
  select r.tmdb_id,m.id as media_id
  from requested r
  join public.media m on public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=r.tmdb_id
  where auth.uid() is not null and m.media_type='tv'
),
watched as materialized (
  select distinct mi.tmdb_id,ep.media_id,ep.season_number,ep.episode_number,ep.watched_at
  from media_ids mi
  join public.episode_progress ep on ep.media_id=mi.media_id
  where ep.profile_id=auth.uid() and ep.watched=true and ep.season_number>0 and ep.episode_number>0
  union
  select distinct mi.tmdb_id,wh.media_id,wh.season_number,wh.episode_number,wh.watched_at
  from media_ids mi
  join public.watch_history wh on wh.media_id=mi.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.season_number>0 and wh.episode_number>0
),
per_media as (
  select mi.tmdb_id,mi.media_id,count(distinct (w.season_number,w.episode_number))::int as watched_count,max(w.watched_at) as last_watched_at
  from media_ids mi
  left join watched w on w.tmdb_id=mi.tmdb_id and w.media_id=mi.media_id
  group by mi.tmdb_id,mi.media_id
),
canonical as (
  select distinct on (tmdb_id) tmdb_id,media_id
  from per_media
  order by tmdb_id,watched_count desc,last_watched_at desc nulls last,media_id desc
),
keys as (
  select distinct tmdb_id,season_number,episode_number
  from watched
)
select coalesce(jsonb_agg(jsonb_build_object(
  'tmdb_id',r.tmdb_id,
  'canonical_media_id',c.media_id,
  'media_ids',coalesce((select jsonb_agg(mi.media_id order by mi.media_id) from media_ids mi where mi.tmdb_id=r.tmdb_id),'[]'::jsonb),
  'watched_episodes',coalesce((select count(*) from keys k where k.tmdb_id=r.tmdb_id),0),
  'watched_keys',coalesce((select jsonb_agg(jsonb_build_object('s',k.season_number,'e',k.episode_number) order by k.season_number,k.episode_number) from keys k where k.tmdb_id=r.tmdb_id),'[]'::jsonb)
) order by r.tmdb_id),'[]'::jsonb)
from requested r
left join canonical c on c.tmdb_id=r.tmdb_id;
$function$;

revoke all on function public.cinetracker_home_series_watch_state_v1(bigint[]) from public;
grant execute on function public.cinetracker_home_series_watch_state_v1(bigint[]) to authenticated;
