-- CineTracker r314: persist Formula 1 session watch state per user without creating synthetic sport_events rows.
create table if not exists public.user_f1_session_watch (
  profile_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  provider_event_id text not null,
  season integer not null check (season between 1950 and 2200),
  round integer not null check (round between 1 and 99),
  session_kind text not null check (session_kind in ('fp1','fp2','fp3','sprint_qualifying','sprint','qualifying','race')),
  title text not null,
  starts_at timestamptz not null,
  watched_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_id, provider_event_id),
  constraint user_f1_session_watch_id_format check (
    provider_event_id ~ '^f1:[0-9]{4}:[0-9]{1,2}:(fp1|fp2|fp3|sprint_qualifying|sprint|qualifying|race)$'
  )
);
create index if not exists idx_user_f1_session_watch_profile_time on public.user_f1_session_watch(profile_id,starts_at desc);
alter table public.user_f1_session_watch enable row level security;

drop policy if exists user_f1_session_watch_select on public.user_f1_session_watch;
create policy user_f1_session_watch_select on public.user_f1_session_watch for select to authenticated using ((select auth.uid())=profile_id);
drop policy if exists user_f1_session_watch_insert on public.user_f1_session_watch;
create policy user_f1_session_watch_insert on public.user_f1_session_watch for insert to authenticated with check ((select auth.uid())=profile_id);
drop policy if exists user_f1_session_watch_update on public.user_f1_session_watch;
create policy user_f1_session_watch_update on public.user_f1_session_watch for update to authenticated using ((select auth.uid())=profile_id) with check ((select auth.uid())=profile_id);
drop policy if exists user_f1_session_watch_delete on public.user_f1_session_watch;
create policy user_f1_session_watch_delete on public.user_f1_session_watch for delete to authenticated using ((select auth.uid())=profile_id);

revoke all on table public.user_f1_session_watch from anon;
grant select,insert,update,delete on table public.user_f1_session_watch to authenticated;

create or replace function public.cinetracker_f1_session_watch_history_v314()
returns table(provider_event_id text,season integer,round integer,session_kind text,title text,starts_at timestamptz,watched_at timestamptz,metadata jsonb,is_watched boolean)
language sql stable security invoker set search_path=public
as $$
  select w.provider_event_id,w.season,w.round,w.session_kind,w.title,w.starts_at,w.watched_at,w.metadata,true
  from public.user_f1_session_watch w
  where w.profile_id=(select auth.uid())
  order by w.starts_at desc
$$;

create or replace function public.cinetracker_f1_session_watch_set_v314(
  p_provider_event_id text,
  p_season integer,
  p_round integer,
  p_session_kind text,
  p_title text,
  p_starts_at timestamptz,
  p_watched boolean default true,
  p_metadata jsonb default '{}'::jsonb
) returns jsonb
language plpgsql security invoker set search_path=public
as $$
declare
  v_uid uuid := auth.uid();
  v_id text := trim(coalesce(p_provider_event_id,''));
  v_kind text := trim(coalesce(p_session_kind,''));
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if v_id !~ '^f1:[0-9]{4}:[0-9]{1,2}:(fp1|fp2|fp3|sprint_qualifying|sprint|qualifying|race)$' then raise exception 'INVALID_F1_SESSION_ID'; end if;
  if v_kind not in ('fp1','fp2','fp3','sprint_qualifying','sprint','qualifying','race') then raise exception 'INVALID_F1_SESSION_KIND'; end if;
  if p_season is null or p_season<1950 or p_season>2200 or p_round is null or p_round<1 or p_round>99 then raise exception 'INVALID_F1_SESSION_CONTEXT'; end if;
  if v_id<>format('f1:%s:%s:%s',p_season,p_round,v_kind) then raise exception 'F1_SESSION_CONTEXT_MISMATCH'; end if;
  if p_starts_at is null then raise exception 'F1_SESSION_START_REQUIRED'; end if;

  if coalesce(p_watched,true) then
    insert into public.user_f1_session_watch(profile_id,provider_event_id,season,round,session_kind,title,starts_at,watched_at,metadata)
    values(v_uid,v_id,p_season,p_round,v_kind,coalesce(nullif(trim(coalesce(p_title,'')),''),v_id),p_starts_at,now(),coalesce(p_metadata,'{}'::jsonb))
    on conflict(profile_id,provider_event_id) do update
      set season=excluded.season,round=excluded.round,session_kind=excluded.session_kind,title=excluded.title,
          starts_at=excluded.starts_at,watched_at=now(),metadata=excluded.metadata,updated_at=now();
  else
    delete from public.user_f1_session_watch where profile_id=v_uid and provider_event_id=v_id;
  end if;

  return jsonb_build_object('provider_event_id',v_id,'is_watched',coalesce(p_watched,true),'session_kind',v_kind,'season',p_season,'round',p_round);
end
$$;

revoke execute on function public.cinetracker_f1_session_watch_history_v314() from public,anon;
revoke execute on function public.cinetracker_f1_session_watch_set_v314(text,integer,integer,text,text,timestamptz,boolean,jsonb) from public,anon;
grant execute on function public.cinetracker_f1_session_watch_history_v314() to authenticated;
grant execute on function public.cinetracker_f1_session_watch_set_v314(text,integer,integer,text,text,timestamptz,boolean,jsonb) to authenticated;
notify pgrst,'reload schema';
