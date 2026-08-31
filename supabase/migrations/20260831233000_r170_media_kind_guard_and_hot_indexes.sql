-- r170: guard media_kind on legacy inserts + reduce hot dashboard/history scans
create or replace function public.cinetracker_media_kind_guard_v1()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.media_kind is null or new.media_kind not in ('movie','series','anime') then
    if new.media_type='movie' then
      new.media_kind:='movie';
    elsif new.media_type='tv'
      and coalesce(new.raw_tmdb,'{}'::jsonb)->'genre_ids' @> '[16]'::jsonb
      and coalesce(new.raw_tmdb,'{}'::jsonb)->'origin_country' @> '["JP"]'::jsonb then
      new.media_kind:='anime';
    else
      new.media_kind:='series';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_media_kind_guard_v1 on public.media;
create trigger trg_media_kind_guard_v1
before insert or update of media_type,media_kind,raw_tmdb on public.media
for each row execute function public.cinetracker_media_kind_guard_v1();

create index if not exists idx_watch_history_profile_item_media_r170
on public.watch_history(profile_id,item_type,media_id,watched_at desc);

create index if not exists idx_episode_progress_profile_watched_media_r170
on public.episode_progress(profile_id,media_id,season_number,episode_number)
where watched=true;

comment on function public.cinetracker_media_kind_guard_v1() is
'Ensures legacy/new media inserts always receive a valid movie/series/anime media_kind.';
