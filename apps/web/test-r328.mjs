import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R328_SKIP_BUILD!=='1')await import('./build-r328.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v328.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R328_STATIC '+m)};
ok(r.version==='1.0.119'&&r.revision==='r328-official-1.0.119','identity');
ok(html.includes('app-v328.js')&&html.includes('app-v328.css'),'assets');
ok(js.includes("window.__ctR328Marker='single-home-rpc+cache-first-nav+natural-history+watched-date'"),'runtime marker');
ok(js.includes("rpc('cinetracker_home_payload_v328'"),'single Home RPC missing');
ok(js.includes("ct274FetchHome=fetchHome328"),'old Home fetch chain not superseded');
ok(js.includes("renderHome=renderHome328"),'cache-first Home renderer not installed');
ok(js.includes("ct274AutoBottom=function(){normalizeHistory328();return false}"),'nested history scroll neutralizer missing');
ok(js.includes("force328(stack,'overflow-y','visible')")&&js.includes("force328(shell,'overflow-y','visible')"),'hard natural overflow missing');
ok(js.includes("fixHistoryDates328"),'history watched-date fix missing');
ok(r.home_payload_source==='cinetracker_home_payload_v328-single-rpc','release Home source');
ok(r.home_payload_previous_parallel_rpcs===false,'parallel Home RPC regression');
ok(r.home_navigation==='cache-first-immediate+background-refresh-after-60s','cache-first release');
ok(r.home_history_inner_scroll===false,'inner history scroll release');
ok(r.home_history_episode_date==='watched_at-not-air-date','episode history date release');
ok(r.discover==='r327-preserved','Discover unexpectedly changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R328_STATIC_OK');
