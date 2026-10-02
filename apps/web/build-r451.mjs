import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r450.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v450.js'),'utf8'),
 readFile(resolve(dist,'app-v450.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

const runtime=`/* CineTracker Web 1.0.241 r451 — canonical URL, no refresh query. */
(()=>{'use strict';
if(window.__ctR451?.version==='1.0.241')return;
const clean=(value)=>{
 try{
  const u=new URL(value==null?location.href:String(value),location.href);
  if(!u.searchParams.has('ct_refresh'))return value==null?null:value;
  u.searchParams.delete('ct_refresh');
  const relative=u.origin===location.origin?u.pathname+(u.search||'')+(u.hash||''):u.href;
  return relative;
 }catch{return value==null?null:value}
};
const nativePush=history.pushState.bind(history);
const nativeReplace=history.replaceState.bind(history);
history.pushState=(state,title,url)=>nativePush(state,title,url==null?url:clean(url));
history.replaceState=(state,title,url)=>nativeReplace(state,title,url==null?url:clean(url));
const current=clean(null);
if(current)nativeReplace(history.state,'',current);
addEventListener('popstate',()=>{const next=clean(null);if(next)nativeReplace(history.state,'',next)},{passive:true});
window.__ctR451={version:'1.0.241',scope:'canonical-url-only',ctRefreshRemoved:true};
})();`;

const early='<script>'+runtime.replace(/<\\/script/gi,'<\\/script')+'</script>';
if(!html.includes('<head>'))throw new Error('r451 missing head');
html=html.replace('<head>','<head>'+early);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v450.js','app-v451.js').replaceAll('app-v450.css','app-v451.css');
sw=sw.replaceAll('app-v450.js','app-v451.js').replaceAll('app-v450.css','app-v451.css').replaceAll('ct-web-1.0.240-r450','ct-web-1.0.241-r451');
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'1.0.241',revision:'r451-official-1.0.241',base:'r450+canonical-url',scope:'canonical-url-only',ct_refresh_query:'removed before boot and from History API navigation without reload',page_reload:false,home:'unchanged-r450',profile:'unchanged-r450',sports:'unchanged-r450',f1:'unchanged-r450',discover:'unchanged-r450',android:'unchanged'});
await Promise.all([
 writeFile(resolve(dist,'app-v451.js'),js),
 writeFile(resolve(dist,'app-v451.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v450.js'),{force:true}),rm(resolve(dist,'app-v450.css'),{force:true})]);
for(const bad of ['window.location.reload(','router.refresh(','setInterval(','while(true)','new MutationObserver'])if(runtime.includes(bad))throw new Error('r451 forbidden '+bad);
for(const need of ["u.searchParams.has('ct_refresh')","u.searchParams.delete('ct_refresh')","history.pushState=","history.replaceState=","window.__ctR451"])if(!runtime.includes(need))throw new Error('r451 missing '+need);
console.log('WEB_R451_READY');
