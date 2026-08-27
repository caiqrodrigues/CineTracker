import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile('dist/index.html','utf8');
const pre = await readFile('dist/patch-v101-v0994-nav-pre.js','utf8');
const runtime = await readFile('dist/patch-v099-v0994-web.js','utf8');
const auth = await readFile('dist/patch-v103-v0994-session-gate.js','utf8');
const authority = await readFile('dist/patch-v104-v0994-authority.js','utf8');
const preload = await readFile('dist/patch-v105-v0994-preload-layout.js','utf8');
const legacyDiscover = await readFile('dist/patch-v092-v0991.js','utf8');
const pkg = await readFile('package.json','utf8');
const sw = await readFile('apps/web/service-worker.js','utf8');
const runtimeTag = '<script src="/patch-v099-v0994-web.js"></script>';
const authTag = '<script src="/patch-v103-v0994-session-gate.js"></script>';
const authorityTag = '<script src="/patch-v104-v0994-authority.js"></script>';
const preloadTag = '<script src="/patch-v105-v0994-preload-layout.js"></script>';

assert.match(pkg,/"version": "0\.99\.4"/,'package must stay 0.99.4');
assert.ok(!pkg.includes('apply-web-v0993.mjs'),'0.99.3 build layer must not run');
assert.ok(pkg.includes('apply-web-v0994-preload.mjs'),'0.99.4 preload build step missing');
assert.match(sw,/ct-web-0\.99\.4/,'service worker cache must be 0.99.4');
assert.equal((html.match(/patch-v101-v0994-nav-pre\.js/g)||[]).length,1,'0.99.4 pre-gate duplicated');
assert.equal((html.match(/patch-v099-v0994-web\.js/g)||[]).length,1,'0.99.4 runtime duplicated');
assert.equal((html.match(/patch-v103-v0994-session-gate\.js/g)||[]).length,1,'0.99.4 session gate duplicated');
assert.equal((html.match(/patch-v104-v0994-authority\.js/g)||[]).length,1,'0.99.4 authority duplicated');
assert.equal((html.match(/patch-v105-v0994-preload-layout\.js/g)||[]).length,1,'0.99.4 preload/layout duplicated');
assert.ok(html.includes('patch-v095-v0992-fix.js'),'required 0.99.2 compatibility layer missing');
assert.ok(!html.includes('patch-v097-v0993-nav-pre.js'),'0.99.3 pre-gate must not be emitted');
assert.ok(!html.includes('patch-v098-v0993-web.js'),'0.99.3 final layer must not be emitted');
assert.ok(!html.includes('patch-v102-v0994-mobile-nav-fix.js'),'broken mobile canonicalizer must not be emitted');
assert.ok(html.indexOf(authTag)>html.indexOf(runtimeTag),'session gate must load after 0.99.4 runtime');
assert.ok(html.indexOf(authorityTag)>html.indexOf(authTag),'single renderer authority must load after session gate');
assert.ok(html.indexOf(preloadTag)>html.indexOf(authorityTag),'preload/layout must load after authority');
assert.ok(html.includes("if (false && localStorage.getItem(resetKey) !== '1') {"),'legacy destructive session reset must be disabled');
assert.ok(!html.includes("if (localStorage.getItem(resetKey) !== '1') {"),'active legacy destructive session reset must not remain');
assert.doesNotThrow(()=>new vm.Script(pre),'0.99.4 pre-gate syntax invalid');
assert.doesNotThrow(()=>new vm.Script(runtime),'0.99.4 runtime syntax invalid');
assert.doesNotThrow(()=>new vm.Script(auth),'0.99.4 session gate syntax invalid');
assert.doesNotThrow(()=>new vm.Script(authority),'0.99.4 authority syntax invalid');
assert.doesNotThrow(()=>new vm.Script(preload),'0.99.4 preload/layout syntax invalid');

assert.match(pre,/grid-template-columns:180px minmax\(0,1fr\)!important/,'desktop original grid geometry must be preserved');
assert.match(pre,/position:sticky!important/,'desktop Sidebar must remain in normal layout flow');
assert.ok(!pre.includes('position:fixed!important'),'desktop Sidebar must not be removed from layout flow');
assert.match(pre,/z-index:9999!important/,'desktop Sidebar stacking guard missing');
assert.match(pre,/pointer-events:auto!important/,'desktop pointer-events guard missing');
assert.match(pre,/addEventListener\('pointerdown'/,'Profile/Settings pointerdown capture missing');
assert.match(pre,/target!=='profile'&&target!=='settings'/,'pointerdown must target Profile and Settings only');
assert.match(pre,/stopImmediatePropagation/,'legacy click interception guard missing');
assert.match(pre,/elementsFromPoint/,'desktop hit-test diagnostic missing');
assert.match(pre,/topIsButton/,'desktop hit-test must verify physical button ownership');

assert.match(runtime,/cinetracker_profile_home_payload_v0994/,'authoritative Home RPC missing');
assert.match(runtime,/cinetracker_profile_remaining_v0994/,'remaining-time profile RPC missing');
assert.match(runtime,/window\.__ct0994PreloadedHome/,'Home must consume preloaded payload before requesting again');
assert.match(runtime,/data-ct994-owner="1"/,'0.99.4 shell ownership marker missing');
assert.match(runtime,/Boolean\(b\.poster_path\)/,'movie Watchlist must prioritize already enriched rows visually');
assert.ok(!runtime.includes('new MutationObserver('),'0.99.4 runtime must not create DOM observer loops');
assert.ok(!runtime.includes('setInterval('),'0.99.4 runtime must not create permanent polling loops');

assert.match(auth,/ctSession\?\.access_token/,'session gate must inspect the real authenticated session');
assert.match(auth,/restoreSession/,'session gate must try to restore the browser session');
assert.match(auth,/renderAuth/,'session gate must return unauthenticated users to login');
assert.match(auth,/sbRpc = async function/,'session gate must protect data RPC calls');
assert.match(auth,/window\.__ct0994PreloadCore/,'session gate must preload the destination before first render');
assert.match(auth,/window\.__ct0994Navigate = guardedNavigate994/,'session gate must protect 0.99.4 navigation');
assert.match(auth,/rawSignIn994/,'session gate must preserve login flow');
assert.ok(!auth.includes("localStorage.removeItem('cinetracker_session')"),'session gate must never erase the persisted session');

assert.match(authority,/v104-single-renderer/,'0.99.4 single renderer marker missing');
assert.match(authority,/window\.render=guardedRender/,'legacy global render must be fenced after authentication');
assert.match(authority,/window\.ct991Navigate=navigateAuthoritative/,'0.99.1 global router must yield to 0.99.4');
assert.match(authority,/window\.ct0992Navigate=navigateAuthoritative/,'0.99.2 global router must yield to 0.99.4');
assert.match(authority,/\[90,380,820,980,1400,2200\]/,'finite startup authority repairs missing');
assert.ok(!authority.includes('new MutationObserver('),'authority must not add another DOM observer loop');
assert.ok(!authority.includes('setInterval('),'authority must not poll forever');

assert.match(legacyDiscover,/movieSeed=watch\.filter\(x=>x\.media_type==='movie'&&Number\(x\.tmdb_id\)>0&&validRec991\(x\)\)\.slice\(0,48\)/,'Discover must consider the expanded eligible official watchlist pool');
assert.ok(!legacyDiscover.includes("movieSeed=watch.filter(x=>x.media_type==='movie').slice(0,16)"),'legacy 16-item movie seed must not remain in emitted 0.99.4');
assert.match(legacyDiscover,/window\.__ct991Preload=/,'Profile dashboard preload export missing');
assert.match(legacyDiscover,/window\.__ct991PreloadDiscover=/,'Discover preload export missing');
assert.match(legacyDiscover,/window\.__ct991PreloadDiscover\?window\.__ct991PreloadDiscover\(\):recommendationData991\(\)/,'Discover must consume its warmed result');
assert.ok(!legacyDiscover.includes('try{await fetchDashboard991(true);renderProfileBody991()}'),'Profile must not discard a warmed dashboard on every navigation');

assert.match(preload,/v105-preload-desktop-frame/,'preload/layout marker missing');
assert.match(preload,/cinetracker_profile_home_payload_v0994/,'preloader must warm Home payload');
assert.match(preload,/window\.__ct991PreloadDiscover/,'preloader must warm Discover in background');
assert.match(preload,/HOME_CACHE_TTL/,'short-lived authenticated Home cache missing');
assert.match(preload,/new Image\(\)/,'poster preloading missing');
assert.match(preload,/\.content\{margin:0!important;max-width:none!important/,'desktop content framing override missing');
assert.match(preload,/max-width:1280px!important/,'desktop visible content frame missing');
assert.match(preload,/overflow-x:hidden!important/,'page-level horizontal overflow guard missing');
assert.ok(!preload.includes('new MutationObserver('),'preloader/layout must not add DOM observer loops');
assert.ok(!preload.includes('setInterval('),'preloader/layout must not poll forever');

console.log('WEB_0994_OK auth=restored preload=home-profile-discover movies=enriched-first desktop=framed navigation=clickable');
