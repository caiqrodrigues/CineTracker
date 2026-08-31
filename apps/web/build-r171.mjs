import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r170.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,style]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v170.js'),'utf8'),
  readFile(resolve(dist,'app-v170.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r171.js'),'utf8'),
  readFile(resolve(root,'r171.css'),'utf8')
]);
if(!js.includes("const REVISION='r170-reliability-actions-search';"))throw new Error('r171 requires r170 base');
if(!js.includes("window.__ctR170='reliability-actions-person-mixed-related-sports-search';"))throw new Error('r171 requires r170 runtime');
if(!js.includes('\nboot();'))throw new Error('r171 insertion point missing');
// source typo guard: keep the runtime source readable while ensuring the generated PostgREST query is valid.
patch=patch.replace('media?select=id&media_type&media_type=eq.tv','media?select=id,media_type&media_type=eq.tv');
js=js.replace("const REVISION='r170-reliability-actions-search';","const REVISION='r171-top10-seen-providers-activity';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+style+'\n';
html=html.replaceAll('r170-reliability-actions-search','r171-top10-seen-providers-activity').replaceAll('app-v170.js','app-v171.js').replaceAll('app-v170.css','app-v171.css');
sw=sw.replaceAll('r170-reliability-actions-search','r171-top10-seen-providers-activity').replaceAll('app-v170.js','app-v171.js').replaceAll('app-v170.css','app-v171.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v171.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v171.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r171-top10-seen-providers-activity',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v170.js'),{force:true}),rm(resolve(dist,'app-v170.css'),{force:true})]);
console.log('WEB_R171_READY top10=provider-daily seen=badges+episode-sync+rewatch watch=justwatch-style country=production activity=click-day rls=auth-default');
