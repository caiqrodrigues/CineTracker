/* CineTracker Web 1.0.53 r262 — real-device regressions from user video. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR262)return;
window.__ctR262='real-video-regressions-horizontal-series-sports';
window.__ctR262Home='local-horizontal-buckets+recent-weekly-frontier';
window.__ctR262Discover='standard-2x3-local-rails+resilient-personal-state';
window.__ctR262Sports='page-x-contained+local-match-f1-rails';
window.__ctR262Detail='nonblank-series-recovery';
window.__ctR262Horizontal='page-fixed-component-local-x';

const q262=(s,r=document)=>r?.querySelector?.(s)||null;
const qa262=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n262=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const norm262=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc262=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const route262=()=>{try{return String(typeof route==='function'?route():location.pathname||'').replace(/^\/+|\/+$/g,'')}catch{return String(location.pathname||'').replace(/^\/+|\/+$/g,'')}};
const day262=(d=new Date())=>{const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
const shiftDay262=(days,base=new Date())=>{const d=new Date(base);d.setHours(12,0,0,0);d.setDate(d.getDate()+Number(days||0));return day262(d)};
const timeout262=(p,ms,fallback=null)=>Promise.race([Promise.resolve(p).catch(()=>fallback),new Promise(r=>setTimeout(()=>r(fallback),ms))]);
const weekly262=row=>/(^| )(raw|wwe raw)( |$)|smackdown/.test(norm262(row?.media_title||row?.title||row?.name||''));
const id262=row=>n262(row?.tmdb_id||row?.source_tmdb_id||row?.raw_tmdb?.id||row?.raw_tmdb?.source_tmdb_id);
const epKey262=(s,e)=>n262(s)>0&&n262(e)>0?`${n262(s)}:${n262(e)}`:'';
function recentActivity262(value,days=30){const t=Date.parse(value||'');return Number.isFinite(t)&&t>=Date.now()-days*86400000}
function clearNext262(row){for(const k of['next_season_number','next_episode_number','next_episode_title','next_episode_air_date','next_episode','next_episode_to_watch','next_unwatched_episode'])try{delete row[k]}catch{row[k]=null}}
function sanitizeWeekly262(row){
 if(!row||!weekly262(row)||n262(row?.watched_episodes)<=0)return row;
 row._ct262Weekly=true;row._ct261Weekly=true;row._ct261Provisional=false;row._ct262RecentPending=[];
 row.home_bucket='up_to_date';row.is_caught_up=true;row.history_missing_episodes=0;
 row.released_episodes=Math.max(0,n262(row.watched_episodes));clearNext262(row);return row;
}
function computeWeekly262(row,episodes,status='Returning Series',today=day262()){
 const cutoff=shiftDay262(-45,new Date(`${today}T12:00:00`));
 const pending=(episodes||[]).filter(x=>{const air=String(x?.air_date||'').slice(0,10);return n262(x?.episode_number)>0&&air&&air<=today&&air>=cutoff&&!x?.watched}).sort((a,b)=>String(a.air_date).localeCompare(String(b.air_date))||n262(a.season_number)-n262(b.season_number)||n262(a.episode_number)-n262(b.episode_number));
 const next=pending[0]||null,ended=/ended|canceled|cancelled/.test(norm262(status));
 return{cutoff,pending,next,bucket:next?(recentActivity262(row?.last_watched_at,30)?'continue':'dust'):(ended?'completed':'up_to_date')};
}
const weeklyStateCache262=new Map(),tvCache262=new Map(),seasonCache262=new Map();
async function state262(id){const old=weeklyStateCache262.get(id);if(old&&Date.now()-old.at<60000)return old.data;const data=await timeout262(rpc('cinetracker_series_episode_state_v1',{p_tmdb_id:id,p_today:day262()}),5500,null);if(data)weeklyStateCache262.set(id,{at:Date.now(),data});return data}
async function tv262(id){const old=tvCache262.get(id);if(old&&Date.now()-old.at<120000)return old.data;const data=await timeout262(tmdb(`/tv/${id}`),5500,null);if(data)tvCache262.set(id,{at:Date.now(),data});return data}
async function season262(id,s){const key=`${id}:${s}`,old=seasonCache262.get(key);if(old&&Date.now()-old.at<120000)return old.data;const data=await timeout262(tmdb(`/tv/${id}/season/${s}`),5500,null);if(data)seasonCache262.set(key,{at:Date.now(),data});return data}
async function exactWeekly262(row){
 const id=id262(row);if(id<=0)return null;
 const [st,detail]=await Promise.all([state262(id),tv262(id)]);if(!st||!detail)return null;
 const watched=new Set((st?.episodes||[]).map(x=>epKey262(x?.season_number,x?.episode_number)).filter(Boolean));
 let last=n262(detail?.last_episode_to_air?.season_number);if(!last)last=Math.max(0,...(detail?.seasons||[]).map(x=>n262(x?.season_number)));
 if(!last)return{detail,episodes:[]};
 const nums=[last,last-1].filter(x=>x>0),packs=await Promise.all(nums.map(s=>season262(id,s)));
 const episodes=[];for(const pack of packs)for(const x of pack?.episodes||[]){const key=epKey262(x?.season_number,x?.episode_number);episodes.push({...x,watched:watched.has(key)})}
 return{detail,episodes};
}
function applyWeekly262(row,exact){
 if(!row||!exact)return false;const before=[row.home_bucket,row.history_missing_episodes,row.next_season_number,row.next_episode_number].join('|');
 const calc=computeWeekly262(row,exact.episodes,exact.detail?.status);const next=calc.next;
 row._ct262Weekly=true;row._ct261Weekly=true;row._ct262RecentPending=calc.pending;row.history_missing_episodes=calc.pending.length;row.home_bucket=calc.bucket;row.is_caught_up=!next;
 row.released_episodes=n262(row.watched_episodes)+calc.pending.length;
 if(next){row.next_season_number=n262(next.season_number);row.next_episode_number=n262(next.episode_number);row.next_episode_title=next.name||'';row.next_episode_air_date=next.air_date||'';row.next_episode={season_number:n262(next.season_number),episode_number:n262(next.episode_number),name:next.name||'',air_date:next.air_date||''};row.next_episode_to_watch=row.next_episode;row.next_unwatched_episode=row.next_episode}
 else clearNext262(row);
 return before!==[row.home_bucket,row.history_missing_episodes,row.next_season_number,row.next_episode_number].join('|');
}
let weeklyToken262=0;
async function auditWeekly262(){
 if(route262()!=='home')return;const token=++weeklyToken262,rows=(homeCache?.series||[]).filter(r=>weekly262(r)&&id262(r)>0&&n262(r?.watched_episodes)>0);let changed=false;
 await Promise.all(rows.map(async row=>{try{const exact=await exactWeekly262(row);if(token!==weeklyToken262)return;if(exact&&applyWeekly262(row,exact))changed=true}catch(_){}}));
 if(token!==weeklyToken262||route262()!=='home')return;if(changed&&typeof paintHome==='function')paintHome();queueReconcile262(0);
}

const baseRpc262=typeof rpc==='function'?rpc:null;
if(baseRpc262){
 const wrappedRpc262=async function(name,args={}){
  if(name!=='cinetracker_recommendation_state_v108'&&name!=='cinetracker_recommendation_state_v107')return baseRpc262(name,args);
  const direct=await timeout262(baseRpc262(name,args),2200,Symbol.for('ct262-timeout'));if(direct!==Symbol.for('ct262-timeout'))return direct;
  const [dash,wl]=await Promise.all([timeout262(baseRpc262('cinetracker_profile_media_dashboard_v0991',{}),2400,[]),timeout262(baseRpc262('cinetracker_watchlist_full_v119',{}),2400,{rows:[]})]);
  const rows=Array.isArray(dash)?dash:[],watch=Array.isArray(wl?.rows)?wl.rows:[];
  if(!rows.length&&!watch.length)return baseRpc262(name,args);
  const excluded=rows.filter(x=>x?.is_seen||x?.is_completed||n262(x?.watched_episodes)>0||x?.is_not_interested||x?.is_watchlist||x?.is_added_to_watchlist||x?.is_watch_later);
  const watchKeys=new Set(watch.map(x=>`${String(x?.media_type)==='movie'?'movie':'tv'}:${n262(x?.tmdb_id||x?.source_tmdb_id||x?.id)}`));
  const merged=[...excluded,...watch.filter(x=>!excluded.some(y=>`${String(y?.media_type)==='movie'?'movie':'tv'}:${n262(y?.tmdb_id||y?.source_tmdb_id||y?.id)}`===`${String(x?.media_type)==='movie'?'movie':'tv'}:${n262(x?.tmdb_id||x?.source_tmdb_id||x?.id)}`))];
  if(name==='cinetracker_recommendation_state_v107')return{fresh_excluded:merged};
  return{hard_excluded:merged,fresh_excluded:merged,watchlist:watch.filter(x=>watchKeys.has(`${String(x?.media_type)==='movie'?'movie':'tv'}:${n262(x?.tmdb_id||x?.source_tmdb_id||x?.id)}`))};
 };
 try{rpc=wrappedRpc262}catch(_){try{window.rpc=wrappedRpc262}catch(__){}}
}

function markRail262(el,kind='generic'){
 if(!el||el===document.body||el===document.documentElement)return;el.classList.add('ct262-xrail',`ct262-${kind}-rail`);el.dataset.ct262Rail=kind;
}
function armPointerRail262(el){
 if(!el||el.dataset.ct262Pointer==='1')return;el.dataset.ct262Pointer='1';let active=false,start=0,left=0,moved=false;
 el.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0)return;active=true;moved=false;start=e.clientX;left=el.scrollLeft;try{el.setPointerCapture(e.pointerId)}catch{}});
 el.addEventListener('pointermove',e=>{if(!active)return;const d=e.clientX-start;if(Math.abs(d)>4)moved=true;el.scrollLeft=left-d;if(moved)e.preventDefault()});
 const end=e=>{if(!active)return;active=false;try{el.releasePointerCapture(e.pointerId)}catch{}};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
 el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true);
}
function armHome262(){
 const root=q262('[data-home]')||(route262()==='home'?q262('#app'):null);if(!root)return;
 for(const row of qa262('.home-section .stack,[data-home-view] .stack',root)){if(row.children.length>1){markRail262(row,'home');armPointerRail262(row)}}
}
function armDiscover262(){
 const root=q262('[data-page="discover"],[data-discover],.app[data-page="discover"]')||(route262()==='discover'?q262('#app'):null);if(!root)return;
 for(const el of qa262('.ct259-discover-tabs,.ct259-discover-types,.ct255-discover-tabs,.ct255-discover-types,.ct259-media-rail,.ct255-media-rail,[data-ct259-discover-content] .row,[data-discover-content] .row',root)){markRail262(el,el.matches('.ct259-media-rail,.ct255-media-rail,[data-ct259-discover-content] .row,[data-discover-content] .row')?'media':'discover');armPointerRail262(el)}
 for(const card of qa262('.ct259-media-card,.ct255-media-card',root))card.classList.add('ct262-standard-media-card');
}
function armSports262(){
 const root=q262('[data-sports],.app[data-page="sports"],[data-page="sports"]')||(route262()==='sports'?q262('#app'):null);if(!root)return;root.classList.add('ct262-sports-root');
 for(const el of qa262('.ct247-sport-tabs,.ct254-sports-tabs,.sport-tabs,.tabs,[role="tablist"],.event-grid,.ct225-match-stack,.ct225-match-scroll,.ct236-f1-tabs,.f1Tabs,.f1-tabs,.ct236-f1-shell .grid,.ct236-f1-shell .row,[data-f1-body] .grid,[data-f1-body] .row',root)){const count=el.children?.length||0;if(count>1||/tabs|event-grid|match/.test(el.className||'')){markRail262(el,/tab/.test(el.className||'')?'sports-tabs':'sports');armPointerRail262(el)}}
}
function clampPageX262(){const root=document.scrollingElement||document.documentElement;if(root&&root.scrollLeft)root.scrollLeft=0;if(document.body&&document.body.scrollLeft)document.body.scrollLeft=0}

function seriesId262(){const m=route262().match(/(?:^|\/)series\/(-?\d+)(?:\/|$)/);return m?n262(m[1]):0}
function validSeriesDetail262(){const root=q262('[data-ct261-special],[data-ct262-series-detail],[data-detail],.series-detail,.detail-page');if(!root)return false;return String(root.textContent||'').trim().length>80}
const detailInFlight262=new Set(),detailState262=new Map();
function posterUrl262(path){try{return typeof img==='function'?img(path,'w342'):path||''}catch{return path||''}}
function detailMediaCard262(x){const id=n262(x?.id||x?.tmdb_id),title=x?.name||x?.title||'Sem título',poster=x?.poster_path;return `<article class="ct262-related-card"><button type="button" data-media="tv:${id}">${poster?`<img src="${esc262(posterUrl262(poster))}" alt="" loading="lazy">`:'<div class="ct262-related-empty">Sem capa</div>'}<b>${esc262(title)}</b></button></article>`}
function watchedSetFromState262(st){return new Set((st?.episodes||[]).map(x=>epKey262(x?.season_number,x?.episode_number)).filter(Boolean))}
async function renderSeasonFallback262(id,season){
 const host=q262('[data-ct262-episodes]');if(!host)return;host.innerHTML='<div class="empty">Carregando episódios…</div>';
 const pack=await timeout262(season262(id,season),6500,null),watched=detailState262.get(id)?.watched||new Set();if(!host.isConnected)return;
 const eps=(pack?.episodes||[]).filter(x=>n262(x?.episode_number)>0);host.innerHTML=eps.length?eps.map(x=>{const key=epKey262(x?.season_number,x?.episode_number),ok=watched.has(key);return `<article class="ct262-episode${ok?' watched':''}"><b>S${String(n262(x?.season_number)).padStart(2,'0')}E${String(n262(x?.episode_number)).padStart(2,'0')} · ${esc262(x?.name||'Episódio')}</b><small>${x?.air_date?new Date(`${x.air_date}T12:00:00`).toLocaleDateString('pt-BR'):'Data não informada'}</small><span>${n262(x?.vote_average)>0?`★ ${n262(x.vote_average).toFixed(1)}`:'Sem nota'}</span><em>${ok?'✓ Assistido':'Não assistido'}</em></article>`}).join(''):'<div class="empty">Nenhum episódio encontrado nesta temporada.</div>';markRail262(host,'series');armPointerRail262(host);
}
async function recoverSeriesDetail262(id){
 if(id<=0||validSeriesDetail262()||detailInFlight262.has(id))return;detailInFlight262.add(id);
 try{
  const [d,st]=await Promise.all([timeout262(tmdb(`/tv/${id}`,{append_to_response:'credits,recommendations,similar'}),7000,null),timeout262(baseRpc262?baseRpc262('cinetracker_series_episode_state_v1',{p_tmdb_id:id,p_today:day262()}):null,6000,null)]);if(!d||validSeriesDetail262()||seriesId262()!==id)return;
  const watched=watchedSetFromState262(st),seasons=(d?.seasons||[]).filter(x=>n262(x?.season_number)>0).sort((a,b)=>n262(b.season_number)-n262(a.season_number)),latest=n262(d?.last_episode_to_air?.season_number)||n262(seasons[0]?.season_number);detailState262.set(id,{watched});
  const rel=[...(d?.recommendations?.results||[]),...(d?.similar?.results||[])].filter((x,i,a)=>n262(x?.id)>0&&a.findIndex(y=>n262(y?.id)===n262(x?.id))===i).slice(0,12),cast=(d?.credits?.cast||[]).slice(0,8).map(x=>x?.name).filter(Boolean);
  const body=`<div class="page ct262-series-detail" data-detail data-ct262-series-detail="${id}"><button type="button" class="btn-secondary ct262-back" data-ct262-back>← Voltar</button><section class="ct262-series-hero">${d?.poster_path?`<img class="ct262-series-poster" src="${esc262(posterUrl262(d.poster_path))}" alt="">`:''}<div><span class="eyebrow">Série</span><h2>${esc262(d?.name||d?.original_name||`Série ${id}`)}</h2><p>${esc262(d?.overview||'Sinopse não disponível.')}</p><div class="ct262-detail-meta"><span>${String(d?.first_air_date||'').slice(0,4)||'—'}</span><span>${esc262(d?.status||'')}</span><span>${n262(d?.vote_average)>0?`★ ${n262(d.vote_average).toFixed(1)}`:'Sem nota'}</span><span>${watched.size} episódio(s) assistido(s)</span></div>${cast.length?`<small class="ct262-cast"><b>Elenco:</b> ${esc262(cast.join(', '))}</small>`:''}</div></section><section class="panel ct262-detail-section"><div class="panel-head"><h3>Temporadas</h3></div><div class="ct262-season-rail">${seasons.map(s=>`<button type="button" class="chip${n262(s.season_number)===latest?' active':''}" data-ct262-season="${n262(s.season_number)}">Temporada ${n262(s.season_number)}</button>`).join('')||'<div class="empty">Temporadas não informadas.</div>'}</div></section><section class="panel ct262-detail-section"><div class="panel-head"><h3>Episódios</h3></div><div class="ct262-episode-list" data-ct262-episodes></div></section>${rel.length?`<section class="panel ct262-detail-section"><div class="panel-head"><h3>Títulos semelhantes</h3></div><div class="ct262-related-rail">${rel.map(detailMediaCard262).join('')}</div></section>`:''}</div>`;
  try{if(typeof setApp==='function'&&typeof shell==='function')setApp(shell(d?.name||'Série','Detalhes da série','series',body));else{const app=q262('#app');if(app)app.innerHTML=body}}catch{const app=q262('#app');if(app)app.innerHTML=body}
  for(const el of qa262('.ct262-season-rail,.ct262-related-rail,.ct262-episode-list')){markRail262(el,'series');armPointerRail262(el)}if(latest)void renderSeasonFallback262(id,latest);
 }finally{detailInFlight262.delete(id)}
}
function ensureSeries262(){const id=seriesId262();if(id<=0||validSeriesDetail262())return;const loading=qa262('.loader,.loading,[aria-busy="true"]').some(x=>x.offsetParent!==null);if(loading)return;void recoverSeriesDetail262(id)}

let retryDiscover262=false;
function maybeRetryDiscover262(){
 if(route262()!=='discover'||retryDiscover262)return;const root=q262('[data-page="discover"],[data-discover],.app[data-page="discover"]')||(route262()==='discover'?q262('#app'):null);if(!root)return;const txt=norm262(root.textContent||'');if(!txt.includes('nao foi possivel validar sua biblioteca')&&!txt.includes('tente novamente'))return;retryDiscover262=true;setTimeout(()=>{if(route262()==='discover'&&typeof renderDiscover==='function'){try{void renderDiscover(++navSeq)}catch{}}},900);
}

let reconcileTimer262=0;
function reconcile262(){armHome262();armDiscover262();armSports262();clampPageX262();maybeRetryDiscover262();const id=seriesId262();if(id>0&&!validSeriesDetail262()){setTimeout(ensureSeries262,350);setTimeout(ensureSeries262,1400)}}
function queueReconcile262(delay=35){clearTimeout(reconcileTimer262);reconcileTimer262=setTimeout(reconcile262,delay)}

const paintHome262Base=typeof paintHome==='function'?paintHome:null;
if(paintHome262Base)paintHome=function(...args){for(const row of homeCache?.series||[])sanitizeWeekly262(row);const out=paintHome262Base.apply(this,args);requestAnimationFrame(armHome262);setTimeout(armHome262,90);return out};
const renderHome262Base=typeof renderHome==='function'?renderHome:null;
if(renderHome262Base)renderHome=async function(...args){const out=await renderHome262Base.apply(this,args);if(route262()==='home'){for(const row of homeCache?.series||[])sanitizeWeekly262(row);if(typeof paintHome==='function')paintHome();setTimeout(()=>void auditWeekly262(),80);setTimeout(()=>void auditWeekly262(),900)}return out};
const renderDiscover262Base=typeof renderDiscover==='function'?renderDiscover:null;
if(renderDiscover262Base)renderDiscover=async function(...args){retryDiscover262=false;const out=await renderDiscover262Base.apply(this,args);requestAnimationFrame(armDiscover262);setTimeout(armDiscover262,80);setTimeout(()=>{armDiscover262();maybeRetryDiscover262()},650);return out};

try{new MutationObserver(()=>queueReconcile262(45)).observe(q262('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',()=>{retryDiscover262=false;queueReconcile262(0)});window.addEventListener('pageshow',()=>queueReconcile262(0));window.addEventListener('resize',()=>queueReconcile262(40));window.addEventListener('scroll',clampPageX262,{passive:true});
document.addEventListener('click',e=>{
 const season=e.target?.closest?.('[data-ct262-season]');if(season){e.preventDefault();const root=q262('[data-ct262-series-detail]'),id=n262(root?.dataset.ct262SeriesDetail),s=n262(season.dataset.ct262Season);qa262('[data-ct262-season]',root).forEach(x=>x.classList.toggle('active',x===season));if(id&&s)void renderSeasonFallback262(id,s);return}
 const back=e.target?.closest?.('[data-ct262-back]');if(back){e.preventDefault();if(history.length>1)history.back();else if(typeof go==='function')go('/home');else if(typeof renderHome==='function')void renderHome(++navSeq);return}
 setTimeout(()=>queueReconcile262(0),0);
},true);
window.addEventListener('cinetracker:data-changed',()=>{weeklyStateCache262.clear();tvCache262.clear();seasonCache262.clear();detailState262.clear();setTimeout(()=>{if(route262()==='home')void auditWeekly262();queueReconcile262(0)},0)});

window.__ctR262Test={weekly262,shiftDay262,computeWeekly262,sanitizeWeekly262,applyWeekly262,seriesId262};
queueReconcile262(0);
})();
