import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile('dist/index.html','utf8');
const patch = await readFile('dist/patch-v099-v0994-web.js','utf8');
const pkg = await readFile('package.json','utf8');
const sw = await readFile('apps/web/service-worker.js','utf8');
assert.match(pkg,/"version": "0\.99\.4"/);
assert.match(sw,/ct-web-0\.99\.4/);
assert.ok(html.includes('<script src="/patch-v099-v0994-web.js"></script>'));
assert.doesNotThrow(()=>new vm.Script(patch));
assert.match(patch,/cinetracker_profile_home_payload_v0994/);
assert.match(patch,/cinetracker_profile_remaining_v0994/);
assert.match(patch,/Juntando poeira/);
assert.match(patch,/Assistir a seguir \/ Watchlist/);
assert.match(patch,/CineTracker • v0\.99\.4/);
assert.ok(!/\['history'/.test(patch));
console.log('WEB_0994_OK home=authoritative profile=remaining watchlist=full history-nav=removed');
