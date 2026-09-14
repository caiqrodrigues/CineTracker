import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r282-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v282.js'),'utf8'),readFile(resolve(dist,'app-v282.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r283-history-actions-availability.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r283 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r283 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r283 missing '+x)};
for(const x of[
 "window.__ctR283='history-action-isolation+fresh-availability+legacy-frontier-next';",
 "window.__ctR283History='window-capture-rewatch+undo-no-navigation';",
 "window.__ctR283Availability='fresh-released-minus-canonical-watched';",
 "window.__ctR283Legacy='raw+smackdown-frontier-next+backlog-count';",
 'function ct283ApplyFreshAvailability(row,show)',
 'async function ct283FirstAfterFrontier(row,show)',
 'function ct283CaptureHistoryClick(e)',
 "window.addEventListener('click',ct283CaptureHistoryClick,true);",
 'ct274AvailableText=ct283AvailableText;',
 'ct275FirstReleasedUnseen=async function(row,show)'
])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.73';window.__ctOfficialVersion='1.0.73';","window.__ctWebBuild='1.0.74';window.__ctOfficialVersion='1.0.74';",'version');
js=once(js,"const REVISION='r282-official-1.0.73';","const REVISION='r283-official-1.0.74';",'revision');
must(js,"window.__ctR282='series-recency-order+bucket-authority'");
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
html=html.replaceAll('app-v282.js','app-v283.js').replaceAll('app-v282.css','app-v283.css').replaceAll('CineTracker • v1.0.73','CineTracker • v1.0.74');
sw=sw.replaceAll('ct-web-1.0.73-r282','ct-web-1.0.74-r283').replaceAll('app-v282.js','app-v283.js').replaceAll('app-v282.css','app-v283.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.74',revision:'r283-official-1.0.74',base:'r282-production',home_history_action_owner:'window-capture-r283',home_history_action_navigation_blocked:true,home_fresh_available_episodes:true,home_available_count_source:'fresh-tmdb-release-boundary-minus-canonical-watched',home_legacy_next_episode:'watched-frontier-only',home_legacy_backlog_count_preserved:true,home_raw_smackdown_ancient_next_blocked:true,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v283.js'),js,'utf8'),writeFile(resolve(dist,'app-v283.css'),css,'utf8'),writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')]);
await Promise.all([rm(resolve(dist,'app-v282.js'),{force:true}),rm(resolve(dist,'app-v282.css'),{force:true})]);
console.log('WEB_R283_READY history-actions=isolated availability=fresh legacy-next=frontier-only backlog-count=preserved');
