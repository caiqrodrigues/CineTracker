/* CineTracker 1.0.14 — enrich Watchlist recommendations, immediate replacement after add, unified stats collapse and icon-only controls. */
(()=>{
'use strict';
if(window.__ctR220V114)return;
window.__ctR220V114='watchlist-enrichment-inplace-add-stats-unified-icons';
window.__ctV114Watchlist='tmdb-enriched-before-strict-filter';
window.__ctV114WatchlistAdd='fresh-card-add-replaces-in-place-like-swap';
window.__ctV114Stats='web-main-plus-sports-collapse-together-icon-only';
window.__ctV114F1='icon-only-collapse-preserve-grid';

const q114=(s,r=document)=>r?.querySelector?.(s)||null;
const qa114=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n114=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const norm114=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const isAndroid114=()=>Boolean(window.__ctAndroidOfficialVersion||window.__ctAndroidRelease||document.querySelector('meta[name="ct-android-version"]'));
const id114=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}};
const type114=x=>{try{return mediaType(x)==='movie'?'movie':'tv'}catch{return String(x?.media_type||'')==='movie'?'movie':'tv'}};
const badState114=x=>Boolean(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||n114(x?.watched_episodes)>0||x?.last_watched_at);
const kind114=x=>{const k=String(x?.media_kind||x?.kind||'').toLowerCase();if(k==='anime')return'anime';if(type114(x)==='movie'||k==='movie')return'movie';return'series'};
const slot114=k=>`watchlist:${k}`;

/* ---------- Pra voce: build Watchlist candidates from complete TMDB metadata ---------- */
let prepTask114=null;
async function tmdbDetail114(row){
 const id=id114(row),type=type114(row);if(!(id>0))return null;
 const path=`/${type==='movie'?'movie':'tv'}/${id}`;let d=null;
 try{if(typeof safeTmdb==='function')d=await safeTmdb(path,{language:'pt-BR'})}catch{}
 if(!d)try{if(typeof tmdb==='function')d=await tmdb(path,{language:'pt-BR'})}catch{}
 if(!d||typeof d!=='object')return null;
 const genreIds=Array.isArray(d.genre_ids)?d.genre_ids:(Array.isArray(d.genres)?d.genres.map(g=>Number(g?.id||0)).filter(Boolean):[]);
 const raw={...(row?.raw_tmdb||{}),...d,genre_ids:genreIds};
 return {...row,...d,id,tmdb_id:id,media_type:type,media_kind:kind114(row),genre_ids:genreIds,raw_tmdb:raw,poster_path:d.poster_path||row?.poster_path||row?.raw_tmdb?.poster_path||null};
}
function strictWatchOk114(x,c,kind){
 if(!x||id114(x)<=0)return false;
 if(typeof window.__ctV113Quality==='function'&&!window.__ctV113Quality(x))return false;
 if(typeof window.__ctV113MemoryBlocked==='function'&&window.__ctV113MemoryBlocked(slot114(kind),id114(x)))return false;
 try{if(typeof ct186WatchEligible==='function'&&!ct186WatchEligible(x,c))return false}catch{}
 return true;
}
async function enrichKind114(rows,c,kind){
 const out=[],seen=new Set(),batchSize=10;
 for(let i=0;i<rows.length;i+=batchSize){
  const batch=rows.slice(i,i+batchSize),details=await Promise.all(batch.map(tmdbDetail114));
  for(const x of details){const id=id114(x);if(!id||seen.has(id)||!strictWatchOk114(x,c,kind))continue;seen.add(id);out.push(x)}
  if(out.length>=8)break;
 }
 return out;
}
async function prepareWatchPools114(c,force=false){
 if(!c||!Array.isArray(c.dash))return c;
 if(!force&&c.__ct114WatchPools&&Date.now()-n114(c.__ct114WatchAt)<60000)return c;
 const base=c.dash.filter(x=>Boolean(x?.is_watchlist)&&!badState114(x)&&id114(x)>0),groups={movie:[],series:[],anime:[]};
 for(const x of base)groups[kind114(x)].push(x);
 const [movie,series,anime]=await Promise.all([enrichKind114(groups.movie,c,'movie'),enrichKind114(groups.series,c,'series'),enrichKind114(groups.anime,c,'anime')]);
 c.__ct114WatchPools={movie,series,anime};c.__ct114WatchAt=Date.now();
 window.__ctV114LastWatchPools=c.__ct114WatchPools;
 return c;
}
try{
 const ctxBase114=ct186Context;
 ct186Context=async function(force=false){const c=await ctxBase114(force);if(prepTask114)return prepTask114;prepTask114=prepareWatchPools114(c,force).finally(()=>prepTask114=null);return prepTask114};
 try{ct186ContextValue=null;ct186ContextAt=0}catch{}
}catch{}
try{
 const poolsBase114=ct186WatchPools;
 ct186WatchPools=function(c){return c?.__ct114WatchPools||poolsBase114(c)};
}catch{}

/* Add-to-Watchlist from a Pra voce fresh card behaves exactly like Trocar after persistence succeeds. */
function freshSlotFor114(type,id){
 const media=`${type==='movie'?'movie':'tv'}:${Number(id)}`;
 for(const el of qa114('[data-ct241-slot-key],.ct166-slot,.foryou-slot')){
  const key=String(el.dataset?.ct241SlotKey||'');if(!(key.startsWith('fresh:')||key==='daily:movie'))continue;
  if(q114(`[data-media="${media}"]`,el))return{el,key:key==='daily:movie'?'fresh:movie':key};
 }
 return null;
}
function swapButton114(el){return qa114('button',el).find(b=>/\btrocar\b/.test(norm114(b.textContent||''))||b.hasAttribute('data-ct237-swap')||b.hasAttribute('data-ct166-swap'))||null}
async function fallbackReplace114(slot,type,id){
 try{await rpc('cinetracker_recommendation_record_v113',{p_tmdb_id:Number(id),p_media_type:type==='movie'?'movie':'tv',p_slot:slot,p_action:'swapped'})}catch{}
 try{ct186LocalBlocked.add(`${type==='movie'?'movie':'tv'}:${Number(id)}`)}catch{}
 try{if(typeof ct166SwapIndex!=='undefined')ct166SwapIndex[slot]=Math.max(0,Number(ct166SwapIndex[slot]||0))+1}catch{}
 try{if(typeof ct186PaintCurrent==='function')ct186PaintCurrent();else if(ct186ForYouData)paintDiscover(ct186ForYouData)}catch{}
}
try{
 const addBase114=addWatchlist;
 addWatchlist=async function(type,id){
  type=String(type)==='movie'?'movie':'tv';id=Number(id||0);const slot=freshSlotFor114(type,id),swap=slot?swapButton114(slot.el):null;
  const added=await addBase114(type,id);
  if(added===true&&slot){
   try{ct186ContextValue=null;ct186ContextAt=0}catch{}
   if(swap&&typeof window.__ctR237SwapNow==='function')window.__ctR237SwapNow(swap);else await fallbackReplace114(slot.key,type,id);
  }
  return added;
 };
}catch{}

/* ---------- Minimal icon-only collapse controls ---------- */
function setCollapseIcon114(b,collapsed){
 if(!b)return;const symbol=collapsed?'⌄':'⌃',label=collapsed?'Expandir':'Recolher';
 b.classList.add('ct114-collapse-icon');b.textContent=symbol;b.title=label;b.setAttribute('aria-label',label);b.setAttribute('aria-expanded',collapsed?'false':'true');
}
function iconifyF1114(){
 const hub=q114('#ct-f1-v111'),b=q114('[data-ct113-f1-toggle]',hub);if(!hub||!b)return;setCollapseIcon114(b,hub.classList.contains('ct113-f1-collapsed'));
}
function sportsStatsPanels114(root,main){
 return qa114('section.panel,.panel',root).filter(p=>p!==main&&(()=>{const h=norm114(q114('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'');const hasStats=Boolean(q114('.stats,.stat,[class*="stats-grid"],[class*="stat-grid"]',p));return hasStats&&(h.includes('estatisticas de esportes')||h.includes('estatisticas esportivas')||h==='esportes'||h.includes('esportes assistidos'))})());
}
function syncStats114(){
 const root=q114('[data-profile]');if(!root)return;const main=q114('.ct-r180-stats-panel',root),toggle=q114('[data-ct-r180-stats-toggle]',main);if(!main||!toggle)return;
 const body=q114('[data-ct-r180-stats-body]',main),collapsed=Boolean(body?.classList.contains('hidden'));setCollapseIcon114(toggle,collapsed);
 if(isAndroid114()){
  for(const b of qa114('button',root)){const t=norm114(b.textContent||'');if((t==='recolher'||t==='expandir'||t==='minimizar')&&b!==toggle)setCollapseIcon114(b,t!=='recolher')}
  return;
 }
 const sports=sportsStatsPanels114(root,main);main.dataset.ct114StatsGroup='main';
 for(const p of sports){p.dataset.ct114StatsGroup='sports';p.classList.toggle('ct114-stats-hidden',collapsed);for(const b of qa114('button',q114('.panel-head',p)||p)){const t=norm114(b.textContent||b.title||'');if(/recolher|expandir|minimizar/.test(t)){b.dataset.ct114OldSportsToggle='1';b.hidden=true}}}
 root.dataset.ct114StatsUnified=sports.length?'1':'0';
}

let syncTimer114=0;function schedule114(){clearTimeout(syncTimer114);syncTimer114=setTimeout(()=>{iconifyF1114();syncStats114()},20)}
document.addEventListener('click',ev=>{
 if(ev.target.closest?.('[data-ct113-f1-toggle],[data-ct-r180-stats-toggle]'))setTimeout(schedule114,0);
},true);
try{new MutationObserver(schedule114).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-expanded']})}catch{}
schedule114();

const st114=document.createElement('style');st114.id='ct-v114-ui';st114.textContent=`
.ct114-collapse-icon{box-sizing:border-box!important;display:inline-grid!important;place-items:center!important;width:28px!important;height:28px!important;min-width:28px!important;max-width:28px!important;padding:0!important;border-radius:999px!important;font-size:17px!important;line-height:1!important;font-weight:800!important;text-indent:0!important;white-space:nowrap!important;overflow:hidden!important}
[data-ct-r180-stats-toggle].ct114-collapse-icon span,[data-ct-r180-stats-toggle].ct114-collapse-icon b{display:contents!important}
[data-profile] [data-ct114-stats-group="sports"].ct114-stats-hidden>:not(.panel-head){display:none!important}
[data-profile] [data-ct114-old-sports-toggle]{display:none!important}
#ct-f1-v111 .ct114-collapse-icon{margin-left:auto!important;align-self:flex-start!important}
`;
document.getElementById(st114.id)?.remove();document.head.appendChild(st114);
window.__ctV114PrepareWatchPools=prepareWatchPools114;
window.__ctV114SyncStats=syncStats114;
})();
