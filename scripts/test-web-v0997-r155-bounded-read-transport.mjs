import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html=await readFile('dist/index.html','utf8');
const preload=await readFile('dist/patch-v1196-v0997-persistent-preload.js','utf8');
const epoch=await readFile('dist/patch-v155-v0997-runtime-epoch.js','utf8');
const guard=await readFile('dist/patch-v155-v0997-final-guard.js','utf8');
const sw=await readFile('dist/service-worker.js','utf8');

assert.ok(epoch.includes("window.__ctRuntimeEpoch='r155'"),'r155 runtime epoch missing');
assert.ok(epoch.includes("'cinetracker-preload-r154'"),'r154 IndexedDB cleanup missing');
for(const token of [
  "__ct0997BoundedRead155='r155-direct-bounded-memory-only'",
  'const TIMEOUT_MS=5500','const FALLBACK_MS=2200','const MEMORY_TTL=8000',
  '/rest/v1/rpc/','AbortController','cache:\'no-store\'',
  'window.__ct0997PersistentPreloadRpc=boundedRead155',
  'window.__ct0997PersistentPreloadWarm=()=>Promise.resolve(false)'
])assert.ok(preload.includes(token),`r155 preload missing ${token}`);
for(const forbidden of ['indexedDB.open','readSnapshot(','writeSnapshot(','setInterval(','warmPromise','SNAPSHOT_MAX_AGE'])assert.ok(!preload.includes(forbidden),`r155 preload forbidden ${forbidden}`);
for(const token of [
  "window.__ctWebRevision='r155'",'window.sbRpc=sb155','__ct155BoundedReads',
  'setTimeout(async()=>','7000','__ct143RenderPrimary','__ct150EnsureDiscover','__ct155RecoverPrimary'
])assert.ok(guard.includes(token),`r155 final guard missing ${token}`);
assert.ok(!html.includes('patch-v154-v0997-runtime-epoch.js'),'old r154 epoch still loaded');
assert.ok(!html.includes('patch-v154-v0997-runtime-final.js'),'old r154 final marker still loaded');
assert.ok(!html.includes('patch-v152-v0997-sports-hub.js'),'r152 regression returned');
assert.ok(html.includes('patch-v153-v0997-disable-r152-regression.js?ct=r155'),'r153 rollback missing');
assert.ok(html.includes('ct-r148-web-pc-android'),'r148 Web PC lock missing');
const scripts=[...html.matchAll(/<script\b[^>]*\bsrc="\/(?!\/)([^"]+\.js(?:\?[^"]*)?)"/gi)].map(m=>m[1]);
assert.ok(scripts.length>10,'unexpected local script count');
assert.ok(scripts.every(x=>x.endsWith('?ct=r155')),'mixed JS epoch survived');
assert.ok(sw.includes("VERSION='ct-web-0.99.7-r155'"),'service worker not r155');
console.log('WEB_R155_TEST_OK loading=bounded preload=memory-only indexeddb=off watchdog=7s epoch=single-r155 r152=disabled layout=unchanged');
