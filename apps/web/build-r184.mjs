import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r183.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,shared,webPatch,sharedCss,webCss]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v183.js'),'utf8'),
  readFile(resolve(dist,'app-v183.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r184-shared.js'),'utf8'),
  readFile(resolve(root,'runtime-r184-web.js'),'utf8'),
  readFile(resolve(root,'r184-shared.css'),'utf8'),
  readFile(resolve(root,'r184-web.css'),'utf8')
]);
if(!js.includes("const REVISION='r183-web-clean-profile';"))throw new Error('r184 requires r183 Web base');
if(!js.includes("window.__ctR183='web-clean-headers-profile-reflow';"))throw new Error('r184 requires r183 layout');
if(!js.includes("window.__ctR181='whole-season-watch-toggle';"))throw new Error('r184 requires r181 season helpers');
if(!js.includes('function openFavoriteSearch158(kind)'))throw new Error('r184 requires existing favorite search');
if(!js.includes('data-add-favorite'))throw new Error('r184 requires existing favorite click authority');
if(!js.includes('\nboot();'))throw new Error('r184 insertion point missing');
js=js.replace("const REVISION='r183-web-clean-profile';","const REVISION='r184-favorites-gap-prompt';");
js=js.replace('\nboot();','\n'+shared+'\n'+webPatch+'\nboot();');
css+='\n'+sharedCss+'\n'+webCss+'\n';
html=html.replaceAll('r183-web-clean-profile','r184-favorites-gap-prompt').replaceAll('app-v183.js','app-v184.js').replaceAll('app-v183.css','app-v184.css');
sw=sw.replaceAll('r183-web-clean-profile','r184-favorites-gap-prompt').replaceAll('app-v183.js','app-v184.js').replaceAll('app-v183.css','app-v184.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v184.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v184.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r184-favorites-gap-prompt',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v183.js'),{force:true}),rm(resolve(dist,'app-v183.css'),{force:true})]);
console.log('WEB_R184_READY profile=favorite-add-restored episode-gap=prompt-skip-or-fill');
