import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r179.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,extraCss]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v179.js'),'utf8'),
  readFile(resolve(dist,'app-v179.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r180.js'),'utf8'),
  readFile(resolve(root,'r180.css'),'utf8')
]);
if(!js.includes("const REVISION='r179-home-target-card';"))throw new Error('r180 requires r179 base');
if(!js.includes("window.__ctR179='home-target-card-by-media-id';"))throw new Error('r180 requires r179 runtime');
if(!js.includes("window.__ctR172='home-episode-meta-logical-seen-canonical-streamings-detail-frame';"))throw new Error('r180 requires canonical streaming rules');
if(!js.includes('\nboot();'))throw new Error('r180 insertion point missing');
js=js.replace("const REVISION='r179-home-target-card';","const REVISION='r180-discover-profile-parity';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+extraCss+'\n';
html=html.replaceAll('r179-home-target-card','r180-discover-profile-parity').replaceAll('app-v179.js','app-v180.js').replaceAll('app-v179.css','app-v180.css');
sw=sw.replaceAll('r179-home-target-card','r180-discover-profile-parity').replaceAll('app-v179.js','app-v180.js').replaceAll('app-v179.css','app-v180.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v180.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v180.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r180-discover-profile-parity',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v179.js'),{force:true}),rm(resolve(dist,'app-v179.css'),{force:true})]);
console.log('WEB_R180_READY discover=strict-all-tabs+scroll profile=collapsible+wide-time-cards');
