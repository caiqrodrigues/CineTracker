import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r166-final.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v166.js'),'utf8'),
  readFile(resolve(dist,'app-v166.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);

if(!js.includes("const REVISION='r166-discover-sports-profile-fixes';"))throw new Error('r167 requires r166 base');
if(!js.includes("window.__ctR166='discover-sports-profile-fixes';"))throw new Error('r167 requires r166 runtime');
if(!js.includes("function ct163MoreButton"))throw new Error('r167 requires r163 decorator base');
if(!js.includes("function primeHomeHistory158"))throw new Error('r167 requires Home history viewport');
if(!js.includes("function ct166FmtMinutes"))throw new Error('r167 requires compact time formatter');
if(!js.includes('\nboot();'))throw new Error('r167 final insertion point missing');

js=js.replace("const REVISION='r166-discover-sports-profile-fixes';","const REVISION='r167-ui-home-sports-complete';");

const patch=String.raw`
/* r167: DOM-safe Discover + requested Profile stats + stable Home start + complete current sports */
window.__ctR167='discover-dom-profile-home-sports';
window.__ct167DiscoverFix='no-string-appendChild';
window.__ct167ProfileStats='two-rows-five-cards';
window.__ct167HomeStart='instant-main-history-hidden';
window.__ct167SportsCoverage='force-current-day-and-favorite-round';

/* r163 returned HTML strings to appendChild(), which requires a Node. r166 already owns
   Discover controls, so the old decorator is intentionally disabled there. Profile keeps
   its legacy Ver mais buttons, but inserts their HTML safely. */
ct163Decorate=function(){
  if(route()!=='profile')return;
  document.querySelectorAll('[data-profile] .panel-head').forEach(h=>{
    if(h.querySelector('.section-more'))return;
    const txt=h.querySelector('h2')?.textContent||'';
    if(['Séries','Filmes','Séries Favoritas','Filmes Favoritos','Atores Favoritos'].includes(txt)){
      h.insertAdjacentHTML('beforeend',ct163MoreButton(txt,'profile:'+norm(txt)));
    }
  });
};

function ct167StatCard(label,value){
  return '<div class="stat"><small>'+esc(label)+'</small><b>'+value+'</b></div>';
}
function ct167FixProfileDom(d=profileCache||{}){
  const root=$('[data-profile]');if(!root)return;
  const s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{};
  const seriesWatchMinutes=Math.max(0,Number(rem.watchlist_series_remaining_minutes??rem.series_remaining_minutes??0));
  const movieWatchMinutes=Math.max(0,Number(rem.watchlist_movie_minutes??0));
  const top=[
    ['Episódios',Number(s.episodes_watched||0).toLocaleString('pt-BR')],
    ['Filmes',Number(s.movies_watched||0).toLocaleString('pt-BR')],
    ['Séries Watchlist',Number(rem.watchlist_series??ss.not_started_series??0).toLocaleString('pt-BR')],
    ['Filmes Watchlist',Number(rem.watchlist_movies??ss.watchlist_movies??0).toLocaleString('pt-BR')],
    ['Tempo total de tela',ct166FmtMinutes(s.total_minutes)]
  ];
  const bottom=[
    ['Tempo em Séries',ct166FmtMinutes(s.series_minutes)],
    ['Tempo em Filmes',ct166FmtMinutes(s.movie_minutes)],
    ['Tempo de série em Watchlist',ct166FmtMinutes(seriesWatchMinutes)],
    ['Tempo de filme em Watchlist',ct166FmtMinutes(movieWatchMinutes)],
    ['Tempo total em Watchlist',ct166FmtMinutes(seriesWatchMinutes+movieWatchMinutes)]
  ];
  const panels=[...root.querySelectorAll('section.panel')];
  const statsPanel=panels.find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');
  if(statsPanel){
    statsPanel.innerHTML='<div class="panel-head"><h2>Estatísticas</h2><small>sincronizadas</small></div>'+
      '<div class="stats ct167-stats-row">'+top.map(x=>ct167StatCard(x[0],x[1])).join('')+'</div>'+
      '<div class="stats ct167-stats-row ct167-stats-row-bottom">'+bottom.map(x=>ct167StatCard(x[0],x[1])).join('')+'</div>';
  }
  const libraryPanel=panels.find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Biblioteca');
  if(libraryPanel)libraryPanel.remove();
}
const ct167PaintProfileBase=paintProfile163;
paintProfile163=function(d){ct167PaintProfileBase(d);ct167FixProfileDom(d)};
const ct167RenderProfileBase=renderProfile;
renderProfile=async function(seq){
  await ct167RenderProfileBase(seq);
  if(seq===navSeq&&route()==='profile')ct167FixProfileDom(profileCache||{});
};

/* Never animate through hidden history on first paint or tab change. The viewport jumps
   directly to home-start (Assistir a seguir / Watchlist), while history remains above it. */
primeHomeHistory158=function(kind=homeActiveTab158){
  const vp=document.querySelector('[data-home-viewport="'+kind+'"]');
  const hist=vp?.querySelector('.home-history');
  if(!vp||!hist)return;
  vp.style.scrollBehavior='auto';
  vp.scrollTop=hist.offsetHeight;
};

let ct167SportsTodayTask=null;
async function ct167EnsureCurrentSports(){
  if(ct167SportsTodayTask)return ct167SportsTodayTask;
  const key='ct:r167:sports:today:'+localDay();
  if(sessionStorage.getItem(key)==='1')return sportsCache;
  ct167SportsTodayTask=(async()=>{
    const p=sportsCache||{};
    const sports=(p.sports||[]).map(x=>x.slug).filter(Boolean);
    await edge('ct-sports-sync',{
      action:'sync',date_from:localDay(),date_to:localDay(),
      sports:sports.length?sports:undefined,force:true
    },90000);
    sessionStorage.setItem(key,'1');
    sportsCache=null;
    const fresh=await sportsPayload(true);
    if(route()==='sports')paintSports(fresh);
    return fresh;
  })().catch(e=>{console.warn('r167 sports current sync',e);return sportsCache}).finally(()=>{ct167SportsTodayTask=null});
  return ct167SportsTodayTask;
}
const ct167RenderSportsBase=renderSports;
renderSports=async function(seq){
  await ct167RenderSportsBase(seq);
  if(seq!==navSeq||route()!=='sports')return;
  setTimeout(()=>void ct167EnsureCurrentSports(),50);
};

/* The deployed sports synchronizer accepts only 3 days per request. For a favorite,
   force the first [-2..today] block so an incomplete cached round is rebuilt in full. */
const ct167FavoriteSyncBase=ct166SyncFavoriteWindow;
ct166SyncFavoriteWindow=async function(entityId,sportSlug,onProgress){
  const todayKey='ct:r167:favorite-round:'+String(entityId)+':'+localDay();
  if(sessionStorage.getItem(todayKey)==='1')return ct167FavoriteSyncBase(entityId,sportSlug,onProgress);
  try{
    await edge('ct-sports-sync',{action:'sync',date_from:shiftDays(-2),date_to:localDay(),sports:[sportSlug],force:true},90000);
    sessionStorage.setItem(todayKey,'1');
  }catch(e){console.warn('r167 favorite round sync',e)}
  return ct167FavoriteSyncBase(entityId,sportSlug,onProgress);
};
`;

js=js.replace('\nboot();',patch+'\nboot();');

css+=String.raw`
/* r167 */
.home-viewport{scroll-behavior:auto!important}
.ct167-stats-row-bottom{margin-top:8px}
@media(max-width:900px){.ct167-stats-row{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media(max-width:700px){.ct167-stats-row{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
`;

html=html.replaceAll('r166-discover-sports-profile-fixes','r167-ui-home-sports-complete').replaceAll('app-v166.js','app-v167.js').replaceAll('app-v166.css','app-v167.css');
sw=sw.replaceAll('r166-discover-sports-profile-fixes','r167-ui-home-sports-complete').replaceAll('app-v166.js','app-v167.js').replaceAll('app-v166.css','app-v167.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v167.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v167.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r167-ui-home-sports-complete',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v166.js'),{force:true}),rm(resolve(dist,'app-v166.css'),{force:true})]);
console.log('WEB_R167_READY discover=dom-safe profile=10-requested-stats home=instant-start sports=current-complete');
