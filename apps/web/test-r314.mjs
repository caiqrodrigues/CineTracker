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
ok(js.includes("window.__ctR314='discover-calendar-foryou-final+f1-no-watch-summary+profile-stats-collapse'"),'r314 runtime');
ok(js.includes('window.__ctR314EarlyCapture=true'),'r314 exact capture missing');

ok(js.includes("const PUBLIC=new Set(['trending','popular','new','anticipated','top'])"),'public tab set');
ok(js.includes('if(p?.blocked?.has?.(k)||p?.seen?.has?.(k)||p?.watch?.has?.(k)||p?.aliases?.has?.(a))continue'),'hard personal barrier');
ok(js.includes('function paintCalendar314'),'owned calendar renderer');
ok(js.includes('ct314-calendar-rail'),'calendar fixed rail');
ok(js.includes('function paintForYou314'),'owned For You renderer');
ok(js.includes('ct314-foryou-panel'),'compact For You panel');
ok(js.includes('data-ct314-action="watchlist"')&&js.includes('data-ct314-action="seen"'),'stable actions');
ok(js.includes('white-space:normal!important')&&js.includes('text-overflow:clip!important'),'unclipped media copy');

ok(!js.includes('Seu registro'),'F1 Seu registro survived');
ok(!js.includes('Fórmula 1 assistida')&&!js.includes('Formula 1 assistida'),'F1 watched summary survived');
ok(js.includes("window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'"),'clickable F1 weekend owner lost');
ok(js.includes('data-ct311-f1-race'),'F1 race click contract lost');
ok(js.includes('cinetracker_sports_watch_set_v296'),'F1 session watch lost');

ok(js.includes('function normalizeStats314'),'Profile stat normalizer missing');
ok(js.includes("['Eventos assistidos','Jogos no Estádio','Séries Watchlist','Filmes Watchlist']"),'four canonical Profile stats missing');
ok(js.includes('data-ct314-sports-collapse'),'Profile Sports collapse missing');
ok(js.includes('ct314-sports-panel.ct314-collapsed>:not(.panel-head)'),'Sports collapse CSS missing');
ok(js.includes('patchActors312'),'live actor patch lost');

ok(js.includes('async function sportsRpc314'),'Sports JWT retry helper missing');
ok(js.includes('await restoreSession();return rpc(name,args)'),'Sports JWT refresh retry missing');
ok(js.includes('data-ct313-sport-filter'),'r313 dynamic sports filter lost');

ok(r.discover_calendar_renderer==='r314-date-groups-fixed-card-width','release calendar owner');
ok(r.discover_calendar_narrow_slivers===false,'release calendar slivers');
ok(r.discover_foryou_renderer==='r314-compact-single-panel','release For You owner');
ok(r.discover_public_exclusion==='seen+watchlist+alias-before-markup','release public barrier');
ok(r.f1_watch_summary_in_hub===false,'release F1 summary');
ok(r.profile_sports_collapse===true,'release Profile Sports collapse');
ok(r.sports_jwt_refresh_retry===true,'release Sports JWT retry');
ok(r.android==='1.0.20/10062','Android changed');

console.log('R314_STATIC_OK video-truth owners locked');
