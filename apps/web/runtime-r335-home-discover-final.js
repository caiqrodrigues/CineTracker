/* CineTracker Web 1.0.126 r335 — single Home anchor + clean Discover ForYou. */
(()=>{
'use strict';
if(window.__ctR335?.version==='1.0.126')return;
window.__ctR335Marker='home-single-anchor-tab-lock+discover-no-top-filters+foryou-final-r329';
window.__ctR335Home='natural-history-oldest-up-newest-near-anchor+tab-lock';
window.__ctR335Discover='top-filter-strip-removed+strict-state+r329-three-actions';
window.__ctR335Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const rows=v=>Array.isArray(v)?v:[];
let homeDesired335='',homeLockUntil335=0,homeRaf335=0,discoverRaf335=0;

function visibleHomeKind335(){
 if(homeDesired335&&Date.now()<homeLockUntil335)return homeDesired335;
 const v=qa('[data-home-view]').find(x=>!x.classList.contains('hidden')&&!x.hidden);
 return v?.dataset?.homeView==='movies'?'movies':'series';
}
function rememberHome335(kind,ms=900){
 homeDesired335=kind==='movies'?'movies':'series';
 homeLockUntil335=Date.now()+Math.max(0,Number(ms)||0);
 return homeDesired335;
}
function normalizeHistory335(){
 if(routeNow()!=='home')return false;
 let found=false;
 for(const sec of qa('[data-home] [data-ct274-history]')){
  found=true;
  sec.classList.remove('is-collapsed');sec.classList.add('is-open');
  sec.dataset.ct335History='natural-above-anchor';
  qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct332-history-toggle],[data-ct333-history-toggle],[data-ct334-history-toggle],[data-ct335-history-toggle]',sec).forEach(x=>x.remove());
  const shell=q('.ct275-history-shell',sec);
  if(shell){shell.setAttribute('aria-hidden','false');shell.style.removeProperty('max-height');shell.style.removeProperty('height');shell.style.setProperty('overflow','visible','important')}
  for(const stack of qa('.ct274-history-stack',sec)){
   stack.setAttribute('aria-hidden','false');stack.style.removeProperty('max-height');stack.style.removeProperty('height');stack.style.setProperty('overflow','visible','important');
  }
 }
 return found;
}
function homeAnchor335(kind=visibleHomeKind335()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 const want=kind==='movies'?/assistir\s*a\s*seguir\s*\/\s*watchlist/i:/assistir\s*a\s*seguir/i;
 return [...view.children].find(x=>x.nodeType===1&&!x.matches('[data-ct274-history]')&&want.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||''))
   || [...view.children].find(x=>x.nodeType===1&&!x.matches('[data-ct274-history]'))
   || null;
}
function homeTargetTop335(){
 const active=q('[data-home-tab].active')||q('[data-home-tab]');
 const bar=active?.closest?.('.home-tabs,.tabs')||active?.parentElement;
 const bottom=bar?.getBoundingClientRect?.().bottom;
 return Math.max(8,Math.ceil(Number.isFinite(bottom)?bottom:0)+8);
}
function alignHome335(kind=visibleHomeKind335()){
 if(routeNow()!=='home')return false;
 normalizeHistory335();
 const target=homeAnchor335(kind);if(!target)return false;
 const desired=homeTargetTop335(),delta=target.getBoundingClientRect().top-desired;
 if(Math.abs(delta)>2)window.scrollBy({top:delta,left:0,behavior:'auto'});
 target.dataset.ct335HomeAnchor='1';
 return true;
}
function scheduleHome335(kind=visibleHomeKind335()){
 cancelAnimationFrame(homeRaf335);
 homeRaf335=requestAnimationFrame(()=>{if(routeNow()==='home')alignHome335(kind)});
}

/* Stop stale Home repaints from forcing Séries back after the user chose Filmes. */
try{
 const baseApply335=ct266ApplyHomeTab;
 ct266ApplyHomeTab=function(tab){
  let wanted=tab==='movies'?'movies':'series';
  if(routeNow()==='home'&&homeDesired335&&Date.now()<homeLockUntil335&&wanted!==homeDesired335)wanted=homeDesired335;
  return baseApply335(wanted);
 };
}catch{}
document.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');if(!tab)return;
 const kind=rememberHome335(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series');
 queueMicrotask(()=>{try{ct266ApplyHomeTab?.(kind)}catch{};scheduleHome335(kind)});
},true);
try{
 const baseRender335=renderHome;
 renderHome=async function(){
  const before=visibleHomeKind335();
  rememberHome335(before,1200);
  const out=await baseRender335.apply(this,arguments);
  try{ct266ApplyHomeTab?.(homeDesired335||before)}catch{}
  scheduleHome335(homeDesired335||before);
  return out;
 };
}catch{}

/* User asked to remove the temporary Todos/Filmes/Séries/Animes strip from the top.
   Keep the shell node for old code safety, but it is empty and has zero layout height. */
function removeTopFilters335(){
 const shell=q('[data-ct319-discover]');if(!shell)return false;
 const types=q('[data-ct319-types]',shell);
 if(types){types.innerHTML='';types.hidden=true;types.classList.remove('open');delete types.dataset.ct328Always;delete types.dataset.ct333Direct;delete types.dataset.ct334Direct;types.dataset.ct335Removed='1'}
 qa('[data-ct319-filter]',shell).forEach(x=>x.remove());
 const st=window.__ctR319Test?.state;if(st)st.fyKind='all';
 return true;
}
function ensureSwapButton335(row){
 if(!row||q('[data-ct329-swap]',row))return false;
 const slot=row.closest('[data-ct329-slot],[data-ct328-slot],[data-ct309-slot],.ct329-daily-slot,.ct328-daily-card,.ct309-daily');
 let swap='daily';
 const raw=slot?.dataset?.ct329Slot||slot?.dataset?.ct328Slot||slot?.dataset?.ct309Slot||'';
 if(raw)swap=raw;
 const b=document.createElement('button');b.type='button';b.className='chip ct329-action ct329-swapbtn';b.dataset.ct329Swap=swap;b.textContent='↻ Trocar';
 row.appendChild(b);return true;
}
function normalizeActions335(){
 const root=q('[data-ct329-foryou]')||q('[data-ct328-foryou]')||q('[data-ct309-foryou]');
 if(!root)return false;
 for(const row of qa('.ct329-actions,.ct328-actions,.ct309-actions',root)){
  if(qa(':scope > button',row).length<3)ensureSwapButton335(row);
  const buttons=qa(':scope > button',row).slice(0,3);
  row.dataset.ct335Actions=String(buttons.length);
  row.style.setProperty('display','grid','important');
  row.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
  row.style.setProperty('grid-template-rows','24px','important');
  row.style.setProperty('gap','2px','important');
  row.style.setProperty('width','100%','important');
  row.style.setProperty('height','24px','important');
  row.style.setProperty('min-height','24px','important');
  row.style.setProperty('overflow','visible','important');
  for(const b of buttons){
   b.style.setProperty('display','flex','important');b.style.setProperty('visibility','visible','important');
   b.style.setProperty('align-items','center','important');b.style.setProperty('justify-content','center','important');
   b.style.setProperty('position','static','important');b.style.setProperty('grid-row','1','important');b.style.setProperty('grid-column','auto','important');
   b.style.setProperty('width','100%','important');b.style.setProperty('min-width','0','important');
   b.style.setProperty('height','24px','important');b.style.setProperty('min-height','24px','important');
   b.style.setProperty('margin','0','important');b.style.setProperty('padding','1px 2px','important');
   b.style.setProperty('font-size','7px','important');b.style.setProperty('line-height','1','important');
   b.style.setProperty('white-space','nowrap','important');b.style.setProperty('overflow','hidden','important');b.style.setProperty('text-overflow','ellipsis','important');
  }
 }
 return true;
}
function finalForYou335(){
 if(routeNow()!=='discover'||String(window.__ctR288R263?.discover263?.tab||'foryou')!=='foryou')return false;
 removeTopFilters335();
 const st=window.__ctR319Test?.state;if(st)st.fyKind='all';
 let root=q('[data-ct329-foryou]');
 if((!root||qa('.ct329-actions',root).some(x=>qa(':scope > button',x).length!==3))&&window.__ctR309Test?.state){
  try{window.__ctR329?.paintForYou?.()}catch{}
  root=q('[data-ct329-foryou]');
 }
 try{window.__ctR329?.applyFilter?.()}catch{}
 normalizeActions335();
 if(root)root.dataset.ct335Final='1';
 return !!root;
}
function normalizeDiscover335(){
 if(routeNow()!=='discover')return false;
 removeTopFilters335();
 if(String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')finalForYou335();
 return true;
}
function scheduleDiscover335(){
 cancelAnimationFrame(discoverRaf335);
 discoverRaf335=requestAnimationFrame(normalizeDiscover335);
}
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-ct319-tab],[data-ct321-provider],[data-ct329-swap],[data-ct329-action],[data-ct328-swap],[data-ct328-action]'))scheduleDiscover335();
},false);
try{
 const baseDiscover335=renderDiscover;
 renderDiscover=function(){
  const out=baseDiscover335.apply(this,arguments);
  scheduleDiscover335();return out;
 };
}catch{}

/* Older public APIs may be called by old listeners; redirect them to the final behavior. */
if(window.__ctR328)window.__ctR328.ensureFilters=removeTopFilters335;
if(window.__ctR329)window.__ctR329.ensureFilters=removeTopFilters335;
if(window.__ctR334){
 window.__ctR334.ensureFilters=removeTopFilters335;
 window.__ctR334.applyForYouFilter=()=>{const st=window.__ctR319Test?.state;if(st)st.fyKind='all';try{return window.__ctR329?.applyFilter?.()||false}catch{return false}};
 window.__ctR334.normalizeDiscover=normalizeDiscover335;
}

const style=document.createElement('style');style.id='ct-web-r335';style.textContent=`
/* Home history is not a modal, button, or nested scroller. It lives above the landing anchor.
   DB order is oldest -> newest, so scrolling upward from the anchor reveals newest first. */
[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] [data-ct332-history-toggle],
[data-home] [data-ct333-history-toggle],[data-home] [data-ct334-history-toggle],[data-home] [data-ct335-history-toggle]{display:none!important}
[data-home] [data-ct274-history],[data-home] [data-ct274-history].is-collapsed,[data-home] [data-ct274-history].is-open{display:block!important}
[data-home] [data-ct274-history] .ct275-history-shell,[data-home] [data-ct274-history] .ct274-history-stack{
 display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;opacity:1!important;pointer-events:auto!important
}

/* Temporary top filter strip removed exactly as requested; tabs/content move up into its space. */
[data-ct319-types],[data-ct319-types][data-ct328-always],[data-ct319-types][data-ct333-direct],[data-ct319-types][data-ct334-direct]{
 display:none!important;width:0!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important
}
[data-ct319-filter]{display:none!important}
[data-ct319-discover] [data-ct319-content]{margin-top:0!important;padding-top:0!important}

/* Pra Você: Watchlist + Visto + Trocar are one small row, never wrapped. */
[data-ct329-foryou] .ct329-actions,[data-ct328-foryou] .ct328-actions,[data-ct309-foryou] .ct309-actions{
 box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:24px!important;
 gap:2px!important;width:100%!important;max-width:100%!important;min-width:0!important;height:24px!important;min-height:24px!important;
 margin:4px 0 0!important;padding:0!important;position:static!important;overflow:visible!important
}
[data-ct329-foryou] .ct329-actions>button,[data-ct328-foryou] .ct328-actions>button,[data-ct309-foryou] .ct309-actions>button{
 box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;position:static!important;
 inset:auto!important;transform:none!important;float:none!important;grid-row:1!important;grid-column:auto!important;width:100%!important;
 min-width:0!important;max-width:none!important;height:24px!important;min-height:24px!important;margin:0!important;padding:1px 2px!important;
 border-radius:6px!important;font-size:7px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
[data-ct329-foryou] .ct329-swapbtn,[data-ct328-foryou] [data-ct328-swap],[data-ct309-foryou] [data-ct329-swap]{display:flex!important;visibility:visible!important}
`;document.head.appendChild(style);

setTimeout(()=>{if(routeNow()==='home'){rememberHome335(visibleHomeKind335(),1000);scheduleHome335(visibleHomeKind335())}if(routeNow()==='discover')normalizeDiscover335()},0);

window.__ctR335={
 normalizeHistory:normalizeHistory335,homeAnchor:homeAnchor335,alignHome:alignHome335,rememberHomeTab:rememberHome335,
 removeTopFilters:removeTopFilters335,normalizeActions:normalizeActions335,normalizeDiscover:normalizeDiscover335,finalForYou:finalForYou335,
 version:'1.0.126'
};
window.__ctR335Test={normalizeHistory335,homeAnchor335,homeTargetTop335,alignHome335,rememberHome335,removeTopFilters335,ensureSwapButton335,normalizeActions335,finalForYou335};
})();
