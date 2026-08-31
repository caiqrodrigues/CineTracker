import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const [html,js,css,sw,pkg]=await Promise.all([
  readFile('dist/index.html','utf8'),
  readFile('dist/app-v158.js','utf8'),
  readFile('dist/app-v158.css','utf8'),
  readFile('dist/service-worker.js','utf8'),
  readFile('package.json','utf8').then(JSON.parse)
]);

assert.equal((html.match(/<script\b/g)||[]).length,1,'final HTML must load exactly one application script');
assert.ok(html.includes('/app-v158.js?ct=r158-adjustments'),'r158 single runtime missing');
assert.ok(!/patch-v\d|hotfix/i.test(html),'legacy patch/hotfix leaked into final HTML');
assert.ok(js.includes("window.__ctRuntimeAuthority='single-clean-runtime'"),'single authority marker missing');
assert.ok(!js.includes('MutationObserver'),'legacy observer authority leaked');

for(const token of [
  'data-home-mark-episode',
  'data-home-mark-movie',
  'cinetracker_mark_episode_v0994',
  'cinetracker_mark_watch_v0994',
  'home-history',
  'role para cima para revelar',
  'Indicação do dia',
  '100% novos',
  '1 Filme · 1 Série · 1 Anime',
  'Lançamentos',
  'Minha Watchlist',
  'cinetracker_calendar_watchlist_v0997',
  'discover-carousel',
  'data-add-favorite',
  'favorite_actors',
  "state:'Liked'",
  '🏆 Esportes',
  'cinetracker_sports_payload_v1',
  'ct-sports-sync'
]) assert.ok(js.includes(token),`r158 final runtime missing: ${token}`);

assert.ok(css.includes('.discover-carousel'),'dedicated lateral Discover carousel CSS missing');
assert.ok(css.includes('.home-viewport'),'hidden Home history viewport CSS missing');
assert.ok(css.includes('.favorite-overlay'),'favorite add search UI CSS missing');
assert.ok(sw.includes('ct-web-0.99.7-r158-adjustments'),'r158 service worker cache missing');
assert.equal(pkg.scripts.build,'node scripts/build-web-v158-adjustments.mjs && node scripts/test-web-v158-adjustments.mjs','package build must use only r158 single-runtime pipeline');

console.log('WEB_R158_TEST_OK scripts=1 patches=0 home=checks+hidden-history discover=foryou+carousel+watchlist-calendar profile=favorite-add sports=separate');
