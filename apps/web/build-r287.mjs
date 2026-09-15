import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r286-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v286.js'),'utf8'),readFile(resolve(dist,'app-v286.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r287-home-liveness-continue.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r287 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r287 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r287 missing '+x)};
for(const x of[
 "window.__ctR287='home-interaction-liveness+available-episode-priority';",
 "window.__ctR287Home='pointer-click-authority+overlay-hit-test';",
 "window.__ctR287Series='urgent-availability-before-budget';",
 'function ct287Candidates(rows)',
 'async function ct287PrepareHome(payload,seq)',
 'ct285PrepareHome=ct287PrepareHome;',
 "window.addEventListener('pointerup'",
 "window.addEventListener('click'",
 "window.addEventListener('keydown'",
 'document.elementsFromPoint'
])must(patch,x);
must(js,"window.__ctR286='related-open-watchlist-seen-window-capture'");
js=once(js,"window.__ctWebBuild='1.0.77';window.__ctOfficialVersion='1.0.77';","window.__ctWebBuild='1.0.78';window.__ctOfficialVersion='1.0.78';",'version');
js=once(js,"const REVISION='r286-official-1.0.77';","const REVISION='r287-official-1.0.78';",'revision');
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.78 r287 — Home controls remain direct interactive targets. */
[data-home] [data-home-tab],[data-home] [data-media],.sidebar [data-nav]{touch-action:manipulation}
[data-home] [data-home-tab]{pointer-events:auto!important}
`;
html=html.replaceAll('app-v286.js','app-v287.js').replaceAll('app-v286.css','app-v287.css').replaceAll('CineTracker • v1.0.77','CineTracker • v1.0.78');
sw=sw.replaceAll('ct-web-1.0.77-r286','ct-web-1.0.78-r287').replaceAll('app-v286.js','app-v287.js').replaceAll('app-v286.css','app-v287.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.78',revision:'r287-official-1.0.78',base:'r286-production',scope:'home-liveness+series-availability',home_interaction_owner:'r287-window-pointer-click',home_overlay_hit_test:true,home_tabs_liveness:true,home_media_open_liveness:true,home_main_nav_liveness:true,home_available_episode_priority:'all-urgent-before-budget',home_reconcile_default_budget:40,home_available_series_forced_reconcile:true,related_titles:'r286-preserved',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v287.js'),js,'utf8'),writeFile(resolve(dist,'app-v287.css'),css,'utf8'),writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v286.js'),{force:true}),rm(resolve(dist,'app-v286.css'),{force:true})]);
console.log('WEB_R287_READY home=liveness continue=urgent-availability r286=preserved');
