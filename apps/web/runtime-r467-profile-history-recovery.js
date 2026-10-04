/* CineTracker Web 1.0.257 r467 — restore stable Home/For You baseline; fix Profile rails and daily-history undo. */
(()=>{'use strict';
if(window.__ctR467?.version==='1.0.257')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{if(typeof window.__ctR469Route==='function')return String(window.__ctR469Route()||'');return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{if(typeof window.__ctR469Session==='function'&&typeof window.__ctR469Rpc==='function')return!!window.__ctR469Session()?.access_token;return!!session?.access_token&&typeof rpc==='function'}catch{return false}};
const rpcCall467=(name,args)=>{try{if(typeof window.__ctR469Rpc==='function')return Promise.resolve(window.__ctR469Rpc(name,args));if(typeof rpc==='function')return Promise.resolve(rpc(name,args))}catch(e){return Promise.reject(e)}return Promise.reject(new Error('RPC_UNAVAILABLE'))};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('TIMEOUT')),ms))]);
const dataOf=v=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.prototype.hasOwnProperty.call(v,'data')?v.data:v;
async function waitAuth467(){for(const ms of [0,100,250,500,900,1500,2400,3600]){if(ms)await sleep(ms);if(authReady())return true}return false}

/* PROFILE — exactly 13 cards; 14th visual item is the compact Ver mais control. */
const PROFILE_LIMIT=13;
const PROFILE_TITLES=new Set(['series','filmes','series favoritas','filmes favoritos','atores','atores favoritos','series watchlist','series da watchlist','filmes watchlist','filmes da watchlist']);
let profileRun467=0,actorsTask467=null,actorCache467=[];
function panelTitle467(panel){return q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel)?.textContent||''}
function wantedPanel467(panel){return PROFILE_TITLES.has(norm(panelTitle467(panel)))}
function cardRow467(panel){
 const candidates=qa('.row,.ct424-profile-list,[class*="rail"],[class*="row"]',panel);let best=null,bestN=-1;
 for(const row of candidates){const n=cardsIn467(row).length;if(n>bestN){best=row;bestN=n}}
 return best;
}
function cardsIn467(row){return qa(':scope>*',row).filter(el=>!el.matches?.('[data-ct467-more],[data-ct465-more],[data-ct457-more],[data-ct455-more],[data-ct424-more]')&&(el.matches?.('.card,[data-media-id],[data-person-id],article')||q('.poster,img,[class*="poster"],[class*="avatar"]',el)))}
function headerCount467(panel){const s=q('.panel-head small',panel)?.textContent||'';const m=String(s).match(/\d[\d.]*/);return m?num(m[0].replaceAll('.','')):0}
function nativeMore467(panel){return qa('button',panel).find(b=>!b.dataset.ct467More&&!b.dataset.ct455More&&!b.dataset.ct457More&&!b.dataset.ct465More&&!b.dataset.ct424More&&norm(b.textContent).includes('ver mais'))||null}
function actorCard467(a){
 const id=num(a?.tmdb_person_id),path=String(a?.profile_path||''),src=path?(typeof img==='function'?img(path,'w185'):path):'';
 return '<article class="card" data-person-id="'+id+'"><button type="button" data-person="'+id+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div class="card-body"><b>'+esc(a?.actor_name||'Ator')+'</b><small>Ator favorito</small></div></button></article>';
}
function expandActors467(panel,row,button){
 if(actorCache467.length>PROFILE_LIMIT){row.innerHTML=actorCache467.map(actorCard467).join('');button?.remove();panel.dataset.ct467ProfileLimit='expanded';return true}
 const trigger=nativeMore467(panel);if(trigger?.isConnected){trigger.click();return true}
 return false;
}
function makeMore467(panel,row,total){
 const more=document.createElement('button');more.type='button';more.dataset.ct467More='1';more.className='ct467-profile-more';more.setAttribute('aria-label','Ver mais '+panelTitle467(panel));more.innerHTML='<span aria-hidden="true">›</span><small>Ver mais</small>';
 const trigger=nativeMore467(panel);if(trigger){trigger.dataset.ct467NativeMore='1';trigger.style.display='none'}
 more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(norm(panelTitle467(panel)).includes('ator')){expandActors467(panel,row,more);return}if(trigger?.isConnected){trigger.click();return}for(const c of cardsIn467(row)){c.hidden=false;c.style.display=''}more.remove();panel.dataset.ct467ProfileLimit='expanded'});
 row.appendChild(more);panel.dataset.ct467ProfileLimit='13+more';panel.dataset.ct467Total=String(total);return more;
}
function applyPanel467(panel){
 if(!wantedPanel467(panel))return false;const row=cardRow467(panel);if(!row)return false;
 qa('[data-ct467-more],[data-ct465-more],[data-ct457-more],[data-ct455-more],[data-ct424-more]',panel).forEach(x=>x.remove());
 for(const b of qa('button',row))if(norm(b.textContent).includes('ver mais'))b.remove();
 const headerMore=nativeMore467(panel);if(headerMore){headerMore.dataset.ct467NativeMore='1';headerMore.style.display='none'}
 const cards=cardsIn467(row),total=Math.max(headerCount467(panel),cards.length);
 if(!cards.length)return false;
 cards.forEach((card,i)=>{card.hidden=i>=PROFILE_LIMIT;card.style.display=i>=PROFILE_LIMIT?'none':''});
 if(total>PROFILE_LIMIT)makeMore467(panel,row,total);else panel.dataset.ct467ProfileLimit='all';return true;
}
async function hydrateActors467(){
 if(routeNow()!=='profile'||actorsTask467)return actorsTask467||false;
 actorsTask467=(async()=>{try{
  if(!(await waitAuth467()))return false;
  const raw=dataOf(await timeout(rpcCall467('cinetracker_profile_actors_v465',{p_limit:50}),7000)),list=rows(raw?.rows),total=num(raw?.count);
  if(routeNow()!=='profile'||!list.length)return false;actorCache467=list;
  const root=q('[data-profile]');if(!root)return false;
  const panel=qa('section.panel,.panel',root).find(p=>['atores','atores favoritos'].includes(norm(panelTitle467(p))));if(!panel)return false;
  const row=cardRow467(panel);if(!row)return false;
  row.innerHTML=list.slice(0,PROFILE_LIMIT).map(actorCard467).join('');const small=q('.panel-head small',panel);if(small)small.textContent=String(total);
  qa('[data-ct467-more],[data-ct465-more],[data-ct457-more],[data-ct455-more],[data-ct424-more]',panel).forEach(x=>x.remove());
  if(total>PROFILE_LIMIT)makeMore467(panel,row,total);panel.dataset.ct467Actors=String(list.length)+'/'+String(total);return true;
 }catch(e){document.documentElement.dataset.ct467ActorsError=String(e?.message||e);return false}finally{actorsTask467=null}})();
 return actorsTask467;
}
function applyProfile467(){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]');if(!root)return false;let changed=false;
 for(const panel of qa('section.panel,.panel',root))if(applyPanel467(panel))changed=true;
 void hydrateActors467();root.dataset.ct467Profile='13+more';return changed;
}
function scheduleProfile467(){const run=++profileRun467;for(const ms of [0,120,350,800,1600,3200,5400,6800])setTimeout(()=>{if(run===profileRun467&&routeNow()==='profile')applyProfile467()},ms)}

/* DAILY HISTORY — compact per-row undo with bigint media_id kept numeric. */
const historyLocks467=new Set();
const dayFmt467=v=>{try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v))}catch{return''}};
function historyRow467(x){
 const type=String(x?.item_type||''),sport=type==='sport',movie=type==='movie',id=num(x?.media_id),season=num(x?.season_number),episode=num(x?.episode_number),eventId=num(x?.event_id);
 const meta=type==='episode'?'S'+String(season).padStart(2,'0')+'E'+String(episode).padStart(2,'0')+(x.title&&x.title!==x.media_title?' · Ep: '+x.title:'')+' · '+dayFmt467(x.watched_at):movie?'Filme · '+dayFmt467(x.watched_at):'Esporte · '+dayFmt467(x.watched_at)+(num(x.runtime_minutes)?' · '+num(x.runtime_minutes)+' min':'');
 const data=sport?'data-event-id="'+eventId+'"':'data-media-id="'+id+'" data-item-type="'+esc(type)+'" data-season="'+season+'" data-episode="'+episode+'"';
 const key=type+':'+id+':'+eventId+':'+season+':'+episode+':'+num(x.sort_id);
 return '<article class="ct171-activity-item ct467-history-row" data-ct467-history-row="'+esc(key)+'"><div class="ct171-activity-thumb">'+(sport?'🏆':'')+'</div><div class="ct467-history-main"><div class="ct467-history-copy"><b>'+esc(x.media_title||x.title||'Item assistido')+'</b><span>'+esc(meta)+'</span><small>'+esc(type==='episode'?'Episódio assistido':movie?'Filme assistido':'Evento assistido')+'</small></div><button type="button" class="chip ct467-undo" data-ct467-undo="1" data-kind="'+esc(type)+'" '+data+' aria-label="Desmarcar visto" title="Desmarcar visto">↶</button></div></article>';
}
async function openDay467(day){
 q('.ct171-activity-overlay')?.remove();const ov=document.createElement('div');ov.className='ct171-activity-overlay';
 ov.innerHTML='<div class="ct171-activity-box"><div class="panel-head"><div><small>HISTÓRICO</small><h2>'+esc(new Date(day+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))+'</h2></div><button type="button" class="btn" data-ct467-history-close>✕ Fechar</button></div><div data-ct467-history-items><div class="ct321-loading">Carregando histórico...</div></div></div>';document.body.appendChild(ov);
 try{
  if(!(await waitAuth467()))throw new Error('AUTH_NOT_READY');
  const raw=dataOf(await timeout(rpcCall467('cinetracker_activity_items_by_day_v426',{p_day:day,p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'}),7000)),list=rows(raw),box=q('[data-ct467-history-items]',ov);
  if(box)box.innerHTML=list.map(historyRow467).join('')||'<div class="empty">Nenhum item registrado neste dia.</div>';
 }catch(e){const box=q('[data-ct467-history-items]',ov);if(box)box.innerHTML='<div class="error">Não foi possível carregar o histórico agora.</div>';document.documentElement.dataset.ct467HistoryError=String(e?.message||e)}
}
async function undoHistory467(btn){
 if(!btn||btn.disabled)return false;const row=btn.closest('[data-ct467-history-row]'),key=String(row?.dataset.ct467HistoryRow||'');if(!key||historyLocks467.has(key))return false;
 historyLocks467.add(key);btn.disabled=true;btn.setAttribute('aria-busy','true');const parent=row?.parentNode,next=row?.nextSibling;if(row)row.remove();
 try{
  const kind=String(btn.dataset.kind||'');
  if(kind==='sport'){
   const eventId=num(btn.dataset.eventId);if(!eventId)throw new Error('EVENT_ID_REQUIRED');
   await rpcCall467('cinetracker_unmark_sport_history_v426',{p_event_id:eventId});
  }else{
   const mediaId=num(btn.dataset.mediaId),itemType=kind;if(!mediaId||!['movie','episode'].includes(itemType))throw new Error('MEDIA_ITEM_REQUIRED');
   await rpcCall467('cinetracker_unmark_history_item_v426',{p_media_id:mediaId,p_item_type:itemType,p_season_number:itemType==='episode'?num(btn.dataset.season):null,p_episode_number:itemType==='episode'?num(btn.dataset.episode):null});
  }
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r467-history-undo'}}));return true;
 }catch(e){if(parent&&row){if(next&&next.parentNode===parent)parent.insertBefore(row,next);else parent.appendChild(row)}btn.disabled=false;btn.removeAttribute('aria-busy');try{toast('Não foi possível desmarcar como visto.')}catch{}document.documentElement.dataset.ct467UndoError=String(e?.message||e);return false}
 finally{historyLocks467.delete(key)}
}
function bindHistory467(){
 try{ct171OpenActivityDay=openDay467}catch{}window.ct171OpenActivityDay=openDay467;
 if(window.__ctR426&&typeof window.__ctR426==='object'){window.__ctR426.openDay=openDay467;window.__ctR426.undoHistory=undoHistory467}
 if(window.__ctR455&&typeof window.__ctR455==='object')window.__ctR455.openDay=openDay467;
}

window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;
 const undo=t.closest('[data-ct467-undo]');if(undo){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void undoHistory467(undo);return}
 if(t.closest('[data-ct467-history-close]')){e.preventDefault();e.stopImmediatePropagation();q('.ct171-activity-overlay')?.remove();return}
 if(t.closest('[data-nav="profile"]'))setTimeout(scheduleProfile467,0);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{bindHistory467();if(routeNow()==='profile')scheduleProfile467()},0));
window.addEventListener('cinetracker:data-changed',e=>{if(routeNow()==='profile'&&!String(e?.detail?.source||'').includes('r467-history-undo'))scheduleProfile467()});

const style=document.createElement('style');style.id='ct467-style';style.textContent=`
[data-profile] [data-ct455-more],[data-profile] [data-ct457-more],[data-profile] [data-ct465-more],[data-profile] [data-ct424-more]{display:none!important}
[data-profile] .ct467-profile-more{box-sizing:border-box!important;display:flex!important;flex:0 0 75px!important;width:75px!important;min-width:75px!important;max-width:75px!important;align-self:stretch!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:7px!important;padding:8px 5px!important;border:1px solid rgba(86,190,255,.42)!important;border-radius:12px!important;background:linear-gradient(180deg,rgba(16,43,58,.92),rgba(8,25,35,.96))!important;color:inherit!important;cursor:pointer!important}
[data-profile] .ct467-profile-more>span{font-size:28px!important;line-height:1!important}[data-profile] .ct467-profile-more>small{font-size:10px!important;white-space:nowrap!important}
.ct467-history-main{display:flex!important;align-items:center!important;gap:8px!important;min-width:0!important;width:100%!important}.ct467-history-copy{display:flex!important;flex:1 1 auto!important;min-width:0!important;flex-direction:column!important}.ct467-history-copy b,.ct467-history-copy span,.ct467-history-copy small{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}.ct467-undo{display:inline-flex!important;flex:0 0 28px!important;width:28px!important;min-width:28px!important;height:28px!important;min-height:28px!important;padding:0!important;align-items:center!important;justify-content:center!important;border-radius:999px!important;font-size:14px!important;line-height:1!important;pointer-events:auto!important}
`;
if(!q('#ct467-style'))document.head.appendChild(style);

bindHistory467();
window.__ctR467={version:'1.0.257',scope:'restore-r464-home-foryou+profile-13-more+daily-history-undo',profileLimit:PROFILE_LIMIT,applyProfile:applyProfile467,openDay:openDay467,undoHistory:undoHistory467,waitAuth:waitAuth467};
window.__ctR467Marker='restore-r464-home-foryou+profile-13-more+numeric-history-undo';
queueMicrotask(()=>{bindHistory467();if(routeNow()==='profile')scheduleProfile467()});
})();
