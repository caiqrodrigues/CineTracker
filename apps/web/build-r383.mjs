import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r382.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v382.js'),'utf8'),readFile(resolve(dist,'app-v382.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r383-home-foryou-authority.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r383 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.173';window.__ctOfficialVersion='1.0.173';","window.__ctWebBuild='1.0.174';window.__ctOfficialVersion='1.0.174';",'version');
js=once(js,"const REVISION='r382-official-1.0.173';","const REVISION='r383-official-1.0.174';",'revision');
js=once(js,"const version='1.0.173',revision='r382-official-1.0.173';","const version='1.0.174',revision='r383-official-1.0.174';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v382.js','app-v383.js').replaceAll('app-v382.css','app-v383.css').replaceAll('v1.0.173','v1.0.174').replaceAll('r382-official-1.0.173','r383-official-1.0.174');
sw=sw.replaceAll('ct-web-1.0.173-r382','ct-web-1.0.174-r383').replaceAll('app-v382.js','app-v383.js').replaceAll('app-v382.css','app-v383.css');
css+='\n/* CineTracker Web 1.0.174 r383 — fast Home series first paint + authoritative Pra Voce actions. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.174',revision:'r383-official-1.0.174',base:'r382-production',scope:'home+discover-only',home_first_paint:'cinetracker_home_series_v383',home_full_background:'cinetracker_home_payload_v382-store-only',home_late_reconcile:'r332-disabled-under-r383',home_movies:'watchlist-v376-full+no-240+sort-owner',discover_foryou_owner:'r383-actions-not-ct336',discover_duplicate_filter:'removed',discover_fresh_final_check:'cinetracker_media_state_v1',discover_actions:'3-2-3-fixed',profile:'untouched-r382-baseline',sports:'untouched-r382-baseline',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v383.js'),js),writeFile(resolve(dist,'app-v383.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v382.js'),{force:true}),rm(resolve(dist,'app-v382.css'),{force:true})]);
console.log('WEB_R383_READY fast Home first paint + authoritative Pra Voce');
