import {readFile} from 'node:fs/promises';
const [js,runtime,release,html,sw]=await Promise.all([
 readFile('dist/app-v289.js','utf8'),readFile('runtime-r289-discover-standard-card-size.js','utf8'),readFile('dist/release.json','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r289 missing '+x)};
for(const x of[
 "window.__ctR289='discover-standard-card-size'",
 "window.__ctR289Cards='legacy-standard-128-152px-2x3'",
 "window.__ctR289Scope='discover-layout-only'",
 "window.__ctR289Android='preserved-1.0.20-10062'",
 '--ct289-card-w:clamp(128px,14vw,152px)',
 'grid-auto-columns:var(--ct289-card-w)!important',
 'grid-template-columns:repeat(auto-fill,var(--ct289-card-w))!important',
 'aspect-ratio:2/3!important',
 '.ct288-rail>.ct288-card',
 '.ct288-top-row>.ct171-top-card'
])must(js,x);
for(const inherited of [
 "window.__ctR286='related-open-watchlist-seen-window-capture'",
 "window.__ctR287='home-interaction-liveness+available-episode-priority'",
 "window.__ctR288='discover-android-parity-web-only'",
 "window.__ctR288Discover='nine-tabs+stable-shell+provider-top10+three-slot-foryou'",
 'window.__ctR288R263={q263,qa263,n263,esc263,type263,id263,title263,poster263,year263,score263,image263,discover263,discoverHost263,block263,armDiscoverRails263,syncDiscover263,forYou263,loadBrowse263,DTABS263}'
])must(js,inherited);
if(runtime.includes('touchstart')||runtime.includes('touchmove')||runtime.includes('MutationObserver')||runtime.includes('setInterval('))throw new Error('r289 layout patch must stay passive');
if(runtime.includes('apps/android')||runtime.includes('versionCode 10063'))throw new Error('r289 Android mutation marker forbidden');
must(html,'app-v289.js');must(html,'app-v289.css');must(sw,"const CACHE='ct-web-1.0.80-r289';");
const m=JSON.parse(release);
if(m.version!=='1.0.80'||m.revision!=='r289-official-1.0.80'||m.discover_owner!=='r288-live-r263-bridge'||m.discover_tabs!==9||m.discover_card_size!=='legacy-standard-128-152px'||m.discover_card_ratio!=='2:3'||m.discover_card_layout!=='fixed-local-rail-no-stretch'||m.discover_card_slots!=='fixed-width-local-scroll'||m.android!=='1.0.20/10062')throw new Error('bad r289 release identity');
console.log('R289_STATIC_OK discover cards=128-152px ratio=2:3 fixed-no-stretch r288-behavior=preserved android=preserved');
