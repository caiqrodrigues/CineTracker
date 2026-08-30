(() => {
'use strict';
if(window.__ct0997R155Loaded)return;
window.__ct0997R155Loaded=true;
window.__ct0997R155='r155-bounded-read-final-guard';
window.__ctWebRevision='r155';

const READS=new Set([
  'cinetracker_home_live_v0997_r2','cinetracker_home_live_v0997','cinetracker_home_live_v0997_r3',
  'cinetracker_profile_home_payload_v0997_r2','cinetracker_profile_home_payload_v0997_r3',
  'cinetracker_profile_payload_v0997','cinetracker_profile_media_dashboard_v0991',
  'cinetracker_discovery_exclusions_v0994','cinetracker_calendar_watchlist_v0997'
]);
const bounded=window.__ct0997PersistentPreloadRpc;
const legacy=window.sbRpc;
if(typeof bounded==='function'&&typeof legacy==='function'){
  const sb155=(name,body={})=>READS.has(String(name||''))?bounded(name,body):legacy(name,body);
  sb155.__ct0997Raw=legacy.__ct0997Raw||legacy;
  sb155.__ct155BoundedReads=true;
  window.sbRpc=sb155;
}

let armSeq=0;
function routeKey(){
  const p=document.querySelector('#ct120-page'),d=String(p?.dataset?.ct120Route||document.querySelector('#app')?.firstElementChild?.dataset?.ct136Page||'').toLowerCase();
  if(['home','discover','profile','settings'].includes(d))return d;
  const path=String(location.pathname||'').replace(/\/+$/,'').toLowerCase();
  if(path==='/discover')return'discover';if(path==='/profile')return'profile';if(path==='/settings')return'settings';if(path==='/'||path==='/home')return'home';return'';
}
function stillLoading(key){
  const host=key==='home'?document.querySelector('#ct136-home'):key==='discover'?document.querySelector('#ct120-discover'):null;
  if(!host)return false;
  if(host.querySelector('.ct131-loading,.ct132-loading,.ct120-loading,[data-ct-loading]'))return true;
  const text=String(host.textContent||'').toLowerCase();
  if(!/(carregando|preparando)/.test(text))return false;
  if(key==='discover'&&host.querySelector('[data-ct149-card],.ct131-card'))return false;
  return true;
}
async function recover(key){
  try{await window.__ct0997PersistentPreloadClear?.()}catch{}
  try{sessionStorage.removeItem('ct139:home')}catch{}
  if(key==='discover'){
    try{if(typeof window.__ct150EnsureDiscover==='function'){await window.__ct150EnsureDiscover();return}}catch{}
    try{if(typeof window.__ct150RenderDiscover==='function'){await window.__ct150RenderDiscover(true);return}}catch{}
  }
  try{if(typeof window.__ct143RenderPrimary==='function')await window.__ct143RenderPrimary(key,true)}catch{}
}
function arm(key=routeKey()){
  if(!['home','discover'].includes(key))return;
  const seq=++armSeq;
  setTimeout(async()=>{
    if(seq!==armSeq||routeKey()!==key||!stillLoading(key))return;
    await recover(key);
    setTimeout(()=>{if(seq===armSeq&&routeKey()===key&&stillLoading(key))void recover(key)},7000);
  },7000);
}
window.addEventListener('cinetracker:primary-nav',e=>arm(String(e?.detail?.key||routeKey())));
window.addEventListener('popstate',()=>arm());
document.addEventListener('click',e=>{if(e.target?.closest?.('.sidebar a,.sidebar button,.mobile-nav a,.mobile-nav button,[data-ct120-nav],[data-view],[data-view991]'))setTimeout(()=>arm(),0)},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>arm(),{once:true});else arm();
window.__ct155RecoverPrimary=key=>recover(String(key||routeKey()));
})();
