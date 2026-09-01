import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r185b.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,sharedPatch,webPatch,polishCss]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v185b.js'),'utf8'),
  readFile(resolve(dist,'app-v185b.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r185c-shared.js'),'utf8'),
  readFile(resolve(root,'runtime-r185c-web.js'),'utf8'),
  readFile(resolve(root,'r185c-polish-shared.css'),'utf8')
]);
if(!js.includes("const REVISION='r185b-web-prefetch';"))throw new Error('r185C requires r185B Web base');
if(!js.includes("window.__ctR185B='instant-route-shell-prefetch';"))throw new Error('r185C requires r185B runtime');
if(!js.includes("window.__ctR185A='instant-visual-cache-safe-revalidate';"))throw new Error('r185C must preserve r185A');
if(!js.includes('\nboot();'))throw new Error('r185C insertion point missing');
js=js.replace("const REVISION='r185b-web-prefetch';","const REVISION='r185c-profile-discover-polish';");
js=js.replace('\nboot();','\n'+sharedPatch+'\n'+webPatch+'\nboot();');
css+='\n'+polishCss+'\n';
html=html.replaceAll('r185b-web-prefetch','r185c-profile-discover-polish').replaceAll('app-v185b.js','app-v185c.js').replaceAll('app-v185b.css','app-v185c.css');
sw=sw.replaceAll('r185b-web-prefetch','r185c-profile-discover-polish').replaceAll('app-v185b.js','app-v185c.js').replaceAll('app-v185b.css','app-v185c.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v185c.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v185c.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r185c-profile-discover-polish',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v185b.js'),{force:true}),rm(resolve(dist,'app-v185b.css'),{force:true})]);
console.log('WEB_R185C_READY profile=full-idle-prefetch discover=hot-adjacent home=top-anchor polish=geometry-only');
