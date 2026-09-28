-- r385: Home + Descobrir/Pra Voce only.
create or replace function public.cinetracker_home_series_v385(p_today date default current_date)
returns jsonb language sql stable security invoker set search_path=public as $$
with seed_ids as materialized (
  select distinct mo.media_id from public.media_overrides mo join public.media m on m.id=mo.media_id
  where mo.profile_id=auth.uid() and m.media_type='tv' and mo.state in ('InProgress','UpToDate','AddedToWatchlist','WatchLater','Completed','AlreadySeen')
  union select distinct wh.media_id from public.watch_history wh join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode' and m.media_type='tv'
  union select distinct ep.media_id from public.episode_progress ep join public.media m on m.id=ep.media_id
  where ep.profile_id=auth.uid() and ep.watched=true and m.media_type='tv'
), seed as materialized (
  select m.id media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id
  from seed_ids s join public.media m on m.id=s.media_id
), requested_tmdb as materialized (select distinct tmdb_id from seed where tmdb_id>0),
all_media as materialized (
  select 'tmdb:'||r.tmdb_id::text logical_key,m.id media_id,r.tmdb_id,m.title,m.poster_path,m.release_year,m.total_episodes,m.raw_tmdb,m.updated_at
  from requested_tmdb r join public.media m on m.media_type='tv' and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=r.tmdb_id
  union all
  select 'media:'||m.id::text,m.id,0::bigint,m.title,m.poster_path,m.release_year,m.total_episodes,m.raw_tmdb,m.updated_at
  from seed s join public.media m on m.id=s.media_id where s.tmdb_id<=0
), flags as materialized (
  select a.logical_key,bool_or(mo.state='InProgress') is_in_progress,bool_or(mo.state='UpToDate') is_up_to_date,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,bool_or(mo.state='Completed') is_completed,
    max(coalesce(mo.updated_at,mo.created_at)) state_updated_at
  from all_media a left join public.media_overrides mo on mo.media_id=a.media_id and mo.profile_id=auth.uid()
  group by a.logical_key
), watched_keys as materialized (
  select distinct a.logical_key,wh.season_number,wh.episode_number,wh.watched_at
  from all_media a join public.watch_history wh on wh.media_id=a.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode' and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union
  select distinct a.logical_key,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at)
  from all_media a join public.episode_progress ep on ep.media_id=a.media_id
  where ep.profile_id=auth.uid() and ep.watched=true and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), watched as materialized (
  select logical_key,count(*)::int watched_episodes,max(season_number*100000+episode_number)::int last_key,max(watched_at) last_watched_at,
    (array_agg(season_number order by season_number desc,episode_number desc))[1]::int last_season_number,
    (array_agg(episode_number order by season_number desc,episode_number desc))[1]::int last_episode_number
  from watched_keys group by logical_key
), canonical as materialized (
  select distinct on (a.logical_key) a.logical_key,a.media_id,a.tmdb_id,a.title,a.poster_path,a.release_year,
    coalesce(a.total_episodes,0)::int total_episodes,coalesce(a.raw_tmdb,'{}'::jsonb) raw_tmdb
  from all_media a order by a.logical_key,(a.tmdb_id>0) desc,(a.poster_path is not null) desc,
    ((a.raw_tmdb->>'enriched_at') is not null) desc,coalesce(a.total_episodes,0) desc,a.updated_at desc nulls last,a.media_id desc
), pre as materialized (
  select c.*,f.is_in_progress,f.is_up_to_date,f.is_watchlist,f.is_completed,f.state_updated_at,
    coalesce(w.watched_episodes,0)::int watched_episodes,w.last_key,w.last_watched_at,w.last_season_number,w.last_episode_number,
    (lower(regexp_replace(coalesce(c.title,''),'[^[:alnum:]]+','','g')) ~ '(wwe|smackdown|wwenxt|mondaynightraw|fridaynightsmackdown|formula1|formulaone|ufc)') sports_like
  from canonical c left join flags f on f.logical_key=c.logical_key left join watched w on w.logical_key=c.logical_key
), catalog as materialized (
  select p.logical_key,count(e.*) filter(where e.season_number>0 and e.episode_number>0 and (e.air_date is null or e.air_date<=coalesce(p_today,current_date)))::int released_episodes
  from pre p left join public.episode_catalog_v336 e on p.tmdb_id>0 and e.show_tmdb_id=p.tmdb_id group by p.logical_key
), calc as materialized (
  select p.*,coalesce(cat.released_episodes,0)::int catalog_released,nxt.season_number next_season_number,nxt.episode_number next_episode_number,
    coalesce(nullif(nxt.name_local,''),nullif(nxt.name_en,''),case when nxt.episode_number is not null then 'Episódio '||nxt.episode_number::text end) next_episode_title,
    nxt.vote_average next_episode_rating,nxt.air_date next_episode_air_date,coalesce(av.available_episodes,0)::int available_episodes
  from pre p left join catalog cat on cat.logical_key=p.logical_key
  left join lateral (
    select e.season_number,e.episode_number,e.name_local,e.name_en,e.vote_average,e.air_date
    from public.episode_catalog_v336 e
    where p.tmdb_id>0 and e.show_tmdb_id=p.tmdb_id and e.season_number>0 and e.episode_number>0
      and (e.air_date is null or e.air_date<=coalesce(p_today,current_date))
      and not exists(select 1 from watched_keys wk where wk.logical_key=p.logical_key and wk.season_number=e.season_number and wk.episode_number=e.episode_number)
      and ((p.sports_like and e.air_date is not null and e.air_date>=coalesce(p_today,current_date)-21)
        or (not p.sports_like and (e.season_number*100000+e.episode_number)>coalesce(p.last_key,0)))
    order by case when p.sports_like then e.air_date end desc nulls last,
      case when p.sports_like then e.season_number end desc nulls last,case when p.sports_like then e.episode_number end desc nulls last,
      case when not p.sports_like then e.season_number end asc nulls last,case when not p.sports_like then e.episode_number end asc nulls last limit 1
  ) nxt on true
  left join lateral (
    select count(*)::int available_episodes from public.episode_catalog_v336 e
    where p.tmdb_id>0 and e.show_tmdb_id=p.tmdb_id and e.season_number>0 and e.episode_number>0
      and (e.air_date is null or e.air_date<=coalesce(p_today,current_date))
      and not exists(select 1 from watched_keys wk where wk.logical_key=p.logical_key and wk.season_number=e.season_number and wk.episode_number=e.episode_number)
      and ((p.sports_like and e.air_date is not null and e.air_date>=coalesce(p_today,current_date)-21)
        or (not p.sports_like and (e.season_number*100000+e.episode_number)>coalesce(p.last_key,0)))
  ) av on true
), bucketed as materialized (
  select c.*,case
    when coalesce(c.is_completed,false) and c.available_episodes=0 then 'completed'
    when c.watched_episodes=0 and coalesce(c.is_watchlist,false) then 'not_started'
    when c.watched_episodes>0 and c.next_episode_number is not null then case when c.last_watched_at is null or c.last_watched_at>=now()-interval '30 days' then 'continue' else 'dust' end
    when c.watched_episodes>0 then 'up_to_date'
    when coalesce(c.is_up_to_date,false) then 'up_to_date'
    when coalesce(c.is_in_progress,false) and c.next_episode_number is not null then 'continue'
    else 'not_started' end home_bucket
  from calc c
)
select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',media_id,'media_type','tv','tmdb_id',tmdb_id,'title',title,'poster_path',poster_path,'release_year',release_year,
  'source_state',case when is_completed then 'Completed' when is_in_progress then 'InProgress' when is_up_to_date then 'UpToDate' when is_watchlist then 'WatchLater' else null end,
  'state_updated_at',state_updated_at,'watched_episodes',watched_episodes,'released_episodes',greatest(catalog_released,watched_episodes),
  'total_episodes',greatest(total_episodes,catalog_released,watched_episodes),'available_episodes',available_episodes,
  'last_watched_at',last_watched_at,'last_season_number',last_season_number,'last_episode_number',last_episode_number,
  'next_season_number',next_season_number,'next_episode_number',next_episode_number,'next_episode_title',next_episode_title,
  'next_episode_rating',next_episode_rating,'next_episode_air_date',next_episode_air_date,'home_bucket',home_bucket,'__ct385_authority',true
)) order by case home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 when 'completed' then 5 else 9 end,
 state_updated_at desc nulls last,media_id desc),'[]'::jsonb) from bucketed;
$$;

create or replace function public.cinetracker_home_history_v385(p_limit integer default 50)
returns jsonb language sql stable security invoker set search_path=public as $$
with cfg as (select least(greatest(coalesce(p_limit,50),1),100)::int lim),
ep_group as materialized (
 select wh.media_id,wh.season_number,wh.episode_number,max(wh.watched_at) watched_at,count(*)::int plays
 from public.watch_history wh where wh.profile_id=auth.uid() and wh.item_type='episode' and wh.media_id is not null
  and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0 group by wh.media_id,wh.season_number,wh.episode_number
), ep_recent as materialized (select * from ep_group order by watched_at desc nulls last limit (select lim from cfg)),
episodes as materialized (
 select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',m.id,'media_type','tv','tmdb_id',public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),'media_title',m.title,'title',m.title,'poster_path',m.poster_path,
  'season_number',r.season_number,'episode_number',r.episode_number,'episode_title',coalesce(nullif(ec.name_local,''),nullif(ec.name_en,''),'Episódio '||r.episode_number::text),
  'episode_rating',ec.vote_average,'episode_air_date',ec.air_date,'watched_at',r.watched_at,'plays',r.plays
 )) order by r.watched_at asc nulls last),'[]'::jsonb) rows
 from ep_recent r join public.media m on m.id=r.media_id left join public.episode_catalog_v336 ec
  on ec.show_tmdb_id=public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) and ec.season_number=r.season_number and ec.episode_number=r.episode_number
), movie_group as materialized (
 select wh.media_id,max(wh.watched_at) watched_at,count(*)::int plays from public.watch_history wh
 where wh.profile_id=auth.uid() and wh.item_type='movie' and wh.media_id is not null group by wh.media_id
), movie_recent as materialized (select * from movie_group order by watched_at desc nulls last limit (select lim from cfg)),
movies as materialized (
 select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',m.id,'media_type','movie','tmdb_id',public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),'title',m.title,'poster_path',m.poster_path,
  'release_year',m.release_year,'release_date',nullif(m.raw_tmdb->>'release_date',''),
  'runtime_minutes',coalesce(m.runtime_minutes,case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int end,0),
  'genres',coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),
  'vote_average',case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (m.raw_tmdb->>'vote_average')::numeric end,
  'watched_at',r.watched_at,'plays',r.plays
 )) order by r.watched_at asc nulls last),'[]'::jsonb) rows
 from movie_recent r join public.media m on m.id=r.media_id
)
select jsonb_build_object('history_episodes',(select rows from episodes),'history_movies',(select rows from movies),'generated_at',now());
$$;

create or replace function public.cinetracker_discover_filter_v385(p_items jsonb)
returns jsonb language sql stable security invoker set search_path=public as $$
with items as materialized (
 select case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end media_type,x.tmdb_id,
  nullif(trim(x.title),'') title,nullif(trim(x.original_title),'') original_title,x.release_year,
  (case when lower(coalesce(x.media_type,''))='movie' then 'movie:' else 'tv:' end)||x.tmdb_id::text candidate_key,
  lower(regexp_replace(coalesce(x.title,''),'[^[:alnum:]]+','','g')) norm_title,
  lower(regexp_replace(coalesce(x.original_title,''),'[^[:alnum:]]+','','g')) norm_original
 from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb)) as x(media_type text,tmdb_id integer,title text,original_title text,release_year integer)
 where coalesce(x.tmdb_id,0)>0
), exact_match as materialized (
 select distinct i.candidate_key,m.id media_id from items i join public.media m
  on m.media_type=i.media_type and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=i.tmdb_id
), alias_match as materialized (
 select distinct i.candidate_key,m.id media_id from items i join public.media m on m.media_type=i.media_type
 where ((i.norm_title<>'' and lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g'))=i.norm_title)
   or (i.norm_original<>'' and lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g'))=i.norm_original)
   or (i.norm_title<>'' and lower(regexp_replace(coalesce(m.original_title,m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=i.norm_title)
   or (i.norm_original<>'' and lower(regexp_replace(coalesce(m.original_title,m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=i.norm_original))
  and (coalesce(i.release_year,0)=0 or coalesce(m.release_year,0)=0 or abs(m.release_year-i.release_year)<=1)
), matched as materialized (select * from exact_match union select * from alias_match),
state as materialized (
 select i.candidate_key,
  exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id where mm.candidate_key=i.candidate_key and mo.profile_id=auth.uid() and mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,
  (exists(select 1 from matched mm join public.watch_history wh on wh.media_id=mm.media_id where mm.candidate_key=i.candidate_key and wh.profile_id=auth.uid() and wh.item_type in ('episode','movie'))
   or exists(select 1 from matched mm join public.episode_progress ep on ep.media_id=mm.media_id where mm.candidate_key=i.candidate_key and ep.profile_id=auth.uid() and ep.watched=true)
   or exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id where mm.candidate_key=i.candidate_key and mo.profile_id=auth.uid() and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate'))) is_seen
 from items i
)
select jsonb_build_object(
 'blocked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_watchlist or is_seen),'[]'::jsonb),
 'watch_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_watchlist),'[]'::jsonb),
 'seen_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_seen),'[]'::jsonb),
 'checked_count',(select count(*) from items),'generated_at',now());
$$;
revoke all on function public.cinetracker_home_series_v385(date) from public,anon;
grant execute on function public.cinetracker_home_series_v385(date) to authenticated;
revoke all on function public.cinetracker_home_history_v385(integer) from public,anon;
grant execute on function public.cinetracker_home_history_v385(integer) to authenticated;
revoke all on function public.cinetracker_discover_filter_v385(jsonb) from public,anon;
grant execute on function public.cinetracker_discover_filter_v385(jsonb) to authenticated;
notify pgrst,'reload schema';
