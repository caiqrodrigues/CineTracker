create or replace function public.cinetracker_mark_episode_v0994(
  p_media_id bigint,
  p_season_number integer,
  p_episode_number integer,
  p_title text default null,
  p_runtime_minutes integer default null,
  p_released_episodes integer default null,
  p_series_status text default null,
  p_watched_at timestamptz default now()
) returns jsonb
language plpgsql
set search_path to 'public'
as $function$
declare
  v_profile uuid:=auth.uid();
  v_media public.media%rowtype;
  v_result jsonb;
  v_watched bigint:=0;
  v_released integer:=null;
  v_status text:=null;
  v_state text:='InProgress';
  v_bucket text:='continue';
begin
  if v_profile is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_season_number is null or p_episode_number is null then raise exception 'EPISODE_COORDINATES_REQUIRED'; end if;

  select * into v_media from public.media where id=p_media_id;
  if not found then raise exception 'MEDIA_NOT_FOUND'; end if;
  if v_media.media_type<>'tv' then raise exception 'TV_MEDIA_REQUIRED'; end if;

  v_result:=public.cinetracker_mark_watch_v0994(
    p_media_id,
    'episode',
    p_season_number,
    p_episode_number,
    p_title,
    p_runtime_minutes,
    p_released_episodes,
    p_watched_at
  );

  v_watched:=coalesce(nullif(v_result->>'watched_episodes','')::bigint,0);
  v_released:=coalesce(nullif(v_result->>'released_episodes','')::integer,nullif(p_released_episodes,0));
  v_status:=coalesce(nullif(p_series_status,''),nullif(v_media.raw_tmdb->>'status',''),'');

  if v_released is not null and v_watched>=v_released then
    if v_status in ('Ended','Canceled') then
      v_state:='Completed';
      v_bucket:='completed';
    else
      v_state:='UpToDate';
      v_bucket:='up_to_date';
    end if;
  else
    v_state:='InProgress';
    v_bucket:='continue';
  end if;

  delete from public.media_overrides
  where profile_id=v_profile and media_id=p_media_id
    and state in ('InProgress','UpToDate','Completed')
    and origin in ('system','import');

  insert into public.media_overrides(profile_id,media_id,state,origin,updated_at)
  values(v_profile,p_media_id,v_state,'system',p_watched_at)
  on conflict(profile_id,media_id,state) do update
    set updated_at=excluded.updated_at
    where public.media_overrides.origin in ('system','import');

  return v_result || jsonb_build_object(
    'series_status',v_status,
    'state',v_state,
    'home_bucket',v_bucket
  );
end;
$function$;

grant execute on function public.cinetracker_mark_episode_v0994(bigint,integer,integer,text,integer,integer,text,timestamptz) to authenticated;
