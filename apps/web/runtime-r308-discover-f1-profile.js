/* CineTracker Web 1.0.99 r308 — Discover exact 3+3, F1 calendar authority and stable Profile. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR308)return;
window.__ctR308='discover-exact-3+3+personal-filter+f1-four-tabs+calendar-click+profile-first-paint';
window.__ctR308Discover='fast-parallel+daily-swap+watchlist-3+fresh-3+system-actions+final-personal-filter';
window.__ctR308F1='overview+calendar+standings+circuits+race-grid-result';
window.__ctR308Profile='single-final-owner+semantic-watchlist-no-open-glyph';
window.__ctR308Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test||{},S=window.__ctR296Test||{},T300=window.__ctR300Test||{},T299=window.__ctR299Test||{};
const discover=R.discover263;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||null);
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const host=()=>{try{return R.discoverHost263?.()||q('[data-ct263-discover-content]')}catch{return q('[data-ct263-discover-content]')}};
const asRows=v=>Array.isArray(v)?v:[];
function dedupe(rows){const seen=new Set(),out=[];for(const x of asRows(rows)){const k=keyOf(x);if(!validKey(k)||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function anime(x){if(typeOf(x)==='movie')return false;const ids=[...(x?.genre_ids||[]),...(x?.raw_tmdb?.genre_ids||[]),...(Array.isArray(x?.genres)?x.genres.map(g=>Number(g?.id||0)):[])].map(Number);const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))}
function category(x){return typeOf(x)==='movie'?'movie':anime(x)?'anime':'series'}
function categoryKnown(x){if(typeOf(x)==='movie')return true;return !!((x?.genre_ids||[]).length||(x?.genres||[]).length||(x?.raw_tmdb?.genre_ids||[]).length||x?.original_language||x?.raw_tmdb?.original_language)}
function validMedia(x){return !!(x&&idOf(x)>0&&posterOf(x))}
async function hydrate(x){if(!x||!idOf(x)||categoryKnown(x))return x;try{if(typeof tmdb!=='function')return x;const d=await tmdb(`/${typeOf(x)}/${idOf(x)}`,{language:'pt-BR'});return d?{...x,...d,media_type:typeOf(x),tmdb_id:idOf(x),raw_tmdb:{...(x?.raw_tmdb||{}),...d}}:x}catch{return x}}
async function hydrateWatch(rows){
 const base=dedupe(rows).filter(validMedia),known=base.filter(categoryKnown),unknown=base.filter(x=>!categoryKnown(x));
 const found=new Set(known.map(category));
 if(found.has('movie')&&found.has('series')&&found.has('anime'))return known;
 const out=known.slice();
 for(let i=0;i<Math.min(unknown.length,64);i+=8){
  const batch=await Promise.all(unknown.slice(i,i+8).map(hydrate));out.push(...batch);
  const cats=new Set(out.map(category));if(cats.has('movie')&&cats.has('series')&&cats.has('anime'))break;
 }
 return dedupe(out);
}
function freshEligible(x){if(!validMedia(x))return false;try{if(typeof M.blocked==='function'&&M.blocked(x))return false}catch{}try{return typeof S.strictEligible==='function'?S.strictEligible(x):true}catch{return false}}
function watchEligible(x){if(!validMedia(x))return false;const k=keyOf(x);try{const c=M.cache;if(c?.seen?.has?.(k))return false;if(c?.watch?.has&& !c.watch.has(k))return false}catch{}return true}
function group(rows){const g={movie:[],series:[],anime:[]};for(const x of dedupe(rows)){const c=category(x);if(g[c])g[c].push(x)}return g}
function composeExact(watchRows,freshRows,{trust=false}={}){
 const wg=group(asRows(watchRows).filter(trust?validMedia:watchEligible)),fg=group(asRows(freshRows).filter(trust?validMedia:freshEligible));
 const selectedFresh={movie:fg.movie[0]||null,series:fg.series[0]||null,anime:fg.anime[0]||null};
 const selectedKeys=new Set(Object.values(selectedFresh).filter(Boolean).map(keyOf));
 const dailyPool=fg.movie.filter(x=>!selectedKeys.has(keyOf(x))).slice(0,12);
 return {
  watchPools:wg,freshPools:fg,
  watch:{movie:wg.movie[0]||null,series:wg.series[0]||null,anime:wg.anime[0]||null},
  fresh:selectedFresh,dailyPool,daily:dailyPool[0]||null,
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyIndex:0,
  complete:!!(wg.movie[0]&&wg.series[0]&&wg.anime[0]&&selectedFresh.movie&&selectedFresh.series&&selectedFresh.anime&&dailyPool[0])
 };
}
function today(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch{return new Date().toISOString().slice(0,10)}}
async function freshPage(kind,page=1){
 if(typeof tmdb!=='function')return[];
 let path='/discover/tv',type='tv',params={page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':60,'first_air_date.lte':today()};
 if(kind==='movie'){path='/discover/movie';type='movie';params={page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,'primary_release_date.lte':today()}}
 if(kind==='anime')params={page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5,'vote_count.gte':30,'first_air_date.lte':today()};
 try{const p=await tmdb(path,{language:'pt-BR',include_adult:false,...params});return asRows(p?.results).map(x=>({...x,media_type:type,tmdb_id:Number(x?.id||x?.tmdb_id||0)}))}catch{return[]}
}
let fyState=null,fyAt=0,fyToken=0,fyBusy=false,testBridge=null;
function currentFrom(pool,idx){return pool?.length?pool[Math.abs(Number(idx||0))%pool.length]:null}
function currentModel(){
 if(!fyState)return null;
 const w={},f={};for(const c of ['movie','series','anime']){w[c]=currentFrom(fyState.watchPools[c],fyState.watchIndex[c]);f[c]=currentFrom(fyState.freshPools[c],fyState.freshIndex[c])}
 const daily=currentFrom(fyState.dailyPool,fyState.dailyIndex);
 return{watch:w,fresh:f,daily};
}
function mediaCard(x){if(!x)return '<div class="ct288-empty-card"><div class="ct288-empty-poster"></div><b>Sem item elegível</b><small>Não há título desta categoria agora.</small></div>';try{return typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):''}catch{return''}}
function actionRow(x,{saved=false,swap='' }={}){
 if(!x)return '';
 const k=keyOf(x);
 return `<div class="ct308-actions"><button type="button" class="chip ct308-action ct308-watchlist${saved?' active':''}" data-ct308-action="watchlist" data-media="${esc(k)}" ${saved?'disabled aria-label="Na Watchlist"':'aria-label="Adicionar à Watchlist"'}>${saved?'✓ Salvo':'+ Watchlist'}</button><button type="button" class="chip ct308-action ct308-seen" data-ct308-action="seen" data-media="${esc(k)}" aria-label="Marcar como visto">✓ Visto</button>${swap?`<button type="button" class="chip ct308-swap" data-ct308-swap="${esc(swap)}">↻ Trocar</button>`:''}</div>`;
}
function slot(label,kind,item,saved,bucket){return `<section class="ct288-slot ct308-slot" data-ct308-slot="${bucket}:${kind}"><div class="ct288-slot-head"><h3>${label}</h3></div>${mediaCard(item)}${actionRow(item,{saved,swap:`${bucket}:${kind}`})}</section>`}
function trio(title,items,saved,bucket){return `<section class="panel ct308-fy-block"><div class="panel-head"><h2>${title}</h2></div><div class="ct288-slot-grid ct308-fy-grid">${slot('Filme','movie',items.movie,saved,bucket)}${slot('Série','series',items.series,saved,bucket)}${slot('Anime','anime',items.anime,saved,bucket)}</div></section>`}
function forYouMarkup(state=fyState){
 const m=state===fyState?currentModel():state;
 if(!m)return '<div class="empty">Recomendações indisponíveis.</div>';
 return `<div data-ct288-foryou data-ct308-foryou data-ct308-owned><section class="panel ct308-daily"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct308-daily-card">${mediaCard(m.daily)}${actionRow(m.daily,{saved:false,swap:'daily'})}</div></section>${trio('Da sua Watchlist',m.watch,true,'watch')}${trio('100% novos',m.fresh,false,'fresh')}</div>`;
}
function paintForYou(){
 const h=host();if(!h||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;h.innerHTML=forYouMarkup();h.dataset.ct308Owned='foryou';try{armDiscoverRails263?.(h)}catch{}return true
}
async function recordVisible(){
 if(typeof rpc!=='function'||!fyState)return;const m=currentModel(),rows=[];
 const push=(x,slot)=>{if(x)rows.push({media_type:typeOf(x),tmdb_id:idOf(x),slot})};
 push(m?.watch?.movie,'watch_movie');push(m?.watch?.series,'watch_series');push(m?.watch?.anime,'watch_anime');push(m?.daily,'daily');push(m?.fresh?.movie,'fresh_movie');push(m?.fresh?.series,'fresh_series');push(m?.fresh?.anime,'fresh_anime');
 try{await rpc('cinetracker_shown_recommendations_record_v296',{p_items:rows})}catch{}
}
async function buildForYou(force=false){
 if(!discover||routeNow()!=='discover')return false;
 if(!force&&fyState&&Date.now()-fyAt<180000){paintForYou();return fyState.complete}
 const token=++fyToken;fyBusy=true;const h=host();if(h&&!fyState)h.innerHTML='<div class="ct263-loading ct308-loading">Montando recomendações…</div>';
 try{
  const authorityP=Promise.resolve(M.authority?.(!!force));
  const recentP=Promise.resolve(S.loadRecent296?.());
  const page1P=Promise.all([freshPage('movie',1),freshPage('series',1),freshPage('anime',1)]);
  await authorityP;if(token!==fyToken)return false;
  const watchP=hydrateWatch(M.cache?.watchRows||[]);
  const [page1,watch]=await Promise.all([page1P,watchP,recentP.then(()=>null).then(()=>page1P)]);
  if(token!==fyToken||routeNow()!=='discover'||String(discover.tab)!=='foryou')return false;
  let fresh=dedupe(page1.flat()).filter(freshEligible),draft=composeExact(watch,fresh);
  const need=[];if(draft.freshPools.movie.length<3)need.push('movie');if(!draft.freshPools.series.length)need.push('series');if(!draft.freshPools.anime.length)need.push('anime');
  if(need.length){const extra=await Promise.all(need.map(k=>freshPage(k,2)));fresh=dedupe([...fresh,...extra.flat()]).filter(freshEligible);draft=composeExact(watch,fresh)}
  if(draft.dailyPool.length<2){const moreMovies=await freshPage('movie',3);fresh=dedupe([...fresh,...moreMovies]).filter(freshEligible);draft=composeExact(watch,fresh)}
  if(token!==fyToken)return false;
  fyState=draft;fyAt=Date.now();discover.forYou={watch:Object.values(draft.watch).filter(Boolean),fresh:Object.values(draft.fresh).filter(Boolean),picks:draft.daily?[draft.daily]:[]};
  paintForYou();void recordVisible();
  return draft.complete;
 }catch(e){if(token===fyToken&&h&&!fyState)h.innerHTML='<div class="empty ct308-fy-error">Não foi possível montar o Pra Você agora.<br><button type="button" class="chip" data-ct308-retry>Tentar novamente</button></div>';return false}
 finally{if(token===fyToken)fyBusy=false}
}
const FILTERED_TABS=new Set(['trending','popular','new','anticipated','top']);
function filterPersonal(rows,tab,blocker){
 const list=dedupe(rows);if(!FILTERED_TABS.has(String(tab||'')))return list;const fn=typeof blocker==='function'?blocker:(typeof M.blocked==='function'?M.blocked:null);return list.filter(x=>{try{return !fn||!fn(x)}catch{return false}})
}
function clearLegacyActions(root){
 qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action',root).forEach(x=>x.remove());
}
function decorateBrowse(root){
 if(!root)return;root.dataset.ct308Owned='browse';
 clearLegacyActions(root);
 for(const card of qa('[data-ct288-card]',root)){
  const k=String(card.dataset.ct288Card||'');if(!validKey(k))continue;
  let row=q(':scope > .ct308-actions',card);if(!row){row=document.createElement('div');row.className='ct308-actions';row.innerHTML=`<button type="button" class="chip ct308-action ct308-watchlist" data-ct308-action="watchlist" data-media="${esc(k)}" aria-label="Adicionar à Watchlist">+ Watchlist</button><button type="button" class="chip ct308-action ct308-seen" data-ct308-action="seen" data-media="${esc(k)}" aria-label="Marcar como visto">✓ Visto</button>`;card.appendChild(row)}
 }
}
async function buildBrowse(tab,force=false){
 if(!FILTERED_TABS.has(String(tab||''))||routeNow()!=='discover')return false;const h=host();if(h)h.innerHTML='<div class="ct263-loading ct308-loading">Carregando títulos…</div>';
 try{
  await Promise.resolve(M.authority?.(!!force));
  const rows=typeof T300.sourceRows300==='function'?await T300.sourceRows300(tab):[];
  if(routeNow()!=='discover'||String(discover?.tab)!==String(tab))return false;
  const clean=filterPersonal(rows,tab);
  if(typeof window.__ctR288PaintBrowse!=='function')throw new Error('Renderer do Descobrir indisponível');
  window.__ctR288PaintBrowse(clean,tab);decorateBrowse(host());return true;
 }catch{if(h)h.innerHTML='<div class="empty">Não foi possível carregar esta área agora.<br><button type="button" class="chip" data-ct308-retry>Tentar novamente</button></div>';return false}
}
const baseLoad=window.__ctR288LoadDiscover;
async function loadDiscover308(tab=discover?.tab,force=false){
 const t=String(tab||discover?.tab||'foryou');if(!discover)return baseLoad?.apply(this,arguments);discover.tab=t;if(t==='foryou'||t==='top10')discover.type='all';try{ct288SyncShell?.()}catch{}
 if(t==='foryou'){discover.gen=Number(discover.gen||0)+1;void buildForYou(!!force);return}
 if(FILTERED_TABS.has(t)){discover.gen=Number(discover.gen||0)+1;void buildBrowse(t,!!force);return}
 return baseLoad?.apply(this,arguments);
}
try{loadDiscover263=loadDiscover308}catch{}window.__ctR288LoadDiscover=loadDiscover308;

async function persistAction(btn){
 if(!btn||btn.disabled)return;const kind=String(btn.dataset.ct308Action||''),raw=String(btn.dataset.media||btn.closest?.('[data-ct288-card]')?.dataset.ct288Card||''),[type,idRaw]=raw.split(':'),id=Number(idRaw||0);if(!id)return;
 btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{
  if(kind==='watchlist'){if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');await addWatchlist(type,id)}
  else if(kind==='seen'){if(typeof markSeen!=='function')throw new Error('Visto indisponível');await markSeen(type,id)}
  else return;
  try{await M.authority?.(true)}catch{}
  if(String(discover?.tab)==='foryou'){fyState=null;fyAt=0;void buildForYou(true)}else if(FILTERED_TABS.has(String(discover?.tab)))void buildBrowse(String(discover.tab),true);
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}}
}
function swap(slotName){
 if(!fyState)return false;
 if(slotName==='daily'){if(fyState.dailyPool.length<2)return false;fyState.dailyIndex=(fyState.dailyIndex+1)%fyState.dailyPool.length}
 else{const [bucket,kind]=String(slotName||'').split(':');if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;const pool=fyState[bucket+'Pools'][kind]||[];if(pool.length<2)return false;fyState[bucket+'Index'][kind]=(fyState[bucket+'Index'][kind]+1)%pool.length}
 paintForYou();void recordVisible();return true;
}
window.addEventListener('click',e=>{
 const retry=e.target?.closest?.('[data-ct308-retry]');if(retry){e.preventDefault();void loadDiscover308(discover?.tab,true);return}
 const action=e.target?.closest?.('[data-ct308-action]');if(action){e.preventDefault();e.stopImmediatePropagation();void persistAction(action);return}
 const change=e.target?.closest?.('[data-ct308-swap]');if(change){e.preventDefault();e.stopImmediatePropagation();swap(change.dataset.ct308Swap);return}
},true);

function normalizeF1Tabs(){
 try{if(typeof F1_TABS255!=='undefined'&&Array.isArray(F1_TABS255)){const wanted=['overview','calendar','standings','circuits'],map=new Map(F1_TABS255.map(x=>[String(x?.[0]),x]));F1_TABS255.splice(0,F1_TABS255.length,...wanted.map(k=>map.get(k)).filter(Boolean));if(typeof f1255!=='undefined'&&['drivers','teams'].includes(String(f1255?.tab)))f1255.tab='standings'}}catch{}
 for(const b of qa('[data-ct255-f1tab],[data-ct257-f1tab],[data-f1-tab],.ct255-f1-tabs button,.ct301-f1-tabs button')){const k=String(b.dataset?.ct255F1tab||b.dataset?.ct257F1tab||b.dataset?.f1Tab||'');if(k==='drivers'||k==='teams'||norm(b.textContent)==='pilotos'||norm(b.textContent)==='equipes')b.remove()}
 return true;
}
function raceSpec(el){
 const eventId=String(el?.dataset?.eventId||el?.dataset?.ct301F1Event||el?.getAttribute?.('data-event-id')||el?.getAttribute?.('data-ct301-f1-event')||'').trim();
 const season=Number(el?.dataset?.season||eventId.match(/^(\d{4})-/)?.[1]||new Date().getFullYear());
 let round=Number(el?.dataset?.round||eventId.match(/-(\d+)$/)?.[1]||0);
 if(!round){const lead=String(el?.querySelector?.('b,strong,h3,h4')?.textContent||'').match(/^\s*(\d+)\s*[.ªº-]/);round=Number(lead?.[1]||0)}
 if(!round)round=1;
 const title=String(el?.dataset?.title||el?.querySelector?.('b,strong,h3,h4')?.textContent||`GP ${round}`).trim().split('\n')[0];
 return{season,round,eventId,title};
}
function openRaceFromElement(el){
 const spec=raceSpec(el);if(testBridge?.openRace)return testBridge.openRace(spec,el);return window.__ctR306?.openRace?.(spec)
}
function stabilizeF1(){normalizeF1Tabs();return true}

function statByLabel(root,label){const want=norm(label);for(const x of qa('.stat,[data-stat],.stat-card,.profile-stat,button,a',root)){if(norm(x.textContent).includes(want))return x}return null}
function cleanWatchStat(card){
 if(!card)return false;card.classList.add('ct308-watchlist-stat');card.dataset.ct308NoOpenSignal='1';
 qa('.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon],svg[data-icon]',card).forEach(x=>x.remove());
 for(const x of qa('span,small,em,i,b,strong,button',card)){if(x===card)continue;const t=norm(x.textContent);if(['abrir','open'].includes(t)||['>','›','→','↗'].includes(String(x.textContent||'').trim()))x.remove()}
 return true;
}
function stabilizeProfile(){
 if(!['profile','perfil'].includes(routeNow()))return false;const root=q('[data-profile]');if(!root)return false;
 try{T299.decorateProfile299?.()}catch{}
 root.classList.add('ct308-profile-stable');
 cleanWatchStat(statByLabel(root,'Séries Watchlist'));cleanWatchStat(statByLabel(root,'Filmes Watchlist'));
 root.dataset.ct308StatsStable='1';return true;
}
try{if(typeof paintF1255==='function'){const base=paintF1255;paintF1255=async function(){normalizeF1Tabs();const out=await base.apply(this,arguments);normalizeF1Tabs();return out}}}catch{}
try{if(typeof paintSports255==='function'){const base=paintSports255;paintSports255=function(){normalizeF1Tabs();const out=base.apply(this,arguments);normalizeF1Tabs();return out}}}catch{}
try{if(typeof renderSports==='function'){const base=renderSports;renderSports=async function(){normalizeF1Tabs();const out=await base.apply(this,arguments);normalizeF1Tabs();return out}}}catch{}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);stabilizeProfile();return out}}}catch{}

const style=document.createElement('style');style.id='ct-web-r308-discover-f1-profile';style.textContent=`
[data-ct308-owned] .ct291-card-footer,[data-ct308-owned] .ct295-card-footer,[data-ct308-owned] .ct291-slot-footer,[data-ct308-owned] .ct288-state,[data-ct308-owned] .ct301-watch-action{display:none!important}
.ct308-actions{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:6px!important;width:100%!important;max-width:158px!important;margin-top:4px!important}
.ct308-actions .chip{position:static!important;inset:auto!important;min-width:0!important;min-height:28px!important;height:28px!important;padding:4px 7px!important;white-space:nowrap!important;line-height:1!important}.ct308-actions .ct308-action{flex:1 1 0!important}
.ct308-actions .ct308-swap{flex:1 0 100%!important;margin-left:0!important}
.ct308-fy-grid{display:grid!important;grid-template-columns:repeat(3,158px)!important;justify-content:start!important;gap:10px!important;overflow:visible!important}
.ct308-fy-grid>.ct288-slot{width:158px!important;min-width:158px!important;max-width:158px!important}
.ct308-daily-card{max-width:var(--ct-media-card-w,158px)}
.ct308-watchlist-stat::before,.ct308-watchlist-stat::after{content:none!important;display:none!important}
.ct308-watchlist-stat :is(.stat-link-icon,.stat-arrow,.open-arrow,.profile-card-arrow,[data-open-arrow],[data-profile-open-icon]){display:none!important}
.ct308-profile-stable .ct-r238-profile-grid{align-items:stretch!important}
@media(max-width:720px){.ct308-fy-grid{display:flex!important;flex-flow:row nowrap!important;overflow-x:auto!important}.ct308-fy-grid>.ct288-slot{flex:0 0 var(--ct-media-card-w,154px)!important;width:var(--ct-media-card-w,154px)!important}}
`;document.head.appendChild(style);

normalizeF1Tabs();
window.__ctR308={
 openRaceFromElement,stabilizeF1,stabilizeProfile,loadDiscover:loadDiscover308,buildForYou,buildBrowse,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},
 version:'1.0.99'
};
window.__ctR308Test={
 category,composeExact,filterPersonal,forYouMarkup,raceSpec,normalizeF1Tabs,stabilizeProfile,
 setForYouState(v){fyState=v;fyAt=Date.now()},get forYouState(){return fyState},get forYouBusy(){return fyBusy}
};
})();
