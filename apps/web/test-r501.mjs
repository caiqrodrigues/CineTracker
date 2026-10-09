import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r501.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v501.js'),'utf8'),readFile(resolve('dist/app-v501.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r501 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.28'&&webPkg.version==='0.3.28','versions');
ok(release.version==='0.3.28'&&release.revision==='r501-official-0.3.28','release');
ok(html.includes('app-v501.js?ct=r501-official-0.3.28')&&html.includes('app-v501.css?ct=r501-official-0.3.28'),'assets');
ok(js.includes('window.__ctR501Marker="movies-history-hidden-by-direct-anchor+r500-preserved"'),'marker');
ok(js.includes("if(kind==='movies'){"),'movie-specific anchor');
ok(js.includes("target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})"),'direct scrollIntoView');
ok(js.includes("delta=target.getBoundingClientRect().top-margin"),'exact viewport correction');
ok(css.includes('[data-home-view="movies"]')&&css.includes('overflow-anchor:none!important'),'overflow anchoring disabled');
ok(js.includes('window.__ctR500Marker="real-history-anchor+isolated-movie-2x3+adaptive-top10-10x10"'),'r500 preserved');
ok(js.includes('ct500-movie-card'),'movie cards preserved');
ok(js.includes('topEligible500'),'Top10 r500 preserved');
const tail=js.slice(js.lastIndexOf('window.__ctR501Marker'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval('])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R501_REGRESSION_OK');

const src=await readFile(resolve('test-r500-browser.mjs'),'utf8');
let patched=src
 .replace("await import('./build-r500.mjs');","await import('./build-r501.mjs');")
 .replaceAll('app-v500.js?ct=r500-official-0.3.27','app-v501.js?ct=r501-official-0.3.28')
 .replaceAll('app-v500.css?ct=r500-official-0.3.27','app-v501.css?ct=r501-official-0.3.28')
 .replace("ok(mw.getBoundingClientRect().top<320,'Watchlist not anchored near viewport '+mw.getBoundingClientRect().top);",
 "const wt=mw.getBoundingClientRect().top,hb=mh.getBoundingClientRect().bottom;ok(wt<90,'Watchlist not anchored at viewport '+wt);ok(hb<55,'movie history still visible below anchor '+hb);");
const tmp=resolve('.test-r501-browser-run.mjs');await writeFile(tmp,patched);try{await import('./.test-r501-browser-run.mjs?'+Date.now())}finally{await rm(tmp,{force:true})}
console.log('R501_BROWSER_STRICT_MOVIE_ANCHOR_OK');
