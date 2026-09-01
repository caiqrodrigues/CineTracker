import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r181.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,extraCss]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v181.js'),'utf8'),
  readFile(resolve(dist,'app-v181.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r182.js'),'utf8'),
  readFile(resolve(root,'r182.css'),'utf8')
]);
if(!js.includes("const REVISION='r181-season-whole-toggle';"))throw new Error('r182 requires r181 base');
if(!js.includes("window.__ctR181='whole-season-watch-toggle';"))throw new Error('r182 requires r181 whole-season behavior');
if(!js.includes("window.__ctR176='first-released-unwatched-gap-authority';"))throw new Error('r182 requires canonical next episode authority');
if(!js.includes('class=\\"badge\\"')&&!js.includes('class="badge"'))throw new Error('r182 requires Home badge source');
if(!js.includes('\nboot();'))throw new Error('r182 insertion point missing');
js=js.replace("const REVISION='r181-season-whole-toggle';","const REVISION='r182-home-season-polish';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+extraCss+'\n';
html=html.replaceAll('r181-season-whole-toggle','r182-home-season-polish').replaceAll('app-v181.js','app-v182.js').replaceAll('app-v181.css','app-v182.css');
sw=sw.replaceAll('r181-season-whole-toggle','r182-home-season-polish').replaceAll('app-v181.js','app-v182.js').replaceAll('app-v181.css','app-v182.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v182.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v182.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r182-home-season-polish',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v181.js'),{force:true}),rm(resolve(dist,'app-v181.css'),{force:true})]);
console.log('WEB_R182_READY home=no-redundant-circle season=compact-inline-toggle r181=behavior-preserved');
