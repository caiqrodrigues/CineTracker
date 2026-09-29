/* CineTracker Web 1.0.187 r396 — Discover Pra Voce canonical single payload. */
(()=>{
'use strict';
if(window.__ctR396?.version==='1.0.187')return;
window.__ctR396Marker='discover-foryou-single-canonical-payload-v396';
window.__ctR396Scope='discover-foryou-only';

const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const state=()=>window.__ctR288R263?.discover263||null;
const isForYou=()=>routeNow()==='discover'&&String(state()?.tab||'foryou')==='foryou';
const api=()=>window.__ctR388&&typeof window.__ctR388.renderForYou==='function'?window.__ctR388:null;
const testApi=()=>window.__ctR388Test||null;
const rpcCall=(name,args)=>{if(typeof rpc!=='function')return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(rpc(name,args))};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
let task=null,run=0;

function keyOf(x){
 const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;
 const type=String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
 return id>0?type+':'+id:'';
}
function normalizePayload(p){
 const watch=p?.watch&&typeof p.watch==='object'?p.watch:{},fresh=p?.fresh&&typeof p.fresh==='object'?p.fresh:{};
 return{
  watch:{movie:rows(watch.movie),series:rows(watch.series),anime:rows(watch.anime)},
  fresh:{movie:rows(fresh.movie),series:rows(fresh.series),anime:rows(fresh.anime)}
 };
}
function chooseDaily(fresh){
 const all=[...fresh.movie.slice(0,8),...fresh.series.slice(0,8),...fresh.anime.slice(0,8)].filter(x=>keyOf(x));
 if(!all.length)return[];
 const d=new Date(),stamp=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));
 return[all[stamp%all.length]];
}
function markValidated396(items){
 const t=testApi();t?.clearValidated?.();
 for(const x of items){const k=keyOf(x);if(k)t?.validateKey?.(k)}
}
function applyPayload396(payload){
 const a=api();if(!a)return false;const fy=a.fy;if(!fy||typeof fy!=='object')return false;
 const p=normalizePayload(payload),daily=chooseDaily(p.fresh);
 fy.watchPools={movie:p.watch.movie,series:p.watch.series,anime:p.watch.anime};
 fy.watchIndex={movie:0,series:0,anime:0};
 fy.freshPools={movie:p.fresh.movie,series:p.fresh.series,anime:p.fresh.anime};
 fy.freshIndex={movie:0,series:0,anime:0};
 fy.dailyPool=daily;fy.dailyIndex=0;
 markValidated396([...daily,...p.watch.movie,...p.watch.series,...p.watch.anime,...p.fresh.movie,...p.fresh.series,...p.fresh.anime]);
 try{sessionStorage.removeItem('ct392:foryou');localStorage.removeItem('ct392:foryou')}catch{}
 a.renderForYou();
 return !!document.querySelector('[data-ct388-foryou] [data-media]');
}
function settle396(message='Sem indicação elegível agora.'){
 const root=document.querySelector('[data-ct388-foryou]');if(!root)return false;
 for(const slot of root.querySelectorAll('[data-ct388-slot]')){
  const p=slot.querySelector('.ct388-placeholder');if(!p)continue;
  const watch=String(slot.dataset.ct388Slot||'').startsWith('watch:');
  p.classList.add('ct396-empty');
  p.innerHTML='<div class="ct388-skeleton"></div><b>'+(watch?'Nada elegível na Watchlist.':message)+'</b>';
 }
 return true;
}
async function loadForYou396(force=false){
 if(!isForYou())return false;if(task)return task;
 const token=++run,a=api();if(!a)return false;
 try{a.renderForYou()}catch{}
 document.documentElement.dataset.ct396ForYou='loading';
 task=(async()=>{
  try{
   const payload=await timeout(rpcCall('cinetracker_discover_foryou_v396',{p_watch_limit:30,p_fresh_limit:30}),5000);
   if(token!==run||!isForYou())return false;
   const ok=applyPayload396(payload);
   document.documentElement.dataset.ct396ForYou=ok?'ready':'ready-empty';
   if(!ok)settle396();
   return ok;
  }catch(e){
   if(token===run&&isForYou()){
    document.documentElement.dataset.ct396ForYou='error';
    try{a.renderForYou()}catch{}
    settle396('Falha ao carregar. Tente novamente.');
   }
   return false;
  }
 })().finally(()=>{if(token===run)task=null});
 return task;
}
function bind396(){
 const a=api();if(!a)return false;
 a.loadForYou=loadForYou396;
 for(const name of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[name]=loadForYou396;
 for(const name of ['__ctR321','__ctR382','__ctR383','__ctR384','__ctR385','__ctR393','__ctR394'])if(window[name]&&typeof window[name]==='object')window[name].loadForYou=loadForYou396;
 document.documentElement.dataset.ct396ForYouOwner='single-payload';
 return true;
}

bind396();
setTimeout(()=>{bind396();if(isForYou())void loadForYou396(false)},0);
window.addEventListener('cinetracker:data-changed',()=>{if(isForYou())setTimeout(()=>void loadForYou396(true),60)});
window.__ctR396={version:'1.0.187',scope:'discover-foryou-only',bind:bind396,loadForYou:loadForYou396,apply:applyPayload396,settle:settle396};
})();
