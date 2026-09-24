import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R359_SKIP_BUILD!=='1')await import('./build-r359.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v359.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r359-home-cache-direct-actions.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R359_STATIC '+m)};
ok(r.version==='1.0.150'&&r.revision==='r359-official-1.0.150','identity');
ok(html.includes('app-v359.js')&&html.includes('app-v359.css'),'assets');
ok(js.startsWith('/* r359 absolute first capture'),'r359 is not physical first listener');
ok(js.includes("window.__ctR359Marker='direct-foryou-actions-no-chain+cached-home-episode-first-paint'"),'runtime marker');
ok(runtime.includes("await addWatchlist(type,id)"),'direct Watchlist backend missing');
ok(runtime.includes("await markSeen(type,id)"),'direct Seen backend missing');
ok(!runtime.includes("__ctR352?.action"),'r359 still chains action handlers');
ok(runtime.includes("rpc('cinetracker_home_payload_v359'"),'new Home payload missing');
ok(runtime.includes("data.__ct359PreparedFromCache=true"),'cache short-circuit missing');
ok(r.discover_foryou_repaint==='clicked-slot-only-no-global-event','action repaint contract');
ok(r.home_payload_source==='cinetracker_home_payload_v359','Home source contract');
ok(r.home_episode_hydration==='skip-when-cache-complete','Home hydrate contract');
ok(r.tv_refresh==='ct-refresh-tv-state-user-v2-episode-cache','refresh contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R359_STATIC_OK');