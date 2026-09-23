import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R337_SKIP_BUILD!=='1')await import('./build-r337.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v337.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r337-search-home-foryou.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R337_STATIC '+m)};
ok(r.version==='1.0.128'&&r.revision==='r337-official-1.0.128','identity');
ok(html.includes('app-v337.js')&&html.includes('app-v337.css'),'assets');
ok(js.includes("window.__ctR337Marker='episode-catalog-search+home-desired-tab-settle+foryou-readable-same-kind-actions'"),'runtime marker');
ok(js.includes("rpc('cinetracker_episode_search_v337'"),'episode catalog RPC');
ok(js.includes("sessionStorage.setItem('cinetracker_home_tab_v337'"),'Home desired-tab persistence');
ok(js.includes('window.__ctR336EarlyHandle=earlyHandle337'),'first capture takeover');
ok(js.includes('html[data-ct337-home-aligning="1"] [data-home] [data-ct274-history]'),'history flash guard');
ok(js.includes('--ct337-slot-w:190px')&&js.includes('grid-template-columns:1.25fr .88fr .95fr'),'ForYou readable action geometry');
ok(r.search_episode_local==='cinetracker_episode_search_v337','release search contract');
ok(r.home_navigation==='r337-desired-tab-authority+multi-settle+user-scroll-cancel','release Home contract');
ok(r.discover_foryou_swap==='same-bucket+same-kind-only','release swap contract');
ok(r.discover_foryou_actions==='optimistic-immediate-replacement','release actions contract');
ok(r.android==='1.0.20/10062','Android changed');
ok(!runtime.includes('MutationObserver'),'r337 introduced MutationObserver');
console.log('R337_STATIC_OK');
