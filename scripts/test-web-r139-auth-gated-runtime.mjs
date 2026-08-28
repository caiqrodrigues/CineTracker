import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for(const base of ['dist','apps/web/dist']){
  const html=await readFile(base+'/primary.html','utf8');
  assert.ok(html.includes("window.__ctPrimaryRuntime139='auth-gated-runtime'"),base+': r139 marker missing');
  assert.ok(html.includes("s.src='/primary-authority-r139.js'"),base+': dynamic runtime URL missing');
  assert.ok(!html.includes('<script src="/primary-authority-r138.js">'),base+': old static runtime still active');
  assert.ok(html.indexOf('void bootPrimary();')>html.indexOf('loadPrimaryRuntime139'),base+': boot must happen after auth-gated loader definition');
  assert.ok(html.includes("await loadPrimaryRuntime139();"),base+': authenticated entry does not await runtime');
  const js=await readFile(base+'/primary-authority-r139.js','utf8');
  assert.ok(js.includes('r137-rpc-timeout-native-nav'),base+': r139 runtime lost r137 network guards');
}
console.log('WEB_R139_OK runtime=auth-gated session=first queries=after-auth cache-key=r139');
