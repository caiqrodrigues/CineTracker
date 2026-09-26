import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r380.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v380.js'),'utf8'),readFile(resolve(dist,'app-v380.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r381-restore-home-profile-foryou.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r381 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.171';window.__ctOfficialVersion='1.0.171';","window.__ctWebBuild='1.0.172';window.__ctOfficialVersion='1.0.172';",'version');
js=once(js,"const REVISION='r380-official-1.0.171';","const REVISION='r381-official-1.0.172';",'revision');
js=once(js,"const version='1.0.171',revision='r380-official-1.0.171';","const version='1.0.172',revision='r381-official-1.0.172';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v380.js','app-v381.js').replaceAll('app-v380.css','app-v381.css').replaceAll('v1.0.171','v1.0.172').replaceAll('r380-official-1.0.171','r381-official-1.0.172');
sw=sw.replaceAll('ct-web-1.0.171-r380','ct-web-1.0.172-r381').replaceAll('app-v380.js','app-v381.js').replaceAll('app-v380.css','app-v381.css');
css+='\n/* CineTracker Web 1.0.172 r381 — full Home first, original Profile, audited ForYou 3/2/3. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.172',revision:'r381-official-1.0.172',base:'r380-production',scope:'restore-home-profile+final-foryou',home_authority:'cinetracker_home_payload_v359-full-first',home_live_patch:'bounded-active-tmdb-before-network-first-paint',home_history:'full-v359-preserved',profile_data:'cinetracker_profile_v380-fast',profile_ui:'original-pre-r379-structure+r238-stats',discover_filter:'cinetracker_discover_filter_v381-user-evidence-required',discover_foryou_actions:'ct381-isolated-3-2-3',discover_fresh_render:'audit-required-no-fail-open',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v381.js'),js),writeFile(resolve(dist,'app-v381.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v380.js'),{force:true}),rm(resolve(dist,'app-v380.css'),{force:true})]);
console.log('WEB_R381_READY full Home + original Profile + audited 3/2/3 ForYou');
