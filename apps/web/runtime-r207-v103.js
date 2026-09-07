(()=>{
'use strict';
window.__ctR207='v103-rewatch-navigation-recommendations-f1';
window.__ctR207Rewatch='rpc-signature-source-of-truth';
window.__ctR207Navigation='instant-global-nav-closes-details';
window.__ctR207Recommendations='persistent-pra-voce-memory';
window.__ctR207F1='sessions-sprint-pitstops-laps-results';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sb=()=>window.ctSupabase||window.supabaseClient||window.__supabase||null;
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
function parseRewatch(btn){
 const raw=btn.getAttribute('data-ct171-rewatch-episode')||btn.getAttribute('data-rewatch-episode')||btn.getAttribute('data-ct171-rewatch-media')||'';
 const mediaId=num(btn.dataset.mediaId||btn.dataset.mediaid||btn.dataset.ctMediaId||btn.getAttribute('data-media-id'));
 const season=num(btn.dataset.season||btn.dataset.seasonNumber||btn.getAttribute('data-season-number'));
 const episode=num(btn.dataset.episode||btn.dataset.episodeNumber||btn.getAttribute('data-episode-number'));
 let type=(btn.hasAttribute('data-ct171-rewatch-episode')||btn.hasAttribute('data-rewatch-episode'))?'episode':'movie';
 let id=mediaId,s=season,e=episode;
 const parts=String(raw).split(':').filter(Boolean);
 if(parts[0]==='movie'||parts[0]==='episode'){type=parts.shift()}
 const ns=parts.map(num).filter(v=>v!==null);
 if(id===null||id===undefined) id=ns[0]??null;
 if(type==='episode'){if(s===null||s===undefined)s=ns.length>=3?ns[1]:null;if(e===null||e===undefined)e=ns.length>=3?ns[2]:null}
 return {mediaId:id,itemType:type,seasonNumber:s,episodeNumber:e,title:btn.dataset.title||btn.getAttribute('aria-label')||null,runtime:num(btn.dataset.runtime||btn.dataset.runtimeMinutes),released:num(btn.dataset.releasedEpisodes)};
}
async function refreshViews(){
 for(const fn of ['ctRefreshHistory','ct171RefreshHistory','ctRefreshProfile','ctRefreshDetails','ctRenderProfile','ctRenderHistory']){try{if(typeof window[fn]==='function')await window[fn]()}catch{}}
 document.dispatchEvent(new CustomEvent('cinetracker:watch-updated',{detail:{source:'r207'}}));
}
async function rewatch(btn){
 if(btn.dataset.ctR207Busy==='1')return;
 const x=parseRewatch(btn);if(!x.mediaId||!['movie','episode'].includes(x.itemType)||x.itemType==='episode'&&(x.seasonNumber===null||x.episodeNumber===null))return;
 const client=sb();if(!client?.rpc)throw new Error('Supabase indisponível');
 btn.dataset.ctR207Busy='1';btn.disabled=true;
 try{
  const args={p_media_id:x.mediaId,p_item_type:x.itemType,p_season_number:x.itemType==='episode'?x.seasonNumber:null,p_episode_number:x.itemType==='episode'?x.episodeNumber:null,p_title:x.title,p_runtime_minutes:x.runtime,p_released_episodes:x.released,p_watched_at:new Date().toISOString()};
  const {data,error}=await client.rpc('cinetracker_mark_watch_v0994',args);if(error)throw error;
  const plays=Number(data?.plays||1);btn.dataset.plays=String(plays);btn.textContent=`↻ Reassistir ${plays}x`;
  const scope=btn.closest('[data-media-id],article,.episode-card,.history-item,.modal,.details')||document;
  qa('[data-plays],[data-watch-count],.ct-play-count',scope).forEach(n=>{n.dataset.plays=String(plays);if(/\d+x/.test(n.textContent||''))n.textContent=(n.textContent||'').replace(/\d+x/,`${plays}x`)});
  await refreshViews();return data;
 }finally{btn.disabled=false;delete btn.dataset.ctR207Busy}
}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct171-rewatch-media],[data-ct171-rewatch-episode],[data-rewatch-episode]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();rewatch(b).catch(err=>{console.error('[CT r207 rewatch]',err);b.dispatchEvent(new CustomEvent('cinetracker:error',{bubbles:true,detail:{message:'Não foi possível registrar a reassistida.'}}))})},true);

const navSel='nav a,nav button,[data-nav],[data-route],[data-tab="home"],[data-tab="discover"],[data-tab="sports"],[data-tab="profile"],[data-tab="settings"],.bottom-nav a,.bottom-nav button,.bottom-navigation a,.bottom-navigation button';
function isGlobalNav(n){const t=((n.textContent||'')+' '+(n.getAttribute('aria-label')||'')+' '+(n.dataset.route||'')+' '+(n.dataset.nav||'')).toLowerCase();return /home|in[ií]cio|descobrir|discover|esporte|sports|perfil|profile|config|settings/.test(t)}
function closeDetails(){
 const selectors=['[data-details-overlay]','.details-overlay','.detail-overlay','.media-details.is-open','.details-modal.is-open','.modal[data-media-details]','[role="dialog"][data-details]'];
 qa(selectors.join(',')).forEach(el=>{const close=q('[data-close],.close,[aria-label*="Fechar" i],[aria-label*="Close" i]',el);if(close)close.click();else{el.classList.remove('is-open','open','active');el.hidden=true}});
 document.body.classList.remove('modal-open','details-open','no-scroll');
}
document.addEventListener('pointerdown',e=>{const n=e.target.closest?.(navSel);if(n&&isGlobalNav(n))closeDetails()},true);
document.addEventListener('click',e=>{const n=e.target.closest?.(navSel);if(n&&isGlobalNav(n)){closeDetails();requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'auto'}))}},true);

const MEMKEY='ct:r207:recommendation-memory';let serverMemory=null;
async function loadMemory(){if(serverMemory)return serverMemory;try{const c=sb();if(c?.rpc){const {data,error}=await c.rpc('cinetracker_recommendation_memory_v101');if(!error&&Array.isArray(data))return serverMemory=data}}catch{}try{return serverMemory=JSON.parse(localStorage.getItem(MEMKEY)||'[]')}catch{return serverMemory=[]}}
function localRecord(x){try{const a=JSON.parse(localStorage.getItem(MEMKEY)||'[]');a.unshift({...x,shown_at:new Date().toISOString()});localStorage.setItem(MEMKEY,JSON.stringify(a.slice(0,500)))}catch{}}
async function recordRecommendation(card,action='shown'){
 const mediaId=num(card.dataset.mediaId||card.getAttribute('data-media-id'));if(!mediaId)return;
 const kind=(card.dataset.mediaType||card.dataset.kind||'').toLowerCase();const isWatch=/watchlist/i.test(card.closest('[data-section],section')?.textContent||'');
 const slot=`${isWatch?'watchlist':'fresh'}:${/anime/.test(kind)?'anime':/series|tv/.test(kind)?'series':'movie'}`;const context=isWatch?'watchlist':'outside';
 const payload={media_id:mediaId,context,slot,action};localRecord(payload);
 try{const c=sb();if(c?.rpc)await c.rpc('cinetracker_recommendation_record_v101',{p_media_id:mediaId,p_context:context,p_slot:slot,p_action:action})}catch{}
}
async function applyRecommendationMemory(){
 const mem=await loadMemory(),seen=new Set(mem.filter(x=>x.action==='shown'||x.action==='swapped').map(x=>String(x.media_id)));
 qa('[data-media-id]').forEach(card=>{const sec=card.closest('section,[data-section]');if(!sec||!/pra voc[eê]|para voc[eê]/i.test(sec.textContent||''))return;const id=String(card.dataset.mediaId||card.getAttribute('data-media-id'));if(seen.has(id)&&!card.dataset.ctR207Recorded)card.dataset.ctRecommendationSeen='1';if(!card.dataset.ctR207Recorded){card.dataset.ctR207Recorded='1';recordRecommendation(card,'shown')}});
}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-swap],[data-trocar],button');if(!b||!/trocar|swap/i.test((b.textContent||'')+' '+(b.getAttribute('aria-label')||'')))return;const card=b.closest('[data-media-id]');if(card)recordRecommendation(card,'swapped')},true);

function discoverRow(){qa('nav,.tabs,.filters,.discover-tabs,[class*="discover"][class*="filter"]').forEach(n=>{if(/pra voc[eê]|populares|novidades|aguardados|top ?10/i.test(n.textContent||'')){n.style.display='flex';n.style.flexWrap='nowrap';n.style.overflowX='auto';n.style.whiteSpace='nowrap';n.style.scrollbarWidth='none'}})}
function isolateTop10(){const active=qa('[aria-selected="true"],.active,.selected,.is-active').find(n=>/top ?10/i.test(n.textContent||''));if(!active)return;qa('section,[data-section]').forEach(s=>{if(/pra voc[eê]|para voc[eê]/i.test((s.querySelector('h1,h2,h3')?.textContent||''))&&!/top ?10/i.test(s.textContent||''))s.hidden=true})}

const F1='https://api.jolpi.ca/ergast/f1',F1TTL=600000,F1P='ct:r207:f1:';
async function jf(path){const k=F1P+path;let old=null;try{old=JSON.parse(localStorage.getItem(k)||'null');if(old&&Date.now()-old.t<F1TTL)return old.v}catch{}const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),10000);try{const r=await fetch(`${F1}/${path}.json`,{signal:ac.signal});if(!r.ok)throw Error(String(r.status));const v=await r.json();try{localStorage.setItem(k,JSON.stringify({t:Date.now(),v}))}catch{}return v}catch(e){if(old?.v)return old.v;throw e}finally{clearTimeout(tm)}}
const races=d=>d?.MRData?.RaceTable?.Races||[],dn=d=>`${d?.givenName||''} ${d?.familyName||''}`.trim(),fmt=x=>x?new Date(`${x}T12:00:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}):'—';
function sessionLines(r){return [['Treino 1',r?.FirstPractice],['Treino 2',r?.SecondPractice],['Treino 3',r?.ThirdPractice],['Sprint Shootout',r?.SprintShootout],['Sprint',r?.Sprint],['Classificação',r?.Qualifying],['Corrida',{date:r?.date,time:r?.time}]].filter(([,x])=>x?.date).map(([n,x])=>`<div class="ct-f1x-row"><b>${esc(n)}</b><span>${fmt(x.date)} ${esc((x.time||'').slice(0,5))}</span></div>`).join('')}
function f1Style(){if(q('#ct-r207-style'))return;const s=document.createElement('style');s.id='ct-r207-style';s.textContent=`.ct-f1x-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}.ct-f1x-card{border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px;background:rgba(255,255,255,.045)}.ct-f1x-row{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-top:1px solid rgba(255,255,255,.08)}.ct-f1x-row:first-child{border-top:0}.ct-f1x-tabs{display:flex;gap:8px;overflow:auto;margin:12px 0}.ct-f1x-tabs button{white-space:nowrap;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.06);color:inherit}.ct-f1x-tabs button.on{background:rgba(255,255,255,.17)}#ct-f1-advanced{margin-top:14px}`;document.head.appendChild(s)}
async function f1Advanced(tab='weekend'){
 const host=q('#ct-f1-body');if(!host)return;f1Style();host.innerHTML='<div class="ct-f1-loading">Carregando F1…</div>';
 try{
  if(tab==='weekend'){const [cal,res,qual,sprint]=await Promise.all([jf('current'),jf('current/last/results'),jf('current/last/qualifying'),jf('current/last/sprint').catch(()=>null)]);const rs=races(cal),next=rs.find(r=>new Date(r.date+'T23:59:59')>=new Date())||rs.at(-1),last=races(res)[0];host.innerHTML=`<div class="ct-f1x-grid"><div class="ct-f1x-card"><h3>Próximo fim de semana</h3><b>${esc(next?.raceName||'—')}</b>${sessionLines(next)}</div><div class="ct-f1x-card"><h3>Última corrida</h3>${(last?.Results||[]).slice(0,10).map(x=>`<div class="ct-f1x-row"><span>${esc(x.position)}. ${esc(dn(x.Driver))}</span><b>${esc(x.points)} pts</b></div>`).join('')}</div><div class="ct-f1x-card"><h3>Sprint</h3>${races(sprint||{})[0]?.SprintResults?.map(x=>`<div class="ct-f1x-row"><span>${esc(x.position)}. ${esc(dn(x.Driver))}</span><b>${esc(x.points)} pts</b></div>`).join('')||'Sem Sprint no último GP.'}</div></div>`}
  if(tab==='pitstops'){const d=await jf('current/last/pitstops');const r=races(d)[0];host.innerHTML=`<div class="ct-f1x-card"><h3>Pit stops — ${esc(r?.raceName||'último GP')}</h3>${(r?.PitStops||[]).slice(-40).map(x=>`<div class="ct-f1x-row"><span>Volta ${esc(x.lap)} · ${esc(x.driverId)}</span><b>${esc(x.duration)}</b></div>`).join('')||'Dados indisponíveis.'}</div>`}
  if(tab==='laps'){const d=await jf('current/last/laps');const r=races(d)[0],ls=r?.Laps||[];host.innerHTML=`<div class="ct-f1x-card"><h3>Voltas — ${esc(r?.raceName||'último GP')}</h3>${ls.slice(-12).map(l=>`<div class="ct-f1x-row"><b>Volta ${esc(l.number)}</b><span>${(l.Timings||[]).slice(0,3).map(t=>`${esc(t.driverId)} ${esc(t.time)}`).join(' · ')}</span></div>`).join('')||'Dados indisponíveis.'}</div>`}
 }catch(e){host.innerHTML='<div class="ct-f1-error">Não foi possível carregar estes dados da F1 agora.</div>'}
}
function upgradeF1(){const hub=q('#ct-f1-hub');if(!hub||q('#ct-f1-advanced'))return;const tabs=q('.ct-f1-tabs',hub);if(!tabs)return;const wrap=document.createElement('div');wrap.id='ct-f1-advanced';wrap.className='ct-f1x-tabs';wrap.innerHTML='<button data-r207-f1="weekend">Fim de semana</button><button data-r207-f1="pitstops">Pit stops</button><button data-r207-f1="laps">Voltas</button>';tabs.after(wrap);wrap.addEventListener('click',e=>{const b=e.target.closest('[data-r207-f1]');if(!b)return;qa('button',wrap).forEach(x=>x.classList.toggle('on',x===b));f1Advanced(b.dataset.r207F1)})}
let timer=0;function refresh(){clearTimeout(timer);timer=setTimeout(()=>{discoverRow();isolateTop10();applyRecommendationMemory();upgradeF1()},100)}
new MutationObserver(refresh).observe(document.documentElement,{subtree:true,childList:true});addEventListener('hashchange',refresh);addEventListener('popstate',refresh);document.addEventListener('DOMContentLoaded',refresh);refresh();
})();