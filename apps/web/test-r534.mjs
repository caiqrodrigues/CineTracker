import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r534.mjs');
const [js,html,css,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v534.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v534.css'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw),yes=(v,m)=>{if(!v)throw new Error('r534 regression: '+m)},count=s=>js.split(s).length-1;
yes(rootPkg.version==='0.3.61'&&webPkg.version==='0.3.61','versions');
yes(release.version==='0.3.61'&&release.revision==='r534-official-0.3.61','release');
yes(html.includes('app-v534.js')&&html.includes('app-v534.css'),'assets');
yes(count("window.__ctR534SpecialMarker='earliest-single-special-owner+catalog-ready+title-fallback'")===1,'one canonical special owner');
yes(count("window.__ctR534RelatedMarker='related-actions-only+native-go-opens-media'")===1,'one related action owner');
for(const old of [
 "window.__ctR522SpecialOpenMarker='pointerup-owner-f1-ufc-wwe'",
 "window.__ctR524SpecialOpenMarker='direct-special-card-owner-no-route-gate'",
 "window.__ctR533SpecialMarker='special-title-fallback+pointer-owner+real-series-screen'",
 "window.__ctR533RelatedMarker='related-pointerup+click-dedupe+spa-navigation'",
 'ct527SpecialOpenError'
])yes(!js.includes(old),'retired '+old);
yes(js.includes("if(t==='formula 1'||t==='formula one'||t==='f1')return'f1'"),'F1 exact fallback');
yes(js.includes("if(t==='ufc')return'ufc'"),'UFC exact fallback');
yes(js.includes("if(t==='wwe pay per view'||t==='wwe payperview'||t==='wwe ppv')return'wwe'"),'WWE exact fallback');
yes(!js.includes("const nav=window.__ctCoreR471?.navigate"),'no fake navigate dependency');
yes(!js.includes("ct527SpecialOpenError"),'r527 special pointer removed');
const rc='function relatedControl(target){const card=relatedCard(target);if(!card)return null;return target?.closest?.(\'[data-ct169-related-watch],[data-action="watchlist"],[data-related-watch]\')||null}';
yes(js.includes(rc),'r292 actions-only control');
const relAt=js.indexOf("window.__ctR534RelatedMarker='related-actions-only+native-go-opens-media'"),relStart=js.lastIndexOf('/* CineTracker Web 0.3.61 r534',relAt),relEnd=js.indexOf('\n})();',relAt),rel=js.slice(relStart,relEnd);
yes(!rel.includes('[data-media]')&&!rel.includes('navigate')&&!rel.includes('history.pushState'),'related owner does not navigate');
const screenAt=js.indexOf("window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'"),screenStart=js.lastIndexOf('/* CineTracker Web 0.3.47 r520',screenAt),screenEnd=js.indexOf('\n})();',screenAt),screen=js.slice(screenStart,screenEnd);
yes(!screen.includes("closest?.('[data-ct513-open]')"),'screen self-opener retired');
yes(css.includes('data-ct533-home-shield'),'Home chrome preserved');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.61 r534'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R534_REGRESSION_OK');