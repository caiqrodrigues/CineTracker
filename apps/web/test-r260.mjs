import {readFile} from 'node:fs/promises';
const runtime=await readFile(new URL('./runtime-r260-ux-recovery.js',import.meta.url),'utf8');
const build=await readFile(new URL('./build-r260.mjs',import.meta.url),'utf8');
const pkg=JSON.parse(await readFile(new URL('./package.json',import.meta.url),'utf8'));
const need=(s,x,m=x)=>{if(!s.includes(x))throw new Error('R260 missing '+m)};
for(const x of[
 "window.__ctR260='discover-standard-cards+home-first-page-cache+isolated-modal-rails'",
 "window.__ctR260Discover='standard-2x3-176-desktop-154-mobile'",
 "window.__ctR260Home='persistent-first-page+background-refresh+metadata-cache+skeleton'",
 "window.__ctR260Horizontal='isolated-modal-rails+native-touch+delegated-mouse-drag'",
 "window.__ctR260Frozen='sports-profile-configs-f1-r259-unchanged'",
 "ct-home-first-page-v260","ct-tmdb-meta-v260:","sessionStorage","HOME_PAGE_SIZE260=18","IntersectionObserver",
 "flex','overflow-x-auto','scrollbar-thin','whitespace-nowrap','touch-pan-x','flex-nowrap",
 "pointerdown","pointermove","scrollLeft"
])need(runtime,x,x);
if(runtime.includes('MutationObserver'))throw new Error('R260 may not add MutationObserver');
for(const x of[
 "await import('./build-r259-official.mjs')",
 "const REVISION='r260-official-1.0.51';",
 ".ct259-media-card{flex:0 0 176px!important",
 "aspect-ratio:2/3!important",
 "flex-basis:154px!important",
 "[data-ct260-x]",
 "overflow-x:clip!important",
 "},900);return homeCache})();",
 "app-v260.js","app-v260.css","ct-web-1.0.51-r260"
])need(build,x,x);
if(pkg.version!=='1.0.51'||pkg.scripts.build!=='node build-r260-official.mjs')throw new Error('R260 package identity mismatch');
console.log('R260_STATIC_OK');
