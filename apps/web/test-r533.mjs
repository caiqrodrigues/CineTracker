import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r533.mjs');
const [js,html,css,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v533.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v533.css'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw),yes=(v,m)=>{if(!v)throw new Error('r533 regression: '+m)},count=s=>js.split(s).length-1;
yes(rootPkg.version==='0.3.60'&&webPkg.version==='0.3.60','versions');
yes(release.version==='0.3.60'&&release.revision==='r533-official-0.3.60','release');
yes(html.includes('app-v533.js')&&html.includes('app-v533.css'),'assets');
yes(count("window.__ctR533SpecialMarker='special-title-fallback+pointer-owner+real-series-screen'")===1,'one special owner');
yes(count("window.__ctR533RelatedMarker='related-pointerup+click-dedupe+spa-navigation'")===1,'one related owner');
yes(count("window.__ctR533HomeMarker='dominant-body-shield+fixed-controls-above-content'")===1,'one home owner');
yes(!js.includes("window.__ctR532SpecialMarker='single-special-opener-real-screen'"),'r532 special removed');
yes(!js.includes("window.__ctR532RelatedMarker='related-click-spa-single-owner'"),'r532 related removed');
yes(!js.includes("window.__ctR532HomeMarker='body-owned-opaque-home-shield'"),'r532 home removed');
yes(js.includes("if(t==='formula 1'||t==='formula one')return'f1'"),'F1 title fallback');
yes(js.includes("if(t==='ufc')return'ufc'"),'UFC title fallback');
yes(js.includes("if(t==='wwe pay per view'||t==='wwe payperview')return'wwe'"),'WWE title fallback');
yes(js.includes("window.addEventListener('pointerup'"),'pointerup owner');
yes(css.includes('z-index:9000!important')&&css.includes('z-index:9020!important'),'dominant Home stack');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.60 r533'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R533_REGRESSION_OK');
