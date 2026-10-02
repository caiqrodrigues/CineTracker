import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r445.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v445.js'),'utf8'),
  readFile(resolve(dist,'app-v445.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);

const onlineHandler="window.addEventListener('online',()=>{if(session)void render()});";
if(!js.includes(onlineHandler))throw new Error('r446 online auto-render handler missing');
js=js.replace(onlineHandler,"window.addEventListener('online',()=>{});");

html=html.replaceAll('app-v445.js','app-v446.js').replaceAll('app-v445.css','app-v446.css');
sw=sw.replaceAll('app-v445.js','app-v446.js').replaceAll('app-v445.css','app-v446.css').replaceAll('ct-web-1.0.236-r445','ct-web-1.0.237-r446');
const release=JSON.parse(releaseRaw);
Object.assign(release,{
  version:'1.0.237',
  revision:'r446-official-1.0.237',
  base:'r445+online-render-guard',
  scope:'automatic-page-refresh-only',
  page_reload:false,
  online_auto_render:false,
  discover_foryou:'unchanged-r445',
  home:'unchanged-r445',
  profile:'unchanged-r445',
  sports:'unchanged-r445',
  android:'unchanged'
});

await Promise.all([
  writeFile(resolve(dist,'app-v446.js'),js),
  writeFile(resolve(dist,'app-v446.css'),css),
  writeFile(resolve(dist,'index.html'),html),
  writeFile(resolve(dist,'service-worker.js'),sw),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v445.js'),{force:true}),rm(resolve(dist,'app-v445.css'),{force:true})]);

if(js.includes(onlineHandler))throw new Error('r446 online auto-render survived');
for(const bad of ['window.location.reload(','router.refresh(','setInterval(','while(true)'])if(js.includes(bad))throw new Error('r446 forbidden '+bad);
if(!js.includes("window.addEventListener('online',()=>{});"))throw new Error('r446 online guard missing');
console.log('WEB_R446_READY');
