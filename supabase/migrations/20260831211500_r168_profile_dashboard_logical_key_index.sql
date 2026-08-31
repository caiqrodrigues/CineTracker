create index if not exists idx_media_logical_key_v0997
on public.media (
  (case
    when public.cinetracker_effective_tmdb_id(tmdb_id,raw_tmdb)>0
      then media_type||':'||public.cinetracker_effective_tmdb_id(tmdb_id,raw_tmdb)::text
    else media_type||':id:'||id::text
  end)
);
