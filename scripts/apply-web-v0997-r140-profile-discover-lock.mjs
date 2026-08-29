import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const source=resolve(root,'dist','patch-v139-v0997-cache-buttons.js');
const name='patch-v140-v0997-profile-discover-lock.js';
let runtime=await readFile(source,'utf8');

runtime=runtime
  .replaceAll('__ct0997StablePrimary139Loaded','__ct0997StablePrimary140Loaded')
  .replaceAll('__ct0997StablePrimary139','__ct0997StablePrimary140')
  .replaceAll('r139-cache-buttons-primary','r140-profile-discover-lock')
  .replaceAll("'X-CT-Primary':'r139'","'X-CT-Primary':'r140'");

const cssAnchor='#ct136-profile [data-ct120-slot] .ct120-row>.ct120-card,#ct136-profile [data-ct120-slot="actors"] .ct120-actor{display:block!important}';
const cssNew=cssAnchor+'\n#ct136-profile [data-ct120-slot="actors"] .ct120-actors{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;gap:10px!important;align-items:stretch!important;scrollbar-width:thin;padding-bottom:4px}\n#ct136-profile [data-ct120-slot="actors"] .ct120-actors>.ct120-actor,#ct136-profile [data-ct120-slot="actors"] .ct120-actors>.ct136-more{display:block!important;flex:0 0 132px!important;min-width:132px!important;max-width:132px!important}\n#ct136-profile [data-ct120-slot="actors"] .ct136-more{min-height:170px!important}';
if(!runtime.includes(cssAnchor))throw new Error('r140: actor CSS anchor missing');
runtime=runtime.replace(cssAnchor,cssNew);

const discoverOld="async function renderDiscover(){prime('discover');const app=$('#app');if(!app)return;app.innerHTML=shell('Descobrir','Recomendações, tendências, novidades e calendário.','<div id=\"ct120-discover\" data-ct120-keep><div class=\"ct131-loading\">Preparando Descobrir…</div></div>','discover');await new Promise(r=>setTimeout(r,0));if(typeof window.__ct135RenderDiscover==='function')await window.__ct135RenderDiscover(true);if(typeof window.__ct135EnsureCalendar==='function')window.__ct135EnsureCalendar();for(const d of[300,900,1800,3600])setTimeout(async()=>{if(primaryKey()!=='discover')return;const h=$('#ct120-discover');if(h&&(!$('[data-ct131-tab=\"new\"]',h)||!$('[data-ct131d-calendar]',h))){if(typeof window.__ct135RenderDiscover==='function')await window.__ct135RenderDiscover(true);if(typeof window.__ct135EnsureCalendar==='function')window.__ct135EnsureCalendar()}},d)}";
const discoverNew="async function renderDiscover(){prime('discover');const app=$('#app');if(!app)return;app.innerHTML=shell('Descobrir','Recomendações, tendências, novidades e calendário.','<div id=\"ct120-discover\" data-ct120-keep data-ct140-owned=\"discover\"><div class=\"ct131-loading\">Preparando Descobrir…</div></div>','discover');await new Promise(r=>setTimeout(r,0));if(typeof window.__ct135RenderDiscover==='function')await window.__ct135RenderDiscover(true);if(typeof window.__ct135EnsureCalendar==='function')window.__ct135EnsureCalendar();const h=$('#ct120-discover');if(h)h.dataset.ct140Owned='discover'}";
if(!runtime.includes(discoverOld))throw new Error('r140: discover function anchor missing');
runtime=runtime.replace(discoverOld,discoverNew);

const surfaceOld="let surfaceObserver=null;function surfaceOk(key){const root=$('#app')?.firstElementChild;if(!root||root.dataset.ct136Page!==key)return false;const c=$('.content',root);if(!c)return false;if(key==='home')return Boolean($('#ct136-home',c));if(key==='profile')return Boolean($('#ct136-profile',c));if(key==='discover')return Boolean($('#ct120-discover',c));if(key==='settings')return norm($('h1',c)?.textContent||'').includes('config');return true}function watchSurface(key){surfaceObserver?.disconnect();const c=$('#app .content');if(!c)return;surfaceObserver=new MutationObserver(()=>{if(rendering||primaryKey()!==key)return;if(!surfaceOk(key))schedulePrimary(25)});surfaceObserver.observe(c,{childList:true})}";
const surfaceNew="let surfaceObserver=null,surfaceHostObserver=null;function surfaceOk(key){const root=$('#app')?.firstElementChild;if(!root||root.dataset.ct136Page!==key)return false;const c=$('.content',root);if(!c)return false;if(key==='home')return Boolean($('#ct136-home',c));if(key==='profile'){const h=$('#ct136-profile',c);return Boolean(h&&$('[data-ct120-slot=\"series\"]',h)&&$('[data-ct120-slot=\"movies\"]',h)&&$('[data-ct120-slot=\"series-favorites\"]',h)&&$('[data-ct120-slot=\"movie-favorites\"]',h)&&$('[data-ct120-slot=\"actors\"]',h)&&$('[data-ct136-profile-row=\"actors\"]',h))}if(key==='discover'){const h=$('#ct120-discover',c);return Boolean(h&&$('[data-ct131-tab=\"new\"]',h)&&$('[data-ct131d-calendar]',h))}if(key==='settings')return norm($('h1',c)?.textContent||'').includes('config');return true}function watchSurface(key){surfaceObserver?.disconnect();surfaceHostObserver?.disconnect();const c=$('#app .content');if(!c)return;const check=()=>{if(rendering||primaryKey()!==key)return;if(!surfaceOk(key))schedulePrimary(20)};surfaceObserver=new MutationObserver(check);surfaceObserver.observe(c,{childList:true});const host=key==='profile'?$('#ct136-profile',c):key==='discover'?$('#ct120-discover',c):null;if(host){surfaceHostObserver=new MutationObserver(check);surfaceHostObserver.observe(host,{childList:true})}}";
if(!runtime.includes(surfaceOld))throw new Error('r140: surface observer anchor missing');
runtime=runtime.replace(surfaceOld,surfaceNew);

const primaryOld="async function renderPrimary(key,{force=false}={}){if(!hasSession())return;surfaceObserver?.disconnect();rendering=true;try{if(key==='home')await renderHome(force);else if(key==='profile')await renderProfile(force);else if(key==='discover')await renderDiscover();else if(key==='settings')await renderSettings()}finally{rendering=false;watchSurface(key)}}";
const primaryNew="async function renderPrimary(key,{force=false}={}){if(!hasSession())return;surfaceObserver?.disconnect();surfaceHostObserver?.disconnect();rendering=true;try{if(key==='home')await renderHome(force);else if(key==='profile')await renderProfile(force);else if(key==='discover')await renderDiscover();else if(key==='settings')await renderSettings()}finally{rendering=false;watchSurface(key)}}";
if(!runtime.includes(primaryOld))throw new Error('r140: renderPrimary anchor missing');
runtime=runtime.replace(primaryOld,primaryNew);

for(const dir of dirs){
  const runtimePath=resolve(dir,name);
  await writeFile(runtimePath,runtime,'utf8');
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const oldTag='<script src="/patch-v139-v0997-cache-buttons.js"></script>';
  const tag=`<script src="/${name}"></script>`;
  html=html.replaceAll(tag,'').replaceAll(oldTag,'').replace('</body>',tag+'</body>');
  await writeFile(indexPath,html,'utf8');
  execFileSync(process.execPath,['--check',runtimePath],{stdio:'pipe'});
}

console.log('WEB_R140_APPLIED profile-actors=single-row-10+more discover=single-render surface-lock=profile+discover');
await import('./test-web-v0997-r140-profile-discover-lock.mjs');
