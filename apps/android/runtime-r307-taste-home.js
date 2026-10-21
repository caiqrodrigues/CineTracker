/* CineTracker Android 1.0/r307: adaptive, audited recommendations and Home DOM integrity.
   Android runtime only. Reuses v525 authorization and the existing r278 action owner.
   All storage is account-scoped; no invented watch history or remote ML service. */
(()=>{
'use strict';
if(window.__ctR307Taste)return;
const list=v=>Array.isArray(v)?v:[];
const uid=()=>String(session?.user?.id||user?.id||'');
const isForYou=()=>route()==='discover'&&discoverState?.tab==='foryou'&&!!uid();
const now=()=>Date.now();
const day=()=>localDay();
const ref=x=>{const id=Number(ct186Id(x));return Number.isSafeInteger(id)&&id>0?(ct186Type(x)==='movie'?'movie':'tv')+':'+id:''};
const genre=x=>{try{return [...new Set(genreIds158(x).map(Number).filter(x=>x>0))]}catch{return[]}};
const hash=x=>{let n=2166136261;for(const ch of String(x)){n^=ch.charCodeAt(0);n=Math.imul(n,16777619)}return n>>>0};
const DAY=86400000,RETENTION=90*DAY,COOLDOWN=21*DAY;
let account='',history=[],serial=0,prefs=null,prefsAt=0,inflight=new Map(),refills=0,selected=0,learned=0;
let profileRows=[],profileLoadedAt=0,profileInflight=null;
function storeKey(id=uid()){return 'ct:r307:taste:'+id}
function reset(){
 const id=uid();if(id===account)return;
 account=id;history=[];serial=0;prefs=null;prefsAt=0;inflight.clear();
 profileRows=[];profileLoadedAt=0;profileInflight=null;
 try{const snapshot=JSON.parse(localStorage.getItem('ct:r307:genre-profile:'+id)||'null');
  if(snapshot?.at&&now()-snapshot.at<6*60*60*1000&&Array.isArray(snapshot.rows)){
   profileRows=snapshot.rows.slice(0,1800);profileLoadedAt=snapshot.at;
  }
 }catch{}
 try{
  const parsed=JSON.parse(localStorage.getItem(storeKey())||'[]');
  if(Array.isArray(parsed))history=parsed.filter(x=>x&&typeof x.ref==='string'&&
    Number.isFinite(Number(x.at))&&now()-Number(x.at)<RETENTION).slice(-1600);
 }catch{}
 serial=history.reduce((n,x)=>Math.max(n,Number(x.seq)||0),0);
}
function persist(){
 try{localStorage.setItem(storeKey(),JSON.stringify(history.slice(-1600)))}catch{}
}
function record(key,item,action='shown'){
 reset();if(!account||!ref(item))return;
 const r=ref(item),last=history[history.length-1];
 if(last&&last.ref===r&&last.key===key&&last.action===action&&now()-last.at<15000)return;
 history.push({ref:r,key,action,at:now(),seq:++serial,genres:genre(item).slice(0,12)});
 if(history.length>1700)history=history.slice(-1500);
 persist();prefs=null;learned++;
}
function profile(){
 reset();if(prefs&&now()-prefsAt<1500)return prefs;
 const positive=new Map(),negative=new Map(),totals={watched:0,watchlist:0,favorites:0};
 // Never infer dashboard ownership from a legacy global context: it can
 // temporarily refer to the previously signed-in account.
 const dash=profileRows;
 function add(map,ids,w){
  for(const g of ids)map.set(g,(map.get(g)||0)+w);
 }
 for(const row of dash){
  const ids=genre(row);if(!ids.length)continue;
  const viewed=Boolean(row.is_seen||row.is_completed||row.is_in_progress||row.is_up_to_date||
    Number(row.watched_episodes)>0||row.last_watched_at);
  const watch=Boolean(row.is_watchlist);
  const favorite=Boolean(row.is_favorite||row.is_favorited||row.favorite||
    row.is_favourite||row.favorite_at);
  const recent=Date.parse(row.last_watched_at||row.updated_at||'');
  const momentum=recent&&now()-recent<60*DAY?1.3:1;
  if(viewed){add(positive,ids,2*momentum);totals.watched++}
  if(watch){add(positive,ids,1.5);totals.watchlist++}
  if(favorite){add(positive,ids,4);totals.favorites++}
 }
 for(const event of history){
  const age=now()-event.at;
  if(age<0||age>RETENTION)continue;
  const w=Math.max(0.25,1-age/RETENTION);
  if(event.action==='seen')add(positive,list(event.genres),3.3*w);
  if(event.action==='watchlist')add(positive,list(event.genres),2.7*w);
  if(event.action==='swap')add(negative,list(event.genres),0.48*w);
 }
 prefs={positive,negative,totals};prefsAt=now();return prefs;
}
function score(key,item,seed,count){
 const p=profile(),genres=genre(item);
 const base=genres.length?genres.reduce((n,g)=>n+
  Math.log1p(p.positive.get(g)||0)*1.3-Math.log1p(p.negative.get(g)||0)*0.8,0)/Math.sqrt(genres.length):0;
 const rating=Math.max(0,Math.min(10,Number(item.vote_average||item.raw_tmdb?.vote_average||0)));
 // Rating breaks ties; affinity and an unexplored genre govern ranking.
 const quality=0.07*rating;
 const randomness=(hash(uid()+':'+day()+':'+key+':'+seed+':'+ref(item))%10000)/10000;
 const exploration=(seed%5===0?1.4:0.43)*randomness;
 const novelty=genres.some(g=>!(p.positive.get(g)>0))&&seed%5===0?1.3:0;
 const frequency=count>0?Math.min(count,15)*2.5:0;
 return base+quality+exploration+novelty-frequency;
}
function choose(key,rows,current=''){
 reset();if(!account)return null;
 const pool=list(rows).filter(x=>ref(x)&&ref(x)!==current);
 if(!pool.length)return null;
 const lastByRef=new Map(),counts=new Map();
 for(const e of history){
  if(!e.ref||e.action!=='shown')continue;
  if(key.startsWith('watchlist:')!==e.key.startsWith('watchlist:'))continue;
  const at=Number(e.at)||0;
  if(at>(lastByRef.get(e.ref)||0))lastByRef.set(e.ref,at);
  counts.set(e.ref,(counts.get(e.ref)||0)+1);
 }
 const unused=pool.filter(x=>now()-(lastByRef.get(ref(x))||0)>COOLDOWN);
 const candidates=unused.length?unused:pool.filter(x=>
  now()-(lastByRef.get(ref(x))||0)>=Math.min(3*DAY,COOLDOWN));
 const safe=candidates.length?candidates:pool;
 const seed=serial+1+hash(key+':'+day())%97;
 const chosen=[...safe].sort((a,b)=>
  score(key,b,seed,counts.get(ref(b))||0)-score(key,a,seed,counts.get(ref(a))||0))[0];
 selected++;return chosen||null;
}
function shown(key,item){record(key,item,'shown')}
function feedback(key,item,action){
 if(!['seen','watchlist','swap'].includes(action))return;
 record(key,item,action);
}
const kindOf=key=>key.endsWith(':movie')?'movie':key.endsWith(':anime')?'anime':'series';
const empty=()=>({movie:[],series:[],anime:[]});
const match=(item,kind)=>ct186Type(item)===(kind==='movie'?'movie':'tv')&&
 (kind==='movie'?!ct186Anime(item):kind==='anime'?ct186Anime(item):!ct186Anime(item));
function selectedData(){return window.__ctR303SinglePaint?.data?.()||ct186ForYouData||null}
function rankGenres(){
 const p=profile();return [...p.positive].sort((a,b)=>b[1]-a[1]).map(([g])=>g).filter(g=>![99,10764,10767,10766].includes(g)).slice(0,8);
}
async function refill(key){
 reset();
 if(!isForYou()||key.startsWith('watchlist:')||!session?.access_token)return false;
 const id=account,kind=kindOf(key),ticket=kind+':'+id;
 if(inflight.has(ticket))return inflight.get(ticket);
 const job=(async()=>{
  const data=selectedData(),ctx=ct186ContextValue,gate=window.__ctR279Audit;
  if(!data?._ct186_fresh||!ctx||typeof gate?.auditData!=='function')return false;
  const g=rankGenres(),attempt=refills++;
  const genres=g.length?String(g[(attempt+hash(key))%g.length]):undefined;
  const tmdbKind=kind==='movie'?'movie':'tv';
  const endpoint='/discover/'+tmdbKind;
  const params={
   include_adult:false,without_genres:kind==='movie'?'99':'99,10764,10767,10766',
   sort_by:attempt%3===0?'popularity.desc':attempt%3===1?'vote_count.desc':'first_air_date.desc',
   'vote_count.gte':kind==='anime'?40:60,
   'vote_average.gte':6.5,
   page:1+((hash(id+':'+day()+':'+key)+attempt*7)%18)
  };
  if(kind==='anime'){params.with_origin_country='JP';params.with_genres='16'}
  else if(genres)params.with_genres=genres;
  if(kind==='movie'){params['primary_release_date.gte']='1991-01-01';
   if(params.sort_by==='first_air_date.desc')params.sort_by='primary_release_date.desc'}
  else params['first_air_date.gte']='1991-01-01';
  const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error('candidate timeout')),9000));
  const result=await Promise.race([safeTmdb(endpoint,params),timeout]);
  if(uid()!==id||selectedData()!==data)return false;
  const fresh=ct186UniqueRows(list(result?.results).map(x=>({...x,media_type:tmdbKind})))
   .filter(x=>match(x,kind)&&ct186FreshEligible(x,ctx)&&window.__ctR265Test?.allowed?.(x)===true)
   .slice(0,12);
  if(!fresh.length)return false;
  const isolated={_ct186_fresh:empty(),_ct186_watchlist:empty(),_ct186_reserve:empty()};
  isolated._ct186_fresh[kind]=fresh;
  const audited=await gate.auditData(isolated);
  if(uid()!==id||selectedData()!==data)return false;
  const approved=list(audited?._ct186_fresh?.[kind]).filter(x=>
   match(x,kind)&&ct186FreshEligible(x,ctx)&&gate.permitted(x,false));
  if(!approved.length)return false;
  const old=list(data._ct186_fresh[kind]);
  data._ct186_fresh[kind]=ct186MergeRows(old,approved).slice(0,360);
  data._ct166_fresh=data._ct186_fresh;
  return data._ct186_fresh[kind].length>old.length;
 })().catch(error=>{
  document.documentElement.dataset.ct307RefillError=String(error?.message||error);
  return false;
 }).finally(()=>inflight.delete(ticket));
 inflight.set(ticket,job);return job;
}
async function next(key,current,options){
 const p=list(options);
 if(p.length)return choose(key,p,current);
 const topped=await refill(key);
 if(!topped)return null;
 // Source of truth: r278 checks current authenticated context + v525 verdict.
 return choose(key,window.__ctR278Test?.candidates?.(key,current)||[],current);
}
function tasteStats(){
 const p=profile();return{account,watched:p.totals.watched,watchlist:p.totals.watchlist,
 favorites:p.totals.favorites,genres:p.positive.size,impressions:history.filter(x=>x.action==='shown').length,
 chosen:selected,refills,learned};
}
// A new watched/favorite/watchlist state affects the next choice immediately.
window.addEventListener('cinetracker:data-changed',()=>{prefs=null;prefsAt=0});
// r284 may create an empty minimal context before its seven audited slots
// are ready. Fetch the *real* authenticated dashboard in parallel, rather
// than scoring suggestions from an empty fake profile.
async function warm(){
 reset();const id=account;
 if(!id||!session?.access_token)return false;
 if(profileRows.length&&now()-profileLoadedAt<12*60*1000)return true;
 if(profileInflight)return profileInflight;
 const task=(async()=>{
  const result=await Promise.race([
   rpc('cinetracker_profile_media_dashboard_v0991',{}),
   new Promise((_,reject)=>setTimeout(()=>reject(new Error('taste-profile-timeout')),9500))
  ]);
  if(uid()!==id||!Array.isArray(result))return false;
  const next=result.map(row=>({
   genre_ids:genre(row),
   is_seen:Boolean(row.is_seen),is_completed:Boolean(row.is_completed),
   is_in_progress:Boolean(row.is_in_progress),is_up_to_date:Boolean(row.is_up_to_date),
   watched_episodes:Number(row.watched_episodes)||0,
   last_watched_at:row.last_watched_at||null,
   is_watchlist:Boolean(row.is_watchlist),
   is_favorite:Boolean(row.is_favorite||row.is_favorited||row.is_favourite||row.favorite)
  })).filter(x=>x.genre_ids.length).slice(0,1800);
  profileRows=next;profileLoadedAt=now();prefs=null;prefsAt=0;
  try{localStorage.setItem('ct:r307:genre-profile:'+id,
    JSON.stringify({at:profileLoadedAt,rows:next}))}catch{}
  return true;
 })().catch(error=>{
  document.documentElement.dataset.ct307TasteProfileError=String(error?.message||error);
  return false;
 }).finally(()=>{if(uid()===id)profileInflight=null});
 profileInflight=task;return task;
}
const priorTasteRows=discoverRows;
discoverRows=function(tab,...args){
 if(String(tab)==='foryou'&&uid())void warm();
 return priorTasteRows.apply(this,arguments);
};
window.__ctR307Taste={choose,shown,feedback,next,refill,warm,profile,stats:tasteStats,
 scope:'Discover Pra Voce only',model:'affinity-genres-plus-local-feedback-and-exploration'};
})();

/* r307 Home: remove ONLY orphan check-only strips, and recover previously
   confirmed movie history when an older painter rewrites the viewport. */
(()=>{
'use strict';
if(window.__ctR307HomeGuard)return;
const active=()=>route()==='home';
const series=()=>document.querySelector('[data-home-viewport="series"]');
const movies=()=>document.querySelector('[data-home-viewport="movies"]');
let cleaned=0,repaired=0,lastRepair=0,pending=false,observer=null,observed=null;
function cleanOrphans(){
 const vp=series();if(!vp)return;
 for(const row of vp.querySelectorAll('.home-section .stack > .home-action-row')){
  if(row.querySelector('.media-row'))continue;
  if(!row.querySelector('button.home-check,[data-home-mark-episode]'))continue;
  const text=String(row.textContent||'').replace(/[✓✔\s]/g,'');
  if(text.length>0)continue;
  row.remove();cleaned++;
 }
}
function repairMovies(){
 const vp=movies();if(!vp||homeActiveTab158!=='movies')return;
 const verified=window.__ctR305MovieHistory?.latestRows?.()||[];
 if(!verified.length)return;
 const item=verified[0],id=Number(item.tmdb_id||0);
 if(!id)return;
 const stack=vp.querySelector('.home-history .stack');if(!stack)return;
 const last=[...stack.querySelectorAll('.media-row[data-media^="movie:"]')].at(-1);
 if(last?.dataset.media==='movie:'+id)return;
 if(Date.now()-lastRepair<1200)return;
 lastRepair=Date.now();repaired++;
 window.__ctR305MovieHistory?.restore?.();
}
function scan(){if(!active())return;cleanOrphans();repairMovies()}
function attach(){
 const target=document.querySelector('[data-home]');if(target===observed)return;
 observer?.disconnect();observer=null;observed=target;
 if(!target||typeof MutationObserver!=='function')return;
 observer=new MutationObserver(()=>{
  if(pending)return;
  pending=true;queueMicrotask(()=>{pending=false;scan()});
 });
 observer.observe(target,{subtree:true,childList:true});
}
const original=paintHome;
paintHome=function(...args){
 const out=original.apply(this,args);
 if(active()){scan();attach()}
 return out;
};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active())queueMicrotask(scan)});
document.addEventListener('click',event=>{
 if(event.target?.closest?.('[data-home-tab]'))queueMicrotask(()=>{scan();attach()});
},false);
window.__ctR307HomeGuard={scan,cleanOrphans,repairMovies,stats:()=>({cleaned,repaired,watching:!!observer})};
})();