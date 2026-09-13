import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [runtime,build,official,js,css,release,html,sw]=await Promise.all([
 readFile(resolve(root,'runtime-r264-home-watched-discover-sports-detail-scroll.js'),'utf8'),readFile(resolve(root,'build-r264.mjs'),'utf8'),readFile(resolve(root,'build-r264-official.mjs'),'utf8'),readFile(resolve(dist,'app-v264.js'),'utf8'),readFile(resolve(dist,'app-v264.css'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R264_STATIC_MISSING '+x)};
for(const x of[
 "window.__ctR264='home-watched-stable-discover-single-sports-order-detail-rails'","window.__ctR264Home='stable-tab+side-watched-episode-movie+canonical-mark-watch'",
 "window.__ctR264Discover='single-nine-tabs+canonical-exclusions+local-rails+top10-streaming'","window.__ctR264Sports='f1-first-synchronous-order+watched-panel-persistent'",
 "window.__ctR264Detail='generic-season-episode-chart-related-similar-cast-local-x'","function applyHomeTab264(tab=homeTab264)","cinetracker_mark_watch_v0994",
 "function cleanDiscover264()","function reorderSports264()","function semanticRails264(root=document)",".cast-scroll,.cast-grid,.cast-row,[data-cast]"
])must(runtime,x);
for(const x of['cinetracker_profile_media_dashboard_v0991','cinetracker_watchlist_full_v119','excluded:union263(hard,watch)','window.__ctR263EnhanceF1Watch=enhanceF1Watch263','r264-official-1.0.55'])must(build,x);
for(const x of["window.__ctR264='home-watched-stable-discover-single-sports-order-detail-rails'","cinetracker_mark_watch_v0994","cinetracker_profile_media_dashboard_v0991","cinetracker_watchlist_full_v119","window.__ctR263EnhanceF1Watch=enhanceF1Watch263"])must(js,x);
for(const x of['.ct264-home-action-row','.ct264-watch-btn','.ct264-local-x','overflow-x:auto!important'])must(css,x);
for(const x of['app-v264.js','app-v264.css'])must(html,x);if(html.includes('app-v263.js')||html.includes('app-v263.css'))throw new Error('R264_STATIC old asset reference');
must(release,'"version": "1.0.55"');must(release,'"revision": "r264-official-1.0.55"');must(sw,"const CACHE='ct-web-1.0.55-r264';");
if(!official.includes('WEB_1_0_55_OFFICIAL_OK r264'))throw new Error('R264_STATIC official verifier missing');
console.log('R264_STATIC_OK stable Home canonical watch single Discover F1-first Sports generic detail rails');
