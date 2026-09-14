import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r282.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v282.js','app-v282.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r282 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.73';window.__ctOfficialVersion='1.0.73';",
 "const REVISION='r282-official-1.0.73';",
 "window.__ctR281='watch-click-isolation+single-owner-refresh'",
 "window.__ctR282='series-recency-order+bucket-authority'",
 "window.__ctR282Series='last-watched-desc-inside-final-bucket'",
 "window.__ctR282Rule='latest-watch-first-unless-bucket-changes'",
 'function ct282WatchTime(row)',
 'function ct282SortSeriesRows(rows)',
 'ct275SeriesSection=ct282SeriesSection;'
])must(js,x);
must(html,'app-v282.js');must(html,'app-v282.css');if(/app-v281\.(?:js|css)/.test(html))throw new Error('r282 html references r281 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.73'||meta.revision!=='r282-official-1.0.73'||meta.home_series_order!=='last-watched-desc-inside-final-bucket'||meta.home_series_order_after_reconciliation!==true||meta.home_series_latest_watch_first!==true||meta.home_series_bucket_authority!==true)throw new Error('r282 release identity');
if(meta.home_watch_card_navigation_blocked!==true||meta.home_watch_refresh!=='canonical-r6-single-owner'||meta.android!=='1.0.20/10062')throw new Error('r282 preserved identity');
must(sw,"const CACHE='ct-web-1.0.73-r282';");must(sw,'app-v282.js');must(sw,'app-v282.css');
console.log('WEB_1_0_73_OFFICIAL_OK r282 strict latest-watch series order');
