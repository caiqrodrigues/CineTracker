/* CineTracker Web 1.0.91 r300 — Discover recovery + four Sports tabs + Watchlist stat style. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR300)return;
window.__ctR300='discover-bounded-recovery+four-sports-tabs+watchlist-stat-style';
window.__ctR300Discover='browse-tabs-no-infinite-loading';
window.__ctR300Sports='next+previous+watched+favorites-no-live';
window.__ctR300Profile='series-watchlist+movies-watchlist-match-clickable-style';
window.__ctR300Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{},q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.id||0));
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||null);
const discover=R.discover263||null;
const BROWSE=new Set(['trending','popular','new','anticipated','top','calendar']);
let browseGuardToken=0,sportsRepairing=false;
function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function discoverHost(){try{return R.discoverHost263?.()||q('[data-ct263-discover-content]')}catch{return q('[data-ct263-discover-content]')}}
function isoDay(d){return d.toISOString().slice(0,10)}
function addDays(n){const d=new Date();d.setUTCHours(12,0,0,0);d.setUTCDate(d.getUTCDate()+n);return isoDay(d)}
function dedupe(rows){const seen=new Set(),out=[];for(const x of Array.isArray(rows)?rows:[]){const id=Number(idOf(x)||0),t=typeOf(x)==='movie'?'movie':'tv',k=`${t}:${id}`;if(!id||seen.has(k)||!posterOf(x))continue;seen.add(k);out.push(x)}return out}
function personallyBlocked(x){try{return typeof M.blocked==='function'&&M.blocked(x)}catch{return false}}
function discoverType(){const t=String(discover?.type||'all');return ['movie','tv'].includes(t)?t:'all'}
function filterBrowse(rows){const t=discoverType();return dedupe(rows).filter(x=>!personallyBlocked(x)&&(t==='all'||typeOf(x)===t))}
async function tmdbPage(path,params,type){if(typeof tmdb!=='function')return[];try{const p=await tmdb(path,{language:'pt-BR',include_adult:false,...params});return (p?.results||[]).map(x=>({...x,media_type:x?.media_type||type||'tv',tmdb_id:Number(x?.id||x?.tmdb_id||0)}))}catch{return[]}}
async function sourceRows300(tab){
 const today=addDays(0),past=addDays(-120),future=addDays(365),soon=addDays(90),jobs=[];
 if(tab==='trending')jobs.push(tmdbPage('/trending/all/week',{page:1}),tmdbPage('/trending/all/week',{page:2}));
 else if(tab==='popular')jobs.push(tmdbPage('/movie/popular',{page:1},'movie'),tmdbPage('/tv/popular',{page:1},'tv'),tmdbPage('/movie/popular',{page:2},'movie'),tmdbPage('/tv/popular',{page:2},'tv'));
 else if(tab==='new')jobs.push(tmdbPage('/discover/movie',{'primary_release_date.gte':past,'primary_release_date.lte':today,sort_by:'primary_release_date.desc',page:1},'movie'),tmdbPage('/discover/tv',{'first_air_date.gte':past,'first_air_date.lte':today,sort_by:'first_air_date.desc',page:1},'tv'));
 else if(tab==='anticipated')jobs.push(tmdbPage('/discover/movie',{'primary_release_date.gte':today,'primary_release_date.lte':future,sort_by:'popularity.desc',page:1},'movie'),tmdbPage('/discover/tv',{'first_air_date.gte':today,'first_air_date.lte':future,sort_by:'popularity.desc',page:1},'tv'));
 else if(tab==='top')jobs.push(tmdbPage('/movie/top_rated',{page:1},'movie'),tmdbPage('/tv/top_rated',{page:1},'tv'),tmdbPage('/movie/top_rated',{page:2},'movie'),tmdbPage('/tv/top_rated',{page:2},'tv'));
 else if(tab==='calendar')jobs.push(tmdbPage('/discover/movie',{'primary_release_date.gte':today,'primary_release_date.lte':soon,sort_by:'primary_release_date.asc',page:1},'movie'),tmdbPage('/discover/tv',{'first_air_date.gte':today,'first_air_date.lte':soon,sort_by:'first_air_date.asc',page:1},'tv'));
 const packs=await Promise.all(jobs);return filterBrowse(packs.flat());
}
function browseStillLoading(tab){const h=discoverHost();if(!h||!BROWSE.has(tab))return false;const hasContent=!!h.querySelector('.ct288-card,.ct288-browse-block,[data-ct288-calendar]');const loading=!!h.querySelector('.ct263-loading,.loader')||/carregando titulos|carregando títulos/i.test(h.textContent||'');return loading&&!hasContent}
async function buildBrowse300(tab,force=false){
 if(!BROWSE.has(tab)||routeNow()!=='discover')return false;const token=++browseGuardToken;
 try{await Promise.resolve(M.authority?.(!!force));if(token!==browseGuardToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;const rows=await sourceRows300(tab);if(token!==browseGuardToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;if(typeof window.__ctR288PaintBrowse!=='function')throw new Error('Renderer do Descobrir indisponível');window.__ctR288PaintBrowse(rows,tab);const h=discoverHost();if(h)h.dataset.ct300Recovered=tab;return true}catch(e){const h=discoverHost();if(token===browseGuardToken&&h&&String(discover?.tab)===tab)h.innerHTML='<div class="empty ct300-discover-error">Não foi possível carregar esta área agora.<br><button type="button" class="chip" data-ct300-discover-retry> tentar novamente </button></div>';return false}
}
function guardBrowse300(tab,delay=2200){const token=++browseGuardToken;setTimeout(()=>{if(token!==browseGuardToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return;if(browseStillLoading(tab))void buildBrowse300(tab,false)},delay)}

function profileStatsRoot(){const root=q('[data-profile]');if(!root)return null;const h=qa('h1,h2,h3,h4,.panel-title,.section-title',root).find(x=>norm(x.textContent)==='estatisticas'||norm(x.textContent).startsWith('estatisticas '));return h?.closest?.('.panel,section,article')||h?.parentElement||root}
function cardByLabel(root,label){const want=norm(label);for(const x of qa('small,label,[data-stat-label],.stat-label',root)){if(norm(x.textContent)===want||norm(x.textContent).includes(want)){const c=x.closest?.('.stat,[data-stat],button,a,.profile-stat');if(c)return c}}return qa('.stat,[data-stat],button,a,.profile-stat',root).find(x=>norm(x.textContent).includes(want))||null}
function styleWatchlistStats300(){const root=profileStatsRoot();if(!root)return false;let changed=false;for(const label of['Séries Watchlist','Filmes Watchlist']){const c=cardByLabel(root,label);if(!c)continue;c.classList.add('ct299-clickable-stat','ct300-watchlist-stat');c.dataset.ct300WatchlistStyle='1';changed=true}return changed}

const SPORTS_ORDER=['next','previous','watched','favorites'];
function enforceSportsTabs300(activateNext=true){const tabs=q('.ct255-sports-tabs');if(!tabs)return false;const live=q('[data-ct255-sport-tab="live"]',tabs),liveActive=!!live?.classList?.contains('active');live?.remove();for(const old of qa('[data-ct247-sport-tab="live"],[data-ct248-sport-tab="live"]'))old.remove();const buttons=new Map(qa('[data-ct255-sport-tab]',tabs).map(b=>[String(b.dataset.ct255SportTab),b]));for(const key of SPORTS_ORDER){const b=buttons.get(key);if(b)tabs.appendChild(b)}for(const b of qa('[data-ct255-sport-tab]',tabs))if(!SPORTS_ORDER.includes(String(b.dataset.ct255SportTab)))b.remove();if(liveActive&&activateNext&&!sportsRepairing){const next=buttons.get('next');if(next){sportsRepairing=true;queueMicrotask(()=>{try{next.click()}finally{sportsRepairing=false;setTimeout(()=>enforceSportsTabs300(false),30)}})}}return qa('[data-ct255-sport-tab]',tabs).map(b=>String(b.dataset.ct255SportTab)).join(',')===SPORTS_ORDER.join(',')}

const loadBase=window.__ctR288LoadDiscover;
if(typeof loadBase==='function'&&!loadBase.__ctR300Guard){const wrapped=function(tab=discover?.tab,force=false){const t=String(tab||discover?.tab||'foryou'),out=loadBase.apply(this,arguments);if(BROWSE.has(t))guardBrowse300(t,2200);return out};wrapped.__ctR300Guard=true;window.__ctR288LoadDiscover=wrapped}
try{if(typeof renderSports==='function'){const base=renderSports;renderSports=async function(){const out=await base.apply(this,arguments);for(const ms of[0,80,260,700])setTimeout(()=>enforceSportsTabs300(true),ms);return out}}}catch{}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);for(const ms of[0,100,300,800])setTimeout(styleWatchlistStats300,ms);return out}}}catch{}

document.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-ct263-discover-tab]');if(tab){const t=String(tab.dataset.ct263DiscoverTab||'');if(BROWSE.has(t))guardBrowse300(t,2200)}
 if(e.target?.closest?.('[data-ct255-sport-tab]'))for(const ms of[0,60,220])setTimeout(()=>enforceSportsTabs300(false),ms);
 if(e.target?.closest?.('[data-ct300-discover-retry]')){e.preventDefault();e.stopImmediatePropagation();const t=String(discover?.tab||'');if(BROWSE.has(t))void buildBrowse300(t,true)}
},false);
function reconcile300(){for(const ms of[0,180,550,1200])setTimeout(()=>{if(routeNow()==='sports')enforceSportsTabs300(true);if(routeNow()==='profile')styleWatchlistStats300();if(routeNow()==='discover'){const t=String(discover?.tab||'');if(BROWSE.has(t)&&browseStillLoading(t))guardBrowse300(t,1200)}},ms)}
window.addEventListener('popstate',reconcile300);document.addEventListener('cinetracker:data-changed',reconcile300);for(const ms of[0,400,1400])setTimeout(reconcile300,ms);
window.__ctR300Test={sourceRows300,filterBrowse,browseStillLoading,buildBrowse300,styleWatchlistStats300,enforceSportsTabs300,get sportsOrder(){return SPORTS_ORDER.slice()}};
})();
