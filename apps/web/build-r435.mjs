import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r434.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v434.js'),'utf8'),
 readFile(resolve(dist,'app-v434.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);
const bad="const discover=dynamicProxy('__ctR288R263.discover263');";
const good="const discover=new Proxy({}, {get(_t,p){try{return window.__ctR288R263?.discover263?.[p]}catch{return undefined}},set(_t,p,v){try{const d=window.__ctR288R263?.discover263;if(d)d[p]=v}catch{}return true}});";
if(!js.includes(bad))throw new Error('r435 broken discover proxy target missing');
js=js.replace(bad,good);
js=js.replaceAll('1.0.225','1.0.226').replaceAll('r434-official-1.0.225','r435-official-1.0.226');
html=html.replaceAll('app-v434.js','app-v435.js').replaceAll('app-v434.css','app-v435.css').replaceAll('v1.0.225','v1.0.226').replaceAll('r434-official-1.0.225','r435-official-1.0.226');
sw=sw.replaceAll('ct-web-1.0.225-r434','ct-web-1.0.226-r435').replaceAll('app-v434.js','app-v435.js').replaceAll('app-v434.css','app-v435.css');
css+='\n/* CineTracker Web 1.0.226 r435 — Pra Você real discover263 proxy. */\n';
const prev=JSON.parse(releaseRaw);
const release={...prev,version:'1.0.226',revision:'r435-official-1.0.226',base:'r434+real-discover263-proxy',scope:'discover-foryou-only',discover_foryou:'Pra Você now reads and writes the real window.__ctR288R263.discover263 object; the literal dotted-property proxy is removed',discover_actions:'Watchlist/Visto/Trocar remain owned by r309',home:'unchanged',profile:'unchanged',sports:'unchanged',android:'unchanged'};
await Promise.all([writeFile(resolve(dist,'app-v435.js'),js),writeFile(resolve(dist,'app-v435.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v434.js'),{force:true}),rm(resolve(dist,'app-v434.css'),{force:true})]);
if(js.includes(bad))throw new Error('r435 broken proxy survived');
if(!js.includes(good))throw new Error('r435 real proxy missing');
if(!js.includes('window.__ctR309Api={buildForYou'))throw new Error('r435 r309 API exposure missing');
if(js.includes('window.location.reload(')||js.includes('router.refresh('))throw new Error('r435 forbidden refresh survived');
console.log('WEB_R435_READY');