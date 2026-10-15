import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r532.mjs');
const [js,html,css,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v532.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/app-v532.css'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r532 regression: '+m)},count=s=>(js.split(s).length-1);
yes(rootPkg.version==='0.3.59'&&webPkg.version==='0.3.59','versions');
yes(release.version==='0.3.59'&&release.revision==='r532-official-0.3.59','release');
yes(html.includes('app-v532.js')&&html.includes('app-v532.css'),'assets');
yes(count("window.__ctR532SpecialMarker='single-special-opener-real-screen'")===1,'one special owner');
yes(count("window.__ctR532RelatedMarker='related-click-spa-single-owner'")===1,'one related owner');
yes(count("window.__ctR532HomeMarker='body-owned-opaque-home-shield'")===1,'one Home shield owner');
yes(count("window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'")===1,'one r520 screen owner');
yes(!js.includes("window.__ctR286='related-open-watchlist-seen-window-capture';"),'old r286 owner retired');
yes(!js.includes("window.__ctR529Marker='home-normal-flow+main-anchor+single-f1-ufc-wwe-opener';"),'old r529 owner retired');
yes(!js.includes("window.__ctR531Marker='special-real-screen+related-spa+opaque-home-chrome';"),'old r531 owner retired');
yes(!js.includes("/* CineTracker Web 0.3.40 r513 — canonical full-screen UFC/F1 series view. */"),'r513 screen retired');
yes(!js.includes("/* CineTracker r519 — single full-screen owner for F1 + WWE Pay-Per-View. */"),'r519 screen retired');
yes(js.includes("document.documentElement.dataset.ct532SeriesScreen='opening:'+t"),'special screen immediate owner');
yes(js.includes("document.body.appendChild(shield)"),'Home shield belongs to body');
yes(css.includes('html body>[data-ct532-home-shield]')&&css.includes('background:#030a0f!important'),'opaque shield css');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.59 r532'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R532_REGRESSION_OK');
