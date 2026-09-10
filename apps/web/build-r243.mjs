import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r242.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v242.js'),'utf8'),
  readFile(resolve(dist,'app-v242.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r243-home-interaction-catchup.js'),'utf8')
]);

const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r243 missing '+label)};
must(js,"const REVISION='r242-official-1.0.33';");
must(js,"window.__ctR242HomeAdditive='preview-first-movie-metadata'");
must(js,"window.__ctR242Safety='delegating-render-wrapper'");
must(js,"if(unique.length)void ct242Hydrate(unique);",'r242 unbounded hydration call');
must(js,"window.__ctR242DecorateMovies=ct242DecorateMovies;",'r242 metadata export');
for(const marker of [
  "window.__ctR243='home-interaction-bounded-metadata-canonical-catchup'",
  "window.__ctR243MovieHydration='single-queue-max-3'",
  "window.__ctR243SeriesAuthority='all-up-to-date-through-r176-canonical'",
  "const ct243SetQueueBase=ct176SetQueue",
  "ct243SeriesChecked",
  "x.home_bucket='continue'"
])must(patch,marker,marker);

js=js.replace(
  "if(unique.length)void ct242Hydrate(unique);",
  "if(unique.length&&typeof window.__ctR243QueueMovieMeta==='function')window.__ctR243QueueMovieMeta(unique);"
);
js=js.replace(
  "window.__ctR242DecorateMovies=ct242DecorateMovies;",
  "window.__ctR242DecorateMovies=ct242DecorateMovies;window.__ctR243FetchMovieMeta=ct242FetchMeta;"
);
js=js.replace("const REVISION='r242-official-1.0.33';","const REVISION='r243-official-1.0.34';")
  .replace("window.__ctWebBuild='1.0.33';window.__ctOfficialVersion='1.0.33';","window.__ctWebBuild='1.0.34';window.__ctOfficialVersion='1.0.34';")
  .replaceAll('CineTracker • v1.0.33','CineTracker • v1.0.34')
  .replaceAll("JSON.stringify({version:'1.0.33',revision:REVISION","JSON.stringify({version:'1.0.34',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r243 boot insertion point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');

html=html.replaceAll('r242-official-1.0.33','r243-official-1.0.34')
  .replaceAll('app-v242.js','app-v243.js')
  .replaceAll('app-v242.css','app-v243.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r243 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.34-r243';")
  .replaceAll('app-v242.js','app-v243.js')
  .replaceAll('app-v242.css','app-v243.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v243.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v243.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({
    version:'1.0.34',
    revision:'r243-official-1.0.34',
    base:'r242-official-1.0.33',
    scope:'home-only',
    home_interaction:'bounded-movie-metadata-queue-max-3',
    series_continue:'all-up-to-date-audited-by-canonical-released-unwatched-authority',
    movie_cards:'year+runtime+up-to-3-genres-preserved',
    android:'unchanged-1.0.20',
    generated_at:new Date().toISOString()
  },null,2),'utf8')
]);
await Promise.all([
  rm(resolve(dist,'app-v242.js'),{force:true}),
  rm(resolve(dist,'app-v242.css'),{force:true})
]);
console.log('WEB_1_0_34_READY r243 home=interactive-bounded-metadata series=canonical-catchup movie=year+runtime+genres');
