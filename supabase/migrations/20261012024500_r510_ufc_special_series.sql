create or replace function public.cinetracker_ufc_series_v510(
  p_today date default current_date,
  p_recent_days integer default 21
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select extract(year from coalesce(p_today,current_date))::int season,
    greatest(7,least(coalesce(p_recent_days,21),60))::int recent_days,
    ((coalesce(p_today,current_date)+1)::timestamp at time zone 'America/Sao_Paulo') released_before,
    (coalesce(p_today,current_date)-greatest(7,least(coalesce(p_recent_days,21),60)))::date recent_from
),
ufc_comp as (
  select id,logo_url from public.sport_entities
  where sport_slug='mma' and entity_type='competition' and upper(trim(name))='UFC'
  order by id limit 1
),
eligible as materialized (
  select ev.id event_id,ev.provider,ev.provider_event_id,ev.title,ev.starts_at,ev.ends_at,ev.status,
    coalesce(nullif(ev.season,'')::int,extract(year from ev.starts_at)::int) season,
    ev.round,ev.venue,ev.image_url,coalesce(uc.logo_url,'') logo_url,
    case when lower(ev.title) ~ '^ufc[[:space:]]+[0-9]+' then 'PPV'
      when lower(ev.title) ~ '^ufc[[:space:]]+fight[[:space:]]+night' then 'Fight Night'
      when lower(ev.title) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)' then 'Fight Night'
      else 'UFC' end event_kind
  from public.sport_events ev join ufc_comp uc on uc.id=ev.competition_entity_id
  where ev.sport_slug='mma' and (
    lower(ev.title) ~ '^ufc[[:space:]]+[0-9]+'
    or lower(ev.title) ~ '^ufc[[:space:]]+fight[[:space:]]+night'
    or lower(ev.title) ~ '^ufc[[:space:]]+on[[:space:]]+(espn|abc|fox)'
  )
),
numbered as materialized (
  select e.*,row_number() over(partition by e.season order by e.starts_at,e.event_id)::int episode_number from eligible e
),
season_rows as materialized (
  select n.*,wh.id is not null is_watched,wh.watched_at sport_watched_at,wh.duration_minutes watched_duration_minutes,
    (n.starts_at < (select released_before from cfg)) released
  from numbered n left join public.user_sport_watch_history wh on wh.profile_id=auth.uid() and wh.event_id=n.event_id
  where n.season=(select season from cfg)
),
stats as (
  select count(*)::int total_episodes,count(*) filter(where released)::int released_episodes,
    count(*) filter(where released and is_watched)::int watched_episodes,max(sport_watched_at) last_watched_at,
    count(*) filter(where released and not is_watched and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg))::int available_episodes
  from season_rows
),
next_recent as (
  select * from season_rows where released and not is_watched
    and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
  order by starts_at desc,event_id desc limit 1
),
next_upcoming as (
  select * from season_rows where not released order by starts_at,event_id limit 1
)
select jsonb_build_object(
  'series',jsonb_strip_nulls(jsonb_build_object(
    'series_key','ufc','title','UFC','season',(select season from cfg),'poster_url',coalesce((select logo_url from ufc_comp),''),
    'total_episodes',coalesce((select total_episodes from stats),0),'released_episodes',coalesce((select released_episodes from stats),0),
    'watched_episodes',coalesce((select watched_episodes from stats),0),'available_episodes',coalesce((select available_episodes from stats),0),
    'last_watched_at',(select last_watched_at from stats),'home_bucket',case when coalesce((select available_episodes from stats),0)>0 then 'continue' else 'up_to_date' end,
    'next_episode_number',(select episode_number from next_recent),'next_episode_title',(select title from next_recent),'next_episode_air_date',(select starts_at from next_recent),
    'upcoming_episode_number',(select episode_number from next_upcoming),'upcoming_episode_title',(select title from next_upcoming),'upcoming_episode_air_date',(select starts_at from next_upcoming)
  )),
  'events',coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
    'event_id',event_id,'provider',provider,'provider_event_id',provider_event_id,'title',title,'season',season,'episode_number',episode_number,'event_kind',event_kind,
    'starts_at',starts_at,'ends_at',ends_at,'status',status,'round',round,'venue',venue,'image_url',image_url,'poster_url',logo_url,
    'released',released,'is_watched',is_watched,'sport_watched_at',sport_watched_at,'watched_duration_minutes',watched_duration_minutes
  )) order by starts_at desc,event_id desc) from season_rows),'[]'::jsonb),
  'generated_at',now(),'source','sports-ufc-v510'
);
$$;
revoke all on function public.cinetracker_ufc_series_v510(date,integer) from public,anon;
grant execute on function public.cinetracker_ufc_series_v510(date,integer) to authenticated;
notify pgrst,'reload schema';
