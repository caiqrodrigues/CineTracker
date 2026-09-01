import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(process.cwd());
const webRoot=resolve(root,'apps/web');
const webDist=resolve(webRoot,'dist');
const androidDir=resolve(root,'apps/android/app/src/main/assets/hotfix5');

// Android 0.99.7.4 is deliberately pinned to the frozen Web r173 baseline.
await import(pathToFileURL(resolve(webRoot,'build-r173.mjs')).href+`?android=${Date.now()}`);

let [html,js,css]=await Promise.all([
  readFile(resolve(webDist,'index.html'),'utf8'),
  readFile(resolve(webDist,'app-v173.js'),'utf8'),
  readFile(resolve(webDist,'app-v173.css'),'utf8')
]);

if(!js.includes("const REVISION='r173-detail-left-window';"))throw new Error('Android 0.99.7.4 requires frozen Web r173');
if(!js.includes("window.__ctR173='detail-left-windowed-hero';"))throw new Error('Android 0.99.7.4 missing r173 detail authority');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.4 cannot locate boot insertion point');

const androidRuntime=String.raw`
/* Android 0.99.7.4 — exact r173 feature authority with phone navigation adapter. */
window.__ctAndroidBundle='android-v0.99.7.4-r173-parity';
window.__ctAndroidWebRevision='r173-detail-left-window';
window.__ctAndroidParity='web-r173-full-functional-parity';
window.__ctAndroidNavigate=function(target){
  try{const k=target==='settings'?'configs':target;if(['home','discover','sports','profile','configs'].includes(k)){go(pathFor(k));return true}}catch{}
  return false;
};
window.ct48Back=function(){
  try{
    const drawer=document.querySelector('.ct169-drawer-backdrop');
    if(drawer){drawer.remove();return true}
    const r=route();
    if(r==='movie'||r==='series'||r==='person'){if(history.length>1)history.back();else go('home');return true}
    if(r!=='home'&&r!=='auth'){go('home');return true}
  }catch{}
  return false;
};
setTimeout(()=>{try{window.CineTrackerNative?.appReady?.()}catch{}},0);
`;
js=js.replace('\nboot();','\n'+androidRuntime+'\nboot();');

const androidCss=String.raw`
/* Android 0.99.7.4 mobile adaptation. Business rules remain exactly Web r173. */
html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;-webkit-text-size-adjust:100%!important}
body{padding-bottom:0!important}
.app{display:block!important;width:100%!important;min-width:0!important}
.sidebar,.cloud-bar{display:none!important}
.content{box-sizing:border-box!important;width:100%!important;max-width:none!important;margin:0!important;padding:10px 10px 86px!important;overflow-x:hidden!important}
html body .app .content .mobile-nav{display:flex!important;position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:1000500!important;height:64px!important;padding:5px 4px max(5px,env(safe-area-inset-bottom))!important;background:#061018f5!important;border-top:1px solid #21465b!important;backdrop-filter:blur(18px)!important;box-shadow:0 -14px 36px #0009!important;gap:2px!important}
html body .app .content .mobile-nav a{flex:1 1 20%!important;min-width:0!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;padding:7px 3px!important;border-radius:10px!important;font-size:10px!important;line-height:1.1!important;white-space:normal!important;color:#bcd1dc!important;text-decoration:none!important}
html body .app .content .mobile-nav a.active{background:#0d3145!important;color:#fff!important;border:1px solid #3a7898!important}
.search-global{position:sticky!important;top:0!important;z-index:80!important;background:#041017e8!important;backdrop-filter:blur(14px)!important;margin:-2px 0 8px!important}
.header{padding-right:0!important}.h1{font-size:24px!important}.subtitle{font-size:10px!important}
.row,.ct169-cast-row,.ct169-related-row,.ct169-season-row,.ct169-season-chart-carousel,.ct171-provider-row,.ct171-provider-tabs,.ct171-top-row,[data-page="discover"] .tabs{scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-inline:contain!important}
.row::-webkit-scrollbar,.ct169-cast-row::-webkit-scrollbar,.ct169-related-row::-webkit-scrollbar,.ct169-season-row::-webkit-scrollbar,.ct169-season-chart-carousel::-webkit-scrollbar,.ct171-provider-row::-webkit-scrollbar,.ct171-provider-tabs::-webkit-scrollbar,.ct171-top-row::-webkit-scrollbar,[data-page="discover"] .tabs::-webkit-scrollbar{display:none!important}
[data-page="discover"] .tabs{position:sticky!important;top:54px!important;z-index:70!important;background:#041017e8!important;backdrop-filter:blur(14px)!important;padding:6px 0 8px!important}
.discover-section{padding:8px!important}.foryou-grid{gap:7px!important}.ct166-slot{flex-basis:112px!important;min-width:112px!important}
.ct169-detail-page{padding-left:0!important;padding-right:0!important}.ct169-detail-backdrop{left:-10px!important;right:-10px!important;height:330px!important}
.ct169-detail-hero.ct173-detail-window{width:100%!important;max-width:none!important;margin:12px 0 18px!important;padding:14px!important;border-radius:16px!important;grid-template-columns:118px minmax(0,1fr)!important;gap:13px!important;align-items:start!important;min-height:0!important}
.ct169-poster-wrap,.ct169-detail-poster{width:118px!important;max-width:118px!important}.ct169-detail-copy h1{font-size:clamp(25px,8vw,38px)!important}.ct169-detail-copy p{font-size:11px!important;line-height:1.45!important;margin-top:13px!important}.ct169-main-actions{gap:6px!important;flex-wrap:wrap!important;margin-top:14px!important}.ct169-main-actions button{padding:9px 10px!important;font-size:9px!important}
.ct171-watch-section,.ct169-detail-section{padding-left:2px!important;padding-right:2px!important}.ct171-provider-card{flex:0 0 102px!important}.ct171-provider-logo{width:45px!important;height:45px!important}
.ct169-drawer{width:100vw!important;max-width:100vw!important;padding:10px!important;border-left:0!important}.ct169-drawer-top{top:-10px!important;padding-top:12px!important}.ct169-drawer-ep{grid-template-columns:104px minmax(0,1fr)!important;gap:8px!important}.ct169-drawer-still{width:104px!important}.ct169-drawer-ep-copy p{-webkit-line-clamp:3!important}
.ct169-season-chart-card{flex-basis:94vw!important}.ct169-chart-scroll{overflow-x:auto!important}.ct169-chart-scroll svg{min-width:680px!important}
.ct169-activity-track{min-width:920px!important}.ct169-activity-scroll{overflow-x:auto!important}
.ct169-sports-tools .search{grid-template-columns:20px minmax(0,1fr)!important}.ct169-sports-tools [data-sports-date]{grid-column:1/-1!important;border-left:0!important;border-top:1px solid #24485c!important;padding:8px 0 0!important}
[data-sports] .tabs,[data-sports] .row{overflow-x:auto!important;flex-wrap:nowrap!important}
.stats-grid,.ct167-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
.toast{left:10px!important;right:10px!important;bottom:76px!important;max-width:none!important}
.version{padding-bottom:8px!important}
@media(max-width:390px){.ct169-detail-hero.ct173-detail-window{grid-template-columns:96px minmax(0,1fr)!important;padding:11px!important}.ct169-poster-wrap,.ct169-detail-poster{width:96px!important;max-width:96px!important}.ct169-detail-copy h1{font-size:24px!important}.ct169-meta{font-size:9px!important}.ct169-drawer-ep{grid-template-columns:92px minmax(0,1fr)!important}.ct169-drawer-still{width:92px!important}}
`;
css+='\n'+androidCss;

html=html
  .replace(/<meta name="viewport"[^>]*>/i,'<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">')
  .replace(/<link rel="icon"[^>]*>/i,'')
  .replace(/<link rel="stylesheet"[^>]*app-v173\.css[^>]*>/i,`<style data-ct-android="r173-css">${css}</style>`)
  .replace(/<script defer src="\/app-v173\.js[^>]*><\/script>/i,`<script data-ct-android="r173-js">${js}</script>`)
  .replace('</head>',`<meta name="ct-android-bundle" content="android-v0.99.7.4-r173-parity"></head>`);

if(html.includes('<script defer src="/app-v173.js')||html.includes('<link rel="stylesheet" href="/app-v173.css'))throw new Error('Android 0.99.7.4 still depends on root Web assets');
for(const marker of[
  'r173-detail-left-window','android-v0.99.7.4-r173-parity','web-r173-full-functional-parity',
  'Top 10','Onde Assistir','Títulos Relacionados','Assistido por dia','cinetracker_series_episode_state_v1',
  'only-10-canonical-services-no-plan-or-channel-duplicates','data-ct169-season','data-ct171-activity-day',
  'global-entity-search','ct-sports-search','Produção:'
])if(!html.includes(marker))throw new Error(`Android 0.99.7.4 missing frozen r173 feature: ${marker}`);

await rm(androidDir,{recursive:true,force:true});
await mkdir(androidDir,{recursive:true});
await writeFile(resolve(androidDir,'index.html'),html,'utf8');
console.log('ANDROID_09974_PREPARED web=r173 parity=full mobile=responsive nav=web-native-5tabs');
