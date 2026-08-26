const VERSION='ct-web-0.0.97-hotfix10-selective';
const MEDIA_CACHE=`${VERSION}-media`;
const META_CACHE=`${VERSION}-meta`;

self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('ct-web-')&&!k.startsWith(VERSION)).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
function isTmdbImage(url){ return url.pathname.includes('/functions/v1/tmdb-image'); }
function isTmdbMeta(url){ return url.pathname.includes('/functions/v1/tmdb-proxy'); }
async function cacheFirst(request, cacheName){const cache=await caches.open(cacheName),cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response&&response.ok)cache.put(request,response.clone()).catch(()=>{});return response;}
async function staleWhileRevalidate(request, cacheName){const cache=await caches.open(cacheName),cached=await cache.match(request);const network=fetch(request).then(response=>{if(response&&response.ok)cache.put(request,response.clone()).catch(()=>{});return response}).catch(()=>null);if(cached){network.catch(()=>{});return cached}return(await network)||new Response('',{status:504,statusText:'Offline'});}
self.addEventListener('fetch', event => {const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(isTmdbImage(url)){event.respondWith(cacheFirst(request,MEDIA_CACHE));return}if(isTmdbMeta(url)){event.respondWith(staleWhileRevalidate(request,META_CACHE));}});
