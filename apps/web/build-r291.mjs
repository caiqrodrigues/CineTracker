import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r290-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v290.js'),'utf8'),
 readFile(resolve(dist,'app-v290.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r291-discover-actions-favorites-scroll.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r291 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r291 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r291 missing '+x)};
for(const x of[
 "window.__ctR291='discover-actions-favorites-horizontal-scroll';",
 "window.__ctR291Actions='footer-row-beside-swap-no-text-overlay';",
 "window.__ctR291Favorites='liked-state-optimistic-heart-overlay';",
 "window.__ctR291Scroll='local-drag-horizontal-carousels';",
 "data-ct291-favorite",
 "p_state:'Liked'",
 "media_overrides?profile_id=eq.",
 "flex overflow-x-auto scrollbar-thin space-x-4 pb-4 snap-x touch-pan-x",
 ".ct291-slot-footer",
 "-webkit-line-clamp:1!important",
 "touch-action:pan-x!important"
])must(patch,x);
for(const x of[
 "window.__ctR288='discover-android-parity-web-only';",
 "window.__ctR289='discover-standard-card-size';",
 "window.__ctR290='universal-media-card-lock';"
])must(js,x);
js=once(js,"window.__ctWebBuild='1.0.81';window.__ctOfficialVersion='1.0.81';","window.__ctWebBuild='1.0.82';window.__ctOfficialVersion='1.0.82';",'version');
js=once(js,"const REVISION='r290-official-1.0.81';","const REVISION='r291-official-1.0.82';",'revision');
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.82 r291 — Discover action footers, poster favorites and local horizontal carousels. */
html,body,#app{max-width:100%;overflow-x:hidden}
`;
html=html.replaceAll('app-v290.js','app-v291.js').replaceAll('app-v290.css','app-v291.css').replaceAll('CineTracker • v1.0.81','CineTracker • v1.0.82');
sw=sw.replaceAll('ct-web-1.0.81-r290','ct-web-1.0.82-r291').replaceAll('app-v290.js','app-v291.js').replaceAll('app-v290.css','app-v291.css');
const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.82',
 revision:'r291-official-1.0.82',
 base:'r290-production',
 scope:'discover-actions-favorites-horizontal-scroll-web-only',
 discover_action_layout:'footer-row-beside-swap',
 discover_text_layout:'line-clamp-1-truncate-clean',
 discover_favorite_ui:'poster-heart-overlay',
 discover_favorite_state:'Liked',
 discover_favorite_storage:'media_overrides',
 discover_favorite_behavior:'optimistic-async-toggle',
 discover_carousel_scroll:'local-horizontal-drag',
 discover_carousel_classes:'flex overflow-x-auto scrollbar-thin space-x-4 pb-4 snap-x touch-pan-x',
 discover_window_overflow_x:'blocked',
 android:'1.0.20/10062'
};
await Promise.all([
 writeFile(resolve(dist,'app-v291.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v291.css'),css,'utf8'),
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v290.js'),{force:true}),rm(resolve(dist,'app-v290.css'),{force:true})]);
console.log('WEB_R291_READY discover actions footer + favorite hearts + local horizontal drag; Android preserved');
