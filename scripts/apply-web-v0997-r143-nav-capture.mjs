import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const navName='patch-v143-v0997-nav-gate.js';
const navSource=resolve(root,'apps/web',navName);
const sourceName='patch-v142-v0997-primary-router.js';
const runtimeName='patch-v143-v0997-primary-router.js';
const must=(ok,msg)=>{if(!ok)throw new Error('r143: '+msg)};

for(const dir of dirs){
  await copyFile(navSource,resolve(dir,navName));
  execFileSync(process.execPath,['--check',resolve(dir,navName)],{stdio:'pipe'});

  let runtime=await readFile(resolve(dir,sourceName),'utf8');
  runtime=runtime
    .replaceAll('__ct0997StablePrimary142Loaded','__ct0997StablePrimary143Loaded')
    .replaceAll('__ct0997StablePrimary142','__ct0997StablePrimary143')
    .replaceAll('r142-route-freeze-primary','r143-nav-capture-primary')
    .replaceAll("'X-CT-Primary':'r142'","'X-CT-Primary':'r143'");

  const profileCacheOld="if(!profileData){profileData=readPrimaryCache('profile');if(profileData)profileAt=0}";
  const profileCacheNew="if(!profileData){const preloaded=window.__ct0997PreloadedProfile;profileData=preloaded||readPrimaryCache('profile');if(profileData)profileAt=preloaded?Date.now():0}";
  must(runtime.includes(profileCacheOld),'profile cache anchor missing');
  runtime=runtime.replace(profileCacheOld,profileCacheNew);

  const profileFetchOld="profileData=await rpcDirect('cinetracker_profile_payload_v0997',{p_tz:tz});profileAt=Date.now();writePrimaryCache('profile',profileData)";
  const profileFetchNew="const loadProfile=window.__ct0997PersistentPreloadRpc||rpcDirect;profileData=await loadProfile('cinetracker_profile_payload_v0997',{p_tz:tz});profileAt=Date.now();writePrimaryCache('profile',profileData)";
  must(runtime.includes(profileFetchOld),'profile preload fetch anchor missing');
  runtime=runtime.replace(profileFetchOld,profileFetchNew);

  const settingsOld="async function renderSettings(){prime('settings');let fn=window.__ct0994Navigate;try{if(typeof fn==='function')await Promise.race([Promise.resolve(fn('settings')),new Promise(r=>setTimeout(r,1400))])}catch{}let ok=()=>norm($('.content h1')?.textContent||'').includes('config')&&Boolean($('.ct91-settings'));if(!ok()){const raw=fn?.__ct120Raw;try{if(typeof raw==='function')await Promise.race([Promise.resolve(raw('settings')),new Promise(r=>setTimeout(r,1400))])}catch{}}if(ok()){const root=$('#app .app');if(root){root.dataset.ct136Page='settings';root.dataset.ct120Route='settings'}normalizeExistingNav('settings');return}const app=$('#app');if(app)app.innerHTML=shell('Configurações','Preferências, conta, importação e exportação.','<div class=\"ct120-error\">Não foi possível montar Configurações pelo runtime legado. Tente novamente.</div>','settings')}";
  const settingsNew="async function renderSettings(){prime('settings');if(primaryKey()!=='settings')return;let fn=window.__ct0994Navigate;try{if(typeof fn==='function')await Promise.race([Promise.resolve(fn('settings')),new Promise(r=>setTimeout(r,1400))])}catch{}if(primaryKey()!=='settings'){schedulePrimary(0);return}let ok=()=>norm($('.content h1')?.textContent||'').includes('config')&&Boolean($('.ct91-settings'));if(!ok()){const raw=fn?.__ct120Raw;try{if(typeof raw==='function')await Promise.race([Promise.resolve(raw('settings')),new Promise(r=>setTimeout(r,1400))])}catch{}}if(primaryKey()!=='settings'){schedulePrimary(0);return}if(ok()){const root=$('#app .app');if(root){root.dataset.ct136Page='settings';root.dataset.ct120Route='settings'}normalizeExistingNav('settings');return}const app=$('#app');if(app&&primaryKey()==='settings')app.innerHTML=shell('Configurações','Preferências, conta, importação e exportação.','<div class=\"ct120-error\">Não foi possível montar Configurações pelo runtime legado. Tente novamente.</div>','settings')}";
  must(runtime.includes(settingsOld),'settings renderer anchor missing');
  runtime=runtime.replace(settingsOld,settingsNew);

  const primaryOld="async function renderPrimary(key,{force=false}={}){if(!hasSession())return;surfaceObserver?.disconnect();surfaceHostObserver?.disconnect();rendering=true;try{if(key==='home')await renderHome(force);else if(key==='profile')await renderProfile(force);else if(key==='discover')await renderDiscover();else if(key==='settings')await renderSettings()}finally{rendering=false;if(key==='settings')document.documentElement.classList.remove('ct-primary-boot');watchSurface(key)}}";
  const primaryNew="let primaryRenderSeq=0;async function renderPrimary(key,{force=false}={}){if(!hasSession())return;const seq=++primaryRenderSeq;surfaceObserver?.disconnect();surfaceHostObserver?.disconnect();rendering=true;try{if(key==='home')await renderHome(force);else if(key==='profile')await renderProfile(force);else if(key==='discover')await renderDiscover();else if(key==='settings')await renderSettings()}finally{if(seq!==primaryRenderSeq)return;rendering=false;if(key==='settings')document.documentElement.classList.remove('ct-primary-boot');watchSurface(key)}}";
  must(runtime.includes(primaryOld),'renderPrimary sequence anchor missing');
  runtime=runtime.replace(primaryOld,primaryNew);

  const observerOld="const app=$('#app');if(app)new MutationObserver(()=>{if(rendering)return;const k=primaryKey();if(!k)return;const root=app.firstElementChild;if(!root||root.dataset.ct136Page!==k)schedulePrimary(60)}).observe(app,{childList:true});";
  const observerNew="function domPrimaryKey(root){const h=norm($('.content h1',root)?.textContent||'');if(h.includes('descobrir'))return'discover';if(h.includes('perfil'))return'profile';if(h.includes('config'))return'settings';if(h==='home'||h.includes('home'))return'home';return''}function syncPrimaryNav(key){const root=$('#app')?.firstElementChild;if(!root||root.dataset.ct136Page!==key)return;root.dataset.ct120Route=key;for(const nav of $$('.sidebar .nav,.mobile-nav',root)){for(const el of $$(':scope > a,:scope > button',nav)){const nk=navTarget(el);if(!nk)continue;const on=nk===key;el.classList.toggle('active',on);if(on){el.setAttribute('aria-current','page');el.dataset.ct130Primary='1'}else{el.removeAttribute('aria-current');delete el.dataset.ct130Primary}}}}const app=$('#app');if(app)new MutationObserver(()=>{const k=primaryKey();if(!k)return;const root=app.firstElementChild,shown=root?domPrimaryKey(root):'';if(!root||root.dataset.ct136Page!==k||(shown&&shown!==k)){schedulePrimary(0);return}syncPrimaryNav(k)}).observe(app,{childList:true,subtree:true});";
  must(runtime.includes(observerOld),'primary DOM observer anchor missing');
  runtime=runtime.replace(observerOld,observerNew);

  const popOld="window.addEventListener('popstate',()=>{const k=primaryKey();if(k)void renderPrimary(k)});";
  const popNew="window.addEventListener('cinetracker:primary-nav',e=>{const k=String(e?.detail?.key||'');if(['home','discover','profile','settings'].includes(k))void renderPrimary(k,{force:false})});\nwindow.addEventListener('popstate',()=>{const k=primaryKey();if(k)void renderPrimary(k)});";
  must(runtime.includes(popOld),'popstate anchor missing');
  runtime=runtime.replace(popOld,popNew);

  const tail='})();';
  const pos=runtime.lastIndexOf(tail);must(pos>0,'runtime tail missing');
  const guard=`\nconst __ct143LegacyNavigate=window.__ct0994Navigate;\nwindow.__ct0994Navigate=(target,...args)=>{\n  const t=String(target||'home').replace('history','profile');\n  if(['home','discover','profile'].includes(t))return Promise.resolve(true);\n  if(t==='settings'){if(primaryKey()!=='settings')return Promise.resolve(true);return typeof __ct143LegacyNavigate==='function'?__ct143LegacyNavigate('settings',...args):Promise.resolve(false)}\n  return typeof __ct143LegacyNavigate==='function'?__ct143LegacyNavigate(target,...args):Promise.resolve(false);\n};\nwindow.__ct143RenderPrimary=(key,force=false)=>renderPrimary(key,{force});\n`;
  runtime=runtime.slice(0,pos)+guard+runtime.slice(pos);
  await writeFile(resolve(dir,runtimeName),runtime,'utf8');
  execFileSync(process.execPath,['--check',resolve(dir,runtimeName)],{stdio:'pipe'});

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const navTag=`<script src="/${navName}"></script>`;
  html=html.replaceAll(navTag,'');
  must(html.includes('<body>'),'body anchor missing');
  html=html.replace('<body>','<body>'+navTag);
  for(const old of [sourceName,runtimeName])html=html.replaceAll(`<script src="/${old}"></script>`,'');
  html=html.replace('</body>',`<script src="/${runtimeName}"></script></body>`);
  await writeFile(indexPath,html,'utf8');
}

console.log('WEB_R143_APPLIED nav=early-capture viewport=shared-responsive route=dom-locked profile=persistent-snapshot settings=nonsticky');
await import('./test-web-v0997-r143-nav-capture.mjs');
