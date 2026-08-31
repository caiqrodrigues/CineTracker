import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';

const [html,js,css,sw,pkg]=await Promise.all([
  readFile('dist/index.html','utf8'),
  readFile('dist/app-v160.js','utf8'),
  readFile('dist/app-v160.css','utf8'),
  readFile('dist/service-worker.js','utf8'),
  readFile('package.json','utf8').then(JSON.parse)
]);

assert.equal((html.match(/<script\b/g)||[]).length,1,'final HTML must load exactly one application script');
assert.ok(html.includes('/app-v160.js?ct=r160-sports-recent-history-order'),'r160 script missing');
assert.ok(html.includes('/app-v160.css?ct=r160-sports-recent-history-order'),'r160 css missing');
assert.ok(!/app-v15[89]\.(js|css)/.test(html),'older physical assets remain referenced');
assert.ok(!/patch-v\d|hotfix/i.test(html),'legacy patch/hotfix leaked into final HTML');
assert.ok(js.includes("window.__ctRuntimeAuthority='single-clean-runtime'"),'single runtime authority missing');
assert.ok(js.includes("const REVISION='r160-sports-recent-history-order';"),'r160 revision missing');
assert.ok(!js.includes('MutationObserver'),'legacy observer authority leaked');

for(const token of [
  "shiftDays(-7)+'T00:00:00'",
  "sportsState.tab==='recent'",
  "dataset.sportsTab='recent'",
  'Últimos 7 dias',
  'Tempo assistido',
  'Tempo esportivo assistido',
  "dataset.sportsTimeBanner='1'",
  "date_from:shiftDays(-7),date_to:shiftDays(-1)",
  'cinetracker_sport_mark_watched_v1',
  'data-sport-watch',
  'history_episodes=[...episodes].reverse()',
  'history_movies=[...movies].reverse()',
  'data-home-mark-episode',
  'Minha Watchlist',
  'Indicação do dia',
  '🏆 Esportes'
]) assert.ok(js.includes(token),`r160 final runtime missing: ${token}`);

for(const token of ['.sports-time-banner','.sports-profile-time'])assert.ok(css.includes(token),`r160 CSS missing: ${token}`);
assert.ok(sw.includes('ct-web-0.99.7-r160-sports-recent-history-order'),'r160 service worker cache missing');
await assert.rejects(()=>access('dist/app-v159.js'),'app-v159.js must be removed from final dist');
await assert.rejects(()=>access('dist/app-v159.css'),'app-v159.css must be removed from final dist');

assert.ok(pkg.scripts.build.includes('build-web-v160-sports-recent-home-history.mjs'),'package build must include r160 finalizer');
assert.equal(pkg.scripts.verify,'node scripts/test-web-v160-sports-recent-home-history.mjs','verify must target r160');
console.log('WEB_R160_TEST_OK scripts=1 sports=recent7+explicit-time home=hidden-history-newest-first');
