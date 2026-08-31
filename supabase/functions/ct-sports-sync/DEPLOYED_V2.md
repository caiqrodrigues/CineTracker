# ct-sports-sync v2

Production Edge Function `ct-sports-sync` is deployed as `sports-hub-v2` with JWT verification enabled.

Provider order:

1. API-Sports when `API_SPORTS_KEY` is configured server-side.
2. ESPN public scoreboard feeds as a complementary fallback for major soccer leagues, NBA/WNBA, NFL, NHL and MLB.
3. TheSportsDB fallback for remaining coverage.

The r162 Web client requests yesterday and today as separate date-scoped syncs. When yesterday is sparse, it performs one forced yesterday refresh so stale `sport_sync_state` rows cannot preserve the older four-event snapshot.

Do not expose provider keys in Web/Android clients.
