import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099714.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const scriptMarker='<script data-ct-android="r179-js">';
const a=html.indexOf(scriptMarker),b=a<0?-1:html.indexOf('</script>',a+scriptMarker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.15: embedded r179 JS missing');
let js=html.slice(a+scriptMarker.length,b);
if(!js.includes("const REVISION='r179-home-target-card';"))throw new Error('Android 0.99.7.15 requires frozen Web r179');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.14-r179-immersive-detail-nav';"))throw new Error('Android 0.99.7.15 requires 0.99.7.14 composition base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.15 boot insertion missing');

const androidRuntime=String.raw`
window.__ctAndroidBundle='android-v0.99.7.15-r179-fast-clean-tabs';
window.__ctAndroidPerf='cache-first-view-snapshots-background-refresh';
window.__ctAndroidTop='no-redundant-route-header';
window.__ctAndroidSeenBadge='safe-inside-poster-no-transform';

const CT181_HOME_SNAPSHOT='ct:android:v099715:home:';
const CT181_SESSION_SNAPSHOT='ct:android:v099715:view:';
let ct181SaveTimer=0,ct181Observer=null;
function ct181UserKey(){try{return String(session?.user?.id||'anon')}catch{return'anon'}}
function ct181RouteKey(){try{const r=route();if(r==='movie'||r==='series'||r==='person')return r+':'+location.pathname;return r}catch{return'unknown'}}
function ct181SnapshotStore(r){return r==='home'?localStorage:sessionStorage}
function ct181SnapshotKey(r){return (r==='home'?CT181_HOME_SNAPSHOT:CT181_SESSION_SNAPSHOT)+ct181UserKey()+':'+ct181RouteKey()}
function ct181CanSnapshot(r){return !!session&&r!=='auth'&&['home','discover','sports','profile','configs','movie','series','person'].includes(r)}
function ct181Page(){return document.querySelector('.content>.page')||document.querySelector('.content .page')}
function ct181SaveSnapshot(){
  clearTimeout(ct181SaveTimer);ct181SaveTimer=setTimeout(()=>{
    try{
      const r=route(),page=ct181Page();if(!ct181CanSnapshot(r)||!page)return;
      if(page.querySelector('.ct169-home-skeleton,.ct169-detail-loading,.loader,.loading'))return;
      const body=page.innerHTML;if(!body||body.length<120||body.length>850000)return;
      ct181SnapshotStore(r).setItem(ct181SnapshotKey(r),JSON.stringify({at:Date.now(),html:body}));
    }catch{}
  },90);
}
function ct181RestoreSnapshot(){
  try{
    const r=route(),page=ct181Page();if(!ct181CanSnapshot(r)||!page)return false;
    const raw=ct181SnapshotStore(r).getItem(ct181SnapshotKey(r));if(!raw)return false;
    const snap=JSON.parse(raw);const ttl=r==='home'?1000*60*60*24*7:1000*60*60*8;
    if(!snap?.html||Date.now()-Number(snap.at||0)>ttl)return false;
    const waiting=page.querySelector('.ct169-home-skeleton,.ct169-detail-loading,.loader,.loading')||page.children.length===0;
    if(!waiting)return false;
    page.innerHTML=snap.html;page.classList.add('ct181-cache-restored');return true;
  }catch{return false}
}
function ct181ArmObserver(){
  try{ct181Observer?.disconnect();const content=document.querySelector('.content');if(!content)return;ct181Observer=new MutationObserver(()=>ct181SaveSnapshot());ct181Observer.observe(content,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','style']});ct181SaveSnapshot()}catch{}
}
function ct181FastCompose(){requestAnimationFrame(()=>{ct181RestoreSnapshot();ct181ArmObserver()})}
const ct181SetAppBase=setApp;
setApp=function(markup){ct181SetAppBase(markup);ct181FastCompose()};
window.addEventListener('cinetracker:data-changed',()=>requestAnimationFrame(ct181SaveSnapshot));
window.addEventListener('pageshow',ct181FastCompose);
setTimeout(ct181FastCompose,0);
`;
js=js.replace('\nboot();','\n'+androidRuntime+'\nboot();');
html=html.slice(0,a+scriptMarker.length)+js+html.slice(b);

const css=String.raw`
/* Android 0.99.7.15 — safe seen badge, cache-first perceived speed, no redundant tab title header. */
body.ct180-immersive-detail .ct169-poster-state{
  left:14px!important;right:auto!important;top:auto!important;bottom:14px!important;
  transform:none!important;translate:none!important;margin:0!important;
  max-width:calc(100% - 28px)!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
  z-index:8!important
}
body[data-ct-android-route="home"] .content>.header,
body[data-ct-android-route="discover"] .content>.header,
body[data-ct-android-route="sports"] .content>.header,
body[data-ct-android-route="profile"] .content>.header,
body[data-ct-android-route="configs"] .content>.header{display:none!important}
body[data-ct-android-route="home"] .search-global,
body[data-ct-android-route="discover"] .search-global,
body[data-ct-android-route="sports"] .search-global,
body[data-ct-android-route="profile"] .search-global,
body[data-ct-android-route="configs"] .search-global{margin-top:4px!important;margin-bottom:12px!important}
.ct181-cache-restored{animation:ct181CacheIn 120ms ease-out both}
@keyframes ct181CacheIn{from{opacity:.88}to{opacity:1}}
.ct169-home-skeleton{min-height:120px!important}
body:not(.ct180-auth) .content{min-height:100dvh!important}
`;

html=html
 .replaceAll('android-v0.99.7.14-r179-immersive-detail-nav','android-v0.99.7.15-r179-fast-clean-tabs')
 .replace('</head>',()=>`<style data-ct-android-mobile="0.99.7.15">${css}</style><meta name="ct-android-v099715" content="safe-seen-cache-first-no-tab-header"></head>`);

for(const marker of['android-v0.99.7.15-r179-fast-clean-tabs','cache-first-view-snapshots-background-refresh','no-redundant-route-header','safe-inside-poster-no-transform','transform:none!important','ct181-cache-restored','data-ct-android-route="home"','home-target-card-by-media-id'])if(!html.includes(marker))throw new Error(`Android 0.99.7.15 missing marker: ${marker}`);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099715_READY web=r179-frozen seen=safe cache=first headers=removed');
