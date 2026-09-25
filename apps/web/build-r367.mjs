import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r366.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v366.js'),'utf8'),
 readFile(resolve(dist,'app-v366.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r367-foryou-actions-final.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r367 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.157';window.__ctOfficialVersion='1.0.157';","window.__ctWebBuild='1.0.158';window.__ctOfficialVersion='1.0.158';",'version');
js=once(js,"const REVISION='r366-official-1.0.157';","const REVISION='r367-official-1.0.158';",'revision');
js=once(js,"const version='1.0.157',revision='r366-official-1.0.157';","const version='1.0.158',revision='r367-official-1.0.158';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v366.js','app-v367.js').replaceAll('app-v366.css','app-v367.css').replaceAll('v1.0.157','v1.0.158').replaceAll('r366-official-1.0.157','r367-official-1.0.158');
sw=sw.replaceAll('ct-web-1.0.157-r366','ct-web-1.0.158-r367').replaceAll('app-v366.js','app-v367.js').replaceAll('app-v366.css','app-v367.css');
css+='\n/* CineTracker Web 1.0.158 r367 — single final owner for Pra Voce actions. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.158',revision:'r367-official-1.0.158',base:'r366-production',scope:'discover-foryou-actions-final-owner',discover_foryou_actions:'daily/fresh=watchlist+seen+swap;watch=seen+swap',discover_foryou_click:'clicked-slot-only',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v367.js'),js),writeFile(resolve(dist,'app-v367.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v366.js'),{force:true}),rm(resolve(dist,'app-v366.css'),{force:true})]);
console.log('WEB_R367_READY single final Pra Voce action owner');