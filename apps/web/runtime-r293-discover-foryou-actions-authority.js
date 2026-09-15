(()=>{
'use strict';
if(window.__ctR293)return;
window.__ctR293='discover-navigation-foryou-actions-authority';
window.__ctR293Navigation='remove-unauthorized-releases-tab-no-recreation';
window.__ctR293ForYou='new-to-user-not-release-recency+weekly-no-repeat';
window.__ctR293Actions='scoped-related-action-row+stable-slot-footer';
window.__ctR293Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{};
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.id||0));
const titleOf=typeof R.title263==='function'?R.title263:(x=>x?.title||x?.name||'');
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||null);
const yearOf=typeof R.year263==='function'?R.year263:(x=>String(x?.release_date||x?.first_air_date||x?.release_year||'').slice(0,4));
const scoreOf=typeof R.score263==='function'?R.score263:(x=>Number(x?.vote_average||0));
const discover=R.discover263;
if(!discover||typeof rpc!=='function'||typeof tmdb!=='function')throw new Error('r293 missing Discover/Supabase/TMDB authority');

const DAY=86400000,asRows=v=>Array.isArray(v)?v:[];
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function day(offset=0){const d=new Date(Date.now()+offset*DAY);try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}catch{return d.toISOString().slice(0,10)}}
function rowSet(...rows){const s=new Set();for(const list of rows)for(const x of asRows(list)){const k=keyOf(x);if(!k.endsWith(':0'))s.add(k)}return s}
function dedupe(rows){const seen=new Set(),out=[];for(const x of rows||[]){const k=keyOf(x);if(k.endsWith(':0')||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function anime(x){if(typeOf(x)==='movie')return false;const ids=[...(Array.isArray(x?.genre_ids)?x.genre_ids:[]),...(Array.isArray(x?.raw_tmdb?.genre_ids)?x.raw_tmdb.genre_ids:[]),...(Array.isArray(x?.genres)?x.genres.map(g=>Number(g?.id||0)):[])].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))}
function group(rows){const out={movie:[],series:[],anime:[]};for(const x of rows||[]){if(typeOf(x)==='movie')out.movie.push(x);else if(anime(x))out.anime.push(x);else out.series.push(x)}return out}
function validDisplay(x){return !!(x&&idOf(x)&&posterOf(x))}
function cleanGroups(groups){const out={movie:[],series:[],anime:[]};for(const k of Object.keys(out))out[k]=dedupe(asRows(groups?.[k]).filter(validDisplay));return out}

function sanitizeTabs(){
 try{
  if(typeof DTABS263!=='undefined'&&Array.isArray(DTABS263))for(let i=DTABS263.length-1;i>=0;i--){const x=DTABS263[i],id=Array.isArray(x)?String(x[0]||''):String(x?.id||x?.key||'');if(id==='releases')DTABS263.splice(i,1)}
  if(typeof ct288TabLabels!=='undefined'&&ct288TabLabels)delete ct288TabLabels.releases;
 }catch{}
 if(discover.tab==='releases')discover.tab='new';
 for(const el of document.querySelectorAll('[data-ct263-discover-tab="releases"],[data-dtab263="releases"],[data-dsec263="releases"]'))el.remove();
}

const originalSlot=typeof ct288Slot==='function'?ct288Slot:null;
const originalGrid=typeof ct288ForYouGrid==='function'?ct288ForYouGrid:null;
if(originalSlot)ct288Slot=function(title,kind,rows,bucket,watch){const clean=dedupe(asRows(rows).filter(validDisplay));return clean.length?originalSlot(title,kind,clean,bucket,watch):''};
if(originalGrid)ct288ForYouGrid=function(title,groups,bucket,watch){const clean=cleanGroups(groups);return Object.values(clean).some(a=>a.length)?originalGrid(title,clean,bucket,watch):''};

async function state293(){let raw=null;try{raw=await rpc('cinetracker_recommendation_state_v108',{})}catch{}if(!raw)try{const old=await rpc('cinetracker_recommendation_state_v107',{});raw={hard_excluded:old?.fresh_excluded||[],fresh_excluded:old?.fresh_excluded||[],watchlist:old?.watchlist||[]}}catch{}return raw||{hard_excluded:[],fresh_excluded:[],watchlist:[]}}
async function hydrate(x){if(!x||!idOf(x))return null;if(posterOf(x)&&yearOf(x)&&scoreOf(x)&&((typeOf(x)==='movie')||Array.isArray(x?.genre_ids)||Array.isArray(x?.genres)))return x;try{const t=typeOf(x),d=await tmdb(`/${t}/${idOf(x)}`,{language:'pt-BR'});return d?{...x,...d,media_type:t,raw_tmdb:{...(x?.raw_tmdb||{}),...d}}:x}catch{return x}}
async function pages(path,params,type,count=5){const jobs=[];for(let page=1;page<=count;page++)jobs.push(Promise.resolve(tmdb(path,{language:'pt-BR',include_adult:false,...params,page})).catch(()=>({results:[]})));const packs=await Promise.all(jobs),out=[];for(const p of packs)for(const x of asRows(p?.results))out.push({...x,media_type:type});return dedupe(out)}
function freshEligible(x,blocked,category){const id=Number(idOf(x)||0),yr=Number(yearOf(x)||0),sc=Number(scoreOf(x)||0),t=norm(titleOf(x));if(!id||!posterOf(x)||sc<7.5||yr<=1990||/wwe|(^| )raw( |$)|smackdown/.test(t)||blocked.has(keyOf(x)))return false;if(category==='movie')return typeOf(x)==='movie';if(category==='anime')return typeOf(x)==='tv'&&anime(x);return typeOf(x)==='tv'&&!anime(x)}
function sortFresh(a,b){return Number(scoreOf(b)||0)-Number(scoreOf(a)||0)||Number(b?.popularity||0)-Number(a?.popularity||0)}
function weekStart(){const iso=day(0),d=new Date(`${iso}T12:00:00Z`),wd=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-wd);return d.toISOString().slice(0,10)}
function localSeenKey(){let uid='anon';try{uid=String(user?.id||'anon')}catch{}return `ct293:foryou:fresh-seen:${uid}:${weekStart()}`}
function localSeen(){try{const v=JSON.parse(localStorage.getItem(localSeenKey())||'[]');return new Set(Array.isArray(v)?v.map(String):[])}catch{return new Set()}}
function saveLocalSeen(set){try{localStorage.setItem(localSeenKey(),JSON.stringify([...set]))}catch{}}
function rememberKey(key){if(!/^(movie|tv):\d+$/.test(String(key||'')))return;const s=localSeen();s.add(String(key));saveLocalSeen(s)}
function currentFreshKeys(){const out=[];for(const slot of document.querySelectorAll('[data-ct288-slot^="freshIndex:"]')){const card=slot.querySelector('[data-ct288-card]');if(card?.dataset?.ct288Card)out.push(String(card.dataset.ct288Card))}return out}
function rememberCurrentFresh(){for(const key of currentFreshKeys())rememberKey(key)}

let busy=false,lastFreshSig='',lastWatchSig='',refreshQueued=false;
const sig=rows=>dedupe(rows).map(keyOf).join('|');
function paint(){if(typeof paintForYou263==='function')paintForYou263();else if(typeof window.__ctR288PaintForYou==='function')window.__ctR288PaintForYou();sanitizeTabs();try{window.__ctR290Scan?.(document)}catch{}try{window.__ctR291Test?.decorate?.(document)}catch{}queueMicrotask(rememberCurrentFresh)}
async function refresh(force=false){
 if(busy)return false;busy=true;
 try{
  sanitizeTabs();
  const raw=await state293(),hard=rowSet(raw?.hard_excluded,raw?.seen,raw?.watched,raw?.history),weekly=rowSet(raw?.fresh_excluded),watchKeys=rowSet(raw?.watchlist),clientSeen=localSeen();
  const hydratedWatch=await Promise.all(asRows(raw?.watchlist).filter(x=>idOf(x)&&!hard.has(keyOf(x))).map(hydrate)),watch=dedupe(hydratedWatch.filter(x=>validDisplay(x)&&!hard.has(keyOf(x))));
  const commonMovie={'primary_release_date.lte':day(0),sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':100},commonTv={'first_air_date.lte':day(0),sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80};
  const [movies,series,animes]=await Promise.all([pages('/discover/movie',commonMovie,'movie',5),pages('/discover/tv',commonTv,'tv',5),pages('/discover/tv',{...commonTv,with_genres:'16',with_original_language:'ja'},'tv',5)]);
  const blocked=new Set([...hard,...weekly,...watchKeys,...clientSeen]),freshMovie=movies.filter(x=>freshEligible(x,blocked,'movie')).sort(sortFresh),freshSeries=series.filter(x=>freshEligible(x,blocked,'series')).sort(sortFresh),freshAnime=animes.filter(x=>freshEligible(x,blocked,'anime')).sort(sortFresh),current=discover.forYou||{};
  const fresh=dedupe([...freshMovie,...freshSeries,...freshAnime]);
  discover.forYou={...current,watch,fresh};lastWatchSig=sig(watch);lastFreshSig=sig(fresh);
  if(typeof ct288State==='object'&&ct288State)for(const kind of ['movie','series','anime']){const wg=group(watch)[kind],fg=group(fresh)[kind];ct288State.watchIndex[kind]=wg.length?Number(ct288State.watchIndex[kind]||0)%wg.length:0;ct288State.freshIndex[kind]=fg.length?Number(ct288State.freshIndex[kind]||0)%fg.length:0}
  if(String(typeof route==='function'?route():'')==='discover'&&discover.tab==='foryou')paint();
  return true;
 }catch(err){try{console.warn('r293 foryou authority',err)}catch{}return false}finally{busy=false}
}
function queueRefresh(){if(refreshQueued||busy||discover.tab!=='foryou')return;refreshQueued=true;setTimeout(()=>{refreshQueued=false;void refresh(false)},0)}
function authorityDrift(){const d=discover.forYou||{};return sig(d.watch||[])!==lastWatchSig||sig(d.fresh||[])!==lastFreshSig}

function relatedCard(node){return node?.closest?.('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]')||null}
function normalizeRelated(card){if(!card||card.dataset.ct293Actions==='1')return;const buttons=[...card.querySelectorAll('[data-ct169-related-watch],[data-ct169-related-seen],[data-related-watch],[data-action="watchlist"]')].filter(b=>relatedCard(b)===card);if(!buttons.length){card.dataset.ct293Actions='1';return}let row=card.querySelector(':scope > .ct293-related-actions');if(!row){row=document.createElement('div');row.className='ct293-related-actions';card.appendChild(row)}for(const b of buttons){b.classList.add('ct293-related-action');row.appendChild(b)}card.dataset.ct293Actions='1'}
function normalizeRelatedAll(root=document){const host=root?.querySelectorAll?root:document;for(const card of host.querySelectorAll('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]'))normalizeRelated(card)}

window.addEventListener('click',e=>{const swap=e.target?.closest?.('[data-ct288-swap]');if(!swap)return;const [bucket,kind]=String(swap.dataset.ct288Swap||'').split(':');if(bucket!=='freshIndex'||!['movie','series','anime'].includes(kind))return;const slot=swap.closest('[data-ct288-slot]'),card=slot?.querySelector('[data-ct288-card]'),key=String(card?.dataset?.ct288Card||'');if(!key)return;e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();rememberKey(key);if(discover.forYou)discover.forYou.fresh=asRows(discover.forYou.fresh).filter(x=>keyOf(x)!==key);if(typeof ct288State==='object'&&ct288State?.freshIndex)ct288State.freshIndex[kind]=0;lastFreshSig=sig(discover.forYou?.fresh||[]);paint()},true);
window.addEventListener('click',e=>{if(e.target?.closest?.('[data-ct263-discover-tab="foryou"]'))setTimeout(()=>void refresh(true),180)},true);

sanitizeTabs();normalizeRelatedAll(document);
const observer=new MutationObserver(ms=>{let tabs=false,related=false,foryou=false;for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.matches?.('[data-ct263-discover-tab="releases"]')||n.querySelector?.('[data-ct263-discover-tab="releases"]'))tabs=true;if(n.matches?.('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]')||n.querySelector?.('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]'))related=true;if(n.matches?.('[data-ct288-foryou]')||n.querySelector?.('[data-ct288-foryou]'))foryou=true}if(tabs)sanitizeTabs();if(related)queueMicrotask(()=>normalizeRelatedAll(document));if(foryou&&discover.tab==='foryou'&&lastFreshSig&&authorityDrift())queueRefresh()});observer.observe(document.documentElement,{subtree:true,childList:true});
if(discover.tab==='foryou')queueRefresh();

const style=document.createElement('style');style.id='ct-web-r293-discover-foryou-actions';style.textContent=`
[data-ct263-discover-tab="releases"]{display:none!important}
.ct288-slot .ct291-slot-footer{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:8px!important;width:100%!important;min-height:32px!important;margin-top:4px!important}
.ct288-slot .ct291-playlist{justify-self:start!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
.ct288-slot .ct288-swap{justify-self:end!important;white-space:nowrap!important}
.ct293-related-actions{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:6px!important;width:100%!important;margin-top:8px!important;position:relative!important;z-index:5!important}
.ct293-related-actions .ct293-related-action{position:static!important;inset:auto!important;transform:none!important;margin:0!important;min-height:30px!important;height:30px!important;padding:4px 8px!important;line-height:1!important;white-space:nowrap!important}
`;
document.head.appendChild(style);
window.__ctR293Test={sanitizeTabs,refresh,group,freshEligible,cleanGroups,normalizeRelatedAll,authorityDrift,localSeen,rememberKey,get lastFreshSig(){return lastFreshSig},get lastWatchSig(){return lastWatchSig}};
})();
