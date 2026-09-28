-- r389: Home + Descobrir/Pra Você only. Final live authorities.

CREATE OR REPLACE FUNCTION public.cinetracker_discover_filter_v389(p_items jsonb)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with items as materialized (
  select case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end media_type,
    x.tmdb_id,nullif(trim(x.title),'') title,nullif(trim(x.original_title),'') original_title,x.release_year,
    (case when lower(coalesce(x.media_type,''))='movie' then 'movie:' else 'tv:' end)||x.tmdb_id::text candidate_key,
    lower(regexp_replace(coalesce(x.title,''),'[^[:alnum:]]+','','g')) norm_title,
    lower(regexp_replace(coalesce(x.original_title,''),'[^[:alnum:]]+','','g')) norm_original
  from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb))
    as x(media_type text,tmdb_id integer,title text,original_title text,release_year integer)
  where coalesce(x.tmdb_id,0)>0
), evidence_ids as materialized (
  select mo.media_id,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,
    bool_or(mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')) is_seen
  from public.media_overrides mo
  where mo.profile_id=auth.uid()
    and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate')
  group by mo.media_id
), seen_history as materialized (
  select distinct wh.media_id from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id is not null
  union
  select distinct ep.media_id from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.media_id is not null and ep.watched=true
), evidence as materialized (
  select m.id media_id,m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g')) norm_title,
    lower(regexp_replace(coalesce(m.original_title,m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g')) norm_original,
    m.release_year,
    coalesce(e.is_watchlist,false) is_watchlist,
    (coalesce(e.is_seen,false) or sh.media_id is not null) is_seen
  from (
    select media_id from evidence_ids
    union
    select media_id from seen_history
  ) ids
  join public.media m on m.id=ids.media_id
  left join evidence_ids e on e.media_id=m.id
  left join seen_history sh on sh.media_id=m.id
), state as materialized (
  select i.candidate_key,
    coalesce(bool_or(e.is_watchlist),false) is_watchlist,
    coalesce(bool_or(e.is_seen),false) is_seen
  from items i
  left join evidence e on e.media_type=i.media_type and (
    (e.tmdb_id>0 and e.tmdb_id=i.tmdb_id)
    or (
      (
        (i.norm_title<>'' and (e.norm_title=i.norm_title or e.norm_original=i.norm_title))
        or (i.norm_original<>'' and (e.norm_title=i.norm_original or e.norm_original=i.norm_original))
      )
      and (coalesce(i.release_year,0)=0 or coalesce(e.release_year,0)=0 or abs(e.release_year-i.release_year)<=1)
    )
  )
  group by i.candidate_key
)
select jsonb_build_object(
  'blocked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_watchlist or is_seen),'[]'::jsonb),
  'watch_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_watchlist),'[]'::jsonb),
  'seen_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_seen),'[]'::jsonb),
  'checked_count',(select count(*) from items),'generated_at',now()
);
$function$;

revoke all on function public.cinetracker_discover_filter_v389(jsonb) from public,anon;
grant execute on function public.cinetracker_discover_filter_v389(jsonb) to authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_discover_fresh_v389(p_kind text, p_limit integer DEFAULT 30)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select lower(coalesce(p_kind,'movie')) kind,least(greatest(coalesce(p_limit,30),1),60)::int lim
), raw as materialized (
  select distinct on (public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb))
    m.id media_id,m.media_type,m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    m.title,m.original_title,m.poster_path,m.release_year,m.raw_tmdb,m.updated_at,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0 end vote_average
  from public.media m,cfg
  where public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
    and m.poster_path is not null and coalesce(m.release_year,0)>1990
    and (
      (cfg.kind='movie' and m.media_type='movie')
      or (cfg.kind='series' and m.media_type='tv' and coalesce(m.media_kind,'series')<>'anime')
      or (cfg.kind='anime' and m.media_type='tv' and m.media_kind='anime')
    )
    and case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0 end >=7.5
  order by public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb),
    (m.poster_path is not null) desc,
    case when coalesce(m.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$'
      then (m.raw_tmdb->>'vote_average')::numeric else 0 end desc,
    m.updated_at desc nulls last,m.id desc
), candidates as materialized (
  select * from raw order by vote_average desc,release_year desc nulls last,tmdb_id desc limit (select lim*6 from cfg)
), eligible as materialized (
  select c.*
  from candidates c
  where not exists (
    select 1 from public.media mx
    where mx.media_type=c.media_type
      and (
        public.cinetracker_effective_tmdb_id(mx.tmdb_id,mx.raw_tmdb)=c.tmdb_id
        or (
          (
            lower(regexp_replace(coalesce(mx.title,''),'[^[:alnum:]]+','','g'))=lower(regexp_replace(coalesce(c.title,''),'[^[:alnum:]]+','','g'))
            or lower(regexp_replace(coalesce(mx.title,''),'[^[:alnum:]]+','','g'))=lower(regexp_replace(coalesce(c.original_title,c.raw_tmdb->>'original_title',c.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))
            or lower(regexp_replace(coalesce(mx.original_title,mx.raw_tmdb->>'original_title',mx.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=lower(regexp_replace(coalesce(c.title,''),'[^[:alnum:]]+','','g'))
            or lower(regexp_replace(coalesce(mx.original_title,mx.raw_tmdb->>'original_title',mx.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=lower(regexp_replace(coalesce(c.original_title,c.raw_tmdb->>'original_title',c.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))
          )
          and (coalesce(c.release_year,0)=0 or coalesce(mx.release_year,0)=0 or abs(mx.release_year-c.release_year)<=1)
        )
      )
      and (
        exists(select 1 from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id=mx.id)
        or exists(select 1 from public.episode_progress ep where ep.profile_id=auth.uid() and ep.media_id=mx.id and ep.watched=true)
        or exists(select 1 from public.media_overrides mo where mo.profile_id=auth.uid() and mo.media_id=mx.id
          and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate'))
      )
  )
)
select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',e.media_id,'media_type',e.media_type,'media_kind',e.media_kind,'tmdb_id',e.tmdb_id,'id',e.tmdb_id,
  'title',case when e.media_type='movie' then e.title else null end,
  'name',case when e.media_type='tv' then e.title else null end,
  'original_title',case when e.media_type='movie' then coalesce(e.original_title,e.raw_tmdb->>'original_title') else null end,
  'original_name',case when e.media_type='tv' then coalesce(e.original_title,e.raw_tmdb->>'original_name') else null end,
  'poster_path',e.poster_path,'vote_average',e.vote_average,
  'release_date',case when e.media_type='movie' then coalesce(nullif(e.raw_tmdb->>'release_date',''),e.release_year::text||'-01-01') else null end,
  'first_air_date',case when e.media_type='tv' then coalesce(nullif(e.raw_tmdb->>'first_air_date',''),e.release_year::text||'-01-01') else null end,
  'genre_ids',coalesce(e.raw_tmdb->'genre_ids',case when e.media_kind='anime' then '[16]'::jsonb else '[]'::jsonb end),
  'original_language',coalesce(e.raw_tmdb->>'original_language',case when e.media_kind='anime' then 'ja' end),
  'origin_country',coalesce(e.raw_tmdb->'origin_country',case when e.media_kind='anime' then '["JP"]'::jsonb else '[]'::jsonb end),
  '__ct389_validated',true
)) order by e.vote_average desc,e.release_year desc nulls last,e.tmdb_id desc),'[]'::jsonb)
from (select * from eligible order by vote_average desc,release_year desc nulls last,tmdb_id desc limit (select lim from cfg)) e;
$function$;

revoke all on function public.cinetracker_discover_fresh_v389(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v389(text,integer) to authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_discover_watch_v389(p_kind text, p_limit integer DEFAULT 30)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select lower(coalesce(p_kind,'movie')) kind,least(greatest(coalesce(p_limit,30),1),60)::int lim
), raw as materialized (
  select m.id media_id,m.media_type,m.media_kind,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    m.title,m.original_title,m.poster_path,m.release_year,m.raw_tmdb,
    max(coalesce(mo.updated_at,mo.created_at)) added_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id,cfg
  where mo.profile_id=auth.uid() and mo.state in ('AddedToWatchlist','WatchLater')
    and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
    and m.poster_path is not null
    and (
      (cfg.kind='movie' and m.media_type='movie')
      or (cfg.kind='series' and m.media_type='tv' and coalesce(m.media_kind,'series')<>'anime')
      or (cfg.kind='anime' and m.media_type='tv' and m.media_kind='anime')
    )
  group by m.id,m.media_type,m.media_kind,m.tmdb_id,m.raw_tmdb,m.title,m.original_title,m.poster_path,m.release_year
), dedup as materialized (
  select distinct on (tmdb_id) * from raw
  order by tmdb_id,added_at desc nulls last,media_id desc
)
select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',e.media_id,'media_type',e.media_type,'media_kind',e.media_kind,'tmdb_id',e.tmdb_id,'id',e.tmdb_id,
  'title',case when e.media_type='movie' then e.title else null end,
  'name',case when e.media_type='tv' then e.title else null end,
  'original_title',case when e.media_type='movie' then coalesce(e.original_title,e.raw_tmdb->>'original_title') else null end,
  'original_name',case when e.media_type='tv' then coalesce(e.original_title,e.raw_tmdb->>'original_name') else null end,
  'poster_path',e.poster_path,
  'vote_average',case when coalesce(e.raw_tmdb->>'vote_average','') ~ '^[0-9]+([.][0-9]+)?$' then (e.raw_tmdb->>'vote_average')::numeric else 0 end,
  'release_date',case when e.media_type='movie' then coalesce(nullif(e.raw_tmdb->>'release_date',''),e.release_year::text||'-01-01') else null end,
  'first_air_date',case when e.media_type='tv' then coalesce(nullif(e.raw_tmdb->>'first_air_date',''),e.release_year::text||'-01-01') else null end,
  'genre_ids',coalesce(e.raw_tmdb->'genre_ids',case when e.media_kind='anime' then '[16]'::jsonb else '[]'::jsonb end),
  'original_language',coalesce(e.raw_tmdb->>'original_language',case when e.media_kind='anime' then 'ja' end),
  'origin_country',coalesce(e.raw_tmdb->'origin_country',case when e.media_kind='anime' then '["JP"]'::jsonb else '[]'::jsonb end),
  'added_at',e.added_at
)) order by e.added_at desc nulls last,e.media_id desc),'[]'::jsonb)
from (select * from dedup order by added_at desc nulls last limit (select lim from cfg)) e;
$function$;

revoke all on function public.cinetracker_discover_watch_v389(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_watch_v389(text,integer) to authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_home_series_v389(p_today date DEFAULT CURRENT_DATE)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with state_by_media as materialized (
  select mo.media_id,
    bool_or(mo.state='InProgress') is_in_progress,
    bool_or(mo.state='UpToDate') is_up_to_date,
    bool_or(mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,
    bool_or(mo.state='Completed') is_completed,
    max(coalesce(mo.updated_at,mo.created_at)) state_updated_at
  from public.media_overrides mo
  join public.media m on m.id=mo.media_id
  where mo.profile_id=auth.uid() and m.media_type='tv'
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
  select media_id from state_by_media
  union
  select distinct media_id from watched_events
), seed as materialized (
  select m.id media_id,m.title,m.poster_path,m.release_year,coalesce(m.total_episodes,0)::int total_episodes,
    coalesce(m.raw_tmdb,'{}'::jsonb) raw_tmdb,m.updated_at,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then 'tv:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
      else 'tv:id:'||m.id::text end logical_key
  from seed_ids i join public.media m on m.id=i.media_id
), flags as materialized (
  select s.logical_key,
    bool_or(coalesce(st.is_in_progress,false)) is_in_progress,
    bool_or(coalesce(st.is_up_to_date,false)) is_up_to_date,
    bool_or(coalesce(st.is_watchlist,false)) is_watchlist,
    bool_or(coalesce(st.is_completed,false)) is_completed,
    max(st.state_updated_at) state_updated_at
  from seed s left join state_by_media st on st.media_id=s.media_id
  group by s.logical_key
), watched_keys as materialized (
  select s.logical_key,e.season_number,e.episode_number,max(e.watched_at) watched_at
  from watched_events e join seed s on s.media_id=e.media_id
  group by s.logical_key,e.season_number,e.episode_number
), watched as materialized (
  select logical_key,count(*)::int watched_episodes,
    max(season_number*100000+episode_number)::int last_key,max(watched_at) last_watched_at,
    (array_agg(season_number order by season_number desc,episode_number desc))[1]::int last_season_number,
    (array_agg(episode_number order by season_number desc,episode_number desc))[1]::int last_episode_number
  from watched_keys group by logical_key
), canonical as materialized (
  select distinct on (s.logical_key)
    s.logical_key,s.media_id,s.tmdb_id,s.title,s.poster_path,s.release_year,s.total_episodes,s.raw_tmdb
  from seed s
  order by s.logical_key,(s.poster_path is not null) desc,
    ((s.raw_tmdb->>'enriched_at') is not null) desc,s.total_episodes desc,
    s.updated_at desc nulls last,s.media_id desc
), pre as materialized (
  select c.*,f.is_in_progress,f.is_up_to_date,f.is_watchlist,f.is_completed,f.state_updated_at,
    coalesce(w.watched_episodes,0)::int watched_episodes,w.last_key,w.last_watched_at,w.last_season_number,w.last_episode_number,
    (lower(regexp_replace(coalesce(c.title,''),'[^[:alnum:]]+','','g')) ~
      '(wwe|smackdown|wwenxt|mondaynightraw|fridaynightsmackdown|formula1|formulaone|ufc)') sports_like
  from canonical c
  left join flags f on f.logical_key=c.logical_key
  left join watched w on w.logical_key=c.logical_key
), calc as materialized (
  select p.*,
    coalesce(rel.released_episodes,0)::int catalog_released,
    nxt.season_number next_season_number,nxt.episode_number next_episode_number,
    coalesce(nullif(nxt.name_local,''),nullif(nxt.name_en,''),case when nxt.episode_number is not null then 'Episódio '||nxt.episode_number::text end) next_episode_title,
    nxt.vote_average next_episode_rating,nxt.air_date next_episode_air_date,
    coalesce(av.available_episodes,0)::int available_episodes
  from pre p
  left join lateral (
    select count(*)::int released_episodes
    from public.episode_catalog_v336 e
    where p.tmdb_id>0 and e.show_tmdb_id=p.tmdb_id
      and e.season_number>0 and e.episode_number>0
      and (e.air_date is null or e.air_date<=coalesce(p_today,current_date))
  ) rel on true
  left join lateral (
    select e.season_number,e.episode_number,e.name_local,e.name_en,e.vote_average,e.air_date
    from public.episode_catalog_v336 e
    where p.tmdb_id>0 and e.show_tmdb_id=p.tmdb_id
      and e.season_number>0 and e.episode_number>0
      and (e.air_date is null or e.air_date<=coalesce(p_today,current_date))
      and not exists(
        select 1 from watched_keys wk
        where wk.logical_key=p.logical_key and wk.season_number=e.season_number and wk.episode_number=e.episode_number
      )
      and (
        (p.sports_like and e.air_date is not null and e.air_date>=coalesce(p_today,current_date)-21)
        or
        (not p.sports_like and (e.season_number*100000+e.episode_number)>coalesce(p.last_key,0))
      )
    order by
      case when p.sports_like then e.air_date end desc nulls last,
      case when p.sports_like then e.season_number end desc nulls last,
      case when p.sports_like then e.episode_number end desc nulls last,
      case when not p.sports_like then e.season_number end asc nulls last,
      case when not p.sports_like then e.episode_number end asc nulls last
    limit 1
  ) nxt on true
  left join lateral (
    select count(*)::int available_episodes
    from public.episode_catalog_v336 e
    where p.tmdb_id>0 and e.show_tmdb_id=p.tmdb_id
      and e.season_number>0 and e.episode_number>0
      and (e.air_date is null or e.air_date<=coalesce(p_today,current_date))
      and not exists(
        select 1 from watched_keys wk
        where wk.logical_key=p.logical_key and wk.season_number=e.season_number and wk.episode_number=e.episode_number
      )
      and (
        (p.sports_like and e.air_date is not null and e.air_date>=coalesce(p_today,current_date)-21)
        or
        (not p.sports_like and (e.season_number*100000+e.episode_number)>coalesce(p.last_key,0))
      )
  ) av on true
), bucketed as materialized (
  select c.*,case
    when coalesce(c.is_completed,false) and c.available_episodes=0 then 'completed'
    when c.watched_episodes=0 and coalesce(c.is_watchlist,false) then 'not_started'
    when c.watched_episodes>0 and c.next_episode_number is not null
      then case when c.last_watched_at is null or c.last_watched_at>=now()-interval '30 days' then 'continue' else 'dust' end
    when c.watched_episodes>0 then 'up_to_date'
    when coalesce(c.is_up_to_date,false) then 'up_to_date'
    when coalesce(c.is_in_progress,false) and c.next_episode_number is not null then 'continue'
    when coalesce(c.is_in_progress,false) then 'up_to_date'
    else 'not_started' end home_bucket
  from calc c
)
select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'media_id',media_id,'media_type','tv','tmdb_id',tmdb_id,'title',title,'poster_path',poster_path,'release_year',release_year,
  'source_state',case when is_completed then 'Completed' when is_in_progress then 'InProgress' when is_up_to_date then 'UpToDate' when is_watchlist then 'WatchLater' else null end,
  'state_updated_at',state_updated_at,'watched_episodes',watched_episodes,
  'released_episodes',greatest(catalog_released,watched_episodes),
  'total_episodes',greatest(total_episodes,catalog_released,watched_episodes),
  'available_episodes',available_episodes,'last_watched_at',last_watched_at,
  'last_season_number',last_season_number,'last_episode_number',last_episode_number,
  'next_season_number',next_season_number,'next_episode_number',next_episode_number,
  'next_episode_title',next_episode_title,'next_episode_rating',next_episode_rating,
  'next_episode_air_date',next_episode_air_date,'home_bucket',home_bucket,'__ct389_authority',true
)) order by
  case home_bucket when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3 when 'not_started' then 4 when 'completed' then 5 else 9 end,
  state_updated_at desc nulls last,media_id desc),'[]'::jsonb)
from bucketed;
$function$;

revoke all on function public.cinetracker_home_series_v389(date) from public,anon;
grant execute on function public.cinetracker_home_series_v389(date) to authenticated;

notify pgrst,'reload schema';
