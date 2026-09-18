import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R314_SKIP_BUILD!=='1')await import('./build-r314.mjs');
const [js,html,releaseRaw]=await Promise.all([readFile(resolve('dist/app-v314.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8')]);
const r=JSON.parse(releaseRaw),ok=(v,m)=>{if(!v)throw new Error('R314_STATIC '+m)};
ok(r.version==='1.0.105'&&r.revision==='r314-official-1.0.105','release identity');
ok(html.includes('app-v314.js')&&html.includes('app-v314.css'),'assets');
ok(js.includes("window.__ctWebBuild='1.0.105';window.__ctOfficialVersion='1.0.105';"),'runtime version');
ok(js.includes("const REVISION='r314-official-1.0.105';"),'revision');
ok(js.indexOf('window.__ctR314EarlyCapture=true')<js.indexOf('window.__ctR313EarlyCapture=true'),'r314 capture must be first');
// Discover
ok(js.includes("['releases','Lançamentos']"),'Lançamentos missing');
ok(js.includes("const STRICT=new Set(['trending','popular','new','releases','anticipated','top'])"),'strict six mismatch');
ok(js.includes('p?.blocked?.has?.(k)||p?.aliases?.has?.(a)'),'strict personal barrier missing');
ok(js.includes('const STALE_MS=5*60*1000,REVALIDATE_MS=60*1000'),'stale-time cache missing');
ok(js.includes('setTimeout(prefetch314,0)'),'background prefetch missing');
ok(js.includes("ct288Card(x,{rank,watch,add:!watch})"),'minimal + card contract missing');
ok(js.includes('aspect-ratio:2/3!important'),'Pra Você 2:3 compact ratio missing');
// Profile
ok(js.includes('async function renderProfile314(seq)'),'r314 Profile renderer missing');
ok(js.includes("rpc314('cinetracker_profile_payload_v0997'"),'live Profile RPC missing');
ok(!js.slice(js.indexOf('async function renderProfile314(seq)'),js.indexOf('/* F1:')).includes("ct163Read('profile')"),'Profile stale cache fallback returned');
ok(js.includes("card.removeAttribute('data-watchlist-kind')")&&js.includes('ct314-static-stat'),'Watchlist counters still interactive');
ok(js.includes('moveStatsTop314(root)'),'stats top stabilization missing');
ok(js.includes('.ct314-actor-rail')&&js.includes('height:176px!important'),'actor geometry/rail missing');
// F1
ok(js.includes('/qualifying.json?limit=100'),'true qualifying endpoint missing');
ok(js.includes('/results.json?limit=100'),'race result endpoint missing');
ok(js.includes('Grid de Largada · Classificação')&&js.includes('Resultado Final de Chegada'),'F1 sections missing');
ok(js.includes('grid-pos')&&js.includes('ct314-dnf')&&js.includes('ct314-fastest'),'delta/DNF/fastest markers missing');
ok(js.includes('cinetracker_f1_session_watch_set_v314')&&js.includes('cinetracker_f1_session_watch_history_v314'),'F1 session persistence missing');
ok(js.includes('GPs anteriores')&&js.includes('data-ct314-f1-race'),'previous GP click detail missing');
ok(r.discover_tabs===9&&r.discover_releases_restored===true,'release Discover tabs');
ok(r.profile_renderer==='r314-live-supabase-only'&&r.profile_watchlist_stats==='static-no-chevron-no-modal','release Profile contract');
ok(r.f1_detail==='qualifying+final+delta+dnf+fastest-lap'&&r.f1_session_watch_rpc==='cinetracker_f1_session_watch_set_v314','release F1 contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R314_STATIC_OK nine-tab strict Discover + live stable Profile + F1 detail contract');
