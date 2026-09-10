import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
execFileSync(process.execPath,[resolve(root,'build-r246.mjs')],{stdio:'inherit'});
const [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v246.js'),'utf8'),
  readFile(resolve(dist,'app-v246.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r246 invariant missing '+label)};
for(const marker of [
  "const REVISION='r246-horizontal-track-home-priority';",
  "window.__ctWebBuild='1.0.37';window.__ctOfficialVersion='1.0.37';",
  "window.__ctR245='real-horizontal-drag-and-started-series-authority'",
  "const CT245_SERIES_MAX=0;/* r246 supersedes r245 series worker */",
  "let ct245MovieQueueBase=null;/* r246 supersedes r245 movie gate */",
  "window.__ctR246='horizontal-track-home-priority'",
  "const CT246_SERIES_MAX=3","function ct246EnsureTrack","function ct246CollectSeriesRefs",
  "function ct246RunAudit","function ct246ReleaseMovies"
])must(js,marker,marker);
for(const marker of [
  '[data-ct246-scroll="1"],.ct246-wide-visual-scroll{',
  '.ct246-x-track{',
  'width:max-content!important',
  'touch-action:pan-x pan-y!important'
])must(css,marker,marker);
if(/\bLioness\b|\bStuart\b/.test(js.slice(js.indexOf("window.__ctR246='horizontal-track-home-priority'"))))throw new Error('r246 runtime contains title-specific hardcode');
must(html,'app-v246.js');must(html,'app-v246.css');
if(/app-v245\.(?:js|css)/.test(html))throw new Error('r246 index still references r245 assets');
must(sw,"const CACHE='ct-web-1.0.37-r246';");must(sw,'app-v246.js');must(sw,'app-v246.css');
if(release.version!=='1.0.37'||release.revision!=='r246-horizontal-track-home-priority')throw new Error('r246 identity invalid');
if(release.seasons_horizontal_scroll!=='real-internal-track'||release.related_titles_horizontal_scroll!=='real-internal-track'||release.episode_chart_horizontal_scroll!=='real-internal-track')throw new Error('r246 horizontal contract invalid');
if(release.series_audit_concurrency!==3||release.home_priority!=='initial-all-started-series-barrier-before-secondary-movie-metadata')throw new Error('r246 Home authority contract invalid');
if(release.android!=='unchanged-1.0.20')throw new Error('r246 Android baseline changed');
console.log('R246_STATIC_OK internal-tracks=true all-series-refs=true initial-series-barrier=true android=preserved');
