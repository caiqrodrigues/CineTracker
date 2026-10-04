/* CineTracker Web 1.0.261 r471 — closure authority recovery for Home, Pra Voce, Profile and daily history. */
(()=>{
'use strict';
if(window.__ctR471?.version==='1.0.261')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r471 core bridge unavailable');

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number(v||0)||0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'&&!Array.isArray(v[0])?unwrap(v[0]):v&&typeof v==='object'&&!Array.isArray(v)&&v.data!=null?unwrap(v.data):v;
const arrayFrom=v=>{const u=unwrap(v);if(Array.isArray(u))return u;for(const k of ['rows','items','dashboard','actors'])if(Array.isArray(u?.[k]))return u[k];return[]};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
const routeNow=()=>{try{return String(core.route()||'')}catch{return''}};
const raf=()=>new Promise(resolve=>(window.requestAnimationFrame||setTimeout)(resolve));

/* Home: r399 is the authenticated owner inside the original closure. r461's broken preboot gate must never keep it invisible. */
function releaseHomeGate(){
 document.documentElement.removeAttribute('data-ct461-series-gate');
 for(const view of qa('[data-home-view="series"]')){view.style.removeProperty('visibility');view.removeAttribute('aria-hidden')}
 return true;
}
function wakeHome(force=false){
 releaseHomeGate();
 if(routeNow()!=='home')return false;
 try{return window.__ctR399?.settle?.(force)??false}catch{return false}
}
function scheduleHome(force=false){for(const ms of [0,80,220,600,1400])setTimeout(()=>wakeHome(force),ms)}

/* Profile: one owner for the five requested lists, backed by the full dashboard RPC. */
const PROFILE_LIMIT=13;
let mediaLists=null,mediaTask=null,mediaAttempted=false,actors=[],actorTotal=0,actorTask=null,actorsAttempted=false,renderSeq=0;
const expanded=new Set();
const makeMediaLists=dash=>({
 series:rows(dash).filter(x=>x?.media_type==='tv'&&(x?.is_completed||x?.is_in_progress||x?.is_up_to_date||num(x?.watched_episodes)>0)),
 movies:rows(dash).filter(x=>x?.media_type==='movie'&&x?.is_seen),
 seriesFav:rows(dash).filter(x=>x?.media_type==='tv'&&x?.is_favorite),
 movieFav:rows(dash).filter(x=>x?.media_type==='movie'&&x?.is_favorite)
});
function cachedMediaLists(){
 try{const r=core.profileRows?.();if(r&&typeof r==='object')return{series:rows(r.series),movies:rows(r.movies),seriesFav:rows(r.seriesFav),movieFav:rows(r.movieFav)}}catch{}
 return{series:[],movies:[],seriesFav:[],movieFav:[]};
}
async function loadMediaLists(force=false){
 if(mediaTask)return mediaTask;if(mediaAttempted&&!force)return mediaLists;mediaAttempted=true;
 mediaTask=(async()=>{try{
  const raw=await timeout(core.rpc('cinetracker_profile_media_dashboard_v0991',{}),7000),dash=arrayFrom(raw);
  if(dash.length)mediaLists=makeMediaLists(dash);
  return mediaLists;
 }catch{return mediaLists}finally{mediaTask=null;if(routeNow()==='profile')applyProfile()}})();
 return mediaTask;
}
async function loadActors(force=false){
 if(actorTask)return actorTask;if(actorsAttempted&&!force)return actors;actorsAttempted=true;
 actorTask=(async()=>{try{
  const raw=unwrap(await timeout(core.rpc('cinetracker_profile_actors_v465',{p_limit:50}),7000));
  const list=arrayFrom(raw);if(list.length)actors=list;
  actorTotal=Math.max(num(raw?.count),num(raw?.total),actors.length);
  return actors;
 }catch{
  const d=core.profileData?.()||{};if(!actors.length)actors=rows(d.favorite_actors);actorTotal=Math.max(actorTotal,actors.length);return actors;
 }finally{actorTask=null;if(routeNow()==='profile')applyProfile()}})();
 return actorTask;
}
function panelByTitle(label){
 const wanted=norm(label),root=q('[data-profile]');if(!root)return null;
 return qa('section.panel,.panel',root).find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'')===wanted)||null;
}
function actorCard(a){
 const id=num(a?.tmdb_person_id||a?.person_id||a?.id),name=esc(a?.actor_name||a?.name||'Ator'),p=String(a?.profile_path||'');
 const src=p?(p.startsWith('http')?p:core.image(p,'w185')):'';
 return '<article class="card ct471-profile-card"><button type="button" data-person="'+id+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div class="card-body"><b>'+name+'</b><small>Ator favorito</small></div></button></article>';
}
function mediaCard(x){try{return String(core.mediaCard(x)||'')}catch{return''}}
function moreCard(key,total){
 const remaining=Math.max(0,total-PROFILE_LIMIT);
 return '<article class="card ct471-more-card"><button type="button" data-ct471-more="'+esc(key)+'" aria-label="Ver todos os itens"><div class="poster ct471-more-poster"><span>＋'+remaining.toLocaleString('pt-BR')+'</span></div><div class="card-body"><b>Ver mais</b><small>'+total.toLocaleString('pt-BR')+' no total</small></div></button></article>';
}
function listData(key){
 const base=mediaLists||cachedMediaLists();
 if(key==='actors')return actors.length?actors:rows(core.profileData?.()?.favorite_actors);
 return rows(base[key]);
}
function listTotal(key,data){return key==='actors'?Math.max(actorTotal,data.length):data.length}
function rendererFor(key){return key==='actors'?actorCard:mediaCard}
function renderSummary(label,key){
 const panel=panelByTitle(label);if(!panel)return false;const row=q(':scope > .row,.row',panel);if(!row)return false;
 const data=listData(key),total=listTotal(key,data),head=q('.panel-head small',panel);if(head)head.textContent=total.toLocaleString('pt-BR');
 if(expanded.has(key)&&row.dataset.ct471Expanded==='1')return true;
 const render=rendererFor(key),visible=data.slice(0,PROFILE_LIMIT),html=visible.map(render).join('')+(total>PROFILE_LIMIT?moreCard(key,total):'');
 row.innerHTML=html||'<div class="empty">Nenhum item nesta seção.</div>';
 row.dataset.ct471ProfileRow=key;row.dataset.ct471Expanded='0';
 panel.dataset.ct471ProfilePanel=key;return true;
}
async function renderAll(key){
 const labels={series:'Séries',movies:'Filmes',seriesFav:'Séries Favoritas',movieFav:'Filmes Favoritos',actors:'Atores Favoritos'};
 const panel=panelByTitle(labels[key]);if(!panel)return false;const row=q(':scope > .row,.row',panel);if(!row)return false;
 const data=listData(key),render=rendererFor(key),token=String(++renderSeq);expanded.add(key);row.dataset.ct471Expanded='1';row.dataset.ct471RenderToken=token;row.replaceChildren();
 for(let i=0;i<data.length;i+=24){
  if(row.dataset.ct471RenderToken!==token||routeNow()!=='profile')return false;
  row.insertAdjacentHTML('beforeend',data.slice(i,i+24).map(render).join(''));await raf();
 }
 if(!data.length)row.innerHTML='<div class="empty">Nenhum item nesta seção.</div>';
 return true;
}
function bindDailyAuthority(){
 try{core.setActivityOpen?.(openDay471)}catch{}
 try{window.ct171OpenActivityDay=openDay471}catch{}
 return true;
}
function applyProfile(){
 if(routeNow()!=='profile')return false;
 if(!mediaLists&&!mediaAttempted)void loadMediaLists(false);
 if(!actorsAttempted)void loadActors(false);
 renderSummary('Séries','series');
 renderSummary('Filmes','movies');
 renderSummary('Séries Favoritas','seriesFav');
 renderSummary('Filmes Favoritos','movieFav');
 renderSummary('Atores Favoritos','actors');
 bindDailyAuthority();
 const root=q('[data-profile]');if(root)root.dataset.ct471Profile='13+more';
 return true;
}
function scheduleProfile(reset=false){
 if(reset){expanded.clear();mediaAttempted=false;actorsAttempted=false;mediaLists=null;actors=[];actorTotal=0}
 for(const ms of [60,180,420,850,1500,2800,4800])setTimeout(()=>applyProfile(),ms);
}

/* Daily history: direct v426 detail RPC + minimal same-row optimistic undo. */
const undoLocks=new WeakSet();
function fmtTime(v){try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v))}catch{return''}}
function activityHtml(x){
 const type=String(x?.item_type||''),sport=type==='sport',movie=type==='movie',id=num(x?.media_id),season=num(x?.season_number),episode=num(x?.episode_number);
 const title=esc(x?.media_title||x?.title||'Item assistido');
 const ep=type==='episode'?'S'+String(season).padStart(2,'0')+' E'+String(episode).padStart(2,'0'):'';
 const kind=sport?'Esporte':movie?'Filme':'Episódio',meta=[kind,ep,fmtTime(x?.watched_at),num(x?.runtime_minutes)?num(x.runtime_minutes)+' min':''].filter(Boolean).join(' · ');
 const data=sport?' data-ct471-sport-id="'+esc(x?.event_id||'')+'"':' data-ct471-media-id="'+id+'" data-ct471-item-type="'+esc(type)+'" data-ct471-season="'+season+'" data-ct471-episode="'+episode+'"';
 return '<article class="ct171-activity-item ct471-history-row" data-ct471-history-row><div class="ct171-activity-thumb">'+(sport?'🏆':'')+'</div><div class="ct471-history-copy"><b>'+title+'</b><small>'+esc(meta)+'</small></div><button type="button" class="chip ct471-undo" data-ct471-undo'+data+' title="Desmarcar visto" aria-label="Desmarcar visto">↶</button></article>';
}
async function openDay471(day){
 const d=String(day||'').slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
 q('.ct171-activity-overlay')?.remove();const ov=document.createElement('div');ov.className='ct171-activity-overlay';
 ov.innerHTML='<div class="ct171-activity-box"><div class="panel-head"><div><small>HISTÓRICO</small><h2>'+esc(new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))+'</h2></div><button type="button" class="btn" data-ct171-activity-close>✕ Fechar</button></div><div data-ct171-activity-items><div class="ct321-loading">Carregando histórico...</div></div></div>';
 document.body.appendChild(ov);
 try{
  const list=arrayFrom(await timeout(core.rpc('cinetracker_activity_items_by_day_v426',{p_day:d,p_tz:core.tz()}),7000)),box=q('[data-ct171-activity-items]',ov);
  if(box)box.innerHTML=list.map(activityHtml).join('')||'<div class="empty">Nenhum item registrado neste dia.</div>';return true;
 }catch(e){
  const box=q('[data-ct171-activity-items]',ov);if(box)box.innerHTML='<div class="error">Não foi possível carregar o histórico agora.</div>';return false;
 }
}
async function undo471(btn){
 if(!btn||undoLocks.has(btn))return false;undoLocks.add(btn);btn.disabled=true;btn.setAttribute('aria-busy','true');
 const row=btn.closest('[data-ct471-history-row]'),parent=row?.parentNode,next=row?.nextSibling;if(row)row.remove();
 try{
  const sportId=String(btn.dataset.ct471SportId||'');
  if(sportId)await core.rpc('cinetracker_unmark_sport_history_v426',{p_event_id:num(sportId)});
  else await core.rpc('cinetracker_unmark_history_item_v426',{p_media_id:num(btn.dataset.ct471MediaId),p_item_type:String(btn.dataset.ct471ItemType||''),p_season_number:num(btn.dataset.ct471Season)||null,p_episode_number:num(btn.dataset.ct471Episode)||null});
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r471-history-undo'}}));return true;
 }catch(e){
  if(parent&&row)parent.insertBefore(row,next&&next.parentNode===parent?next:null);btn.disabled=false;btn.removeAttribute('aria-busy');try{core.toast?.(e?.message||'Não foi possível desmarcar como visto.')}catch{}return false;
 }finally{undoLocks.delete(btn)}
}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const more=t.closest('[data-ct471-more]');if(more){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void renderAll(String(more.dataset.ct471More||''));return}
 const undo=t.closest('[data-ct471-undo]');if(undo){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void undo471(undo);return}
 const nav=t.closest('[data-nav]');if(nav){
  const dest=String(nav.dataset.nav||'');if(dest==='profile')scheduleProfile(true);if(dest==='home')scheduleHome(true);
 }
},true);
window.addEventListener('popstate',()=>{if(routeNow()==='profile')scheduleProfile(true);if(routeNow()==='home')scheduleHome(true)});
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile'){mediaAttempted=false;actorsAttempted=false;void loadMediaLists(true);void loadActors(true)}});

const style=document.createElement('style');style.id='ct471-style';style.textContent=
'[data-profile] [data-ct471-profile-row]{align-items:stretch!important}'+
'[data-profile] [data-ct471-profile-row]>.card{flex:0 0 150px!important;width:150px!important;min-width:150px!important;max-width:150px!important}'+
'[data-profile] [data-ct471-profile-row] .poster{aspect-ratio:2/3!important}'+
'[data-profile] [data-ct471-profile-row] .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'+
'.ct471-more-poster{display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(255,255,255,.06)!important}'+
'.ct471-more-poster span{font-size:18px!important;font-weight:800!important}'+
'.ct471-history-row{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important}'+
'.ct471-history-copy{min-width:0!important}.ct471-history-copy b,.ct471-history-copy small{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'+
'.ct471-undo{width:30px!important;height:30px!important;min-width:30px!important;padding:0!important;display:inline-grid!important;place-items:center!important;font-size:15px!important;border-radius:9px!important}';
document.head.appendChild(style);

releaseHomeGate();bindDailyAuthority();scheduleHome(false);if(routeNow()==='profile')scheduleProfile(false);
window.__ctR471Marker='closure-core+home-r399-visible+discover-r464-core+profile-dashboard-13+history-v426';
window.__ctR471={version:'1.0.261',scope:'home+discover-foryou+profile-lists+daily-history',releaseHomeGate,wakeHome,applyProfile,loadMediaLists,loadActors,openDay:openDay471,undo:undo471};
})();