/* CineTracker Web 1.0.55 r264 — stable Home watched controls, single Discover authority, F1-first Sports and generic detail rails. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR264)return;
window.__ctR264='home-watched-stable-discover-single-sports-order-detail-rails';
window.__ctR264Home='stable-tab+side-watched-episode-movie+canonical-mark-watch';
window.__ctR264Discover='single-nine-tabs+canonical-exclusions+local-rails+top10-streaming';
window.__ctR264Sports='f1-first-synchronous-order+watched-panel-persistent';
window.__ctR264Detail='generic-season-episode-chart-related-similar-cast-local-x';
window.__ctR264Horizontal='document-fixed+persistent-semantic-component-x';

const q264=(s,r=document)=>r?.querySelector?.(s)||null;
const qa264=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n264=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const norm264=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc264=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tmdb264=x=>n264(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);
const title264=x=>x?.media_title||x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'';
const day264=(d=new Date())=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}catch{return d.toISOString().slice(0,10)}};

/* ---------------------------------------------------------------------
   HOME — paintHome historically defaults to Series on every repaint. Preserve the actual user
   choice synchronously and own first-watch actions beside the row/card using the canonical RPC. */
let homeTab264='series',homeBusy264=false;
function currentHomeTab264(){
 const active=q264('[data-home] [data-home-tab].active');
 const from=String(active?.dataset?.homeTab||'');if(from==='series'||from==='movies')return from;
 const movie=q264('[data-home-view="movies"]'),series=q264('[data-home-view="series"]');
 if(movie&&!movie.classList.contains('hidden'))return'movies';if(series&&!series.classList.contains('hidden'))return'series';return homeTab264;
}
function applyHomeTab264(tab=homeTab264){
 const root=q264('[data-home]');if(!root)return false;tab=tab==='movies'?'movies':'series';homeTab264=tab;
 for(const b of qa264('[data-home-tab]',root)){const on=b.dataset.homeTab===tab;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')}
 for(const v of qa264('[data-home-view]',root)){const on=v.dataset.homeView===tab;v.classList.toggle('hidden',!on);v.hidden=!on}
 root.dataset.ct264HomeTab=tab;return true;
}
function pendingEpisode264(row){
 let ep=null;try{const pair=typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):null;ep=pair?.current||pair?.next||null}catch{}
 if(!ep)ep=row?._ct255NewRelease||row?.next_unwatched_episode||row?.next_episode||row?.current_episode||row?.latest_released_episode||row?.last_episode_to_air||null;
 const s=n264(ep?.season_number??ep?.season??ep?.s),e=n264(ep?.episode_number??ep?.episode??ep?.e);return s>0&&e>0?{...ep,season_number:s,episode_number:e}:null;
}
function legacyWatchButton264(node){if(!node)return false;const t=norm264(node.textContent);return /marcar como assistido|marcar assistido/.test(t)&&!node.matches('[data-ct264-watch]')}
function watchButton264(kind,tmdb,s=0,e=0,title=''){
 return `<button type="button" class="ct264-watch-btn" data-ct264-watch="${kind}" data-tmdb="${tmdb}"${s?` data-season="${s}"`:''}${e?` data-episode="${e}"`:''}${title?` data-title="${esc264(title)}"`:''}>✓ Marcar como assistido</button>`;
}
function wrapWatch264(rowEl,kind,tmdb,s=0,e=0,title=''){
 if(!rowEl||!tmdb||rowEl.closest('.ct264-home-action-row'))return false;
 const box=document.createElement('div');box.className='ct264-home-action-row';box.dataset.ct264HomeAction=kind;
 rowEl.parentNode?.insertBefore(box,rowEl);box.appendChild(rowEl);box.insertAdjacentHTML('beforeend',watchButton264(kind,tmdb,s,e,title));return true;
}
function enhanceHomeWatched264(){
 const root=q264('[data-home]');if(!root)return false;let changed=false;
 /* Remove only first-watch legacy buttons from the pending/watchlist sections; replay/history stays untouched. */
 for(const sec of qa264('[data-home-view] .home-section',root)){
  const head=norm264(q264('.panel-head h2,.panel-head h3,h2,h3',sec)?.textContent||'');
  const eligible=/assistir a seguir|juntando poeira|watchlist/.test(head)&&!/historico|vistos|concluid/.test(head);if(!eligible)continue;
  for(const b of qa264('button',sec))if(legacyWatchButton264(b)){b.remove();changed=true}
 }
 const seriesRows=Array.isArray(homeCache?.series)?homeCache.series:[];
 for(const sec of qa264('[data-home-view="series"] .home-section',root)){
  const head=norm264(q264('.panel-head h2,.panel-head h3,h2,h3',sec)?.textContent||'');if(!/assistir a seguir|juntando poeira/.test(head))continue;
  for(const el of qa264('.media-row[data-media^="tv:"]',sec)){
   const id=n264(String(el.dataset.media||'').split(':')[1]),row=seriesRows.find(x=>tmdb264(x)===id),ep=pendingEpisode264(row);if(!row||!ep)continue;
   changed=wrapWatch264(el,'episode',id,ep.season_number,ep.episode_number,title264(row))||changed;
  }
 }
 const movieSec=qa264('[data-home-view="movies"] .home-section',root).find(sec=>/assistir a seguir|watchlist/.test(norm264(q264('.panel-head h2,.panel-head h3,h2,h3',sec)?.textContent||'')));
 if(movieSec){for(const el of qa264('.ct255-home-movie-card,[data-media^="movie:"]',movieSec)){
   const media=el.matches('[data-media]')?el:q264('[data-media^="movie:"]',el),id=n264(String(media?.dataset?.media||el?.dataset?.media||'').split(':')[1]);if(!id)continue;
   changed=wrapWatch264(el,'movie',id,0,0,q264('b,strong',el)?.textContent||'')||changed;
 }}
 return changed;
}
async function refreshHome264(){
 const data=await rpc('cinetracker_home_live_v0997_r3',{p_today:day264()});homeCache=data||{};try{profileCache=null;discoverCache?.clear?.()}catch{};
 if(String(typeof route==='function'?route():'')==='home'&&typeof paintHome==='function')paintHome();
}
async function markHomeWatched264(btn){
 if(!btn||homeBusy264||btn.dataset.ct264Busy==='1')return;const kind=btn.dataset.ct264Watch,tmdb=n264(btn.dataset.tmdb),s=n264(btn.dataset.season),e=n264(btn.dataset.episode);if(!tmdb||!['movie','episode'].includes(kind)||(kind==='episode'&&(!s||!e)))return;
 homeBusy264=true;btn.dataset.ct264Busy='1';btn.disabled=true;const old=btn.textContent;btn.textContent='Salvando…';const keep=homeTab264;
 try{
  const media=await ensureMedia(kind==='episode'?'tv':'movie',tmdb);
  await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(media.id),p_item_type:kind,p_season_number:kind==='episode'?s:null,p_episode_number:kind==='episode'?e:null,p_title:btn.dataset.title||media.title||null,p_runtime_minutes:Number(media.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});
  await refreshHome264();homeTab264=keep;applyHomeTab264(keep);enhanceHomeWatched264();
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r264-home-watch',kind,tmdb,season:s,episode:e}}));
  for(const ms of[0,80,260])setTimeout(()=>{if(String(typeof route==='function'?route():'')==='home'){applyHomeTab264(keep);enhanceHomeWatched264()}},ms);
  try{toast('Marcado como assistido')}catch{}
 }catch(err){btn.textContent=old;btn.disabled=false;try{toast(err?.message||String(err))}catch{}}
 finally{homeBusy264=false;delete btn.dataset.ct264Busy}
}
const paintHome264Base=typeof paintHome==='function'?paintHome:null;
if(paintHome264Base)paintHome=function(...args){const keep=currentHomeTab264();const out=paintHome264Base.apply(this,args);homeTab264=keep;applyHomeTab264(keep);enhanceHomeWatched264();return out};

/* ---------------------------------------------------------------------
   DISCOVER — r263 stays the card/provider renderer; r264 owns uniqueness and prevents any
   inherited tab authority from coexisting with its canonical nine-tab bar. */
const D264=['Pra você','Top 10','Em alta','Populares','Novidades','Lançamentos','Mais Aguardados','Mais bem avaliados','Calendário'];
function cleanDiscover264(){
 const root=q264('[data-ct263-discover],[data-discover]');if(!root)return false;let changed=false;
 const canonical=q264('.ct263-discover-tabs',root);
 if(canonical){const seen=new Set();for(const b of qa264('button',canonical)){const k=norm264(b.textContent);if(seen.has(k)){b.remove();changed=true}else seen.add(k)}}
 for(const group of qa264('.tabs,.discover-tabs,.ct255-discover-tabs,.ct248-discover-tabs,.ct247-discover-tabs',root)){
  if(group===canonical||group.contains(canonical)||canonical?.contains(group))continue;const labels=qa264('button,a,[role="tab"]',group).map(x=>norm264(x.textContent));if(labels.includes('top 10')||labels.includes('lancamentos')){group.remove();changed=true}
 }
 if(canonical){const labels=qa264('button',canonical).map(x=>norm264(x.textContent));const expected=D264.map(norm264);if(labels.length!==9||expected.some((x,i)=>labels[i]!==x))canonical.dataset.ct264Invalid='1';else delete canonical.dataset.ct264Invalid}
 return changed;
}
const renderDiscover264Base=typeof renderDiscover==='function'?renderDiscover:null;
if(renderDiscover264Base)renderDiscover=async function(...args){const out=await renderDiscover264Base.apply(this,args);cleanDiscover264();markRails264(q264('[data-discover]')||document);return out};

/* ---------------------------------------------------------------------
   SPORTS — repair topology synchronously inside paintSports255 so the tab bar never has one
   frame above the F1 Hub. The r263 F1 watched panel is immediately reattached after repaint. */
function reorderSports264(){
 const root=q264('[data-ct255-sports],[data-sports]');if(!root)return false;const f1=q264('.ct255-f1hub',root),tabs=q264('.ct255-sports-tabs',root),filters=q264('.ct255-sport-filters',root),feed=q264('.ct255-sports-feed',root);if(!f1||!tabs||!feed)return false;let changed=false;
 if(root.firstElementChild!==f1){root.insertBefore(f1,root.firstElementChild);changed=true}if(f1.nextElementSibling!==tabs){f1.after(tabs);changed=true}if(filters&&tabs.nextElementSibling!==filters){tabs.after(filters);changed=true}const anchor=filters||tabs;if(anchor.nextElementSibling!==feed){anchor.after(feed);changed=true}root.dataset.ct264SportsOrder='f1-tabs-filters-feed';return changed;
}
function restoreF1Watch264(){try{const r=window.__ctR263EnhanceF1Watch?.(false);if(r?.catch)r.catch(()=>{})}catch{}}
try{if(typeof paintSports255==='function'){const base=paintSports255;paintSports255=function(...args){const out=base.apply(this,args);reorderSports264();queueMicrotask(restoreF1Watch264);return out}}}catch{}
const renderSports264Base=typeof renderSports==='function'?renderSports:null;
if(renderSports264Base)renderSports=async function(...args){const out=await renderSports264Base.apply(this,args);reorderSports264();restoreF1Watch264();markRails264(q264('[data-sports]')||document);return out};

/* ---------------------------------------------------------------------
   GENERIC DETAIL RAILS — all series, not title-specific. ChildList-only observer never invokes
   a renderer; it only marks containers that own horizontal overflow and repairs fixed topology. */
const RAIL264='.season-tabs,.season-list,.season-row,[data-seasons],.ct169-season-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct244-seasons-scroll,.ct244-chart-scroll,.episode-list,.episodes-list,.episodes-row,.episode-row,[data-episodes],[data-season-episodes],.related-scroll,.related-grid,.related-row,[data-related],.similar-scroll,.similar-grid,.similar-row,[data-similar],.cast-scroll,.cast-grid,.cast-row,[data-cast],.actors-scroll,.actors-grid,.actors-row,[data-actors],.people-scroll,.people-grid,.people-row,[data-people],.episode-graph,.graph-shell,.chart-wrap,.chart-scroll,[data-chart],[data-episode-chart],.cards-row,.rail,.ct263-media-rail,.ct255-f1-tabs,.ct255-f1-list,.ct255-f1-table,.ct255-sport-filters,.ct255-sports-tabs,.ct263-f1-watch-rail';
function semanticRails264(root=document){
 for(const section of qa264('section,.panel,[data-series-detail],[data-movie-detail]',root)){
  const head=norm264(q264('h2,h3,.section-title,.eyebrow',section)?.textContent||'');if(!/(temporad|episod|grafico|nota|relacionad|semelhant|atores|elenco|cast)/.test(head))continue;
  let best=null,overflow=0;for(const el of qa264('div,ul,ol',section).slice(0,100)){if(el.children.length<2)continue;let d=0;try{d=el.scrollWidth-el.clientWidth}catch{}if(d>overflow){overflow=d;best=el}}if(best&&overflow>4)best.classList.add('ct264-local-x');
 }
}
function markRails264(root=document){const scope=root?.querySelectorAll?root:document;for(const el of qa264(RAIL264,scope))el.classList.add('ct264-local-x');if(root?.matches?.(RAIL264))root.classList.add('ct264-local-x');semanticRails264(scope)}
function reconcile264(root=document){
 if(String(typeof route==='function'?route():'')==='home'){applyHomeTab264(homeTab264);enhanceHomeWatched264()}
 if(String(typeof route==='function'?route():'')==='discover')cleanDiscover264();
 if(String(typeof route==='function'?route():'')==='sports'){reorderSports264();restoreF1Watch264()}
 markRails264(root);
}
let raf264=0;const app264=q264('#app');if(app264&&window.MutationObserver){try{new MutationObserver(()=>{cancelAnimationFrame(raf264);raf264=requestAnimationFrame(()=>reconcile264(app264))}).observe(app264,{subtree:true,childList:true});window.__ctR264ObserverActive=true}catch{}}

document.addEventListener('click',e=>{
 const ht=e.target?.closest?.('[data-home-tab]');if(ht&&String(typeof route==='function'?route():'')==='home'){e.preventDefault();e.stopImmediatePropagation();homeTab264=ht.dataset.homeTab==='movies'?'movies':'series';applyHomeTab264(homeTab264);enhanceHomeWatched264();return}
 const w=e.target?.closest?.('[data-ct264-watch]');if(w){e.preventDefault();e.stopImmediatePropagation();void markHomeWatched264(w);return}
},true);
window.addEventListener('resize',()=>requestAnimationFrame(()=>reconcile264(q264('#app')||document)));
window.addEventListener('pageshow',()=>requestAnimationFrame(()=>reconcile264(q264('#app')||document)));
window.addEventListener('cinetracker:data-changed',()=>requestAnimationFrame(()=>reconcile264(q264('#app')||document)));
queueMicrotask(()=>reconcile264(app264||document));

window.__ctR264Test={currentHomeTab264,applyHomeTab264,pendingEpisode264,cleanDiscover264,reorderSports264,markRails264,semanticRails264};
})();
