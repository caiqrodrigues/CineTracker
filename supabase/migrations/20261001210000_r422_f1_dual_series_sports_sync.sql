-- CineTracker Web r422 — Formula 1 is synchronized atomically as series episode and sports event.

create or replace function public.cinetracker_sport_stats_v421()
returns table(watched_events bigint,sports_minutes bigint)
language sql stable security invoker set search_path=public
as $$
 select count(*)::bigint,coalesce(sum(wh.duration_minutes),0)::bigint
 from public.user_sport_watch_history wh
 join public.sport_events ev on ev.id=wh.event_id
 where wh.profile_id=auth.uid();
$$;

create or replace function public.cinetracker_sport_stats_v422()
returns table(watched_events bigint,sports_minutes bigint)
language sql stable security invoker set search_path=public
as $$
 select * from public.cinetracker_sport_stats_v421();
$$;

create or replace function public.cinetracker_f1_watch_sync_v422(
 p_season integer,p_episode integer,p_round integer,p_session_kind text,p_title text,p_starts_at timestamptz,
 p_runtime_minutes integer default 60,p_released_episodes integer default null,p_watched boolean default true,p_watched_at timestamptz default now(),
 p_provider text default 'jolpica',p_provider_event_id text default null,p_attended_in_person boolean default false,p_stadium_name text default null,p_metadata jsonb default '{}'::jsonb
) returns jsonb
language plpgsql volatile security definer set search_path=public,pg_temp
as $$
declare
 v_uid uuid:=auth.uid();v_media_id bigint:=865;v_kind text:=lower(trim(coalesce(p_session_kind,'')));
 v_provider text:=left(coalesce(nullif(trim(coalesce(p_provider,'')),''),'jolpica'),80);
 v_provider_event_id text:=left(coalesce(nullif(trim(coalesce(p_provider_event_id,'')),''),format('f1:%s:%s:%s',p_season,p_round,v_kind)),160);
 v_canonical_id text:=format('f1:%s:%s:%s',p_season,p_round,v_kind);
 v_title text:=left(coalesce(nullif(trim(coalesce(p_title,'')),''),format('Fórmula 1 %s · %s',p_season,v_kind)),240);
 v_runtime integer:=greatest(1,least(coalesce(p_runtime_minutes,case when v_kind='race' then 120 else 60 end),360));
 v_event_id bigint;v_series jsonb;v_sports jsonb;v_kind_match text;
begin
 if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_season is null or p_season<1950 or p_season>2200 then raise exception 'INVALID_F1_SEASON'; end if;
 if p_episode is null or p_episode<1 or p_episode>500 then raise exception 'INVALID_F1_EPISODE'; end if;
 if p_round is null or p_round<1 or p_round>99 then raise exception 'INVALID_F1_ROUND'; end if;
 if v_kind not in ('fp1','fp2','fp3','sprint_qualifying','sprint','qualifying','race') then raise exception 'INVALID_F1_SESSION_KIND'; end if;
 if p_starts_at is null then raise exception 'F1_START_REQUIRED'; end if;
 if not exists(select 1 from public.media where id=v_media_id and media_type='tv') then raise exception 'F1_SERIES_NOT_FOUND'; end if;

 v_series:=public.cinetracker_f1_episode_watch_set_v421(p_season,p_episode,v_title,v_runtime,p_released_episodes,coalesce(p_watched,true),coalesce(p_watched_at,now()));

 select ev.id into v_event_id from public.sport_events ev
 where ev.sport_slug='formula_1' and ev.provider=v_provider and ev.provider_event_id=v_provider_event_id
 order by ev.id desc limit 1;

 if v_event_id is null then
  v_kind_match:=case v_kind
   when 'fp1' then '(practice|treino livre)[[:space:]]*1'
   when 'fp2' then '(practice|treino livre)[[:space:]]*2'
   when 'fp3' then '(practice|treino livre)[[:space:]]*3'
   when 'sprint_qualifying' then '(sprint[[:space:]]*(qualifying|shootout)|qualifying[[:space:]]*sprint|classifica.{0,3}o[[:space:]]*sprint)'
   when 'sprint' then '(^|[^[:alnum:]])sprint([^[:alnum:]]|$)'
   when 'qualifying' then '(qualifying|classifica.{0,3}o)'
   else '(grand[[:space:]]+prix|corrida|race)' end;

  select ev.id into v_event_id
  from public.sport_events ev
  left join public.user_sport_watch_history wh on wh.event_id=ev.id and wh.profile_id=v_uid
  where ev.sport_slug='formula_1' and coalesce(ev.season,'')=p_season::text and coalesce(ev.round,'')=p_round::text
    and (coalesce(ev.raw->>'ct_f1_episode_number','')=p_episode::text or (
      lower(coalesce(ev.title,'')) ~ v_kind_match and case
       when v_kind='sprint' then lower(coalesce(ev.title,'')) !~ '(qualifying|shootout|classifica)'
       when v_kind='qualifying' then lower(coalesce(ev.title,'')) !~ 'sprint'
       when v_kind='race' then lower(coalesce(ev.title,'')) !~ '(practice|treino livre|qualifying|classifica|sprint)'
       else true end))
    and abs(extract(epoch from (ev.starts_at-p_starts_at)))<=12*3600
  order by (wh.id is not null) desc,(ev.provider=v_provider and ev.provider_event_id=v_provider_event_id) desc,
           (coalesce(ev.raw->>'ct_f1_episode_number','')=p_episode::text) desc,(ev.provider='cinetracker-f1') asc,
           abs(extract(epoch from (ev.starts_at-p_starts_at))) asc,ev.id desc limit 1;
 end if;

 if v_event_id is null and coalesce(p_watched,true) then
  insert into public.sport_events(sport_slug,provider,provider_event_id,title,starts_at,ends_at,status,season,round,venue,participants,raw,last_synced_at,updated_at)
  values('formula_1','cinetracker-f1',v_canonical_id,v_title,p_starts_at,p_starts_at+make_interval(mins=>v_runtime),
   case when p_starts_at<=now() then 'finished' else 'scheduled' end,p_season::text,p_round::text,
   nullif(trim(coalesce(p_metadata->>'venue','')),''),'[]'::jsonb,
   coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('ct_source','r422','ct_f1_episode_number',p_episode,'session_kind',v_kind,'media_id',v_media_id),now(),now())
  on conflict(provider,provider_event_id) do update set title=excluded.title,starts_at=excluded.starts_at,ends_at=excluded.ends_at,status=excluded.status,
   season=excluded.season,round=excluded.round,raw=coalesce(public.sport_events.raw,'{}'::jsonb)||excluded.raw,last_synced_at=now(),updated_at=now()
  returning id into v_event_id;
 end if;

 if v_event_id is not null then
  update public.sport_events set raw=coalesce(raw,'{}'::jsonb)||jsonb_build_object('ct_f1_episode_number',p_episode,'session_kind',v_kind,'media_id',v_media_id,'ct_f1_sync','r422'),updated_at=now() where id=v_event_id;
  v_sports:=public.cinetracker_sport_mark_watched_v1(v_event_id,coalesce(p_watched,true),v_runtime,coalesce(p_watched_at,now()));
  if coalesce(p_watched,true) then
   update public.user_sport_watch_history set attended_in_person=coalesce(p_attended_in_person,false),
    stadium_name=case when coalesce(p_attended_in_person,false) then nullif(trim(coalesce(p_stadium_name,'')),'') else null end,
    source='f1-dual-r422',updated_at=now() where profile_id=v_uid and event_id=v_event_id;
  end if;
 else v_sports:=jsonb_build_object('event_id',null,'is_watched',false,'duration_minutes',0);end if;

 begin
  perform public.cinetracker_f1_session_watch_set_v314(v_canonical_id,p_season,p_round,v_kind,v_title,p_starts_at,coalesce(p_watched,true),
   coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('source','f1-dual-r422','media_id',v_media_id,'episode_number',p_episode,'sport_event_id',v_event_id));
 exception when undefined_function or undefined_table then null;end;

 return jsonb_build_object('media_id',v_media_id,'media_type','tv','media_kind','series','series_title','Formula 1',
  'season_number',p_season,'episode_number',p_episode,'round',p_round,'session_kind',v_kind,'watched',coalesce(p_watched,true),
  'runtime_minutes',v_runtime,'sport_event_id',v_event_id,'provider_event_id',coalesce(v_provider_event_id,v_canonical_id),
  'series',coalesce(v_series,'{}'::jsonb),'sports',coalesce(v_sports,'{}'::jsonb),'source','f1-dual-r422');
end;
$$;

revoke all on function public.cinetracker_sport_stats_v422() from public,anon;
grant execute on function public.cinetracker_sport_stats_v422() to authenticated;
revoke all on function public.cinetracker_f1_watch_sync_v422(integer,integer,integer,text,text,timestamptz,integer,integer,boolean,timestamptz,text,text,boolean,text,jsonb) from public,anon;
grant execute on function public.cinetracker_f1_watch_sync_v422(integer,integer,integer,text,text,timestamptz,integer,integer,boolean,timestamptz,text,text,boolean,text,jsonb) to authenticated;
notify pgrst,'reload schema';
