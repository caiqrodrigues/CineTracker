(() => {
'use strict';
if(window.__ct0997BoundedRead155Loaded)return;
window.__ct0997BoundedRead155Loaded=true;
window.__ct0997BoundedRead155='r155-direct-bounded-memory-only';

const HOME_R2='cinetracker_home_live_v0997_r2';
const HOME_CURRENT='cinetracker_home_live_v0997';
const HOME_R3='cinetracker_home_live_v0997_r3';
const HOME_PROFILE_R2='cinetracker_profile_home_payload_v0997_r2';
const HOME_PROFILE_R3='cinetracker_profile_home_payload_v0997_r3';
const PROFILE_RPC='cinetracker_profile_payload_v0997';
const DASH_RPC='cinetracker_profile_media_dashboard_v0991';
const EX_RPC='cinetracker_discovery_exclusions_v0994';
const CAL_RPC='cinetracker_calendar_watchlist_v0997';
const READS=new Set([HOME_R2,HOME_CURRENT,HOME_R3,HOME_PROFILE_R2,HOME_PROFILE_R3,PROFILE_RPC,DASH_RPC,EX_RPC,CAL_RPC]);
const TIMEOUT_MS=5500;
const FALLBACK_MS=2200;
const MEMORY_TTL=8000;
const legacy=typeof window.sbRpc==='function'?(window.sbRpc.__ct0997Raw||window.sbRpc):null;
const memory=new Map();
const inflight=new Map();

function localDay(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function mapCall(name,body={}){
  const n=String(name||'');
  if(n===HOME_R2||n===HOME_CURRENT)return{name:HOME_R3,body:{p_today:localDay()}};
  if(n===HOME_PROFILE_R2)return{name:HOME_PROFILE_R3,body:{p_today:localDay()}};
  if(n===HOME_R3)return{name:n,body:{...(body||{}),p_today:body?.p_today||localDay()}};
  if(n===HOME_PROFILE_R3)return{name:n,body:{...(body||{}),p_today:body?.p_today||localDay()}};
  return{name:n,body:body||{}};
}
function baseUrl(){try{if(typeof SUPABASE_URL!=='undefined'&&SUPABASE_URL)return String(SUPABASE_URL)}catch{}return String(window.SUPABASE_URL||'')}
function requestHeaders(){
  let h={};
  try{if(typeof authHeaders==='function')h={...authHeaders()};else if(typeof window.authHeaders==='function')h={...window.authHeaders()}}catch{}
  h.Accept='application/json';h['Content-Type']='application/json';return h;
}
function unwrapHome(v){let x=v;for(let i=0;i<4;i++){if(Array.isArray(x)&&x.length===1&&x[0]&&typeof x[0]==='object'){x=x[0];continue}if(x&&typeof x==='object'&&!Array.isArray(x)){if(x.data&&typeof x.data==='object'&&!Array.isArray(x.series)){x=x.data;continue}if(x.result&&typeof x.result==='object'&&!Array.isArray(x.series)){x=x.result;continue}if(x.payload&&typeof x.payload==='object'&&!Array.isArray(x.series)){x=x.payload;continue}}break}return x}
function clean(name,value){return name===HOME_R3?unwrapHome(value):value}
function keyOf(name,body){let b='{}';try{b=JSON.stringify(body||{})}catch{}return `${name}|${b}`}
async function directRest(name,body){
  const base=baseUrl();if(!base)throw new Error('Supabase indisponível');
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),TIMEOUT_MS);
  try{
    const r=await fetch(`${base}/rest/v1/rpc/${encodeURIComponent(name)}`,{method:'POST',headers:requestHeaders(),body:JSON.stringify(body||{}),signal:ctrl.signal,cache:'no-store'});
    const text=await r.text();
    if(!r.ok)throw new Error(`RPC ${name} ${r.status}${text?`: ${text.slice(0,180)}`:''}`);
    if(!text)return null;
    try{return JSON.parse(text)}catch{return text}
  }finally{clearTimeout(timer)}
}
function boundedLegacy(name,body){
  if(typeof legacy!=='function')return Promise.reject(new Error('RPC legado indisponível'));
  return new Promise((resolve,reject)=>{
    let done=false;const timer=setTimeout(()=>{if(done)return;done=true;reject(new Error(`RPC legado expirou: ${name}`))},FALLBACK_MS);
    Promise.resolve().then(()=>legacy.call(window,name,body)).then(v=>{if(done)return;done=true;clearTimeout(timer);resolve(v)},e=>{if(done)return;done=true;clearTimeout(timer);reject(e)});
  });
}
async function network(name,body,key){
  if(inflight.has(key))return inflight.get(key);
  const p=(async()=>{
    let value;
    try{value=await directRest(name,body)}catch(first){try{value=await boundedLegacy(name,body)}catch{throw first}}
    const v=clean(name,value);memory.set(key,{at:Date.now(),value:v});
    if(name===HOME_R3)window.__ct0997PreloadedHomeLive=v;
    if(name===PROFILE_RPC)window.__ct0997PreloadedProfile=v;
    return v;
  })().finally(()=>inflight.delete(key));
  inflight.set(key,p);return p;
}
async function boundedRead155(name,body={}){
  const original=String(name||''),mapped=mapCall(original,body),n=mapped.name,b=mapped.body;
  if(!READS.has(original)&&!READS.has(n))return boundedLegacy(n,b);
  const key=keyOf(n,b),cached=memory.get(key);
  if(cached&&Date.now()-Number(cached.at||0)<=MEMORY_TTL)return cached.value;
  return network(n,b,key);
}
boundedRead155.__ct0997PersistentPreload=true;
boundedRead155.__ct155Bounded=true;
boundedRead155.__ct0997Raw=async(name,body={})=>{const m=mapCall(name,body);let v;try{v=await directRest(m.name,m.body)}catch(first){try{v=await boundedLegacy(m.name,m.body)}catch{throw first}}return clean(m.name,v)};
window.__ct0997PersistentPreloadRpc=boundedRead155;
window.__ct0997PersistentPreloadWarm=()=>Promise.resolve(false);
window.__ct0997PersistentPreloadClear=()=>{memory.clear();inflight.clear();window.__ct0997PreloadedHomeLive=null;window.__ct0997PreloadedProfile=null;return Promise.resolve(true)};
for(const name of['cinetracker-preload-v1','cinetracker-preload-r153','cinetracker-preload-r154']){try{indexedDB.deleteDatabase(name)}catch{}}
window.addEventListener('cinetracker:data-changed',()=>{memory.clear();inflight.clear();window.__ct0997PreloadedHomeLive=null;window.__ct0997PreloadedProfile=null});
window.addEventListener('cinetracker:auth-state-change',()=>{memory.clear();inflight.clear()});
})();
