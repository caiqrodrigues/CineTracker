import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';

const [html,js,css,sw,pkg,migration]=await Promise.all([
  readFile('dist/index.html','utf8'),
  readFile('dist/app-v159.js','utf8'),
  readFile('dist/app-v159.css','utf8'),
  readFile('dist/service-worker.js','utf8'),
  readFile('package.json','utf8').then(JSON.parse),
  readFile('supabase/migrations/20260831122500_sports_watch_history_stats_v1.sql','utf8')
]);

assert.equal((html.match(/<script\b/g)||[]).length,1,'final HTML must still load exactly one application script');
assert.ok(html.includes('/app-v159.js?ct=r159-sports-watch'),'r159 runtime tag missing');
assert.ok(html.includes('/app-v159.css?ct=r159-sports-watch'),'r159 stylesheet tag missing');
assert.ok(!/app-v158\.(js|css)/.test(html),'r158 physical assets must not remain referenced');
assert.ok(!/patch-v\d|hotfix/i.test(html),'legacy runtime leaked into final HTML');
assert.ok(js.includes("window.__ctRuntimeAuthority='single-clean-runtime'"),'single authority marker missing');
assert.ok(js.includes("const REVISION='r159-sports-watch';"),'r159 revision marker missing');
assert.ok(!js.includes('MutationObserver'),'legacy observer authority leaked');

for(const token of [
  'cinetracker_sport_mark_watched_v1',
  'cinetracker_sport_stats_v1',
  'data-sport-watch',
  '✓ Marcar assistido',
  '✓ Assistido',
  "['watched','Assistidos']",
  'Histórico assistido',
  'watch_history',
  'Tempo em esportes',
  'Eventos esportivos',
  'sports_minutes',
  'profileCache?.stats?.total_minutes',
  '🏆 Esportes',
  'cinetracker_sports_payload_v1',
  'ct-sports-sync',
  'Indicação do dia',
  'Minha Watchlist',
  'data-home-mark-episode'
]) assert.ok(js.includes(token),`r159 final runtime missing: ${token}`);

for(const token of ['.sport-watch','.event.watched','.sport-watched-meta','.sports-summary-r159'])assert.ok(css.includes(token),`r159 CSS missing: ${token}`);
assert.ok(sw.includes('ct-web-0.99.7-r159-sports-watch'),'r159 service worker cache missing');

for(const token of [
  'create table if not exists public.user_sport_watch_history',
  'cinetracker_sport_mark_watched_v1',
  'cinetracker_sport_stats_v1',
  'duration_minutes integer not null',
  'unique(profile_id,event_id)',
  'alter table public.user_sport_watch_history replica identity full',
  "tablename='user_sport_watch_history'",
  "'stats',public.cinetracker_sport_stats_v1()",
  "'watch_history'"
]) assert.ok(migration.includes(token),`sports migration missing: ${token}`);

await assert.rejects(()=>access('dist/app-v158.js'),'app-v158.js must be removed from final dist');
await assert.rejects(()=>access('dist/app-v158.css'),'app-v158.css must be removed from final dist');
assert.equal(pkg.scripts.build,'node scripts/build-web-v158-adjustments-v2.mjs && node scripts/test-web-v158-adjustments.mjs && node scripts/build-web-v159-sports-watch.mjs && node scripts/test-web-v159-sports-watch.mjs','package build must produce and verify only final r159 runtime');

console.log('WEB_R159_TEST_OK scripts=1 patches=0 sports=watched+history+time profile=total+sport-time r158=preserved');
