-- CineTracker Web r296 — strict recommendation memory and sports stadium metadata.
-- Production schema uses user_sport_watch_history + sport_events; keep r296 additive and RLS-safe.

alter table public.user_sport_watch_history
  add column if not exists attended_in_person boolean not null default false,
  add column if not exists stadium_name text;

create index if not exists idx_user_sport_watch_history_profile_stadium
  on public.user_sport_watch_history(profile_id, watched_at desc)
  where attended_in_person = true;

create or replace function public.cinetracker_shown_recommendations_recent_v296(p_days integer default 7)
returns table(media_type text, tmdb_id bigint, shown_at timestamptz)
language sql
stable
security invoker
set search_path = public
as $$
  select sr.media_type, sr.tmdb_id, sr.shown_at
  from public.shown_recommendations sr
  where sr.user_id = auth.uid()
    and sr.shown_at >= now() - make_interval(days => greatest(1, least(coalesce(p_days, 7), 30)))
  order by sr.shown_at desc;
$$;

create or replace function public.cinetracker_shown_recommendations_record_v296(p_items jsonb)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  changed_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  with items as (
    select distinct
      case when lower(coalesce(x.media_type, '')) = 'movie' then 'movie' else 'tv' end as media_type,
      x.tmdb_id
    from jsonb_to_recordset(coalesce(p_items, '[]'::jsonb))
      as x(media_type text, tmdb_id bigint, slot text)
    where x.tmdb_id is not null and x.tmdb_id > 0
  ), changed as (
    insert into public.shown_recommendations(user_id, media_type, tmdb_id, shown_at)
    select auth.uid(), i.media_type, i.tmdb_id, now()
    from items i
    on conflict (user_id, media_type, tmdb_id)
    do update set shown_at = excluded.shown_at
    where public.shown_recommendations.shown_at < now() - interval '7 days'
    returning 1
  )
  select count(*) into changed_count from changed;

  return changed_count;
end;
$$;

create or replace function public.cinetracker_sports_watch_history_v296()
returns table(
  history_id bigint,
  id bigint,
  sport_slug text,
  provider text,
  provider_event_id text,
  title text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  season text,
  "round" text,
  venue text,
  home_score text,
  away_score text,
  image_url text,
  participants jsonb,
  competition_id bigint,
  competition_name text,
  competition_logo text,
  home_id bigint,
  home_name text,
  home_logo text,
  away_id bigint,
  away_name text,
  away_logo text,
  has_favorite boolean,
  is_watched boolean,
  sport_watched_at timestamptz,
  watched_duration_minutes integer,
  attended_in_person boolean,
  stadium_name text
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    wh.id as history_id,
    ev.id,
    ev.sport_slug,
    ev.provider,
    ev.provider_event_id,
    ev.title,
    ev.starts_at,
    ev.ends_at,
    ev.status,
    ev.season,
    ev.round,
    ev.venue,
    ev.home_score,
    ev.away_score,
    ev.image_url,
    ev.participants,
    c.id as competition_id,
    c.name as competition_name,
    c.logo_url as competition_logo,
    h.id as home_id,
    h.name as home_name,
    h.logo_url as home_logo,
    a.id as away_id,
    a.name as away_name,
    a.logo_url as away_logo,
    exists(
      select 1
      from public.user_sport_favorites f
      where f.profile_id = auth.uid()
        and f.entity_id = any(array[ev.competition_entity_id, ev.home_entity_id, ev.away_entity_id])
    ) as has_favorite,
    true as is_watched,
    wh.watched_at as sport_watched_at,
    wh.duration_minutes as watched_duration_minutes,
    wh.attended_in_person,
    wh.stadium_name
  from public.user_sport_watch_history wh
  join public.sport_events ev on ev.id = wh.event_id
  left join public.sport_entities c on c.id = ev.competition_entity_id
  left join public.sport_entities h on h.id = ev.home_entity_id
  left join public.sport_entities a on a.id = ev.away_entity_id
  where wh.profile_id = auth.uid()
  order by wh.watched_at desc
  limit 100;
$$;

create or replace function public.cinetracker_sports_watch_set_v296(
  p_provider text,
  p_provider_event_id text,
  p_sport_slug text default null,
  p_competition_name text default null,
  p_title text default null,
  p_starts_at timestamptz default null,
  p_attended_in_person boolean default false,
  p_stadium_name text default null,
  p_watched boolean default true,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_event_id bigint;
  v_result jsonb;
  v_in_person boolean := coalesce(p_attended_in_person, false);
  v_stadium text := nullif(trim(coalesce(p_stadium_name, '')), '');
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  if nullif(trim(coalesce(p_provider_event_id, '')), '') is null then
    raise exception 'SPORT_EVENT_ID_REQUIRED';
  end if;

  select ev.id into v_event_id
  from public.sport_events ev
  where ev.provider = coalesce(nullif(trim(coalesce(p_provider, '')), ''), 'unknown')
    and ev.provider_event_id = p_provider_event_id
  order by ev.id desc
  limit 1;

  if v_event_id is null then
    raise exception 'SPORT_EVENT_NOT_FOUND';
  end if;

  v_result := public.cinetracker_sport_mark_watched_v1(
    v_event_id,
    coalesce(p_watched, true),
    null,
    now()
  );

  if coalesce(p_watched, true) then
    update public.user_sport_watch_history wh
    set attended_in_person = v_in_person,
        stadium_name = case when v_in_person then v_stadium else null end,
        updated_at = now()
    where wh.profile_id = auth.uid()
      and wh.event_id = v_event_id;
  end if;

  return coalesce(v_result, '{}'::jsonb) || jsonb_build_object(
    'attended_in_person', case when coalesce(p_watched, true) then v_in_person else false end,
    'stadium_name', case when coalesce(p_watched, true) and v_in_person then v_stadium else null end
  );
end;
$$;

create or replace function public.cinetracker_sports_stadium_summary_v296()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'stadium_events', count(*) filter (where wh.attended_in_person),
    'watched_events', count(*)
  )
  from public.user_sport_watch_history wh
  where wh.profile_id = auth.uid();
$$;

revoke execute on function public.cinetracker_shown_recommendations_recent_v296(integer) from public;
revoke execute on function public.cinetracker_shown_recommendations_record_v296(jsonb) from public;
revoke execute on function public.cinetracker_sports_watch_history_v296() from public;
revoke execute on function public.cinetracker_sports_watch_set_v296(text,text,text,text,text,timestamptz,boolean,text,boolean,jsonb) from public;
revoke execute on function public.cinetracker_sports_stadium_summary_v296() from public;

grant execute on function public.cinetracker_shown_recommendations_recent_v296(integer) to authenticated;
grant execute on function public.cinetracker_shown_recommendations_record_v296(jsonb) to authenticated;
grant execute on function public.cinetracker_sports_watch_history_v296() to authenticated;
grant execute on function public.cinetracker_sports_watch_set_v296(text,text,text,text,text,timestamptz,boolean,text,boolean,jsonb) to authenticated;
grant execute on function public.cinetracker_sports_stadium_summary_v296() to authenticated;
