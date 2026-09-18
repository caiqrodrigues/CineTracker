import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R313_SKIP_BUILD!=='1')await import('./build-r313.mjs');
const [js,html,releaseRaw]=await Promise.all([
  readFile(resolve('dist/app-v313.js'),'utf8'),
  readFile(resolve('dist/index.html'),'utf8'),
  readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(releaseRaw),ok=(v,m)=>{if(!v)throw new Error('R313_STATIC '+m)};

ok(r.version==='1.0.104'&&r.revision==='r313-official-1.0.104','release identity');
ok(html.includes('app-v313.js')&&html.includes('app-v313.css'),'assets');
ok(js.includes("window.__ctWebBuild='1.0.104';window.__ctOfficialVersion='1.0.104';"),'runtime version');
ok(js.includes("const REVISION='r313-official-1.0.104';"),'revision');
ok(js.includes("window.__ctR313='discover-approved-card+hidden-filter+sports-producer-filter+profile-single-render'"),'r313 marker');
ok(js.indexOf("window.__ctR313EarlyCapture=true")<js.indexOf("window.__ctR312EarlyCapture=true"),'r313 click capture must be first');

ok(js.includes('ct288-filter-btn ct313-filter-btn'),'minimal Discover filter toggle missing');
ok(js.includes('data-ct313-types')&&js.includes('hidden'),'Discover types not hidden by default');
ok(js.includes("ct288Card(x,{watch:false,add:false})"),'approved ct288 media card missing');
ok(!js.includes('<article class="ct312-card"'),'r312 custom banner/card survived');
ok(js.includes("const PUBLIC=new Set(['trending','popular','new','anticipated','top'])"),'public tabs mismatch');
ok(js.includes("p?.blocked?.has?.(k)||p?.aliases?.has?.(a)"),'hard seen/watchlist+alias barrier missing');
ok(js.includes('data-ct313-action="watchlist"')&&js.includes('data-ct313-action="seen"'),'stable Discover actions missing');
ok(js.includes("white-space:normal!important")&&js.includes("text-overflow:clip!important"),'unclipped card copy missing');
ok(js.includes("window.__ctR309?.buildForYou"),'approved compact Pra Você owner missing');

ok(js.includes("function paintSports255(){")&&js.includes('data-ct313-sport-filter'),'Sports producer inline filter missing');
ok(js.includes("sports=Array.isArray(p.sports)?p.sports:[]"),'Sports filter not sourced from payload.sports');
ok(js.includes("['next','previous'].includes(sport255.tab)"),'Sports filter tabs mismatch');
ok(!js.includes('<div class="ct255-sport-filters">'),'old global Sports filter still produced');

ok(js.includes('async function renderProfile313(seq)'),'single Profile renderer missing');
ok(js.includes("renderProfile=renderProfile313"),'r313 is not final Profile owner');
ok(js.includes("ct168PaintProfile(merged,'')"),'canonical one-paint Profile missing');
ok(js.includes("canonicalStats313(root,stadiumCount)"),'canonical Profile stats missing');
ok(js.includes("data.ct299History='stadium'")||js.includes("dataset.ct299History='stadium'"),'stadium click contract missing');
ok(js.includes("function jwtExpired313")&&js.includes('await restoreSession()'),'JWT refresh retry missing');

ok(js.includes("window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'"),'r311 F1 baseline lost');
ok(js.includes('data-ct311-f1-race')&&js.includes('cinetracker_sports_watch_set_v296'),'F1 detail/watch lost');

ok(r.discover_type_filter==='compact-hidden-toggle'&&r.discover_type_filter_default_hidden===true,'release hidden filter');
ok(r.discover_custom_banner===false&&r.discover_card_renderer==='ct288-approved','release approved card');
ok(r.discover_public_exclusion==='seen+watchlist+alias-before-markup','release personal barrier');
ok(r.sports_inline_filter_owner==='paintSports255-producer'&&r.sports_inline_filter_source==='payload.sports','release Sports producer filter');
ok(r.profile_renderer==='r313-single-canonical'&&r.profile_single_paint===true&&r.profile_version_switching===false,'release Profile owner');
ok(r.android==='1.0.20/10062','Android changed');

console.log('R313_STATIC_OK approved Discover + producer Sports filter + one Profile version locked');
