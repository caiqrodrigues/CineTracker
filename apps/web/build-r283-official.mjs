import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r283.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v283.js','app-v283.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r283 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.74';window.__ctOfficialVersion='1.0.74';",
 "const REVISION='r283-official-1.0.74';",
 "window.__ctR282='series-recency-order+bucket-authority'",
 "window.__ctR283='history-action-isolation+fresh-availability+legacy-frontier-next'",
 "window.__ctR283History='window-capture-rewatch+undo-no-navigation'",
 "window.__ctR283Availability='fresh-released-minus-canonical-watched'",
 "window.__ctR283Legacy='raw+smackdown-frontier-next+backlog-count'",
 "window.addEventListener('click',ct283CaptureHistoryClick,true);",
 'ct274AvailableText=ct283AvailableText;',
 'ct275FirstReleasedUnseen=async function(row,show)'
])must(js,x);
must(html,'app-v283.js');must(html,'app-v283.css');if(/app-v282\.(?:js|css)/.test(html))throw new Error('r283 html references r282 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.74'||meta.revision!=='r283-official-1.0.74'||meta.home_history_action_owner!=='window-capture-r283'||meta.home_history_action_navigation_blocked!==true||meta.home_fresh_available_episodes!==true||meta.home_available_count_source!=='fresh-tmdb-release-boundary-minus-canonical-watched'||meta.home_legacy_next_episode!=='watched-frontier-only'||meta.home_legacy_backlog_count_preserved!==true||meta.home_raw_smackdown_ancient_next_blocked!==true)throw new Error('r283 release identity');
if(meta.home_series_order!=='last-watched-desc-inside-final-bucket'||meta.home_series_latest_watch_first!==true||meta.home_watch_card_navigation_blocked!==true||meta.android!=='1.0.20/10062')throw new Error('r283 preserved identity');
must(sw,"const CACHE='ct-web-1.0.74-r283';");must(sw,'app-v283.js');must(sw,'app-v283.css');void css;
console.log('WEB_1_0_74_OFFICIAL_OK r283 isolated History actions fresh counts legacy frontier');
