import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
// These builders both mutate apps/web/dist and walk the r162->r174 import chain.
// Keep them in separate Node processes so ESM module caching cannot leave dist at
// app-v173 while a cached build-r172 prevents regeneration of app-v172.
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v09977.mjs')],{cwd:root,stdio:'inherit'});
execFileSync(process.execPath,[resolve(root,'apps/web/build-r174.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const dist=resolve(root,'apps/web/dist');
let [html,js,css]=await Promise.all([
  readFile(indexPath,'utf8'),
  readFile(resolve(dist,'app-v174.js'),'utf8'),
  readFile(resolve(dist,'app-v174.css'),'utf8')
]);
if(!js.includes("const REVISION='r174-instant-optimistic-motion';"))throw new Error('Android 0.99.7.8 requires Web r174');
if(!js.includes("window.__ctR174='optimistic-instant-motion-episode-toggle';"))throw new Error('Android 0.99.7.8 missing r174 authority');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.8 boot insertion missing');

const androidRuntime=String.raw`
/* Android 0.99.7.8 — r174 instant UX + existing 0.99.7.7 phone composition. */
window.__ctAndroidBundle='android-v0.99.7.8-r174-instant-motion';
window.__ctAndroidWebRevision='r174-instant-optimistic-motion';
window.__ctAndroidParity='web-r174-instant-functional-parity';
window.__ctAndroidNavigate=function(target){try{const k=target==='settings'?'configs':target;if(['home','discover','sports','profile','configs'].includes(k)){go(pathFor(k));return true}}catch{}return false};
window.ct48Back=function(){try{const drawer=document.querySelector('.ct169-drawer-backdrop');if(drawer){drawer.remove();return true}const r=route();if(r==='movie'||r==='series'||r==='person'){if(history.length>1)history.back();else go('home');return true}if(r!=='home'&&r!=='auth'){go('home');return true}}catch{}return false};
setTimeout(()=>{try{window.CineTrackerNative?.appReady?.()}catch{}},0);
`;
js=js.replace('\nboot();','\n'+androidRuntime+'\nboot();');

html=html
 .replace(/<style data-ct-android="r173-css">[\s\S]*?<\/style>/,()=>`<style data-ct-android="r174-css">${css}</style>`)
 .replace(/<script data-ct-android="r173-js">[\s\S]*?<\/script>/,()=>`<script data-ct-android="r174-js">${js}</script>`)
 .replaceAll('android-v0.99.7.7-r173-mobile-composition','android-v0.99.7.8-r174-instant-motion')
 .replaceAll('web-r173-full-functional-parity','web-r174-instant-functional-parity')
 .replace('</head>',()=>'<meta name="ct-android-r174" content="optimistic-instant-motion-episode-toggle"></head>');

for(const marker of['android-v0.99.7.8-r174-instant-motion','r174-instant-optimistic-motion','optimistic-instant-motion-episode-toggle','cinetracker_unmark_episode_v1','ct174-flash','stacked-hero-readable-carousels-phone-panels'])if(!html.includes(marker))throw new Error(`Android 0.99.7.8 missing marker: ${marker}`);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_09978_READY web=r174 motion=optimistic episode-toggle=true mobile-composition=0.99.7.7');
