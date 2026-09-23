import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r341.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v341.js'),'utf8'),
 readFile(resolve(dist,'app-v341.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r342-discover-stable-actions.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r342 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r342 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.132';window.__ctOfficialVersion='1.0.132';",
 "const REVISION='r341-official-1.0.132';",
 "const version='1.0.132',revision='r341-official-1.0.132';",
 "window.__ctR341Marker='discover-poster-lock+explicit-button-pixels+legacy-layout-writers-retired'",
 "function fixActions338(){",
 "function fixActions339(){",
 "function fixDiscoverActions340(){",
 "function fixAll341(){",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR342Marker='discover-buttons-single-owner+no-jitter+poster-width-freeze'",
 "visibility:hidden!important",
 "transition:none!important",
 "buttonWidths342",
 "new MutationObserver"
])must(runtime,x);

/* r342 is the only writer of action geometry. Keep old feature runtimes loaded, but retire their layout passes. */
js=once(js,"function fixActions338(){","function fixActions338(){return false;",'retire r338 geometry writer');
js=once(js,"function fixActions339(){","function fixActions339(){return false;",'retire r339 geometry writer');
js=once(js,"function fixDiscoverActions340(){","function fixDiscoverActions340(){return false;",'retire r340 geometry writer');
js=once(js,"function fixAll341(){","function fixAll341(){return false;",'retire r341 geometry writer');
js=once(js,
`function settle341(){
 clearLate341();queue341();
 for(const ms of [40,140,320,560])late341.push(setTimeout(()=>fixAll341(),ms));
}`,
`function settle341(){clearLate341();}`,
'retire r341 delayed settle loop');
js=once(js,"setTimeout(()=>{if(routeNow()==='discover')settle341()},700);","setTimeout(()=>{},700);",'retire r341 late startup correction');

js=once(js,"window.__ctWebBuild='1.0.132';window.__ctOfficialVersion='1.0.132';","window.__ctWebBuild='1.0.133';window.__ctOfficialVersion='1.0.133';",'web version');
js=once(js,"const REVISION='r341-official-1.0.132';","const REVISION='r342-official-1.0.133';",'revision');
js=once(js,"const version='1.0.132',revision='r341-official-1.0.132';","const version='1.0.133',revision='r342-official-1.0.133';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v341.js','app-v342.js').replaceAll('app-v341.css','app-v342.css').replaceAll('v1.0.132','v1.0.133').replaceAll('r341-official-1.0.132','r342-official-1.0.133');
sw=sw.replaceAll('ct-web-1.0.132-r341','ct-web-1.0.133-r342').replaceAll('app-v341.js','app-v342.js').replaceAll('app-v341.css','app-v342.css');
css+='\n/* CineTracker Web 1.0.133 r342 — single stable Discover action geometry owner; no jitter timers or resize loop. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.133',revision:'r342-official-1.0.133',base:'r341-production',
 scope:'discover-actions-single-owner-no-jitter',
 discover_all_tabs_actions:'single-r342-owner+poster-width+explicit-pixels+no-transitions',
 discover_action_authority:'r342-single-owner',
 discover_action_conflicts:'r338+r339+r340+r341-geometry-writers-retired',
 discover_action_timing:'one-double-raf-after-real-dom-paint+mutation-only',
 discover_action_stability:'no-resize-observer+no-delayed-settle-loop+no-width-transition',
 sports_startup:'every-open-warm+force-provider-sync+auth-retry+refresh-payload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r342 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v342.js'),js),writeFile(resolve(dist,'app-v342.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v341.js'),{force:true}),rm(resolve(dist,'app-v341.css'),{force:true})]);
console.log('WEB_R342_READY Discover buttons have one stable geometry owner with no delayed jitter writers');
