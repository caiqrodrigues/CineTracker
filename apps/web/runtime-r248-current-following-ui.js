/* CineTracker Web 1.0.39 r248 — WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR248)return;
window.__ctR248='current-following-complete-ui-authority';
window.__ctR248Scope='web-only';
window.__ctR248Home='current-frontier-keeps-historical-backlog-unwatched';
window.__ctR248Discover='stable-canonical-rules-no-html-restore';
window.__ctR248Sports='four-tabs-today-d3-favorites-watched';
window.__ctR248F1='jolpica-six-tabs-persistent-collapse';
window.__ctR248Profile='one-stable-statistics-group';
window.__ctR248Horizontal='dynamic-local-scrollbars-no-page-x';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const safeDate=v=>{const d=v instanceof Date?v:new Date(v||0);return Number.isFinite(d.getTime())?d:new Date(0)};
const localDay=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());

/* Home: historical holes behind the current following frontier never make a show late. */
function epPos(ep){
 if(!ep||typeof ep!=='object')return 0;
 const s=num(ep.season_number??ep.season??ep.s??ep.seasonNumber),e=num(ep.episode_number??ep.episode??ep.e??ep.episodeNumber);
 return s>0&&e>0?s*100000+e:0;
}
function rowFrontier(row){
 const list=[
  {season_number:row?.last_season,episode_number:row?.last_episode},
  {season_number:row?.current_season,episode_number:row?.current_episode},
  {season_number:row?.last_watched_season,episode_number:row?.last_watched_episode},
  row?.last_watched_episode_data,row?.progress_episode,row?.current_episode_data
 ];
 return list.reduce((m,x)=>Math.max(m,epPos(x)),0);
}
function historicalBehind(row,current){const f=rowFrontier(row),c=epPos(current);return f>0&&c>0&&c<=f}
function applyFrontier(mediaId,current){
 try{
  const row=(homeCache?.series||[]).find(x=>num(x?.media_id||x?.mediaId)===num(mediaId));
  if(!row||!historicalBehind(row,current))return false;
  const changed=row.home_bucket!=='caught_up'||row.is_caught_up!==true||row._ctHomeForceContinue===true;
  row.home_bucket='caught_up';row.is_caught_up=true;row._ctHomeForceContinue=false;row._ctHomeState='caught_up';row._ct248HistoricalBacklogPreserved=true;
  if(changed&&typeof route==='function'&&route()==='home'&&typeof ct175SchedulePaint==='function')ct175SchedulePaint();
  return true;
 }catch(_){return false}
}
window.__ctR248HistoricalBehind=historicalBehind;
window.__ctR248ApplyFrontier=applyFrontier;
function reconcileHome(){
 try{
  for(const row of homeCache?.series||[]){
   const pair=typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):null;
   if(pair?.current)applyFrontier(row?.media_id||row?.mediaId,pair.current);
  }
 }catch(_){}
}
function isSeriesEvent(row){const t=norm(row?.media_type||row?.content_type||row?.kind||row?.type);return ['series_event','sport_series','sports_series','event_series'].includes(t)||row?.is_sport_series===true}
function reconcileSeriesEvents(){
 try{
  for(const row of homeCache?.series||[]){
   if(!isSeriesEvent(row))continue;
   const pair=typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):null;
   if(pair?.current&&historicalBehind(row,pair.current))applyFrontier(row?.media_id||row?.mediaId,pair.current);
   else if(pair?.current){row.home_bucket='continue';row.is_caught_up=false;row._ctHomeForceContinue=true}
  }
 }catch(_){}
}
const basePaintHome=typeof paintHome==='function'?paintHome:null;
if(basePaintHome)paintHome=function(){const out=basePaintHome.apply(this,arguments);queueMicrotask(()=>{reconcileHome();reconcileSeriesEvents()});return out};
window.addEventListener('pageshow',()=>queueMicrotask(()=>{reconcileHome();reconcileSeriesEvents()}));
document.addEventListener('cinetracker:data-changed',()=>queueMicrotask(()=>{reconcileHome();reconcileSeriesEvents()}));

/* Discover: disable stale full-HTML snapshots but keep the canonical r240 exclusion/meta rules. */
try{if(typeof rememberDiscover240==='function')rememberDiscover240=function(){}}catch(_){}
try{if(typeof restoreDiscover240==='function')restoreDiscover240=async function(){return false}}catch(_){}
function stabilizeDiscover(){
 const root=q('#p-discover,[data-page="discover"],[data-discover]');if(!root)return;
 root.classList.add('ct248-discover-stable');
 for(const el of qa('.rail,.cards-row,.discover-rail,.foryou-grid,[data-discover-rail]',root))el.classList.add('ct248-xrail');
 for(const el of qa('.card,.media-card,.discover-card,.foryou-card,[data-media-id],[data-tmdb-id]',root))el.classList.add('ct248-discover-card');
 try{if(typeof applyDiscover240==='function')applyDiscover240()}catch(_){}
}
const baseDiscover=typeof renderDiscover==='function'?renderDiscover:null;
if(baseDiscover)renderDiscover=async function(){const root=q('#p-discover,[data-page="discover"],[data-discover]');root?.classList.add('ct248-discover-loading');try{return await baseDiscover.apply(this,arguments)}finally{root?.classList.remove('ct248-discover-loading');requestAnimationFrame(stabilizeDiscover)}};
window.__ctR248StabilizeDiscover=stabilizeDiscover;

/* Sports: one tab authority. */
const SPORT_TABS=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];
let sportTab='next';
const sportRoot=()=>q('#p-sports,[data-page="sports"],[data-sports]');
function eventDate(e){return safeDate(e?.start_time||e?.start_at||e?.datetime||e?.event_date||e?.date||e?.utc_date)}
function favoriteEvent(e){try{if(typeof teamFav==='function')return !!teamFav(e)}catch(_){}return !!(e?.favorite||e?.is_favorite||e?.team_favorite||e?.home_favorite||e?.away_favorite)}
function watchedEvent(e){return !!(e?.watched||e?.is_watched||e?.seen||e?.viewed||num(e?.watch_count||e?.play_count)>0)}
function filterSports(events,mode=sportTab,now=new Date()){
 const list=[...(events||[])],today=localDay(now).getTime();
 if(mode==='previous')return list.filter(e=>{const age=Math.round((today-localDay(eventDate(e)).getTime())/86400000);return age>=1&&age<=3});
 if(mode==='favorites')return list.filter(favoriteEvent);
 if(mode==='watched')return list.filter(watchedEvent);
 return list.filter(e=>localDay(eventDate(e)).getTime()===today&&eventDate(e).getTime()>=now.getTime());
}
window.__ctR248SportFilter=filterSports;
function ensureSportTabs(){
 const root=sportRoot();if(!root)return;
 let bar=q('.ct248-sports-tabs',root);if(!bar){bar=document.createElement('div');bar.className='ct248-sports-tabs';root.insertBefore(bar,root.firstChild)}
 bar.innerHTML=SPORT_TABS.map(([k,l])=>`<button type="button" class="pill ${sportTab===k?'active':''}" data-ct248-sport-tab="${k}">${l}</button>`).join('');
 for(const b of qa('[data-ct248-sport-tab]',bar))b.onclick=()=>{sportTab=b.dataset.ct248SportTab;syncSports();try{renderSports?.()}catch(_){}};
 for(const b of qa('button,.pill,.tab,a',root)){const t=norm(b.textContent).trim();if(t==='eventos'||t==='agenda')b.remove()}
}
function syncSports(){
 const root=sportRoot();if(!root)return;ensureSportTabs();
 for(const b of qa('[data-ct248-sport-tab]',root))b.classList.toggle('active',b.dataset.ct248SportTab===sportTab);
 for(const btn of qa('button,[role="button"]',root)){const t=norm(btn.textContent);if(t==='eventos'||t==='agenda'){btn.remove();continue}if(/assistido|visto|desmarcar/.test(t))btn.classList.add('ct248-watch-btn')}
}
document.addEventListener('click',e=>{const b=e.target?.closest?.('.ct248-watch-btn');if(!b)return;b.classList.remove('ct248-watch-pop');void b.offsetWidth;b.classList.add('ct248-watch-pop');setTimeout(()=>b.classList.remove('ct248-watch-pop'),430)},true);
const baseSports=typeof renderSports==='function'?renderSports:null;
if(baseSports)renderSports=async function(){const out=await baseSports.apply(this,arguments);requestAnimationFrame(()=>{syncSports();void renderF1()});return out};

/* F1 Hub: real Jolpica data, six views, persistent collapse. */
const F1_KEY='ct:f1hub:collapsed:r248';
const F1_TABS=[['overview','Visão geral'],['calendar','Calendário'],['next','Próximo GP'],['drivers','Pilotos'],['constructors','Construtores'],['last','Último GP']];
let f1Tab='overview',f1Cache={at:0,data:null};
function f1Collapsed(){try{return localStorage.getItem(F1_KEY)==='1'}catch(_){return false}}
function setF1Collapsed(v){try{localStorage.setItem(F1_KEY,v?'1':'0')}catch(_){};syncF1Collapse()}
function syncF1Collapse(){const hub=q('.ct248-f1hub');if(!hub)return;const v=f1Collapsed();hub.classList.toggle('collapsed',v);const body=q('.ct248-f1body',hub);if(body)body.hidden=v;const b=q('[data-ct248-f1collapse]',hub);if(b){b.setAttribute('aria-expanded',String(!v));b.textContent=v?'Expandir':'Minimizar'}}
async function f1Get(path){const r=await fetch(`https://api.jolpi.ca/ergast/f1/${path.replace(/^\/+/, '')}`,{headers:{accept:'application/json'}});if(!r.ok)throw new Error(`F1 ${r.status}`);return r.json()}
const races=o=>o?.MRData?.RaceTable?.Races||[];
const standings=o=>o?.MRData?.StandingsTable?.StandingsLists?.[0]||{};
async function loadF1(){
 if(f1Cache.data&&Date.now()-f1Cache.at<300000)return f1Cache.data;
 const season=new Date().getFullYear();const p=await Promise.allSettled([f1Get(`${season}.json`),f1Get(`${season}/driverstandings.json`),f1Get(`${season}/constructorstandings.json`),f1Get(`${season}/last/results.json`),f1Get(`${season}/last/qualifying.json`)]);
 const schedule=races(p[0].status==='fulfilled'?p[0].value:{}),drivers=standings(p[1].status==='fulfilled'?p[1].value:{}).DriverStandings||[],constructors=standings(p[2].status==='fulfilled'?p[2].value:{}).ConstructorStandings||[],last=races(p[3].status==='fulfilled'?p[3].value:{})[0]||null,qual=races(p[4].status==='fulfilled'?p[4].value:{})[0]||null;
 const now=Date.now(),next=schedule.find(r=>safeDate(`${r.date||''}T${r.time||'00:00:00Z'}`).getTime()>=now)||null;return f1Cache={at:Date.now(),data:{season,schedule,drivers,constructors,last,qual,next}}.data;
}
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function raceTime(r){const d=safeDate(`${r?.date||''}T${r?.time||'00:00:00Z'}`);try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'}).format(d)}catch(_){return d.toLocaleString('pt-BR')}}
const raceName=r=>r?.raceName||'GP a confirmar';
function countDown(r){const ms=safeDate(`${r?.date||''}T${r?.time||'00:00:00Z'}`).getTime()-Date.now();if(ms<=0)return 'Em andamento / encerrada';return `${Math.floor(ms/86400000)}d ${Math.floor(ms%86400000/3600000)}h ${Math.floor(ms%3600000/60000)}min`}
function f1Content(d,tab){
 if(!d)return '<div class="muted">Dados indisponíveis.</div>';
 if(tab==='calendar')return `<div class="ct248-f1rail">${d.schedule.map(r=>`<article><b>${esc(r.round)}. ${esc(raceName(r))}</b><span>${esc(r.Circuit?.circuitName)} · ${esc(r.Circuit?.Location?.country)}</span><small>${esc(raceTime(r))}</small></article>`).join('')}</div>`;
 if(tab==='drivers')return `<div class="ct248-f1table">${d.drivers.slice(0,20).map(x=>`<div><b>${esc(x.position)}.</b><span>${esc(x.Driver?.givenName)} ${esc(x.Driver?.familyName)}</span><strong>${esc(x.points)} pts</strong></div>`).join('')}</div>`;
 if(tab==='constructors')return `<div class="ct248-f1table">${d.constructors.slice(0,10).map(x=>`<div><b>${esc(x.position)}.</b><span>${esc(x.Constructor?.name)}</span><strong>${esc(x.points)} pts</strong></div>`).join('')}</div>`;
 const hero=d.next?`<div class="ct248-f1hero"><span>Próxima etapa</span><h3>${esc(raceName(d.next))}</h3><p>${esc(d.next.Circuit?.circuitName)} · ${esc(d.next.Circuit?.Location?.country)}</p><b>${esc(raceTime(d.next))}</b><strong>${esc(countDown(d.next))}</strong></div>`:'<div class="muted">Próximo GP ainda não disponível.</div>';
 if(tab==='next')return hero;
 if(tab==='last'){const r=d.last,res=r?.Results||[],qr=d.qual?.QualifyingResults||[];return `<h3>${esc(raceName(r))}</h3><h4>Resultado da corrida</h4><div class="ct248-f1table">${res.slice(0,20).map(x=>`<div><b>P${esc(x.position)}</b><span>${esc(x.Driver?.givenName)} ${esc(x.Driver?.familyName)}</span><strong>${esc(x.points)} pts</strong></div>`).join('')}</div><h4>Grid / qualificação</h4><div class="ct248-f1table">${qr.slice(0,20).map(x=>`<div><b>P${esc(x.position)}</b><span>${esc(x.Driver?.givenName)} ${esc(x.Driver?.familyName)}</span><strong>${esc(x.Q3||x.Q2||x.Q1||'—')}</strong></div>`).join('')}</div>`}
 return `${hero}<div class="ct248-f1overview"><div><span>Temporada</span><b>${esc(d.season)}</b></div><div><span>Último GP</span><b>${esc(raceName(d.last))}</b></div><div><span>Status</span><b>${d.next?'Próxima':'Encerrada'}</b></div></div>`;
}
async function renderF1(){
 const root=sportRoot();if(!root)return;let hub=q('.ct248-f1hub',root);if(!hub){hub=document.createElement('section');hub.className='ct248-f1hub';root.insertBefore(hub,q('.sports-grid,.events-grid,.grid',root)||root.firstChild)}
 hub.innerHTML=`<header class="ct248-f1head"><div><span>F1 Hub</span><b>Temporada ${new Date().getFullYear()}</b></div><button type="button" data-ct248-f1collapse>${f1Collapsed()?'Expandir':'Minimizar'}</button></header><div class="ct248-f1body"><nav>${F1_TABS.map(([k,l])=>`<button type="button" class="${f1Tab===k?'active':''}" data-ct248-f1tab="${k}">${l}</button>`).join('')}</nav><div class="ct248-f1content"><div class="muted">Carregando F1…</div></div></div>`;
 q('[data-ct248-f1collapse]',hub).onclick=()=>setF1Collapsed(!f1Collapsed());for(const b of qa('[data-ct248-f1tab]',hub))b.onclick=()=>{f1Tab=b.dataset.ct248F1tab;void renderF1()};syncF1Collapse();if(f1Collapsed())return;
 let data=null;try{data=await loadF1()}catch(e){console.warn('r248 F1',e)}const c=q('.ct248-f1content',hub);if(c)c.innerHTML=f1Content(data,f1Tab);syncF1Collapse();markRails(hub);
}
window.__ctR248RenderF1=renderF1;window.__ctR248SetF1Collapsed=setF1Collapsed;

/* Profile: merge all sports-stat cards into the single main statistics grid. */
function normalizeProfile(){
 const root=q('#p-profile,[data-page="profile"],[data-profile]');if(!root)return;const hs=qa('h1,h2,h3,h4,.section-title,.title',root).filter(h=>/estatisticas/.test(norm(h.textContent)));if(!hs.length)return;
 const main=hs.find(h=>norm(h.textContent).trim()==='estatisticas')||hs[0];main.textContent='Estatísticas';let grid=main.parentElement?.querySelector?.('.stats-grid,.stats-10,[data-stats-grid]')||q('.stats-grid,.stats-10,[data-stats-grid]',root);if(!grid)return;grid.classList.add('ct248-profile-grid');
 for(const h of hs){if(h===main)continue;const sec=h.closest('section,.card,.panel')||h.parentElement;for(const c of qa('.stat,[data-stat],.stat-card',sec)){c.classList.add('ct248-sport-stat');grid.appendChild(c)}if(sec&&sec!==main.parentElement)sec.remove();else h.remove()}
 const order=['s-filmes','s-series','s-docs','s-shows','s-anime','s-sports','s-telej','s-novela','s-follow','s-watchlist'];for(const id of order){const x=q('#'+id,grid);if(x)grid.appendChild(x)}
}
const baseProfile=typeof renderProfile==='function'?renderProfile:null;if(baseProfile)renderProfile=async function(){const out=await baseProfile.apply(this,arguments);requestAnimationFrame(normalizeProfile);return out};window.__ctR248NormalizeProfile=normalizeProfile;

/* All horizontal interaction is local; the document itself never scrolls sideways. */
function markRails(root=document){
 const sel='.season-tabs,.season-list,.season-row,[data-seasons],.related-scroll,.related-grid,.related-row,[data-related],.similar-scroll,.similar-grid,[data-similar],.episode-graph,.graph-shell,.chart-wrap,.chart-scroll,[data-chart],.discover-rail,.cards-row,.rail,.foryou-grid,[data-discover-rail],.ct248-f1rail,.ct248-f1table,.sports-tabs,.sports-grid';
 const scopes=root===document?qa('#p-details,#p-discover,#p-sports,[data-page="details"],[data-page="discover"],[data-page="sports"]'): [root];
 for(const scope of scopes)for(const el of qa(sel,scope)){if(el.scrollWidth>el.clientWidth+3||el.matches('.season-tabs,.related-scroll,.similar-scroll,.episode-graph,.chart-scroll,.discover-rail,.cards-row,.rail,.ct248-f1rail'))el.classList.add('ct248-xrail')}
}
let raf=0;const observer=new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{stabilizeDiscover();syncSports();normalizeProfile();markRails();syncF1Collapse()})});observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('resize',()=>requestAnimationFrame(()=>markRails()));queueMicrotask(()=>{reconcileHome();reconcileSeriesEvents();stabilizeDiscover();syncSports();normalizeProfile();markRails();if(sportRoot())void renderF1()});
})();
