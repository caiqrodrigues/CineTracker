import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r291.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v291.js','app-v291.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r291 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.82';window.__ctOfficialVersion='1.0.82';",
 "const REVISION='r291-official-1.0.82';",
 "window.__ctR290='universal-media-card-lock'",
 "window.__ctR291='discover-actions-favorites-horizontal-scroll'",
 "window.__ctR291Actions='footer-row-beside-swap-no-text-overlay'",
 "window.__ctR291Favorites='liked-state-optimistic-heart-overlay'",
 "window.__ctR291Scroll='local-drag-horizontal-carousels'",
 "data-ct291-favorite",
 "p_state:'Liked'",
 "media_overrides?profile_id=eq.",
 "flex overflow-x-auto scrollbar-thin space-x-4 pb-4 snap-x touch-pan-x",
 ".ct291-slot-footer",
 "-webkit-line-clamp:1!important",
 "touch-action:pan-x!important"
])must(js,x);
must(html,'app-v291.js');must(html,'app-v291.css');must(css,'overflow-x:hidden');
const m=JSON.parse(release);
if(m.version!=='1.0.82'||m.revision!=='r291-official-1.0.82'||m.discover_action_layout!=='footer-row-beside-swap'||m.discover_favorite_ui!=='poster-heart-overlay'||m.discover_favorite_state!=='Liked'||m.discover_favorite_storage!=='media_overrides'||m.discover_carousel_scroll!=='local-horizontal-drag'||m.android!=='1.0.20/10062')throw new Error('r291 release identity');
must(sw,"const CACHE='ct-web-1.0.82-r291';");
console.log('WEB_1_0_82_OFFICIAL_OK r291 Discover action footer + favorite hearts + horizontal drag; Android preserved');
