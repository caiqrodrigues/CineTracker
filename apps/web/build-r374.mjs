import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r373.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v373.js'),'utf8'),readFile(resolve(dist,'app-v373.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r374-home-tab-scroll-reset.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r374 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.164';window.__ctOfficialVersion='1.0.164';","window.__ctWebBuild='1.0.165';window.__ctOfficialVersion='1.0.165';",'version');
js=once(js,"const REVISION='r373-official-1.0.164';","const REVISION='r374-official-1.0.165';",'revision');
js=once(js,"const version='1.0.164',revision='r373-official-1.0.164';","const version='1.0.165',revision='r374-official-1.0.165';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v373.js','app-v374.js').replaceAll('app-v373.css','app-v374.css').replaceAll('v1.0.164','v1.0.165').replaceAll('r373-official-1.0.164','r374-official-1.0.165');
sw=sw.replaceAll('ct-web-1.0.164-r373','ct-web-1.0.165-r374').replaceAll('app-v373.js','app-v374.js').replaceAll('app-v373.css','app-v374.css');
css+='\n/* CineTracker Web 1.0.165 r374 — Home tab switch owns scroll reset. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.165',revision:'r374-official-1.0.165',base:'r373-production',scope:'home-tab-scroll-reset',home_tab_scroll:'top-zero-window+scrollable-ancestors',home_tab_scroll_owner:'r374-window-capture-before-legacy-anchors',home_tab_scroll_timing:'immediate+microtask+raf+bounded-settle-cancel-on-user-scroll',home_tab_state_owner:'r371-preserved',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v374.js'),js),writeFile(resolve(dist,'app-v374.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v373.js'),{force:true}),rm(resolve(dist,'app-v373.css'),{force:true})]);
console.log('WEB_R374_READY Home tab scroll resets to top without legacy anchor interference');