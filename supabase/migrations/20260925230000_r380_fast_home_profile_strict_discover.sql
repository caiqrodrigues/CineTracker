-- r380: lightweight direct authorities for Discover exclusions, active Home rows, Profile and favorites.
create index if not exists idx_media_norm_title_v380 on public.media (media_type,lower(regexp_replace(coalesce(title,''),'[^[:alnum:]]+','','g')));
create index if not exists idx_media_norm_original_v380 on public.media (media_type,lower(regexp_replace(coalesce(raw_tmdb->>'original_title',raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g')));

create or replace function public.cinetracker_favorites_v380()
returns table(media_type text,tmdb_id integer,is_favorite boolean)
language sql stable security invoker set search_path=public
as $$ select distinct m.media_type,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::integer,true
from public.media_overrides mo join public.media m on m.id=mo.media_id
where mo.profile_id=auth.uid() and mo.state='Liked' and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0 $$;

create or replace function public.cinetracker_discover_filter_v380(p_items jsonb)
returns jsonb language sql stable security invoker set search_path=public as $$
with items as (
 select case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end media_type,x.tmdb_id,nullif(trim(x.title),'') title,nullif(trim(x.original_title),'') original_title,x.release_year,
 case when lower(coalesce(x.media_type,''))='movie' then 'movie:'||x.tmdb_id::text else 'tv:'||x.tmdb_id::text end candidate_key,
 lower(regexp_replace(coalesce(x.title,''),'[^[:alnum:]]+','','g')) norm_title,lower(regexp_replace(coalesce(x.original_title,''),'[^[:alnum:]]+','','g')) norm_original
 from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb)) as x(media_type text,tmdb_id integer,title text,original_title text,release_year integer) where coalesce(x.tmdb_id,0)>0
), exact_match as (
 select distinct i.candidate_key,m.id media_id from items i join public.media m on (case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0 then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text else m.media_type||':id:'||m.id::text end)=i.candidate_key
), alias_match as (
 select distinct i.candidate_key,m.id media_id from items i join public.media m on m.media_type=i.media_type and (
 (i.norm_title<>'' and lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g'))=i.norm_title) or
 (i.norm_original<>'' and lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g'))=i.norm_original) or
 (i.norm_title<>'' and lower(regexp_replace(coalesce(m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=i.norm_title) or
 (i.norm_original<>'' and lower(regexp_replace(coalesce(m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=i.norm_original))
 and (coalesce(i.release_year,0)=0 or coalesce(m.release_year,0)=0 or abs(m.release_year-i.release_year)<=1)
), matched as (select * from exact_match union select * from alias_match), state as (
 select i.candidate_key,
 exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id where mm.candidate_key=i.candidate_key and mo.profile_id=auth.uid() and mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,
 (exists(select 1 from matched mm join public.watch_history wh on wh.media_id=mm.media_id where mm.candidate_key=i.candidate_key and wh.profile_id=auth.uid() and wh.item_type in ('episode','movie'))
  or exists(select 1 from matched mm join public.episode_progress ep on ep.media_id=mm.media_id where mm.candidate_key=i.candidate_key and ep.profile_id=auth.uid() and ep.watched=true)
  or exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id where mm.candidate_key=i.candidate_key and mo.profile_id=auth.uid() and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate'))) is_seen,
 exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id where mm.candidate_key=i.candidate_key and mo.profile_id=auth.uid() and mo.state='Liked') is_liked,
 exists(select 1 from matched mm where mm.candidate_key=i.candidate_key) is_known from items i
)
select jsonb_build_object('blocked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_known),'[]'::jsonb),'known_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_known),'[]'::jsonb),'watch_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_watchlist),'[]'::jsonb),'seen_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_seen),'[]'::jsonb),'liked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_liked),'[]'::jsonb),'checked_count',(select count(*) from items),'generated_at',now()) $$;

create or replace function public.cinetracker_home_active_v380(p_today date default current_date)
returns jsonb language sql stable security invoker set search_path=public as $$
with active as (
 select distinct on (m.id) m.id media_id,m.title,m.poster_path,m.release_year,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) tmdb_id,coalesce(m.total_episodes,0)::int total_episodes,mo.state source_state,mo.updated_at
 from public.media_overrides mo join public.media m on m.id=mo.media_id
 where mo.profile_id=auth.uid() and m.media_type='tv' and mo.state in ('InProgress','UpToDate') order by m.id,mo.updated_at desc
), calc as (
 select a.*,coalesce(w.watched_episodes,0)::int watched_episodes,w.last_key,w.last_watched_at,coalesce(cat.released_catalog,0)::int released_catalog,
 nxt.season_number next_season_number,nxt.episode_number next_episode_number,coalesce(nullif(nxt.name_local,''),nullif(nxt.name_en,''),case when nxt.episode_number is not null then 'Episódio '||nxt.episode_number::text end) next_episode_title,nxt.vote_average next_episode_rating,nxt.air_date next_episode_air_date
 from active a
 left join lateral (select count(distinct (z.season_number,z.episode_number))::int watched_episodes,max(z.season_number*100000+z.episode_number)::int last_key,max(z.watched_at) last_watched_at from (
   select wh.season_number,wh.episode_number,wh.watched_at from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id=a.media_id and wh.item_type='episode' and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
   union all select ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at) from public.episode_progress ep where ep.profile_id=auth.uid() and ep.media_id=a.media_id and ep.watched=true and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0) z) w on true
 left join lateral (select count(*) filter(where e.season_number>0 and (e.air_date is null or e.air_date<=coalesce(p_today,current_date)))::int released_catalog from public.episode_catalog_v336 e where a.tmdb_id>0 and e.show_tmdb_id=a.tmdb_id) cat on true
 left join lateral (select e.season_number,e.episode_number,e.name_local,e.name_en,e.vote_average,e.air_date from public.episode_catalog_v336 e where a.tmdb_id>0 and e.show_tmdb_id=a.tmdb_id and e.season_number>0 and (e.air_date is null or e.air_date<=coalesce(p_today,current_date)) and (e.season_number*100000+e.episode_number)>coalesce(w.last_key,0) order by e.season_number,e.episode_number limit 1) nxt on true
)
select coalesce(jsonb_agg(jsonb_build_object('media_id',media_id,'media_type','tv','tmdb_id',tmdb_id,'title',title,'poster_path',poster_path,'release_year',release_year,'source_state',source_state,'watched_episodes',watched_episodes,'released_episodes',greatest(released_catalog,watched_episodes),'total_episodes',greatest(total_episodes,released_catalog,watched_episodes),'available_episodes',greatest(0,greatest(released_catalog,watched_episodes)-watched_episodes),'home_bucket',case when next_season_number is not null or source_state='InProgress' then 'continue' else 'up_to_date' end,'next_season_number',next_season_number,'next_episode_number',next_episode_number,'next_episode_title',next_episode_title,'next_episode_rating',next_episode_rating,'next_episode_air_date',next_episode_air_date,'last_watched_at',last_watched_at) order by updated_at desc),'[]'::jsonb) from calc $$;

-- Profile v380 deliberately derives its payload directly from indexed user rows; it does not call the old dashboard RPC.
create or replace function public.cinetracker_profile_v380(p_tz text default 'America/Sao_Paulo')
returns jsonb language sql stable security invoker set search_path=public as $$
with states as materialized (
 select mo.media_id,bool_or(mo.state='Liked') is_favorite,bool_or(mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,bool_or(mo.state='Completed') is_completed,bool_or(mo.state='InProgress') is_in_progress,bool_or(mo.state='UpToDate') is_up_to_date,bool_or(mo.state='AlreadySeen') is_already_seen,max(mo.watched_at) last_override_watch
 from public.media_overrides mo where mo.profile_id=auth.uid() group by mo.media_id
), episode_keys as materialized (
 select distinct wh.media_id,wh.season_number,wh.episode_number,wh.watched_at from public.watch_history wh where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.media_id is not null and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
 union select distinct ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at) from public.episode_progress ep where ep.profile_id=auth.uid() and ep.watched=true and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), episodes as materialized (select media_id,count(distinct (season_number,episode_number))::int watched_episodes,max(watched_at) last_episode_watch from episode_keys group by media_id),
movie_hist as materialized (select wh.media_id,max(wh.watched_at) last_movie_watch from public.watch_history wh where wh.profile_id=auth.uid() and wh.item_type='movie' and wh.media_id is not null group by wh.media_id),
ids as materialized (select media_id from states union select media_id from episodes union select media_id from movie_hist),
base as materialized (
 select m.id media_id,m.media_type,m.media_kind,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) tmdb_id,m.title,m.poster_path,m.release_year,coalesce(m.runtime_minutes,0)::int runtime_minutes,coalesce(m.total_episodes,0)::int total_episodes,coalesce(m.raw_tmdb,'{}'::jsonb) raw_tmdb,coalesce(e.watched_episodes,0)::int watched_episodes,greatest(e.last_episode_watch,mh.last_movie_watch,s.last_override_watch) last_watched_at,coalesce(s.is_favorite,false) is_favorite,coalesce(s.is_watchlist,false) is_watchlist,coalesce(s.is_completed,false) is_completed,coalesce(s.is_in_progress,false) is_in_progress,coalesce(s.is_up_to_date,false) is_up_to_date,case when m.media_type='movie' then (mh.media_id is not null or coalesce(s.is_already_seen,false)) else coalesce(e.watched_episodes,0)>0 end is_seen
 from ids i join public.media m on m.id=i.media_id left join states s on s.media_id=m.id left join episodes e on e.media_id=m.id left join movie_hist mh on mh.media_id=m.id
), agg as materialized (
 select count(*) filter(where media_type='movie' and is_seen)::bigint movies_watched,coalesce(sum(watched_episodes) filter(where media_type='tv'),0)::bigint episodes_watched,count(*) filter(where media_type='tv' and watched_episodes>0)::bigint series_watched,count(*) filter(where media_type='tv' and is_completed)::bigint completed_series,count(*) filter(where media_type='tv' and is_up_to_date)::bigint up_to_date_series,count(*) filter(where media_type='tv' and is_in_progress)::bigint in_progress_series,count(*) filter(where media_type='tv' and watched_episodes=0 and is_watchlist)::bigint not_started_series,count(*) filter(where media_type='movie' and is_watchlist)::bigint watchlist_movies,count(*) filter(where media_type='tv' and is_watchlist)::bigint watchlist_series,coalesce(sum(runtime_minutes) filter(where media_type='movie' and is_seen),0)::bigint movie_minutes,coalesce(sum(runtime_minutes*watched_episodes) filter(where media_type='tv'),0)::bigint series_minutes from base
), dash as materialized (select coalesce(jsonb_agg(to_jsonb(x) order by x.last_watched_at desc nulls last,x.media_id desc),'[]'::jsonb) rows from (select * from base where is_seen or is_favorite or is_in_progress or is_up_to_date or is_completed order by is_favorite desc,last_watched_at desc nulls last,media_id desc limit 80) x),
actors as materialized (select coalesce(jsonb_agg(jsonb_build_object('id',fa.id,'tmdb_person_id',fa.tmdb_person_id,'actor_name',fa.actor_name,'profile_path',fa.profile_path,'created_at',fa.created_at) order by fa.created_at desc),'[]'::jsonb) rows from (select * from public.favorite_actors where user_id=auth.uid() order by created_at desc limit 10) fa),
activity_rows as materialized (select (timezone(coalesce(nullif(p_tz,''),'America/Sao_Paulo'),wh.watched_at))::date activity_day,count(distinct (wh.media_id,wh.season_number,wh.episode_number))::bigint cnt from public.watch_history wh where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.watched_at>=now()-interval '16 days' group by 1),
activity as materialized (select coalesce(jsonb_agg(jsonb_build_object('day',g.activity_day,'count',coalesce(a.cnt,0)) order by g.activity_day),'[]'::jsonb) rows from generate_series(current_date-14,current_date,interval '1 day') as g(activity_day) left join activity_rows a on a.activity_day=g.activity_day::date)
select jsonb_build_object('dashboard',(select rows from dash),'stats',jsonb_build_object('episodes_watched',a.episodes_watched,'movies_watched',a.movies_watched,'series_watched',a.series_watched,'series_minutes',a.series_minutes,'movie_minutes',a.movie_minutes,'total_minutes',a.series_minutes+a.movie_minutes),'series_stats',jsonb_build_object('completed_series',a.completed_series,'up_to_date_series',a.up_to_date_series,'in_progress_series',a.in_progress_series,'not_started_series',a.not_started_series,'watchlist_movies',a.watchlist_movies,'history_series',a.series_watched),'remaining',jsonb_build_object('watchlist_movies',a.watchlist_movies,'watchlist_series',a.watchlist_series),'favorite_actors',(select rows from actors),'activity',(select rows from activity),'timezone',coalesce(nullif(p_tz,''),'America/Sao_Paulo'),'generated_at',now()) from agg a $$;

drop function if exists public.cinetracker_home_fast_v380(date);
drop function if exists public.cinetracker_home_series_v380(date);
revoke all on function public.cinetracker_favorites_v380() from public,anon; grant execute on function public.cinetracker_favorites_v380() to authenticated;
revoke all on function public.cinetracker_discover_filter_v380(jsonb) from public,anon; grant execute on function public.cinetracker_discover_filter_v380(jsonb) to authenticated;
revoke all on function public.cinetracker_home_active_v380(date) from public,anon; grant execute on function public.cinetracker_home_active_v380(date) to authenticated;
revoke all on function public.cinetracker_profile_v380(text) from public,anon; grant execute on function public.cinetracker_profile_v380(text) to authenticated;
notify pgrst,'reload schema';
