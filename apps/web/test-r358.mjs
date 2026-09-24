import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R358_SKIP_BUILD!=='1')await import('./build-r358.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v358.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r358-home-actions-first.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R358_STATIC '+m)};
ok(r.version==='1.0.149'&&r.revision==='r358-official-1.0.149','identity');
ok(html.includes('app-v358.js')&&html.includes('app-v358.css'),'assets');
ok(js.startsWith("/* r358 true first capture"),'capture bootstrap is not physically first');
ok(js.includes("window.addEventListener('click',e=>{try{const h=window.__ctR358Early"),'first capture bootstrap missing');
ok(js.includes("window.__ctR358Marker='true-first-capture-foryou-actions+home-ready-before-reveal'"),'runtime marker');
ok(runtime.includes("window.__ctR352Test?.mutate352"),'local state mutation missing');
ok(runtime.includes("await addWatchlist(type,id)"),'Watchlist persistence missing');
ok(runtime.includes("await markSeen(type,id)"),'Seen persistence missing');
ok(runtime.includes("await primeTvState();")&&runtime.indexOf("await primeTvState();")<runtime.indexOf("baseHome358.apply"),'Home TV prime is not before render');
ok(runtime.includes("await waitHomeReady({timeout:12000})"),'Home ready wait missing');
ok(runtime.includes("Ep:\\s*Episódio")&&runtime.includes("⭐\\s*[—-]"),'incomplete episode detection missing');
ok(r.discover_foryou_click_owner==='r358-physical-first-window-capture','click-owner contract');
ok(r.discover_foryou_actions==='local-slot-immediate+direct-backend-persist+no-global-repaint','action contract');
ok(r.home_startup==='tv-refresh-before-first-paint+episode-meta-gate','Home startup contract');
ok(r.home_episode_reveal==='wait-until-visible-episode-title-rating-date-ready','Home reveal contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R358_STATIC_OK');
