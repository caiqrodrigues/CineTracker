import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r437.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v437.js'),'utf8'),
 readFile(resolve(dist,'app-v437.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);
const removeRange=(source,start,next)=>{const a=source.indexOf(start);if(a<0)throw new Error('r443 missing '+start);const b=source.indexOf(next,a+start.length);if(b<0)throw new Error('r443 missing '+next);return source.slice(0,a)+source.slice(b)};
const replaceRequired=(source,from,to,label)=>{if(!source.includes(from))throw new Error('r443 missing '+label);return source.replace(from,to)};
const replaceFunctionByRevision=(source,revision,functionName,nextMarker)=>{const re=new RegExp('/\\* CineTracker Web [^*]+ '+revision);const m=source.match(re);if(!m)throw new Error('r443 missing runtime '+revision);const a=m.index;const f=source.indexOf('function '+functionName+'(){',a);if(f<0)throw new Error('r443 missing function '+functionName);const e=source.indexOf(nextMarker,f);if(e<0)throw new Error('r443 missing boundary '+functionName);return source.slice(0,f)+'function '+functionName+'(){return false}\\n'+source.slice(e)};

js=removeRange(js,'/* CineTracker Web 1.0.186 r395','/* CineTracker Web 1.0.195 r404');
js=removeRange(js,'/* CineTracker Web 1.0.197 r406','/* CineTracker Web 1.0.203 r412');
js=replaceFunctionByRevision(js,'r404','isForYou','\nfunction unwrap');
js=replaceRequired(js,`loadForYou(force=false){return owner()?.loadForYou?.(force)??Promise.resolve(false)},`,`loadForYou(force=false){return Promise.resolve(window.__ctR309?.buildForYou?.(!!force)??false)},`,'r405 for-you loader');
js=replaceRequired(js,`renderForYou(){return owner()?.renderForYou?.()??false},`,`renderForYou(){return Promise.resolve(window.__ctR309?.buildForYou?.(false)??false)},`,'r405 for-you renderer');
js=replaceFunctionByRevision(js,'r412','isForYou','\nfunction actionHealth');
js=replaceFunctionByRevision(js,'r413','isForYou','\nfunction setForYouState');
js=js.replace(/(\/\* CineTracker Web 1\\.0\\.205 r414[\\s\\S]*?const )isForYou=\\(\\)=>[^;]+;/,'$1isForYou=()=>false;');
js=replaceFunctionByRevision(js,'r415','isForYou','\nfunction repairForYou');
js=replaceFunctionByRevision(js,'r417','isForYou','\nfunction repairForYou417');
js=replaceFunctionByRevision(js,'r418','isForYou','\nfunction repairFY418');

js=js.replaceAll('1.0.234','1.0.229').replaceAll('r437-official-1.0.234','r443-official-1.0.234');
html=html.replaceAll('app-v437.js','app-v438.js').replaceAll('app-v437.css','app-v438.css').replaceAll('v1.0.234','v1.0.229').replaceAll('r437-official-1.0.234','r443-official-1.0.234');
sw=sw.replaceAll('ct-web-1.0.234-r437','ct-web-1.0.229-r443').replaceAll('app-v437.js','app-v438.js').replaceAll('app-v437.css','app-v438.css');
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'1.0.229',revision:'r443-official-1.0.234',base:'r437+legacy-foryou-owner-cutoff',scope:'discover-foryou-only',discover_foryou:'r309/r432 is the sole active Pra Você renderer; legacy r395-r410 and r412-r418/r426 repair predicates are disabled without changing Home/Profile/Sports/F1 producers',discover_actions:'Watchlist/Visto/Trocar remain owned by r309',home:'r404/r405 preserved',profile:'unchanged',sports:'unchanged',android:'unchanged'});
await Promise.all([writeFile(resolve(dist,'app-v438.js'),js),writeFile(resolve(dist,'app-v438.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v437.js'),{force:true}),rm(resolve(dist,'app-v437.css'),{force:true})]);
for(const marker of ['/* CineTracker Web 1.0.186 r395','/* CineTracker Web 1.0.187 r396','/* CineTracker Web 1.0.188 r397','/* CineTracker Web 1.0.189 r398','/* CineTracker Web 1.0.190 r399','/* CineTracker Web 1.0.191 r400','/* CineTracker Web 1.0.192 r401','/* CineTracker Web 1.0.193 r402','/* CineTracker Web 1.0.194 r403','/* CineTracker Web 1.0.197 r406','/* CineTracker Web 1.0.198 r407','/* CineTracker Web 1.0.199 r408','/* CineTracker Web 1.0.201 r410'])if(js.includes(marker))throw new Error('r443 legacy runtime survived '+marker);
if(!js.includes('function isForYou(){return false}'))throw new Error('r443 r404 cutoff missing');
if(!js.includes('loadForYou(force=false){return Promise.resolve(window.__ctR309?.buildForYou?.(!!force)??false)}'))throw new Error('r443 r405 loader bridge missing');
if(!js.includes('renderForYou(){return Promise.resolve(window.__ctR309?.buildForYou?.(false)??false)}'))throw new Error('r443 r405 renderer bridge missing');
if(!js.includes('data-ct309-swap'))throw new Error('r443 Trocar action missing');
if(js.includes('window.location.reload(')||js.includes('router.refresh('))throw new Error('r443 forbidden refresh survived');
console.log('WEB_R438_READY');
