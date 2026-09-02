import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r186.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v196.js'),'utf8'),
  readFile(resolve(dist,'app-v196.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r197-minimal-filters.js'),'utf8')
]);
if(!js.includes("const REVISION='r196-watchlist-toggle';"))throw new Error('r197 requires r196 Web base');
if(!patch.includes("window.__ctR197Web='minimal-filter-trigger-existing-filters-only';"))throw new Error('r197 filter runtime marker missing');
if(!patch.includes("window.__ctFilterUI='single-reusable-tune-button-no-business-rule-change';"))throw new Error('r197 reusable filter UI marker missing');
if(!patch.includes('ct-mini-filter-trigger'))throw new Error('r197 filter trigger missing');
if(!js.includes('\nboot();'))throw new Error('r197 insertion point missing');
js=js.replace("const REVISION='r196-watchlist-toggle';","const REVISION='r197-minimal-filters';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r196-watchlist-toggle','r197-minimal-filters').replaceAll('app-v196.js','app-v197.js').replaceAll('app-v196.css','app-v197.css');
sw=sw.replaceAll('r196-watchlist-toggle','r197-minimal-filters').replaceAll('app-v196.js','app-v197.js').replaceAll('app-v196.css','app-v197.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v197.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v197.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r197-minimal-filters',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v196.js'),{force:true}),rm(resolve(dist,'app-v196.css'),{force:true})]);
console.log('WEB_R197_READY filters=minimal-tune-button existing-rules=preserved stats-mode=not-added');
