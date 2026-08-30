import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=resolve(root,'apps/web/patch-v152-v0997-sports-hub.js');
const name='patch-v152-v0997-sports-hub.js';
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r152: '+msg)};

let runtime=await readFile(source,'utf8');
// Freeze "Hoje" to the device-local calendar day instead of locale formatting quirks.
const localHelper="const eventLocalDay=v=>{const d=new Date(v);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};";
must(runtime.includes("const shiftDay=(n,d=new Date())=>"),'local date anchor missing');
runtime=runtime.replace("const shiftDay=(n,d=new Date())=>{const x=new Date(d);x.setDate(x.getDate()+n);return localDay(x)};",`const shiftDay=(n,d=new Date())=>{const x=new Date(d);x.setDate(x.getDate()+n);return localDay(x)};\n${localHelper}`);
runtime=runtime.replaceAll("new Date(e.starts_at).toLocaleDateString('sv-SE')===localDay()","eventLocalDay(e.starts_at)===localDay()");
runtime=runtime.replaceAll("new Date(e.starts_at).toLocaleDateString('sv-SE')","eventLocalDay(e.starts_at)");
must(runtime.includes('eventLocalDay(e.starts_at)===localDay()'),'local today comparison missing');
must(!runtime.includes("toLocaleDateString('sv-SE')"),'sv-SE date workaround survived');

// Observer is allowed to restore Sports only when another runtime removed its root.
const oldObserver="const obs=new MutationObserver(muts=>{let need=false;for(const m of muts){if(m.type==='childList'&&[...m.addedNodes].some(n=>n.nodeType===1&&!n.closest?.('#ct152-sports')))need=true}if(need){ensureNav();if(isSports()&&!$('#ct152-sports'))render()}});obs.observe(document.body,{childList:true,subtree:true});state.observer=obs;";
const newObserver="const obs=new MutationObserver(()=>{ensureNav();if(isSports()&&!$('#ct152-sports'))render()});obs.observe(document.body,{childList:true,subtree:true});state.observer=obs;";
must(runtime.includes(oldObserver),'observer guard anchor missing');
runtime=runtime.replace(oldObserver,newObserver);
must(runtime.includes("if(isSports()&&!$('#ct152-sports'))render()"),'observer root guard missing');

execFileSync(process.execPath,['--check'],{input:runtime,stdio:['pipe','pipe','pipe']});
for(const dir of dirs){
  const runtimePath=resolve(dir,name);
  await writeFile(runtimePath,runtime,'utf8');
  execFileSync(process.execPath,['--check',runtimePath],{stdio:'pipe'});
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(/<script src="\/patch-v152-v0997-sports-hub\.js(?:\?r\w+)?"><\/script>/g,'');
  const anchor='<script src="/patch-v151-v0997-library-identity-reconcile.js?r151"></script>';
  const tag='<script src="/patch-v152-v0997-sports-hub.js?r152"></script>';
  must(html.includes(anchor),'r151 anchor missing');
  html=html.replace(anchor,`${anchor}${tag}`);
  must(html.indexOf(tag)>html.indexOf(anchor),'r152 must load after r151');
  must(html.includes('ct-r148-web-pc-android'),'r148 Web PC lock must survive');
  await writeFile(indexPath,html,'utf8');

  const swPath=resolve(dir,'service-worker.js');
  let sw=await readFile(swPath,'utf8');
  sw=sw.replace(/ct-web-0\.99\.7-r(?:\d+\w*)/g,'ct-web-0.99.7-r152');
  await writeFile(swPath,sw,'utf8');
}

console.log('WEB_R152_APPLIED sports=canonical-supabase provider=api-sports+tsdb route=/sports today=local realtime=favorites layout-existing=preserved');
await import('./test-web-v0997-r152-sports-hub.mjs');
