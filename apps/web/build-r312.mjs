import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r311.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v311.js'),'utf8'),
 readFile(resolve(dist,'app-v311.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r312-video-truth.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error(`r312 expected one ${label}, found ${n}`);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r312 missing '+x)};

for(const x of[
 "window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';",
 "const REVISION='r311-official-1.0.102';",
 "profileCache=null;ct171SeenMap=null;ov.remove();toast('Favorito adicionado.');await render()",
 "window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'",
 "window.__ctR311EarlyCapture=true",
 "\nboot();"
])must(js,x);

/* Bind r312 to the actual r255 Sports owner and retire the old global filter at its producer. */
js=once(js,
 "window.__ctR255Test={normalizeHome255,auditHome255,releasedFrontier255,watchedFrontier255,legacy255,liveLast255,sportRows255,genres255,eligible255,fmtSports255,mediaCard255};",
 "window.__ctR255Test={normalizeHome255,auditHome255,releasedFrontier255,watchedFrontier255,legacy255,liveLast255,sportRows255,genres255,eligible255,fmtSports255,mediaCard255,state:sport255,paintSports:paintSports255};",
 'r255 Sports state bridge'
);
{
 const fn=js.indexOf("function paintSports255(){");
 if(fn<0)throw new Error('r312 missing r255 Sports producer');
 const a=js.indexOf('<div class="ct255-sport-filters">',fn);
 const b=js.indexOf('<section class="panel ct255-sports-feed"',a);
 if(a<0||b<0)throw new Error('r312 cannot isolate old global Sports filter');
 js=js.slice(0,a)+js.slice(b);
}
/* Favorite actor/media writes must invalidate the persistent Profile preload, not only RAM. */
js=once(js,
 "profileCache=null;ct171SeenMap=null;ov.remove();toast('Favorito adicionado.');await render()",
 "profileCache=null;ct171SeenMap=null;try{localStorage.removeItem(CT163_CACHE+'profile')}catch{};try{ct163PreloadStarted=false}catch{};document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:kind==='person'?'favorite-actor-r312':'favorite-media-r312',kind,id:Number(item.id)}}));ov.remove();toast('Favorito adicionado.');await render()",
 'favorite persistent Profile cache invalidation'
);

/* r312 becomes the final live owner while reusing r311's already-first click capture. */
js=once(js,'\nboot();','\n'+runtime+'\nboot();','r312 insertion');
js=once(js,
 "window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';",
 "window.__ctWebBuild='1.0.103';window.__ctOfficialVersion='1.0.103';",
 'Web version'
);
js=once(js,"const REVISION='r311-official-1.0.102';","const REVISION='r312-official-1.0.103';",'revision');

/* Footer helper from r310/r311 follows current release. */
js=js.replaceAll("const version='1.0.102',revision='r311-official-1.0.102';","const version='1.0.103',revision='r312-official-1.0.103';")
     .replaceAll('CineTracker • v1.0.102','CineTracker • v1.0.103');

html=html.replaceAll('app-v311.js','app-v312.js').replaceAll('app-v311.css','app-v312.css').replaceAll('v1.0.102','v1.0.103').replaceAll('r311-official-1.0.102','r312-official-1.0.103');
sw=sw.replaceAll('ct-web-1.0.102-r311','ct-web-1.0.103-r312').replaceAll('app-v311.js','app-v312.js').replaceAll('app-v311.css','app-v312.css');
css+='\n/* CineTracker Web 1.0.103 r312 — latest video truth: no clipped Discover, JWT auto-refresh, inline Sports filters, live Profile favorites. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,version:'1.0.103',revision:'r312-official-1.0.103',base:'r311-production',
 scope:'latest-video-discover-auth-sports-profile-refresh-web-only',
 auth_jwt_expired_retry:true,
 auth_refresh_once_per_failure:true,
 discover_public_renderer:'r312-owned-card',
 discover_public_tabs:'trending+popular+new+anticipated+top',
 discover_public_exclusion:'canonical-seen+watchlist+local-state-before-markup',
 discover_public_copy:'wrapped-title+wrapped-meta+expandable-full-overview',
 discover_public_vertical_clip:false,
 discover_public_cache_ms:180000,
 discover_tab_cached_revisit:'instant-paint',
 discover_foryou_layout:'single-panel-compact-1+3+3',
 discover_foryou_giant_buttons:false,
 sports_filter_location:'inside-next+previous-header',
 sports_filter_source:'payload.sports+event-slug-fallback',
 sports_filter_all_system_sports:true,
 profile_stadium_click:true,
 profile_favorite_actor_persistent_cache_invalidation:true,
 profile_favorite_actor_data_changed:true,
 f1_calendar_renderer:'r311-clickable-race-buttons-preserved',
 f1_session_watch:true,
 android:'1.0.20/10062'
};

for(const x of[
 "window.__ctR312='discover-owned-cards+auth-refresh+sports-inline-filter+profile-live-favorites'",
 "jwt-refresh-once+retry-same-request",
 "function filterPublic312",
 "ct312-overview",
 "data-ct312-action=\"watchlist\"",
 "function paintForYou312",
 "data-ct312-sport-filter",
 "function sportsCatalog312",
 "state:sport255,paintSports:paintSports255",
 "stadium.dataset.ct299History='stadium'",
 "localStorage.removeItem(CT163_CACHE+'profile')",
 "favorite-actor-r312",
 "window.__ctR311EarlyHandle=exactClick312"
])must(js,x);
if(js.includes("profileCache=null;ct171SeenMap=null;ov.remove();toast('Favorito adicionado.');await render()"))throw new Error('r312 stale favorite cache path survived');
if(js.includes("window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';"))throw new Error('r312 stale identity survived');

await Promise.all([
 writeFile(resolve(dist,'app-v312.js'),js),
 writeFile(resolve(dist,'app-v312.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v311.js'),{force:true}),rm(resolve(dist,'app-v311.css'),{force:true})]);
console.log('WEB_R312_READY latest-video Discover + auth refresh + Sports inline filter + Profile favorite refresh');
