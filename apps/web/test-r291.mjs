import {readFile} from 'node:fs/promises';
await import('./build-r291-official.mjs');
const [js,runtime,release,html,sw]=await Promise.all([
 readFile('dist/app-v291.js','utf8'),
 readFile('runtime-r291-discover-actions-favorites-scroll.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r291 missing '+x)};
for(const x of[
 "window.__ctR291='discover-actions-favorites-horizontal-scroll'",
 "window.__ctR291Actions='footer-row-beside-swap-no-text-overlay'",
 "window.__ctR291Favorites='liked-state-optimistic-heart-overlay'",
 "window.__ctR291Scroll='local-drag-horizontal-carousels'",
 "ct291-slot-footer",
 "+ Playlist",
 "✓ Salvo",
 "data-ct291-favorite",
 "p_state:'Liked'",
 "cinetracker_profile_media_dashboard_v0997_fast",
 "cinetracker_media_state_v1",
 "cinetracker_upsert_media",
 "cinetracker_upsert_override",
 "media_overrides?profile_id=eq.",
 "flex overflow-x-auto scrollbar-thin space-x-4 pb-4 snap-x touch-pan-x",
 "overscroll-behavior-x:contain!important",
 "touch-action:pan-x!important",
 "-webkit-line-clamp:1!important",
 "new MutationObserver"
])must(js,x);
for(const inherited of[
 "window.__ctR288='discover-android-parity-web-only'",
 "window.__ctR289='discover-standard-card-size'",
 "window.__ctR290='universal-media-card-lock'"
])must(js,inherited);
if(runtime.includes('apps/android')||runtime.includes('versionCode 10063'))throw new Error('r291 Android mutation marker forbidden');
must(html,'app-v291.js');must(html,'app-v291.css');must(sw,"const CACHE='ct-web-1.0.82-r291';");
const m=JSON.parse(release);
if(m.version!=='1.0.82'||m.revision!=='r291-official-1.0.82'||m.discover_action_layout!=='footer-row-beside-swap'||m.discover_favorite_state!=='Liked'||m.discover_favorite_storage!=='media_overrides'||m.discover_carousel_scroll!=='local-horizontal-drag'||m.android!=='1.0.20/10062')throw new Error('bad r291 release identity');
console.log('R291_STATIC_OK footer actions + Liked heart favorites + local horizontal drag + Android preserved');
