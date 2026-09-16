import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r301-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v301.js'),'utf8'),readFile(resolve(dist,'app-v301.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r302-discover-personal-stability.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r302 missing '+x)};
for(const x of["window.__ctWebBuild='1.0.92';window.__ctOfficialVersion='1.0.92';","const REVISION='r301-official-1.0.92';","window.__ctR301='f1-calendar-interactive+sports-next-wide+discover-fast-1-3-3+profile-stable'",'buildForYou301','ensureWatchButtons301'])must(js,x);
for(const x of["window.__ctR302='discover-watched-watchlist-block+foryou-authority+no-r301-dom-observer'","window.__ctR302Discover='watched+watchlist-excluded+canonical-add'",'blocked302','watchKeys302','cinetracker:data-changed'])must(runtime,x);
const obsStart=js.indexOf("let obsQueued301=false;const app301=q301('#app');");
const obsEnd=obsStart>=0?js.indexOf("\ndocument.addEventListener('click',e=>{",obsStart):-1;
if(obsStart<0||obsEnd<0)throw new Error('r302 could not locate r301 global observer');
js=js.slice(0,obsStart)+js.slice(obsEnd+1);
if(js.includes("obsQueued301")||js.includes(".observe(app301,{subtree:true,childList:true})"))throw new Error('r302 r301 observer survived removal');
if(!js.includes('\nboot();'))throw new Error('r302 boot insertion missing');
js=js.replace("window.__ctWebBuild='1.0.92';window.__ctOfficialVersion='1.0.92';","window.__ctWebBuild='1.0.93';window.__ctOfficialVersion='1.0.93';")
 .replace("const REVISION='r301-official-1.0.92';","const REVISION='r302-official-1.0.93';")
 .replace('\nboot();','\n'+runtime+'\nboot();');
css+=String.raw`\n/* CineTracker Web 1.0.93 r302 — finite lifecycle; no global r301 DOM observer. */\n`;
html=html.replaceAll('app-v301.js','app-v302.js').replaceAll('app-v301.css','app-v302.css').replaceAll('CineTracker • v1.0.92','CineTracker • v1.0.93');
sw=sw.replaceAll('ct-web-1.0.92-r301','ct-web-1.0.93-r302').replaceAll('app-v301.js','app-v302.js').replaceAll('app-v301.css','app-v302.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.93',revision:'r302-official-1.0.93',base:'r301-production',scope:'discover-personal-filter-foryou-sports-profile-stability-web-only',discover_seen_excluded:true,discover_watchlist_excluded:true,discover_add_watchlist:true,discover_for_you_fixed:true,sports_profile_global_observer:false,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v302.js'),js),writeFile(resolve(dist,'app-v302.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v301.js'),{force:true}),rm(resolve(dist,'app-v301.css'),{force:true})]);
console.log('WEB_R302_READY Discover excludes watched+Watchlist, canonical add, fixed Pra Você, Sports/Profile finite; Android preserved');
