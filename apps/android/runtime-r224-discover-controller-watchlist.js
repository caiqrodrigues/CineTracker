/* Android 0.99.7.52 r224 — one Discover controller + reliable Trocar + animated Watchlist replacement */
(() => {
'use strict';
if(window.__ctAndroidR224Loaded)return;
window.__ctAndroidR224Loaded=true;
window.__ctAndroidR224='discover-single-final-controller-swap-watchlist';
window.__ctAndroidBundle='android-v0.99.7.52-r224-discover-controller-watchlist';
window.__ctR224Discover='one-controller-all-nine-tabs-r217-top10-no-stale-paint';
window.__ctR224Swap='foryou-trocar-immediate-in-place';
window.__ctR224Watchlist='success-animation-immediate-next-recommendation';

const tabs224=new Set(['foryou','top10','trending','popular','new','releases','anticipated','top','calendar']);
let ticket224=0;
const route224=()=>{try{return String(route?.()||'')}catch{return String(location.pathname||'/').replace(/^\/+/, '').split('/')[0]||'home'}};
const isDiscover224=()=>route224()==='discover'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover';
const tab224=v=>{v=String(v||'foryou');return tabs224.has(v)?v:'foryou'};
const railLeft224=()=>{try{return Number(document.querySelector('[data-ct-r180-tabs]')?.scrollLeft||0)}catch{return 0}};
function restoreRail224(left){requestAnimationFrame(()=>{try{const r=document.querySelector('[data-ct-r180-tabs]');if(r)r.scrollLeft=Number(left||0)}catch{}})}
function mark224(selected){
  try{document.querySelectorAll('[data-discover-tab]').forEach(b=>{const on=String(b.dataset.discoverTab||'')===selected;b.classList.toggle('active',on);b.classList.toggle('selected',on);b.setAttribute('aria-selected',on?'true':'false');if(on){b.setAttribute('aria-current','page');b.dataset.ct224Active='1'}else{b.removeAttribute('aria-current');delete b.dataset.ct224Active}})}catch{}
}
function rail224(selected){
  let raw='';try{raw=String(ctR180TabRail())}catch{}
  if(!raw){const labels={foryou:'Pra você',top10:'Top 10',trending:'Em alta',popular:'Populares',new:'Novidades',releases:'Lançamentos',anticipated:'Mais aguardados',top:'Melhores',calendar:'Calendário'};raw=`<div class="tabs" data-ct-r180-tabs>${[...tabs224].map(k=>`<button type="button" class="chip" data-discover-tab="${k}">${labels[k]}</button>`).join('')}</div>`}
  try{const box=document.createElement('div');box.innerHTML=raw;box.querySelectorAll('[data-discover-tab]').forEach(b=>{const on=String(b.dataset.discoverTab||'')===selected;b.classList.toggle('active',on);b.classList.toggle('selected',on);b.setAttribute('aria-selected',on?'true':'false');if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});return box.innerHTML}catch{return raw}
}
function shell224(selected,left){
  try{discoverState.tab=selected;if(selected==='foryou')discoverState.type='all'}catch{}
  const filters=selected==='foryou'?'':`<div class="filters ct-r180-type-filters">${ctR180FiltersHtml()}</div>`;
  setApp(shell('Descobrir','','discover',`<div class="page" data-discover>${rail224(selected)}${filters}<div data-discover-content>${loading('Carregando títulos...')}</div></div>`));
  mark224(selected);restoreRail224(left);
}
async function rows224(selected){
  if(selected==='foryou')return discoverRows('foryou');
  if(typeof ctR180StrictRows==='function')return ctR180StrictRows(selected);
  return discoverRows(selected);
}
async function select224(value,opt={}){
  if(!isDiscover224())return false;
  const selected=tab224(value),left=Number.isFinite(opt.left)?opt.left:railLeft224(),my=++ticket224;
  try{discoverState.tab=selected;if(selected==='foryou')discoverState.type='all'}catch{}
  try{if(opt.advanceNav!==false)++navSeq}catch{}
  if(selected==='top10'){
    try{
      if(typeof window.ctR217RenderTop10!=='function')throw new Error('Renderizador Top 10 indisponível');
      await window.ctR217RenderTop10();
      if(my!==ticket224||!isDiscover224()||tab224(discoverState?.tab)!=='top10')return true;
      mark224('top10');restoreRail224(left);
    }catch(e){if(my===ticket224&&isDiscover224()){const h=document.querySelector('[data-discover-content],[data-ct171-top-content]');if(h)h.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover')}}
    return true;
  }
  shell224(selected,left);
  try{
    const rows=await rows224(selected);
    if(my!==ticket224||!isDiscover224()||tab224(discoverState?.tab)!==selected)return true;
    if(selected==='foryou')paintDiscover(rows||{});else ctR180RenderArray(rows||[]);
    if(my!==ticket224)return true;
    try{discoverState.tab=selected}catch{};mark224(selected);restoreRail224(left);
  }catch(e){if(my===ticket224&&isDiscover224()){const h=document.querySelector('[data-discover-content]');if(h)h.innerHTML=fail('Falha ao carregar Descobrir: '+(e?.message||e),'discover')}}
  return true;
}
async function selectType224(value){
  if(!isDiscover224())return false;
  const selected=tab224(discoverState?.tab||'foryou');
  if(selected==='foryou'){try{discoverState.type='all'}catch{};return true}
  let type=String(value||'all');if(!['all','movie','tv'].includes(type))type='all';
  try{discoverState.type=type}catch{}
  return select224(selected,{advanceNav:true,left:railLeft224()});
}
/* r218's existing delegated click now reaches this controller. No new tab touch/pointer/click layer is added. */
window.ct214SelectDiscoverTab=select224;
window.ct214SelectDiscoverType=selectType224;
window.ctR224SelectDiscover=select224;
try{renderDiscover=async function(){if(!isDiscover224())return false;return select224(tab224(discoverState?.tab||'foryou'),{advanceNav:false,left:railLeft224()})}}catch{}

const normText224=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function watchlistSection224(b){const sec=b.closest?.('section');return normText224(sec?.querySelector?.('.panel-head h2,h2')?.textContent||'')==='da sua watchlist'}
function decorateActions224(){
  if(!isDiscover224())return;
  document.querySelectorAll('[data-ct166-swap]').forEach(b=>{const key=String(b.dataset.ct166Swap||'');if(!key)return;b.removeAttribute('data-ct166-swap');b.dataset.ct224Swap=key;b.classList.add('ct224-swap')});
  document.querySelectorAll('[data-discover-watch]').forEach(b=>{
    if(watchlistSection224(b))return; /* r193 keeps ownership of "Da sua Watchlist" => Marcar visto. */
    const ref=String(b.dataset.discoverWatch||'');if(!ref)return;b.removeAttribute('data-discover-watch');b.dataset.ct224Watchlist=ref;b.classList.add('ct224-watchlist');
  });
}
function removeFromFresh224(type,id){
  try{
    const data=ct166ForYouData;if(!data)return;
    const fresh=data._ct166_fresh;if(!fresh)return;
    for(const kind of ['movie','series','anime'])if(Array.isArray(fresh[kind]))fresh[kind]=fresh[kind].filter(x=>Number(x?.id||0)!==Number(id));
    if(data.daily&&Number(data.daily.id||0)===Number(id))data.daily=null;
    if(data.movie&&Number(data.movie.id||0)===Number(id))data.movie=null;
    if(data.series&&Number(data.series.id||0)===Number(id))data.series=null;
    if(data.anime&&Number(data.anime.id||0)===Number(id))data.anime=null;
  }catch{}
}
function repaintForYou224(){try{if(isDiscover224()&&tab224(discoverState?.tab)==='foryou'&&ct166ForYouData)paintDiscover(ct166ForYouData)}catch{}}
function animateSwap224(b){const slot=b.closest('.ct166-slot,.foryou-slot');if(!slot)return;slot.classList.remove('ct224-swap-pulse');void slot.offsetWidth;slot.classList.add('ct224-swap-pulse')}

/* Only Trocar/Watchlist actions are intercepted here. Navigation itself remains the single r218 -> r224 path. */
document.addEventListener('click',e=>{
  const sw=e.target.closest?.('[data-ct224-swap]');
  if(sw&&isDiscover224()){
    e.preventDefault();e.stopImmediatePropagation();
    const key=String(sw.dataset.ct224Swap||'');if(!key)return;
    try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1}catch{return}
    animateSwap224(sw);requestAnimationFrame(repaintForYou224);return;
  }
  const b=e.target.closest?.('[data-ct224-watchlist]');
  if(!b||!isDiscover224()||b.dataset.ct224Busy==='1')return;
  const [type,id0]=String(b.dataset.ct224Watchlist||'').split(':'),id=Number(id0||0);if(!(id>0)||!['movie','tv'].includes(type))return;
  e.preventDefault();e.stopImmediatePropagation();
  b.dataset.ct224Busy='1';b.disabled=true;b.classList.add('ct224-watch-pending');b.textContent='Adicionando…';
  const card=b.closest('.discover-card,.card');card?.classList?.add('ct224-card-pending');
  void Promise.resolve(addWatchlist(type,id)).then(()=>{
    b.classList.remove('ct224-watch-pending');b.classList.add('ct224-watch-success');b.textContent='✓ Na Watchlist';
    card?.classList?.remove('ct224-card-pending');card?.classList?.add('ct224-card-success');
    try{discoverCache.clear()}catch{}
    if(tab224(discoverState?.tab)==='foryou'){
      removeFromFresh224(type,id);
      setTimeout(()=>{repaintForYou224();try{void discoverRows('foryou').catch(()=>{})}catch{}},180);
    }else{
      setTimeout(()=>{card?.classList?.add('ct224-card-leave');setTimeout(()=>{if(isDiscover224())void select224(tab224(discoverState?.tab),{advanceNav:false,left:railLeft224()})},140)},140);
    }
  }).catch(err=>{
    delete b.dataset.ct224Busy;b.disabled=false;b.classList.remove('ct224-watch-pending');b.textContent='+ Watchlist';card?.classList?.remove('ct224-card-pending');try{toast(err?.message||String(err))}catch{}
  });
},true);

const basePaint224=paintDiscover;
try{paintDiscover=function(rows){const out=basePaint224.apply(this,arguments);decorateActions224();requestAnimationFrame(decorateActions224);return out}}catch{}
let actionFrame224=0;try{new MutationObserver(()=>{if(!isDiscover224()||actionFrame224)return;actionFrame224=requestAnimationFrame(()=>{actionFrame224=0;decorateActions224()})}).observe(document.querySelector('#app')||document.documentElement,{childList:true,subtree:true})}catch{}

const style224=document.createElement('style');style224.id='ct-android-099752';style224.textContent=`
[data-page="discover"] [data-discover-tab][data-ct224-active="1"]{pointer-events:auto!important}
[data-page="discover"] .ct224-swap-pulse{animation:ct224Swap .18s ease-out}
[data-page="discover"] .ct224-card-pending{transform:scale(.985);opacity:.78;transition:transform .16s ease,opacity .16s ease}
[data-page="discover"] .ct224-watch-pending{position:relative;overflow:hidden}
[data-page="discover"] .ct224-watch-pending:after{content:'';position:absolute;inset:auto 8px 4px;height:2px;border-radius:999px;background:currentColor;animation:ct224Load .65s linear infinite;transform-origin:left}
[data-page="discover"] .ct224-card-success{animation:ct224Success .2s ease-out}
[data-page="discover"] .ct224-watch-success{font-weight:800!important}
[data-page="discover"] .ct224-card-leave{opacity:0!important;transform:scale(.94)!important;transition:opacity .14s ease,transform .14s ease!important}
@keyframes ct224Swap{0%{opacity:.55;transform:translateX(5px) scale(.98)}100%{opacity:1;transform:none}}
@keyframes ct224Load{0%{transform:scaleX(.08);opacity:.35}60%{transform:scaleX(.78);opacity:1}100%{transform:scaleX(1);opacity:.45}}
@keyframes ct224Success{0%{transform:scale(.97);filter:brightness(1)}55%{transform:scale(1.02);filter:brightness(1.3)}100%{transform:none;filter:none}}
`;
document.getElementById(style224.id)?.remove();document.head.appendChild(style224);
requestAnimationFrame(decorateActions224);
})();
