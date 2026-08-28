import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch='patch-v133-v0997-primary-authority.js';
const source=resolve(root,'apps/web',patch);
const marker='v133-primary-single-authority-home-discover-profile';
const src=await readFile(source,'utf8');
if(!src.includes(marker))throw new Error('Web r133: source marker missing.');

const authGuardName='auth-runtime-guard-v134.js';
const authGuardPath=resolve(root,'apps/web',authGuardName);
const authGuard=await readFile(authGuardPath,'utf8');
if(!authGuard.includes('r134-auth-main-thread-unfreeze'))throw new Error('Web r134: auth runtime guard marker missing.');
if(!authGuard.includes('r136-legacy-observer-cutoff'))throw new Error('Web r136: legacy observer cutoff marker missing.');
try{new Function(authGuard)}catch(error){throw new Error(`Web r136: auth runtime guard syntax invalid: ${error.message}`)}

function makeNonBlocking(input){
  let out=input;
  const buildNeedle="window.__ctWebBuild = '0.99.7';";
  if(!out.includes(buildNeedle))throw new Error('Web r133 hotfix: build marker missing.');
  out=out.replace(buildNeedle,`${buildNeedle}\nwindow.__ct0997Primary133Hotfix = 'r133-nonblocking-home';\nwindow.__ct0997PrimaryReady=true;\nwindow.__ct0997PrimaryObserverSuppressed=true;\nwindow.__ct0997DirectNav='r136-direct-sidebar-nav';`);

  const cacheNeedle="const tmdbCache=new Map(),discoverCache=new Map();\nlet libraryCache=null,libraryAt=0,homeToken=0,discoverToken=0,profileToken=0,repairTimer=0,observer=null,searchTimer=0,lastSeriesDetailPath='';";
  if(!out.includes(cacheNeedle))throw new Error('Web r133 hotfix: cache declaration changed unexpectedly.');
  out=out.replace(cacheNeedle,"const tmdbCache=new Map(),discoverCache=new Map(),homeResolvedCache=new Map();\nlet libraryCache=null,libraryAt=0,homeToken=0,discoverToken=0,profileToken=0,repairTimer=0,observer=null,searchTimer=0,lastSeriesDetailPath='',homeWarmInFlight=false;");

  const homeAnchor='async function homeData(){';
  if(!out.includes(homeAnchor))throw new Error('Web r133 hotfix: homeData anchor missing.');
  const helpers=`function needsHomeWarm(row){\n  if(mediaType(row)!=='tv'||homeResolvedCache.has(mediaId(row)))return false;\n  const raw=row?.raw_tmdb||{};\n  const id=tmdbId(row);\n  return id<=0||!raw.status||!raw.last_episode_to_air||!Number(raw.number_of_episodes||row.total_episodes||0)||!posterOf(row);\n}\nasync function warmHomeSeries(rows){\n  if(homeWarmInFlight||!rows?.length)return;\n  homeWarmInFlight=true;\n  try{\n    const resolved=await mapLimit(rows.slice(0,16),4,async x=>await resolveRow(x));\n    let changed=false;\n    for(const x of resolved){\n      const mid=mediaId(x);\n      if(!mid)continue;\n      homeResolvedCache.set(mid,x);\n      changed=true;\n    }\n    if(changed&&pathNow()==='/home')setTimeout(()=>void renderHome(),0);\n  }finally{homeWarmInFlight=false}\n}\n`;
  out=out.replace(homeAnchor,helpers+homeAnchor);

  const heavy=/const ranked=\[\.\.\.series\]\.sort\([\s\S]*?\);const targets=ranked\.slice\(0,60\),live=new Map\(\(await mapLimit\(targets,6,async x=>\[mediaId\(x\),await resolveRow\(x\)\]\)\)\.filter\(Boolean\)\);series=series\.map\(x=>classifySeries\(live\.get\(mediaId\(x\)\)\|\|x\)\)\.filter\(x=>x\.home_bucket\);/;
  if(!heavy.test(out))throw new Error('Web r133 hotfix: blocking Home enrichment block not found.');
  out=out.replace(heavy,"const baseSeries=series.map(x=>homeResolvedCache.get(mediaId(x))||x);series=baseSeries.map(x=>classifySeries(x)).filter(x=>x.home_bucket);const warmCandidates=baseSeries.filter(needsHomeWarm).sort((a,b)=>(Date.parse(b.last_watched_at||'')||0)-(Date.parse(a.last_watched_at||'')||0)).slice(0,16);if(warmCandidates.length)void warmHomeSeries(warmCandidates);");

  /* r136: a autoridade final não observa mutações do próprio #app. Rota é reparada
     apenas por eventos explícitos (click, popstate, auth/data change e timers finitos). */
  const observerBlock=/const host=\$\('#app'\)\|\|document\.documentElement;observer=new MutationObserver\(scheduleRepair\);observer\.observe\(host,\{childList:true,subtree:true\}\);/;
  if(!observerBlock.test(out))throw new Error('Web r136: r133 MutationObserver block not found.');
  out=out.replace(observerBlock,'');

  /* r136: sidebar/mobile nav nunca dependem de handlers de 0.99.4/0.99.2. */
  const clickNeedle="window.addEventListener('click',e=>{const route=e.target.closest?.('[data-ct133-route]');";
  if(!out.includes(clickNeedle))throw new Error('Web r136: primary click authority anchor missing.');
  const clickReplacement="window.addEventListener('click',e=>{const legacyNav=e.target.closest?.('.sidebar .nav [data-view],.sidebar .nav [data-view99],.sidebar .nav [data-view991],.mobile-nav [data-view],.mobile-nav [data-view99],.mobile-nav [data-view991]');if(legacyNav&&e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){const target=String(legacyNav.dataset.view||legacyNav.dataset.view99||legacyNav.dataset.view991||'').replace('history','profile');if(['home','discover','profile','settings'].includes(target)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();void go(target==='settings'?'/configs':'/'+target);return}}const route=e.target.closest?.('[data-ct133-route]');";
  out=out.replace(clickNeedle,clickReplacement);

  if(out.includes('ranked.slice(0,60)'))throw new Error('Web r133 hotfix: blocking 60-item enrichment survived.');
  if(out.includes('new MutationObserver('))throw new Error('Web r136: primary MutationObserver survived.');
  if(!out.includes("r133-nonblocking-home"))throw new Error('Web r133 hotfix: emitted marker missing.');
  if(!out.includes("r136-direct-sidebar-nav"))throw new Error('Web r136: emitted direct nav marker missing.');
  return out;
}

const emitted=makeNonBlocking(src);
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await writeFile(resolve(dir,patch),emitted,'utf8');
  await writeFile(resolve(dir,authGuardName),authGuard,'utf8');
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${patch}"></script>`;
  const anchor='<script src="/patch-v132-v0997-deeplink-pages.js"></script>';
  const guardTag=`<script src="/${authGuardName}"></script>`;
  html=html.replaceAll(tag,'').replaceAll(guardTag,'');
  if(!html.includes(anchor))throw new Error(`Web r133: r132 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}${tag}`);
  const firstPatch=html.indexOf('<script src="/patch-');
  if(firstPatch<0)throw new Error(`Web r134: no patch script anchor found in ${indexPath}`);
  html=html.slice(0,firstPatch)+guardTag+html.slice(firstPatch);
  if(html.indexOf(guardTag)<0||html.indexOf(guardTag)>html.indexOf('<script src="/patch-'))throw new Error(`Web r134: auth guard is not before legacy patches in ${indexPath}`);
  await writeFile(indexPath,html,'utf8');
}

console.log('CineTracker Web 0.99.7 r136: observers legados silenciados; r133 sem observer próprio e navegação direta autoritativa.');
