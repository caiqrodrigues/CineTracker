import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r218.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v218.js'),'utf8'),readFile(resolve(dist,'app-v218.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r219-v113-memory-f1-grid.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.13 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR219V113='persistent-foryou-memory-f1-collapse-grid'","cinetracker_recommendation_memory_v113","cinetracker_recommendation_record_v113",'score113(x)>7.8','year113(x)>1990','g.includes(10766)','data-ct113-f1-toggle','data-ct113-f1-grid','nextQualifying'])if(!patch.includes(must))throw new Error('Web 1.0.13 patch missing '+must);
if(!js.includes("const REVISION='r218-official-1.0.12';"))throw new Error('Web 1.0.13 requires r218 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.13 boot point missing');
js=once(js,"const REVISION='r218-official-1.0.12';","const REVISION='r219-official-1.0.13';",'revision');
js=once(js,"window.__ctWebBuild='1.0.12';window.__ctOfficialVersion='1.0.12';","window.__ctWebBuild='1.0.13';window.__ctOfficialVersion='1.0.13';",'identity');
js=js.replaceAll('CineTracker • v1.0.12','CineTracker • v1.0.13').replaceAll("JSON.stringify({version:'1.0.12',revision:REVISION","JSON.stringify({version:'1.0.13',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r218-official-1.0.12','r219-official-1.0.13').replaceAll('app-v218.js','app-v219.js').replaceAll('app-v218.css','app-v219.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.13-r219';").replaceAll('app-v218.js','app-v219.js').replaceAll('app-v218.css','app-v219.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v219.js'),js,'utf8'),writeFile(resolve(dist,'app-v219.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.13',revision:'r219-official-1.0.13',base:'r218-official-1.0.12',foryou:'supabase-v113-memory+score>7.8+year>1990+no-doc-drama-dorama-soap+no-fill',f1:'collapsible+next-qualifying-grid',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v218.js'),{force:true}),rm(resolve(dist,'app-v218.css'),{force:true})]);
console.log('WEB_1_0_13_READY memory=v113 quality=strict f1=collapse+grid');
