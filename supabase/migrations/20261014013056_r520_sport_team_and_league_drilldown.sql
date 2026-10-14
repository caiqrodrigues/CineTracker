create or replace function public.cinetracker_sport_entity_recent_v520(p_entity_id bigint,p_limit integer default 5)
returns jsonb
language sql
stable
set search_path=public
as $$
with ent as (
  select e.id,e.sport_slug,e.entity_type,e.name,e.short_name,e.country,e.logo_url,e.image_url
  from public.sport_entities e where e.id=p_entity_id
),
picked as (
  select ev.* from public.sport_events ev
  where (ev.home_entity_id=p_entity_id or ev.away_entity_id=p_entity_id) and ev.starts_at<=now()
  order by ev.starts_at desc,ev.id desc
  limit least(20,greatest(1,coalesce(p_limit,5)))
),
items as (
  select ev.id,ev.sport_slug,ev.provider,ev.provider_event_id,ev.title,ev.starts_at,ev.ends_at,ev.status,ev.season,ev.round,ev.venue,
         ev.home_score,ev.away_score,ev.image_url,
         c.id competition_id,c.name competition_name,c.logo_url competition_logo,
         h.id home_id,h.name home_name,h.logo_url home_logo,
         a.id away_id,a.name away_name,a.logo_url away_logo,
         (wh.id is not null) is_watched,wh.watched_at sport_watched_at,wh.duration_minutes watched_duration_minutes
  from picked ev
  left join public.sport_entities c on c.id=ev.competition_entity_id
  left join public.sport_entities h on h.id=ev.home_entity_id
  left join public.sport_entities a on a.id=ev.away_entity_id
  left join public.user_sport_watch_history wh on wh.profile_id=auth.uid() and wh.event_id=ev.id
  order by ev.starts_at desc,ev.id desc
)
select jsonb_build_object(
 'entity',coalesce((select to_jsonb(ent) from ent),'{}'::jsonb),
 'events',coalesce((select jsonb_agg(to_jsonb(items) order by items.starts_at desc,items.id desc) from items),'[]'::jsonb),
 'limit',least(20,greatest(1,coalesce(p_limit,5))),
 'generated_at',now()
);
$$;

create or replace function public.cinetracker_sport_competition_latest_round_v520(p_competition_id bigint)
returns jsonb
language sql
stable
set search_path=public
as $$
with comp as (
  select e.id,e.sport_slug,e.entity_type,e.name,e.short_name,e.country,e.logo_url,e.image_url
  from public.sport_entities e where e.id=p_competition_id and e.entity_type='competition'
),
latest as (
  select ev.*,nullif(ev.raw#>>'{week,number}','') week_no,
         case when coalesce(ev.round,'') ~ '^[0-9]+$' then ev.round else null end numeric_round
  from public.sport_events ev
  where ev.competition_entity_id=p_competition_id and ev.starts_at<=now()
  order by ev.starts_at desc,ev.id desc limit 1
),
picked as (
  select ev.* from public.sport_events ev cross join latest l
  where ev.competition_entity_id=p_competition_id and ev.starts_at<=now()
    and (
      (l.week_no is not null and ev.raw#>>'{week,number}'=l.week_no)
      or (l.week_no is null and l.numeric_round is not null and ev.round=l.numeric_round)
      or (l.week_no is null and l.numeric_round is null and ev.starts_at>=l.starts_at-interval '96 hours' and ev.starts_at<=l.starts_at+interval '6 hours')
    )
  order by ev.starts_at asc,ev.id asc limit 60
),
items as (
  select ev.id,ev.sport_slug,ev.provider,ev.provider_event_id,ev.title,ev.starts_at,ev.ends_at,ev.status,ev.season,ev.round,ev.venue,
         ev.home_score,ev.away_score,ev.image_url,
         c.id competition_id,c.name competition_name,c.logo_url competition_logo,
         h.id home_id,h.name home_name,h.logo_url home_logo,
         a.id away_id,a.name away_name,a.logo_url away_logo,
         (wh.id is not null) is_watched,wh.watched_at sport_watched_at,wh.duration_minutes watched_duration_minutes
  from picked ev
  left join public.sport_entities c on c.id=ev.competition_entity_id
  left join public.sport_entities h on h.id=ev.home_entity_id
  left join public.sport_entities a on a.id=ev.away_entity_id
  left join public.user_sport_watch_history wh on wh.profile_id=auth.uid() and wh.event_id=ev.id
  order by ev.starts_at asc,ev.id asc
)
select jsonb_build_object(
 'competition',coalesce((select to_jsonb(comp) from comp),'{}'::jsonb),
 'round_label',coalesce((select case when latest.week_no is not null then 'Rodada '||latest.week_no when latest.numeric_round is not null then 'Rodada '||latest.numeric_round else 'Última rodada disponível' end from latest),'Última rodada disponível'),
 'events',coalesce((select jsonb_agg(to_jsonb(items) order by items.starts_at asc,items.id asc) from items),'[]'::jsonb),
 'generated_at',now()
);
$$;

revoke all on function public.cinetracker_sport_entity_recent_v520(bigint,integer) from public,anon;
grant execute on function public.cinetracker_sport_entity_recent_v520(bigint,integer) to authenticated;
revoke all on function public.cinetracker_sport_competition_latest_round_v520(bigint) from public,anon;
grant execute on function public.cinetracker_sport_competition_latest_round_v520(bigint) to authenticated;
notify pgrst,'reload schema';
