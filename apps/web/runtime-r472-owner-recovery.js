/* CineTracker Web 1.0.262 r472 — final visible owners for Home, Pra Você and Profile summary/stadium. */
(()=>{
'use strict';
if(window.__ctR472?.version==='1.0.262')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r472 core bridge unavailable');

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'&&!Array.isArray(v[0])?unwrap(v[0]):v&&typeof v==='object'&&!Array.isArray(v)&&v.data!=null?unwrap(v.data):v;
const arrayFrom=v=>{const u=unwrap(v);if(Array.isArray(u))return u;for(const k of ['rows','items','dashboard','actors'])if(Array.isArray(u?.[k]))return u[k];return[]};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};
const bounded=(fn,delays)=>{for(const ms of delays)setTimeout(fn,ms)};

/* HOME — r388 owns the frame/history; r399 owns v452 Series and paged v405 Movies. */
let homeScheduleToken=0;
const homeTasks={series:null,movies:null};
function homeKindFrom(el){const d=String(el?.dataset?.homeTab||'');if(d==='series'||d==='movies')return d;return norm(el?.textContent).includes('filme')?'movies':'series'}
function releaseHomeGate(){
 document.documentElement.removeAttribute('data-ct461-series-gate');
 for(const view of qa('[data-home-view="series"]')){view.style.removeProperty('visibility');view.removeAttribute('aria-hidden')}
}
function setHomeKind(kind){
 const k=kind==='movies'?'movies':'series';
 try{window.__ctR371?.applyTab?.(k)}catch{}
 try{if(window.__ctR371&&typeof window.__ctR371==='object')window.__ctR371.activeTab=k}catch{}
 for(const b of qa('[data-home-tab],.home-tabs button')){const on=homeKindFrom(b)===k;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')}
 for(const v of qa('[data-home-view]')){const on=String(v.dataset.homeView||'')===k;v.hidden=!on;v.style.display=on?'':'none'}
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 releaseHomeGate();
 return k;
}
function homeFrameReady(){return!!q('[data-home] [data-home-view="series"]')&&!!q('[data-home] [data-home-view="movies"]')}
function homeReady(kind){
 if(kind==='movies')return /^\d+\/\d+$/.test(String(document.documentElement.dataset.ct399Movies||''))&&!!q('[data-home-view="movies"] [data-ct388-movie-watch] .ct388-movie-stack');
 return document.documentElement.dataset.ct399SeriesAuthority==='v452'&&!!q('[data-home-view="series"] [data-ct388-history="episodes"]');
}
async function repairHome(kind,force=false){
 const k=kind==='movies'?'movies':'series';if(routeNow()!=='home')return false;if(homeTasks[k]&&!force)return homeTasks[k];
 homeTasks[k]=(async()=>{
  try{
   setHomeKind(k);
   if(!homeFrameReady()&&window.__ctR388?.renderHome){await timeout(window.__ctR388.renderHome(),9000).catch(()=>false);if(routeNow()!=='home')return false;setHomeKind(k)}
   releaseHomeGate();
   if(k==='series'){
    await Promise.allSettled([
     Promise.resolve(window.__ctR399?.refreshSeries?.(true)),
     Promise.resolve(window.__ctR388?.loadHistory?.(true))
    ]);
    try{window.__ctR399?.renderSeries?.()}catch{}
   }else{
    await Promise.allSettled([
     Promise.resolve(window.__ctR399?.ensureMovies?.(true)),
     Promise.resolve(window.__ctR388?.loadHistory?.(true))
    ]);
    try{window.__ctR399?.renderMovies?.()}catch{}
   }
   setHomeKind(k);releaseHomeGate();document.documentElement.dataset.ct472Home=k+':ready';return homeReady(k);
  }catch(e){document.documentElement.dataset.ct472HomeError=String(e?.message||e);releaseHomeGate();return false}
  finally{homeTasks[k]=null}
 })();
 return homeTasks[k];
}
function scheduleHome(kind,force=true){
 const k=kind==='movies'?'movies':'series',token=++homeScheduleToken;
 bounded(()=>{if(token!==homeScheduleToken||routeNow()!=='home')return;releaseHomeGate();setHomeKind(k);if(!homeReady(k))void repairHome(k,force)},[0,80,220,520,1100,2200,4200,7200]);
}

/* DESCOBRIR > PRA VOCÊ — r464 remains the only renderer; r472 guarantees entry after navigation. */
let discoverToken=0;
function discoverReady(){return document.documentElement.dataset.ct464ForYou==='ready'&&!!q('[data-ct464-foryou]')}
function activateForYou(force=false){
 if(routeNow()!=='discover')return false;
 try{const s=window.__ctR288R263?.discover263;if(s){s.tab='foryou';s.type='all'}}catch{}
 try{if(force)return window.__ctR464?.load?.(true)??window.__ctR464?.activate?.();return window.__ctR464?.activate?.()??false}catch{return false}
}
function scheduleForYou(){
 const token=++discoverToken;
 bounded(()=>{if(token!==discoverToken||routeNow()!=='discover')return;if(!discoverReady())void activateForYou(true)},[40,140,360,800,1600,3000,5200]);
}

/* PROFILE — exactly 13 cards + one 14th Ver mais; full list opens separately. */
const PROFILE_LIMIT=13;
const labels={series:'Séries',movies:'Filmes',seriesFav:'Séries Favoritas',movieFav:'Filmes Favoritos',actors:'Atores Favoritos'};
let mediaLists=null,mediaTask=null,actors=[],actorTotal=0,actorTask=null,profileToken=0,stadiumTask=null;
const makeMediaLists=dash=>({
 series:rows(dash).filter(x=>x?.media_type==='tv'&&(x?.is_completed||x?.is_in_progress||x?.is_up_to_date||num(x?.watched_episodes)>0)),
 movies:rows(dash).filter(x=>x?.media_type==='movie'&&x?.is_seen),
 seriesFav:rows(dash).filter(x=>x?.media_type==='tv'&&x?.is_favorite),
 movieFav:rows(dash).filter(x=>x?.media_type==='movie'&&x?.is_favorite)
});
function fallbackMediaLists(){
 try{const r=core.profileRows?.();if(r&&typeof r==='object')return{series:rows(r.series),movies:rows(r.movies),seriesFav:rows(r.seriesFav),movieFav:rows(r.movieFav)}}catch{}
 return{series:[],movies:[],seriesFav:[],movieFav:[]};
}
async function loadMedia(force=false){
 if(mediaTask&&!force)return mediaTask;
 mediaTask=(async()=>{try{const dash=arrayFrom(await timeout(core.rpc('cinetracker_profile_media_dashboard_v0991',{}),8000));if(dash.length||force)mediaLists=makeMediaLists(dash);return mediaLists}catch{return mediaLists||fallbackMediaLists()}finally{mediaTask=null}})();return mediaTask;
}
async function loadActors(force=false){
 if(actorTask&&!force)return actorTask;
 actorTask=(async()=>{try{const raw=unwrap(await timeout(core.rpc('cinetracker_profile_actors_v465',{p_limit:50}),8000)),list=arrayFrom(raw);actors=list;actorTotal=Math.max(num(raw?.count),num(raw?.total),list.length);return list}catch{if(!actors.length)actors=rows(core.profileData?.()?.favorite_actors);actorTotal=Math.max(actorTotal,actors.length);return actors}finally{actorTask=null}})();return actorTask;
}
function panelByLabel(label){const root=q('[data-profile]'),wanted=norm(label);if(!root)return null;return qa('section.panel,.panel',root).find(p=>norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',p)?.textContent||'')===wanted)||null}
function nativeMore(panel){return qa('button',panel).find(b=>!b.dataset.ct472More&&norm(b.textContent).includes('ver mais'))||null}
function hideNativeMore(panel){const b=nativeMore(panel);if(!b)return null;b.dataset.ct472NativeMore='1';b.hidden=true;b.style.display='none';b.setAttribute('aria-hidden','true');b.tabIndex=-1;panel.__ct472NativeMore=b;return b}
function actorCard(a){
 const id=num(a?.tmdb_person_id||a?.person_id||a?.id),name=esc(a?.actor_name||a?.name||'Ator'),p=String(a?.profile_path||''),src=p?(p.startsWith('http')?p:core.image?.(p,'w185')):'';
 return '<article class="card ct472-profile-card"><button type="button" data-person="'+id+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div class="card-body"><b>'+name+'</b><small>Ator favorito</small></div></button></article>';
}
function mediaCard(x){try{return String(core.mediaCard?.(x)||'')}catch{return''}}
function dataFor(key){const base=mediaLists||fallbackMediaLists();if(key==='actors')return actors.length?actors:rows(core.profileData?.()?.favorite_actors);return rows(base[key])}
function totalFor(key,data){return key==='actors'?Math.max(actorTotal,data.length):data.length}
function moreCard(key,total){
 const remaining=Math.max(0,total-PROFILE_LIMIT);
 return '<article class="card ct472-more-card"><button type="button" data-ct472-more="'+esc(key)+'" aria-label="Ver mais '+esc(labels[key]||'')+'"><div class="poster ct472-more-poster"><span>＋'+remaining.toLocaleString('pt-BR')+'</span></div><div class="card-body"><b>Ver mais</b><small>'+total.toLocaleString('pt-BR')+' no total</small></div></button></article>';
}
function renderSummary(key){
 const panel=panelByLabel(labels[key]);if(!panel)return false;const row=q(':scope > .row,.row',panel);if(!row)return false;
 hideNativeMore(panel);
 const data=dataFor(key),total=totalFor(key,data),render=key==='actors'?actorCard:mediaCard,head=q('.panel-head small',panel);if(head)head.textContent=total.toLocaleString('pt-BR');
 const html=data.slice(0,PROFILE_LIMIT).map(render).join('')+(total>PROFILE_LIMIT?moreCard(key,total):'');
 row.innerHTML=html||'<div class="empty">Nenhum item nesta seção.</div>';row.dataset.ct472ProfileRow=key;panel.dataset.ct472ProfilePanel=key;panel.dataset.ct472Total=String(total);return true;
}
function closeAllScreen(){q('[data-ct472-all-screen]')?.remove()}
function openFallbackScreen(key){
 closeAllScreen();const data=dataFor(key),render=key==='actors'?actorCard:mediaCard,ov=document.createElement('div');ov.className='ct472-all-screen';ov.dataset.ct472AllScreen=key;
 ov.innerHTML='<section class="ct472-all-panel" role="dialog" aria-modal="true" aria-labelledby="ct472-all-title"><header><div><small>PERFIL</small><h2 id="ct472-all-title">'+esc(labels[key]||'Itens')+'</h2><p>'+data.length.toLocaleString('pt-BR')+' itens</p></div><button type="button" class="btn" data-ct472-all-close aria-label="Fechar">✕ Fechar</button></header><div class="ct472-all-grid">'+data.map(render).join('')+'</div></section>';
 document.body.appendChild(ov);q('[data-ct472-all-close]',ov)?.focus();return true;
}
function openFullList(key){
 const panel=panelByLabel(labels[key]),trigger=panel?.__ct472NativeMore;
 if(trigger?.isConnected&&!trigger.disabled){try{trigger.click();return true}catch{}}
 return openFallbackScreen(key);
}
function statByLabel(root,label){const wanted=norm(label);return qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',root).find(x=>norm(q('small,label,.stat-label,.label',x)?.textContent||x.textContent).includes(wanted))||null}
function patchStadium(count){
 if(routeNow()!=='profile'||!Number.isFinite(Number(count)))return false;const root=q('[data-profile]');if(!root)return false;
 let card=statByLabel(root,'Jogos no Estádio'),events=statByLabel(root,'Eventos assistidos');
 if(!card&&events){card=events.cloneNode(true);const label=q('small,label,.stat-label,.label',card);if(label)label.textContent='Jogos no Estádio';events.insertAdjacentElement('afterend',card)}
 if(!card)return false;const value=q('b,strong,.value,.stat-value',card);if(!value)return false;value.textContent=Number(count).toLocaleString('pt-BR');card.dataset.ct299History='stadium';card.dataset.ct472Stadium='authoritative';return true;
}
async function loadStadium(force=false){
 if(stadiumTask&&!force)return stadiumTask;
 stadiumTask=(async()=>{let count=null;try{const raw=unwrap(await timeout(core.rpc('cinetracker_sports_stadium_summary_v296',{}),7000));const v=raw?.stadium_events??raw?.[0]?.stadium_events;if(v!==null&&v!==undefined&&Number.isFinite(Number(v)))count=Number(v)}catch{}
  if(count===null)try{const hist=arrayFrom(await timeout(core.rpc('cinetracker_sports_watch_history_v296',{}),7000));count=hist.filter(x=>x?.is_watched!==false&&x?.attended_in_person===true).length}catch{}
  if(count!==null)patchStadium(count);return count;
 })().finally(()=>{stadiumTask=null});return stadiumTask;
}
async function applyProfile(force=false){
 if(routeNow()!=='profile')return false;
 await Promise.allSettled([loadMedia(force),loadActors(force),loadStadium(force)]);if(routeNow()!=='profile')return false;
 for(const key of ['series','movies','seriesFav','movieFav','actors'])renderSummary(key);
 try{window.__ctR471?.openDay&&core.setActivityOpen?.(window.__ctR471.openDay)}catch{}
 const root=q('[data-profile]');if(root)root.dataset.ct472Profile='13+separate-more';return true;
}
function scheduleProfile(force=false){
 const token=++profileToken;
 bounded(()=>{if(token!==profileToken||routeNow()!=='profile')return;void applyProfile(force)},[80,220,520,1100,2200,4200,7000,10000]);
}

function onIntent(target){
 if(!target?.closest)return;
 const nav=target.closest('[data-nav]');if(nav){const dest=String(nav.dataset.nav||'');if(dest==='home')setTimeout(()=>scheduleHome('series',true),0);if(dest==='discover')setTimeout(scheduleForYou,0);if(dest==='profile')setTimeout(()=>scheduleProfile(true),0)}
 const tab=target.closest('[data-home-tab],.home-tabs button');if(tab)setTimeout(()=>scheduleHome(homeKindFrom(tab),true),0);
 const fy=target.closest('[data-ct319-tab="foryou"],[data-ct315-tab="foryou"],[data-ct263-discover-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');if(fy)setTimeout(scheduleForYou,0);
}
for(const ev of ['pointerdown','touchstart'])window.addEventListener(ev,e=>onIntent(e.target),{capture:true,passive:true});
window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const more=t.closest('[data-ct472-more]');if(more){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();openFullList(String(more.dataset.ct472More||''));return}
 if(t.closest('[data-ct472-all-close]')||t.matches?.('[data-ct472-all-screen]')){e.preventDefault();closeAllScreen();return}
 onIntent(t);
},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllScreen()});
window.addEventListener('popstate',()=>setTimeout(()=>{const r=routeNow();if(r==='home')scheduleHome('series',true);if(r==='discover')scheduleForYou();if(r==='profile')scheduleProfile(true)},0));
window.addEventListener('cinetracker:data-changed',()=>{const r=routeNow();if(r==='home'){const k=q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series';scheduleHome(k,true)}if(r==='discover')scheduleForYou();if(r==='profile')scheduleProfile(true)});
window.addEventListener('cinetracker:f1-watched-changed',()=>{if(routeNow()==='profile')scheduleProfile(true)});

const style=document.createElement('style');style.id='ct472-style';style.textContent=`
[data-profile] [data-ct472-profile-row]{display:flex!important;flex-flow:row wrap!important;align-items:stretch!important;gap:16px!important;max-height:none!important;height:auto!important;overflow:visible!important}
[data-profile] [data-ct472-profile-row]>.card{box-sizing:border-box!important;flex:0 0 150px!important;width:150px!important;min-width:150px!important;max-width:150px!important}
[data-profile] [data-ct472-profile-row] .poster,.ct472-all-grid .poster{aspect-ratio:2/3!important}
[data-profile] [data-ct472-profile-row] .card-body b,.ct472-all-grid .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.ct472-more-poster{display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(255,255,255,.06)!important}.ct472-more-poster span{font-size:18px!important;font-weight:800!important}
.ct472-all-screen{position:fixed;inset:0;z-index:2147482500;background:rgba(3,10,15,.86);backdrop-filter:blur(14px);overflow:auto;padding:24px}
.ct472-all-panel{max-width:1200px;margin:0 auto;background:rgba(10,25,34,.96);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px;box-shadow:0 24px 80px rgba(0,0,0,.45)}
.ct472-all-panel>header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}.ct472-all-panel h2{margin:2px 0}.ct472-all-panel p{margin:0;opacity:.68}
.ct472-all-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,150px));gap:16px;align-items:start}.ct472-all-grid>.card{width:150px!important;min-width:150px!important;max-width:150px!important}
@media(max-width:720px){.ct472-all-screen{padding:10px}.ct472-all-panel{padding:12px}.ct472-all-grid{grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:10px}.ct472-all-grid>.card{width:100%!important;min-width:0!important;max-width:none!important}}
`;
if(!q('#ct472-style'))document.head.appendChild(style);

releaseHomeGate();
const initial=routeNow();if(initial==='home')scheduleHome(q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series',true);if(initial==='discover')scheduleForYou();if(initial==='profile')scheduleProfile(true);
window.__ctR472Marker='home-r388-r399+foryou-r464+profile-13-separate-more+stadium-v296';
window.__ctR472={version:'1.0.262',scope:'home-series+movies-watchlist+discover-foryou+profile-lists+stadium',repairHome,scheduleHome,activateForYou,scheduleForYou,applyProfile,scheduleProfile,loadStadium,openFullList};
})();
