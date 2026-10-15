import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r532.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css0,sw,releaseRaw,special,related,home,extraCss]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v532.js'),'utf8'),readFile(resolve(dist,'app-v532.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r533-special.js'),'utf8'),readFile(resolve(root,'runtime-r533-related.js'),'utf8'),
 readFile(resolve(root,'runtime-r533-home.js'),'utf8'),readFile(resolve(root,'r533-final.css'),'utf8')
]);
function replaceRegion(source,header,marker,replacement,label){
 const at=source.lastIndexOf(marker);if(at<0)throw new Error('r533 missing '+label+' marker');
 const start=source.lastIndexOf(header,at),end=source.indexOf('\n})();',at);if(start<0||end<0)throw new Error('r533 invalid '+label+' bounds');
 return source.slice(0,start)+replacement.trim()+'\n'+source.slice(end+6)
}
js=replaceRegion(js,'/* CineTracker Web 0.3.59 r532 — single canonical opener for F1/UFC/WWE. */',"window.__ctR532SpecialMarker='single-special-opener-real-screen';",special,'special');
js=replaceRegion(js,'/* CineTracker Web 0.3.59 r532 — single canonical owner for related-title interactions. */',"window.__ctR532RelatedMarker='related-click-spa-single-owner';",related,'related');
js=replaceRegion(js,'/* CineTracker Web 0.3.59 r532 — viewport-owned opaque Home chrome shield. */',"window.__ctR532HomeMarker='body-owned-opaque-home-shield';",home,'home');
const oldCss='/* CineTracker Web 0.3.59 r532 — opaque Home chrome in the viewport stacking context. */';
const cssAt=css0.lastIndexOf(oldCss);if(cssAt>=0)css0=css0.slice(0,cssAt).trimEnd();
const css=css0+'\n'+extraCss+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r533-official-0.3.60';");
html=html.replaceAll('app-v532.js','app-v533.js').replaceAll('app-v532.css','app-v533.css').replaceAll('v0.3.59','v0.3.60').replaceAll('r532-official-0.3.59','r533-official-0.3.60');
sw=sw.replaceAll('r532','r533').replaceAll('app-v532.js','app-v533.js').replaceAll('app-v532.css','app-v533.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.60',revision:'r533-official-0.3.60',base:'r532+r533-real-interaction-fallbacks',
 scope:'special-generic-row-fallback+related-pointer-owner+dominant-home-shield',
 special_series:'F1/UFC/WWE exact-title fallback catches generic Home rows as well as special data attributes; one pointer owner opens the canonical r520 annual screen',
 related:'related cards restore pointerup capture with click dedupe and SPA fallback; Watchlist/Visto remain unchanged',
 home:'body-owned opaque shield moves above all normal Home content while fixed tabs/search remain above the shield',
 preserved:'Home data/order, Discover/PraVocê/Top10, Profile, Sports, Raw/SmackDown, watched writers and Android unchanged'
});
new Function(js);
await Promise.all([
 writeFile(resolve(dist,'app-v533.js'),js),writeFile(resolve(dist,'app-v533.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v532.js'),{force:true}),rm(resolve(dist,'app-v532.css'),{force:true})]);
for(const need of [
 "window.__ctR533SpecialMarker='special-title-fallback+pointer-owner+real-series-screen'",
 "window.__ctR533RelatedMarker='related-pointerup+click-dedupe+spa-navigation'",
 "window.__ctR533HomeMarker='dominant-body-shield+fixed-controls-above-content'",
 "window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'",
 'r533-official-0.3.60'
])if(!js.includes(need))throw new Error('r533 missing '+need);
for(const old of [
 "window.__ctR532SpecialMarker='single-special-opener-real-screen'",
 "window.__ctR532RelatedMarker='related-click-spa-single-owner'",
 "window.__ctR532HomeMarker='body-owned-opaque-home-shield'"
])if(js.includes(old))throw new Error('r533 old owner survived '+old);
console.log('WEB_R533_READY real interaction fallbacks');
