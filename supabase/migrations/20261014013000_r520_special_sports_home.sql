-- CineTracker Web r520 — sports team/league drill-down + WWE remote episode status.
-- No new table; all reads respect existing RLS through SECURITY INVOKER.

create or replace function public.cinetracker_wwe_ppv_episode_status_v520(
  p_season integer,
  p_episode_numbers integer[]
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with series_media as (
  select id from public.media where tmdb_id=-520 and media_type='tv' limit 1
), wanted as (
  select distinct x::integer episode_number from unnest(coalesce(p_episode_numbers,array[]::integer[])) x where x>0
)
select coalesce(jsonb_agg(jsonb_build_object(
  'episode_number',w.episode_number,
  'is_watched',(
    exists(select 1 from public.episode_progress ep
      where ep.profile_id=(select auth.uid()) and ep.media_id=(select id from series_media)
        and ep.season_number=p_season and ep.episode_number=w.episode_number and ep.watched=true)
    or exists(select 1 from public.watch_history wh
      where wh.profile_id=(select auth.uid()) and wh.media_id=(select id from series_media)
        and wh.item_type='episode' and wh.season_number=p_season and wh.episode_number=w.episode_number)
  )
) order by w.episode_number),'[]'::jsonb)
from wanted w;
$$;
revoke all on function public.cinetracker_wwe_ppv_episode_status_v520(integer,integer[]) from public,anon;
grant execute on function public.cinetracker_wwe_ppv_episode_status_v520(integer,integer[]) to authenticated,service_role;

create or replace function public.cinetracker_sports_team_recent_v520(
  p_team_id bigint,
  p_limit integer default 5
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select greatest(1,least(coalesce(p_limit,5),10)) lim,(select auth.uid()) uid
), ent as (
  select id,sport_slug,name,short_name,logo_url,country from public.sport_entities
  where id=p_team_id and entity_type='team'
), chosen as materialized (
  select ev.*
  from public.sport_events ev
  where (ev.home_entity_id=p_team_id or ev.away_entity_id=p_team_id)
    and ev.starts_at<=now()+interval '5 minutes'
  order by ev.starts_at desc,ev.id desc
  limit (select lim from cfg)
), shaped as (
  select ev.id,ev.sport_slug,ev.provider,ev.provider_event_id,ev.title,ev.starts_at,ev.ends_at,ev.status,
         ev.season,ev.round,ev.venue,ev.home_score,ev.away_score,ev.image_url,ev.participants,
         c.id competition_id,c.name competition_name,c.logo_url competition_logo,
         h.id home_id,h.name home_name,h.logo_url home_logo,
         a.id away_id,a.name away_name,a.logo_url away_logo,
         (wh.id is not null) is_watched,wh.watched_at sport_watched_at,wh.duration_minutes watched_duration_minutes
  from chosen ev
  left join public.sport_entities c on c.id=ev.competition_entity_id
  left join public.sport_entities h on h.id=ev.home_entity_id
  left join public.sport_entities a on a.id=ev.away_entity_id
  left join public.user_sport_watch_history wh on wh.event_id=ev.id and wh.profile_id=(select uid from cfg)
  order by ev.starts_at desc,ev.id desc
)
select jsonb_build_object(
  'entity',coalesce((select to_jsonb(ent) from ent),'{}'::jsonb),
  'events',coalesce((select jsonb_agg(to_jsonb(shaped) order by starts_at desc,id desc) from shaped),'[]'::jsonb),
  'source','sports-team-recent-v520'
);
$$;
revoke all on function public.cinetracker_sports_team_recent_v520(bigint,integer) from public,anon;
grant execute on function public.cinetracker_sports_team_recent_v520(bigint,integer) to authenticated,service_role;

create or replace function public.cinetracker_sports_league_latest_round_v520(
  p_competition_id bigint
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select (select auth.uid()) uid
), ent as (
  select id,sport_slug,name,short_name,logo_url,country from public.sport_entities
  where id=p_competition_id and entity_type='competition'
), anchor as materialized (
  select ev.*
  from public.sport_events ev
  where ev.competition_entity_id=p_competition_id
    and ev.starts_at<=now()+interval '5 minutes'
  order by ev.starts_at desc,ev.id desc limit 1
), chosen as materialized (
  select ev.*
  from public.sport_events ev,anchor a
  where ev.competition_entity_id=p_competition_id
    and coalesce(ev.season,'')=coalesce(a.season,'')
    and (
      (
        coalesce(a.round,'') ~* '(^[0-9]+$|round[[:space:]]*[0-9]+|rodada[[:space:]]*[0-9]+|matchday[[:space:]]*[0-9]+|week[[:space:]]*[0-9]+)'
        and coalesce(ev.round,'')=coalesce(a.round,'')
      )
      or
      (
        not (coalesce(a.round,'') ~* '(^[0-9]+$|round[[:space:]]*[0-9]+|rodada[[:space:]]*[0-9]+|matchday[[:space:]]*[0-9]+|week[[:space:]]*[0-9]+)')
        and ev.starts_at>=a.starts_at-interval '3 days'
        and ev.starts_at<=a.starts_at+interval '1 day'
      )
    )
  order by ev.starts_at desc,ev.id desc
  limit 30
), shaped as (
  select ev.id,ev.sport_slug,ev.provider,ev.provider_event_id,ev.title,ev.starts_at,ev.ends_at,ev.status,
         ev.season,ev.round,ev.venue,ev.home_score,ev.away_score,ev.image_url,ev.participants,
         c.id competition_id,c.name competition_name,c.logo_url competition_logo,
         h.id home_id,h.name home_name,h.logo_url home_logo,
         a.id away_id,a.name away_name,a.logo_url away_logo,
         (wh.id is not null) is_watched,wh.watched_at sport_watched_at,wh.duration_minutes watched_duration_minutes
  from chosen ev
  left join public.sport_entities c on c.id=ev.competition_entity_id
  left join public.sport_entities h on h.id=ev.home_entity_id
  left join public.sport_entities a on a.id=ev.away_entity_id
  left join public.user_sport_watch_history wh on wh.event_id=ev.id and wh.profile_id=(select uid from cfg)
  order by ev.starts_at desc,ev.id desc
)
select jsonb_build_object(
  'entity',coalesce((select to_jsonb(ent) from ent),'{}'::jsonb),
  'round',coalesce((select round from anchor),''),
  'season',coalesce((select season from anchor),''),
  'events',coalesce((select jsonb_agg(to_jsonb(shaped) order by starts_at desc,id desc) from shaped),'[]'::jsonb),
  'source','sports-league-latest-round-v520'
);
$$;
revoke all on function public.cinetracker_sports_league_latest_round_v520(bigint) from public,anon;
grant execute on function public.cinetracker_sports_league_latest_round_v520(bigint) to authenticated,service_role;

notify pgrst,'reload schema';
