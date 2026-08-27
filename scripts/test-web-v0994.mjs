import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile('dist/index.html','utf8');
const pre = await readFile('dist/patch-v101-v0994-nav-pre.js','utf8');
const runtime = await readFile('dist/patch-v099-v0994-web.js','utf8');
const post = await readFile('dist/patch-v102-v0994-mobile-nav-fix.js','utf8');
const pkg = await readFile('package.json','utf8');
const sw = await readFile('apps/web/service-worker.js','utf8');
const preTag = '<script src="/patch-v101-v0994-nav-pre.js"></script>';
const legacyTag = '<script src="/patch-v088-v098-nav-pre.js"></script>';
const runtimeTag = '<script src="/patch-v099-v0994-web.js"></script>';
const postTag = '<script src="/patch-v102-v0994-mobile-nav-fix.js"></script>';

assert.match(pkg,/"version": "0\.99\.4"/,'package must stay 0.99.4');
assert.ok(!pkg.includes('apply-web-v0993.mjs'),'0.99.3 build layer must not run');
assert.match(sw,/ct-web-0\.99\.4/,'service worker cache must be 0.99.4');
for(const tag of [preTag,runtimeTag,postTag])assert.ok(html.includes(tag),`missing ${tag}`);
assert.equal((html.match(/patch-v101-v0994-nav-pre\.js/g)||[]).length,1,'0.99.4 pre-gate duplicated');
assert.equal((html.match(/patch-v099-v0994-web\.js/g)||[]).length,1,'0.99.4 runtime duplicated');
assert.equal((html.match(/patch-v102-v0994-mobile-nav-fix\.js/g)||[]).length,1,'0.99.4 post-gate duplicated');
assert.ok(html.indexOf(preTag)<html.indexOf(legacyTag),'0.99.4 pre-gate must load before legacy nav pre-gate');
assert.ok(html.indexOf(postTag)>html.indexOf(runtimeTag),'mobile canonicalizer must load after 0.99.4 runtime');
for(const legacy of ['patch-v093-v0992.js','patch-v094-v0992-compat.js','patch-v095-v0992-fix.js','patch-v096-v0992-unfreeze.js','patch-v097-v0993-nav-pre.js','patch-v098-v0993-web.js','patch-v100-v0994-authority.js'])assert.ok(!html.includes(legacy),`${legacy} must not be emitted`);
assert.doesNotThrow(()=>new vm.Script(pre),'0.99.4 desktop pre-gate syntax invalid');
assert.doesNotThrow(()=>new vm.Script(runtime),'0.99.4 runtime syntax invalid');
assert.doesNotThrow(()=>new vm.Script(post),'0.99.4 mobile/nav post-gate syntax invalid');

assert.match(pre,/z-index:9999!important/,'desktop Sidebar z-index guard missing');
assert.match(pre,/pointer-events:auto!important/,'desktop pointer-events guard missing');
assert.match(pre,/z-index:10001!important/,'desktop nav-button z-index guard missing');
assert.match(pre,/stopImmediatePropagation/,'capture click ownership missing');
assert.match(pre,/window\.__ct0994Navigate/,'pre-gate must delegate only to 0.99.4 router');
assert.match(pre,/elementsFromPoint/,'desktop hit-test diagnostic missing');

assert.match(runtime,/const stableLegacyNavigate = window\.ct991Navigate/,'0.99.4 must prefer 0.99.1 stable renderers');
assert.match(runtime,/function shell994/,'0.99.4 must own its application shell');
assert.match(runtime,/cinetracker_profile_home_payload_v0994/,'authoritative Home RPC missing');
assert.match(runtime,/cinetracker_profile_remaining_v0994/,'remaining-time profile RPC missing');
assert.match(runtime,/Juntando poeira/,'Juntando poeira section missing');
assert.match(runtime,/Assistir a seguir \/ Watchlist/,'movie watchlist section missing');
assert.match(runtime,/movieLimit994=120/,'large movie watchlist chunking missing');
assert.match(runtime,/window\.__ct0994Navigate=navigate994/,'authoritative router export missing');
assert.ok(!runtime.includes('new MutationObserver('),'0.99.4 runtime must not create DOM observer loops');
assert.ok(!runtime.includes('setInterval('),'0.99.4 runtime must not create permanent polling loops');

assert.match(post,/max-device-width:900px/,'physical mobile-device breakpoint guard missing');
assert.match(post,/pointer:coarse/,'touch-device mobile guard missing');
assert.match(post,/\.sidebar\{display:none!important\}/,'mobile sidebar must be hidden');
assert.match(post,/\.mobile-nav\{display:grid!important/,'mobile bottom navigation must be forced visible');
assert.match(post,/const NAV=\[\['home'/,'canonical four-item navigation missing');
assert.match(post,/if\(sig!==want\)desk\.innerHTML=buttons/,'desktop duplicate-nav cleanup missing');
assert.match(post,/if\(sig!==want\)mobile\.innerHTML=buttons/,'mobile duplicate-nav cleanup missing');

console.log('WEB_0994_OK runtime=single legacy0992=removed desktop-pointer=guarded mobile=device-aware nav=canonical routes=4 home=direct profile=remaining watchlist=chunked-full');
