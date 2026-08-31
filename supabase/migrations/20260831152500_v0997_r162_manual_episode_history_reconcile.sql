with missing as materialized (
  select ep.profile_id,ep.media_id,ep.season_number,ep.episode_number,
         coalesce(ep.watched_at,ep.updated_at,now()) as watched_at,
         coalesce(nullif(m.runtime_minutes,0),45) as runtime_minutes,
         m.title as media_title
  from public.episode_progress ep
  join public.media m on m.id=ep.media_id
  where ep.watched=true and ep.origin='manual'
    and coalesce(ep.season_number,0)>0 and coalesce(ep.episode_number,0)>0
    and not exists (
      select 1 from public.watch_history wh
      where wh.profile_id=ep.profile_id and wh.media_id=ep.media_id and wh.item_type='episode'
        and wh.season_number=ep.season_number and wh.episode_number=ep.episode_number
    )
), ins_history as (
  insert into public.watch_history(profile_id,source,media_id,item_type,season_number,episode_number,watched_at,external_ids,title)
  select profile_id,'manual',media_id,'episode',season_number,episode_number,watched_at,
         jsonb_build_object('plays',1,'baseline_plays_v0994',0,'v0994_managed',true,'backfilled_from_episode_progress_r162',true),
         media_title
  from missing
  returning profile_id,media_id,season_number,episode_number,watched_at
), ins_plays as (
  insert into public.watch_play_events_v0994(profile_id,media_id,item_type,season_number,episode_number,played_at,runtime_minutes,source)
  select m.profile_id,m.media_id,'episode',m.season_number,m.episode_number,m.watched_at,m.runtime_minutes,'manual'
  from missing m
  where not exists (
    select 1 from public.watch_play_events_v0994 pe
    where pe.profile_id=m.profile_id and pe.media_id=m.media_id and pe.item_type='episode'
      and pe.season_number=m.season_number and pe.episode_number=m.episode_number
  )
  returning profile_id
)
update public.profiles p set updated_at=now()
where p.id in (select profile_id from missing);
