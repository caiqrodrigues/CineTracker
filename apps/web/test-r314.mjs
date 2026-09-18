import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R314_SKIP_BUILD!=='1')await import('./build-r314.mjs');
const [js,html,releaseRaw]=await Promise.all([
  readFile(resolve('dist/app-v314.js'),'utf8'),
  readFile(resolve('dist/index.html'),'utf8'),
  readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(releaseRaw),ok=(v,m)=>{if(!v)throw new Error('R314_STATIC '+m)};

ok(r.version==='1.0.105'&&r.revision==='r314-official-1.0.105','release identity');
ok(html.includes('app-v314.js')&&html.includes('app-v314.css'),'assets');
ok(js.includes("window.__ctWebBuild='1.0.105';window.__ctOfficialVersion='1.0.105';"),'runtime version');
ok(js.includes("const REVISION='r314-official-1.0.105';"),'revision');
ok(js.includes("window.__ctR314='profile-static-stats+discover-strict-nine-tabs-stale-cache+f1-race-details'"),'r314 marker');
ok(js.indexOf('window.__ctR314EarlyCapture=true')<js.indexOf('window.__ctR313EarlyCapture=true'),'r314 click capture must be first');

ok(js.includes("['releases','Lançamentos']"),'Lançamentos tab missing');
ok(js.includes("const PUBLIC=new Set(['trending','popular','new','releases','anticipated','top'])"),'strict public tabs mismatch');
ok(js.includes('function strictFilter314')&&js.includes('p?.blocked?.has?.(k)||p?.aliases?.has?.(a)'),'strict seen/watchlist barrier missing');
ok(js.includes('cinetracker_watchlist_full_v119')&&js.includes('cinetracker_discovery_exclusions_v0994'),'Supabase personal authority incomplete');
ok(js.includes('SOURCE_STALE=5*60*1000')&&js.includes('PERSONAL_STALE=90*1000'),'stale-time cache contract missing');
ok(js.includes('function prefetch314')&&js.includes('for(const t of PREFETCH)'),'background prefetch missing');
ok(js.includes('snapshotCache'),'instant tab snapshot cache missing');
ok(js.includes('class="ct314-plus')&&js.includes('data-ct314-action="watchlist"'),'minimal + Watchlist action missing');
ok(js.includes('grid-template-columns:repeat(3,minmax(128px,148px))'),'compact Pra Você 3-up layout missing');
ok(js.includes('aspect-ratio:2/3!important'),'Pra Você 2:3 geometry missing');

ok(js.includes('async function renderProfile314(seq)'),'single live Profile renderer missing');
ok(!/renderProfile314[\s\S]{0,1300}ct163Read\('profile'\)/.test(js),'Profile stale cache fallback survived');
ok(js.includes("rpc314('cinetracker_profile_payload_v0997'")&&js.includes("rpc314('cinetracker_watchlist_full_v119'"),'Profile exact Supabase RPCs missing');
ok(js.includes('function makeStaticStat314')&&js.includes('ct314-watchlist-static'),'Watchlist stats not static');
ok(js.includes('function pinStats314'),'Profile stats top pinning missing');
ok(js.includes('width:132px!important')&&js.includes('height:198px!important'),'actor dimensions not strict');
ok(js.includes('ct314-actor-rail')&&js.includes('overflow-x:auto!important'),'actor-only horizontal rail missing');

ok(js.includes('async function openRace314'),'F1 race drawer missing');
ok(js.includes('/qualifying')&&js.includes('/results'),'selected-round F1 sources missing');
ok(js.includes('function gridRows314')&&js.includes('function finishRows314'),'F1 grid/result transforms missing');
ok(js.includes("`DNF · ${status||'Retirado'}`"),'DNF output missing');
ok(js.includes('Volta mais rápida'),'fastest lap output missing');
ok(js.includes("x.delta>0?'+'+x.delta:String(x.delta)"),'position delta output missing');
ok(js.includes('cinetracker_f1_watch_set_v314'),'F1 session watch RPC missing');
ok(js.includes('data-ct314-f1-previous'),'previous GP overview rail missing');

ok(r.discover_tabs===9&&r.discover_releases_restored===true,'release Discover contract');
ok(r.discover_public_exclusion==='seen+watchlist+alias-before-markup-strict','release exclusion contract');
ok(r.profile_cached_fallback===false&&r.profile_watchlist_stats==='static-no-arrow-no-modal-trigger','release Profile contract');
ok(r.f1_session_watch_rpc==='cinetracker_f1_watch_set_v314','release F1 persistence contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R314_STATIC_OK profile + strict nine-tab Discover + F1 selected-race details locked');
