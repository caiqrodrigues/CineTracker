/* CineTracker Web 1.0.248 r458 — video ground-truth stabilization. */
(()=>{'use strict';
if(window.__ctR458?.version==='1.0.248')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const later=(fn,delays)=>{for(const ms of delays)setTimeout(fn,ms)};
const isMovies=()=>{try{return window.__ctR371?.activeTab==='movies'||q('[data-home-tab="movies"].active,[data-home-tab="movies"][aria-selected="true"]')}catch{return false}};

function seriesContinuePanel458(){
 const roots=qa('[data-home-view="series"],[data-home-series],main,#app');
 for(const root of roots){
  const panels=qa('section,.panel,[class*="panel"]',root);
  for(const p of panels){
   const h=q('h1,h2,h3,.panel-head',p),t=norm(h?.textContent||'');
   if(t==='continuar assistindo'||t==='assistir a seguir'||t.startsWith('continuar assistindo '))return p;
  }
 }
 return null;
}
function settleSeries458(){
 if(routeNow()!=='home'||isMovies())return false;
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 const target=seriesContinuePanel458();
 if(!target)return false;
 try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{}
 document.documentElement.dataset.ct458HomeSeries='continue';
 return true;
}
function scheduleSeries458(){
 later(()=>{if(routeNow()==='home'&&!isMovies())settleSeries458()},[0,50,140,320,700,1400,2600]);
}

let fyPaintAttempts458=0;
function forYouReady458(){
 return !!q('[data-ct457-foryou]')&&qa('[data-ct457-action="swap"]').length===7;
}
function ensureForYou458(){
 if(routeNow()!=='discover')return false;
 const api=window.__ctR457;
 if(!api)return false;
 if(forYouReady458()){document.documentElement.dataset.ct458ForYou='ready';return true}
 if(q('[data-ct457-foryou]')){fyPaintAttempts458++;api.paintForYou?.();return forYouReady458()}
 api.loadForYou?.(false);
 return false;
}
function scheduleForYou458(){
 fyPaintAttempts458=0;
 later(()=>{if(routeNow()==='discover')ensureForYou458()},[0,120,350,900,1800,3500,6000]);
}

function scheduleF1458(){
 later(()=>{if(routeNow()==='home'||routeNow()==='sports'||routeNow()==='f1hub')window.__ctR457?.patchF1?.()},[0,100,300,800,1600,3000]);
}
function looksLikeF1458(t){
 const scope=t?.closest?.('[data-media-id="865"],[data-series-id="865"],[data-ct-media-id="865"],article,.card,.media-row,.modal');
 return !!scope&&(scope.matches?.('[data-media-id="865"],[data-series-id="865"],[data-ct-media-id="865"]')||norm(scope.textContent).includes('formula 1'));
}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const nav=t.closest('[data-nav]');
 if(nav){
  const n=String(nav.dataset.nav||'');
  if(n==='home')scheduleSeries458();
  if(n==='discover')scheduleForYou458();
  if(n==='home'||n==='sports')scheduleF1458();
 }
 const ht=t.closest('[data-home-tab]');
 if(ht&&routeNow()==='home'){
  if(String(ht.dataset.homeTab||'series')==='series')scheduleSeries458();
 }
 if(t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]'))scheduleForYou458();
 if(looksLikeF1458(t))scheduleF1458();
},true);

window.addEventListener('popstate',()=>later(()=>{scheduleSeries458();if(routeNow()==='discover')scheduleForYou458();scheduleF1458()},[0,120,400]));
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='home'&&!isMovies())scheduleSeries458();if(routeNow()==='discover')ensureForYou458();scheduleF1458()});

const style=document.createElement('style');
style.id='ct458-style';
style.textContent='[data-ct457-action="swap"]{display:inline-flex!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important}.ct457-actions{display:grid!important}';
if(!q('#ct458-style'))document.head.appendChild(style);

window.__ctR458={version:'1.0.248',scope:'home-series+home-movies+foryou+profile+f1+history-undo',settleSeries:settleSeries458,ensureForYou:ensureForYou458,patchF1:scheduleF1458};
window.__ctR458Marker='finite-home-tabs+foryou-7-swap+profile-13-half+f1-75-of-77+daily-undo';
queueMicrotask(()=>{scheduleSeries458();if(routeNow()==='discover')scheduleForYou458();scheduleF1458()});
})();