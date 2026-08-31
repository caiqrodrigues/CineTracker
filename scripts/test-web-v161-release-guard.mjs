import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';

const [html,js,css,sw,pkg,release,vercel]=await Promise.all([
  readFile('dist/index.html','utf8'),
  readFile('dist/app-v164.js','utf8'),
  readFile('dist/app-v164.css','utf8'),
  readFile('dist/service-worker.js','utf8'),
  readFile('package.json','utf8').then(JSON.parse),
  readFile('dist/release.json','utf8').then(JSON.parse),
  readFile('vercel.json','utf8').then(JSON.parse)
]);

assert.equal((html.match(/<script\b/g)||[]).length,1,'final HTML must load exactly one application script');
assert.ok(html.includes('/app-v164.js?ct=r164-preload-sports-favorites'),'r164 script missing');
assert.ok(html.includes('/app-v164.css?ct=r164-preload-sports-favorites'),'r164 css missing');
assert.ok(html.includes('name="ct-revision" content="r164-preload-sports-favorites"'),'r164 meta revision missing');
assert.ok(!/app-v1(?:58|59|60|61)\.(js|css)/.test(html),'older physical assets remain referenced');
assert.ok(!/patch-v\d|hotfix/i.test(html),'legacy patch/hotfix leaked into final HTML');
assert.ok(js.includes("window.__ctRuntimeAuthority='single-clean-runtime'"),'single runtime authority missing');
assert.ok(js.includes("const REVISION='r164-preload-sports-favorites';"),'r164 revision missing');
assert.ok(!js.includes('MutationObserver'),'legacy observer authority leaked');

for(const token of [
  'window.__ct164Preload',
  'ct164Prefetch',
  "rpc('cinetracker_home_live_v0997_r3'",
  "rpc('cinetracker_profile_payload_v0997'",
  'discoverCache',
  'sportsPayload(false)',
  'visibilitychange',
  "window.addEventListener('focus'",
  'data-ct164-open-favorite',
  'cinetracker_sport_favorite_events_v2',
  'Últimos 30 dias + próximos 14',
  'Ver eventos',
  'data-sport-fav',
  'ct164OpenFavorite'
])assert.ok(js.includes(token),`r164 final runtime missing: ${token}`);

assert.ok(sw.includes('r164-preload-sports-favorites'),'r164 service worker cache missing');
assert.equal(release.version,'0.99.7');
assert.equal(release.revision,'r164-preload-sports-favorites');
assert.equal(release.runtime,'single-clean-runtime');
assert.equal(vercel.rewrites.length,1,'SPA rewrite must remain singular');
assert.equal(vercel.rewrites[0].source,'/(.*)');
assert.equal(vercel.rewrites[0].destination,'/index.html');
await assert.rejects(()=>access('dist/app-v161.js'),'app-v161.js must be removed from final dist');
await assert.rejects(()=>access('dist/app-v161.css'),'app-v161.css must be removed from final dist');
assert.ok(pkg.scripts.build.includes('build-web-v164-preload-sports-favorites.mjs'),'package build must include r164 finalizer');
console.log('WEB_R164_TEST_OK preload=home+discover+profile+sports sports-favorites=related-events');
