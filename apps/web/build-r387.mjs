import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r386.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v386.js'),'utf8'),readFile(resolve(dist,'app-v386.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r387 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.177';window.__ctOfficialVersion='1.0.177';","window.__ctWebBuild='1.0.178';window.__ctOfficialVersion='1.0.178';",'version');
js=once(js,"const REVISION='r386-official-1.0.177';","const REVISION='r387-official-1.0.178';",'revision');
js=once(js,"const version='1.0.177',revision='r386-official-1.0.177';","const version='1.0.178',revision='r387-official-1.0.178';",'footer');
js=once(js,"if(window.__ctR386?.version==='1.0.177')return;","if(window.__ctR386?.version==='1.0.178')return;",'fresh-client guard');
js=once(js,"const CURRENT='1.0.177',REVISION='r386-official-1.0.177';","const CURRENT='1.0.178',REVISION='r387-official-1.0.178';",'fresh-client identity');
js=once(js,'boot();',"window.__ctR387Marker='home-semantic-hidden-history+full-history+foryou-single-action-row+fresh-db-fallback';\nboot();",'marker');
html=html.replaceAll('app-v386.js','app-v387.js').replaceAll('app-v386.css','app-v387.css').replaceAll('v1.0.177','v1.0.178').replaceAll('r386-official-1.0.177','r387-official-1.0.178');
sw=sw.replaceAll('ct-web-1.0.177-r386','ct-web-1.0.178-r387').replaceAll('app-v386.js','app-v387.js').replaceAll('app-v386.css','app-v387.css');
css+='\n/* CineTracker Web 1.0.178 r387 — Home hidden full history + stable Pra Voce actions/Fresh fallback. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.178',revision:'r387-official-1.0.178',base:'r386-production',scope:'home+discover-foryou-only',home_start:'semantic-main-section-history-above',home_history:'cinetracker_home_history_v387-unbounded-logical-dedupe',home_movies:'r385-complete-preserved',discover_foryou_actions:'one-direct-flex-row-card-width',discover_fresh:'v387-db-fallback+v385-audit+bounded-tmdb',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v387.js'),js),writeFile(resolve(dist,'app-v387.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v386.js'),{force:true}),rm(resolve(dist,'app-v386.css'),{force:true})]);
console.log('WEB_R387_READY Home semantic/full history + Pra Voce stable Fresh');
