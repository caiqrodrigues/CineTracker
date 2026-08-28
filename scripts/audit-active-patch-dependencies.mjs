import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dir=resolve(root,'dist');
const html=await readFile(resolve(dir,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script[^>]+src=["']\/([^"']+\.js)["'][^>]*><\/script>/gi)].map(m=>m[1]).filter(x=>/^patch-/.test(x));
const rows=[];
const owners=new Map();
const writesOf=text=>{
  const out=new Set();
  for(const re of [/window\.([A-Za-z_$][\w$]*)\s*=/g,/window\[['"]([^'"]+)['"]\]\s*=/g]) for(const m of text.matchAll(re)) out.add(m[1]);
  return [...out];
};
const readsOf=text=>{
  const out=new Set();
  for(const m of text.matchAll(/window\.([A-Za-z_$][\w$]*)/g)) out.add(m[1]);
  return [...out];
};
for(let i=0;i<srcs.length;i++){
  const name=srcs[i],text=await readFile(resolve(dir,name),'utf8');
  const writes=writesOf(text),reads=readsOf(text).filter(x=>!writes.includes(x));
  for(const symbol of writes){const a=owners.get(symbol)||[];a.push({i,name});owners.set(symbol,a)}
  rows.push({i,name,bytes:Buffer.byteLength(text),writes,reads,observer:(text.match(/new\s+MutationObserver/g)||[]).length,interval:(text.match(/setInterval\s*\(/g)||[]).length,timeout:(text.match(/setTimeout\s*\(/g)||[]).length,listener:(text.match(/addEventListener\s*\(/g)||[]).length,fetchWrap:(text.match(/window\.fetch\s*=/g)||[]).length,rpcWrap:(text.match(/window\.sbRpc\s*=/g)||[]).length});
}
for(const r of rows){
  const later=rows.slice(r.i+1);
  const laterReads=new Set(later.flatMap(x=>x.reads));
  r.uniqueWrites=r.writes.filter(s=>(owners.get(s)||[]).length===1);
  r.overwrittenWrites=r.writes.filter(s=>{const a=owners.get(s)||[];return a.some(x=>x.i>r.i)});
  r.finalWrites=r.writes.filter(s=>{const a=owners.get(s)||[];return a[a.length-1]?.i===r.i});
  r.uniqueUsedLater=r.uniqueWrites.filter(s=>laterReads.has(s));
  r.finalUsedLater=r.finalWrites.filter(s=>laterReads.has(s));
  r.backgroundCost=r.observer*20+r.interval*20+r.listener*3+r.timeout;
  r.lowRiskStaticCandidate=r.fetchWrap===0&&r.rpcWrap===0&&r.uniqueUsedLater.length===0&&r.finalUsedLater.length===0&&r.backgroundCost>0;
}
const duplicated=[...owners.entries()].filter(([,a])=>a.length>1).sort((a,b)=>b[1].length-a[1].length).slice(0,60).map(([symbol,a])=>({symbol,writers:a.map(x=>x.name)}));
const candidates=rows.filter(x=>x.lowRiskStaticCandidate).sort((a,b)=>b.backgroundCost-a.backgroundCost||b.bytes-a.bytes).map(x=>({name:x.name,bytes:x.bytes,backgroundCost:x.backgroundCost,observer:x.observer,interval:x.interval,timeout:x.timeout,listener:x.listener,writes:x.writes,uniqueWrites:x.uniqueWrites,overwrittenWrites:x.overwrittenWrites}));
console.log('ACTIVE_PATCH_DEPENDENCIES '+JSON.stringify({count:rows.length,candidates,rows,duplicated_globals:duplicated}));
