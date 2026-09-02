/* Android 0.99.7.33 — Android-native Discover tab grid; no legacy r180 tab attributes */
(() => {
'use strict';
if(window.__ctAndroidR205Loaded)return;
window.__ctAndroidR205Loaded=true;
window.__ctAndroidR205='discover-native-tab-grid-direct-button-listeners';
window.__ctAndroidDiscoverFilters='foryou-no-type-subfilters';
window.__ctAndroidDiscoverTabs='android-owned-grid-no-legacy-data-discover-tab';
window.__ctAndroidDiscoverCarousels='native-horizontal-three-cards-per-viewport';

const A33_TABS=[
  ['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],
  ['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],
  ['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']
];
const A33_TYPES=[['all','Todos'],['movie','Filmes'],['tv','Séries']];

function onDiscoverA33(){try{return String(route())==='discover'}catch{return String(location.pathname||'')==='/discover'}}
function tabsA33(){
  return '<div class="ct205-tab-grid" data-a33-tab-grid>'+A33_TABS.map(([k,l])=>'<button type="button" class="chip '+(String(discoverState?.tab||'foryou')===k?'active':'')+'" data-a33-tab="'+k+'">'+l+'</button>').join('')+'</div>';
}
function typesA33(){
  if(String(discoverState?.tab||'foryou')==='foryou')return '';
  return '<div class="ct205-type-grid" data-a33-type-grid>'+A33_TYPES.map(([k,l])=>'<button type="button" class="chip '+(String(discoverState?.type||'all')===k?'active':'')+'" data-a33-type="'+k+'">'+l+'</button>').join('')+'</div>';
}

/* Make every r180 consumer, including Top 10, render Android-owned controls. The old
   delegated click handler only knows data-discover-tab/data-discover-type, which are absent. */
try{ctR180TabRail=function(){return tabsA33()}}catch{}
try{ctR180FiltersHtml=function(){return String(discoverState?.tab||'foryou')==='foryou'?'':A33_TYPES.map(([k,l])=>'<button type="button" class="chip '+(String(discoverState?.type||'all')===k?'active':'')+'" data-a33-type="'+k+'">'+l+'</button>').join('')}}catch{}

let lastA33Key='',lastA33At=0;
function onceA33(key,fn){const now=Date.now();if(lastA33Key===key&&now-lastA33At<650)return;lastA33Key=key;lastA33At=now;fn()}
function switchTabA33(tab){
  if(!onDiscoverA33())return;
  tab=String(tab||'foryou');
  if(String(discoverState?.tab||'')===tab&&document.querySelector('[data-discover-content]'))return;
  discoverState.tab=tab;if(tab==='foryou')discoverState.type='all';
  document.querySelectorAll('[data-a33-tab]').forEach(b=>b.classList.toggle('active',String(b.dataset.a33Tab)===tab));
  const seq=++navSeq;void Promise.resolve(renderDiscover(seq)).catch(e=>{try{toast(e?.message||String(e))}catch{}});
}
function switchTypeA33(type){
  if(!onDiscoverA33()||String(discoverState?.tab||'')==='foryou')return;
  type=String(type||'all');discoverState.type=type;
  document.querySelectorAll('[data-a33-type]').forEach(b=>b.classList.toggle('active',String(b.dataset.a33Type)===type));
  const seq=++navSeq;void Promise.resolve(renderDiscover(seq)).catch(e=>{try{toast(e?.message||String(e))}catch{}});
}
function bindButtonA33(b,kind){
  if(!b||b.dataset.a33Bound==='1')return;b.dataset.a33Bound='1';
  const fire=e=>{
    e?.preventDefault?.();e?.stopPropagation?.();
    const value=kind==='tab'?b.dataset.a33Tab:b.dataset.a33Type,key=kind+':'+String(value||'');
    onceA33(key,()=>kind==='tab'?switchTabA33(value):switchTypeA33(value));
  };
  b.addEventListener('touchend',fire,{passive:false});
  b.addEventListener('pointerup',fire,false);
  b.addEventListener('click',fire,false);
}
function bindA33(root=document){
  try{root.querySelectorAll?.('[data-a33-tab]').forEach(b=>bindButtonA33(b,'tab'))}catch{}
  try{root.querySelectorAll?.('[data-a33-type]').forEach(b=>bindButtonA33(b,'type'))}catch{}
}
function cleanA33(){
  if(!onDiscoverA33())return;
  document.querySelectorAll('[data-discover-tab],[data-discover-type],[data-ct-r180-tab-scroll]').forEach(el=>{
    if(el.closest?.('[data-page="discover"]'))el.remove();
  });
  if(String(discoverState?.tab||'foryou')==='foryou'){
    discoverState.type='all';document.querySelectorAll('.ct-r180-type-filters,.filters').forEach(el=>{if(el.closest?.('[data-page="discover"]'))el.remove()});
  }
  bindA33(document);
}

/* r198 suppresses an immediate same-route render after foreground. Real navigation must win. */
render=async function(){
  const seq=++navSeq,r=route();
  if(r==='auth'){await renderAuth();return}
  if(!session){history.replaceState({},'','/');await renderAuth();return}
  if(r==='home')return renderHome(seq);
  if(r==='discover')return renderDiscover(seq);
  if(r==='sports')return renderSports(seq);
  if(r==='profile')return renderProfile(seq);
  if(r==='configs')return renderConfigs(seq);
  const id=Number(location.pathname.match(/\d+/)?.[0]||0);
  if(r==='movie'||r==='series')return renderDetail(r,id,seq);
  if(r==='person')return renderPerson(id,seq);
  go('/home',true);
};
window.__ctAndroidRenderPolicy='discover-native-grid-navigation-never-throttled';

try{
  const base=renderDiscover;
  renderDiscover=async function(seq){
    if(String(discoverState?.tab||'foryou')==='foryou')discoverState.type='all';
    const p=base.call(this,seq);cleanA33();bindA33(document);
    try{const out=await p;cleanA33();bindA33(document);return out}catch(e){cleanA33();throw e}
  };
}catch{}
try{
  const base=paintDiscover;
  paintDiscover=function(){const out=base.apply(this,arguments);requestAnimationFrame(()=>{cleanA33();bindA33(document)});return out};
}catch{}

const style=document.createElement('style');style.id='ct-android-099733-discover-grid';style.textContent=`
/* Android-only tab controls: all nine are visible, no horizontal rail or overlay arrows. */
[data-page="discover"] .ct-r180-tab-shell,[data-page="discover"] [data-ct-r180-tabs],[data-page="discover"] .ct-r180-tab-arrow{display:none!important}
[data-page="discover"] .ct205-tab-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;width:100%!important;min-width:0!important;margin:0 0 8px!important;overflow:visible!important;position:relative!important;z-index:20!important;touch-action:pan-y!important}
[data-page="discover"] .ct205-tab-grid>.chip{box-sizing:border-box!important;width:100%!important;min-width:0!important;min-height:36px!important;padding:6px 4px!important;font-size:10px!important;line-height:1.08!important;white-space:normal!important;text-align:center!important;pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:21!important}
[data-page="discover"] .ct205-type-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;width:100%!important;margin:0 0 8px!important;position:relative!important;z-index:20!important}
[data-page="discover"] .ct205-type-grid>.chip{width:100%!important;min-width:0!important;min-height:34px!important;padding:5px 4px!important;pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:21!important}
[data-page="discover"] .ct-r180-type-filters:empty,[data-page="discover"] .filters:empty{display:none!important}

/* Content layout from 0.99.7.32: exactly three visible cards, then native horizontal swipe. */
[data-page="discover"] .foryou-grid,
[data-page="discover"] .discover-carousel,
[data-page="discover"] .ct-r180-discover-section .row,
[data-page="discover"] [data-discover-content]>.row,
[data-page="discover"] .ct171-top-row,
[data-page="discover"] .ct-r180-calendar .row{
 display:flex!important;flex-wrap:nowrap!important;gap:8px!important;width:100%!important;max-width:100%!important;min-width:0!important;
 overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;
 scroll-behavior:auto!important;scroll-snap-type:none!important;touch-action:auto!important;padding:1px 1px 8px!important
}
[data-page="discover"] .foryou-grid>.ct166-slot,
[data-page="discover"] .foryou-grid>*,
[data-page="discover"] .discover-carousel>.card,
[data-page="discover"] .ct-r180-discover-section .row>.card,
[data-page="discover"] [data-discover-content]>.row>.card,
[data-page="discover"] .ct-r180-calendar .row>.card{
 box-sizing:border-box!important;flex:0 0 calc((100% - 16px)/3)!important;width:calc((100% - 16px)/3)!important;min-width:calc((100% - 16px)/3)!important;max-width:calc((100% - 16px)/3)!important
}
[data-page="discover"] .foryou-grid .card,[data-page="discover"] .foryou-grid .ct166-slot .card{width:100%!important;min-width:0!important;max-width:100%!important}
[data-page="discover"] .foryou-grid .poster,[data-page="discover"] .discover-carousel .poster,[data-page="discover"] [data-discover-content]>.row .poster{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}
[data-page="discover"] .foryou-grid .card-title,[data-page="discover"] .discover-carousel .card-title,[data-page="discover"] [data-discover-content]>.row .card-title{font-size:11px!important;line-height:1.18!important}
[data-page="discover"] .discover-section,[data-page="discover"] [data-discover-content],[data-page="discover"] .page{min-width:0!important;max-width:100%!important}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

try{
  const root=document.querySelector('#app')||document.body;
  new MutationObserver(ms=>{for(const m of ms)if((m.addedNodes||[]).length){queueMicrotask(()=>{cleanA33();bindA33(document)});break}}).observe(root,{childList:true,subtree:true});
}catch{}
})();
