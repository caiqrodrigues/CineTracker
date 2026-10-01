import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r427.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v427.js'),'utf8'),
 readFile(resolve(dist,'app-v427.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r427-discover-foryou-visible-owner.js'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r428 '+m)};
new Function(runtime);
for(const bad of ["new MutationObserver","setInterval(","while(true)","window.location.reload(","router.refresh("]) { ok(!runtime.includes(bad),'forbidden '+bad); }
ok(runtime.includes('data-ct388-foryou'),'r388 visible root');
ok(runtime.includes('__ctR388LoadForYou'),'r388 loader');
ok(runtime.includes("b.dataset.ct388Action==='swap'"),'r388 swap');
js=js.replaceAll('1.0.218','1.0.219').replaceAll('r427-official-1.0.218','r428-official-1.0.219');
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v427.js','app-v428.js').replaceAll('app-v427.css','app-v428.css').replaceAll('v1.0.218','v1.0.219').replaceAll('r427-official-1.0.218','r428-official-1.0.219');
sw=sw.replaceAll('ct-web-1.0.218-r427','ct-web-1.0.219-r428').replaceAll('app-v427.js','app-v428.js').replaceAll('app-v427.css','app-v428.css');
css+='\n/* CineTracker Web 1.0.219 r428 — Descobrir > Pra Você visible-owner recovery. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.219',revision:'r428-official-1.0.219',base:'r426+r427-visible-foryou-owner',scope:'discover-foryou-only',discover_foryou:'r388 is explicitly recognized as a live renderer; its loader is recovered when it owns the visible DOM and its native swap actions are re-enabled',discover_actions:'visible Trocar buttons are reactivated without replacing the native r388 click owner',home:'unchanged-r426',profile:'unchanged-r426',sports:'unchanged-r426',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v428.js'),js),
 writeFile(resolve(dist,'app-v428.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v427.js'),{force:true}),rm(resolve(dist,'app-v427.css'),{force:true})]);
const built=await readFile(resolve(dist,'app-v428.js'),'utf8');
for(const need of ['window.__ctR428','data-ct388-foryou','__ctR388LoadForYou','ct428-action','Trocar'])ok(built.includes(need),'assembled '+need);
console.log('WEB_R428_READY');