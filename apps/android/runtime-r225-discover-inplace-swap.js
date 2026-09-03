/* Android 0.99.7.53 r225 — in-place Discover navigation + deterministic Trocar */
(() => {
'use strict';
if(window.__ctAndroidR225Loaded)return;
window.__ctAndroidR225Loaded=true;
window.__ctAndroidR225='discover-inplace-final-swap-deterministic';
window.__ctAndroidBundle='android-v0.99.7.53-r225-discover-inplace-swap';
window.__ctR225Discover='normal-tabs-update-content-in-place-top10-r217-only';
window.__ctR225Swap='trocar-replaces-own-slot-with-different-item';
window.__ctR225Gestures='no-pointerdown-no-touchstart';

const tabs225=new Set(['foryou','top10','trending','popular','new','releases','anticipated','top','calendar']);
let ticket225=0;
const route225=()=>{try{return String(route?.()||'')}catch{return String(location.pathname||'/').replace(/^\/+/, '').split('/')[0]||'home'}};
const isDiscover225=()=>route225()==='discover'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover';
const tab225=v=>{v=String(v||'foryou');return tabs225.has(v)?v:'foryou'};
const railLeft225=()=>{try{return Number(document.querySelector('[data-ct-r180-tabs]')?.scrollLeft||0)}catch{return 0}};
function restoreRail225(left){requestAnimationFrame(()=>{try{const r=document.querySelector('[data-ct-r180-tabs]');if(r)r.scrollLeft=Number(left||0)}catch{}})}
function mark225(selected){
  try{document.querySelectorAll('[data-discover-tab]').forEach(b=>{const on=String(b.dataset.discoverTab||'')===selected;b.classList.toggle('active',on);b.classList.toggle('selected',on);b.setAttribute('aria-selected',on?'true':'false');if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}catch{}
}
function rail225(selected){
  let raw='';try{raw=String(ctR180TabRail())}catch{}
  if(!raw){const labels={foryou:'Pra você',top10:'Top 10',trending:'Em alta',popular:'Populares',new:'Novidades',releases:'Lançamentos',anticipated:'Mais aguardados',top:'Melhores',calendar:'Calendário'};raw=`<div class="tabs" data-ct-r180-tabs>${[...tabs225].map(k=>`<button type="button" class="chip" data-discover-tab="${k}">${labels[k]}</button>`).join('')}</div>`}
  try{const box=document.createElement('div');box.innerHTML=raw;box.querySelectorAll('[data-discover-tab]').forEach(b=>{const on=String(b.dataset.discoverTab||'')===selected;b.classList.toggle('active',on);b.classList.toggle('selected',on);b.setAttribute('aria-selected',on?'true':'false')});return box.innerHTML}catch{return raw}
}
function rebuildShell225(selected,left){
  try{discoverState.tab=selected;if(selected==='foryou')discoverState.type='all'}catch{}
  const filters=selected==='foryou'?'':`<div class="filters ct-r180-type-filters">${ctR180FiltersHtml()}</div>`;
  setApp(shell('Descobrir','','discover',`<div class="page" data-discover>${rail225(selected)}${filters}<div data-discover-content>${loading('Carregando títulos...')}</div></div>`));
  mark225(selected);restoreRail225(left);
}
function syncFilters225(selected){
  const root=document.querySelector('[data-discover]');if(!root)return;
  let filters=root.querySelector('.ct-r180-type-filters,.filters');
  if(selected==='foryou'){
    try{discoverState.type='all'}catch{}
    if(filters)filters.remove();return;
  }
  if(!filters){
    filters=document.createElement('div');filters.className='filters ct-r180-type-filters';
    const rail=root.querySelector('[data-ct-r180-tabs]');
    if(rail)rail.insertAdjacentElement('afterend',filters);else root.prepend(filters);
  }
  try{filters.innerHTML=ctR180FiltersHtml()}catch{}
}
async function rows225(selected){
  if(selected==='foryou')return discoverRows('foryou');
  if(typeof ctR180StrictRows==='function')return ctR180StrictRows(selected);
  return discoverRows(selected);
}
function paint225(selected,rows){
  if(selected==='foryou')paintDiscover(rows||{});else ctR180RenderArray(rows||[]);
  mark225(selected);syncFilters225(selected);decorateSwap225();
}
function cached225(selected){
  try{
    const c=discoverCache.get(selected+':'+localDay());
    return c&&typeof c.then!=='function'?c:null;
  }catch{return null}
}
async function select225(value,opt={}){
  if(!isDiscover225())return false;
  const selected=tab225(value),previous=tab225(discoverState?.tab||'foryou'),left=Number.isFinite(opt.left)?opt.left:railLeft225(),my=++ticket225;
  try{discoverState.tab=selected;if(selected==='foryou')discoverState.type='all'}catch{}
  try{if(opt.advanceNav!==false)++navSeq}catch{}
  mark225(selected);
  if(selected==='top10'){
    if(typeof window.ctR217RenderTop10!=='function')return false;
    try{await window.ctR217RenderTop10();if(my===ticket225&&isDiscover225()){try{discoverState.tab='top10'}catch{};mark225('top10');restoreRail225(left)}}catch(e){if(my===ticket225){const h=document.querySelector('[data-discover-content],[data-ct171-top-content]');if(h)h.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover')}}
    return true;
  }
  let content=document.querySelector('[data-discover-content]');
  if(previous==='top10'||!content){rebuildShell225(selected,left);content=document.querySelector('[data-discover-content]')}
  else{syncFilters225(selected);mark225(selected);restoreRail225(left)}
  const c=cached225(selected);
  if(c){paint225(selected,c)}else if(content){content.innerHTML=loading('Carregando títulos...')}
  try{
    const rows=await rows225(selected);
    if(my!==ticket225||!isDiscover225()||tab225(discoverState?.tab)!==selected)return true;
    paint225(selected,rows);restoreRail225(left);
  }catch(e){if(my===ticket225&&isDiscover225()){const h=document.querySelector('[data-discover-content]');if(h)h.innerHTML=fail('Falha ao carregar Descobrir: '+(e?.message||e),'discover')}}
  return true;
}
async function selectType225(value){
  if(!isDiscover225())return false;
  const selected=tab225(discoverState?.tab||'foryou');
  if(selected==='foryou'){try{discoverState.type='all'}catch{};syncFilters225(selected);return true}
  let type=String(value||'all');if(!['all','movie','tv'].includes(type))type='all';
  try{discoverState.type=type}catch{}
  return select225(selected,{advanceNav:true,left:railLeft225()});
}
/* Existing delegated click authority (r218) calls these. No new tab gesture listener. */
window.ct214SelectDiscoverTab=select225;
window.ct214SelectDiscoverType=selectType225;
window.ctR225SelectDiscover=select225;
try{renderDiscover=async function(){if(!isDiscover225())return false;return select225(tab225(discoverState?.tab||'foryou'),{advanceNav:false,left:railLeft225()})}}catch{}

function swapPool225(key){
  const data=ct166ForYouData||{};
  const fresh=data._ct166_fresh||{movie:[],series:[],anime:[]},wl=data._ct166_watchlist||{movie:[],series:[],anime:[]};
  if(key==='daily:movie')return {pool:fresh.movie||[],excluded:[]};
  if(key==='fresh:movie'){const daily=ct166Pick(fresh.movie||[],'daily:movie',[]);return {pool:fresh.movie||[],excluded:[daily?.id]}}
  if(key==='fresh:series')return {pool:fresh.series||[],excluded:[]};
  if(key==='fresh:anime')return {pool:fresh.anime||[],excluded:[]};
  if(key==='watchlist:movie')return {pool:wl.movie||[],excluded:[]};
  if(key==='watchlist:series')return {pool:wl.series||[],excluded:[]};
  if(key==='watchlist:anime')return {pool:wl.anime||[],excluded:[]};
  return {pool:[],excluded:[]};
}
function decorateSwap225(root=document){
  if(!isDiscover225())return;
  const list=[];
  try{if(root.matches?.('[data-ct166-swap],[data-ct224-swap]'))list.push(root)}catch{}
  try{list.push(...(root.querySelectorAll?.('[data-ct166-swap],[data-ct224-swap]')||[]))}catch{}
  for(const b of list){
    const key=String(b.dataset.ct225Swap||b.dataset.ct224Swap||b.dataset.ct166Swap||'');if(!key)continue;
    b.removeAttribute('data-ct166-swap');b.removeAttribute('data-ct224-swap');b.dataset.ct225Swap=key;b.classList.add('ct225-swap');
  }
}
function doSwap225(button){
  const key=String(button.dataset.ct225Swap||'');if(!key)return;
  const slot=button.closest('.ct166-slot,.foryou-slot');if(!slot)return;
  const {pool,excluded}=swapPool225(key);if(pool.length<2)return;
  const current=String(slot.querySelector('[data-media]')?.dataset.media||'').split(':');const currentId=Number(current[1]||0);
  let next=null;
  for(let tries=0;tries<pool.length;tries++){
    ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1;
    next=ct166Pick(pool,key,excluded);
    if(Number(next?.id||0)!==currentId)break;
  }
  if(!next||Number(next?.id||0)===currentId)return;
  const label=slot.querySelector('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,pool.length);
  const fresh=box.firstElementChild;if(!fresh)return;
  slot.innerHTML=fresh.innerHTML;
  slot.classList.remove('ct225-swap-pulse');void slot.offsetWidth;slot.classList.add('ct225-swap-pulse');
  decorateSwap225(slot);
}
document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-ct225-swap]');if(!b||!isDiscover225())return;
  e.preventDefault();e.stopImmediatePropagation();doSwap225(b);
},true);

const basePaint225=paintDiscover;
try{paintDiscover=function(...args){const out=basePaint225.apply(this,args);decorateSwap225();requestAnimationFrame(()=>decorateSwap225());return out}}catch{}
let frame225=0;try{new MutationObserver(ms=>{if(!isDiscover225()||frame225)return;frame225=requestAnimationFrame(()=>{frame225=0;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)decorateSwap225(n);decorateSwap225()})}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}

const style225=document.createElement('style');style225.id='ct-android-099753';style225.textContent=`
[data-page="discover"] [data-discover-content]{transition:opacity .12s ease}
[data-page="discover"] .ct225-swap-pulse{animation:ct225Swap .22s ease-out}
@keyframes ct225Swap{0%{opacity:.35;transform:translateX(10px) scale(.98)}55%{opacity:.9;transform:translateX(-2px) scale(1.01)}100%{opacity:1;transform:none}}
`;
document.getElementById(style225.id)?.remove();document.head.appendChild(style225);
requestAnimationFrame(()=>decorateSwap225());
})();
