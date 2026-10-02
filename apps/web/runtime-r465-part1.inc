/* CineTracker Web 1.0.255 r465 — Home/Discover/Profile/history recovery from real-device evidence. */
(()=>{
'use strict';
if(window.__ctR465?.version==='1.0.255')return;
window.__ctR465Marker='real-device-home-discover-profile-history';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('TIMEOUT')),ms))]);
const rpcCall=(name,args)=>{if(typeof rpc!=='function')return Promise.reject(new Error('RPC_UNAVAILABLE'));return Promise.resolve(rpc(name,args))};
const visible=(el)=>{try{return!!el?.isConnected&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getClientRects().length>0}catch{return false}};
const visibleOne=sel=>{const all=qa(sel);return all.find(visible)||all.at(-1)||null};
const authReady=()=>{try{return!!session?.access_token&&typeof rpc==='function'}catch{return false}};
async function waitAuth(){for(const ms of [0,100,250,500,900,1500,2400,3600]){if(ms)await sleep(ms);if(authReady())return true}return false}
function setBusy(el,on){if(!el)return;if(on){el.disabled=true;el.setAttribute('aria-busy','true')}else{el.disabled=false;el.removeAttribute('aria-busy')}}

/* HOME: keep the existing proven renderers, but only invoke them after auth is actually ready. */
let homeRun=0,homeBusy=false;
function setHomeTab(kind){
 try{window.__ctR371?.applyTab?.(kind)}catch{}
 for(const b of qa('[data-home-tab],.home-tabs button')){const raw=String(b.dataset?.homeTab||'');const k=raw==='movies'||raw==='series'?raw:(norm(b.textContent).includes('filme')?'movies':'series');if(k===kind)b.classList.add('active');else b.classList.remove('active')}
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
}
async function enterHome(kind,force=false){
 if(routeNow()!=='home')return false;if(homeBusy&&!force)return false;const run=++homeRun;homeBusy=true;setHomeTab(kind);
 try{
  if(!(await waitAuth()))throw new Error('AUTH_NOT_READY');if(run!==homeRun||routeNow()!=='home')return false;
  if(kind==='movies'){
   const load=window.__ctR461?.loadMovies;if(typeof load!=='function')throw new Error('MOVIES_OWNER_UNAVAILABLE');
   const ok=await timeout(load(true),22000);if(run!==homeRun||routeNow()!=='home')return false;setHomeTab('movies');
   document.documentElement.dataset.ct465HomeMovies=ok===false?'incomplete':'ready';return ok!==false;
  }
  const load=window.__ctR388?.loadSeries;if(typeof load!=='function')throw new Error('SERIES_OWNER_UNAVAILABLE');
  await timeout(load(true),12000);if(run!==homeRun||routeNow()!=='home')return false;
  window.__ctR388?.renderSeries?.();setHomeTab('series');window.__ctR458?.settleSeries?.();
  document.documentElement.dataset.ct465HomeSeries='ready';return true;
 }catch(e){document.documentElement.dataset.ct465HomeError=String(e?.message||e);return false}
 finally{if(run===homeRun)homeBusy=false}
}
function homeKindFrom(el){const raw=String(el?.dataset?.homeTab||'');if(raw==='movies'||raw==='series')return raw;const t=norm(el?.textContent);return t.includes('filme')?'movies':t.includes('serie')?'series':null}

/* DESCOBRIR > PRA VOCÊ: one visible host, finite auth/data retry and complete actions. */
const FY_KINDS=['movie','series','anime'];
const freshState=()=>({daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}});
let fy=freshState(),fyTask=null,fyToken=0;
const fyLocks=new Set(),fyExcluded=new Map();
function fyHost(){return visibleOne('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]')}
