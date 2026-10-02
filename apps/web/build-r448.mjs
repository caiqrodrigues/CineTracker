import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r447.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v447.js'),'utf8'),
  readFile(resolve(dist,'app-v447.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);

const fy420="function scheduleDiscover420(){const token=++fyToken420;for(const ms of[0,120,350,900,1800,3600,7000])setTimeout(()=>{if(token===fyToken420&&routeNow()==='discover')void sanitizeForYou420()},ms)}";
const fy421="function scheduleForYouSanitize421(){for(const ms of[300,900,1800,3600,6500])setTimeout(()=>void sanitizeForYou421(),ms)}";
const fy426="function scheduleFY(){const s=++fySeq;for(const ms of[0,80,180,400,800,1500,2800,5000])setTimeout(()=>{if(s===fySeq||isFY())normalizeFY()},ms)}";

if(!js.includes(fy420))throw new Error('r448 r420 scheduler missing');
if(!js.includes(fy421))throw new Error('r448 r421 scheduler missing');
if(!js.includes(fy426))throw new Error('r448 r426 scheduler missing');

js=js.replace(fy420,"function scheduleDiscover420(){}");
js=js.replace(fy421,"function scheduleForYouSanitize421(){}");
js=js.replace(fy426,"function scheduleFY(){}");

html=html.replaceAll('app-v447.js','app-v448.js').replaceAll('app-v447.css','app-v448.css');
sw=sw.replaceAll('app-v447.js','app-v448.js').replaceAll('app-v447.css','app-v448.css').replaceAll('ct-web-1.0.238-r447','ct-web-1.0.239-r448');
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'1.0.239',revision:'r448-official-1.0.239',base:'r447+disable-legacy-foryou-automatic-schedulers',scope:'automatic-page-refresh-only',page_reload:false,automatic_foryou_reentry:false,discover_foryou:'manual renderer/actions unchanged',home:'unchanged-r447',profile:'unchanged-r447',sports:'unchanged-r447',android:'unchanged'});

await Promise.all([
  writeFile(resolve(dist,'app-v448.js'),js),
  writeFile(resolve(dist,'app-v448.css'),css),
  writeFile(resolve(dist,'index.html'),html),
  writeFile(resolve(dist,'service-worker.js'),sw),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v447.js'),{force:true}),rm(resolve(dist,'app-v447.css'),{force:true})]);

for(const bad of [fy420,fy421,fy426,'window.location.reload(','router.refresh(','while(true)'])if(js.includes(bad))throw new Error('r448 forbidden/legacy refresh survived');
if(!js.includes('function scheduleDiscover420(){}'))throw new Error('r448 r420 guard missing');
if(!js.includes('function scheduleForYouSanitize421(){}'))throw new Error('r448 r421 guard missing');
if(!js.includes('function scheduleFY(){}'))throw new Error('r448 r426 guard missing');
console.log('WEB_R448_READY');