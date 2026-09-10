import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r239.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v239.js'),'utf8'),
  readFile(resolve(dist,'app-v239.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r243-home-stable-fast.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r243 missing '+label);return s};
const count=(s,x)=>s.split(x).length-1;
for(const marker of [
  "window.__ctR243Home='stable-fast-home-single-paint-authority'",
  "window.__ctR243Scope='home-only'",
  "window.__ctR243FreezeFix='disable-r235-r236-home-repaint-fanout'",
  "window.__ctR243Payload='cinetracker_home_live_v0997_r5'",
  "window.__ctR243Dom='bounded-active-tab-only'"
])must(patch,marker,marker);
for(const forbidden of ['Stuart','Lioness','WWE Raw'])if(patch.includes(forbidden))throw new Error('r243 Home cannot hardcode '+forbidden);
if(!js.includes("const REVISION='r239-official-1.0.31';"))throw new Error('r243 requires proven r239 base');
if(!js.includes("window.__ctR239='production-video-ground-truth'"))throw new Error('r243 requires r239 ground truth');
if(!js.includes("window.__ctR178='stable-home-dom-no-repaint-loop'"))throw new Error('r243 requires r178 stable Home intent');

/* r235/r236 reintroduced exactly the repaint storm r178 had removed. Neutralize only their
   Home-specific scheduled fan-out; Discover/Sports/Profile/F1 authorities remain untouched. */
const fanout="requestAnimationFrame(()=>void refreshHome127())";
const fanoutCount=count(js,fanout);
if(fanoutCount<2)throw new Error(`r243 expected >=2 r235 Home refresh fan-outs, found ${fanoutCount}`);
js=js.split(fanout).join('void 0');
const r235HomeObserver="if(q('[data-home]'))fixKnownHome127()";
if(!js.includes(r235HomeObserver))throw new Error('r243 expected r235 Home observer branch');
js=js.split(r235HomeObserver).join('');
const r236Recursive="queueMicrotask(()=>void hydrateHome236());";
if(!js.includes(r236Recursive))throw new Error('r243 expected r236 recursive Home hydrate scheduling');
js=js.split(r236Recursive).join('');
const r236HomeObserver="if(q('[data-home]'))pendingHome236();";
if(!js.includes(r236HomeObserver))throw new Error('r243 expected r236 Home observer branch');
js=js.split(r236HomeObserver).join('');

js=js.replace("const REVISION='r239-official-1.0.31';","const REVISION='r243-official-1.0.34';")
  .replace("window.__ctWebBuild='1.0.31';window.__ctOfficialVersion='1.0.31';","window.__ctWebBuild='1.0.34';window.__ctOfficialVersion='1.0.34';")
  .replaceAll('CineTracker • v1.0.31','CineTracker • v1.0.34')
  .replaceAll("JSON.stringify({version:'1.0.31',revision:REVISION","JSON.stringify({version:'1.0.34',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r243 boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');

html=html.replaceAll('r239-official-1.0.31','r243-official-1.0.34')
  .replaceAll('app-v239.js','app-v243.js')
  .replaceAll('app-v239.css','app-v243.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r243 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.34-r243';")
  .replaceAll('app-v239.js','app-v243.js')
  .replaceAll('app-v239.css','app-v243.css');

const release={
  version:'1.0.34',revision:'r243-official-1.0.34',base:'r239-official-1.0.31',scope:'home-only',
  home:'stable-single-paint+r5-data-cache+bounded-active-tab-dom',rpc:'cinetracker_home_live_v0997_r5',
  movie_cards:'runtime+year+up-to-3-genres',freeze_fix:'r235-r236-home-fanout-neutralized',
  history:'above-and-hidden-at-initial-position',android:'unchanged-1.0.20',generated_at:new Date().toISOString()
};
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v243.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v243.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v239.js'),{force:true}),rm(resolve(dist,'app-v239.css'),{force:true})]);
console.log(`WEB_1_0_34_READY r243 home=stable-single-paint r5=fast bounded-dom fanouts-removed=${fanoutCount}`);
