/* CineTracker Web 1.0.93 r302 — personal Discover authority + finite Sports/Profile lifecycle. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR302)return;
window.__ctR302='discover-watched-watchlist-block+foryou-authority+finite-sports-profile';
window.__ctR302Discover='watched+watchlist-excluded+canonical-add';
window.__ctR302ForYou='watchlist-preserved+fresh-personal-filter';
window.__ctR302Stability='finite-hooks-no-global-dom-observer';
window.__ctR302Sports='filters-restored+365d-coverage+finite-repair';
window.__ctR302F1='no-drivers+clickable-calendar+complete-detail-modal';
window.__ctR302Android='preserved-1.0.20-10062';

const M302=window.__ctR295Test||{},T302=window.__ctR298Test||{},R302=window.__ctR288R263||{};
const baseBlocked302=typeof M302.blocked==='function'?M302.blocked:null;
const baseStrict302=typeof T302.strict==='function'?T302.strict:null;
const q302=(s,r=document)=>r?.querySelector?.(s)||null;
const qa302=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm302=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc302=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const type302=x=>String(x?.media_type||x?.type||x?.category||x?.item?.media_type||x?.item?.type||'tv')==='movie'?'movie':'tv';
const id302=x=>{const v=x?.tmdb_id??x?.source_tmdb_id??x?.media_id??x?.item?.tmdb_id??x?.item?.source_tmdb_id??x?.raw_tmdb?.id??x?.id;const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const key302=x=>{const id=id302(x);return id?`${type302(x)}:${id}`:''};
function watchKeys302(){
 const c=M302.cache||{},rows=[...(Array.isArray(c.watchRows)?c.watchRows:[]),...(Array.isArray(c.watchlistRows)?c.watchlistRows:[])],set=new Set();
 for(const row of rows){const k=key302(row);if(k)set.add(k)}
 return set;
}
function inWatchlist302(x){const k=key302(x);return !!k&&watchKeys302().has(k)}
function blocked302(x){try{if(baseBlocked302?.call(M302,x))return true}catch{}return inWatchlist302(x)}
M302.blocked=blocked302;
if(baseStrict302){T302.strict=function(x,opt){let ok=false;try{ok=!!baseStrict302.call(T302,x,opt)}catch{return false}if(!ok)return false;return opt?.watch?true:!inWatchlist302(x)}}

let refreshTimer302=0;
function route302(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function tab302(){return String(R302.discover263?.tab||'foryou')}
async function refreshDiscover302(){
 if(route302()!=='discover')return false;
 try{await Promise.resolve(M302.authority?.(true))}catch{}
 if(route302()!=='discover')return false;
 const load=window.__ctR288LoadDiscover;if(typeof load!=='function')return false;
 try{await Promise.resolve(load(tab302(),true));return true}catch{return false}
}
function scheduleDiscover302(){clearTimeout(refreshTimer302);refreshTimer302=setTimeout(()=>{void refreshDiscover302()},90)}

/* SPORTS — preserve native controls, restore missing modality filters and request a wider event window. */
const sportLabel302=s=>({formula_1:'Fórmula 1',football:'Futebol',soccer:'Futebol',basketball:'Basquete',nba:'Basquete',american_football:'Futebol Americano',nfl:'Futebol Americano',baseball:'Beisebol',mlb:'Beisebol',hockey:'Hóquei',nhl:'Hóquei',tennis:'Tênis',volleyball:'Vôlei'}[String(s||'').toLowerCase()]||String(s||'Esporte').replace(/_/g,' '));
function sportOf302(x){return String(x?.sport_slug||x?.sport||x?.sport_id||x?.league?.sport_slug||'').toLowerCase()}
function sportsEvents302(){try{return Array.isArray(sport255?.payload?.events)?sport255.payload.events:[]}catch{return[]}}
function removeDrivers302(){
 for(const b of qa302('[data-ct255-f1tab],[data-ct257-f1tab]')){
  const k=String(b.dataset.ct255F1tab||b.dataset.ct257F1tab||'');if(k==='drivers'||norm302(b.textContent)==='pilotos')b.remove();
 }
 try{if(typeof F1_TABS255!=='undefined'&&Array.isArray(F1_TABS255)){for(let i=F1_TABS255.length-1;i>=0;i--){const k=String(F1_TABS255[i]?.[0]||''),t=norm302(F1_TABS255[i]?.[1]);if(k==='drivers'||t==='pilotos')F1_TABS255.splice(i,1)}}}catch{}
}
function nodeSport302(node){
 const direct=String(node?.dataset?.sportSlug||node?.dataset?.sport||node?.dataset?.ct255Sport||'').toLowerCase();if(direct)return direct;
 const txt=norm302(node?.textContent||'');
 if(/formula 1|f1\b/.test(txt))return'formula_1';if(/nba|basquete|basketball/.test(txt))return'basketball';if(/nfl|futebol americano|american football/.test(txt))return'american_football';if(/mlb|beisebol|baseball/.test(txt))return'baseball';if(/nhl|hoquei|hockey/.test(txt))return'hockey';if(/tenis|tennis/.test(txt))return'tennis';if(/volei|volleyball/.test(txt))return'volleyball';if(/futebol|soccer|premier league|champions|libertadores|brasileirao/.test(txt))return'football';return'';
}
function applySportFilter302(slug){
 const root=q302('[data-ct255-sports],[data-sports]');if(!root)return false;root.dataset.ct302SportFilter=slug||'all';
 const feed=q302('.ct255-sports-feed',root)||root;
 const nodes=qa302('[data-sport-slug],[data-sport],.ct255-sport-card,.ct255-event-card,.sport-card,.event-card',feed);
 for(const n of nodes){const s=nodeSport302(n);n.hidden=!!(slug&&slug!=='all'&&s&&s!==slug)}
 const filters=q302('[data-ct302-sport-filters]',root);if(filters)for(const b of qa302('[data-ct302-sport-filter]',filters))b.classList.toggle('active',String(b.dataset.ct302SportFilter)===String(slug||'all'));
 return true;
}
function ensureSportsFilters302(){
 if(route302()!=='sports')return false;const root=q302('[data-ct255-sports],[data-sports]');if(!root)return false;removeDrivers302();
 const native=q302('.ct255-sport-filters',root);if(native){native.hidden=false;native.removeAttribute('hidden');native.style.removeProperty('display');native.style.removeProperty('visibility');native.dataset.ct302Restored='1';return true}
 let bar=q302('[data-ct302-sport-filters]',root);const slugs=[...new Set(sportsEvents302().map(sportOf302).filter(Boolean))];if(!slugs.length)return false;
 if(!bar){bar=document.createElement('div');bar.className='ct255-sport-filters ct302-sport-filters';bar.dataset.ct302SportFilters='1';const tabs=q302('.ct255-sports-tabs',root),f1=q302('.ct255-f1hub,[data-ct255-f1]',root);(tabs||f1)?.after(bar);if(!bar.parentNode)root.prepend(bar)}
 const current=String(root.dataset.ct302SportFilter||'all');bar.innerHTML=[['all','Todos'],...slugs.map(s=>[s,sportLabel302(s)])].map(([s,l])=>`<button type="button" class="chip${current===s?' active':''}" data-ct302-sport-filter="${esc302(s)}">${esc302(l)}</button>`).join('');return true;
}
try{
 if(typeof loadSports255==='function'){
  loadSports255=async function(force=false){
   if(!force&&sport255?.payload&&Date.now()-Number(sport255.at||0)<45000)return sport255.payload;
   const p=await rpc('cinetracker_sports_payload_v1',{p_from:new Date(Date.now()-30*86400000).toISOString(),p_to:new Date(Date.now()+365*86400000).toISOString()});
   sport255.payload=p||{};sport255.at=Date.now();return sport255.payload;
  };
 }
}catch{}
function repairSports302(){if(route302()!=='sports')return false;removeDrivers302();ensureSportsFilters302();const root=q302('[data-ct255-sports],[data-sports]');if(root){const current=String(root.dataset.ct302SportFilter||'all');if(current!=='all')applySportFilter302(current)}return true}
try{if(typeof renderSports==='function'){const base=renderSports;renderSports=async function(){const out=await base.apply(this,arguments);for(const ms of[0,80,260,700])setTimeout(repairSports302,ms);return out}}}catch{}

/* F1 — r301 already opens a custom modal; r302 enriches it with all grid context without another DOM observer. */
function enrichF1Modal302(source){
 const modal=q302('.ct301-f1-modal');if(!modal||q302('[data-ct302-f1-extra]',modal))return false;const body=q302('.ct301-f1-modal-body',modal);if(!body)return false;
 const headline=q302('b',source)?.textContent||source?.dataset?.title||'Fórmula 1';const watched=source?.dataset?.watched==='1',started=source?.dataset?.started==='1';
 const extra=document.createElement('div');extra.className='ct302-f1-extra';extra.dataset.ct302F1Extra='1';extra.innerHTML=`<p><b>Etapa:</b> ${esc302(headline)}</p><p><b>Status:</b> ${esc302(watched?'Assistido':started?'Evento iniciado/concluído':'Próximo evento')}</p><p><b>ID do evento:</b> ${esc302(source?.dataset?.eventId||'—')}</p><p><b>Fonte:</b> ${esc302(source?.dataset?.provider||'—')}</p>`;body.appendChild(extra);modal.dataset.ct302Complete='1';return true;
}
document.addEventListener('pointerdown',e=>{const ev=e.target?.closest?.('[data-ct301-f1-event]');if(ev)setTimeout(()=>enrichF1Modal302(ev),0)},true);

function finiteReconcile302(){const r=route302();if(r==='sports')repairSports302();else if(r==='discover'){}else if(r==='profile'){try{window.__ctR301Test?.stabilizeProfile301?.()}catch{}}}
function finiteBurst302(){for(const ms of[0,80,240,650])setTimeout(finiteReconcile302,ms)}

document.addEventListener('click',e=>{
 const f=e.target?.closest?.('[data-ct302-sport-filter]');if(f){e.preventDefault();e.stopImmediatePropagation();applySportFilter302(String(f.dataset.ct302SportFilter||'all'));return}
 const sportsTab=e.target?.closest?.('[data-ct255-sport-tab]');if(sportsTab)for(const ms of[0,80,220])setTimeout(repairSports302,ms);
 const f1tab=e.target?.closest?.('[data-ct255-f1tab],[data-ct257-f1tab]');if(f1tab)for(const ms of[0,80,220])setTimeout(removeDrivers302,ms);
},true);
document.addEventListener('cinetracker:data-changed',()=>{scheduleDiscover302();finiteBurst302()},false);
window.addEventListener('popstate',()=>{if(route302()==='discover')scheduleDiscover302();finiteBurst302()},false);
for(const ms of[0,250,900])setTimeout(finiteReconcile302,ms);

window.__ctR302Test={blocked302,inWatchlist302,watchKeys302,refreshDiscover302,ensureSportsFilters302,applySportFilter302,repairSports302,removeDrivers302,enrichF1Modal302,get baseBlocked(){return baseBlocked302},get hasGlobalObserver(){return false},get sportsWindowDays(){return 365}};
})();
