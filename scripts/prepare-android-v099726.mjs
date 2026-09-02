import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099725.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r197-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.26: embedded r197 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r197-android-auth-runtime-isolation';"))throw new Error('Android 0.99.7.26 requires 0.99.7.25 runtime');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.26 boot point missing');

function replaceRange(src,start,end,replacement,label){
  const x=src.indexOf(start),y=x<0?-1:src.indexOf(end,x+start.length);
  if(x<0||y<0)throw new Error('Android 0.99.7.26 missing patch target: '+label);
  return src.slice(0,x)+replacement+src.slice(y);
}

/* Sports quick search must never rebuild the entire Sports page while the keyboard is
   active. Only the result grid is updated during typing/search completion. */
js=replaceRange(js,
  'async function ct170RunSportsSearch(q){',
  '\n\n/* ---------- r170 events ---------- */',
`async function ct170RunSportsSearch(q){
  const token=q.trim();
  if(token.length<2){ct170SportsSearch.query='';ct170SportsSearch.entities=[];ct170SportsSearch.error='';ct170SportsSearch.loading=false;ct170RenderSportsSearch(sportsCache||{});return}
  ct170SportsSearch.query=token;ct170SportsSearch.loading=true;ct170SportsSearch.error='';ct170RenderSportsSearch(sportsCache||{});
  try{const d=await edge('ct-sports-search',{query:token,limit:30},20000);if(ct170SportsSearch.query!==token)return;ct170SportsSearch.entities=Array.isArray(d?.entities)?d.entities:[]}
  catch(e){if(ct170SportsSearch.query===token)ct170SportsSearch.error=String(e?.message||e)}
  finally{if(ct170SportsSearch.query===token){ct170SportsSearch.loading=false;ct170RenderSportsSearch(sportsCache||{})}}
}`,
  'ct170RunSportsSearch');

js=replaceRange(js,
  `document.addEventListener('input',e=>{\n  if(!e.target.matches?.('[data-sports-search]'))return;`,
  '\n\n/* r171: Top 10',
`document.addEventListener('input',e=>{
  if(!e.target.matches?.('[data-sports-search]'))return;
  e.stopImmediatePropagation();
  const q=e.target.value.trim();sportsState.query=q;ct170SportsSearch.query=q;clearTimeout(ct170SportsSearch.timer);
  if(q.length<2){ct170SportsSearch.loading=false;ct170SportsSearch.entities=[];ct170SportsSearch.error='';if(!q){const grid=document.querySelector('[data-sports] .event-grid');if(grid&&sportsCache)requestAnimationFrame(()=>paintSports(sportsCache))}return}
  ct170SportsSearch.loading=true;
  const grid=document.querySelector('[data-sports] .event-grid');if(grid)grid.innerHTML='<div class="loader">Buscando times e competições...</div>';
  ct170SportsSearch.timer=setTimeout(()=>void ct170RunSportsSearch(q),320);
},true);`,
  'sports input listener');

/* Watched sports actions are optimistic. The old listener disabled the button, waited for
   Postgres and then re-fetched/repainted the whole Sports payload. */
js=replaceRange(js,
  `document.addEventListener('click',e=>{\n  const b=e.target.closest?.('[data-sport-watched]');if(!b)return;`,
  '\n\n/* r169: richer details',
`document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-sport-watched]');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  const eventId=Number(b.dataset.sportWatched||0);if(!(eventId>0))return;
  const previous=b.dataset.on==='1',next=!previous;
  ct168SetWatchedButtons(eventId,next);
  const setCache=on=>{try{for(const x of sportsCache?.events||[])if(Number(x?.id||0)===eventId)x.is_watched=on;ct163Write('sports',sportsCache);window.__ctA26PersistSports?.()}catch{}};
  setCache(next);
  void rpc('cinetracker_sport_mark_watched_v1',{p_event_id:eventId,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()}).then(result=>{
    const actual=Boolean(result?.is_watched);ct168SetWatchedButtons(eventId,actual);setCache(actual);profileCache=null;try{localStorage.removeItem('cinetracker:preload:r163:profile')}catch{};toast(actual?'Evento marcado como assistido.':'Evento removido dos assistidos.');
  }).catch(x=>{ct168SetWatchedButtons(eventId,previous);setCache(previous);toast('Esportes: '+(x?.message||x))});
},true);`,
  'sports watched listener');

const patch=await readFile(resolve(root,'apps/android/runtime-r198-mobile-performance.js'),'utf8');
js=js.replace("const REVISION='r197-android-auth-runtime-isolation';","const REVISION='r198-android-mobile-performance';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.26-r198-mobile-performance';
window.__ctAndroidWebRevision='r195-no-dorama-sports-profile-density';
window.__ctAndroidPortedWebRange='r190-r195';
window.__ctAndroidPerformance='cache-first-sequential-preload-progressive-render';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r198-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.25-r197-auth-runtime-isolation','android-v0.99.7.26-r198-mobile-performance');
html=html.replace('name="ct-android-v099725" content="r197-auth-runtime-isolation"','name="ct-android-v099726" content="r198-mobile-performance"');
for(const m of [
  'android-v0.99.7.26-r198-mobile-performance','r198-android-mobile-performance','mobile-first-cache-swr-progressive-render',
  'sequential-light-no-request-stampede','persistent-snapshot-tmdb-pages-capped-progressive-cards',
  'persistent-arena-progressive-events-fast-favorite-modal','no-full-repaint-on-search-or-watched-toggle',
  'embedded-apk-never-reloads-from-web-release-json','auth-success-mount-home-shell-before-fast-paint',
  'r190-r195-mobile-equivalents','asian-scripted-tv-excluded-from-foryou','ct-sports-sync-v4+ct-sports-search-v2'
])if(!html.includes(m))throw new Error('Android 0.99.7.26 missing '+m);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099726_READY mobile=cache-first preload=sequential discover=progressive sports=progressive search=no-repaint watched=optimistic');
