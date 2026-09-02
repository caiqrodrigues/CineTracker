/* Android 0.99.7.25 — embedded auth/runtime isolation */
(() => {
'use strict';
if(window.__ctAndroidR197AuthIsolation)return;
window.__ctAndroidR197AuthIsolation='disable-web-release-refresh-and-service-worker';
window.__ctAndroidReleasePolicy='embedded-apk-never-reloads-from-web-release-json';
window.__ctAndroidServiceWorkerPolicy='unregister-web-service-workers';

/*
  The embedded APK intentionally uses the production HTTPS origin as base URL so
  Supabase/CORS and relative app routing keep their established behavior. Web r161,
  however, assumes it is running as the deployable Web app: after 2.5s it fetches
  /release.json and location.replace()s whenever REVISION differs. Android has its
  own revision, so that creates an endless WebView reload loop and can interrupt
  login. Disable that Web-only updater inside the embedded runtime.
*/
try {
  releaseMismatch161=true;
  checkRelease161=async function(){return false};
  window.__ctCheckRelease=checkRelease161;
} catch {}

/* The APK owns its bundled runtime. A production Web service worker must never
   control or update the embedded client. Remove existing registrations and block
   new registrations for this document when WebView permits method replacement. */
async function ct197DropServiceWorkers(){
  try{
    if(!('serviceWorker' in navigator))return;
    const regs=await navigator.serviceWorker.getRegistrations();
    await Promise.all((regs||[]).map(r=>r.unregister().catch(()=>false)));
  }catch{}
}
void ct197DropServiceWorkers();
try{
  const sw=navigator.serviceWorker;
  if(sw&&typeof sw.register==='function'){
    try{sw.register=function(){return Promise.reject(new Error('Service Worker disabled in CineTracker embedded Android'))}}catch{}
  }
}catch{}

/* Persist the successful access token in the native bridge as well. This is not
   used as an alternate auth authority; localStorage remains canonical for the Web
   runtime, while the bridge keeps native notification work in sync. */
try{
  const saveSessionR197=saveSession;
  saveSession=function(s){
    const out=saveSessionR197(s);
    try{if(s?.access_token)window.CineTrackerNative?.saveSession?.(JSON.stringify(s))}catch{}
    return out;
  };
}catch{}

/* Re-assert isolation around boot because older layers wrap boot after r161. */
try{
  const bootR197=boot;
  boot=async function(){
    try{releaseMismatch161=true;checkRelease161=async function(){return false};window.__ctCheckRelease=checkRelease161}catch{}
    await ct197DropServiceWorkers();
    const out=await bootR197();
    await ct197DropServiceWorkers();
    return out;
  };
}catch{}
})();
