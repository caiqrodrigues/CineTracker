import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r406.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v406.js'),'utf8'),readFile(resolve(dist,'app-v406.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r408-home-discover-owner.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r408 expected one '+label+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r408 forbidden '+bad);
for(const need of ['history.scrollRestoration','cinetracker_discover_foryou_v396','data-ct408-action','↻ Trocar','scheduleOwnerCheck','baseLoadMovies'])if(!runtime.includes(need))throw new Error('r408 runtime missing '+need);

// r374 is the first Home-tab capture listener and stops propagation: hand off from its private closure.
js=once(js,
`function switchTab(kind,event){
 const wanted=kind==='movies'?'movies':'series';
 event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
 applyTab(wanted);scheduleReset(wanted);return true;
}`,
`function switchTab(kind,event){
 const wanted=kind==='movies'?'movies':'series';
 event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
 applyTab(wanted);scheduleReset(wanted);queueMicrotask(()=>window.__ctR408?.enterHome?.(wanted,false));return true;
}`,'r374 tab handoff');
js=once(js,"function scheduleReset(kind){\n const token=++resetToken;userMoved=false;lastKind=kind==='movies'?'movies':'series';","function scheduleReset(kind){\n if(window.__ctR408?.alignHome)return window.__ctR408.alignHome(kind,true);\n const token=++resetToken;userMoved=false;lastKind=kind==='movies'?'movies':'series';",'r374 scroll handoff');
js=once(js,"function scheduleHome393(kind=activeKind(),fresh=false){\n if(fresh){homeAnchorToken393++;homeUserMoved393=false}const token=homeAnchorToken393;","function scheduleHome393(kind=activeKind(),fresh=false){\n if(window.__ctR408?.alignHome)return window.__ctR408.alignHome(kind,!!fresh);\n if(fresh){homeAnchorToken393++;homeUserMoved393=false}const token=homeAnchorToken393;",'r393 scroll handoff');
js=once(js,"function scheduleAlign(kind=activeHome(),fresh=true){\n if(fresh){alignToken++;userMoved=false}const token=alignToken;","function scheduleAlign(kind=activeHome(),fresh=true){\n if(window.__ctR408?.alignHome)return window.__ctR408.alignHome(kind,!!fresh);\n if(fresh){alignToken++;userMoved=false}const token=alignToken;",'r404 scroll handoff');

// r404 private route handlers can still run from old listeners. Stop them before they re-own Home/Pra Voce.
js=once(js,"function bindOwners404(){\n", "function bindOwners404(){\n if(window.__ctR408?.bind)return window.__ctR408.bind();\n",'r404 bind handoff');
js=once(js,"function enterHome404(kind=activeHome(),force=false){\n", "function enterHome404(kind=activeHome(),force=false){\n if(window.__ctR408?.enterHome)return window.__ctR408.enterHome(kind,force);\n",'r404 Home handoff');
js=once(js,"function forYouBurst404(force=false){\n", "function forYouBurst404(force=false){\n if(window.__ctR408?.enterForYou)return window.__ctR408.enterForYou(force);\n",'r404 ForYou burst handoff');

// r406 ForYou closures become thin delegates. They can no longer repaint two-button legacy cards.
js=once(js,"async function loadForYou(force=false){if(!baseLoadForYou)return false;", "async function loadForYou(force=false){if(window.__ctR408?.loadForYou)return window.__ctR408.loadForYou(force);if(!baseLoadForYou)return false;",'r406 ForYou load');
js=once(js,"function renderForYou(){const r=baseRenderForYou?baseRenderForYou():false;", "function renderForYou(){if(window.__ctR408?.renderForYou)return window.__ctR408.renderForYou();const r=baseRenderForYou?baseRenderForYou():false;",'r406 ForYou render');
js=once(js,"function swapForYou(name){const r=baseSwapForYou?baseSwapForYou(name):false;", "function swapForYou(name){if(window.__ctR408?.swap)return window.__ctR408.swap(name);const r=baseSwapForYou?baseSwapForYou(name):false;",'r406 ForYou swap');
js=once(js,'for(const ms of [60,250,800,1800,4200])setTimeout(()=>enterHome(kind,false),ms)','for(const ms of [0,100])setTimeout(()=>enterHome(kind,false),ms)','r406 Home late timers');
js=once(js,'for(const ms of [80,300,900,2200,5000,12000,30000,46000])setTimeout(()=>{bind();void loadForYou(false)},ms)','for(const ms of [0,100])setTimeout(()=>{bind();void loadForYou(false)},ms)','r406 ForYou late timers');

js=once(js,"window.__ctWebBuild='1.0.197';window.__ctOfficialVersion='1.0.197';","window.__ctWebBuild='1.0.199';window.__ctOfficialVersion='1.0.199';",'version');
js=once(js,"const REVISION='r406-official-1.0.197';","const REVISION='r408-official-1.0.199';",'revision');
js=once(js,"const version='1.0.197',revision='r406-official-1.0.197';","const version='1.0.199',revision='r408-official-1.0.199';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime injection');
html=html.replaceAll('app-v406.js','app-v407.js').replaceAll('app-v406.css','app-v407.css').replaceAll('v1.0.197','v1.0.199').replaceAll('r406-official-1.0.197','r408-official-1.0.199');
sw=sw.replaceAll('ct-web-1.0.197-r406','ct-web-1.0.199-r408').replaceAll('app-v406.js','app-v407.js').replaceAll('app-v406.css','app-v407.css');
css+='\n/* CineTracker Web 1.0.199 r408 */\n[data-home]{overflow-anchor:none!important}\n[data-ct408-foryou] .ct408-actions.three{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;overflow:visible!important}\n[data-ct408-foryou] .ct408-actions.two{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;overflow:visible!important}\n[data-ct408-foryou] .ct408-actions button{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important;padding:6px 2px!important;font-size:10px!important;white-space:nowrap!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.199',revision:'r408-official-1.0.199',base:'r406+r408-live-owner',scope:'home-entry+home-movies+discover-foryou',home_entry:'one-shot absolute semantic alignment after the real main section exists; browser restoration manual',home_movies:'direct r406/v405 loader invoked after Movies activation; first page paints immediately',home_series:'r406 unchanged',discover_foryou:'single v396 payload with final renderer plus finite late-painter recovery',discover_actions:'daily/fresh Watchlist+Visto+Trocar; watch Visto+Trocar; optimistic per-slot lock',freeze_guard:'bounded timers only; no observer/interval/unbounded loop/full reload',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v407.js'),js),writeFile(resolve(dist,'app-v407.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v406.js'),{force:true}),rm(resolve(dist,'app-v406.css'),{force:true})]);
const [bh,bs,bj]=await Promise.all([readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'app-v407.js'),'utf8')]);
if(!bh.includes('app-v407.js')||bh.includes('app-v406.js'))throw new Error('r408 html asset');
if(!bs.includes('ct-web-1.0.199-r408')||!bs.includes('app-v407.js'))throw new Error('r408 sw asset');
for(const need of ["window.__ctR408Marker='home-semantic-one-shot+movie-direct-loader+foryou-self-heal-actions'","queueMicrotask(()=>window.__ctR408?.enterHome?.(wanted,false))","if(window.__ctR408?.loadForYou)return window.__ctR408.loadForYou(force);","cinetracker_discover_foryou_v396"])if(!bj.includes(need))throw new Error('r408 assembled missing '+need);
console.log('WEB_R408_READY');
