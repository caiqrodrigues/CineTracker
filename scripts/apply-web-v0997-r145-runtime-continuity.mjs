import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r145: '+msg)};

for(const dir of dirs){
  const primaryPath=resolve(dir,'patch-v143-v0997-primary-router.js');
  let primary=await readFile(primaryPath,'utf8');

  const homeCacheOld="if(!homeData){const cached=readPrimaryCache('home');if(validHomePayload(cached)){homeData=cached;homeAt=0}else if(cached){try{sessionStorage.removeItem('ct139:home')}catch{}}}";
  const homeCacheNew="if(!homeData){const preloaded=window.__ct0997PreloadedHomeLive,cached=preloaded||readPrimaryCache('home');if(validHomePayload(cached)){homeData=cached;homeAt=preloaded?Date.now():0}else if(cached){try{sessionStorage.removeItem('ct139:home')}catch{}}}";
  must(primary.includes(homeCacheOld),'Home cache anchor missing');
  primary=primary.replace(homeCacheOld,homeCacheNew);

  const homeFetchOld="const nextHome=await rpcDirect('cinetracker_home_live_v0997_r2',{});if(!validHomePayload(nextHome))throw new Error('Home retornou payload incompleto');homeData=nextHome;homeAt=Date.now();writePrimaryCache('home',homeData)";
  const homeFetchNew="const loadHome=window.__ct0997PersistentPreloadRpc||rpcDirect;const nextHome=await loadHome('cinetracker_home_live_v0997_r2',{});if(!validHomePayload(nextHome))throw new Error('Home retornou payload incompleto');homeData=nextHome;homeAt=Date.now();writePrimaryCache('home',homeData)";
  must(primary.includes(homeFetchOld),'Home persistent loader anchor missing');
  primary=primary.replace(homeFetchOld,homeFetchNew);
  await writeFile(primaryPath,primary,'utf8');
  execFileSync(process.execPath,['--check',primaryPath],{stdio:'pipe'});

  const detailPath=resolve(dir,'patch-v134c-v0997-deeplink-details.js');
  let detail=await readFile(detailPath,'utf8');
  const detailOld="async function renderLegacyAsPage(type,id){const body=await ensureFrame();if(!body)return false;body.innerHTML='<div class=\"ct132-loading\">Carregando detalhes…</div>';closeLegacyOverlays();try{if(!oldOpenDetail)throw new Error('Detalhe indisponível');await oldOpenDetail(type,Number(id));const overlay=$('.ct131-overlay,.ct118-overlay'),shell=overlay?.querySelector?.('.ct131-shell,.ct118-shell');if(!overlay||!shell)throw new Error('Tela de detalhe não foi criada');replaceTopbar(shell);shell.classList.add('ct132-route-shell');if(type==='tv')collapseSeasons(shell);limitCast(shell,type,id);overlay.removeChild(shell);overlay.remove();body.innerHTML='';body.appendChild(shell);normalizeNav();return true}catch(e){closeLegacyOverlays();body.innerHTML=`<div class=\"ct132-error\">Não foi possível carregar os detalhes: ${esc(e?.message||e)}</div>`;return false}}";
  const detailNew="function routePending145(text){document.querySelector('.ct145-route-pending')?.remove();const e=document.createElement('div');e.className='ct145-route-pending';e.textContent=text;e.style.cssText='position:fixed;left:50%;top:76px;transform:translateX(-50%);z-index:2147483000;padding:9px 14px;border:1px solid #315d76;border-radius:999px;background:#07131bf2;color:#e8f8ff;font-size:12px;box-shadow:0 10px 35px #0009;pointer-events:none';document.body.appendChild(e);return()=>e.remove()}async function renderLegacyAsPage(type,id){const done=routePending145('Carregando detalhes…');closeLegacyOverlays();try{if(!oldOpenDetail)throw new Error('Detalhe indisponível');await oldOpenDetail(type,Number(id));const overlay=$('.ct131-overlay,.ct118-overlay'),shell=overlay?.querySelector?.('.ct131-shell,.ct118-shell');if(!overlay||!shell)throw new Error('Tela de detalhe não foi criada');const body=await ensureFrame();if(!body)throw new Error('Estrutura da página indisponível');replaceTopbar(shell);shell.classList.add('ct132-route-shell');if(type==='tv')collapseSeasons(shell);limitCast(shell,type,id);overlay.removeChild(shell);overlay.remove();body.innerHTML='';body.appendChild(shell);normalizeNav();return true}catch(e){closeLegacyOverlays();const body=await ensureFrame();if(body)body.innerHTML=`<div class=\"ct132-error\">Não foi possível carregar os detalhes: ${esc(e?.message||e)}</div>`;return false}finally{done()}}";
  must(detail.includes(detailOld),'detail continuity anchor missing');
  detail=detail.replace(detailOld,detailNew);

  const personOld="async function renderPersonPage(id){const body=await ensureFrame();if(!body)return false;body.innerHTML='<div class=\"ct132-loading\">Carregando ator…</div>';closeLegacyOverlays();try{if(!oldOpenPerson)throw new Error('Tela de ator indisponível');await oldOpenPerson(Number(id));const overlay=$('.ct118-overlay'),shell=overlay?.querySelector?.('.ct118-shell');if(!overlay||!shell)throw new Error('Tela do ator não foi criada');replaceTopbar(shell);shell.classList.add('ct132-route-shell');limitPersonFilmography(shell,id);overlay.removeChild(shell);overlay.remove();body.innerHTML='';body.appendChild(shell);normalizeNav();return true}catch(e){closeLegacyOverlays();body.innerHTML=`<div class=\"ct132-error\">Não foi possível carregar o ator: ${esc(e?.message||e)}</div>`;return false}}";
  const personNew="async function renderPersonPage(id){const done=routePending145('Carregando ator…');closeLegacyOverlays();try{if(!oldOpenPerson)throw new Error('Tela de ator indisponível');await oldOpenPerson(Number(id));const overlay=$('.ct118-overlay'),shell=overlay?.querySelector?.('.ct118-shell');if(!overlay||!shell)throw new Error('Tela do ator não foi criada');const body=await ensureFrame();if(!body)throw new Error('Estrutura da página indisponível');replaceTopbar(shell);shell.classList.add('ct132-route-shell');limitPersonFilmography(shell,id);overlay.removeChild(shell);overlay.remove();body.innerHTML='';body.appendChild(shell);normalizeNav();return true}catch(e){closeLegacyOverlays();const body=await ensureFrame();if(body)body.innerHTML=`<div class=\"ct132-error\">Não foi possível carregar o ator: ${esc(e?.message||e)}</div>`;return false}finally{done()}}";
  must(detail.includes(personOld),'person continuity anchor missing');
  detail=detail.replace(personOld,personNew);
  await writeFile(detailPath,detail,'utf8');
  execFileSync(process.execPath,['--check',detailPath],{stdio:'pipe'});

  // Os patches mudam entre deploys, portanto uma URL nova quebra o cache HTTP
  // immutable já existente no aparelho. O header r145 evita repetir o problema.
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  for(const asset of [
    'patch-v1196-v0997-persistent-preload.js',
    'patch-v134c-v0997-deeplink-details.js',
    'patch-v143-v0997-nav-gate.js',
    'patch-v143-v0997-primary-router.js'
  ]){
    html=html.replaceAll(`src=\"/${asset}\"`,`src=\"/${asset}?r145\"`);
  }
  must(html.includes('patch-v143-v0997-primary-router.js?r145'),'primary cache bust missing');
  must(html.includes('patch-v1196-v0997-persistent-preload.js?r145'),'preload cache bust missing');
  await writeFile(indexPath,html,'utf8');
}

console.log('WEB_R145_APPLIED home=live-snapshot detail=keep-current-page assets=cache-busted');
await import('./test-web-v0997-r145-runtime-continuity.mjs');
