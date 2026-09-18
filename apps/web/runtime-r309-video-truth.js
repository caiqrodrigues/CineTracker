/* CineTracker Web 1.0.100 r309 — video-truth Discover/F1/Profile authority. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR309)return;
window.__ctR309='video-truth-discover-first-paint-f1-stable-profile';
window.__ctR309Discover='one-tab-rail+parallel-load+exact-categories+visible-actions+visual-dedupe';
window.__ctR309F1='four-tabs-from-producer+no-r257-repaint';
window.__ctR309Profile='canonical-payload-once+no-chevron+actor-scroll-below';
window.__ctR309Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{}, M=window.__ctR295Test||{}, S=window.__ctR296Test||{}, T300=window.__ctR300Test||{};
const discover=R.discover263;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||null);
const titleOf=x=>x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título';
const yearOf=x=>String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4);
const scoreOf=x=>Number(x?.vote_average??x?.raw_tmdb?.vote_average??0);
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const host=()=>{try{return R.discoverHost263?.()||q('[data-ct263-discover-content]')}catch{return q('[data-ct263-discover-content]')}};
const rows=v=>Array.isArray(v)?v:[];
function anime(x){
 if(typeOf(x)==='movie')return false;
 const kind=norm(x?.media_kind||x?.kind||x?.category||'');if(kind==='anime'||kind.includes('anime'))return true;
 const ids=[...(x?.genre_ids||[]),...(x?.raw_tmdb?.genre_ids||[]),...(Array.isArray(x?.genres)?x.genres.map(g=>Number(g?.id||0)):[])].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());
 return ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function category(x){return typeOf(x)==='movie'?'movie':anime(x)?'anime':'series'}
function validMedia(x){return !!(x&&idOf(x)>0&&posterOf(x))}
function identity(x){
 const k=keyOf(x),t=typeOf(x),title=norm(titleOf(x)),year=yearOf(x);
 return {key:k,visual:`${t}|${title}|${year}`};
}
function dedupeVisual(list){
 const keys=new Set(),visual=new Set(),out=[];
 for(const x of rows(list)){if(!validMedia(x))continue;const id=identity(x);if(keys.has(id.key)||visual.has(id.visual))continue;keys.add(id.key);visual.add(id.visual);out.push(x)}
 return out;
}
function grouped(list){
 const out={movie:[],series:[],anime:[]};
 for(const x of dedupeVisual(list)){const c=category(x);out[c].push(x)}
 return out;
}
function hasTwoEach(g){return ['movie','series','anime'].every(k=>(g?.[k]?.length||0)>=2)}
function categoryKnown(x){
 if(typeOf(x)==='movie')return true;
 return !!(norm(x?.media_kind||x?.kind||x?.category||'')||(x?.genre_ids||[]).length||(x?.genres||[]).length||(x?.raw_tmdb?.genre_ids||[]).length||x?.original_language||x?.raw_tmdb?.original_language);
}
async function hydrateOne(x){
 if(!x||!idOf(x)||categoryKnown(x))return x;
 try{if(typeof tmdb!=='function')return x;const t=typeOf(x),d=await tmdb(`/${t}/${idOf(x)}`,{language:'pt-BR'});return d?{...x,...d,media_type:t,tmdb_id:idOf(x),raw_tmdb:{...(x?.raw_tmdb||{}),...d}}:x}catch{return x}
}
async function hydrateWatchlist(list){
 const base=dedupeVisual(list),known=base.filter(categoryKnown),unknown=base.filter(x=>!categoryKnown(x)),out=known.slice();
 if(hasTwoEach(grouped(out)))return dedupeVisual(out);
 for(let i=0;i<Math.min(unknown.length,120);i+=10){
  out.push(...await Promise.all(unknown.slice(i,i+10).map(hydrateOne)));
  if(hasTwoEach(grouped(out)))break;
 }
 return dedupeVisual(out);
}
function strictFresh(x,a){
 if(!validMedia(x))return false;
 try{if(typeof M.blocked==='function'&&M.blocked(x,a))return false}catch{}
 const yr=Number(yearOf(x)||0),sc=scoreOf(x),name=norm(titleOf(x));
 if(sc<7.5||yr<=1990||/wwe|(^| )raw( |$)|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series/.test(name))return false;
 try{if(typeof S.strictEligible==='function'&&!S.strictEligible(x))return false}catch{}
 return true;
}
function watchEligible(x,a){
 if(!validMedia(x))return false;const k=keyOf(x);
 try{if(a?.seen?.has?.(k))return false}catch{}
 return true;
}
function today(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch{return new Date().toISOString().slice(0,10)}}
function addDays(n){const d=new Date(today()+'T12:00:00');d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
async function tmdbPage(path,params,type){
 if(typeof tmdb!=='function')return[];
 try{const p=await tmdb(path,{language:'pt-BR',include_adult:false,...params});return rows(p?.results).map(x=>({...x,media_type:x?.media_type||type||'tv',tmdb_id:Number(x?.id||x?.tmdb_id||0)}))}catch{return[]}
}
async function freshKind(kind,pages=[1,2]){
 const jobs=[];
 for(const page of pages){
  if(kind==='movie')jobs.push(tmdbPage('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,'primary_release_date.lte':today()},'movie'));
  else if(kind==='anime')jobs.push(tmdbPage('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5,'vote_count.gte':25,'first_air_date.lte':today()},'tv'));
  else jobs.push(tmdbPage('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':60,'first_air_date.lte':today()},'tv'));
 }
 return dedupeVisual((await Promise.all(jobs)).flat()).filter(x=>category(x)===kind);
}
let fy=null,fyAt=0,fyToken=0,testBridge=null;
function composeForYou(watchRows,freshRows,a,{trust=false}={}){
 const watch=grouped(rows(watchRows).filter(x=>trust?validMedia(x):watchEligible(x,a)));
 const fresh=grouped(rows(freshRows).filter(x=>trust?validMedia(x):strictFresh(x,a)));
 const used=new Set();
 const take=(list,i=0)=>{for(let step=0;step<list.length;step++){const x=list[(i+step)%list.length],k=keyOf(x);if(!used.has(k)){used.add(k);return x}}return null};
 const w={movie:take(watch.movie),series:take(watch.series),anime:take(watch.anime)};
 const f={movie:take(fresh.movie),series:take(fresh.series),anime:take(fresh.anime)};
 const dailyPool=fresh.movie.filter(x=>!used.has(keyOf(x))).slice(0,16);
 const daily=dailyPool[0]||null;
 return {watchPools:watch,freshPools:fresh,watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool,dailyIndex:0,initial:{watch:w,fresh:f,daily},complete:!!(w.movie&&w.series&&w.anime&&f.movie&&f.series&&f.anime&&daily)};
}
function current(pool,index){return pool?.length?pool[Math.abs(Number(index||0))%pool.length]:null}
function model(){
 if(!fy)return null;const w={},f={};
 for(const c of ['movie','series','anime']){w[c]=current(fy.watchPools[c],fy.watchIndex[c]);f[c]=current(fy.freshPools[c],fy.freshIndex[c])}
 const used=new Set([...Object.values(w),...Object.values(f)].filter(Boolean).map(keyOf));
 let daily=current(fy.dailyPool,fy.dailyIndex);
 if(daily&&used.has(keyOf(daily)))daily=fy.dailyPool.find(x=>!used.has(keyOf(x)))||daily;
 return {watch:w,fresh:f,daily};
}
function mediaCard(x){
 if(!x)return '<div class="ct309-missing"><div class="ct288-empty-poster"></div><b>Sem item elegível</b><small>Categoria não encontrada na sua biblioteca.</small></div>';
 try{return typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):''}catch{return''}
}
function actions(x,{saved=false,swap='' }={}){
 if(!x)return'';const k=keyOf(x);
 return `<div class="ct309-actions"><button type="button" class="chip ct309-action ct309-watch${saved?' active':''}" data-ct309-action="watchlist" data-media="${esc(k)}" ${saved?'disabled aria-label="Na Watchlist"':'aria-label="Adicionar à Watchlist"'}>${saved?'✓ Watchlist':'+ Watchlist'}</button><button type="button" class="chip ct309-action ct309-seen" data-ct309-action="seen" data-media="${esc(k)}" aria-label="Marcar como visto">✓ Visto</button>${swap?`<button type="button" class="chip ct309-swap" data-ct309-swap="${esc(swap)}">↻ Trocar</button>`:''}</div>`;
}
function slot(label,kind,item,saved,bucket){return `<section class="ct309-slot" data-ct309-slot="${bucket}:${kind}"><div class="ct309-slot-head"><h3>${label}</h3></div>${mediaCard(item)}${actions(item,{saved,swap:`${bucket}:${kind}`})}</section>`}
function trio(title,items,saved,bucket){return `<section class="panel ct309-fy-block"><div class="panel-head"><h2>${title}</h2></div><div class="ct309-fy-grid">${slot('Filme','movie',items.movie,saved,bucket)}${slot('Série','series',items.series,saved,bucket)}${slot('Anime','anime',items.anime,saved,bucket)}</div></section>`}
function forYouMarkup(state=fy){
 const m=state===fy?model():state;if(!m)return'<div class="empty">Recomendações indisponíveis.</div>';
 return `<div data-ct309-owned="foryou" data-ct309-foryou><section class="panel ct309-daily"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct309-daily-card">${mediaCard(m.daily)}${actions(m.daily,{swap:'daily'})}</div></section>${trio('Da sua Watchlist',m.watch,true,'watch')}${trio('100% novos',m.fresh,false,'fresh')}</div>`;
}
function paintForYou(){
 const h=host();if(!h||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;
 h.innerHTML=forYouMarkup();h.dataset.ct309Owned='foryou';try{armDiscoverRails263?.(h)}catch{}return true;
}
async function recordVisible(){
 if(typeof rpc!=='function'||!fy)return;const m=model(),items=[];
 const add=(x,slot)=>{if(x)items.push({media_type:typeOf(x),tmdb_id:idOf(x),slot})};
 add(m?.daily,'daily');for(const c of ['movie','series','anime']){add(m?.watch?.[c],'watch_'+c);add(m?.fresh?.[c],'fresh_'+c)}
 try{await rpc('cinetracker_shown_recommendations_record_v296',{p_items:items})}catch{}
}
async function watchlistFull(){
 try{const v=await rpc('cinetracker_watchlist_full_v119',{});return rows(v?.rows||v)}catch{return[]}
}
async function buildForYou(force=false){
 if(!discover||routeNow()!=='discover')return false;
 if(!force&&fy&&Date.now()-fyAt<180000){paintForYou();return fy.complete}
 const token=++fyToken,h=host();if(h&&!fy)h.innerHTML='<div class="ct263-loading ct309-loading">Montando recomendações…</div>';
 try{
  const authorityP=Promise.resolve(M.authority?.(!!force));
  const watchP=watchlistFull();
  const recentP=Promise.resolve(S.loadRecent296?.()).catch(()=>null);
  const freshP=Promise.all([freshKind('movie'),freshKind('series'),freshKind('anime')]);
  const [a,fullWatch,freshParts]=await Promise.all([authorityP,watchP,freshP,recentP.then(()=>null).then(()=>freshP)]);
  if(token!==fyToken||routeNow()!=='discover'||String(discover.tab)!=='foryou')return false;
  const combinedWatch=dedupeVisual([...(a?.watchRows||[]),...rows(a?.raw?.watchlist),...fullWatch]);
  const hydratedWatch=await hydrateWatchlist(combinedWatch);
  let freshRows=dedupeVisual(freshParts.flat()).filter(x=>strictFresh(x,a));
  let draft=composeForYou(hydratedWatch,freshRows,a);
  const missing=['movie','series','anime'].filter(k=>!(draft.freshPools[k]?.length>=2));
  if(missing.length){
    const extra=(await Promise.all(missing.map(k=>freshKind(k,[3,4])))).flat();
    freshRows=dedupeVisual([...freshRows,...extra]).filter(x=>strictFresh(x,a));draft=composeForYou(hydratedWatch,freshRows,a);
  }
  if(token!==fyToken)return false;
  fy=draft;fyAt=Date.now();discover.forYou={watch:Object.values(draft.initial.watch).filter(Boolean),fresh:Object.values(draft.initial.fresh).filter(Boolean),picks:draft.initial.daily?[draft.initial.daily]:[]};
  paintForYou();void recordVisible();return draft.complete;
 }catch(e){
  if(token===fyToken&&h)h.innerHTML='<div class="empty ct309-fy-error">Não foi possível montar as sete recomendações agora.<br><button type="button" class="chip" data-ct309-retry>Tentar novamente</button></div>';
  return false;
 }
}
const BROWSE=new Set(['trending','popular','new','anticipated','top','calendar']);
const FILTERED=new Set(['trending','popular','new','anticipated','top']);
const browseCache=new Map();
async function sourceRows(tab,force=false){
 const k=`${today()}|${discover?.type||'all'}|${tab}`;if(!force&&browseCache.has(k)&&Date.now()-browseCache.get(k).at<120000)return browseCache.get(k).rows;
 const past=addDays(-120),future=addDays(365),soon=addDays(90),jobs=[];
 if(tab==='trending')jobs.push(tmdbPage('/trending/all/week',{page:1}),tmdbPage('/trending/all/week',{page:2}));
 else if(tab==='popular')jobs.push(tmdbPage('/movie/popular',{page:1},'movie'),tmdbPage('/tv/popular',{page:1},'tv'),tmdbPage('/movie/popular',{page:2},'movie'),tmdbPage('/tv/popular',{page:2},'tv'));
 else if(tab==='new')jobs.push(tmdbPage('/discover/movie',{'primary_release_date.gte':past,'primary_release_date.lte':today(),sort_by:'primary_release_date.desc',page:1},'movie'),tmdbPage('/discover/tv',{'first_air_date.gte':past,'first_air_date.lte':today(),sort_by:'first_air_date.desc',page:1},'tv'));
 else if(tab==='anticipated')jobs.push(tmdbPage('/discover/movie',{'primary_release_date.gte':today(),'primary_release_date.lte':future,sort_by:'popularity.desc',page:1},'movie'),tmdbPage('/discover/tv',{'first_air_date.gte':today(),'first_air_date.lte':future,sort_by:'popularity.desc',page:1},'tv'));
 else if(tab==='top')jobs.push(tmdbPage('/movie/top_rated',{page:1},'movie'),tmdbPage('/tv/top_rated',{page:1},'tv'),tmdbPage('/movie/top_rated',{page:2},'movie'),tmdbPage('/tv/top_rated',{page:2},'tv'));
 else if(tab==='calendar')jobs.push(tmdbPage('/discover/movie',{'primary_release_date.gte':today(),'primary_release_date.lte':soon,sort_by:'primary_release_date.asc',page:1},'movie'),tmdbPage('/discover/tv',{'first_air_date.gte':today(),'first_air_date.lte':soon,sort_by:'first_air_date.asc',page:1},'tv'));
 let out=dedupeVisual((await Promise.all(jobs)).flat());
 const t=String(discover?.type||'all');if(t==='movie'||t==='tv')out=out.filter(x=>typeOf(x)===t);
 browseCache.set(k,{at:Date.now(),rows:out});return out;
}
function filterBrowse(list,tab,a){
 let out=dedupeVisual(list);if(FILTERED.has(tab))out=out.filter(x=>{try{return !(typeof M.blocked==='function'&&M.blocked(x,a))}catch{return false}});
 return out;
}
function clearLegacy(root){
 qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action,.ct308-actions',root).forEach(x=>x.remove());
}
function decorateBrowse(root){
 if(!root)return;root.dataset.ct309Owned='browse';clearLegacy(root);
 for(const card of qa('[data-ct288-card]',root)){
  const k=String(card.dataset.ct288Card||card.querySelector?.('[data-media]')?.getAttribute?.('data-media')||'');if(!validKey(k))continue;
  card.classList.remove('ct291-has-footer');card.classList.add('ct309-card');
  const row=document.createElement('div');row.className='ct309-actions';row.innerHTML=`<button type="button" class="chip ct309-action ct309-watch" data-ct309-action="watchlist" data-media="${esc(k)}">+ Watchlist</button><button type="button" class="chip ct309-action ct309-seen" data-ct309-action="seen" data-media="${esc(k)}">✓ Visto</button>`;card.appendChild(row);
 }
}
async function buildBrowse(tab,force=false){
 if(!BROWSE.has(String(tab||''))||routeNow()!=='discover')return false;const h=host();if(h)h.innerHTML='<div class="ct263-loading ct309-loading">Carregando títulos…</div>';
 try{
  const authorityP=Promise.resolve(M.authority?.(!!force));
  const sourceP=sourceRows(tab,!!force);
  const [a,raw]=await Promise.all([authorityP,sourceP]);
  if(routeNow()!=='discover'||String(discover?.tab)!==String(tab))return false;
  const clean=filterBrowse(raw,tab,a);
  if(typeof window.__ctR288PaintBrowse!=='function')throw new Error('Renderer indisponível');
  window.__ctR288PaintBrowse(clean,tab);decorateBrowse(host());return true;
 }catch(e){if(h)h.innerHTML='<div class="empty">Não foi possível carregar esta área agora.<br><button type="button" class="chip" data-ct309-retry>Tentar novamente</button></div>';return false}
}
const baseLoad=window.__ctR288LoadDiscover;
async function loadDiscover309(tab=discover?.tab,force=false){
 const t=String(tab||discover?.tab||'foryou');if(!discover)return baseLoad?.apply(this,arguments);discover.tab=t;if(t==='foryou'||t==='top10')discover.type='all';try{ct288SyncShell?.()}catch{}
 if(t==='foryou'){discover.gen=Number(discover.gen||0)+1;void buildForYou(!!force);return}
 if(BROWSE.has(t)){discover.gen=Number(discover.gen||0)+1;void buildBrowse(t,!!force);return}
 return baseLoad?.apply(this,arguments);
}
try{loadDiscover263=loadDiscover309}catch{}window.__ctR288LoadDiscover=loadDiscover309;
function canonicalDiscoverTabs(){
 const root=q('[data-ct288-discover]');if(!root)return false;
 qa('.ct257-discover-tabs',root).forEach(x=>x.remove());
 const rail=q('[data-ct288-tabs]',root);if(!rail)return true;
 const seen=new Set();for(const b of qa('[data-ct263-discover-tab]',rail)){const k=String(b.dataset.ct263DiscoverTab||'');if(k==='releases'||seen.has(k)){b.remove();continue}seen.add(k)}
 return true;
}
try{if(typeof renderDiscover==='function'){const base=renderDiscover;renderDiscover=async function(){const out=await base.apply(this,arguments);canonicalDiscoverTabs();return out}}}catch{}

async function persist(btn){
 if(!btn||btn.disabled)return;const action=String(btn.dataset.ct309Action||''),raw=String(btn.dataset.media||btn.closest?.('[data-ct288-card]')?.dataset.ct288Card||''),[type,idRaw]=raw.split(':'),id=Number(idRaw||0);if(!id)return;
 btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{
  if(action==='watchlist'){if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');await addWatchlist(type,id)}
  else if(action==='seen'){if(typeof markSeen!=='function')throw new Error('Visto indisponível');await markSeen(type,id)}
  else return;
  try{await M.authority?.(true)}catch{}fy=null;fyAt=0;browseCache.clear();void loadDiscover309(discover?.tab,true);
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}}
}
function swap(name){
 if(!fy)return false;
 if(name==='daily'){if(fy.dailyPool.length<2)return false;fy.dailyIndex=(fy.dailyIndex+1)%fy.dailyPool.length}
 else{const [bucket,kind]=String(name||'').split(':');if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;const pool=fy[bucket+'Pools'][kind]||[];if(pool.length<2)return false;fy[bucket+'Index'][kind]=(fy[bucket+'Index'][kind]+1)%pool.length}
 paintForYou();void recordVisible();return true;
}
window.addEventListener('click',e=>{
 const retry=e.target?.closest?.('[data-ct309-retry]');if(retry){e.preventDefault();void loadDiscover309(discover?.tab,true);return}
 const b=e.target?.closest?.('[data-ct309-action]');if(b){e.preventDefault();e.stopImmediatePropagation();void persist(b);return}
 const s=e.target?.closest?.('[data-ct309-swap]');if(s){e.preventDefault();e.stopImmediatePropagation();swap(s.dataset.ct309Swap);return}
},true);

function actorRail309(){
 if(!['profile','perfil'].includes(routeNow()))return false;const root=q('[data-profile]');if(!root)return false;
 const heading=qa('h1,h2,h3,h4,.panel-title,.section-title',root).find(x=>norm(x.textContent).includes('atores favoritos'));
 const section=heading?.closest('section,.panel,article');if(!section)return false;
 const controls=qa('[data-person],[data-person-id]',section),cards=[...new Set(controls.map(x=>x.closest('article,li,.card,.person-card,.actor-card')||x))];if(!cards.length)return false;
 const rail=cards[0].parentElement;if(!rail||!cards.every(x=>x.parentElement===rail))return false;
 for(const x of [section,...qa('.ct306-actor-rail,.ct305-actor-rail,.ct257-local-x',section)])if(x!==rail)x.classList.remove('ct306-actor-rail','ct305-actor-rail','ct257-local-x');
 section.classList.add('ct309-actor-section');rail.classList.add('ct309-actor-rail');
 cards.forEach(card=>{card.classList.add('ct309-actor-card');const image=q('img,.poster,.avatar,[style*="background-image"]',card);if(image)image.classList.add('ct309-actor-image')});
 return true;
}
function cleanProfile309(){
 if(!['profile','perfil'].includes(routeNow()))return false;const root=q('[data-profile]');if(!root)return false;root.classList.add('ct309-profile-stable');
 for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',root)){const t=norm(card.textContent);if(!t.includes('series watchlist')&&!t.includes('filmes watchlist'))continue;card.classList.add('ct309-watchlist-stat');qa('.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon]',card).forEach(x=>x.remove())}
 actorRail309();return true;
}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);cleanProfile309();return out}}}catch{}

const style=document.createElement('style');style.id='ct-web-r309-video-truth';style.textContent=`
[data-ct263-discover-tab="releases"],[data-ct257-discover-tab="releases"]{display:none!important}
[data-ct255-f1tab="drivers"],[data-ct255-f1tab="teams"],[data-ct257-f1tab="drivers"],[data-ct257-f1tab="teams"]{display:none!important}
[data-ct309-owned] .ct291-card-footer,[data-ct309-owned] .ct295-card-footer,[data-ct309-owned] .ct288-state,[data-ct309-owned] .ct301-watch-action,[data-ct309-owned] .ct308-actions{display:none!important}
[data-ct309-owned] .ct309-card,.ct309-slot .ct288-card,.ct309-daily-card .ct288-card{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}
.ct309-actions{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;align-items:center!important;gap:5px!important;width:100%!important;margin-top:5px!important}
.ct309-actions .chip{position:static!important;inset:auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;min-height:30px!important;height:30px!important;padding:4px 7px!important;border-radius:9px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.ct309-actions .ct309-swap{grid-column:1/-1!important;width:100%!important;min-width:0!important}
.ct309-fy-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;align-items:start!important}
.ct309-slot{min-width:0!important}.ct309-slot-head h3{margin:0 0 6px!important;font-size:13px!important}.ct309-daily-card{width:min(100%,158px)}
.ct309-profile-stable .ct309-watchlist-stat::before,.ct309-profile-stable .ct309-watchlist-stat::after{content:none!important;display:none!important}
.ct309-profile-stable .ct309-watchlist-stat :is(.ct117-stat-chevron,.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon]){display:none!important}
.ct309-profile-stable .ct309-actor-section{overflow-x:hidden!important;scrollbar-width:none!important}
.ct309-profile-stable .ct309-actor-section::-webkit-scrollbar{display:none!important}
.ct309-profile-stable .ct309-actor-rail{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;gap:12px!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 12px!important;scrollbar-width:thin!important;scrollbar-gutter:auto!important;overscroll-behavior-x:contain!important}
.ct309-profile-stable .ct309-actor-card{box-sizing:border-box!important;flex:0 0 132px!important;width:132px!important;min-width:132px!important;max-width:132px!important}
@media(max-width:720px){.ct309-fy-grid{display:flex!important;flex-flow:row nowrap!important;overflow-x:auto!important}.ct309-fy-grid>.ct309-slot{flex:0 0 154px!important;width:154px!important}.ct309-actions{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}.ct309-actions .ct309-swap{grid-column:1/-1!important;width:100%!important}}
`;document.head.appendChild(style);

canonicalDiscoverTabs();
window.__ctR309={buildForYou,buildBrowse,loadDiscover:loadDiscover309,cleanProfile:cleanProfile309,actorRail:actorRail309,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},version:'1.0.100'};
window.__ctR309Test={anime,category,dedupeVisual,composeForYou,filterBrowse,forYouMarkup,decorateBrowse,canonicalDiscoverTabs,actorRail309,cleanProfile309,setForYouState(v){fy=v;fyAt=Date.now()},get state(){return fy}};
})();
