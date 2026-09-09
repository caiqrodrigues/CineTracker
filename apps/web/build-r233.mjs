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
 readFile(resolve(root,'runtime-r233-v125-system-stability.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.25 expected one ${label}, found ${n}`);return s.replace(a,b)};
const drop=(s,a,label,min=1)=>{const n=s.split(a).length-1;if(n<min)throw new Error(`Web 1.0.25 could not neutralize ${label}; found ${n}`);return s.split(a).join('')};
if(!patch.includes("window.__ctR233V125='system-stability-event-driven-no-competing-observers'"))throw new Error('Web 1.0.25 runtime marker missing');
for(const marker of ["window.__ctV125Home='live-episode-revalidation'","window.__ctV125Discover='event-driven-single-normalizer'","window.__ctV125Sports='event-driven-single-action-authority'","window.__ctV125Watchlist='full-rows-no-tmdb-drop'"])if(!patch.includes(marker))throw new Error('Web 1.0.25 patch missing '+marker);
if(!js.includes("const REVISION='r232-official-1.0.24';"))throw new Error('Web 1.0.25 requires r232/1.0.24 base');
if(!js.includes("window.__ctR229V123='sports-card-single-action-zone-no-floating-actions'"))throw new Error('Web 1.0.25 must preserve v123 Sports CSS/semantics');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.25 boot point missing');

// Remove legacy DOM polling/observers that can rewrite Discover, Sports or Watchlist after the final paint.
js=drop(js,"try{new MutationObserver(sync117).observe(q117('#app')||document.documentElement,{subtree:true,childList:true})}catch{}\n",'r223/v117 observer');
js=drop(js,"try{new MutationObserver(sync119).observe(q119('#app')||document.documentElement,{subtree:true,childList:true})}catch{}\n",'r225/v119 observer');
js=drop(js,"try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}\n",'v120/v122 discover observer');
js=drop(js,"try{new MutationObserver(sync121).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}\nsetInterval(()=>{if(q('[data-page=\"discover\"], [data-discover], [data-sports], [data-profile]'))sync121()},1000);\n",'r227/v121 observer+poll');
js=drop(js,"try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}setInterval(sync,350);sync();",'r228/v122 core observer+350ms poll');
js=drop(js,"setInterval(sync,1200);sync();window.__ctV122MetadataSync=sync;",'r228b metadata 1200ms poll');
js=drop(js,"try{new MutationObserver(sync).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-ct117-watchlist-stat','data-ct118-watchlist','data-ct120-watchlist','data-ct121-watchlist']})}catch{}setInterval(guard,500);guard();",'r228c profile guard poll');
js=drop(js,"try{new MutationObserver(queue).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}setInterval(()=>void sync(false).catch(()=>{}),1500);queue();",'r228d exact-count poll');
js=drop(js,"try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}\nsetInterval(sync,700);sports();",'r229 Sports 700ms observer+poll');
js=drop(js,"try{new MutationObserver(queue).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}\nsetInterval(queue,1200);queue();",'r232 final observer+poll');

js=once(js,"const REVISION='r232-official-1.0.24';","const REVISION='r233-official-1.0.25';",'revision');
js=once(js,"window.__ctWebBuild='1.0.24';window.__ctOfficialVersion='1.0.24';","window.__ctWebBuild='1.0.25';window.__ctOfficialVersion='1.0.25';",'identity');
js=js.replaceAll('CineTracker • v1.0.24','CineTracker • v1.0.25').replaceAll("JSON.stringify({version:'1.0.24',revision:REVISION","JSON.stringify({version:'1.0.25',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r232-official-1.0.24','r233-official-1.0.25').replaceAll('app-v232.js','app-v233.js').replaceAll('app-v232.css','app-v233.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.25-r233';").replaceAll('app-v232.js','app-v233.js').replaceAll('app-v232.css','app-v233.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v233.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v233.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.25',revision:'r233-official-1.0.25',base:'r232-official-1.0.24',home:'live-episode-revalidation',discover:'event-driven-single-normalizer-no-conflicting-observers',sports:'event-driven-single-action-authority-no-700ms-poll',watchlist:'full-rpc-rows-no-tmdb-drop',authority:'system-stability-event-driven-no-competing-observers',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v232.js'),{force:true}),rm(resolve(dist,'app-v232.css'),{force:true})]);
console.log('WEB_1_0_25_READY home=live-episode-revalidation discover=event-driven sports=no-700ms watchlist=full-rows');
