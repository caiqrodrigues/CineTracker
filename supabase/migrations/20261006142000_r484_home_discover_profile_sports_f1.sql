-- CineTracker Web r484 — trusted F1 series map and junior-sports exclusion.

create or replace function public.cinetracker_f1_session_valid_v484(
  p_season integer,
  p_round integer,
  p_session_kind text,
  p_starts_at timestamptz
) returns boolean
language sql
stable
security invoker
set search_path=public
as $$
  select
    p_starts_at < now() - interval '14 days'
    or exists (
      select 1
      from public.sport_events e
      where e.sport_slug='formula_1'
        and coalesce(e.provider,'') <> 'cinetracker-f1'
        and coalesce(nullif(e.season,''),extract(year from e.starts_at)::integer::text)=p_season::text
        and abs(extract(epoch from (e.starts_at-p_starts_at))) <= 18*3600
        and (
          public.cinetracker_f1_kind_v423(e.title,e.raw)=p_session_kind
          or (
            coalesce(nullif(e.round,''),'')=p_round::text
            and abs(extract(epoch from (e.starts_at-p_starts_at))) <= 6*3600
          )
        )
    );
$$;

create or replace function public.cinetracker_f1_map_v484(
  p_season integer default extract(year from current_date)::integer
) returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'season',m.season,
        'episode_number',m.episode_number,
        'round',m.round,
        'session_kind',m.session_kind,
        'title',m.title,
        'starts_at',m.starts_at,
        'runtime_minutes',m.runtime_minutes,
        'canonical_provider_event_id',m.canonical_provider_event_id,
        '__ct484_trusted',true
      )
      order by m.episode_number
    ),
    '[]'::jsonb
  )
  from public.f1_episode_map_v423 m
  where m.season=coalesce(p_season,extract(year from current_date)::integer)
    and public.cinetracker_f1_session_valid_v484(m.season,m.round,m.session_kind,m.starts_at);
$$;

create or replace function public.cinetracker_f1_progress_v484(
  p_season integer default extract(year from current_date)::integer
) returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select coalesce(p_season,extract(year from current_date)::integer) as season
), valid as materialized (
  select m.*
  from public.f1_episode_map_v423 m,cfg
  where m.season=cfg.season
    and public.cinetracker_f1_session_valid_v484(m.season,m.round,m.session_kind,m.starts_at)
), released as materialized (
  select * from valid where starts_at<=now()
), watched as materialized (
  select r.*
  from released r
  where exists (
    select 1 from public.episode_progress ep
    where ep.profile_id=auth.uid() and ep.media_id=865
      and ep.season_number=r.season and ep.episode_number=r.episode_number
      and ep.watched=true
  )
  or exists (
    select 1 from public.watch_history wh
    where wh.profile_id=auth.uid() and wh.media_id=865 and wh.item_type='episode'
      and wh.season_number=r.season and wh.episode_number=r.episode_number
  )
)
select jsonb_build_object(
  'season',(select season from cfg),
  'total_mapped',(select count(*) from valid),
  'released_episodes',(select count(*) from released),
  'watched_released_episodes',(select count(*) from watched),
  'remaining_episodes',greatest(0,(select count(*) from released)-(select count(*) from watched)),
  'source','v484-trusted-provider-map'
);
$$;

create or replace function public.cinetracker_home_series_v484(p_today date default current_date)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with params as (
  select extract(year from coalesce(p_today,current_date))::int as season,
         ((coalesce(p_today,current_date)+1)::timestamp at time zone 'America/Sao_Paulo') as released_before
),
base as materialized (
  select x from jsonb_array_elements(coalesce(public.cinetracker_home_series_v424(coalesce(p_today,current_date)),'[]'::jsonb)) x
),
valid_map as materialized (
  select m.*
  from public.f1_episode_map_v423 m
  join params p on p.season=m.season
  where public.cinetracker_f1_session_valid_v484(m.season,m.round,m.session_kind,m.starts_at)
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
  left join valid_map m on m.season=p.season
  group by p.season
),
f1_next as materialized (
  select m.season,m.episode_number,m.title,m.starts_at,m.round,m.session_kind
  from valid_map m
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
        '__ct484_f1_trusted_map',true
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

create or replace function public.cinetracker_is_youth_sport_v484(
  p_title text,
  p_competition text,
  p_home text,
  p_away text
)
returns boolean
language sql
immutable
security invoker
set search_path=public
as $$
with x as (
  select
    translate(lower(concat_ws(' ',coalesce(p_title,''),coalesce(p_competition,''),coalesce(p_home,''),coalesce(p_away,''))),
      'áàâãäéèêëíìîïóòôõöúùûüçñ','aaaaaeeeeiiiiooooouuuucn') as all_text,
    translate(lower(coalesce(p_title,'')),
      'áàâãäéèêëíìîïóòôõöúùûüçñ','aaaaaeeeeiiiiooooouuuucn') as title_text,
    translate(lower(coalesce(p_competition,'')),
      'áàâãäéèêëíìîïóòôõöúùûüçñ','aaaaaeeeeiiiiooooouuuucn') as competition_text
)
select
  all_text ~ '(^|[^a-z0-9])(u|sub|under)[ -]?(1[4-9]|2[0-3])([^a-z0-9]|$)'
  or competition_text ~ '(^|[^a-z0-9])(junior|juniors|juniores)([^a-z0-9]|$)'
  or (
    title_text ~ '(^|[^a-z0-9])(junior|juniors|juniores)([^a-z0-9]|$)'
    and title_text ~ '(^|[^a-z0-9])(league|liga|championship|campeonato|cup|copa|tournament|torneio|category|categoria|youth|base)([^a-z0-9]|$)'
  )
from x;
$$;

create or replace function public.cinetracker_sports_payload_v484(
  p_from timestamptz default date_trunc('day',now()),
  p_to timestamptz default date_trunc('day',now())+interval '8 days'
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with b as (
  select public.cinetracker_sports_payload_v1(p_from,p_to) as payload
), ev as (
  select e.item,e.ord
  from b
  cross join lateral jsonb_array_elements(coalesce(b.payload->'events','[]'::jsonb)) with ordinality e(item,ord)
  where not public.cinetracker_is_youth_sport_v484(
    e.item->>'title',e.item->>'competition_name',e.item->>'home_name',e.item->>'away_name'
  )
), wh as (
  select e.item,e.ord
  from b
  cross join lateral jsonb_array_elements(coalesce(b.payload->'watch_history','[]'::jsonb)) with ordinality e(item,ord)
  where not public.cinetracker_is_youth_sport_v484(
    e.item->>'title',e.item->>'competition_name',e.item->>'home_name',e.item->>'away_name'
  )
)
select
  (payload - 'events' - 'watch_history')
  || jsonb_build_object(
    'events',coalesce((select jsonb_agg(item order by ord) from ev),'[]'::jsonb),
    'watch_history',coalesce((select jsonb_agg(item order by ord) from wh),'[]'::jsonb),
    'source','v484-no-junior'
  )
from b;
$$;

create or replace function public.cinetracker_sports_events_v484(
  p_favorite_only boolean default false,
  p_limit integer default 120,
  p_offset integer default 0,
  p_scope text default 'today'
)
returns table(
  id bigint,event_id bigint,sport_slug text,provider text,provider_event_id text,title text,
  starts_at timestamptz,ends_at timestamptz,status text,season text,round text,venue text,
  home_score text,away_score text,image_url text,participants jsonb,
  competition_id bigint,competition_name text,competition_logo text,
  home_id bigint,home_name text,home_logo text,away_id bigint,away_name text,away_logo text,
  has_favorite boolean,is_watched boolean,sport_watched_at timestamptz,watched_duration_minutes integer
)
language sql
stable
security invoker
set search_path=public
as $$
  select e.*
  from public.cinetracker_sports_events_v0997(p_favorite_only,p_limit,p_offset,p_scope) e
  where not public.cinetracker_is_youth_sport_v484(e.title,e.competition_name,e.home_name,e.away_name);
$$;

create or replace function public.cinetracker_sport_favorite_events_v484(
  p_entity_id bigint,
  p_from date default current_date-30,
  p_to date default current_date+14
)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with b as (
  select public.cinetracker_sport_favorite_events_v2(p_entity_id,p_from,p_to) as payload
), ev as (
  select e.item,e.ord
  from b
  cross join lateral jsonb_array_elements(coalesce(b.payload->'events','[]'::jsonb)) with ordinality e(item,ord)
  where not public.cinetracker_is_youth_sport_v484(
    e.item->>'title',e.item->>'competition_name',e.item->>'home_name',e.item->>'away_name'
  )
)
select (payload-'events')
  || jsonb_build_object(
    'events',coalesce((select jsonb_agg(item order by ord) from ev),'[]'::jsonb),
    'source','v484-no-junior'
  )
from b;
$$;

revoke all on function public.cinetracker_f1_session_valid_v484(integer,integer,text,timestamptz) from public,anon;
grant execute on function public.cinetracker_f1_session_valid_v484(integer,integer,text,timestamptz) to authenticated;
revoke all on function public.cinetracker_f1_map_v484(integer) from public,anon;
grant execute on function public.cinetracker_f1_map_v484(integer) to authenticated;
revoke all on function public.cinetracker_f1_progress_v484(integer) from public,anon;
grant execute on function public.cinetracker_f1_progress_v484(integer) to authenticated;
revoke all on function public.cinetracker_home_series_v484(date) from public,anon;
grant execute on function public.cinetracker_home_series_v484(date) to authenticated;
revoke all on function public.cinetracker_is_youth_sport_v484(text,text,text,text) from public,anon;
grant execute on function public.cinetracker_is_youth_sport_v484(text,text,text,text) to authenticated;
revoke all on function public.cinetracker_sports_payload_v484(timestamptz,timestamptz) from public,anon;
grant execute on function public.cinetracker_sports_payload_v484(timestamptz,timestamptz) to authenticated;
revoke all on function public.cinetracker_sports_events_v484(boolean,integer,integer,text) from public,anon;
grant execute on function public.cinetracker_sports_events_v484(boolean,integer,integer,text) to authenticated;
revoke all on function public.cinetracker_sport_favorite_events_v484(bigint,date,date) from public,anon;
grant execute on function public.cinetracker_sport_favorite_events_v484(bigint,date,date) to authenticated;

notify pgrst,'reload schema';
