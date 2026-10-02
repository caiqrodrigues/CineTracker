import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r435.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v435.js'),'utf8'),
 readFile(resolve(dist,'app-v435.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

const paintStart='function paintForYou(){';
const paintEnd='\nasync function recordVisible(){';
const pi=js.indexOf(paintStart),pe=js.indexOf(paintEnd,pi);
if(pi<0||pe<0)throw new Error('r437 paintForYou source not found');
const stablePaint=`function paintForYou(){
 const h=host();if(!h||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;
 const next=forYouMarkup();
 if(h.__ctR437ForYouMarkup===next){h.dataset.ct309Owned='foryou';return true}
 h.innerHTML=next;h.__ctR437ForYouMarkup=next;h.dataset.ct309Owned='foryou';
 try{armDiscoverRails263?.(h)}catch{}
 return true;
}`;
js=js.slice(0,pi)+stablePaint+js.slice(pe);

const loadingOld="const token=++fyToken,h=host();if(h&&!fy)h.innerHTML='<div class=\"ct263-loading ct309-loading\">Montando recomendações…</div>';";
const loadingNew="const token=++fyToken,h=host();if(h&&!fy&&!h.querySelector('.ct309-loading'))h.innerHTML='<div class=\"ct263-loading ct309-loading\">Montando recomendações…</div>';";
if(!js.includes(loadingOld))throw new Error('r437 loading guard source not found');
js=js.replace(loadingOld,loadingNew);

js=js.replaceAll('1.0.226','1.0.228').replaceAll('r435-official-1.0.226','r437-official-1.0.228');
html=html.replaceAll('app-v435.js','app-v437.js').replaceAll('app-v435.css','app-v437.css').replaceAll('v1.0.226','v1.0.228').replaceAll('r435-official-1.0.226','r437-official-1.0.228');
sw=sw.replaceAll('ct-web-1.0.226-r435','ct-web-1.0.228-r437').replaceAll('app-v435.js','app-v437.js').replaceAll('app-v435.css','app-v437.css');
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'1.0.228',revision:'r437-official-1.0.228',base:'r435+foryou-idempotent-paint',scope:'discover-foryou-only',discover_foryou:'Pra Você keeps the existing DOM for identical recommendation markup and avoids resetting the loading placeholder during concurrent stale builds',home:'unchanged',profile:'unchanged',sports:'unchanged',android:'unchanged'});
await Promise.all([
 writeFile(resolve(dist,'app-v437.js'),js),
 writeFile(resolve(dist,'app-v437.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v435.js'),{force:true}),rm(resolve(dist,'app-v435.css'),{force:true})]);
if(!js.includes('h.__ctR437ForYouMarkup===next'))throw new Error('r437 stable paint missing');
if(!js.includes("!h.querySelector('.ct309-loading')"))throw new Error('r437 loading guard missing');
if(js.includes('window.location.reload(')||js.includes('router.refresh('))throw new Error('r437 forbidden refresh survived');
console.log('WEB_R437_READY');
