import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r171.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,style]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v171.js'),'utf8'),
  readFile(resolve(dist,'app-v171.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r172.js'),'utf8'),
  readFile(resolve(root,'r172.css'),'utf8')
]);
if(!js.includes("const REVISION='r171-top10-seen-providers-activity';"))throw new Error('r172 requires r171 base');
if(!js.includes("window.__ctR171='top10-streaming-seen-rewatch-where-country-activity';"))throw new Error('r172 requires r171 runtime');
if(!js.includes('\nboot();'))throw new Error('r172 insertion point missing');
js=js.replace("const REVISION='r171-top10-seen-providers-activity';","const REVISION='r172-home-episode-streaming-clean';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+style+'\n';
html=html.replaceAll('r171-top10-seen-providers-activity','r172-home-episode-streaming-clean').replaceAll('app-v171.js','app-v172.js').replaceAll('app-v171.css','app-v172.css');
sw=sw.replaceAll('r171-top10-seen-providers-activity','r172-home-episode-streaming-clean').replaceAll('app-v171.js','app-v172.js').replaceAll('app-v171.css','app-v172.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v172.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v172.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r172-home-episode-streaming-clean',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v171.js'),{force:true}),rm(resolve(dist,'app-v171.css'),{force:true})]);
console.log('WEB_R172_READY home=episode-name+rating+date seen=no-card-badge+logical-episodes providers=10-canonical-only detail=better-frame');
