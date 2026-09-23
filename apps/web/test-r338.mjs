import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R338_SKIP_BUILD!=='1')await import('./build-r338.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v338.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r338-discover-actions.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R338_STATIC '+m)};
ok(r.version==='1.0.129'&&r.revision==='r338-official-1.0.129','identity');
ok(html.includes('app-v338.js')&&html.includes('app-v338.css'),'assets');
ok(js.includes("window.__ctR338Marker='discover-foryou-actions-flex-hard-reset-no-overlap'"),'runtime marker');
ok(js.includes("rpc('cinetracker_episode_search_v337'"),'r337 episode search preserved');
ok(js.includes("sessionStorage.setItem('cinetracker_home_tab_v337'"),'r337 Home authority preserved');
ok(js.includes('window.__ctR336EarlyHandle=earlyHandle338'),'first capture repointed');
ok(js.includes("for(const name of ['paintForYou','applyForYouFilter','swapForYou','persistForYou','switchDiscover'])wrap336(name)"),'repaint wrappers');
ok(runtime.includes("imp(row,'display','flex')"),'row flex hard reset');
ok(runtime.includes("imp(b,'transform','none')")&&runtime.includes("imp(b,'grid-area','auto')"),'button geometry reset');
ok(runtime.includes("imp(b,'flex','1 1 0px')")&&runtime.includes("imp(b,'width','0')"),'equal flex buttons');
ok(r.discover_foryou_layout==='r338-flex-row-hard-reset-no-overlap','release layout contract');
ok(r.discover_foryou_action_geometry==='2-or-3-equal-flex-buttons+no-transform+no-grid-placement','release geometry contract');
ok(r.discover_foryou_swap==='same-bucket+same-kind-only','same-kind swap preserved');
ok(r.discover_foryou_actions==='optimistic-immediate-replacement','optimistic replacement preserved');
ok(r.android==='1.0.20/10062','Android changed');
ok(!runtime.includes('MutationObserver'),'r338 introduced MutationObserver');
console.log('R338_STATIC_OK');
