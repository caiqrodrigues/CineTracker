import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const distDirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const fluidName='patch-v113-v0994-fluidity.js';
const fluidSource=resolve(root,'apps/web',fluidName);
const homeScrollOld="requestAnimationFrame(()=>{const vp=$('#ct994-viewport',root),hist=$('.ct992-history',root);if(vp&&hist)vp.scrollTop=hist.offsetHeight});";
const homeScrollNew="{const vp=$('#ct994-viewport',root),hist=$('.ct992-history',root);if(vp&&hist){vp.style.visibility='hidden';vp.style.scrollBehavior='auto';const h=hist.offsetHeight;vp.scrollTop=h;void vp.offsetHeight;vp.style.visibility='visible';vp.dataset.ct994Anchored='1'}}";

function replaceRange(source,startMarker,endMarker,replacement,label){const start=source.indexOf(startMarker),end=source.indexOf(endMarker,start);if(start<0||end<0||end<=start)throw new Error(`0.99.4 fluidity: ${label} markers not found`);return source.slice(0,start)+replacement+'\n'+source.slice(end)}

async function loadForYou991(){
  const host=$991('#ct991-discover-results');if(!host)return;
  if(!window.__ct991HasForYouCache?.())host.innerHTML='<div class="ct991-empty">Carregando recomendações…</div>';
  try{
    const r=await recommendationData991(),f=discover991.filter||'all';
    let daily=r.daily,watch=[r.wm,r.wt,r.wa],fresh=[r.fm,r.ft,r.fa];
    if(f==='movie'){daily=r.wm||r.fm;watch=[r.wm];fresh=[r.fm]}
    else if(f==='tv'){daily=r.wt||r.wa||r.ft||r.fa;watch=[r.wt,r.wa];fresh=[r.ft,r.fa]}
    host.innerHTML=`<div class="ct991-rec"><section class="ct991-rec-section"><h3>Indicação geral da Watchlist</h3><div class="ct991-rec-grid one">${recSlot991(daily)}</div></section><section class="ct991-rec-section"><h3>Da Watchlist</h3><div class="ct991-rec-grid">${watch.map(recSlot991).join('')}</div></section><section class="ct991-rec-section"><h3>100% Novos</h3><div class="ct991-rec-grid">${fresh.map(recSlot991).join('')}</div></section></div>`;bindMedia991(host)
  }catch(e){host.innerHTML=`<div class="ct991-empty">Falha ao carregar Pra Você: ${esc991(e?.message||e)}</div>`}
}

async function loadDiscover991(){
  const host=$991('#ct991-discover-results'),controls=$991('#ct991-discover-controls');if(!host)return;
  $$991('[data-dtab991]').forEach(b=>b.classList.toggle('active',b.dataset.dtab991===discover991.tab));
  if(discover991.tab==='foryou'){controls.innerHTML=discoverFilters991();bindDiscoverFilters991();return loadForYou991()}
  if(discover991.tab==='calendar')return loadCalendar991();
  controls.innerHTML=discoverFilters991();bindDiscoverFilters991();
  if(!window.__ct991HasMixedCache?.(discover991.tab))host.innerHTML='<div class="ct991-empty">Carregando…</div>';
  try{const rows=await mixedRows991(discover991.tab);host.innerHTML=rows.length?`<div class="ct991-media-grid">${rows.slice(0,40).map(mediaCard991).join('')}</div>`:'<div class="ct991-empty">Nenhum título encontrado.</div>';bindMedia991(host)}catch(e){host.innerHTML=`<div class="ct991-empty">Falha ao carregar Descobrir: ${esc991(e?.message||e)}</div>`}
}

function renderDiscover991(){
  setView991('discover');
  if(!['foryou','trending','anticipated','top','calendar'].includes(discover991.tab))discover991.tab='foryou';
  if(!['all','tv','movie'].includes(discover991.filter))discover991.filter='all';
  const app=$991('#app');if(!app)return false;
  app.innerHTML=shell991('Descobrir','Recomendações e lançamentos com Pra Você como entrada padrão.',`<div class="ct991-discover-tabs">${discoverTabs991.map(([k,l])=>`<button class="ct991-tab ${k===discover991.tab?'active':''}" data-dtab991="${k}">${l}</button>`).join('')}</div><div id="ct991-discover-controls"></div><div id="ct991-discover-results"></div>`,'discover');
  $$991('[data-dtab991]',app).forEach(b=>b.onclick=()=>{discover991.tab=b.dataset.dtab991;discover991.filter='all';void loadDiscover991()});
  footer991();
  if(dashboard991.length){void loadDiscover991();void fetchDashboard991(true).then(()=>window.__ct991PersistProfile?.()).catch(e=>console.warn('[CineTracker 0.99.4] refresh Descobrir',e))}
  else void fetchDashboard991().then(()=>{window.__ct991PersistProfile?.();return loadDiscover991()});
  return true;
}

async function renderProfile991(){
  setView991('profile');const app=$991('#app');if(!app)return false;
  app.innerHTML=shell991('Perfil','Estatísticas, filtros, favoritos e atividade sincronizada.','<div id="ct991-profile"></div>','profile');footer991();
  if(dashboard991.length){renderProfileBody991();void fetchDashboard991(true).then(()=>{window.__ct991PersistProfile?.();let v='';try{v=String(view||'')}catch{}if(v==='profile'||v==='history')renderProfileBody991()}).catch(e=>console.warn('[CineTracker 0.99.4] refresh Perfil',e));return true}
  const h=$991('#ct991-profile');if(h)h.innerHTML='<div class="ct991-empty">Sincronizando Perfil…</div>';
  try{await fetchDashboard991(true);window.__ct991PersistProfile?.();renderProfileBody991()}catch(e){if(h)h.innerHTML=`<div class="ct991-empty">Falha ao sincronizar Perfil: ${esc991(e?.message||e)}</div>`}return true;
}
function timeline991(){return '<div id="ct113-activity-host" class="ct113-activity-host"></div>'}

for(const dir of distDirs){
  const homePath=resolve(dir,'patch-v099-v0994-web.js');let home=await readFile(homePath,'utf8');
  if(!home.includes(homeScrollOld))throw new Error(`0.99.4 fluidity: Home scroll marker not found in ${homePath}`);home=home.replace(homeScrollOld,homeScrollNew);await writeFile(homePath,home,'utf8');

  const legacyPath=resolve(dir,'patch-v092-v0991.js');let legacy=await readFile(legacyPath,'utf8');
  legacy=replaceRange(legacy,'function timeline991(){','function openDay991',timeline991.toString(),'timeline');
  legacy=replaceRange(legacy,'async function renderProfile991(){','async function favoriteByMediaId991',renderProfile991.toString(),'profile render');
  legacy=replaceRange(legacy,'async function loadForYou991(){','async function mixedRows991',loadForYou991.toString(),'Pra Voce');
  legacy=replaceRange(legacy,'async function loadDiscover991(){','function renderDiscover991',loadDiscover991.toString(),'Discover loader');
  legacy=replaceRange(legacy,'function renderDiscover991(){','function organizeSettings991',renderDiscover991.toString(),'Discover render');
  await writeFile(legacyPath,legacy,'utf8');

  await copyFile(fluidSource,resolve(dir,fluidName));
  const indexPath=resolve(dir,'index.html');let html=await readFile(indexPath,'utf8');html=html.replace(new RegExp(`<script src="/${fluidName.replaceAll('.','\\.')}"></script>`,'g'),'');const warmTag='<script src="/patch-v112-v0994-warm-boot.js"></script>';if(!html.includes(warmTag))throw new Error(`0.99.4 fluidity: v112 tag missing in ${indexPath}`);html=html.replace(warmTag,`${warmTag}<script src="/${fluidName}"></script>`);await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.4: cache-first tabs, Pra Você filtrável, Home ancorada e gráfico de atividade aplicados.');
