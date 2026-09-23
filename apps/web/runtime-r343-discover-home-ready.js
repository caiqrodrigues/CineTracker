/* CineTracker Web 1.0.134 r343 — final Discover DOM owner + Home ready-before-first-paint. */
(()=>{
'use strict';
if(window.__ctR343?.version==='1.0.134')return;
window.__ctR343Marker='discover-final-dom-owner+home-enriched-before-first-paint';
window.__ctR343Discover='r336-only-foryou-dom+legacy-late-paints-blocked';
window.__ctR343Home='fresh-payload+history+live-episode-reconcile+dom-hydrate-before-reveal';
window.__ctR343Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let homeRun343=0,lastPrepared343=[],testBridge343=window.__ctR343TestBridge||null;
function homeActive343(){
 try{
  if(testBridge343?.route)return String(testBridge343.route())==='home';
  return routeNow()==='home';
 }catch{return routeNow()==='home'}
}

/* Build a fully reconciled Home snapshot before any real Home card is painted. */
async function prepareHomePayload343(payload,navSeqExpected){
 const run=++homeRun343;
 if(!payload||!homeActive343())return false;
 let list=[];
 try{list=typeof ct275DedupSeries==='function'?ct275DedupSeries(payload?.series||[]):rows(payload?.series)}catch{list=rows(payload?.series)}
 try{if(typeof ct285CloneRow==='function')list=list.map(ct285CloneRow);else list=list.map(x=>({...x}))}catch{list=list.map(x=>({...x}))}
 try{
  if(typeof ct275FetchWatchState==='function'){
   const state=await ct275FetchWatchState(list);
   if(run!==homeRun343||!homeActive343()||(Number.isFinite(navSeqExpected)&&typeof navSeq!=='undefined'&&navSeqExpected!==navSeq))return false;
   if(typeof ct275ApplyWatchState==='function')ct275ApplyWatchState(list,state);
  }
  let candidates=[];
  try{candidates=typeof ct287Candidates==='function'?ct287Candidates(list):list.filter(x=>n(x?.watched_episodes)>0&&['continue','up_to_date','dust'].includes(String(x?.home_bucket||'')))}catch{candidates=list}
  const reconcile=async row=>{if(run!==homeRun343||!homeActive343())return row;try{return typeof ct275ReconcileOne==='function'?await ct275ReconcileOne(row):row}catch{return row}};
  if(typeof ct275MapLimit==='function')await ct275MapLimit(candidates,8,reconcile);else await Promise.all(candidates.map(reconcile));
 }catch{}
 if(run!==homeRun343||!homeActive343()||(Number.isFinite(navSeqExpected)&&typeof navSeq!=='undefined'&&navSeqExpected!==navSeq))return false;
 try{ct285HomePayload=payload}catch{}
 try{ct285CommittedRows=typeof ct285CloneRow==='function'?list.map(ct285CloneRow):list.map(x=>({...x}))}catch{}
 try{ct275SourcePayload=payload}catch{}
 try{ct275CanonicalSeries=typeof ct285CloneRow==='function'?list.map(ct285CloneRow):list.map(x=>({...x}))}catch{}
 lastPrepared343=list.map(x=>({...x}));window.__ctR343HomePreparedSnapshot=lastPrepared343;
 payload.__ct343Prepared=true;
 payload.__ct343PreparedAt=Date.now();
 return true;
}

/* Hydrate the actually painted episode/movie cards while the Home loader is still on screen. */
async function hydrateHomeDom343(){
 if(!homeActive343())return false;
 try{
  if(typeof ct274HydrateHome==='function')await ct274HydrateHome();
 }catch{}
 if(!homeActive343())return false;
 const episodeCards=qa('[data-home] [data-ct274-episode-card]');
 let incomplete=episodeCards.filter(el=>{
  const t=String(q('.ct274-meta',el)?.textContent||'');
  return /Ep:\s*Episódio\s*\d+\s*•\s*⭐\s*[—-]\s*•\s*[—-]/i.test(t)||/\s•\s*[—-]\s*$/.test(t);
 });
 /* One deterministic second pass for cards that were repainted during the first hydrate. */
 if(incomplete.length&&typeof ct274HydrateEpisodeCard==='function'){
  try{
   if(typeof ct274MapLimit==='function')await ct274MapLimit(incomplete,8,ct274HydrateEpisodeCard);
   else await Promise.all(incomplete.map(ct274HydrateEpisodeCard));
  }catch{}
 }
 incomplete=qa('[data-home] [data-ct274-episode-card]').filter(el=>{
  const t=String(q('.ct274-meta',el)?.textContent||'');
  return /Ep:\s*Episódio\s*\d+\s*•\s*⭐\s*[—-]\s*•\s*[—-]/i.test(t);
 });
 document.documentElement.dataset.ct343HomeIncomplete=String(incomplete.length);
 document.documentElement.dataset.ct343HomeReady='1';
 return true;
}

/* Ensure any generic/legacy direct painter resolves to the final r336 renderer. */
function ownDiscover343(){
 if(routeNow()!=='discover')return false;
 try{
  if(typeof paintForYou263!=='undefined')paintForYou263=function(){return window.__ctR336?.paintForYou?.()||false};
 }catch{}
 if(window.__ctR328&&window.__ctR336?.paintForYou)window.__ctR328.paintForYou=window.__ctR336.paintForYou;
 if(window.__ctR329&&window.__ctR336?.paintForYou)window.__ctR329.paintForYou=window.__ctR336.paintForYou;
 return true;
}
try{
 const baseRender343=renderDiscover;
 renderDiscover=function(){
  const out=baseRender343.apply(this,arguments);
  queueMicrotask(()=>ownDiscover343());
  return out;
 };
}catch{}
document.addEventListener('click',e=>{
 if(routeNow()==='discover'&&e.target?.closest?.('[data-ct319-tab],[data-ct315-tab],[data-ct336-fy-kind]'))queueMicrotask(()=>ownDiscover343());
},true);

setTimeout(()=>{if(routeNow()==='discover')ownDiscover343()},0);

window.__ctR343={
 version:'1.0.134',
 prepareHomePayload:prepareHomePayload343,
 hydrateHomeDom:hydrateHomeDom343,
 ownDiscover:ownDiscover343
};
window.__ctR343Test={prepareHomePayload343,hydrateHomeDom343,ownDiscover343,setTestBridge(v){testBridge343=v&&typeof v==='object'?v:null}};
})();