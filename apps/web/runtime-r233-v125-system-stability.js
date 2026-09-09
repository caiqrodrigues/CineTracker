/* CineTracker Web 1.0.25 r233 — single event-driven authority for Home, Discover, Sports and Watchlist. */
(()=>{
'use strict';
if(window.__ctR233V125)return;
window.__ctR233V125='system-stability-event-driven-no-competing-observers';
window.__ctV125Home='live-episode-revalidation';
window.__ctV125Discover='event-driven-single-normalizer';
window.__ctV125Sports='event-driven-single-action-authority';
window.__ctV125Watchlist='full-rows-no-tmdb-drop';
window.__ctV125NoPolling='no-700ms-no-discover-mutation-observers';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm233=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc233=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n233=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const mediaType233=x=>{try{return mediaType(x)==='movie'?'movie':'tv'}catch{return String(x?.media_type||x?.type||'').toLowerCase()==='movie'?'movie':'tv'}};
const mediaId233=x=>{try{return n233(mediaTmdb(x)||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id)}catch{return n233(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.id)}};
const mediaTitle233=x=>String(x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const mediaYear233=x=>n233(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||x?.release_year||'').slice(0,4));
const localDay233=()=>{try{return localDay()}catch{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}};
window.__ctV125Normalize=norm233;

/* ---------- Discover: one event-driven finalizer, no DOM polling ---------- */
let discoverQueued=false;
function discoverAction233(el){
 const raw=String(el?.textContent||'').trim(),t=norm233(raw),aria=norm233(el?.getAttribute?.('aria-label')||''),title=norm233(el?.title||'');
 if(raw==='↻'||t.includes('trocar')||aria.includes('trocar')||title.includes('trocar'))return'swap';
 if(raw==='+'||raw==='＋'||t.includes('watchlist')||aria.includes('watchlist')||title.includes('watchlist'))return'watch';
 return'';
}
function discoverCard233(el,root){
 let c=el?.closest?.('article,.card,.media-card,.discover-card,.ct124-card,.ct122-media-card');
 if(c&&root.contains(c))return c;
 let p=el?.parentElement;for(let i=0;p&&p!==root&&i<6;i++,p=p.parentElement){if(qa('img,.poster,[class*="poster"]',p).length===1)return p}return null;
}
function normalizeDiscover233(){
 const root=q('[data-page="discover"],[data-discover]');if(!root)return;
 for(const el of qa('small,p,span,div',root)){
  if(el.childElementCount)continue;const t=norm233(el.textContent||'');
  if(t.startsWith('regra ativa')||t.includes('baseado nos seus vistos e favoritos')||t.includes('prioridade pelo seu gosto')||t.includes('respeita historico progresso e watchlist'))el.remove();
 }
 const loose=[];
 for(const b of qa('button,a',root)){
  const kind=discoverAction233(b);if(!kind)continue;const card=discoverCard233(b,root);if(!card){loose.push([b,kind]);continue}
  card.classList.add('ct125-media-card','ct124-card','ct122-media-card');
  let bar=q(':scope > .ct125-media-actions',card);if(!bar){bar=document.createElement('div');bar.className='ct125-media-actions ct122-media-actions';card.appendChild(bar)}
  const same=qa('button,a',card).filter(x=>x!==b&&discoverAction233(x)===kind);for(const x of same)x.remove();
  b.classList.add('ct125-media-action','ct122-media-action');b.textContent=kind==='watch'?'＋':'↻';b.setAttribute('aria-label',kind==='watch'?'Adicionar à Watchlist':'Trocar');b.title=kind==='watch'?'Adicionar à Watchlist':'Trocar';if(b.parentElement!==bar)bar.appendChild(b);
 }
 for(const [b,kind] of loose){
  const cards=qa('article,.card,.media-card,.discover-card,.ct124-card,.ct122-media-card',root).filter(c=>qa('img,.poster,[class*="poster"]',c).length===1&&!qa('button,a',c).some(x=>discoverAction233(x)===kind));
  const card=cards[0];if(!card)continue;let bar=q(':scope > .ct125-media-actions,:scope > .ct122-media-actions',card);if(!bar){bar=document.createElement('div');bar.className='ct125-media-actions ct122-media-actions';card.appendChild(bar)}bar.appendChild(b);b.classList.add('ct125-media-action','ct122-media-action');b.textContent=kind==='watch'?'＋':'↻';b.setAttribute('aria-label',kind==='watch'?'Adicionar à Watchlist':'Trocar');b.title=kind==='watch'?'Adicionar à Watchlist':'Trocar';
 }
 try{window.__ctV122MetadataRun?.()}catch{}
 root.dataset.ct125Discover='stable';
}
function queueDiscover233(){if(discoverQueued)return;discoverQueued=true;requestAnimationFrame(()=>{discoverQueued=false;normalizeDiscover233()})}
try{const base=paintDiscover;paintDiscover=function(...args){const out=base.apply(this,args);queueDiscover233();return out}}catch{}
try{const base=renderDiscover;renderDiscover=async function(...args){const out=await base.apply(this,args);queueDiscover233();return out}}catch{}

/* ---------- Sports: canonical direct-child cards only after real paint ---------- */
function sportAction233(el){
 const s=norm233(`${el?.textContent||''} ${el?.getAttribute?.('aria-label')||''} ${el?.title||''}`).replace(/\s+/g,'');
 if(el?.hasAttribute?.('data-ct165-open-favorite')||s==='eventos'||s==='vereventos'||s.includes('vereventos'))return'events';
 if(s.includes('desmarcarcomoassistido')||s.includes('desmarcarassistido'))return'watched-off';
 if(s.includes('marcarcomoassistido')||s.includes('marcarassistido')||s==='assistido'||s.includes('assistido'))return'watched-on';
 return'';
}
function canonicalSportsCard233(card){
 if(!card||card.dataset.ct125Busy==='1')return;card.dataset.ct125Busy='1';
 try{
  card.classList.add('ct123-sports-card','ct125-sports-card');
  const controls=qa('button,a,[role="button"],.btn,.chip,[class*="chip"]',card).filter(x=>!x.closest('.ct125-actions'));
  const pick=kind=>controls.filter(x=>kind==='events'?sportAction233(x)==='events':/^watched-/.test(sportAction233(x))).sort((a,b)=>{const score=x=>{let z=(x.tagName==='BUTTON'||x.tagName==='A')?20:0;const t=norm233(x.textContent||'');if(kind==='events'&&t==='ver eventos')z+=80;if(kind!=='events'&&(t.includes('marcar como assistido')||t.includes('desmarcar como assistido')))z+=80;return z};return score(b)-score(a)})[0]||null;
  let eventBtn=pick('events'),watchBtn=pick('watched');const watchedOff=watchBtn&&sportAction233(watchBtn)==='watched-off';
  for(const x of controls){const k=sportAction233(x);if((k==='events'&&x!==eventBtn)||(/^watched-/.test(k)&&x!==watchBtn))x.remove()}
  for(const old of qa(':scope > .ct123-actions,:scope > .ct122-actions,:scope > .ct121-actions,:scope > .ct120-sport-actions,:scope > .ct119-sport-actions,:scope > .ct117-event-actions',card)){
   for(const x of [...old.children]){const k=sportAction233(x);if(k==='events'&&!eventBtn)eventBtn=x;if(/^watched-/.test(k)&&!watchBtn)watchBtn=x}old.remove();
  }
  let bar=q(':scope > .ct125-actions',card);if(!bar){bar=document.createElement('div');bar.className='ct125-actions ct123-actions';card.appendChild(bar)}
  for(const [raw,kind] of [[eventBtn,'events'],[watchBtn,'watched']]){let el=raw;if(!el)continue;if(el.tagName!=='BUTTON'&&el.tagName!=='A'){const b=document.createElement('button');b.type='button';for(const a of [...el.attributes])if(!['class','role'].includes(a.name))b.setAttribute(a.name,a.value);el.replaceWith(b);el=b}el.className=`ct125-action ct123-action ${kind==='watched'?'primary':'secondary'}`;el.textContent=kind==='events'?'Eventos':(watchedOff?'↶ Desmarcar':'✓ Assistido');if(el.parentElement!==bar)bar.appendChild(el)}
  if(!bar.children.length)bar.remove();
 }finally{delete card.dataset.ct125Busy}
}
function normalizeSports233(){const root=q('[data-sports]');if(!root)return;for(const grid of qa('.event-grid',root)){grid.classList.add('ct123-grid','ct125-grid');for(const card of [...grid.children])canonicalSportsCard233(card)}root.dataset.ct125Sports='stable'}
let sportsQueued=false;function queueSports233(){if(sportsQueued)return;sportsQueued=true;requestAnimationFrame(()=>{sportsQueued=false;normalizeSports233()})}
try{const base=paintSports;paintSports=function(...args){const out=base.apply(this,args);queueSports233();return out}}catch{}
try{const base=renderSports;renderSports=async function(...args){const out=await base.apply(this,args);queueSports233();return out}}catch{}

/* ---------- Home: live TMDB release revalidation for "Em dia" ---------- */
const homeValidation=new Map();let homeValidationTask=null;
function releasedCount233(detail,latest){
 if(!(latest?.season_number>0&&latest?.episode_number>0))return 0;let total=0;
 for(const s of detail?.seasons||[]){const sn=n233(s?.season_number);if(sn<=0)continue;if(sn<latest.season_number)total+=Math.max(0,n233(s?.episode_count));else if(sn===latest.season_number)total+=Math.max(0,n233(latest.episode_number))}return total;
}
function caughtByPosition233(row,latest,released){const ls=n233(row?.last_season_number),le=n233(row?.last_episode_number);if(ls>0&&latest?.season_number>0)return ls>latest.season_number||(ls===latest.season_number&&le>=latest.episode_number);return released>0&&n233(row?.watched_episodes)>=released}
async function validateSeries233(row,day){
 const id=mediaId233(row);if(!(id>0))return false;const key=`${day}:${id}`;let detail=homeValidation.get(key);
 if(!detail){detail=await safeTmdb(`/tv/${id}`,{}).catch(()=>null);if(detail)homeValidation.set(key,detail)}if(!detail)return false;
 const latest=detail.last_episode_to_air;const air=String(latest?.air_date||'').slice(0,10);if(!(n233(latest?.season_number)>0&&n233(latest?.episode_number)>0)||!air||air>day)return false;
 const released=releasedCount233(detail,latest),caught=caughtByPosition233(row,latest,released);let changed=false;
 if(n233(row.latest_released_season_number)!==n233(latest.season_number)){row.latest_released_season_number=n233(latest.season_number);changed=true}
 if(n233(row.latest_released_episode_number)!==n233(latest.episode_number)){row.latest_released_episode_number=n233(latest.episode_number);changed=true}
 if(released>0&&n233(row.released_episodes)!==released){row.released_episodes=released;changed=true}
 if(n233(detail.number_of_episodes)>n233(row.total_episodes)){row.total_episodes=n233(detail.number_of_episodes);changed=true}
 if(Boolean(row.is_caught_up)!==caught){row.is_caught_up=caught;changed=true}
 if(!caught&&row.home_bucket==='up_to_date'){row.home_bucket='continue';row.history_missing_episodes=Math.max(1,released-n233(row.watched_episodes));changed=true}
 return changed;
}
async function revalidateHome233(){
 if(homeValidationTask)return homeValidationTask;const rows=Array.isArray(homeCache?.series)?homeCache.series:[],day=localDay233(),targets=rows.filter(x=>x?.home_bucket==='up_to_date'||x?.is_caught_up);if(!targets.length)return false;
 homeValidationTask=(async()=>{let changed=false,index=0;const worker=async()=>{while(index<targets.length){const row=targets[index++];try{if(await validateSeries233(row,day))changed=true}catch{}}};await Promise.all(Array.from({length:Math.min(4,targets.length)},worker));if(changed&&String(location.pathname||'').startsWith('/home'))try{paintHome()}catch{}return changed})().finally(()=>{homeValidationTask=null});return homeValidationTask;
}
try{const base=renderHome;renderHome=async function(...args){const out=await base.apply(this,args);await revalidateHome233().catch(()=>{});return out}}catch{}

/* ---------- Watchlist: full RPC rows, including entries without TMDB id ---------- */
let wlCache233=null,wlAt233=0,wlTask233=null;
async function watchlistData233(force=false){if(!force&&wlCache233&&Date.now()-wlAt233<45000)return wlCache233;if(wlTask233)return wlTask233;wlTask233=Promise.resolve().then(()=>typeof window.__ctV121FullWatchlist==='function'?window.__ctV121FullWatchlist(force):rpc('cinetracker_watchlist_full_v119',{})).then(d=>{wlCache233=d||{rows:[]};wlAt233=Date.now();return wlCache233}).finally(()=>wlTask233=null);return wlTask233}
function watchRows233(d,kind){return (Array.isArray(d?.rows)?d.rows:[]).filter(x=>kind==='movie'?mediaType233(x)==='movie':mediaType233(x)==='tv')}
const added233=x=>Date.parse(x?.added_at||x?.created_at||x?.updated_at||0)||0;
function sortWatch233(rows,mode){const a=[...rows],az=(x,y)=>mediaTitle233(x).localeCompare(mediaTitle233(y),'pt-BR',{numeric:true,sensitivity:'base'});if(mode==='release_desc')return a.sort((x,y)=>mediaYear233(y)-mediaYear233(x)||az(x,y));if(mode==='release_asc')return a.sort((x,y)=>mediaYear233(x)-mediaYear233(y)||az(x,y));if(mode==='added_desc')return a.sort((x,y)=>added233(y)-added233(x)||az(x,y));return a.sort(az)}
function poster233(x){let p=x?.poster_path||x?.raw_tmdb?.poster_path||'';if(!p)return'';if(/^https?:/i.test(p))return p;try{return img(p,'w185')}catch{return`https://image.tmdb.org/t/p/w185${String(p).startsWith('/')?'':'/'}${p}`}}
function watchRow233(x){const type=mediaType233(x),id=mediaId233(x),t=mediaTitle233(x),y=mediaYear233(x),p=poster233(x),inner=`${p?`<img src="${esc233(p)}" alt="" loading="lazy">`:'<span class="ct125-poster-empty"></span>'}<span><b>${esc233(t)}</b><small>${y||'Sem ano'}${id>0?'':' · registro local'}</small></span><i>${id>0?'›':'•'}</i>`;return id>0?`<button type="button" class="ct125-watch-row ct122-watch-row" data-ct125-media="${type}:${id}">${inner}</button>`:`<div class="ct125-watch-row ct122-watch-row ct125-local-row">${inner}</div>`}
function paintWatchModal233(m,kind,mode){const rows=sortWatch233(watchRows233(m.__data,kind),mode);q('[data-ct125-count]',m).textContent=rows.length.toLocaleString('pt-BR');q('[data-ct125-list]',m).innerHTML=rows.length?rows.map(watchRow233).join(''):'<div class="empty">Nenhum item nessa Watchlist.</div>'}
async function syncWatchlistStats233(force=false){const root=q('[data-profile]');if(!root)return null;let d;try{d=await watchlistData233(force)}catch{return null}for(const el of qa('.stat,button.stat',root)){const label=norm233(q('small',el)?.textContent||'');const kind=label==='filmes watchlist'?'movie':label==='series watchlist'?'series':'';if(!kind)continue;for(const a of [...el.attributes].map(a=>a.name))if(/^data-ct(?:117|118|119|120|121|122|124)-watchlist/.test(a)||a==='data-ct119-count')el.removeAttribute(a);el.dataset.ct125Watchlist=kind;el.setAttribute('type','button');const b=q('b',el);if(b)b.textContent=watchRows233(d,kind).length.toLocaleString('pt-BR')}return d}
async function openWatchlist233(kind){q('[data-ct125-modal]')?.remove();const m=document.createElement('div');m.className='ct122-modal ct125-modal';m.dataset.ct125Modal=kind;m.innerHTML=`<div class="ct122-dialog"><header><h2>${kind==='movie'?'Filmes':'Séries'} na Watchlist · <span data-ct125-count>…</span></h2><button type="button" data-ct125-close>×</button></header><div class="ct122-toolbar"><select data-ct125-sort><option value="alpha">Alfabética</option><option value="release_desc">Mais recente lançada</option><option value="release_asc">Mais antigo lançado</option><option value="added_desc">Mais recente adicionada</option></select></div><div class="ct122-list" data-ct125-list>Carregando…</div></div>`;document.body.appendChild(m);try{m.__data=await watchlistData233(true);paintWatchModal233(m,kind,'alpha');await syncWatchlistStats233(false)}catch{q('[data-ct125-list]',m).textContent='Não foi possível carregar a Watchlist.'}return m}
try{const base=renderProfile;renderProfile=async function(...args){const out=await base.apply(this,args);await syncWatchlistStats233(false);return out}}catch{}
document.addEventListener('click',e=>{const s=e.target.closest?.('[data-ct125-watchlist]');if(s){e.preventDefault();e.stopImmediatePropagation();void openWatchlist233(s.dataset.ct125Watchlist);return}if(e.target.closest?.('[data-ct125-close]')){e.preventDefault();e.stopImmediatePropagation();q('[data-ct125-modal]')?.remove();return}const r=e.target.closest?.('[data-ct125-media]');if(r){e.preventDefault();e.stopImmediatePropagation();const [t,id]=String(r.dataset.ct125Media||'').split(':');q('[data-ct125-modal]')?.remove();if(n233(id)>0){try{go(`/${t==='movie'?'movie':'series'}/${n233(id)}`)}catch{location.href=`/${t==='movie'?'movie':'series'}/${n233(id)}`}}}},true);
document.addEventListener('change',e=>{const s=e.target.closest?.('[data-ct125-sort]');if(!s)return;const m=s.closest('[data-ct125-modal]');if(m?.__data)paintWatchModal233(m,m.dataset.ct125Modal,s.value)},true);
window.addEventListener('cinetracker:data-changed',()=>{wlCache233=null;wlAt233=0;homeValidation.clear();if(String(location.pathname||'').startsWith('/profile'))void syncWatchlistStats233(true);if(String(location.pathname||'').startsWith('/home'))void revalidateHome233()});

/* one boot pass; all subsequent runs are tied to application render/paint events. */
queueDiscover233();queueSports233();if(String(location.pathname||'').startsWith('/profile'))void syncWatchlistStats233(false);if(String(location.pathname||'').startsWith('/home'))void revalidateHome233();

const st=document.createElement('style');st.id='ct-v125-system-stability';st.textContent=`
.ct125-media-card{display:flex!important;flex-direction:column!important;min-width:0!important}.ct125-media-actions{margin-top:auto!important;display:flex!important;gap:8px!important;padding:10px!important}.ct125-media-action{width:36px!important;height:36px!important;min-width:36px!important;padding:0!important;display:grid!important;place-items:center!important}.ct125-actions{margin-top:auto!important;padding-top:10px!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.ct125-action{width:100%!important;min-width:0!important;height:38px!important;display:flex!important;align-items:center!important;justify-content:center!important}.ct125-watch-row{display:grid!important;grid-template-columns:52px minmax(0,1fr) 18px!important;gap:10px!important;align-items:center!important}.ct125-watch-row img,.ct125-poster-empty{width:52px!important;height:78px!important;object-fit:cover!important}.ct125-local-row{opacity:.86}
`;document.getElementById(st.id)?.remove();document.head.appendChild(st);
window.__ctV125NormalizeDiscover=normalizeDiscover233;window.__ctV125NormalizeSports=normalizeSports233;window.__ctV125RevalidateHome=revalidateHome233;window.__ctV125WatchRows=watchRows233;window.__ctV125SyncWatchlist=syncWatchlistStats233;window.__ctV125OpenWatchlist=openWatchlist233;
})();
