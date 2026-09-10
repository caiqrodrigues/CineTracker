import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r239.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v239.js'),'utf8'),readFile(resolve(dist,'app-v239.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r242-home-safe-additive.js'),'utf8')
]);
for(const x of ["window.__ctR242HomeAdditive='preview-first-movie-metadata'","window.__ctR242Scope='home-only'","window.__ctR242Safety='delegating-render-wrapper'","const ct242RenderHomeBase=renderHome","renderHome=async function(seq)","cinetracker_home_preview_v1","ct242MetaText","ct242DecorateMovies"])if(!patch.includes(x))throw new Error('r242 patch missing '+x);
if(/(?:^|\n)\s*paintHome\s*=/.test(patch))throw new Error('r242 must not replace paintHome');
if(!js.includes("const REVISION='r239-official-1.0.31';"))throw new Error('r242 requires stable r239 base');
if(!js.includes("window.__ctR239='production-video-ground-truth'"))throw new Error('r242 requires r239 ground truth');
if(!js.includes('\nboot();'))throw new Error('r242 boot insertion point missing');
js=js.replace("const REVISION='r239-official-1.0.31';","const REVISION='r242-official-1.0.33';")
  .replace("window.__ctWebBuild='1.0.31';window.__ctOfficialVersion='1.0.31';","window.__ctWebBuild='1.0.33';window.__ctOfficialVersion='1.0.33';")
  .replaceAll('CineTracker • v1.0.31','CineTracker • v1.0.33')
  .replaceAll("JSON.stringify({version:'1.0.31',revision:REVISION","JSON.stringify({version:'1.0.33',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r239-official-1.0.31','r242-official-1.0.33').replaceAll('app-v239.js','app-v242.js').replaceAll('app-v239.css','app-v242.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.33-r242';").replaceAll('app-v239.js','app-v242.js').replaceAll('app-v239.css','app-v242.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v242.js'),js,'utf8'),writeFile(resolve(dist,'app-v242.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.33',revision:'r242-official-1.0.33',base:'r239-official-1.0.31',scope:'home-only',home:'cache-or-compact-preview-before-full-authority',movie_cards:'year+runtime+up-to-3-genres',renderer_wrapper:'delegates-complete-current-chain',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v239.js'),{force:true}),rm(resolve(dist,'app-v239.css'),{force:true})]);
console.log('WEB_1_0_33_READY r242 home=delegating-fast-preview movie=year+runtime+genres');
