import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r379.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v379.js'),'utf8'),readFile(resolve(dist,'app-v379.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r380-home-profile-discover.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r380 expected one '+l+', found '+n);return s.replace(a,b)};
js=js.replaceAll("'cinetracker_profile_fast_v379'","'cinetracker_profile_v380'");
js=once(js,"window.__ctWebBuild='1.0.170';window.__ctOfficialVersion='1.0.170';","window.__ctWebBuild='1.0.171';window.__ctOfficialVersion='1.0.171';",'version');
js=once(js,"const REVISION='r379-official-1.0.170';","const REVISION='r380-official-1.0.171';",'revision');
js=once(js,"const version='1.0.170',revision='r379-official-1.0.170';","const version='1.0.171',revision='r380-official-1.0.171';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v379.js','app-v380.js').replaceAll('app-v379.css','app-v380.css').replaceAll('v1.0.170','v1.0.171').replaceAll('r379-official-1.0.170','r380-official-1.0.171');
sw=sw.replaceAll('ct-web-1.0.170-r379','ct-web-1.0.171-r380').replaceAll('app-v379.js','app-v380.js').replaceAll('app-v379.css','app-v380.css');
css+='\n/* CineTracker Web 1.0.171 r380 — fast Home active patch + alias-strict Fresh + direct Profile. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.171',revision:'r380-official-1.0.171',base:'r379-production',scope:'home-active+full-watchlist+strict-fresh+direct-profile',home_first_paint:'snapshot-or-home_active_v380',home_episode_metadata:'visible-parallel-under-3.5s',home_movie_watchlist:'r376-full-1382-no-240-header',discover_filter:'cinetracker_discover_filter_v380-title+original-title-alias',discover_foryou:'no-duplicate-filter+exact-3-2-3-actions',profile:'cinetracker_profile_v380-direct',favorites:'cinetracker_favorites_v380',top10:'localStorage-15m+provider-prefetch',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v380.js'),js),writeFile(resolve(dist,'app-v380.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v379.js'),{force:true}),rm(resolve(dist,'app-v379.css'),{force:true})]);
console.log('WEB_R380_READY Home/Profile/ForYou strict fast owners');