-- r402: Home series released-count authority + lightweight movie watchlist payload.
create or replace function public.cinetracker_home_series_v402(p_today date default current_date)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $function$
with state_media as materialized (
  select mo.media_id,
    bool_or(mo.state='InProgress') is_in_progress,
    bool_or(mo.state='UpToDate') is_up_to_date,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,
    bool_or(mo.state='Completed') is_completed,
    max(coalesce(mo.updated_at,mo.created_at)) state_updated_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where mo.profile_id=auth.uid()
    and m.media_type='tv'
    and mo.state in ('InProgress','UpToDate','AddedToWatchlist','WatchLater','Completed','AlreadySeen')
  group by mo.media_id
), watched_events as materialized (
  select wh.media_id,wh.season_number,wh.episode_number,wh.watched_at
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode' and m.media_type='tv'
    and coalesce(wh.season_number,0)>0 and coalesce(wh.episode_number,0)>0
  union all
  select ep.media_id,ep.season_number,ep.episode_number,coalesce(ep.watched_at,ep.updated_at)
  from public.episode_progress ep
  join public.media m on m.id=ep.media_id
  where ep.profile_id=auth.uid() and ep.watched=true and m.media_type='tv'
    and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
), seed_ids as materialized (
  select media_id from state_media
  union
  select distinct media_id from watched_events
), seed as materialized (
  select m.id media_id,m.title,m.poster_path,m.release_year,coalesce(m.total_episodes,0)::int total_episodes,
    coalesce(m.raw_tmdb,'{}'::jsonb) raw_tmdb,m.updated_at,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then 'tv:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else 'tv:id:'||m.id::text end logical_key,
    (lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g')) ~
      '(wwe|raw|smackdown|wwenxt|mondaynightraw|fridaynightsmackdown|formula1|formulaone|ufc)') sports_like
  from seed_ids i
  join public.media m on m.id=i.media_id
), flags as materialized (
  select s.logical_key,
    bool_or(coalesce(st.is_in_progress,false)) is_in_progress,
    bool_or(coalesce(st.is_up_to_date,false)) is_up_to_date,
    bool_or(coalesce(st.is_watchlist,false)) is_watchlist,
    bool_or(coalesce(st.is_completed,false)) is_completed,
    max(st.state_updated_at) state_updated_at
  from seed s
  left join state_media st on st.media_id=s.media_id
  group by s.logical_key
), watched_keys as materialized (
  select s.logical_key,e.season_number,e.episode_number,max(e.watched_at) watched_at
  from watched_events e
  join seed s on s.media_id=e.media_id
  group by s.logical_key,e.season_number,e.episode_number
), watched as materialized (
  select logical_key,count(*)::int watched_episodes,
    max(season_number*100000+episode_number)::int last_key,
    max(watched_at) last_watched_at,
    (array_agg(season_number order by season_number desc,episode_number desc))[1]::int last_season_number,
    (array_agg(episode_number order by season_number desc,episode_number desc))[1]::int last_episode_number
  from watched_keys
  group by logical_key
), canonical as materialized (
  select distinct on (s.logical_key)
    s.logical_key,s.media_id,s.tmdb_id,s.title,s.poster_path,s.release_year,s.total_episodes,s.raw_tmdb,s.sports_like,
    coalesce(nullif(s.raw_tmdb->'last_episode_to_air'->>'season_number','')::int,0) last_air_season,
    coalesce(nullif(s.raw_tmdb->'last_episode_to_air'->>'episode_number','')::int,0) last_air_episode,
    lower(coalesce(s.raw_tmdb->>'status','')) tmdb_status
  from seed s
  order by s.logical_key,(s.poster_path is not null) desc,
    ((s.raw_tmdb->>'enriched_at') is not null) desc,s.total_episodes desc,
    s.updated_at desc nulls last,s.media_id desc
), season_limits as materialized (
  select c.logical_key,sx.season_number,
    greatest(case
      when c.last_air_season>0 and sx.season_number<c.last_air_season then sx.episode_count
      when c.last_air_season>0 and sx.season_number=c.last_air_season then least(sx.episode_count,c.last_air_episode)
      when c.last_air_season=0 and c.tmdb_status in ('ended','canceled') then sx.episode_count
      else 0 end,0)::int released_limit
  from canonical c
  cross join lateral (
    select coalesce(nullif(sj->>'season_number','')::int,0) season_number,
           greatest(coalesce(nullif(sj->>'episode_count','')::int,0),0) episode_count
    from jsonb_array_elements(coalesce(c.raw_tmdb->'seasons','[]'::jsonb)) sj
  ) sx
  where not c.sports_like and sx.season_number>0
), tmdb_counts as materialized (
  select c.logical_key,
    greatest(
      coalesce(sum(sl.released_limit),0)::int,
      case when c.tmdb_status in ('ended','canceled') then c.total_episodes else 0 end
    )::int released_estimate
  from canonical c
  left join season_limits sl on sl.logical_key=c.logical_key
  where not c.sports_like
  group by c.logical_key,c.tmdb_status,c.total_episodes
), season_watched as materialized (
  select logical_key,season_number,count(*)::int watched_count
  from watched_keys
  group by logical_key,season_number
), first_missing_season as materialized (
  select distinct on (sl.logical_key)
    sl.logical_key,sl.season_number,sl.released_limit
  from season_limits sl
  left join season_watched sw on sw.logical_key=sl.logical_key and sw.season_number=sl.season_number
  where sl.released_limit>coalesce(sw.watched_count,0)
  order by sl.logical_key,sl.season_number
), expected_next as materialized (
  select f.logical_key,f.season_number,min(g.episode_number)::int episode_number
  from first_missing_season f
  cross join lateral generate_series(1,f.released_limit) g(episode_number)
  where not exists (
    select 1 from watched_keys wk
    where wk.logical_key=f.logical_key
      and wk.season_number=f.season_number
      and wk.episode_number=g.episode_number
  )
  group by f.logical_key,f.season_number
), catalog_counts as materialized (
  select c.logical_key,count(e.*)::int released_episodes
  from canonical c
  left join public.episode_catalog_v336 e
    on c.tmdb_id>0 and e.show_tmdb_id=c.tmdb_id
   and e.season_number>0 and e.episode_number>0
   and e.air_date is not null and e.air_date<=coalesce(p_today,current_date)
  group by c.logical_key
), sports_unseen as materialized (
  select c.logical_key,e.season_number,e.episode_number,e.name_local,e.name_en,e.vote_average,e.air_date,
    row_number() over(partition by c.logical_key order by e.air_date desc nulls last,e.season_number desc,e.episode_number desc) rn
  from canonical c
  join public.episode_catalog_v336 e on c.tmdb_id>0 and e.show_tmdb_id=c.tmdb_id
  left join watched_keys wk on wk.logical_key=c.logical_key and wk.season_number=e.season_number and wk.episode_number=e.episode_number
  where c.sports_like
    and wk.logical_key is null
    and e.season_number>0 and e.episode_number>0
    and e.air_date is not null
    and e.air_date<=coalesce(p_today,current_date)
    and e.air_date>=coalesce(p_today,current_date)-21
), sports_stats as materialized (
  select logical_key,count(*)::int available_episodes
  from sports_unseen
  group by logical_key
), next_rows as materialized (
  select en.logical_key,en.season_number,en.episode_number,e.name_local,e.name_en,e.vote_average,e.air_date
  from expected_next en
  join canonical c on c.logical_key=en.logical_key
  left join public.episode_catalog_v336 e
    on c.tmdb_id>0 and e.show_tmdb_id=c.tmdb_id
   and e.season_number=en.season_number and e.episode_number=en.episode_number
  union all
  select logical_key,season_number,episode_number,name_local,name_en,vote_average,air_date
  from sports_unseen
  where rn=1
), pre_calc as materialized (
  select c.*,f.is_in_progress,f.is_up_to_date,f.is_watchlist,f.is_completed,f.state_updated_at,
    coalesce(w.watched_episodes,0)::int watched_episodes,w.last_key,w.last_watched_at,w.last_season_number,w.last_episode_number,
    case when c.sports_like
      then greatest(coalesce(cc.released_episodes,0),coalesce(w.watched_episodes,0))
      else greatest(case when coalesce(tc.released_estimate,0)>0 then coalesce(tc.released_estimate,0) else coalesce(cc.released_episodes,0) end,coalesce(w.watched_episodes,0)) end::int released_episodes,
    coalesce(ss.available_episodes,0)::int sports_available,
    nr.season_number next_season_number,nr.episode_number next_episode_number,
    coalesce(nullif(nr.name_local,''),nullif(nr.name_en,''),case when nr.episode_number is not null then 'Episódio '||nr.episode_number::text end) next_episode_title,
    nr.vote_average next_episode_rating,nr.air_date next_episode_air_date
  from canonical c
  left join flags f on f.logical_key=c.logical_key
  left join watched w on w.logical_key=c.logical_key
  left join catalog_counts cc on cc.logical_key=c.logical_key
  left join tmdb_counts tc on tc.logical_key=c.logical_key
  left join sports_stats ss on ss.logical_key=c.logical_key
  left join next_rows nr on nr.logical_key=c.logical_key
), calc as materialized (
  select p.*,
    case when p.sports_like then p.sports_available else greatest(0,p.released_episodes-p.watched_episodes) end::int available_episodes
  from pre_calc p
), bucketed as materialized (
  select c.*,case
    when coalesce(c.is_completed,false) and c.available_episodes=0 then 'completed'
    when c.watched_episodes=0 and coalesce(c.is_watchlist,false) then 'not_started'
    when c.watched_episodes>0 and c.sports_like and c.next_episode_number is not null then 'up_to_date'
    when c.watched_episodes>0 and not c.sports_like and c.available_episodes>0
      then case when c.last_watched_at is null or c.last_watched_at>=now()-interval '30 days' then 'continue' else 'dust' end
    when c.watched_episodes>0 then 'up_to_date'
    when coalesce(c.is_up_to_date,false) then 'up_to_date'
    when coalesce(c.is_in_progress,false) and c.available_episodes>0 then 'continue'
    when coalesce(c.is_in_progress,false) then 'up_to_date'
    else 'not_started' end home_bucket
  from calc c
)
select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',media_id,'media_type','tv','tmdb_id',tmdb_id,'title',title,'poster_path',poster_path,'release_year',release_year,
  'source_state',case when is_completed then 'Completed' when is_in_progress then 'InProgress' when is_up_to_date then 'UpToDate' when is_watchlist then 'WatchLater' else null end,
  'state_updated_at',state_updated_at,'watched_episodes',watched_episodes,'released_episodes',released_episodes,
  'total_episodes',greatest(total_episodes,released_episodes,watched_episodes),'available_episodes',available_episodes,'last_watched_at',last_watched_at,
  'last_season_number',last_season_number,'last_episode_number',last_episode_number,'next_season_number',next_season_number,'next_episode_number',next_episode_number,
  'next_episode_title',next_episode_title,'next_episode_rating',next_episode_rating,'next_episode_air_date',next_episode_air_date,
  'home_bucket',home_bucket,'__ct401_authority',true
)) order by
  case home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 when 'completed' then 5 else 9 end,
  state_updated_at desc nulls last,media_id desc),'[]'::jsonb)
from bucketed;
$function$;

create or replace function public.cinetracker_home_movies_v402()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $function$
with chosen as materialized (
  select mo.media_id,max(coalesce(mo.updated_at,mo.created_at)) added_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where auth.uid() is not null
    and mo.profile_id=auth.uid()
    and mo.state in ('AddedToWatchlist','WatchLater')
    and m.media_type='movie'
  group by mo.media_id
), rows_out as materialized (
  select m.id media_id,'movie'::text media_type,coalesce(m.media_kind,'movie') media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    m.title,m.poster_path,m.release_year,coalesce(m.runtime_minutes,0)::int runtime_minutes,
    coalesce(m.genres,'[]'::jsonb) genres,
    coalesce(nullif(m.raw_tmdb->>'release_date',''),case when m.release_year is not null then m.release_year::text||'-01-01' end) release_date,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (m.raw_tmdb->>'vote_average')::numeric else 0 end vote_average,
    c.added_at
  from chosen c
  join public.media m on m.id=c.media_id
)
select jsonb_build_object(
  'rows',coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
    'media_id',media_id,'media_type',media_type,'media_kind',media_kind,'tmdb_id',tmdb_id,'title',title,
    'poster_path',poster_path,'release_year',release_year,'runtime_minutes',runtime_minutes,'genres',genres,
    'release_date',release_date,'vote_average',vote_average,'added_at',added_at
  )) order by added_at desc nulls last,media_id desc),'[]'::jsonb),
  'count',count(*)::int,
  'generated_at',now()
)
from rows_out;
$function$;

revoke all on function public.cinetracker_home_series_v402(date) from public,anon;
grant execute on function public.cinetracker_home_series_v402(date) to authenticated;
revoke all on function public.cinetracker_home_movies_v402() from public,anon;
grant execute on function public.cinetracker_home_movies_v402() to authenticated;
notify pgrst,'reload schema';
