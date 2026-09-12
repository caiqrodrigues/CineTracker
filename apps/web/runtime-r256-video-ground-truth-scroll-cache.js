/* CineTracker Web 1.0.47 r256 — user-video ground truth: Home frontier, persistent local rails, Discover geometry, Sports order, unified Profile collapse and instant cached returns. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR256)return;
window.__ctR256='video-ground-truth-scroll-discover-sports-profile-cache';
window.__ctR256Home='missing-wins-caught-up+live-frontier+stale-while-revalidate';
window.__ctR256Discover='r255-data+forced-visible-card-geometry+route-snapshot';
window.__ctR256Sports='f1-first-then-global-filters+route-snapshot';
window.__ctR256Profile='single-collapse-media-and-sports+route-snapshot';
window.__ctR256Horizontal='persistent-childlist-episode-season-chart-related-cast';
window.__ctR256Navigation='instant-top-page-snapshots+home-stale-while-revalidate';

const q256=(s,r=document)=>r?.querySelector?.(s)||null;
const qa256=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n256=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const norm256=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const DAY256=86400000;
function day256(d=new Date()){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}catch{return d.toISOString().slice(0,10)}}
const timeout256=(p,ms,fallback=null)=>Promise.race([Promise.resolve(p),new Promise(r=>setTimeout(()=>r(fallback),ms))]);
const TOP256=new Set(['home','discover','sports','profile','configs']);
const snapshots256=new Map();
function app256(){return q256('#app')}
function validSnapshot256(key,s){if(!s||!s.html||Date.now()-s.at>180000)return false;if(key==='discover'&&!/ct255-media-card|ct255-discover-block/.test(s.html))return false;if(key==='sports'&&!/ct255-f1hub/.test(s.html))return false;if(key==='profile'&&!/data-profile/.test(s.html))return false;return true}
function remember256(key=route()){if(!TOP256.has(key))return;const a=app256();if(!a?.innerHTML||!q256(`.app[data-page="${key}"]`,a))return;snapshots256.set(key,{html:a.innerHTML,at:Date.now()})}
function restore256(key,ttl=90000){const s=snapshots256.get(key);if(!s||Date.now()-s.at>ttl||!validSnapshot256(key,s))return false;const a=app256();if(!a)return false;a.innerHTML=s.html;requestAnimationFrame(()=>{markRails256(a);if(key==='sports')reorderSports256();if(key==='profile')syncProfileCollapse256()});return true}
function scheduleRemember256(key){for(const ms of[0,180,900,2200])setTimeout(()=>{if(route()===key)remember256(key)},ms)}
const baseGo256=typeof go==='function'?go:null;
if(baseGo256)go=function(){try{remember256(route())}catch(_){}return baseGo256.apply(this,arguments)};

/* HOME — the video proves a row can say is_caught_up while also carrying real missing
   episodes. For ordinary series, a real missing count wins that contradiction. Legacy
   weekly/event series keep frontier semantics so historical holes never manufacture backlog. */
const LEGACY256=/(^|\s)(raw|wwe)(\s|$)|smackdown|formula 1|formula one|super bowl/i;
function title256(x){return x?.media_title||x?.title||x?.name||''}
function legacy256(x){return LEGACY256.test(norm256(title256(x)))}
function ep256(x){const s=n256(x?.season_number??x?.season??x?.s),e=n256(x?.episode_number??x?.episode??x?.e);return s>0&&e>0?s*100000+e:0}
function watchedFrontier256(r){return Math.max(ep256({season_number:r?.last_season_number,episode_number:r?.last_episode_number}),ep256({season_number:r?.last_season,episode_number:r?.last_episode}),ep256({season_number:r?.last_watched_season,episode_number:r?.last_watched_episode}),ep256(r?.last_watched_episode_data),ep256(r?.progress_episode))}
function releasedFrontier256(r){return Math.max(ep256({season_number:r?.latest_released_season_number,episode_number:r?.latest_released_episode_number}),ep256({season_number:r?.last_released_season_number,episode_number:r?.last_released_episode_number}),ep256(r?.latest_released_episode),ep256(r?.last_episode_to_air))}
function recentWatch256(r){const d=new Date(r?.last_watched_at||0);return !Number.isFinite(d.getTime())||d.getTime()<=0||Date.now()-d.getTime()<=30*DAY256}
function setPending256(r,recent=true){r.home_bucket=recent?'continue':'dust';r.is_caught_up=false;r.history_missing_episodes=Math.max(1,n256(r.history_missing_episodes));return r}
function setCaught256(r,status=''){const ended=/ended|canceled|cancelled/.test(norm256(status||r?.status||r?.series_status));r.home_bucket=ended?'completed':'up_to_date';r.is_caught_up=true;r.history_missing_episodes=0;return r}
function normalizeHomeRow256(r){if(!r||n256(r.watched_episodes)<=0)return r;if(legacy256(r))return r;const missing=n256(r.history_missing_episodes),rf=releasedFrontier256(r),wf=watchedFrontier256(r),bucket=String(r.home_bucket||'');if(missing>0&&(bucket==='up_to_date'||r.is_caught_up===true)){setPending256(r,recentWatch256(r));return r}if(rf>0&&wf>0&&rf>wf&&(bucket==='up_to_date'||r.is_caught_up===true)){setPending256(r,recentWatch256(r));return r}return r}
function normalizeHome256(p){for(const r of p?.series||[])normalizeHomeRow256(r);return p||{}}
function tmdbId256(r){return n256(r?.tmdb_id||r?.source_tmdb_id||r?.raw_tmdb?.source_tmdb_id||r?.raw_tmdb?.id)}
function actualLive256(d){const e=d?.last_episode_to_air;if(!e)return null;const ds=String(e.air_date||'').slice(0,10);return ds&&ds<=day256()?e:null}
function airedRecent256(e){const d=new Date(`${String(e?.air_date||'').slice(0,10)}T12:00:00`);return Number.isFinite(d.getTime())&&Date.now()-d.getTime()<=30*DAY256}
const liveDetail256=new Map();
async function detail256(r){const id=tmdbId256(r);if(id<=0)return null;const old=liveDetail256.get(id);if(old&&Date.now()-old.at<300000)return old.data;const d=await timeout256(tmdb(`/tv/${id}`),6000,null);if(d)liveDetail256.set(id,{data:d,at:Date.now()});return d}
let auditToken256=0;
async function auditHome256(){const token=++auditToken256,rows=(homeCache?.series||[]).filter(r=>tmdbId256(r)>0&&n256(r.watched_episodes)>0),before=rows.map(r=>`${r.home_bucket}|${r.is_caught_up}|${r.history_missing_episodes}`).join('§');let i=0;async function worker(){while(i<rows.length){if(token!==auditToken256)return;const r=rows[i++];try{const d=await detail256(r),live=actualLive256(d),lp=ep256(live),wf=watchedFrontier256(r);if(!live||!lp||!wf)continue;r.latest_released_season_number=n256(live.season_number);r.latest_released_episode_number=n256(live.episode_number);if(legacy256(r)){if(lp>wf)setPending256(r,airedRecent256(live));else setCaught256(r,d?.status);continue}if(lp>wf)setPending256(r,airedRecent256(live)||recentWatch256(r));else if(n256(r.history_missing_episodes)<=0)setCaught256(r,d?.status)}catch(_){}}
}
await Promise.all(Array.from({length:Math.min(5,Math.max(1,rows.length))},worker));if(token!==auditToken256)return;const after=rows.map(r=>`${r.home_bucket}|${r.is_caught_up}|${r.history_missing_episodes}`).join('§');if(before!==after&&route()==='home'){paintHome();markRails256(q256('[data-home]')||document);remember256('home')}}
let homeFetchedAt256=0,homeFetch256=null;
async function fetchHome256(){if(homeFetch256)return homeFetch256;homeFetch256=rpc('cinetracker_home_live_v0997_r3',{p_today:day256()}).then(d=>{homeCache=normalizeHome256(d||{});homeFetchedAt256=Date.now();return homeCache}).finally(()=>{homeFetch256=null});return homeFetch256}
renderHome=async function(seq){
 if(restore256('home',120000)){void auditHome256();return}
 const had=!!(homeCache&&Array.isArray(homeCache.series));
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home',`<div class="page" data-home>${had?'':loading('Carregando Home...')}</div>`));
 if(had){normalizeHome256(homeCache);paintHome();markRails256(q256('[data-home]')||document);scheduleRemember256('home')}
 const fresh=had&&homeFetchedAt256>0&&Date.now()-homeFetchedAt256<120000;
 if(fresh){void auditHome256();return}
 const work=fetchHome256();
 if(had){void work.then(()=>{if(seq===navSeq&&route()==='home'){paintHome();markRails256(q256('[data-home]')||document);remember256('home');void auditHome256()}}).catch(()=>{});return}
 try{await work;if(seq!==navSeq||route()!=='home')return;paintHome();markRails256(q256('[data-home]')||document);remember256('home');void auditHome256()}catch(e){if(seq!==navSeq)return;const h=q256('[data-home]');if(h)h.innerHTML=fail(`Falha ao carregar Home: ${e?.message||e}`,'home')}
};

/* Top-level page snapshots: leaving a loaded page keeps its complete DOM for an instant
   return. Network refresh happens only after the short freshness window or a data-change. */
const baseDiscover256=renderDiscover;
renderDiscover=async function(seq){if(restore256('discover',90000))return;const out=await baseDiscover256(seq);scheduleRemember256('discover');return out};
const baseSports256=renderSports;
renderSports=async function(seq){if(restore256('sports',45000)){reorderSports256();return}const out=await baseSports256(seq);if(seq===navSeq&&route()==='sports'){reorderSports256();remember256('sports')}return out};
const baseProfile256=renderProfile;
renderProfile=async function(seq){if(restore256('profile',60000)){syncProfileCollapse256();return}const out=await baseProfile256(seq);if(seq===navSeq&&route()==='profile'){syncProfileCollapse256();scheduleRemember256('profile')}return out};

/* SPORTS — the whole F1 Hub comes first. Only after it come the five global filters,
   sport chips and event feed. Reorder also runs after r255 paints caused by filter clicks. */
function reorderSports256(){const root=q256('[data-ct255-sports]');if(!root)return false;const f1=q256('.ct255-f1hub',root),tabs=q256('.ct255-sports-tabs',root),filters=q256('.ct255-sport-filters',root),feed=q256('.ct255-sports-feed',root);if(!f1||!tabs||!feed)return false;let changed=false;if(root.firstElementChild!==f1){root.insertBefore(f1,root.firstElementChild);changed=true}if(f1.nextElementSibling!==tabs){f1.after(tabs);changed=true}if(filters&&tabs.nextElementSibling!==filters){tabs.after(filters);changed=true}const anchor=filters||tabs;if(anchor.nextElementSibling!==feed){anchor.after(feed);changed=true}if(changed&&route()==='sports')requestAnimationFrame(()=>remember256('sports'));return changed}

/* PROFILE — the existing Estatísticas Recolher/Expandir control owns the sports stats too. */
function panelHeading256(p){return norm256(q256('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'')}
function syncProfileCollapse256(){const root=q256('[data-profile]');if(!root)return false;const panels=qa256('section.panel,.panel',root),stats=panels.find(p=>panelHeading256(p)==='estatisticas'),sports=panels.find(p=>panelHeading256(p).startsWith('esportes assistidos'));if(!stats||!sports)return false;const btn=qa256('button',stats).find(b=>/recolher|expandir/.test(norm256(b.textContent)))||q256('[data-stats-toggle],[aria-expanded]',stats);if(!btn)return false;const txt=norm256(btn.textContent),collapsed=txt.includes('expandir')||btn.getAttribute('aria-expanded')==='false'||stats.classList.contains('collapsed');sports.dataset.ct256ProfileSports='1';sports.classList.toggle('ct256-stats-collapsed',collapsed);sports.setAttribute('aria-hidden',collapsed?'true':'false');return true}

document.addEventListener('click',e=>{const root=q256('[data-profile]');if(!root||!root.contains(e.target))return;const b=e.target?.closest?.('button');if(!b||!/recolher|expandir/.test(norm256(b.textContent)))return;queueMicrotask(syncProfileCollapse256);requestAnimationFrame(syncProfileCollapse256);setTimeout(()=>{syncProfileCollapse256();if(route()==='profile')remember256('profile')},80)},true);

/* Persistent, childList-only local rails. Unlike r255 this observer never expires after
   five seconds and never invokes a page renderer. It only adds an overflow class and
   repairs the already-rendered Sports/Profile structure. */
const RAIL256='.season-tabs,.season-list,.season-row,[data-seasons],.ct169-season-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct244-seasons-scroll,.ct244-chart-scroll,.episode-list,.episodes-list,.episodes-row,.episode-row,[data-episodes],[data-season-episodes],.related-scroll,.related-grid,.related-row,[data-related],.similar-scroll,.similar-grid,.similar-row,[data-similar],.cast-scroll,.cast-grid,.cast-row,[data-cast],.actors-scroll,.actors-grid,.actors-row,[data-actors],.people-scroll,.people-grid,.people-row,[data-people],.episode-graph,.graph-shell,.chart-wrap,.chart-scroll,[data-chart],[data-episode-chart],.cards-row,.rail,.ct255-media-rail,.ct255-f1-tabs,.ct255-f1-list,.ct255-f1-table,.ct255-sport-filters,.ct255-sports-tabs,.ct255-sport-grid';
function semanticRail256(root=document){for(const section of qa256('section,.panel,[data-series-detail],[data-movie-detail]',root)){const head=norm256(q256('h2,h3,.section-title,.eyebrow',section)?.textContent||'');if(!/(temporad|episod|melhores|piores|grafico|nota|relacionad|semelhant|atores|elenco|cast)/.test(head))continue;let best=null,overflow=0;for(const el of qa256('div,ul,ol',section).slice(0,80)){if(el.children.length<2)continue;let d=0;try{d=el.scrollWidth-el.clientWidth}catch(_){}if(d>overflow){overflow=d;best=el}}if(best&&overflow>4)best.classList.add('ct256-local-x')}}
function markRails256(root=document){const scope=root?.querySelectorAll?root:document;for(const el of qa256(RAIL256,scope))el.classList.add('ct256-local-x');if(root?.matches?.(RAIL256))root.classList.add('ct256-local-x');semanticRail256(scope);reorderSports256();syncProfileCollapse256()}
let railRaf256=0;const root256=app256();if(root256&&window.MutationObserver){try{new MutationObserver(()=>{cancelAnimationFrame(railRaf256);railRaf256=requestAnimationFrame(()=>markRails256(root256))}).observe(root256,{subtree:true,childList:true});window.__ctR256RailObserverActive=true}catch(_){}}
window.addEventListener('resize',()=>requestAnimationFrame(()=>markRails256(app256()||document)));window.addEventListener('popstate',()=>requestAnimationFrame(()=>markRails256(app256()||document)));
document.addEventListener('cinetracker:data-changed',()=>{snapshots256.clear();homeFetchedAt256=0;liveDetail256.clear()});
queueMicrotask(()=>markRails256(app256()||document));

window.__ctR256Test={legacy256,ep256,watchedFrontier256,releasedFrontier256,normalizeHomeRow256,reorderSports256,syncProfileCollapse256,markRails256};
})();
