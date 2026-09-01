import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099717.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r181-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.18: embedded r181 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r181-season-whole-toggle';"))throw new Error('Android 0.99.7.18 requires r181 base before r182 patch');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.17-r181-season-toggle';"))throw new Error('Android 0.99.7.18 requires 0.99.7.17 mobile base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.18 boot point missing');
const [r182,css182]=await Promise.all([readFile(resolve(root,'apps/web/runtime-r182.js'),'utf8'),readFile(resolve(root,'apps/web/r182.css'),'utf8')]);
js=js.replace("const REVISION='r181-season-whole-toggle';","const REVISION='r182-home-season-polish';");
js=js.replace('\nboot();','\n'+r182+String.raw`
window.__ctAndroidBundle='android-v0.99.7.18-r182-home-season-polish';
window.__ctAndroidWebRevision='r182-home-season-polish';
window.__ctAndroidHomeBadge='removed-noninteractive-circle';
window.__ctAndroidSeasonControl='compact-inline-card-and-drawer';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r182-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('</head>',()=>`<style data-ct-android-web-r182>${css182}</style><style data-ct-android-mobile="0.99.7.18">
body[data-ct-android-route="home"] [data-home] .media-row>.badge{display:none!important}
body[data-ct-android-route="home"] [data-home] .media-row{grid-template-columns:56px minmax(0,1fr)!important}
body[data-ct-android-route="series"] .ct181-season-control.ct182-season-control{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;padding:7px 0 0!important}
body[data-ct-android-route="series"] .ct169-season-card .ct181-season-toggle.ct182-season-toggle{width:auto!important;min-height:32px!important;max-width:none!important;padding:6px 10px!important;border-radius:999px!important;flex-direction:row!important;font-size:9px!important}
body[data-ct-android-route="series"] .ct169-season-card .ct181-season-toggle.ct182-season-toggle span{font-size:9px!important;white-space:nowrap!important}
body[data-ct-android-route="series"] .ct182-season-progress{font-size:9px!important;white-space:nowrap!important}
body[data-ct-android-route="series"] .ct169-drawer-progress .ct181-season-toggle.ct182-season-toggle.drawer{width:auto!important;min-height:34px!important;padding:7px 11px!important;border-radius:999px!important}
</style><meta name="ct-android-v099718" content="r182-home-season-polish"></head>`);
html=html.replaceAll('android-v0.99.7.17-r181-season-toggle','android-v0.99.7.18-r182-home-season-polish');
for(const m of ['r182-home-season-polish','home-clean-status-season-compact-control','remove-noninteractive-circle-badge-keep-row-navigation','compact-inline-season-toggle-no-giant-button','removed-noninteractive-circle','compact-inline-card-and-drawer','ct182-season-toggle','data-ct181-season-toggle','cinetracker_unmark_episode_v1','ct176PrimeWithWatched'])if(!html.includes(m))throw new Error('Android 0.99.7.18 missing '+m);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099718_READY web=r182 home=no-circle season=compact-inline');
