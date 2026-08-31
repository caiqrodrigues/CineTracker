# r170 — reliability and regression fixes

- Coalesces identical read RPCs and retries transient Postgres statement timeouts without retrying mutation RPCs.
- Removes Home from the background preload stampede; Discover preload is sequential and paced.
- Fixes media creation by always supplying a valid `media_kind`, backed by a database trigger guard.
- Restores actor biography with English fallback, splits filmography into Filmes/Séries and restores actor favorite toggle.
- Makes Profile `Ver mais` controls open the complete matching collection.
- Related titles now mix movies and series and show type, genres, movie runtime, age rating and TMDB score.
- Adds media favorite toggle to movie/series details.
- Adds authenticated global sports entity search via `ct-sports-search`, querying local entities plus API-Sports/TheSportsDB.
