import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r236.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v236.js'),'utf8'),readFile(resolve(dist,'app-v236.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r237-real-ui-authority.js'),'utf8')
]);
const must=(s,x,label)=>{if(!s.includes(x))throw new Error('r237 missing '+label);return s};
for(const marker of ["window.__ctR237='real-ui-single-finalizer'","window.__ctR237Profile='exact-requested-stat-order'","window.__ctR237Discover='base-geometry-no-runtime-card-resize'","window.__ctR237Sports='standard-card-assistido-only'"])must(patch,marker,marker);
for(const forbidden of ['Stuart','Lioness','WWE Raw'])if(patch.includes(forbidden))throw new Error('r237 cannot hardcode '+forbidden);

/* The production bug was two authorities fighting each other. Neutralize the old r235 card mutation itself, not only its visual result. */
const oldCard="for(const card of cards)card.classList.add('ct127-discover-card');";
if(!js.includes(oldCard))throw new Error('r237 expected r235 discover card mutation');
js=js.replace(oldCard,"for(const card of cards)card.classList.remove('ct127-discover-card');");
const oldRow="for(const row of qa('.row,.media-row-grid,.recommendation-row',content))if(row.querySelector('.ct127-discover-card'))row.classList.add('ct127-discover-row');";
if(!js.includes(oldRow))throw new Error('r237 expected r235 discover row mutation');
js=js.replace(oldRow,"for(const row of qa('.row,.media-row-grid,.recommendation-row',content))row.classList.remove('ct127-discover-row');");

/* r235 used a two-action Sports footer. Make that authority remove Eventos instead of recreating it on every observer pass. */
const oldEv="if(ev){ev.className='ct123-action ct127-sport-action secondary';ev.textContent='Ver eventos';if(ev.parentElement!==bar)bar.appendChild(ev)}";
if(!js.includes(oldEv))throw new Error('r237 expected r235 Eventos authority');
js=js.replace(oldEv,"if(ev){ev.remove()}");

/* Remove all runtime geometry overrides introduced by r235/r236. The base app CSS owns Discover/Top10 dimensions. */
js=js.replace(/\[data-page=\\"discover\\"\] \.ct127-discover-row[^\n]*\n/g,'')
     .replace(/\[data-page=\\"discover\\"\] \.ct127-discover-card[^\n]*\n/g,'')
     .replace(/\[data-page=\\"discover\\"\] \.row,[^\n]*\n/g,'')
     .replace(/\[data-page=\\"discover\\"\] \.ct171-top-row[^\n]*\n/g,'')
     .replace(/\[data-page=\\"discover\\"\] \.ct171-top-row \.card[^\n]*\n/g,'');

/* r236's continual Discover observer is unnecessary after the destructive mutation above is gone. Paint/render hooks still stabilize once. */
js=js.replace("if(q('[data-page=\"discover\"],[data-discover]'))queueDiscover236();","");

if(!js.includes("const REVISION='r236-official-1.0.28';"))throw new Error('r237 requires r236 base');
js=js.replace("const REVISION='r236-official-1.0.28';","const REVISION='r237-official-1.0.29';")
     .replace("window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';","window.__ctWebBuild='1.0.29';window.__ctOfficialVersion='1.0.29';")
     .replaceAll('CineTracker • v1.0.28','CineTracker • v1.0.29')
     .replaceAll("JSON.stringify({version:'1.0.28',revision:REVISION","JSON.stringify({version:'1.0.29',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r237 boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r236-official-1.0.28','r237-official-1.0.29').replaceAll('app-v236.js','app-v237.js').replaceAll('app-v236.css','app-v237.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.29-r237';").replaceAll('app-v236.js','app-v237.js').replaceAll('app-v236.css','app-v237.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v237.js'),js,'utf8'),writeFile(resolve(dist,'app-v237.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.29',revision:'r237-official-1.0.29',base:'r236-official-1.0.28',home:'generic-series-hydration-no-title-hardcode',discover:'base-geometry-single-authority',sports:'standard-card-assistido-only',f1:'requested-six-tabs',profile:'requested-stat-order',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v236.js'),{force:true}),rm(resolve(dist,'app-v236.css'),{force:true})]);
console.log('WEB_1_0_29_READY r237 real-ui-authority profile=requested-order');