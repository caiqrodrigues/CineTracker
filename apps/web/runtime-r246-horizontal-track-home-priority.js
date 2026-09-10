/* CineTracker Web 1.0.37 r246 — WEB ONLY.
   Create real local horizontal tracks and give all started series canonical priority
   before secondary movie metadata. */
(()=>{
'use strict';
if(window.__ctR246)return;
window.__ctR246='horizontal-track-home-priority';
window.__ctR246Scope='web-only';
window.__ctR246Horizontal='real-internal-tracks-from-wrapped-layouts';
window.__ctR246SeriesAuthority='all-started-series-all-references-canonical';
window.__ctR246HomePriority='initial-series-barrier-before-secondary-movies';

const CT246_SERIES_MAX=3;
const CT246_CANONICAL_TIMEOUT_MS=2500;
const CT246_RECONCILE_MS=1500;
const CT246_KNOWN='.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct169-season-chart-wrap,[data-ct246-scroll="1"]';
const CT246_TITLE_RX=/(Temporadas|T[ií]tulos semelhantes|Melhores e piores epis[oó]dios)/i;
const ct246Num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const ct246Prepared=new WeakSet(),ct246MouseWired=new WeakSet();

function ct246DirectElements(el){return [...(el?.children||[])].filter(x=>x?.nodeType===1)}
function ct246NaturalWidth(node){
  if(!node)return 0;
  const attr=ct246Num(node.getAttribute?.('width'));
  const vb=node.viewBox?.baseVal?.width||ct246Num(node.getAttribute?.('viewBox')?.trim?.().split(/\s+/)?.[2]);
  const scroll=ct246Num(node.scrollWidth);
  const rect=ct246Num(node.getBoundingClientRect?.().width);
  return Math.max(attr,vb,scroll,rect);
}
function ct246WireMouseDrag(el){
  if(!el||ct246MouseWired.has(el))return;
  ct246MouseWired.add(el);
  let active=false,startX=0,startY=0,startLeft=0,moved=false,suppressUntil=0;
  el.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse'||e.button!==0||el.scrollWidth<=el.clientWidth+1)return;
    active=true;moved=false;startX=e.clientX;startY=e.clientY;startLeft=el.scrollLeft;
  },{passive:true});
  el.addEventListener('pointermove',e=>{
    if(!active||e.pointerType!=='mouse')return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(!moved){
      if(Math.max(Math.abs(dx),Math.abs(dy))<5)return;
      if(Math.abs(dy)>=Math.abs(dx)){active=false;return}
      moved=true;el.dataset.ct246Dragging='1';
      try{el.setPointerCapture?.(e.pointerId)}catch{}
    }
    el.scrollLeft=startLeft-dx;suppressUntil=Date.now()+220;e.preventDefault();
  },{passive:false});
  const end=e=>{
    if(active||moved){try{if(e?.pointerId!=null)el.releasePointerCapture?.(e.pointerId)}catch{}}
    active=false;moved=false;delete el.dataset.ct246Dragging;
  };
  el.addEventListener('pointerup',end,{passive:true});
  el.addEventListener('pointercancel',end,{passive:true});
  el.addEventListener('lostpointercapture',()=>{active=false;moved=false;delete el.dataset.ct246Dragging},{passive:true});
  el.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopPropagation()}},true);
}
function ct246MarkOuter(el){
  if(!el)return false;
  el.dataset.ct246Scroll='1';
  ct246WireMouseDrag(el);
  return true;
}
function ct246EnsureTrack(el){
  if(!el)return false;
  if(el.classList?.contains('ct246-x-track'))return false;
  let track=el.querySelector?.(':scope > .ct246-x-track');
  if(track){ct246MarkOuter(el);return true}
  const children=ct246DirectElements(el).filter(x=>!x.matches?.('script,style'));
  if(children.length<2)return false;
  const cs=getComputedStyle(el);
  const gap=cs.columnGap&&cs.columnGap!=='normal'?cs.columnGap:(cs.gap&&cs.gap!=='normal'?cs.gap:'0px');
  track=document.createElement('div');track.className='ct246-x-track';track.style.setProperty('--ct246-gap',gap);
  for(const child of children){
    const rect=child.getBoundingClientRect();
    const ccs=getComputedStyle(child);
    let width=rect.width;
    if(!(width>=24))width=parseFloat(ccs.width)||parseFloat(ccs.flexBasis)||0;
    if(width>=24){
      child.style.setProperty('--ct246-card-width',`${Math.ceil(width)}px`);
      child.dataset.ct246Card='1';
    }
    track.appendChild(child);
  }
  el.appendChild(track);ct246MarkOuter(el);ct246Prepared.add(el);
  return true;
}
function ct246EnsureVisual(el){
  if(!el)return false;
  const visual=el.matches?.('svg,canvas')?el:el.querySelector?.(':scope > svg,:scope > canvas,svg,canvas');
  if(!visual)return false;
  let outer=visual.closest?.('.ct246-wide-visual-scroll');
  if(outer){ct246MarkOuter(outer);return true}
  const natural=ct246NaturalWidth(visual);
  const hostWidth=ct246Num((visual.parentElement||el).getBoundingClientRect?.().width);
  if(!(natural>Math.max(hostWidth+2,320)))return false;
  outer=document.createElement('div');outer.className='ct246-wide-visual-scroll';
  const track=document.createElement('div');track.className='ct246-wide-visual-track';
  visual.parentNode.insertBefore(outer,visual);outer.appendChild(track);track.appendChild(visual);
  visual.style.maxWidth='none';
  visual.style.width=`${Math.ceil(natural)}px`;
  track.style.minWidth=`${Math.ceil(natural)}px`;
  ct246MarkOuter(outer);ct246Prepared.add(outer);
  return true;
}
function ct246CandidateFromHeading(h){
  let s=h?.nextElementSibling;
  for(let i=0;s&&i<4;i++,s=s.nextElementSibling){
    if(s.matches?.(CT246_KNOWN)||ct246DirectElements(s).length>=2||s.querySelector?.('svg,canvas'))return s;
  }
  let p=h?.parentElement;
  for(let depth=0;p&&depth<4;depth++,p=p.parentElement){
    const candidates=ct246DirectElements(p).filter(x=>x!==h&&!x.contains?.(h));
    const strong=candidates.find(x=>x.matches?.(CT246_KNOWN)||ct246DirectElements(x).length>=2||x.querySelector?.('svg,canvas'));
    if(strong)return strong;
  }
  return null;
}
function ct246PrepareScroller(el){
  if(!el)return false;
  if(el.matches?.('.ct169-chart-scroll,.ct169-season-chart-wrap')&&el.querySelector?.('svg,canvas')){
    ct246MarkOuter(el);
    const visual=el.querySelector('svg,canvas'),natural=ct246NaturalWidth(visual);
    if(natural>el.clientWidth+2){
      visual.style.maxWidth='none';visual.style.width=`${Math.ceil(natural)}px`;
      visual.style.minWidth=`${Math.ceil(natural)}px`;
    }
    return true;
  }
  if(ct246EnsureTrack(el))return true;
  if(el.querySelector?.('svg,canvas'))return ct246EnsureVisual(el);
  return false;
}
function ct246ReconcileHorizontal(root=document){
  const scope=root||document;
  if(scope.matches?.(CT246_KNOWN))ct246PrepareScroller(scope);
  for(const el of scope.querySelectorAll?.(CT246_KNOWN)||[])ct246PrepareScroller(el);
  const headings=[];
  if(scope.matches?.('h1,h2,h3,h4,[role="heading"]'))headings.push(scope);
  headings.push(...(scope.querySelectorAll?.('h1,h2,h3,h4,[role="heading"]')||[]));
  for(const h of headings){
    if(!CT246_TITLE_RX.test((h.textContent||'').trim()))continue;
    const candidate=ct246CandidateFromHeading(h);
    if(candidate)ct246PrepareScroller(candidate);
  }
}
const ct246HorizontalObserver=new MutationObserver(ms=>{
  for(const m of ms)for(const node of m.addedNodes)if(node?.nodeType===1)ct246ReconcileHorizontal(node);
});
ct246HorizontalObserver.observe(document.documentElement,{childList:true,subtree:true});
[0,60,180,500,1200,2500].forEach(ms=>setTimeout(()=>ct246ReconcileHorizontal(document),ms));
ct246ReconcileHorizontal(document);
window.__ctR246PrepareHorizontal=ct246ReconcileHorizontal;

/* Home canonical authority */
const ct246MediaId=x=>ct246Num(x?.media_id||x?.mediaId);
const ct246ShowId=x=>ct246Num(typeof mediaTmdb==='function'?mediaTmdb(x):(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id));
function ct246Watched(x){return ct246Num(x?.watched_episodes||x?.episodes_watched||x?.watched_count||x?.history_watched_episodes)}
function ct246Total(x){return ct246Num(x?.total_episodes||x?.episodes_total||x?.totalEpisodes||x?.episode_count)}
function ct246StartedCandidate(x){
  if(!x)return false;
  const watched=ct246Watched(x),total=ct246Total(x);
  const position=ct246Num(x.last_season||x.last_episode||x.current_season||x.current_episode);
  const timestamp=!!(x.last_watched_at||x.last_watch_at||x.started_at);
  const bucket=String(x.home_bucket||x.queue||x.recommendation_bucket||'');
  const started=watched>0||position>0||timestamp||bucket==='continue'||bucket==='up_to_date';
  if(!started)return false;
  if(total>0&&watched>=total)return false;
  return true;
}
function ct246SeriesKey(x){
  const mid=ct246MediaId(x),tmdb=ct246ShowId(x);
  if(mid>0)return `m:${mid}`;
  if(tmdb>0)return `t:${tmdb}`;
  return '';
}
function ct246SeriesArrays(){
  const arrays=[];
  const push=v=>{if(Array.isArray(v)&&!arrays.includes(v))arrays.push(v)};
  const hc=window.homeCache;
  if(hc&&typeof hc==='object'){
    push(hc.series);push(hc.continue);push(hc.next);push(hc.upcoming);push(hc.rows);
    for(const v of Object.values(hc))push(v);
  }
  const hr=window.ctHomeRows;
  if(hr&&typeof hr==='object'){
    push(hr.series);push(hr.continue);push(hr.next);push(hr.upcoming);
    for(const v of Object.values(hr))push(v);
  }
  push(window.ctHomeSeriesRows);
  try{
    if(typeof ctHomeRows!=='undefined'&&ctHomeRows&&ctHomeRows!==hr){
      push(ctHomeRows.series);push(ctHomeRows.continue);push(ctHomeRows.next);push(ctHomeRows.upcoming);
      for(const v of Object.values(ctHomeRows))push(v);
    }
  }catch{}
  try{
    if(typeof homeCache!=='undefined'&&homeCache&&homeCache!==hc){
      push(homeCache.series);for(const v of Object.values(homeCache))push(v);
    }
  }catch{}
  return arrays;
}
function ct246CollectSeriesRefs(){
  const out=new Map();
  for(const arr of ct246SeriesArrays())for(const row of arr){
    if(!row||typeof row!=='object'||!ct246StartedCandidate(row))continue;
    const key=ct246SeriesKey(row);if(!key)continue;
    if(!out.has(key))out.set(key,[]);
    const refs=out.get(key);if(!refs.includes(row))refs.push(row);
  }
  return out;
}
function ct246Fingerprint(refs){
  return refs.map(x=>[
    ct246Watched(x),ct246Total(x),String(x.home_bucket||x.queue||''),
    x.last_watched_at||x.last_watch_at||'',String(x.is_caught_up)
  ].join('|')).sort().join('~');
}
function ct246ApplyContinue(key,current){
  const refs=ct246CollectSeriesRefs().get(key)||[];
  let changed=false;
  for(const row of refs){
    if(row.home_bucket!=='continue'||row.queue!=='continue'||row.recommendation_bucket!=='continue'||row.is_caught_up!==false){
      changed=true;
    }
    row.home_bucket='continue';row.queue='continue';row.recommendation_bucket='continue';row.is_caught_up=false;
    row.history_missing_episodes=Math.max(1,ct246Num(row.history_missing_episodes));
    if(current&&typeof current==='object')row.ct246_current_episode=current;
  }
  if(changed&&typeof route==='function'&&route()==='home'&&typeof ct175SchedulePaint==='function')ct175SchedulePaint();
  return changed;
}
function ct246Loaded(){
  try{
    if(Array.isArray(window.homeCache?.series))return true;
    if(typeof homeCache!=='undefined'&&Array.isArray(homeCache?.series))return true;
  }catch{}
  return false;
}
const ct246State=window.__ctR246HomeState={
  queue:[],queued:new Set(),inflight:new Set(),fingerprints:new Map(),
  active:0,initialStarted:false,initialDone:false,initialPending:new Set(),
  deferredMovies:new Map(),moviesReleased:false,auditSeq:0
};
let ct246MovieBase=typeof window.__ctR243QueueMovieMeta==='function'?window.__ctR243QueueMovieMeta:null;
function ct246ReleaseMovies(){
  if(ct246State.moviesReleased)return;
  ct246State.moviesReleased=true;ct246State.initialDone=true;
  if(!ct246MovieBase)return;
  const rows=[...ct246State.deferredMovies.values()];ct246State.deferredMovies.clear();
  if(rows.length)ct246MovieBase(rows);
}
if(ct246MovieBase){
  window.__ctR243QueueMovieMeta=function ct246DeferredMovieMeta(rows){
    if(typeof route==='function'&&route()==='home'&&!ct246State.initialDone){
      for(const row of rows||[]){
        const id=ct246Num(row?.tmdb_id||row?.source_tmdb_id||row?.raw_tmdb?.source_tmdb_id||row?.raw_tmdb?.id||row?.id);
        const key=id>0?String(id):JSON.stringify(row);
        if(!ct246State.deferredMovies.has(key))ct246State.deferredMovies.set(key,row);
      }
      ct246Kick(false);
      return;
    }
    return ct246MovieBase(rows);
  };
}
function ct246Timeout(promise,ms){
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error('r246 canonical timeout')),ms))
  ]);
}
async function ct246RunItem(item){
  try{
    const refs=ct246CollectSeriesRefs().get(item.key)||item.refs;
    const row=refs.find(x=>ct246MediaId(x)>0&&ct246ShowId(x)>0)||refs[0];
    if(!row||typeof ct176PrimeCanonical!=='function')return;
    const pair=await ct246Timeout(ct176PrimeCanonical(row,true),CT246_CANONICAL_TIMEOUT_MS);
    if(pair?.current)ct246ApplyContinue(item.key,pair.current);
    const latest=ct246CollectSeriesRefs().get(item.key)||refs;
    ct246State.fingerprints.set(item.key,ct246Fingerprint(latest));
  }catch(e){
    console.warn('r246 series audit failed',item.key,e);
  }finally{
    ct246State.active--;ct246State.queued.delete(item.key);ct246State.inflight.delete(item.key);
    if(ct246State.initialPending.has(item.key))ct246State.initialPending.delete(item.key);
    if(ct246State.initialStarted&&!ct246State.initialPending.size)ct246ReleaseMovies();
    ct246Pump();
  }
}
function ct246Pump(){
  if(typeof route==='function'&&route()!=='home')return;
  while(ct246State.active<CT246_SERIES_MAX&&ct246State.queue.length){
    const item=ct246State.queue.shift();
    ct246State.active++;ct246State.inflight.add(item.key);void ct246RunItem(item);
  }
}
function ct246RunAudit(force=false){
  if(typeof route==='function'&&route()!=='home')return 0;
  const refsByKey=ct246CollectSeriesRefs();
  if(!ct246Loaded())return 0;
  if(!ct246State.initialStarted){
    ct246State.initialStarted=true;
    for(const key of refsByKey.keys())ct246State.initialPending.add(key);
    if(!ct246State.initialPending.size){ct246ReleaseMovies();return 0}
  }
  for(const [key,refs] of refsByKey){
    const fp=ct246Fingerprint(refs);
    if(ct246State.queued.has(key)||ct246State.inflight.has(key)||(!force&&ct246State.fingerprints.get(key)===fp))continue;
    ct246State.queued.add(key);ct246State.queue.push({key,refs});
  }
  for(const key of [...ct246State.initialPending])if(!refsByKey.has(key))ct246State.initialPending.delete(key);
  if(ct246State.initialStarted&&!ct246State.initialPending.size)ct246ReleaseMovies();
  ct246Pump();ct246State.auditSeq++;
  return refsByKey.size;
}
let ct246KickTimer=0;
function ct246Kick(force=false){
  if(force){if(ct246KickTimer)clearTimeout(ct246KickTimer);ct246KickTimer=0;return ct246RunAudit(true)}
  if(ct246KickTimer)return;
  ct246KickTimer=setTimeout(()=>{ct246KickTimer=0;ct246RunAudit(false)},0);
}
const ct246PrimeBase=typeof ct175PrimeHome==='function'?ct175PrimeHome:null;
if(ct246PrimeBase)ct175PrimeHome=function(){const out=ct246PrimeBase.apply(this,arguments);queueMicrotask(()=>ct246Kick(false));return out};
if(typeof paintHome==='function'){
  const ct246PaintBase=paintHome;
  paintHome=function(){const out=ct246PaintBase.apply(this,arguments);queueMicrotask(()=>ct246Kick(false));return out};
}
document.addEventListener('cinetracker:data-changed',()=>ct246Kick(false));
window.addEventListener('pageshow',()=>ct246Kick(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)ct246Kick(false)});
[0,80,220,500,1000,1800,3000,5000].forEach(ms=>setTimeout(()=>ct246Kick(false),ms));
setInterval(()=>ct246Kick(false),CT246_RECONCILE_MS);
queueMicrotask(()=>ct246Kick(false));
window.__ctR246AuditStarted=()=>ct246RunAudit(true);
window.__ctR246Debug=()=>({
  active:ct246State.active,queued:ct246State.queue.length,inflight:ct246State.inflight.size,
  tracked:ct246State.fingerprints.size,initialStarted:ct246State.initialStarted,initialDone:ct246State.initialDone,
  initialPending:ct246State.initialPending.size,moviesReleased:ct246State.moviesReleased,deferredMovies:ct246State.deferredMovies.size
});
})();
