import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for(const base of ['dist','apps/web/dist']){
  const html=await readFile(base+'/primary.html','utf8');
  assert.ok(html.includes('r138-clean-primary-entry'),base+': r138 marker missing');
  assert.ok(html.includes('patch-v133-v0997-primary-authority.js'),base+': current authority missing');
  assert.ok(html.includes('AbortController'),base+': auth/network timeout support missing');
  assert.ok(html.includes('data-clean-logout'),base+': clean account controls missing');
  assert.ok(html.includes('class="nav"'),base+': clean sidebar missing');
  assert.ok(!html.includes('patch-v099-v0994-web.js'),base+': 0.99.4 leaked into clean primary');
  assert.ok(!html.includes('patch-v118-v0997-authoritative.js'),base+': v118 leaked into clean primary');
  assert.ok(!html.includes('auth-runtime-guard-v134.js'),base+': legacy guard leaked into clean primary');
  const scripts=[...html.matchAll(/<script(?:\s+src="([^"]+)")?[^>]*>/g)].map(x=>x[1]||'inline');
  assert.deepEqual(scripts,['inline','/patch-v133-v0997-primary-authority.js','inline'],base+': unexpected script cascade in clean primary: '+scripts.join(','));
}
const vercel=JSON.parse(await readFile('apps/web/vercel.json','utf8'));
const jsHeader=vercel.headers.find(x=>x.source==='/(.*)\\.js');
assert.ok(jsHeader?.headers?.some(x=>x.key==='Cache-Control'&&x.value.includes('no-store')),'runtime JS must not be immutable-cached');
assert.ok(!jsHeader?.headers?.some(x=>x.value.includes('31536000')),'runtime JS still has one-year cache');
console.log('WEB_R138_OK fallback-artifact=clean scripts=3 legacy=0 cache=runtime-no-store');
