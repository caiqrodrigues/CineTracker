import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R312_SKIP_BUILD!=='1')await import('./build-r312.mjs');
const [js,html,releaseRaw]=await Promise.all([
 readFile(resolve('dist/app-v312.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(releaseRaw),ok=(v,m)=>{if(!v)throw new Error('R312_STATIC '+m)};

ok(r.version==='1.0.103'&&r.revision==='r312-official-1.0.103','release identity');
ok(html.includes('app-v312.js')&&html.includes('app-v312.css'),'assets');
ok(js.includes("window.__ctWebBuild='1.0.103';window.__ctOfficialVersion='1.0.103';"),'runtime version');
ok(js.includes("const REVISION='r312-official-1.0.103';"),'revision');
ok(js.includes("window.__ctR312='discover-owned-cards+auth-refresh+sports-inline-filter+profile-live-favorites'"),'r312 runtime');

/* Auth must recover the exact request rather than expose JWT expired to Sports. */
ok(js.includes("s.includes('jwt expired')"),'JWT-expired detector');
ok(js.includes("token?grant_type=refresh_token"),'refresh-token flow');
ok(js.includes("return run();"),'same-request retry');
ok(js.includes("auth_refresh_once_per_failure"),'release auth retry marker');

/* Public Discover must not depend on legacy ct288 card markup. */
ok(js.includes('function card312('),'owned Discover card missing');
ok(js.includes('class="ct312-media-card'),'owned card markup missing');
ok(js.includes('class="ct312-title"'),'wrapped title missing');
ok(js.includes('class="ct312-meta"'),'wrapped metadata missing');
ok(js.includes('class="ct312-overview"'),'expandable full overview missing');
ok(js.includes('data-ct312-action="watchlist"')&&js.includes('+ Watchlist'),'Watchlist button missing');
ok(js.includes('data-ct312-action="seen"')&&js.includes('✓ Visto'),'Visto button missing');
ok(js.includes("if(p?.seen?.has?.(k)||p?.watch?.has?.(k))continue"),'seen/watchlist last barrier missing');
ok(js.includes("s.match(/^tmdb-(movie|tv)-(\\d+)$/i)"),'legacy TMDB key normalization missing');
ok(js.includes("const PUBLIC=new Set(['trending','popular','new','anticipated','top'])"),'five public tabs mismatch');
ok(js.includes("publicRows312")&&js.includes("180000"),'tab cache missing');
ok(js.includes(".ct312-title{display:block!important;white-space:normal!important;overflow:visible!important"),'title can still be clipped');
ok(js.includes(".ct312-meta{display:block!important;white-space:normal!important;overflow:visible!important"),'metadata can still be clipped');
ok(js.includes(".ct312-public{overflow:visible!important"),'public panel still clips lower content');

/* Pra Você must be one compact owner, not three giant legacy panels. */
ok(js.includes('class="panel ct312-foryou"'),'single Pra Você panel missing');
ok(js.includes('ct312-fy-grid'),'Pra Você 3-slot groups missing');
ok(js.includes('.ct312-mini-swap')&&js.includes('height:28px!important'),'compact Trocar missing');
ok(r.discover_foryou_layout==='single-panel-compact-1+3+3','release compact Pra Você');

/* Profile favorite and stadium must be live. */
ok(js.includes("localStorage.removeItem(CT163_CACHE+'profile')"),'persistent Profile cache not invalidated');
ok(js.includes("favorite-actor-r312"),'favorite actor data-change missing');
ok(js.includes("stadium.dataset.ct299History='stadium'"),'Jogos no Estádio click contract missing');
ok(r.profile_stadium_click===true,'release stadium click');
ok(r.profile_favorite_actor_persistent_cache_invalidation===true,'release actor cache invalidation');

/* Sports filter must be dynamic from the actual system sports catalog. */
ok(js.includes("function sportsCatalog312"),'Sports catalog builder missing');
ok(js.includes("for(const s of rows(p?.sports))"),'Sports filter not sourced from payload.sports');
ok(js.includes("data-ct312-sport-filter"),'Sports filter control missing');
ok(js.includes("if(!['next','previous'].includes(String(sport255.tab)))"),'Sports filter leaks outside Próximos/Anteriores');
ok(r.sports_filter_all_system_sports===true,'release all-system-sports');

/* Preserve r311 F1 and Android. */
ok(js.includes("window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'"),'r311 F1 owner lost');
ok(r.f1_session_watch===true,'F1 watch lost');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R312_STATIC_OK latest-video rules locked');
