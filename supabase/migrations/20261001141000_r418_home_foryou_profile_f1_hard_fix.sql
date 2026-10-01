-- CineTracker Web r418 — authoritative sports counters + Formula 1 session-as-series writer.
create or replace function public.cinetracker_sport_stats_v418()
returns table(watched_events bigint, sports_minutes bigint)
language sql stable security invoker set search_path=public
as $$
  select count(*)::bigint,coalesce(sum(wh.duration_minutes),0)::bigint
  from public.user_sport_watch_history wh
  where wh.profile_id=(select auth.uid());
$$;
revoke all on function public.cinetracker_sport_stats_v418() from public,anon;
grant execute on function public.cinetracker_sport_stats_v418() to authenticated;

create or replace function public.cinetracker_f1_episode_watch_set_v418(
  p_season integer,p_episode integer,p_title text,p_runtime_minutes integer default 60,
  p_released_episodes integer default null,p_watched boolean default true,p_watched_at timestamptz default now()
) returns jsonb
language plpgsql security invoker set search_path=public
as $$
declare v_uid uuid:=auth.uid();v_media_id bigint:=865;v_watched bigint:=0;v_play_id bigint;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_season is null or p_season<1950 or p_season>2200 then raise exception 'INVALID_F1_SEASON'; end if;
  if p_episode is null or p_episode<1 or p_episode>500 then raise exception 'INVALID_F1_EPISODE'; end if;
  if coalesce(p_watched,true) then
    return public.cinetracker_mark_watch_v0994(v_media_id,'episode',p_season,p_episode,nullif(trim(coalesce(p_title,'')),''),greatest(1,least(coalesce(p_runtime_minutes,60),360)),p_released_episodes,coalesce(p_watched_at,now()));
  end if;
  delete from public.watch_history where profile_id=v_uid and media_id=v_media_id and item_type='episode' and season_number=p_season and episode_number=p_episode;
  update public.episode_progress set watched=false,watched_at=null,origin='manual',updated_at=now() where profile_id=v_uid and media_id=v_media_id and season_number=p_season and episode_number=p_episode;
  select id into v_play_id from public.watch_play_events_v0994 where profile_id=v_uid and media_id=v_media_id and item_type='episode' and season_number=p_season and episode_number=p_episode order by played_at desc,id desc limit 1;
  if v_play_id is not null then delete from public.watch_play_events_v0994 where id=v_play_id and profile_id=v_uid; end if;
  select count(*)::bigint into v_watched from public.episode_progress where profile_id=v_uid and media_id=v_media_id and watched=true;
  delete from public.media_overrides where profile_id=v_uid and media_id=v_media_id and state in ('InProgress','UpToDate') and origin in ('system','import');
  if v_watched>0 then
    insert into public.media_overrides(profile_id,media_id,state,origin,updated_at)
    values(v_uid,v_media_id,case when coalesce(p_released_episodes,0)>0 and v_watched>=p_released_episodes then 'UpToDate' else 'InProgress' end,'system',now())
    on conflict(profile_id,media_id,state) do update set origin='system',updated_at=excluded.updated_at where public.media_overrides.origin in ('system','import');
  end if;
  return jsonb_build_object('media_id',v_media_id,'item_type','episode','season_number',p_season,'episode_number',p_episode,'watched',false,'watched_episodes',v_watched,'released_episodes',p_released_episodes,'watched_at',null);
end;
$$;
revoke all on function public.cinetracker_f1_episode_watch_set_v418(integer,integer,text,integer,integer,boolean,timestamptz) from public,anon;
grant execute on function public.cinetracker_f1_episode_watch_set_v418(integer,integer,text,integer,integer,boolean,timestamptz) to authenticated;
notify pgrst,'reload schema';
