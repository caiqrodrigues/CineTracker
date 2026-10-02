-- CineTracker Web r452 — Formula 1 is a real current-season Series and mirrors every Series watch into Sports.
create or replace function public.cinetracker_home_series_v452(p_today date default current_date)
returns jsonb
language sql
stable
set search_path=public
as $$
with params as (
  select extract(year from coalesce(p_today,current_date))::int as season,
         ((coalesce(p_today,current_date)+1)::timestamp at time zone 'America/Sao_Paulo') as released_before
),
base as materialized (
  select x
  from jsonb_array_elements(coalesce(public.cinetracker_home_series_v424(coalesce(p_today,current_date)),'[]'::jsonb)) x
),
f1_stats as materialized (
  select
    p.season,
    count(m.*)::int as total_episodes,
    count(m.*) filter (where m.starts_at<p.released_before)::int as released_episodes,
    count(m.*) filter (
      where m.starts_at<p.released_before
        and (
          exists (
            select 1 from public.episode_progress ep
            where ep.profile_id=auth.uid() and ep.media_id=865
              and ep.season_number=m.season and ep.episode_number=m.episode_number
              and ep.watched=true
          )
          or exists (
            select 1 from public.watch_history wh
            where wh.profile_id=auth.uid() and wh.media_id=865 and wh.item_type='episode'
              and wh.season_number=m.season and wh.episode_number=m.episode_number
          )
        )
    )::int as watched_episodes
  from params p
  left join public.f1_episode_map_v423 m on m.season=p.season
  group by p.season
),
f1_next as materialized (
  select m.season,m.episode_number,m.title,m.starts_at,m.round,m.session_kind
  from public.f1_episode_map_v423 m
  join params p on p.season=m.season
  where m.starts_at<p.released_before
    and not exists (
      select 1 from public.episode_progress ep
      where ep.profile_id=auth.uid() and ep.media_id=865
        and ep.season_number=m.season and ep.episode_number=m.episode_number
        and ep.watched=true
    )
    and not exists (
      select 1 from public.watch_history wh
      where wh.profile_id=auth.uid() and wh.media_id=865 and wh.item_type='episode'
        and wh.season_number=m.season and wh.episode_number=m.episode_number
    )
  order by m.starts_at,m.episode_number
  limit 1
),
f1_started as materialized (
  select (
    exists(select 1 from public.episode_progress ep where ep.profile_id=auth.uid() and ep.media_id=865 and ep.watched=true)
    or exists(select 1 from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id=865 and wh.item_type='episode')
  ) as started
),
patched as (
  select case
    when coalesce(x->>'media_id','')='865' then
      x || jsonb_build_object(
        'current_season',(select season from f1_stats),
        'total_episodes',coalesce((select total_episodes from f1_stats),0),
        'released_episodes',coalesce((select released_episodes from f1_stats),0),
        'watched_episodes',coalesce((select watched_episodes from f1_stats),0),
        'available_episodes',greatest(0,coalesce((select released_episodes-watched_episodes from f1_stats),0)),
        'next_season_number',(select season from f1_next),
        'next_episode_number',(select episode_number from f1_next),
        'next_episode_title',(select title from f1_next),
        'home_bucket',case
          when not coalesce((select started from f1_started),false) then 'not_started'
          when exists(select 1 from f1_next) then 'continue'
          else 'up_to_date'
        end,
        '__ct452_f1_current_season',true
      )
    else x
  end as x
  from base
)
select coalesce(jsonb_agg(x order by
  case x->>'home_bucket'
    when 'continue' then 1 when 'dust' then 2 when 'up_to_date' then 3
    when 'not_started' then 4 when 'completed' then 5 else 9 end,
  (x->>'state_updated_at') desc nulls last,
  case when coalesce(x->>'media_id','') ~ '^[0-9]+$' then (x->>'media_id')::bigint else 0 end desc
),'[]'::jsonb)
from patched;
$$;

revoke all on function public.cinetracker_home_series_v452(date) from public;
grant execute on function public.cinetracker_home_series_v452(date) to authenticated;

create or replace function public.cinetracker_f1_series_to_sports_v452()
returns trigger
language plpgsql
security definer
set search_path=public,pg_temp
as $$
declare
  m public.f1_episode_map_v423%rowtype;
  v_event_id bigint;
begin
  if new.media_id<>865 then return new; end if;

  select * into m
  from public.f1_episode_map_v423
  where season=new.season_number and episode_number=new.episode_number
  limit 1;
  if not found then return new; end if;

  insert into public.sport_events(
    sport_slug,provider,provider_event_id,title,starts_at,ends_at,status,season,round,
    participants,raw,last_synced_at,updated_at
  ) values (
    'formula_1','cinetracker-f1',m.canonical_provider_event_id,m.title,m.starts_at,
    m.starts_at+make_interval(mins=>m.runtime_minutes),
    case when m.starts_at<=now() then 'finished' else 'scheduled' end,
    m.season::text,m.round::text,'[]'::jsonb,
    jsonb_build_object('ct_source','r452-series-trigger','ct_f1_episode_number',m.episode_number,'session_kind',m.session_kind,'media_id',865,'ct_f1_sync','r452'),
    now(),now()
  )
  on conflict(provider,provider_event_id) do update set
    title=excluded.title,starts_at=excluded.starts_at,ends_at=excluded.ends_at,
    status=excluded.status,season=excluded.season,round=excluded.round,
    raw=coalesce(public.sport_events.raw,'{}'::jsonb)||excluded.raw,
    last_synced_at=now(),updated_at=now()
  returning id into v_event_id;

  if coalesce(new.watched,false) then
    insert into public.user_sport_watch_history(
      profile_id,event_id,watched_at,duration_minutes,source,created_at,updated_at
    ) values (
      new.profile_id,v_event_id,coalesce(new.watched_at,now()),m.runtime_minutes,'f1-dual-r452',now(),now()
    )
    on conflict(profile_id,event_id) do update set
      watched_at=excluded.watched_at,
      duration_minutes=excluded.duration_minutes,
      source='f1-dual-r452',
      updated_at=now();
  else
    delete from public.user_sport_watch_history wh
    using public.sport_events ev
    where wh.profile_id=new.profile_id
      and wh.event_id=ev.id
      and ev.sport_slug='formula_1'
      and (
        (ev.provider='cinetracker-f1' and ev.provider_event_id=m.canonical_provider_event_id)
        or coalesce(ev.raw->>'ct_f1_episode_number','')=m.episode_number::text
        or (
          coalesce(ev.season,'')=m.season::text
          and coalesce(ev.round,'')=m.round::text
          and public.cinetracker_f1_kind_v423(ev.title,ev.raw)=m.session_kind
          and abs(extract(epoch from (ev.starts_at-m.starts_at)))<=12*3600
        )
      );
  end if;
  return new;
end
$$;

drop trigger if exists trg_f1_series_to_sports_v452 on public.episode_progress;
create trigger trg_f1_series_to_sports_v452
after insert or update of watched,watched_at on public.episode_progress
for each row
when (new.media_id=865)
execute function public.cinetracker_f1_series_to_sports_v452();

-- Repair all existing F1 series watches against the canonical sports history.
insert into public.sport_events(
  sport_slug,provider,provider_event_id,title,starts_at,ends_at,status,season,round,
  participants,raw,last_synced_at,updated_at
)
select distinct
  'formula_1','cinetracker-f1',m.canonical_provider_event_id,m.title,m.starts_at,
  m.starts_at+make_interval(mins=>m.runtime_minutes),
  case when m.starts_at<=now() then 'finished' else 'scheduled' end,
  m.season::text,m.round::text,'[]'::jsonb,
  jsonb_build_object('ct_source','r452-backfill','ct_f1_episode_number',m.episode_number,'session_kind',m.session_kind,'media_id',865,'ct_f1_sync','r452'),
  now(),now()
from public.episode_progress ep
join public.f1_episode_map_v423 m
  on m.season=ep.season_number and m.episode_number=ep.episode_number
where ep.media_id=865 and ep.watched=true
on conflict(provider,provider_event_id) do update set
  title=excluded.title,starts_at=excluded.starts_at,ends_at=excluded.ends_at,
  status=excluded.status,season=excluded.season,round=excluded.round,
  raw=coalesce(public.sport_events.raw,'{}'::jsonb)||excluded.raw,
  last_synced_at=now(),updated_at=now();

insert into public.user_sport_watch_history(
  profile_id,event_id,watched_at,duration_minutes,source,created_at,updated_at
)
select
  ep.profile_id,se.id,coalesce(ep.watched_at,ep.updated_at,now()),m.runtime_minutes,'f1-dual-r452',now(),now()
from public.episode_progress ep
join public.f1_episode_map_v423 m
  on m.season=ep.season_number and m.episode_number=ep.episode_number
join public.sport_events se
  on se.provider='cinetracker-f1' and se.provider_event_id=m.canonical_provider_event_id
where ep.media_id=865 and ep.watched=true
on conflict(profile_id,event_id) do update set
  watched_at=excluded.watched_at,
  duration_minutes=excluded.duration_minutes,
  source='f1-dual-r452',
  updated_at=now();
