create or replace function public.cinetracker_profile_history_media(p_limit_per_type integer default 1000)
returns table (
  media_id bigint,
  media_type text,
  tmdb_id integer,
  title text,
  poster_path text,
  last_watched_at timestamptz,
  plays bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  with aggregated as (
    select
      m.id as media_id,
      m.media_type,
      m.tmdb_id,
      m.title,
      m.poster_path,
      max(wh.watched_at) as last_watched_at,
      sum(greatest(coalesce(nullif(wh.external_ids->>'plays','')::integer, 1), 1))::bigint as plays
    from public.watch_history wh
    join public.media m on m.id = wh.media_id
    where wh.profile_id = auth.uid()
    group by m.id, m.media_type, m.tmdb_id, m.title, m.poster_path
  ), ranked as (
    select a.*, row_number() over (partition by a.media_type order by a.last_watched_at desc nulls last, a.media_id desc) as rn
    from aggregated a
  )
  select media_id, media_type, tmdb_id, title, poster_path, last_watched_at, plays
  from ranked
  where rn <= greatest(1, least(coalesce(p_limit_per_type, 1000), 2000))
  order by media_type, last_watched_at desc nulls last, media_id desc;
$$;

grant execute on function public.cinetracker_profile_history_media(integer) to authenticated;
