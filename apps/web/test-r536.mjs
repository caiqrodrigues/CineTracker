import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r536.mjs');
const [js,html,css,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v536.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v536.css'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw),yes=(v,m)=>{if(!v)throw new Error('r536 regression: '+m)};
yes(rootPkg.version==='0.3.63'&&webPkg.version==='0.3.63','versions');
yes(release.version==='0.3.63'&&release.revision==='r536-official-0.3.63','release');
yes(html.includes('app-v536.js')&&html.includes('app-v536.css'),'assets');
yes(js.includes("window.__ctR536Marker='home-anchor-user-safe+special-remount+movies-2x3-rail+public-bounded-audit+top10-10x10'"),'marker');
yes(js.includes("const initial=!final&&!s.initialDone")&&js.includes("if(!initial&&homeUserMoved393)"),'initial Home anchor survives incidental movement');
yes(js.includes("window.__ctR512Special")&&js.includes("api?.mountAll?.()")&&js.includes("api.loadCurrent(false)"),'special cards remount after Series repaint');
yes(js.includes('ct536-movie-card')&&js.includes('ct536-movie-rail'),'movie native 2:3 rail');
yes(css.includes('width:176px!important')&&css.includes('height:264px!important')&&css.includes('flex-flow:row nowrap!important'),'movie rail geometry');
yes(js.includes('ct536AuditPublic')&&js.includes("document.documentElement.dataset.ct536DiscoverPaint"),'bounded public audit');
yes(js.includes("sk='ct536:top10:'")&&js.includes("eligible.length<10")&&js.includes("final.length===10"),'Top10 fills exactly 10');
yes(js.includes("SPECIAL_SEASON_TIMEOUT")&&css.includes('.ct513-series-screen{position:fixed!important;inset:0!important'),'special full-screen bounded');
for(const tab of ["tab==='new'","tab==='releases'","tab==='anticipated'"])yes(js.includes(tab),'public tab '+tab);
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.63 r536'));for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R536_REGRESSION_OK');
