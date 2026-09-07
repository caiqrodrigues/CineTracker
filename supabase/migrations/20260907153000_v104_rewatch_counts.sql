create or replace function public.cinetracker_rewatch_counts_v104()
returns jsonb
language sql
stable
set search_path to 'public'
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'media_id', wh.media_id,
    'tmdb_id', m.tmdb_id,
    'media_type', m.media_type,
    'item_type', wh.item_type,
    'season_number', wh.season_number,
    'episode_number', wh.episode_number,
    'plays', case when coalesce(wh.external_ids->>'plays','') ~ '^[0-9]+$' then greatest(1,(wh.external_ids->>'plays')::int) else 1 end,
    'watched_at', wh.watched_at
  ) order by wh.watched_at desc), '[]'::jsonb)
  from public.watch_history wh
  join public.media m on m.id=wh.media_id
  where wh.profile_id=auth.uid();
$$;
grant execute on function public.cinetracker_rewatch_counts_v104() to authenticated;
