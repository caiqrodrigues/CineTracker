create or replace function public.cinetracker_episode_progress_history_guard_v0997()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_title text;
  v_runtime integer;
  v_when timestamptz;
begin
  if not coalesce(new.watched,false)
     or coalesce(new.origin,'') <> 'manual'
     or coalesce(new.season_number,0) <= 0
     or coalesce(new.episode_number,0) <= 0 then
    return new;
  end if;

  select m.title,greatest(1,coalesce(nullif(m.runtime_minutes,0),45))
    into v_title,v_runtime
  from public.media m where m.id=new.media_id;
  v_when:=coalesce(new.watched_at,new.updated_at,now());

  if not exists (
    select 1 from public.watch_history wh
    where wh.profile_id=new.profile_id and wh.media_id=new.media_id
      and wh.item_type='episode' and wh.season_number=new.season_number
      and wh.episode_number=new.episode_number
  ) then
    insert into public.watch_history(
      profile_id,source,media_id,item_type,season_number,episode_number,
      watched_at,external_ids,title
    ) values (
      new.profile_id,'manual',new.media_id,'episode',new.season_number,new.episode_number,
      v_when,jsonb_build_object(
        'plays',1,'baseline_plays_v0994',0,'v0994_managed',true,
        'history_guard_v0997',true
      ),v_title
    );
  end if;

  if not exists (
    select 1 from public.watch_play_events_v0994 pe
    where pe.profile_id=new.profile_id and pe.media_id=new.media_id
      and pe.item_type='episode' and pe.season_number=new.season_number
      and pe.episode_number=new.episode_number
  ) then
    insert into public.watch_play_events_v0994(
      profile_id,media_id,item_type,season_number,episode_number,
      played_at,runtime_minutes,source
    ) values (
      new.profile_id,new.media_id,'episode',new.season_number,new.episode_number,
      v_when,coalesce(v_runtime,45),'manual'
    );
  end if;

  update public.profiles set updated_at=now() where id=new.profile_id;
  return new;
end;
$$;

drop trigger if exists trg_episode_progress_history_guard_v0997 on public.episode_progress;
create trigger trg_episode_progress_history_guard_v0997
after insert or update of watched,watched_at,origin on public.episode_progress
for each row
when (new.watched = true)
execute function public.cinetracker_episode_progress_history_guard_v0997();
