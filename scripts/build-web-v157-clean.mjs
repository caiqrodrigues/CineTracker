import {rm,mkdir,copyFile,writeFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const js='app-v157.js',css='app-v157.css';
const html=`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#041017"><meta name="color-scheme" content="dark"><title>CineTracker</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/${css}?ct=r157-clean"></head><body><div id="app"></div><script defer src="/${js}?ct=r157-clean"></script></body></html>`;
const sw=`'use strict';\nconst CACHE='ct-web-0.99.7-r157-clean';\nconst STATIC=['/app-v157.js?ct=r157-clean','/app-v157.css?ct=r157-clean','/favicon.svg'];\nself.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC).catch(()=>{})))});\nself.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ct-web-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));\nself.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>new Response('<!doctype html><link rel="stylesheet" href="/app-v157.css?ct=r157-clean"><div id="app"></div><script src="/app-v157.js?ct=r157-clean"></script>',{headers:{'content-type':'text/html'}})));return}if(!STATIC.some(x=>u.pathname===new URL(x,location.origin).pathname))return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c)).catch(()=>{});return r}).catch(()=>caches.match(e.request)))});\n`;
for(const out of targets){
  await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
  await copyFile(resolve(root,'apps/web',js),resolve(out,js));
  await copyFile(resolve(root,'apps/web',css),resolve(out,css));
  try{await access(resolve(root,'apps/web/favicon.svg'));await copyFile(resolve(root,'apps/web/favicon.svg'),resolve(out,'favicon.svg'))}catch{await writeFile(resolve(out,'favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#041017"/><path d="M14 18h36v28H14z" fill="none" stroke="#58afe0" stroke-width="4"/><path d="m28 25 14 7-14 7z" fill="#d6b55b"/></svg>','utf8')}
  await writeFile(resolve(out,'index.html'),html,'utf8');
  await writeFile(resolve(out,'service-worker.js'),sw,'utf8');
}
console.log('WEB_R157_CLEAN_APPLIED runtime=single legacy-patches=0 routes=home+discover+sports+profile+configs details=clean');
