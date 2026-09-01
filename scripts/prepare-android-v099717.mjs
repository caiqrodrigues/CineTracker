import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099716.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r180-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.17: embedded r180 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r180-discover-profile-parity';"))throw new Error('Android 0.99.7.17 requires r180 base before r181 patch');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.16-r180-discover-profile';"))throw new Error('Android 0.99.7.17 requires 0.99.7.16 mobile base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.17 boot point missing');
const [r181,css181]=await Promise.all([readFile(resolve(root,'apps/web/runtime-r181.js'),'utf8'),readFile(resolve(root,'apps/web/r181.css'),'utf8')]);
js=js.replace("const REVISION='r180-discover-profile-parity';","const REVISION='r181-season-whole-toggle';");
js=js.replace('\nboot();','\n'+r181+String.raw`
window.__ctAndroidBundle='android-v0.99.7.17-r181-season-toggle';
window.__ctAndroidWebRevision='r181-season-whole-toggle';
window.__ctAndroidSeasonToggle='whole-season-released-only-reversible';
window.__ctAndroidPreviousSeasonPrompt='confirm-previous-incomplete-seasons';
try{for(const k of Object.keys(sessionStorage))if(k.indexOf('ct:android:v099715:view:')===0)sessionStorage.removeItem(k)}catch{}
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r181-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('</head>',()=>`<style data-ct-android-web-r181>${css181}</style><style data-ct-android-mobile="0.99.7.17">
body[data-ct-android-route="series"] .ct181-season-toggle{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
body[data-ct-android-route="series"] .ct181-season-confirm{padding-bottom:max(12px,env(safe-area-inset-bottom))!important}
body[data-ct-android-route="series"] .ct181-season-confirm-card{max-height:min(78dvh,620px)!important;overflow:auto!important}
body[data-ct-android-route="series"] .ct181-confirm-actions button{min-height:52px!important}
</style><meta name="ct-android-v099717" content="r181-whole-season-toggle"></head>`);
html=html.replaceAll('android-v0.99.7.16-r180-discover-profile','android-v0.99.7.17-r181-season-toggle');
for(const m of ['r181-season-whole-toggle','whole-season-watch-toggle','mark-unmark-all-released-episodes','ask-before-marking-incomplete-previous-seasons','whole-season-released-only-reversible','data-ct181-season-toggle','cinetracker_unmark_episode_v1','ct176PrimeWithWatched'])if(!html.includes(m))throw new Error('Android 0.99.7.17 missing '+m);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099717_READY web=r181 season=whole-toggle previous=confirm gap=r176');
