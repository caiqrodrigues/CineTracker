/* CineTracker Web 1.0.177 r386 — Home/Pra Voce fresh-client guard only. */
(()=>{
'use strict';
if(window.__ctR386?.version==='1.0.177')return;
window.__ctR386Marker='home-discover-fresh-client+release-check+sw-update';
const CURRENT='1.0.177',REVISION='r386-official-1.0.177';
let checking=false,lastCheck=0,reloading=false;
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return location.pathname.replace(/^\//,'')||'home'}};
const scoped=()=>{const r=routeNow();return r==='home'||r==='discover'||location.pathname==='/'||location.pathname==='/home'||location.pathname==='/discover'};
async function ensureFreshClient(force=false){
 if(!scoped()||checking||reloading)return false;
 if(!force&&Date.now()-lastCheck<30000)return false;
 checking=true;lastCheck=Date.now();
 try{
  const res=await fetch('/release.json?ct='+Date.now(),{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
  if(!res.ok)return false;const rel=await res.json();
  const remote=String(rel?.version||''),rev=String(rel?.revision||'');
  document.documentElement.dataset.ct386Remote=remote||'unknown';
  if(remote&&remote!==CURRENT){
   const key='ct386-reload:'+remote;
   if(sessionStorage.getItem(key)!=='1'){
    sessionStorage.setItem(key,'1');reloading=true;
    location.reload();return true;
   }
  }
  if(remote===CURRENT&&rev&&rev!==REVISION)document.documentElement.dataset.ct386RevisionMismatch='1';
  return remote===CURRENT;
 }catch{return false}finally{checking=false}
}
async function updateWorker(){
 if(!scoped()||!('serviceWorker' in navigator))return false;
 try{
  const reg=await navigator.serviceWorker.getRegistration();if(!reg)return false;
  await reg.update();return true;
 }catch{return false}
}
let controllerReloaded=false;
if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('controllerchange',()=>{
 if(controllerReloaded||!scoped())return;controllerReloaded=true;void ensureFreshClient(true);
});
window.addEventListener('pageshow',()=>{if(scoped()){void updateWorker();void ensureFreshClient(true)}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&scoped())void ensureFreshClient(false)});
window.addEventListener('click',e=>{
 const nav=e.target?.closest?.('[data-route],[data-nav],[data-view],.nav button,.mobile-nav button');
 const text=String(nav?.dataset?.route||nav?.dataset?.nav||nav?.dataset?.view||nav?.textContent||'').toLowerCase();
 if(text.includes('home')||text.includes('hoje')||text.includes('descobrir')||text.includes('discover'))setTimeout(()=>{void updateWorker();void ensureFreshClient(true)},0);
},true);
setTimeout(()=>{if(scoped()){void updateWorker();void ensureFreshClient(true)}},0);
window.__ctR386={version:CURRENT,revision:REVISION,ensureFreshClient,updateWorker,get checking(){return checking},get reloading(){return reloading}};
})();