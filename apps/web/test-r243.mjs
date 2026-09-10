import {readFile} from 'node:fs/promises';
const [js,release,runtime,html,sw]=await Promise.all([
  readFile('dist/app-v243.js','utf8'),
  readFile('dist/release.json','utf8'),
  readFile('runtime-r243-home-interaction-catchup.js','utf8'),
  readFile('dist/index.html','utf8'),
  readFile('dist/service-worker.js','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r243 missing '+x)};
for(const x of [
  "const REVISION='r243-official-1.0.34';",
  "window.__ctR243='home-interaction-bounded-metadata-canonical-catchup'",
  "window.__ctR243MovieHydration='single-queue-max-3'",
  "window.__ctR243SeriesAuthority='all-up-to-date-through-r176-canonical'",
  "window.__ctR243FetchMovieMeta=ct242FetchMeta",
  "window.__ctR243QueueMovieMeta(unique)",
  "const CT243_MOVIE_MAX=3",
  "const CT243_SERIES_MAX=2",
  "const ct243SetQueueBase=ct176SetQueue",
  "x.home_bucket='continue'",
  "ct176PrimeCanonical(x,true)"
])must(js,x);
if(js.includes("if(unique.length)void ct242Hydrate(unique);"))throw new Error('r243 still contains unbounded r242 movie hydration');
for(const forbidden of ['Lioness','Stuart','WWE Raw'])if(runtime.includes(forbidden))throw new Error('title hardcode forbidden: '+forbidden);
must(html,'app-v243.js');must(html,'app-v243.css');must(sw,"const CACHE='ct-web-1.0.34-r243';");
const r=JSON.parse(release);
if(r.version!=='1.0.34'||r.revision!=='r243-official-1.0.34'||r.scope!=='home-only')throw new Error('bad r243 release identity');
console.log('R243_STATIC_OK movie-hydration=bounded-max-3 interaction=protected series=canonical-catchup');
