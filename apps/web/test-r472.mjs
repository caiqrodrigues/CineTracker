import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v472.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(cond,msg)=>{if(!cond)throw new Error('r472 regression: '+msg)};
yes(pkg.version==='1.0.262'&&rootPkg.version==='1.0.262','package versions');
yes(release.version==='1.0.262'&&release.revision==='r472-official-1.0.262','release identity');
yes(html.includes('app-v472.js')&&html.includes('app-v472.css'),'r472 assets');
yes(sw.includes('app-v472.js')&&sw.includes('app-v472.css'),'service worker assets');
yes(js.includes("window.__ctR472Marker='home-r388-r399+foryou-r464+profile-13-separate-more+stadium-v296'"),'r472 marker');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_home_history_v391'),'Home authorities');
yes(!js.includes("if(n==='home')setTimeout(enterSeries461,0);"),'retired r461 Home nav');
yes(!js.includes("if(n==='discover')setTimeout(()=>{if(fyActive461())enterFY461()},0);"),'retired r461 Discover nav');
yes(!js.includes("if(n==='profile')setTimeout(scheduleProfile461,0);"),'retired r461 Profile nav');
yes(js.includes("window.__ctR464Marker='discover-foryou-visible-owner-v421'")&&js.includes('cinetracker_discover_watch_unseen_v421')&&js.includes('cinetracker_discover_fresh_v421'),'r464/v421 For You');
yes(js.includes('const PROFILE_LIMIT=13')&&js.includes('data-ct472-more'),'13 + 14th more');
yes(js.includes('trigger.click();return true')&&js.includes('data-ct472-all-screen'),'separate full-list behavior');
yes(js.includes('cinetracker_sports_stadium_summary_v296')&&js.includes('cinetracker_sports_watch_history_v296'),'stadium authority');
yes(js.includes('cinetracker_activity_items_by_day_v426')&&js.includes('cinetracker_unmark_history_item_v426')&&js.includes('cinetracker_unmark_sport_history_v426'),'daily history undo preserved');
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])yes(!js.slice(js.lastIndexOf('/* CineTracker Web 1.0.262 r472')).includes(bad),'forbidden '+bad);
console.log('WEB_R472_REGRESSION_OK');
