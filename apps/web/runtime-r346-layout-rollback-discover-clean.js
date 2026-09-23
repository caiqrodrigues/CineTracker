/* CineTracker Web 1.0.137 r346 — rollback page-wide header grid, source-remove Discover filters, keep Pra Você stable. */
(()=>{
'use strict';
if(window.__ctR346?.version==='1.0.137')return;
window.__ctR346Marker='restore-content-layout+dedicated-search-row+filters-source-removed';
window.__ctR346Header='dedicated-wrapper-only+icon-back+search-visible';
window.__ctR346Discover='no-r318-filter-ui+no-r336-kind-filters+all-items';
window.__ctR346Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9‹←<]+/g,' ').trim();

function purgeTextBack346(){
 for(const el of qa('button,a')){
  if(el.matches('[data-ct346-back]'))continue;
  const t=norm(el.textContent);
  if(t==='voltar'||t==='‹ voltar'||t==='← voltar'||t==='< voltar')el.remove();
 }
}
function restoreContent346(){
 const content=q('.content');if(!content)return false;
 content.classList.remove('ct345-search-row');
 for(const k of ['display','grid-template-columns','grid-template-rows','align-items','column-gap','row-gap','width','min-width'])
  content.style.removeProperty(k);
 return true;
}
function ensureSearchRow346(){
 restoreContent346();purgeTextBack346();
 const content=q('.content');if(!content)return false;
 let search=q(':scope > .search-global',content);
 let row=q(':scope > .ct346-search-row',content);
 if(!search&&row)search=q(':scope > .search-global',row);
 if(!search)return false;
 if(!row){
  row=document.createElement('div');row.className='ct346-search-row';
  content.insertBefore(row,search);row.appendChild(search);
 }
 qa('[data-ct169-back],[data-ct345-back-icon],[data-ct346-back]',row).forEach(x=>x.remove());
 const r=routeNow(),depth=Number(sessionStorage.getItem('ct:r169:nav-depth')||0)||0;
 if(r!=='auth'&&!(r==='home'&&depth<=0)){
  const b=document.createElement('button');b.type='button';b.className='ct346-back-icon';b.dataset.ct346Back='1';
  b.setAttribute('aria-label','Voltar');b.setAttribute('title','Voltar');b.textContent='‹';
  row.insertBefore(b,search);
 }
 purgeTextBack346();
 return true;
}
function normalizeDiscover346(){
 if(routeNow()!=='discover')return false;
 qa('[data-ct318-filter],[data-ct318-types],[data-ct336-filters],[data-ct318-fy-kind],[data-ct336-fy-kind]').forEach(x=>x.remove());
 const root=q('[data-ct336-foryou]');
 if(root){
  root.dataset.ct336Filter='all';
  qa('[data-ct336-kind],.ct336-block,.ct336-slot,.ct336-daily',root).forEach(x=>{x.hidden=false;x.removeAttribute('hidden')});
  const empty=q('.ct336-empty',root);if(empty)empty.hidden=true;
 }
 try{
  const st=window.__ctR319Test?.state;if(st){st.fyKind='all';st.filterOpen=false}
 }catch{}
 try{window.__ctR345?.normalizeForYou?.()}catch{}
 return true;
}
function settle346(){
 ensureSearchRow346();normalizeDiscover346();
 requestAnimationFrame(()=>{ensureSearchRow346();normalizeDiscover346()});
}
try{
 const baseSetApp346=setApp;
 setApp=function(){
  const out=baseSetApp346.apply(this,arguments);
  queueMicrotask(settle346);
  return out;
 };
}catch{}
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-ct346-back]')){e.preventDefault();e.stopPropagation();history.back();return}
 if(routeNow()==='discover'&&e.target?.closest?.('[data-ct318-tab],[data-ct336-action],[data-ct336-swap-only]'))queueMicrotask(normalizeDiscover346);
},true);

const style=document.createElement('style');style.id='ct-web-r346';style.textContent=`
/* Never turn the entire page content into a search row. */
.content{display:block!important;grid-template-columns:none!important;grid-template-rows:none!important}
.ct346-search-row{
 box-sizing:border-box!important;display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;align-items:center!important;
 gap:8px!important;width:100%!important;min-width:0!important;margin:0 0 10px!important
}
.ct346-search-row>.search-global{
 box-sizing:border-box!important;grid-column:2!important;width:100%!important;min-width:0!important;margin:0!important
}
.ct346-search-row:not(:has(.ct346-back-icon))>.search-global{grid-column:1/-1!important}
.ct346-back-icon{
 box-sizing:border-box!important;display:grid!important;place-items:center!important;width:34px!important;height:34px!important;min-width:34px!important;
 margin:0!important;padding:0!important;border:1px solid #315b72!important;border-radius:10px!important;background:#081822!important;color:#eefaff!important;
 font-size:22px!important;line-height:1!important;cursor:pointer!important
}
.ct346-back-icon:hover{border-color:#63cfff!important}
.ct169-back,.ct345-back-icon,[data-ct318-filter],[data-ct318-types],[data-ct336-filters]{display:none!important}
`;document.head.appendChild(style);

setTimeout(settle346,0);
window.__ctR346={version:'1.0.137',restoreContent:restoreContent346,ensureSearchRow:ensureSearchRow346,normalizeDiscover:normalizeDiscover346,settle:settle346};
window.__ctR346Test={restoreContent346,ensureSearchRow346,normalizeDiscover346,purgeTextBack346};
})();