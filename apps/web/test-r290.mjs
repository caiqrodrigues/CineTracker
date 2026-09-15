import {readFile} from 'node:fs/promises';
await import('./build-r290-official.mjs');
const [js,runtime,release,html,sw]=await Promise.all([
 readFile('dist/app-v290.js','utf8'),
 readFile('runtime-r290-universal-media-card-lock.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r290 missing '+x)};
for(const x of[
 "window.__ctR290='universal-media-card-lock'",
 "window.__ctR290Cards='indication-of-day-exact-154x231-mobile-176x264-desktop'",
 "--ct-media-card-w:176px",
 "--ct-media-poster-h:264px",
 "--ct-media-copy-h:80px",
 "--ct-media-card-w:154px",
 "--ct-media-poster-h:231px",
 "--ct-media-copy-h:75px",
 ".ct263-media-card,.ct288-card,.ct288-empty-card",
 "-webkit-line-clamp:2!important",
 "white-space:nowrap!important",
 "window.ct171TopCard=standardTopCard",
 "grid-template-columns:repeat(3,var(--ct-media-card-w))!important",
 "grid-template-columns:repeat(auto-fill,var(--ct-media-card-w))!important",
 "new MutationObserver"
])must(js,x);
for(const inherited of[
 "window.__ctR288='discover-android-parity-web-only'",
 "window.__ctR289='discover-standard-card-size'",
 "window.__ctR289Cards='standard-154-mobile-176-desktop-2x3'"
])must(js,inherited);
if(runtime.includes('apps/android')||runtime.includes('versionCode 10063'))throw new Error('r290 Android mutation marker forbidden');
must(html,'app-v290.js');must(html,'app-v290.css');must(sw,"const CACHE='ct-web-1.0.81-r290';");
const m=JSON.parse(release);
if(m.version!=='1.0.81'||m.revision!=='r290-official-1.0.81'||m.media_card_reference!=='indicacao-do-dia'||m.discover_cards!=='all-nine-tabs-vertical-uniform'||m.discover_top10!=='vertical-standard-card-no-banner-fallback'||m.android!=='1.0.20/10062')throw new Error('bad r290 release identity');
console.log('R290_STATIC_OK universal card lock + Discover all tabs + Android preserved');
