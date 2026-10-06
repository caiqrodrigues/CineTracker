/* CineTracker Web 0.3.12 r485 — immediate Home paint, compact Movies rows and strict Profile 12-card authority. */
(()=>{
'use strict';
if(window.__ctR485?.version==='0.3.12')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r485 core unavailable');
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};
const homeLocation=()=>{const p=String(location.pathname||'/').replace(/\/+$/,'')||'/';return p==='/'||p==='/home'};
const homeKind=()=>q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series';

let homeSeq=0;
function applyMovieRows(){
 const stack=q('[data-home-view="movies"] .ct388-movie-stack');
 if(!stack)return false;
 stack.classList.add('ct485-movie-rows');
 return true;
}
function prepareHome(kind='series'){
 const k=kind==='movies'?'movies':'series';
 try{core.ensureHomeShell?.()}catch{}
 try{
  if(!q('[data-home-view="series"]')||!q('[data-home-view="movies"]')){
   const task=window.__ctR388?.renderHome?.();
   Promise.resolve(task).catch(()=>{});
  }
 }catch{}
 try{window.__ctR481?.prime?.(k)}catch{}
 try{window.__ctR477?.bootHome?.(k)}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 if(k==='movies')applyMovieRows();
 return true;
}
function wakeHome(kind='series'){
 const k=kind==='movies'?'movies':'series',seq=++homeSeq;
 try{core.ensureHomeShell?.()}catch{}
 for(const ms of [0,24,70,160,360,720,1400]){
  setTimeout(()=>{
   if(seq!==homeSeq)return;
   if(!(routeNow()==='home'||homeLocation()))return;
   prepareHome(k);
   if(k==='movies')for(const d of [0,80,240,600,1200])setTimeout(()=>{if(seq===homeSeq)applyMovieRows()},d);
  },ms);
 }
 return true;
}

let profileSeq=0;
function hardCapProfile(){
 if(routeNow()!=='profile')return false;
 for(const row of qa('[data-profile] [data-ct476-profile-row]')){
  const cards=qa(':scope > .card',row);
  cards.forEach((card,index)=>{card.hidden=index>=12;card.style.display=index>=12?'none':''});
  row.dataset.ct485ProfileRow='12';
 }
 return true;
}
function reassertProfile(load=false){
 if(routeNow()!=='profile')return false;
 try{window.__ctR476?.paintProfile?.()}catch{}
 hardCapProfile();
 if(load)try{
  Promise.resolve(window.__ctR476?.loadProfile?.(true)).finally(()=>{
   if(routeNow()==='profile'){
    try{window.__ctR476?.paintProfile?.()}catch{}
    hardCapProfile();
   }
  });
 }catch{}
 return true;
}
function wakeProfile(force=true){
 const seq=++profileSeq;
 for(const ms of [0,80,220,520,1100,2200,4200,7000,10000]){
  setTimeout(()=>{
   if(seq!==profileSeq||routeNow()!=='profile')return;
   reassertProfile(force&&ms===80);
  },ms);
 }
 return true;
}

window.addEventListener('pointerdown',e=>{
 const nav=e.target?.closest?.('[data-nav="home"]');
 if(nav){try{core.ensureHomeShell?.()}catch{};wakeHome('series');return}
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab){wakeHome(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series');return}
 if(e.target?.closest?.('[data-nav="profile"]'))setTimeout(()=>wakeProfile(true),0);
},{capture:true,passive:true});
window.addEventListener('click',e=>{
 const nav=e.target?.closest?.('[data-nav="home"]');
 if(nav){setTimeout(()=>wakeHome('series'),0);return}
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab){setTimeout(()=>wakeHome(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series'),0);return}
 if(e.target?.closest?.('[data-nav="profile"]'))setTimeout(()=>wakeProfile(true),0);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{
 if(routeNow()==='home')wakeHome(homeKind());
 if(routeNow()==='profile')wakeProfile(false);
},0));
window.addEventListener('cinetracker:data-changed',()=>{
 if(routeNow()==='home')wakeHome(homeKind());
 if(routeNow()==='profile')wakeProfile(true);
});
window.addEventListener('cinetracker:f1-watched-changed',()=>{if(routeNow()==='home')wakeHome(homeKind())});

const style=document.createElement('style');
style.id='ct485-style';
style.textContent=[
 'html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows{display:flex!important;flex-direction:column!important;gap:8px!important;grid-template-columns:none!important;align-items:stretch!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.ct274-media-card,html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.media-row,html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.card{position:relative!important;display:flex!important;flex-direction:row!important;align-items:center!important;width:100%!important;min-width:0!important;max-width:none!important;min-height:76px!important;padding:8px 10px!important;gap:10px!important;overflow:visible!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows .ct274-row-left{display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;width:auto!important;min-width:0!important;flex:1 1 auto!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows .thumb,html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.card .poster{width:44px!important;min-width:44px!important;max-width:44px!important;height:66px!important;min-height:66px!important;max-height:66px!important;aspect-ratio:2/3!important;flex:0 0 44px!important;border-radius:8px!important;background-size:cover!important;background-position:center!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows .ct274-row-copy,html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.card .card-body{width:auto!important;min-width:0!important;flex:1 1 auto!important;padding:0!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows .ct274-row-copy>b,html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows .ct274-meta,html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows .ct274-sub{display:block!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.ct274-media-card>[data-ct266-watch]{position:static!important;right:auto!important;bottom:auto!important;flex:0 0 32px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important;margin-left:auto!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct481-movie-skeleton.ct485-movie-rows{display:flex!important;flex-direction:column!important;gap:8px!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct481-movie-skeleton.ct485-movie-rows .ct481-sk-card{display:grid!important;grid-template-columns:44px minmax(0,1fr)!important;gap:10px!important;align-items:center!important;width:100%!important;max-width:none!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct481-movie-skeleton.ct485-movie-rows .ct481-sk-card-poster{width:44px!important;height:66px!important;aspect-ratio:2/3!important;border-radius:8px!important}',
 '[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13){display:none!important}',
 '@media(max-width:720px){html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.ct274-media-card,html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.media-row,html body [data-home-view="movies"] .ct388-movie-stack.ct485-movie-rows>.card{width:100%!important;min-width:0!important;max-width:none!important}}'
].join('');
if(!q('#ct485-style'))document.head.appendChild(style);

if(routeNow()==='home'||homeLocation())wakeHome(homeKind());
if(routeNow()==='profile')wakeProfile(true);

window.__ctR485Marker='home-cache-visible+movies-compact-rows+discover-v485-direct+profile-v485-exact-12';
window.__ctR485={version:'0.3.12',scope:'home+movies+discover+profile',wakeHome,prepareHome,applyMovieRows,wakeProfile,reassertProfile};
})();
