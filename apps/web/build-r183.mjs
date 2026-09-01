import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r182.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,extraCss]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v182.js'),'utf8'),
  readFile(resolve(dist,'app-v182.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r183.js'),'utf8'),
  readFile(resolve(root,'r183.css'),'utf8')
]);
if(!js.includes("const REVISION='r182-home-season-polish';"))throw new Error('r183 requires r182 base');
if(!js.includes("window.__ctR182='home-clean-status-season-compact-control';"))throw new Error('r183 requires r182 behavior');
if(!js.includes("window.__ctR180='strict-discover-profile-layout';"))throw new Error('r183 requires r180 profile/discover base');
if(!js.includes('\nboot();'))throw new Error('r183 insertion point missing');
js=js.replace("const REVISION='r182-home-season-polish';","const REVISION='r183-web-clean-profile';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+extraCss+'\n';
html=html.replaceAll('r182-home-season-polish','r183-web-clean-profile').replaceAll('app-v182.js','app-v183.js').replaceAll('app-v182.css','app-v183.css');
sw=sw.replaceAll('r182-home-season-polish','r183-web-clean-profile').replaceAll('app-v182.js','app-v183.js').replaceAll('app-v182.css','app-v183.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v183.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v183.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r183-web-clean-profile',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v182.js'),{force:true}),rm(resolve(dist,'app-v182.css'),{force:true})]);
console.log('WEB_R183_READY headers=clean profile=balanced extra=collapsible android=untouched');
