import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const gateName='patch-v138-v0997-network-gate.js';
const gateSource=resolve(root,'apps/web',gateName);
const source=resolve(root,'dist','patch-v137-v0997-single-primary.js');
const name='patch-v138-v0997-resilient-primary.js';
let runtime=await readFile(source,'utf8');
runtime=runtime
  .replaceAll('__ct0997StablePrimary137Loaded','__ct0997StablePrimary138Loaded')
  .replaceAll('__ct0997StablePrimary137','__ct0997StablePrimary138')
  .replaceAll('r137-single-primary-no-legacy-prime','r138-resilient-single-primary');

const rpcOld="headers:{...auth(),'Content-Type':'application/json'}";
const rpcNew="headers:{...auth(),'Content-Type':'application/json','X-CT-Primary':'r138'}";
if(!runtime.includes(rpcOld))throw new Error('r138: rpcDirect headers anchor missing');
runtime=runtime.replace(rpcOld,rpcNew);

const cacheAnchor='const primed=new Map();';
const cacheHelpers=`const PRIMARY_CACHE_TTL=10*60*1000;\nfunction readPrimaryCache(key){try{const x=JSON.parse(sessionStorage.getItem('ct138:'+key)||'null');return x&&Date.now()-Number(x.at||0)<PRIMARY_CACHE_TTL?x.value:null}catch{return null}}\nfunction writePrimaryCache(key,value){try{if(value)sessionStorage.setItem('ct138:'+key,JSON.stringify({at:Date.now(),value}))}catch{}}`;
if(!runtime.includes(cacheAnchor))throw new Error('r138: cache anchor missing');
runtime=runtime.replace(cacheAnchor,cacheAnchor+'\n'+cacheHelpers);

const homeStart="async function renderHome(force=false){prime('home');const app=$('#app');if(!app)return;app.innerHTML=shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','<div class=\"ct992-shell\" id=\"ct136-home\"><div class=\"ct992-empty\">Sincronizando Home…</div></div>','home');try{";
const homeNew="async function renderHome(force=false){prime('home');const app=$('#app');if(!app)return;if(!homeData){homeData=readPrimaryCache('home');if(homeData)homeAt=Date.now()}app.innerHTML=shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','<div class=\"ct992-shell\" id=\"ct136-home\"><div class=\"ct992-empty\">Sincronizando Home…</div></div>','home');if(homeData)paintHome();try{";
if(!runtime.includes(homeStart))throw new Error('r138: renderHome start anchor missing');
runtime=runtime.replace(homeStart,homeNew);
runtime=runtime.replace("homeData=await rpcDirect('cinetracker_home_live_v0997_r2',{});homeAt=Date.now()","homeData=await rpcDirect('cinetracker_home_live_v0997_r2',{});homeAt=Date.now();writePrimaryCache('home',homeData)");
runtime=runtime.replace("}catch(e){const r=$('#ct136-home');if(r)r.innerHTML=`<div class=\"ct992-empty\">Falha ao sincronizar Home: ${esc(e?.message||e)}</div>`}}","}catch(e){if(homeData&&$('#ct136-home')){paintHome();return}const r=$('#ct136-home');if(r)r.innerHTML=`<div class=\"ct992-empty\">Falha ao sincronizar Home: ${esc(e?.message||e)}</div>`}}" );

const profileStart="async function renderProfile(force=false){prime('profile');const app=$('#app');if(!app)return;app.innerHTML=shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','<div id=\"ct136-profile\"><div class=\"ct120-loading\">Preparando Perfil…</div></div>','profile');try{";
const profileNew="async function renderProfile(force=false){prime('profile');const app=$('#app');if(!app)return;if(!profileData){profileData=readPrimaryCache('profile');if(profileData)profileAt=Date.now()}app.innerHTML=shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','<div id=\"ct136-profile\"><div class=\"ct120-loading\">Preparando Perfil…</div></div>','profile');if(profileData)paintProfile(profileData);try{";
if(!runtime.includes(profileStart))throw new Error('r138: renderProfile start anchor missing');
runtime=runtime.replace(profileStart,profileNew);
runtime=runtime.replace("profileData=await rpcDirect('cinetracker_profile_payload_v0997',{p_tz:tz});profileAt=Date.now()","profileData=await rpcDirect('cinetracker_profile_payload_v0997',{p_tz:tz});profileAt=Date.now();writePrimaryCache('profile',profileData)");
runtime=runtime.replace("}catch(e){const h=$('#ct136-profile');if(h)h.innerHTML=`<div class=\"ct120-error\">Falha ao carregar Perfil: ${esc(e?.message||e)}</div>`}}","}catch(e){if(profileData&&$('#ct136-profile')){paintProfile(profileData);return}const h=$('#ct136-profile');if(h)h.innerHTML=`<div class=\"ct120-error\">Falha ao carregar Perfil: ${esc(e?.message||e)}</div>`}}" );

const primaryOld="async function renderPrimary(key,{force=false}={}){if(!hasSession())return;rendering=true;try{if(key==='home')await renderHome(force);else if(key==='profile')await renderProfile(force);else if(key==='discover')await renderDiscover();else if(key==='settings')await renderSettings()}finally{rendering=false}}";
const primaryNew="let surfaceObserver=null;function surfaceOk(key){const root=$('#app')?.firstElementChild;if(!root||root.dataset.ct136Page!==key)return false;const c=$('.content',root);if(!c)return false;if(key==='home')return Boolean($('#ct136-home',c));if(key==='profile')return Boolean($('#ct136-profile',c));if(key==='discover')return Boolean($('#ct120-discover',c));if(key==='settings')return norm($('h1',c)?.textContent||'').includes('config');return true}function watchSurface(key){surfaceObserver?.disconnect();const c=$('#app .content');if(!c)return;surfaceObserver=new MutationObserver(()=>{if(rendering||primaryKey()!==key)return;if(!surfaceOk(key))schedulePrimary(25)});surfaceObserver.observe(c,{childList:true})}async function renderPrimary(key,{force=false}={}){if(!hasSession())return;surfaceObserver?.disconnect();rendering=true;try{if(key==='home')await renderHome(force);else if(key==='profile')await renderProfile(force);else if(key==='discover')await renderDiscover();else if(key==='settings')await renderSettings()}finally{rendering=false;watchSurface(key)}}";
if(!runtime.includes(primaryOld))throw new Error('r138: renderPrimary anchor missing');
runtime=runtime.replace(primaryOld,primaryNew);

for(const dir of dirs){
  await copyFile(gateSource,resolve(dir,gateName));
  const runtimePath=resolve(dir,name);await writeFile(runtimePath,runtime,'utf8');
  const indexPath=resolve(dir,'index.html');let html=await readFile(indexPath,'utf8');
  const gateTag=`<script src=\"/${gateName}\"></script>`;
  const runtimeTag=`<script src=\"/${name}\"></script>`;
  html=html.replaceAll(gateTag,'').replaceAll(runtimeTag,'').replaceAll('<script src="/patch-v137-v0997-single-primary.js"></script>','');
  if(!html.includes('<body>'))throw new Error('r138: body anchor missing');
  html=html.replace('<body>','<body>'+gateTag);
  html=html.replace('</body>',runtimeTag+'</body>');
  await writeFile(indexPath,html,'utf8');
  execFileSync(process.execPath,['--check',resolve(dir,gateName)],{stdio:'pipe'});
  execFileSync(process.execPath,['--check',runtimePath],{stdio:'pipe'});
}
console.log('WEB_R138_APPLIED early-network-gate heavy=serialized legacy-heavy=suppressed primary-cache=stale-safe content-observer=shallow');
await import('./test-web-v0997-r138-network-gate.mjs');
