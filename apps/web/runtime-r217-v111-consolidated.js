/* CineTracker 1.0.11 — consolidated authority on top of the stable 1.0.0/r204 Web base
 * and the physically validated 1.0.0/r243 Android base.
 * No 1.0.4/1.0.7/1.0.8/1.0.9/1.0.10 runtime is imported here.
 */
(()=>{
'use strict';
if(window.__ctR217Consolidated)return;
window.__ctR217Consolidated='v111-r204-r243-single-release-authority';
window.__ctV111BasePolicy='web-r204-android-r243-skip-r205-r216-r246-r252';
window.__ctV111History='hidden-above-home-rewatch-explicit';
window.__ctV111F1='single-hub-season-payload';
window.__ctV111Top10='three-complete-cards-mobile';
window.__ctV111Sports='no-summary-single-column-mobile';

const q111=(s,r=document)=>r?.querySelector?.(s)||null;
const qa111=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n111=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const e111=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- Home History / Rewatch: explicit renderer authority ---------- */
let rw111=new Map(),rw111At=0,rw111Task=null;
const rwKey111=(kind,tmdb,s=0,e=0)=>kind==='episode'?`episode:${tmdb}:${s}:${e}`:`movie:${tmdb}`;
async function loadRw111(force=false){
 if(!force&&Date.now()-rw111At<10000)return rw111;
 if(rw111Task)return rw111Task;
 rw111Task=(async()=>{try{const rows=await rpc('cinetracker_rewatch_counts_v104',{}),m=new Map();for(const x of Array.isArray(rows)?rows:[])m.set(rwKey111(String(x.item_type),n111(x.tmdb_id),n111(x.season_number),n111(x.episode_number)),Math.max(1,n111(x.plays)||1));rw111=m;rw111At=Date.now()}catch{}return rw111})().finally(()=>rw111Task=null);
 return rw111Task;
}
function rwText111(kind,tmdb,s=0,e=0){const p=rw111.get(rwKey111(kind,tmdb,s,e))||1;return p>1?`↻ ${p}x`:'↻ Reassistir'}
function button111(kind,tmdb,s=0,e=0){return `<button type="button" class="ct111-rewatch" data-ct111-rewatch="${kind}" data-tmdb="${tmdb}"${s?` data-season="${s}"`:''}${e?` data-episode="${e}"`:''}>${rwText111(kind,tmdb,s,e)}</button>`}
try{
 const baseMovie111=homeMovieRow158;
 homeMovieRow158=function(x,history=false){
   if(!history)return baseMovie111(x,false);
   const id=mediaTmdb(x),p=mediaPoster(x),meta=x.watched_at?new Date(x.watched_at).toLocaleString('pt-BR'):'Visto';
   return '<div class="home-action-row ct111-history-row" data-ct111-history="movie"><div class="media-row" data-media="movie:'+id+'"><div class="thumb"'+(p?' style="background-image:url(\''+img(p,'w154')+'\')"':'')+'></div><div><b>'+e111(mediaTitle(x))+'</b><small>'+e111(meta)+'</small></div><span class="badge">✓</span></div>'+button111('movie',id)+'</div>';
 };
}catch{}
try{
 homeEpisodeHistory158=function(x){
   const p=mediaPoster(x),id=mediaTmdb(x),s=n111(x.season_number),ep=n111(x.episode_number),meta='S'+String(s).padStart(2,'0')+' E'+String(ep).padStart(2,'0')+(x.watched_at?' · '+new Date(x.watched_at).toLocaleString('pt-BR'):'');
   return '<div class="home-action-row ct111-history-row" data-ct111-history="episode"><div class="media-row" data-media="tv:'+id+'"><div class="thumb"'+(p?' style="background-image:url(\''+img(p,'w154')+'\')"':'')+'></div><div><b>'+e111(mediaTitle(x))+'</b><small>'+e111(meta)+'</small></div><span class="badge">✓</span></div>'+button111('episode',id,s,ep)+'</div>';
 };
}catch{}
function syncRwLabels111(){for(const b of qa111('[data-ct111-rewatch]')){const k=b.dataset.ct111Rewatch,t=n111(b.dataset.tmdb),s=n111(b.dataset.season),e=n111(b.dataset.episode),p=rw111.get(rwKey111(k,t,s,e))||1;b.dataset.plays=String(p);b.textContent=p>1?`↻ ${p}x`:'↻ Reassistir'}}
try{const basePaint111=paintHome;paintHome=function(...args){const out=basePaint111.apply(this,args);void loadRw111(false).then(syncRwLabels111);return out}}catch{}
async function rewatch111(b){
 if(!b||b.dataset.busy==='1')return;const kind=b.dataset.ct111Rewatch,tmdb=n111(b.dataset.tmdb),s=n111(b.dataset.season),ep=n111(b.dataset.episode);if(!(tmdb>0)||!kind||(kind==='episode'&&!(s>0&&ep>0)))return;
 const before=Math.max(1,n111(b.dataset.plays)||rw111.get(rwKey111(kind,tmdb,s,ep))||1);b.dataset.busy='1';b.disabled=true;b.textContent='Salvando...';
 try{
   const m=await ensureMedia(kind==='movie'?'movie':'tv',tmdb),row=b.closest('.ct111-history-row'),title=q111('b',row)?.textContent||m.title||null;
   const r=await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(m.id),p_item_type:kind,p_season_number:kind==='episode'?s:null,p_episode_number:kind==='episode'?ep:null,p_title:title,p_runtime_minutes:Number(m.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});
   await loadRw111(true);const plays=Math.max(before+1,n111(r?.plays)||rw111.get(rwKey111(kind,tmdb,s,ep))||before+1);rw111.set(rwKey111(kind,tmdb,s,ep),plays);
   try{homeCache=await rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()});profileCache=null;paintHome()}catch{syncRwLabels111()}
   try{toast(`Registrado · ${plays}x`)}catch{}
 }catch(err){b.dataset.plays=String(before);b.textContent=before>1?`↻ ${before}x`:'↻ Reassistir';try{toast(err?.message||String(err))}catch{}}
 finally{b.disabled=false;delete b.dataset.busy}
}
document.addEventListener('click',ev=>{const b=ev.target.closest?.('[data-ct111-rewatch]');if(!b)return;ev.preventDefault();ev.stopImmediatePropagation();void rewatch111(b)},true);

/* ---------- Formula 1: one client authority, one season payload ---------- */
let f111Data=null,f111At=0,f111Task=null,f111Tab='overview';
const f111Races=x=>x?.MRData?.RaceTable?.Races||[];
const f111Stand=(x,key)=>x?.MRData?.StandingsTable?.StandingsLists?.[0]?.[key]||[];
const f111Race=x=>f111Races(x)?.[0]||{};
const f111Driver=d=>`${d?.givenName||''} ${d?.familyName||''}`.trim();
const f111Date=d=>d?new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}):'—';
async function getF111(force=false){
 if(!force&&f111Data&&Date.now()-f111At<120000)return f111Data;if(f111Task)return f111Task;
 const season=new Date().getFullYear();f111Task=edge('cinetracker-f1-v1',{season},30000).then(d=>{if(!Array.isArray(d?.races)||!d.races.length)throw new Error('Calendário F1 indisponível');f111Data=d;f111At=Date.now();try{localStorage.setItem('ct:v111:f1:'+season,JSON.stringify({t:f111At,d}))}catch{}return d}).catch(err=>{try{const c=JSON.parse(localStorage.getItem('ct:v111:f1:'+season)||'null');if(c?.d?.races?.length){f111Data=c.d;return c.d}}catch{}throw err}).finally(()=>f111Task=null);return f111Task;
}
function rowsF111(a,constructors=false){return (a||[]).slice(0,20).map(x=>`<div class="ct111-f1-row"><b>${e111(x.position||'')}</b><span>${e111(constructors?x.Constructor?.name:f111Driver(x.Driver))}<small>${e111(constructors?'':x.Constructors?.[0]?.name||x.Constructor?.name||'')}</small></span><strong>${e111(x.points||0)} pts</strong></div>`).join('')}
function resultsF111(r,key='Results'){return (r?.[key]||[]).slice(0,20).map(x=>`<div class="ct111-f1-row"><b>${e111(x.position||x.number||'')}</b><span>${e111(f111Driver(x.Driver))}<small>${e111(x.Constructor?.name||'')}</small></span><strong>${e111(x.Time?.time||x.status||x.Q3||x.Q2||x.Q1||'')}</strong></div>`).join('')}
function bodyF111(d,tab){
 const drv=f111Stand(d.drivers,'DriverStandings'),con=f111Stand(d.constructors,'ConstructorStandings'),res=f111Race(d.results),qual=f111Race(d.qualifying),spr=f111Race(d.sprint),pit=f111Race(d.pitstops),laps=f111Race(d.laps);
 if(tab==='calendar')return `<div class="ct111-f1-card">${(d.races||[]).map(r=>`<div class="ct111-f1-race"><b>${e111(r.round)}. ${e111(r.raceName)}</b><small>${e111(r.Circuit?.circuitName||'')} · ${f111Date(r.date)}</small></div>`).join('')}</div>`;
 if(tab==='drivers')return `<div class="ct111-f1-card">${rowsF111(drv)}</div>`;
 if(tab==='constructors')return `<div class="ct111-f1-card">${rowsF111(con,true)}</div>`;
 if(tab==='last')return `<div class="ct111-f1-grid"><div class="ct111-f1-card"><h3>Resultado</h3>${resultsF111(res)}</div><div class="ct111-f1-card"><h3>Classificação</h3>${resultsF111(qual,'QualifyingResults')}</div><div class="ct111-f1-card"><h3>Sprint</h3>${resultsF111(spr,'SprintResults')||'<div class="empty">Sem Sprint.</div>'}</div></div>`;
 if(tab==='pitstops')return `<div class="ct111-f1-card"><h3>Pit stops</h3>${(pit?.PitStops||[]).slice(0,60).map(x=>`<div class="ct111-f1-row"><b>V${e111(x.lap||'')}</b><span>${e111(x.driverId||'')}</span><strong>${e111(x.duration||x.time||'')}</strong></div>`).join('')||'<div class="empty">Sem dados.</div>'}</div>`;
 if(tab==='laps')return `<div class="ct111-f1-card"><h3>Voltas</h3>${(laps?.Laps||[]).slice(-30).map(x=>`<div class="ct111-f1-race"><b>Volta ${e111(x.number||'')}</b><small>${(x.Timings||[]).slice(0,6).map(t=>`${e111(t.driverId)} ${e111(t.time)}`).join(' · ')}</small></div>`).join('')||'<div class="empty">Sem dados.</div>'}</div>`;
 const next=d.next||{},last=d.last||{};return `<div class="ct111-f1-grid"><div class="ct111-f1-card"><h3>Próximo GP</h3><h2>${e111(next.raceName||'—')}</h2><small>${e111(next.Circuit?.circuitName||'')} · ${f111Date(next.date)}</small></div><div class="ct111-f1-card"><h3>Pilotos</h3>${rowsF111(drv.slice(0,5))}</div><div class="ct111-f1-card"><h3>Construtores</h3>${rowsF111(con.slice(0,5),true)}</div><div class="ct111-f1-card"><h3>Último GP</h3><b>${e111(last.raceName||'—')}</b>${resultsF111(res).slice(0,2500)}</div></div>`;
}
function ensureF111Shell(){const root=q111('[data-sports]');if(!root)return null;root.querySelector('.sports-summary')?.closest('.panel')?.remove();let hub=q111('#ct-f1-v111',root);if(!hub){hub=document.createElement('section');hub.id='ct-f1-v111';hub.className='ct111-f1';hub.innerHTML=`<div class="ct111-f1-head"><div><small>FÓRMULA 1</small><h2>F1 Hub</h2></div><div class="ct111-f1-tabs">${[['overview','Visão geral'],['calendar','Calendário'],['drivers','Pilotos'],['constructors','Construtores'],['last','Último GP'],['pitstops','Pit stops'],['laps','Voltas']].map(([k,l])=>`<button type="button" data-ct111-f1="${k}">${l}</button>`).join('')}</div></div><div data-ct111-f1-body><div class="loader">Carregando Fórmula 1...</div></div>`;root.prepend(hub)}return hub}
async function paintF111(force=false){if(String(location.pathname||'').indexOf('/sports')!==0&&(()=>{try{return route()!=='sports'}catch{return true}})())return;const hub=ensureF111Shell();if(!hub)return;const body=q111('[data-ct111-f1-body]',hub);if(force||!f111Data)body.innerHTML='<div class="loader">Carregando Fórmula 1...</div>';try{const d=await getF111(force);if(q111('#ct-f1-v111')===hub)body.innerHTML=bodyF111(d,f111Tab)}catch(err){body.innerHTML=`<div class="error">Fórmula 1 indisponível. <button type="button" class="btn" data-ct111-f1-retry>Tentar novamente</button><small>${e111(err?.message||String(err))}</small></div>`}}
try{const baseSportsPaint111=paintSports;paintSports=function(...args){const out=baseSportsPaint111.apply(this,args);ensureF111Shell();void paintF111(false);return out}}catch{}
try{const baseSportsRender111=renderSports;renderSports=async function(...args){const out=await baseSportsRender111.apply(this,args);ensureF111Shell();void paintF111(false);return out}}catch{}
document.addEventListener('click',ev=>{const t=ev.target.closest?.('[data-ct111-f1]');if(t){ev.preventDefault();f111Tab=t.dataset.ct111F1;if(f111Data){const b=q111('[data-ct111-f1-body]');if(b)b.innerHTML=bodyF111(f111Data,f111Tab)}return}if(ev.target.closest?.('[data-ct111-f1-retry]')){ev.preventDefault();f111At=0;void paintF111(true)}},true);

/* ---------- Geometry: three complete Top10 cards, compact single-column Sports ---------- */
const st111=document.createElement('style');st111.id='ct-v111-consolidated-style';st111.textContent=`
[data-sports] .sports-summary{display:none!important}
.ct111-rewatch{flex:0 0 auto;align-self:center;border:1px solid #35647e;background:#0b1c27;color:#d7f4ff;border-radius:9px;padding:7px 9px;font-weight:800;white-space:nowrap}
.ct111-history-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:8px!important;align-items:center!important}
.ct111-f1{margin:0 0 14px;border:1px solid #214b62;border-radius:14px;background:#071823;padding:12px;min-width:0}.ct111-f1-head{display:grid;gap:10px}.ct111-f1-head h2{margin:2px 0 0}.ct111-f1-tabs{display:flex;gap:7px;overflow-x:auto}.ct111-f1-tabs button{flex:0 0 auto;border:1px solid #285b74;background:#0b1c27;color:#d7f4ff;border-radius:9px;padding:7px 9px}.ct111-f1-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}.ct111-f1-card{border:1px solid #173c50;border-radius:11px;background:#081923;padding:10px;min-width:0}.ct111-f1-row{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid #17313d}.ct111-f1-row span,.ct111-f1-row small{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis}.ct111-f1-race{padding:8px 0;border-bottom:1px solid #17313d}.ct111-f1-race b,.ct111-f1-race small{display:block}
@media(max-width:760px){
 [data-discover] .ct171-top-row{box-sizing:border-box!important;width:100%!important;max-width:100%!important;gap:6px!important;padding:0 0 7px!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important}
 [data-discover] .ct171-top-row>.ct171-top-card{box-sizing:border-box!important;flex:0 0 calc((100% - 12px)/3)!important;width:calc((100% - 12px)/3)!important;min-width:calc((100% - 12px)/3)!important;max-width:calc((100% - 12px)/3)!important;scroll-snap-align:start!important}
 [data-sports] .event-grid,[data-sports] .favorites-grid,[data-sports] .ct170-sports-entities{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:8px!important;width:100%!important;min-width:0!important}
 [data-sports] .event,[data-sports] .favorite-card,[data-sports] .ct170-sports-entity{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important}
 .ct111-f1-grid{grid-template-columns:minmax(0,1fr)!important}.ct111-history-row{grid-template-columns:minmax(0,1fr) auto!important}
}
`;
document.getElementById(st111.id)?.remove();document.head.appendChild(st111);
})();
