-- r526 production migration. Applied as r526_media_alias_home_series_integrity_v2.
-- The production transaction also merged Naruto alias media 9744 into canonical media 2930,
-- including episode_progress, watch_history, watch_play_events and media_overrides, normalizing S2 legacy coordinates 53-74 to 1-22.

create or replace function public.cinetracker_upsert_media(
 p_tmdb_id integer,p_media_type text,p_media_kind text,p_title text,p_release_year integer,p_poster_path text,
 p_genres jsonb default '[]'::jsonb,p_raw_tmdb jsonb default '{}'::jsonb
) returns bigint language plpgsql security invoker set search_path=public as $$
declare v_id bigint;
begin
 if auth.uid() is null then raise exception 'not authenticated'; end if;
 select m.id into v_id from public.media m
 where m.media_type=p_media_type and public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)=p_tmdb_id
 order by (m.tmdb_id=p_tmdb_id) desc,(m.poster_path is not null) desc,m.updated_at desc nulls last,m.id asc limit 1;
 if v_id is not null then
  update public.media set media_kind=coalesce(nullif(p_media_kind,''),media_kind),title=coalesce(nullif(p_title,''),title),release_year=coalesce(p_release_year,release_year),poster_path=coalesce(nullif(p_poster_path,''),poster_path),genres=case when coalesce(jsonb_array_length(coalesce(p_genres,'[]'::jsonb)),0)>0 then p_genres else genres end,raw_tmdb=case when coalesce(p_raw_tmdb,'{}'::jsonb)<>'{}'::jsonb then coalesce(raw_tmdb,'{}'::jsonb)||p_raw_tmdb else raw_tmdb end,updated_at=now() where id=v_id;
  return v_id;
 end if;
 insert into public.media(tmdb_id,media_type,media_kind,title,release_year,poster_path,genres,raw_tmdb,updated_at)
 values(p_tmdb_id,p_media_type,p_media_kind,p_title,p_release_year,p_poster_path,coalesce(p_genres,'[]'::jsonb),coalesce(p_raw_tmdb,'{}'::jsonb),now())
 on conflict(tmdb_id,media_type) do update set media_kind=excluded.media_kind,title=excluded.title,release_year=excluded.release_year,poster_path=excluded.poster_path,genres=excluded.genres,raw_tmdb=excluded.raw_tmdb,updated_at=now() returning id into v_id;
 return v_id;
end;$$;

-- cinetracker_home_series_v526 is created in production by the same migration; source of truth is Supabase migration history.
revoke all on function public.cinetracker_upsert_media(integer,text,text,text,integer,text,jsonb,jsonb) from public,anon;
grant execute on function public.cinetracker_upsert_media(integer,text,text,text,integer,text,jsonb,jsonb) to authenticated;
notify pgrst,'reload schema';
