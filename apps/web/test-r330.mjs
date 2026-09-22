import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R330_SKIP_BUILD!=='1')await import('./build-r330.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v330.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R330_STATIC '+m)};
ok(r.version==='1.0.121'&&r.revision==='r330-official-1.0.121','identity');
ok(html.includes('app-v330.js')&&html.includes('app-v330.css'),'assets');
ok(js.includes("window.__ctR330Marker='home-immediate-paint+cancel-stale-reconcile+discover-buttons-grid+top10-up-no-provider-duplicate'"),'runtime marker');
ok(js.includes('window.__ctR330HomeFirstPaintAt=Date.now()'),'Home immediate-paint marker');
ok(js.includes("if(seq!==ct285HomeSeq||ct274Payload()!==payload||route()!=='home')return;"),'Home stale-route guard');
ok(js.includes("requestIdleCallback(kick,{timeout:750})"),'Home background reconcile scheduling');
ok(js.includes("setTimeout(()=>{if(routeNow()==='home')void refreshTv325(false)},1600)"),'TV refresh still competing with first paint');
ok(js.includes("const a=await exact321([...raw.movies,...raw.series]);"),'Top10 final personal audit missing');
ok(js.includes("h.innerHTML='<section class=\\\"ct288-top-shell\\\"><div class=\\\"ct288-provider-row\\\""),'Top10 providers are not first content');
ok(js.includes('ct288-top-title,.ct288-top-name{display:none!important'),'Top10 duplicate heading CSS missing');
ok(js.includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'Pra voce 3-column actions missing');
ok(r.home_initial_render==='db-payload-first-before-live-series-reconcile','Home release contract');
ok(r.home_reconcile==='background-idle+route-and-sequence-guard','Home reconcile contract');
ok(r.discover_top10==='progressive-fill-ten+v326-final-audit','Top10 release contract');
ok(r.discover_top10_heading==='provider-pills-only-no-duplicate-provider-name','Top10 heading release');
ok(r.discover_foryou_actions==='three-equal-compact-buttons-one-row','Pra voce actions release');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v326','Discover filter authority changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R330_STATIC_OK');
