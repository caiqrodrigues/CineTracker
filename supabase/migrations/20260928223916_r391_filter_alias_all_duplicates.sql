create or replace function public.cinetracker_discover_filter_v391(p_items jsonb)
returns jsonb language sql stable security invoker set search_path=public as $$
with items as materialized (
 select case when lower(coalesce(x.media_type,''))='movie' then 'movie' else 'tv' end media_type,x.tmdb_id,
 nullif(trim(x.title),'') title,nullif(trim(x.original_title),'') original_title,x.release_year,
 case when lower(coalesce(x.media_type,''))='movie' then 'movie:'||x.tmdb_id::text else 'tv:'||x.tmdb_id::text end candidate_key,
 lower(regexp_replace(coalesce(x.title,''),'[^[:alnum:]]+','','g')) norm_title,
 lower(regexp_replace(coalesce(x.original_title,''),'[^[:alnum:]]+','','g')) norm_original
 from jsonb_to_recordset(coalesce(p_items,'[]'::jsonb)) as x(media_type text,tmdb_id bigint,title text,original_title text,release_year integer)
 where coalesce(x.tmdb_id,0)>0
), exact_match as materialized (
 select distinct i.candidate_key,m.id media_id from items i join public.media m on
 (case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0 then m.media_type||':'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text else m.media_type||':id:'||m.id::text end)=i.candidate_key
), alias_match as materialized (
 select distinct i.candidate_key,m.id media_id from items i join public.media m on m.media_type=i.media_type and (
 (i.norm_title<>'' and lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g'))=i.norm_title)
 or (i.norm_original<>'' and lower(regexp_replace(coalesce(m.title,''),'[^[:alnum:]]+','','g'))=i.norm_original)
 or (i.norm_title<>'' and lower(regexp_replace(coalesce(m.original_title,m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=i.norm_title)
 or (i.norm_original<>'' and lower(regexp_replace(coalesce(m.original_title,m.raw_tmdb->>'original_title',m.raw_tmdb->>'original_name',''),'[^[:alnum:]]+','','g'))=i.norm_original))
 and (coalesce(i.release_year,0)=0 or coalesce(m.release_year,0)=0 or abs(m.release_year-i.release_year)<=1)
), matched as materialized (select * from exact_match union select * from alias_match),
state as materialized (
 select i.candidate_key,
 exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id where mm.candidate_key=i.candidate_key and mo.profile_id=auth.uid() and mo.state in ('AddedToWatchlist','WatchLater')) is_watchlist,
 (exists(select 1 from matched mm join public.watch_history wh on wh.media_id=mm.media_id where mm.candidate_key=i.candidate_key and wh.profile_id=auth.uid() and wh.item_type in ('episode','movie'))
  or exists(select 1 from matched mm join public.episode_progress ep on ep.media_id=mm.media_id where mm.candidate_key=i.candidate_key and ep.profile_id=auth.uid() and ep.watched=true)
  or exists(select 1 from matched mm join public.media_overrides mo on mo.media_id=mm.media_id where mm.candidate_key=i.candidate_key and mo.profile_id=auth.uid() and mo.state in ('AlreadySeen','Completed','InProgress','UpToDate'))) is_seen
 from items i
)
select jsonb_build_object(
 'blocked_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_watchlist or is_seen),'[]'::jsonb),
 'watch_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_watchlist),'[]'::jsonb),
 'seen_keys',coalesce((select jsonb_agg(candidate_key order by candidate_key) from state where is_seen),'[]'::jsonb),
 'checked_count',(select count(*) from items),'generated_at',now());
$$;
revoke all on function public.cinetracker_discover_filter_v391(jsonb) from public,anon;grant execute on function public.cinetracker_discover_filter_v391(jsonb) to authenticated;
notify pgrst,'reload schema';
