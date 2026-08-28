import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=resolve(root,'dist');
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5');
const version='0.99.7.1';
const webVersion='0.99.7';
const bundle='android-v0.99.7.1-web-parity-r2';

await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
await cp(source,target,{recursive:true});

const indexPath=resolve(target,'index.html');
let html=await readFile(indexPath,'utf8');
const androidCss=`<style id="ct-android-09971-parity">
html,body,#app{width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important;-webkit-text-size-adjust:100%!important}
.sidebar,.mobile-nav,.cloud-bar{display:none!important}
.app{display:block!important;width:100%!important;min-width:0!important}
.content{box-sizing:border-box!important;width:100%!important;max-width:none!important;min-width:0!important;margin:0!important;padding:12px 10px calc(18px + env(safe-area-inset-bottom))!important;overflow-x:hidden!important}
#ct120-page[data-ct120-route="profile"] .content,#ct120-profile,#ct120-profile>.ct120-page,#ct118-profile,#ct118-profile>.ct118-page,.ct91-settings{width:100%!important;max-width:none!important;min-width:0!important;box-sizing:border-box!important}
#ct120-profile .ct120-section,#ct118-profile .ct118-section{width:100%!important;max-width:none!important;min-width:0!important;box-sizing:border-box!important}
#ct120-profile .ct126-profile-grid,#ct118-profile .ct126-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;width:100%!important;max-width:100%!important;overflow-x:hidden!important}
.ct91-settings.ct109-settings{grid-template-columns:1fr!important;width:100%!important;max-width:none!important}
.ct109-account,.ct109-maintenance,.ct109-data-management,.ct128-data-card{grid-column:1/-1!important;width:100%!important;max-width:none!important;box-sizing:border-box!important}
.ct128-modal{padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom))!important}
.ct118-overlay,.ct120-overlay{padding:10px!important;padding-top:max(10px,env(safe-area-inset-top))!important;padding-bottom:max(10px,env(safe-area-inset-bottom))!important}
button,input,select{touch-action:manipulation}
</style>`;
html=html.replace('</head>',`${androidCss}<script>window.__ctAndroidBundle='${bundle}';window.__ctAndroidBuild='${version}';window.__ctAndroidWebBuild='${webVersion}';window.__ctAndroidEmbedded=true;</script></head>`);
const pattern=/<script src="\/([^"?#]+)"><\/script>/g;
const scripts=[...html.matchAll(pattern)];
let session=false;
for(const match of scripts){
  const name=match[1];
  let js=await readFile(resolve(source,name),'utf8');
  if(name==='patch-v103-v0994-session-gate.js'){
    js=js.replace('  await preloadRoute994(target);','  void preloadRoute994(target);');
    if(!js.includes('  void preloadRoute994(target);'))throw new Error('Android 0.99.7.1: nonblocking preload missing');
    session=true;
  }
  js=js.replace(/<\/script/gi,'<\\/script');
  html=html.replace(match[0],()=>`<script data-ct-inline="${name}">\n${js}\n</script>`);
}
html=html.replace("if (!('serviceWorker' in navigator)) return;","if (window.__ctAndroidBundle || !('serviceWorker' in navigator)) return;");
html=html.replace(/<link rel="icon"[^>]*>/g,'');
const bridge=`<script>
(() => {
  'use strict';
  window.__ctAndroidBuild='${version}';
  window.__ctAndroidWebBuild='${webVersion}';
  window.__ctAndroidBundle='${bundle}';
  const rawRpc=typeof window.sbRpc==='function'?window.sbRpc:null;
  if(rawRpc&&!rawRpc.__ctAndroid9971Timeout){
    const wrapped=async function(name,body={}){
      if(!['cinetracker_profile_home_payload_v0994','cinetracker_profile_payload_v0997'].includes(name))return rawRpc(name,body);
      return new Promise((resolve,reject)=>{
        let settled=false;
        const timer=setTimeout(()=>{if(!settled){settled=true;reject(new Error('Tempo limite ao sincronizar dados.'))}},10000);
        Promise.resolve(rawRpc(name,body)).then(v=>{if(!settled){settled=true;clearTimeout(timer);resolve(v)}},e=>{if(!settled){settled=true;clearTimeout(timer);reject(e)}});
      });
    };
    wrapped.__ctAndroid9971Timeout=true;
    try{sbRpc=wrapped}catch{}
    window.sbRpc=wrapped;
  }
  const navigate997=target=>{
    const nav=window.__ct0994Navigate||window.ct0994Navigate;
    if(typeof nav!=='function')return false;
    void nav(target==='history'?'profile':target);
    return true;
  };
  window.ct15Navigate=navigate997;
  window.ct14Navigate=navigate997;
  window.__ctAndroid997Navigate=navigate997;
  setTimeout(()=>void window.__ct0997WarmAll?.(),120);
})();
</script>`;
html=html.replace('</body>',`${bridge}</body>`);
await writeFile(indexPath,html,'utf8');
if(!session)throw new Error('Android 0.99.7.1 session gate missing');

const required=[
  'patch-v099-v0994-web.js','patch-v101-v0994-nav-pre.js','patch-v103-v0994-session-gate.js','patch-v104-v0994-authority.js',
  'patch-v105-v0994-preload-layout.js','patch-v106-v0994-refactor.js','patch-v107-v0994-data-ui-fix.js','patch-v108-v0994-pwa-resilience.js',
  'patch-v109-v0994-settings-web.js','patch-v110-v0994-episode-check.js','patch-v112-v0994-warm-boot.js','patch-v113-v0994-fluidity.js',
  'patch-v118-v0997-authoritative.js','patch-v119-v0997-real-smoke-hotfix.js','patch-v1195-v0997-route-preload-core.js',
  'patch-v1196-v0997-persistent-preload.js','patch-v120-v0997-structural-authority.js','patch-v121-v0997-functional-polish.js',
  'patch-v122-v0997-live-smoke-fixes.js','patch-v124-v0997-video-smoke-authority.js','patch-v125-v0997-restore-foryou-contract.js',
  'patch-v126-v0997-video3124-recovery.js','patch-v127-v0997-settings-unified-data-hub.js','patch-v128-v0997-settings-minimal-transfer.js',
  'patch-v129-v0997-settings-real-metadata-refresh.js','patch-v130-v0997-nav-footer-stability.js'
];
for(const name of required)if(!html.includes(`data-ct-inline="${name}"`))throw new Error(`Android 0.99.7.1 missing ${name}`);
for(const old of ['patch-v111-v0994-global-search.js','patch-v114-v0994-universal-detail.js','patch-v115-v0995-favorites-profile-discover.js','patch-v116-v0996-authoritative.js','patch-v117-v0996-final.js'])if(html.includes(`data-ct-inline="${old}"`))throw new Error(`Android 0.99.7.1 still embeds obsolete ${old}`);
for(const marker of [
  bundle,'v118-single-authority-profile-discover-detail','v119-real-device-smoke-hotfix','v1196-persistent-preload-indexeddb',
  'v120-structural-profile-discover-media-authority','v121-functional-polish-no-refactor','v124-video-smoke-authority',
  'v125-restore-foryou-contract-only','v126-video3124-surgical-recovery','v128-settings-minimal-import-export-only',
  'v129-settings-real-metadata-refresh-only','v130-nav-footer-stability-only','cinetracker_profile_payload_v0997',
  'Populares','Lista','Carrossel','Grade','Avaliações dos episódios por temporada','favorite_actors','Episódios por Dia',
  "applyFourMore('Séries Favoritas')",'window.ct99RenderProfile=()=>false',"cont:s.filter(x=>x.home_bucket==='continue'&&!caught(x))",
  'media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb','matches(x)&&(!yr||cy(x)===yr)',
  '>Exportar<','>Importar<','Ignorados com segurança'
])if(!html.includes(marker))throw new Error(`Android 0.99.7.1 missing current Web marker: ${marker}`);
for(const forbidden of [
  "if(t==='profile')return renderProfile99()",
  "if(v==='profile'||v==='history')renderProfile99()",
  "function run(){if(!currentUser)return;insertProfileBlocks();",
  "function run(){if(!currentUser)return;enhanceProfile();",
  'priority=visible-posters'
])if(html.includes(forbidden))throw new Error(`Android 0.99.7.1 contains forbidden legacy/fuzzy behavior: ${forbidden}`);
if(html.includes('<script src="/'))throw new Error('Android 0.99.7.1 still depends on root JS assets');
console.log(`Android ${version} prepared with ${scripts.length} inlined scripts and full Web ${webVersion} parity.`);
