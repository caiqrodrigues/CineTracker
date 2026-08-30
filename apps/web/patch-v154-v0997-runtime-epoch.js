(() => {
'use strict';
if(window.__ct0997RuntimeEpoch154Loaded)return;
window.__ct0997RuntimeEpoch154Loaded=true;
window.__ct0997RuntimeEpoch154='r154-runtime-epoch';
window.__ctRuntimeEpoch='r154';

const EPOCH='r154';
const MARKER='cinetracker:runtime-epoch';
let previous='';
try{previous=localStorage.getItem(MARKER)||''}catch{}
try{document.documentElement.dataset.ctRuntimeEpoch=EPOCH}catch{}

function clearVersionedSession(){
  try{
    const remove=[];
    for(let i=0;i<sessionStorage.length;i++){
      const k=sessionStorage.key(i)||'';
      if(/^(ct\d|ct:|cinetracker_(?:preload|home|profile|primary|discover))/i.test(k))remove.push(k);
    }
    remove.forEach(k=>sessionStorage.removeItem(k));
  }catch{}
  try{localStorage.removeItem('ct0994_home_preload_v1')}catch{}
  try{window.__ct0994PreloadedHome=null;window.__ct0997PreloadedHomeLive=null;window.__ct0997PreloadedProfile=null}catch{}
}
function clearOldIndexedDb(){
  try{for(const name of['cinetracker-preload-v1','cinetracker-preload-r153'])indexedDB.deleteDatabase(name)}catch{}
}
function clearOldCacheStorage(){
  try{if(!('caches'in window))return;void caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ct-web-')&&!k.includes(EPOCH)).map(k=>caches.delete(k)))).catch(()=>{})}catch{}
}
function updateServiceWorkers(){
  try{if(!('serviceWorker'in navigator))return;void navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.update().catch(()=>{})))).catch(()=>{})}catch{}
}

if(previous!==EPOCH){
  clearVersionedSession();
  clearOldIndexedDb();
  clearOldCacheStorage();
  try{localStorage.setItem(MARKER,EPOCH)}catch{}
}
updateServiceWorkers();
window.__ct154InvalidateVersionedCaches=()=>{clearVersionedSession();clearOldIndexedDb();clearOldCacheStorage();return true};
})();
