import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R329_SKIP_BUILD!=='1')await import('./build-r329.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v329.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R329_STATIC '+m)};
ok(r.version==='1.0.120'&&r.revision==='r329-official-1.0.120','identity');
ok(html.includes('app-v329.js')&&html.includes('app-v329.css'),'assets');
ok(js.includes("window.__ctR329Marker='discover-cache-first-tabs+idle-prefetch+compact-foryou-cards'"),'runtime marker');
ok(js.indexOf('window.__ctR329EarlyCapture=true')<js.indexOf('window.__ctR327EarlyCapture=true'),'r329 capture must be first');
ok(js.includes('source:source321'),'r321 source prefetch export missing');
ok(!js.includes("if(routeNow()==='discover')scheduleDiscover327();"),'old discover mutation sweep still active');
ok(js.includes("grid-template-columns','repeat('+count+',minmax(0,1fr))"),'hard one-row action layout missing');
ok(js.includes("grid-template-columns:repeat(3,158px)"),'fixed close card grid missing');
ok(r.discover_navigation==='cache-first-return+no-loader-for-fresh-cache','cache-first release');
ok(r.discover_prefetch==='idle-public-source-prefetch','prefetch release');
ok(r.discover_r327_mutation_sweep===false,'old observer release');
ok(r.discover_foryou_layout==='three-158px-cards-start-aligned','ForYou layout release');
ok(r.discover_foryou_actions==='three-buttons-one-row-24px','ForYou actions release');
ok(r.home==='r328-preserved','Home changed');
ok(r.profile_watchlist_counts==='r324-preserved-exact','Profile changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R329_STATIC_OK');
