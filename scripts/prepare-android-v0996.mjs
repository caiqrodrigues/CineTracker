import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=resolve(root,'dist');
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5');
const version='0.99.6';
const bundle='android-v0.99.6-authoritative-preload';

await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
await cp(source,target,{recursive:true});

const indexPath=resolve(target,'index.html');
let html=await readFile(indexPath,'utf8');
const early=`<script>window.__ctAndroidBundle='${bundle}';window.__ctAndroidBuild='${version}';window.__ctAndroidEmbedded=true;</script>`;
html=html.replace('</head>',`${early}</head>`);

const scriptPattern=/<script src="\/([^"?#]+)"><\/script>/g;
const scripts=[...html.matchAll(scriptPattern)];
let sessionGateReady=false;
for(const match of scripts){
  const fileName=match[1];
  let script=await readFile(resolve(source,fileName),'utf8');
  if(fileName==='patch-v103-v0994-session-gate.js'){
    const blocking='  await preloadRoute994(target);';
    const nonBlocking='  void preloadRoute994(target);';
    if(script.includes(blocking))script=script.replace(blocking,nonBlocking);
    if(!script.includes(nonBlocking))throw new Error('Android 0.99.6: nonblocking session preload marker missing.');
    sessionGateReady=true;
  }
  script=script.replace(/<\/script/gi,'<\\/script');
  html=html.replace(match[0],()=>`<script data-ct-inline="${fileName}">\n${script}\n</script>`);
}

html=html.replace("if (!('serviceWorker' in navigator)) return;","if (window.__ctAndroidBundle || !('serviceWorker' in navigator)) return;");
html=html.replace(/<link rel="icon"[^>]*>/g,'');

const resilience=`<script>
(() => {
  'use strict';
  window.__ctAndroidBuild='${version}';
  window.__ctAndroidBundle='${bundle}';
  const rawRpc=typeof window.sbRpc==='function'?window.sbRpc:null;
  if(rawRpc&&!rawRpc.__ctAndroid996Timeout){
    const wrapped=async function(name,body={}){
      if(!['cinetracker_profile_home_payload_v0994','cinetracker_profile_payload_v0996'].includes(name))return rawRpc(name,body);
      return new Promise((resolve,reject)=>{
        let settled=false;
        const timer=setTimeout(()=>{if(!settled){settled=true;reject(new Error('Tempo limite ao sincronizar dados.'))}},10000);
        Promise.resolve(rawRpc(name,body)).then(value=>{if(!settled){settled=true;clearTimeout(timer);resolve(value)}},error=>{if(!settled){settled=true;clearTimeout(timer);reject(error)}});
      });
    };
    wrapped.__ctAndroid996Timeout=true;
    try{sbRpc=wrapped}catch{}
    window.sbRpc=wrapped;
  }
  const navigate996=target=>{
    const nav=window.__ct0994Navigate||window.ct0994Navigate;
    if(typeof nav!=='function')return false;
    void nav(target==='history'?'profile':target);
    return true;
  };
  window.ct15Navigate=navigate996;
  window.ct14Navigate=navigate996;
  window.__ctAndroid996Navigate=navigate996;
  setTimeout(()=>void window.__ct0996WarmAll?.(),120);
})();
</script>`;
html=html.replace('</body>',`${resilience}</body>`);
await writeFile(indexPath,html,'utf8');

if(!sessionGateReady)throw new Error('Android 0.99.6 session gate missing.');
const required=[
  'patch-v099-v0994-web.js','patch-v101-v0994-nav-pre.js','patch-v103-v0994-session-gate.js','patch-v104-v0994-authority.js',
  'patch-v105-v0994-preload-layout.js','patch-v106-v0994-refactor.js','patch-v107-v0994-data-ui-fix.js','patch-v108-v0994-pwa-resilience.js',
  'patch-v109-v0994-settings-web.js','patch-v110-v0994-episode-check.js','patch-v111-v0994-global-search.js','patch-v112-v0994-warm-boot.js',
  'patch-v113-v0994-fluidity.js','patch-v114-v0994-universal-detail.js','patch-v115-v0995-favorites-profile-discover.js','patch-v116-v0996-authoritative.js','patch-v117-v0996-final.js'
];
for(const name of required)if(!html.includes(`data-ct-inline="${name}"`))throw new Error(`Android 0.99.6 missing ${name}.`);
for(const marker of [bundle,'v116-profile-discover-single-authority','v117-posters-actors-season-ratings','cinetracker_profile_payload_v0996','ct0996_profile_snapshot_v2','ct0996_discover_snapshot_v2','window.__ct0996WarmAll','data-ct114-rewatch','combined_credits','priority=visible-posters','Avaliações dos episódios por temporada'])if(!html.includes(marker))throw new Error(`Android 0.99.6 missing ${marker}.`);
if(!html.includes('void preloadRoute994(target);'))throw new Error('Android 0.99.6 still blocks navigation on preload.');
if(!html.includes('window.ct15Navigate=navigate996'))throw new Error('Android native navigation is not routed to 0.99.6 authority.');
if(html.includes('<script src="/'))throw new Error('Android 0.99.6 still has root script dependencies.');
console.log(`Android ${version} bundle prepared with ${scripts.length} inlined scripts; exact Web 0.99.6 runtime including v117 embedded.`);
