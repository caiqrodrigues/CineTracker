import {readFile} from 'node:fs/promises';
if(process.env.CT_R463_SKIP_BUILD!=='1')await import('./build-r463.mjs');
const [js,html,sw,rel,pkg,rootPkg,r399,r455,r461,r426]=await Promise.all([
 readFile('dist/app-v463.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r399-startup-stability.js','utf8'),
 readFile('runtime-r455-profile-lists-history-undo.js','utf8'),readFile('runtime-r461-final-owner.js','utf8'),readFile('runtime-r426-profile-history-foryou-f1.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R463 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.253'&&r.revision==='r463-official-1.0.253','release');
ok(p.version==='1.0.253'&&rp.version==='1.0.253','versions');
ok(html.includes('app-v463.js')&&sw.includes('app-v463.js')&&sw.includes('ct-web-1.0.253-r463'),'assets');
for(const need of ['waitAuth399','cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','data-ct399-action','data-ct399-movie-retry'])ok(r399.includes(need),'r399 missing '+need);
for(const old of ['cinetracker_watchlist_full_v376','cinetracker_home_series_v391','cinetracker_discover_foryou_v396','cinetracker_discover_watch_unseen_v396','cinetracker_discover_fresh_v387'])ok(!r399.includes(old),'r399 legacy '+old);
ok(r455.includes('const PROFILE_LIMIT=13')&&r455.includes('row.appendChild(more)')&&r455.includes("trigger.style.display='none'"),'profile 13+more');
ok(r461.includes('window.__ctR455?.applyProfile?.()')&&!r461.includes("ct461ProfileLists='uncropped'")&&!r461.includes('[data-profile] [hidden]{display:revert!important}'),'r461 profile delegation');
ok(r426.includes('cinetracker_activity_items_by_day_v426')&&r426.includes('cinetracker_unmark_history_item_v426')&&r426.includes('cinetracker_unmark_sport_history_v426')&&r426.includes('Desmarcar visto'),'daily undo');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval(']){ok(!r399.includes(bad),'r399 forbidden '+bad);ok(!r455.includes(bad),'r455 forbidden '+bad);ok(!r461.includes(bad),'r461 forbidden '+bad)}
ok(js.includes("window.__ctR463Marker='r399-current-authorities+profile-13-more+daily-undo'")&&js.includes("window.__ctR462Marker='f1-v462-series+sports+f1hub+double-time'"),'markers');
console.log('R463_STATIC_OK');
