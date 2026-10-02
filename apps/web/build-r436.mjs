import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r435.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const jsPath=resolve(dist,'app-v435.js');
const htmlPath=resolve(dist,'index.html');
const swPath=resolve(dist,'service-worker.js');
const releasePath=resolve(dist,'release.json');
let [js,html,sw,releaseRaw]=await Promise.all([
  readFile(jsPath,'utf8'),
  readFile(htmlPath,'utf8'),
  readFile(swPath,'utf8'),
  readFile(releasePath,'utf8')
]);

const paintStart='function paintForYou(){';
const paintEnd='\nasync function recordVisible(){';
const pi=js.indexOf(paintStart),pe=js.indexOf(paintEnd,pi);
if(pi<0||pe<0)throw new Error('r436 paintForYou source not found');
const stablePaint=`function paintForYou(){
 const h=host();if(!h||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;
 const next=forYouMarkup();
 if(h.__ctR436ForYouMarkup===next){h.dataset.ct309Owned='foryou';return true}
 h.innerHTML=next;h.__ctR436ForYouMarkup=next;h.dataset.ct309Owned='foryou';
 try{armDiscoverRails263?.(h)}catch{}
 return true;
}`;
js=js.slice(0,pi)+stablePaint+js.slice(pe);

const buildStart='async function buildForYou(force=false){';
const buildEnd='\nconst BROWSE=';
const bi=js.indexOf(buildStart),be=js.indexOf(buildEnd,bi);
if(bi<0||be<0)throw new Error('r436 buildForYou source not found');
const original=js.slice(bi+buildStart.length,be);
if(!original.trim().endsWith('}'))throw new Error('r436 buildForYou body shape changed');
const body=original.trim().slice(0,-1);
const stableBuild=`async function buildForYou(force=false){
 if(window.__ctR436ForYouBuildPromise)return window.__ctR436ForYouBuildPromise;
 const __ctR436Run=(async()=>{
${body}
 })();
 window.__ctR436ForYouBuildPromise=__ctR436Run;
 try{return await __ctR436Run}
 finally{if(window.__ctR436ForYouBuildPromise===__ctR436Run)window.__ctR436ForYouBuildPromise=null}
}`;
js=js.slice(0,bi)+stableBuild+js.slice(be);

js=js.replaceAll('1.0.226','1.0.227').replaceAll('r435-official-1.0.226','r436-official-1.0.227');
html=html.replaceAll('app-v435.js','app-v436.js').replaceAll('app-v435.css','app-v436.css').replaceAll('v1.0.226','v1.0.227').replaceAll('r435-official-1.0.226','r436-official-1.0.227');
sw=sw.replaceAll('ct-web-1.0.226-r435','ct-web-1.0.227-r436').replaceAll('app-v435.js','app-v436.js').replaceAll('app-v435.css','app-v436.css');
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'1.0.227',revision:'r436-official-1.0.227',base:'r435+foryou-single-flight-stable-paint',scope:'discover-foryou-only',discover_foryou:'Pra Você uses a single in-flight build and skips identical DOM paints to prevent flashing/reloading',home:'unchanged',profile:'unchanged',sports:'unchanged',android:'unchanged'});
await Promise.all([
 writeFile(resolve(dist,'app-v436.js'),js),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
if(js.includes('function paintForYou(){')&&js.includes('h.__ctR436ForYouMarkup===next')){}else throw new Error('r436 stable paint missing');
if(!js.includes('window.__ctR436ForYouBuildPromise'))throw new Error('r436 single-flight guard missing');
if(js.includes('window.location.reload(')||js.includes('router.refresh('))throw new Error('r436 forbidden refresh survived');
console.log('WEB_R436_READY');
