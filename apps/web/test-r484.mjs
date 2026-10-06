import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v484.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r484 regression: '+m)};
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};

yes(pkg.version==='0.3.11'&&rootPkg.version==='0.3.11','package versions');
yes(release.version==='0.3.11'&&release.revision==='r484-official-0.3.11','release identity');
yes(html.includes('app-v484.js')&&html.includes('app-v484.css'),'r484 assets');
yes(sw.includes('app-v484.js')&&sw.includes('app-v484.css'),'service worker assets');

const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r423=region("window.__ctR423Marker='f1-hard-owner-series+sports+f1hub+dual-time+direct-lexical-delegation';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
const r462=region("if(window.__ctR462?.version==='1.0.252')return;");

yes(r399.includes('cinetracker_home_series_v484')&&!r399.includes('cinetracker_home_series_v452'),'Home uses trusted v484 Series');
yes(r423.includes('cinetracker_f1_map_v484')&&r423.includes('__ct484_server'),'F1 detail uses trusted map');
yes(r462.includes('cinetracker_f1_progress_v484'),'F1 progress uses v484');
for(const n of ['cinetracker_discover_watch_smart_v480','cinetracker_discover_fresh_v480','cinetracker_discover_watch_smart_v476','cinetracker_discover_fresh_v476','Promise.allSettled(specs.map','9000'])yes(r464.includes(n),'Discover '+n);
yes(!r464.includes('cinetracker_discover_watch_unseen_v421')&&!r464.includes('cinetracker_discover_fresh_v421'),'no weak Discover fallback');
yes(r476.includes('const LIMIT=12'),'Profile source limit 12');
yes(js.includes('[data-profile] [data-ct484-profile-row]>.card:nth-child(n+13)'),'Profile hard cap 12');
yes(js.includes('width:44px!important')&&js.includes('height:66px!important')&&js.includes('aspect-ratio:2/3!important'),'compact 2:3 Movie Watchlist');
for(const n of ['cinetracker_sports_payload_v484','cinetracker_sports_events_v484','cinetracker_sport_favorite_events_v484'])yes(js.includes(n),'Sports '+n);
yes(js.includes("window.__ctR484Marker='home-v484-f1+discover-single-pass+profile-exact12+movies-compact+sports-no-junior'"),'r484 marker');
const final=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.11 r484'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!final.includes(bad),'forbidden '+bad);
console.log('WEB_R484_REGRESSION_OK');
