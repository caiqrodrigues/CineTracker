import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r374.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v374.js'),'utf8'),readFile(resolve(dist,'app-v374.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r375-home-semantic-start.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r375 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.165';window.__ctOfficialVersion='1.0.165';","window.__ctWebBuild='1.0.166';window.__ctOfficialVersion='1.0.166';",'version');
js=once(js,"const REVISION='r374-official-1.0.165';","const REVISION='r375-official-1.0.166';",'revision');
js=once(js,"const version='1.0.165',revision='r374-official-1.0.165';","const version='1.0.166',revision='r375-official-1.0.166';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v374.js','app-v375.js').replaceAll('app-v374.css','app-v375.css').replaceAll('v1.0.165','v1.0.166').replaceAll('r374-official-1.0.165','r375-official-1.0.166');
sw=sw.replaceAll('ct-web-1.0.165-r374','ct-web-1.0.166-r375').replaceAll('app-v374.js','app-v375.js').replaceAll('app-v374.css','app-v375.css');
css+='\n/* CineTracker Web 1.0.166 r375 — semantic Home start keeps History above initial viewport. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.166',revision:'r375-official-1.0.166',base:'r374-production',scope:'home-semantic-tab-start',home_tab_scroll:'first-non-history-section-under-tabs',home_history:'preserved-above-initial-viewport',home_movies_start:'Assistir-a-seguir-Watchlist',home_series_start:'Assistir-a-seguir',home_absolute_zero:'removed',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v375.js'),js),writeFile(resolve(dist,'app-v375.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v374.js'),{force:true}),rm(resolve(dist,'app-v374.css'),{force:true})]);
console.log('WEB_R375_READY semantic Home start with History preserved above');