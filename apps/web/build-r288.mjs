import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r287-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v287.js'),'utf8'),readFile(resolve(dist,'app-v287.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r288-discover-android-parity.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r288 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r288 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r288 missing '+x)};
for(const x of[
 "window.__ctR288='discover-android-parity-web-only';",
 "window.__ctR288Discover='nine-tabs+stable-shell+provider-top10+three-slot-foryou';",
 "window.__ctR288Top10='provider-specific-series+movies-real-rails';",
 "window.__ctR288ForYou='movie-series-anime-independent-swap';",
 "window.__ctR288Calendar='grouped-by-release-date';",
 'paintForYou263=function()',
 'loadDiscover263=function(',
 'renderDiscover=async function(seq)',
 'ct171TopRows(Number(provider))',
 "ct288ForYouGrid('Da sua Watchlist'",
 "ct288ForYouGrid('100% novos'"
])must(patch,x);
must(js,"window.__ctR287='home-interaction-liveness+available-episode-priority'");
js=once(js,"window.__ctWebBuild='1.0.78';window.__ctOfficialVersion='1.0.78';","window.__ctWebBuild='1.0.79';window.__ctOfficialVersion='1.0.79';",'version');
js=once(js,"const REVISION='r287-official-1.0.78';","const REVISION='r288-official-1.0.79';",'revision');
const bridge=`\n/* r288 final-bundle binding bridge: some historical build stages no longer expose these r263 owners as lexical globals. */\nif(typeof globalThis.paintForYou263!=='function')globalThis.paintForYou263=function(){};\nif(typeof globalThis.paintBrowse263!=='function')globalThis.paintBrowse263=function(){};\nif(typeof globalThis.loadDiscover263!=='function')globalThis.loadDiscover263=function(){};\nif(typeof globalThis.renderDiscover!=='function')globalThis.renderDiscover=async function(){};\n`;
js=once(js,'\nboot();',bridge+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.79 r288 — Descobrir parity is injected by the final runtime; document X remains locked. */
html,body,#app{max-width:100%;overflow-x:hidden}
`;
html=html.replaceAll('app-v287.js','app-v288.js').replaceAll('app-v287.css','app-v288.css').replaceAll('CineTracker • v1.0.78','CineTracker • v1.0.79');
sw=sw.replaceAll('ct-web-1.0.78-r287','ct-web-1.0.79-r288').replaceAll('app-v287.js','app-v288.js').replaceAll('app-v287.css','app-v288.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.79',revision:'r288-official-1.0.79',base:'r287-production',scope:'discover-android-parity-web-only',discover_owner:'r288-stable-shell',discover_tabs:9,discover_tab_switch:'content-only-no-shell-rebuild',discover_foryou:'movie-series-anime-independent-swap',discover_watchlist_section:true,discover_fresh_section:true,discover_top10:'provider-specific-series-and-movies',discover_filter:'compact-all-movie-tv',discover_calendar:'grouped-by-release-date',discover_horizontal_scroll:'local-only',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v288.js'),js,'utf8'),writeFile(resolve(dist,'app-v288.css'),css,'utf8'),writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v287.js'),{force:true}),rm(resolve(dist,'app-v287.css'),{force:true})]);
console.log('WEB_R288_READY discover=android-parity web-only android=preserved');
