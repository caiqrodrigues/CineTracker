-- CineTracker v0.3.8 / r481 — safe indexes for Home, Discover and Profile hot paths.
create index if not exists idx_ct481_media_overrides_profile_state_updated
  on public.media_overrides(profile_id,state,updated_at desc);

create index if not exists idx_ct481_watch_history_profile_watched_at
  on public.watch_history(profile_id,watched_at desc);

create index if not exists idx_ct481_episode_progress_profile_watched_updated
  on public.episode_progress(profile_id,watched,updated_at desc);

create index if not exists idx_ct481_shown_recommendations_user_shown
  on public.shown_recommendations(user_id,shown_at desc);

create index if not exists idx_ct481_favorite_actors_user_created
  on public.favorite_actors(user_id,created_at desc);

notify pgrst,'reload schema';
