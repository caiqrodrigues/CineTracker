import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

for (const base of ['dist', 'apps/web/dist']) {
  const js = await readFile(base + '/patch-v133-v0997-primary-authority.js', 'utf8');
  new vm.Script(js);
  assert.ok(js.includes('r137-rpc-timeout-native-nav'), base + ': r137 marker missing');
  assert.ok(js.includes('new AbortController()'), base + ': AbortController missing');
  assert.ok(js.includes('signal:ctrl.signal'), base + ': abort signal missing');
  assert.ok(js.includes('Tempo limite ao carregar'), base + ': timeout message missing');
  assert.ok(js.includes('ct137-native-nav-link'), base + ': native nav missing');
  assert.ok(js.includes("installNativeNav137('/'+route)"), base + ': primary route nav rebuild missing');
  assert.ok(js.includes('Promise.race([homeData()'), base + ': Home deadline missing');
  assert.ok(!js.includes('ranked.slice(0,60)'), base + ': blocking Home enrichment returned');
  assert.ok(!js.includes('new MutationObserver('), base + ': observer loop returned');
}

console.log('WEB_R137_OK rpc=abortable home=deadline nav=native-single');
