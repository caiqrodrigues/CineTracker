import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* r258 keeps the approved r257 Sports/Profile/Configs and replaces only Home/Discover/mobile horizontal behavior proven wrong by the latest account video. */
await import('./build-r257-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v257.js'),'utf8'),
  readFile(resolve(dist,'app-v257.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r258-account-ground-truth.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r258 missing '+label)};
for(const x of[
 "window.__ctR257='exact-sequence-discover-personal-exclusions-horizontal-drag-f1-grid'",
 "window.__ctR257F1='weekend-sessions+next-qualifying-grid+previous-start-finish-grid'",
 "const REVISION='r257-official-1.0.48';"
])must(js,x,x);
for(const x of[
 "window.__ctR258='account-ground-truth-home-discover-native-scroll'",
 "window.__ctR258Home='payload-pending-first+raw-smackdown-priority-sequence+historic-holes-ignored'",
 "window.__ctR258Discover='safe-item-hydration+strict-personal-exclusions+cached-complete-pools'",
 "window.__ctR258Horizontal='native-pan-x+mouse-drag+discover-and-details'",
 "window.__ctR258Frozen='sports-profile-configs-r257-unchanged'"
])must(runtime,x,x);

/* The r256/r257 all-series audits caused visible tail latency: SmackDown could update while Raw/Stuart still showed old state. r258 owns Home auditing. */
if(!js.includes('void auditHomeExact257()'))throw new Error('r258 could not disable r257 slow Home audit');
js=js.replaceAll('void auditHomeExact257()','void 0/*r258-home-authority*/');
if(!js.includes('void auditHome256()'))throw new Error('r258 could not disable r256 slow Home audit');
js=js.replaceAll('void auditHome256()','void 0/*r258-home-authority*/');

/* On Android, r257 captured touch pointers while CSS allowed only pan-y. Keep its desktop drag but let touch use the browser native horizontal scroller. */
const oldPointer="el.addEventListener('pointerdown',e=>{if(e.button!=null&&e.button!==0)return;";
const newPointer="el.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;if(e.button!=null&&e.button!==0)return;";
if(!js.includes(oldPointer))throw new Error('r258 r257 pointer patch point missing');
js=js.replace(oldPointer,newPointer);

if(!js.includes('\nboot();'))throw new Error('r258 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r257-official-1.0.48';","const REVISION='r258-official-1.0.49';")
 .replace("window.__ctWebBuild='1.0.48';window.__ctOfficialVersion='1.0.48';","window.__ctWebBuild='1.0.49';window.__ctOfficialVersion='1.0.49';")
 .replaceAll('CineTracker • v1.0.48','CineTracker • v1.0.49')
 .replaceAll("JSON.stringify({version:'1.0.48',revision:REVISION","JSON.stringify({version:'1.0.49',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.49 r258 — native Android horizontal rails + resilient Discover. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}
.ct258-native-x,.ct258-media-rail,.ct257-local-x,.ct257-drag-x{box-sizing:border-box!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct258-native-x::-webkit-scrollbar,.ct258-media-rail::-webkit-scrollbar{height:9px!important}.ct258-native-x::-webkit-scrollbar-thumb,.ct258-media-rail::-webkit-scrollbar-thumb{background:rgba(92,184,232,.72)!important;border-radius:999px!important}.ct258-native-x::-webkit-scrollbar-track,.ct258-media-rail::-webkit-scrollbar-track{background:rgba(5,22,31,.82)!important;border-radius:999px!important}
.ct258-discover-tabs,.ct258-discover-types{display:flex!important;flex-flow:row nowrap!important;gap:8px!important;width:100%!important;max-width:100%!important;padding-bottom:9px!important;overflow-x:auto!important}.ct258-discover-tabs>*,.ct258-discover-types>*{flex:0 0 auto!important;white-space:nowrap!important}
.ct258-discover-types{margin-top:2px!important;margin-bottom:7px!important}
.ct258-media-rail{display:flex!important;flex-flow:row nowrap!important;gap:12px!important;width:100%!important;max-width:100%!important;padding:2px 2px 12px!important}.ct258-media-card{flex:0 0 184px!important;min-width:184px!important;max-width:184px!important}.ct258-media-poster{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important;display:block!important}
.ct258-discover-block{overflow:hidden!important}.ct258-skeleton{padding:18px!important;color:#819dab!important}
@media(max-width:700px){.ct258-media-card{flex-basis:174px!important;min-width:174px!important;max-width:174px!important}}
`;

html=html.replaceAll('r257-official-1.0.48','r258-official-1.0.49').replace(/app-v257\.js/g,'app-v258.js').replace(/app-v257\.css/g,'app-v258.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r258 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.49-r258';").replace(/app-v257\.js/g,'app-v258.js').replace(/app-v257\.css/g,'app-v258.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v258.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v258.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.49',revision:'r258-official-1.0.49',base:'r257-official-1.0.48',scope:'account-ground-truth-home-discover-native-scroll',home:'payload-pending-first+raw-smackdown-priority-sequence+historic-holes-ignored',discover:'safe-item-hydration+strict-personal-exclusions+cached-complete-pools',horizontal:'native-pan-x+mouse-drag+discover-and-details',frozen:'sports-profile-configs-r257-unchanged',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v257.js'),{force:true}),rm(resolve(dist,'app-v257.css'),{force:true})]);
console.log('WEB_1_0_49_READY r258 account-ground-truth');
