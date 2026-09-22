/* CineTracker Web 1.0.125 r334 — single-owner Home/Discover stabilization. */
(()=>{
'use strict';
if(window.__ctR334?.version==='1.0.125')return;
window.__ctR334Marker='home-fast-v334+single-anchor+discover-no-observer-loop+stable-foryou';
window.__ctR334Home='v334-fast-state+natural-history+single-r332-anchor';
window.__ctR334Discover='no-late-mutation-observers+direct-idempotent-filters+one-row-actions';
window.__ctR334Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let raf334=0;

function homeKind334(){
 try{const k=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'';if(k==='movies'||k==='series')return k}catch{}
 return qa('[data-home-view]').find(x=>!x.classList.contains('hidden'))?.dataset?.homeView==='movies'?'movies':'series';
}
function normalizeHome334(){
 if(routeNow()!=='home')return false;
 let found=false;
 for(const sec of qa('[data-home] [data-ct274-history]')){
  found=true;
  sec.classList.remove('is-collapsed');sec.classList.add('is-open');
  sec.dataset.ct334History='natural';
  qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct332-history-toggle],[data-ct333-history-toggle],[data-ct334-history-toggle]',sec).forEach(x=>x.remove());
  const shell=q('.ct275-history-shell',sec);
  if(shell){shell.setAttribute('aria-hidden','false');shell.style.removeProperty('max-height');shell.style.removeProperty('height');shell.style.setProperty('overflow','visible','important')}
  for(const stack of qa('.ct274-history-stack',sec)){
   stack.setAttribute('aria-hidden','false');stack.style.removeProperty('max-height');stack.style.removeProperty('height');stack.style.setProperty('overflow','visible','important');
  }
 }
 return found;
}
function alignHome334(kind=homeKind334()){
 if(routeNow()!=='home')return false;
 normalizeHome334();
 try{return !!window.__ctR332?.alignHome?.(kind,true)}catch{return false}
}
function scheduleHome334(kind){
 cancelAnimationFrame(raf334);
 raf334=requestAnimationFrame(()=>{normalizeHome334();alignHome334(kind||homeKind334())});
}
try{
 const base=renderHome;
 renderHome=async function(){
  const out=await base.apply(this,arguments);
  scheduleHome334(homeKind334());
  return out;
 };
}catch{}
document.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab)setTimeout(()=>scheduleHome334(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series'),0);
},false);

function fyKind334(){
 const st=window.__ctR319Test?.state;
 return ['movie','series','anime'].includes(String(st?.fyKind))?String(st.fyKind):'all';
}
function filterHtml334(){
 const kind=fyKind334();
 return [['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']]
   .map(([k,l])=>'<button type="button" class="chip '+(kind===k?'active':'')+'" data-ct334-fy-kind="'+k+'">'+l+'</button>').join('');
}
function applyForYou334(){
 const root=q('[data-ct329-foryou]')||q('[data-ct328-foryou]')||q('[data-ct309-foryou]');
 if(!root)return false;
 const kind=fyKind334();
 root.dataset.ct334Filter=kind;
 for(const slot of qa('[data-ct329-kind]',root))slot.hidden=!(kind==='all'||String(slot.dataset.ct329Kind)===kind);
 for(const slot of qa('[data-ct328-kind]',root))slot.hidden=!(kind==='all'||String(slot.dataset.ct328Kind)===kind);
 for(const slot of qa('.ct309-slot[data-ct309-slot]',root)){
  const k=String(slot.dataset.ct309Slot||'').split(':').pop();
  slot.hidden=!(kind==='all'||k===kind);
 }
 for(const daily of qa('.ct329-daily,.ct328-daily,.ct309-daily',root))daily.hidden=!(kind==='all'||kind==='movie');
 qa('[data-ct334-fy-kind]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct334FyKind)===kind));
 return true;
}
function ensureFilters334(){
 const shell=q('[data-ct319-discover]');if(!shell)return false;
 qa('[data-ct319-prev],[data-ct319-next],[data-ct319-filter]',shell).forEach(x=>x.remove());
 const types=q('[data-ct319-types]',shell),tab=String(window.__ctR288R263?.discover263?.tab||'foryou');
 if(!types)return false;
 if(tab==='foryou'){
  const signature='all|movie|series|anime';
  const current=qa('[data-ct334-fy-kind]',types).map(x=>x.dataset.ct334FyKind).join('|');
  if(current!==signature)types.innerHTML=filterHtml334();
  types.hidden=false;types.classList.add('open');types.dataset.ct334Direct='foryou';
  const kind=fyKind334();qa('[data-ct334-fy-kind]',types).forEach(b=>b.classList.toggle('active',b.dataset.ct334FyKind===kind));
  applyForYou334();
  return true;
 }
 if(['trending','popular','new','releases','anticipated','top'].includes(tab)){
  if(!q('[data-ct319-type]',types)&&typeof window.__ctR319Test?.filterMarkup319==='function')types.innerHTML=window.__ctR319Test.filterMarkup319();
  types.hidden=false;types.classList.add('open');types.dataset.ct334Direct='public';
  const want=String(window.__ctR288R263?.discover263?.type||'all');
  qa('[data-ct319-type]',types).forEach(b=>b.classList.toggle('active',String(b.dataset.ct319Type)===want));
  return true;
 }
 types.hidden=true;types.classList.remove('open');delete types.dataset.ct334Direct;
 return true;
}
function normalizeActions334(){
 const root=q('[data-ct329-foryou]')||q('[data-ct328-foryou]')||q('[data-ct309-foryou]');
 if(root){
  for(const row of qa('.ct329-actions,.ct328-actions,.ct309-actions',root)){
   const buttons=qa(':scope > button',row);
   row.dataset.ct334Actions=String(buttons.length);
   buttons.forEach(b=>{b.style.setProperty('white-space','nowrap','important');b.style.setProperty('min-width','0','important')});
  }
 }
 for(const row of qa('.ct319-actions'))row.dataset.ct334Actions=String(qa(':scope > button',row).length);
 return true;
}
function normalizeDiscover334(){
 if(routeNow()!=='discover')return false;
 ensureFilters334();applyForYou334();normalizeActions334();
 const top=q('.ct288-top-shell');if(top)top.dataset.ct334Top='stable';
 return true;
}
function queueDiscover334(){
 cancelAnimationFrame(raf334);
 raf334=requestAnimationFrame(normalizeDiscover334);
}
document.addEventListener('click',e=>{
 const f=e.target?.closest?.('[data-ct334-fy-kind]');
 if(f){
  e.preventDefault();e.stopImmediatePropagation();
  const st=window.__ctR319Test?.state;if(st)st.fyKind=String(f.dataset.ct334FyKind||'all');
  normalizeDiscover334();return;
 }
 if(e.target?.closest?.('[data-ct319-tab],[data-ct319-type],[data-ct321-provider],[data-ct329-swap],[data-ct329-action]'))setTimeout(queueDiscover334,0);
},true);
try{
 const base=renderDiscover;
 renderDiscover=function(){
  const out=base.apply(this,arguments);
  setTimeout(queueDiscover334,0);
  return out;
 };
}catch{}
if(window.__ctR328)window.__ctR328.ensureFilters=ensureFilters334;
if(window.__ctR329)window.__ctR329.applyFilter=applyForYou334;
if(window.__ctR333)window.__ctR333.normalizeDiscover=normalizeDiscover334;

const style=document.createElement('style');style.id='ct-web-r334';style.textContent=`
/* Home: history is ordinary page content above the landing anchor; never a button or inner scroller. */
[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] [data-ct332-history-toggle],[data-home] [data-ct333-history-toggle],[data-home] [data-ct334-history-toggle]{display:none!important}
[data-home] [data-ct274-history],[data-home] [data-ct274-history].is-collapsed,[data-home] [data-ct274-history].is-open{display:block!important}
[data-home] [data-ct274-history] .ct275-history-shell,[data-home] [data-ct274-history] .ct274-history-stack{
 display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;opacity:1!important;pointer-events:auto!important
}

/* ForYou filters: direct, compact, no hidden trigger. */
[data-ct319-types][data-ct334-direct="foryou"]{
 display:flex!important;flex-flow:row nowrap!important;gap:5px!important;width:100%!important;max-width:100%!important;
 overflow-x:auto!important;overflow-y:hidden!important;margin:5px 0 8px!important;padding-bottom:2px!important
}
[data-ct319-types][data-ct334-direct="foryou"]>.chip{
 flex:0 0 auto!important;height:27px!important;min-height:27px!important;padding:3px 8px!important;font-size:9.5px!important;white-space:nowrap!important
}

/* Every known ForYou owner gets exactly one compact action row. */
[data-ct309-foryou] .ct309-actions,[data-ct328-foryou] .ct328-actions,[data-ct329-foryou] .ct329-actions{
 box-sizing:border-box!important;position:static!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
 grid-template-rows:25px!important;gap:3px!important;width:100%!important;max-width:100%!important;min-width:0!important;
 height:25px!important;min-height:25px!important;margin:4px 0 0!important;padding:0!important;overflow:visible!important
}
[data-ct309-foryou] .ct309-actions>button,[data-ct328-foryou] .ct328-actions>button,[data-ct329-foryou] .ct329-actions>button{
 box-sizing:border-box!important;position:static!important;inset:auto!important;transform:none!important;float:none!important;
 display:flex!important;align-items:center!important;justify-content:center!important;grid-row:1!important;grid-column:auto!important;
 width:100%!important;min-width:0!important;max-width:none!important;height:25px!important;min-height:25px!important;
 margin:0!important;padding:1px 2px!important;border-radius:7px!important;font-size:7.2px!important;line-height:1!important;
 white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
.ct319-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:3px!important;width:100%!important;min-width:0!important}
.ct319-actions>button{min-width:0!important;white-space:nowrap!important}
`;document.head.appendChild(style);

setTimeout(()=>{if(routeNow()==='home')normalizeHome334();if(routeNow()==='discover')normalizeDiscover334()},0);

window.__ctR334={
 normalizeHome:normalizeHome334,alignHome:alignHome334,normalizeDiscover:normalizeDiscover334,
 ensureFilters:ensureFilters334,applyForYouFilter:applyForYou334,normalizeActions:normalizeActions334,
 version:'1.0.125'
};
window.__ctR334Test={normalizeHome334,alignHome334,ensureFilters334,applyForYou334,normalizeActions334,fyKind334};
})();
