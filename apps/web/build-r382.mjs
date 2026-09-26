import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r376.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v376.js'),'utf8'),readFile(resolve(dist,'app-v376.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r382-baseline-restore.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r382 expected one '+l+', found '+n);return s.replace(a,b)};
js=js.replaceAll("cinetracker_home_payload_v359","cinetracker_home_payload_v382");
js=once(js,"window.__ctWebBuild='1.0.167';window.__ctOfficialVersion='1.0.167';","window.__ctWebBuild='1.0.173';window.__ctOfficialVersion='1.0.173';",'version');
js=once(js,"const REVISION='r376-official-1.0.167';","const REVISION='r382-official-1.0.173';",'revision');
js=once(js,"const version='1.0.167',revision='r376-official-1.0.167';","const version='1.0.173',revision='r382-official-1.0.173';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v376.js','app-v382.js').replaceAll('app-v376.css','app-v382.css').replaceAll('v1.0.167','v1.0.173').replaceAll('r376-official-1.0.167','r382-official-1.0.173');
sw=sw.replaceAll('ct-web-1.0.167-r376','ct-web-1.0.173-r382').replaceAll('app-v376.js','app-v382.js').replaceAll('app-v376.css','app-v382.css');
css+='\n/* CineTracker Web 1.0.173 r382 — pre-r380 Home/Profile baseline + strict Pra Voce. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.173',revision:'r382-official-1.0.173',base:'r376-baseline',scope:'restore-home-profile+strict-foryou',home_renderer:'pre-r380-original',home_payload:'cinetracker_home_payload_v382',home_buckets:'original-v359-preserved',home_history:'original-hidden-above-semantic-start',profile_renderer:'r313+r316-original-approved',profile_data:'cinetracker_profile_v380-cache-first',discover_filter:'cinetracker_discover_filter_v381',discover_actions:'r382-exact-3-2-3',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v382.js'),js),writeFile(resolve(dist,'app-v382.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v376.js'),{force:true}),rm(resolve(dist,'app-v376.css'),{force:true})]);
console.log('WEB_R382_READY restored Home/Profile baseline + strict Pra Voce');
