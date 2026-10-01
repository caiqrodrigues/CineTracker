-- CineTracker Web r426 — Profile history undo, stable For You swap and F1 released progress.
create or replace function public.cinetracker_activity_items_by_day_v426(p_day date,p_tz text default 'America/Sao_Paulo') returns jsonb
language sql stable security invoker set search_path=public as $$
with cfg as (select auth.uid() uid,coalesce(nullif(p_tz,''),'America/Sao_Paulo') zone,p_day target_date),
media_rows as (
select wh.id::bigint sort_id,wh.watched_at,wh.item_type,wh.season_number,wh.episode_number,coalesce(m.runtime_minutes,0)::integer runtime_minutes,m.id media_id,m.media_type,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) tmdb_id,m.title media_title,m.poster_path,coalesce(wh.title,m.title) title,coalesce(m.release_year,0)::integer release_year,coalesce(nullif(m.raw_tmdb->>'vote_average','')::numeric,0) vote_average,case when coalesce(wh.external_ids->>'plays','')~'^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::integer) else 1 end plays,0::integer remaining_episodes,'home_history'::text source_kind,null::bigint event_id
from public.watch_history wh join public.media m on m.id=wh.media_id cross join cfg c
where wh.profile_id=c.uid and wh.item_type in ('episode','movie') and wh.watched_at>=(c.target_date::timestamp at time zone c.zone) and wh.watched_at<((c.target_date+1)::timestamp at time zone c.zone)
),sport_rows as (
select sh.id::bigint sort_id,sh.watched_at,'sport'::text item_type,null::integer season_number,null::integer episode_number,coalesce(sh.duration_minutes,0)::integer runtime_minutes,null::bigint media_id,null::text media_type,null::integer tmdb_id,se.title media_title,se.image_url poster_path,se.title title,extract(year from sh.watched_at)::integer release_year,0::numeric vote_average,1::integer plays,0::integer remaining_episodes,'sport'::text source_kind,se.id::bigint event_id
from public.user_sport_watch_history sh join public.sport_events se on se.id=sh.event_id cross join cfg c
where sh.profile_id=c.uid and sh.watched_at>=(c.target_date::timestamp at time zone c.zone) and sh.watched_at<((c.target_date+1)::timestamp at time zone c.zone)
)
select coalesce(jsonb_agg(to_jsonb(a) order by a.watched_at desc,a.sort_id desc),'[]'::jsonb) from (select * from media_rows union all select * from sport_rows) a;
$$;
create or replace function public.cinetracker_unmark_history_item_v426(p_media_id bigint,p_item_type text,p_season_number integer default null,p_episode_number integer default null) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare v_uid uuid:=auth.uid();v_type text:=lower(coalesce(p_item_type,''));v_history_deleted integer:=0;v_progress_deleted integer:=0;v_events_deleted integer:=0;v_remaining_watched integer:=0;
begin
if v_uid is null then raise exception 'AUTH_REQUIRED';end if;if v_type not in ('movie','episode') then raise exception 'INVALID_HISTORY_ITEM_TYPE';end if;
if not exists(select 1 from public.media where id=p_media_id) then raise exception 'MEDIA_NOT_FOUND';end if;
if v_type='movie' then
 delete from public.watch_history where profile_id=v_uid and media_id=p_media_id and item_type='movie';get diagnostics v_history_deleted=row_count;
 delete from public.watch_play_events_v0994 where profile_id=v_uid and media_id=p_media_id and item_type='movie';get diagnostics v_events_deleted=row_count;
 delete from public.media_overrides where profile_id=v_uid and media_id=p_media_id and state in ('AlreadySeen','Completed','InProgress','UpToDate');
else
 if coalesce(p_season_number,0)<1 or coalesce(p_episode_number,0)<1 then raise exception 'EPISODE_COORDINATES_REQUIRED';end if;
 delete from public.watch_history where profile_id=v_uid and media_id=p_media_id and item_type='episode' and season_number=p_season_number and episode_number=p_episode_number;get diagnostics v_history_deleted=row_count;
 delete from public.episode_progress where profile_id=v_uid and media_id=p_media_id and season_number=p_season_number and episode_number=p_episode_number;get diagnostics v_progress_deleted=row_count;
 delete from public.watch_play_events_v0994 where profile_id=v_uid and media_id=p_media_id and item_type='episode' and season_number=p_season_number and episode_number=p_episode_number;get diagnostics v_events_deleted=row_count;
 select count(*)::integer into v_remaining_watched from public.episode_progress where profile_id=v_uid and media_id=p_media_id and watched=true;
 delete from public.media_overrides where profile_id=v_uid and media_id=p_media_id and state in ('InProgress','UpToDate') and origin in ('system','import');
 if v_remaining_watched>0 then insert into public.media_overrides(profile_id,media_id,state,origin,updated_at) values(v_uid,p_media_id,'InProgress','system',now()) on conflict(profile_id,media_id,state) do update set origin='system',updated_at=excluded.updated_at;end if;
end if;
return jsonb_build_object('media_id',p_media_id,'item_type',v_type,'season_number',p_season_number,'episode_number',p_episode_number,'seen',false,'history_deleted',v_history_deleted,'progress_deleted',v_progress_deleted,'events_deleted',v_events_deleted,'remaining_watched',v_remaining_watched);
end;$$;
create or replace function public.cinetracker_f1_progress_v426(p_season integer default extract(year from current_date)::integer) returns jsonb
language sql stable security invoker set search_path=public as $$
with map as (select episode_number from public.f1_episode_map_v423 where season=p_season and starts_at<=now()),
watched as (select distinct episode_number from (select ep.episode_number from public.episode_progress ep where ep.profile_id=auth.uid() and ep.media_id=865 and ep.season_number=p_season and ep.watched=true union select wh.episode_number from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id=865 and wh.item_type='episode' and wh.season_number=p_season) x)
select jsonb_build_object('season',p_season,'released_episodes',(select count(*) from map),'watched_released_episodes',(select count(*) from watched w join map m using(episode_number)),'remaining_episodes',greatest(0,(select count(*) from map)-(select count(*) from watched w join map m using(episode_number))),'total_mapped',(select count(*) from public.f1_episode_map_v423 where season=p_season));$$;
revoke all on function public.cinetracker_activity_items_by_day_v426(date,text) from public,anon;
grant execute on function public.cinetracker_activity_items_by_day_v426(date,text) to authenticated;
revoke all on function public.cinetracker_unmark_history_item_v426(bigint,text,integer,integer) from public,anon;
grant execute on function public.cinetracker_unmark_history_item_v426(bigint,text,integer,integer) to authenticated;
revoke all on function public.cinetracker_f1_progress_v426(integer) from public,anon;
grant execute on function public.cinetracker_f1_progress_v426(integer) to authenticated;
notify pgrst,'reload schema';