import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099719.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r184-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.20: embedded r184 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r184-episode-gap-prompt';"))throw new Error('Android 0.99.7.20 requires r184 Android base');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.19-r184-gap-prompt';"))throw new Error('Android 0.99.7.20 requires 0.99.7.19 mobile base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.20 boot point missing');
const [cachePatch,cacheCss]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r185a-shared.js'),'utf8'),
  readFile(resolve(root,'apps/web/r185a-shared.css'),'utf8')
]);
js=js.replace("const REVISION='r184-episode-gap-prompt';","const REVISION='r185a-instant-cache';");
js=js.replace('\nboot();','\n'+cachePatch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.20-r185a-instant-cache';
window.__ctAndroidWebRevision='r185a-instant-cache';
window.__ctAndroidInstant='visual-cache-safe-revalidate';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r185a-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('</head>',()=>`<style data-ct-android-shared-r185a>${cacheCss}</style><meta name="ct-android-v099720" content="r185a-instant-cache"></head>`);
html=html.replaceAll('android-v0.99.7.19-r184-gap-prompt','android-v0.99.7.20-r185a-instant-cache');
for(const m of [
  'r185a-instant-cache','android-v0.99.7.20-r185a-instant-cache','instant-visual-cache-safe-revalidate',
  'stale-while-revalidate-visual-only','cache-never-writes-never-decides-business-state','old-render-path-remains-authority',
  'r184-episode-gap-prompt','Pular e marcar só','compact-inline-season-toggle-no-giant-button'
])if(!html.includes(m))throw new Error('Android 0.99.7.20 missing '+m);
if(html.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android 0.99.7.20 must not import Web-only r183 layout');
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099720_READY mobile=r182+r184 instant=r185A visual-cache-safe');
