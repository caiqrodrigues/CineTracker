import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const runtimeName = 'patch-v099-v0994-web.js';
const authName = 'patch-v103-v0994-session-gate.js';
const legacyName = 'patch-v092-v0991.js';
const preloadName = 'patch-v105-v0994-preload-layout.js';
const preloadTag = `<script src="/${preloadName}"></script>`;
const authorityTag = '<script src="/patch-v104-v0994-authority.js"></script>';
const targets = [resolve(root,'dist'),resolve(root,'apps/web/dist')];

for (const target of targets) {
  const indexPath=resolve(target,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.split(preloadTag).join('');
  if(!html.includes(authorityTag)) throw new Error(`0.99.4 preload: authority tag missing in ${indexPath}`);
  html=html.replace(authorityTag,`${authorityTag}${preloadTag}`);
  await writeFile(indexPath,html,'utf8');
  await copyFile(resolve(root,'apps/web',preloadName),resolve(target,preloadName));

  const runtimePath=resolve(target,runtimeName);
  let runtime=await readFile(runtimePath,'utf8');
  const loadFrom="async function load994(force=false){\n  if(payload994&&!force)return payload994;";
  const loadTo="async function load994(force=false){\n  if(!force&&!payload994&&window.__ct0994PreloadedHome)payload994=window.__ct0994PreloadedHome;\n  if(payload994&&!force)return payload994;";
  if(runtime.includes(loadFrom)) runtime=runtime.replace(loadFrom,loadTo);
  if(!runtime.includes('window.__ct0994PreloadedHome)payload994=window.__ct0994PreloadedHome')) throw new Error(`0.99.4 preload: Home bridge missing in ${runtimePath}`);
  const shellFrom='return `<div class="app"><aside class="sidebar">';
  const shellTo='return `<div class="app" data-ct994-owner="1" data-ct994-route="${active}"><aside class="sidebar">';
  if(runtime.includes(shellFrom)) runtime=runtime.replace(shellFrom,shellTo);
  if(!runtime.includes('data-ct994-owner="1"')) throw new Error(`0.99.4 preload: owner marker missing in ${runtimePath}`);
  const movieFrom="const all=Array.isArray(p.movie_watchlist)?p.movie_watchlist:[],visible=all.slice(0,movieLimit994),remaining=Math.max(0,all.length-visible.length);";
  const movieTo="const all=(Array.isArray(p.movie_watchlist)?p.movie_watchlist:[]).slice().sort((a,b)=>Number(Boolean(b.poster_path))-Number(Boolean(a.poster_path))||Number(Boolean(b.runtime_minutes))-Number(Boolean(a.runtime_minutes))||String(a.title||'').localeCompare(String(b.title||''),'pt-BR')),visible=all.slice(0,movieLimit994),remaining=Math.max(0,all.length-visible.length);";
  if(runtime.includes(movieFrom)) runtime=runtime.replace(movieFrom,movieTo);
  if(!runtime.includes('Number(Boolean(b.poster_path))-Number(Boolean(a.poster_path))')) throw new Error(`0.99.4 preload: movie ordering missing in ${runtimePath}`);
  await writeFile(runtimePath,runtime,'utf8');

  const authPath=resolve(target,authName);
  let auth=await readFile(authPath,'utf8');
  const navFrom="async function guardedNavigate994(target) {\n  if (!(await ensureSession994())) return showAuth994();\n  if (typeof rawNavigate994 !== 'function') return false;";
  const navTo="async function guardedNavigate994(target) {\n  if (!(await ensureSession994())) return showAuth994();\n  try { if (typeof window.__ct0994PreloadCore === 'function') await window.__ct0994PreloadCore({ target }); } catch (error) { console.warn('[CineTracker 0.99.4] preload da rota', target, error); }\n  if (typeof rawNavigate994 !== 'function') return false;";
  if(auth.includes(navFrom)) auth=auth.replace(navFrom,navTo);
  if(!auth.includes("window.__ct0994PreloadCore === 'function'")) throw new Error(`0.99.4 preload: auth navigation bridge missing in ${authPath}`);
  await writeFile(authPath,auth,'utf8');

  const legacyPath=resolve(target,legacyName);
  let legacy=await readFile(legacyPath,'utf8');
  const profileFrom='try{await fetchDashboard991(true);renderProfileBody991()}';
  const profileTo='try{await fetchDashboard991(false);renderProfileBody991()}';
  if(legacy.includes(profileFrom)) legacy=legacy.replace(profileFrom,profileTo);
  if(!legacy.includes(profileTo)) throw new Error(`0.99.4 preload: Profile cached render missing in ${legacyPath}`);
  const forYouFrom='const r=await recommendationData991();';
  const forYouTo='const r=await (window.__ct991PreloadDiscover?window.__ct991PreloadDiscover():recommendationData991());';
  if(legacy.includes(forYouFrom)) legacy=legacy.replace(forYouFrom,forYouTo);
  if(!legacy.includes(forYouTo)) throw new Error(`0.99.4 preload: Discover cached render missing in ${legacyPath}`);
  const router='window.ct991Navigate=navigate991;window.ct98Navigate=navigate991;';
  const exports=`${router}\nlet ct991DiscoverWarm=null,ct991DiscoverValue=null;\nwindow.__ct991Preload=()=>fetchDashboard991(false);\nwindow.__ct991PreloadDiscover=()=>{if(ct991DiscoverValue)return Promise.resolve(ct991DiscoverValue);if(ct991DiscoverWarm)return ct991DiscoverWarm;ct991DiscoverWarm=Promise.resolve(fetchDashboard991(false)).then(()=>recommendationData991()).then(v=>(ct991DiscoverValue=v,v)).finally(()=>{ct991DiscoverWarm=null});return ct991DiscoverWarm};\nwindow.addEventListener('cinetracker:data-changed',()=>{ct991DiscoverValue=null});`;
  if(!legacy.includes('window.__ct991PreloadDiscover=')) legacy=legacy.replace(router,exports);
  if(!legacy.includes('window.__ct991Preload=')||!legacy.includes('window.__ct991PreloadDiscover=')) throw new Error(`0.99.4 preload: legacy preload exports missing in ${legacyPath}`);
  await writeFile(legacyPath,legacy,'utf8');
}

console.log('CineTracker Web 0.99.4: preload de sessão/Home/Perfil/Descobrir e enquadramento desktop aplicados.');
