import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v474.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw),yes=(v,m)=>{if(!v)throw new Error('r474 regression: '+m)};
yes(pkg.version==='1.0.264'&&rootPkg.version==='1.0.264','package versions');
yes(release.version==='1.0.264'&&release.revision==='r474-official-1.0.264','release');
yes(html.includes('app-v474.js')&&html.includes('app-v474.css')&&sw.includes('app-v474.js'),'assets');
yes(js.includes("window.__ctR464Marker='discover-foryou-r474-strict-filter-rotate-v421'"),'new For You owner');
yes(js.includes("window.__ctR472Marker='home-stable+r474-profile-history-12-separate-more+stadium-v296'"),'new Home/Profile owner');
yes(!js.includes("window.__ctR464Marker='discover-foryou-visible-owner-v421'")&&!js.includes("if(window.__ctR472?.version==='1.0.262')return;"),'old owners retired');
yes(js.includes("window.__ctCoreR471?.route?.()")&&js.includes("window.__ctCoreR471.rpc(name,args)"),'live closure bridge');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_home_history_v391'),'Home RPCs');
yes(js.includes("if(seen||fav)watch.add(k);if(seen||fav||wl)fresh.add(k)"),'strict recommendation exclusions');
yes(js.includes("ct474:foryou-open-seq")&&js.includes('rotate464()'),'recommendation rotation');
yes(js.includes('const PROFILE_LIMIT=12'),'12 card limit');
yes(js.includes("x?.media_type==='tv'&&x?.is_seen&&x?.last_watched_at")&&js.includes("x?.media_type==='movie'&&x?.is_seen&&x?.last_watched_at"),'history-only rails');
yes(js.includes("x?.media_type==='tv'&&x?.is_favorite")&&js.includes("x?.media_type==='movie'&&x?.is_favorite"),'favorite rails');
yes(js.includes('data-ct472-movie-tab="history"')&&js.includes('data-ct472-movie-tab="watchlist"'),'movie tabs');
yes(js.includes('requestAnimationFrame(paint)'),'chunked full list');
yes(js.includes('cinetracker_profile_actors_v465'),'actors');
const d=js.slice(js.lastIndexOf('/* CineTracker Web 1.0.264 r474 — Descobrir'),js.lastIndexOf('/* CineTracker Web 1.0.264 r474 — stable Home'));
const p=js.slice(js.lastIndexOf('/* CineTracker Web 1.0.264 r474 — stable Home'));
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])yes(!d.includes(bad)&&!p.includes(bad),'forbidden '+bad);
console.log('WEB_R474_REGRESSION_OK');
