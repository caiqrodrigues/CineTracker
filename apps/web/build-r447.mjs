import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r446.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v446.js'),'utf8'),
  readFile(resolve(dist,'app-v446.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);

const onlineHandler="window.addEventListener('online',()=>{if(session)void render()});";
const fy426="function scheduleFY(){const s=++fySeq;for(const ms of[0,80,180,400,800,1500,2800,5000])setTimeout(()=>{if(s===fySeq||isFY())normalizeFY()},ms)}";
const fy427="const schedule=()=>{for(const ms of [0,80,200,450,900,1600,3000,5000])setTimeout(()=>{if(isFY()){const count=normalize();if(ms===0||count===0)void load(false)}},ms)};";
const fy428="const ct428Schedule=()=>{if(!ct428ForYou())return;const run=ct428Run;for(const ms of [0,100,300,700,1400,2500])setTimeout(()=>{if(run!==ct428Run||!ct428ForYou())return;const n=ct428Normalize();if(n===0&&(ms===0||ms===700))void ct428Load(ms===700)},ms)};";

if(js.includes(onlineHandler))js=js.replace(onlineHandler,"window.addEventListener('online',()=>{});");
else throw new Error('r447 online handler missing');
if(js.includes(fy426))js=js.replace(fy426,"function scheduleFY(){}");
else throw new Error('r447 r426 schedule missing');
if(js.includes(fy427))js=js.replace(fy427,"const schedule=()=>{};");
else throw new Error('r447 r427 schedule missing');
if(js.includes(fy428))js=js.replace(fy428,"const ct428Schedule=()=>{};");
else throw new Error('r447 r428 schedule missing');

html=html.replaceAll('app-v446.js','app-v447.js').replaceAll('app-v446.css','app-v447.css');
sw=sw.replaceAll('app-v446.js','app-v447.js').replaceAll('app-v446.css','app-v447.css').replaceAll('ct-web-1.0.237-r446','ct-web-1.0.238-r447');
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'1.0.238',revision:'r447-official-1.0.238',base:'r446+legacy-foryou-refresh-guards',scope:'automatic-page-refresh-only',page_reload:false,online_auto_render:false,legacy_foryou_auto_schedule:false,discover_foryou:'manual renderer/actions unchanged',home:'unchanged-r446',profile:'unchanged-r446',sports:'unchanged-r446',android:'unchanged'});

await Promise.all([
 writeFile(resolve(dist,'app-v447.js'),js),
 writeFile(resolve(dist,'app-v447.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v446.js'),{force:true}),rm(resolve(dist,'app-v446.css'),{force:true})]);
for(const bad of [onlineHandler,fy426,fy427,fy428,'window.location.reload(','router.refresh(','setInterval(','while(true)'])if(js.includes(bad))throw new Error('r447 forbidden/auto refresh survived');
console.log('WEB_R447_READY');
