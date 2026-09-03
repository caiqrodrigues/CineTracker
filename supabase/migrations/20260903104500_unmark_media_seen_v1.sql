-- Reversible seen state for movie/series detail actions.
create or replace function public.cinetracker_unmark_media_seen_v1(
  p_media_id bigint,
  p_media_type text,
  p_changed_at timestamptz default now()
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_profile uuid:=auth.uid();
  v_type text:=lower(coalesce(p_media_type,''));
  v_history_deleted integer:=0;
  v_progress_deleted integer:=0;
  v_events_deleted integer:=0;
begin
  if v_profile is null then raise exception 'AUTH_REQUIRED'; end if;
  if v_type not in ('movie','tv') then raise exception 'INVALID_MEDIA_TYPE'; end if;
  if not exists(select 1 from public.media where id=p_media_id) then raise exception 'MEDIA_NOT_FOUND'; end if;

  if v_type='movie' then
    delete from public.watch_history
      where profile_id=v_profile and media_id=p_media_id and item_type='movie';
    get diagnostics v_history_deleted=row_count;

    delete from public.watch_play_events_v0994
      where profile_id=v_profile and media_id=p_media_id and item_type='movie';
    get diagnostics v_events_deleted=row_count;

    delete from public.media_overrides
      where profile_id=v_profile and media_id=p_media_id and state in ('AlreadySeen','Completed');
  else
    delete from public.watch_history
      where profile_id=v_profile and media_id=p_media_id and item_type='episode';
    get diagnostics v_history_deleted=row_count;

    delete from public.episode_progress
      where profile_id=v_profile and media_id=p_media_id;
    get diagnostics v_progress_deleted=row_count;

    delete from public.watch_play_events_v0994
      where profile_id=v_profile and media_id=p_media_id and item_type='episode';
    get diagnostics v_events_deleted=row_count;

    delete from public.media_overrides
      where profile_id=v_profile and media_id=p_media_id
        and state in ('AlreadySeen','Completed','InProgress','UpToDate');
  end if;

  return jsonb_build_object(
    'media_id',p_media_id,
    'media_type',v_type,
    'seen',false,
    'history_deleted',v_history_deleted,
    'progress_deleted',v_progress_deleted,
    'events_deleted',v_events_deleted,
    'changed_at',p_changed_at
  );
end;
$$;

revoke all on function public.cinetracker_unmark_media_seen_v1(bigint,text,timestamptz) from public;
grant execute on function public.cinetracker_unmark_media_seen_v1(bigint,text,timestamptz) to authenticated;
