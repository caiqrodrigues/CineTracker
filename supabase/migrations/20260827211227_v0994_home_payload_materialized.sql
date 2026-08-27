do $$
declare
  ddl text;
begin
  ddl := pg_get_functiondef('public.cinetracker_profile_home_payload_v0994()'::regprocedure);
  if position('base as materialized (' in ddl) > 0 then
    return;
  end if;
  if position('base as (' in ddl) = 0 then
    raise exception 'cinetracker_profile_home_payload_v0994 base CTE marker not found';
  end if;
  ddl := replace(ddl, 'base as (', 'base as materialized (');
  execute ddl;
end $$;
