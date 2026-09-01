import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099721.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r185c-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.22: embedded r185C base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r185c-home-scroll-polish';"))throw new Error('Android 0.99.7.22 requires r185C Android base');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.21-r185c-home-polish';"))throw new Error('Android 0.99.7.22 requires 0.99.7.21 bundle');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.22 boot point missing');
const patch=await readFile(resolve(root,'apps/web/runtime-r186-shared.js'),'utf8');
js=js.replace("const REVISION='r185c-home-scroll-polish';","const REVISION='r186-foryou-strict-realtime';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.22-r186-foryou-strict-realtime';
window.__ctAndroidWebRevision='r186-foryou-strict-realtime';
window.__ctAndroidForYou='same-r186-authority-as-web';
window.__ctAndroidRealtime='watch-history-media-overrides';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r186-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('</head>',()=>`<meta name="ct-android-v099722" content="r186-foryou-strict-realtime"></head>`);
html=html.replaceAll('android-v0.99.7.21-r185c-home-polish','android-v0.99.7.22-r186-foryou-strict-realtime');
for(const m of [
  'android-v0.99.7.22-r186-foryou-strict-realtime','r186-foryou-strict-realtime','foryou-strict-quality-year-history-realtime',
  'tmdb-gte-7.5-release-year-gt-1990','block-pure-drama-18-and-any-documentary-99','seven-slots-no-duplicate-media',
  'watch_history+media_overrides-postgres-changes','same-r186-authority-as-web','home-entry-top-anchor','geometry-only-no-layout-no-color',
  'instant-visual-cache-safe-revalidate','Pular e marcar só','compact-inline-season-toggle-no-giant-button'
])if(!html.includes(m))throw new Error('Android 0.99.7.22 missing '+m);
if(html.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android 0.99.7.22 must not import Web-only r183 layout');
if(html.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse'"))throw new Error('Android 0.99.7.22 must not import Web-only r185C performance layer');
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099722_READY mobile=r182+r184+r185A+r185Cshared foryou=r186 realtime=true');
