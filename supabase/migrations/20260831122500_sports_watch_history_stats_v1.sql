-- CineTracker Sports watched history + time statistics.
-- Sports stays independent from movie/tv consumption, but contributes to the general total only when explicitly marked watched.

create table if not exists public.user_sport_watch_history (
  id bigint generated always as identity primary key,
  profile_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  event_id bigint not null references public.sport_events(id) on delete cascade,
  watched_at timestamptz not null default now(),
  duration_minutes integer not null check (duration_minutes between 1 and 1440),
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(profile_id,event_id)
);

alter table public.user_sport_watch_history enable row level security;
alter table public.user_sport_watch_history replica identity full;

create index if not exists idx_user_sport_watch_history_profile_watched
  on public.user_sport_watch_history(profile_id,watched_at desc);
create index if not exists idx_user_sport_watch_history_event
  on public.user_sport_watch_history(event_id);

drop policy if exists user_sport_watch_history_select on public.user_sport_watch_history;
create policy user_sport_watch_history_select on public.user_sport_watch_history
  for select to authenticated using ((select auth.uid())=profile_id);
drop policy if exists user_sport_watch_history_insert on public.user_sport_watch_history;
create policy user_sport_watch_history_insert on public.user_sport_watch_history
  for insert to authenticated with check ((select auth.uid())=profile_id);
drop policy if exists user_sport_watch_history_update on public.user_sport_watch_history;
create policy user_sport_watch_history_update on public.user_sport_watch_history
  for update to authenticated using ((select auth.uid())=profile_id)
  with check ((select auth.uid())=profile_id);
drop policy if exists user_sport_watch_history_delete on public.user_sport_watch_history;
create policy user_sport_watch_history_delete on public.user_sport_watch_history
  for delete to authenticated using ((select auth.uid())=profile_id);

grant select,insert,update,delete on table public.user_sport_watch_history to authenticated;
grant usage,select on sequence public.user_sport_watch_history_id_seq to authenticated;

create or replace function public.cinetracker_sport_default_duration_v1(p_sport_slug text)
returns integer
language sql
immutable
security invoker
set search_path=public
as $$
  select case coalesce(p_sport_slug,'')
    when 'soccer' then 120
    when 'formula_1' then 120
    when 'mma' then 180
    when 'basketball' then 150
    when 'american_football' then 210
    when 'ice_hockey' then 150
    when 'baseball' then 180
    when 'tennis' then 120
    when 'volleyball' then 120
    when 'handball' then 90
    when 'rugby' then 120
    when 'motogp' then 120
    else 120
  end;
$$;
grant execute on function public.cinetracker_sport_default_duration_v1(text) to authenticated;

create or replace function public.cinetracker_sport_stats_v1()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with h as (
  select wh.event_id,wh.watched_at,wh.duration_minutes,ev.sport_slug
  from public.user_sport_watch_history wh
  join public.sport_events ev on ev.id=wh.event_id
  where wh.profile_id=auth.uid()
), by_sport as (
  select h.sport_slug,count(*)::bigint as watched_events,coalesce(sum(h.duration_minutes),0)::bigint as minutes
  from h group by h.sport_slug
)
select jsonb_build_object(
  'watched_events',coalesce((select count(*) from h),0),
  'sports_minutes',coalesce((select sum(duration_minutes) from h),0),
  'by_sport',coalesce((select jsonb_agg(jsonb_build_object(
    'sport_slug',b.sport_slug,
    'watched_events',b.watched_events,
    'minutes',b.minutes
  ) order by b.minutes desc,b.sport_slug) from by_sport b),'[]'::jsonb)
);
$$;
grant execute on function public.cinetracker_sport_stats_v1() to authenticated;

create or replace function public.cinetracker_sport_mark_watched_v1(
  p_event_id bigint,
  p_watched boolean default true,
  p_duration_minutes integer default null,
  p_watched_at timestamptz default now()
)
returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
declare
  v_profile uuid:=auth.uid();
  v_event public.sport_events%rowtype;
  v_duration integer;
begin
  if v_profile is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_event from public.sport_events where id=p_event_id;
  if not found then raise exception 'SPORT_EVENT_NOT_FOUND'; end if;

  if not coalesce(p_watched,true) then
    delete from public.user_sport_watch_history where profile_id=v_profile and event_id=p_event_id;
    update public.profiles set updated_at=now() where id=v_profile;
    return jsonb_build_object(
      'event_id',p_event_id,
      'is_watched',false,
      'duration_minutes',0,
      'sports_stats',public.cinetracker_sport_stats_v1()
    );
  end if;

  v_duration:=case
    when coalesce(p_duration_minutes,0)>0 then least(1440,greatest(1,p_duration_minutes))
    when v_event.ends_at is not null and v_event.ends_at>v_event.starts_at
      and extract(epoch from (v_event.ends_at-v_event.starts_at))/60 between 1 and 1440
      then round(extract(epoch from (v_event.ends_at-v_event.starts_at))/60)::integer
    else public.cinetracker_sport_default_duration_v1(v_event.sport_slug)
  end;

  insert into public.user_sport_watch_history(profile_id,event_id,watched_at,duration_minutes,source,updated_at)
  values(v_profile,p_event_id,coalesce(p_watched_at,now()),v_duration,'manual',now())
  on conflict(profile_id,event_id) do update
    set watched_at=excluded.watched_at,
        duration_minutes=excluded.duration_minutes,
        source='manual',
        updated_at=now();

  update public.profiles set updated_at=now() where id=v_profile;
  return jsonb_build_object(
    'event_id',p_event_id,
    'is_watched',true,
    'duration_minutes',v_duration,
    'watched_at',coalesce(p_watched_at,now()),
    'sports_stats',public.cinetracker_sport_stats_v1()
  );
end;
$$;
grant execute on function public.cinetracker_sport_mark_watched_v1(bigint,boolean,integer,timestamptz) to authenticated;

create or replace function public.cinetracker_sports_payload_v1(
  p_from timestamptz default date_trunc('day',now()),
  p_to timestamptz default date_trunc('day',now())+interval '8 days'
) returns jsonb
language plpgsql stable security invoker set search_path=public
as $$
declare v_result jsonb;
begin
  select jsonb_build_object(
    'sports',coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order) from (
      select slug,name_pt as name,provider_sport_name,icon,sort_order,metadata
      from public.sports_catalog where enabled
    )x),'[]'::jsonb),
    'favorites',coalesce((select jsonb_agg(to_jsonb(x) order by x.name) from (
      select f.id as favorite_id,e.id as entity_id,e.sport_slug,e.entity_type,e.name,e.short_name,e.country,e.logo_url,e.image_url,e.metadata,f.notifications_enabled
      from public.user_sport_favorites f join public.sport_entities e on e.id=f.entity_id
      where f.profile_id=auth.uid()
    )x),'[]'::jsonb),
    'events',coalesce((select jsonb_agg(to_jsonb(x) order by x.starts_at) from (
      select ev.id,ev.sport_slug,ev.provider,ev.provider_event_id,ev.title,ev.starts_at,ev.ends_at,ev.status,ev.season,ev.round,ev.venue,ev.home_score,ev.away_score,ev.image_url,ev.participants,
        c.id as competition_id,c.name as competition_name,c.logo_url as competition_logo,
        h.id as home_id,h.name as home_name,h.logo_url as home_logo,
        a.id as away_id,a.name as away_name,a.logo_url as away_logo,
        exists(select 1 from public.user_sport_favorites f where f.profile_id=auth.uid() and f.entity_id=any(array[ev.competition_entity_id,ev.home_entity_id,ev.away_entity_id])) as has_favorite,
        (wh.id is not null) as is_watched,
        wh.watched_at as sport_watched_at,
        wh.duration_minutes as watched_duration_minutes
      from public.sport_events ev
      left join public.sport_entities c on c.id=ev.competition_entity_id
      left join public.sport_entities h on h.id=ev.home_entity_id
      left join public.sport_entities a on a.id=ev.away_entity_id
      left join public.user_sport_watch_history wh on wh.event_id=ev.id and wh.profile_id=auth.uid()
      where ev.starts_at>=p_from and ev.starts_at<p_to
    )x),'[]'::jsonb),
    'watch_history',coalesce((select jsonb_agg(to_jsonb(x) order by x.sport_watched_at desc) from (
      select wh.id as history_id,ev.id,ev.sport_slug,ev.provider,ev.provider_event_id,ev.title,ev.starts_at,ev.ends_at,ev.status,ev.season,ev.round,ev.venue,ev.home_score,ev.away_score,ev.image_url,ev.participants,
        c.id as competition_id,c.name as competition_name,c.logo_url as competition_logo,
        h.id as home_id,h.name as home_name,h.logo_url as home_logo,
        a.id as away_id,a.name as away_name,a.logo_url as away_logo,
        exists(select 1 from public.user_sport_favorites f where f.profile_id=auth.uid() and f.entity_id=any(array[ev.competition_entity_id,ev.home_entity_id,ev.away_entity_id])) as has_favorite,
        true as is_watched,
        wh.watched_at as sport_watched_at,
        wh.duration_minutes as watched_duration_minutes
      from public.user_sport_watch_history wh
      join public.sport_events ev on ev.id=wh.event_id
      left join public.sport_entities c on c.id=ev.competition_entity_id
      left join public.sport_entities h on h.id=ev.home_entity_id
      left join public.sport_entities a on a.id=ev.away_entity_id
      where wh.profile_id=auth.uid()
      order by wh.watched_at desc
      limit 100
    )x),'[]'::jsonb),
    'stats',public.cinetracker_sport_stats_v1(),
    'preferences',coalesce((select to_jsonb(p) from public.user_sport_preferences p where p.profile_id=auth.uid()),jsonb_build_object(
      'favorite_sports',to_jsonb(array['soccer','formula_1','mma','basketball','american_football','ice_hockey']::text[]),
      'timezone','America/Sao_Paulo','live_notifications',true,'pre_event_minutes',30
    )),
    'generated_at',now()
  ) into v_result;
  return v_result;
end;
$$;
grant execute on function public.cinetracker_sports_payload_v1(timestamptz,timestamptz) to authenticated;

do $$ begin
  if not exists(
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='user_sport_watch_history'
  ) then
    alter publication supabase_realtime add table public.user_sport_watch_history;
  end if;
end $$;
