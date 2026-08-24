(() => {
'use strict';
if (window.__ct57CacheLoaded) return;
window.__ct57CacheLoaded = true;
window.__ctWebVersion = '0.5.7';

const DB_NAME = 'cinetracker-cache-v1';
const STORE = 'snapshots';
const MAX_AGE = 5 * 60 * 1000;
let dbPromise = null;

function openDb(){
  if (!('indexedDB' in window)) return Promise.resolve(null);
  if (dbPromise) return dbPromise;
  dbPromise = new Promise(resolve => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
  return dbPromise;
}

async function put(key, value){
  const db = await openDb(); if (!db) return;
  try {
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put({key,value,at:Date.now()});
      tx.oncomplete=resolve; tx.onerror=reject; tx.onabort=reject;
    });
  } catch {}
}

async function get(key){
  const db = await openDb(); if (!db) return null;
  try {
    return await new Promise(resolve=>{
      const tx=db.transaction(STORE,'readonly');
      const r=tx.objectStore(STORE).get(key);
      r.onsuccess=()=>resolve(r.result||null); r.onerror=()=>resolve(null);
    });
  } catch { return null; }
}

async function snapshotData(){
  if (typeof sbApi !== 'function' || typeof sbRpc !== 'function') return;
  const tasks = [
    ['continue', () => sbRpc('cinetracker_continue_items_v2', {})],
    ['history', () => sbApi('watch_history?select=id,item_type,season_number,episode_number,watched_at,title,media:media(id,tmdb_id,media_type,title,poster_path)&order=watched_at.desc&limit=120')],
    ['overrides', () => sbApi('media_overrides?select=state,updated_at,media:media(id,tmdb_id,media_type,title,poster_path)&order=updated_at.desc&limit=500')],
    ['profile', () => sbRpc('cinetracker_profile_stats', {})]
  ];
  await Promise.allSettled(tasks.map(async ([key, fn]) => { const value = await fn(); await put(key, value); }));
}

function tmdbImageUrl(path,size='w500'){
  if (!path || typeof SUPABASE_URL === 'undefined') return '';
  return `${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${size}`;
}

async function prewarmMedia(){
  const values = [...(window.mediaRegistry?.values?.() || [])].slice(0, 48);
  const urls = [];
  for (const m of values) {
    const p = m?.poster_path || m?.posterUrl || '';
    if (p && !String(p).startsWith('http')) urls.push(tmdbImageUrl(p));
    else if (String(p).startsWith('http')) urls.push(String(p));
  }
  await Promise.allSettled(urls.slice(0,32).map(url => new Promise(resolve => {
    const im = new Image(); im.decoding='async'; im.onload=im.onerror=resolve; im.src=url;
  })));
}

async function registerSw(){
  if (!('serviceWorker' in navigator)) return;
  try { await navigator.serviceWorker.register('/service-worker.js', { scope: '/' }); } catch {}
}

async function warm(){
  await registerSw();
  await Promise.allSettled([snapshotData(), prewarmMedia()]);
}

window.ct57Cache = {
  get,
  put,
  refresh: async () => { await snapshotData(); await prewarmMedia(); },
  async getFresh(key){ const r=await get(key); return r && Date.now()-r.at<MAX_AGE ? r.value : null; }
};

if ('requestIdleCallback' in window) requestIdleCallback(()=>void warm(), {timeout:1200});
else setTimeout(()=>void warm(), 0);
})();
