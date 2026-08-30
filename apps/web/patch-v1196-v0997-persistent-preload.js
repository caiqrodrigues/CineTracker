(() => {
'use strict';
if(window.__ct0997PersistentPreload1196Loaded)return;
window.__ct0997PersistentPreload1196Loaded=true;
window.__ct0997PersistentPreload1196='v1196-persistent-rpc-stale-while-revalidate';

const HOME_RPC='cinetracker_profile_home_payload_v0994';
const PROFILE_RPC='cinetracker_profile_payload_v0997';
const DASH_RPC='cinetracker_profile_media_dashboard_v0991';
const EX_RPC='cinetracker_discovery_exclusions_v0994';
const REMAINING_RPC='cinetracker_profile_remaining_v0994';
const CORE_RPCS=new Set([HOME_RPC,PROFILE_RPC,DASH_RPC,EX_RPC,REMAINING_RPC]);
const STALE_TIME=10*60*1000;
const MAX_AGE=24*60*60*1000;
const DB_NAME='cinetracker-preload-v1';
const STORE='rpc';
const rawRpc=typeof window.sbRpc==='function'?window.sbRpc.bind(window):null;
const memory=new Map();
const inflight=new Map();
let dbPromise=null,lastUser='',warmBusy=null,lastWarmAt=0;

function userId(){
  try{if(currentUser?.id){lastUser=String(currentUser.id);return lastUser}}catch{}
  try{if(ctSession?.user?.id){lastUser=String(ctSession.user.id);return lastUser}}catch{}
  try{const s=JSON.parse(localStorage.getItem('cinetracker_session')||'null');if(s?.user?.id){lastUser=String(s.user.id);return lastUser}}catch{}
  return lastUser||'';
}
function bodyKey(body){try{return JSON.stringify(body||{})}catch{return'{}'}}
function cacheKey(name,body){const uid=userId();return uid?`${uid}|${name}|${bodyKey(body)}`:''}
function openDb(){
  if(dbPromise)return dbPromise;
  dbPromise=new Promise((resolve,reject)=>{
    if(!('indexedDB'in window)){reject(new Error('IndexedDB indisponível'));return}
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'key'})};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Falha IndexedDB'));
  }).catch(()=>null);
  return dbPromise;
}
async function readSnapshot(key){
  if(!key)return null;const db=await openDb();if(!db)return null;
  return new Promise(resolve=>{try{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null)}catch{resolve(null)}});
}
async function writeSnapshot(key,value){
  if(!key||value==null)return;const db=await openDb();if(!db)return;
  await new Promise(resolve=>{try{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({key,at:Date.now(),value});tx.oncomplete=()=>resolve();tx.onerror=()=>resolve();tx.onabort=()=>resolve()}catch{resolve()}});
}
async function clearUserSnapshots(uid=userId()){
  memory.clear();inflight.clear();if(!uid)return;const db=await openDb();if(!db)return;
  await new Promise(resolve=>{try{const tx=db.transaction(STORE,'readwrite'),store=db.transaction?tx.objectStore(STORE):null,req=store.openCursor();req.onsuccess=()=>{const cur=req.result;if(!cur)return;const k=String(cur.key||'');if(k.startsWith(`${uid}|`))cur.delete();cur.continue()};tx.oncomplete=()=>resolve();tx.onerror=()=>resolve();tx.onabort=()=>resolve()}catch{resolve()}});
}
function expose(name,value){
  if(name===HOME_RPC&&value&&typeof value==='object')window.__ct0994PreloadedHome=value;
  if(name===PROFILE_RPC&&value&&typeof value==='object')window.__ct0997PreloadedProfile=value;
  return value;
}
async function network(name,body,key){
  if(!rawRpc)throw new Error('RPC indisponível');
  if(inflight.has(key))return inflight.get(key);
  const p=Promise.resolve(rawRpc(name,body)).then(value=>{
    if(value!=null){const entry={at:Date.now(),value};memory.set(key,entry);void writeSnapshot(key,value);expose(name,value)}
    return value;
  }).finally(()=>inflight.delete(key));
  inflight.set(key,p);return p;
}

if(rawRpc){
  const rpc1196=async function(name,body={}){
    if(!CORE_RPCS.has(String(name)))return rawRpc(name,body);
    const key=cacheKey(String(name),body);if(!key)return rawRpc(name,body);
    const now=Date.now(),mem=memory.get(key);
    if(mem&&now-Number(mem.at||0)<=STALE_TIME)return expose(name,mem.value);
    let snap=mem;
    if(!snap){snap=await readSnapshot(key);if(snap?.value!=null)memory.set(key,snap)}
    if(snap?.value!=null&&now-Number(snap.at||0)<=MAX_AGE){
      void network(String(name),body,key).catch(()=>{});
      return expose(name,snap.value);
    }
    return network(String(name),body,key);
  };
  rpc1196.__ct0997PersistentPreload=true;rpc1196.__ct0997Raw=rawRpc;
  try{sbRpc=rpc1196}catch{}
  window.sbRpc=rpc1196;
  window.__ct0997PersistentPreloadRpc=rpc1196;
}

function tz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Sao_Paulo'}catch{return'America/Sao_Paulo'}}
function authenticated(){try{return Boolean(ctSession?.access_token||currentUser?.id||userId())}catch{return Boolean(userId())}}
async function warmBoot(force=false){
  if(!rawRpc||!authenticated())return false;
  if(warmBusy)return warmBusy;
  if(!force&&Date.now()-lastWarmAt<30000)return true;
  lastWarmAt=Date.now();
  const rpc=window.__ct0997PersistentPreloadRpc||window.sbRpc;
  warmBusy=Promise.allSettled([
    rpc(HOME_RPC,{}),
    rpc(PROFILE_RPC,{p_tz:tz()}),
    rpc(DASH_RPC,{}),
    rpc(EX_RPC,{})
  ]).then(()=>true).finally(()=>{warmBusy=null});
  return warmBusy;
}
function scheduleWarm(delay=0,force=false){setTimeout(()=>void warmBoot(force),delay)}

for(const d of [0,120,420])scheduleWarm(d);
window.addEventListener('cinetracker:auth-state-change',e=>{
  const type=String(e?.detail?.event||'');
  if(type==='SIGNED_IN'){lastWarmAt=0;scheduleWarm(0,true);scheduleWarm(250,true)}
  if(type==='SIGNED_OUT'){const uid=lastUser;lastUser='';window.__ct0997PreloadedProfile=null;void clearUserSnapshots(uid)}
});
window.addEventListener('cinetracker:data-changed',()=>{const uid=userId();window.__ct0997PreloadedProfile=null;void clearUserSnapshots(uid).then(()=>{lastWarmAt=0;scheduleWarm(60,true)})});
window.addEventListener('focus',()=>{if(Date.now()-lastWarmAt>STALE_TIME)scheduleWarm(0,true)});
window.__ct0997PersistentPreloadWarm=()=>warmBoot(true);
window.__ct0997PersistentPreloadClear=()=>clearUserSnapshots(userId());
})();