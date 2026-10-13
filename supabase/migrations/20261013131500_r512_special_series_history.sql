-- CineTracker r512: historical UFC/F1 series without changing generic Sports or Android.
insert into public.media(tmdb_id,media_type,media_kind,title,original_title,release_year,poster_path,runtime_minutes,total_seasons,total_episodes,genres,raw_tmdb,updated_at)
values(-510,'tv','series','UFC','UFC',1993,null,180,null,null,'[]'::jsonb,jsonb_build_object('ct_special_series','ufc','source','r512'),now())
on conflict(tmdb_id,media_type) do update set media_kind='series',title='UFC',original_title='UFC',release_year=1993,raw_tmdb=coalesce(public.media.raw_tmdb,'{}'::jsonb)||jsonb_build_object('ct_special_series','ufc','source','r512'),updated_at=now();

CREATE OR REPLACE FUNCTION public.cinetracker_f1_historical_watch_v512(p_season integer, p_round integer, p_title text, p_runtime_minutes integer DEFAULT 120, p_watched boolean DEFAULT true, p_watched_at timestamp with time zone DEFAULT now())
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_uid uuid:=auth.uid();
  v_episode integer;
  v_runtime integer:=least(360,greatest(1,coalesce(p_runtime_minutes,120)));
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_season<1950 or p_season>extract(year from current_date)::int then raise exception 'INVALID_F1_SEASON'; end if;
  if p_round<1 or p_round>99 then raise exception 'INVALID_F1_ROUND'; end if;
  if exists(select 1 from public.f1_episode_map_v423 where season=p_season) then raise exception 'USE_CANONICAL_F1_SYNC_FOR_MAPPED_SEASON'; end if;
  v_episode:=1000+p_round;
  if coalesce(p_watched,true) then
    perform public.cinetracker_mark_watch_v0994(
      865,'episode',p_season,v_episode,coalesce(nullif(trim(p_title),''),'Fórmula 1'),v_runtime,null,coalesce(p_watched_at,now())
    );
  else
    perform public.cinetracker_unmark_episode_v1(865,p_season,v_episode,coalesce(p_watched_at,now()));
  end if;
  return jsonb_build_object(
    'media_id',865,'season_number',p_season,'episode_number',v_episode,'round',p_round,
    'watched',coalesce(p_watched,true),'runtime_minutes',v_runtime,'source','f1-history-r512'
  );
end
$function$;
revoke all on function public.cinetracker_f1_historical_watch_v512(integer,integer,text,integer,boolean,timestamptz) from public,anon;
grant execute on function public.cinetracker_f1_historical_watch_v512(integer,integer,text,integer,boolean,timestamptz) to authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_f1_series_v512(p_season integer DEFAULT NULL::integer, p_today date DEFAULT CURRENT_DATE, p_recent_days integer DEFAULT 21)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select
    coalesce(p_season,extract(year from coalesce(p_today,current_date))::int) season,
    extract(year from coalesce(p_today,current_date))::int current_season,
    greatest(7,least(coalesce(p_recent_days,21),60))::int recent_days,
    (coalesce(p_today,current_date)-greatest(7,least(coalesce(p_recent_days,21),60)))::date recent_from
),
logo as (
  select logo_url from public.sport_entities
  where sport_slug='formula_1' and entity_type='competition'
    and lower(trim(name)) in ('formula 1','formula one','f1')
  order by case when lower(trim(name))='formula 1' then 0 else 1 end,id
  limit 1
),
watched as materialized (
  select ep.season_number::int season,ep.episode_number::int episode_number
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.media_id=865 and ep.watched=true
  union
  select wh.season_number::int,wh.episode_number::int
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id=865 and wh.item_type='episode'
    and wh.season_number is not null and wh.episode_number is not null
  union
  select m.season,m.episode_number
  from public.user_f1_session_watch fw
  join public.f1_episode_map_v423 m on m.canonical_provider_event_id=fw.provider_event_id
  where fw.profile_id=auth.uid()
),
season_rows as materialized (
  select
    m.season,m.episode_number,m.round,m.session_kind,m.title,m.starts_at,m.runtime_minutes,
    m.canonical_provider_event_id,
    (m.starts_at<=now()) released,
    (w.episode_number is not null) is_watched,
    ev.event_id
  from public.f1_episode_map_v423 m
  left join watched w on w.season=m.season and w.episode_number=m.episode_number
  left join lateral (
    select e.id event_id
    from public.sport_events e
    where e.sport_slug='formula_1' and (
      (e.provider='cinetracker-f1' and e.provider_event_id=m.canonical_provider_event_id)
      or (
        coalesce(e.season,'')=m.season::text
        and coalesce(e.raw->>'ct_f1_episode_number','')=m.episode_number::text
      )
    )
    order by (e.provider='cinetracker-f1' and e.provider_event_id=m.canonical_provider_event_id) desc,e.id desc
    limit 1
  ) ev on true
  where m.season=(select season from cfg)
),
stats as (
  select count(*)::int total_episodes,
    count(*) filter(where released)::int released_episodes,
    count(*) filter(where released and is_watched)::int watched_episodes,
    count(*) filter(
      where released and not is_watched
        and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
    )::int available_episodes
  from season_rows
),
next_recent as (
  select * from season_rows
  where released and not is_watched
    and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
  order by starts_at,episode_number limit 1
),
next_upcoming as (
  select * from season_rows where not released order by starts_at,episode_number limit 1
),
hist_watched as (
  select distinct greatest(1,ep.episode_number-1000)::int round
  from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.media_id=865 and ep.watched=true
    and ep.season_number=(select season from cfg)
    and ep.episode_number between 1001 and 1099
  union
  select distinct greatest(1,wh.episode_number-1000)::int
  from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id=865 and wh.item_type='episode'
    and wh.season_number=(select season from cfg)
    and wh.episode_number between 1001 and 1099
)
select jsonb_build_object(
  'series',jsonb_strip_nulls(jsonb_build_object(
    'series_key','formula_1','media_id',865,'media_type','tv','media_kind','series',
    'title','Fórmula 1','season',(select season from cfg),
    'poster_url',coalesce((select logo_url from logo),''),
    'mapped',exists(select 1 from season_rows),
    'total_episodes',coalesce((select total_episodes from stats),0),
    'released_episodes',coalesce((select released_episodes from stats),0),
    'watched_episodes',coalesce((select watched_episodes from stats),0),
    'available_episodes',case when (select season from cfg)=(select current_season from cfg)
      then coalesce((select available_episodes from stats),0) else 0 end,
    'home_bucket',case when (select season from cfg)=(select current_season from cfg)
      and coalesce((select available_episodes from stats),0)>0 then 'continue' else 'up_to_date' end,
    'next_episode_number',(select episode_number from next_recent),
    'next_episode_title',(select title from next_recent),
    'next_episode_air_date',(select starts_at from next_recent),
    'upcoming_episode_number',(select episode_number from next_upcoming),
    'upcoming_episode_title',(select title from next_upcoming),
    'upcoming_episode_air_date',(select starts_at from next_upcoming)
  )),
  'seasons',(select jsonb_agg(y order by y desc) from generate_series(1950,(select current_season from cfg)) y),
  'historical_watched_rounds',coalesce((select jsonb_agg(round order by round) from hist_watched),'[]'::jsonb),
  'events',coalesce((
    select jsonb_agg(jsonb_build_object(
      'event_id',event_id,'provider_event_id',canonical_provider_event_id,'title',title,
      'season',season,'episode_number',episode_number,'round',round,'session_kind',session_kind,
      'starts_at',starts_at,'runtime_minutes',runtime_minutes,'released',released,'is_watched',is_watched,
      'source','mapped'
    ) order by starts_at desc,episode_number desc)
    from season_rows
  ),'[]'::jsonb),
  'generated_at',now(),'source','f1-v512-history'
);
$function$;
revoke all on function public.cinetracker_f1_series_v512(integer,date,integer) from public,anon;
grant execute on function public.cinetracker_f1_series_v512(integer,date,integer) to authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_ufc_series_v512(p_season integer DEFAULT NULL::integer, p_today date DEFAULT CURRENT_DATE, p_recent_days integer DEFAULT 21)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select coalesce(p_season,extract(year from coalesce(p_today,current_date))::int) season,
    extract(year from coalesce(p_today,current_date))::int current_season,
    greatest(7,least(coalesce(p_recent_days,21),60))::int recent_days,
    ((coalesce(p_today,current_date)+1)::timestamp at time zone 'America/Sao_Paulo') released_before,
    (coalesce(p_today,current_date)-greatest(7,least(coalesce(p_recent_days,21),60)))::date recent_from
),
series_media as (
  select id from public.media where tmdb_id=-510 and media_type='tv' limit 1
),
ufc_comp as (
  select id,logo_url from public.sport_entities
  where sport_slug='mma' and entity_type='competition' and upper(trim(name))='UFC'
  order by id limit 1
),
sport_rows as materialized (
  select
    'sport'::text source,
    ev.id event_id,null::bigint legacy_media_id,null::int tmdb_id,
    3000000+ev.id::int episode_number,
    ev.title,
    ev.starts_at,
    coalesce(nullif(round(extract(epoch from (ev.ends_at-ev.starts_at))/60)::int,0),180)::int runtime_minutes,
    case when lower(ev.title) ~ '^ufc[[:space:]]+[0-9]+' then 'PPV'
      when lower(ev.title) ~ '^ufc[[:space:]]+fight[[:space:]]+night' then 'Fight Night'
      when lower(ev.title) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)' then 'Fight Night'
      else 'UFC' end event_kind,
    ev.venue,
    ev.image_url,
    (ev.starts_at < (select released_before from cfg)) released,
    (
      wh.id is not null
      or ep.watched=true
    ) is_watched,
    wh.watched_at sport_watched_at
  from public.sport_events ev
  join ufc_comp uc on uc.id=ev.competition_entity_id
  left join public.user_sport_watch_history wh on wh.profile_id=auth.uid() and wh.event_id=ev.id
  left join public.episode_progress ep on ep.profile_id=auth.uid()
    and ep.media_id=(select id from series_media)
    and ep.season_number=(select season from cfg)
    and ep.episode_number=3000000+ev.id::int
  where ev.sport_slug='mma'
    and coalesce(nullif(ev.season,'')::int,extract(year from ev.starts_at)::int)=(select season from cfg)
    and (
      lower(ev.title) ~ '^ufc[[:space:]]+[0-9]+'
      or lower(ev.title) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
      or lower(ev.title) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)'
    )
),
movie_rows0 as materialized (
  select
    'movie'::text source,null::bigint event_id,m.id legacy_media_id,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::int tmdb_id,
    100000+m.id::int episode_number,m.title,
    coalesce(
      case when coalesce(m.raw_tmdb->>'release_date','') ~ '^\d{4}-\d{2}-\d{2}$'
        then ((m.raw_tmdb->>'release_date')::date::timestamp at time zone 'America/Sao_Paulo') end,
      make_timestamptz(coalesce(m.release_year,(select season from cfg)),12,31,12,0,0,'America/Sao_Paulo')
    ) starts_at,
    coalesce(nullif(m.runtime_minutes,0),180)::int runtime_minutes,
    case when lower(m.title) ~ '^ufc[[:space:]]+[0-9]+' then 'PPV'
      when lower(m.title) ~ '^ufc[[:space:]]+fight[[:space:]]+night' then 'Fight Night'
      else 'UFC' end event_kind,
    null::text venue,m.poster_path image_url,
    true released,
    (
      ep.watched=true
      or exists(select 1 from public.watch_history h where h.profile_id=auth.uid() and h.media_id=m.id and h.item_type='movie')
      or exists(select 1 from public.media_overrides mo where mo.profile_id=auth.uid() and mo.media_id=m.id and mo.state in ('AlreadySeen','Completed'))
    ) is_watched,
    null::timestamptz sport_watched_at
  from public.media m
  left join public.episode_progress ep on ep.profile_id=auth.uid()
    and ep.media_id=(select id from series_media)
    and ep.season_number=(select season from cfg)
    and ep.episode_number=100000+m.id::int
  where m.media_type='movie' and m.release_year=(select season from cfg)
    and (
      lower(m.title) ~ '^ufc[[:space:]]+[0-9]+'
      or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+[0-9]+'
      or lower(m.title) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
      or lower(coalesce(m.original_title,'')) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
    )
),
movie_rows as materialized (
  select m.*
  from movie_rows0 m
  where not exists (
    select 1 from sport_rows s
    where public.cinetracker_norm_title_v1(split_part(s.title,':',1))
        = public.cinetracker_norm_title_v1(split_part(m.title,':',1))
  )
),
all_rows as materialized (
  select * from sport_rows
  union all
  select * from movie_rows
),
stats as (
  select count(*)::int total_episodes,
    count(*) filter(where released)::int released_episodes,
    count(*) filter(where released and is_watched)::int watched_episodes,
    count(*) filter(
      where released and not is_watched
        and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
    )::int available_episodes
  from all_rows
),
next_recent as (
  select * from all_rows where released and not is_watched
    and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
  order by starts_at desc,episode_number desc limit 1
),
next_upcoming as (
  select * from all_rows where not released order by starts_at,episode_number limit 1
)
select jsonb_build_object(
  'series',jsonb_strip_nulls(jsonb_build_object(
    'series_key','ufc','media_id',(select id from series_media),'media_type','tv','media_kind','series',
    'title','UFC','season',(select season from cfg),'poster_url',coalesce((select logo_url from ufc_comp),''),
    'total_episodes',coalesce((select total_episodes from stats),0),
    'released_episodes',coalesce((select released_episodes from stats),0),
    'watched_episodes',coalesce((select watched_episodes from stats),0),
    'available_episodes',case when (select season from cfg)=(select current_season from cfg)
      then coalesce((select available_episodes from stats),0) else 0 end,
    'home_bucket',case when (select season from cfg)=(select current_season from cfg)
      and coalesce((select available_episodes from stats),0)>0 then 'continue' else 'up_to_date' end,
    'next_episode_number',(select episode_number from next_recent),
    'next_episode_title',(select title from next_recent),
    'next_episode_air_date',(select starts_at from next_recent),
    'upcoming_episode_number',(select episode_number from next_upcoming),
    'upcoming_episode_title',(select title from next_upcoming),
    'upcoming_episode_air_date',(select starts_at from next_upcoming)
  )),
  'seasons',(select jsonb_agg(y order by y desc) from generate_series(1993,(select current_season from cfg)) y),
  'events',coalesce((
    select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
      'source',source,'event_id',event_id,'legacy_media_id',legacy_media_id,'tmdb_id',tmdb_id,
      'title',title,'season',(select season from cfg),'episode_number',episode_number,'event_kind',event_kind,
      'starts_at',starts_at,'runtime_minutes',runtime_minutes,'venue',venue,'image_url',image_url,
      'released',released,'is_watched',is_watched,'sport_watched_at',sport_watched_at
    )) order by starts_at desc,episode_number desc)
    from all_rows
  ),'[]'::jsonb),
  'generated_at',now(),'source','ufc-v512-history'
);
$function$;
revoke all on function public.cinetracker_ufc_series_v512(integer,date,integer) from public,anon;
grant execute on function public.cinetracker_ufc_series_v512(integer,date,integer) to authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_ufc_tmdb_status_v512(p_tmdb_ids integer[])
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with sm as (
  select id from public.media where tmdb_id=-510 and media_type='tv' limit 1
),
ids as (
  select distinct unnest(coalesce(p_tmdb_ids,'{}'::integer[]))::int tmdb_id
),
m as (
  select i.tmdb_id,x.id media_id
  from ids i
  left join public.media x on x.media_type='movie'
    and public.cinetracker_effective_tmdb_id(x.tmdb_id,x.raw_tmdb)=i.tmdb_id
),
s as (
  select m.tmdb_id,m.media_id,
    case when m.media_id is not null then 100000+m.media_id::int else 2000000+m.tmdb_id end episode_number,
    case when m.media_id is not null then (
      exists(select 1 from public.watch_history h where h.profile_id=auth.uid() and h.media_id=m.media_id and h.item_type='movie')
      or exists(select 1 from public.media_overrides mo where mo.profile_id=auth.uid() and mo.media_id=m.media_id and mo.state in ('AlreadySeen','Completed'))
    ) else false end legacy_watched
  from m
)
select coalesce(jsonb_agg(jsonb_build_object(
  'tmdb_id',s.tmdb_id,'legacy_media_id',s.media_id,'episode_number',s.episode_number,
  'is_watched',s.legacy_watched or exists(
    select 1 from public.episode_progress ep
    where ep.profile_id=auth.uid() and ep.media_id=(select id from sm)
      and ep.episode_number=s.episode_number and ep.watched=true
  )
) order by s.tmdb_id),'[]'::jsonb)
from s;
$function$;
revoke all on function public.cinetracker_ufc_tmdb_status_v512(integer[]) from public,anon;
grant execute on function public.cinetracker_ufc_tmdb_status_v512(integer[]) to authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_ufc_watch_v512(p_season integer, p_episode integer, p_title text, p_runtime_minutes integer DEFAULT 180, p_event_id bigint DEFAULT NULL::bigint, p_legacy_media_id bigint DEFAULT NULL::bigint, p_watched boolean DEFAULT true, p_watched_at timestamp with time zone DEFAULT now())
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_uid uuid:=auth.uid();
  v_series_id bigint;
  v_runtime integer:=least(720,greatest(1,coalesce(p_runtime_minutes,180)));
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_season<1993 or p_season>extract(year from current_date)::int then raise exception 'INVALID_UFC_SEASON'; end if;
  if p_episode<1 then raise exception 'INVALID_UFC_EPISODE'; end if;
  select id into v_series_id from public.media where tmdb_id=-510 and media_type='tv' limit 1;
  if v_series_id is null then raise exception 'UFC_SERIES_MEDIA_MISSING'; end if;

  if coalesce(p_watched,true) then
    perform public.cinetracker_mark_watch_v0994(
      v_series_id,'episode',p_season,p_episode,coalesce(nullif(trim(p_title),''),'UFC'),v_runtime,null,coalesce(p_watched_at,now())
    );
  else
    perform public.cinetracker_unmark_episode_v1(v_series_id,p_season,p_episode,coalesce(p_watched_at,now()));
  end if;

  if p_event_id is not null then
    perform public.cinetracker_sport_mark_watched_v1(p_event_id,coalesce(p_watched,true),v_runtime,coalesce(p_watched_at,now()));
  end if;

  if not coalesce(p_watched,true) and p_legacy_media_id is not null then
    perform public.cinetracker_unmark_media_seen_v1(p_legacy_media_id,'movie',coalesce(p_watched_at,now()));
  end if;

  return jsonb_build_object(
    'media_id',v_series_id,'season_number',p_season,'episode_number',p_episode,
    'event_id',p_event_id,'legacy_media_id',p_legacy_media_id,
    'watched',coalesce(p_watched,true),'runtime_minutes',v_runtime,'source','ufc-series-r512'
  );
end
$function$;
revoke all on function public.cinetracker_ufc_watch_v512(integer,integer,text,integer,bigint,bigint,boolean,timestamptz) from public,anon;
grant execute on function public.cinetracker_ufc_watch_v512(integer,integer,text,integer,bigint,bigint,boolean,timestamptz) to authenticated;

notify pgrst,'reload schema';
