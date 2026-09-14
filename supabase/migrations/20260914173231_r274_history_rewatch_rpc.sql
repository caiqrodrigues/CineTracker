-- Web r274: register a new play from History without forcing the client to
-- reconstruct release counts. The canonical watch RPC remains the writer.

create or replace function public.cinetracker_rewatch_history_v1(
  p_media_id bigint,
  p_item_type text,
  p_season_number integer default null,
  p_episode_number integer default null,
  p_title text default null,
  p_watched_at timestamptz default now()
) returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
declare
  v_type text:=lower(coalesce(p_item_type,''));
  v_runtime integer:=0;
  v_total integer:=0;
  v_raw jsonb:='{}'::jsonb;
  v_released integer:=null;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if v_type not in ('movie','episode') then raise exception 'INVALID_ITEM_TYPE'; end if;

  select coalesce(m.runtime_minutes,0),coalesce(m.total_episodes,0),coalesce(m.raw_tmdb,'{}'::jsonb)
    into v_runtime,v_total,v_raw
  from public.media m
  where m.id=p_media_id;
  if not found then raise exception 'MEDIA_NOT_FOUND'; end if;

  if v_type='episode' then
    if coalesce(p_season_number,0)<=0 or coalesce(p_episode_number,0)<=0 then
      raise exception 'EPISODE_COORDINATES_REQUIRED';
    end if;
    v_released:=public.cinetracker_released_episodes_v0997(v_raw,v_total,0,current_date);
  end if;

  return public.cinetracker_mark_watch_v0994(
    p_media_id,
    v_type,
    case when v_type='episode' then p_season_number else null end,
    case when v_type='episode' then p_episode_number else null end,
    p_title,
    nullif(v_runtime,0),
    v_released,
    p_watched_at
  );
end;
$$;

revoke all on function public.cinetracker_rewatch_history_v1(bigint,text,integer,integer,text,timestamptz) from public;
grant execute on function public.cinetracker_rewatch_history_v1(bigint,text,integer,integer,text,timestamptz) to authenticated,service_role;
