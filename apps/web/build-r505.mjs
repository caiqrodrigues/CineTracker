import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r504.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v504.js'),'utf8'),
 readFile(resolve(dist,'app-v504.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r505-home-movies.js'),'utf8')
]);
new Function(runtime);
js+='\n'+runtime+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r505-official-0.3.32';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.32 • $'+'{REVISION}');
html=html.replaceAll('app-v504.js?ct=r504-official-0.3.31','app-v505.js?ct=r505-official-0.3.32')
 .replaceAll('app-v504.css?ct=r504-official-0.3.31','app-v505.css?ct=r505-official-0.3.32')
 .replaceAll('r504-official-0.3.31','r505-official-0.3.32');
css+='\n/* CineTracker Web 0.3.32 r505 — scoped Home Movies + sticky Home tabs. */\n'
 +'html body [data-home]>.home-tabs,html body [data-home] .home-tabs{position:sticky!important;top:0!important;z-index:120!important;align-self:start!important;width:max-content!important;max-width:100%!important;padding:6px 8px!important;margin:-6px -8px 4px!important;border-radius:0 0 12px 12px!important;background:rgba(3,10,15,.94)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;pointer-events:auto!important}\n'
 +'html body [data-home] .home-tabs [data-home-tab]{position:relative!important;z-index:121!important;pointer-events:auto!important}\n'
 +'html body [data-home-view="movies"] .ct505-movie-loading{display:grid!important;grid-template-columns:repeat(auto-fill,176px)!important;gap:12px!important;align-items:start!important}\n'
 +'html body [data-home-view="movies"] .ct505-movie-loading>span{display:block!important;width:176px!important;height:264px!important;border-radius:13px!important;background:linear-gradient(105deg,rgba(255,255,255,.04) 8%,rgba(255,255,255,.10) 18%,rgba(255,255,255,.04) 33%)!important;background-size:200% 100%!important;animation:ct489Pulse 1.15s ease-in-out infinite!important}\n'
 +'@media(max-width:700px){html body [data-home]>.home-tabs,html body [data-home] .home-tabs{top:0!important;margin:-4px -4px 4px!important}html body [data-home-view="movies"] .ct505-movie-loading{grid-template-columns:repeat(2,minmax(0,1fr))!important}html body [data-home-view="movies"] .ct505-movie-loading>span{width:100%!important;height:auto!important;aspect-ratio:2/3!important}}\n';
sw=sw.replaceAll('ct-media-r504','ct-media-r505').replaceAll('app-v504.js','app-v505.js').replaceAll('app-v504.css','app-v505.css');
const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.32',revision:'r505-official-0.3.32',base:'r504-scoped-stable',
 scope:'home-movies-watchlist-nonempty+sticky-home-tabs',
 home_series:'unchanged except sticky Series/Movies controls',
 home_movies:'r504 pointer owner preserved; an empty inherited load is retried once with a fresh v405 request, then the approved 176x264 2:3 grid is repainted',
 discover_foryou:'unchanged',top10:'unchanged',profile:'unchanged',f1:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v505.js'),js),writeFile(resolve(dist,'app-v505.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v504.js'),{force:true}),rm(resolve(dist,'app-v504.css'),{force:true})]);
for(const need of [
 "window.__ctR505Marker='home-movies-nonempty-retry+sticky-home-tabs+r504-pointer-preserved'",
 "document.documentElement.dataset.ct505MovieRetry='1'",
 "r505-official-0.3.32"
])if(!js.includes(need))throw new Error('r505 missing '+need);
console.log('WEB_R505_READY scoped Home Movies recovery + sticky tabs');
