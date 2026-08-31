import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';

const [html,js,css,sw,pkg,release,vercel,workflow]=await Promise.all([
  readFile('dist/index.html','utf8'),
  readFile('dist/app-v161.js','utf8'),
  readFile('dist/app-v161.css','utf8'),
  readFile('dist/service-worker.js','utf8'),
  readFile('package.json','utf8').then(JSON.parse),
  readFile('dist/release.json','utf8').then(JSON.parse),
  readFile('vercel.json','utf8').then(JSON.parse),
  readFile('.github/workflows/verify.yml','utf8')
]);

assert.equal((html.match(/<script\b/g)||[]).length,1,'final HTML must load exactly one application script');
assert.ok(html.includes('/app-v161.js?ct=r161-release-guard'),'r161 script missing');
assert.ok(html.includes('/app-v161.css?ct=r161-release-guard'),'r161 css missing');
assert.ok(html.includes('name="ct-revision" content="r161-release-guard"'),'r161 meta revision missing');
assert.ok(!/app-v1(?:58|59|60)\.(js|css)/.test(html),'older physical assets remain referenced');
assert.ok(!/patch-v\d|hotfix/i.test(html),'legacy patch/hotfix leaked into final HTML');
assert.ok(js.includes("window.__ctRuntimeAuthority='single-clean-runtime'"),'single runtime authority missing');
assert.ok(js.includes("const REVISION='r161-release-guard';"),'r161 revision missing');
assert.ok(!js.includes('MutationObserver'),'legacy observer authority leaked');

for(const token of [
  "window.__ctReleaseGuard='r161-release-guard'",
  "fetch('/release.json?ct='+Date.now()",
  "cache:'no-store'",
  'window.__ctCheckRelease=checkRelease161',
  "sportsState.tab==='yesterday'",
  "b.dataset.sportsTab='yesterday'",
  "b.textContent='Ontem'",
  "title.textContent='Jogos de ontem'",
  'shiftDays(-1)',
  'Últimos 7 dias',
  'Tempo esportivo assistido',
  'cinetracker_sport_mark_watched_v1',
  'data-sport-watch',
  'watchedAt161',
  '[...episodes].sort((a,b)=>watchedAt161(a)-watchedAt161(b))',
  '[...movies].sort((a,b)=>watchedAt161(a)-watchedAt161(b))',
  'paintHome159For160()',
  'data-home-mark-episode',
  'Minha Watchlist',
  'Indicação do dia',
  '🏆 Esportes'
])assert.ok(js.includes(token),`r161 final runtime missing: ${token}`);

assert.ok(sw.includes('ct-web-0.99.7-r161-release-guard'),'r161 service worker cache missing');
assert.equal(release.version,'0.99.7');
assert.equal(release.revision,'r161-release-guard');
assert.equal(release.runtime,'single-clean-runtime');
assert.equal(vercel.rewrites.length,1,'Vercel should use one extensionless SPA rewrite');
assert.equal(vercel.rewrites[0].source,'/((?!.*\\.).*)','Vercel SPA rewrite must exclude physical files with extensions');
assert.equal(vercel.rewrites[0].destination,'/index.html');
assert.ok(vercel.headers.some(x=>x.source==='/release.json'&&x.headers?.some(h=>h.key==='Cache-Control'&&/no-store/.test(h.value))),'release.json must be no-store');
assert.ok(workflow.includes('Production domain serves r161'),'production smoke job missing');
assert.ok(workflow.includes('https://mycinetracker.vercel.app/release.json'),'production domain release check missing');
await assert.rejects(()=>access('dist/app-v160.js'),'app-v160.js must be removed from final dist');
await assert.rejects(()=>access('dist/app-v160.css'),'app-v160.css must be removed from final dist');
assert.ok(pkg.scripts.build.includes('build-web-v161-release-guard.mjs'),'package build must include r161 finalizer');
assert.equal(pkg.scripts.verify,'node scripts/test-web-v161-release-guard.mjs','verify must target r161');
console.log('WEB_R161_TEST_OK scripts=1 release=auto-guard sports=yesterday+recent home=watched_at-deterministic vercel=asset-safe');
