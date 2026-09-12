import {readFile} from 'node:fs/promises';
const [runtime,build,official]=await Promise.all([
 readFile(new URL('./runtime-r256-video-ground-truth-scroll-cache.js',import.meta.url),'utf8'),
 readFile(new URL('./build-r256.mjs',import.meta.url),'utf8'),
 readFile(new URL('./build-r256-official.mjs',import.meta.url),'utf8')
]);
const A=(c,m)=>{if(!c)throw new Error(m)};
for(const x of[
 "window.__ctR256='video-ground-truth-scroll-discover-sports-profile-cache'",
 "window.__ctR256Home='missing-wins-caught-up+live-frontier+stale-while-revalidate'",
 "window.__ctR256Discover='r255-data+forced-visible-card-geometry+route-snapshot'",
 "window.__ctR256Sports='f1-first-then-global-filters+route-snapshot'",
 "window.__ctR256Profile='single-collapse-media-and-sports+route-snapshot'",
 "window.__ctR256Horizontal='persistent-childlist-episode-season-chart-related-cast'",
 "window.__ctR256Navigation='instant-top-page-snapshots+home-stale-while-revalidate'"
])A(runtime.includes(x),'missing runtime marker '+x);
A(runtime.includes("missing>0&&(bucket==='up_to_date'||r.is_caught_up===true)"),'missing episodes must beat contradictory caught-up state');
A(runtime.includes("new MutationObserver")&&runtime.includes("{subtree:true,childList:true}")&&runtime.includes('window.__ctR256RailObserverActive=true'),'persistent childList rail observer required');
A(!runtime.includes('railsTimer256')&&!runtime.includes('disconnect(),5000'),'r256 rail observer must not expire');
for(const x of['.episode-list','[data-season-episodes]','.ct169-season-chart-carousel','.related-row','[data-related]','.cast-row','[data-cast]','.actors-row','[data-actors]'])A(runtime.includes(x),'rail selector missing '+x);
A(runtime.includes("root.firstElementChild!==f1")&&runtime.includes("f1.after(tabs)")&&runtime.includes("tabs.after(filters)"),'F1 must structurally precede Sports filters');
A(runtime.includes('ct256-stats-collapsed')&&runtime.includes("/recolher|expandir/"),'Profile single-collapse binding missing');
A(runtime.includes("restore256('home',120000)")&&runtime.includes('remember256(route())'),'instant cached return missing');
A(build.includes("min-height:344px!important")&&build.includes("height:264px!important")&&build.includes("display:flex!important;flex-flow:row nowrap!important"),'forced Discover card geometry missing');
A(build.includes("const CACHE='ct-web-1.0.47-r256'"),'r256 cache identity missing');
A(build.includes("version:'1.0.47'")&&build.includes("r256-official-1.0.47"),'r256 release identity missing');
A(official.includes('app-v256.js')&&official.includes('app-v256.css'),'official asset verification missing');
console.log('R256_STATIC_PASS');
