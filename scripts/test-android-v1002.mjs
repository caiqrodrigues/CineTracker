import fs from 'node:fs';
const file='apps/android/app/src/main/assets/hotfix5/index.html';
const html=fs.readFileSync(file,'utf8');
const must=[
  'name="ct-official-version" content="1.0.2"',
  "window.__ctR244='f1-hub-rewatch-functional-sports-cleanup-android'",
  "window.__ctAndroidOfficialVersion='1.0.2'",
  'window.__ctAndroidOfficialCode=10044',
  "cinetracker_mark_watch_v0994",
  "p_mode:mode",
  "[data-ct171-rewatch-media],[data-ct171-rewatch-episode],[data-rewatch-episode]",
  "stopImmediatePropagation",
  "https://api.jolpi.ca/ergast/f1",
  "current/driverstandings",
  "current/constructorstandings",
  "current/last/results",
  "current/last/qualifying",
  "🏁 Fórmula 1",
  "Calendário, classificação, equipes, grid e resultados",
  "remove-status-statistics-summary-card-runtime",
  "watchlist-swap-uses-active-ct186-selected-pool",
  "native-webview-horizontal-no-manual-touch"
];
for(const x of must) if(!html.includes(x)) throw new Error(`Android 1.0.2 assertion failed: ${x}`);
const r206=html.lastIndexOf("window.__ctR244='f1-hub-rewatch-functional-sports-cleanup-android'");
const r221=html.lastIndexOf("window.__ctR221Rewatch='persistent-2x-3x-4x-no-disable'");
if(r206<r221) throw new Error('Functional 1.0.2 patch is not after legacy r221 runtime');
console.log('Android 1.0.2 functional runtime test passed.');