import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const distDirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const fluidName='patch-v113-v0994-fluidity.js';
const fluidSource=resolve(root,'apps/web',fluidName);
const homeScrollOld="requestAnimationFrame(()=>{const vp=$('#ct994-viewport',root),hist=$('.ct992-history',root);if(vp&&hist)vp.scrollTop=hist.offsetHeight});";
const homeScrollNew="{const vp=$('#ct994-viewport',root),hist=$('.ct992-history',root);if(vp&&hist){vp.style.visibility='hidden';vp.style.scrollBehavior='auto';const h=hist.offsetHeight;vp.scrollTop=h;void vp.offsetHeight;vp.style.visibility='visible';vp.dataset.ct994Anchored='1'}}";
const discoverOld="footer991();void fetchDashboard991().then(loadForYou991);return true}";
const discoverNew="footer991();if(dashboard991.length){void loadForYou991();void fetchDashboard991(true).then(()=>window.__ct991PersistProfile?.()).catch(e=>console.warn('[CineTracker 0.99.4] refresh Descobrir',e))}else void fetchDashboard991().then(()=>{window.__ct991PersistProfile?.();return loadForYou991()});return true}";

for(const dir of distDirs){
  const homePath=resolve(dir,'patch-v099-v0994-web.js');
  let home=await readFile(homePath,'utf8');
  if(!home.includes(homeScrollOld))throw new Error(`0.99.4 fluidity: Home scroll marker not found in ${homePath}`);
  home=home.replace(homeScrollOld,homeScrollNew);
  await writeFile(homePath,home,'utf8');

  const legacyPath=resolve(dir,'patch-v092-v0991.js');
  let legacy=await readFile(legacyPath,'utf8');
  const timeline=/function timeline991\(\)\{[\s\S]*?\}\nfunction openDay991/;
  if(!timeline.test(legacy))throw new Error(`0.99.4 fluidity: timeline marker not found in ${legacyPath}`);
  legacy=legacy.replace(timeline,"function timeline991(){return '<div id=\"ct113-activity-host\" class=\"ct113-activity-host\"></div>'}\nfunction openDay991");
  if(!legacy.includes(discoverOld))throw new Error(`0.99.4 fluidity: Discover render marker not found in ${legacyPath}`);
  legacy=legacy.replace(discoverOld,discoverNew);
  await writeFile(legacyPath,legacy,'utf8');

  await copyFile(fluidSource,resolve(dir,fluidName));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${fluidName.replaceAll('.','\\.')}"></script>`,'g'),'');
  const warmTag='<script src="/patch-v112-v0994-warm-boot.js"></script>';
  if(!html.includes(warmTag))throw new Error(`0.99.4 fluidity: v112 tag missing in ${indexPath}`);
  html=html.replace(warmTag,`${warmTag}<script src="/${fluidName}"></script>`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.4: navegação cache-first, Home ancorada sem rolagem e gráfico de atividade v113 aplicados.');
