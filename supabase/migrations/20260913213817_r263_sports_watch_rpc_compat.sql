-- r263: preserve compatibility with clients that identify sports events by provider/provider_event_id.
create or replace function public.cinetracker_sport_mark_watched_v1(
  p_provider text,
  p_provider_event_id text,
  p_watched boolean default true,
  p_duration_minutes integer default null,
  p_watched_at timestamptz default now()
)
returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
declare
  v_event_id bigint;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select ev.id into v_event_id
  from public.sport_events ev
  where ev.provider = p_provider
    and ev.provider_event_id = p_provider_event_id
  order by ev.id desc
  limit 1;
  if v_event_id is null then raise exception 'SPORT_EVENT_NOT_FOUND'; end if;
  return public.cinetracker_sport_mark_watched_v1(
    v_event_id,
    coalesce(p_watched,true),
    p_duration_minutes,
    coalesce(p_watched_at,now())
  );
end;
$$;
revoke all on function public.cinetracker_sport_mark_watched_v1(text,text,boolean,integer,timestamptz) from public;
grant execute on function public.cinetracker_sport_mark_watched_v1(text,text,boolean,integer,timestamptz) to authenticated;
notify pgrst, 'reload schema';
