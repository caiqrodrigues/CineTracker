-- r391: Home + Discover/Pra Você only.
create or replace function public.cinetracker_home_series_v391(p_today date default current_date)
returns jsonb language sql stable security invoker set search_path=public as $$
with state_media as materialized (
 select mo.media_id,bool_or(mo.state='InProgress') is_in_progress,bool_or(mo.state='UpToDate') is_up_to_date,
 bool_or(mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,bool_or(mo.state='Completed') is_completed,
 max(coalesce(mo.updated_at,mo.created_at)) state_updated_at
 from public.media_overrides mo join public.media m on m.id=mo.media_id
 where mo.profile_id=auth.uid() and m.media_type='tv' and mo.state in ('InProgress','UpToDate','AddedToWatchlist','WatchLater','Completed','AlreadySeen')
 group by mo.media_id
), watched_events as materialized (
 select wh.media_id,wh.season_number,wh.episode_number,wh.watched_at from public.watch_history wh join public.media m on m.id=wh.media_id
 where wh.profile_id=auth.uid() and wh.item_type='episode' and m.media_type='tv' and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
 union all
 select ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at) from public.episode_progress ep join public.media m on m.id=ep.media_id
 where ep.profile_id=auth.uid() and ep.watched=true and m.media_type='tv' and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), seed_ids as materialized (select media_id from state_media union select distinct media_id from watched_events),
seed as materialized (
 select m.id media_id,m.title,m.poster_path,m.release_year,coalesce(m.total_episodes,0)::int total_episodes,coalesce(m.raw_tmdb,'{}'::jsonb) raw_tmdb,m.updated_at,
 public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
 case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0 then 'tv:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text else 'tv:id:'||m.id::text end logical_key,
 (lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g')) ~ '(wwe|smackdown|wwenxt|mondaynightraw|fridaynightsmackdown|formula1|formulaone|ufc)') sports_like
 from seed_ids i join public.media m on m.id=i.media_id
), flags as materialized (
 select s.logical_key,bool_or(coalesce(st.is_in_progress,false)) is_in_progress,bool_or(coalesce(st.is_up_to_date,false)) is_up_to_date,
 bool_or(coalesce(st.is_watchlist,false)) is_watchlist,bool_or(coalesce(st.is_completed,false)) is_completed,max(st.state_updated_at) state_updated_at
 from seed s left join state_media st on st.media_id=s.media_id group by s.logical_key
), watched_keys as materialized (
 select s.logical_key,e.season_number,e.episode_number,max(e.watched_at) watched_at from watched_events e join seed s on s.media_id=e.media_id
 group by s.logical_key,e.season_number,e.episode_number
), watched as materialized (
 select logical_key,count(*)::int watched_episodes,max(season_number*100000+episode_number)::int last_key,max(watched_at) last_watched_at,
 (array_agg(season_number order by season_number desc,episode_number desc))[1]::int last_season_number,
 (array_agg(episode_number order by season_number desc,episode_number desc))[1]::int last_episode_number
 from watched_keys group by logical_key
), canonical as materialized (
 select distinct on (s.logical_key) s.logical_key,s.media_id,s.tmdb_id,s.title,s.poster_path,s.release_year,s.total_episodes,s.raw_tmdb,s.sports_like
 from seed s order by s.logical_key,(s.poster_path is not null) desc,((s.raw_tmdb->>'enriched_at') is not null) desc,s.total_episodes desc,s.updated_at desc nulls last,s.media_id desc
), catalog_counts as materialized (
 select c.logical_key,count(e.*)::int released_episodes from canonical c left join public.episode_catalog_v336 e
 on c.tmdb_id>0 and e.show_tmdb_id=c.tmdb_id and e.season_number>0 and e.episode_number>0 and (e.air_date is null or e.air_date<=coalesce(p_today,current_date))
 group by c.logical_key
), unseen_rows as materialized (
 select c.logical_key,e.season_number,e.episode_number,e.name_local,e.name_en,e.vote_average,e.air_date,
 row_number() over(partition by c.logical_key order by
 case when c.sports_like then e.air_date end desc nulls last,case when c.sports_like then e.season_number end desc nulls last,
 case when c.sports_like then e.episode_number end desc nulls last,case when not c.sports_like then e.season_number end asc nulls last,
 case when not c.sports_like then e.episode_number end asc nulls last) rn
 from canonical c left join watched w on w.logical_key=c.logical_key join public.episode_catalog_v336 e on c.tmdb_id>0 and e.show_tmdb_id=c.tmdb_id
 left join watched_keys wk on wk.logical_key=c.logical_key and wk.season_number=e.season_number and wk.episode_number=e.episode_number
 where wk.logical_key is null and e.season_number>0 and e.episode_number>0 and (e.air_date is null or e.air_date<=coalesce(p_today,current_date))
 and ((c.sports_like and e.air_date is not null and e.air_date>=coalesce(p_today,current_date)-21)
      or (not c.sports_like and (e.season_number*100000+e.episode_number)>coalesce(w.last_key,0)))
), unseen_stats as materialized (select logical_key,count(*)::int available_episodes from unseen_rows group by logical_key),
next_row as materialized (select * from unseen_rows where rn=1),
calc as materialized (
 select c.*,f.is_in_progress,f.is_up_to_date,f.is_watchlist,f.is_completed,f.state_updated_at,coalesce(w.watched_episodes,0)::int watched_episodes,
 w.last_key,w.last_watched_at,w.last_season_number,w.last_episode_number,greatest(coalesce(cc.released_episodes,0),coalesce(w.watched_episodes,0))::int released_episodes,
 coalesce(us.available_episodes,0)::int available_episodes,nr.season_number next_season_number,nr.episode_number next_episode_number,
 coalesce(nullif(nr.name_local,''),nullif(nr.name_en,''),case when nr.episode_number is not null then 'Episódio '||nr.episode_number::text end) next_episode_title,
 nr.vote_average next_episode_rating,nr.air_date next_episode_air_date
 from canonical c left join flags f on f.logical_key=c.logical_key left join watched w on w.logical_key=c.logical_key
 left join catalog_counts cc on cc.logical_key=c.logical_key left join unseen_stats us on us.logical_key=c.logical_key left join next_row nr on nr.logical_key=c.logical_key
), bucketed as materialized (
 select c.*,case
 when coalesce(c.is_completed,false) and c.available_episodes=0 then 'completed'
 when c.watched_episodes=0 and coalesce(c.is_watchlist,false) then 'not_started'
 when c.watched_episodes>0 and c.next_episode_number is not null and c.sports_like then 'up_to_date'
 when c.watched_episodes>0 and c.next_episode_number is not null then case when c.last_watched_at is null or c.last_watched_at>=now()-interval '30 days' then 'continue' else 'dust' end
 when c.watched_episodes>0 then 'up_to_date' when coalesce(c.is_up_to_date,false) then 'up_to_date'
 when coalesce(c.is_in_progress,false) and c.next_episode_number is not null then 'continue'
 when coalesce(c.is_in_progress,false) then 'up_to_date' else 'not_started' end home_bucket from calc c
)
select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
 'media_id',media_id,'media_type','tv','tmdb_id',tmdb_id,'title',title,'poster_path',poster_path,'release_year',release_year,
 'source_state',case when is_completed then 'Completed' when is_in_progress then 'InProgress' when is_up_to_date then 'UpToDate' when is_watchlist then 'WatchLater' else null end,
 'state_updated_at',state_updated_at,'watched_episodes',watched_episodes,'released_episodes',released_episodes,
 'total_episodes',greatest(total_episodes,released_episodes,watched_episodes),'available_episodes',available_episodes,'last_watched_at',last_watched_at,
 'last_season_number',last_season_number,'last_episode_number',last_episode_number,'next_season_number',next_season_number,'next_episode_number',next_episode_number,
 'next_episode_title',next_episode_title,'next_episode_rating',next_episode_rating,'next_episode_air_date',next_episode_air_date,'home_bucket',home_bucket,'__ct391_authority',true
)) order by case home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 when 'completed' then 5 else 9 end,
 state_updated_at desc nulls last,media_id desc),'[]'::jsonb) from bucketed;
$$;

create or replace function public.cinetracker_discover_watch_v391(p_kind text,p_limit integer default 30)
returns jsonb language sql stable security invoker set search_path=public as $$
with cfg as (select lower(coalesce(p_kind,'movie')) kind,least(greatest(coalesce(p_limit,30),1),60)::int lim),
raw as materialized (
 select m.id media_id,m.media_type,m.media_kind,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
 m.title,m.original_title,m.poster_path,m.release_year,m.raw_tmdb,max(coalesce(mo.updated_at,mo.created_at)) added_at
 from public.media_overrides mo join public.media m on m.id=mo.media_id,cfg
 where mo.profile_id=auth.uid() and mo.state in ('AddedToWatchlist','WatchLater') and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0 and m.poster_path is not null
 and ((cfg.kind='movie' and m.media_type='movie') or (cfg.kind='series' and m.media_type='tv' and coalesce(m.media_kind,'series')<>'anime') or (cfg.kind='anime' and m.media_type='tv' and m.media_kind='anime'))
 group by m.id,m.media_type,m.media_kind,m.tmdb_id,m.raw_tmdb,m.title,m.original_title,m.poster_path,m.release_year
), dedup as materialized (select distinct on (tmdb_id) * from raw order by tmdb_id,added_at desc nulls last,media_id desc),
picked as materialized (select * from dedup order by added_at desc nulls last,media_id desc limit (select lim from cfg))
select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
 'media_id',media_id,'media_type',media_type,'media_kind',media_kind,'tmdb_id',tmdb_id,'id',tmdb_id,
 'title',case when media_type='movie' then title else null end,'name',case when media_type='tv' then title else null end,
 'original_title',case when media_type='movie' then coalesce(original_title,raw_tmdb->>'original_title') else null end,
 'original_name',case when media_type='tv' then coalesce(original_title,raw_tmdb->>'original_name') else null end,
 'poster_path',poster_path,'vote_average',case when coalesce(raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (raw_tmdb->>'vote_average')::numeric else 0 end,
 'release_date',case when media_type='movie' then coalesce(nullif(raw_tmdb->>'release_date',''),release_year::text||'-01-01') else null end,
 'first_air_date',case when media_type='tv' then coalesce(nullif(raw_tmdb->>'first_air_date',''),release_year::text||'-01-01') else null end,
 'genre_ids',coalesce(raw_tmdb->'genre_ids',case when media_kind='anime' then '[16]'::jsonb else '[]'::jsonb end),
 'original_language',coalesce(raw_tmdb->>'original_language',case when media_kind='anime' then 'ja' end),
 'origin_country',coalesce(raw_tmdb->'origin_country',case when media_kind='anime' then '["JP"]'::jsonb else '[]'::jsonb end),'added_at',added_at
)) order by added_at desc nulls last,media_id desc),'[]'::jsonb) from picked;
$$;

insert into public.episode_catalog_v336(show_tmdb_id,season_number,episode_number,episode_tmdb_id,show_name,show_original_name,name_local,name_en,air_date,vote_average,still_path,poster_path,updated_at)
select 287620,1,10,null,'Stuart Não Consegue Salvar o Universo','Stuart Fails to Save the Universe',
 'Spoiler: Filmado com uma Plateia ao Vivo','Spoiler: Filmed Before a Live Studio Audience',date '2026-09-24',7.5,null,
 (select m.poster_path from public.media m where public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=287620 order by (m.poster_path is not null) desc,m.updated_at desc nulls last limit 1),now()
on conflict(show_tmdb_id,season_number,episode_number) do update set
 name_local=coalesce(nullif(excluded.name_local,''),public.episode_catalog_v336.name_local),name_en=coalesce(nullif(excluded.name_en,''),public.episode_catalog_v336.name_en),
 air_date=coalesce(excluded.air_date,public.episode_catalog_v336.air_date),vote_average=coalesce(public.episode_catalog_v336.vote_average,excluded.vote_average),
 poster_path=coalesce(public.episode_catalog_v336.poster_path,excluded.poster_path),updated_at=now();

revoke all on function public.cinetracker_home_series_v391(date) from public,anon;grant execute on function public.cinetracker_home_series_v391(date) to authenticated;
revoke all on function public.cinetracker_discover_watch_v391(text,integer) from public,anon;grant execute on function public.cinetracker_discover_watch_v391(text,integer) to authenticated;
notify pgrst,'reload schema';
