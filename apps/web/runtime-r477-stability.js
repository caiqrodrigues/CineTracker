/* CineTracker Web 1.0.267 r477 — visible Home boot, F1 Home action and stable Profile sports. */
(()=>{
'use strict';
if(window.__ctR477?.version==='1.0.267')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r477 core unavailable');
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};
const homeLocation=()=>{const p=String(location.pathname||'/').replace(/\/+$/,'')||'/';return p==='/'||p==='/home'};

/* Home: never wait on the retired nine-second entry gate. */
let homeRun=0;
function bootHome(kind='series'){
 if(!(routeNow()==='home'||homeLocation()))return false;
 const run=++homeRun,k=kind==='movies'?'movies':'series';
 delete document.documentElement.dataset.ct413HomeEntering;
 delete document.documentElement.dataset.ct415HomeEntering;
 try{if(!q('[data-home]'))core.ensureHomeShell?.()}catch{}
 try{if(!q('[data-home-view="series"]')||!q('[data-home-view="movies"]'))void window.__ctR388?.renderHome?.()}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 try{window.__ctR476?.primeHome?.(k)}catch{}
 for(const ms of [60,160,360,700])setTimeout(()=>{if(run!==homeRun||!(routeNow()==='home'||homeLocation()))return;try{window.__ctR399?.enterHome?.(k)}catch{}},ms);
 return true;
}

/* Formula 1 in Home: the compact ct266 check must use the canonical F1 writer. */
const f1Locks=new WeakSet();
function f1HomeAction(target){
 const btn=target?.closest?.('[data-ct266-watch="episode"]');if(!btn)return null;
 const row=btn.closest('[data-ct274-episode-card],.ct274-media-card,.media-row');
 const title=norm([q('b,strong',row)?.textContent,btn.dataset.title,row?.textContent].filter(Boolean).join(' '));
 if(!(title==='formula 1'||title.startsWith('formula 1 ')||title==='formula one'||title.startsWith('formula one ')))return null;
 const season=num(btn.dataset.season||row?.dataset?.ct274Season),episode=num(btn.dataset.episode||row?.dataset?.ct274Episode);
 return season>0&&episode>0?{btn,row,season,episode}:null;
}
async function markF1Home(ctx){
 const {btn,row,season,episode}=ctx||{};if(!btn||f1Locks.has(btn))return false;
 f1Locks.add(btn);
 const snap={text:btn.textContent,hidden:btn.hidden,aria:btn.getAttribute('aria-disabled'),busy:btn.getAttribute('aria-busy'),cls:row?.className||''};
 btn.setAttribute('aria-disabled','true');btn.setAttribute('aria-busy','true');btn.textContent='…';
 try{
  await core.rpc('cinetracker_f1_watch_sync_v462',{
   p_season:season,p_episode:episode,p_watched:true,p_watched_at:new Date().toISOString(),
   p_event_id:null,p_attended_in_person:false,p_stadium_name:null,p_source:'home-r477'
  });
  if(row)row.classList.add('watched');
  btn.textContent='✓';btn.hidden=true;
  try{document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'f1-r477-home',media_id:865,season_number:season,episode_number:episode,watched:true}}))}catch{}
  try{window.dispatchEvent(new CustomEvent('cinetracker:f1-watched-changed',{detail:{source:'f1-r477-home',media_id:865,season_number:season,episode_number:episode,watched:true}}))}catch{}
  queueMicrotask(()=>{try{window.__ctR462?.refresh?.()}catch{};try{window.__ctR399?.refreshSeries?.(true)}catch{}});
  try{core.toast?.('Fórmula 1 marcada como assistida')}catch{}
  return true;
 }catch(e){
  btn.textContent=snap.text;btn.hidden=snap.hidden;if(row)row.className=snap.cls;
  if(snap.aria==null)btn.removeAttribute('aria-disabled');else btn.setAttribute('aria-disabled',snap.aria);
  if(snap.busy==null)btn.removeAttribute('aria-busy');else btn.setAttribute('aria-busy',snap.busy);
  try{core.toast?.('Fórmula 1: '+(e?.message||e))}catch{}
  return false;
 }finally{
  btn.removeAttribute('aria-busy');if(!btn.hidden)btn.removeAttribute('aria-disabled');f1Locks.delete(btn);
 }
}
window.addEventListener('click',e=>{
 const ctx=f1HomeAction(e.target);if(!ctx)return;
 e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void markF1Home(ctx);
},true);

/* Profile sports: one final authority, hidden while the two counts are reconciled. */
let sportsSeq=0,sportsTask=null,sportsCache=null,profileSettleSeq=0;
function sportsPanel(){
 const root=q('[data-profile]');if(!root)return null;
 return qa('section.panel,.panel',root).find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'').includes('esportes assistidos'))||null;
}
function statByLabel(panel,label){
 const wanted=norm(label);
 return qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',panel).find(x=>norm(q('small,label,.stat-label,.label',x)?.textContent||'')===wanted)||null;
}
function valueNode(card){return q('b,strong,.value,.stat-value',card)}
function hideSports(){
 const p=sportsPanel();if(!p)return false;p.style.visibility='hidden';p.dataset.ct477Sports='loading';return true;
}
function ensureStadium(panel,count){
 let card=statByLabel(panel,'Jogos no Estádio'),events=statByLabel(panel,'Eventos assistidos');
 if(!events)return null;
 if(!card){card=events.cloneNode(true);const label=q('small,label,.stat-label,.label',card);if(label)label.textContent='Jogos no Estádio';events.insertAdjacentElement('afterend',card)}
 const value=valueNode(card);if(value)value.textContent=Number(count||0).toLocaleString('pt-BR');
 card.dataset.ct299History='stadium';card.dataset.ct477SportsStat='stadium';return card;
}
function paintSports(data){
 const panel=sportsPanel();if(!panel||!data)return false;
 const events=statByLabel(panel,'Eventos assistidos'),eventValue=valueNode(events);
 if(eventValue&&Number.isFinite(Number(data.watched_events)))eventValue.textContent=Number(data.watched_events).toLocaleString('pt-BR');
 if(events){events.dataset.ct299History='all';events.dataset.ct477SportsStat='events'}
 ensureStadium(panel,data.stadium_events);
 panel.style.removeProperty('visibility');panel.dataset.ct477Sports='authoritative-v296';
 return true;
}
async function loadSports(force=false){
 if(sportsTask&&!force)return sportsTask;
 const seq=++sportsSeq;hideSports();
 sportsTask=(async()=>{
  try{
   const raw=await core.rpc('cinetracker_sports_stadium_summary_v296',{});
   const d=Array.isArray(raw)?raw[0]:raw;
   const next={
    watched_events:num(d?.watched_events),
    stadium_events:num(d?.stadium_events)
   };
   if(seq!==sportsSeq||routeNow()!=='profile')return sportsCache;
   sportsCache=next;paintSports(next);return next;
  }catch(e){
   if(seq===sportsSeq&&routeNow()==='profile'){if(sportsCache)paintSports(sportsCache);else sportsPanel()?.style.removeProperty('visibility');document.documentElement.dataset.ct477SportsError=String(e?.message||e)}
   return sportsCache;
  }finally{sportsTask=null}
 })();
 return sportsTask;
}
function settleProfile(force=false){
 const seq=++profileSettleSeq;
 for(const ms of [0,60,160,360,700,1200])setTimeout(()=>{
  if(seq!==profileSettleSeq||routeNow()!=='profile')return;
  try{window.__ctR476?.paintProfile?.()}catch{}
  if(ms<160)hideSports();else if(sportsCache)paintSports(sportsCache);
  if(ms===160)void loadSports(force);
 },ms);
}
window.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-nav="home"]'))for(const ms of [0,20,60,120,250])setTimeout(()=>{delete document.documentElement.dataset.ct413HomeEntering;delete document.documentElement.dataset.ct415HomeEntering;bootHome('series')},ms);
 const tab=e.target?.closest?.('[data-home-tab]');if(tab){const k=String(tab.dataset.homeTab||'series')==='movies'?'movies':'series';for(const ms of [0,20,60,120])setTimeout(()=>{delete document.documentElement.dataset.ct413HomeEntering;delete document.documentElement.dataset.ct415HomeEntering;bootHome(k)},ms)}
},true);
window.addEventListener('pointerdown',e=>{
 if(e.target?.closest?.('[data-nav="home"]'))for(const ms of [0,30,90])setTimeout(()=>bootHome('series'),ms);
 const tab=e.target?.closest?.('[data-home-tab]');if(tab){const k=String(tab.dataset.homeTab||'series')==='movies'?'movies':'series';for(const ms of [0,30])setTimeout(()=>bootHome(k),ms)}
 if(e.target?.closest?.('[data-nav="profile"]')){sportsCache=null;setTimeout(()=>settleProfile(true),0)}
},{capture:true,passive:true});
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='home')bootHome('series');if(routeNow()==='profile')settleProfile(false)},0));
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile')settleProfile(true)});
window.addEventListener('cinetracker:f1-watched-changed',()=>{if(routeNow()==='profile')settleProfile(true)});

const style=document.createElement('style');style.id='ct477-style';style.textContent=[
 '[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13){display:none!important}',
 '[data-profile] .ct455-profile-more,[data-profile] .ct457-profile-more,[data-profile] .ct460-profile-more,[data-profile] .ct472-more-card,[data-profile] [data-ct424-more],[data-profile] [data-ct455-more],[data-profile] [data-ct457-more],[data-profile] [data-ct459-more],[data-profile] [data-ct460-more],[data-profile] [data-ct471-more],[data-profile] [data-ct472-more]{display:none!important}',
 '.ct388-movie-stack{display:flex!important;flex-direction:column!important}',
 '.ct388-movie-stack>.ct274-media-card,.ct388-movie-stack>.media-row{width:100%!important;max-width:none!important;min-width:0!important}'
].join('');
if(!q('#ct477-style'))document.head.appendChild(style);

delete document.documentElement.dataset.ct413HomeEntering;
delete document.documentElement.dataset.ct415HomeEntering;
if(routeNow()==='home'||homeLocation())for(const ms of [0,40,120])setTimeout(()=>bootHome(q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'),ms);
if(routeNow()==='profile')settleProfile(true);

window.__ctR477Marker='home-no-nine-second-gate+compact-movies+f1-home-writer+foryou-v421+profile-12-header-only+sports-v296';
window.__ctR477={version:'1.0.267',scope:'home+f1+discover+profile',bootHome,markF1Home,loadSports,settleProfile};
})();