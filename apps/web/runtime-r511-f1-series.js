/* CineTracker Web 0.3.38 r511 — Formula 1 as a recurring special series backed by canonical r462 sync. */
(()=>{
'use strict';
if(window.__ctR511F1?.version==='0.3.38')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const core=()=>window.__ctCoreR471||null,route=()=>String(core()?.route?.()||'');
const rpcCall=(name,args={})=>core()?.rpc?core().rpc(name,args):Promise.reject(new Error('RPC_UNAVAILABLE'));
const locks=new Set();
let payload=null,task=null,modalOpen=false;
function localDay(){try{const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day}catch{return new Date().toISOString().slice(0,10)}}
function cacheRead(){try{const x=JSON.parse(sessionStorage.getItem('ct511:f1-series')||'null');return x&&Date.now()-Number(x.at||0)<5*60*1000?x:null}catch{return null}}
function cacheWrite(v){try{sessionStorage.setItem('ct511:f1-series',JSON.stringify({at:Date.now(),data:v}))}catch{}}
function cacheDrop(){try{sessionStorage.removeItem('ct511:f1-series')}catch{}}
function fmtDate(v){const d=new Date(v||0);if(!Number.isFinite(d.getTime()))return'—';try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)}catch{return d.toLocaleString('pt-BR')}}
function kindLabel(v){return({fp1:'Treino Livre 1',fp2:'Treino Livre 2',fp3:'Treino Livre 3',qualifying:'Classificação',sprint_qualifying:'Classificação Sprint',sprint:'Sprint',race:'Corrida'})[String(v||'')]||String(v||'Sessão')}
function panelFor(bucket){const view=q('[data-home-view="series"]');if(!view)return null;const wants=bucket==='continue'?['continuar assistindo','assistir a seguir']:['em dia'];return qa(':scope > [data-ct388-series-section],:scope > .home-section',view).find(s=>wants.includes(norm(q('.panel-head h3,h3',s)?.textContent||'')))||null}
function adjustCount(sec,delta){const el=q('.panel-head small',sec);if(!el)return;const n=Number(String(el.textContent||'').replace(/\D/g,''));if(Number.isFinite(n))el.textContent=String(Math.max(0,n+delta))}
function removeLegacy(){
 const view=q('[data-home-view="series"]');if(!view)return;
 for(const row of qa('.media-row.ct274-media-card',view)){
  if(row.matches('[data-ct511-f1-series]'))continue;
  const title=norm(q('.ct274-row-copy>b,b',row)?.textContent||'');
  if(title!=='formula 1'&&title!=='formula one')continue;
  const sec=row.closest('section');if(sec)adjustCount(sec,-1);row.remove();
  const st=q('.stack',sec);if(st&&!q('.media-row,.card',st)&&!q('.empty',st))st.innerHTML='<div class="empty">Nenhum item.</div>';
 }
}
function cardHtml(){
 const s=payload?.series||{},pending=Number(s.available_episodes||0),watched=Number(s.watched_episodes||0),released=Number(s.released_episodes||0),season=Number(s.season||new Date().getFullYear()),poster=String(s.poster_url||''),next=String(s.next_episode_title||''),upcoming=String(s.upcoming_episode_title||'');
 const meta='T'+season+' · '+watched+'/'+released+' sessões assistidas';
 const sub=pending>0?(pending+' sessão'+(pending===1?'':'ões')+' recente'+(pending===1?'':'s')+' pendente'+(pending===1?'':'s')+(next?' · '+next:'')):('Em dia'+(upcoming?' · Próximo: '+upcoming:''));
 return '<div class="media-row ct274-media-card ct511-f1-card" data-ct511-f1-series="1" data-ct511-f1-open="1" data-media-id="865" role="button" tabindex="0" aria-label="Abrir série Fórmula 1"><div class="ct274-row-left"><div class="thumb"'+(poster?' style="background-image:url(&quot;'+esc(poster)+'&quot;)"':'')+'></div><div class="ct274-row-copy"><b>Fórmula 1</b><small class="ct274-meta">'+esc(meta)+'</small><small class="ct274-sub">'+esc(sub)+'</small></div></div><span class="badge" aria-hidden="true">›</span></div>';
}
function mount(){
 if(route()!=='home'||!payload?.series)return false;
 removeLegacy();
 const bucket=payload.series.home_bucket==='continue'?'continue':'up_to_date',target=panelFor(bucket);if(!target)return false;
 const old=q('[data-ct511-f1-series]'),oldSec=old?.closest?.('section');
 if(old&&oldSec===target){old.outerHTML=cardHtml();return true}
 if(old&&oldSec){adjustCount(oldSec,-1);old.remove();const st=q('.stack',oldSec);if(st&&!q('.media-row,.card',st)&&!q('.empty',st))st.innerHTML='<div class="empty">Nenhum item.</div>'}
 const stack=q('.stack',target);if(!stack)return false;const empty=q(':scope > .empty',stack);if(empty)empty.remove();
 stack.insertAdjacentHTML('afterbegin',cardHtml());adjustCount(target,1);target.dataset.ct511F1Bucket=bucket;document.documentElement.dataset.ct511F1Home=bucket;return true;
}
function recompute(){
 if(!payload?.series||!Array.isArray(payload.events))return;
 const now=Date.now(),recent=now-21*86400000;
 const rel=payload.events.filter(x=>x.released!==false&&new Date(x.starts_at||0).getTime()<=now+60000);
 const watched=rel.filter(x=>x.is_watched);
 const pending=rel.filter(x=>!x.is_watched&&new Date(x.starts_at||0).getTime()>=recent).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
 const upcoming=payload.events.filter(x=>x.released===false||new Date(x.starts_at||0).getTime()>now+60000).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
 payload.series.released_episodes=rel.length;payload.series.watched_episodes=watched.length;payload.series.available_episodes=pending.length;payload.series.home_bucket=pending.length?'continue':'up_to_date';
 payload.series.next_episode_number=pending[0]?.episode_number||null;payload.series.next_episode_title=pending[0]?.title||null;payload.series.next_episode_air_date=pending[0]?.starts_at||null;
 payload.series.upcoming_episode_number=upcoming[0]?.episode_number||null;payload.series.upcoming_episode_title=upcoming[0]?.title||null;payload.series.upcoming_episode_air_date=upcoming[0]?.starts_at||null;
}
async function load(force=false){
 if(task)return task;
 if(!payload&&!force){const c=cacheRead();if(c?.data){payload=c.data;mount();if(Date.now()-Number(c.at||0)<60000)return payload}}
 if(payload&&!force){mount();return payload}
 task=(async()=>{try{
  const raw=await rpcCall('cinetracker_f1_series_v511',{p_today:localDay(),p_recent_days:21}),next=Array.isArray(raw)&&raw.length===1?raw[0]:raw;
  if(next?.series&&Array.isArray(next?.events)){payload=next;cacheWrite(payload);mount();if(modalOpen)renderModal();document.documentElement.dataset.ct511F1='ready'}return payload;
 }catch(e){document.documentElement.dataset.ct511F1Error=String(e?.message||e);return payload}finally{task=null}})();return task;
}
function eventHtml(x){
 const released=x.released!==false&&new Date(x.starts_at||0).getTime()<=Date.now()+60000,watched=!!x.is_watched,season=Number(x.season||0),episode=Number(x.episode_number||0),round=Number(x.round||0);
 const label='T'+season+' E'+String(episode).padStart(3,'0')+(round?' · R'+round:'')+' · '+kindLabel(x.session_kind);
 return '<article class="ct511-f1-event '+(watched?'watched':'')+'" data-ct511-season="'+season+'" data-ct511-episode="'+episode+'"><div class="ct511-f1-event-copy"><small>'+esc(label)+' · '+esc(fmtDate(x.starts_at))+'</small><b>'+esc(x.title||'Fórmula 1')+'</b><span>'+Number(x.runtime_minutes||0)+' min</span></div><button type="button" class="chip ct511-f1-watch '+(watched?'on':'')+'" data-ct511-f1-watch="'+season+':'+episode+'" data-ct511-watched="'+(watched?'1':'0')+'" '+(released?'':'disabled')+'>'+(watched?'↶ Desmarcar':released?'✓ Assistido':'Em breve')+'</button></article>';
}
function renderModal(){
 if(!modalOpen||!payload)return false;let back=q('[data-ct511-f1-modal]');if(!back){back=document.createElement('div');back.className='ct511-f1-backdrop';back.dataset.ct511F1Modal='1';document.body.appendChild(back)}
 const s=payload.series||{},events=Array.isArray(payload.events)?payload.events:[];
 back.innerHTML='<section class="ct511-f1-dialog" role="dialog" aria-modal="true" aria-label="Fórmula 1 temporada '+esc(s.season||'')+'"><header><div><small>SÉRIE ESPECIAL · ESPORTES · F1 HUB</small><h2>Fórmula 1</h2><p>Treinos, classificações, sprints e corridas · Temporada '+esc(s.season||'')+'</p></div><button type="button" class="btn" data-ct511-f1-close>✕ Fechar</button></header><div class="ct511-f1-summary"><span>'+Number(s.watched_episodes||0)+' assistidas</span><span>'+Number(s.available_episodes||0)+' recentes pendentes</span></div><div class="ct511-f1-events">'+events.map(eventHtml).join('')+'</div></section>';document.documentElement.classList.add('ct511-f1-modal-open');return true;
}
function openModal(){modalOpen=true;if(payload)renderModal();else void load(true).then(()=>renderModal());return true}
function closeModal(){modalOpen=false;q('[data-ct511-f1-modal]')?.remove();document.documentElement.classList.remove('ct511-f1-modal-open')}
function emit(ev,watched){
 const detail={source:'f1-series-r511',media_id:865,event_id:Number(ev?.event_id||0)||null,season_number:Number(ev?.season||0),episode_number:Number(ev?.episode_number||0),watched:!!watched};
 try{window.dispatchEvent(new CustomEvent('cinetracker:f1-watched-changed',{detail}))}catch{}
 try{window.dispatchEvent(new CustomEvent('cinetracker:sports-watched-changed',{detail}))}catch{}
 try{document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail}))}catch{}
}
async function toggle(btn){
 const key=String(btn?.dataset?.ct511F1Watch||''),parts=key.split(':'),season=Number(parts[0]||0),episode=Number(parts[1]||0);if(!(season>0&&episode>0)||locks.has(key)||!payload)return false;
 const ev=payload.events.find(x=>Number(x.season||0)===season&&Number(x.episode_number||0)===episode);if(!ev)return false;
 const before=!!ev.is_watched,next=!before,at=new Date().toISOString(),eventId=Number(ev.event_id||0)||null;locks.add(key);ev.is_watched=next;recompute();mount();renderModal();
 try{
  await rpcCall('cinetracker_f1_watch_sync_v462',{p_season:season,p_episode:episode,p_watched:next,p_watched_at:at,p_event_id:eventId,p_attended_in_person:false,p_stadium_name:null,p_source:'series-r511'});
  cacheWrite(payload);emit(ev,next);return true;
 }catch(e){ev.is_watched=before;recompute();mount();renderModal();document.documentElement.dataset.ct511F1WriteError=String(e?.message||e);return false}
 finally{locks.delete(key)}
}
function invalidate(){payload=null;cacheDrop();if(route()==='home'||modalOpen)void load(true)}
function schedule(){let n=0;const run=()=>{n++;if(route()==='home'){if(payload)mount();else void load(false);if((!payload||!mount())&&n<18)requestAnimationFrame(run)}};requestAnimationFrame(run)}
document.addEventListener('click',e=>{
 const watch=e.target?.closest?.('[data-ct511-f1-watch]');if(watch){e.preventDefault();e.stopImmediatePropagation();void toggle(watch);return}
 if(e.target?.closest?.('[data-ct511-f1-close]')||e.target?.matches?.('[data-ct511-f1-modal]')){e.preventDefault();closeModal();return}
 const open=e.target?.closest?.('[data-ct511-f1-open]');if(open){e.preventDefault();e.stopImmediatePropagation();openModal();return}
 const nav=e.target?.closest?.('[data-nav="home"],[data-home-tab="series"]');if(nav)setTimeout(schedule,0);
},true);
document.addEventListener('keydown',e=>{const open=e.target?.closest?.('[data-ct511-f1-open]');if(open&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openModal()}if(e.key==='Escape'&&modalOpen)closeModal()},true);
window.addEventListener('cinetracker:f1-watched-changed',e=>{if(e?.detail?.source==='f1-series-r511')return;invalidate()});
window.addEventListener('cinetracker:sports-watched-changed',e=>{if(e?.detail?.source==='f1-series-r511')return;if(route()==='home'||modalOpen)invalidate()});
window.addEventListener('pageshow',schedule);
const style=document.createElement('style');style.id='ct511-f1-style';style.textContent=[
 '.ct511-f1-card{cursor:pointer!important}.ct511-f1-card .thumb{background-size:contain!important;background-repeat:no-repeat!important;background-position:center!important;background-color:rgba(0,0,0,.42)!important}',
 '.ct511-f1-backdrop{position:fixed;inset:0;z-index:10070;background:rgba(0,0,0,.72);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px}',
 '.ct511-f1-dialog{width:min(960px,96vw);max-height:90vh;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:20px;background:rgba(8,18,28,.98);box-shadow:0 24px 80px rgba(0,0,0,.48);padding:18px}',
 '.ct511-f1-dialog>header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;position:sticky;top:-18px;z-index:2;background:rgba(8,18,28,.98);padding:18px 0 12px}.ct511-f1-dialog h2{margin:2px 0 4px;font-size:28px}.ct511-f1-dialog p{margin:0;opacity:.72}',
 '.ct511-f1-summary{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 14px}.ct511-f1-summary span{border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:6px 10px;font-size:12px}',
 '.ct511-f1-events{display:grid;gap:8px}.ct511-f1-event{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(255,255,255,.035)}',
 '.ct511-f1-event-copy{display:grid;gap:3px;min-width:0}.ct511-f1-event-copy small,.ct511-f1-event-copy span{opacity:.68}.ct511-f1-event-copy b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct511-f1-watch{min-width:110px}.ct511-f1-watch.on{opacity:.78}',
 'html.ct511-f1-modal-open{overflow:hidden!important}',
 '@media(max-width:640px){.ct511-f1-backdrop{padding:8px}.ct511-f1-dialog{width:100%;max-height:94vh;border-radius:16px;padding:12px}.ct511-f1-dialog>header{top:-12px;padding:12px 0 10px}.ct511-f1-event{grid-template-columns:1fr}.ct511-f1-watch{width:100%}}'
].join('');
if(!q('#ct511-f1-style'))document.head.appendChild(style);
window.__ctR511F1={version:'0.3.38',load,mount,open:openModal,close:closeModal,get payload(){return payload}};
window.__ctR511Marker='f1-special-series+current-season+canonical-r462-three-way-sync+no-duplicate-row';
schedule();
})();