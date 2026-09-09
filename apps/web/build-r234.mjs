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
 readFile(resolve(root,'runtime-r234-v126-real-regressions.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.26 expected one ${label}, found ${n}`);return s.replace(a,b)};
const drop=(s,a,label,min=1)=>{const n=s.split(a).length-1;if(n<min)throw new Error(`Web 1.0.26 could not neutralize ${label}; found ${n}`);return s.split(a).join('')};
if(!patch.includes("window.__ctR234V126='real-regressions-baseline-preserving-authority'"))throw new Error('Web 1.0.26 runtime marker missing');
for(const marker of [
 "window.__ctV126Home='instant-payload-state+nonblocking-single-tmdb-refresh'",
 "window.__ctV126Discover='r232-target-sections-only-top10-untouched'",
 "window.__ctV126Sports='r123-layout-preserved-event-driven'",
 "window.__ctV126Watchlist='full-logical-count+single-modal+visible-poster-enrichment'"
])if(!patch.includes(marker))throw new Error('Web 1.0.26 patch missing '+marker);
if(!js.includes("const REVISION='r232-official-1.0.24';"))throw new Error('Web 1.0.26 requires proven r232/1.0.24 visual base');
if(!js.includes("window.__ctR229V123='sports-card-single-action-zone-no-floating-actions'"))throw new Error('Web 1.0.26 requires r123 Sports layout baseline');
if(!js.includes("window.__ctR232V124='final-web-consolidation-preserve-v123-sports'"))throw new Error('Web 1.0.26 requires r124 targeted Discover baseline');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.26 boot point missing');

/* Remove the observer/poll cascade while preserving the proven render functions and CSS. */
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

/* Disable every older Watchlist click selector. r126 is the only click authority. */
for(const v of ['117','118','119','120','121','122','124']){
 js=js.replaceAll(`e.target.closest?.('[data-ct${v}-watchlist]')`,`e.target.closest?.('[data-ct${v}-watchlist-disabled]')`);
}
js=js.replaceAll("e.target.closest?.('[data-ct117-watchlist-stat]')","e.target.closest?.('[data-ct117-watchlist-stat-disabled]')");

js=once(js,"const REVISION='r232-official-1.0.24';","const REVISION='r234-official-1.0.26';",'revision');
js=once(js,"window.__ctWebBuild='1.0.24';window.__ctOfficialVersion='1.0.24';","window.__ctWebBuild='1.0.26';window.__ctOfficialVersion='1.0.26';",'identity');
js=js.replaceAll('CineTracker • v1.0.24','CineTracker • v1.0.26')
     .replaceAll("JSON.stringify({version:'1.0.24',revision:REVISION","JSON.stringify({version:'1.0.26',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');

html=html.replaceAll('r232-official-1.0.24','r234-official-1.0.26')
         .replaceAll('app-v232.js','app-v234.js')
         .replaceAll('app-v232.css','app-v234.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.26-r234';")
     .replaceAll('app-v232.js','app-v234.js')
     .replaceAll('app-v232.css','app-v234.css');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v234.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v234.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({
   version:'1.0.26',
   revision:'r234-official-1.0.26',
   base:'r232-official-1.0.24',
   home:'instant-known-state+nonblocking-single-detail-refresh',
   discover:'r124-target-sections-only-top10-untouched',
   sports:'r123-layout-preserved-event-driven',
   watchlist:'full-logical-rows-single-authority-visible-poster-enrichment',
   authority:'real-regressions-baseline-preserving-authority',
   generated_at:new Date().toISOString()
 },null,2),'utf8')
]);
await Promise.all([
 rm(resolve(dist,'app-v232.js'),{force:true}),
 rm(resolve(dist,'app-v232.css'),{force:true})
]);
console.log('WEB_1_0_26_READY baseline=r232/r229 home=nonblocking discover=top10-untouched sports=r123 watchlist=full-logical');
