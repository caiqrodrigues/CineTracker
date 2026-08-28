import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
for(const base of ['dist','apps/web/dist']){
  const html=await readFile(base+'/primary.html','utf8');
  const js=await readFile(base+'/primary-authority-r138.js','utf8');
  assert.ok(html.includes('/primary-authority-r138.js'),base+': fresh runtime URL missing');
  assert.ok(!html.includes('/patch-v133-v0997-primary-authority.js'),base+': stale runtime URL survived');
  assert.ok(js.includes('r137-rpc-timeout-native-nav'),base+': copied runtime lost r137 fixes');
}
console.log('WEB_R1381_OK cache-key=rotated runtime=primary-authority-r138.js');
