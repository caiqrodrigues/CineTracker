import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r185c.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch186,patch187]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v185c.js'),'utf8'),
  readFile(resolve(dist,'app-v185c.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r186-shared.js'),'utf8'),
  readFile(resolve(root,'runtime-r187-web.js'),'utf8')
]);
if(!js.includes("const REVISION='r185c-profile-discover-polish';"))throw new Error('r187 requires r185C Web base');
if(!js.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse';"))throw new Error('r187 requires r185C performance');
if(!js.includes("window.__ctR184GapPrompt='detect-skipped-released-episodes-before-manual-watch';"))throw new Error('r187 must preserve r184 gap prompt');
if(!js.includes('\nboot();'))throw new Error('r187 insertion point missing');
js=js.replace("const REVISION='r185c-profile-discover-polish';","const REVISION='r187-state-authority';");
js=js.replace('\nboot();','\n'+patch186+'\n'+patch187+'\nboot();');
html=html.replaceAll('r185c-profile-discover-polish','r187-state-authority').replaceAll('app-v185c.js','app-v187.js').replaceAll('app-v185c.css','app-v187.css');
sw=sw.replaceAll('r185c-profile-discover-polish','r187-state-authority').replaceAll('app-v185c.js','app-v187.js').replaceAll('app-v185c.css','app-v187.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v187.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v187.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r187-state-authority',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v185c.js'),{force:true}),rm(resolve(dist,'app-v185c.css'),{force:true})]);
console.log('WEB_R187_READY authority=fresh-history-aliases home=next-anchor profile=fresh sports=stable-smart-search');
