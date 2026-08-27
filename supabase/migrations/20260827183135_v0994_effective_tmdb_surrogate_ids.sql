create or replace function public.cinetracker_effective_tmdb_id(p_tmdb integer, p_raw jsonb)
returns integer
language sql
immutable
set search_path to 'public'
as $$
  select case
    when coalesce(p_tmdb,0) < 0
      and coalesce(nullif(p_raw->>'source_tmdb_id','')::bigint,0) between 1 and 2147483647
      then (p_raw->>'source_tmdb_id')::integer
    else p_tmdb
  end
$$;

do $$
declare
  ddl text;
begin
  ddl := pg_get_functiondef('public.cinetracker_profile_home_payload_v0994()'::regprocedure);
  if position('select m.id as media_id,m.tmdb_id,m.media_type' in ddl)=0 then
    raise exception 'home payload base tmdb marker not found';
  end if;
  ddl := replace(ddl,
    'select m.id as media_id,m.tmdb_id,m.media_type',
    'select m.id as media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,m.media_type');
  if position('select wh.id,wh.media_id,m.tmdb_id,m.title as media_title' in ddl)=0 then
    raise exception 'home payload history tmdb marker not found';
  end if;
  ddl := replace(ddl,
    'select wh.id,wh.media_id,m.tmdb_id,m.title as media_title',
    'select wh.id,wh.media_id,public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,m.title as media_title');
  execute ddl;

  ddl := pg_get_functiondef('public.cinetracker_profile_media_dashboard_v0991()'::regprocedure);
  if position(E'      m.tmdb_id,\n      m.title' in ddl)=0 then
    raise exception 'profile dashboard tmdb marker not found';
  end if;
  ddl := replace(ddl,
    E'      m.tmdb_id,\n      m.title',
    E'      public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb) as tmdb_id,\n      m.title');
  execute ddl;
end $$;
