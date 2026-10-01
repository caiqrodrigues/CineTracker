-- CineTracker Web r426 — sports history undo.
create or replace function public.cinetracker_unmark_sport_history_v426(p_event_id bigint) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare v_uid uuid:=auth.uid();v_deleted integer:=0;
begin if v_uid is null then raise exception 'AUTH_REQUIRED';end if;
delete from public.user_sport_watch_history where profile_id=v_uid and event_id=p_event_id;get diagnostics v_deleted=row_count;
return jsonb_build_object('event_id',p_event_id,'watched',false,'deleted',v_deleted);end;$$;
revoke all on function public.cinetracker_unmark_sport_history_v426(bigint) from public,anon;
grant execute on function public.cinetracker_unmark_sport_history_v426(bigint) to authenticated;
notify pgrst,'reload schema';