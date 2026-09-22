import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r328.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v328.js'),'utf8'),
 readFile(resolve(dist,'app-v328.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r329-discover-geometry.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r329 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r329 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.119';window.__ctOfficialVersion='1.0.119';",
 "const REVISION='r328-official-1.0.119';",
 "const version='1.0.119',revision='r328-official-1.0.119';",
 "window.__ctR328Marker='r276-home-anchor+owned-foryou-one-row+visible-filters+strict-discover'",
 "cinetracker_discover_filter_v326",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR329Marker='discover-fixed-card-rail+one-line-actions+no-page-overflow'",
 "data-ct329-foryou",
 "--ct329-card-w:154px",
 "ct329-swapbtn",
 "window.__ctR328.paintForYou=paintForYou329"
])must(runtime,x);

js=once(js,"window.__ctWebBuild='1.0.119';window.__ctOfficialVersion='1.0.119';","window.__ctWebBuild='1.0.120';window.__ctOfficialVersion='1.0.120';",'web version');
js=once(js,"const REVISION='r328-official-1.0.119';","const REVISION='r329-official-1.0.120';",'revision');
js=once(js,"const version='1.0.119',revision='r328-official-1.0.119';","const version='1.0.120',revision='r329-official-1.0.120';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v328.js','app-v329.js').replaceAll('app-v328.css','app-v329.css').replaceAll('v1.0.119','v1.0.120').replaceAll('r328-official-1.0.119','r329-official-1.0.120');
sw=sw.replaceAll('ct-web-1.0.119-r328','ct-web-1.0.120-r329').replaceAll('app-v328.js','app-v329.js').replaceAll('app-v328.css','app-v329.css');
css+='\n/* CineTracker Web 1.0.120 r329 — Discover geometry reset, fixed card rails and one-line actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.120',
 revision:'r329-official-1.0.120',
 base:'r328-production',
 scope:'discover-visual-geometry-only+strict-rules-preserved',
 discover_filter_authority:'cinetracker_discover_filter_v326',
 discover_foryou_renderer:'r329-fixed-card-horizontal-rails',
 discover_foryou_filters:'r328-visible-all+movies+series+anime-preserved',
 discover_foryou_actions:'unique-classes-single-row-no-wrap',
 discover_foryou_cards:'154-mobile+176-desktop+2x3',
 discover_foryou_overflow:'rail-only-no-document-horizontal-scroll',
 discover_public_cards:'154-mobile+176-desktop+rail-only',
 discover_public_actions:'single-row-two-buttons',
 discover_top10:'r328-strict-filter+fill-ten-preserved',
 discover_navigation:'r328-stale-top10-stop-preserved',
 home_changes:'none-r329',
 profile_changes:'none-r329',
 episode_sync:'r325-preserved',
 sports_changes:'none-r329',
 f1_changes:'none-r329',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r329 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v329.js'),js),
 writeFile(resolve(dist,'app-v329.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v328.js'),{force:true}),rm(resolve(dist,'app-v328.css'),{force:true})]);
console.log('WEB_R329_READY Discover geometry reset');
