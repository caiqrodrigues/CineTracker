import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r288.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v288.js','app-v288.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r288 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.79';window.__ctOfficialVersion='1.0.79';",
 "const REVISION='r288-official-1.0.79';",
 "window.__ctR287='home-interaction-liveness+available-episode-priority'",
 "window.__ctR288='discover-android-parity-web-only'",
 "window.__ctR288Discover='nine-tabs+stable-shell+provider-top10+three-slot-foryou'",
 "window.__ctR288Top10='provider-specific-series+movies-real-rails'",
 "window.__ctR288ForYou='movie-series-anime-independent-swap'",
 'window.__ctR288R263={q263,qa263,n263,esc263,type263,id263,title263,poster263,year263,score263,image263,discover263,discoverHost263,block263,armDiscoverRails263,syncDiscover263,forYou263,loadBrowse263,DTABS263}',
 "function loadDiscover263(tab=discover263.tab,force=false){if(typeof window.__ctR288LoadDiscover==='function')return window.__ctR288LoadDiscover(tab,force);",
 'window.__ctR288PaintForYou=function(){',
 'window.__ctR288PaintBrowse=function(rows,tab){',
 'window.__ctR288LoadDiscover=function(tab=discover263.tab,force=false){',
 'ct171TopRows(Number(provider))',
 'data-ct288-provider',
 'data-ct288-swap',
 'data-ct288-filter',
 'data-ct288-calendar'
])must(js,x);
must(html,'app-v288.js');must(html,'app-v288.css');must(css,'overflow-x:hidden');
const m=JSON.parse(release);
if(m.version!=='1.0.79'||m.revision!=='r288-official-1.0.79'||m.discover_owner!=='r288-live-r263-bridge'||m.discover_live_owner_bridge!==true||m.discover_tabs!==9||m.discover_tab_switch!=='content-only-no-shell-rebuild'||m.discover_top10!=='provider-specific-series-and-movies'||m.discover_foryou!=='movie-series-anime-independent-swap'||m.discover_calendar!=='grouped-by-release-date'||m.android!=='1.0.20/10062')throw new Error('r288 release identity');
must(sw,"const CACHE='ct-web-1.0.79-r288';");
console.log('WEB_1_0_79_OFFICIAL_OK r288 Discover Android parity live-owner Web-only');
