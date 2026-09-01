import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v09977.mjs')],{cwd:root,stdio:'inherit'});
execFileSync(process.execPath,[resolve(root,'apps/web/build-r177.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const dist=resolve(root,'apps/web/dist');
let [html,js,css]=await Promise.all([readFile(indexPath,'utf8'),readFile(resolve(dist,'app-v177.js'),'utf8'),readFile(resolve(dist,'app-v177.css'),'utf8')]);
if(!js.includes("const REVISION='r177-canonical-next-repaint';"))throw new Error('Android 0.99.7.11 requires Web r177');
if(!js.includes("window.__ctR177='canonical-next-episode-repaint';"))throw new Error('Android 0.99.7.11 missing r177 authority');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.11 boot insertion missing');
const androidRuntime=String.raw`
window.__ctAndroidBundle='android-v0.99.7.11-r177-canonical-next-repaint';
window.__ctAndroidWebRevision='r177-canonical-next-repaint';
window.__ctAndroidParity='web-r177-canonical-next-repaint-parity';
window.__ctAndroidNavigate=function(target){try{const k=target==='settings'?'configs':target;if(['home','discover','sports','profile','configs'].includes(k)){go(pathFor(k));return true}}catch{}return false};
window.ct48Back=function(){try{const drawer=document.querySelector('.ct169-drawer-backdrop');if(drawer){drawer.remove();return true}const r=route();if(r==='movie'||r==='series'||r==='person'){if(history.length>1)history.back();else go('home');return true}if(r!=='home'&&r!=='auth'){go('home');return true}}catch{}return false};
setTimeout(()=>{try{window.CineTrackerNative?.appReady?.()}catch{}},0);
`;
js=js.replace('\nboot();','\n'+androidRuntime+'\nboot();');
html=html
 .replace(/<style data-ct-android="r173-css">[\s\S]*?<\/style>/,()=>`<style data-ct-android="r177-css">${css}</style>`)
 .replace(/<script data-ct-android="r173-js">[\s\S]*?<\/script>/,()=>`<script data-ct-android="r177-js">${js}</script>`)
 .replaceAll('android-v0.99.7.7-r173-mobile-composition','android-v0.99.7.11-r177-canonical-next-repaint')
 .replaceAll('web-r173-full-functional-parity','web-r177-canonical-next-repaint-parity')
 .replace('</head>',()=>'<meta name="ct-android-r177" content="canonical-next-episode-repaint"></head>');
for(const marker of['android-v0.99.7.11-r177-canonical-next-repaint','r177-canonical-next-repaint','canonical-next-episode-repaint','drawer-and-home-share-first-unwatched-immediate-repaint','first-released-unwatched-gap-authority','cinetracker_unmark_episode_v1','ct174-flash','ct175-next-episode','stacked-hero-readable-carousels-phone-panels'])if(!html.includes(marker))throw new Error(`Android 0.99.7.11 missing marker: ${marker}`);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099711_READY web=r177 canonical-next=repaint drawer-home=shared mobile=09977');
