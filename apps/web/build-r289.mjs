import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r288-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v288.js'),'utf8'),readFile(resolve(dist,'app-v288.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r289-discover-standard-card-size.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r289 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r289 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r289 missing '+x)};
for(const x of[
 "window.__ctR289='discover-standard-card-size';",
 "window.__ctR289Cards='standard-154-mobile-176-desktop-2x3';",
 "window.__ctR289Scope='discover-layout-only';",
 '[data-ct288-discover]{--ct289-card-w:154px}',
 '@media(min-width:1100px){[data-ct288-discover]{--ct289-card-w:176px}}',
 'grid-auto-columns:var(--ct289-card-w)!important',
 'grid-template-columns:repeat(auto-fill,var(--ct289-card-w))!important',
 'aspect-ratio:2/3!important'
])must(patch,x);
for(const x of[
 "window.__ctR288='discover-android-parity-web-only';",
 "window.__ctR288Discover='nine-tabs+stable-shell+provider-top10+three-slot-foryou';",
 "window.__ctR288Top10='provider-specific-series+movies-real-rails';",
 "window.__ctR288ForYou='movie-series-anime-independent-swap';",
 'window.__ctR288R263={q263,qa263,n263,esc263,type263,id263,title263,poster263,year263,score263,image263,discover263,discoverHost263,block263,armDiscoverRails263,syncDiscover263,forYou263,loadBrowse263,DTABS263}'
])must(js,x);
js=once(js,"window.__ctWebBuild='1.0.79';window.__ctOfficialVersion='1.0.79';","window.__ctWebBuild='1.0.80';window.__ctOfficialVersion='1.0.80';",'version');
js=once(js,"const REVISION='r288-official-1.0.79';","const REVISION='r289-official-1.0.80';",'revision');
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.80 r289 — Discover card-size normalization; document X remains locked. */
html,body,#app{max-width:100%;overflow-x:hidden}
`;
html=html.replaceAll('app-v288.js','app-v289.js').replaceAll('app-v288.css','app-v289.css').replaceAll('CineTracker • v1.0.79','CineTracker • v1.0.80');
sw=sw.replaceAll('ct-web-1.0.79-r288','ct-web-1.0.80-r289').replaceAll('app-v288.js','app-v289.js').replaceAll('app-v288.css','app-v289.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.80',revision:'r289-official-1.0.80',base:'r288-production',scope:'discover-standard-card-size-web-only',discover_card_size:'standard-154-mobile-176-desktop',discover_card_mobile:'154x231',discover_card_desktop:'176x264',discover_card_ratio:'2:3',discover_card_layout:'fixed-local-rail-no-stretch',discover_card_slots:'fixed-width-local-scroll',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v289.js'),js,'utf8'),writeFile(resolve(dist,'app-v289.css'),css,'utf8'),writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v288.js'),{force:true}),rm(resolve(dist,'app-v288.css'),{force:true})]);
console.log('WEB_R289_READY discover=standard-card-size mobile=154x231 desktop=176x264 ratio=2:3 android=preserved');
