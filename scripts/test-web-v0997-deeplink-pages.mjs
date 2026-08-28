import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const sourcePath=resolve(root,'apps/web/patch-v132-v0997-deeplink-pages.js');
const source=await readFile(sourcePath,'utf8');

const must=[
  "v132-url-router-fullscreen-details-profile-10-more",
  "'/home'","'/discover'","'/profile'","'/configs'",
  "/movie\\/(\\d+)","/series\\/(\\d+)","/person\\/(\\d+)",
  "history[fn]","popstate","<a class=\"ct132-nav",
  "data-ct132-link","render404","ct132-route-shell","collapseSeasons",
  "i>=10","Ver todo elenco","/profile/favorites","data-ct132-add-favorite",
  "favorite_actors","state:'Liked'","data-ct120-open-local","data-ct118-credit",
  "person-credit","webProtocol","location.hash"
];
for(const token of must)if(!source.includes(token))throw new Error(`Web r132 source contract missing: ${token}`);
if(source.includes('i>=4'))throw new Error('Web r132 must not reintroduce the 4-card Profile limit.');

const vercel=JSON.parse(await readFile(resolve(root,'vercel.json'),'utf8'));
if(!Array.isArray(vercel.redirects)||!vercel.redirects.some(x=>x.source==='/'&&x.destination==='/home'))throw new Error('Web r132: root redirect to /home missing.');
if(!Array.isArray(vercel.rewrites)||!vercel.rewrites.some(x=>x.source==='/(.*)'&&x.destination==='/index.html'))throw new Error('Web r132: SPA catch-all rewrite missing.');
const sw=await readFile(resolve(root,'apps/web/service-worker.js'),'utf8');
if(!sw.includes("ct-web-0.99.7-r132"))throw new Error('Web r132: service-worker cache marker missing.');

for(const dir of ['dist','apps/web/dist']){
  try{
    await access(resolve(root,dir,'index.html'),constants.F_OK);
  }catch{continue}
  const html=await readFile(resolve(root,dir,'index.html'),'utf8');
  const a=html.indexOf('/patch-v131b-v0997-person-credit-bridge.js');
  const b=html.indexOf('/patch-v132-v0997-deeplink-pages.js');
  if(a<0||b<0||b<a)throw new Error(`Web r132: runtime tag missing or ordered before r131b in ${dir}.`);
  await access(resolve(root,dir,'patch-v132-v0997-deeplink-pages.js'),constants.F_OK);
}

console.log('CineTracker Web 0.99.7 r132 deep-link/full-page contracts: OK');
