import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r276.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v276.js','app-v276.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r276 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.67';window.__ctOfficialVersion='1.0.67';",
 "const REVISION='r276-official-1.0.67';",
 "window.__ctR275='collapsible-history+rewatch-multiplier+fresh-next+strict-dedupe'",
 "window.__ctR276='history-above-initial-viewport+episode-card-parity'",
 "window.__ctR276History='rendered-above-continue+no-toggle+initial-anchor'",
 "window.__ctR276Series='continue+dust+up-to-date-shared-episode-meta'",
 'function ct276HistorySection(kind,rows,authoritative,payload)',
 'function ct276EpisodeCard(x)',
 'async function ct276HydrateLastWatched(x)',
 'function ct276AnchorHome()',
 'ct275HistorySection=ct276HistorySection;',
 'ct275SeriesSection=ct276SeriesSection;',
 'paintHome=ct276PaintHome;renderHome=ct276RenderHome;'
])must(js,x);
for(const x of['.ct276-history>.ct274-history-stack{max-height:none!important;','[data-ct276-series-section]{scroll-margin-top:10px!important}'])must(css,x);
must(html,'app-v276.js');must(html,'app-v276.css');if(/app-v275\.(?:js|css)/.test(html))throw new Error('r276 html references r275 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.67'||meta.revision!=='r276-official-1.0.67')throw new Error('r276 release identity');
if(meta.home_history_mode!=='above-initial-viewport'||meta.home_history_toggle!==false||meta.home_history_initial_anchor!=='continue'||meta.home_series_card_parity?.join(',')!=='continue,dust,up_to_date'||meta.home_up_to_date_last_watched_meta!==true||meta.home_rewatch_multiplier!==true||meta.home_strict_dedupe!=='effective-tmdb')throw new Error('r276 Home release flags');
if(meta.discover!=='r275-preserved'||meta.sports!=='r275-preserved'||meta.android!=='1.0.20/10062')throw new Error('r276 frozen surfaces');
must(sw,"const CACHE='ct-web-1.0.67-r276';");must(sw,'app-v276.js');must(sw,'app-v276.css');
console.log('WEB_1_0_67_OFFICIAL_OK r276 history-above-viewport episode-card-parity');
