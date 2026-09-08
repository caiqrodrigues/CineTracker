import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* Deliberately restart from official 1.0.0/r204. Do not import r205/r208/r211/r214/r215/r216. */
await import('./build-r204.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v204.js'),'utf8'),
  readFile(resolve(dist,'app-v204.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r217-v111-consolidated.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`1.0.11 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of [
  "window.__ctR217Consolidated='v111-r204-r243-single-release-authority'",
  "window.__ctV111History='hidden-above-home-rewatch-explicit'",
  "window.__ctV111F1='single-hub-season-payload'",
  "window.__ctV111Top10='three-complete-cards-mobile'",
  'data-ct111-rewatch','ct-f1-v111',"edge('cinetracker-f1-v1',{season},30000)"
])if(!patch.includes(must))throw new Error('1.0.11 patch missing '+must);
for(const forbidden of ["window.__ctR208='v104-authoritative-internal-runtime'","window.__ctR214='v107-ui-regression-hotfix'","window.__ctR215HomeComposition","window.__ctR216RealRegressions"])
  if(js.includes(forbidden))throw new Error('1.0.11 r204 base unexpectedly contains later authority '+forbidden);
if(!js.includes("const REVISION='r204-official-1.0.0';"))throw new Error('1.0.11 requires exact r204 base');
if(!js.includes("window.__ctWebBuild='1.0.0';window.__ctOfficialVersion='1.0.0';"))throw new Error('1.0.11 requires exact 1.0.0 identity');
if(!js.includes('\nboot();'))throw new Error('1.0.11 boot insertion point missing');
js=once(js,"const REVISION='r204-official-1.0.0';","const REVISION='r217-official-1.0.11';",'revision');
js=once(js,"window.__ctWebBuild='1.0.0';window.__ctOfficialVersion='1.0.0';","window.__ctWebBuild='1.0.11';window.__ctOfficialVersion='1.0.11';window.__ctRelease111='consolidated-from-r204';",'identity');
js=once(js,'CineTracker • v1.0.0 • ${REVISION}','CineTracker • v1.0.11 • ${REVISION}','footer');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r204-official-1.0.0','r217-official-1.0.11').replaceAll('app-v204.js','app-v217.js').replaceAll('app-v204.css','app-v217.css');
/* r204 descends from prebuilt-r161, whose SW uses const CACHE rather than const VERSION. */
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r204 service worker CACHE declaration missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.11-r217';").replaceAll('app-v204.js','app-v217.js').replaceAll('app-v204.css','app-v217.css').replaceAll('r204-official-1.0.0','r217-official-1.0.11');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v217.js'),js,'utf8'),writeFile(resolve(dist,'app-v217.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.11',revision:'r217-official-1.0.11',base:'r204-official-1.0.0',policy:'skip-r205-r216',history:'hidden-above-home+explicit-rewatch',f1:'single-season-hub',top10:'3-complete-mobile',sports:'no-summary-single-column-mobile',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v204.js'),{force:true}),rm(resolve(dist,'app-v204.css'),{force:true})]);
console.log('WEB_1_0_11_READY base=r204 skipped=r205-r216 authority=r217 sw=cache-r217');
