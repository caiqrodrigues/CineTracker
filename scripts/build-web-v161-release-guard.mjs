import {readFile,writeFile,rm,cp,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const dist=resolve(root,'dist');
const webDist=resolve(root,'apps/web/dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v160.js'),'utf8'),
  readFile(resolve(dist,'app-v160.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);

if(!js.includes("const REVISION='r160-sports-recent-history-order';"))throw new Error('r161 requires r160 final runtime');
if(!js.includes("window.__ctRuntimeAuthority='single-clean-runtime';"))throw new Error('r161 single authority missing');
if(!js.includes('const paintHome159For160=paintHome;'))throw new Error('r161 Home deterministic renderer anchor missing');
if(!js.includes('\nasync function globalSearch'))throw new Error('r161 insertion point missing');
if(!html.includes('/app-v160.js?ct=r160-sports-recent-history-order'))throw new Error('r161 base script tag missing');

js=js.replace("const REVISION='r160-sports-recent-history-order';","const REVISION='r161-release-guard';");

const r161=String.raw`
/* r161 production release guard + yesterday sports + deterministic hidden Home history */
window.__ctReleaseGuard='r161-release-guard';

function watchedAt161(x){
  const raw=x?.watched_at||x?.last_watched_at||x?.updated_at||x?.created_at||0;
  const ms=new Date(raw).getTime();return Number.isFinite(ms)?ms:0;
}
paintHome=function(){
  const p=homeCache;
  if(!p||typeof p!=='object')return paintHome159For160();
  const episodes=p.history_episodes,movies=p.history_movies;
  if(Array.isArray(episodes))p.history_episodes=[...episodes].sort((a,b)=>watchedAt161(a)-watchedAt161(b));
  if(Array.isArray(movies))p.history_movies=[...movies].sort((a,b)=>watchedAt161(a)-watchedAt161(b));
  try{return paintHome159For160()}finally{
    if(Array.isArray(episodes))p.history_episodes=episodes;
    if(Array.isArray(movies))p.history_movies=movies;
  }
};

const sportsFiltered160For161=sportsFiltered;
sportsFiltered=function(p){
  if(sportsState.tab==='yesterday'){
    let a=Array.isArray(p?.events)?p.events:[];
    if(sportsState.sport!=='all')a=a.filter(x=>x.sport_slug===sportsState.sport);
    const day=shiftDays(-1);
    return a.filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===day)
      .sort((x,y)=>new Date(y.starts_at)-new Date(x.starts_at));
  }
  return sportsFiltered160For161(p);
};

const paintSports160For161=paintSports;
paintSports=function(p=sportsCache||{}){
  paintSports160For161(p);
  const h=$('[data-sports]');if(!h)return;
  const tabs=h.querySelector('.tabs');
  if(tabs&&!tabs.querySelector('[data-sports-tab="yesterday"]')){
    const today=tabs.querySelector('[data-sports-tab="today"]');
    const b=document.createElement('button');
    b.className='chip '+(sportsState.tab==='yesterday'?'active':'');
    b.dataset.sportsTab='yesterday';b.textContent='Ontem';
    today?.insertAdjacentElement('afterend',b);
  }
  if(sportsState.tab==='yesterday'){
    const sections=[...h.querySelectorAll('section.panel')],last=sections.at(-1),title=last?.querySelector('.panel-head h2');
    if(title)title.textContent='Jogos de ontem';
  }
};

let releaseCheckBusy161=false,releaseMismatch161=false;
async function checkRelease161(reason='manual'){
  if(releaseMismatch161)return true;
  if(releaseCheckBusy161)return false;
  releaseCheckBusy161=true;
  try{
    const r=await fetch('/release.json?ct='+Date.now(),{cache:'no-store',headers:{'cache-control':'no-cache'}});
    if(!r.ok)return false;
    const d=await r.json().catch(()=>null);
    if(d?.revision&&d.revision!==REVISION){
      releaseMismatch161=true;
      const u=new URL(location.href);
      u.searchParams.set('ct_refresh',String(d.revision));
      location.replace(u.toString());
      return true;
    }
  }catch{}
  finally{releaseCheckBusy161=false}
  return false;
}
window.__ctCheckRelease=checkRelease161;
window.addEventListener('focus',()=>void checkRelease161('focus'));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void checkRelease161('visible')});
document.addEventListener('click',e=>{if(e.target.closest?.('[data-nav]'))void checkRelease161('navigation')},true);
setInterval(()=>{if(!document.hidden)void checkRelease161('interval')},60000);
setTimeout(()=>void checkRelease161('boot'),2500);
`;

js=js.replace('\nasync function globalSearch',r161+'\nasync function globalSearch');
html=html
  .replace('/app-v160.js?ct=r160-sports-recent-history-order','/app-v161.js?ct=r161-release-guard')
  .replace('/app-v160.css?ct=r160-sports-recent-history-order','/app-v161.css?ct=r161-release-guard')
  .replace('<head>','<head><meta name="ct-revision" content="r161-release-guard">');
sw=sw.replace(/ct-web-0\.99\.7-r160-sports-recent-history-order/g,'ct-web-0.99.7-r161-release-guard');

const release={
  version:'0.99.7',
  revision:'r161-release-guard',
  runtime:'single-clean-runtime',
  generated_at:new Date().toISOString()
};

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v161.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v161.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v160.js'),{force:true}),rm(resolve(dist,'app-v160.css'),{force:true})]);

// Vercel project root is apps/web and publishes apps/web/dist.
// r158 historically populated this directory, while later finalizers only changed root /dist.
// Always replace the Vercel artifact with the final single-runtime output.
await rm(webDist,{recursive:true,force:true});
await mkdir(webDist,{recursive:true});
await cp(dist,webDist,{recursive:true,force:true});
const [publishedHtml,publishedJs,publishedRelease]=await Promise.all([
  readFile(resolve(webDist,'index.html'),'utf8'),
  readFile(resolve(webDist,'app-v161.js'),'utf8'),
  readFile(resolve(webDist,'release.json'),'utf8').then(JSON.parse)
]);
if(!publishedHtml.includes('/app-v161.js?ct=r161-release-guard'))throw new Error('apps/web/dist did not receive r161 HTML');
if(!publishedJs.includes("const REVISION='r161-release-guard';"))throw new Error('apps/web/dist did not receive r161 JS');
if(publishedRelease?.revision!=='r161-release-guard')throw new Error('apps/web/dist did not receive r161 release manifest');
console.log('WEB_R161_BUILT runtime=single release=guard sports=yesterday+recent7 home=watched_at-ascending-hidden vercel=apps/web/dist');
