/* CineTracker 1.0.16 — final DOM authority for Watchlist + exact Formula 1 favorite modal authority. */
(()=>{
'use strict';
if(window.__ctR222V116)return;
window.__ctR222V116='final-dom-watchlist-direct-rpc-f1-favorite-modal';
window.__ctV116Watchlist='direct-auth-rpc-final-dom-no-old-filter-chain';
window.__ctV116F1='ct165-favorite-modal-direct-f1-session-authority';

const q116=(s,r=document)=>r?.querySelector?.(s)||null;
const qa116=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n116=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const norm116=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc116=v=>{try{return esc(v)}catch{return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}};
const id116=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}};
const type116=x=>String(x?.media_type||'')==='movie'?'movie':'tv';
const kind116=x=>{const k=String(x?.media_kind||'').toLowerCase();if(k==='anime')return'anime';return type116(x)==='movie'?'movie':'series'};
let wl116=null,wlAt116=0,wlTask116=null;

function card116(row){try{const x=dashboardCard162(row);if(x)return x}catch{}return row}
async function enrich116(row){
 let x=card116(row);try{if(mediaPoster(x))return x}catch{}
 const id=id116(row),t=type116(row);if(!(id>0))return x;
 try{const d=await tmdb(`/${t==='movie'?'movie':'tv'}/${id}`);x={...x,...d,id,tmdb_id:id,media_type:t,media_kind:kind116(row),raw_tmdb:{...(row?.raw_tmdb||{}),...d}}}catch{}
 return x;
}
async function loadWatch116(force=false){
 if(!force&&wl116&&Date.now()-wlAt116<45000)return wl116;if(wlTask116)return wlTask116;
 wlTask116=(async()=>{
  const d=await rpc('cinetracker_watchlist_candidates_v116',{}),rows=Array.isArray(d?.rows)?d.rows:[],groups={movie:[],series:[],anime:[]};
  for(const r of rows)groups[kind116(r)].push(r);
  const out={movie:[],series:[],anime:[]};
  await Promise.all(Object.keys(groups).map(async k=>{
   const src=groups[k].slice(0,36),done=[];
   for(let i=0;i<src.length;i+=12){const batch=await Promise.all(src.slice(i,i+12).map(enrich116));for(const x of batch){try{if(x&&id116(x)>0&&mediaPoster(x)&&!done.some(y=>id116(y)===id116(x)))done.push(x)}catch{}}if(done.length>=12)break}
   out[k]=done;
  }));
  wl116=out;wlAt116=Date.now();window.__ctV116LastWatchlist=out;return out;
 })().finally(()=>wlTask116=null);return wlTask116;
}
function wlSection116(){
 const root=q116('[data-discover-content]')||q116('[data-page="discover"]');if(!root)return null;
 return qa116('section',root).find(s=>norm116(q116('.panel-head h2,h2',s)?.textContent||'')==='da sua watchlist')||null;
}
function slotIndex116(key,len){if(!len)return 0;try{return Math.max(0,n116(ct166SwapIndex?.[key]||0))%len}catch{return 0}}
function slotHtml116(label,row,key,count){
 try{return ct166Slot(label,row,key,count)}catch{return `<div class="foryou-slot ct166-slot"><div class="ct166-slot-head"><small>${esc116(label)}</small></div>${row?discoverCard158(row):'<div class="empty compact">Sem item na Watchlist</div>'}</div>`}
}
async function hydrateWatch116(force=false){
 try{
  if((()=>{try{return route()==='discover'&&discoverState?.tab==='foryou'}catch{return false}})()===false)return;
  const sec=wlSection116();if(!sec)return;const g=q116('.foryou-grid',sec);if(!g)return;
  const p=await loadWatch116(force);if(!document.contains(sec))return;
  const movie=p.movie[slotIndex116('watchlist:movie',p.movie.length)]||null,series=p.series[slotIndex116('watchlist:series',p.series.length)]||null,anime=p.anime[slotIndex116('watchlist:anime',p.anime.length)]||null;
  g.innerHTML=slotHtml116('Filme',movie,'watchlist:movie',p.movie.length)+slotHtml116('Série',series,'watchlist:series',p.series.length)+slotHtml116('Anime',anime,'watchlist:anime',p.anime.length);
  sec.dataset.ct116Watchlist='direct-final-dom';sec.dataset.ct116Counts=`${p.movie.length},${p.series.length},${p.anime.length}`;
 }catch(e){try{console.warn('ct116 watchlist hydrate',e)}catch{}}
}
try{const base=paintDiscover;paintDiscover=function(...args){const out=base.apply(this,args);requestAnimationFrame(()=>void hydrateWatch116(false));return out}}catch{}
try{const base=renderDiscover;renderDiscover=async function(...args){const out=await base.apply(this,args);requestAnimationFrame(()=>void hydrateWatch116(false));return out}}catch{}
try{const base=addWatchlist;addWatchlist=async function(...args){const out=await base.apply(this,args);wl116=null;wlAt116=0;setTimeout(()=>void hydrateWatch116(true),0);return out}}catch{}

/* ---------- exact authority used by Favorites -> Ver eventos ---------- */
function dateIso116(obj){if(!obj?.date)return'';try{return new Date(`${obj.date}T${obj.time||'12:00:00Z'}`).toISOString()}catch{return''}}
function f1AllSessions116(d,fromMs,toMs){
 const out=[],fields=[['FirstPractice','Treino Livre 1'],['SecondPractice','Treino Livre 2'],['ThirdPractice','Treino Livre 3'],['SprintQualifying','Classificação Sprint'],['SprintShootout','Shootout Sprint'],['Sprint','Sprint'],['Qualifying','Classificação']];
 for(const r of d?.races||[]){
  const add=(label,obj,type)=>{const starts=dateIso116(obj);if(!starts)return;const ms=Date.parse(starts);if(ms<fromMs||ms>=toMs)return;out.push({id:`f1:${r.round}:${type}`,title:`${r.raceName||'Grand Prix'} · ${label}`,starts_at:starts,status:ms<Date.now()?'finished':'scheduled',competition_name:'Fórmula 1',sport_slug:'formula_1',round:`Etapa ${r.round||''}`,venue:r?.Circuit?.circuitName||r?.Circuit?.Location?.locality||'',session_type:type})};
  for(const [field,label] of fields)add(label,r?.[field],field);add('Corrida',{date:r.date,time:r.time},'Race');
 }
 return out.sort((a,b)=>Date.parse(a.starts_at)-Date.parse(b.starts_at));
}
function modal116(title){const m=document.createElement('div');m.className='ct165-modal';m.innerHTML=`<div class="ct165-modal-card"><div class="ct165-modal-head"><b>${esc116(title)}</b><button type="button" data-ct165-close>×</button></div><div class="ct165-modal-body"><div class="loader">Carregando eventos...</div></div></div>`;document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m||e.target.closest?.('[data-ct165-close]'))m.remove()});return m}
function eventRows116(ev){return ev.length?`<div class="ct165-event-list">${ev.map(e=>`<div class="ct165-event"><div><b>${esc116(e.title||e.home_name||'Evento')}</b>${e.away_name?`<span> × ${esc116(e.away_name)}</span>`:''}</div><small>${new Date(e.starts_at).toLocaleString('pt-BR')} · ${esc116(e.competition_name||e.sport_slug||'')}</small><strong>${esc116(e.status||'')}${e.round?` · ${esc116(e.round)}`:''}</strong></div>`).join('')}</div>`:'<div class="empty">Nenhum evento relacionado encontrado nesse período.</div>'}
try{
 ct165OpenFavorite=async function(entityId){
  if(!(Number(entityId)>0))return;const m=modal116('Carregando eventos...'),body=q116('.ct165-modal-body',m),head=q116('.ct165-modal-head b',m);
  try{
   const favData=await rpc('cinetracker_sport_favorite_events_v2',{p_entity_id:Number(entityId),p_from:shiftDays(-30),p_to:shiftDays(14)}),f=favData?.favorite||{};
   head.textContent=(f.name||'Favorito')+' · eventos';
   let ev=Array.isArray(favData?.events)?favData.events:[];
   if(String(f.sport_slug)==='formula_1'){
    const now=new Date(),from=new Date(now);from.setDate(from.getDate()-30);from.setHours(0,0,0,0);const to=new Date(now);to.setDate(to.getDate()+15);to.setHours(0,0,0,0);
    const fd=await edge('cinetracker-f1-v1',{season:now.getFullYear()},30000);ev=f1AllSessions116(fd,+from,+to);m.dataset.ct116F1Modal='direct-session-authority';
   }
   body.innerHTML=`<div class="ct165-fav-summary"><span>${esc116(f.entity_type||'Entidade')}</span><span>${esc116(f.sport_slug||'')}</span><span>Últimos 30 dias + próximos 14</span></div>`+eventRows116(ev);
  }catch(e){body.innerHTML=`<div class="error">Não foi possível carregar os eventos: ${esc116(e?.message||e)}</div>`}
 };
}catch{}

window.__ctV116LoadWatchlist=loadWatch116;
window.__ctV116HydrateWatchlist=hydrateWatch116;
window.__ctV116F1Sessions=f1AllSessions116;
requestAnimationFrame(()=>void hydrateWatch116(false));
})();
