import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html=await readFile('dist/index.html','utf8');
const primary=await readFile('dist/patch-v133-v0997-primary-authority.js','utf8');
const guard=await readFile('dist/auth-runtime-guard-v134.js','utf8');

assert.ok(primary.includes("window.__ct0997PrimaryReady=true"),'r136 primary-ready marker missing');
assert.ok(primary.includes("window.__ct0997PrimaryObserverSuppressed=true"),'r136 observer suppression marker missing');
assert.ok(primary.includes("r136-direct-sidebar-nav"),'r136 direct nav marker missing');
assert.ok(!primary.includes('new MutationObserver('),'r136 primary runtime must not create MutationObserver');
assert.ok(primary.includes('data-view99')&&primary.includes('data-view991'),'r136 legacy nav delegation missing');
assert.ok(primary.includes("void go(target==='settings'?'/configs':'/'+target)"),'r136 direct navigation authority missing');
assert.ok(guard.includes('r136-legacy-observer-cutoff'),'r136 auth guard marker missing');
assert.ok(guard.includes('legacyObserver && window.__ct0997PrimaryObserverSuppressed'),'auth guard must dynamically suppress pre-r133 observers');
assert.ok(!guard.includes('setInterval(protectAuthUi'),'auth guard must not poll forever');
for(const old of ['patch-v101-v0994-nav-pre.js','patch-v103-v0994-session-gate.js','patch-v104-v0994-authority.js','patch-v112-v0994-warm-boot.js','patch-v113-v0994-fluidity.js'])assert.ok(!html.includes(old),`${old} returned to final html`);
console.log('WEB_R136_OK observers=legacy-cutoff primary-observer=removed nav=direct-authority polling=bounded');
