import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099720.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r185a-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.21: embedded r185A base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r185a-instant-cache';"))throw new Error('Android 0.99.7.21 requires r185A Android base');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.20-r185a-instant-cache';"))throw new Error('Android 0.99.7.21 requires 0.99.7.20 bundle');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.21 boot point missing');
const [sharedPatch,polishCss]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r185c-shared.js'),'utf8'),
  readFile(resolve(root,'apps/web/r185c-polish-shared.css'),'utf8')
]);
js=js.replace("const REVISION='r185a-instant-cache';","const REVISION='r185c-home-scroll-polish';");
js=js.replace('\nboot();','\n'+sharedPatch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.21-r185c-home-polish';
window.__ctAndroidWebRevision='r185c-home-scroll-polish';
window.__ctAndroidPolish='geometry-only-no-layout-no-color';
window.__ctAndroidHomeScroll='enter-home-at-top';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r185c-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('</head>',()=>`<style data-ct-android-shared-r185c>${polishCss}</style><meta name="ct-android-v099721" content="r185c-home-scroll-polish"></head>`);
html=html.replaceAll('android-v0.99.7.20-r185a-instant-cache','android-v0.99.7.21-r185c-home-polish');
for(const m of [
  'android-v0.99.7.21-r185c-home-polish','r185c-home-scroll-polish','home-entry-top-anchor',
  'geometry-only-no-layout-no-color','enter-home-at-top','--ct185c-radius-panel',
  'instant-visual-cache-safe-revalidate','Pular e marcar só','compact-inline-season-toggle-no-giant-button'
])if(!html.includes(m))throw new Error('Android 0.99.7.21 missing '+m);
if(html.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android 0.99.7.21 must not import Web-only r183 layout');
if(html.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse'"))throw new Error('Android 0.99.7.21 must not import Web-only r185C performance layer');
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099721_READY mobile=r182+r184+r185A home=top polish=geometry-only');
