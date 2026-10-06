-- CineTracker Web r484 — strict non-repeating discovery and pure Profile authority.

create or replace function public.cinetracker_discover_fresh_v484(
  p_kind text,
  p_limit integer default 48
)
returns jsonb
language sql
volatile
security invoker
set search_path=public
as $$
with cfg as (
  select lower(coalesce(p_kind,'movie')) as kind,
         least(greatest(coalesce(p_limit,48),1),48)::int as lim
), source as materialized (
  select
    x.item,
    x.ord,
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id,
    sr.shown_at
  from cfg
  cross join lateral jsonb_array_elements(public.cinetracker_discover_fresh_v476(cfg.kind,48)) with ordinality x(item,ord)
  join public.media m on m.id=(x.item->>'media_id')::bigint
  left join public.shown_recommendations sr
    on sr.user_id=auth.uid()
   and sr.media_type=m.media_type
   and sr.tmdb_id=public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)
), ranked as (
  select *,
    case when shown_at is null or shown_at < now()-interval '7 days' then 0 else 1 end as recent_penalty,
    random() as shuffle_key
  from source
), picked as (
  select *
  from ranked
  order by recent_penalty asc,shown_at asc nulls first,shuffle_key,ord
  limit (select lim from cfg)
)
select coalesce(
  jsonb_agg(
    item || jsonb_build_object(
      '__ct484_strict',true,
      '__ct484_recent_penalty',recent_penalty
    )
    order by recent_penalty asc,shown_at asc nulls first,shuffle_key,ord
  ),
  '[]'::jsonb
)
from picked;
$$;

create or replace function public.cinetracker_discover_watch_smart_v484(
  p_kind text,
  p_limit integer default 30
)
returns jsonb
language sql
volatile
security invoker
set search_path=public
as $$
with cfg as (
  select lower(coalesce(p_kind,'movie')) as kind,
         least(greatest(coalesce(p_limit,30),1),30)::int as lim
), source as materialized (
  select
    x.item,
    x.ord,
    m.media_type,
    public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)::bigint as tmdb_id,
    sr.shown_at
  from cfg
  cross join lateral jsonb_array_elements(public.cinetracker_discover_watch_smart_v476(cfg.kind,30)) with ordinality x(item,ord)
  join public.media m on m.id=(x.item->>'media_id')::bigint
  left join public.shown_recommendations sr
    on sr.user_id=auth.uid()
   and sr.media_type=m.media_type
   and sr.tmdb_id=public.cinetracker_effective_tmdb_id(m.tmdb_id,m.raw_tmdb)
), ranked as (
  select *,
    case when shown_at is null or shown_at < now()-interval '7 days' then 0 else 1 end as recent_penalty,
    random() as shuffle_key
  from source
), picked as (
  select *
  from ranked
  order by recent_penalty asc,shown_at asc nulls first,shuffle_key,ord
  limit (select lim from cfg)
)
select coalesce(
  jsonb_agg(
    item || jsonb_build_object(
      '__ct484_smart_watch',true,
      '__ct484_recent_penalty',recent_penalty
    )
    order by recent_penalty asc,shown_at asc nulls first,shuffle_key,ord
  ),
  '[]'::jsonb
)
from picked;
$$;

create or replace function public.cinetracker_record_recommendations_v484(p_items jsonb)
returns jsonb
language sql
volatile
security invoker
set search_path=public
as $$
  select coalesce(public.cinetracker_record_recommendations_v480(p_items),'{}'::jsonb)
    || jsonb_build_object('source','v484');
$$;

create or replace function public.cinetracker_profile_lists_v484()
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
  select coalesce(public.cinetracker_profile_lists_v479(),'{}'::jsonb)
    || jsonb_build_object('source','v484-history-pure');
$$;

revoke all on function public.cinetracker_discover_fresh_v484(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_fresh_v484(text,integer) to authenticated;
revoke all on function public.cinetracker_discover_watch_smart_v484(text,integer) from public,anon;
grant execute on function public.cinetracker_discover_watch_smart_v484(text,integer) to authenticated;
revoke all on function public.cinetracker_record_recommendations_v484(jsonb) from public,anon;
grant execute on function public.cinetracker_record_recommendations_v484(jsonb) to authenticated;
revoke all on function public.cinetracker_profile_lists_v484() from public,anon;
grant execute on function public.cinetracker_profile_lists_v484() to authenticated;

notify pgrst,'reload schema';
