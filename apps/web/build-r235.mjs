import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r232.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v232.js'),'utf8'),
 readFile(resolve(dist,'app-v232.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r235-v127-live-authority.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.27 expected one ${label}, found ${n}`);return s.replace(a,b)};
const drop=(s,a,label,min=1)=>{const n=s.split(a).length-1;if(n<min)throw new Error(`Web 1.0.27 could not neutralize ${label}; found ${n}`);return s.split(a).join('')};
for(const marker of [
 "window.__ctR235V127='single-live-dom-authority'",
 "window.__ctV127Home='aired-unwatched-never-up-to-date'",
 "window.__ctV127Discover='stable-content-no-legends-uniform-cards-top10-safe'",
 "window.__ctV127Sports='single-action-zone-live-reconcile+provider-dedupe'",
 "window.__ctV127Watchlist='rpc-full-universe-count-modal-identical'"
])if(!patch.includes(marker))throw new Error('Web 1.0.27 patch missing '+marker);
if(!patch.includes('new MutationObserver(queue127)'))throw new Error('Web 1.0.27 live observer missing');
if(!js.includes("const REVISION='r232-official-1.0.24';"))throw new Error('Web 1.0.27 requires proven r232/1.0.24 visual base');
if(!js.includes("window.__ctR229V123='sports-card-single-action-zone-no-floating-actions'"))throw new Error('Web 1.0.27 requires r123 Sports layout baseline');
if(!js.includes("window.__ctR232V124='final-web-consolidation-preserve-v123-sports'"))throw new Error('Web 1.0.27 requires r124 Discover baseline');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.27 boot point missing');

/* Remove every competing legacy observer/poll. r235 owns one live observer. */
js=drop(js,"try{new MutationObserver(sync117).observe(q117('#app')||document.documentElement,{subtree:true,childList:true})}catch{}\n",'r223/v117 observer');
js=drop(js,"try{new MutationObserver(sync119).observe(q119('#app')||document.documentElement,{subtree:true,childList:true})}catch{}\n",'r225/v119 observer');
js=drop(js,"try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}\n",'v120 discover observer');
js=drop(js,"try{new MutationObserver(sync121).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}\nsetInterval(()=>{if(q('[data-page=\"discover\"], [data-discover], [data-sports], [data-profile]'))sync121()},1000);\n",'r227/v121 observer+poll');
js=drop(js,"try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}setInterval(sync,350);sync();",'r228/v122 core observer+350ms poll');
js=drop(js,"try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}setInterval(sync,1200);sync();window.__ctV122MetadataSync=sync;",'r228b metadata observer+1200ms poll');
js=drop(js,"try{new MutationObserver(sync).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-ct117-watchlist-stat','data-ct118-watchlist','data-ct120-watchlist','data-ct121-watchlist']})}catch{}setInterval(guard,500);guard();",'r228c profile guard poll');
js=drop(js,"try{new MutationObserver(queue).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}setInterval(()=>void sync(false).catch(()=>{}),1500);queue();",'r228d exact-count poll');
js=drop(js,"try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}\nsetInterval(sync,700);sports();",'r229 Sports 700ms observer+poll');
js=drop(js,"try{new MutationObserver(queue).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}\nsetInterval(queue,1200);queue();",'r232 final observer+poll');

/* r235 is the only Watchlist click authority. */
for(const v of ['117','118','119','120','121','122','124'])js=js.replaceAll(`e.target.closest?.('[data-ct${v}-watchlist]')`,`e.target.closest?.('[data-ct${v}-watchlist-disabled]')`);
js=js.replaceAll("e.target.closest?.('[data-ct117-watchlist-stat]')","e.target.closest?.('[data-ct117-watchlist-stat-disabled]')");

js=once(js,"const REVISION='r232-official-1.0.24';","const REVISION='r235-official-1.0.27';",'revision');
js=once(js,"window.__ctWebBuild='1.0.24';window.__ctOfficialVersion='1.0.24';","window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';",'identity');
js=js.replaceAll('CineTracker • v1.0.24','CineTracker • v1.0.27')
     .replaceAll("JSON.stringify({version:'1.0.24',revision:REVISION","JSON.stringify({version:'1.0.27',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');

html=html.replaceAll('r232-official-1.0.24','r235-official-1.0.27')
         .replaceAll('app-v232.js','app-v235.js')
         .replaceAll('app-v232.css','app-v235.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.27-r235';")
     .replaceAll('app-v232.js','app-v235.js')
     .replaceAll('app-v232.css','app-v235.css');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v235.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v235.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({
   version:'1.0.27',revision:'r235-official-1.0.27',base:'r232-official-1.0.24',
   home:'aired-unwatched-never-up-to-date',
   discover:'stable-content-no-legends-uniform-cards-top10-safe',
   sports:'single-action-zone-live-reconcile+provider-dedupe',
   watchlist:'rpc-full-universe-count-modal-identical',
   authority:'single-live-dom-authority',generated_at:new Date().toISOString()
 },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v232.js'),{force:true}),rm(resolve(dist,'app-v232.css'),{force:true})]);
console.log('WEB_1_0_27_READY r235 live-authority=one-observer behavior-tests-required');