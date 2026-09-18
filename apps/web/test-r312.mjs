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

ok(js.includes('let ct312RefreshTask=null;'),'refresh lock missing');
ok(js.includes('async function ct312RefreshSession(force=false)'),'refresh owner missing');
ok(js.includes("Number(session.expires_at)>now+120"),'proactive refresh window missing');
ok(js.includes('ct312AuthFailure(out.r.status,out.d)'), '401/JWT retry missing');
ok(js.includes("String(session?.access_token||'')===out.token"),'concurrent refresh guard missing');

ok(js.includes("window.__ctR312='jwt-refresh+discover-own-card+foryou-compact+profile-fresh+sport-heading-filters'"),'r312 runtime missing');
ok(js.includes("const PUBLIC=new Set(['trending','popular','new','anticipated','top'])"),'five public tabs mismatch');
ok(js.includes("rpc('cinetracker_recommendation_state_v108',{})"),'fail-closed personal proof missing');
ok(js.includes("if(p?.seen?.has?.(k)||p?.watch?.has?.(k))continue"),'seen/watchlist exclusion missing');
ok(js.includes('class="ct312-discover-item"'),'own Discover card missing');
ok(js.includes('data-ct312-action="watchlist"')&&js.includes('data-ct312-action="seen"'),'Discover actions missing');
ok(js.includes('two-line-title')||r.discover_public_copy==='two-line-title+visible-metadata','copy release flag');
ok(js.includes('requestIdleCallback'),'Discover prefetch missing');

ok(js.includes("if(false&&has&&seq===navSeq&&route()==='profile')"),'stale Profile cache can still prepaint');
ok(js.includes('merged.sports_stats.stadium_events=stadiumCount'),'stadium not in first paint payload');
ok(js.includes('data-ct299-history="stadium"'),'stadium button missing');
ok(js.includes('class="stat ct312-stat-button"'),'canonical Profile button missing');

ok(js.includes('window.__ctR312SportsCatalog'),'all-sports catalog bridge missing');
ok(js.includes('ct312-sport-filter-rail'),'Sports heading filter missing');
ok(js.includes('data-ct255-sport-filter'),'Sports filter does not reuse native state');
ok(r.sports_filter_location==='next+previous-panel-heading','Sports filter release location');

ok(js.includes("window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'"),'r311 F1 baseline lost');
ok(js.includes('data-ct311-f1-race')&&js.includes('cinetracker_sports_watch_set_v296'),'F1 interaction lost');
ok(r.f1_r311_preserved===true,'F1 release preservation');

ok(r.auth_proactive_refresh===true&&r.auth_retry_401_once===true,'auth release flags');
ok(r.discover_public_no_unfiltered_fallback===true,'Discover fail-closed flag');
ok(r.profile_stadium_button===true,'stadium release flag');
ok(r.android==='1.0.20/10062','Android changed');

console.log('R312_STATIC_OK auth + Discover + Profile + Sports latest-video regressions locked');
