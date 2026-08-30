do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

alter table public.media_overrides replica identity full;
alter table public.episode_progress replica identity full;
alter table public.watch_history replica identity full;
alter table public.watch_play_events_v0994 replica identity full;
alter table public.favorite_actors replica identity full;
alter table public.profiles replica identity full;

do $$
declare
  t text;
begin
  foreach t in array array[
    'media_overrides',
    'episode_progress',
    'watch_history',
    'watch_play_events_v0994',
    'favorite_actors',
    'profiles'
  ]
  loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
