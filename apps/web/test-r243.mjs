import {readFile} from 'node:fs/promises';
const [js,release,runtime,html,sw]=await Promise.all([
  readFile('dist/app-v243.js','utf8'),
  readFile('dist/release.json','utf8'),
  readFile('runtime-r243-home-stable-fast.js','utf8'),
  readFile('dist/index.html','utf8'),
  readFile('dist/service-worker.js','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r243 missing '+x)};
for(const x of [
  "const REVISION='r243-official-1.0.34';",
  "window.__ctWebBuild='1.0.34';window.__ctOfficialVersion='1.0.34';",
  "window.__ctR239='production-video-ground-truth'",
  "window.__ctR178='stable-home-dom-no-repaint-loop'",
  "window.__ctR243Home='stable-fast-home-single-paint-authority'",
  "window.__ctR243Scope='home-only'",
  "window.__ctR243FreezeFix='disable-r235-r236-home-repaint-fanout'",
  "window.__ctR243Payload='cinetracker_home_live_v0997_r5'",
  "window.__ctR243Dom='bounded-active-tab-only'",
  "rpc('cinetracker_home_live_v0997_r5'",
  "paintHome=function(){ct243PaintHome()}",
  "renderHome=async function(seq)",
  "CT243_LIMIT_DEFAULT={continue:30,dust:24,up_to_date:24,not_started:24,completed:16,history_series:30,movies:60,history_movies:30}",
  "IntersectionObserver",
  "ct243MovieActive<3",
  "ct243SeriesActive<2",
  "A Home demorou mais de 10 segundos"
])must(js,x);
for(const forbidden of [
  "requestAnimationFrame(()=>void refreshHome127())",
  "if(q('[data-home]'))fixKnownHome127()",
  "queueMicrotask(()=>void hydrateHome236());",
  "if(q('[data-home]'))pendingHome236();"
])if(js.includes(forbidden))throw new Error('r243 final bundle still contains Home fanout: '+forbidden);
for(const forbidden of ['Stuart','Lioness','WWE Raw'])if(runtime.includes(forbidden))throw new Error('title hardcode forbidden: '+forbidden);
if(runtime.includes("renderDiscover=")||runtime.includes("renderSports=")||runtime.includes("renderProfile="))throw new Error('r243 runtime escaped Home-only scope');
must(html,'app-v243.js');must(html,'app-v243.css');must(sw,"const CACHE='ct-web-1.0.34-r243';");
const r=JSON.parse(release);
if(r.version!=='1.0.34'||r.revision!=='r243-official-1.0.34'||r.scope!=='home-only'||r.rpc!=='cinetracker_home_live_v0997_r5'||r.android!=='unchanged-1.0.20')throw new Error('bad r243 release identity');
if(js.lastIndexOf("window.__ctR243Home='stable-fast-home-single-paint-authority'")<js.lastIndexOf("window.__ctR239='production-video-ground-truth'"))throw new Error('r243 authority must be appended after r239 ground truth');
console.log('R243_STATIC_OK home=single-paint r235-r236-fanout=removed rpc=r5 bounded-dom metadata=visible-only android=unchanged');
