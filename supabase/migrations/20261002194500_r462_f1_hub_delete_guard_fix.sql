-- CineTracker Web r462 hotfix: direct F1 Hub deletes propagate, nested v462 writes do not recurse.
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
  perform set_config('cinetracker.f1_sync_owner','r462',true);
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
$function$;

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
  if current_setting('cinetracker.f1_sync_owner',true)='r462' or (tg_op<>'DELETE' and coalesce(r.metadata->>'ct_sync_owner','') in ('r462','r462-trigger')) then
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
$function$;
