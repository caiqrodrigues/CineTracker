/* CineTracker Web 1.0.118 r327 — r276 Home anchor + hard ForYou filters/actions. */
(()=>{
'use strict';
if(window.__ctR327?.version==='1.0.118')return;
window.__ctR327Marker='home-r276-anchor+foryou-flex-actions+hard-filters+discover-v327';
window.__ctR327Home='history-full-above-viewport+oldest-top+newest-bottom+no-toggle';
window.__ctR327Discover='v327-all-history+foryou-filter-authority+flex-actions';
window.__ctR327Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let homeRootSeen=null,homeAnchorTimer=0,discoverTimer=0;

function homeTab327(){
 try{return typeof ct266CurrentHomeTab==='function'?(ct266CurrentHomeTab()==='movies'?'movies':'series'):'series'}catch{return'series'}
}
function homeView327(){
 const root=q('[data-home]');if(!root)return null;
 const tab=homeTab327();
 return q('[data-home-view="'+tab+'"]',root)||qa('[data-home-view]',root).find(v=>!v.classList.contains('hidden'))||null;
}
function normalizeHomeHistory327(){
 if(routeNow()!=='home')return false;
 const root=q('[data-home]');if(!root)return false;
 let found=false;
 for(const sec of qa('[data-ct274-history]',root)){
  found=true;
  sec.classList.remove('is-collapsed');sec.classList.add('ct327-history-natural');
  sec.removeAttribute('data-ct324-history');
  for(const btn of qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct326-history-toggle]',sec))btn.remove();
  const shell=q('.ct275-history-shell',sec);if(shell)shell.setAttribute('aria-hidden','false');
  const stack=q('.ct274-history-stack',sec);if(stack){stack.setAttribute('aria-hidden','false');try{stack.scrollTop=0}catch{}}
 }
 return found;
}
function homeAnchorTarget327(){
 const view=homeView327();if(!view)return null;
 const hist=q(':scope > [data-ct274-history]',view);
 if(hist?.nextElementSibling)return hist.nextElementSibling;
 const wanted=homeTab327()==='movies'?'Assistir a seguir / Watchlist':'Assistir a seguir';
 return qa(':scope > .home-section',view).find(sec=>q('h3',sec)?.textContent?.trim()===wanted)||null;
}
function anchorHome327(){
 if(routeNow()!=='home')return false;
 normalizeHomeHistory327();
 const target=homeAnchorTarget327();if(!target)return false;
 const top=Math.max(0,target.getBoundingClientRect().top+window.scrollY-10);
 window.scrollTo({top:top,left:0,behavior:'auto'});
 return true;
}
function scheduleHomeAnchor327(){
 clearTimeout(homeAnchorTimer);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  anchorHome327();
  homeAnchorTimer=setTimeout(()=>anchorHome327(),100);
 }));
}
const baseRenderHome327=typeof renderHome==='function'?renderHome:null;
if(baseRenderHome327)renderHome=async function(){
 const out=await baseRenderHome327.apply(this,arguments);
 homeRootSeen=q('[data-home]');scheduleHomeAnchor327();return out;
};
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-home-tab]'))setTimeout(()=>scheduleHomeAnchor327(),0);
},true);

function compactActions327(root=document){
 let count=0;
 for(const row of qa('[data-ct309-foryou] .ct309-actions',root)){
  count++;row.classList.add('ct327-actions-row');
  const swap=q('[data-ct309-swap]',row);if(swap){swap.classList.remove('ct309-swap');swap.classList.add('ct327-swap')}
  row.style.setProperty('display','flex','important');
  row.style.setProperty('flex-flow','row nowrap','important');
  row.style.setProperty('gap','3px','important');
  row.style.setProperty('width','100%','important');
  for(const b of qa('.chip',row)){
   b.style.setProperty('flex','1 1 0','important');
   b.style.setProperty('width','0','important');
   b.style.setProperty('min-width','0','important');
   b.style.setProperty('max-width','none','important');
   b.style.setProperty('grid-column','auto','important');
   b.style.setProperty('height','25px','important');
   b.style.setProperty('min-height','25px','important');
   b.style.setProperty('padding','2px 2px','important');
   b.style.setProperty('font-size','8px','important');
   b.style.setProperty('line-height','1','important');
   b.style.setProperty('white-space','nowrap','important');
   b.style.setProperty('overflow','hidden','important');
   b.style.setProperty('text-overflow','ellipsis','important');
  }
 }
 for(const row of qa('.ct319-actions',root)){
  count++;row.classList.add('ct327-actions-row');
  row.style.setProperty('display','flex','important');row.style.setProperty('flex-flow','row nowrap','important');
  row.style.setProperty('gap','4px','important');row.style.setProperty('width','100%','important');
  for(const b of qa('.chip',row)){
   b.style.setProperty('flex','1 1 0','important');b.style.setProperty('width','0','important');
   b.style.setProperty('min-width','0','important');b.style.setProperty('height','25px','important');
   b.style.setProperty('min-height','25px','important');b.style.setProperty('padding','2px 3px','important');
   b.style.setProperty('font-size','8.5px','important');b.style.setProperty('white-space','nowrap','important');
  }
 }
 return count;
}

function fyCategory327(x){
 try{return window.__ctR309Test?.category?.(x)||'series'}catch{return String(x?.media_type)==='movie'?'movie':'series'}
}
function currentDaily327(){
 const fy=window.__ctR309Test?.state,pool=Array.isArray(fy?.dailyPool)?fy.dailyPool:[];
 if(!pool.length)return null;
 return pool[Math.abs(Number(fy?.dailyIndex||0))%pool.length]||null;
}
function applyForYouFilter327(){
 const st=window.__ctR319Test?.state,root=q('[data-ct309-foryou]');if(!st||!root)return false;
 const kind=String(st.fyKind||'all');root.dataset.ct319FyFilter=kind;
 for(const slot of qa('[data-ct309-slot]',root)){
  const slotKind=String(slot.dataset.ct309Slot||'').split(':').pop();
  if(kind==='all'||slotKind===kind)slot.style.removeProperty('display');
  else slot.style.setProperty('display','none','important');
 }
 const daily=q('.ct309-daily',root),dailyItem=currentDaily327();
 if(daily){
  const show=kind==='all'||(dailyItem&&fyCategory327(dailyItem)===kind);
  if(show)daily.style.removeProperty('display');else daily.style.setProperty('display','none','important');
 }
 qa('[data-ct319-fy-kind]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct319FyKind)===kind));
 compactActions327(root);return true;
}
function renderFilterBar327(){
 const test=window.__ctR319Test,st=test?.state,root=q('[data-ct319-discover]');
 if(!test||!st||!root)return false;
 const tab=String((typeof discover!=='undefined'&&discover?.tab)||'foryou');
 const can=tab==='foryou'||test.STRICT?.has?.(tab);
 const btn=q('[data-ct319-filter]',root),types=q('[data-ct319-types]',root);
 if(btn){btn.hidden=!can;btn.setAttribute('aria-expanded',String(can&&st.filterOpen))}
 if(types){
  types.innerHTML=can?test.filterMarkup319():'';
  types.hidden=!can||!st.filterOpen;
  types.classList.toggle('open',can&&st.filterOpen);
 }
 if(tab==='foryou')applyForYouFilter327();
 return true;
}
function handleDiscover327(target){
 if(!target?.closest||routeNow()!=='discover')return false;
 const test=window.__ctR319Test,st=test?.state;if(!test||!st)return false;
 const filter=target.closest('[data-ct319-filter]');
 if(filter){st.filterOpen=!st.filterOpen;renderFilterBar327();return true}
 const fy=target.closest('[data-ct319-fy-kind]');
 if(fy){
  st.fyKind=String(fy.dataset.ct319FyKind||'all');st.filterOpen=true;
  renderFilterBar327();applyForYouFilter327();return true;
 }
 const type=target.closest('[data-ct319-type]');
 if(type){
  try{discover.type=String(type.dataset.ct319Type||'all')}catch{}
  st.filterOpen=true;renderFilterBar327();
  try{void window.__ctR321?.loadPublic?.(String(discover?.tab||''),false)}catch{}
  return true;
 }
 return false;
}
window.__ctR327EarlyHandle=handleDiscover327;

function settleDiscover327(){compactActions327(document);renderFilterBar327();applyForYouFilter327()}
function scheduleDiscover327(){clearTimeout(discoverTimer);discoverTimer=setTimeout(()=>requestAnimationFrame(settleDiscover327),0)}

try{
 const app=q('#app');
 if(app&&window.MutationObserver)new MutationObserver(()=>{
  if(routeNow()==='home'){
   normalizeHomeHistory327();
   const root=q('[data-home]');
   if(root&&root!==homeRootSeen){homeRootSeen=root;scheduleHomeAnchor327()}
  }
  if(routeNow()==='discover')scheduleDiscover327();
 }).observe(app,{subtree:true,childList:true});
}catch{}
window.addEventListener('cinetracker:data-changed',()=>{
 if(routeNow()==='home')normalizeHomeHistory327();
 if(routeNow()==='discover')scheduleDiscover327();
});
setTimeout(()=>{
 if(routeNow()==='home'){homeRootSeen=q('[data-home]');scheduleHomeAnchor327()}
 if(routeNow()==='discover')scheduleDiscover327();
},0);

const style=document.createElement('style');style.id='ct-web-r327';style.textContent=[
'[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] [data-ct326-history-toggle]{display:none!important}',
'[data-home] [data-ct274-history],[data-home] [data-ct274-history].is-collapsed{display:block!important;max-height:none!important;overflow:visible!important}',
'[data-home] [data-ct274-history] .ct275-history-shell,[data-home] [data-ct274-history].is-collapsed .ct275-history-shell,[data-home] [data-ct274-history][data-ct324-history="collapsed"] .ct275-history-shell{display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;opacity:1!important;transform:none!important;pointer-events:auto!important}',
'[data-home] [data-ct274-history] .ct274-history-stack,[data-home] [data-ct274-history][data-ct324-history="collapsed"] .ct274-history-stack{display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;padding-right:0!important;scrollbar-gutter:auto!important}',
'[data-ct309-foryou] .ct309-actions{display:flex!important;flex-flow:row nowrap!important;gap:3px!important;width:100%!important}',
'[data-ct309-foryou] .ct309-actions>.chip{flex:1 1 0!important;width:0!important;min-width:0!important;grid-column:auto!important;height:25px!important;min-height:25px!important;padding:2px!important;font-size:8px!important;white-space:nowrap!important}',
'[data-ct309-foryou] .ct309-actions>[data-ct309-swap]{grid-column:auto!important;width:0!important}',
'.ct319-actions{display:flex!important;flex-flow:row nowrap!important;gap:4px!important;width:100%!important}',
'.ct319-actions>.chip{flex:1 1 0!important;width:0!important;min-width:0!important;height:25px!important;min-height:25px!important;padding:2px 3px!important;font-size:8.5px!important;white-space:nowrap!important}',
'.ct319-types{display:flex!important;flex-flow:row nowrap!important;gap:6px!important;overflow-x:auto!important}',
'.ct319-types[hidden]{display:none!important}'
].join('\\n');document.head.appendChild(style);

window.__ctR327={normalizeHomeHistory:normalizeHomeHistory327,anchorHome:anchorHome327,compactActions:compactActions327,applyForYouFilter:applyForYouFilter327,renderFilterBar:renderFilterBar327,handleDiscover:handleDiscover327,version:'1.0.118'};
window.__ctR327Test={homeAnchorTarget327,normalizeHomeHistory327,anchorHome327,compactActions327,applyForYouFilter327,renderFilterBar327,handleDiscover327};
})();
