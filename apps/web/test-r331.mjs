import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R331_SKIP_BUILD!=='1')await import('./build-r331.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v331.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R331_STATIC '+m)};
ok(r.version==='1.0.122'&&r.revision==='r331-official-1.0.122','identity');
ok(html.includes('app-v331.js')&&html.includes('app-v331.css'),'assets');
ok(js.includes("window.__ctR331Marker='home-cache-first+history-natural-scroll+discover-foryou-final-guard'"),'runtime marker');
ok(js.includes('window.__ctR331HomeCachePaintAt=Date.now()'),'cache-first paint marker');
ok(js.includes('window.__ctR331RenderHomeTest=ct274RenderHome'),'cache-first render test hook missing');
ok(js.includes('void (async()=>{'),'background Home refresh missing');
ok(js.includes('ct331RefreshHistory(false).then'),'background history refresh missing');
ok(js.includes("try{window.__ct0997PreloadedHomeLive=null}catch{}"),'visible Home cache not preserved');
ok(!js.includes("try{homeCache=null;window.__ct0997PreloadedHomeLive=null}catch{}"),'Home cache is still cleared');
ok(js.includes("requestIdleCallback(run,{timeout:2500})"),'TV refresh not deferred to idle');
ok(js.includes("html[data-ct326-fy-filtering=\"1\"] [data-ct329-foryou]"),'stale r329 ForYou guard missing');
ok(js.includes("grid-template-columns:repeat(3,minmax(0,1fr))"),'ForYou single-row buttons missing');
ok(js.includes("rpc('cinetracker_discover_filter_v326'"),'Discover v326 authority changed');
ok(js.includes("const a=await exact321([...raw.movies,...raw.series]);"),'Top10 final audit missing');
ok(r.home_navigation==='cache-first-immediate-then-background-refresh','Home navigation release');
ok(r.home_history_behavior==='normal-page-flow-above-anchor+newest-nearest-content+no-toggle+no-inner-scroll','history release');
ok(r.discover_foryou_filter_guard==='hide-r309+r328+r329-drafts-until-audit-finishes','ForYou guard release');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v326','Discover authority');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R331_STATIC_OK');
