'use strict';
const CACHE='ct-web-0.99.7-r161-release-guard';
const STATIC=['/app-v158.js?ct=r158-adjustments','/app-v158.css?ct=r158-adjustments','/favicon.svg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC).catch(()=>{})))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ct-web-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>new Response('<!doctype html><link rel=\"stylesheet\" href=\"/app-v158.css?ct=r158-adjustments\"><div id=\"app\"></div><script src=\"/app-v158.js?ct=r158-adjustments\"></script>',{headers:{'content-type':'text/html'}})));return}if(!STATIC.some(x=>u.pathname===new URL(x,location.origin).pathname))return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c)).catch(()=>{});return r}).catch(()=>caches.match(e.request)))});
