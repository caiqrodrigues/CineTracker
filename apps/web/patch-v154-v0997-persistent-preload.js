(() => {
'use strict';
if(window.__ct0997PersistentPreload154Loaded)return;
window.__ct0997PersistentPreload154Loaded=true;
window.__ct0997PersistentPreload154='r154-canonical-bounded-swr';

const EPOCH='r154';
const HOME_R2='cinetracker_home_live_v0997_r2';
const HOME_CURRENT='cinetracker_home_live_v0997';
const HOME_R3='cinetracker_home_live_v0997_r3';
const HOME_PROFILE_R2='cinetracker_profile_home_payload_v0997_r2';
const HOME_PROFILE_R3='cinetracker_profile_home_payload_v0997_r3';
const PROFILE_RPC='cinetracker_profile_payload_v0997';
const DASH_RPC='cinetracker_profile_media_dashboard_v0991';
const EX_RPC='cinetracker_discovery_exclusions_v0994';
const CACHEABLE=new Set([HOME_R3,HOME_PROFILE_R3,PROFILE_RPC,DASH_RPC,EX_RPC]);
const MEMORY_TTL=15000;
const SNAPSHOT_MAX_AGE=120000;
const DB_NAME='cinetracker-preload-r154';
const STORE='rpc';
const source=typeof window.sbRpc==='function'?(window.sbRpc.__ct0997Raw||window.sbRpc):null;
const rawRpc=typeof source==='function'?source.bind(window):null;
const memory=new Map();
const inflight=new Map();
let dbPromise=null,lastUser='',warmPromise=null,lastWarmAt=0;

function localDay(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function tz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Sao_Paulo'}catch{return'America/Sao_Paulo'}}
function userId(){
  try{if(currentUser?.id){lastUser=String(currentUser.id);return lastUser}}catch{}
  try{if(ctSession?.user?.id){lastUser=String(ctSession.user.id);return lastUser}}catch{}
  try{const s=JSON.parse(localStorage.getItem('cinetracker_session')||'null');if(s?.user?.id){lastUser=String(s.user.id);return lastUser}}catch{}
  return lastUser||'';
}
function authenticated(){try{return Boolean(ctSession?.access_token||currentUser?.id||userId())}catch{return Boolean(userId())}}
function mapCall(name,body={}){
  const n=String(name||'');
  if(n===HOME_R2||n===HOME_CURRENT)return{name:HOME_R3,body:{p_today:localDay()}};
  if(n===HOME_PROFILE_R2)return{name:HOME_PROFILE_R3,body:{p_today:localDay()}};
  return{name:n,body:body||{}};
}
function unwrap(v){let x=v;for(let i=0;i<4;i++){if(Array.isArray(x)&&x.length===1&&x[0]&&typeof x[0]==='object'){x=x[0];continue}if(x&&typeof x==='object'&&!Array.isArray(x)){if(x.data&&typeof x.data==='object'&&!Array.isArray(x.series)){x=x.data;continue}if(x.result&&typeof x.result==='object'&&!Array.isArray(x.series)){x=x.result;continue}if(x.payload&&typeof x.payload==='object'&&!Array.isArray(x.series)){x=x.payload;continue}}break}return x}
function valid(name,value){
  const v=name===HOME_R3?unwrap(value):value;
  if(name===HOME_R3)return Boolean(v&&typeof v==='object'&&!Array.isArray(v)&&Array.isArray(v.series)&&Array.isArray(v.movie_watchlist)&&Array.isArray(v.history_episodes)&&Array.isArray(v.history_movies)&&!v._ct138LegacySuppressed);
  if(name===DASH_RPC)return Array.isArray(v);
  if(name===PROFILE_RPC||name===HOME_PROFILE_R3||name===EX_RPC)return Boolean(v&&typeof v==='object');
  return v!=null;
}
function clean(name,value){return name===HOME_R3?unwrap(value):value}
function keyOf(name,body){const uid=userId();if(!uid)return'';let b='{}';try{b=JSON.stringify(body||{})}catch{}return `${EPOCH}|${uid}|${name}|${b}`}
function openDb(){
  if(dbPromise)return dbPromise;
  dbPromise=new Promise(resolve=>{try{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'key'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>resolve(null)}catch{resolve(null)}});
  return dbPromise;
}
async function readSnapshot(key){const db=await openDb();if(!db||!key)return null;return new Promise(resolve=>{try{const tx=db.transaction(STORE,'readonly'),r=tx.objectStore(STORE).get(key);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>resolve(null)}catch{resolve(null)}})}
async function writeSnapshot(key,value){const db=await openDb();if(!db||!key)return;await new Promise(resolve=>{try{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({key,at:Date.now(),value});tx.oncomplete=()=>resolve();tx.onerror=()=>resolve();tx.onabort=()=>resolve()}catch{resolve()}})}
async function clearUser(uid=userId()){
  memory.clear();inflight.clear();if(!uid)return;const db=await openDb();if(!db)return;
  await new Promise(resolve=>{try{const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),r=store.openCursor();r.onsuccess=()=>{const c=r.result;if(!c)return;const k=String(c.key||'');if(k.startsWith(`${EPOCH}|${uid}|`))c.delete();c.continue()};tx.oncomplete=()=>resolve();tx.onerror=()=>resolve();tx.onabort=()=>resolve()}catch{resolve()}})
}
function expose(name,value){const v=clean(name,value);if(name===HOME_R3&&valid(name,v))window.__ct0997PreloadedHomeLive=v;if(name===PROFILE_RPC&&valid(name,v))window.__ct0997PreloadedProfile=v;return v}
async function network(name,body,key){
  if(!rawRpc)throw new Error('RPC indisponível');
  if(inflight.has(key))return inflight.get(key);
  const p=Promise.resolve(rawRpc(name,body)).then(value=>{const v=clean(name,value);if(!valid(name,v))throw new Error(`Payload inválido: ${name}`);const entry={at:Date.now(),value:v};memory.set(key,entry);void writeSnapshot(key,v);return expose(name,v)}).finally(()=>inflight.delete(key));
  inflight.set(key,p);return p;
}
async function preload154(name,body={}){
  const mapped=mapCall(name,body),n=mapped.name,b=mapped.body;
  if(!rawRpc)throw new Error('RPC indisponível');
  if(!CACHEABLE.has(n))return rawRpc(n,b);
  const key=keyOf(n,b);if(!key)return rawRpc(n,b);
  const now=Date.now(),mem=memory.get(key);
  if(mem&&valid(n,mem.value)&&now-Number(mem.at||0)<=MEMORY_TTL)return expose(n,mem.value);
  let snap=mem&&valid(n,mem.value)?mem:null;
  if(!snap){const stored=await readSnapshot(key);if(stored&&valid(n,stored.value)){snap=stored;memory.set(key,stored)}}
  if(snap&&now-Number(snap.at||0)<=SNAPSHOT_MAX_AGE){void network(n,b,key).catch(()=>{});return expose(n,snap.value)}
  return network(n,b,key);
}
preload154.__ct0997PersistentPreload=true;
preload154.__ct154Canonical=true;
preload154.__ct0997Raw=async(name,body={})=>{const m=mapCall(name,body);const v=await rawRpc(m.name,m.body);return clean(m.name,v)};
window.__ct0997PersistentPreloadRpc=preload154;

async function warm(force=false){
  if(!authenticated()||!rawRpc)return false;if(warmPromise)return warmPromise;if(!force&&Date.now()-lastWarmAt<30000)return true;lastWarmAt=Date.now();
  warmPromise=Promise.allSettled([
    preload154(HOME_R3,{p_today:localDay()}),
    preload154(PROFILE_RPC,{p_tz:tz()}),
    preload154(DASH_RPC,{}),
    preload154(EX_RPC,{})
  ]).then(()=>true).finally(()=>{warmPromise=null});return warmPromise;
}
setTimeout(()=>void warm(false),180);
let probes=0;const authProbe=setInterval(()=>{probes++;if(authenticated()){clearInterval(authProbe);lastWarmAt=0;void warm(true)}else if(probes>=20)clearInterval(authProbe)},250);
window.addEventListener('cinetracker:auth-state-change',e=>{const t=String(e?.detail?.event||'');if(t==='SIGNED_IN'||t==='TOKEN_REFRESHED'){lastWarmAt=0;void warm(true)}if(t==='SIGNED_OUT'){const uid=lastUser;lastUser='';window.__ct0997PreloadedHomeLive=null;window.__ct0997PreloadedProfile=null;void clearUser(uid)}});
window.addEventListener('cinetracker:data-changed',()=>{const uid=userId();window.__ct0997PreloadedHomeLive=null;window.__ct0997PreloadedProfile=null;void clearUser(uid).then(()=>{lastWarmAt=0;setTimeout(()=>void warm(true),40)})});
window.addEventListener('focus',()=>{if(Date.now()-lastWarmAt>30000)void warm(true)});
window.__ct0997PersistentPreloadWarm=()=>warm(true);
window.__ct0997PersistentPreloadClear=()=>clearUser(userId());
})();
