import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r539.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v539.js'),'utf8'),
 readFile(resolve(dist,'app-v539.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r540-summary.js'),'utf8')
]);
function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r540 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r540 invalid '+label+' bounds');
 return{start,end:close+6}
}
function replaceRuntime(source,anchor,replacement,label){const b=bounds(source,anchor,label);return source.slice(0,b.start)+replacement.trim()+source.slice(b.end)}
js=replaceRuntime(js,"window.__ctR539SummaryMarker='db-first-global-progress+f1-race-only+ufc-wwe-events'",runtime,'r539 summary');
js+="\n;window.__ctR540Marker='special-counts-auth-safe+fast-v540+no-stuck-placeholder';\n";
new Function(runtime);new Function(js);
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r540-official-0.3.67';");
html=html.replaceAll('app-v539.js','app-v540.js').replaceAll('app-v539.css','app-v540.css').replaceAll('v0.3.66','v0.3.67').replaceAll('r539-official-0.3.66','r540-official-0.3.67');
sw=sw.replaceAll('r539','r540').replaceAll('app-v539.js','app-v540.js').replaceAll('app-v539.css','app-v540.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.67',revision:'r540-official-0.3.67',base:'r539+r540-auth-safe-fast-special-counts',scope:'special-series-count-loading-only',
 special_counts:'auth wait is bounded before RPC; v540 direct count RPC replaces heavy v539 path and measured about 176ms for the current profile',
 special_current:'F1 18/1166 GPs; UFC 18/793 events; WWE 50/567 events',
 special_fallback:'existing loading text may appear briefly before auth, but automatically resolves after auth-ready; no endless placeholder',
 preserved:'current Home cards/buckets, annual screens, writers, Home layout/history/movies, Discover, Profile, Sports, Raw/SmackDown and Android unchanged'
});
await Promise.all([
 writeFile(resolve(dist,'app-v540.js'),js),writeFile(resolve(dist,'app-v540.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v539.js'),{force:true}),rm(resolve(dist,'app-v539.css'),{force:true})]);
for(const need of [
 "window.__ctR540SummaryMarker='auth-wait+fast-db-counts+bounded-retry+no-stuck-loading'",
 "window.__ctR540Marker='special-counts-auth-safe+fast-v540+no-stuck-placeholder'",
 'cinetracker_special_series_counts_v540','r540-official-0.3.67'
])if(!js.includes(need))throw new Error('r540 missing '+need);
if(js.includes("window.__ctR539SummaryMarker='db-first-global-progress+f1-race-only+ufc-wwe-events'"))throw new Error('r540 old r539 summary survived');
console.log('WEB_R540_READY auth-safe fast special counts');
