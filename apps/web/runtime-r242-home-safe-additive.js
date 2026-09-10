/* CineTracker Web 1.0.33 r242 — HOME ONLY. Delegates to the complete current Home renderer and only releases its initial wait sooner. */
(()=>{
'use strict';
if(window.__ctR242HomeAdditive)return;
window.__ctR242HomeAdditive='preview-first-movie-metadata';
window.__ctR242Scope='home-only';
window.__ctR242Safety='delegating-render-wrapper';

const CT242_META_KEY='cinetracker:r242:movie-meta:v1';
const CT242_META_AGE=1000*60*60*24*30;
const ct242Pending=new Map(),ct242Attempts=new Map();
let ct242MetaStore=null,ct242DecorateTimer=0,ct242PreviewToken=0;

const ct242Num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const ct242Id=x=>ct242Num(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);
const ct242Year=x=>String(x?.release_year||x?.release_date||x?.raw_tmdb?.release_date||'').slice(0,4);
const ct242Runtime=x=>ct242Num(x?.runtime_minutes||x?.runtime||x?.raw_tmdb?.runtime);
function ct242Genres(x){
  const src=x?.genres||x?.raw_tmdb?.genres||[];
  return Array.isArray(src)?src.map(g=>typeof g==='string'?g:g?.name).filter(Boolean).slice(0,3):[];
}
function ct242MetaText(x){
  const a=[],y=ct242Year(x),r=ct242Runtime(x),g=ct242Genres(x);
  if(y)a.push(y);if(r)a.push(`${r} min`);if(g.length)a.push(g.join(', '));
  return a.join(' · ');
}
function ct242ReadStore(){
  if(ct242MetaStore)return ct242MetaStore;
  try{const v=JSON.parse(localStorage.getItem(CT242_META_KEY)||'{}');ct242MetaStore=v&&typeof v==='object'?v:{}}catch{ct242MetaStore={}}
  const now=Date.now();for(const [k,v] of Object.entries(ct242MetaStore))if(!v||now-ct242Num(v.at)>CT242_META_AGE)delete ct242MetaStore[k];
  return ct242MetaStore;
}
function ct242WriteStore(){
  try{
    const s=ct242ReadStore(),entries=Object.entries(s).sort((a,b)=>ct242Num(b[1]?.at)-ct242Num(a[1]?.at)).slice(0,500);
    ct242MetaStore=Object.fromEntries(entries);localStorage.setItem(CT242_META_KEY,JSON.stringify(ct242MetaStore));
  }catch{}
}
function ct242Apply(x,d){
  if(!x||!d)return;
  if(!ct242Year(x)&&d.release_date){x.release_date=d.release_date;x.release_year=String(d.release_date).slice(0,4)}
  if(!ct242Runtime(x)&&ct242Num(d.runtime))x.runtime_minutes=ct242Num(d.runtime);
  if(!ct242Genres(x).length&&Array.isArray(d.genres))x.genres=d.genres.map(g=>({id:g?.id,name:g?.name})).filter(g=>g.name);
}
function ct242ApplyStored(x){
  const id=ct242Id(x),d=id?ct242ReadStore()[id]:null;if(!d)return false;ct242Apply(x,d);return true;
}
function ct242MovieMap(){
  const p=homeCache||{},rows=[...(Array.isArray(p.movie_watchlist)?p.movie_watchlist:[]),...(Array.isArray(p.history_movies)?p.history_movies:[])];
  const m=new Map();for(const x of rows){const id=ct242Id(x);if(id){ct242ApplyStored(x);if(!m.has(id))m.set(id,x)}}return m;
}
async function ct242FetchMeta(x){
  const id=ct242Id(x);if(!id||ct242Pending.has(id)||ct242Attempts.get(id)>=2)return;
  ct242Attempts.set(id,(ct242Attempts.get(id)||0)+1);
  const job=(async()=>{
    try{
      const d=await Promise.race([safeTmdb(`/movie/${id}`,{}),new Promise(r=>setTimeout(()=>r(null),6000))]);
      if(!d||(!d.release_date&&!d.runtime&&!Array.isArray(d.genres)))return;
      ct242Apply(x,d);const s=ct242ReadStore();s[id]={at:Date.now(),release_date:d.release_date||'',runtime:ct242Num(d.runtime),genres:Array.isArray(d.genres)?d.genres.slice(0,3):[]};ct242WriteStore();
      ct242ScheduleDecorate();
    }catch{}
  })().finally(()=>ct242Pending.delete(id));
  ct242Pending.set(id,job);await job;
}
async function ct242Hydrate(rows){
  let i=0;const workers=Array.from({length:Math.min(6,rows.length)},async()=>{while(i<rows.length){const x=rows[i++];await ct242FetchMeta(x)}});await Promise.all(workers);
}
function ct242DecorateMovies(){
  ct242DecorateTimer=0;if(route()!=='home')return;
  const root=document.querySelector('[data-home]');if(!root)return;
  const by=ct242MovieMap(),missing=[];
  for(const row of root.querySelectorAll('[data-media^="movie:"]')){
    const id=ct242Num(String(row.getAttribute('data-media')||'').split(':')[1]),x=by.get(id),small=row.querySelector('small');if(!x||!small)continue;
    const meta=ct242MetaText(x);if(meta&&small.textContent!==meta)small.textContent=meta;
    if(!ct242Year(x)||!ct242Runtime(x)||!ct242Genres(x).length)missing.push(x);
  }
  const unique=[...new Map(missing.map(x=>[ct242Id(x),x])).values()].filter(x=>ct242Id(x)>0);
  if(unique.length)void ct242Hydrate(unique);
}
function ct242ScheduleDecorate(){if(ct242DecorateTimer)return;ct242DecorateTimer=setTimeout(ct242DecorateMovies,25)}

function ct242RestoreCachedPayload(){
  if(route()!=='home')return false;const root=document.querySelector('[data-home]');if(!root||!root.querySelector('.loader'))return false;
  try{
    const cached=homeCache||((typeof ct163Read==='function')?ct163Read('home'):null);
    if(!cached)return false;homeCache=cached;paintHome();const painted=document.querySelector('[data-home]');if(painted)painted.dataset.ct242Fast='cache';ct242ScheduleDecorate();return true;
  }catch{return false}
}
async function ct242PreviewHome(seq){
  if(route()!=='home')return;const root=document.querySelector('[data-home]');if(!root||!root.querySelector('.loader'))return;
  const token=++ct242PreviewToken;
  try{
    const data=await rpc('cinetracker_home_preview_v1',{p_today:localDay()});
    if(token!==ct242PreviewToken||seq!==navSeq||route()!=='home')return;
    const now=document.querySelector('[data-home]');if(!now||!now.querySelector('.loader')||!data)return;
    homeCache=data;paintHome();const painted=document.querySelector('[data-home]');if(painted)painted.dataset.ct242Fast='preview';ct242ScheduleDecorate();
  }catch{}
}
function ct242KickFastHome(seq){
  if(seq!==navSeq||route()!=='home')return;
  const root=document.querySelector('[data-home]');if(!root)return;
  if(root.querySelector('.loader')){if(!ct242RestoreCachedPayload())void ct242PreviewHome(seq)}else ct242ScheduleDecorate();
}

/* Keep the complete renderer chain as authority. Calling it starts its normal shell/RPC immediately; this wrapper only paints cache/preview while that promise is still pending. */
const ct242RenderHomeBase=renderHome;
renderHome=async function(seq){
  let task;
  try{task=Promise.resolve(ct242RenderHomeBase(seq))}catch(e){throw e}
  ct242KickFastHome(seq);
  try{return await task}finally{if(seq===navSeq&&route()==='home')ct242ScheduleDecorate()}
};

document.addEventListener('cinetracker:data-changed',()=>{if(route()==='home')ct242ScheduleDecorate()});
window.addEventListener('pageshow',()=>{if(route()==='home')ct242ScheduleDecorate()});
window.__ctR242DecorateMovies=ct242DecorateMovies;
})();
