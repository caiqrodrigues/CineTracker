do $$
declare
  ddl text;
  marker text := E'), watched_keys as (';
  inject text := E'), media_keys as materialized (\n  select m.id,\n    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0\n      then m.media_type||\':\'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text\n      else m.media_type||\':id:\'||m.id::text end as logical_key\n  from public.media m\n), watched_keys as (';
  old_wh text := E'  select distinct\n    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0\n      then m.media_type||\':\'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text\n      else m.media_type||\':id:\'||m.id::text end as logical_key,\n    wh.season_number,wh.episode_number\n  from public.watch_history wh join public.media m on m.id=wh.media_id';
  new_wh text := E'  select distinct mk.logical_key,\n    wh.season_number,wh.episode_number\n  from public.watch_history wh join media_keys mk on mk.id=wh.media_id';
  old_ep text := E'  select distinct\n    case when public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)>0\n      then m.media_type||\':\'||public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::text\n      else m.media_type||\':id:\'||m.id::text end,\n    ep.season_number,ep.episode_number\n  from public.episode_progress ep join public.media m on m.id=ep.media_id';
  new_ep text := E'  select distinct mk.logical_key,\n    ep.season_number,ep.episode_number\n  from public.episode_progress ep join media_keys mk on mk.id=ep.media_id';
begin
  ddl := pg_get_functiondef('public.cinetracker_profile_home_payload_v0994()'::regprocedure);
  if position('media_keys as materialized (' in ddl) > 0 then return; end if;
  if position(marker in ddl)=0 or position(old_wh in ddl)=0 or position(old_ep in ddl)=0 then
    raise exception 'home payload media-key optimization markers not found';
  end if;
  ddl := replace(ddl, marker, inject);
  ddl := replace(ddl, old_wh, new_wh);
  ddl := replace(ddl, old_ep, new_ep);
  execute ddl;
end $$;
