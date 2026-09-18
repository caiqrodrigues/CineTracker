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
ok(js.includes("window.__ctR312='single-owner-discover+auth-retry+live-profile+inline-sports-filters'"),'r312 runtime');
ok(js.includes("window.__ctR312EarlyCapture=true"),'pre-legacy capture');

ok(js.includes("data-ct312-discover")&&js.includes("data-ct312-content")&&js.includes("ct312-legacy-sink"),'persistent Discover shell');
ok(js.includes("const PUBLIC=new Set(['trending','popular','new','anticipated','top'])"),'five public tabs');
ok(js.includes("!p?.seen?.has?.(keyOf(x))&&!p?.watch?.has?.(keyOf(x))"),'seen/watchlist filter before markup');
ok(js.includes("data-ct312-action=\\\"watchlist\\\"")&&js.includes("+ Watchlist"),'Watchlist action');
ok(js.includes("data-ct312-action=\\\"seen\\\""),'seen action');
ok(js.includes("white-space:normal!important")&&js.includes("text-overflow:clip!important"),'copy still clipped');
ok(js.includes("scrollbar-width:auto!important"),'native horizontal scroll missing');
ok(js.includes("compact-daily+3-watchlist+3-fresh")||r.discover_foryou==='compact-daily+3-watchlist+3-fresh','compact For You');
ok(!js.includes("data-ct312-content><div class=\\\"ct312-loading\\\"></div></div><div class=\\\"ct312-tabs"),'content can replace tab shell');

ok(js.includes("function ct312JwtExpired"),'JWT expiry detector');
ok(js.includes("async function ct312RefreshAccess"),'refresh flow');
ok(js.includes("return api(path,options,false)"),'REST retry once');
ok(js.includes("return tmdb(path,params,false)"),'TMDB retry once');
ok(!js.includes("return api(path,options,true)"),'REST retry loop');

ok(js.includes("window.__ctR312R255="),'r255 lexical bridge');
ok(js.includes("sports_filter_location")||r.sports_filter_location==='inside-next+previous-heading','sports filter release flag');
ok(js.includes("data-ct312-sport=\\\"all\\\"")&&js.includes("p.sports||[]"),'dynamic payload.sports filters');
ok(js.includes("if(tab==='next'||tab==='previous')h+=sportsFilter312"),'filter not scoped to next/previous');

ok(js.includes("dataset.ct299History='stadium'"),'stadium click contract');
ok(js.includes("favorite_actors?select=id,tmdb_person_id,actor_name,profile_path,created_at"),'live favorite actor table');
ok(js.includes("src.includes('favorite-actor')"),'live actor data-change refresh');
ok(js.includes("data-ct312-f1-race"),'actual r255 F1 calendar clickable');
ok(js.includes("R311.openRace"),'r311 complete F1 detail preserved');

ok(r.discover_tabs_persist_during_loading===true,'release persistent tabs');
ok(r.discover_public_exclusion==='seen+watchlist-before-html','release exclusion');
ok(r.auth_jwt_refresh_retry===true&&r.auth_jwt_retry_count===1,'release JWT retry');
ok(r.profile_stadium_button_guaranteed===true,'release stadium button');
ok(r.profile_favorite_actors_live_table==='favorite_actors','release actors live');
ok(r.sports_filter_source==='payload.sports'&&r.sports_filter_dynamic===true,'release dynamic sports filter');
ok(r.f1_r311_preserved===true,'release F1 preserved');
ok(r.android==='1.0.20/10062','Android changed');

console.log('R312_STATIC_OK latest video: single-owner Discover + JWT + live Profile + dynamic Sports filters');
