import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r211.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v211.js'),'utf8'),
  readFile(resolve(dist,'app-v211.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r215-v109-home-composition.js'),'utf8')
]);
for(const m of ["window.__ctR215HomeComposition='no-standalone-history-home'","window.__ctHomeHistoryPolicy='history-hidden-from-home-canonical-buckets-only'",'__ctCleanHomeHistory'])if(!patch.includes(m))throw new Error('Web 1.0.9 Home authority missing '+m);
if(!js.includes('\nboot();'))throw new Error('Web 1.0.9 insertion point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
js=js
  .replaceAll("window.__ctWebBuild='1.0.7'","window.__ctWebBuild='1.0.9'")
  .replaceAll("window.__ctOfficialVersion='1.0.7'","window.__ctOfficialVersion='1.0.9'")
  .replaceAll("const REVISION='r211-official-1.0.7';","const REVISION='r215-official-1.0.9';")
  .replaceAll('CineTracker • v1.0.7','CineTracker • v1.0.9');
html=html.replaceAll('app-v211.js','app-v215.js').replaceAll('app-v211.css','app-v215.css').replaceAll('r211-official-1.0.7','r215-official-1.0.9');
const swVersion=/const\s+VERSION\s*=\s*['"][^'"]+['"]\s*;/;
if(!swVersion.test(sw))throw new Error('Web 1.0.9 service worker VERSION missing');
sw=sw.replace(swVersion,"const VERSION='ct-web-1.0.9-r215';").replaceAll('app-v211.js','app-v215.js').replaceAll('app-v211.css','app-v215.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v215.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v215.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.9',revision:'r215-official-1.0.9',base:'1.0.7-r211-hotfix1',home:'canonical-buckets-only-no-standalone-history',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v211.js'),{force:true}),rm(resolve(dist,'app-v211.css'),{force:true})]);
console.log('WEB_1_0_9_READY revision=r215 home=canonical-buckets-only history=hidden');
