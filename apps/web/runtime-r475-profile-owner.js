/* CineTracker Web 1.0.265 r475 — canonical Profile lists + daily history owner. */
(()=>{
'use strict';
if(window.__ctR475?.version==='1.0.265')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r475 core bridge unavailable');

const LIMIT=12;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'&&!Array.isArray(v[0])?unwrap(v[0]):v&&typeof v==='object'&&!Array.isArray(v)&&v.data!=null?unwrap(v.data):v;
const arrayFrom=v=>{const u=unwrap(v);if(Array.isArray(u))return u;for(const k of ['rows','items'])if(Array.isArray(u?.[k]))return u[k];return[]};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};

const defs={
 series:{label:'Séries',kind:'series_history'},
 movies:{label:'Filmes',kind:'movie_history'},
 seriesFav:{label:'Séries Favoritas',kind:'series_favorites'},
 movieFav:{label:'Filmes Favoritos',kind:'movie_favorites'},
 actors:{label:'Atores Favoritos',kind:'actors'}
};
const state={
 series:{rows:[],count:0},movies:{rows:[],count:0},seriesFav:{rows:[],count:0},movieFav:{rows:[],count:0},actors:{rows:[],count:0},
 watchSeries:0,watchMovies:0
};
let profileTask=null,profileScheduleToken=0,stadiumTask=null;
const fullLocks=new Set(),undoLocks=new WeakSet();
let dayTask=null,dayToken=0;

function panelByLabel(label){
 const root=q('[data-profile]'),wanted=norm(label);if(!root)return null;
 return qa('section.panel,.panel',root).find(p=>norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',p)?.textContent||'')===wanted)||null;
}
function cleanHeader(panel){
 const head=q('.panel-head',panel);if(!head)return;
 for(const el of qa('button,a,[role="button"]',head))if(norm(el.textContent).includes('ver mais'))el.remove();
}
function mediaCard(x){
 try{const h=String(core.mediaCard?.(x)||'');if(h.trim())return h}catch{}
 const title=esc(x?.title||x?.name||'Sem título'),poster=String(x?.poster_path||''),src=poster?(poster.startsWith('http')?poster:core.image?.(poster,'w342')):'';
 return '<article class="card ct475-profile-card"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div class="card-body"><b>'+title+'</b><small>'+esc(x?.release_year||'')+'</small></div></article>';
}
function actorCard(a){
 const id=num(a?.tmdb_person_id||a?.person_id||a?.id),name=esc(a?.actor_name||a?.name||'Ator'),p=String(a?.profile_path||''),src=p?(p.startsWith('http')?p:core.image?.(p,'w185')):'';
 return '<article class="card ct475-profile-card"><button type="button" data-person="'+id+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div class="card-body"><b>'+name+'</b><small>Ator favorito</small></div></button></article>';
}
function moreCard(key,count){
 const remaining=Math.max(0,count-LIMIT);
 return '<article class="card ct475-more-card"><button type="button" data-ct475-more="'+esc(key)+'" aria-label="Ver mais '+esc(defs[key]?.label||'')+'"><div class="poster ct475-more-poster"><span>＋'+remaining.toLocaleString('pt-BR')+'</span></div><div class="card-body"><b>Ver mais</b><small>'+count.toLocaleString('pt-BR')+' no total</small></div></button></article>';
}
function renderSummary(key){
 const def=defs[key],bucket=state[key],panel=panelByLabel(def.label);if(!panel)return false;
 cleanHeader(panel);
 const headCount=q('.panel-head small',panel);if(headCount)headCount.textContent=Number(bucket.count||0).toLocaleString('pt-BR');
 const row=q(':scope > .row,.row',panel);if(!row)return false;
 const render=key==='actors'?actorCard:mediaCard;
 row.innerHTML=bucket.rows.slice(0,LIMIT).map(render).join('')+(bucket.count>LIMIT?moreCard(key,bucket.count):'');
 if(!bucket.count)row.innerHTML='<div class="empty">Carregando...</div>';
 row.dataset.ct475ProfileRow=key;panel.dataset.ct475ProfilePanel=key;panel.dataset.ct475Total=String(bucket.count||0);
 return true;
}
function statCard(label){
 const root=q('[data-profile]'),wanted=norm(label);if(!root)return null;
 return qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',root).find(el=>{
  const lab=q('small,label,.stat-label,.label',el);return norm(lab?.textContent||'')===wanted;
 })||null;
}
function patchWatchlistStats(){
 for(const [label,count,kind] of [['Séries Watchlist',state.watchSeries,'series'],['Filmes Watchlist',state.watchMovies,'movie']]){
  const card=statCard(label);if(!card)continue;
  const val=q('b,strong,.value,.stat-value',card);if(val&&count>0)val.textContent=Number(count).toLocaleString('pt-BR');
  card.dataset.ct475Watchlist=kind;card.setAttribute('role','button');card.setAttribute('tabindex','0');
  card.setAttribute('aria-label',kind==='movie'?'Abrir todos os filmes da Watchlist':'Abrir todas as séries da Watchlist');
 }
}
async function listPage(kind,limit=LIMIT,offset=0){
 const raw=unwrap(await timeout(core.rpc('cinetracker_profile_list_v475',{p_kind:kind,p_limit:limit,p_offset:offset}),15000));
 const list=arrayFrom(raw);return{rows:list,count:Math.max(num(raw?.count),list.length)};
}
async function actorPage(){
 const raw=unwrap(await timeout(core.rpc('cinetracker_profile_actors_v465',{p_limit:50}),15000)),list=arrayFrom(raw);
 return{rows:list,count:Math.max(num(raw?.count),num(raw?.total),list.length)};
}
async function loadProfile(){
 if(profileTask)return profileTask;
 profileTask=(async()=>{
  const specs=[
   ['series','series_history',LIMIT],['movies','movie_history',LIMIT],['seriesFav','series_favorites',LIMIT],['movieFav','movie_favorites',LIMIT],
   ['watchSeries','series_watchlist',1],['watchMovies','movie_watchlist',1]
  ];
  const results=await Promise.allSettled([...specs.map(([,kind,lim])=>listPage(kind,lim,0)),actorPage()]);
  results.slice(0,specs.length).forEach((res,i)=>{
   if(res.status!=='fulfilled')return;const [key]=specs[i],val=res.value;
   if(key==='watchSeries')state.watchSeries=val.count;
   else if(key==='watchMovies')state.watchMovies=val.count;
   else state[key]={rows:val.rows,count:val.count};
  });
  const actorsResult=results[specs.length];if(actorsResult?.status==='fulfilled')state.actors=actorsResult.value;
  return true;
 })().finally(()=>{profileTask=null});
 return profileTask;
}
function patchStadium(count){
 if(routeNow()!=='profile'||!Number.isFinite(Number(count)))return false;
 const card=statCard('Jogos no Estádio');if(!card)return false;
 const val=q('b,strong,.value,.stat-value',card);if(!val)return false;
 val.textContent=Number(count).toLocaleString('pt-BR');card.dataset.ct475Stadium='1';return true;
}
async function loadStadium(){
 if(stadiumTask)return stadiumTask;
 stadiumTask=(async()=>{try{
  const raw=unwrap(await timeout(core.rpc('cinetracker_sports_stadium_summary_v296',{}),15000));
  const count=raw?.stadium_events??raw?.[0]?.stadium_events;if(count!=null)patchStadium(count);
 }catch{}finally{stadiumTask=null}})();return stadiumTask;
}
function bindDaily(){
 try{core.setActivityOpen?.(openDay);if(window.__ctR471&&typeof window.__ctR471==='object')window.__ctR471.openDay=openDay}catch{}
}
function renderProfile(){
 if(routeNow()!=='profile')return false;
 for(const key of Object.keys(defs))renderSummary(key);
 patchWatchlistStats();bindDaily();
 const root=q('[data-profile]');if(root)root.dataset.ct475Profile='canonical-12+13th';
 return true;
}
async function applyProfile(){
 if(routeNow()!=='profile')return false;
 renderProfile();await loadProfile();if(routeNow()!=='profile')return false;renderProfile();void loadStadium();return true;
}
function scheduleProfile(){
 const token=++profileScheduleToken;
 setTimeout(()=>{if(token===profileScheduleToken&&routeNow()==='profile')void applyProfile()},60);
 for(const ms of [180,500,1100,2200,4200])setTimeout(()=>{if(token===profileScheduleToken&&routeNow()==='profile')renderProfile()},ms);
}

function closeAll(){q('[data-ct475-all-screen]')?.remove();fullLocks.clear()}
function createAllScreen(title){
 closeAll();const ov=document.createElement('div');ov.className='ct475-all-screen';ov.dataset.ct475AllScreen='1';
 ov.innerHTML='<section class="ct475-all-panel" role="dialog" aria-modal="true"><header><div><small>PERFIL</small><h2>'+esc(title)+'</h2><p data-ct475-all-count>Carregando...</p></div><button type="button" class="btn" data-ct475-all-close aria-label="Fechar">✕ Fechar</button></header><div class="ct475-all-grid" data-ct475-all-grid><div class="empty">Carregando...</div></div></section>';
 document.body.appendChild(ov);q('[data-ct475-all-close]',ov)?.focus();return ov;
}
async function appendCards(grid,list,render){
 if(!grid)return;for(let i=0;i<list.length;i+=24){
  const t=document.createElement('template');t.innerHTML=list.slice(i,i+24).map(render).join('');grid.appendChild(t.content);
  await new Promise(r=>requestAnimationFrame(r));
 }
}
async function openMediaList(kind,title){
 if(fullLocks.has(kind))return false;fullLocks.add(kind);
 const ov=createAllScreen(title),grid=q('[data-ct475-all-grid]',ov),count=q('[data-ct475-all-count]',ov);if(grid)grid.innerHTML='';
 let total=0,loaded=0;
 try{
  for(let page=0;page<50;page++){
   if(!ov.isConnected)break;
   const res=await listPage(kind,240,page*240);total=res.count;if(page===0&&count)count.textContent=total.toLocaleString('pt-BR')+' itens';
   await appendCards(grid,res.rows,mediaCard);loaded+=res.rows.length;
   if(!res.rows.length||loaded>=total)break;
  }
  if(grid&&!loaded)grid.innerHTML='<div class="empty">Nenhum item nesta lista.</div>';return true;
 }catch(e){if(grid)grid.innerHTML='<div class="error">Não foi possível carregar esta lista agora.</div>';return false}
 finally{fullLocks.delete(kind)}
}
async function openActors(){
 const kind='actors';if(fullLocks.has(kind))return false;fullLocks.add(kind);
 const ov=createAllScreen('Atores Favoritos'),grid=q('[data-ct475-all-grid]',ov),count=q('[data-ct475-all-count]',ov);
 try{const res=state.actors.count?state.actors:await actorPage();if(count)count.textContent=res.count.toLocaleString('pt-BR')+' itens';if(grid){grid.innerHTML='';await appendCards(grid,res.rows,actorCard);if(!res.rows.length)grid.innerHTML='<div class="empty">Nenhum ator favorito.</div>'}return true}
 catch{if(grid)grid.innerHTML='<div class="error">Não foi possível carregar os atores agora.</div>';return false}
 finally{fullLocks.delete(kind)}
}
function openFullList(key){if(key==='actors')return openActors();const def=defs[key];return def?openMediaList(def.kind,def.label):Promise.resolve(false)}
function openWatchlist(kind){return openMediaList(kind==='movie'?'movie_watchlist':'series_watchlist',kind==='movie'?'Filmes na Watchlist':'Séries na Watchlist')}

function fmtTime(v){try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v))}catch{return''}}
function activityHtml(x){
 const type=String(x?.item_type||''),sport=type==='sport',movie=type==='movie',id=num(x?.media_id),season=num(x?.season_number),episode=num(x?.episode_number),eventId=num(x?.event_id);
 const title=esc(x?.media_title||x?.title||'Item assistido'),ep=type==='episode'?'S'+String(season).padStart(2,'0')+' E'+String(episode).padStart(2,'0'):'';
 const meta=[sport?'Esporte':movie?'Filme':'Episódio',ep,fmtTime(x?.watched_at),num(x?.runtime_minutes)?num(x.runtime_minutes)+' min':''].filter(Boolean).join(' · ');
 const attrs=sport?' data-ct475-sport-id="'+eventId+'"':' data-ct475-media-id="'+id+'" data-ct475-item-type="'+esc(type)+'" data-ct475-season="'+season+'" data-ct475-episode="'+episode+'"';
 return '<article class="ct171-activity-item ct475-history-row" data-ct475-history-row><div class="ct171-activity-thumb">'+(sport?'🏆':'')+'</div><div class="ct475-history-copy"><b>'+title+'</b><small>'+esc(meta)+'</small></div><button type="button" class="chip ct475-undo" data-ct475-undo'+attrs+' title="Desmarcar visto" aria-label="Desmarcar visto">↶</button></article>';
}
async function openDay(day){
 const d=String(day||'').slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
 const token=++dayToken;q('.ct171-activity-overlay')?.remove();
 const ov=document.createElement('div');ov.className='ct171-activity-overlay';
 ov.innerHTML='<div class="ct171-activity-box"><div class="panel-head"><div><small>HISTÓRICO</small><h2>'+esc(new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))+'</h2></div><button type="button" class="btn" data-ct171-activity-close>✕ Fechar</button></div><div data-ct171-activity-items><div class="ct321-loading">Carregando histórico...</div></div></div>';
 document.body.appendChild(ov);
 if(dayTask)return dayTask;
 dayTask=(async()=>{try{
  const list=arrayFrom(await timeout(core.rpc('cinetracker_activity_items_by_day_v475',{p_day:d,p_tz:core.tz?.()||'America/Sao_Paulo'}),20000));
  if(token!==dayToken||!ov.isConnected)return false;const box=q('[data-ct171-activity-items]',ov);
  if(box)box.innerHTML=list.map(activityHtml).join('')||'<div class="empty">Nenhum item registrado neste dia.</div>';return true;
 }catch(e){if(token===dayToken){const box=q('[data-ct171-activity-items]',ov);if(box)box.innerHTML='<div class="error">Não foi possível carregar o histórico agora. <button type="button" class="chip" data-ct475-day-retry="'+esc(d)+'">Tentar novamente</button></div>'}return false}
 finally{dayTask=null}})();return dayTask;
}
async function undo(btn){
 if(!btn||undoLocks.has(btn))return false;undoLocks.add(btn);btn.disabled=true;btn.setAttribute('aria-busy','true');
 const row=btn.closest('[data-ct475-history-row]'),parent=row?.parentNode,next=row?.nextSibling;if(row)row.remove();
 try{
  const sportId=num(btn.dataset.ct475SportId);
  if(sportId>0)await timeout(core.rpc('cinetracker_unmark_sport_history_v426',{p_event_id:sportId}),15000);
  else await timeout(core.rpc('cinetracker_unmark_history_item_v426',{p_media_id:num(btn.dataset.ct475MediaId),p_item_type:String(btn.dataset.ct475ItemType||''),p_season_number:num(btn.dataset.ct475Season)||null,p_episode_number:num(btn.dataset.ct475Episode)||null}),15000);
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r475-history-undo'}}));return true;
 }catch(e){if(parent&&row)parent.insertBefore(row,next&&next.parentNode===parent?next:null);btn.disabled=false;btn.removeAttribute('aria-busy');try{core.toast?.('Não foi possível desmarcar como visto.')}catch{}return false}
 finally{undoLocks.delete(btn)}
}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const more=t.closest('[data-ct475-more]');if(more){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void openFullList(String(more.dataset.ct475More||''));return}
 const watch=t.closest('[data-ct475-watchlist]');if(watch&&routeNow()==='profile'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void openWatchlist(String(watch.dataset.ct475Watchlist||''));return}
 const undoBtn=t.closest('[data-ct475-undo]');if(undoBtn){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void undo(undoBtn);return}
 const retry=t.closest('[data-ct475-day-retry]');if(retry){e.preventDefault();void openDay(String(retry.dataset.ct475DayRetry||''));return}
 if(t.closest('[data-ct475-all-close]')||t.matches?.('[data-ct475-all-screen]')){e.preventDefault();closeAll();return}
 const nav=t.closest('[data-nav="profile"]');if(nav)setTimeout(scheduleProfile,0);
},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();if((e.key==='Enter'||e.key===' ')&&e.target?.dataset?.ct475Watchlist){e.preventDefault();void openWatchlist(String(e.target.dataset.ct475Watchlist))}},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='profile')scheduleProfile()},0));
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile'){for(const k of Object.keys(defs))state[k]={rows:[],count:0};state.watchSeries=0;state.watchMovies=0;scheduleProfile()}});

const style=document.createElement('style');style.id='ct475-style';style.textContent='[data-profile] [data-ct475-profile-row]{display:flex!important;flex-flow:row wrap!important;align-items:stretch!important;gap:16px!important;max-height:none!important;height:auto!important;overflow:visible!important}\\n[data-profile] [data-ct475-profile-row]>.card{box-sizing:border-box!important;flex:0 0 150px!important;width:150px!important;min-width:150px!important;max-width:150px!important}\\n[data-profile] [data-ct475-profile-row] .poster,.ct475-all-grid .poster{aspect-ratio:2/3!important}\\n[data-profile] [data-ct475-profile-row] .card-body b,.ct475-all-grid .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}\\n.ct475-more-poster{display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(255,255,255,.06)!important}.ct475-more-poster span{font-size:18px!important;font-weight:800!important}\\n.ct475-all-screen{position:fixed;inset:0;z-index:2147483000;background:rgba(3,10,15,.88);backdrop-filter:blur(14px);overflow:auto;padding:24px}\\n.ct475-all-panel{max-width:1240px;margin:0 auto;background:rgba(10,25,34,.97);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px;box-shadow:0 24px 80px rgba(0,0,0,.45)}\\n.ct475-all-panel>header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}.ct475-all-panel h2{margin:2px 0}.ct475-all-panel p{margin:0;opacity:.68}\\n.ct475-all-grid{display:grid;grid-template-columns:repeat(auto-fill,150px);gap:16px;align-items:start}.ct475-all-grid>.card{width:150px!important;min-width:150px!important;max-width:150px!important}\\n.ct475-history-row{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important}.ct475-history-copy{min-width:0!important}.ct475-history-copy b,.ct475-history-copy small{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}\\n.ct475-undo{width:30px!important;height:30px!important;min-width:30px!important;padding:0!important;display:inline-grid!important;place-items:center!important;font-size:15px!important;border-radius:9px!important}\\n@media(max-width:720px){.ct475-all-screen{padding:10px}.ct475-all-panel{padding:12px}.ct475-all-grid{grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:10px}.ct475-all-grid>.card{width:100%!important;min-width:0!important;max-width:none!important}}';
if(!q('#ct475-style'))document.head.appendChild(style);

bindDaily();if(routeNow()==='profile')scheduleProfile();
window.__ctR475={version:'1.0.265',scope:'profile-canonical-lists+watchlist+daily-history',scheduleProfile,applyProfile,openFullList,openWatchlist,openDay,undo,state};
window.__ctR475Marker='profile-v475-12+13th+watchlist-paged+daily-v475';
})();