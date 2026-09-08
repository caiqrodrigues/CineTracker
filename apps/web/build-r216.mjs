import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r215.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v215.js'),'utf8'),
  readFile(resolve(dist,'app-v215.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r216-v110-real-regressions.js'),'utf8')
]);
for(const m of ["window.__ctR216RealRegressions='foryou-f1-rewatch-history-mobile-layout'","window.__ctV110Acceptance='video-1001745761'",'data-ct216-rewatch','__ctV110GetF1'])if(!patch.includes(m))throw new Error('Web 1.0.10 patch missing '+m);

/* Fix r211 Pra Voce blocker at its source: recommendation state gets a hard timeout and
   falls back to the last state instead of holding Discover forever. */
const oldRec="async function loadRecState(force=false){if(!force&&Date.now()-recAt<15000)return recState;try{const x=await rpc('cinetracker_recommendation_state_v107',{});if(x&&typeof x==='object')recState=x;recAt=Date.now()}catch{}return recState}";
const newRec="async function loadRecState(force=false){if(!force&&Date.now()-recAt<15000)return recState;try{const x=await Promise.race([rpc('cinetracker_recommendation_state_v107',{}),new Promise(r=>setTimeout(()=>r(null),3500))]);if(x&&typeof x==='object')recState=x;recAt=Date.now()}catch{}return recState}";
if(!js.includes(oldRec))throw new Error('Web 1.0.10 could not locate r211 recommendation blocker');
js=js.replace(oldRec,newRec);

/* Replace the naked F1 fetch with the canonical edge helper. This supplies publishable/session
   headers and uses the v4 backend deployed for partial/retry behavior. */
const f1Start=js.indexOf('async function getF1(force=false){');
const f1End=f1Start<0?-1:js.indexOf('\nconst standings=',f1Start);
if(f1Start<0||f1End<f1Start)throw new Error('Web 1.0.10 could not locate F1 loader');
const f1Fn="async function getF1(force=false){if(!force&&f1Data&&Date.now()-f1At<300000)return f1Data;const season=new Date().getFullYear(),cached=window.__ctV110GetF1?null:null;try{const d=await edge('cinetracker-f1-v1',{season},30000);if(!d||!Array.isArray(d.races))throw new Error('F1 sem calendário');f1Data=d;f1At=Date.now();try{localStorage.setItem('ct:v110:f1:'+season,JSON.stringify({at:f1At,data:d}))}catch{}return f1Data}catch(err){try{const hit=JSON.parse(localStorage.getItem('ct:v110:f1:'+season)||'null');if(hit?.data){f1Data=hit.data;f1At=Number(hit.at||0);return f1Data}}catch{}throw err}}";
js=js.slice(0,f1Start)+f1Fn+js.slice(f1End);

if(!js.includes('\nboot();'))throw new Error('Web 1.0.10 insertion point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
js=js
  .replaceAll("window.__ctWebBuild='1.0.9'","window.__ctWebBuild='1.0.10'")
  .replaceAll("window.__ctOfficialVersion='1.0.9'","window.__ctOfficialVersion='1.0.10'")
  .replaceAll("const REVISION='r215-official-1.0.9';","const REVISION='r216-official-1.0.10';")
  .replaceAll('CineTracker • v1.0.9','CineTracker • v1.0.10');
html=html.replaceAll('app-v215.js','app-v216.js').replaceAll('app-v215.css','app-v216.css').replaceAll('r215-official-1.0.9','r216-official-1.0.10');
const swVersion=/const\s+VERSION\s*=\s*['"][^'"]+['"]\s*;/;
if(!swVersion.test(sw))throw new Error('Web 1.0.10 service worker VERSION missing');
sw=sw.replace(swVersion,"const VERSION='ct-web-1.0.10-r216';").replaceAll('app-v215.js','app-v216.js').replaceAll('app-v215.css','app-v216.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v216.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v216.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.10',revision:'r216-official-1.0.10',acceptance:'video-1001745761',fixes:['foryou-timeout','f1-edge-v4','history-rewatch','mobile-three-full-cards','sports-single-column'],generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v215.js'),{force:true}),rm(resolve(dist,'app-v215.css'),{force:true})]);
console.log('WEB_1_0_10_READY revision=r216 acceptance=video-1001745761');
