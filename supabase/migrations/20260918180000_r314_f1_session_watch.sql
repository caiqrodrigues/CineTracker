-- CineTracker r314: persist Formula 1 sessions created from the selected GP detail drawer.
create or replace function public.cinetracker_f1_watch_set_v314(
  p_provider_event_id text,
  p_title text default 'Fórmula 1',
  p_starts_at timestamptz default null,
  p_watched boolean default true,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_profile uuid := auth.uid();
  v_event_id bigint;
  v_event_key text := trim(coalesce(p_provider_event_id, ''));
  v_title text := nullif(trim(coalesce(p_title, '')), '');
  v_season text;
  v_round text;
  v_kind text;
  v_duration interval;
  v_result jsonb;
begin
  if v_profile is null then raise exception 'AUTH_REQUIRED'; end if;
  if v_event_key !~ '^f1:20[0-9]{2}:[0-9]{1,2}:(fp1|fp2|fp3|sprint_qualifying|sprint|qualifying|race)$' then raise exception 'F1_EVENT_ID_INVALID'; end if;
  if p_starts_at is null then raise exception 'F1_START_REQUIRED'; end if;
  v_season := split_part(v_event_key, ':', 2);
  v_round := split_part(v_event_key, ':', 3);
  v_kind := split_part(v_event_key, ':', 4);
  v_duration := case v_kind when 'race' then interval '2 hours' when 'sprint' then interval '1 hour' when 'qualifying' then interval '1 hour' when 'sprint_qualifying' then interval '1 hour' else interval '1 hour' end;
  insert into public.sport_events(sport_slug,provider,provider_event_id,title,starts_at,ends_at,status,season,round,venue,participants,raw,last_synced_at,updated_at)
  values('formula_1','jolpica',v_event_key,coalesce(v_title,'Fórmula 1'),p_starts_at,p_starts_at+v_duration,case when p_starts_at<=now() then 'finished' else 'scheduled' end,v_season,v_round,nullif(trim(coalesce(p_metadata->>'venue','')),''),'[]'::jsonb,jsonb_build_object('ct_source','r314','kind',v_kind)||coalesce(p_metadata,'{}'::jsonb),now(),now())
  on conflict(provider,provider_event_id) do update set title=excluded.title,starts_at=excluded.starts_at,ends_at=excluded.ends_at,status=excluded.status,season=excluded.season,round=excluded.round,venue=coalesce(excluded.venue,public.sport_events.venue),raw=coalesce(public.sport_events.raw,'{}'::jsonb)||excluded.raw,last_synced_at=now(),updated_at=now()
  returning id into v_event_id;
  v_result := public.cinetracker_sport_mark_watched_v1(v_event_id,coalesce(p_watched,true),null,now());
  return coalesce(v_result,'{}'::jsonb)||jsonb_build_object('provider','jolpica','provider_event_id',v_event_key,'season',v_season,'round',v_round,'kind',v_kind);
end;
$$;
revoke all on function public.cinetracker_f1_watch_set_v314(text,text,timestamptz,boolean,jsonb) from public;
grant execute on function public.cinetracker_f1_watch_set_v314(text,text,timestamptz,boolean,jsonb) to authenticated;
