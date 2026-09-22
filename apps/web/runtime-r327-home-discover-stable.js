/* CineTracker Web 1.0.118 r327 — preserve green fixes, restore Home reveal-by-scroll, compact Discover, fast Top10. */
(()=>{
'use strict';
if(window.__ctR327?.version==='1.0.118')return;
window.__ctR327Marker='home-page-scroll-reset+foryou-flex-filters+top10-ten-grid+providers-clean+fast-nav';
window.__ctR327Home='history-normal-flow+newest-nearest-content+tab-reset';
window.__ctR327Discover='foryou-three-flex+direct-kind-filter+top10-ten-visible';
window.__ctR327Top10='no-looke-no-mubi+batched-filter';
window.__ctR327Preserved='r325-episode-sync+r324-watchlist+r326-strict-authority';
window.__ctR327Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const norm327=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let homeResetRaf=0,actionRaf=0,filterRaf=0;

function activeHomeKind327(){
 try{const k=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'';if(k==='movies'||k==='series')return k}catch{}
 const visible=qa('[data-home-view]').find(x=>!x.classList.contains('hidden'));
 return visible?.dataset?.homeView==='movies'?'movies':'series';
}
function homeAnchor327(kind=activeHomeKind327()){
 const view=q('[data-home-view="'+kind+'"]');if(!view)return null;
 return [...view.children].find(x=>x.nodeType===1&&!x.matches('[data-ct274-history]'))||null;
}
function normalizeHomeHistory327(){
 if(routeNow()!=='home')return false;
 const root=q('[data-home]');if(!root)return false;
 let found=false;
 for(const sec of qa('[data-ct274-history]',root)){
  found=true;sec.dataset.ct327History='above';
  sec.classList.remove('is-collapsed');sec.classList.add('is-open');
  q('.ct275-history-shell',sec)?.setAttribute('aria-hidden','false');
  q('[data-ct275-history-toggle]',sec)?.setAttribute('hidden','');
  q('[data-ct324-history-toggle]',sec)?.setAttribute('hidden','');
  for(const stack of qa('.ct274-history-stack',sec)){
   stack.setAttribute('aria-hidden','false');
   stack.style.removeProperty('max-height');stack.style.removeProperty('height');
   stack.style.setProperty('overflow','visible','important');
  }
 }
 return found;
}
function resetHomePosition327(kind=activeHomeKind327()){
 if(routeNow()!=='home')return false;
 normalizeHomeHistory327();
 const anchor=homeAnchor327(kind);if(!anchor)return false;
 try{anchor.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'});anchor.dataset.ct327HomeAnchor='1';return true}catch{return false}
}
function scheduleHomeReset327(kind){
 cancelAnimationFrame(homeResetRaf);
 homeResetRaf=requestAnimationFrame(()=>requestAnimationFrame(()=>resetHomePosition327(kind||activeHomeKind327())));
}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-home-tab]');if(!b)return;
 const kind=String(b.dataset.homeTab||'series')==='movies'?'movies':'series';
 setTimeout(()=>scheduleHomeReset327(kind),0);
},true);
try{
 const baseRender327=renderHome;
 renderHome=async function(){
  const out=await baseRender327.apply(this,arguments);
  scheduleHomeReset327(activeHomeKind327());return out;
 };
}catch{}
try{
 const app=q('#app');
 if(app&&window.MutationObserver)new MutationObserver(muts=>{
  if(routeNow()==='home'&&muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('[data-home-view]')||n.querySelector?.('[data-home-view]')))))scheduleHomeReset327(activeHomeKind327());
  if(routeNow()==='discover'&&muts.some(m=>m.addedNodes.length)){scheduleActions327();scheduleFilter327()}
 }).observe(app,{subtree:true,childList:true});
}catch{}

function force327(el,p,v){try{el?.style?.setProperty(p,v,'important')}catch{}}
function compactActions327(root=document){
 let n=0;
 for(const row of qa('[data-ct309-foryou] .ct309-actions',root)){
  n++;force327(row,'display','flex');force327(row,'flex-flow','row nowrap');force327(row,'grid-template-columns','none');
  force327(row,'gap','3px');force327(row,'width','100%');force327(row,'align-items','center');force327(row,'margin-top','4px');
  for(const b of qa('.chip',row)){
   force327(b,'grid-column','auto');force327(b,'flex','1 1 0');force327(b,'width','auto');force327(b,'min-width','0');force327(b,'max-width','none');
   force327(b,'height','25px');force327(b,'min-height','25px');force327(b,'padding','2px 2px');force327(b,'font-size','7.5px');
   force327(b,'line-height','1');force327(b,'white-space','nowrap');force327(b,'overflow','hidden');force327(b,'text-overflow','ellipsis');
  }
 }
 return n;
}
function scheduleActions327(){cancelAnimationFrame(actionRaf);actionRaf=requestAnimationFrame(()=>compactActions327(document))}

function applyForYouFilter327(){
 const root=q('[data-ct309-foryou]');if(!root)return false;
 const st=window.__ctR319Test?.state;
 const kind=['movie','series','anime'].includes(String(st?.fyKind))?String(st.fyKind):'all';
 root.dataset.ct319FyFilter=kind;
 for(const slot of qa('.ct309-slot[data-ct309-slot]',root)){
  const k=String(slot.dataset.ct309Slot||'').split(':').pop();
  const show=kind==='all'||k===kind;
  if(show)slot.style.removeProperty('display');else slot.style.setProperty('display','none','important');
 }
 const daily=q('.ct309-daily',root);
 if(daily){
  const showDaily=kind==='all'||kind==='movie';
  if(showDaily)daily.style.removeProperty('display');else daily.style.setProperty('display','none','important');
 }
 qa('[data-ct319-fy-kind]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct319FyKind||'')===kind));
 compactActions327(root);return true;
}
if(window.__ctR319)window.__ctR319.applyForYouFilter=applyForYouFilter327;
function scheduleFilter327(){cancelAnimationFrame(filterRaf);filterRaf=requestAnimationFrame(()=>applyForYouFilter327())}
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-ct319-fy-kind]'))setTimeout(scheduleFilter327,0)},true);

function providerAllowed327(p){
 const n=norm327(p?.provider_name||'');
 return !/(^| )(mubi|looke|loki)( |$)/.test(n);
}
try{
 const baseProviders327=ct171Providers;
 ct171Providers=async function(){
  const list=(await baseProviders327.apply(this,arguments))||[];
  const clean=list.filter(providerAllowed327);
  try{ct171ProviderList=clean}catch{}
  return clean;
 };
 if(Array.isArray(ct171ProviderList))ct171ProviderList=ct171ProviderList.filter(providerAllowed327);
}catch{}

window.addEventListener('cinetracker:data-changed',()=>{
 if(routeNow()==='home')setTimeout(()=>scheduleHomeReset327(activeHomeKind327()),30);
 if(routeNow()==='discover'){setTimeout(scheduleActions327,30);setTimeout(scheduleFilter327,30)}
});
setTimeout(()=>{
 if(routeNow()==='home')scheduleHomeReset327(activeHomeKind327());
 if(routeNow()==='discover'){scheduleActions327();scheduleFilter327()}
},0);

const style=document.createElement('style');style.id='ct-web-r327';style.textContent=`
/* Home history is normal document flow above the normal list; no button and no inner scroller. */
[data-home] [data-ct275-history-toggle],
[data-home] [data-ct324-history-toggle]{display:none!important}
[data-home] [data-ct274-history],
[data-home] [data-ct274-history].is-collapsed{display:block!important}
[data-home] [data-ct274-history] .ct275-history-shell,
[data-home] [data-ct274-history].is-collapsed .ct275-history-shell,
[data-home] [data-ct274-history][data-ct324-history="collapsed"] .ct275-history-shell{
 display:block!important;grid-template-rows:none!important;max-height:none!important;height:auto!important;
 opacity:1!important;transform:none!important;overflow:visible!important;pointer-events:auto!important
}
[data-home] [data-ct274-history] .ct274-history-stack,
[data-home] [data-ct274-history][data-ct324-history="collapsed"] .ct274-history-stack{
 display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;
 overscroll-behavior:auto!important;scrollbar-gutter:auto!important;padding-right:0!important
}
[data-home] [data-ct274-history] .ct275-history-head{justify-content:flex-start!important}
[data-home-view]>.home-section:not([data-ct274-history]){scroll-margin-top:8px!important}

/* Pra voce: exact card dimensions remain untouched; only actions become three compact buttons in one row. */
[data-ct309-foryou] .ct309-actions{
 display:flex!important;flex-flow:row nowrap!important;grid-template-columns:none!important;align-items:center!important;
 gap:3px!important;width:100%!important;margin-top:4px!important
}
[data-ct309-foryou] .ct309-actions .chip,
[data-ct309-foryou] .ct309-actions .ct309-swap{
 position:static!important;inset:auto!important;grid-column:auto!important;flex:1 1 0!important;
 width:auto!important;min-width:0!important;max-width:none!important;height:25px!important;min-height:25px!important;
 padding:2px!important;border-radius:7px!important;font-size:7.5px!important;line-height:1!important;
 white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
html[data-ct326-fy-filtering="1"] [data-ct309-foryou]{visibility:visible!important}

/* Top 10: compact header and all ten cards visible. */
.ct288-top-shell{margin-top:0!important;padding-top:0!important}
.ct288-top-title{margin:0 0 4px!important;padding:0!important;min-height:0!important}
.ct288-top-title h2{margin:0!important;font-size:16px!important}
.ct288-provider-row{margin:0 0 5px!important;padding:2px 0 4px!important;gap:5px!important}
.ct288-provider{min-height:34px!important;padding:3px 6px!important}
.ct288-top-section{margin:5px 0!important;padding:8px!important}
.ct288-top-section>.panel-head{margin-bottom:5px!important}
.ct319-top-row{
 display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;gap:4px!important;
 overflow:visible!important;padding:0!important;width:100%!important;align-items:start!important
}
.ct319-top-row>.ct319-item{
 display:flex!important;flex:none!important;width:auto!important;min-width:0!important;max-width:none!important;
 scroll-snap-align:none!important
}
.ct319-top-row .ct288-card{width:100%!important;min-width:0!important}
.ct319-top-row .card-body{padding:4px 2px!important}
.ct319-top-row .card-body b{font-size:8px!important;line-height:1.1!important}
.ct319-top-row .card-body small{font-size:6.5px!important;line-height:1.1!important}
.ct319-top-row .ct319-actions{gap:2px!important;margin-top:2px!important}
.ct319-top-row .ct319-actions .chip{height:20px!important;min-height:20px!important;padding:1px!important;font-size:5.8px!important}
@media(max-width:620px){
 .ct319-top-row{grid-template-columns:repeat(5,minmax(0,1fr))!important}
}

/* Make ForYou filter result deterministic even against legacy mobile rules. */
[data-ct309-foryou][data-ct319-fy-filter="movie"] .ct309-slot:not([data-ct309-slot$=":movie"]),
[data-ct309-foryou][data-ct319-fy-filter="series"] .ct309-slot:not([data-ct309-slot$=":series"]),
[data-ct309-foryou][data-ct319-fy-filter="anime"] .ct309-slot:not([data-ct309-slot$=":anime"]){display:none!important}
[data-ct309-foryou][data-ct319-fy-filter="series"] .ct309-daily,
[data-ct309-foryou][data-ct319-fy-filter="anime"] .ct309-daily{display:none!important}
`;document.head.appendChild(style);

window.__ctR327={
 normalizeHomeHistory:normalizeHomeHistory327,resetHomePosition:resetHomePosition327,homeAnchor:homeAnchor327,
 compactDiscoverActions:compactActions327,applyForYouFilter:applyForYouFilter327,providerAllowed:providerAllowed327,
 version:'1.0.118'
};
window.__ctR327Test={normalizeHomeHistory327,resetHomePosition327,homeAnchor327,compactActions327,applyForYouFilter327,providerAllowed327};
})();
