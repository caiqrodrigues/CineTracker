/* Android 0.99.7.66 r238 — only fixes Trocar inside "Da sua Watchlist". r237 scroll stays untouched. */
(() => {
'use strict';
if(window.__ctAndroidR238Loaded)return;
window.__ctAndroidR238Loaded=true;
window.__ctAndroidR238='watchlist-trocar-own-authority-live-dashboard';
window.__ctAndroidBundle='android-v0.99.7.66-r238-watchlist-swap-only';
window.__ctR238Scope='watchlist-swap-only-scroll-r237-and-fresh-swap-untouched';
window.__ctR238WatchPool='r237-live-plus-full-profile-dashboard';
window.__ctR238Event='watchlist-private-pointerup-click';

const SWAP238='[data-ct238-watch-swap]';
let dash238=null,dashAt238=0,dashTask238=null;
const index238={};
let busy238=false,lastKey238='',lastAt238=0;

function isForYou238(){
  try{return String(route())==='discover'&&String(discoverState?.tab||'foryou')==='foryou'}catch{return false}
}
function kind238(key){return key==='watchlist:series'?'series':key==='watchlist:anime'?'anime':'movie'}
function id238(x){return Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0)}
function type238(x){try{return mediaType(x)}catch{return x?.media_type==='movie'?'movie':'tv'}}
function unique238(rows){
  const seen=new Set(),out=[];
  for(const x of Array.isArray(rows)?rows:[]){
    const id=id238(x),k=type238(x)+':'+id;if(!(id>0)||seen.has(k))continue;
    seen.add(k);out.push(x);
  }
  return out;
}
function poolFromDashboard238(dash,key){
  const k=kind238(key),rows=[];
  for(const x of Array.isArray(dash)?dash:[]){
    if(!x?.is_watchlist||x?.is_seen||x?.is_completed)continue;
    let card=null;try{card=dashboardCard162(x)}catch{}
    if(!card)continue;
    try{if(!mediaPoster(card))continue}catch{if(!card.poster_path)continue}
    const t=type238(card),anime=(()=>{try{return Boolean(animeDashboard162(x)||animeDashboard162(card))}catch{return false}})();
    if(k==='movie'&&t!=='movie')continue;
    if(k==='series'&&(t!=='tv'||anime))continue;
    if(k==='anime'&&(t!=='tv'||!anime))continue;
    rows.push(card);
  }
  try{rows.sort((a,b)=>Number(ct166Rank(b))-Number(ct166Rank(a)))}catch{}
  return unique238(rows);
}
window.__ctR238WatchPoolFromDashboard=poolFromDashboard238;
async function dashboard238(force=false){
  if(!force&&dash238&&Date.now()-dashAt238<15000)return dash238;
  if(dashTask238)return dashTask238;
  dashTask238=Promise.resolve(rpc('cinetracker_profile_media_dashboard_v0991',{})).then(v=>{
    dash238=Array.isArray(v)?v:[];dashAt238=Date.now();return dash238;
  }).finally(()=>{dashTask238=null});
  return dashTask238;
}
async function pool238(key){
  let live=[];try{if(typeof window.__ctR237Pool==='function')live=window.__ctR237Pool(key)||[]}catch{}
  let full=[];try{full=poolFromDashboard238(await dashboard238(false),key)}catch{}
  return unique238([...(live||[]),...(full||[])]);
}
function current238(slot){
  const raw=String(slot?.querySelector?.('[data-media]')?.dataset?.media||'');return Number(raw.split(':')[1]||0)
}
function place238(slot){
  if(!slot)return;
  const swap=slot.querySelector?.(SWAP238);if(!swap)return;
  swap.classList.add('ct166-swap','ct237-swap','ct238-watch-swap');
  const card=slot.querySelector?.('.discover-card,.card');if(!card)return;
  let actions=card.querySelector?.('.ct169-card-actions');
  if(!actions){actions=document.createElement('div');actions.className='ct169-card-actions';card.appendChild(actions)}
  const action=card.querySelector?.('[data-ct-a23-seen],.discover-watch,[data-discover-watch],[data-ct224-watchlist],[data-ct226-watchlist]');
  if(action&&action.parentElement!==actions)actions.appendChild(action);
  if(swap.parentElement!==actions)actions.appendChild(swap);
  slot.querySelector?.('.ct166-slot-head')?.classList?.add?.('ct169-clean-head');
}
function retag238(root=document){
  const buttons=[];
  try{if(root?.matches?.('[data-ct237-swap^="watchlist:"]'))buttons.push(root)}catch{}
  try{buttons.push(...(root?.querySelectorAll?.('[data-ct237-swap^="watchlist:"]')||[]))}catch{}
  for(const b of buttons){
    const key=String(b.dataset.ct237Swap||'');if(!key.startsWith('watchlist:'))continue;
    b.removeAttribute('data-ct237-swap');b.dataset.ct238WatchSwap=key;place238(b.closest?.('.ct166-slot,.foryou-slot'));
  }
  const tagged=[];
  try{if(root?.matches?.(SWAP238))tagged.push(root)}catch{}
  try{tagged.push(...(root?.querySelectorAll?.(SWAP238)||[]))}catch{}
  for(const b of tagged)place238(b.closest?.('.ct166-slot,.foryou-slot'));
}
window.__ctR238Retag=retag238;
async function swap238(button){
  if(busy238)return false;
  const key=String(button?.dataset?.ct238WatchSwap||''),slot=button?.closest?.('.ct166-slot,.foryou-slot');
  if(!key.startsWith('watchlist:')||!slot||typeof ct166Slot!=='function')return false;
  busy238=true;button.disabled=true;
  const oldText=button.textContent;
  try{
    const rows=await pool238(key),current=current238(slot);if(rows.length<2)return false;
    let i=Number(index238[key]||0),next=null;
    for(let n=0;n<rows.length;n++){i=(i+1)%rows.length;const x=rows[i];if(id238(x)>0&&id238(x)!==current){next=x;break}}
    if(!next)return false;index238[key]=i;
    const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
    const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,rows.length);
    const fresh=box.firstElementChild;if(!fresh)return false;
    slot.replaceWith(fresh);fresh.classList.add('ct237-swap-pulse');
    retag238(fresh);
    try{decorate226(fresh)}catch{}
    requestAnimationFrame(()=>{try{decorateForYouA23()}catch{};try{ct169TuneForYou()}catch{};retag238(fresh)});
    return true;
  }finally{
    busy238=false;
    if(button?.isConnected){button.disabled=false;button.textContent=oldText}
  }
}
window.__ctR238SwapNow=swap238;
function activate238(e){
  if(!isForYou238())return;
  const b=e?.target?.closest?.(SWAP238);if(!b)return;
  const key=String(b.dataset?.ct238WatchSwap||''),now=Date.now();
  if(!key.startsWith('watchlist:'))return;
  if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
  if(busy238||(key===lastKey238&&now-lastAt238<650))return;
  lastKey238=key;lastAt238=now;void swap238(b);
}
window.addEventListener('pointerup',activate238,{capture:true,passive:false});
window.addEventListener('click',activate238,{capture:true,passive:false});

/* Retag synchronously after every For You paint so r237 never owns Watchlist Trocar;
   fresh/100% novos keeps data-ct237-swap and the already-working r237 handler. */
try{
  const base=paintDiscover;paintDiscover=function(...args){const out=base.apply(this,args);retag238(document);requestAnimationFrame(()=>retag238(document));return out};
}catch{}
let frame238=0;
try{new MutationObserver(ms=>{if(frame238)return;frame238=requestAnimationFrame(()=>{frame238=0;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)retag238(n);retag238(document)})}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
requestAnimationFrame(()=>retag238(document));
})();
