import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r276-official.mjs');
const dist=resolve('dist');
const [js,css,release]=await Promise.all([readFile(resolve(dist,'app-v276.js'),'utf8'),readFile(resolve(dist,'app-v276.css'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R276_STATIC missing '+x)};
for(const x of[
 "window.__ctR276='history-above-initial-viewport+episode-card-parity'",
 "window.__ctR276History='rendered-above-continue+no-toggle+initial-anchor'",
 "window.__ctR276Series='continue+dust+up-to-date-shared-episode-meta'",
 'function ct276HistorySection(kind,rows,authoritative,payload)',
 "x.home_bucket==='continue'||x.home_bucket==='dust'",
 "x.home_bucket==='up_to_date'",
 'async function ct276HydrateLastWatched(x)',
 'function ct276AnchorHome()',
 'ct275HistorySection=ct276HistorySection;',
 'ct275SeriesSection=ct276SeriesSection;',
 "window.__ctR275='collapsible-history+rewatch-multiplier+fresh-next+strict-dedupe'",
 'ct275-plays-badge'
])must(js,x);
for(const x of['max-height:none!important','overflow:visible!important','scroll-margin-top:10px!important'])must(css,x);
const meta=JSON.parse(release);if(meta.version!=='1.0.67'||meta.revision!=='r276-official-1.0.67'||meta.home_history_mode!=='above-initial-viewport'||meta.home_history_toggle!==false||meta.home_history_initial_anchor!=='continue'||meta.home_series_card_parity?.join(',')!=='continue,dust,up_to_date'||meta.home_up_to_date_last_watched_meta!==true)throw new Error('R276_STATIC release flags');
console.log('R276_STATIC_OK history-above-viewport no-toggle active-series-card-parity');
