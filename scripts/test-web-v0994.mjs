import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile('dist/index.html','utf8');
const pre = await readFile('dist/patch-v101-v0994-nav-pre.js','utf8');
const runtime = await readFile('dist/patch-v099-v0994-web.js','utf8');
const pkg = await readFile('package.json','utf8');
const sw = await readFile('apps/web/service-worker.js','utf8');
const preTag = '<script src="/patch-v101-v0994-nav-pre.js"></script>';
const legacyTag = '<script src="/patch-v088-v098-nav-pre.js"></script>';
const fixTag = '<script src="/patch-v095-v0992-fix.js"></script>';
const runtimeTag = '<script src="/patch-v099-v0994-web.js"></script>';

assert.match(pkg,/"version": "0\.99\.4"/,'package must stay 0.99.4');
assert.ok(!pkg.includes('apply-web-v0993.mjs'),'0.99.3 build layer must not run');
assert.match(sw,/ct-web-0\.99\.4/,'service worker cache must be 0.99.4');
assert.equal((html.match(/patch-v101-v0994-nav-pre\.js/g)||[]).length,1,'0.99.4 pre-gate duplicated');
assert.equal((html.match(/patch-v099-v0994-web\.js/g)||[]).length,1,'0.99.4 runtime duplicated');
assert.ok(html.includes(preTag),'0.99.4 pre-gate missing');
assert.ok(html.includes(runtimeTag),'0.99.4 runtime missing');
assert.ok(html.indexOf(preTag)<html.indexOf(legacyTag),'0.99.4 pre-gate must load before legacy nav pre-gate');
assert.ok(html.indexOf(preTag)<html.indexOf(fixTag),'0.99.4 pre-gate must load before 0.99.2 capture listener');
assert.ok(html.indexOf(runtimeTag)>html.indexOf(fixTag),'0.99.4 runtime must load after stable legacy renderers');
assert.ok(!html.includes('patch-v097-v0993-nav-pre.js'),'0.99.3 pre-gate must not be emitted');
assert.ok(!html.includes('patch-v098-v0993-web.js'),'0.99.3 final layer must not be emitted');
assert.ok(!html.includes('patch-v100-v0994-authority.js'),'obsolete authority loop must not be emitted');
assert.doesNotThrow(()=>new vm.Script(pre),'0.99.4 desktop pre-gate syntax invalid');
assert.doesNotThrow(()=>new vm.Script(runtime),'0.99.4 runtime syntax invalid');

assert.match(pre,/z-index:9999!important/,'desktop Sidebar z-index guard missing');
assert.match(pre,/pointer-events:auto!important/,'desktop pointer-events guard missing');
assert.match(pre,/z-index:10001!important/,'desktop nav-button z-index guard missing');
assert.match(pre,/\.content\{position:relative!important;z-index:1!important/,'content stacking guard missing');
assert.match(pre,/stopImmediatePropagation/,'capture click ownership missing');
assert.match(pre,/window\.__ct0994Navigate/,'pre-gate must delegate only to 0.99.4 router');
assert.match(pre,/elementsFromPoint/,'desktop hit-test diagnostic missing');
assert.match(pre,/topIsButton/,'desktop hit-test must report actual hit target');
assert.match(pre,/target==='history'\?'profile'/,'legacy History normalization missing');

assert.match(runtime,/const stableLegacyNavigate/,'stable Profile/Discover/Settings renderer bridge missing');
assert.match(runtime,/function shell994/,'0.99.4 must own its application shell');
assert.match(runtime,/cinetracker_profile_home_payload_v0994/,'authoritative Home RPC missing');
assert.match(runtime,/cinetracker_profile_remaining_v0994/,'remaining-time profile RPC missing');
assert.match(runtime,/Juntando poeira/,'Juntando poeira section missing');
assert.match(runtime,/Assistir a seguir \/ Watchlist/,'movie watchlist section missing');
assert.match(runtime,/movieLimit994=120/,'large movie watchlist chunking missing');
assert.match(runtime,/Mostrar mais/,'full watchlist pagination control missing');
assert.match(runtime,/window\.__ct0994Navigate=navigate994/,'authoritative router export missing');
assert.match(runtime,/window\.ct0992Navigate=navigate994/,'legacy router takeover missing');
assert.match(runtime,/window\.ct991Navigate=navigate994/,'profile/discover router takeover missing');
assert.ok(!runtime.includes('new MutationObserver('),'0.99.4 runtime must not create DOM observer loops');
assert.ok(!runtime.includes('setInterval('),'0.99.4 runtime must not create permanent polling loops');
assert.ok(!/\['history'/.test(runtime),'History must not be canonical navigation');
for(const route of ['home','discover','profile','settings'])assert.ok(runtime.includes(`'${route}'`),`route ${route} missing`);
assert.match(runtime,/CineTracker • v0\.99\.4/,'0.99.4 footer missing');

console.log('WEB_0994_OK runtime=single desktop-pointer=guarded hit-test=ready routes=4 home=direct profile=remaining watchlist=chunked-full history=removed');
