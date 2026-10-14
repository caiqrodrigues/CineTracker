create or replace function public.cinetracker_wwe_ppv_status_by_keys_v520(p_event_keys text[])
returns table(event_key text,legacy_media_id bigint,tmdb_id bigint,episode_number integer,is_watched boolean)
language sql
stable
set search_path=public
as $$
with requested as (
  select distinct nullif(trim(x),'') event_key
  from unnest(coalesce(p_event_keys,array[]::text[])) x
  where nullif(trim(x),'') is not null
), special_media as (
  select id from public.media where media_type='tv' and tmdb_id=-520 order by id limit 1
), series_seen as (
  select public.cinetracker_wwe_ppv_event_key_v519(wh.title) event_key,max(wh.episode_number)::integer episode_number
  from public.watch_history wh
  join special_media sm on sm.id=wh.media_id
  where wh.profile_id=auth.uid() and wh.item_type='episode'
  group by 1
), legacy_ranked as (
  select r.event_key,m.id legacy_media_id,
         public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint tmdb_id,
         (exists(select 1 from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id=m.id)
          or exists(select 1 from public.watch_play_events_v0994 pe where pe.profile_id=auth.uid() and pe.media_id=m.id)
          or exists(select 1 from public.media_overrides mo where mo.profile_id=auth.uid() and mo.media_id=m.id and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate'))) is_watched,
         row_number() over(partition by r.event_key order by m.release_year desc nulls last,m.id desc) rn
  from requested r
  join public.media m on m.media_type='movie'
   and public.cinetracker_wwe_ppv_event_key_v519(coalesce(nullif(m.title,''),nullif(m.original_title,''),m.raw_tmdb->>'title',m.raw_tmdb->>'name'))=r.event_key
  where public.cinetracker_wwe_ppv_eligible_v519(coalesce(nullif(m.title,''),nullif(m.original_title,''),m.raw_tmdb->>'title',m.raw_tmdb->>'name'))
     or lower(concat_ws(' ',m.title,m.original_title,coalesce(m.raw_tmdb,'{}'::jsonb)::text)) ~ '(^|[^[:alnum:]])(wwe|wwf|world wrestling|nxt)([^[:alnum:]]|$)'
), legacy as (select * from legacy_ranked where rn=1)
select r.event_key,l.legacy_media_id,l.tmdb_id,s.episode_number,
       (s.event_key is not null or coalesce(l.is_watched,false)) is_watched
from requested r
left join series_seen s on s.event_key=r.event_key
left join legacy l on l.event_key=r.event_key
order by r.event_key;
$$;
notify pgrst,'reload schema';
