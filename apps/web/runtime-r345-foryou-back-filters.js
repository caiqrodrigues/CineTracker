/* CineTracker Web 1.0.136 r345 — stable Pra Você actions, icon-only global back, no Discover filter controls. */
(()=>{
'use strict';
if(window.__ctR345?.version==='1.0.136')return;
window.__ctR345Marker='foryou-grid-actions+icon-back-in-search-row+filters-removed';
window.__ctR345ForYou='r342-excluded+normal-flow-2-or-3-grid+swap-always-present';
window.__ctR345Navigation='icon-only-back-left-of-search+no-text-back+no-header-gap';
window.__ctR345Filters='discover-filter-toggle+type-row+foryou-kind-row-removed';
window.__ctR345Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9‹←<]+/g,' ').trim();
const base344=window.__ctR344?.decorateForYou;

function removeFilterUi345(){
 const states=[window.__ctR318Test?.state,window.__ctR319Test?.state].filter(Boolean);
 for(const st of states){st.fyKind='all';st.filterOpen=false}
 try{window.__ctR336?.applyForYouFilter?.()}catch{}
 qa('[data-ct318-filter],[data-ct318-types],[data-ct336-filters]').forEach(x=>x.remove());
 const root=q('[data-ct336-foryou]');
 if(root){
  root.dataset.ct336Filter='all';
  qa('.ct336-slot,.ct336-block,.ct336-daily',root).forEach(x=>{x.hidden=false;x.removeAttribute('hidden')});
 }
 return true;
}
function cleanActionGeometry345(root=document){
 for(const row of qa('.ct336-actions',root)){
  row.removeAttribute('style');
  row.dataset.ct345Actions='1';
  const buttons=qa(':scope > button',row);
  row.classList.toggle('ct336-actions-two',buttons.length===2);
  row.classList.toggle('ct336-actions-three',buttons.length===3);
  buttons.forEach((b,i)=>{
   b.removeAttribute('style');b.hidden=false;b.removeAttribute('hidden');b.dataset.ct345Action=String(i+1);
   if(b.matches('[data-ct336-swap-only]')){b.textContent='↻ Trocar';b.hidden=false}
  });
  const slot=row.closest('.ct336-slot'),poster=slot&&q('.ct288-poster,.ct288-empty-poster',slot);
  const pr=poster?.getBoundingClientRect?.(),sr=slot?.getBoundingClientRect?.();
  if(pr&&Number(pr.width)>40){
   const w=Math.round(Number(pr.width)*1000)/1000,off=Math.max(0,Math.round((Number(pr.left)-Number(sr?.left||pr.left))*1000)/1000);
   row.style.setProperty('width',w+'px','important');row.style.setProperty('min-width',w+'px','important');row.style.setProperty('max-width',w+'px','important');
   row.style.setProperty('margin-left',off+'px','important');
   row.dataset.ct345PosterWidth=String(w);row.dataset.ct345PosterOffset=String(off);
  }
 }
 return true;
}
function normalizeForYou345(){
 removeFilterUi345();
 try{if(typeof base344==='function')base344()}catch{}
 removeFilterUi345();
 const root=q('[data-ct336-foryou]');if(!root)return false;
 try{
  const model=window.__ctR336Test?.fyModel336?.();
  if(model&&window.__ctR344?.canonicalActions){
   for(const slot of qa('.ct336-slot',root))window.__ctR344.canonicalActions(slot,model);
  }
 }catch{}
 cleanActionGeometry345(root);
 qa('.ct122-media-actions,.ct122-media-info,.ct122-card-meta',root).forEach(x=>x.remove());
 root.dataset.ct345ForYou='stable-actions-no-filters';
 return true;
}
function purgeTextBack345(){
 for(const el of qa('button,a')){
  if(el.matches('[data-ct169-back]'))continue;
  const t=norm(el.textContent);
  if(t==='voltar'||t==='‹ voltar'||t==='← voltar'||t==='< voltar')el.remove();
 }
}
function syncHeader345(){
 purgeTextBack345();
 const scope=q('#app')||document,inputs=qa('input',scope);
 const input=inputs.find(x=>/buscar\s+filmes|buscar\s+s[eé]ries|epis[oó]dios|atores/i.test(String(x.placeholder||'')))||q('input[type="search"]',scope);
 if(!input)return false;
 const search=input.closest('.search')||input.parentElement;if(!search)return false;
 const parent=search.parentElement;if(!parent)return false;
 qa('[data-ct169-back]').forEach(x=>x.remove());
 parent.classList.add('ct345-search-row');
 parent.style.setProperty('display','grid','important');parent.style.setProperty('grid-template-columns','34px minmax(0,1fr)','important');parent.style.setProperty('align-items','center','important');parent.style.setProperty('column-gap','8px','important');parent.style.setProperty('width','100%','important');
 search.style.setProperty('grid-column','2','important');search.style.setProperty('grid-row','1','important');search.style.setProperty('width','100%','important');search.style.setProperty('min-width','0','important');search.style.setProperty('margin','0','important');
 const r=routeNow(),depth=Number(sessionStorage.getItem('ct:r169:nav-depth')||0)||0;
 if(r==='auth'||(r==='home'&&depth<=0))return true;
 const b=document.createElement('button');
 b.type='button';b.className='ct345-back-icon';b.dataset.ct169Back='1';b.setAttribute('aria-label','Voltar');b.setAttribute('title','Voltar');b.textContent='‹';
 b.style.setProperty('grid-column','1','important');b.style.setProperty('grid-row','1','important');
 parent.insertBefore(b,search);
 purgeTextBack345();
 return true;
}

if(window.__ctR344)window.__ctR344.decorateForYou=normalizeForYou345;
try{
 const prevSetApp345=setApp;
 setApp=function(){
  const out=prevSetApp345.apply(this,arguments);
  requestAnimationFrame(()=>{syncHeader345();removeFilterUi345();normalizeForYou345()});
  return out;
 };
}catch{}

const style=document.createElement('style');style.id='ct-web-r345';style.textContent=`
/* Remove every visible Discover filter control requested in r345. */
[data-ct318-filter],[data-ct318-types],[data-ct336-filters]{display:none!important}

/* Back navigation lives on the same line, immediately left of global search. */
.ct345-search-row{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;position:relative!important;width:100%!important;min-width:0!important}
.ct345-search-row>.search,.ct345-search-row .search{box-sizing:border-box!important;position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;float:none!important;order:2!important;flex:none!important;min-width:0!important;max-width:100%!important;width:100%!important;margin:0!important}
.ct345-back-icon{
 box-sizing:border-box!important;position:relative!important;inset:auto!important;transform:none!important;float:none!important;order:1!important;z-index:2!important;display:grid!important;place-items:center!important;flex:0 0 34px!important;width:34px!important;height:34px!important;
 min-width:34px!important;max-width:34px!important;margin:0!important;padding:0!important;border:1px solid #315b72!important;border-radius:10px!important;
 background:#081822!important;color:inherit!important;font-size:22px!important;line-height:1!important;cursor:pointer!important
}
.ct345-back-icon:hover{border-color:#63cfff!important}
.ct169-back{display:none!important}

/* Pra Você actions: normal document flow. No pixel geometry writer, no absolute/transform state. */
[data-ct336-foryou] .ct336-slot{align-items:stretch!important}
[data-ct336-foryou] .ct336-cardwrap{position:relative!important;width:100%!important;min-width:0!important;max-width:100%!important}
[data-ct336-foryou] .ct336-cardwrap .ct288-copy{box-sizing:border-box!important;min-height:52px!important}
[data-ct336-foryou] .ct336-actions{
 box-sizing:border-box!important;position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
 transform:none!important;translate:none!important;float:none!important;clear:none!important;display:grid!important;align-self:stretch!important;align-items:stretch!important;
 width:100%!important;min-width:0!important;max-width:100%!important;height:30px!important;min-height:30px!important;max-height:30px!important;
 gap:4px!important;column-gap:4px!important;row-gap:0!important;margin:6px 0 0!important;padding:0!important;overflow:hidden!important;
 contain:layout paint!important;visibility:visible!important;transition:none!important;animation:none!important
}
[data-ct336-foryou] .ct336-actions-two{grid-template-columns:repeat(2,minmax(0,1fr))!important}
[data-ct336-foryou] .ct336-actions-three{grid-template-columns:repeat(3,minmax(0,1fr))!important}
[data-ct336-foryou] .ct336-actions>.ct336-action{
 box-sizing:border-box!important;position:static!important;inset:auto!important;transform:none!important;translate:none!important;float:none!important;clear:none!important;
 display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:100%!important;
 height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:2px 2px!important;
 font-size:8px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
 visibility:visible!important;transition:none!important;animation:none!important
}
[data-ct336-foryou] .ct336-actions>[data-ct336-swap-only]{display:flex!important;visibility:visible!important}
[data-ct336-foryou] .ct336-actions>[data-ct336-swap-only][disabled]{opacity:.48!important}
`;document.head.appendChild(style);

setTimeout(()=>{syncHeader345();removeFilterUi345();normalizeForYou345()},0);

window.__ctR345={version:'1.0.136',normalizeForYou:normalizeForYou345,removeFilters:removeFilterUi345,syncHeader:syncHeader345,cleanActions:cleanActionGeometry345};
window.__ctR345Test={normalizeForYou345,removeFilterUi345,syncHeader345,cleanActionGeometry345,purgeTextBack345};
})();