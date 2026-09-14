import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r282-official.mjs');
const dist=resolve('dist');
const [js,release,runtime]=await Promise.all([
 readFile(resolve(dist,'app-v282.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve('runtime-r282-series-recency-order.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R282_STATIC missing '+x)};
for(const x of[
 "window.__ctR282='series-recency-order+bucket-authority'",
 "window.__ctR282Series='last-watched-desc-inside-final-bucket'",
 "window.__ctR282Rule='latest-watch-first-unless-bucket-changes'",
 'function ct282WatchTime(row)',
 'function ct282SortSeriesRows(rows)',
 '.sort((a,b)=>b.time-a.time||a.index-b.index)',
 'function ct282SeriesSection(title,rows)',
 'ct275SeriesSection=ct282SeriesSection;'
])must(js,x);
if(runtime.includes('home_bucket='))throw new Error('R282_STATIC must not rewrite bucket authority');
if(runtime.includes('MutationObserver'))throw new Error('R282_STATIC persistent observer introduced');
const meta=JSON.parse(release);if(meta.version!=='1.0.73'||meta.revision!=='r282-official-1.0.73'||meta.home_series_order!=='last-watched-desc-inside-final-bucket'||meta.home_series_order_after_reconciliation!==true||meta.home_series_latest_watch_first!==true||meta.home_series_bucket_authority!==true||meta.home_watch_card_navigation_blocked!==true||meta.android!=='1.0.20/10062')throw new Error('R282_STATIC release flags');
console.log('R282_STATIC_OK strict recency inside final series bucket; bucket authority preserved');
