# CineTracker Web r162

Requested behavior locked for this release:

- Home uses effective catch-up: historical missing episodes remain counted but do not force an actively followed series out of `Em dia` when the latest released coordinate is watched.
- Home watch action synchronizes Home, History and statistics before the action is considered complete.
- Manual `episode_progress` writes are guarded in the database so missing History/play-event rows are created automatically.
- `Pra você` includes 1 Movie + 1 Series + 1 Anime from the user's Watchlist, plus daily recommendation and 100% new picks.
- Discover tabs remain one horizontal non-wrapping scroll row.
- Sports deduplicates providers and, when yesterday is sparse, forces one exact-yesterday refresh through `ct-sports-sync` v2 before trusting the cached snapshot.
- Profile layout is intentionally not changed in r162.
