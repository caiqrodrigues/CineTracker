/* CineTracker Web 1.0.124 r333 — Discover visual contract from 21/09 screenshots. */
(()=>{
'use strict';
if(window.__ctR333?.version==='1.0.124')return;

window.__ctR333Marker='discover-standard-cards+single-row-actions+compact-top10+clean-tabbar';
window.__ctR333Scope='discover-layout+final-settle';
window.__ctR333Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
let fyKind333='all';

function category333(x){
 try{return window.__ctR309Test?.category?.(x)||'series'}
 catch{return String(x?.media_type||x?.type)==='movie'?'movie':'series'}
}
function current333(pool,index){
 return Array.isArray(pool)&&pool.length?pool[Math.abs(Number(index||0))%pool.length]:null;
}
function filterMarkup333(){
 return [['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']]
  .map(([k,l])=>'<button type="button" class="chip ct333-fy-filter '+(fyKind333===k?'active':'')+'" data-ct333-fy-kind="'+k+'" aria-pressed="'+(fyKind333===k?'true':'false')+'">'+l+'</button>')
  .join('');
}
function applyForYou333(){
 const root=q('[data-ct309-foryou]');
 if(!root)return false;
 const st=window.__ctR309Test?.state;
 root.dataset.ct333FyFilter=fyKind333;
 for(const slot of qa('[data-ct309-slot]',root)){
  const kind=String(slot.dataset.ct309Slot||'').split(':').pop();
  const show=fyKind333==='all'||kind===fyKind333;
  slot.hidden=!show;
  if(show)slot.style.removeProperty('display');else slot.style.setProperty('display','none','important');
 }
 const daily=q('.ct309-daily',root);
 if(daily){
  const item=current333(st?.dailyPool,st?.dailyIndex);
  const show=fyKind333==='all'||(item&&category333(item)===fyKind333);
  daily.hidden=!show;
  if(show)daily.style.removeProperty('display');else daily.style.setProperty('display','none','important');
 }
 for(const b of qa('[data-ct333-fy-kind]',root)){
  const on=String(b.dataset.ct333FyKind)===fyKind333;
  b.classList.toggle('active',on);
  b.setAttribute('aria-pressed',String(on));
 }
 return true;
}
function ensureForYouFilters333(){
 const root=q('[data-ct309-foryou]');
 if(!root)return false;
 const old=window.__ctR319Test?.state;
 if(old?.fyKind&&fyKind333==='all')fyKind333=String(old.fyKind||'all');
 let bar=q('[data-ct333-fy-filters]',root);
 if(!bar){
  bar=document.createElement('div');
  bar.className='filters ct333-fy-types';
  bar.dataset.ct333FyFilters='1';
  root.insertBefore(bar,root.firstChild);
 }
 bar.innerHTML=filterMarkup333();
 bar.hidden=false;
 bar.setAttribute('aria-hidden','false');
 return applyForYou333();
}
function cleanTabbar333(){
 const root=q('[data-ct319-discover]')||q('[data-ct288-discover]');
 if(!root)return false;
 for(const sel of ['[data-ct319-next]','[data-ct319-filter]','[data-ct288-tab-next]','[data-ct288-filter]']){
  for(const el of qa(sel,root))el.remove();
 }
 return true;
}
function cleanTop10333(){
 const root=q('[data-ct319-discover]')||q('[data-ct288-discover]')||document;
 for(const el of qa('.ct288-top-name',root))el.remove();
 return true;
}
function settleForYou333(){
 cleanTabbar333();
 const ok=ensureForYouFilters333();
 return !!ok;
}
function settleDiscover333(){
 cleanTabbar333();
 cleanTop10333();
 if(q('[data-ct309-foryou]'))settleForYou333();
 return true;
}
function finiteSettle333(){
 settleDiscover333();
 for(const ms of [60,180,420])setTimeout(settleDiscover333,ms);
}

/* r332 already calls its final owner after every Pra voce paint/swap. Point that owner here. */
try{
 if(window.__ctR332){
  window.__ctR332.settleForYou=settleForYou333;
  window.__ctR332.ensureForYouFilters=ensureForYouFilters333;
  window.__ctR332.applyForYouFilter=applyForYou333;
 }
}catch{}

document.addEventListener('click',e=>{
 const f=e.target?.closest?.('[data-ct333-fy-kind]');
 if(f){
  e.preventDefault();e.stopImmediatePropagation();
  fyKind333=String(f.dataset.ct333FyKind||'all');
  const old=window.__ctR319Test?.state;if(old)old.fyKind=fyKind333;
  applyForYou333();ensureForYouFilters333();
  return;
 }
 if(e.target?.closest?.('[data-ct319-tab],[data-ct263-discover-tab],[data-ct288-provider],[data-ct321-provider]')){
  finiteSettle333();
 }
},true);

window.addEventListener('cinetracker:data-changed',()=>finiteSettle333());

const style=document.createElement('style');
style.id='ct-web-r333';
style.textContent=`
[data-ct319-discover],[data-ct288-discover]{--ct333-card-w:154px}
@media(min-width:1100px){[data-ct319-discover],[data-ct288-discover]{--ct333-card-w:176px}}

/* User requested these two controls removed. */
[data-ct319-next],[data-ct319-filter],[data-ct288-tab-next],[data-ct288-filter]{display:none!important}

/* Compact the top navigation/content handoff. */
.ct319-tab-shell,.ct288-tab-shell{margin-bottom:2px!important}
.ct288-tabs{padding-bottom:2px!important}
[data-ct319-content],[data-ct315-content],[data-ct263-discover-content]{margin-top:0!important;padding-top:0!important}

/* Pra voce: standard CineTracker 154/176 cards, directly beside one another. */
[data-ct309-foryou] .ct309-fy-grid{
 display:flex!important;
 flex-flow:row nowrap!important;
 justify-content:flex-start!important;
 align-items:flex-start!important;
 gap:10px!important;
 width:100%!important;
 max-width:100%!important;
 overflow-x:auto!important;
 overflow-y:hidden!important;
 padding:1px 1px 5px!important;
 scrollbar-width:thin!important
}
[data-ct309-foryou] .ct309-fy-grid>.ct309-slot{
 flex:0 0 var(--ct333-card-w,176px)!important;
 width:var(--ct333-card-w,176px)!important;
 min-width:var(--ct333-card-w,176px)!important;
 max-width:var(--ct333-card-w,176px)!important
}
[data-ct309-foryou] .ct309-slot>.ct288-card,
[data-ct309-foryou] .ct309-daily-card,
[data-ct309-foryou] .ct309-daily-card>.ct288-card{
 width:var(--ct333-card-w,176px)!important;
 min-width:var(--ct333-card-w,176px)!important;
 max-width:var(--ct333-card-w,176px)!important;
 box-sizing:border-box!important
}
[data-ct309-foryou] .ct288-open,
[data-ct309-foryou] .ct288-poster,
[data-ct309-foryou] .ct288-empty-poster{
 width:100%!important;
 max-width:100%!important;
 box-sizing:border-box!important
}

/* Three Pra voce actions: same card width, one row, no text wrap. */
[data-ct309-foryou] .ct309-actions{
 display:flex!important;
 flex-flow:row nowrap!important;
 align-items:center!important;
 gap:3px!important;
 width:var(--ct333-card-w,176px)!important;
 min-width:var(--ct333-card-w,176px)!important;
 max-width:var(--ct333-card-w,176px)!important;
 box-sizing:border-box!important;
 margin:5px 0 0!important
}
[data-ct309-foryou] .ct309-actions>.chip{
 position:static!important;
 inset:auto!important;
 grid-column:auto!important;
 flex:1 1 0!important;
 width:0!important;
 min-width:0!important;
 max-width:none!important;
 height:24px!important;
 min-height:24px!important;
 padding:2px 3px!important;
 border-radius:8px!important;
 font-size:7.5px!important;
 line-height:1!important;
 white-space:nowrap!important;
 overflow:hidden!important;
 text-overflow:ellipsis!important
}
[data-ct309-foryou] .ct309-actions>.ct309-swap{
 grid-column:auto!important;
 width:0!important;
 min-width:0!important;
 max-width:none!important
}

/* Visible Pra voce filters; no dependency on the removed right-side filter button. */
.ct333-fy-types{
 display:flex!important;
 flex-flow:row nowrap!important;
 align-items:center!important;
 gap:5px!important;
 margin:0 0 8px!important;
 padding:0!important;
 overflow-x:auto!important;
 overflow-y:hidden!important;
 scrollbar-width:none!important
}
.ct333-fy-types::-webkit-scrollbar{display:none!important}
.ct333-fy-filter{
 flex:0 0 auto!important;
 min-height:27px!important;
 height:27px!important;
 padding:3px 9px!important;
 font-size:10px!important;
 line-height:1!important;
 white-space:nowrap!important
}

/* Other Discover rails: actions can never be wider than the standard poster/card. */
.ct288-browse-block .ct288-rail>.ct288-card,
.ct288-browse-block .ct309-card{
 flex:0 0 var(--ct333-card-w,176px)!important;
 width:var(--ct333-card-w,176px)!important;
 min-width:var(--ct333-card-w,176px)!important;
 max-width:var(--ct333-card-w,176px)!important;
 box-sizing:border-box!important
}
.ct288-browse-block .ct288-card>.ct288-open,
.ct288-browse-block .ct288-card .ct288-poster{
 width:100%!important;
 max-width:100%!important;
 box-sizing:border-box!important
}
.ct288-browse-block .ct309-actions{
 display:flex!important;
 flex-flow:row nowrap!important;
 gap:4px!important;
 width:100%!important;
 min-width:0!important;
 max-width:100%!important;
 box-sizing:border-box!important;
 margin:5px 0 0!important
}
.ct288-browse-block .ct309-actions>.chip{
 flex:1 1 0!important;
 width:0!important;
 min-width:0!important;
 max-width:none!important;
 height:26px!important;
 min-height:26px!important;
 padding:2px 4px!important;
 font-size:8px!important;
 line-height:1!important;
 white-space:nowrap!important;
 overflow:hidden!important;
 text-overflow:ellipsis!important
}

/* Top 10: reclaim vertical space and remove duplicated selected-provider label. */
.ct288-top-shell{
 position:relative!important;
 margin:-18px 0 0!important;
 padding:0!important
}
.ct288-top-title{margin:0 0 5px!important;padding:0!important}
.ct288-top-title h2{margin:0!important;line-height:1.15!important}
.ct288-provider-row{
 margin:0 0 5px!important;
 padding:1px 0 3px!important;
 gap:7px!important
}
.ct288-top-name{display:none!important;margin:0!important;padding:0!important;height:0!important}
.ct288-top-section{
 margin:0!important;
 padding:8px!important
}
.ct288-top-section+.ct288-top-section{margin-top:7px!important}
.ct288-top-section .panel-head{margin:0 0 4px!important;min-height:22px!important}
.ct288-top-section .panel-head h2{margin:0!important;line-height:1.1!important}
.ct319-top-row,.ct288-top-row{
 gap:6px!important;
 padding:1px 0 2px!important
}
.ct319-top-row>.ct319-item{
 min-width:0!important;
 width:auto!important;
 max-width:100%!important;
 box-sizing:border-box!important
}
.ct319-top-row .ct288-card,
.ct319-top-row .ct288-open,
.ct319-top-row .ct288-poster,
.ct319-top-row .ct319-actions{
 width:100%!important;
 min-width:0!important;
 max-width:100%!important;
 box-sizing:border-box!important
}
.ct319-top-row .ct319-actions{
 display:flex!important;
 flex-flow:row nowrap!important;
 gap:2px!important;
 margin-top:4px!important
}
.ct319-top-row .ct319-actions>.chip{
 flex:1 1 0!important;
 width:0!important;
 min-width:0!important;
 height:22px!important;
 min-height:22px!important;
 padding:1px 2px!important;
 font-size:7px!important;
 line-height:1!important;
 white-space:nowrap!important;
 overflow:hidden!important;
 text-overflow:ellipsis!important
}

@media(max-width:1099px){
 [data-ct309-foryou] .ct309-actions{font-size:7px!important}
 .ct288-top-shell{margin-top:-10px!important}
}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);

finiteSettle333();

window.__ctR333={
 cleanTabbar:cleanTabbar333,
 cleanTop10:cleanTop10333,
 ensureForYouFilters:ensureForYouFilters333,
 applyForYouFilter:applyForYou333,
 settleForYou:settleForYou333,
 settleDiscover:settleDiscover333,
 version:'1.0.124'
};
window.__ctR333Test={filterMarkup333,ensureForYouFilters333,applyForYouFilter333,cleanTabbar333,cleanTop10333};
})();
