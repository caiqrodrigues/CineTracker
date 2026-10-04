/* CineTracker Web 1.0.260 r470 — stable base owners + Profile/History final authority. */
(()=>{'use strict';
if(window.__ctR470?.version==='1.0.260')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('TIMEOUT')),ms))]);
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{return!!session?.access_token&&typeof rpc==='function'}catch{return false}};
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?unwrap(v[0]):v&&typeof v==='object'&&!Array.isArray(v)&&Object.prototype.hasOwnProperty.call(v,'data')?unwrap(v.data):v;
async function waitAuth(){for(const ms of[0,80,180,360,700,1200,2000,3200]){if(ms)await sleep(ms);if(authReady())return true}return false}

function forYouActive(){
 if(routeNow()!=='discover')return false;
 try{const s=String(window.__ctR288R263?.discover263?.tab||'');if(s)return s==='foryou'}catch{}
 const b=q('[data-ct319-tab="foryou"].active,[data-ct315-tab="foryou"].active,[data-ct263-discover-tab="foryou"].active,[data-discover-tab="foryou"].active,[aria-selected="true"][data-ct319-tab="foryou"]');
 return!!b;
}
function wakeDataOwners(){
 const r=routeNow();
 if(r==='home'){try{window.__ctR399?.settle?.(true)}catch{}}
 if(r==='discover'&&forYouActive()){try{window.__ctR464?.activate?.()}catch{}}
 return r;
}
async function authWake(){
 if(!(await waitAuth()))return false;
 wakeDataOwners();
 return true;
}

const PROFILE_LIMIT=13;
const PROFILE_TITLES=new Set([
 'series','filmes','series favoritas','filmes favoritos','atores','atores favoritos',
 'series watchlist','series da watchlist','filmes watchlist','filmes da watchlist'
]);
let actorTask=null,actorCache=[],actorTotal=0,profileSeq=0;
function panelTitle(panel){return q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel)?.textContent||''}
function wantedPanel(panel){return PROFILE_TITLES.has(norm(panelTitle(panel)))}
function cardsIn(row){
 return qa(':scope>*',row).filter(el=>{
  if(el.matches?.('[data-ct470-more],[data-ct467-more],[data-ct465-more],[data-ct457-more],[data-ct455-more],[data-ct424-more]'))return false;
  return el.matches?.('.card,[data-media-id],[data-person-id],article')||!!q('.poster,img,[class*="poster"],[class*="avatar"]',el);
 });
}
function cardRow(panel){
 const candidates=qa('.row,.ct424-profile-list,[class*="rail"],[class*="row"]',panel);
 let best=null,bestN=-1;
 for(const row of candidates){const n=cardsIn(row).length;if(n>bestN){best=row;bestN=n}}
 return best;
}
function headerCount(panel){
 const text=q('.panel-head small',panel)?.textContent||'';
 const m=String(text).match(/\d[\d.]*/);
 return m?num(m[0].replaceAll('.','')):0;
}
function nativeMore(panel){
 return qa('button',panel).find(b=>
  !b.dataset.ct470More&&!b.dataset.ct467More&&!b.dataset.ct465More&&!b.dataset.ct457More&&!b.dataset.ct455More&&!b.dataset.ct424More&&norm(b.textContent).includes('ver mais')
 )||null;
}
function actorCard(a){
 const id=num(a?.tmdb_person_id),path=String(a?.profile_path||''),src=path?(path.startsWith('http')?path:'https://image.tmdb.org/t/p/w185'+path):'';
 return '<article class="card" data-person-id="'+id+'"><button type="button" data-person="'+id+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div class="card-body"><b>'+esc(a?.actor_name||'Ator')+'</b><small>Ator favorito</small></div></button></article>';
}
function legacyMoreCleanup(panel){
 qa('[data-ct467-more],[data-ct465-more],[data-ct457-more],[data-ct455-more],[data-ct424-more]',panel).forEach(x=>x.remove());
}
function expandPanel(panel,row,trigger,more){
 panel.dataset.ct470Expanded='1';
 const isActor=norm(panelTitle(panel)).includes('ator');
 if(isActor&&actorCache.length){
  row.innerHTML=actorCache.map(actorCard).join('');
  more?.remove();
  return true;
 }
 for(const c of cardsIn(row)){c.hidden=false;c.style.display=''}
 more?.remove();
 if(trigger?.isConnected){
  trigger.click();
  for(const ms of[0,120,400])setTimeout(()=>{if(panel.dataset.ct470Expanded==='1')for(const c of cardsIn(row)){c.hidden=false;c.style.display=''}},ms);
 }
 return true;
}
function makeMore(panel,row,total,trigger){
 const more=document.createElement('button');
 more.type='button';more.dataset.ct470More='1';more.className='ct470-profile-more';
 more.setAttribute('aria-label','Ver mais '+panelTitle(panel));
 more.innerHTML='<span aria-hidden="true">›</span><small>Ver mais</small>';
 more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();expandPanel(panel,row,trigger,more)});
 row.appendChild(more);
 panel.dataset.ct470ProfileLimit='13+more';
 panel.dataset.ct470Total=String(total);
 return more;
}
function applyPanel(panel){
 if(!wantedPanel(panel))return false;
 const row=cardRow(panel);if(!row)return false;
 const trigger=nativeMore(panel);
 legacyMoreCleanup(panel);
 if(trigger){trigger.dataset.ct470NativeMore='1';trigger.style.display='none'}
 const cards=cardsIn(row);
 if(!cards.length)return false;
 if(panel.dataset.ct470Expanded==='1'){
  cards.forEach(c=>{c.hidden=false;c.style.display=''});
  qa('[data-ct470-more]',panel).forEach(x=>x.remove());
  return true;
 }
 qa('[data-ct470-more]',panel).forEach(x=>x.remove());
 const actor=norm(panelTitle(panel)).includes('ator');
 const total=Math.max(headerCount(panel),cards.length,actor?actorTotal:0);
 cards.forEach((c,i)=>{c.hidden=i>=PROFILE_LIMIT;c.style.display=i>=PROFILE_LIMIT?'none':''});
 if(total>PROFILE_LIMIT)makeMore(panel,row,total,trigger);
 panel.dataset.ct470ProfileLimit=total>PROFILE_LIMIT?'13+more':'all';
 return true;
}
async function hydrateActors(){
 if(routeNow()!=='profile'||actorTask)return actorTask||false;
 actorTask=(async()=>{try{
  if(!(await waitAuth()))return false;
  const raw=unwrap(await timeout(rpc('cinetracker_profile_actors_v465',{p_limit:50}),7000));
  const list=rows(raw?.rows),total=num(raw?.count);
  if(routeNow()!=='profile'||!list.length)return false;
  actorCache=list;actorTotal=Math.max(total,list.length);
  const root=q('[data-profile]');if(!root)return false;
  const panel=qa('section.panel,.panel',root).find(p=>['atores','atores favoritos'].includes(norm(panelTitle(p))));
  if(!panel)return false;
  const row=cardRow(panel);if(!row)return false;
  panel.dataset.ct470Expanded='';
  row.innerHTML=list.map(actorCard).join('');
  const small=q('.panel-head small',panel);if(small)small.textContent=String(actorTotal);
  applyPanel(panel);
  panel.dataset.ct470Actors=String(list.length)+'/'+String(actorTotal);
  return true;
 }catch(e){document.documentElement.dataset.ct470ActorsError=String(e?.message||e);return false}
 finally{actorTask=null}})();
 return actorTask;
}
function applyProfile(){
 if(routeNow()!=='profile')return false;
 const root=q('[data-profile]');if(!root)return false;
 let changed=false;
 for(const panel of qa('section.panel,.panel',root))if(applyPanel(panel))changed=true;
 root.dataset.ct470Profile='13+more';
 return changed;
}
function scheduleProfile(){
 const seq=++profileSeq;
 for(const ms of[0,100,280,650,1300,2400]){
  setTimeout(()=>{if(seq!==profileSeq||routeNow()!=='profile')return;applyProfile();if(ms===280)void hydrateActors()},ms);
 }
}
const baseProfileLoad=window.__ctR424?.loadProfile?.bind(window.__ctR424)||null;
if(baseProfileLoad)window.__ctR424.loadProfile=async function(){
 const out=await baseProfileLoad(...arguments);
 if(routeNow()==='profile'){applyProfile();void hydrateActors()}
 return out;
};

const historyLocks=new Set();
const fmtDate=v=>{try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v))}catch{return''}};
function historyRow(x){
 const type=String(x?.item_type||''),sport=type==='sport',movie=type==='movie';
 const id=num(x?.media_id),season=num(x?.season_number),episode=num(x?.episode_number),eventId=num(x?.event_id);
 const meta=type==='episode'?'S'+String(season).padStart(2,'0')+'E'+String(episode).padStart(2,'0')+(x.title&&x.title!==x.media_title?' · Ep: '+x.title:'')+' · '+fmtDate(x.watched_at):movie?'Filme · '+fmtDate(x.watched_at):'Esporte · '+fmtDate(x.watched_at)+(num(x.runtime_minutes)?' · '+num(x.runtime_minutes)+' min':'');
 const attrs=sport?'data-event-id="'+eventId+'"':'data-media-id="'+id+'" data-season="'+season+'" data-episode="'+episode+'"';
 const key=type+':'+id+':'+eventId+':'+season+':'+episode+':'+num(x.sort_id);
 return '<article class="ct171-activity-item ct470-history-row" data-ct470-history-row="'+esc(key)+'"><div class="ct171-activity-thumb">'+(sport?'🏆':'')+'</div><div class="ct470-history-main"><div class="ct470-history-copy"><b>'+esc(x.media_title||x.title||'Item assistido')+'</b><span>'+esc(meta)+'</span><small>'+esc(type==='episode'?'Episódio assistido':movie?'Filme assistido':'Evento assistido')+'</small></div><button type="button" class="chip ct470-undo" data-ct470-undo="1" data-kind="'+esc(type)+'" '+attrs+' aria-label="Desmarcar visto" title="Desmarcar visto">↶</button></div></article>';
}
async function openDay(day){
 q('.ct171-activity-overlay')?.remove();
 const ov=document.createElement('div');ov.className='ct171-activity-overlay';
 ov.innerHTML='<div class="ct171-activity-box"><div class="panel-head"><div><small>HISTÓRICO</small><h2>'+esc(new Date(day+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))+'</h2></div><button type="button" class="btn" data-ct470-history-close>✕ Fechar</button></div><div data-ct470-history-items><div class="ct321-loading">Carregando histórico...</div></div></div>';
 document.body.appendChild(ov);
 try{
  if(!(await waitAuth()))throw new Error('AUTH_NOT_READY');
  const raw=unwrap(await timeout(rpc('cinetracker_activity_items_by_day_v426',{p_day:day,p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'}),7000));
  const box=q('[data-ct470-history-items]',ov),list=rows(raw);
  if(box)box.innerHTML=list.map(historyRow).join('')||'<div class="empty">Nenhum item registrado neste dia.</div>';
 }catch(e){
  const box=q('[data-ct470-history-items]',ov);if(box)box.innerHTML='<div class="error">Não foi possível carregar o histórico agora.</div>';
  document.documentElement.dataset.ct470HistoryError=String(e?.message||e);
 }
}
async function undoHistory(btn){
 if(!btn||btn.disabled)return false;
 const row=btn.closest('[data-ct470-history-row]'),key=String(row?.dataset.ct470HistoryRow||'');
 if(!key||historyLocks.has(key))return false;
 historyLocks.add(key);btn.disabled=true;btn.setAttribute('aria-busy','true');
 const parent=row?.parentNode,next=row?.nextSibling;if(row)row.remove();
 try{
  const kind=String(btn.dataset.kind||'');
  if(kind==='sport'){
   const eventId=num(btn.dataset.eventId);if(!eventId)throw new Error('EVENT_ID_REQUIRED');
   await rpc('cinetracker_unmark_sport_history_v426',{p_event_id:eventId});
  }else{
   const mediaId=num(btn.dataset.mediaId);if(!mediaId||!['movie','episode'].includes(kind))throw new Error('MEDIA_ITEM_REQUIRED');
   await rpc('cinetracker_unmark_history_item_v426',{p_media_id:mediaId,p_item_type:kind,p_season_number:kind==='episode'?num(btn.dataset.season):null,p_episode_number:kind==='episode'?num(btn.dataset.episode):null});
  }
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r470-history-undo'}}));
  return true;
 }catch(e){
  if(parent&&row){if(next&&next.parentNode===parent)parent.insertBefore(row,next);else parent.appendChild(row)}
  btn.disabled=false;btn.removeAttribute('aria-busy');
  try{toast('Não foi possível desmarcar como visto.')}catch{}
  document.documentElement.dataset.ct470UndoError=String(e?.message||e);
  return false;
 }finally{historyLocks.delete(key)}
}
function bindHistory(){
 try{ct171OpenActivityDay=openDay}catch{}
 window.ct171OpenActivityDay=openDay;
 if(window.__ctR426&&typeof window.__ctR426==='object'){window.__ctR426.openDay=openDay;window.__ctR426.undoHistory=undoHistory}
 if(window.__ctR455&&typeof window.__ctR455==='object')window.__ctR455.openDay=openDay;
}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const undo=t.closest('[data-ct470-undo]');if(undo){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void undoHistory(undo);return}
 if(t.closest('[data-ct470-history-close]')){e.preventDefault();e.stopImmediatePropagation();q('.ct171-activity-overlay')?.remove();return}
 if(t.closest('[data-nav="profile"]'))setTimeout(scheduleProfile,0);
 if(t.closest('[data-nav],[data-home-tab],[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]')){
  for(const ms of[0,100,300,700,1400])setTimeout(wakeDataOwners,ms);
 }
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{bindHistory();wakeDataOwners();if(routeNow()==='profile')scheduleProfile()},0));
window.addEventListener('cinetracker:data-changed',e=>{
 const source=String(e?.detail?.source||'');
 if(routeNow()==='profile'&&!source.includes('r470-history-undo'))scheduleProfile();
 if(routeNow()==='home'||forYouActive())setTimeout(wakeDataOwners,80);
});

const style=document.createElement('style');style.id='ct470-style';style.textContent=`
[data-profile] [data-ct467-more],[data-profile] [data-ct465-more],[data-profile] [data-ct457-more],[data-profile] [data-ct455-more],[data-profile] [data-ct424-more]{display:none!important}
[data-profile] .ct470-profile-more{box-sizing:border-box!important;display:flex!important;flex:0 0 75px!important;width:75px!important;min-width:75px!important;max-width:75px!important;align-self:stretch!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:7px!important;padding:8px 5px!important;border:1px solid rgba(86,190,255,.42)!important;border-radius:12px!important;background:linear-gradient(180deg,rgba(16,43,58,.92),rgba(8,25,35,.96))!important;color:inherit!important;cursor:pointer!important}
[data-profile] .ct470-profile-more>span{font-size:28px!important;line-height:1!important}[data-profile] .ct470-profile-more>small{font-size:10px!important;white-space:nowrap!important}
.ct470-history-main{display:flex!important;align-items:center!important;gap:8px!important;min-width:0!important;width:100%!important}.ct470-history-copy{display:flex!important;flex:1 1 auto!important;min-width:0!important;flex-direction:column!important}.ct470-history-copy b,.ct470-history-copy span,.ct470-history-copy small{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}.ct470-undo{display:inline-flex!important;flex:0 0 28px!important;width:28px!important;min-width:28px!important;height:28px!important;min-height:28px!important;padding:0!important;align-items:center!important;justify-content:center!important;border-radius:999px!important;font-size:14px!important;line-height:1!important;pointer-events:auto!important}
`;
if(!q('#ct470-style'))document.head.appendChild(style);

bindHistory();
void authWake();
queueMicrotask(()=>{wakeDataOwners();if(routeNow()==='profile')scheduleProfile()});
window.__ctR470={version:'1.0.260',scope:'stable-r464-data-owners+profile-stats-guard+13-more+history-undo',profileLimit:PROFILE_LIMIT,applyProfile,openDay,undoHistory,wake:wakeDataOwners};
window.__ctR470Marker='stable-r464-aliases+profile-stats-nonzero+13-more+actors-v465+history-v426';
})();