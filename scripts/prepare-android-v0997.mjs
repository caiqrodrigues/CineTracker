import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=resolve(root,'dist');
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5');
const version='0.99.7';
const bundle='android-v0.99.7-single-authority';

await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
await cp(source,target,{recursive:true});

const indexPath=resolve(target,'index.html');
let html=await readFile(indexPath,'utf8');
html=html.replace('</head>',`<script>window.__ctAndroidBundle='${bundle}';window.__ctAndroidBuild='${version}';window.__ctAndroidEmbedded=true;</script></head>`);
const pattern=/<script src="\/([^"?#]+)"><\/script>/g;
const scripts=[...html.matchAll(pattern)];
let session=false;
for(const match of scripts){
  const name=match[1];
  let js=await readFile(resolve(source,name),'utf8');
  if(name==='patch-v103-v0994-session-gate.js'){
    js=js.replace('  await preloadRoute994(target);','  void preloadRoute994(target);');
    if(!js.includes('  void preloadRoute994(target);'))throw new Error('Android 0.99.7: nonblocking preload missing');
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
  window.__ctAndroidBundle='${bundle}';
  const rawRpc=typeof window.sbRpc==='function'?window.sbRpc:null;
  if(rawRpc&&!rawRpc.__ctAndroid997Timeout){
    const wrapped=async function(name,body={}){
      if(!['cinetracker_profile_home_payload_v0994','cinetracker_profile_payload_v0997'].includes(name))return rawRpc(name,body);
      return new Promise((resolve,reject)=>{
        let settled=false;
        const timer=setTimeout(()=>{if(!settled){settled=true;reject(new Error('Tempo limite ao sincronizar dados.'))}},10000);
        Promise.resolve(rawRpc(name,body)).then(v=>{if(!settled){settled=true;clearTimeout(timer);resolve(v)}},e=>{if(!settled){settled=true;clearTimeout(timer);reject(e)}});
      });
    };
    wrapped.__ctAndroid997Timeout=true;
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
if(!session)throw new Error('Android 0.99.7 session gate missing');
for(const name of ['patch-v099-v0994-web.js','patch-v101-v0994-nav-pre.js','patch-v103-v0994-session-gate.js','patch-v104-v0994-authority.js','patch-v105-v0994-preload-layout.js','patch-v106-v0994-refactor.js','patch-v107-v0994-data-ui-fix.js','patch-v108-v0994-pwa-resilience.js','patch-v109-v0994-settings-web.js','patch-v110-v0994-episode-check.js','patch-v112-v0994-warm-boot.js','patch-v113-v0994-fluidity.js','patch-v118-v0997-authoritative.js'])if(!html.includes(`data-ct-inline="${name}"`))throw new Error(`Android 0.99.7 missing ${name}`);
for(const old of ['patch-v111-v0994-global-search.js','patch-v114-v0994-universal-detail.js','patch-v115-v0995-favorites-profile-discover.js','patch-v116-v0996-authoritative.js','patch-v117-v0996-final.js'])if(html.includes(`data-ct-inline="${old}"`))throw new Error(`Android 0.99.7 still embeds obsolete ${old}`);
for(const marker of [bundle,'v118-single-authority-profile-discover-detail','cinetracker_profile_payload_v0997','Populares','Lista','Carrossel','Grade','Avaliações dos episódios por temporada','favorite_actors','priority=visible-posters'])if(!html.includes(marker))throw new Error(`Android 0.99.7 missing ${marker}`);
if(html.includes('<script src="/'))throw new Error('Android 0.99.7 still depends on root JS assets');
console.log(`Android ${version} prepared with ${scripts.length} inlined scripts and the exact Web 0.99.7 authority.`);
