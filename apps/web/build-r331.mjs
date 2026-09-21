import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r326.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v326.js'),'utf8'),
 readFile(resolve(dist,'app-v326.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r331-home-discover-stable.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r331 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r331 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.117';window.__ctOfficialVersion='1.0.117';",
 "const REVISION='r326-official-1.0.117';",
 "const version='1.0.117',revision='r326-official-1.0.117';",
 "window.__ctR326Marker='home-history-scroll-up+discover-compact-actions+strict-v326'",
 "window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'",
 "cinetracker_discover_filter_v326",
 "for(let page=1;page<=5&&!enough();page++){",
 "for(let page=1;page<=5&&(movies.length<10||series.length<10);page++){",
 "const candidates=rows.filter(x=>Number(x?.watched_episodes||0)>0&&['continue','up_to_date','dust'].includes(x?.home_bucket)).slice(0,40);",
 "row.__ct325NewEpisode=recentEpisode325(unseen.air_date);",
 "qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action,.ct308-actions,.ct309-actions',root).forEach(x=>x.remove());",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR331Marker='home-history-above-viewport+foryou-owned-actions-filters+discover-v327'",
 "homeAnchorTarget331",
 "data-ct331-fy-kind",
 "version:'1.0.122'"
])must(runtime,x);

/* Canonical v327 Discover authority: handles legacy aliases + watch-play events. */
js=js.replaceAll('cinetracker_discover_filter_v326','cinetracker_discover_filter_v327');

/* r310 must never delete or hide the r309 Pra voce action row. */
js=js.replaceAll(
 "qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action,.ct308-actions,.ct309-actions',root).forEach(x=>x.remove());",
 "qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action,.ct308-actions',root).forEach(x=>x.remove());"
);
js=js.replaceAll(",[data-ct310-owned] .ct309-actions{display:none!important}","{display:none!important}");

/* Base r309 recommendation generation must not wait for unrelated recent-history loading. */
const slowFY="const recentP=Promise.resolve(S.loadRecent296?.()).catch(()=>null);\n  const freshP=Promise.all([freshKind('movie'),freshKind('series'),freshKind('anime')]);\n  const [a,fullWatch,freshParts]=await Promise.all([authorityP,watchP,freshP,recentP.then(()=>null).then(()=>freshP)]);";
must(js,slowFY);
js=js.replace(slowFY,"void Promise.resolve(S.loadRecent296?.()).catch(()=>null);\n  const freshP=Promise.all([freshKind('movie'),freshKind('series'),freshKind('anime')]);\n  const [a,fullWatch,freshParts]=await Promise.all([authorityP,watchP,freshP]);");

/* Stop recommendation refill immediately when the user changes route/tab. */
js=js.replace(
 "for(let page=1;page<=5&&!enough();page++){",
 "for(let page=1;page<=5&&!enough()&&token===loadToken&&routeNow()==='discover'&&String(discover?.tab)==='foryou';page++){"
);
js=js.replace(
 "   const batch=dedupe321(parts.flat());if(!batch.length)continue;\n   const ba=await exact321(batch);",
 "   if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;\n   const batch=dedupe321(parts.flat());if(!batch.length)continue;\n   const ba=await exact321(batch);"
);
js=js.replace(
 "  let a=await exact321([...watch,...fresh]);\n  watch=watch.filter",
 "  let a=await exact321([...watch,...fresh]);\n  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;\n  watch=watch.filter"
);

/* Top10 stops launching pages after navigation, and does not refilter an already filtered Top10. */
js=js.replace(
 "for(let page=1;page<=5&&(movies.length<10||series.length<10);page++){",
 "for(let page=1;page<=5&&(movies.length<10||series.length<10)&&routeNow()==='discover'&&String(discover?.tab)==='top10';page++){"
);
js=js.replace(
 "  const batch=dedupe321([...m,...t]);if(!batch.length)continue;\n  const a=await exact321(batch);",
 "  if(routeNow()!=='discover'||String(discover?.tab)!=='top10')break;\n  const batch=dedupe321([...m,...t]);if(!batch.length)continue;\n  const a=await exact321(batch);"
);
const topPaintOld="const raw=await topRaw321(provider,force),a=await exact321([...raw.movies,...raw.series]);\n  if(token!==topToken||String(discover?.tab)!=='top10')return false;\n  const movies=raw.movies.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10),series=raw.series.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);";
must(js,topPaintOld);
js=js.replace(topPaintOld,"const raw=await topRaw321(provider,force);\n  if(token!==topToken||String(discover?.tab)!=='top10')return false;\n  const movies=raw.movies.slice(0,10),series=raw.series.slice(0,10);");

/* Reconcile recent series first so current shows such as Reacher receive live TMDB episode truth. */
js=js.replace(
 "const candidates=rows.filter(x=>Number(x?.watched_episodes||0)>0&&['continue','up_to_date','dust'].includes(x?.home_bucket)).slice(0,40);",
 "const candidates=rows.filter(x=>Number(x?.watched_episodes||0)>0&&['continue','up_to_date','dust'].includes(x?.home_bucket)).sort((a,b)=>new Date(b?.last_watched_at||0).getTime()-new Date(a?.last_watched_at||0).getTime()).slice(0,40);"
);
js=js.replace(
 "row.__ct325NewEpisode=recentEpisode325(unseen.air_date);",
 "row.__ct325NewEpisode=recentEpisode325(show?.last_episode_to_air?.air_date||unseen.air_date);"
);

/* Retire the r324/r326 mutation sweeps that fight the natural Home anchor and action owner. */
js=js.replaceAll("if(routeNow()==='home')requestAnimationFrame(()=>decorateHomeHistory324(false));","if(false&&routeNow()==='home')requestAnimationFrame(()=>decorateHomeHistory324(false));");
js=js.replaceAll("if(routeNow()==='home')decorateHomeHistory324(false)","if(false&&routeNow()==='home')decorateHomeHistory324(false)");
js=js.replaceAll("if(routeNow()==='home')scheduleHistory326();","if(false&&routeNow()==='home')scheduleHistory326();");
js=js.replaceAll("if(routeNow()==='discover')scheduleActions326();","if(false&&routeNow()==='discover')scheduleActions326();");

/* Version + r331 owner. */
js=once(js,"window.__ctWebBuild='1.0.117';window.__ctOfficialVersion='1.0.117';","window.__ctWebBuild='1.0.122';window.__ctOfficialVersion='1.0.122';",'web version');
js=once(js,"const REVISION='r326-official-1.0.117';","const REVISION='r331-official-1.0.122';",'revision');
js=once(js,"const version='1.0.117',revision='r326-official-1.0.117';","const version='1.0.122',revision='r331-official-1.0.122';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v326.js','app-v331.js').replaceAll('app-v326.css','app-v331.css').replaceAll('v1.0.117','v1.0.122').replaceAll('r326-official-1.0.117','r331-official-1.0.122');
sw=sw.replaceAll('ct-web-1.0.117-r326','ct-web-1.0.122-r331').replaceAll('app-v326.js','app-v331.js').replaceAll('app-v326.css','app-v331.css');
css+='\n/* CineTracker Web 1.0.122 r331 — stable Home anchor + v327 Discover + owned Pra voce actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.122',
 revision:'r331-official-1.0.122',
 base:'r326-last-green',
 scope:'home-history-initial-anchor+discover-v327-rules+foryou-filters-actions+navigation-bounds+episode-priority',
 home_history_behavior:'natural-page-above-initial-viewport-oldest-top-newest-nearest-anchor',
 home_history_toggle:false,
 home_history_inner_scroll:false,
 home_history_initial_anchor:'first-non-history-section-series-default',
 home_episode_live_reconcile:'recently-watched-first+latest-release-new-badge',
 discover_filter_authority:'cinetracker_discover_filter_v327',
 discover_filter_match:'tmdb+server-candidate-aliases+all-user-aliases+watch-play-events',
 discover_foryou:'watchlist-unseen+fresh-unblocked+strict-v327-before-compose',
 discover_foryou_filter_ui:'always-visible-todos+filmes+series+animes',
 discover_foryou_actions:'owned-watchlist+seen+swap-flex-one-row-25px',
 discover_public_actions:'watchlist+seen-one-row-compact',
 discover_top10:'fill-to-ten+v327-before-paint+abort-on-navigation',
 discover_navigation:'no-background-dom-sweeps+bounded-refill-loops',
 profile_watchlist_counts:'r324-preserved-exact',
 sports_changes:'none-r331',
 f1_changes:'none-r331',
 web_version_ui:'1.0.122+r331-official-1.0.122',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r331 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v331.js'),js),
 writeFile(resolve(dist,'app-v331.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v326.js'),{force:true}),rm(resolve(dist,'app-v326.css'),{force:true})]);
console.log('WEB_R331_READY stable Home anchor + strict Discover + Pra voce actions/filters');
