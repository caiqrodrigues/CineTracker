insert into public.media(tmdb_id,media_type,media_kind,title,original_title,release_year,poster_path,runtime_minutes,total_seasons,total_episodes,genres,raw_tmdb)
select -520,'tv','series','WWE Pay-Per-View','WWE Pay-Per-View',1985,null,180,null,null,'[]'::jsonb,jsonb_build_object('source','r519','ct_special_series','wwe_ppv')
where not exists(select 1 from public.media where tmdb_id=-520 and media_type='tv');

CREATE OR REPLACE FUNCTION public.cinetracker_special_series_progress_v519()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with uid as (select auth.uid() profile_id),
f1_seen as materialized (
  select distinct ep.season_number::int season,ep.episode_number::int episode_number
  from public.episode_progress ep,uid
  where ep.profile_id=uid.profile_id and ep.media_id=865 and ep.watched=true
    and ep.season_number is not null and ep.episode_number is not null
  union
  select distinct wh.season_number::int,wh.episode_number::int
  from public.watch_history wh,uid
  where wh.profile_id=uid.profile_id and wh.media_id=865 and wh.item_type='episode'
    and wh.season_number is not null and wh.episode_number is not null
  union
  select distinct m.season::int,m.episode_number::int
  from public.user_f1_session_watch fw
  join public.f1_episode_map_v423 m on m.canonical_provider_event_id=fw.provider_event_id
  cross join uid where fw.profile_id=uid.profile_id
),
wwe_series as (select id from public.media where tmdb_id=-520 and media_type='tv' limit 1),
wwe_catalog as materialized (
  select distinct case
    when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
    else 'title:'||public.cinetracker_wwe_ppv_event_key_v519(coalesce(nullif(m.original_title,''),m.title))
  end event_key
  from public.media m
  where m.media_type='movie'
    and public.cinetracker_wwe_ppv_eligible_v519(concat_ws(' ',m.title,m.original_title))
),
wwe_seen as materialized (
  select distinct case
    when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
      then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
    else 'title:'||public.cinetracker_wwe_ppv_event_key_v519(coalesce(nullif(m.original_title,''),m.title))
  end event_key
  from public.media m cross join uid
  where m.media_type='movie'
    and public.cinetracker_wwe_ppv_eligible_v519(concat_ws(' ',m.title,m.original_title))
    and (
      exists(select 1 from public.watch_history wh where wh.profile_id=uid.profile_id and wh.media_id=m.id and wh.item_type='movie')
      or exists(select 1 from public.media_overrides mo where mo.profile_id=uid.profile_id and mo.media_id=m.id and mo.state in ('AlreadySeen','Completed'))
    )
  union
  select distinct case
    when ep.episode_number>=2000000 then 'tmdb:'||(ep.episode_number-2000000)::text
    when ep.episode_number>=100000 then coalesce(
      (select case
        when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0
          then 'tmdb:'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text
        else 'title:'||public.cinetracker_wwe_ppv_event_key_v519(coalesce(nullif(m.original_title,''),m.title))
       end from public.media m where m.id=ep.episode_number-100000),
      'episode:'||ep.season_number::text||':'||ep.episode_number::text
    )
    else 'episode:'||ep.season_number::text||':'||ep.episode_number::text end
  from public.episode_progress ep cross join uid
  where ep.profile_id=uid.profile_id and ep.media_id=(select id from wwe_series) and ep.watched=true
),
f1_map_stats as (
  select count(*)::int mapped_sessions,count(*) filter(where session_kind='race')::int mapped_races,
         count(distinct season)::int mapped_seasons
  from public.f1_episode_map_v423
)
select jsonb_build_object(
  'f1',jsonb_build_object(
    'watched',coalesce((select count(*) from f1_seen),0),
    'mapped_sessions',coalesce((select mapped_sessions from f1_map_stats),0),
    'mapped_races',coalesce((select mapped_races from f1_map_stats),0),
    'mapped_seasons',coalesce((select mapped_seasons from f1_map_stats),0)
  ),
  'wwe_ppv',jsonb_build_object(
    'watched',coalesce((select count(*) from wwe_seen where event_key<>''),0),
    'known_events',coalesce((select count(*) from wwe_catalog where event_key<>''),0)
  ),
  'generated_at',now(),'source','special-progress-v519'
);
$function$

revoke all on function public.cinetracker_special_series_progress_v519() from public,anon;
grant execute on function public.cinetracker_special_series_progress_v519() to authenticated,service_role;

CREATE OR REPLACE FUNCTION public.cinetracker_wwe_ppv_eligible_v519(p_title text)
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
with x as (
  select lower(regexp_replace(coalesce(p_title,''),'[[:space:]]+',' ','g')) t
)
select
  t !~ '(kickoff|countdown|post[ -]?show|press conference|behind the scenes|documentary|raw is netflix|sunday night.s main event|saturday night.s main event)'
  and t !~ '(^|[^[:alnum:]])(raw|smackdown)([^[:alnum:]]|$)'
  and t ~ '(wrestlemania|royal rumble|summerslam|survivor series|elimination chamber|money in the bank|backlash|crown jewel|clash (at the castle|in paris|in italy)|bad blood|king and queen of the ring|night of champions|payback|fastlane|extreme rules|hell in a cell|wrestlepalooza|day 1|super show[- ]?down|greatest royal rumble|stomping grounds|battleground|no mercy|vengeance|armageddon|unforgiven|judg(e)?ment day|no way out|cyber sunday|taboo tuesday|one night stand|december to dismember|great american bash|bragging rights|over the limit|capitol punishment|breaking point|fatal 4[- ]?way|tlc|roadblock|great balls of fire|wwe evolution)'
from x;
$function$

revoke all on function public.cinetracker_wwe_ppv_eligible_v519(text) from public,anon;
grant execute on function public.cinetracker_wwe_ppv_eligible_v519(text) to authenticated,service_role;

CREATE OR REPLACE FUNCTION public.cinetracker_wwe_ppv_event_key_v519(p_title text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
select regexp_replace(
  regexp_replace(public.cinetracker_norm_title_v1(coalesce(p_title,'')),'^wwe','','g'),
  '(19|20)[0-9]{2}$','','g'
);
$function$

revoke all on function public.cinetracker_wwe_ppv_event_key_v519(text) from public,anon;
grant execute on function public.cinetracker_wwe_ppv_event_key_v519(text) to authenticated,service_role;

CREATE OR REPLACE FUNCTION public.cinetracker_wwe_ppv_series_v519(p_season integer DEFAULT NULL::integer, p_today date DEFAULT CURRENT_DATE, p_recent_days integer DEFAULT 30)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with cfg as (
  select
    coalesce(p_season,extract(year from coalesce(p_today,current_date))::int) season,
    extract(year from coalesce(p_today,current_date))::int current_season,
    greatest(14,least(coalesce(p_recent_days,30),60))::int recent_days,
    ((coalesce(p_today,current_date)+1)::timestamp at time zone 'America/Sao_Paulo') released_before,
    (coalesce(p_today,current_date)-greatest(14,least(coalesce(p_recent_days,30),60)))::date recent_from
),
series_media as (
  select id from public.media where tmdb_id=-520 and media_type='tv' limit 1
),
raw_rows as materialized (
  select
    m.id legacy_media_id,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::int tmdb_id,
    100000+m.id::int episode_number,
    coalesce(nullif(m.title,''),nullif(m.original_title,''),'WWE Pay-Per-View') title,
    public.cinetracker_wwe_ppv_event_key_v519(coalesce(nullif(m.original_title,''),m.title)) event_key,
    coalesce(
      case when coalesce(m.raw_tmdb->>'release_date','') ~ '^\d{4}-\d{2}-\d{2}$'
        then ((m.raw_tmdb->>'release_date')::date::timestamp at time zone 'America/Sao_Paulo') end,
      make_timestamptz(coalesce(m.release_year,(select season from cfg)),12,31,12,0,0,'America/Sao_Paulo')
    ) starts_at,
    coalesce(nullif(m.runtime_minutes,0),180)::int runtime_minutes,
    m.poster_path image_url,
    (
      exists(select 1 from public.watch_history h where h.profile_id=auth.uid() and h.media_id=m.id and h.item_type='movie')
      or exists(select 1 from public.media_overrides mo where mo.profile_id=auth.uid() and mo.media_id=m.id and mo.state in ('AlreadySeen','Completed'))
    ) legacy_watched
  from public.media m
  where m.media_type='movie'
    and m.release_year=(select season from cfg)
    and public.cinetracker_wwe_ppv_eligible_v519(concat_ws(' ',m.title,m.original_title))
),
ranked as materialized (
  select r.*,
    row_number() over(
      partition by case when r.tmdb_id>0 then 'tmdb:'||r.tmdb_id::text else 'title:'||r.event_key end
      order by r.legacy_watched desc,r.legacy_media_id
    ) rn
  from raw_rows r
),
all_rows as materialized (
  select
    r.legacy_media_id,r.tmdb_id,r.episode_number,r.title,r.event_key,r.starts_at,r.runtime_minutes,r.image_url,
    (r.starts_at<(select released_before from cfg)) released,
    (r.legacy_watched or coalesce(ep.watched,false)) is_watched
  from ranked r
  left join public.episode_progress ep on ep.profile_id=auth.uid()
    and ep.media_id=(select id from series_media)
    and ep.season_number=(select season from cfg)
    and ep.episode_number=r.episode_number
  where r.rn=1
),
stats as (
  select
    count(*)::int total_episodes,
    count(*) filter(where released)::int released_episodes,
    count(*) filter(where released and is_watched)::int watched_episodes,
    count(*) filter(
      where released and not is_watched
        and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
    )::int available_episodes
  from all_rows
),
next_recent as (
  select * from all_rows
  where released and not is_watched
    and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
  order by starts_at desc,episode_number desc limit 1
),
next_upcoming as (
  select * from all_rows where not released order by starts_at,episode_number limit 1
),
poster as (
  select image_url from all_rows where nullif(image_url,'') is not null order by starts_at desc limit 1
)
select jsonb_build_object(
  'series',jsonb_strip_nulls(jsonb_build_object(
    'series_key','wwe_ppv','media_id',(select id from series_media),'media_type','tv','media_kind','series',
    'title','WWE Pay-Per-View','season',(select season from cfg),
    'poster_url',case when nullif((select image_url from poster),'') is not null
      then 'https://image.tmdb.org/t/p/w342'||(select image_url from poster) else '' end,
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
  'seasons',(select jsonb_agg(y order by y desc) from generate_series(1985,(select current_season from cfg)) y),
  'events',coalesce((
    select jsonb_agg(jsonb_build_object(
      'source','movie','legacy_media_id',legacy_media_id,'tmdb_id',tmdb_id,'title',title,
      'season',(select season from cfg),'episode_number',episode_number,'event_kind','PPV / PLE',
      'starts_at',starts_at,'runtime_minutes',runtime_minutes,'image_url',image_url,
      'released',released,'is_watched',is_watched
    ) order by starts_at desc,episode_number desc)
    from all_rows
  ),'[]'::jsonb),
  'generated_at',now(),'source','wwe-ppv-v519'
);
$function$

revoke all on function public.cinetracker_wwe_ppv_series_v519(integer,date,integer) from public,anon;
grant execute on function public.cinetracker_wwe_ppv_series_v519(integer,date,integer) to authenticated,service_role;

CREATE OR REPLACE FUNCTION public.cinetracker_wwe_ppv_tmdb_status_v519(p_tmdb_ids integer[])
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
with sm as (
  select id from public.media where tmdb_id=-520 and media_type='tv' limit 1
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
$function$

revoke all on function public.cinetracker_wwe_ppv_tmdb_status_v519(integer[]) from public,anon;
grant execute on function public.cinetracker_wwe_ppv_tmdb_status_v519(integer[]) to authenticated,service_role;

CREATE OR REPLACE FUNCTION public.cinetracker_wwe_ppv_watch_v519(p_season integer, p_episode integer, p_title text, p_runtime_minutes integer DEFAULT 180, p_legacy_media_id bigint DEFAULT NULL::bigint, p_watched boolean DEFAULT true, p_watched_at timestamp with time zone DEFAULT now())
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
  if p_season<1985 or p_season>extract(year from current_date)::int then raise exception 'INVALID_WWE_PPV_SEASON'; end if;
  if p_episode<1 then raise exception 'INVALID_WWE_PPV_EPISODE'; end if;
  select id into v_series_id from public.media where tmdb_id=-520 and media_type='tv' limit 1;
  if v_series_id is null then raise exception 'WWE_PPV_SERIES_MEDIA_MISSING'; end if;

  if coalesce(p_watched,true) then
    perform public.cinetracker_mark_watch_v0994(
      v_series_id,'episode',p_season,p_episode,coalesce(nullif(trim(p_title),''),'WWE Pay-Per-View'),
      v_runtime,null,coalesce(p_watched_at,now())
    );
  else
    perform public.cinetracker_unmark_episode_v1(v_series_id,p_season,p_episode,coalesce(p_watched_at,now()));
    if p_legacy_media_id is not null then
      perform public.cinetracker_unmark_media_seen_v1(p_legacy_media_id,'movie',coalesce(p_watched_at,now()));
    end if;
  end if;

  return jsonb_build_object(
    'media_id',v_series_id,'season_number',p_season,'episode_number',p_episode,
    'legacy_media_id',p_legacy_media_id,'watched',coalesce(p_watched,true),
    'runtime_minutes',v_runtime,'source','wwe-ppv-series-r519'
  );
end
$function$

revoke all on function public.cinetracker_wwe_ppv_watch_v519(integer,integer,text,integer,bigint,boolean,timestamptz) from public,anon;
grant execute on function public.cinetracker_wwe_ppv_watch_v519(integer,integer,text,integer,bigint,boolean,timestamptz) to authenticated,service_role;

notify pgrst,'reload schema';
