import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r332.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v332.js'),'utf8'),
 readFile(resolve(dist,'app-v332.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r333-discover-layout-final.js'),'utf8')
]);

const must=(s,x)=>{if(!s.includes(x))throw new Error('r333 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r333 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.123';window.__ctOfficialVersion='1.0.123';",
 "const REVISION='r332-official-1.0.123';",
 "const version='1.0.123',revision='r332-official-1.0.123';",
 "window.__ctR332Marker='home-v332-watchlist+natural-history+foryou-compact+top10-ten-grid-no-looke-mubi'",
 "cinetracker_discover_filter_v327",
 "boot();"
])must(js,x);

for(const x of[
 "window.__ctR333Marker='discover-standard-cards+single-row-actions+compact-top10+clean-tabbar'",
 "data-ct333-fy-kind",
 "ct288-top-name",
 "--ct333-card-w:154px",
 "flex-flow:row nowrap"
])must(runtime,x);

js=once(js,"window.__ctWebBuild='1.0.123';window.__ctOfficialVersion='1.0.123';","window.__ctWebBuild='1.0.124';window.__ctOfficialVersion='1.0.124';",'web version');
js=once(js,"const REVISION='r332-official-1.0.123';","const REVISION='r333-official-1.0.124';",'revision');
js=once(js,"const version='1.0.123',revision='r332-official-1.0.123';","const version='1.0.124',revision='r333-official-1.0.124';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v332.js','app-v333.js').replaceAll('app-v332.css','app-v333.css').replaceAll('v1.0.123','v1.0.124').replaceAll('r332-official-1.0.123','r333-official-1.0.124');
sw=sw.replaceAll('ct-web-1.0.123-r332','ct-web-1.0.124-r333').replaceAll('app-v332.js','app-v333.js').replaceAll('app-v332.css','app-v333.css');
css+='\n/* CineTracker Web 1.0.124 r333 — Discover screenshot contract: standard cards, single-row actions, compact Top 10. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.124',
 revision:'r333-official-1.0.124',
 base:'r332-main',
 scope:'discover-layout-screenshot-contract+v327-rules-preserved',
 discover_filter_authority:'cinetracker_discover_filter_v327',
 discover_filter_verified:'harry-potter-8-of-8-blocked-for-current-profile',
 discover_foryou_filter_ui:'inline-always-visible-todos+filmes+series+animes',
 discover_foryou_layout:'standard-176-desktop-154-mobile-side-by-side',
 discover_foryou_actions:'three-buttons-single-row-inside-card-width',
 discover_public_actions:'two-buttons-single-row-inside-card-width',
 discover_tabbar:'right-next+global-filter-removed',
 discover_top10_provider_label:'duplicate-selected-name-removed',
 discover_top10_spacing:'compact-upward',
 discover_top10_layout:'ten-columns-no-horizontal-scroll-desktop',
 home_changes:'none-r333',
 profile_changes:'none-r333',
 sports_changes:'none-r333',
 f1_changes:'none-r333',
 web_version_ui:'1.0.124+r333-official-1.0.124',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r333 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v333.js'),js),
 writeFile(resolve(dist,'app-v333.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([
 rm(resolve(dist,'app-v332.js'),{force:true}),
 rm(resolve(dist,'app-v332.css'),{force:true})
]);

console.log('WEB_R333_READY Discover screenshot contract');
