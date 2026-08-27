-- CineTracker Web 0.99.4
-- User-confirmed catalog correction: the imported Bingers movie "Me Time" (2022)
-- is the John Hamburg comedy with Kevin Hart / Mark Wahlberg (TMDB 862551),
-- not the German documentary TMDB 980417 that was selected by ambiguous title/year enrichment.

update public.media
set
  tmdb_id = 862551,
  title = 'Me Time',
  original_title = 'Me Time',
  release_year = 2022,
  poster_path = '/8mVClnhqJuP4JXaXx36LnypMwSI.jpg',
  runtime_minutes = 104,
  genres = '[{"id":35,"name":"Comédia"}]'::jsonb,
  raw_tmdb = coalesce(raw_tmdb,'{}'::jsonb)
    || jsonb_build_object(
      'id', 862551,
      'source_tmdb_id', 862551,
      'original_surrogate_tmdb_id', -1520469972,
      'title', 'Me Time',
      'original_title', 'Me Time',
      'release_date', '2022-08-26',
      'runtime', 104,
      'status', 'Released',
      'imdb_id', 'tt14309446',
      'poster_path', '/8mVClnhqJuP4JXaXx36LnypMwSI.jpg',
      'original_language', 'en',
      'user_confirmed_catalog_identity', true,
      'catalog_corrected_at', now()
    ),
  updated_at = now()
where media_type = 'movie'
  and release_year = 2022
  and lower(replace(title, chr(160), ' ')) = 'me time'
  and (tmdb_id = -1520469972 or tmdb_id = 980417);

update public.watch_history wh
set external_ids = coalesce(wh.external_ids,'{}'::jsonb) || jsonb_build_object('tmdb_id',862551)
from public.media m
where wh.media_id = m.id
  and wh.item_type = 'movie'
  and m.media_type = 'movie'
  and m.tmdb_id = 862551
  and lower(replace(coalesce(wh.title,m.title), chr(160), ' ')) = 'me time';
