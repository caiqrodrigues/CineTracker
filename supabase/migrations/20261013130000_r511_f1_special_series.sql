create or replace function public.cinetracker_f1_series_v511(
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
         (coalesce(p_today,current_date)-greatest(7,least(coalesce(p_recent_days,21),60)))::date recent_from
),
logo as (
  select logo_url from public.sport_entities
  where sport_slug='formula_1' and entity_type='competition' and lower(trim(name)) in ('formula 1','formula one','f1')
  order by case when lower(trim(name))='formula 1' then 0 else 1 end,id limit 1
),
watched as materialized (
  select ep.season_number::int season,ep.episode_number::int episode_number from public.episode_progress ep
  where ep.profile_id=auth.uid() and ep.media_id=865 and ep.watched=true
  union
  select wh.season_number::int,wh.episode_number::int from public.watch_history wh
  where wh.profile_id=auth.uid() and wh.media_id=865 and wh.item_type='episode' and wh.season_number is not null and wh.episode_number is not null
  union
  select m.season,m.episode_number from public.user_f1_session_watch fw
  join public.f1_episode_map_v423 m on m.canonical_provider_event_id=fw.provider_event_id
  where fw.profile_id=auth.uid()
),
season_rows as materialized (
  select m.season,m.episode_number,m.round,m.session_kind,m.title,m.starts_at,m.runtime_minutes,m.canonical_provider_event_id,
         (m.starts_at<=now()) released,(w.episode_number is not null) is_watched,ev.event_id
  from public.f1_episode_map_v423 m
  left join watched w on w.season=m.season and w.episode_number=m.episode_number
  left join lateral (
    select e.id event_id from public.sport_events e
    where e.sport_slug='formula_1' and (
      (e.provider='cinetracker-f1' and e.provider_event_id=m.canonical_provider_event_id)
      or (coalesce(e.season,'')=m.season::text and coalesce(e.raw->>'ct_f1_episode_number','')=m.episode_number::text)
    )
    order by (e.provider='cinetracker-f1' and e.provider_event_id=m.canonical_provider_event_id) desc,e.id desc limit 1
  ) ev on true
  where m.season=(select season from cfg)
),
stats as (
  select count(*)::int total_episodes,count(*) filter(where released)::int released_episodes,
         count(*) filter(where released and is_watched)::int watched_episodes,
         count(*) filter(where released and not is_watched and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg))::int available_episodes
  from season_rows
),
next_recent as (
  select * from season_rows where released and not is_watched
    and (starts_at at time zone 'America/Sao_Paulo')::date >= (select recent_from from cfg)
  order by starts_at,episode_number limit 1
),
next_upcoming as (
  select * from season_rows where not released order by starts_at,episode_number limit 1
)
select jsonb_build_object(
  'series',jsonb_strip_nulls(jsonb_build_object(
    'series_key','formula_1','media_id',865,'media_type','tv','media_kind','series','title','Fórmula 1',
    'season',(select season from cfg),'poster_url',coalesce((select logo_url from logo),''),
    'total_episodes',coalesce((select total_episodes from stats),0),'released_episodes',coalesce((select released_episodes from stats),0),
    'watched_episodes',coalesce((select watched_episodes from stats),0),'available_episodes',coalesce((select available_episodes from stats),0),
    'home_bucket',case when coalesce((select available_episodes from stats),0)>0 then 'continue' else 'up_to_date' end,
    'next_episode_number',(select episode_number from next_recent),'next_episode_title',(select title from next_recent),'next_episode_air_date',(select starts_at from next_recent),
    'upcoming_episode_number',(select episode_number from next_upcoming),'upcoming_episode_title',(select title from next_upcoming),'upcoming_episode_air_date',(select starts_at from next_upcoming)
  )),
  'events',coalesce((select jsonb_agg(jsonb_build_object(
    'event_id',event_id,'provider_event_id',canonical_provider_event_id,'title',title,'season',season,'episode_number',episode_number,
    'round',round,'session_kind',session_kind,'starts_at',starts_at,'runtime_minutes',runtime_minutes,'released',released,'is_watched',is_watched
  ) order by starts_at desc,episode_number desc) from season_rows),'[]'::jsonb),
  'generated_at',now(),'source','f1-v511-series'
);
$$;
revoke all on function public.cinetracker_f1_series_v511(date,integer) from public,anon;
grant execute on function public.cinetracker_f1_series_v511(date,integer) to authenticated;
notify pgrst,'reload schema';
