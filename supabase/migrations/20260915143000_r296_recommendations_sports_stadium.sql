-- CineTracker Web r296 — strict recommendation memory and sports stadium metadata.
alter table if exists public.sports_watch_history
  add column if not exists attended_in_person boolean not null default false,
  add column if not exists stadium_name text;

create index if not exists idx_sports_watch_history_user_stadium
  on public.sports_watch_history(user_id, watched_at desc)
  where attended_in_person = true;

create or replace function public.cinetracker_shown_recommendations_recent_v296(p_days integer default 7)
returns table(media_type text, tmdb_id bigint, slot text, shown_at timestamptz)
language sql
stable
security invoker
set search_path = public
as $$
  select sr.media_type, sr.tmdb_id, sr.slot, sr.shown_at
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
  inserted_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  with items as (
    select
      case when lower(coalesce(x.media_type, '')) = 'movie' then 'movie' else 'tv' end as media_type,
      x.tmdb_id,
      nullif(x.slot, '') as slot
    from jsonb_to_recordset(coalesce(p_items, '[]'::jsonb))
      as x(media_type text, tmdb_id bigint, slot text)
    where x.tmdb_id is not null and x.tmdb_id > 0
  ), ins as (
    insert into public.shown_recommendations(user_id, media_type, tmdb_id, slot, shown_at)
    select auth.uid(), i.media_type, i.tmdb_id, i.slot, now()
    from items i
    where not exists (
      select 1
      from public.shown_recommendations sr
      where sr.user_id = auth.uid()
        and sr.media_type = i.media_type
        and sr.tmdb_id = i.tmdb_id
        and sr.shown_at >= now() - interval '7 days'
    )
    returning 1
  )
  select count(*) into inserted_count from ins;

  return inserted_count;
end;
$$;

create or replace function public.cinetracker_sports_watch_history_v296()
returns setof public.sports_watch_history
language sql
stable
security invoker
set search_path = public
as $$
  select *
  from public.sports_watch_history
  where user_id = auth.uid()
  order by watched_at desc;
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
  out_row public.sports_watch_history;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  if nullif(trim(coalesce(p_provider_event_id, '')), '') is null then
    raise exception 'provider event id required';
  end if;

  if not coalesce(p_watched, true) then
    delete from public.sports_watch_history
    where user_id = auth.uid()
      and provider = coalesce(nullif(trim(p_provider), ''), 'unknown')
      and provider_event_id = p_provider_event_id;
    return jsonb_build_object('watched', false, 'provider_event_id', p_provider_event_id);
  end if;

  insert into public.sports_watch_history(
    user_id, provider, provider_event_id, sport_slug, competition_name, title,
    starts_at, watched_at, metadata, attended_in_person, stadium_name
  )
  values(
    auth.uid(), coalesce(nullif(trim(p_provider), ''), 'unknown'), p_provider_event_id,
    p_sport_slug, p_competition_name, p_title, p_starts_at, now(), coalesce(p_metadata, '{}'::jsonb),
    coalesce(p_attended_in_person, false),
    case when coalesce(p_attended_in_person, false) then nullif(trim(coalesce(p_stadium_name, '')), '') else null end
  )
  on conflict (user_id, provider, provider_event_id)
  do update set
    sport_slug = excluded.sport_slug,
    competition_name = excluded.competition_name,
    title = excluded.title,
    starts_at = excluded.starts_at,
    watched_at = excluded.watched_at,
    metadata = coalesce(public.sports_watch_history.metadata, '{}'::jsonb) || excluded.metadata,
    attended_in_person = excluded.attended_in_person,
    stadium_name = excluded.stadium_name
  returning * into out_row;

  return to_jsonb(out_row);
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
    'stadium_events', count(*) filter (where attended_in_person),
    'watched_events', count(*)
  )
  from public.sports_watch_history
  where user_id = auth.uid();
$$;

grant execute on function public.cinetracker_shown_recommendations_recent_v296(integer) to authenticated;
grant execute on function public.cinetracker_shown_recommendations_record_v296(jsonb) to authenticated;
grant execute on function public.cinetracker_sports_watch_history_v296() to authenticated;
grant execute on function public.cinetracker_sports_watch_set_v296(text,text,text,text,text,timestamptz,boolean,text,boolean,jsonb) to authenticated;
grant execute on function public.cinetracker_sports_stadium_summary_v296() to authenticated;
