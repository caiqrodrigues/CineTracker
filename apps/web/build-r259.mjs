import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* r259 deliberately composes from r257, skipping the r258 DOM-repair layer that regressed the real account. */
await import('./build-r257-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v257.js'),'utf8'),
  readFile(resolve(dist,'app-v257.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r259-fast-home-discover.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r259 missing '+label)};
for(const x of[
  "window.__ctR257='exact-sequence-discover-personal-exclusions-horizontal-drag-f1-grid'",
  "window.__ctR257F1='weekend-sessions+next-qualifying-grid+previous-start-finish-grid'",
  "const REVISION='r257-official-1.0.48';",
  "if(root256&&window.MutationObserver){try{new MutationObserver(",
  "if(app257&&window.MutationObserver){try{new MutationObserver(",
  "el.addEventListener('pointerdown',e=>{if(e.button!=null&&e.button!==0)return;"
])must(js,x,x);
for(const x of[
  "window.__ctR259='fast-home-discover-no-observers'",
  "window.__ctR259Home='r5-first-paint+weekly-priority-only+no-dom-repair'",
  "window.__ctR259Discover='v108-fast-state+staged-first-page+never-global-blank'",
  "window.__ctR259Horizontal='css-native-pan-x-no-mutation-observer'",
  "window.__ctR259Frozen='sports-profile-configs-r257-unchanged'"
])must(runtime,x,x);
if(runtime.includes('MutationObserver'))throw new Error('r259 runtime must not install MutationObserver');
if(!js.includes('\nboot();'))throw new Error('r259 boot insertion point missing');

/* Disable the two inherited permanent DOM observers. Sports/Profile keep their explicit render hooks. */
js=js.replace("if(root256&&window.MutationObserver){try{new MutationObserver(","if(false&&root256&&window.MutationObserver){try{new MutationObserver(")
     .replace("if(app257&&window.MutationObserver){try{new MutationObserver(","if(false&&app257&&window.MutationObserver){try{new MutationObserver(")
     .replace("el.addEventListener('pointerdown',e=>{if(e.button!=null&&e.button!==0)return;","el.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;if(e.button!=null&&e.button!==0)return;");
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r257-official-1.0.48';","const REVISION='r259-official-1.0.50';")
 .replace("window.__ctWebBuild='1.0.48';window.__ctOfficialVersion='1.0.48';","window.__ctWebBuild='1.0.50';window.__ctOfficialVersion='1.0.50';")
 .replaceAll('CineTracker • v1.0.48','CineTracker • v1.0.50')
 .replaceAll("JSON.stringify({version:'1.0.48',revision:REVISION","JSON.stringify({version:'1.0.50',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.50 r259 — no DOM observer; native local horizontal scroll. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}
.ct259-discover-tabs,.ct259-discover-types,.ct259-media-rail,.season-tabs,.season-list,.season-row,[data-seasons],.ct169-season-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct244-seasons-scroll,.ct244-chart-scroll,.episode-list,.episodes-list,.episodes-row,.episode-row,[data-episodes],[data-season-episodes],.related-scroll,.related-grid,.related-row,[data-related],.similar-scroll,.similar-grid,.similar-row,[data-similar],.cast-scroll,.cast-grid,.cast-row,[data-cast],.actors-scroll,.actors-grid,.actors-row,[data-actors],.people-scroll,.people-grid,.people-row,[data-people],.episode-graph,.graph-shell,.chart-wrap,.chart-scroll,[data-chart],[data-episode-chart],.ct255-f1-tabs,.ct255-f1-list,.ct255-f1-table,.ct257-f1-sessions,.ct257-f1-grid{box-sizing:border-box!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct259-discover-tabs,.ct259-discover-types{display:flex!important;flex-flow:row nowrap!important;gap:8px!important;width:100%!important;padding-bottom:8px!important}.ct259-discover-tabs>* ,.ct259-discover-types>*{flex:0 0 auto!important;white-space:nowrap!important}
.ct259-media-rail{display:flex!important;flex-flow:row nowrap!important;gap:12px!important;width:100%!important;padding:4px 2px 10px!important}
.ct259-media-card{flex:0 0 154px!important;width:154px!important;min-width:154px!important;overflow:hidden!important;border:1px solid rgba(77,145,180,.34)!important;border-radius:14px!important;background:#081c27!important}.ct259-media-card>button{display:block!important;width:100%!important;padding:0!important;border:0!important;background:transparent!important;color:inherit!important;text-align:left!important}.ct259-media-poster{display:block!important;width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important;background:#0b2634!important}.ct259-poster-empty{display:grid!important;place-items:center!important;color:#7595a5!important;font-size:10px!important}.ct259-media-copy{display:grid!important;gap:5px!important;padding:9px!important}.ct259-media-copy b{font-size:11px!important;line-height:1.25!important;white-space:normal!important}.ct259-media-copy small{font-size:9px!important;color:#8ea8b5!important;line-height:1.3!important}.ct259-media-copy span{font-size:9px!important;color:#b9d9e8!important}.ct259-discover-block{display:grid!important;gap:9px!important;margin:0 0 18px!important}.ct259-discover-block h2{margin:0!important}.ct259-block-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}.ct259-block-loading{min-height:74px!important;display:grid!important;align-items:center!important;padding:12px!important;border:1px solid rgba(69,126,155,.24)!important;border-radius:12px!important;color:#87a7b6!important;background:#071922!important}.ct259-updating{position:absolute!important;right:18px!important;z-index:4!important;padding:5px 9px!important;border:1px solid #315f78!important;border-radius:999px!important;background:#0c2b3d!important;color:#9ed7f5!important;font-size:9px!important}
@media(max-width:700px){.ct259-media-card{flex-basis:138px!important;width:138px!important;min-width:138px!important}}
`;

html=html.replaceAll('r257-official-1.0.48','r259-official-1.0.50').replace(/app-v257\.js/g,'app-v259.js').replace(/app-v257\.css/g,'app-v259.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r259 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.50-r259';").replace(/app-v257\.js/g,'app-v259.js').replace(/app-v257\.css/g,'app-v259.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v259.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v259.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.50',revision:'r259-official-1.0.50',base:'r257-official-1.0.48',scope:'fast-home-discover-no-observers',home:'r5-first-paint+weekly-priority-only+no-dom-repair',discover:'v108-fast-state+staged-first-page+never-global-blank',horizontal:'css-native-pan-x-no-mutation-observer',frozen:'sports-profile-configs-r257',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v257.js'),{force:true}),rm(resolve(dist,'app-v257.css'),{force:true})]);
console.log('WEB_1_0_50_READY r259 fast-home-discover no-observers');
