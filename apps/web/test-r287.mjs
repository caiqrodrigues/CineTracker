import {readFile} from 'node:fs/promises';
const [js,runtime,release,html,sw]=await Promise.all([
 readFile('dist/app-v287.js','utf8'),readFile('runtime-r287-home-liveness-continue.js','utf8'),readFile('dist/release.json','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r287 missing '+x)};
for(const x of[
 "window.__ctR287='home-interaction-liveness+available-episode-priority'",
 "window.__ctR287Home='pointer-click-authority+overlay-hit-test'",
 "window.__ctR287Series='urgent-availability-before-budget'",
 'function ct287Urgent(row)',
 'function ct287Candidates(rows)',
 'async function ct287PrepareHome(payload,seq)',
 'ct285PrepareHome=ct287PrepareHome;',
 'document.elementsFromPoint',
 "target.matches('[data-home-tab]')",
 "target.matches('[data-nav]')",
 "target.matches('[data-media]')"
])must(js,x);
for(const x of["window.__ctR286='related-open-watchlist-seen-window-capture'",'await addWatchlist(spec.type,spec.id)','await markSeen(spec.type,spec.id)'])must(js,x);
if(runtime.includes('setInterval(')||runtime.includes('MutationObserver'))throw new Error('r287 persistent polling/observer forbidden');
for(const forbidden of ['Stuart','Lioness','WWE Raw','SmackDown'])if(runtime.includes(forbidden))throw new Error('r287 title-specific Home rule forbidden: '+forbidden);
must(html,'app-v287.js');must(sw,"const CACHE='ct-web-1.0.78-r287';");
const m=JSON.parse(release);if(m.version!=='1.0.78'||m.revision!=='r287-official-1.0.78'||m.home_tabs_liveness!==true||m.home_media_open_liveness!==true||m.home_available_series_forced_reconcile!==true)throw new Error('bad r287 release identity');
console.log('R287_STATIC_OK home=liveness continue=generic-urgent related=r286-preserved');
