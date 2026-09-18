import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';

await import('./build-r311.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,payload]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v311.js'),'utf8'),
 readFile(resolve(dist,'app-v311.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r312-video-truth.js.gz.b64'),'utf8')
]);
let runtime=gunzipSync(Buffer.from(payload.trim(),'base64')).toString('utf8');
{
 const end='\n})();',i=runtime.lastIndexOf(end);
 if(i<0)throw new Error('r312 runtime closure not found');
 const hook="\ntry{window.__ctR312Test.setSportsState=function(v){if(v&&typeof v==='object'){if(v.tab!=null)sport255.tab=String(v.tab);if(v.sport!=null)sport255.sport=String(v.sport);if(v.payload!=null)sport255.payload=v.payload}}}catch{}\n";
 runtime=runtime.slice(0,i)+hook+runtime.slice(i);
}
new Function(runtime);
const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error('r312 expected one '+label+', found '+n);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r312 missing '+x)};

for(const x of[
 "window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';",
 "const REVISION='r311-official-1.0.102';",
 "window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'",
 "window.__ctR311EarlyCapture=true",
 "const version='1.0.102',revision='r311-official-1.0.102';",
 "\nboot();"
])must(js,x);

const early312=String.raw`(()=>{if(window.__ctR312EarlyCapture)return;window.__ctR312EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR312EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();`;

js=once(js,
 "const version='1.0.102',revision='r311-official-1.0.102';",
 "const version='1.0.103',revision='r312-official-1.0.103';",
 'footer identity'
);
js=once(js,'\nboot();','\n'+runtime+'\nboot();','r312 insertion');
js=early312+'\n'+js;
js=once(js,
 "window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';",
 "window.__ctWebBuild='1.0.103';window.__ctOfficialVersion='1.0.103';",
 'Web version'
);
js=once(js,"const REVISION='r311-official-1.0.102';","const REVISION='r312-official-1.0.103';",'revision');

html=html.replaceAll('app-v311.js','app-v312.js').replaceAll('app-v311.css','app-v312.css').replaceAll('v1.0.102','v1.0.103').replaceAll('r311-official-1.0.102','r312-official-1.0.103');
sw=sw.replaceAll('ct-web-1.0.102-r311','ct-web-1.0.103-r312').replaceAll('app-v311.js','app-v312.js').replaceAll('app-v311.css','app-v312.css');
css+='\n/* CineTracker Web 1.0.103 r312 — latest-video stable Discover, auth retry, Profile and Sports filters. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.103',
 revision:'r312-official-1.0.103',
 base:'r311-green-head',
 scope:'latest-video-discover-auth-profile-sports-web-only',
 discover_single_shell:true,
 discover_tabs_persistent_during_load:true,
 discover_public_tabs:'trending+popular+new+anticipated+top',
 discover_public_exclusion:'seen+watchlist-before-markup',
 discover_public_own_cards:true,
 discover_public_watchlist_button:true,
 discover_public_seen_button:true,
 discover_metadata_unclipped:true,
 discover_native_horizontal_scroll:true,
 discover_foryou_compact:true,
 discover_foryou_source:'r309-exact-pools',
 auth_expired_jwt_refresh_retry:true,
 profile_stadium_button_guaranteed:true,
 profile_actor_source:'favorite_actors-live-table',
 profile_actor_write_invalidation:true,
 sports_inline_filter_tabs:'next+previous',
 sports_inline_filter_source:'payload.sports',
 f1_calendar_renderer:'r311-clickable-race-buttons',
 f1_session_watch:true,
 android:'1.0.20/10062'
};

for(const x of[
 "window.__ctR312='discover-single-shell+auth-refresh+profile-live-favorites+stadium-button+sports-inline-filters'",
 "window.__ctR312EarlyCapture=true",
 "refresh-expired-jwt-and-retry-once",
 "cinetracker_watchlist_full_v119",
 "cinetracker_profile_media_dashboard_v0991",
 "cinetracker_discovery_exclusions_v0994",
 "data-ct312-action=\"watchlist\"",
 "data-ct312-action=\"seen\"",
 "favorite_actors?select=id,tmdb_person_id,actor_name,profile_path",
 "cinetracker_sports_stadium_summary_v296",
 "data-ct312-sport-filter",
 "sport255?.payload?.sports",
 "setSportsState=function(v)",
 "window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'",
 "const version='1.0.103',revision='r312-official-1.0.103';"
])must(js,x);
if(!js.startsWith(early312+'\n'))throw new Error('r312 exact capture is not first');
if(js.includes("window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';"))throw new Error('r312 stale web identity survived');
if(release.android!=='1.0.20/10062')throw new Error('r312 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v312.js'),js),
 writeFile(resolve(dist,'app-v312.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v311.js'),{force:true}),rm(resolve(dist,'app-v311.css'),{force:true})]);
console.log('WEB_R312_READY latest-video Discover + auth + Profile + Sports; F1 r311 preserved');
