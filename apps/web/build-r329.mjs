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
 readFile(resolve(root,'runtime-r329-discover-performance-layout.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r329 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r329 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.119';window.__ctOfficialVersion='1.0.119';",
 "const REVISION='r328-official-1.0.119';",
 "const version='1.0.119',revision='r328-official-1.0.119';",
 "window.__ctR328Marker='single-home-rpc+cache-first-nav+natural-history+watched-date'",
 "window.__ctR327Marker='home-r276-anchor+foryou-flex-actions+hard-filters+discover-v327'",
 "if(routeNow()==='discover')scheduleDiscover327();",
 "window.__ctR321={renderDiscover:renderDiscover321,loadDiscover:loadDiscover321,loadPublic:loadPublic321,loadForYou:loadForYou321,loadTop:loadTop321,exact:exact321,hydrateProfile:hydrateProfile321,openDay:openDay321,version:'1.0.112'};",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR329Marker='discover-cache-first-tabs+idle-prefetch+compact-foryou-cards'",
 "compactForYou329",
 "prefetchSources329",
 "renderCachedDiscover329"
])must(runtime,x);

js=js.replace(
 "window.__ctR321={renderDiscover:renderDiscover321,loadDiscover:loadDiscover321,loadPublic:loadPublic321,loadForYou:loadForYou321,loadTop:loadTop321,exact:exact321,hydrateProfile:hydrateProfile321,openDay:openDay321,version:'1.0.112'};",
 "window.__ctR321={renderDiscover:renderDiscover321,loadDiscover:loadDiscover321,loadPublic:loadPublic321,loadForYou:loadForYou321,loadTop:loadTop321,exact:exact321,source:source321,hydrateProfile:hydrateProfile321,openDay:openDay321,version:'1.0.112'};"
);
js=js.replaceAll("if(routeNow()==='discover')scheduleDiscover327();","if(false&&routeNow()==='discover')scheduleDiscover327();");

const early="(()=>{if(window.__ctR329EarlyCapture)return;window.__ctR329EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR329EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true)})();";
js=early+'\n'+js;

js=once(js,"window.__ctWebBuild='1.0.119';window.__ctOfficialVersion='1.0.119';","window.__ctWebBuild='1.0.120';window.__ctOfficialVersion='1.0.120';",'web version');
js=once(js,"const REVISION='r328-official-1.0.119';","const REVISION='r329-official-1.0.120';",'revision');
js=once(js,"const version='1.0.119',revision='r328-official-1.0.119';","const version='1.0.120',revision='r329-official-1.0.120';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v328.js','app-v329.js').replaceAll('app-v328.css','app-v329.css').replaceAll('v1.0.119','v1.0.120').replaceAll('r328-official-1.0.119','r329-official-1.0.120');
sw=sw.replaceAll('ct-web-1.0.119-r328','ct-web-1.0.120-r329').replaceAll('app-v328.js','app-v329.js').replaceAll('app-v328.css','app-v329.css');
css+='\n/* CineTracker Web 1.0.120 r329 — fluid Discover navigation and compact ForYou cards/actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.120',
 revision:'r329-official-1.0.120',
 base:'r328-production',
 scope:'discover-navigation-performance+foryou-layout-only',
 discover_navigation:'cache-first-return+no-loader-for-fresh-cache',
 discover_dom_cache_ttl_ms:300000,
 discover_prefetch:'idle-public-source-prefetch',
 discover_r327_mutation_sweep:false,
 discover_foryou_layout:'three-158px-cards-start-aligned',
 discover_foryou_actions:'three-buttons-one-row-24px',
 discover_public_actions:'two-buttons-one-row',
 discover_filters:'hard-capture-no-network-for-foryou-kind',
 home:'r328-preserved',
 home_episode_live_reconcile:'r325-preserved',
 profile_watchlist_counts:'r324-preserved-exact',
 sports_changes:'none-r329',
 f1_changes:'none-r329',
 web_version_ui:'1.0.120+r329-official-1.0.120',
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
console.log('WEB_R329_READY fluid Discover tabs + compact ForYou layout');
