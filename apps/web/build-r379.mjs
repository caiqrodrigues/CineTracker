import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r378.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v378.js'),'utf8'),readFile(resolve(dist,'app-v378.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r379-home-fresh-profile.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r379 expected one '+l+', found '+n);return s.replace(a,b)};
js=js.replaceAll("rpc('cinetracker_profile_payload_v0997',{p_tz:tz()})","rpc('cinetracker_profile_fast_v379',{p_tz:tz()})");
js=once(js,"window.__ctWebBuild='1.0.169';window.__ctOfficialVersion='1.0.169';","window.__ctWebBuild='1.0.170';window.__ctOfficialVersion='1.0.170';",'version');
js=once(js,"const REVISION='r378-official-1.0.169';","const REVISION='r379-official-1.0.170';",'revision');
js=once(js,"const version='1.0.169',revision='r378-official-1.0.169';","const version='1.0.170',revision='r379-official-1.0.170';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v378.js','app-v379.js').replaceAll('app-v378.css','app-v379.css').replaceAll('v1.0.169','v1.0.170').replaceAll('r378-official-1.0.169','r379-official-1.0.170');
sw=sw.replaceAll('ct-web-1.0.169-r378','ct-web-1.0.170-r379').replaceAll('app-v378.js','app-v379.js').replaceAll('app-v378.css','app-v379.css');
css+='\n/* CineTracker Web 1.0.170 r379 — stable Home, strict Fresh, fast Profile. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.170',revision:'r379-official-1.0.170',base:'r378-production',scope:'home-stable+fresh-v322+profile-fast',home_late_recompose:'disabled-r332-owner-guard',home_snapshot:'session-persisted-refresh-next-navigation',home_visible_metadata:'immediate-bounded-hydration',discover_personal_filter:'cinetracker_discover_filter_v322-indexed',discover_regression_key:'movie:673-seen-must-not-render',profile_rpc:'cinetracker_profile_fast_v379-single-dashboard',profile_cache:'session-first-no-full-page-timeout',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v379.js'),js),writeFile(resolve(dist,'app-v379.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v378.js'),{force:true}),rm(resolve(dist,'app-v378.css'),{force:true})]);
console.log('WEB_R379_READY stable Home + strict Fresh + fast Profile');
