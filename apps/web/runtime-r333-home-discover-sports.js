/* CineTracker Web 1.0.124 r333 — Home truth, Discover controls/final audit, background Sports warmup. */
(()=>{
'use strict';
if(window.__ctR333?.version==='1.0.124')return;
window.__ctR333Marker='home-v333+discover-direct-controls+top10-final-audit+sports-background-warmup';
window.__ctR333Home='natural-history+logical-series+released-unseen-movie-watchlist';
window.__ctR333Discover='direct-filters+no-arrows+three-actions+strict-v333';
window.__ctR333Sports='payload-warm-first+provider-sync-background-every-open';
window.__ctR333Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let discoverNormQueued=false;

/* Home logical availability: never offer an episode behind or equal to consolidated watched state. */
function normalizeSeries333(row){
 if(!row)return row;
 const watched=n(row.watched_episodes),released=Math.max(n(row.released_episodes),watched);
 row.released_episodes=released;
 row.available_episodes=Math.max(0,released-watched);
 const ls=n(row.last_season_number),le=n(row.last_episode_number),ns=n(row.next_season_number),ne=n(row.next_episode_number);
 const stalePointer=ls>0&&le>0&&ns===ls&&ne>0&&ne<=le;
 if(watched>0&&row.available_episodes<=0){
  if(String(row.home_bucket||'')!=='completed')row.home_bucket='up_to_date';
  row.available_episodes=0;
  row.next_season_number=null;row.next_episode_number=null;row.next_episode_title=null;
  row.next_episode_rating=null;row.next_episode_air_date=null;
  row.__ct333NoReleasedUnseen=true;
 }else if(stalePointer){
  row.next_season_number=null;row.next_episode_number=null;row.next_episode_title=null;
  row.next_episode_rating=null;row.next_episode_air_date=null;
  row.available_episodes=Math.max(0,released-watched);
  if(row.available_episodes<=0&&String(row.home_bucket||'')!=='completed')row.home_bucket='up_to_date';
  row.__ct333StalePointerCleared=true;
 }
 return row;
}
try{
 const baseApply333=window.__ctR325?.applyWatchState;
 if(typeof baseApply333==='function'){
  window.__ctR325.applyWatchState=function(list,state){
   const out=baseApply333(list,state);for(const x of rows(list))normalizeSeries333(x);return out;
  };
 }
}catch{}
try{
 const baseApplyLocal333=typeof ct275ApplyWatchState==='function'?ct275ApplyWatchState:null;
 if(baseApplyLocal333){
  ct275ApplyWatchState=function(list,state){
   const out=baseApplyLocal333(list,state);for(const x of rows(list))normalizeSeries333(x);return out;
  };
 }
}catch{}

/* Home history stays real content above the initial viewport: no buttons or inner scrollers. */
function normalizeHome333(){
 if(routeNow()!=='home')return false;
 let found=false;
 for(const sec of qa('[data-home] [data-ct274-history]')){
  found=true;
  sec.classList.remove('is-collapsed');sec.classList.add('is-open');
  sec.dataset.ct333History='natural';
  qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct332-history-toggle],[data-ct333-history-toggle]',sec).forEach(x=>x.remove());
  const shell=q('.ct275-history-shell',sec);if(shell)shell.setAttribute('aria-hidden','false');
  for(const stack of qa('.ct274-history-stack',sec)){
   stack.setAttribute('aria-hidden','false');stack.style.removeProperty('max-height');stack.style.removeProperty('height');stack.style.removeProperty('overflow');
  }
 }
 return found;
}

/* Discover: remove obsolete navigation/filter trigger buttons and keep filters inline. */
function discoverTab333(){
 return String(window.__ctR288R263?.discover263?.tab||'foryou');
}
function ensureDirectFilters333(){
 const root=q('[data-ct319-discover]');if(!root)return false;
 qa('[data-ct319-prev],[data-ct319-next],[data-ct319-filter]',root).forEach(x=>x.remove());
 const tab=discoverTab333(),types=q('[data-ct319-types]',root);
 if(tab==='foryou'){
  try{window.__ctR329?.ensureFilters?.()}catch{}
  try{window.__ctR328?.ensureFilters?.()}catch{}
  if(types){types.hidden=false;types.classList.add('open');types.dataset.ct333Direct='1'}
 }else if(['trending','popular','new','releases','anticipated','top'].includes(tab)){
  if(types){
   if(typeof window.__ctR319Test?.filterMarkup319==='function')types.innerHTML=window.__ctR319Test.filterMarkup319();
   types.hidden=false;types.classList.add('open');types.dataset.ct333Direct='1';
   const want=String(window.__ctR288R263?.discover263?.type||'all');
   qa('[data-ct319-type]',types).forEach(b=>b.classList.toggle('active',String(b.dataset.ct319Type)===want));
  }
 }else if(types){types.hidden=true;types.classList.remove('open');delete types.dataset.ct333Direct}
 return true;
}
function normalizeForYou333(){
 if(routeNow()!=='discover'||discoverTab333()!=='foryou')return false;
 if(document.documentElement.dataset.ct332FyAuditing==='1')return false;
 try{window.__ctR329?.ensureFilters?.()}catch{}
 let root=q('[data-ct329-foryou]');
 const bad=!root||qa('.ct329-actions',root).some(x=>qa('button',x).length!==3);
 if(bad&&window.__ctR309Test?.state){try{window.__ctR329?.paintForYou?.()}catch{};root=q('[data-ct329-foryou]')}
 try{window.__ctR329?.applyFilter?.()}catch{}
 if(!root)return false;
 root.dataset.ct333Final='1';
 for(const row of qa('.ct329-actions',root)){
  const btns=qa('button',row);row.dataset.ct333Actions=String(btns.length);
  for(const b of btns){b.style.setProperty('white-space','nowrap','important');b.style.setProperty('min-width','0','important')}
 }
 return true;
}
function normalizeTop333(){
 if(routeNow()!=='discover'||discoverTab333()!=='top10')return false;
 const shell=q('.ct288-top-shell');if(shell)shell.dataset.ct333Top='raised';
 return true;
}
function normalizeDiscover333(){
 if(routeNow()!=='discover')return false;
 ensureDirectFilters333();normalizeForYou333();normalizeTop333();return true;
}
function queueDiscover333(){
 if(discoverNormQueued)return;discoverNormQueued=true;
 requestAnimationFrame(()=>{discoverNormQueued=false;normalizeDiscover333()});
}
try{
 const baseRenderDiscover333=renderDiscover;
 renderDiscover=function(){
  const out=baseRenderDiscover333.apply(this,arguments);setTimeout(queueDiscover333,0);setTimeout(queueDiscover333,120);return out;
 };
}catch{}
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-ct319-tab],[data-ct319-type],[data-ct328-fy-kind],[data-ct329-fy-kind],[data-ct321-provider]'))setTimeout(queueDiscover333,0);
},true);
try{
 const app=q('#app');if(app&&window.MutationObserver)new MutationObserver(muts=>{
  if(routeNow()!=='discover'||!muts.some(m=>m.addedNodes.length))return;queueDiscover333();
 }).observe(app,{subtree:true,childList:true});
}catch{}

/* Sports: warm current DB payload quickly, then refresh providers in background on every page open. */
const baseLoadSports333=typeof loadSports255==='function'?loadSports255:null;
if(baseLoadSports333){
 try{
  loadSports255=async function(force=false){
   try{if(sport255?.payload&&Date.now()-n(sport255.at)<30000)return sport255.payload}catch{}
   return baseLoadSports333(force);
  };
 }catch{}
}
function day333(offset=0){
 const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);
 const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return y+'-'+m+'-'+day;
}
async function syncSportsWindow333(from,to){
 if(typeof SUPABASE_URL==='undefined'||typeof authHeaders!=='function')return null;
 const r=await fetch(SUPABASE_URL+'/functions/v1/ct-sports-sync',{
  method:'POST',headers:{...authHeaders(),'content-type':'application/json'},
  body:JSON.stringify({action:'sync',date_from:from,date_to:to,force:false})
 });
 if(!r.ok)throw new Error('sports sync '+r.status);return r.json().catch(()=>({}));
}
async function warmSports333(){
 if(!baseLoadSports333)return false;
 try{await baseLoadSports333(false)}catch{}
 const sync=async()=>{
  try{
   await syncSportsWindow333(day333(-3),day333(-1));
   await syncSportsWindow333(day333(0),day333(2));
  }catch{}
  try{
   const p=await baseLoadSports333(true);
   if(routeNow()==='sports'&&typeof paintSports255==='function')paintSports255();
   return p;
  }catch{return null}
 };
 if(typeof requestIdleCallback==='function')requestIdleCallback(()=>void sync(),{timeout:4500});else setTimeout(()=>void sync(),1800);
 return true;
}
setTimeout(()=>void warmSports333(),300);

const style=document.createElement('style');style.id='ct-web-r333';style.textContent=`
/* Home history: no toggle and no nested scroll. */
[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] [data-ct332-history-toggle],[data-home] [data-ct333-history-toggle]{display:none!important}
[data-home] [data-ct274-history],[data-home] [data-ct274-history].is-collapsed{display:block!important}
[data-home] [data-ct274-history] .ct275-history-shell,[data-home] [data-ct274-history] .ct274-history-stack{
 display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;opacity:1!important;pointer-events:auto!important
}

/* Remove obsolete Discover controls from the screenshot; tabs use their native horizontal rail. */
[data-ct319-prev],[data-ct319-next],[data-ct319-filter]{display:none!important}
.ct319-tab-shell,.ct288-tab-shell{grid-template-columns:minmax(0,1fr)!important}
[data-ct319-tabs]{overflow-x:auto!important;scrollbar-width:thin!important}
[data-ct319-types][data-ct333-direct="1"]{display:flex!important;flex-flow:row nowrap!important;gap:6px!important;overflow-x:auto!important;margin:5px 0 8px!important}
[data-ct319-types][data-ct333-direct="1"] .chip{flex:0 0 auto!important;white-space:nowrap!important}

/* Pra você: exactly three compact buttons per card, always one row. */
[data-ct329-foryou] .ct329-actions{
 display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;width:100%!important;margin-top:4px!important
}
[data-ct329-foryou] .ct329-actions .chip{
 box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;
 width:100%!important;min-width:0!important;max-width:none!important;height:25px!important;min-height:25px!important;
 padding:2px 2px!important;border-radius:7px!important;font-size:7.3px!important;line-height:1!important;
 white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
.ct319-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;width:100%!important}
.ct319-actions .chip{min-width:0!important;white-space:nowrap!important}

/* Top 10 starts immediately under tabs/providers; no duplicate blank/title band. */
.ct288-top-title,.ct288-top-name{display:none!important}
.ct288-top-shell,[data-ct333-top="raised"]{margin-top:0!important;padding-top:0!important}
.ct288-provider-row,[data-ct321-providers]{margin-top:0!important;padding-top:0!important}
[data-ct321-top-content]>.ct288-top-section:first-child{margin-top:6px!important}
[data-ct319-loadline][hidden]{display:none!important}
`;document.head.appendChild(style);

setTimeout(()=>{if(routeNow()==='home')normalizeHome333();if(routeNow()==='discover')normalizeDiscover333()},0);

window.__ctR333={
 normalizeSeries:normalizeSeries333,normalizeHome:normalizeHome333,normalizeDiscover:normalizeDiscover333,
 ensureDirectFilters:ensureDirectFilters333,normalizeForYou:normalizeForYou333,warmSports:warmSports333,version:'1.0.124'
};
window.__ctR333Test={normalizeSeries333,day333,ensureDirectFilters333,normalizeForYou333};
})();
