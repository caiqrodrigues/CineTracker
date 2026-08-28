import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

for(const base of ['dist','apps/web/dist']){
  const js=await readFile(base+'/primary-authority-r140.js','utf8');
  const html=await readFile(base+'/primary.html','utf8');
  new vm.Script(js);
  assert.ok(js.includes("r140-rpc-dedupe-single-start"),base+': r140 runtime marker missing');
  assert.ok(js.includes('rpcInflight=new Map()'),base+': in-flight RPC coalescing missing');
  assert.ok(!js.includes("const[h0,d0]=await Promise.all([rpcDirect('cinetracker_profile_home_payload_v0994'"),base+': Home still launches payload+dashboard together');
  const libStart=js.indexOf('async function libraryContext(force=false)');
  const libEnd=js.indexOf('function namesOf',libStart);
  assert.ok(libStart>=0&&libEnd>libStart,base+': libraryContext missing');
  const lib=js.slice(libStart,libEnd);
  assert.ok(!lib.includes('cinetracker_discovery_exclusions_v0994'),base+': Discover still calls exclusions RPC in parallel with dashboard');
  assert.ok(html.includes('/primary-authority-r140.js'),base+': r140 runtime URL missing');
  assert.ok(!html.includes('/primary-authority-r139.js'),base+': stale r139 runtime URL survived');
  assert.ok(html.includes('const firstLoad=!window.__ct0997Primary133Loaded'),base+': first-load guard missing');
  assert.ok(!html.includes("await loadPrimaryRuntime139();window.dispatchEvent(new Event('cinetracker:auth-state-change'));await window.__ct132Go?.(p);"),base+': duplicate startup go survived');
}
console.log('WEB_R140_OK startup=single homeRpc=single discoverRpc=single inflight=coalesced');
