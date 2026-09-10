import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v245.js'),'utf8'),readFile(resolve(dist,'app-v245.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r245 invariant missing '+label)};
for(const marker of [
  "const REVISION='r245-official-1.0.36';",
  "window.__ctWebBuild='1.0.36';window.__ctOfficialVersion='1.0.36';",
  "window.__ctR244='series-detail-local-horizontal-overflow'",
  "window.__ctR245='real-horizontal-drag-and-started-series-authority'",
  "window.__ctR245Horizontal='ct169-real-scrollers-pointer-drag'",
  "window.__ctR245SeriesAuthority='all-started-series-through-r176-canonical'",
  "window.__ctR245HomePriority='series-before-secondary-movie-metadata'",
  "const CT245_SERIES_MAX=4",
  "'.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll'",
  "ct176PrimeCanonical(row,true)","row.home_bucket='continue'"
])must(js,marker,marker);
for(const marker of [
  '.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll{width:100%!important;',
  'touch-action:pan-y pinch-zoom!important',
  '.ct169-season-row{grid-auto-columns:minmax(172px,196px)!important}',
  '.ct169-related-row{grid-auto-columns:minmax(148px,168px)!important}',
  '.ct169-chart-scroll>.ct169-season-chart-svg{max-width:none!important;'
])must(css,marker,marker);
must(html,'app-v245.js');must(html,'app-v245.css');
if(/app-v244\.(?:js|css)/.test(html))throw new Error('r245 index still references r244 assets');
must(sw,"const CACHE='ct-web-1.0.36-r245';");must(sw,'app-v245.js');must(sw,'app-v245.css');
if(release.version!=='1.0.36'||release.revision!=='r245-official-1.0.36')throw new Error('r245 identity invalid');
if(release.related_titles_horizontal_scroll!=='real-pointer-drag'||release.seasons_horizontal_scroll!=='real-pointer-drag'||release.episode_chart_horizontal_scroll!=='real-pointer-drag')throw new Error('r245 horizontal contract invalid');
if(release.series_continue!=='all-started-series-audited-by-canonical-released-unwatched-authority'||release.series_audit_concurrency!==4)throw new Error('r245 series authority contract invalid');
if(release.android!=='unchanged-1.0.20')throw new Error('r245 Android baseline changed');
console.log('R245_STATIC_OK real-local-drag=seasons+related+charts started-series=canonical-priority android=preserved');
