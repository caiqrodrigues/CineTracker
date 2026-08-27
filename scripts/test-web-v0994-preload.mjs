import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html=await readFile('dist/index.html','utf8');
const preload=await readFile('dist/patch-v105-v0994-preload-layout.js','utf8');
const auth=await readFile('dist/patch-v103-v0994-session-gate.js','utf8');
const legacy=await readFile('dist/patch-v092-v0991.js','utf8');
const tag='<script src="/patch-v105-v0994-preload-layout.js"></script>';
const authority='<script src="/patch-v104-v0994-authority.js"></script>';

assert.equal((html.match(/patch-v105-v0994-preload-layout\.js/g)||[]).length,1,'preload/layout layer duplicated or absent');
assert.ok(html.indexOf(tag)>html.indexOf(authority),'preload/layout must run after 0.99.4 authority');
assert.doesNotThrow(()=>new vm.Script(preload),'preload/layout syntax invalid');
assert.match(auth,/window\.__ct0994PreloadCore/,'session gate must await route preload');
assert.match(legacy,/window\.__ct991Preload=/,'Profile preload export missing');
assert.match(legacy,/window\.__ct991PreloadDiscover=/,'Discover preload export missing');
assert.ok(!legacy.includes('try{await fetchDashboard991(true);renderProfileBody991()}'),'Profile still forces a cold dashboard reload');
assert.match(preload,/HOME_CACHE_TTL/,'short-lived authenticated Home cache missing');
assert.match(preload,/new Image\(\)/,'poster preheating missing');
assert.match(preload,/\.content\{margin:0!important;max-width:none!important/,'desktop framing override missing');
assert.match(preload,/max-width:1280px!important/,'desktop content frame missing');
assert.ok(!preload.includes('new MutationObserver('),'preload layer must not observe/rewrite DOM continuously');
assert.ok(!preload.includes('setInterval('),'preload layer must not poll forever');

console.log('WEB_0994_PRELOAD_OK home=warm profile=warm discover=warm posters=warm desktop=framed');
