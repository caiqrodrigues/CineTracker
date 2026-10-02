-- CineTracker Web r462 — canonical Formula 1 Series + Sports + F1 Hub synchronization.
-- Applied to production before being recorded here.

CREATE OR REPLACE FUNCTION public.cinetracker_f1_hub_to_all_v462()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  r record;
begin
  r:=case when tg_op='DELETE' then old else new end;
  if coalesce(r.metadata->>'ct_sync_owner','') in ('r462','r462-trigger') then
    return case when tg_op='DELETE' then old else new end;
  end if;

  perform public.cinetracker_f1_watch_sync_v462(
    r.season,
    coalesce(nullif(r.metadata->>'episode_number','')::integer,
      (select episode_number from public.f1_episode_map_v423
       where season=r.season and round=r.round and session_kind=r.session_kind
         and abs(extract(epoch from (starts_at-r.starts_at)))<=12*3600
       order by abs(extract(epoch from (starts_at-r.starts_at))),episode_number limit 1)),
    tg_op<>'DELETE',
    case when tg_op='DELETE' then now() else coalesce(r.watched_at,now()) end,
    null,false,null,'f1hub-trigger-r462'
  );
  return case when tg_op='DELETE' then old else new end;
end
$function$

CREATE OR REPLACE FUNCTION public.cinetracker_f1_series_to_hub_v462()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  m public.f1_episode_map_v423%rowtype;
begin
  if new.media_id<>865 then return new; end if;
  select * into m
  from public.f1_episode_map_v423
  where season=new.season_number and episode_number=new.episode_number
  limit 1;
  if not found then return new; end if;

  if coalesce(new.watched,false) then
    insert into public.user_f1_session_watch(
      profile_id,provider_event_id,season,round,session_kind,title,starts_at,watched_at,metadata
    ) values (
      new.profile_id,m.canonical_provider_event_id,m.season,m.round,m.session_kind,m.title,m.starts_at,
      coalesce(new.watched_at,now()),
      jsonb_build_object('source','series-trigger-r462','ct_sync_owner','r462-trigger','media_id',865,'episode_number',m.episode_number)
    )
    on conflict(profile_id,provider_event_id) do update set
      season=excluded.season,round=excluded.round,session_kind=excluded.session_kind,
      title=excluded.title,starts_at=excluded.starts_at,watched_at=excluded.watched_at,
      metadata=excluded.metadata,updated_at=now();
  else
    delete from public.user_f1_session_watch
    where profile_id=new.profile_id and provider_event_id=m.canonical_provider_event_id;
  end if;
  return new;
end
$function$

CREATE OR REPLACE FUNCTION public.cinetracker_f1_watch_sync_v462(p_season integer, p_episode integer, p_watched boolean DEFAULT true, p_watched_at timestamp with time zone DEFAULT now(), p_event_id bigint DEFAULT NULL::bigint, p_attended_in_person boolean DEFAULT false, p_stadium_name text DEFAULT NULL::text, p_source text DEFAULT 'web-r462'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_uid uuid:=auth.uid();
  m public.f1_episode_map_v423%rowtype;
  ev public.sport_events%rowtype;
  v_event_id bigint;
  v_released integer;
  v_series_watched boolean;
  v_canonical text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;

  select * into m
  from public.f1_episode_map_v423
  where season=p_season and episode_number=p_episode
  limit 1;
  if not found then raise exception 'F1_EPISODE_MAP_NOT_FOUND'; end if;

  v_canonical:=m.canonical_provider_event_id;
  select count(*)::integer into v_released
  from public.f1_episode_map_v423
  where season=m.season and starts_at<=now();

  select (
    exists(select 1 from public.episode_progress ep
      where ep.profile_id=v_uid and ep.media_id=865
        and ep.season_number=m.season and ep.episode_number=m.episode_number
        and ep.watched=true)
    or exists(select 1 from public.watch_history wh
      where wh.profile_id=v_uid and wh.media_id=865 and wh.item_type='episode'
        and wh.season_number=m.season and wh.episode_number=m.episode_number)
  ) into v_series_watched;

  if coalesce(p_watched,true) and not v_series_watched then
    perform public.cinetracker_f1_episode_watch_set_v421(
      m.season,m.episode_number,m.title,m.runtime_minutes,v_released,true,coalesce(p_watched_at,now())
    );
  elsif not coalesce(p_watched,true) and v_series_watched then
    perform public.cinetracker_f1_episode_watch_set_v421(
      m.season,m.episode_number,m.title,m.runtime_minutes,v_released,false,coalesce(p_watched_at,now())
    );
  end if;

  v_event_id:=null;
  if p_event_id is not null then
    select * into ev from public.sport_events where id=p_event_id and sport_slug='formula_1';
    if found and (
      coalesce(ev.raw->>'ct_f1_episode_number','')=m.episode_number::text
      or (
        coalesce(ev.season,'')=m.season::text
        and coalesce(ev.round,'')=m.round::text
        and public.cinetracker_f1_kind_v423(ev.title,ev.raw)=m.session_kind
        and abs(extract(epoch from (ev.starts_at-m.starts_at)))<=12*3600
      )
    ) then
      v_event_id:=ev.id;
    end if;
  end if;

  if v_event_id is null then
    select id into v_event_id
    from public.sport_events
    where provider='cinetracker-f1' and provider_event_id=v_canonical
    order by id desc
    limit 1;
  end if;

  if v_event_id is null then
    insert into public.sport_events(
      sport_slug,provider,provider_event_id,title,starts_at,ends_at,status,season,round,
      participants,raw,last_synced_at,updated_at
    ) values (
      'formula_1','cinetracker-f1',v_canonical,m.title,m.starts_at,
      m.starts_at+make_interval(mins=>m.runtime_minutes),
      case when m.starts_at<=now() then 'finished' else 'scheduled' end,
      m.season::text,m.round::text,'[]'::jsonb,
      jsonb_build_object(
        'ct_source','r462-canonical','ct_f1_episode_number',m.episode_number,
        'session_kind',m.session_kind,'media_id',865,'ct_f1_sync','r462'
      ),
      now(),now()
    )
    on conflict(provider,provider_event_id) do update set
      title=excluded.title,starts_at=excluded.starts_at,ends_at=excluded.ends_at,
      status=excluded.status,season=excluded.season,round=excluded.round,
      raw=coalesce(public.sport_events.raw,'{}'::jsonb)||excluded.raw,
      last_synced_at=now(),updated_at=now()
    returning id into v_event_id;
  else
    update public.sport_events
       set season=m.season::text,
           round=m.round::text,
           raw=coalesce(raw,'{}'::jsonb)||jsonb_build_object(
             'ct_f1_episode_number',m.episode_number,'session_kind',m.session_kind,
             'media_id',865,'ct_f1_sync','r462'
           ),
           updated_at=now()
     where id=v_event_id;
  end if;

  if coalesce(p_watched,true) then
    delete from public.user_sport_watch_history wh
    using public.sport_events x
    where wh.profile_id=v_uid and wh.event_id=x.id and x.sport_slug='formula_1'
      and x.id<>v_event_id
      and (
        (x.provider='cinetracker-f1' and x.provider_event_id=v_canonical)
        or coalesce(x.raw->>'ct_f1_episode_number','')=m.episode_number::text
        or (
          coalesce(x.season,'')=m.season::text
          and coalesce(x.round,'')=m.round::text
          and public.cinetracker_f1_kind_v423(x.title,x.raw)=m.session_kind
          and abs(extract(epoch from (x.starts_at-m.starts_at)))<=12*3600
        )
      );

    insert into public.user_sport_watch_history(
      profile_id,event_id,watched_at,duration_minutes,source,attended_in_person,stadium_name,created_at,updated_at
    ) values (
      v_uid,v_event_id,coalesce(p_watched_at,now()),m.runtime_minutes,'f1-dual-r462',
      coalesce(p_attended_in_person,false),
      case when coalesce(p_attended_in_person,false) then nullif(trim(coalesce(p_stadium_name,'')),'') else null end,
      now(),now()
    )
    on conflict(profile_id,event_id) do update set
      watched_at=excluded.watched_at,
      duration_minutes=excluded.duration_minutes,
      source='f1-dual-r462',
      attended_in_person=excluded.attended_in_person,
      stadium_name=excluded.stadium_name,
      updated_at=now();

    insert into public.user_f1_session_watch(
      profile_id,provider_event_id,season,round,session_kind,title,starts_at,watched_at,metadata
    ) values (
      v_uid,v_canonical,m.season,m.round,m.session_kind,m.title,m.starts_at,coalesce(p_watched_at,now()),
      jsonb_build_object('source',coalesce(nullif(trim(coalesce(p_source,'')),''),'web-r462'),
                         'ct_sync_owner','r462','media_id',865,'episode_number',m.episode_number,
                         'sport_event_id',v_event_id)
    )
    on conflict(profile_id,provider_event_id) do update set
      season=excluded.season,round=excluded.round,session_kind=excluded.session_kind,
      title=excluded.title,starts_at=excluded.starts_at,watched_at=excluded.watched_at,
      metadata=excluded.metadata,updated_at=now();
  else
    delete from public.user_sport_watch_history wh
    using public.sport_events x
    where wh.profile_id=v_uid and wh.event_id=x.id and x.sport_slug='formula_1'
      and (
        (x.provider='cinetracker-f1' and x.provider_event_id=v_canonical)
        or coalesce(x.raw->>'ct_f1_episode_number','')=m.episode_number::text
        or (
          coalesce(x.season,'')=m.season::text
          and coalesce(x.round,'')=m.round::text
          and public.cinetracker_f1_kind_v423(x.title,x.raw)=m.session_kind
          and abs(extract(epoch from (x.starts_at-m.starts_at)))<=12*3600
        )
      );

    delete from public.user_f1_session_watch
    where profile_id=v_uid and provider_event_id=v_canonical;
  end if;

  return jsonb_build_object(
    'media_id',865,'media_type','tv','media_kind','series','series_title','Formula 1',
    'season_number',m.season,'episode_number',m.episode_number,'round',m.round,
    'session_kind',m.session_kind,'watched',coalesce(p_watched,true),
    'runtime_minutes',m.runtime_minutes,'sport_event_id',v_event_id,
    'provider_event_id',v_canonical,'source','f1-dual-r462'
  );
end
$function$

CREATE OR REPLACE FUNCTION public.cinetracker_sport_mark_watched_v1(p_event_id bigint, p_watched boolean DEFAULT true, p_duration_minutes integer DEFAULT NULL::integer, p_watched_at timestamp with time zone DEFAULT now())
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_profile uuid:=auth.uid();
  v_event public.sport_events%rowtype;
  v_map public.f1_episode_map_v423%rowtype;
  v_duration integer;
  v_kind text;
begin
  if v_profile is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_event from public.sport_events where id=p_event_id;
  if not found then raise exception 'SPORT_EVENT_NOT_FOUND'; end if;

  if v_event.sport_slug='formula_1' then
    v_kind:=public.cinetracker_f1_kind_v423(v_event.title,v_event.raw);
    select * into v_map
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
    return public.cinetracker_f1_watch_sync_v462(
      v_map.season,v_map.episode_number,coalesce(p_watched,true),coalesce(p_watched_at,now()),
      v_event.id,false,null,'sports-r462'
    );
  end if;

  if not coalesce(p_watched,true) then
    delete from public.user_sport_watch_history where profile_id=v_profile and event_id=p_event_id;
    update public.profiles set updated_at=now() where id=v_profile;
    return jsonb_build_object('event_id',p_event_id,'is_watched',false,'duration_minutes',0,'sports_stats',public.cinetracker_sport_stats_v1());
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
    set watched_at=excluded.watched_at,duration_minutes=excluded.duration_minutes,source='manual',updated_at=now();

  update public.profiles set updated_at=now() where id=v_profile;
  return jsonb_build_object('event_id',p_event_id,'is_watched',true,'duration_minutes',v_duration,'watched_at',coalesce(p_watched_at,now()),'sports_stats',public.cinetracker_sport_stats_v1());
end
$function$

CREATE OR REPLACE FUNCTION public.cinetracker_sport_mark_watched_v1(p_provider text, p_provider_event_id text, p_watched boolean DEFAULT true, p_duration_minutes integer DEFAULT NULL::integer, p_watched_at timestamp with time zone DEFAULT now())
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_event_id bigint;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select id into v_event_id
  from public.sport_events
  where provider=p_provider and provider_event_id=p_provider_event_id
  order by id desc
  limit 1;
  if v_event_id is null then raise exception 'SPORT_EVENT_NOT_FOUND'; end if;
  return public.cinetracker_sport_mark_watched_v1(
    v_event_id,coalesce(p_watched,true),p_duration_minutes,coalesce(p_watched_at,now())
  );
end
$function$


revoke all on function public.cinetracker_f1_watch_sync_v462(integer,integer,boolean,timestamptz,bigint,boolean,text,text) from public;
grant execute on function public.cinetracker_f1_watch_sync_v462(integer,integer,boolean,timestamptz,bigint,boolean,text,text) to authenticated;

drop trigger if exists trg_f1_series_to_hub_v462 on public.episode_progress;
create trigger trg_f1_series_to_hub_v462
after insert or update of watched,watched_at on public.episode_progress
for each row
when (new.media_id=865)
execute function public.cinetracker_f1_series_to_hub_v462();

drop trigger if exists trg_f1_hub_to_all_v462 on public.user_f1_session_watch;
create trigger trg_f1_hub_to_all_v462
after insert or update or delete on public.user_f1_session_watch
for each row
execute function public.cinetracker_f1_hub_to_all_v462();

insert into public.user_f1_session_watch(
  profile_id,provider_event_id,season,round,session_kind,title,starts_at,watched_at,metadata
)
select
  ep.profile_id,m.canonical_provider_event_id,m.season,m.round,m.session_kind,m.title,m.starts_at,
  coalesce(ep.watched_at,ep.updated_at,now()),
  jsonb_build_object('source','r462-backfill','ct_sync_owner','r462-trigger','media_id',865,'episode_number',m.episode_number)
from public.episode_progress ep
join public.f1_episode_map_v423 m
  on m.season=ep.season_number and m.episode_number=ep.episode_number
where ep.media_id=865 and ep.watched=true
on conflict(profile_id,provider_event_id) do update set
  season=excluded.season,round=excluded.round,session_kind=excluded.session_kind,
  title=excluded.title,starts_at=excluded.starts_at,watched_at=excluded.watched_at,
  metadata=excluded.metadata,updated_at=now();
