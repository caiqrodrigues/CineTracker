import {readFile} from 'node:fs/promises';
const [js,release,runtime,html,sw]=await Promise.all([
  readFile('dist/app-v242.js','utf8'),readFile('dist/release.json','utf8'),readFile('runtime-r242-home-safe-additive.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r242 missing '+x)};
for(const x of ["const REVISION='r242-official-1.0.33';","window.__ctR242HomeAdditive='preview-first-movie-metadata'","window.__ctR242Scope='home-only'","window.__ctR242Safety='no-renderer-override'","rpc('cinetracker_home_preview_v1'","ct242RestoreCachedPayload","ct242DecorateMovies","a.push(`${r} min`)","a.push(g.join(', '))"])must(js,x);
if(/(?:^|\n)\s*(?:renderHome|paintHome)\s*=/.test(runtime))throw new Error('r242 runtime illegally replaces Home renderer');
must(html,'app-v242.js');must(html,'app-v242.css');must(sw,"const CACHE='ct-web-1.0.33-r242';");
const r=JSON.parse(release);if(r.version!=='1.0.33'||r.revision!=='r242-official-1.0.33'||r.scope!=='home-only'||r.renderer_override!==false)throw new Error('bad r242 release identity');
for(const forbidden of ['Stuart','Lioness','WWE Raw'])if(runtime.includes(forbidden))throw new Error('title hardcode forbidden: '+forbidden);
console.log('R242_STATIC_OK home=additive preview=nonblocking movie=year+runtime+genres');
