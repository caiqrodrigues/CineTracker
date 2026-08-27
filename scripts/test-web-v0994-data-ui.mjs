import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html=await readFile('dist/index.html','utf8');
const legacy=await readFile('dist/patch-v092-v0991.js','utf8');
const authority=await readFile('dist/patch-v104-v0994-authority.js','utf8');
const layer=await readFile('dist/patch-v107-v0994-data-ui-fix.js','utf8');

assert.equal((html.match(/patch-v107-v0994-data-ui-fix\.js/g)||[]).length,1,'v107 must be emitted exactly once');
assert.doesNotThrow(()=>new vm.Script(layer),'v107 syntax invalid');
assert.doesNotThrow(()=>new vm.Script(authority),'authority syntax invalid');
assert.match(layer,/flex-direction:column-reverse/,'hidden history must reveal newest item first');
assert.match(layer,/Gerenciamento de Dados/,'settings data management normalization missing');
assert.match(layer,/ct0994_home_preload_v1/,'stale Home preload must be invalidated once');
assert.match(legacy,/v107-strict-discovery-exclusion/,'strict personal discovery exclusions missing');
assert.match(legacy,/cinetracker_discovery_exclusions_v0994/,'backend discovery exclusion RPC missing');
assert.match(legacy,/original_title/,'title aliases must participate in discovery exclusions');
assert.match(legacy,/v107-strict-global-discovery/,'global discovery exclusion missing');
assert.match(legacy,/v107-calendar-fast-stable/,'calendar stable implementation missing');
assert.match(legacy,/v107-preserve-discover-state/,'Discover selected tab must survive authority repairs');
assert.ok(!legacy.includes("function renderDiscover991(){setView991('discover');discover991.tab='foryou';discover991.filter='all'"),'legacy Discover reset must not remain');
assert.match(authority,/canonicalReady/,'authority must detect canonical views');
assert.match(authority,/options\.repair&&canonicalReady\(target\)/,'repair must not rebuild a valid view');
assert.match(authority,/!canonicalReady\(currentTarget\(\)\)/,'startup timers must be conditional');
console.log('WEB_0994_DATA_UI_OK history=newest-first discover=strict calendar=stable settings=unified authority=canonical-aware');
