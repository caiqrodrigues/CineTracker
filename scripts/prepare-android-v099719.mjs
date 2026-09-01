import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099718.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r182-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.19: embedded r182 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r182-home-season-polish';"))throw new Error('Android 0.99.7.19 requires r182 base');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.18-r182-home-season-polish';"))throw new Error('Android 0.99.7.19 requires 0.99.7.18 mobile base');
if(!js.includes("window.__ctR181='whole-season-watch-toggle';"))throw new Error('Android 0.99.7.19 requires r181 helpers');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.19 boot point missing');
const [shared,sharedCss]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r184-shared.js'),'utf8'),
  readFile(resolve(root,'apps/web/r184-shared.css'),'utf8')
]);
js=js.replace("const REVISION='r182-home-season-polish';","const REVISION='r184-episode-gap-prompt';");
js=js.replace('\nboot();','\n'+shared+String.raw`
window.__ctAndroidBundle='android-v0.99.7.19-r184-gap-prompt';
window.__ctAndroidWebRevision='r184-episode-gap-prompt';
window.__ctAndroidGapPrompt='skip-or-mark-previous-released';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r184-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('</head>',()=>`<style data-ct-android-shared-r184>${sharedCss}</style><style data-ct-android-mobile="0.99.7.19">
.ct184-gap-confirm{padding:10px 10px max(14px,env(safe-area-inset-bottom))!important;align-items:end!important}
.ct184-gap-card{width:100%!important;max-width:520px!important;max-height:76dvh!important;border-radius:20px 20px 14px 14px!important}
.ct184-gap-actions{grid-template-columns:1fr!important}
.ct184-gap-actions button{min-height:52px!important;font-size:11px!important;touch-action:manipulation!important}
</style><meta name="ct-android-v099719" content="r184-episode-gap-prompt"></head>`);
html=html.replaceAll('android-v0.99.7.18-r182-home-season-polish','android-v0.99.7.19-r184-gap-prompt');
for(const m of [
  'r184-episode-gap-prompt','android-v0.99.7.19-r184-gap-prompt','skip-or-mark-previous-released',
  'detect-skipped-released-episodes-before-manual-watch','all-released-episodes-before-target-across-seasons',
  'Pular e marcar só','Marcar anteriores +','ct184SkippedBefore','ct181Released','ct181Pool(jobs,4',
  'r182-home-season-polish','compact-inline-season-toggle-no-giant-button','cinetracker_unmark_episode_v1','ct176PrimeWithWatched'
])if(!html.includes(m))throw new Error('Android 0.99.7.19 missing '+m);
if(html.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android 0.99.7.19 must not import Web-only r183 layout');
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099719_READY mobile=r182 gap=r184-shared web-r183=not-imported');
