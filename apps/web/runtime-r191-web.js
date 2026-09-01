/* r191 Web — remove r189 blocking route work; keep strict authority asynchronously */
(() => {
'use strict';
if(window.__ctR191WebLoaded)return;
window.__ctR191WebLoaded=true;
window.__ctR191Web='nonblocking-authority-alias-filter-actions';
window.__ctWebRevision='r191-nonblocking-authority';
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const rt=()=>{try{return String(route?.()||'').replace(/^\//,'')}catch{return String(location.pathname||'').replace(/^\//,'')||'home'}};
const mediaType=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'').toLowerCase()==='movie'?'movie':'tv';
const mediaId=x=>Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0);
const aliases=x=>{const r=x?.raw_tmdb||{};return[x?.title,x?.name,x?.original_title,x?.original_name,r?.title,r?.name,r?.original_title,r?.original_name].map(norm).filter(Boolean)};

/* r186 context is expensive. Once a valid snapshot exists, never block a route on its 15s TTL. */
let ctxRefresh=null;
if(typeof ct186Context==='function'){
  const base=ct186Context;
  ct186Context=async function(force=false){
    try{
      if(!force&&ct186ContextValue){
        if(Date.now()-Number(ct186ContextAt||0)>120000&&!ctxRefresh)ctxRefresh=Promise.resolve(base(true)).catch(()=>null).finally(()=>ctxRefresh=null);
        return ct186ContextValue;
      }
    }catch{}
    return base(force);
  };
}

/* Imported/synthetic history is refreshed in background only; it never blocks navigation. */
let rawHistoryAt=0,rawHistoryTask=null;
async function rawHistory(force=false){
  if(!force&&rawHistoryAt&&Date.now()-rawHistoryAt<120000)return;
  if(rawHistoryTask)return rawHistoryTask;
  rawHistoryTask=(async()=>{
    try{
      const base=typeof SUPABASE_URL!=='undefined'?SUPABASE_URL:window.SUPABASE_URL;if(!base)return;
      const res=await fetch(base+'/rest/v1/watch_history?select=item_type,title,media:media_id(tmdb_id,media_type,title,original_title,raw_tmdb)&order=watched_at.desc&limit=5000',{headers:{...(typeof authHeaders==='function'?authHeaders():{}),Accept:'application/json'}});if(!res.ok)return;
      const rows=await res.json(),c=ct186ContextValue;if(!c)return;
      for(const row of rows||[]){const m=row?.media||{},t=String(m.media_type||row.item_type||'').toLowerCase()==='movie'?'movie':'tv',id=Number(m.tmdb_id||0);if(id>0)(t==='movie'?c.historyMovieIds:c.historyTvIds)?.add?.(id);for(const v of [row.title,m.title,m.original_title,m.raw_tmdb?.title,m.raw_tmdb?.name,m.raw_tmdb?.original_title,m.raw_tmdb?.original_name]){const a=norm(v);if(a)c.historyAliases?.add?.(t+':'+a)}}
      rawHistoryAt=Date.now();
    }catch{}
  })().finally(()=>rawHistoryTask=null);return rawHistoryTask;
}
const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,650));idle(()=>void rawHistory(false),{timeout:1800});

/* Watchlist authority = IDs + all localized/original title aliases from r186 context. */
function inWatch(x){
  try{
    const c=ct186ContextValue,t=mediaType(x),id=mediaId(x);if(!c)return false;
    if(id>0&&(t==='movie'?c.watchMovieIds:c.watchTvIds)?.has?.(id))return true;
    return aliases(x).some(a=>c.watchAliases?.has?.(t+':'+a));
  }catch{return false}
}
function cardMedia(card){const act=q('[data-discover-watch]',card),[t,id]=String(act?.dataset?.discoverWatch||'').split(':');const title=q('.card-body b,.title,.card-title,h3,h4,b,strong',card)?.textContent||'';return{media_type:t==='movie'?'movie':'tv',id:Number(id||0),title}}
let repaintGuard=false;
function swap(card){const b=q('[data-ct166-swap]',card);if(!b)return false;const key=String(b.dataset.ct166Swap||'');if(!key)return false;try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1;return true}catch{return false}}
function fixForYou(){
  if(repaintGuard||rt()!=='discover'||String(discoverState?.tab||'foryou')!=='foryou')return;const root=q('[data-discover-content]')||q('[data-discover]');if(!root)return;
  let changed=false;repaintGuard=true;
  try{qa('section.panel,section.discover-section',root).forEach(sec=>{const h=norm(q('h2,h3',sec)?.textContent||'');
    if(h==='da sua watchlist')qa('[data-discover-watch]',sec).forEach(b=>{const ref=String(b.dataset.discoverWatch||'');b.removeAttribute('data-discover-watch');b.dataset.ct190Seen=ref;b.disabled=false;b.removeAttribute('aria-disabled');b.textContent='✓ Marcar visto'});
    if(h.includes('100 novos'))qa('.foryou-slot,.discover-card,.media-card,.card',sec).forEach(card=>{const m=cardMedia(card);if(m.id>0&&inWatch(m)&&swap(card))changed=true});
  })}finally{repaintGuard=false}
  if(changed){const d=(()=>{try{return ct186ForYouData||ct166ForYouData}catch{return null}})();if(d)requestAnimationFrame(()=>{try{paintDiscover(d)}catch{}})}
}
if(typeof paintDiscover==='function'){const base=paintDiscover;paintDiscover=function(d){const out=base(d);requestAnimationFrame(fixForYou);return out}}

/* Local first actions. No TMDB/RPC is needed to swap a card. */
window.addEventListener('click',e=>{
  if(rt()!=='discover'||String(discoverState?.tab||'foryou')!=='foryou')return;
  const sw=e.target.closest?.('[data-ct166-swap]');if(sw){e.preventDefault();e.stopImmediatePropagation();const key=String(sw.dataset.ct166Swap||'');try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1}catch{};try{paintDiscover(ct186ForYouData||ct166ForYouData)}catch{};return}
  const seen=e.target.closest?.('[data-ct190-seen]');if(seen){e.preventDefault();e.stopImmediatePropagation();const[type,id0]=String(seen.dataset.ct190Seen||'').split(':'),id=Number(id0||0);if(!(id>0)||seen.disabled)return;seen.disabled=true;seen.textContent='✓ Visto';const card=seen.closest('.foryou-slot,.card,.media-card,.discover-card');swap(card);try{paintDiscover(ct186ForYouData||ct166ForYouData)}catch{};void Promise.resolve(markSeen(type,id)).catch(err=>{try{toast(err?.message||String(err))}catch{}});return}
  const w=e.target.closest?.('[data-discover-watch]');if(w){e.preventDefault();e.stopImmediatePropagation();const[type,id0]=String(w.dataset.discoverWatch||'').split(':'),id=Number(id0||0);if(!(id>0)||w.disabled)return;w.disabled=true;w.textContent='✓ Salvando…';try{ct186Block(type,id)}catch{};const card=w.closest('.foryou-slot,.card,.media-card,.discover-card');swap(card);try{paintDiscover(ct186ForYouData||ct166ForYouData)}catch{};void Promise.resolve(addWatchlist(type,id)).catch(err=>{try{toast(err?.message||String(err))}catch{}});return}
},true);

/* Exact persisted state on movie/series details. */
function favoriteActive(type,id){try{const p=profileCache||window.__ct0997PreloadedProfile||{},rows=type==='movie'?p.favorite_movies:p.favorite_series;return Array.isArray(rows)&&rows.some(x=>Number(x?.tmdb_id||x?.id||0)===Number(id))}catch{return false}}
async function decorateDetail(){
  const root=q('.modal-card,.modal,.dialog,[role="dialog"],.detail-view,.media-detail');if(!root)return;let type='',id=0;
  for(const el of qa('[data-mark-seen],[data-watch],[data-favorite]',root)){const raw=el.dataset.markSeen||el.dataset.watch||el.dataset.favorite||'',m=String(raw).match(/^(movie|tv):(\d+)$/);if(m){type=m[1];id=Number(m[2]);break}}
  if(!id)return;let c=null;try{c=await ct186Context(false)}catch{}
  const seen=q(`[data-mark-seen="${type}:${id}"]`,root),watch=q(`[data-watch="${type}:${id}"]`,root),fav=q(`[data-favorite="${type}:${id}"]`,root);
  const s=Boolean((type==='movie'?c?.historyMovieIds:c?.historyTvIds)?.has?.(id));const w=Boolean((type==='movie'?c?.watchMovieIds:c?.watchTvIds)?.has?.(id));const f=favoriteActive(type,id);
  if(seen){seen.classList.toggle('ct191-seen',s);seen.setAttribute('aria-pressed',s?'true':'false');if(s){seen.textContent='✓ Visto';seen.disabled=true}}
  if(watch){watch.classList.toggle('ct191-watch',w);watch.setAttribute('aria-pressed',w?'true':'false');if(w){watch.textContent='✓ Na Watchlist';watch.disabled=true}}
  if(fav){fav.classList.toggle('ct191-fav',f);fav.setAttribute('aria-pressed',f?'true':'false');fav.textContent=f?'★ Favorito':'☆ Favoritar'}
}

/* Global media search stays visible everywhere except Sports. */
function searchVisibility(){const hide=rt()==='sports';try{if(topSearch)topSearch.style.display=hide?'none':''}catch{};for(const el of qa('[data-top-search],.top-search,#top-search,.global-search'))if(!el.closest?.('[data-sports]'))el.style.display=hide?'none':''}

/* Preserve the Home landing anchor without network work. */
let homeRun=0;function homeAnchor(){if(rt()!=='home')return;const run=++homeRun,pin=()=>{if(run!==homeRun||rt()!=='home')return;const target=q('.ct992-start,[data-ct992-start],[data-home-next],#assistir-a-seguir');if(target){const top=Math.max(0,target.getBoundingClientRect().top+(scrollY||0)-12);scrollTo({top,behavior:'auto'})}};[0,80,220,520,900].forEach(ms=>setTimeout(pin,ms))}

let timer=0;function decorate(){searchVisibility();fixForYou();void decorateDetail();if(rt()==='home')homeAnchor()}
const mo=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(decorate,45)});mo.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('popstate',()=>setTimeout(decorate,0));window.addEventListener('hashchange',()=>setTimeout(decorate,0));window.addEventListener('pageshow',()=>setTimeout(decorate,20));window.addEventListener('cinetracker:data-changed',()=>{rawHistoryAt=0;void rawHistory(true);setTimeout(()=>void decorateDetail(),30)});setTimeout(decorate,30);
const style=document.createElement('style');style.id='ct191-style';style.textContent=`.ct191-fav{border-color:#ef4444!important;background:rgba(239,68,68,.16)!important;color:#fca5a5!important}.ct191-seen{border-color:#22c55e!important;background:rgba(34,197,94,.16)!important;color:#86efac!important}.ct191-watch{border-color:#a855f7!important;background:rgba(168,85,247,.18)!important;color:#d8b4fe!important}`;document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
