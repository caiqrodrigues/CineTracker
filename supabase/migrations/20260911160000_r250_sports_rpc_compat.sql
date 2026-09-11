-- CineTracker r250 compatibility layer.
-- Current Web code uses public.cinetracker_sports_payload_v1; this wrapper only protects
-- cached r248/older clients that can still call cinetracker_sports_events_v0997.
create or replace function public.cinetracker_sports_events_v0997(
  p_favorite_only boolean default false,
  p_limit integer default 120,
  p_offset integer default 0,
  p_scope text default 'today'
)
returns table(
  id bigint,
  event_id bigint,
  sport_slug text,
  provider text,
  provider_event_id text,
  title text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  season text,
  round text,
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
  watched_duration_minutes integer
)
language sql
stable
set search_path = public
as $$
  with bounds as (
    select (now() at time zone 'America/Sao_Paulo')::date as today
  ), rows as (
    select
      ev.id,
      ev.id as event_id,
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
      (wh.id is not null) as is_watched,
      wh.watched_at as sport_watched_at,
      wh.duration_minutes as watched_duration_minutes
    from public.sport_events ev
    left join public.sport_entities c on c.id = ev.competition_entity_id
    left join public.sport_entities h on h.id = ev.home_entity_id
    left join public.sport_entities a on a.id = ev.away_entity_id
    left join public.user_sport_watch_history wh
      on wh.event_id = ev.id and wh.profile_id = auth.uid()
  )
  select r.*
  from rows r
  cross join bounds b
  where
    (not coalesce(p_favorite_only,false) or r.has_favorite)
    and case lower(coalesce(p_scope,'today'))
      when 'today' then (r.starts_at at time zone 'America/Sao_Paulo')::date = b.today
      when 'yesterday' then (r.starts_at at time zone 'America/Sao_Paulo')::date = b.today - 1
      when 'recent' then (r.starts_at at time zone 'America/Sao_Paulo')::date >= b.today - 3 and (r.starts_at at time zone 'America/Sao_Paulo')::date < b.today
      when 'month' then (r.starts_at at time zone 'America/Sao_Paulo')::date >= b.today - 31 and (r.starts_at at time zone 'America/Sao_Paulo')::date < b.today + 31
      when 'upcoming' then r.starts_at >= now()
      when 'all' then true
      else (r.starts_at at time zone 'America/Sao_Paulo')::date = b.today
    end
  order by r.starts_at asc
  offset greatest(coalesce(p_offset,0),0)
  limit least(greatest(coalesce(p_limit,120),1),500);
$$;

grant execute on function public.cinetracker_sports_events_v0997(boolean,integer,integer,text) to authenticated;
notify pgrst, 'reload schema';
