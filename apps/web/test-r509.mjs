import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r509.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v509.js'),'utf8'),readFile(resolve('dist/app-v509.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r509 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.36'&&webPkg.version==='0.3.36','versions');
ok(release.version==='0.3.36'&&release.revision==='r509-official-0.3.36','release');
ok(html.includes('app-v509.js?ct=r509-official-0.3.36')&&html.includes('app-v509.css?ct=r509-official-0.3.36'),'assets');
ok(js.includes("window.__ctR509Marker='home-history-truly-hidden-both-tabs+movies-empty-race-fixed+v405-nonempty+scope-home-only'"),'marker');
ok(js.includes('function homeRearm509')&&js.includes("window.__ctR509HomeAnchor={kind:k,frames:24}"),'finite both-tab anchor');
ok(js.includes("if(hMoviesTask){")&&js.includes("if(hMovies.length){paint();return hMovies}")&&js.includes("if(hMoviesTask===inherited)hMoviesTask=null"),'empty inherited task recovery');
ok(js.includes("if(!first.rows.length)first=await page(0)"),'bounded v405 retry');
ok(js.includes("void loadSeries(false);void loadHistory(false);void loadMovies(false)"),'movie first page preload');
ok(css.includes('flex-flow:row nowrap!important')&&css.includes('width:176px!important')&&css.includes('height:264px!important'),'approved movie rail preserved');
ok(js.includes('topEligible500')&&js.includes('cinetracker_foryou_payload_v498')&&js.includes('cinetracker_profile_screen_v495'),'other screens preserved');
const at=js.lastIndexOf("window.__ctR509Marker="),tail=js.slice(at);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R509_REGRESSION_OK');
