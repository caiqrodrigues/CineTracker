import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R334_SKIP_BUILD!=='1')await import('./build-r334.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v334.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R334_STATIC '+m)};
ok(r.version==='1.0.125'&&r.revision==='r334-official-1.0.125','identity');
ok(html.includes('app-v334.js')&&html.includes('app-v334.css'),'assets');
ok(js.includes("window.__ctR334Marker='home-fast-v334+single-anchor+discover-no-observer-loop+stable-foryou'"),'runtime marker');
ok(js.includes("rpc('cinetracker_home_payload_v334'"),'Home v334 RPC missing');
ok(!js.includes("rpc('cinetracker_home_payload_v333'"),'Home v333 RPC still active');
ok(js.includes("rpc('cinetracker_home_series_watch_state_v4'"),'fast series state v4 missing');
ok(!js.includes("rpc('cinetracker_home_series_watch_state_v2'"),'slow series state v2 still active');
ok(js.includes("void Promise.resolve(null).then(h=>{"),'duplicate r331 history refresh not retired');
ok(js.includes("function scheduleHomeReset327(kind){return false}"),'r327 anchor scheduler still active');
ok(js.includes("function scheduleHomeAnchor328(kind=homeKind328()){return false}"),'r328 anchor scheduler still active');
ok(js.includes("function scheduleHome331(kind){return false}"),'r331 anchor scheduler still active');
ok((js.match(/if\(false&&app&&window\.MutationObserver\)/g)||[]).length>=5,'late app observers not retired');
ok(js.includes("setTimeout(()=>{if(routeNow()==='sports')void warmSports333()},300);"),'sports startup still competes globally');
ok(js.includes("data-ct334-fy-kind"),'direct ForYou filters missing');
ok(js.includes("[data-ct309-foryou] .ct309-actions"),'r309 compact action fallback missing');
ok(js.includes("[data-ct328-foryou] .ct328-actions"),'r328 compact action fallback missing');
ok(js.includes("[data-ct329-foryou] .ct329-actions"),'r329 compact action owner missing');
ok(r.home_payload==='cinetracker_home_payload_v334','Home release authority');
ok(r.home_series_logical_state==='v4-fast-indexed-dedup','series state release');
ok(r.home_navigation==='r332-single-owner+old-r327-r328-r331-schedulers-retired','Home owner release');
ok(r.discover_observers==='r327+r328+r329+r331+r333-late-observers-retired','Discover observer release');
ok(r.discover_controls==='direct-idempotent-all+movies+series+anime','Discover controls release');
ok(r.discover_foryou_actions==='all-owners-three-compact-one-row','ForYou actions release');
ok(r.sports_startup==='only-when-sports-active','sports route guard release');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R334_STATIC_OK');
