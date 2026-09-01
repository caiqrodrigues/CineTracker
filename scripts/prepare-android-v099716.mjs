import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099715.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r179-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.16: embedded r179 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r179-home-target-card';"))throw new Error('Android 0.99.7.16 requires r179 base before r180 patch');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.15-r179-fast-clean-tabs';"))throw new Error('Android 0.99.7.16 requires 0.99.7.15 mobile base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.16 boot point missing');
const [r180,css180]=await Promise.all([readFile(resolve(root,'apps/web/runtime-r180.js'),'utf8'),readFile(resolve(root,'apps/web/r180.css'),'utf8')]);
js=js.replace("const REVISION='r179-home-target-card';","const REVISION='r180-discover-profile-parity';");
js=js.replace('\nboot();','\n'+r180+String.raw`
window.__ctAndroidBundle='android-v0.99.7.16-r180-discover-profile';
window.__ctAndroidWebRevision='r180-discover-profile-parity';
window.__ctAndroidDiscover='native-pan-x-all-subtabs-strict-rules';
window.__ctAndroidProfile='collapsible-wide-stats-mobile';
try{for(const k of Object.keys(sessionStorage))if(k.indexOf('ct:android:v099715:view:')===0)sessionStorage.removeItem(k)}catch{}
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r180-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('</head>',()=>`<style data-ct-android-web-r180>${css180}</style><style data-ct-android-mobile="0.99.7.16">
body[data-ct-android-route="discover"] .ct-r180-tabs{overflow-x:auto!important;touch-action:pan-x!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;pointer-events:auto!important}
body[data-ct-android-route="discover"] .ct-r180-tab-shell{width:100%!important;max-width:100%!important;min-width:0!important}
body[data-ct-android-route="discover"] .ct-r180-tab-arrow{display:grid!important}
body[data-ct-android-route="profile"] .ct-r180-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
body[data-ct-android-route="profile"] .ct-r180-stat-wide{grid-column:span 2!important}
body[data-ct-android-route="profile"] .panel-head button{max-width:48vw!important}
</style><meta name="ct-android-v099716" content="r180-discover-scroll-profile-collapse"></head>`);
html=html.replaceAll('android-v0.99.7.15-r179-fast-clean-tabs','android-v0.99.7.16-r180-discover-profile');
for(const m of ['r180-discover-profile-parity','strict-discover-profile-layout','all-tabs-scroll-strict-business-rules','collapsible-stats-wide-time-cards','native-pan-x-all-subtabs-strict-rules','data-ct-r180-tabs','data-ct-r180-stats-toggle','Tempo total de tela','Tempo total em Watchlist'])if(!html.includes(m))throw new Error('Android 0.99.7.16 missing '+m);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099716_READY web=r180 discover=strict-scroll profile=collapse-wide');
