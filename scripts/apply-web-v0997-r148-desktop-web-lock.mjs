import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r148: '+msg)};

const brokenHomeFetch="const loadHome=window.__ct0997PersistentPreloadRpc||rpcDirect;let nextHome=normalizeHomePayload147(await loadHome('cinetracker_home_live_v0997_r2',{}));if(!validHomePayload(nextHome)){const rawHome=loadHome?.__ct0997Raw||rpcDirect;if(rawHome!==loadHome)nextHome=normalizeHomePayload147(await rawHome('cinetracker_home_live_v0997_r2',{}))}if(validHomePayload(nextHome)){homeData=nextHome;homeAt=Date.now();writePrimaryCache('home',homeData)}else if(!validHomePayload(homeData))throw new Error('Home retornou payload incompleto')";
const safeHomeFetch="const loadHome=window.__ct0997PersistentPreloadRpc||rpcDirect;let nextHome=null;try{nextHome=normalizeHomePayload147(await loadHome('cinetracker_home_live_v0997_r2',{}))}catch{}if(!validHomePayload(nextHome)){const rawHome=loadHome?.__ct0997Raw||rpcDirect;if(rawHome!==loadHome){try{nextHome=normalizeHomePayload147(await rawHome('cinetracker_home_live_v0997_r2',{}))}catch{}}}if(validHomePayload(nextHome)){homeData=nextHome;homeAt=Date.now();writePrimaryCache('home',homeData)}else if(!validHomePayload(homeData))throw new Error('Home retornou payload incompleto')";

const viewport='<meta name="viewport" content="width=device-width,initial-scale=1">';
const platformScript='<script id="ct-r148-web-pc-android">(()=>{window.__ctWebPlatform=\'web-pc\';document.documentElement.dataset.ctWebPlatform=\'pc\';if(!/Android/i.test(navigator.userAgent))return;const m=document.querySelector(\'meta[name="viewport"]\');if(m)m.setAttribute(\'content\',\'width=1280\');document.documentElement.dataset.ctWebAndroid=\'1\'})();</script>';
const assets=[
  'patch-v1196-v0997-persistent-preload.js',
  'patch-v134c-v0997-deeplink-details.js',
  'patch-v143-v0997-nav-gate.js',
  'patch-v143-v0997-primary-router.js'
];
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

for(const dir of dirs){
  const primaryPath=resolve(dir,'patch-v143-v0997-primary-router.js');
  let primary=await readFile(primaryPath,'utf8');
  must(primary.includes(brokenHomeFetch),'r147 Home fetch anchor missing');
  primary=primary.replace(brokenHomeFetch,safeHomeFetch);
  must(primary.includes("try{nextHome=normalizeHomePayload147(await loadHome('cinetracker_home_live_v0997_r2',{}))}catch{}"),'Home preload rejection is not caught');
  must(primary.includes("try{nextHome=normalizeHomePayload147(await rawHome('cinetracker_home_live_v0997_r2',{}))}catch{}"),'raw Home fallback rejection is not caught');
  must(!primary.includes('(max-device-width:'),'device-width responsive rule survived in primary router');
  await writeFile(primaryPath,primary,'utf8');
  execFileSync(process.execPath,['--check',primaryPath],{stdio:'pipe'});

  const navPath=resolve(dir,'patch-v143-v0997-nav-gate.js');
  const nav=await readFile(navPath,'utf8');
  must(!nav.includes('(max-device-width:'),'device-width responsive rule survived in navigation');

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(/<script id="ct-r148-web-pc-android">[\s\S]*?<\/script>/g,'');
  must(html.includes(viewport),'viewport anchor missing');
  html=html.replace(viewport,viewport+platformScript);
  for(const asset of assets){
    html=html.replace(new RegExp(`${esc(asset)}(?:\\?r\\d+)?`,'g'),`${asset}?r148`);
  }
  must(!html.includes('(max-device-width:'),'device-width responsive rule survived in index');
  must(html.includes('.app{min-height:100vh;display:grid;grid-template-columns:180px 1fr}'),'desktop sidebar grid contract missing');
  must(html.includes(platformScript),'Web PC platform marker missing');
  for(const asset of assets)must(html.includes(`${asset}?r148`),`fresh runtime URL missing: ${asset}`);
  await writeFile(indexPath,html,'utf8');
}

console.log('WEB_R148_APPLIED web=pc android-browser=desktop-viewport sidebar=preserved home=preload-catch+raw-fallback cache=r148 layout=unchanged');
await import('./test-web-v0997-r148-desktop-web-lock.mjs');
