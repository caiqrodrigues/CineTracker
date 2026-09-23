import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R339_SKIP_BUILD!=='1')await import('./build-r339.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v339.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r339-discover-actions.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R339_STATIC '+m)};
ok(r.version==='1.0.130'&&r.revision==='r339-official-1.0.130','identity');
ok(html.includes('app-v339.js')&&html.includes('app-v339.css'),'assets');
ok(js.includes("window.__ctR339Marker='discover-actions-exact-card-width-mobile-no-overlap'"),'runtime marker');
ok(js.includes("window.__ctR338Marker='discover-foryou-actions-flex-hard-reset-no-overlap'"),'r338 preserved');
ok(js.includes("rpc('cinetracker_episode_search_v337'"),'episode search preserved');
ok(js.includes("sessionStorage.setItem('cinetracker_home_tab_v337'"),'Home authority preserved');
ok(runtime.includes('measuredCardWidth339'),'measured card width missing');
ok(runtime.includes("imp(slot,'width',px)")&&runtime.includes("imp(row,'width',px)"),'slot/row exact width contract missing');
ok(runtime.includes("imp(row,'overflow','hidden')"),'row containment missing');
ok(runtime.includes("const weights=buttons.length===3?[1.25,.9,1]:[1,1]"),'three-button sizing missing');
ok(runtime.includes("font-size',buttons.length===3?'7.25px':'8.5px'"),'mobile three-button text sizing missing');
ok(r.discover_foryou_layout==='r339-exact-card-width-horizontal-actions','release layout contract');
ok(r.discover_foryou_action_geometry==='measured-card-width+2-or-3-contained-buttons+no-overlap','release geometry contract');
ok(r.discover_foryou_swap==='same-bucket+same-kind-only','same-kind swap preserved');
ok(r.discover_foryou_actions==='optimistic-immediate-replacement','optimistic replacement preserved');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R339_STATIC_OK');