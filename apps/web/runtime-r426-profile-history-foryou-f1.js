/* CineTracker Web 1.0.217 r426 — profile history undo, stable For You swap, F1 released progress. */
(()=>{'use strict';
if(window.__ctR426?.version==='1.0.217')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const num=v=>Number.isFinite(Number(v))?Number(v):0,rows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,r)=>setTimeout(()=>r(new Error('TIMEOUT')),ms))]);

/* Descobrir > Pra Você: one capture owner for every visible Trocar. */
let fyBusy=false,fySeq=0;
function fyRoot(){return q('[data-ct411-foryou]')||q('[data-ct336-foryou]')||q('[data-ct288-foryou]')}
function isFY(){return routeNow()==='discover'&&!!fyRoot()}
function slotOf(b){
 const raw=String(b?.dataset?.ct411Slot||b?.dataset?.ct418Swap||b?.dataset?.ct415Swap||b?.dataset?.ct414Swap||'');
 if(raw==='daily')return'daily';
 const m=raw.match(/(?:watch|fresh)(?::|Index:)(movie|series|anime)$/);
 if(m)return raw.includes('watch')?'watch:'+m[1]:'fresh:'+m[1];
 const s=b?.closest?.('[data-ct411-slot],[data-ct336-slot],[data-ct288-slot]');
 const n=String(s?.dataset?.ct411Slot||s?.dataset?.ct336Slot||s?.dataset?.ct288Slot||'');
 return n.replace(/^watchIndex:/,'watch:').replace(/^freshIndex:/,'fresh:');
}
function normalizeFY(){
 if(!isFY())return 0;let n=0;
 for(const b of qa('button',fyRoot()).filter(x=>norm(x.textContent).includes('trocar'))){
  const slot=slotOf(b);if(!slot)continue;
  b.type='button';b.hidden=false;b.disabled=false;b.removeAttribute('hidden');b.removeAttribute('disabled');b.removeAttribute('inert');b.setAttribute('aria-disabled','false');b.dataset.ct426Swap=slot;b.classList.add('ct426-swap');n++;
 }
 document.documentElement.dataset.ct426SwapCount=String(n);return n;
}
async function swapFY(name,b){
 if(!name||fyBusy)return false;fyBusy=true;b?.setAttribute('aria-busy','true');
 try{
  let ok=false,o=window.__ctR411;
  try{ok=!!o?.swap?.(name)}catch{}
  if(!ok&&typeof o?.loadForYou==='function'){try{await timeout(o.loadForYou(false),4500);ok=!!o?.swap?.(name)}catch{}}
  if(!ok&&typeof window.__ctR368?.handle==='function'){try{ok=!!window.__ctR368.handle({action:'swap',name,slot:b?.parentElement,btn:b,key:''})}catch{}}
  normalizeFY();return ok;
 }finally{fyBusy=false;if(b?.isConnected){b.disabled=false;b.removeAttribute('aria-busy');b.setAttribute('aria-disabled','false')}}
}
function scheduleFY(){const s=++fySeq;for(const ms of[0,80,180,400,800,1500,2800,5000])setTimeout(()=>{if(s===fySeq||isFY())normalizeFY()},ms)}
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;
 const b=t.closest('[data-ct426-swap]');if(b&&isFY()){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void swapFY(String(b.dataset.ct426Swap||''),b);return}
 if(t.closest('[data-nav="discover"],[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]'))scheduleFY();
},true);
window.addEventListener('popstate',()=>{if(isFY())scheduleFY()});
window.addEventListener('cinetracker:data-changed',()=>{if(isFY())scheduleFY()});

/* Perfil: canonical stats only. */
let profileTask=null;
async function stabilizeProfile(){if(routeNow()!=='profile')return false;if(profileTask)return profileTask;
 profileTask=(async()=>{try{await timeout(window.__ctR424?.loadProfile?.(),4500)}catch{}const r=q('[data-profile]');if(r){r.dataset.ct426ProfileAuthority='canonical';r.dataset.ct426StatsStable='1'}return true})().finally(()=>{profileTask=null});return profileTask}
window.addEventListener('cinetracker:data-changed',e=>{if(routeNow()==='profile'){e.stopImmediatePropagation();e.preventDefault();void stabilizeProfile()}},true);
window.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav="profile"]'))setTimeout(stabilizeProfile,0)},true);

/* F1: current season released sessions are the denominator. */
let f1Task=null;
async function syncF1(){if(f1Task)return f1Task;f1Task=(async()=>{try{
 const raw=await timeout(rpc('cinetracker_f1_progress_v426',{p_season:new Date().getFullYear()}),4500),d=Array.isArray(raw)?raw[0]:raw;
 const released=num(d?.released_episodes),watched=Math.min(released,num(d?.watched_released_episodes));if(!released)return false;
 const text=String(watched)+'/'+String(released)+' assistidos · '+String(released)+' já exibidos';
 for(const p of qa('[data-ct285-progress],[data-ct284-progress]')){if(/\d+\s*\/\s*\d+\s*assistidos/i.test(p.textContent||'')){p.textContent=text;p.dataset.ct426F1Progress='1'}}
 document.documentElement.dataset.ct426F1Progress=String(watched)+'/'+String(released);return true;
}catch{return false}})().finally(()=>{f1Task=null});return f1Task}
window.addEventListener('cinetracker:data-changed',()=>setTimeout(syncF1,0));
window.addEventListener('click',e=>{if(e.target?.closest?.('[data-ct311-f1-race],[data-nav="home"],[data-home-tab]'))setTimeout(syncF1,150)},true);

/* Perfil > Histórico diário: fast direct RPC and exact-item undo. */
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=v=>{try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v))}catch{return''}};
function activityHtml(x){
 const type=String(x?.item_type||''),sport=type==='sport',movie=type==='movie',id=num(x?.media_id),season=num(x?.season_number),episode=num(x?.episode_number);
 let meta,sub;if(type==='episode'){meta='S'+String(season).padStart(2,'0')+'E'+String(episode).padStart(2,'0')+(x.title&&x.title!==x.media_title?' · Ep: '+x.title:'')+' · '+fmt(x.watched_at);sub='Episódio assistido'}
 else if(movie){meta='Filme · '+fmt(x.watched_at);sub='Filme assistido'}
 else{meta='Esporte · '+fmt(x.watched_at)+(num(x.runtime_minutes)?' · '+num(x.runtime_minutes)+' min':'');sub='Evento assistido'}
 const action=sport?'<button type="button" class="chip ct426-undo" data-ct426-undo-sport="'+esc(x.event_id)+'">↶ Desmarcar visto</button>':'<button type="button" class="chip ct426-undo" data-ct426-undo="1" data-media-id="'+id+'" data-item-type="'+type+'" data-season="'+season+'" data-episode="'+episode+'">↶ Desmarcar visto</button>';
 const key=type+':'+id+':'+season+':'+episode+':'+num(x.sort_id);
 return '<article class="ct171-activity-item ct321-activity-item ct426-activity-row" data-ct426-row="'+esc(key)+'"><div class="ct171-activity-thumb">'+(sport?'🏆':'')+'</div><div><b>'+esc(x.media_title||x.title||'Item assistido')+'</b><span>'+esc(meta)+'</span><small>'+esc(sub)+'</small><div class="ct426-history-actions">'+action+'</div></div></article>';
}
async function openDay426(day){
 q('.ct171-activity-overlay')?.remove();const ov=document.createElement('div');ov.className='ct171-activity-overlay';
 ov.innerHTML='<div class="ct171-activity-box"><div class="panel-head"><div><small>HISTÓRICO</small><h2>'+esc(new Date(day+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))+'</h2></div><button type="button" class="btn" data-ct171-activity-close>✕ Fechar</button></div><div data-ct171-activity-items><div class="ct321-loading">Carregando histórico...</div></div></div>';
 document.body.appendChild(ov);
 try{const list=await timeout(rpc('cinetracker_activity_items_by_day_v426',{p_day:day,p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'}),4500),box=q('[data-ct171-activity-items]',ov);if(box)box.innerHTML=rows(list).map(activityHtml).join('')||'<div class="empty">Nenhum item registrado neste dia.</div>'}
 catch{const box=q('[data-ct171-activity-items]',ov);if(box)box.innerHTML='<div class="error">Não foi possível carregar o histórico agora.</div>'}
}
async function undoHistory(b){if(!b||b.disabled)return false;b.disabled=true;b.setAttribute('aria-busy','true');
 try{
  if(b.dataset.ct426UndoSport)await rpc('cinetracker_unmark_sport_history_v426',{p_event_id:num(b.dataset.ct426UndoSport)});
  else await rpc('cinetracker_unmark_history_item_v426',{p_media_id:num(b.dataset.mediaId),p_item_type:b.dataset.itemType,p_season_number:num(b.dataset.season)||null,p_episode_number:num(b.dataset.episode)||null});
  b.closest('[data-ct426-row]')?.remove();document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r426-history-undo'}}));return true;
 }catch(e){b.disabled=false;b.removeAttribute('aria-busy');try{toast(e?.message||'Não foi possível desmarcar como visto.')}catch{}return false}
}
window.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct426-undo],[data-ct426-undo-sport]');if(b){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void undoHistory(b);return}
 if(e.target?.closest?.('[data-ct171-activity-close]')){e.preventDefault();e.stopImmediatePropagation();q('.ct171-activity-overlay')?.remove()}},true);
try{ct171OpenActivityDay=openDay426}catch{}
const style=document.createElement('style');style.id='ct426-style';style.textContent='.ct426-history-actions{display:flex!important;gap:6px!important;margin-top:7px!important}.ct426-undo{min-height:28px!important;padding:5px 9px!important;font-size:11px!important}.ct426-swap{position:relative!important;z-index:2!important;pointer-events:auto!important}';document.head.appendChild(style);
window.__ctR426={version:'1.0.217',scope:'profile-history-undo+foryou-swap+f1-released-progress',normalizeFY,swapFY,stabilizeProfile,syncF1,openDay:openDay426,undoHistory};
queueMicrotask(()=>{if(isFY())scheduleFY();if(routeNow()==='profile')void stabilizeProfile();void syncF1()});
})();