import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

const root=resolve(process.cwd());
const web=resolve(root,'apps/web');
const dist=resolve(root,'dist');
const mode=process.argv[2]||'source';
const target=mode==='dist'?dist:web;
const htmlPath=resolve(target,'index.html');
const html=await readFile(htmlPath,'utf8');
const srcs=[...html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi)].map(m=>m[1]);
const patchSrcs=srcs.filter(x=>/patch|hotfix|runtime/i.test(x));
const files=(await readdir(target)).filter(x=>/\.js$/i.test(x));
let bytes=0,observers=0,intervals=0,timeouts=0,listeners=0,fetchWraps=0,rpcWrites=0,navigateWrites=0;
const rows=[];
for(const name of files){
  const path=resolve(target,name); const s=await stat(path); const text=await readFile(path,'utf8');
  const row={name,bytes:s.size,observer:(text.match(/new\s+MutationObserver/g)||[]).length,interval:(text.match(/setInterval\s*\(/g)||[]).length,timeout:(text.match(/setTimeout\s*\(/g)||[]).length,listener:(text.match(/addEventListener\s*\(/g)||[]).length,fetchWrap:(text.match(/window\.fetch\s*=/g)||[]).length,rpcWrite:(text.match(/window\.sbRpc\s*=/g)||[]).length,navigateWrite:(text.match(/window\.(?:__ct0994Navigate|ct0994Navigate|ct991Navigate|ct0992Navigate|ct99Navigate|ct98Navigate)\s*=/g)||[]).length};
  rows.push(row); bytes+=row.bytes; observers+=row.observer; intervals+=row.interval; timeouts+=row.timeout; listeners+=row.listener; fetchWraps+=row.fetchWrap; rpcWrites+=row.rpcWrite; navigateWrites+=row.navigateWrite;
}
rows.sort((a,b)=>b.bytes-a.bytes);
const report={mode,target:basename(target),html_bytes:Buffer.byteLength(html),external_scripts:srcs.length,patch_scripts:patchSrcs.length,js_files:files.length,js_bytes:bytes,mutation_observers:observers,set_intervals:intervals,set_timeouts:timeouts,event_listeners:listeners,window_fetch_reassignments:fetchWraps,window_sbRpc_reassignments:rpcWrites,navigation_global_reassignments:navigateWrites,largest:rows.slice(0,15)};
console.log('RUNTIME_AUDIT '+JSON.stringify(report));
