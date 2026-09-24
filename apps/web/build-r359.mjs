import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r358.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v358.js'),'utf8'),
 readFile(resolve(dist,'app-v358.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r359-home-cache-actions-direct.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r359 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r359 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.149';window.__ctOfficialVersion='1.0.149';",
 "const REVISION='r358-official-1.0.149';",
 "const version='1.0.149',revision='r358-official-1.0.149';",
 "window.__ctR358Marker='true-first-capture-foryou-actions+home-ready-before-reveal'",
 "const h=window.__ctR358Early;",
 "await primeTvState();",
 "await waitHomeReady({timeout:12000});",
 "cinetracker_home_payload_v334",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR359Marker='home-v359-cache-first+foryou-single-slot-direct-actions'",
 "window.__ctR359Early=early359",
 "fastPrepareHome359",
 "backgroundTvRefresh359"
])must(runtime,x);

/* Home first payload comes from the DB cache that already contains next-episode metadata. */
js=js.replaceAll('cinetracker_home_payload_v334','cinetracker_home_payload_v359');

/* The physically-first capture stays the same listener, but r359 becomes its sole current owner. */
js=once(js,"const h=window.__ctR358Early;","const h=window.__ctR359Early||window.__ctR358Early;",'first capture owner');

/* r358 used to block Home on TMDB/Edge refresh and post-paint hydration.
   r359 starts refresh in background and trusts the v359 DB payload for first paint. */
js=once(js,"await primeTvState();","void window.__ctR359?.backgroundTvRefresh?.();",'nonblocking TV refresh');
js=once(js,"await waitHomeReady({timeout:12000});","document.documentElement.dataset.ct359HomeReadySource='db-cache';",'remove late Home hydration wait');

js=once(js,"window.__ctWebBuild='1.0.149';window.__ctOfficialVersion='1.0.149';","window.__ctWebBuild='1.0.150';window.__ctOfficialVersion='1.0.150';",'version');
js=once(js,"const REVISION='r358-official-1.0.149';","const REVISION='r359-official-1.0.150';",'revision');
js=once(js,"const version='1.0.149',revision='r358-official-1.0.149';","const version='1.0.150',revision='r359-official-1.0.150';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v358.js','app-v359.js').replaceAll('app-v358.css','app-v359.css').replaceAll('v1.0.149','v1.0.150').replaceAll('r358-official-1.0.149','r359-official-1.0.150');
sw=sw.replaceAll('ct-web-1.0.149-r358','ct-web-1.0.150-r359').replaceAll('app-v358.js','app-v359.js').replaceAll('app-v358.css','app-v359.css');
css+='\n/* CineTracker Web 1.0.150 r359 — DB-cache first Home + direct single-slot Pra Você actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.150',revision:'r359-official-1.0.150',base:'r358-production',
 scope:'home-db-cache-first-paint+foryou-direct-single-slot-actions',
 home_payload:'cinetracker_home_payload_v359',
 home_startup:'db-episode-metadata-first-paint+nonblocking-background-tv-refresh',
 home_episode_reveal:'no-live-hydration-wait',
 discover_foryou_click_owner:'r359-physical-first-window-capture',
 discover_foryou_actions:'r359-direct-state+clicked-slot-render+background-persist',
 discover_foryou_repaint:'clicked-slot-only-no-library-change-event',
 discover_foryou_swap_memory:'recommendation-record-v113-swapped',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r359 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v359.js'),js),
 writeFile(resolve(dist,'app-v359.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v358.js'),{force:true}),rm(resolve(dist,'app-v358.css'),{force:true})]);
console.log('WEB_R359_READY DB cache first Home + direct single-slot Pra Você actions');
