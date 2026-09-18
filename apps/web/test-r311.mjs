import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R311_SKIP_BUILD!=='1')await import('./build-r311.mjs');
const [js,html,releaseRaw]=await Promise.all([
 readFile(resolve('dist/app-v311.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(releaseRaw),ok=(v,m)=>{if(!v)throw new Error('R311_STATIC '+m)};

ok(r.version==='1.0.102'&&r.revision==='r311-official-1.0.102','release identity');
ok(html.includes('app-v311.js')&&html.includes('app-v311.css'),'assets');
ok(js.includes("window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';"),'runtime version');
ok(js.includes("const REVISION='r311-official-1.0.102';"),'revision');
ok(js.includes("window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'"),'r311 runtime');
ok(js.includes("window.__ctR311EarlyCapture=true")&&js.includes("window.__ctR311EarlyHandle"),'r311 exact click capture is not registered before legacy handlers');

ok(js.includes("function styleWatchlistStats300(){return false}"),'r300 delayed Profile style still active');
ok(js.includes("function stabilizeProfile301(){return false}"),'r301 Profile mutation style still active');
ok(js.includes("card.className=[...base,'ct311-stat-unified'].join(' ')"),'Profile stats are not class-identical');
ok(js.includes("['Eventos assistidos','Jogos no Estádio','Séries Watchlist','Filmes Watchlist']"),'four Profile stat targets missing');

ok(js.includes("const PUBLIC_TABS=new Set(['trending','popular','new','anticipated','top'])"),'public Discover tabs mismatch');
ok(js.includes("if(p?.seen?.has?.(k)||p?.watch?.has?.(k))continue"),'seen/watchlist exclusion missing');
ok(js.includes('data-ct311-action="watchlist"')&&js.includes('+ Watchlist'),'Watchlist button missing');
ok(js.includes('data-ct311-action="seen"')&&js.includes('✓ Visto'),'Seen button missing');
ok(js.includes("ct311-browse-item")&&js.includes("ct311-actions"),'stable external action layout missing');

ok(js.includes('data-ct311-f1-race'), 'clickable F1 calendar race missing');
ok(js.includes("['fp1','Treino Livre 1'")&&js.includes("['race','Corrida'"),'F1 weekend sessions missing');
ok(js.includes("p_provider_event_id:session.id"),'F1 session stable event id missing');
ok(js.includes("cinetracker_sports_watch_set_v296"),'F1 watch RPC missing');
ok(js.includes("Grid de Largada")&&js.includes("Resultado de Chegada"),'complete F1 result sections missing');

ok(r.profile_stat_single_version===true,'release Profile single version');
ok(r.f1_session_watch===true,'release F1 session watch');
ok(r.discover_public_exclusion==='seen+watchlist-before-markup','release Discover exclusion');
ok(r.discover_public_watchlist_button===true,'release Watchlist action');
ok(r.discover_actions_outside_media_card===true,'release action position');
ok(r.android==='1.0.20/10062','Android changed');

console.log('R311_STATIC_OK Profile controls + F1 weekend detail + filtered stable Discover locked');
