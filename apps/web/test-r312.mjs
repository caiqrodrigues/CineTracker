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
ok(js.includes("window.__ctR312='discover-single-shell+auth-refresh+profile-live-favorites+stadium-button+sports-inline-filters'"),'r312 marker');
ok(js.indexOf("window.__ctR312EarlyCapture=true")<js.indexOf("window.__ctR311EarlyCapture=true"),'r312 click capture must precede r311/r306');

ok(js.includes("function jwtExpired312")&&js.includes("refreshSession312"),'JWT refresh missing');
ok(js.includes("grant_type=refresh_token"),'refresh token exchange missing');
ok(js.includes("saveSession(d);user=d.user||user"),'refreshed session not persisted');
ok(js.includes("if(!jwtExpired312(e))throw e;await refreshSession312()"),'expired JWT retry missing');

ok(js.includes("function shellHtml312"),'persistent Discover shell missing');
ok(js.includes("data-ct312-loadline")&&js.includes("data-ct312-content"),'Discover loadline/content missing');
ok(js.includes("const PUBLIC=new Set(['trending','popular','new','anticipated','top'])"),'public tab set mismatch');
ok(js.includes("cinetracker_watchlist_full_v119")&&js.includes("cinetracker_profile_media_dashboard_v0991")&&js.includes("cinetracker_discovery_exclusions_v0994"),'personal exclusion sources incomplete');
ok(js.includes("function filterPublic312"),'pre-markup filter missing');
ok(js.includes("data-ct312-action=\"watchlist\"")&&js.includes("data-ct312-action=\"seen\""),'stable public actions missing');
ok(js.includes("white-space:normal!important")&&js.includes("text-overflow:clip!important")&&js.includes("-webkit-line-clamp:unset!important"),'metadata clipping override missing');
ok(js.includes("function paintForYou312")&&js.includes("ct312-fy-grid"),'compact Pra Você renderer missing');
ok(js.includes("[data-ct312-pending=\"foryou\"]>[data-ct309-owned]"),'legacy giant Pra Você not hidden during ownership');

ok(js.includes("cinetracker_sports_stadium_summary_v296"),'stadium summary missing');
ok(js.includes("data-ct299-history','stadium'"),'stadium click contract missing');
ok(js.includes("favorite_actors?select=id,tmdb_person_id,actor_name,profile_path"),'live actor source missing');
ok(js.includes("favorite-actors-r312"),'actor write invalidation missing');

ok(js.includes("function sportsFilterMarkup312"),'sports filter markup missing');
ok(js.includes("sport255?.payload?.sports"),'sports filter is not dynamic from payload.sports');
ok(js.includes("['next','previous'].includes"),'sports filters not limited to Próximos/Anteriores');
ok(js.includes("data-ct312-sport-filter"),'sports filter click missing');

ok(js.includes("window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'"),'r311 F1 baseline lost');
ok(js.includes("data-ct311-f1-race")&&js.includes("cinetracker_sports_watch_set_v296"),'r311 F1 click/watch lost');
ok(r.discover_single_shell===true&&r.discover_tabs_persistent_during_load===true,'release Discover shell flags');
ok(r.discover_public_exclusion==='seen+watchlist-before-markup','release exclusion');
ok(r.discover_metadata_unclipped===true&&r.discover_foryou_compact===true,'release layout flags');
ok(r.auth_expired_jwt_refresh_retry===true,'release auth flag');
ok(r.profile_stadium_button_guaranteed===true&&r.profile_actor_source==='favorite_actors-live-table','release Profile flags');
ok(r.sports_inline_filter_tabs==='next+previous'&&r.sports_inline_filter_source==='payload.sports','release sports filter flags');
ok(r.android==='1.0.20/10062','Android changed');

console.log('R312_STATIC_OK latest-video contracts locked');
