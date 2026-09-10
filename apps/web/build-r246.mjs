import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r245.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v245.js'),'utf8'),
  readFile(resolve(dist,'app-v245.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r246-horizontal-track-home-priority.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r246 missing '+label)};
for(const marker of [
  "const REVISION='r245-official-1.0.36';",
  "window.__ctR245='real-horizontal-drag-and-started-series-authority'",
  "window.__ctR244='series-detail-local-horizontal-overflow'"
])must(js,marker,marker);
for(const marker of [
  "window.__ctR246='horizontal-track-home-priority'",
  "const CT246_SERIES_MAX=3",
  "function ct246EnsureTrack",
  "function ct246CollectSeriesRefs",
  "function ct246RunAudit",
  "function ct246ReleaseMovies"
])must(patch,marker,marker);

/* r246 supersedes only r245's Home audit/metadata gate. Keep r245 horizontal
   listeners as a compatibility layer, but avoid duplicate canonical requests. */
must(js,"const CT245_SERIES_MAX=4;","r245 series worker");
must(js,"let ct245MovieQueueBase=typeof window.__ctR243QueueMovieMeta==='function'?window.__ctR243QueueMovieMeta:null;","r245 movie gate");
js=js.replace("const CT245_SERIES_MAX=4;","const CT245_SERIES_MAX=0;/* r246 supersedes r245 series worker */");
js=js.replace(
  "let ct245MovieQueueBase=typeof window.__ctR243QueueMovieMeta==='function'?window.__ctR243QueueMovieMeta:null;",
  "let ct245MovieQueueBase=null;/* r246 supersedes r245 movie gate */"
);

js=js.replace("const REVISION='r245-official-1.0.36';","const REVISION='r246-horizontal-track-home-priority';")
  .replace("window.__ctWebBuild='1.0.36';window.__ctOfficialVersion='1.0.36';","window.__ctWebBuild='1.0.37';window.__ctOfficialVersion='1.0.37';")
  .replaceAll('CineTracker • v1.0.36','CineTracker • v1.0.37')
  .replaceAll("JSON.stringify({version:'1.0.36',revision:REVISION","JSON.stringify({version:'1.0.37',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r246 boot insertion point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');

css+=`\n/* CineTracker Web 1.0.37 r246 — real internal horizontal tracks. */
[data-ct246-scroll="1"],.ct246-wide-visual-scroll{
  display:block;max-width:100%;min-width:0;
  overflow-x:auto!important;overflow-y:hidden!important;
  touch-action:pan-x pan-y!important;overscroll-behavior-inline:contain;
  -webkit-overflow-scrolling:touch;scrollbar-width:thin;cursor:grab;
}
[data-ct246-dragging="1"]{cursor:grabbing!important;user-select:none!important;scroll-behavior:auto!important}
.ct246-x-track{
  display:flex!important;flex-wrap:nowrap!important;
  width:max-content!important;min-width:100%!important;max-width:none!important;
  align-items:stretch;gap:var(--ct246-gap,0px);
}
.ct246-x-track>[data-ct246-card="1"]{
  flex:0 0 var(--ct246-card-width)!important;
  width:var(--ct246-card-width)!important;min-width:var(--ct246-card-width)!important;max-width:none!important;
}
.ct246-x-track>*{flex-shrink:0!important}
.ct246-wide-visual-track{display:inline-block;width:max-content;min-width:100%;max-width:none}
.ct246-wide-visual-track>svg,.ct246-wide-visual-track>canvas,
[data-ct246-scroll="1"]>svg,[data-ct246-scroll="1"]>canvas{max-width:none!important;flex:none!important}
html,body,#root,.app,.main{max-width:100%;min-width:0;overflow-x:clip}
`;

html=html.replaceAll('r245-official-1.0.36','r246-horizontal-track-home-priority')
  .replace(/app-v\d+\.js/g,'app-v246.js')
  .replace(/app-v\d+\.css/g,'app-v246.css');
must(html,'app-v246.js','generated index app-v246.js');must(html,'app-v246.css','generated index app-v246.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r246 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.37-r246';")
  .replace(/app-v\d+\.js/g,'app-v246.js')
  .replace(/app-v\d+\.css/g,'app-v246.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v246.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v246.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({
    version:'1.0.37',revision:'r246-horizontal-track-home-priority',base:'r245-official-1.0.36',scope:'web-real-internal-tracks-and-home-series-priority',
    global_horizontal_scroll:'disabled',vertical_page_scroll:'preserved',
    seasons_horizontal_scroll:'real-internal-track',related_titles_horizontal_scroll:'real-internal-track',episode_chart_horizontal_scroll:'real-internal-track',
    series_continue:'canonical-released-unwatched-applied-to-all-started-series-references',series_audit_concurrency:3,
    home_priority:'initial-all-started-series-barrier-before-secondary-movie-metadata',
    canonical_timeout_ms:2500,android:'unchanged-1.0.20',generated_at:new Date().toISOString()
  },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v245.js'),{force:true}),rm(resolve(dist,'app-v245.css'),{force:true})]);
console.log('WEB_1_0_37_READY r246 local-x=real-tracks home=all-started-series-priority android=unchanged');
