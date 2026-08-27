import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
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

  const legacyPath=resolve(target,legacyName);
  let legacy=await readFile(legacyPath,'utf8');
  const profileFrom='try{await fetchDashboard991(true);renderProfileBody991()}';
  const profileTo='try{await fetchDashboard991(false);renderProfileBody991()}';
  if(legacy.includes(profileFrom)) legacy=legacy.replace(profileFrom,profileTo);
  const forYouFrom='const r=await recommendationData991();';
  const forYouTo='const r=await (window.__ct991PreloadDiscover?window.__ct991PreloadDiscover():recommendationData991());';
  if(legacy.includes(forYouFrom)) legacy=legacy.replace(forYouFrom,forYouTo);
  const router='window.ct991Navigate=navigate991;window.ct98Navigate=navigate991;';
  const exports=`${router}\nlet ct991DiscoverWarm=null,ct991DiscoverValue=null;\nwindow.__ct991Preload=()=>fetchDashboard991(false);\nwindow.__ct991PreloadDiscover=()=>{if(ct991DiscoverValue)return Promise.resolve(ct991DiscoverValue);if(ct991DiscoverWarm)return ct991DiscoverWarm;ct991DiscoverWarm=Promise.resolve(fetchDashboard991(false)).then(()=>recommendationData991()).then(v=>(ct991DiscoverValue=v,v)).finally(()=>{ct991DiscoverWarm=null});return ct991DiscoverWarm};\nwindow.addEventListener('cinetracker:data-changed',()=>{ct991DiscoverValue=null});`;
  if(!legacy.includes('window.__ct991PreloadDiscover=')) legacy=legacy.replace(router,exports);
  await writeFile(legacyPath,legacy,'utf8');
}

console.log('CineTracker Web 0.99.4: preload autenticado e enquadramento desktop aplicados.');
