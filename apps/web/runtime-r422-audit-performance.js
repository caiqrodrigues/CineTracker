/* CineTracker Web 1.0.213 r422 — stability/performance audit and recommendation refinements. */
(()=>{
'use strict';
if(window.__ctR422?.version==='1.0.213')return;

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const mediaType=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const mediaId=x=>num(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id);
const mediaKey=x=>{const id=mediaId(x);return id>0?mediaType(x)+':'+id:''};
const titleOf=x=>String(x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'');
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||null;
const rawOf=x=>x?.raw_tmdb&&typeof x.raw_tmdb==='object'?x.raw_tmdb:{};
const DAY=86400000,SEVEN=7*DAY,RECENT_KEY='ct:r296:shown-recommendations:v1';
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);

/* Extend the active eligibility object instead of creating a parallel recommendation authority. */
const baseEligibility=window.__ctR412Eligibility||null;
const baseReason=baseEligibility?.reasonSync?.bind(baseEligibility);
const baseEligible=baseEligibility?.eligible?.bind(baseEligibility);
const baseFilter=baseEligibility?.filterRows?.bind(baseEligibility);
const baseDetail=baseEligibility?.detail?.bind(baseEligibility);
function genreTokens(x){
 const r=rawOf(x),ids=[],names=[];
 for(const v of [...rows(x?.genre_ids),...rows(r?.genre_ids),...rows(x?.genres),...rows(r?.genres)]){
  if(typeof v==='number'||/^\d+$/.test(String(v))){const n=Number(v);if(n)ids.push(n)}
  else{const n=norm(v?.name||v?.title||v);if(n)names.push(n)}
 }
 return{ids:[...new Set(ids)],names:[...new Set(names)]};
}
function scoreOf(x){return num(x?.vote_average||rawOf(x)?.vote_average)}
function yearOf(x){return num(String(x?.release_date||x?.first_air_date||x?.release_year||rawOf(x)?.release_date||rawOf(x)?.first_air_date||'').slice(0,4))}
function pureDramaDocumentary(x){
 const g=genreTokens(x),allowedId=new Set([18,99]),allowedName=new Set(['drama','documentario','documentary']);
 const has=g.ids.length+g.names.length>0;
 return has&&g.ids.every(v=>allowedId.has(v))&&g.names.every(v=>allowedName.has(v));
}
function supplementalReason(x){
 if(!x||typeof x!=='object')return'invalid';
 const score=scoreOf(x),year=yearOf(x);
 if(score>0&&score<7.5)return'rating';
 if(year>0&&year<=1990)return'year';
 if(pureDramaDocumentary(x))return'pure-drama-documentary';
 try{if(window.__ctR413Eligibility?.isReality?.(x))return'reality'}catch{}
 return'';
}
async function hydrateForEligibility(x){
 const hasScore=scoreOf(x)>0,hasYear=yearOf(x)>0,genres=genreTokens(x);
 if(hasScore&&hasYear&&(genres.ids.length||genres.names.length))return x;
 if(typeof baseDetail!=='function')return x;
 try{
  const d=await timeout(baseDetail(x),4500);
  if(!d)return x;
  return {...x,...d,media_type:mediaType(x),tmdb_id:mediaId(x),raw_tmdb:{...rawOf(x),...d}};
 }catch{return x}
}
async function eligible422(x,opts={}){
 if(baseReason&&baseReason(x,opts))return false;
 if(supplementalReason(x))return false;
 const h=await hydrateForEligibility(x);
 if(!posterOf(h)||scoreOf(h)<7.5||yearOf(h)<=1990||pureDramaDocumentary(h))return false;
 if(baseEligible&&!await baseEligible(h,opts))return false;
 return true;
}
async function filterRows422(input,opts={}){
 const limit=Math.max(0,num(opts.limit)||24),maxScan=Math.max(limit,num(opts.maxScan)||Math.max(48,limit*3)),source=rows(input).slice(0,maxScan);
 const pre=baseFilter?rows(await baseFilter(source,{...opts,limit:maxScan,maxScan})):source;
 const out=[],seen=new Set(),batch=6;
 for(let i=0;i<pre.length&&out.length<limit;i+=batch){
  const part=pre.slice(i,i+batch),checks=await Promise.all(part.map(async x=>[x,await eligible422(x,opts)]));
  for(const [x,ok] of checks){const k=mediaKey(x);if(!ok||!k||seen.has(k))continue;seen.add(k);out.push(x);if(out.length>=limit)break}
  await new Promise(resolve=>requestAnimationFrame(()=>resolve()));
 }
 return out;
}
if(baseEligibility&&!baseEligibility.__ctR422Patched){
 baseEligibility.reasonSync=function(x,opts={}){return supplementalReason(x)||(baseReason?baseReason(x,opts):'')};
 baseEligibility.eligible=eligible422;
 baseEligibility.filterRows=filterRows422;
 baseEligibility.__ctR422Patched=true;
}
window.__ctR422Eligibility={scoreOf,yearOf,pureDramaDocumentary,supplementalReason,eligible:eligible422,filterRows:filterRows422};

/* Reuse the already-persistent r296 recommendation history for the current r411 owner. */
let recentTask=null,recentLoadedAt=0,backendRecent=new Set(),sessionPinned=new Set(),recordBusy=false;
function localRecent(){
 try{
  const now=Date.now(),raw=rows(JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')),keep=raw.filter(x=>/^(movie|tv):\d+$/.test(String(x?.key||''))&&now-num(x?.at)<SEVEN);
  if(keep.length!==raw.length)localStorage.setItem(RECENT_KEY,JSON.stringify(keep));
  return new Set(keep.map(x=>String(x.key)));
 }catch{return new Set()}
}
function writeLocal(keys){
 try{
  const now=Date.now(),raw=rows(JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')).filter(x=>now-num(x?.at)<SEVEN),map=new Map(raw.map(x=>[String(x.key),x]));
  for(const key of keys)if(/^(movie|tv):\d+$/.test(key))map.set(key,{key,at:now});
  localStorage.setItem(RECENT_KEY,JSON.stringify([...map.values()]));
 }catch{}
}
async function loadRecent(force=false){
 if(!force&&Date.now()-recentLoadedAt<60000)return backendRecent;
 if(recentTask&&!force)return recentTask;
 recentTask=(async()=>{
  try{
   const v=await timeout(rpc('cinetracker_shown_recommendations_recent_v296',{p_days:7}),5000);
   backendRecent=new Set(rows(v).map(x=>(String(x?.media_type)==='movie'?'movie':'tv')+':'+num(x?.tmdb_id)).filter(k=>!k.endsWith(':0')));
   recentLoadedAt=Date.now();
  }catch{}
  return backendRecent;
 })().finally(()=>{recentTask=null});
 return recentTask;
}
function recentSet(){return new Set([...localRecent(),...backendRecent])}
function fyState(){return window.__ctR411?.getForYou?.()||null}
function slotEntries(s=fyState()){
 if(!s)return[];
 const out=[];
 if(rows(s.daily)[0])out.push(['daily',rows(s.daily)[0]]);
 for(const group of['watch','fresh'])for(const kind of['movie','series','anime']){const list=rows(s?.[group]?.[kind]),idx=num(s?.idx?.[group]?.[kind]),x=list.length?list[idx%list.length]:null;if(x)out.push([group+':'+kind,x])}
 return out;
}
function pinCurrent(){sessionPinned=new Set(slotEntries().map(([,x])=>mediaKey(x)).filter(Boolean))}
function allowedRecent(x,used){const k=mediaKey(x);return!!k&&!used.has(k)&&(!recentSet().has(k)||sessionPinned.has(k))}
async function sanitizeForYou(){
 const s=fyState();if(!s)return false;
 await loadRecent(false);
 const used=new Set(),recent=recentSet();
 const cleanPool=async list=>{
  const eligible=await filterRows422(rows(list),{limit:48,maxScan:96,requireOriginDetail:true,excludeWwe:true});
  return eligible.filter(x=>{const k=mediaKey(x);return k&&(!recent.has(k)||sessionPinned.has(k))});
 };
 for(const group of['watch','fresh'])for(const kind of['movie','series','anime']){s[group][kind]=await cleanPool(s[group][kind]);s.idx[group][kind]=0}
 const dailyCandidates=[...rows(s.fresh.movie),...rows(s.fresh.series),...rows(s.fresh.anime)];
 for(const group of['watch','fresh'])for(const kind of['movie','series','anime']){
  const list=rows(s[group][kind]),picked=list.find(x=>allowedRecent(x,used));if(picked){const k=mediaKey(picked);used.add(k);const i=list.findIndex(x=>mediaKey(x)===k);s.idx[group][kind]=Math.max(0,i)}
 }
 const daily=dailyCandidates.find(x=>allowedRecent(x,used));s.daily=daily?[daily]:[];
 return true;
}
async function recordVisible(){
 if(recordBusy)return false;
 const entries=slotEntries();if(!entries.length)return false;
 const keys=entries.map(([,x])=>mediaKey(x)).filter(Boolean);writeLocal(keys);pinCurrent();
 const items=entries.map(([slot,x])=>({media_type:mediaType(x),tmdb_id:mediaId(x),slot:slot.replace(':','_')}));
 recordBusy=true;try{await rpc('cinetracker_shown_recommendations_record_v296',{p_items:items});for(const k of keys)backendRecent.add(k);return true}catch{return false}finally{recordBusy=false}
}
const fyLocks=new Set();
async function prepareSwapPool(name){
 const s=fyState();if(!s)return false;await loadRecent(false);
 const used=new Set(slotEntries().filter(([n])=>n!==name).map(([,x])=>mediaKey(x)).filter(Boolean)),recent=recentSet();
 if(name==='daily'){
  const pool=[...rows(s.fresh.movie),...rows(s.fresh.series),...rows(s.fresh.anime)];
  const clean=await filterRows422(pool,{limit:48,maxScan:96,requireOriginDetail:true,excludeWwe:true});
  const choices=clean.filter(x=>{const k=mediaKey(x);return k&&!used.has(k)&&!recent.has(k)});
  if(choices.length)s.daily=[choices[0]];
  return choices.length>0;
 }
 const [group,kind]=name.split(':'),pool=rows(s?.[group]?.[kind]);
 const clean=await filterRows422(pool,{limit:48,maxScan:96,requireOriginDetail:true,excludeWwe:true});
 const current=mediaKey(slotEntries(s).find(([n])=>n===name)?.[1]);
 const choices=clean.filter(x=>{const k=mediaKey(x);return k&&k!==current&&!used.has(k)&&!recent.has(k)});
 if(!choices.length)return false;
 const rest=clean.filter(x=>mediaKey(x)!==mediaKey(choices[0]));s[group][kind]=[choices[0],...rest];s.idx[group][kind]=0;return true;
}
async function swapForYou(name){
 if(!name||fyLocks.has(name))return false;fyLocks.add(name);
 try{
  if(!await prepareSwapPool(name))return false;
  const ok=!!window.__ctR422BaseSwap?.(name);
  if(ok){queueMicrotask(()=>void recordVisible());return true}
  return false;
 }finally{fyLocks.delete(name)}
}
let baseLoad=null,baseRender=null;
function bindForYou(){
 const o=window.__ctR411;if(!o||typeof o!=='object')return false;
 if(!baseLoad)baseLoad=o.loadForYou?.bind(o);
 if(!baseRender)baseRender=o.renderForYou?.bind(o);
 if(!window.__ctR422BaseSwap)window.__ctR422BaseSwap=o.swap?.bind(o);
 if(typeof baseLoad!=='function'||typeof baseRender!=='function'||typeof window.__ctR422BaseSwap!=='function')return false;
 o.loadForYou=async function(force=false){
  const ok=await baseLoad(!!force);if(routeNow()!=='discover')return ok;
  pinCurrent();await sanitizeForYou();
  if(slotEntries().length<7){await baseLoad(true);pinCurrent();await sanitizeForYou()}
  baseRender(false);pinCurrent();void recordVisible();return slotEntries().length>0;
 };
 o.renderForYou=function(repair=false){const out=baseRender(false);queueMicrotask(()=>{pinCurrent();void recordVisible()});return out};
 o.swap=swapForYou;
 for(const n of['__ctR410','__ctR413','__ctR414','__ctR415','__ctR416','__ctR417','__ctR418','__ctR420','__ctR421']){const a=window[n];if(!a||typeof a!=='object')continue;if('loadForYou'in a)a.loadForYou=o.loadForYou;if('renderForYou'in a)a.renderForYou=o.renderForYou;if('swap'in a)a.swap=o.swap}
 document.documentElement.dataset.ct422ForYouOwner='r411';return true;
}

/* Keep the existing Profile layout; one existing toggle controls General + Sports together. */
function panelTitle(p){return norm(q(':scope > .panel-head h1,:scope > .panel-head h2,:scope > .panel-head h3,:scope > h1,:scope > h2,:scope > h3',p)?.textContent||'')}
function profilePanels(){
 const root=q('[data-profile]');if(!root)return{root:null,main:null,sports:null};
 const panels=qa('section.panel,.panel',root),main=panels.find(p=>panelTitle(p)==='estatisticas')||null,sports=panels.find(p=>panelTitle(p).includes('esportes assistidos'))||null;
 return{root,main,sports};
}
function syncProfileCollapse(){
 if(routeNow()!=='profile')return false;const{root,main,sports}=profilePanels();if(!root||!main)return false;
 const btn=q('[data-ct-r180-stats-toggle]',main),body=q('[data-ct-r180-stats-body]',main);if(!btn||!body)return false;
 const collapsed=body.classList.contains('hidden');if(sports)sports.hidden=collapsed;
 for(const v of qa('.stat b,.stat strong,.stat .value,.stat-value',main))v.style.fontVariantNumeric='tabular-nums';
 if(sports)for(const v of qa('.stat b,.stat strong,.stat .value,.stat-value',sports))v.style.fontVariantNumeric='tabular-nums';
 root.dataset.ct422ProfileCollapse='unified';return true;
}
function toggleProfile422(btn){
 const{main,sports}=profilePanels(),body=q('[data-ct-r180-stats-body]',main);if(!btn||!body)return false;
 const collapse=!body.classList.contains('hidden');body.classList.toggle('hidden',collapse);if(sports)sports.hidden=collapse;
 btn.setAttribute('aria-expanded',collapse?'false':'true');const span=q('span',btn),icon=q('b',btn);if(span)span.textContent=collapse?'Expandir':'Recolher';if(icon)icon.textContent=collapse?'⌄':'⌃';
 try{localStorage.setItem('ct:r180:profile:stats-collapsed',collapse?'1':'0')}catch{}return true;
}

/* One foreground/navigation coordinator replaces the inherited repair fan-out. */
let routeEpoch=0,reconcileTimer=0,lastForegroundAt=0;
async function reconcile422(reason='route'){
 const epoch=++routeEpoch;await new Promise(resolve=>requestAnimationFrame(()=>resolve()));if(epoch!==routeEpoch)return false;
 const r=routeNow();
 bindForYou();
 if(r==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou'){try{await window.__ctR411?.loadForYou?.(false)}catch{}}
 if(r==='profile')syncProfileCollapse();
 try{window.__ctR244Decorate?.();window.__ctR246Horizontal?.()}catch{}
 document.documentElement.dataset.ct422LastReason=reason;return true;
}
function scheduleRoute(reason='route',delay=40){clearTimeout(reconcileTimer);const token=routeEpoch+1;reconcileTimer=setTimeout(()=>{if(token>=routeEpoch)void reconcile422(reason)},delay)}
function foreground(){
 if(document.hidden)return;const now=Date.now();if(now-lastForegroundAt<250)return;lastForegroundAt=now;scheduleRoute('foreground',0);
}
window.addEventListener('popstate',()=>scheduleRoute('popstate',0));
window.addEventListener('online',()=>scheduleRoute('online',60));
document.addEventListener('visibilitychange',foreground);
window.addEventListener('cinetracker:data-changed',()=>scheduleRoute('data-changed',80));
window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const stats=t.closest('[data-ct-r180-stats-toggle]');if(stats){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();toggleProfile422(stats);return}
 if(t.closest('[data-nav],[data-ct319-tab],[data-ct263-discover-tab],[data-home-tab]'))scheduleRoute('navigation',0);
 if(t.closest('[data-media]'))requestAnimationFrame(()=>{try{window.__ctR244Decorate?.();window.__ctR246Horizontal?.()}catch{}});
},true);

window.__ctR422={
 version:'1.0.213',
 scope:'audit-performance+recommendation-refinement+foryou-stability+profile-unified-collapse',
 supplementalReason,pureDramaDocumentary,filterRows:filterRows422,loadRecent,sanitizeForYou,recordVisible,swapForYou,bindForYou,syncProfileCollapse,scheduleRoute,reconcile:reconcile422
};
window.__ctR422Marker='coalesced-foreground+strict-7.5-1990-drama-doc+persisted-7d-foryou+stable-actions+profile-unified-collapse';
queueMicrotask(()=>{bindForYou();scheduleRoute('boot',0)});
})();