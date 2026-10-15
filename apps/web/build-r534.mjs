import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r533.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,special,related]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v533.js'),'utf8'),readFile(resolve(dist,'app-v533.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r534-special.js'),'utf8'),readFile(resolve(root,'runtime-r534-related.js'),'utf8')
]);

function replaceRegion(source,header,marker,replacement,label){
 const at=source.lastIndexOf(marker);if(at<0)throw new Error('r534 missing '+label+' marker');
 const start=source.lastIndexOf(header,at),end=source.indexOf('\n})();',at);if(start<0||end<0)throw new Error('r534 invalid '+label+' bounds');
 return source.slice(0,start)+replacement.trim()+'\n'+source.slice(end+6)
}
function replaceOnce(source,needle,replacement,label){
 const count=source.split(needle).length-1;if(count!==1)throw new Error('r534 expected one '+label+', found '+count);
 return source.replace(needle,replacement)
}
function functionBounds(source,name){
 const all=[...source.matchAll(new RegExp('function\\s+'+name+'\\s*\\(','g'))];if(all.length!==1)throw new Error('r534 expected one '+name+', found '+all.length);
 const m=all[0],open=source.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;
 for(;i<source.length;i++){
  const c=source[i],n=source[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}
  if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}
  if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r534 unbalanced '+name);return{start:m.index,end:i}
}
function replaceFunction(source,name,replacement){
 const b=functionBounds(source,name);return source.slice(0,b.start)+replacement+source.slice(b.end)
}

js=replaceRegion(js,
 '/* CineTracker Web 0.3.49 r522 — final direct opener for F1/UFC/WWE special series. */',
 "window.__ctR522SpecialOpenMarker='pointerup-owner-f1-ufc-wwe';",
 special,'r522 special opener');

js=replaceRegion(js,
 '/* CineTracker Web 0.3.51 r524 — final direct opener for F1/UFC/WWE special series. */',
 "window.__ctR524SpecialOpenMarker='direct-special-card-owner-no-route-gate';",
 "/* r534 retired r524 special listeners */\n(()=>{'use strict';window.__ctR524SpecialOpen={version:'retired-r534',open:type=>window.__ctR534Special?.openSpecial?.(type)??false};window.__ctR534RetiredR524=true;})();",
 'r524 special opener');

js=replaceRegion(js,
 '/* CineTracker Web 0.3.54 r527 — scoped final authority for Home/Discover/special-series/F1. */',
 "window.__ctR527Marker='home-v527-live-status+movies-real-renderer+discover-10x10-audited+special-pointerdown+f1-gp-detail';",
 "/* r534 r527 compatibility without special pointer owner */\n(()=>{'use strict';if(window.__ctR527?.version==='0.3.54')return;try{sessionStorage.removeItem('ct392:series');sessionStorage.removeItem('ct520:f1:current');sessionStorage.removeItem('ct520:ufc:current');sessionStorage.removeItem('ct520:wwe:current')}catch{}window.__ctR527Marker='home-v527-live-status+movies-real-renderer+discover-10x10-audited+special-pointerdown+f1-gp-detail';window.__ctR527={version:'0.3.54',scope:'home+discover+special-series+f1-hub'};})();",
 'r527 special pointer owner');

js=replaceRegion(js,
 '/* CineTracker Web 0.3.60 r533 — resilient single opener for F1/UFC/WWE. */',
 "window.__ctR533SpecialMarker='special-title-fallback+pointer-owner+real-series-screen';",
 "/* r534 retired r533 special listeners */\n(()=>{'use strict';window.__ctR533Special={version:'retired-r534',openSpecial:type=>window.__ctR534Special?.openSpecial?.(type)??false};window.__ctR534RetiredR533Special=true;})();",
 'r533 special opener');

js=replaceRegion(js,
 '/* CineTracker Web 0.3.60 r533 — pointer-safe related-title SPA owner. */',
 "window.__ctR533RelatedMarker='related-pointerup+click-dedupe+spa-navigation';",
 related,'r533 related owner');

js=replaceFunction(js,'relatedControl',"function relatedControl(target){const card=relatedCard(target);if(!card)return null;return target?.closest?.('[data-ct169-related-watch],[data-action=\"watchlist\"],[data-related-watch]')||null}");

js=replaceOnce(js,
 "const openEl=e.target?.closest?.('[data-ct513-open]');if(openEl){e.preventDefault();e.stopImmediatePropagation();void open(String(openEl.dataset.ct513Open||''));return}",
 "",
 'r520 screen click opener');

js=replaceOnce(js,
 "document.addEventListener('keydown',e=>{const openEl=e.target?.closest?.('[data-ct513-open]');if(openEl&&(e.key==='Enter'||e.key===' ')){e.preventDefault();void open(String(openEl.dataset.ct513Open||''))}if(e.key==='Escape'&&state)close()},true);",
 "document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state)close()},true);",
 'r520 screen keyboard opener');

js=js.replace(/const REVISION='[^']+';/,"const REVISION='r534-official-0.3.61';");
html=html.replaceAll('app-v533.js','app-v534.js').replaceAll('app-v533.css','app-v534.css').replaceAll('v0.3.60','v0.3.61').replaceAll('r533-official-0.3.60','r534-official-0.3.61');
sw=sw.replaceAll('r533','r534').replaceAll('app-v533.js','app-v534.js').replaceAll('app-v533.css','app-v534.css');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.61',revision:'r534-official-0.3.61',base:'r533+r534-canonical-interactions',
 scope:'special-series-one-earliest-owner+related-native-go',
 special_series:'one earliest window owner opens F1/UFC/WWE annual r520 screen; r524/r527/r533 open listeners and r520 screen self-open branch are retired; Raw/SmackDown remain normal series',
 related:'related movie/series opening is owned exclusively by the original application data-media click handler and lexical go(); auxiliary owners only handle Watchlist/Visto',
 preserved:'Home rendering/chrome/order, Discover/PraVocê/Top10, Profile, Sports, writers/catalogs, Raw/SmackDown and Android unchanged'
});

new Function(js);
await Promise.all([
 writeFile(resolve(dist,'app-v534.js'),js),writeFile(resolve(dist,'app-v534.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v533.js'),{force:true}),rm(resolve(dist,'app-v533.css'),{force:true})]);

for(const need of [
 "window.__ctR534SpecialMarker='earliest-single-special-owner+catalog-ready+title-fallback'",
 "window.__ctR534RelatedMarker='related-actions-only+native-go-opens-media'",
 "window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'",
 "window.__ctR533HomeMarker='dominant-body-shield+fixed-controls-above-content'",
 'r534-official-0.3.61'
])if(!js.includes(need))throw new Error('r534 missing '+need);
for(const old of [
 "window.__ctR522SpecialOpenMarker='pointerup-owner-f1-ufc-wwe'",
 "window.__ctR524SpecialOpenMarker='direct-special-card-owner-no-route-gate'",
 "window.__ctR533SpecialMarker='special-title-fallback+pointer-owner+real-series-screen'",
 "window.__ctR533RelatedMarker='related-pointerup+click-dedupe+spa-navigation'",
 'ct527SpecialOpenError'
])if(js.includes(old))throw new Error('r534 active old owner survived '+old);

console.log('WEB_R534_READY canonical interactions');