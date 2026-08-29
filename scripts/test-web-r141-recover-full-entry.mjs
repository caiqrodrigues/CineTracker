import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const vercel=JSON.parse(await readFile('apps/web/vercel.json','utf8'));
for(const route of ['/','/home','/discover','/profile','/configs']){
  assert.ok(vercel.rewrites.some(x=>x.source===route&&x.destination==='/index.html'),`r141: ${route} must use full index entry`);
}
const html=await readFile('dist/index.html','utf8');
assert.ok(html.includes('r137-rpc-timeout-native-nav'),'r141: full emitted entry lost r137 navigation/timeout authority');
assert.ok(html.includes('r133-nonblocking-home'),'r141: full emitted entry lost nonblocking Home authority');
assert.ok(!html.includes('patch-v103-v0994-session-gate.js'),'r141: removed 0.99.4 session takeover returned');
assert.ok(!html.includes('patch-v104-v0994-authority.js'),'r141: removed 0.99.4 authority takeover returned');
const indexHeader=vercel.headers.find(x=>x.source==='/index.html');
assert.ok(indexHeader?.headers?.some(x=>x.key==='Cache-Control'&&x.value.includes('no-store')),'r141: index must stay no-store');
console.log('WEB_R141_OK entry=full-index primary=fallback cache=no-store authority=r133+r137');
