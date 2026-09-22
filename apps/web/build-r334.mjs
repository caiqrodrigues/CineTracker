import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r333.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v333.js'),'utf8'),
 readFile(resolve(dist,'app-v333.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r334-home-discover-stable.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r334 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r334 expected one '+l+', found '+n);return s.replace(a,b)};
const patchSegment=(s,start,end,fn,label)=>{
 const a=s.indexOf(start),b=end?s.indexOf(end,a+start.length):s.length;
 if(a<0||b<0||b<=a)throw new Error('r334 segment '+label+' missing');
 return s.slice(0,a)+fn(s.slice(a,b))+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.124';window.__ctOfficialVersion='1.0.124';",
 "const REVISION='r333-official-1.0.124';",
 "const version='1.0.124',revision='r333-official-1.0.124';",
 "window.__ctR333Marker='home-v333+discover-direct-controls+top10-final-audit+sports-background-warmup'",
 "cinetracker_home_payload_v333",
 "cinetracker_home_series_watch_state_v2",
 "void ct331RefreshHistory(false).then(h=>{",
 "setTimeout(()=>void warmSports333(),300);",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR334Marker='home-fast-v334+single-anchor+discover-no-observer-loop+stable-foryou'",
 "data-ct334-fy-kind",
 "ct309-actions",
 "single-r332-anchor"
])must(runtime,x);

/* Fast consolidated Home state + canonical history in one payload. */
js=js.replaceAll('cinetracker_home_payload_v333','cinetracker_home_payload_v334');
js=js.replaceAll('cinetracker_home_series_watch_state_v2','cinetracker_home_series_watch_state_v4');

/* v334 already contains canonical 50-item histories; do not trigger r331's second history RPC/repaint. */
js=once(js,"void ct331RefreshHistory(false).then(h=>{","void Promise.resolve(null).then(h=>{",'disable duplicate r331 history refresh');

/* Keep r332 as the only Home landing-anchor owner. */
for(const [old,next,label] of[
 ["function scheduleHomeReset327(kind){\n cancelAnimationFrame(homeResetRaf);\n homeResetRaf=requestAnimationFrame(()=>requestAnimationFrame(()=>resetHomePosition327(kind||activeHomeKind327())));\n}","function scheduleHomeReset327(kind){return false}","r327 Home schedule"],
 ["function scheduleHomeAnchor328(kind=homeKind328()){\n cancelAnimationFrame(homeRaf328);\n homeRaf328=requestAnimationFrame(()=>requestAnimationFrame(()=>homeAnchor328(kind)));\n setTimeout(()=>homeAnchor328(kind),80);\n}","function scheduleHomeAnchor328(kind=homeKind328()){return false}","r328 Home schedule"],
 ["function scheduleHome331(kind){\n cancelAnimationFrame(homeRaf);\n homeRaf=requestAnimationFrame(()=>requestAnimationFrame(()=>resetHome331(kind||homeKind331())));\n}","function scheduleHome331(kind){return false}","r331 Home schedule"]
]){
 if(!js.includes(old))throw new Error('r334 missing '+label);
 js=js.replace(old,next);
}

/* Retire late app-wide mutation observers that were rewriting Discover/Home while navigation was in flight. */
const observerPairs=[
 ["window.__ctR327Marker=","window.__ctR328Marker=","r327"],
 ["window.__ctR328Marker=","window.__ctR329Marker=","r328"],
 ["window.__ctR329Marker=","window.__ctR330Marker=","r329"],
 ["window.__ctR331Marker=","window.__ctR332Marker=","r331"],
 ["window.__ctR333Marker=",null,"r333"]
];
for(const [start,end,label] of observerPairs){
 js=patchSegment(js,start,end,seg=>{
   const before=(seg.match(/if\(app&&window\.MutationObserver\)/g)||[]).length;
   const out=seg.replaceAll('if(app&&window.MutationObserver)','if(false&&app&&window.MutationObserver)');
   if(before<1)throw new Error('r334 expected observer in '+label);
   return out;
 },label);
}

/* Sports background synchronization must not compete with Home/Discover startup. */
js=once(js,"setTimeout(()=>void warmSports333(),300);","setTimeout(()=>{if(routeNow()==='sports')void warmSports333()},300);",'sports startup route guard');

/* Identity + final single-owner runtime. */
js=once(js,"window.__ctWebBuild='1.0.124';window.__ctOfficialVersion='1.0.124';","window.__ctWebBuild='1.0.125';window.__ctOfficialVersion='1.0.125';",'web version');
js=once(js,"const REVISION='r333-official-1.0.124';","const REVISION='r334-official-1.0.125';",'revision');
js=once(js,"const version='1.0.124',revision='r333-official-1.0.124';","const version='1.0.125',revision='r334-official-1.0.125';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v333.js','app-v334.js').replaceAll('app-v333.css','app-v334.css').replaceAll('v1.0.124','v1.0.125').replaceAll('r333-official-1.0.124','r334-official-1.0.125');
sw=sw.replaceAll('ct-web-1.0.124-r333','ct-web-1.0.125-r334').replaceAll('app-v333.js','app-v334.js').replaceAll('app-v333.css','app-v334.css');
css+='\n/* CineTracker Web 1.0.125 r334 — fast Home + single-owner navigation + stable Discover. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.125',
 revision:'r334-official-1.0.125',
 base:'r333-unpromoted',
 scope:'home-performance+single-scroll-owner+discover-observer-loop-removal',
 home_payload:'cinetracker_home_payload_v334',
 home_series_logical_state:'v4-fast-indexed-dedup',
 home_history_behavior:'normal-flow-above-anchor+no-toggle+newest-nearest-anchor',
 home_navigation:'r332-single-owner+old-r327-r328-r331-schedulers-retired',
 home_duplicate_history_refresh:false,
 discover_filter_authority:'cinetracker_discover_filter_v333',
 discover_controls:'direct-idempotent-all+movies+series+anime',
 discover_foryou_actions:'all-owners-three-compact-one-row',
 discover_observers:'r327+r328+r329+r331+r333-late-observers-retired',
 discover_prefetch:'on-demand-no-eager-network-storm',
 discover_top10:'progressive-eight-pages-until-ten+v333-audit',
 sports_startup:'only-when-sports-active',
 profile_watchlist_counts:'r324-preserved-exact',
 web_version_ui:'1.0.125+r334-official-1.0.125',
 f1_changes:'none-r334',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r334 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v334.js'),js),
 writeFile(resolve(dist,'app-v334.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v333.js'),{force:true}),rm(resolve(dist,'app-v333.css'),{force:true})]);
console.log('WEB_R334_READY fast Home + stable navigation + observer-free Discover normalization');
