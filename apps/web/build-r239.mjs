import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r238.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v238.js'),'utf8'),readFile(resolve(dist,'app-v238.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r239-video-ground-truth.js'),'utf8')
]);
const must=(s,x,label)=>{if(!s.includes(x))throw new Error('r239 missing '+label);return s};
for(const marker of ["window.__ctR239='production-video-ground-truth'","window.__ctR239Profile='exact-four-column-reference-layout'","window.__ctR239Discover='restore-real-foryou-sections-from-r166'","window.__ctR239Sports='canonical-app-button-not-gray'","window.__ctR239F1='single-tab-group-real-collapse'"])must(patch,marker,marker);
/* The standalone fixture exposes discoverState on window; production keeps it lexical in the monolithic app. */
patch=patch.replaceAll('globalThis.discoverState?.tab','discoverState?.tab');
/* Avoid a childList mutation loop: physically reorder Profile cards only when the producer emitted a wrong order. */
const reorder239="for(const label of expected){const c=by.get(label);if(c&&c.parentElement===grid)grid.appendChild(c)}";
const stableReorder239="if(cards.map(c=>norm(q('small',c)?.textContent||'')).join('|')!==expected.join('|'))for(const label of expected){const c=by.get(label);if(c&&c.parentElement===grid)grid.appendChild(c)}";
if(!patch.includes(reorder239))throw new Error('r239 expected Profile reorder loop');
patch=patch.replace(reorder239,stableReorder239);
if(!js.includes("const REVISION='r238-official-1.0.30';"))throw new Error('r239 requires r238 base');
if(!js.includes("window.__ctR238='real-r180-profile-renderer'"))throw new Error('r239 requires r238 profile baseline');
if(!js.includes('function ct166RenderForYou(data)'))throw new Error('r239 requires semantic r166 Pra Voce renderer');
if(!js.includes("const F1_TABS236=["))throw new Error('r239 requires canonical r236 F1 tabs');

/* The old r236 capture handler consumed the minimize click before any later authority could fix its wrong collapse scope. Delegate only that action to r239. */
const oldCollapse="const card=toggle.closest('[data-ct236-f1-card]');card.dataset.ct236F1Open=card.dataset.ct236F1Open==='0'?'1':'0';normalizeF1236();return";
const newCollapse="const card=toggle.closest('[data-ct236-f1-card]');card.dataset.ct236F1Open=card.dataset.ct236F1Open==='0'?'1':'0';if(typeof window.__ctR239SetF1Open==='function'){window.__ctR239SetF1Open(card,card.dataset.ct236F1Open!=='0');return}normalizeF1236();return";
if(!js.includes(oldCollapse))throw new Error('r239 expected r236 F1 collapse handler');
js=js.replace(oldCollapse,newCollapse);

js=js.replace("const REVISION='r238-official-1.0.30';","const REVISION='r239-official-1.0.31';")
     .replace("window.__ctWebBuild='1.0.30';window.__ctOfficialVersion='1.0.30';","window.__ctWebBuild='1.0.31';window.__ctOfficialVersion='1.0.31';")
     .replaceAll('CineTracker • v1.0.30','CineTracker • v1.0.31')
     .replaceAll("JSON.stringify({version:'1.0.30',revision:REVISION","JSON.stringify({version:'1.0.31',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r239 boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r238-official-1.0.30','r239-official-1.0.31').replaceAll('app-v238.js','app-v239.js').replaceAll('app-v238.css','app-v239.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.31-r239';").replaceAll('app-v238.js','app-v239.js').replaceAll('app-v238.css','app-v239.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v239.js'),js,'utf8'),writeFile(resolve(dist,'app-v239.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.31',revision:'r239-official-1.0.31',base:'r238-official-1.0.30',ground_truth:'user-production-video-2026-09-09',profile:'reference-4-4-2-layout',discover:'r166-three-sections-restored',sports:'canonical-dark-rounded-assistido',f1:'single-canonical-tab-group-real-collapse',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v238.js'),{force:true}),rm(resolve(dist,'app-v238.css'),{force:true})]);
console.log('WEB_1_0_31_READY r239 production-video-ground-truth');