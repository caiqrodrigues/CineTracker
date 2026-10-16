import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r537.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,summaryRuntime,markerRuntime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v537.js'),'utf8'),
 readFile(resolve(dist,'app-v537.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r538-summary.js'),'utf8'),
 readFile(resolve(root,'runtime-r538-counts.js'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);
 if(at<0)throw new Error('r538 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r538 invalid '+label+' bounds');
 return{start,end:close+6};
}
function replaceRuntime(source,anchor,replacement,label){
 const b=bounds(source,anchor,label);
 return source.slice(0,b.start)+replacement.trim()+source.slice(b.end)
}

const A521="window.__ctR521SummaryMarker='authoritative-persistent-no-partial-denominator';";
js=replaceRuntime(js,A521,summaryRuntime,'active r521 summary owner');

new Function(summaryRuntime);
new Function(markerRuntime);
js+='\n'+markerRuntime+'\n';
new Function(js);

html=html.replaceAll('app-v537.js','app-v538.js').replaceAll('app-v537.css','app-v538.css').replaceAll('v0.3.64','v0.3.65').replaceAll('r537-official-0.3.64','r538-official-0.3.65');
sw=sw.replaceAll('r537','r538').replaceAll('app-v537.js','app-v538.js').replaceAll('app-v537.css','app-v538.css');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.65',
 revision:'r538-official-0.3.65',
 base:'r537+r538-counts-only',
 scope:'counts-only-naruto-shippuuden-f1-ufc-wwe',
 counts:'Naruto 220 unchanged; Naruto Shippuuden 500; F1 1166 GPs; UFC 793 events; WWE PPV/PLE 567 supercards',
 special_summary:'active r521 summary owner is replaced by r538; public totals may grow above verified floors and DB v538 prevents partial catalogs from reducing totals',
 preserved:'Home layout/order, movie list, Discover, Profile, Sports, F1/UFC/WWE event catalogs and watch writers, Raw/SmackDown and Android unchanged'
});

await Promise.all([
 writeFile(resolve(dist,'app-v538.js'),js),
 writeFile(resolve(dist,'app-v538.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v537.js'),{force:true}),rm(resolve(dist,'app-v537.css'),{force:true})]);

for(const need of [
 "window.__ctR538SummaryMarker='stable-counts-v538+public-growth'",
 "window.__ctR538Marker='counts-only+naruto-shippuuden-500+f1-1166+ufc-793+wwe-567'",
 'cinetracker_special_series_counts_v538',
 "sessionKey='ct538:special-summary'",
 'f1:1166','ufc:793','wwe:567',
 'r538-official-0.3.65'
])if(!js.includes(need))throw new Error('r538 missing '+need);
if(js.includes("window.__ctR521SummaryMarker='authoritative-persistent-no-partial-denominator'"))throw new Error('r538 old summary owner survived');

console.log('WEB_R538_READY counts-only');
