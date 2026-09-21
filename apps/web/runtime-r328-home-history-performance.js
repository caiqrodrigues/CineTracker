/* CineTracker Web 1.0.119 r328 — fast Home navigation + real natural history. */
(()=>{
'use strict';
if(window.__ctR328?.version==='1.0.119')return;
window.__ctR328Marker='single-home-rpc+cache-first-nav+natural-history+watched-date';
window.__ctR328Home='single-rpc+cache-first+history-page-scroll+watched-date';
window.__ctR328Frozen='discover-r327+profile-r324+episode-sync-r325';
window.__ctR328Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let testBridge=null,lastHomeFetchAt=0,homeFetchTask=null,anchorTimer=0;
const HOME_FRESH_MS=60*1000;

function force328(el,prop,val){try{el?.style?.setProperty(prop,val,'important')}catch{}}
function historyDate328(v){try{return typeof ct274Date==='function'?ct274Date(v):new Date(v).toLocaleDateString('pt-BR')}catch{return''}}
function payload328(){try{return typeof ct274Payload==='function'?ct274Payload():(homeCache||{})}catch{return homeCache||{}}}
function asc328(list){try{return typeof ct274AscHistory==='function'?ct274AscHistory(list):rows(list).slice().sort((a,b)=>(Date.parse(a?.watched_at||0)||0)-(Date.parse(b?.watched_at||0)||0))}catch{return rows(list)}}

function fixHistoryDates328(){
 const p=payload328();
 const eps=asc328(p?.history_episodes),movies=asc328(p?.history_movies);
 const episodeCards=qa('[data-home] [data-ct274-history="episodes"] [data-ct274-episode-card]');
 for(let i=0;i<episodeCards.length&&i<eps.length;i++){
  const card=episodeCards[i],row=eps[i],date=historyDate328(row?.watched_at);if(!date)continue;
  const meta=q('.ct274-meta',card);
  if(meta){
   const t=String(meta.textContent||'');
   if(/\s•\s(?:\d{2}\/\d{2}\/\d{4}|—)$/.test(t))meta.textContent=t.replace(/\s•\s(?:\d{2}\/\d{2}\/\d{4}|—)$/,' • '+date);
   else if(!t.includes(date))meta.textContent=t+' • '+date;
  }
  const sub=q('.ct274-sub',card);
  if(sub&&!String(sub.textContent||'').includes(date))sub.textContent=String(sub.textContent||'').replace(/\s*•\s*Visto\s+\d{2}\/\d{2}\/\d{4}$/,'')+' • Visto '+date;
  card.dataset.ct328WatchedAt=String(row?.watched_at||'');
 }
 const movieCards=qa('[data-home] [data-ct274-history="movies"] [data-ct274-movie-card]');
 for(let i=0;i<movieCards.length&&i<movies.length;i++){
  const card=movieCards[i],row=movies[i],date=historyDate328(row?.watched_at);if(!date)continue;
  const sub=q('.ct274-sub',card);
  if(sub){
   const base=String(sub.textContent||'').replace(/\s*•\s*Visto\s+\d{2}\/\d{2}\/\d{4}$/,'');
   sub.textContent=base+' • Visto '+date;
  }
  card.dataset.ct328WatchedAt=String(row?.watched_at||'');
 }
 return {episodes:episodeCards.length,movies:movieCards.length};
}

function normalizeHistory328(){
 if(routeNow()!=='home')return false;
 const root=q('[data-home]');if(!root)return false;
 let found=false;
 for(const sec of qa('[data-ct274-history]',root)){
  found=true;
  sec.classList.remove('is-collapsed','is-open');
  sec.classList.add('ct328-history-natural');
  sec.removeAttribute('data-ct324-history');
  sec.dataset.ct328History='natural';
  for(const btn of qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct326-history-toggle],[data-ct327-history-toggle]',sec))btn.remove();
  force328(sec,'display','block');force328(sec,'max-height','none');force328(sec,'height','auto');
  force328(sec,'overflow','visible');force328(sec,'overflow-x','visible');force328(sec,'overflow-y','visible');
  const shell=q('.ct275-history-shell',sec);
  if(shell){
   shell.setAttribute('aria-hidden','false');
   force328(shell,'display','block');force328(shell,'grid-template-rows','none');force328(shell,'max-height','none');
   force328(shell,'height','auto');force328(shell,'min-height','0');force328(shell,'overflow','visible');
   force328(shell,'overflow-x','visible');force328(shell,'overflow-y','visible');force328(shell,'opacity','1');
   force328(shell,'transform','none');force328(shell,'pointer-events','auto');force328(shell,'transition','none');
  }
  const stack=q('.ct274-history-stack',sec);
  if(stack){
   stack.setAttribute('aria-hidden','false');
   force328(stack,'display','block');force328(stack,'max-height','none');force328(stack,'height','auto');
   force328(stack,'min-height','0');force328(stack,'overflow','visible');force328(stack,'overflow-x','visible');
   force328(stack,'overflow-y','visible');force328(stack,'overscroll-behavior','auto');force328(stack,'scrollbar-gutter','auto');
   force328(stack,'padding-right','0');try{stack.scrollTop=0}catch{}
  }
 }
 fixHistoryDates328();
 return found;
}
function homeTab328(){try{return typeof ct266CurrentHomeTab==='function'&&ct266CurrentHomeTab()==='movies'?'movies':'series'}catch{return'series'}}
function anchorTarget328(){
 const root=q('[data-home]');if(!root)return null;
 const tab=homeTab328(),view=q('[data-home-view="'+tab+'"]',root)||qa('[data-home-view]',root).find(x=>!x.classList.contains('hidden'));
 if(!view)return null;
 const hist=q(':scope > [data-ct274-history]',view);
 if(hist?.nextElementSibling)return hist.nextElementSibling;
 const wanted=tab==='movies'?'Assistir a seguir / Watchlist':'Assistir a seguir';
 return qa(':scope > .home-section',view).find(sec=>q('h3',sec)?.textContent?.trim()===wanted)||null;
}
function anchorHome328(){
 if(routeNow()!=='home')return false;
 normalizeHistory328();
 const target=anchorTarget328();if(!target)return false;
 const top=Math.max(0,target.getBoundingClientRect().top+window.scrollY-10);
 window.scrollTo({top,left:0,behavior:'auto'});return true;
}
function scheduleAnchor328(){
 clearTimeout(anchorTimer);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{anchorHome328();anchorTimer=setTimeout(()=>anchorHome328(),80)}));
}

async function fetchHome328(){
 if(testBridge?.homePayload){
  const d=await testBridge.homePayload();
  return typeof ct274NormalizeHomePayload==='function'?ct274NormalizeHomePayload(d):d;
 }
 if(typeof rpc!=='function')throw new Error('Sessão da Home indisponível.');
 const d=await rpc('cinetracker_home_payload_v328',{
  p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10),
  p_history_limit:50,p_series_limit:120,p_movie_limit:120
 });
 return typeof ct274NormalizeHomePayload==='function'?ct274NormalizeHomePayload(d):d;
}
ct274FetchHome=fetchHome328;

/* No nested history scrolling survives hydration. */
try{ct274AutoBottom=function(){normalizeHistory328();return false}}catch{}
const baseHydrate328=typeof ct274HydrateHome==='function'?ct274HydrateHome:null;
if(baseHydrate328)ct274HydrateHome=async function(){
 const out=await baseHydrate328.apply(this,arguments);
 normalizeHistory328();fixHistoryDates328();return out;
};

function paintHome328({anchor=true}={}){
 try{paintHome()}catch(e){throw e}
 normalizeHistory328();fixHistoryDates328();
 if(anchor)scheduleAnchor328();
 return true;
}
async function refreshHome328(seq,{repaint=true,anchor=false}={}){
 if(homeFetchTask)return homeFetchTask;
 homeFetchTask=(async()=>{
  try{
   const data=await fetchHome328();lastHomeFetchAt=Date.now();
   if(seq!==navSeq||routeNow()!=='home')return data;
   homeCache=data;
   if(repaint)paintHome328({anchor});
   return data;
  }finally{homeFetchTask=null}
 })();
 return homeFetchTask;
}
async function renderHome328(seq){
 const cached=homeCache&&homeCache.__ctHistoryAuthoritative===true;
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home>'+(cached?'':loading('Sincronizando Home...'))+'</div>'));
 if(cached){
  paintHome328({anchor:true});
  if(!lastHomeFetchAt)lastHomeFetchAt=Date.now();
  if(Date.now()-lastHomeFetchAt>HOME_FRESH_MS)void refreshHome328(seq,{repaint:true,anchor:false}).catch(()=>{});
  setTimeout(()=>{try{void window.__ctR325?.refreshTv?.(false)}catch{}},1200);
  return true;
 }
 try{
  const timeout=new Promise((_,rej)=>setTimeout(()=>rej(new Error('A Home demorou demais para responder. Tente novamente.')),5000));
  const data=await Promise.race([refreshHome328(seq,{repaint:false,anchor:false}),timeout]);
  if(seq!==navSeq||routeNow()!=='home')return false;
  lastHomeFetchAt=Date.now();homeCache=data;paintHome328({anchor:true});
  setTimeout(()=>{try{void window.__ctR325?.refreshTv?.(false)}catch{}},1200);
  return true;
 }catch(e){
  if(seq!==navSeq||routeNow()!=='home')return false;
  const h=q('[data-home]');if(h)h.innerHTML=fail('Falha ao sincronizar Home: '+(e?.message||e),'home');
  return false;
 }
}
renderHome=renderHome328;
try{ct274ReloadHome=async function(){
 const keep=homeTab328(),data=await fetchHome328();lastHomeFetchAt=Date.now();homeCache=data;
 if(routeNow()==='home'){paintHome328({anchor:false});try{ct266ApplyHomeTab?.(keep)}catch{}}
 try{profileCache=null;discoverCache?.clear?.()}catch{}return data;
}}catch{}
try{ct273ReloadHome=ct274ReloadHome}catch{}

/* Home-tab switches are local: no network, no skeleton, and anchor remains below the hidden history. */
document.addEventListener('click',e=>{
 if(!e.target?.closest?.('[data-home-tab]'))return;
 setTimeout(()=>scheduleAnchor328(),0);
},true);

try{
 const app=q('#app');
 if(app&&window.MutationObserver)new MutationObserver(muts=>{
  if(routeNow()!=='home')return;
  const changed=muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1));
  if(changed){normalizeHistory328();setTimeout(()=>fixHistoryDates328(),0)}
 }).observe(app,{subtree:true,childList:true});
}catch{}

const style=document.createElement('style');style.id='ct-web-r328';style.textContent=[
'[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] [data-ct326-history-toggle],[data-home] [data-ct327-history-toggle]{display:none!important}',
'[data-home] [data-ct274-history],[data-home] [data-ct274-history].is-collapsed,[data-home] [data-ct274-history].is-open{display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;overflow-x:visible!important;overflow-y:visible!important}',
'[data-home] [data-ct274-history] .ct275-history-shell,[data-home] [data-ct274-history].is-collapsed .ct275-history-shell{display:block!important;grid-template-rows:none!important;max-height:none!important;height:auto!important;min-height:0!important;overflow:visible!important;overflow-x:visible!important;overflow-y:visible!important;opacity:1!important;transform:none!important;pointer-events:auto!important;transition:none!important}',
'[data-home] [data-ct274-history] .ct274-history-stack,[data-home] [data-ct274-history] .ct275-history-shell>.ct274-history-stack{display:block!important;max-height:none!important;height:auto!important;min-height:0!important;overflow:visible!important;overflow-x:visible!important;overflow-y:visible!important;overscroll-behavior:auto!important;scrollbar-gutter:auto!important;padding-right:0!important}'
].join('\n');document.head.appendChild(style);

window.__ctR328={
 fetchHome:fetchHome328,renderHome:renderHome328,refreshHome:refreshHome328,
 normalizeHistory:normalizeHistory328,anchorHome:anchorHome328,fixHistoryDates:fixHistoryDates328,
 version:'1.0.119',setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},
 renderNow(){return renderHome328(navSeq)},clearHomeCache(){homeCache=null;lastHomeFetchAt=0},
 setHomeCache(v){homeCache=v;lastHomeFetchAt=Date.now()}
};
window.__ctR328Test={fetchHome328,renderHome328,normalizeHistory328,anchorTarget328,anchorHome328,fixHistoryDates328,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},renderNow(){return renderHome328(navSeq)},clearHomeCache(){homeCache=null;lastHomeFetchAt=0},setHomeCache(v){homeCache=v;lastHomeFetchAt=Date.now()}};
})();
