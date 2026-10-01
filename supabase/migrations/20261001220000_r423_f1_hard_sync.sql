-- CineTracker Web r423: authoritative Formula 1 episode <-> sports synchronization.
create table if not exists public.f1_episode_map_v423 (
  season integer not null check (season between 1950 and 2200),
  episode_number integer not null check (episode_number between 1 and 500),
  round integer not null check (round between 1 and 99),
  session_kind text not null check (session_kind in ('fp1','fp2','fp3','sprint_qualifying','sprint','qualifying','race')),
  title text not null,
  starts_at timestamptz not null,
  runtime_minutes integer not null default 60 check (runtime_minutes between 1 and 360),
  canonical_provider_event_id text not null,
  updated_at timestamptz not null default now(),
  primary key (season, episode_number)
);

create index if not exists f1_episode_map_v423_round_kind_idx
  on public.f1_episode_map_v423(season, round, session_kind, starts_at);

alter table public.f1_episode_map_v423 enable row level security;
drop policy if exists f1_episode_map_v423_read on public.f1_episode_map_v423;
create policy f1_episode_map_v423_read
  on public.f1_episode_map_v423 for select
  to authenticated
  using (true);
grant select on public.f1_episode_map_v423 to authenticated;
revoke insert, update, delete on public.f1_episode_map_v423 from anon, authenticated;

CREATE OR REPLACE FUNCTION public.cinetracker_f1_kind_v423(p_title text, p_raw jsonb DEFAULT '{}'::jsonb)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
with src as (
  select
    lower(coalesce(p_raw->>'session_kind','')) as raw_kind,
    lower(translate(coalesce(p_title,''),'ÁÀÂÃÉÊÍÓÔÕÚÇáàâãéêíóôõúç','AAAAEEIOOOUCaaaaeeiooouc')) as t
)
select case
  when raw_kind in ('fp1','fp2','fp3','sprint_qualifying','sprint','qualifying','race') then raw_kind
  when t ~ '(practice|treino livre)[[:space:]]*1' then 'fp1'
  when t ~ '(practice|treino livre)[[:space:]]*2' then 'fp2'
  when t ~ '(practice|treino livre)[[:space:]]*3' then 'fp3'
  when t ~ '(sprint[[:space:]]*(qualifying|shootout)|qualifying[[:space:]]*sprint|classificacao[[:space:]]*sprint)' then 'sprint_qualifying'
  when t ~ '(^|[^[:alnum:]])sprint([^[:alnum:]]|$)' then 'sprint'
  when t ~ '(qualifying|classificacao)' then 'qualifying'
  when t ~ '(grand[[:space:]]+prix|corrida|race)' then 'race'
  else null
end
from src
$function$;

CREATE OR REPLACE FUNCTION public.cinetracker_f1_map_replace_v423(p_rows jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_uid uuid := auth.uid();
  v_season integer;
  v_min_season integer;
  v_max_season integer;
  v_count integer;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if jsonb_typeof(coalesce(p_rows,'[]'::jsonb)) <> 'array' then raise exception 'F1_MAP_ARRAY_REQUIRED'; end if;
  v_count := jsonb_array_length(coalesce(p_rows,'[]'::jsonb));
  if v_count < 1 or v_count > 200 then raise exception 'F1_MAP_SIZE_INVALID'; end if;

  select min((x->>'season')::integer), max((x->>'season')::integer)
    into v_min_season, v_max_season
  from jsonb_array_elements(p_rows) x;
  if v_min_season is null or v_min_season <> v_max_season or v_min_season < 1950 or v_min_season > 2200 then
    raise exception 'F1_MAP_SEASON_INVALID';
  end if;
  v_season := v_min_season;

  if exists (
    select 1 from jsonb_array_elements(p_rows) x
    where (x->>'episode_number')::integer not between 1 and 500
       or (x->>'round')::integer not between 1 and 99
       or coalesce(x->>'session_kind','') not in ('fp1','fp2','fp3','sprint_qualifying','sprint','qualifying','race')
       or nullif(x->>'starts_at','') is null
  ) then raise exception 'F1_MAP_ROW_INVALID'; end if;

  delete from public.f1_episode_map_v423 where season=v_season;

  insert into public.f1_episode_map_v423(
    season,episode_number,round,session_kind,title,starts_at,runtime_minutes,canonical_provider_event_id,updated_at
  )
  select
    (x->>'season')::integer,
    (x->>'episode_number')::integer,
    (x->>'round')::integer,
    x->>'session_kind',
    left(coalesce(nullif(trim(x->>'title'),''),format('Formula 1 %s E%s',v_season,x->>'episode_number')),240),
    (x->>'starts_at')::timestamptz,
    greatest(1,least(coalesce(nullif(x->>'runtime_minutes','')::integer,case when x->>'session_kind'='race' then 120 else 60 end),360)),
    left(coalesce(nullif(trim(x->>'canonical_provider_event_id'),''),format('f1:%s:%s:%s',x->>'season',x->>'round',x->>'session_kind')),160),
    now()
  from jsonb_array_elements(p_rows) x
  order by (x->>'episode_number')::integer;

  return jsonb_build_object('season',v_season,'rows',v_count,'source','f1-map-r423');
end
$function$;

CREATE OR REPLACE FUNCTION public.cinetracker_f1_watch_sync_v423(p_season integer, p_episode integer, p_round integer, p_session_kind text, p_title text, p_starts_at timestamp with time zone, p_runtime_minutes integer DEFAULT 60, p_released_episodes integer DEFAULT NULL::integer, p_watched boolean DEFAULT true, p_watched_at timestamp with time zone DEFAULT now(), p_provider text DEFAULT 'jolpica'::text, p_provider_event_id text DEFAULT NULL::text, p_attended_in_person boolean DEFAULT false, p_stadium_name text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_uid uuid := auth.uid();
  v_kind text := lower(trim(coalesce(p_session_kind,'')));
  v_runtime integer := greatest(1,least(coalesce(p_runtime_minutes,case when v_kind='race' then 120 else 60 end),360));
  v_canonical text := format('f1:%s:%s:%s',p_season,p_round,v_kind);
  v_result jsonb;
  v_event_id bigint;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_season is null or p_season not between 1950 and 2200 then raise exception 'INVALID_F1_SEASON'; end if;
  if p_episode is null or p_episode not between 1 and 500 then raise exception 'INVALID_F1_EPISODE'; end if;
  if p_round is null or p_round not between 1 and 99 then raise exception 'INVALID_F1_ROUND'; end if;
  if v_kind not in ('fp1','fp2','fp3','sprint_qualifying','sprint','qualifying','race') then raise exception 'INVALID_F1_SESSION_KIND'; end if;
  if p_starts_at is null then raise exception 'F1_START_REQUIRED'; end if;

  insert into public.f1_episode_map_v423(
    season,episode_number,round,session_kind,title,starts_at,runtime_minutes,canonical_provider_event_id,updated_at
  ) values (
    p_season,p_episode,p_round,v_kind,
    left(coalesce(nullif(trim(coalesce(p_title,'')),''),v_canonical),240),
    p_starts_at,v_runtime,v_canonical,now()
  )
  on conflict(season,episode_number) do update set
    round=excluded.round,
    session_kind=excluded.session_kind,
    title=excluded.title,
    starts_at=excluded.starts_at,
    runtime_minutes=excluded.runtime_minutes,
    canonical_provider_event_id=excluded.canonical_provider_event_id,
    updated_at=now();

  v_result := public.cinetracker_f1_watch_sync_v422(
    p_season,p_episode,p_round,v_kind,p_title,p_starts_at,v_runtime,p_released_episodes,
    coalesce(p_watched,true),coalesce(p_watched_at,now()),p_provider,p_provider_event_id,
    coalesce(p_attended_in_person,false),p_stadium_name,
    coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('source','web-r423','media_id',865,'episode_number',p_episode)
  );

  begin
    v_event_id := nullif(v_result->>'sport_event_id','')::bigint;
  exception when others then v_event_id := null; end;

  if v_event_id is not null then
    update public.sport_events
       set raw=coalesce(raw,'{}'::jsonb)||jsonb_build_object(
         'ct_f1_episode_number',p_episode,
         'session_kind',v_kind,
         'media_id',865,
         'ct_f1_sync','r423'
       ),
       updated_at=now()
     where id=v_event_id;

    if coalesce(p_watched,true) then
      update public.user_sport_watch_history
         set source='f1-dual-r423',updated_at=now()
       where profile_id=v_uid and event_id=v_event_id;
    end if;
  end if;

  begin
    perform public.cinetracker_f1_session_watch_set_v314(
      v_canonical,p_season,p_round,v_kind,
      coalesce(nullif(trim(coalesce(p_title,'')),''),v_canonical),
      p_starts_at,coalesce(p_watched,true),
      coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object(
        'source','f1-dual-r423','media_id',865,'episode_number',p_episode,'sport_event_id',v_event_id
      )
    );
  exception when undefined_function or undefined_table then null; end;

  return coalesce(v_result,'{}'::jsonb)||jsonb_build_object(
    'source','f1-dual-r423',
    'mapping_source','f1_episode_map_v423',
    'season_number',p_season,
    'episode_number',p_episode,
    'round',p_round,
    'session_kind',v_kind,
    'runtime_minutes',v_runtime,
    'sport_event_id',v_event_id
  );
end
$function$;

CREATE OR REPLACE FUNCTION public.cinetracker_f1_reconcile_v423(p_season integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_uid uuid := auth.uid();
  m public.f1_episode_map_v423%rowtype;
  v_event_id bigint;
  v_series_watched boolean;
  v_sport_watched boolean;
  v_released integer;
  v_series_added integer := 0;
  v_sports_added integer := 0;
  v_sessions_synced integer := 0;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_season is null or p_season not between 1950 and 2200 then raise exception 'INVALID_F1_SEASON'; end if;

  select count(*)::integer into v_released
  from public.f1_episode_map_v423
  where season=p_season and starts_at<=now();

  for m in
    select * from public.f1_episode_map_v423
    where season=p_season and starts_at<=now()
    order by episode_number
  loop
    select (
      exists(select 1 from public.episode_progress ep
        where ep.profile_id=v_uid and ep.media_id=865 and ep.season_number=m.season and ep.episode_number=m.episode_number and ep.watched=true)
      or exists(select 1 from public.watch_history wh
        where wh.profile_id=v_uid and wh.media_id=865 and wh.item_type='episode' and wh.season_number=m.season and wh.episode_number=m.episode_number)
    ) into v_series_watched;

    v_event_id := null;
    select ev.id into v_event_id
    from public.sport_events ev
    left join public.user_sport_watch_history wh on wh.event_id=ev.id and wh.profile_id=v_uid
    where ev.sport_slug='formula_1'
      and coalesce(ev.season,'')=m.season::text
      and coalesce(ev.round,'')=m.round::text
      and (
        coalesce(ev.raw->>'ct_f1_episode_number','')=m.episode_number::text
        or public.cinetracker_f1_kind_v423(ev.title,ev.raw)=m.session_kind
      )
      and abs(extract(epoch from (ev.starts_at-m.starts_at)))<=12*3600
    order by (wh.id is not null) desc,
             (coalesce(ev.raw->>'ct_f1_episode_number','')=m.episode_number::text) desc,
             abs(extract(epoch from (ev.starts_at-m.starts_at))) asc,
             ev.id desc
    limit 1;

    v_sport_watched := false;
    if v_event_id is not null then
      select exists(
        select 1 from public.user_sport_watch_history
        where profile_id=v_uid and event_id=v_event_id
      ) into v_sport_watched;
    end if;

    if v_sport_watched and not v_series_watched then
      perform public.cinetracker_f1_episode_watch_set_v421(
        m.season,m.episode_number,m.title,m.runtime_minutes,v_released,true,now()
      );
      v_series_watched := true;
      v_series_added := v_series_added + 1;
    end if;

    if v_series_watched and not v_sport_watched then
      if v_event_id is null then
        insert into public.sport_events(
          sport_slug,provider,provider_event_id,title,starts_at,ends_at,status,season,round,
          participants,raw,last_synced_at,updated_at
        ) values (
          'formula_1','cinetracker-f1',m.canonical_provider_event_id,m.title,m.starts_at,
          m.starts_at+make_interval(mins=>m.runtime_minutes),
          case when m.starts_at<=now() then 'finished' else 'scheduled' end,
          m.season::text,m.round::text,'[]'::jsonb,
          jsonb_build_object('ct_source','r423-reconcile','ct_f1_episode_number',m.episode_number,'session_kind',m.session_kind,'media_id',865),
          now(),now()
        )
        on conflict(provider,provider_event_id) do update set
          title=excluded.title,starts_at=excluded.starts_at,ends_at=excluded.ends_at,
          status=excluded.status,season=excluded.season,round=excluded.round,
          raw=coalesce(public.sport_events.raw,'{}'::jsonb)||excluded.raw,
          last_synced_at=now(),updated_at=now()
        returning id into v_event_id;
      end if;

      perform public.cinetracker_sport_mark_watched_v1(
        v_event_id,true,m.runtime_minutes,now()
      );
      update public.user_sport_watch_history
         set source='f1-dual-r423',updated_at=now()
       where profile_id=v_uid and event_id=v_event_id;
      v_sport_watched := true;
      v_sports_added := v_sports_added + 1;
    end if;

    if v_series_watched or v_sport_watched then
      if v_event_id is not null then
        update public.sport_events
           set raw=coalesce(raw,'{}'::jsonb)||jsonb_build_object(
             'ct_f1_episode_number',m.episode_number,'session_kind',m.session_kind,'media_id',865,'ct_f1_sync','r423'
           ),updated_at=now()
         where id=v_event_id;
      end if;
      begin
        perform public.cinetracker_f1_session_watch_set_v314(
          m.canonical_provider_event_id,m.season,m.round,m.session_kind,m.title,m.starts_at,true,
          jsonb_build_object('source','f1-reconcile-r423','media_id',865,'episode_number',m.episode_number,'sport_event_id',v_event_id)
        );
      exception when undefined_function or undefined_table then null; end;
      v_sessions_synced := v_sessions_synced + 1;
    end if;
  end loop;

  return jsonb_build_object(
    'season',p_season,
    'series_added',v_series_added,
    'sports_added',v_sports_added,
    'sessions_synced',v_sessions_synced,
    'released_episodes',v_released,
    'source','f1-reconcile-r423'
  );
end
$function$;

CREATE OR REPLACE FUNCTION public.cinetracker_sport_mark_watched_v1(p_provider text, p_provider_event_id text, p_watched boolean DEFAULT true, p_duration_minutes integer DEFAULT NULL::integer, p_watched_at timestamp with time zone DEFAULT now())
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_event public.sport_events%rowtype;
  v_map public.f1_episode_map_v423%rowtype;
  v_kind text;
  v_released integer;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;

  select ev.* into v_event
  from public.sport_events ev
  where ev.provider=p_provider and ev.provider_event_id=p_provider_event_id
  order by ev.id desc
  limit 1;
  if not found then raise exception 'SPORT_EVENT_NOT_FOUND'; end if;

  if v_event.sport_slug='formula_1' then
    v_kind := public.cinetracker_f1_kind_v423(v_event.title,v_event.raw);

    select m.* into v_map
    from public.f1_episode_map_v423 m
    where m.season=coalesce(nullif(v_event.season,'')::integer,extract(year from v_event.starts_at)::integer)
      and (
        m.episode_number=coalesce(nullif(v_event.raw->>'ct_f1_episode_number','')::integer,-1)
        or (
          m.round=coalesce(nullif(v_event.round,'')::integer,-1)
          and m.session_kind=v_kind
          and abs(extract(epoch from (m.starts_at-v_event.starts_at)))<=12*3600
        )
      )
    order by
      (m.episode_number=coalesce(nullif(v_event.raw->>'ct_f1_episode_number','')::integer,-1)) desc,
      abs(extract(epoch from (m.starts_at-v_event.starts_at))) asc,
      m.episode_number
    limit 1;

    if not found then raise exception 'F1_EPISODE_MAP_NOT_READY'; end if;

    select count(*)::integer into v_released
    from public.f1_episode_map_v423
    where season=v_map.season and starts_at<=now();

    return public.cinetracker_f1_watch_sync_v423(
      v_map.season,v_map.episode_number,v_map.round,v_map.session_kind,
      v_map.title,v_map.starts_at,
      coalesce(p_duration_minutes,v_map.runtime_minutes),v_released,
      coalesce(p_watched,true),coalesce(p_watched_at,now()),
      p_provider,p_provider_event_id,false,null,
      jsonb_build_object('source','sports-generic-r423','sport_event_id',v_event.id)
    );
  end if;

  return public.cinetracker_sport_mark_watched_v1(
    v_event.id,coalesce(p_watched,true),p_duration_minutes,coalesce(p_watched_at,now())
  );
end
$function$;

revoke all on function public.cinetracker_f1_map_replace_v423(jsonb) from public;
revoke all on function public.cinetracker_f1_watch_sync_v423(integer,integer,integer,text,text,timestamptz,integer,integer,boolean,timestamptz,text,text,boolean,text,jsonb) from public;
revoke all on function public.cinetracker_f1_reconcile_v423(integer) from public;
grant execute on function public.cinetracker_f1_map_replace_v423(jsonb) to authenticated;
grant execute on function public.cinetracker_f1_watch_sync_v423(integer,integer,integer,text,text,timestamptz,integer,integer,boolean,timestamptz,text,text,boolean,text,jsonb) to authenticated;
grant execute on function public.cinetracker_f1_reconcile_v423(integer) to authenticated;
