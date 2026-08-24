(() => {
'use strict';
if(window.__ct69Loaded)return;window.__ct69Loaded=true;window.__ctAndroidBuild='0.0.83';
const DB='cinetracker-android-cache-v1',STORE='snapshots';let dbp=null;
function openDb(){if(!('indexedDB'in window))return Promise.resolve(null);if(dbp)return dbp;dbp=new Promise(resolve=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE,{keyPath:'key'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>resolve(null)});return dbp}
async function put(key,value){const d=await openDb();if(!d)return;try{await new Promise((res,rej)=>{const t=d.transaction(STORE,'readwrite');t.objectStore(STORE).put({key,value,at:Date.now()});t.oncomplete=res;t.onerror=rej;t.onabort=rej})}catch{}}
async function snapshot(){if(typeof sbApi!=='function'||typeof sbRpc!=='function')return;const jobs=[['continue',()=>sbRpc('cinetracker_continue_items_v2',{})],['history',()=>sbApi('watch_history?select=id,item_type,season_number,episode_number,watched_at,title,media:media(id,tmdb_id,media_type,title,poster_path)&order=watched_at.desc&limit=120')],['overrides',()=>sbApi('media_overrides?select=state,updated_at,media:media(id,tmdb_id,media_type,title,poster_path)&order=updated_at.desc&limit=500')],['profile',()=>sbRpc('cinetracker_profile_stats',{})]];await Promise.allSettled(jobs.map(async([k,f])=>put(k,await f())))}
function image(path){return path&&typeof SUPABASE_URL!=='undefined'?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=w500`:''}
async function prewarm(){const vals=[...(window.mediaRegistry?.values?.()||[])].slice(0,42);await Promise.allSettled(vals.map(m=>new Promise(resolve=>{let p=m?.poster_path||m?.posterUrl||'';if(!p)return resolve();const u=String(p).startsWith('http')?String(p):image(p);if(!u)return resolve();const im=new Image();im.decoding='async';im.loading='eager';im.onload=im.onerror=resolve;im.src=u})))}
async function warm(){await Promise.allSettled([snapshot(),prewarm()]);try{await window.ct68FullRefresh?.()}catch{}}
setTimeout(()=>void warm(),0);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(()=>void snapshot(),250)});
window.ct69Refresh=warm;
})();
