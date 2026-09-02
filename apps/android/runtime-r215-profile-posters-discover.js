/* Android 0.99.7.43 — unified Profile collapse + safe poster recovery + static Discover tabs */
(() => {
'use strict';
if(window.__ctAndroidR215Loaded)return;
window.__ctAndroidR215Loaded=true;
window.__ctAndroidR215='profile-unified-collapse-poster-recovery-discover-static-tabs';
window.__ctAndroidProfileStats='main-and-sports-collapse-together-tight-gap';
window.__ctAndroidPosterRecovery='safe-title-type-tmdb-fallback-cache';
window.__ctAndroidDiscoverTabs='core-click-static-3x3-no-gesture-listener';
window.__ctAndroidScope='android-only-web-untouched';

/* ---------------- Profile: one collapse state for media + sports stats ---------------- */
let profileSync215=0;
function syncProfileStats215(){
  profileSync215=0;
  if(String(location.pathname||'').replace(/^\//,'').split('/')[0]!=='profile')return;
  const root=document.querySelector('[data-profile]');
  if(!root)return;
  const statsBody=root.querySelector('[data-ct-r180-stats-body]');
  const sports=root.querySelector('[data-profile-sports-panel]');
  if(!statsBody||!sports)return;
  const collapsed=statsBody.classList.contains('hidden')||statsBody.hidden===true;
  sports.hidden=collapsed;
  sports.classList.toggle('ct215-stats-hidden',collapsed);
  sports.setAttribute('aria-hidden',collapsed?'true':'false');
}
function scheduleProfileSync215(){
  if(profileSync215)return;
  profileSync215=requestAnimationFrame(syncProfileStats215);
}

/* ---------------- Poster recovery for imported rows with missing/invalid TMDB metadata ---------------- */
const P215_PREFIX='ct:a43:poster:';
const P215_HIT_TTL=30*24*60*60*1000;
const P215_MISS_TTL=12*60*60*1000;
const pQueue215=[];
const pQueued215=new Set();
const pInflight215=new Map();
let pRunning215=0;
const P215_MAX=3;

function norm215(v){
  try{return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' e ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}catch{return String(v||'').toLowerCase().trim()}
}
function hash215(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
function year215(v){const m=String(v||'').match(/\b(18|19|20|21)\d{2}\b/);return m?Number(m[0]):0}
function candidateYear215(x,type){return year215(type==='movie'?x?.release_date:x?.first_air_date)}
function candidateNames215(x){return [x?.title,x?.name,x?.original_title,x?.original_name].map(norm215).filter(Boolean)}
function cacheKey215(type,title,year){return hash215(type+'|'+norm215(title)+'|'+String(year||0))}
function cacheRead215(key){
  try{
    const v=JSON.parse(localStorage.getItem(P215_PREFIX+key)||'null');
    if(!v||typeof v!=='object')return null;
    const ttl=v.miss?P215_MISS_TTL:P215_HIT_TTL;
    if(Date.now()-Number(v.at||0)>ttl){localStorage.removeItem(P215_PREFIX+key);return null}
    return v;
  }catch{return null}
}
function cacheWrite215(key,v){try{localStorage.setItem(P215_PREFIX+key,JSON.stringify({...v,at:Date.now()}))}catch{}return v}
function hostData215(host){
  if(!host)return null;
  const raw=String(host.dataset?.media||'');
  const m=raw.match(/^(movie|tv):(-?\d+)$/);
  const type=m?.[1]||'';
  const oldId=Number(m?.[2]||0)||0;
  const title=host.querySelector('b')?.textContent?.trim()||host.querySelector('.card-title')?.textContent?.trim()||'';
  const meta=host.querySelector('small')?.textContent||'';
  const y=year215(meta);
  if(!type||!title)return null;
  return {type,oldId,title,year:y,key:cacheKey215(type,title,y)};
}
function bestSearch215(rows,type,title,y){
  const q=norm215(title);
  const exact=(Array.isArray(rows)?rows:[]).filter(x=>candidateNames215(x).includes(q));
  if(!exact.length)return null;
  let pool=exact;
  if(y){
    const sameYear=exact.filter(x=>candidateYear215(x,type)===y);
    if(sameYear.length)pool=sameYear;
    else if(exact.length>1)return null;
  }
  pool=[...pool].sort((a,b)=>Number(b?.popularity||0)-Number(a?.popularity||0)||Number(b?.vote_count||0)-Number(a?.vote_count||0));
  if(!y&&pool.length>1){
    const a=Number(pool[0]?.popularity||0),b=Number(pool[1]?.popularity||0);
    if(!(a>0&&a>=Math.max(1,b*1.45)))return null;
  }
  return pool[0]||null;
}
async function resolvePoster215(job){
  const cached=cacheRead215(job.key);
  if(cached)return cached;
  if(job.oldId>0){
    try{
      const d=await safeTmdb('/'+job.type+'/'+job.oldId,{});
      if(Number(d?.id||0)>0&&d?.poster_path){
        return cacheWrite215(job.key,{id:Number(d.id),poster_path:String(d.poster_path),miss:false});
      }
    }catch{}
  }
  try{
    const d=await safeTmdb('/search/'+job.type,{query:job.title,page:1,include_adult:false});
    const hit=bestSearch215(d?.results,job.type,job.title,job.year);
    if(hit&&Number(hit.id||0)>0&&hit.poster_path){
      return cacheWrite215(job.key,{id:Number(hit.id),poster_path:String(hit.poster_path),miss:false});
    }
  }catch{}
  return cacheWrite215(job.key,{miss:true});
}
function applyPoster215(job,result){
  const nodes=document.querySelectorAll('[data-ct215-poster-key="'+job.key+'"]');
  for(const visual of nodes){
    if(result?.poster_path){
      const size=visual.classList.contains('thumb')?'w154':'w342';
      try{visual.style.backgroundImage="url('"+img(result.poster_path,size)+"')"}catch{}
      visual.dataset.ct215PosterState='done';
      const host=visual.closest('[data-media]');
      if(host&&Number(result.id||0)>0)host.dataset.media=job.type+':'+Number(result.id);
    }else visual.dataset.ct215PosterState='miss';
  }
}
async function runPosterJob215(job){
  let p=pInflight215.get(job.key);
  if(!p){
    p=resolvePoster215(job).finally(()=>pInflight215.delete(job.key));
    pInflight215.set(job.key,p);
  }
  const result=await p;
  applyPoster215(job,result);
}
function pumpPoster215(){
  while(pRunning215<P215_MAX&&pQueue215.length){
    const job=pQueue215.shift();pQueued215.delete(job.key);pRunning215++;
    runPosterJob215(job).catch(()=>{}).finally(()=>{pRunning215--;pumpPoster215()});
  }
}
function enqueuePoster215(host){
  if(!host?.isConnected)return;
  const d=hostData215(host);if(!d)return;
  const visuals=[...host.querySelectorAll('.poster,.thumb')].filter(v=>{
    const bg=String(v.style?.backgroundImage||'');
    return !bg||bg==='none';
  });
  if(!visuals.length)return;
  for(const v of visuals){
    if(v.dataset.ct215PosterState==='done')continue;
    v.dataset.ct215PosterKey=d.key;
    v.dataset.ct215PosterState='queued';
  }
  const cached=cacheRead215(d.key);
  if(cached){applyPoster215(d,cached);return}
  if(pQueued215.has(d.key)||pInflight215.has(d.key))return;
  pQueued215.add(d.key);pQueue215.push(d);pumpPoster215();
}

let io215=null;
try{
  io215=new IntersectionObserver(entries=>{
    for(const e of entries){
      if(!e.isIntersecting)continue;
      io215.unobserve(e.target);enqueuePoster215(e.target);
    }
  },{root:null,rootMargin:'700px 250px'});
}catch{}
function scanPosters215(root=document){
  const hosts=[];
  try{if(root.matches?.('[data-media]'))hosts.push(root)}catch{}
  try{hosts.push(...(root.querySelectorAll?.('[data-media]')||[]))}catch{}
  for(const host of hosts){
    const visual=host.querySelector('.poster,.thumb');
    if(!visual)continue;
    const bg=String(visual.style?.backgroundImage||'');
    if(bg&&bg!=='none')continue;
    if(visual.dataset.ct215PosterState==='done'||visual.dataset.ct215PosterState==='miss')continue;
    const d=hostData215(host);if(!d)continue;
    visual.dataset.ct215PosterKey=d.key;
    const cached=cacheRead215(d.key);
    if(cached){applyPoster215(d,cached);continue}
    if(io215){if(visual.dataset.ct215Observed!=='1'){visual.dataset.ct215Observed='1';io215.observe(host)}}
    else enqueuePoster215(host);
  }
}
let scanFrame215=0;
function scheduleScan215(root=document){
  if(scanFrame215)return;
  scanFrame215=requestAnimationFrame(()=>{scanFrame215=0;scanPosters215(root);scheduleProfileSync215()});
}

/* One observer handles both async Profile rebuilds and lazy media rows. No touch/pointer layer. */
try{
  const appRoot=document.querySelector('#app')||document.body;
  new MutationObserver(ms=>{
    scheduleProfileSync215();
    for(const m of ms){
      for(const n of m.addedNodes||[])if(n?.nodeType===1)scanPosters215(n);
    }
  }).observe(appRoot,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
}catch{}

/* Keep direct profile repaints synchronized even before observer delivery. */
try{
  const paintBase215=ct168PaintProfile;
  ct168PaintProfile=function(){const out=paintBase215.apply(this,arguments);requestAnimationFrame(()=>{syncProfileStats215();scanPosters215(document)});return out};
}catch{}

const style215=document.createElement('style');
style215.id='ct-android-099743-profile-posters-discover';
style215.textContent=`
/* PROFILE: visually join the two statistics panels and collapse them as one group. */
[data-page="profile"] .ct214-stats-panel{margin-bottom:2px!important}
[data-page="profile"] .ct214-stats-panel+[data-profile-sports-panel],
[data-page="profile"] [data-profile-sports-panel]{margin-top:0!important}
[data-page="profile"] [data-profile-sports-panel].ct215-stats-hidden{display:none!important}

/* DISCOVER: all nine pills are real, static hit targets. No horizontal tab rail, no arrows,
   no pointer/touch listener; the original app document click remains the only controller. */
[data-page="discover"] .ct-r180-tab-shell{
  display:block!important;width:100%!important;max-width:100%!important;overflow:visible!important;margin:0 0 7px!important
}
[data-page="discover"] .ct-r180-tab-arrow{display:none!important}
[data-page="discover"] [data-ct-r180-tabs]{
  display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;
  width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important;
  padding:0!important;scroll-behavior:auto!important;scroll-snap-type:none!important;touch-action:manipulation!important
}
[data-page="discover"] [data-ct-r180-tabs]>.chip{
  box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:none!important;
  min-height:34px!important;height:auto!important;padding:5px 4px!important;font-size:10px!important;line-height:1.08!important;
  white-space:normal!important;text-align:center!important;pointer-events:auto!important;touch-action:manipulation!important;
  position:relative!important;z-index:20!important
}
`;
document.getElementById(style215.id)?.remove();document.head.appendChild(style215);

requestAnimationFrame(()=>{syncProfileStats215();scanPosters215(document)});
})();
