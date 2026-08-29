import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const gateName='patch-v142-v0997-boot-gate.js';
const gateSource=resolve(root,'apps/web',gateName);
const sourceName='patch-v140-v0997-profile-discover-lock.js';
const runtimeName='patch-v142-v0997-primary-router.js';

function must(ok,msg){if(!ok)throw new Error('r142: '+msg)}

for(const dir of dirs){
  const gatePath=resolve(dir,gateName);
  await copyFile(gateSource,gatePath);
  execFileSync(process.execPath,['--check',gatePath],{stdio:'pipe'});

  // A autoridade visual r140 já possui o layout correto. r142 só congela a rota
  // e impede que o HTML antigo apareça antes dela.
  let runtime=await readFile(resolve(dir,sourceName),'utf8');
  runtime=runtime
    .replaceAll('__ct0997StablePrimary140Loaded','__ct0997StablePrimary142Loaded')
    .replaceAll('__ct0997StablePrimary140','__ct0997StablePrimary142')
    .replaceAll('r140-profile-discover-lock','r142-route-freeze-primary')
    .replaceAll("'X-CT-Primary':'r140'","'X-CT-Primary':'r142'");

  const shellAnchor="function shell(title,subtitle,body,active,{keep120=true}={}){return `";
  must(runtime.includes(shellAnchor),'shell anchor missing');
  runtime=runtime.replace(shellAnchor,"function shell(title,subtitle,body,active,{keep120=true}={}){document.documentElement.classList.remove('ct-primary-boot');return `");

  const primaryAnchor="finally{rendering=false;watchSurface(key)}}";
  must(runtime.includes(primaryAnchor),'renderPrimary finalizer missing');
  runtime=runtime.replace(primaryAnchor,"finally{rendering=false;if(key==='settings')document.documentElement.classList.remove('ct-primary-boot');watchSurface(key)}}");
  must(runtime.includes("'X-CT-Primary':'r142'"),'r142 primary header missing');
  await writeFile(resolve(dir,runtimeName),runtime,'utf8');
  execFileSync(process.execPath,['--check',resolve(dir,runtimeName)],{stdio:'pipe'});

  // Discover r134a continua fornecendo o renderer que r142 chama diretamente,
  // mas não pode mais observar #app, aquecer abas ou redesenhar sozinho.
  const discoverPath=resolve(dir,'patch-v134a-v0997-discover-final.js');
  let discover=await readFile(discoverPath,'utf8');
  const autoDiscover=discover.indexOf("const app=$('#app');if(app){observer=new MutationObserver");
  must(autoDiscover>0,'r134a autonomous observer block missing');
  discover=discover.slice(0,autoDiscover)+
`window.addEventListener('cinetracker:data-changed',()=>{cache.clear()});
window.addEventListener('cinetracker:auth-state-change',()=>{cache.clear();warmKey=''});
window.__ct135RenderDiscover=renderDiscover;
window.__ct135EnsureDiscover=ensureDiscover;
})();
`;
  await writeFile(discoverPath,discover,'utf8');
  execFileSync(process.execPath,['--check',discoverPath],{stdio:'pipe'});

  // r134b permanece apenas como biblioteca de Calendário/repairs. Nenhum timer,
  // load handler ou clique de navegação pode acordá-lo autonomamente.
  const livePath=resolve(dir,'patch-v134b-v0997-live-home-calendar.js');
  let live=await readFile(livePath,'utf8');
  const autoLive=live.indexOf("document.addEventListener('click',e=>{if(e.target.closest?.('[data-ct131-tab]'))calendarActive=false;");
  must(autoLive>0,'r134b autonomous schedule block missing');
  live=live.slice(0,autoLive)+
`document.addEventListener('click',e=>{const tab=e.target.closest?.('[data-ct131-tab]');if(tab&&!tab.matches('[data-ct131d-calendar]'))calendarActive=false},true);
window.addEventListener('cinetracker:data-changed',()=>{liveHomeData=null;liveHomeBusy=null;liveAt=0;calendarGeneral=null;calendarWatch=null;movieLimit=120});
window.__ct135RepairHome=repairHome;
window.__ct135RepairProfile=repairProfile;
window.__ct135EnsureCalendar=ensureCalendar;
window.__ct135RenderCalendar=renderCalendar;
})();
`;
  await writeFile(livePath,live,'utf8');
  execFileSync(process.execPath,['--check',livePath],{stdio:'pipe'});

  // r134c continua dono apenas de deep links e do renderer legado de Configurações.
  // Home/Descobrir/Perfil não podem mais nem mudar a URL quando um timer antigo
  // chamar __ct0994Navigate.
  const routesPath=resolve(dir,'patch-v134c-v0997-deeplink-details.js');
  let routes=await readFile(routesPath,'utf8');
  const oldPrimary="async function renderPrimary(key){if(window.__ct0997StablePrimary137Loaded)return false;";
  const newPrimary="async function renderPrimary(key){if(window.__ct0997StablePrimary137Loaded&&key!=='settings')return false;";
  must(routes.includes(oldPrimary),'r134c primary guard missing');
  routes=routes.replace(oldPrimary,newPrimary);

  const oldNavigate="window.__ct0994Navigate=(target,...args)=>{const t=String(target||'home').replace('history','profile');if(['home','discover','profile','settings'].includes(t)){void go(primaryPath(t));return Promise.resolve(true)}return oldNavigate?oldNavigate(target,...args):Promise.resolve(false)};";
  const newNavigate="window.__ct0994Navigate=(target,...args)=>{const t=String(target||'home').replace('history','profile');if(window.__ct0997StablePrimary137Loaded&&['home','discover','profile'].includes(t))return Promise.resolve(true);if(['home','discover','profile','settings'].includes(t)){void go(primaryPath(t));return Promise.resolve(true)}return oldNavigate?oldNavigate(target,...args):Promise.resolve(false)};";
  must(routes.includes(oldNavigate),'r134c navigate override missing');
  routes=routes.replace(oldNavigate,newNavigate);
  await writeFile(routesPath,routes,'utf8');
  execFileSync(process.execPath,['--check',routesPath],{stdio:'pipe'});

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  for(const old of ['patch-v141-v0997-boot-gate.js','patch-v138-v0997-network-gate.js'])html=html.replaceAll(`<script src="/${old}"></script>`,'');
  const gateTag=`<script src="/${gateName}"></script>`;
  html=html.replaceAll(gateTag,'');
  must(html.includes('<body>'),'body anchor missing');
  html=html.replace('<body>','<body>'+gateTag);

  for(const old of [sourceName,runtimeName])html=html.replaceAll(`<script src="/${old}"></script>`,'');
  const runtimeTag=`<script src="/${runtimeName}"></script>`;
  html=html.replace('</body>',runtimeTag+'</body>');
  await writeFile(indexPath,html,'utf8');
}

console.log('WEB_R142_APPLIED boot=hidden-until-primary nav=home+discover+profile-frozen configs=legacy-only discover=manual-only calendar=manual-only');
await import('./test-web-v0997-r142-route-freeze.mjs');
