import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const discoverName='patch-v134a-v0997-discover-final.js';
const liveName='patch-v134b-v0997-live-home-calendar.js';
const routesName='patch-v134c-v0997-deeplink-details.js';
const authorityName='patch-v135-v0997-final-primary-authority.js';

function expose(js,lines,label){
  if(lines.every(x=>js.includes(x)))return js;
  if(!/\n\}\)\(\);\s*$/.test(js))throw new Error(`r135: ${label} closure end not found`);
  return js.replace(/\n\}\)\(\);\s*$/,`\n${lines.join('\n')}\n})();\n`);
}

const authority=`(() => {
'use strict';
if(window.__ct0997FinalAuthority135Loaded)return;
window.__ct0997FinalAuthority135Loaded=true;
window.__ct0997FinalAuthority135='r135-primary-renders-survive-legacy';
const $=(s,r=document)=>r?.querySelector?.(s)||null;
const $$=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let timer=0,busy=false,configAttempts=0;
function pathKey(){let p=String(location.pathname||'/').replace(/\\/+$/,'')||'/';if(p==='/settings')p='/configs';return p}
function schedule(ms=45){clearTimeout(timer);timer=setTimeout(()=>void settle(),ms)}
function profileNeedsRepair(){const host=$('#ct120-profile');if(!host)return true;if($('.ct126-more',host))return true;for(const slot of ['series','movies','series-favorites','movie-favorites']){const row=$('[data-ct120-slot="'+slot+'"] .ct120-row,[data-ct120-slot="'+slot+'"] .ct118-row',host);if(!row)continue;const cards=$$('.ct120-card,.ct118-card',row);if(cards.length>4&&!row.classList.contains('ct132-profile-preview'))return true}const actors=$('[data-ct120-slot="actors"] .ct120-actors,[data-ct120-slot="actors"] .ct118-actors',host);if(actors){const cards=$$('.ct120-actor,.ct118-actor,.ct118-person',actors);if(cards.length>10&&!$('.ct132-more-card',actors))return true}return false}
async function ensureDiscover(){let host=$('#ct120-discover');if(!host&&typeof window.__ct135RenderPrimary==='function'){await window.__ct135RenderPrimary('discover');host=$('#ct120-discover')}if(!host)return;const good=$('.ct131-discover',host)&&$('[data-ct131-tab="new"]',host);if(!good&&typeof window.__ct135RenderDiscover==='function')await window.__ct135RenderDiscover(true);if(typeof window.__ct135EnsureCalendar==='function')window.__ct135EnsureCalendar()}
async function ensureProfile(){let host=$('#ct120-profile');if(!host&&typeof window.__ct135RenderPrimary==='function'){await window.__ct135RenderPrimary('profile');host=$('#ct120-profile')}if(host&&typeof window.__ct135EnhanceProfile==='function')window.__ct135EnhanceProfile()}
async function ensureConfigs(){const dom=$('#ct120-page')?.dataset?.ct120Route||'',h=norm($('.content h1')?.textContent||'');if(dom==='settings'&&h.includes('config')){configAttempts=0;return}if(configAttempts>=3)return;configAttempts++;if(typeof window.__ct135RenderPrimary==='function')await window.__ct135RenderPrimary('settings')}
async function ensureHome(){if($('#ct994-home-root')&&typeof window.__ct135RepairHome==='function')await window.__ct135RepairHome(false)}
async function settle(){if(busy)return;busy=true;try{const p=pathKey();if(p==='/discover')await ensureDiscover();else if(p==='/profile')await ensureProfile();else if(p==='/configs')await ensureConfigs();else if(p==='/'||p==='/home')await ensureHome()}catch(e){console.error('[r135] authority',e)}finally{busy=false}}
const app=$('#app');if(app){new MutationObserver(()=>{const p=pathKey();if(p==='/discover'){const host=$('#ct120-discover');if(host&&(!$('.ct131-discover',host)||!$('[data-ct131-tab="new"]',host)||!$('[data-ct131d-calendar]',host)))schedule(50)}else if(p==='/profile'){if(profileNeedsRepair())schedule(50)}else if(p==='/configs'){const dom=$('#ct120-page')?.dataset?.ct120Route||'',h=norm($('.content h1')?.textContent||'');if(dom!=='settings'||h.includes('perfil'))schedule(90)}}, {childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']}).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']})}
document.addEventListener('click',e=>{const nav=e.target.closest?.('[data-ct120-nav],.sidebar a,.sidebar button,.mobile-nav a,.mobile-nav button');if(nav){configAttempts=0;for(const d of[70,260,700])setTimeout(()=>schedule(0),d)}const homeTab=e.target.closest?.('[data-ct994-tab],.ct992-tab');if(homeTab){for(const d of[90,300,800])setTimeout(()=>{if(pathKey()==='/home'&&typeof window.__ct135RepairHome==='function')void window.__ct135RepairHome(false)},d)}},true);
window.addEventListener('popstate',()=>{configAttempts=0;schedule(80)});
window.addEventListener('cinetracker:data-changed',()=>schedule(100));
window.addEventListener('focus',()=>schedule(120));
for(const d of[0,120,420,1200,3000])setTimeout(()=>schedule(0),d);
})();
`;

for(const dir of dirs){
  let discover=await readFile(resolve(dir,discoverName),'utf8');
  let live=await readFile(resolve(dir,liveName),'utf8');
  let routes=await readFile(resolve(dir,routesName),'utf8');
  discover=expose(discover,['window.__ct135RenderDiscover=renderDiscover;','window.__ct135EnsureDiscover=ensureDiscover;'],discoverName);
  live=expose(live,['window.__ct135RepairHome=repairHome;','window.__ct135RepairProfile=repairProfile;','window.__ct135EnsureCalendar=ensureCalendar;','window.__ct135RenderCalendar=renderCalendar;'],liveName);
  routes=expose(routes,['window.__ct135RenderPrimary=renderPrimary;','window.__ct135EnhanceProfile=enhanceProfilePreview;','window.__ct135Go=go;'],routesName);
  await writeFile(resolve(dir,discoverName),discover,'utf8');
  await writeFile(resolve(dir,liveName),live,'utf8');
  await writeFile(resolve(dir,routesName),routes,'utf8');

  const v120Path=resolve(dir,'patch-v120-v0997-structural-authority.js');
  let v120=await readFile(v120Path,'utf8');
  v120=v120.replace("function hardClean120(){const r=routeFromDom120();","function hardClean120(){const r=routeFromDom120();if(window.__ct0997FinalAuthority135Loaded&&(r==='profile'||r==='discover'))return;");
  v120=v120.replace("window.addEventListener('cinetracker:data-changed',()=>{profileData120=null;discoverData120=null;","window.addEventListener('cinetracker:data-changed',()=>{profileData120=null;discoverData120=null;if(window.__ct0997FinalAuthority135Loaded)return;");
  await writeFile(v120Path,v120,'utf8');

  const v126Path=resolve(dir,'patch-v126-v0997-video3124-recovery.js');
  let v126=await readFile(v126Path,'utf8');
  v126=v126.replace("function cleanupProfile(){if(route()!=='profile')return;","function cleanupProfile(){if(window.__ct0997FinalAuthority135Loaded)return;if(route()!=='profile')return;");
  v126=v126.replace("function cleanupDiscover(){if(route()!=='discover')return;","function cleanupDiscover(){if(window.__ct0997FinalAuthority135Loaded)return;if(route()!=='discover')return;");
  await writeFile(v126Path,v126,'utf8');

  await writeFile(resolve(dir,authorityName),authority,'utf8');
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${authorityName}"></script>`;
  html=html.replaceAll(tag,'').replace('</body>',`${tag}</body>`);
  await writeFile(indexPath,html,'utf8');
}

console.log('WEB_R135_APPLIED primary-authority=survives-legacy home=r2-direct profile=10 discover=Novidades+Calendar configs=route-repair');
await import('./test-web-v0997-r135-final-authority.mjs');
