import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r378.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v378.js'),'utf8'),readFile(resolve(dist,'app-v378.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r379-stable-home-fresh-profile.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r379 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.169';window.__ctOfficialVersion='1.0.169';","window.__ctWebBuild='1.0.170';window.__ctOfficialVersion='1.0.170';",'version');
js=once(js,"const REVISION='r378-official-1.0.169';","const REVISION='r379-official-1.0.170';",'revision');
js=once(js,"const version='1.0.169',revision='r378-official-1.0.169';","const version='1.0.170',revision='r379-official-1.0.170';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v378.js','app-v379.js').replaceAll('app-v378.css','app-v379.css').replaceAll('v1.0.169','v1.0.170').replaceAll('r378-official-1.0.169','r379-official-1.0.170');
sw=sw.replaceAll('ct-web-1.0.169-r378','ct-web-1.0.170-r379').replaceAll('app-v378.js','app-v379.js').replaceAll('app-v378.css','app-v379.css');
css+='\n/* CineTracker Web 1.0.170 r379 — persistent Home, strict Fresh and quick-first Profile. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.170',revision:'r379-official-1.0.170',base:'r378-production',scope:'stable-home+strict-fresh+fast-profile',home_payload:'v359-persistent-first-paint',home_late_reconcile:'disabled-r325-r332',home_episode_metadata:'targeted-only-no-bucket-mutation',discover_filter:'cinetracker_discover_filter_v379-known-state-strict',discover_fresh:'server-validated-before-pool',discover_actions:'2-watch+3-daily-fresh-exact',profile_first:'cinetracker_profile_quick_stats_v1',profile_background:'cinetracker_profile_landing_v379-nonfatal',detail_seen:'explicit-state-only',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v379.js'),js),writeFile(resolve(dist,'app-v379.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v378.js'),{force:true}),rm(resolve(dist,'app-v378.css'),{force:true})]);
console.log('WEB_R379_READY stable Home + strict Fresh + quick Profile');
