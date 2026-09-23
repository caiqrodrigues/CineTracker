import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r347.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v347.js'),'utf8'),
 readFile(resolve(dist,'app-v347.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r348-foryou-buttons-only.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r348 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.138';window.__ctOfficialVersion='1.0.138';",
 "const REVISION='r347-official-1.0.138';",
 "const version='1.0.138',revision='r347-official-1.0.138';",
 "boot();"
])if(!js.includes(x))throw new Error('r348 missing '+x);
js=once(js,"window.__ctWebBuild='1.0.138';window.__ctOfficialVersion='1.0.138';","window.__ctWebBuild='1.0.139';window.__ctOfficialVersion='1.0.139';",'version');
js=once(js,"const REVISION='r347-official-1.0.138';","const REVISION='r348-official-1.0.139';",'revision');
js=once(js,"const version='1.0.138',revision='r347-official-1.0.138';","const version='1.0.139',revision='r348-official-1.0.139';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v347.js','app-v348.js').replaceAll('app-v347.css','app-v348.css').replaceAll('v1.0.138','v1.0.139').replaceAll('r347-official-1.0.138','r348-official-1.0.139');
sw=sw.replaceAll('ct-web-1.0.138-r347','ct-web-1.0.139-r348').replaceAll('app-v347.js','app-v348.js').replaceAll('app-v347.css','app-v348.css');
css+='\n/* CineTracker Web 1.0.139 r348 — Descobrir > Pra você buttons only. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.139',revision:'r348-official-1.0.139',base:'r347-production',scope:'discover-foryou-buttons-only',discover_foryou_buttons:'exact-direct-children+2-watch+3-fresh-daily+no-stray-swap',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v348.js'),js),writeFile(resolve(dist,'app-v348.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v347.js'),{force:true}),rm(resolve(dist,'app-v347.css'),{force:true})]);
console.log('WEB_R348_READY');
