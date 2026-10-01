-- CineTracker Web r421 — stand-up hard block, F1 series-only writer and Profile watchlist truth.

create or replace function public.cinetracker_recommendation_eligible_v421(
  p_media_type text,
  p_media_kind text,
  p_title text,
  p_runtime_minutes integer,
  p_genres jsonb,
  p_raw_tmdb jsonb,
  p_exclude_wwe boolean default true,
  p_require_movie_runtime boolean default false
) returns boolean
language sql immutable security invoker set search_path=public
as $$
with v as (
 select
  lower(coalesce(p_media_type,'')) media_type,
  lower(coalesce(p_title,'')) title_text,
  lower(coalesce(p_genres,'[]'::jsonb)::text || ' ' || coalesce(p_raw_tmdb->'genres','[]'::jsonb)::text) genres_text,
  lower(concat_ws(' ',
   coalesce(p_title,''),coalesce(p_media_kind,''),
   coalesce(p_raw_tmdb->>'title',''),coalesce(p_raw_tmdb->>'name',''),
   coalesce(p_raw_tmdb->>'original_title',''),coalesce(p_raw_tmdb->>'original_name',''),
   coalesce(p_raw_tmdb->>'overview',''),coalesce(p_raw_tmdb->>'tagline',''),
   coalesce(p_raw_tmdb->'keywords','[]'::jsonb)::text,
   coalesce(p_raw_tmdb->'production_companies','[]'::jsonb)::text
  )) standup_text,
  coalesce(p_runtime_minutes,case when coalesce(p_raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (p_raw_tmdb->>'runtime')::int else 0 end,0) runtime_minutes,
  case when coalesce(p_raw_tmdb->>'budget','') ~ '^[0-9]+$' then (p_raw_tmdb->>'budget')::bigint else 0 end budget,
  case when coalesce(p_raw_tmdb->>'revenue','') ~ '^[0-9]+$' then (p_raw_tmdb->>'revenue')::bigint else 0 end revenue
)
select public.cinetracker_recommendation_eligible_v420(
 p_media_type,p_media_kind,p_title,p_runtime_minutes,p_genres,p_raw_tmdb,p_exclude_wwe,p_require_movie_runtime
) and not (
 standup_text ~ '(^|[^[:alnum:]])stand[ -]?up([^[:alnum:]]|$)'
 or standup_text ~ '(^|[^[:alnum:]])standup([^[:alnum:]]|$)'
 or standup_text like '%comedy special%'
 or standup_text like '%comedy concert%'
 or standup_text like '%live comedy%'
 or standup_text like '%especial de comedia%'
 or standup_text like '%especial de comédia%'
 or standup_text like '%show de comedia%'
 or standup_text like '%show de comédia%'
 or (standup_text ~ '(^|[^[:alnum:]])(comedian|comediante)([^[:alnum:]]|$)' and standup_text ~ '(^|[^[:alnum:]])(special|especial|stage|palco|live|ao vivo)([^[:alnum:]]|$)')
 or (
   media_type='movie'
   and genres_text ~ '(^|[^[:alnum:]])(comedy|comedia|comédia)([^[:alnum:]]|$)'
   and title_text ~ '^[[:alpha:].-]+[[:space:]]+[[:alpha:].-]+([[:space:]][[:alpha:].-]+){0,2}[[:space:]]*:'
   and runtime_minutes between 40 and 130
   and budget=0 and revenue=0
 )
) from v;
$$;

create or replace function public.cinetracker_discover_fresh_v421(p_kind text,p_limit integer default 48)
returns jsonb
language sql stable security invoker set search_path=public
as $$
with cfg as (
 select lower(coalesce(p_kind,'movie')) kind,least(greatest(coalesce(p_limit,48),1),48)::int lim,least(120,greatest(coalesce(p_limit,48),1)*4)::int scan_lim
), src as materialized (
 select x.item,x.ord,m.*
 from cfg
 cross join lateral jsonb_array_elements(public.cinetracker_discover_fresh_v420(cfg.kind,cfg.scan_lim)) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v421(
  m.media_type,m.media_kind,m.title,
  greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
  coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,true,(cfg.kind='movie')
 )
), picked as (select * from src order by ord limit (select lim from cfg))
select coalesce(jsonb_agg(item || jsonb_build_object('__ct421_eligible',true) order by ord),'[]'::jsonb) from picked;
$$;

create or replace function public.cinetracker_discover_watch_unseen_v421(p_kind text,p_limit integer default 30)
returns jsonb
language sql stable security invoker set search_path=public
as $$
with cfg as (
 select lower(coalesce(p_kind,'movie')) kind,least(greatest(coalesce(p_limit,30),1),30)::int lim,least(100,greatest(coalesce(p_limit,30),1)*4)::int scan_lim
), src as materialized (
 select x.item,x.ord,m.*
 from cfg
 cross join lateral jsonb_array_elements(public.cinetracker_discover_watch_unseen_v420(cfg.kind,cfg.scan_lim)) with ordinality x(item,ord)
 join public.media m on m.id=(x.item->>'media_id')::bigint
 where public.cinetracker_recommendation_eligible_v421(
  m.media_type,m.media_kind,m.title,
  greatest(coalesce(m.runtime_minutes,0),case when coalesce(m.raw_tmdb->>'runtime','') ~ '^[0-9]+$' then (m.raw_tmdb->>'runtime')::int else 0 end),
  coalesce(nullif(m.genres,'[]'::jsonb),m.raw_tmdb->'genres','[]'::jsonb),m.raw_tmdb,true,(cfg.kind='movie')
 )
), picked as (select * from src order by ord limit (select lim from cfg))
select coalesce(jsonb_agg(item || jsonb_build_object('__ct421_eligible',true) order by ord),'[]'::jsonb) from picked;
$$;

create or replace function public.cinetracker_profile_watchlist_runtime_v421()
returns jsonb
language sql stable security invoker set search_path=public
as $$
 select coalesce(public.cinetracker_profile_watchlist_runtime_v420(),'{}'::jsonb) || jsonb_build_object('source','v421');
$$;

create or replace function public.cinetracker_sport_stats_v421()
returns table(watched_events bigint,sports_minutes bigint)
language sql stable security invoker set search_path=public
as $$
 select count(*)::bigint,coalesce(sum(wh.duration_minutes),0)::bigint
 from public.user_sport_watch_history wh
 join public.sport_events ev on ev.id=wh.event_id
 where wh.profile_id=auth.uid() and coalesce(ev.sport_slug,'')<>'formula_1';
$$;

create or replace function public.cinetracker_f1_episode_watch_set_v421(
 p_season integer,p_episode integer,p_title text,p_runtime_minutes integer default 60,
 p_released_episodes integer default null,p_watched boolean default true,p_watched_at timestamptz default now()
) returns jsonb
language plpgsql volatile security invoker set search_path=public
as $$
declare
 v_uid uuid:=auth.uid();v_media_id bigint:=865;v_watched bigint:=0;v_play_id bigint;v_result jsonb;
begin
 if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_season is null or p_season<1950 or p_season>2200 then raise exception 'INVALID_F1_SEASON'; end if;
 if p_episode is null or p_episode<1 or p_episode>500 then raise exception 'INVALID_F1_EPISODE'; end if;
 if not exists(select 1 from public.media where id=v_media_id and media_type='tv') then raise exception 'F1_SERIES_NOT_FOUND'; end if;

 if coalesce(p_watched,true) then
  v_result:=public.cinetracker_mark_watch_v0994(v_media_id,'episode',p_season,p_episode,nullif(trim(coalesce(p_title,'')),''),greatest(1,least(coalesce(p_runtime_minutes,60),360)),p_released_episodes,coalesce(p_watched_at,now()));
  return coalesce(v_result,'{}'::jsonb)||jsonb_build_object('media_id',v_media_id,'media_type','tv','media_kind','series','series_title','Formula 1','source','f1-series-r421');
 end if;

 delete from public.watch_history where profile_id=v_uid and media_id=v_media_id and item_type='episode' and season_number=p_season and episode_number=p_episode;
 update public.episode_progress set watched=false,watched_at=null,origin='manual',updated_at=now()
 where profile_id=v_uid and media_id=v_media_id and season_number=p_season and episode_number=p_episode;

 select id into v_play_id from public.watch_play_events_v0994
 where profile_id=v_uid and media_id=v_media_id and item_type='episode' and season_number=p_season and episode_number=p_episode
 order by played_at desc,id desc limit 1;
 if v_play_id is not null then delete from public.watch_play_events_v0994 where id=v_play_id and profile_id=v_uid; end if;

 select count(*)::bigint into v_watched from (
  select distinct season_number,episode_number from public.watch_history where profile_id=v_uid and media_id=v_media_id and item_type='episode'
  union
  select distinct season_number,episode_number from public.episode_progress where profile_id=v_uid and media_id=v_media_id and watched=true
 ) q;

 delete from public.media_overrides where profile_id=v_uid and media_id=v_media_id and state in ('InProgress','UpToDate') and origin in ('system','import');
 if v_watched>0 then
  insert into public.media_overrides(profile_id,media_id,state,origin,updated_at)
  values(v_uid,v_media_id,case when coalesce(p_released_episodes,0)>0 and v_watched>=p_released_episodes then 'UpToDate' else 'InProgress' end,'system',now())
  on conflict(profile_id,media_id,state) do update set origin='system',updated_at=excluded.updated_at where public.media_overrides.origin in ('system','import');
 end if;

 return jsonb_build_object('media_id',v_media_id,'media_type','tv','media_kind','series','series_title','Formula 1','item_type','episode','season_number',p_season,'episode_number',p_episode,'watched',false,'watched_episodes',v_watched,'released_episodes',p_released_episodes,'watched_at',null,'source','f1-series-r421');
end;
$$;

revoke all on function public.cinetracker_recommendation_eligible_v421(text,text,text,integer,jsonb,jsonb,boolean,boolean) from public,anon;
grant execute on function public.cinetracker_recommendation_eligible_v421(text,text,text,integer,jsonb,jsonb,boolean,boolean) to authenticated;
revoke all on function public.cinetracker_discover_fresh_v421(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v421(text,integer) to authenticated;
revoke all on function public.cinetracker_discover_watch_unseen_v421(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_watch_unseen_v421(text,integer) to authenticated;
revoke all on function public.cinetracker_profile_watchlist_runtime_v421() from public,anon;
grant execute on function public.cinetracker_profile_watchlist_runtime_v421() to authenticated;
revoke all on function public.cinetracker_sport_stats_v421() from public,anon;
grant execute on function public.cinetracker_sport_stats_v421() to authenticated;
revoke all on function public.cinetracker_f1_episode_watch_set_v421(integer,integer,text,integer,integer,boolean,timestamptz) from public,anon;
grant execute on function public.cinetracker_f1_episode_watch_set_v421(integer,integer,text,integer,integer,boolean,timestamptz) to authenticated;
notify pgrst,'reload schema';
