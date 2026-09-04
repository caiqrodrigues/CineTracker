/* Android 0.99.7.67 r239 — Watchlist Trocar reads the profile dashboard directly.
   No scroll/Top10 behavior and no 100% novos behavior is changed here. */
(() => {
'use strict';
if(window.__ctAndroidR239Loaded)return;
window.__ctAndroidR239Loaded=true;
window.__ctAndroidBundle='android-v0.99.7.67-r239-watchlist-direct-dashboard';
window.__ctR239Scope='watchlist-trocar-only-r237-scroll-and-fresh-untouched';
window.__ctR239Source='profile-dashboard-direct-row-to-card-no-helper-dependency';
window.__ctR239Selector='watchlist-section-multi-source-retag';

const SELECTOR239='[data-ct239-watch-swap]';
const INDEX239=Object.create(null);
let dashboardCache239=null,dashboardAt239=0,dashboardTask239=null;

function norm239(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function discover239(){
  let r='';try{r=String(route?.()||'')}catch{r=String(location.pathname||'')}
  r=r.replace(/^\/+/, '').split(/[?#/]/)[0];
  return r==='discover';
}
function forYou239(){
  if(!discover239())return false;
  let tab='foryou';try{tab=String(discoverState?.tab||'foryou')}catch{}
  return tab==='foryou';
}
function watchSection239(el){
  const sec=el?.closest?.('section,.panel');
  const title=sec?.querySelector?.('h1,h2,h3,.panel-head h2,.panel-head h3')?.textContent||'';
  return norm239(title)==='da sua watchlist';
}
function key239(el){
  return String(el?.dataset?.ct239WatchSwap||el?.dataset?.ct237Swap||el?.dataset?.ct226Swap||el?.dataset?.ct166Swap||'');
}
function kind239(key){return key==='watchlist:series'?'series':key==='watchlist:anime'?'anime':'movie'}
function id239(x){return Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.id||x?.raw_tmdb?.source_tmdb_id||0)}
function genreIds239(raw){
  const out=[];
  for(const v of Array.isArray(raw?.genre_ids)?raw.genre_ids:[])out.push(Number(v));
  for(const g of Array.isArray(raw?.genres)?raw.genres:[])out.push(Number(g?.id||g));
  return out.filter(Number.isFinite);
}
function anime239(row,card){
  try{if(typeof animeDashboard162==='function'&&(animeDashboard162(row)||animeDashboard162(card)))return true}catch{}
  const raw=row?.raw_tmdb&&typeof row.raw_tmdb==='object'?row.raw_tmdb:{};
  const ids=genreIds239(raw),names=(Array.isArray(raw?.genres)?raw.genres:[]).map(g=>norm239(g?.name||g));
  const animation=ids.includes(16)||names.includes('animation')||names.includes('animacao')||names.includes('anime');
  const lang=String(raw?.original_language||card?.original_language||'').toLowerCase();
  const origins=[...(Array.isArray(raw?.origin_country)?raw.origin_country:[]),...(Array.isArray(raw?.production_countries)?raw.production_countries.map(x=>x?.iso_3166_1||x):[])].map(x=>String(x||'').toUpperCase());
  return card?.media_type==='tv'&&animation&&(lang==='ja'||origins.includes('JP'));
}
function card239(row){
  const raw=row?.raw_tmdb&&typeof row.raw_tmdb==='object'?row.raw_tmdb:{};
  const id=Number(row?.tmdb_id||raw?.id||raw?.source_tmdb_id||0);if(!(id>0))return null;
  const mk=String(row?.media_kind||raw?.media_type||'').toLowerCase();
  const mediaType=mk==='movie'?'movie':'tv';
  const title=String(row?.title||raw?.title||raw?.name||'').trim();
  const poster=String(row?.poster_path||raw?.poster_path||'').trim();
  if(!title||!poster)return null;
  const out={...raw,id,tmdb_id:id,media_type:mediaType,poster_path:poster};
  if(mediaType==='movie'){
    out.title=title;out.name=raw?.name||title;
    if(!out.release_date&&row?.release_year)out.release_date=String(row.release_year)+'-01-01';
  }else{
    out.name=title;out.title=raw?.title||title;
    if(!out.first_air_date&&row?.release_year)out.first_air_date=String(row.release_year)+'-01-01';
  }
  if(!Number(out.vote_average)&&Number(row?.rating))out.vote_average=Number(row.rating);
  return out;
}
function unique239(rows){
  const seen=new Set(),out=[];
  for(const x of Array.isArray(rows)?rows:[]){const id=id239(x),type=String(x?.media_type||'');const k=type+':'+id;if(!(id>0)||seen.has(k))continue;seen.add(k);out.push(x)}
  return out;
}
async function dashboard239(force=false){
  if(!force&&dashboardCache239&&Date.now()-dashboardAt239<20000)return dashboardCache239;
  if(dashboardTask239)return dashboardTask239;
  dashboardTask239=Promise.resolve(rpc('cinetracker_profile_media_dashboard_v0991',{})).then(rows=>{
    dashboardCache239=Array.isArray(rows)?rows:[];dashboardAt239=Date.now();return dashboardCache239;
  }).finally(()=>{dashboardTask239=null});
  return dashboardTask239;
}
async function pool239(key){
  const wanted=kind239(key),rows=[];
  const dash=await dashboard239(false);
  for(const row of dash){
    if(!row?.is_watchlist||row?.is_seen||row?.is_completed)continue;
    const card=card239(row);if(!card)continue;
    const isAnime=anime239(row,card);
    if(wanted==='movie'&&card.media_type!=='movie')continue;
    if(wanted==='series'&&(card.media_type!=='tv'||isAnime))continue;
    if(wanted==='anime'&&(card.media_type!=='tv'||!isAnime))continue;
    rows.push(card);
  }
  /* Keep already-live rows only as a fallback/merge, never as the primary source. */
  try{if(typeof window.__ctR237Pool==='function')rows.push(...(window.__ctR237Pool(key)||[]))}catch{}
  const out=unique239(rows);
  try{out.sort((a,b)=>Number(ct166Rank?.(b)||b?.popularity||0)-Number(ct166Rank?.(a)||a?.popularity||0))}catch{}
  return out;
}
window.__ctR239Pool=pool239;
window.__ctR239CardFromDashboard=card239;

function currentId239(slot){
  const raw=String(slot?.querySelector?.('[data-media]')?.dataset?.media||'');return Number(raw.split(':')[1]||0)
}
function place239(slot){
  if(!slot)return;
  const b=slot.querySelector?.(SELECTOR239);if(!b)return;
  b.classList.add('ct166-swap','ct237-swap','ct239-watch-swap');
  const card=slot.querySelector?.('.discover-card,.card');if(!card)return;
  let actions=card.querySelector?.('.ct169-card-actions');
  if(!actions){actions=document.createElement('div');actions.className='ct169-card-actions';card.appendChild(actions)}
  const action=card.querySelector?.('[data-ct-a23-seen],.discover-watch,[data-discover-watch],[data-ct224-watchlist],[data-ct226-watchlist]');
  if(action&&action.parentElement!==actions)actions.appendChild(action);
  if(b.parentElement!==actions)actions.appendChild(b);
  slot.querySelector?.('.ct166-slot-head')?.classList?.add?.('ct169-clean-head');
}
function retag239(root=document){
  const list=[];
  const qs='[data-ct237-swap^="watchlist:"],[data-ct226-swap^="watchlist:"],[data-ct166-swap^="watchlist:"],[data-ct239-watch-swap]';
  try{if(root?.matches?.(qs))list.push(root)}catch{}
  try{list.push(...(root?.querySelectorAll?.(qs)||[]))}catch{}
  for(const b of list){
    let key=key239(b);if(!key.startsWith('watchlist:')||!watchSection239(b))continue;
    b.removeAttribute('data-ct237-swap');b.removeAttribute('data-ct226-swap');b.removeAttribute('data-ct166-swap');
    b.dataset.ct239WatchSwap=key;place239(b.closest?.('.ct166-slot,.foryou-slot'));
  }
}
window.__ctR239Retag=retag239;

async function swap239(button){
  const key=key239(button),slot=button?.closest?.('.ct166-slot,.foryou-slot');
  if(!key.startsWith('watchlist:')||!slot||typeof ct166Slot!=='function')return false;
  if(button.dataset.ct239Busy==='1')return false;
  button.dataset.ct239Busy='1';button.disabled=true;
  const original=button.textContent;button.textContent='↻ ...';
  try{
    const rows=await pool239(key),current=currentId239(slot);
    if(rows.length<2){try{toast('Não há outro item disponível nesta categoria da Watchlist.')}catch{};return false}
    let pos=Number(INDEX239[key]??-1),next=null;
    for(let n=0;n<rows.length;n++){pos=(pos+1)%rows.length;const candidate=rows[pos];if(id239(candidate)>0&&id239(candidate)!==current){next=candidate;break}}
    if(!next)return false;INDEX239[key]=pos;
    const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
    const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,rows.length);
    const fresh=box.firstElementChild;if(!fresh)return false;
    slot.replaceWith(fresh);fresh.classList.add('ct237-swap-pulse');
    retag239(fresh);
    try{decorate226(fresh)}catch{}
    requestAnimationFrame(()=>{try{decorateForYouA23?.()}catch{};try{ct169TuneForYou?.()}catch{};retag239(fresh)});
    return true;
  }catch(err){try{toast('Falha ao trocar item da Watchlist: '+(err?.message||String(err)))}catch{};return false}
  finally{if(button?.isConnected){button.disabled=false;button.textContent=original;delete button.dataset.ct239Busy}}
}
window.__ctR239SwapNow=swap239;
let lastButton239=null,lastAt239=0;
function activate239(e){
  if(!forYou239())return;
  const b=e?.target?.closest?.(SELECTOR239);if(!b||!watchSection239(b))return;
  const now=Date.now();if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
  if(b.dataset.ct239Busy==='1'||(b===lastButton239&&now-lastAt239<650))return;
  lastButton239=b;lastAt239=now;void swap239(b);
}
window.addEventListener('pointerup',activate239,{capture:true,passive:false});
window.addEventListener('click',activate239,{capture:true,passive:false});

/* Retag after every For You paint. r237 keeps owning fresh/100% novos buttons. */
try{const base=paintDiscover;paintDiscover=function(...args){const out=base.apply(this,args);retag239(document);requestAnimationFrame(()=>retag239(document));return out}}catch{}
let frame239=0;
try{new MutationObserver(ms=>{if(frame239)return;frame239=requestAnimationFrame(()=>{frame239=0;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)retag239(n);retag239(document)})}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
requestAnimationFrame(()=>retag239(document));
})();
