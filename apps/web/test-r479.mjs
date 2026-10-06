import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v479.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r479 regression: '+m)};
yes(pkg.version==='1.0.269'&&rootPkg.version==='1.0.269','package versions');
yes(release.version==='1.0.269'&&release.revision==='r479-official-1.0.269','release identity');
yes(html.includes('app-v479.js')&&html.includes('app-v479.css'),'r479 assets');
yes(sw.includes('app-v479.js')&&sw.includes('app-v479.css'),'service worker assets');
yes(html.includes('data-ct479-preboot')&&html.includes('Carregando Home'),'visible Home preboot');
yes(js.includes("window.__ctR479Marker='home-visible-preboot+discover-v479-strict-memory+profile-v479-history-only+sports-professional-only'"),'r479 marker');

const region=anchor=>{const a=js.indexOf(anchor);yes(a>=0,'marker '+anchor);const s=js.lastIndexOf('(()=>{',a),b=js.indexOf('\n})();',a);yes(s>=0&&b>=0,'runtime bounds '+anchor);return js.slice(s,b+6)};
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
yes(r464.includes('cinetracker_discover_fresh_v479')&&r464.includes('cinetracker_discover_watch_smart_v479'),'strict v479 pools');
yes(r464.includes('cinetracker_record_recommendations_v479')&&r464.includes('recordShown479'),'recommendation exposure memory');
yes(!r464.includes("ct478:foryou-cycle"),'backend-driven recommendation rotation');
yes(r476.includes("core.rpc('cinetracker_profile_lists_v479',{})"),'history-only profile source');
yes(r476.includes('const LIMIT=12'),'exact 12 summary limit');
yes(r476.includes('data-ct478-movie-mode="history"')&&r476.includes('data-ct478-movie-mode="watchlist"'),'Movies History/Watchlist full-screen tabs');
yes(js.includes('cinetracker_sports_payload_v479')&&js.includes('cinetracker_sports_events_v479')&&js.includes('cinetracker_sport_favorite_events_v479'),'professional Sports RPCs');
yes(js.includes('ct251Youth479'),'defensive youth filter');
yes(!js.includes('cinetracker_sports_payload_v1')&&!js.includes('cinetracker_sports_events_v0997')&&!js.includes('cinetracker_sport_favorite_events_v2'),'legacy Web Sports RPCs retired');
const r479=js.slice(js.lastIndexOf('/* CineTracker Web 1.0.269 r479'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!r479.includes(bad),'forbidden '+bad);
console.log('WEB_R479_REGRESSION_OK');
