create or replace function public.cinetracker_foryou_payload_v498(p_watch_limit integer default 30,p_fresh_limit integer default 48)
returns jsonb language sql stable set search_path=public as $$
with src as materialized (select public.cinetracker_foryou_payload_v490(p_watch_limit,p_fresh_limit) j),
known_ids as materialized (
 select mo.media_id from public.media_overrides mo where mo.profile_id=auth.uid() and mo.state in ('AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate','Liked')
 union select wh.media_id from public.watch_history wh where wh.profile_id=auth.uid() and wh.media_id is not null
 union select ep.media_id from public.episode_progress ep where ep.profile_id=auth.uid() and ep.media_id is not null and ep.watched=true
 union select pe.media_id from public.watch_play_events_v0994 pe where pe.profile_id=auth.uid() and pe.media_id is not null
),known_aliases as materialized (
 select distinct m.media_type,public.cinetracker_norm_title_v1(v.alias) alias from known_ids k join public.media m on m.id=k.media_id
 cross join lateral (values(nullif(m.title,'')),(nullif(m.original_title,'')),(nullif(m.raw_tmdb->>'title','')),(nullif(m.raw_tmdb->>'name','')),(nullif(m.raw_tmdb->>'original_title','')),(nullif(m.raw_tmdb->>'original_name',''))) v(alias) where nullif(v.alias,'') is not null
),fresh_items as materialized (
 select grp.kind,e.item,e.ord,m.id media_id,m.media_type,m.title,m.original_title,m.raw_tmdb from src
 cross join lateral (values('movie',j->'fresh'->'movie'),('series',j->'fresh'->'series'),('anime',j->'fresh'->'anime')) grp(kind,arr)
 cross join lateral jsonb_array_elements(coalesce(grp.arr,'[]'::jsonb)) with ordinality e(item,ord)
 join public.media m on m.id=(e.item->>'media_id')::bigint
),fresh_clean as materialized (
 select f.* from fresh_items f where not exists(select 1 from known_ids k where k.media_id=f.media_id)
 and not exists(select 1 from lateral (values(nullif(f.title,'')),(nullif(f.original_title,'')),(nullif(f.raw_tmdb->>'title','')),(nullif(f.raw_tmdb->>'name','')),(nullif(f.raw_tmdb->>'original_title','')),(nullif(f.raw_tmdb->>'original_name',''))) ca(alias)
 join known_aliases ka on ka.media_type=f.media_type and ka.alias=public.cinetracker_norm_title_v1(ca.alias) where nullif(ca.alias,'') is not null)
),fresh_movie as(select coalesce(jsonb_agg(item order by ord),'[]'::jsonb) a from fresh_clean where kind='movie'),
fresh_series as(select coalesce(jsonb_agg(item order by ord),'[]'::jsonb) a from fresh_clean where kind='series'),
fresh_anime as(select coalesce(jsonb_agg(item order by ord),'[]'::jsonb) a from fresh_clean where kind='anime')
select jsonb_build_object('watch',(select j->'watch' from src),'fresh',jsonb_build_object('movie',(select a from fresh_movie),'series',(select a from fresh_series),'anime',(select a from fresh_anime)),'source','v498-seen-alias-safe','generated_at',now());
$$;
revoke all on function public.cinetracker_foryou_payload_v498(integer,integer) from public,anon;
grant execute on function public.cinetracker_foryou_payload_v498(integer,integer) to authenticated;
notify pgrst,'reload schema';
