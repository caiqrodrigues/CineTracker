import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v09977.mjs')],{cwd:root,stdio:'inherit'});
execFileSync(process.execPath,[resolve(root,'apps/web/build-r178.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const dist=resolve(root,'apps/web/dist');
let [html,js,css]=await Promise.all([readFile(indexPath,'utf8'),readFile(resolve(dist,'app-v178.js'),'utf8'),readFile(resolve(dist,'app-v178.css'),'utf8')]);
if(!js.includes("const REVISION='r178-stable-home-dom';"))throw new Error('Android 0.99.7.12 requires Web r178');
if(!js.includes("window.__ctR178='stable-home-dom-no-repaint-loop';"))throw new Error('Android 0.99.7.12 missing r178 authority');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.12 boot insertion missing');
const androidRuntime=String.raw`
window.__ctAndroidBundle='android-v0.99.7.12-r178-stable-home-dom';
window.__ctAndroidWebRevision='r178-stable-home-dom';
window.__ctAndroidParity='web-r178-stable-home-dom-parity';
window.__ctAndroidNavigate=function(target){try{const k=target==='settings'?'configs':target;if(['home','discover','sports','profile','configs'].includes(k)){go(pathFor(k));return true}}catch{}return false};
window.ct48Back=function(){try{const drawer=document.querySelector('.ct169-drawer-backdrop');if(drawer){drawer.remove();return true}const r=route();if(r==='movie'||r==='series'||r==='person'){if(history.length>1)history.back();else go('home');return true}if(r!=='home'&&r!=='auth'){go('home');return true}}catch{}return false};
setTimeout(()=>{try{window.CineTrackerNative?.appReady?.()}catch{}},0);
`;
js=js.replace('\nboot();','\n'+androidRuntime+'\nboot();');
html=html
 .replace(/<style data-ct-android="r173-css">[\s\S]*?<\/style>/,()=>`<style data-ct-android="r178-css">${css}</style>`)
 .replace(/<script data-ct-android="r173-js">[\s\S]*?<\/script>/,()=>`<script data-ct-android="r178-js">${js}</script>`)
 .replaceAll('android-v0.99.7.7-r173-mobile-composition','android-v0.99.7.12-r178-stable-home-dom')
 .replaceAll('web-r173-full-functional-parity','web-r178-stable-home-dom-parity')
 .replace('</head>',()=>'<meta name="ct-android-r178" content="stable-home-dom-no-repaint-loop"></head>');
for(const marker of['android-v0.99.7.12-r178-stable-home-dom','r178-stable-home-dom','stable-home-dom-no-repaint-loop','no-global-repaint-scroll-click-history-stable','first-released-unwatched-gap-authority','cinetracker_unmark_episode_v1','ct174-flash','ct175-next-episode','stacked-hero-readable-carousels-phone-panels'])if(!html.includes(marker))throw new Error(`Android 0.99.7.12 missing marker: ${marker}`);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099712_READY web=r178 home=stable-dom blink=false scroll-click-history=stable mobile=09977');
