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
 'paintBrowse263=function(rows,tab)',
 'loadDiscover263=function(',
 'renderDiscover=async function(seq)',
 'ct171TopRows(Number(provider))',
 "ct288ForYouGrid('Da sua Watchlist'",
 "ct288ForYouGrid('100% novos'"
])must(patch,x);
must(js,"window.__ctR287='home-interaction-liveness+available-episode-priority'");
js=once(js,"window.__ctWebBuild='1.0.78';window.__ctOfficialVersion='1.0.78';","window.__ctWebBuild='1.0.79';window.__ctOfficialVersion='1.0.79';",'version');
js=once(js,"const REVISION='r287-official-1.0.78';","const REVISION='r288-official-1.0.79';",'revision');

/* r263 intentionally keeps its Discover state/functions inside its IIFE. Export the exact
   live owners, then make the three local paint/load functions delegate to r288. This is what
   makes existing r263 tab/type click handlers drive the new Web parity renderer instead of a
   disconnected set of globals. */
const r263Test="window.__ctR263Test={shift263,strictEligible263,browseEligible263,pickProviders263,f1Rows263,sportEventKey263,restoreHomeList263};";
const r263Bridge=r263Test+"\nwindow.__ctR288R263={q263,qa263,n263,esc263,type263,id263,title263,poster263,year263,score263,image263,discover263,discoverHost263,block263,armDiscoverRails263,syncDiscover263,forYou263,loadBrowse263,DTABS263};";
js=once(js,r263Test,r263Bridge,'r263 live bridge');
js=once(js,'function paintForYou263(){','function paintForYou263(){if(typeof window.__ctR288PaintForYou===\'function\')return window.__ctR288PaintForYou();','r263 foryou delegate');
js=once(js,'function paintBrowse263(rows,tab){','function paintBrowse263(rows,tab){if(typeof window.__ctR288PaintBrowse===\'function\')return window.__ctR288PaintBrowse(rows,tab);','r263 browse delegate');
js=once(js,'function loadDiscover263(tab=discover263.tab,force=false){','function loadDiscover263(tab=discover263.tab,force=false){if(typeof window.__ctR288LoadDiscover===\'function\')return window.__ctR288LoadDiscover(tab,force);','r263 load delegate');

const r288Prelude=`\n/* r288 binds to the real r263 IIFE owners exported above; global fallback exists only for the isolated runtime harness. */\nconst ct288R263=window.__ctR288R263||globalThis;\nconst {q263,qa263,n263,esc263,type263,id263,title263,poster263,year263,score263,image263,discover263,discoverHost263,block263,armDiscoverRails263,syncDiscover263,forYou263,loadBrowse263,DTABS263}=ct288R263;\nif(!discover263||typeof discoverHost263!=='function'||typeof forYou263!=='function'||typeof loadBrowse263!=='function')throw new Error('r288 missing live r263 Discover bridge');\n`;
patch=patch.replace('paintForYou263=function(){','window.__ctR288PaintForYou=function(){')
 .replace('paintBrowse263=function(rows,tab){','window.__ctR288PaintBrowse=function(rows,tab){')
 .replace('loadDiscover263=function(tab=discover263.tab,force=false){','window.__ctR288LoadDiscover=function(tab=discover263.tab,force=false){')
 .replace('ct288State[bucket][kind]++;paintForYou263()','ct288State[bucket][kind]++;window.__ctR288PaintForYou()');
patch=r288Prelude+patch;
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.79 r288 — Descobrir parity is injected by the final runtime; document X remains locked. */
html,body,#app{max-width:100%;overflow-x:hidden}
`;
html=html.replaceAll('app-v287.js','app-v288.js').replaceAll('app-v287.css','app-v288.css').replaceAll('CineTracker • v1.0.78','CineTracker • v1.0.79');
sw=sw.replaceAll('ct-web-1.0.78-r287','ct-web-1.0.79-r288').replaceAll('app-v287.js','app-v288.js').replaceAll('app-v287.css','app-v288.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.79',revision:'r288-official-1.0.79',base:'r287-production',scope:'discover-android-parity-web-only',discover_owner:'r288-live-r263-bridge',discover_tabs:9,discover_tab_switch:'content-only-no-shell-rebuild',discover_foryou:'movie-series-anime-independent-swap',discover_watchlist_section:true,discover_fresh_section:true,discover_top10:'provider-specific-series-and-movies',discover_filter:'compact-all-movie-tv',discover_calendar:'grouped-by-release-date',discover_horizontal_scroll:'local-only',discover_live_owner_bridge:true,android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v288.js'),js,'utf8'),writeFile(resolve(dist,'app-v288.css'),css,'utf8'),writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v287.js'),{force:true}),rm(resolve(dist,'app-v287.css'),{force:true})]);
console.log('WEB_R288_READY discover=android-parity live-r263-bridge web-only android=preserved');
