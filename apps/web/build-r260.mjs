import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r259-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v259.js'),'utf8'),
  readFile(resolve(dist,'app-v259.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r260-ux-recovery.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r260 missing '+label)};
for(const x of[
  "window.__ctR259='fast-home-discover-no-observers'",
  "window.__ctR259Home='r5-first-paint+weekly-priority-only+no-dom-repair'",
  "window.__ctR259Discover='v108-fast-state+staged-first-page+never-global-blank'",
  "const REVISION='r259-official-1.0.50';"
])must(js,x,x);
for(const x of[
  "window.__ctR260='discover-standard-cards+home-first-page-cache+isolated-modal-rails'",
  "window.__ctR260Discover='standard-2x3-176-desktop-154-mobile'",
  "window.__ctR260Home='persistent-first-page+background-refresh+metadata-cache+skeleton'",
  "window.__ctR260Horizontal='isolated-modal-rails+native-touch+delegated-mouse-drag'",
  "window.__ctR260Frozen='sports-profile-configs-f1-r259-unchanged'"
])must(runtime,x,x);
if(runtime.includes('MutationObserver'))throw new Error('r260 must not add MutationObserver');
if(!js.includes('\nboot();'))throw new Error('r260 boot insertion point missing');

js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r259-official-1.0.50';","const REVISION='r260-official-1.0.51';")
  .replace("window.__ctWebBuild='1.0.50';window.__ctOfficialVersion='1.0.50';","window.__ctWebBuild='1.0.51';window.__ctOfficialVersion='1.0.51';")
  .replaceAll('CineTracker • v1.0.50','CineTracker • v1.0.51')
  .replaceAll("JSON.stringify({version:'1.0.50',revision:REVISION","JSON.stringify({version:'1.0.51',revision:REVISION");

/* Home TMDB reconciliation stays background-only and no longer competes with first paint. */
const auditNeedle="},80);return homeCache})();";
if(!js.includes(auditNeedle))throw new Error('r260 could not locate r259 weekly audit delay');
js=js.replace(auditNeedle,"},900);return homeCache})();");

css+=`
/* CineTracker Web 1.0.51 r260 — standardized Discover cards and isolated detail rails. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}
.modal,.modal-panel,.detail-modal,.detail-panel,[role="dialog"],[data-modal],.page,.content{min-width:0!important;max-width:100%!important}

/* Discover: restore the approved standard card footprint while preserving exact 2:3 poster proportion. */
.ct259-media-rail{display:flex!important;flex-flow:row nowrap!important;gap:14px!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;touch-action:pan-x pan-y!important}
.ct259-media-card{flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important}
.ct259-media-poster{display:block!important;width:100%!important;aspect-ratio:2/3!important;height:auto!important;object-fit:cover!important}
.ct259-media-copy{min-height:78px!important}
@media(max-width:700px){
  .ct259-media-card{flex-basis:154px!important;width:154px!important;min-width:154px!important;max-width:154px!important}
}

/* Utility classes requested for modal/detail rails. */
[data-ct260-x].flex{display:flex!important}
[data-ct260-x].flex-nowrap{flex-wrap:nowrap!important;flex-flow:row nowrap!important}
[data-ct260-x].overflow-x-auto{overflow-x:auto!important;overflow-y:hidden!important}
[data-ct260-x].scrollbar-thin{scrollbar-width:thin!important;scrollbar-gutter:stable!important}
[data-ct260-x].whitespace-nowrap{white-space:nowrap!important}
[data-ct260-x].touch-pan-x{touch-action:pan-x pan-y!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important}
[data-ct260-x]{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;cursor:grab!important;padding-bottom:7px!important}
[data-ct260-x]>*{flex:0 0 auto!important;min-width:0}
[data-ct260-x].ct260-dragging{cursor:grabbing!important;user-select:none!important}
[data-ct260-x]::-webkit-scrollbar{height:6px}
[data-ct260-x]::-webkit-scrollbar-track{background:rgba(17,48,64,.45)}
[data-ct260-x]::-webkit-scrollbar-thumb{background:rgba(117,177,207,.7);border-radius:999px}

/* Avoid whitespace utility leaking into card copy or chart labels. */
[data-ct260-x] article,[data-ct260-x] article *,[data-ct260-x] .card,[data-ct260-x] .card *,[data-ct260-x] svg text{white-space:normal!important}

/* Lightweight Home skeleton: cached first page paints immediately when available; cold starts never show a frozen blank pane. */
.ct260-home-more{display:block!important;margin:14px auto 4px!important;padding:8px 14px!important;border:1px solid rgba(92,184,232,.5)!important;border-radius:999px!important;background:#0a2735!important;color:#b9e6fb!important;font:inherit!important;cursor:pointer!important}
.ct260-home-skeleton{display:grid!important;gap:18px!important;padding:4px 0!important}
.ct260-home-skeleton section{display:grid!important;gap:10px!important}
.ct260-sk-title{width:180px;height:15px;border-radius:999px;background:linear-gradient(90deg,#0b2430 20%,#14394a 50%,#0b2430 80%);background-size:220% 100%;animation:ct260pulse 1.15s linear infinite}
.ct260-sk-title.short{width:132px}
.ct260-sk-row{display:flex!important;gap:10px!important;overflow:hidden!important}
.ct260-sk-row i{display:block!important;flex:0 0 176px!important;height:92px!important;border-radius:12px!important;background:linear-gradient(90deg,#081d28 20%,#123445 50%,#081d28 80%);background-size:220% 100%;animation:ct260pulse 1.15s linear infinite}
@media(max-width:700px){.ct260-sk-row i{flex-basis:154px!important}}
@keyframes ct260pulse{0%{background-position:200% 0}100%{background-position:-20% 0}}
@media(prefers-reduced-motion:reduce){.ct260-sk-title,.ct260-sk-row i{animation:none!important}}
`;

html=html.replaceAll('r259-official-1.0.50','r260-official-1.0.51').replace(/app-v259\.js/g,'app-v260.js').replace(/app-v259\.css/g,'app-v260.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r260 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.51-r260';").replace(/app-v259\.js/g,'app-v260.js').replace(/app-v259\.css/g,'app-v260.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v260.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v260.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({
    version:'1.0.51',
    revision:'r260-official-1.0.51',
    base:'r259-official-1.0.50',
    scope:'discover-card-home-load-modal-horizontal-scroll',
    discover:'standard-2x3-176-desktop-154-mobile',
    home:'persistent-first-page+background-refresh+metadata-cache+skeleton',
    horizontal:'isolated-modal-rails+native-touch+delegated-mouse-drag',
    frozen:'sports-profile-configs-f1-r259',
    android:'unchanged-1.0.20',
    generated_at:new Date().toISOString()
  },null,2),'utf8')
]);
await Promise.all([
  rm(resolve(dist,'app-v259.js'),{force:true}),
  rm(resolve(dist,'app-v259.css'),{force:true})
]);
console.log('WEB_1_0_51_READY r260 discover-cards home-cache modal-scroll');
