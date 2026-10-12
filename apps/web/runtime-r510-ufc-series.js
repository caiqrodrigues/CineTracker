/* CineTracker Web 0.3.37 r510 — UFC as a recurring special series backed by Sports. */
(()=>{
'use strict';
if(window.__ctR510UFC?.version==='0.3.37')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const core=()=>window.__ctCoreR471||null,route=()=>String(core()?.route?.()||'');
const rpcCall=(name,args={})=>core()?.rpc?core().rpc(name,args):Promise.reject(new Error('RPC_UNAVAILABLE'));
const locks=new Set();
let payload=null,task=null,modalOpen=false;
function localDay(){try{const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day}catch{return new Date().toISOString().slice(0,10)}}
function cacheRead(){try{const x=JSON.parse(sessionStorage.getItem('ct510:ufc-series')||'null');return x&&Date.now()-Number(x.at||0)<5*60*1000?x:null}catch{return null}}
function cacheWrite(v){try{sessionStorage.setItem('ct510:ufc-series',JSON.stringify({at:Date.now(),data:v}))}catch{}}
function fmtDate(v){const d=new Date(v||0);if(!Number.isFinite(d.getTime()))return'—';try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)}catch{return d.toLocaleString('pt-BR')}}
function normalize(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function panelFor(bucket){const view=q('[data-home-view="series"]');if(!view)return null;const wants=bucket==='continue'?['continuar assistindo','assistir a seguir']:['em dia'];return qa(':scope > [data-ct388-series-section],:scope > .home-section',view).find(s=>wants.includes(normalize(q('.panel-head h3,h3',s)?.textContent||'')))||null}
function adjustCount(sec,delta){const el=q('.panel-head small',sec);if(!el)return;const n=Number(String(el.textContent||'').replace(/\D/g,''));if(Number.isFinite(n))el.textContent=String(Math.max(0,n+delta))}
function cardHtml(){
 const s=payload?.series||{},pending=Number(s.available_episodes||0),watched=Number(s.watched_episodes||0),released=Number(s.released_episodes||0),season=Number(s.season||new Date().getFullYear()),poster=String(s.poster_url||''),next=String(s.next_episode_title||''),upcoming=String(s.upcoming_episode_title||'');
 const meta='T'+season+' · '+watched+'/'+released+' eventos assistidos';
 const sub=pending>0?(pending+' evento'+(pending===1?'':'s')+' recente'+(pending===1?'':'s')+' pendente'+(pending===1?'':'s')+(next?' · '+next:'')):('Em dia'+(upcoming?' · Próximo: '+upcoming:''));
 return '<div class="media-row ct274-media-card ct510-ufc-card" data-ct510-ufc-series="1" data-ct510-ufc-open="1" role="button" tabindex="0" aria-label="Abrir série UFC"><div class="ct274-row-left"><div class="thumb"'+(poster?' style="background-image:url(&quot;'+esc(poster)+'&quot;)"':'')+'></div><div class="ct274-row-copy"><b>UFC</b><small class="ct274-meta">'+esc(meta)+'</small><small class="ct274-sub">'+esc(sub)+'</small></div></div><span class="badge" aria-hidden="true">›</span></div>';
}
function mount(){
 if(route()!=='home'||!payload?.series)return false;
 const bucket=payload.series.home_bucket==='continue'?'continue':'up_to_date',target=panelFor(bucket);if(!target)return false;
 const old=q('[data-ct510-ufc-series]'),oldSec=old?.closest?.('section');
 if(old&&oldSec===target){old.outerHTML=cardHtml();return true}
 if(old&&oldSec){adjustCount(oldSec,-1);old.remove();const st=q('.stack',oldSec);if(st&&!q('.media-row,.card',st)&&!q('.empty',st))st.innerHTML='<div class="empty">Nenhum item.</div>'}
 const stack=q('.stack',target);if(!stack)return false;const empty=q(':scope > .empty',stack);if(empty)empty.remove();
 stack.insertAdjacentHTML('afterbegin',cardHtml());adjustCount(target,1);target.dataset.ct510UfcBucket=bucket;document.documentElement.dataset.ct510UfcHome=bucket;return true;
}
function recompute(){
 if(!payload?.series||!Array.isArray(payload.events))return;
 const now=Date.now(),recent=now-21*86400000,rel=payload.events.filter(x=>x.released!==false&&new Date(x.starts_at||0).getTime()<=now+86400000),watched=rel.filter(x=>x.is_watched),pending=rel.filter(x=>!x.is_watched&&new Date(x.starts_at||0).getTime()>=recent).sort((a,b)=>new Date(b.starts_at)-new Date(a.starts_at));
 payload.series.released_episodes=rel.length;payload.series.watched_episodes=watched.length;payload.series.available_episodes=pending.length;payload.series.home_bucket=pending.length?'continue':'up_to_date';payload.series.next_episode_number=pending[0]?.episode_number||null;payload.series.next_episode_title=pending[0]?.title||null;payload.series.next_episode_air_date=pending[0]?.starts_at||null;
}
async function load(force=false){
 if(task)return task;
 if(!payload&&!force){const c=cacheRead();if(c?.data){payload=c.data;mount();if(Date.now()-Number(c.at||0)<60000)return payload}}
 if(payload&&!force){mount();return payload}
 task=(async()=>{try{const raw=await rpcCall('cinetracker_ufc_series_v510',{p_today:localDay(),p_recent_days:21}),next=Array.isArray(raw)&&raw.length===1?raw[0]:raw;if(next?.series&&Array.isArray(next?.events)){payload=next;cacheWrite(payload);mount();if(modalOpen)renderModal();document.documentElement.dataset.ct510Ufc='ready'}return payload}catch(e){document.documentElement.dataset.ct510UfcError=String(e?.message||e);return payload}finally{task=null}})();return task;
}
function eventHtml(x){
 const released=x.released!==false&&new Date(x.starts_at||0).getTime()<=Date.now()+60000,watched=!!x.is_watched,label='T'+Number(x.season||0)+' E'+String(Number(x.episode_number||0)).padStart(2,'0')+' · '+String(x.event_kind||'UFC');
 return '<article class="ct510-ufc-event '+(watched?'watched':'')+'" data-ct510-event="'+Number(x.event_id||0)+'"><div class="ct510-ufc-event-copy"><small>'+esc(label)+' · '+esc(fmtDate(x.starts_at))+'</small><b>'+esc(x.title||'UFC')+'</b><span>'+esc(x.venue||'')+'</span></div><button type="button" class="chip ct510-ufc-watch '+(watched?'on':'')+'" data-ct510-ufc-watch="'+Number(x.event_id||0)+'" data-ct510-watched="'+(watched?'1':'0')+'" '+(released?'':'disabled')+'>'+(watched?'↶ Desmarcar':released?'✓ Assistido':'Em breve')+'</button></article>';
}
function renderModal(){
 if(!modalOpen||!payload)return false;let back=q('[data-ct510-ufc-modal]');if(!back){back=document.createElement('div');back.className='ct510-ufc-backdrop';back.dataset.ct510UfcModal='1';document.body.appendChild(back)}
 const s=payload.series||{},events=Array.isArray(payload.events)?payload.events:[];
 back.innerHTML='<section class="ct510-ufc-dialog" role="dialog" aria-modal="true" aria-label="UFC temporada '+esc(s.season||'')+'"><header><div><small>SÉRIE ESPECIAL · ESPORTES</small><h2>UFC</h2><p>Fight Nights e PPVs numerados · Temporada '+esc(s.season||'')+'</p></div><button type="button" class="btn" data-ct510-ufc-close>✕ Fechar</button></header><div class="ct510-ufc-summary"><span>'+Number(s.watched_episodes||0)+' assistidos</span><span>'+Number(s.available_episodes||0)+' recentes pendentes</span></div><div class="ct510-ufc-events">'+events.map(eventHtml).join('')+'</div></section>';document.documentElement.classList.add('ct510-ufc-modal-open');return true;
}
function openModal(){modalOpen=true;if(payload)renderModal();else void load(true).then(()=>renderModal());return true}
function closeModal(){modalOpen=false;q('[data-ct510-ufc-modal]')?.remove();document.documentElement.classList.remove('ct510-ufc-modal-open')}
async function toggle(btn){
 const id=Number(btn?.dataset?.ct510UfcWatch||0);if(!(id>0)||locks.has(id)||!payload)return false;const ev=payload.events.find(x=>Number(x.event_id||0)===id);if(!ev)return false;
 const before=!!ev.is_watched,beforeAt=ev.sport_watched_at||null,next=!before,at=new Date().toISOString();locks.add(id);ev.is_watched=next;ev.sport_watched_at=next?at:null;recompute();mount();renderModal();
 try{await rpcCall('cinetracker_sport_mark_watched_v1',{p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:at});cacheWrite(payload);window.dispatchEvent(new CustomEvent('cinetracker:sports-watched-changed',{detail:{source:'ufc-series',event_id:id,watched:next}}));return true}catch(e){ev.is_watched=before;ev.sport_watched_at=beforeAt;recompute();mount();renderModal();document.documentElement.dataset.ct510UfcWriteError=String(e?.message||e);return false}finally{locks.delete(id)}
}
function schedule(){let n=0;const run=()=>{n++;if(route()==='home'){if(payload)mount();else void load(false);if((!payload||!mount())&&n<18)requestAnimationFrame(run)}};requestAnimationFrame(run)}
document.addEventListener('click',e=>{const watch=e.target?.closest?.('[data-ct510-ufc-watch]');if(watch){e.preventDefault();e.stopImmediatePropagation();void toggle(watch);return}if(e.target?.closest?.('[data-ct510-ufc-close]')||e.target?.matches?.('[data-ct510-ufc-modal]')){e.preventDefault();closeModal();return}const open=e.target?.closest?.('[data-ct510-ufc-open]');if(open){e.preventDefault();e.stopImmediatePropagation();openModal();return}const nav=e.target?.closest?.('[data-nav="home"],[data-home-tab="series"]');if(nav)setTimeout(schedule,0)},true);
document.addEventListener('keydown',e=>{const open=e.target?.closest?.('[data-ct510-ufc-open]');if(open&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openModal()}if(e.key==='Escape'&&modalOpen)closeModal()},true);
window.addEventListener('cinetracker:sports-watched-changed',e=>{if(e?.detail?.source==='ufc-series')return;payload=null;try{sessionStorage.removeItem('ct510:ufc-series')}catch{}if(route()==='home'||modalOpen)void load(true)});
window.addEventListener('pageshow',schedule);
const style=document.createElement('style');style.id='ct510-ufc-style';style.textContent=[
 '.ct510-ufc-card{cursor:pointer!important}.ct510-ufc-card .thumb{background-size:contain!important;background-repeat:no-repeat!important;background-position:center!important;background-color:rgba(0,0,0,.42)!important}',
 '.ct510-ufc-backdrop{position:fixed;inset:0;z-index:10060;background:rgba(0,0,0,.72);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px}',
 '.ct510-ufc-dialog{width:min(920px,96vw);max-height:90vh;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:20px;background:rgba(8,18,28,.98);box-shadow:0 24px 80px rgba(0,0,0,.48);padding:18px}',
 '.ct510-ufc-dialog>header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;position:sticky;top:-18px;z-index:2;background:rgba(8,18,28,.98);padding:18px 0 12px}.ct510-ufc-dialog h2{margin:2px 0 4px;font-size:28px}.ct510-ufc-dialog p{margin:0;opacity:.72}',
 '.ct510-ufc-summary{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 14px}.ct510-ufc-summary span{border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:6px 10px;font-size:12px}',
 '.ct510-ufc-events{display:grid;gap:8px}.ct510-ufc-event{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(255,255,255,.035)}',
 '.ct510-ufc-event-copy{display:grid;gap:3px;min-width:0}.ct510-ufc-event-copy small,.ct510-ufc-event-copy span{opacity:.68}.ct510-ufc-event-copy b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct510-ufc-watch{min-width:110px}.ct510-ufc-watch.on{opacity:.78}',
 'html.ct510-ufc-modal-open{overflow:hidden!important}',
 '@media(max-width:640px){.ct510-ufc-backdrop{padding:8px}.ct510-ufc-dialog{width:100%;max-height:94vh;border-radius:16px;padding:12px}.ct510-ufc-dialog>header{top:-12px;padding:12px 0 10px}.ct510-ufc-event{grid-template-columns:1fr}.ct510-ufc-watch{width:100%}}'
].join('');
if(!q('#ct510-ufc-style'))document.head.appendChild(style);
window.__ctR510UFC={version:'0.3.37',load,mount,open:openModal,close:closeModal,get payload(){return payload}};
window.__ctR510Marker='ufc-special-series+sports-single-source+fight-night-ppv+optimistic-watch';
schedule();
})();