import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r336.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v336.js'),'utf8'),
 readFile(resolve(dist,'app-v336.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r337-search-home-foryou.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r337 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r337 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.127';window.__ctOfficialVersion='1.0.127';",
 "const REVISION='r336-official-1.0.127';",
 "const version='1.0.127',revision='r336-official-1.0.127';",
 "window.__ctR336Marker='episode-search+home-anchor-on-tab+foryou-actions-swap-immediate'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR337Marker='episode-catalog-search+home-desired-tab-settle+foryou-readable-same-kind-actions'",
 "cinetracker_episode_search_v337",
 "cinetracker_home_tab_v337",
 "window.__ctR336EarlyHandle=earlyHandle337",
 "--ct337-slot-w"
])must(runtime,x);

js=once(js,"window.__ctWebBuild='1.0.127';window.__ctOfficialVersion='1.0.127';","window.__ctWebBuild='1.0.128';window.__ctOfficialVersion='1.0.128';",'web version');
js=once(js,"const REVISION='r336-official-1.0.127';","const REVISION='r337-official-1.0.128';",'revision');
js=once(js,"const version='1.0.127',revision='r336-official-1.0.127';","const version='1.0.128',revision='r337-official-1.0.128';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v336.js','app-v337.js').replaceAll('app-v336.css','app-v337.css').replaceAll('v1.0.127','v1.0.128').replaceAll('r336-official-1.0.127','r337-official-1.0.128');
sw=sw.replaceAll('ct-web-1.0.127-r336','ct-web-1.0.128-r337').replaceAll('app-v336.js','app-v337.js').replaceAll('app-v336.css','app-v337.css');
css+='\n/* CineTracker Web 1.0.128 r337 — episode catalog search + Home tab authority + readable ForYou actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.128',revision:'r337-official-1.0.128',base:'r336-production',
 scope:'episode-catalog-search+home-authoritative-tab+foryou-readable-actions',
 search_global:'movies+series+actors+episodes',
 search_episode_local:'cinetracker_episode_search_v337',
 search_episode_catalog:'seeded-from-watch-history+normalized-client-shape',
 search_episode_live:'r336-recent-tracked-series-fallback',
 home_navigation:'r337-desired-tab-authority+multi-settle+user-scroll-cancel',
 home_history_behavior:'normal-flow-above-anchor+hidden-only-during-anchor-settle',
 discover_foryou_owner:'r336-data-model+r337-first-capture-and-layout',
 discover_foryou_swap:'same-bucket+same-kind-only',
 discover_foryou_actions:'optimistic-immediate-replacement',
 discover_foryou_layout:'readable-single-row-actions-no-wrap',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r337 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v337.js'),js),writeFile(resolve(dist,'app-v337.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v336.js'),{force:true}),rm(resolve(dist,'app-v336.css'),{force:true})]);
console.log('WEB_R337_READY episode catalog search + deterministic Home + readable ForYou');
