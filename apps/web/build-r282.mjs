import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r281-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v281.js'),'utf8'),
 readFile(resolve(dist,'app-v281.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r282-series-recency-order.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r282 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r282 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r282 missing '+x)};
for(const x of[
 "window.__ctR282='series-recency-order+bucket-authority';",
 "window.__ctR282Series='last-watched-desc-inside-final-bucket';",
 "window.__ctR282Rule='latest-watch-first-unless-bucket-changes';",
 'function ct282WatchTime(row)',
 'function ct282SortSeriesRows(rows)',
 'function ct282SeriesSection(title,rows)',
 'ct275SeriesSection=ct282SeriesSection;'
])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.72';window.__ctOfficialVersion='1.0.72';","window.__ctWebBuild='1.0.73';window.__ctOfficialVersion='1.0.73';",'version');
js=once(js,"const REVISION='r281-official-1.0.72';","const REVISION='r282-official-1.0.73';",'revision');
must(js,"window.__ctR281='watch-click-isolation+single-owner-refresh'");
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
html=html.replaceAll('app-v281.js','app-v282.js').replaceAll('app-v281.css','app-v282.css').replaceAll('CineTracker • v1.0.72','CineTracker • v1.0.73');
sw=sw.replaceAll('ct-web-1.0.72-r281','ct-web-1.0.73-r282').replaceAll('app-v281.js','app-v282.js').replaceAll('app-v281.css','app-v282.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.73',revision:'r282-official-1.0.73',base:'r281-production',home_series_order:'last-watched-desc-inside-final-bucket',home_series_order_after_reconciliation:true,home_series_latest_watch_first:true,home_series_bucket_authority:true,android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v282.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v282.css'),css,'utf8'),
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v281.js'),{force:true}),rm(resolve(dist,'app-v281.css'),{force:true})]);
console.log('WEB_R282_READY series-order=last-watched-desc final-bucket-authority');
