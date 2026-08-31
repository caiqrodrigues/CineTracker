# r162 release verification

Production is not considered delivered until all are true:

- GitHub Web Verify succeeds.
- Android identity guard succeeds unchanged.
- Vercel deployment succeeds for the merge commit.
- `https://mycinetracker.vercel.app/release.json` reports `r162-home-discover-sports`.
- Production `app-v162.js` contains `home+history+stats` and `forced-yesterday` markers.
- After an authenticated Sports visit, yesterday's event count is rechecked in Supabase and must increase materially from the old 4-event snapshot when the fallback providers return data.
