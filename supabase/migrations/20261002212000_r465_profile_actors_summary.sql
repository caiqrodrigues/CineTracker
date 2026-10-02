-- CineTracker Web r465 — Profile actors summary: 13 visible cards + one "Ver mais" sentinel.
create or replace function public.cinetracker_profile_actors_v465(p_limit integer default 14)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
with cfg as (
  select least(50,greatest(1,coalesce(p_limit,14)))::integer as lim
), src as materialized (
  select fa.id,fa.tmdb_person_id,fa.actor_name,fa.profile_path,fa.created_at
  from public.favorite_actors fa
  where fa.user_id=auth.uid()
), picked as (
  select * from src order by created_at desc,id desc limit (select lim from cfg)
)
select jsonb_build_object(
  'rows',coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at desc,p.id desc) from picked p),'[]'::jsonb),
  'count',(select count(*)::integer from src)
);
$$;
revoke all on function public.cinetracker_profile_actors_v465(integer) from public,anon;
grant execute on function public.cinetracker_profile_actors_v465(integer) to authenticated;
notify pgrst,'reload schema';
