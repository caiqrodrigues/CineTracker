import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r180.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,extraCss]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v180.js'),'utf8'),
  readFile(resolve(dist,'app-v180.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r181.js'),'utf8'),
  readFile(resolve(root,'r181.css'),'utf8')
]);
if(!js.includes("const REVISION='r180-discover-profile-parity';"))throw new Error('r181 requires r180 base');
if(!js.includes("window.__ctR180='strict-discover-profile-layout';"))throw new Error('r181 requires r180 runtime');
if(!js.includes("window.__ctR176='first-released-unwatched-gap-authority';"))throw new Error('r181 requires canonical next episode authority');
if(!js.includes("ct170ReadRpcNames.add('cinetracker_unmark_episode_v1')"))throw new Error('r181 requires reversible episode RPC');
if(!js.includes('\nboot();'))throw new Error('r181 insertion point missing');
js=js.replace("const REVISION='r180-discover-profile-parity';","const REVISION='r181-season-whole-toggle';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+extraCss+'\n';
html=html.replaceAll('r180-discover-profile-parity','r181-season-whole-toggle').replaceAll('app-v180.js','app-v181.js').replaceAll('app-v180.css','app-v181.css');
sw=sw.replaceAll('r180-discover-profile-parity','r181-season-whole-toggle').replaceAll('app-v180.js','app-v181.js').replaceAll('app-v180.css','app-v181.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v181.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v181.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r181-season-whole-toggle',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v180.js'),{force:true}),rm(resolve(dist,'app-v180.css'),{force:true})]);
console.log('WEB_R181_READY season=mark-unmark-all-released previous=confirm r176=next-gap-authority');
