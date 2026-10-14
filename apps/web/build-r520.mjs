import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r519.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,specialRuntime,screenRuntime,summaryRuntime,finalRuntime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v519.js'),'utf8'),readFile(resolve(dist,'app-v519.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r520-special-series.js'),'utf8'),readFile(resolve(root,'runtime-r520-series-screen.js'),'utf8'),
 readFile(resolve(root,'runtime-r520-summary.js'),'utf8'),readFile(resolve(root,'runtime-r520-final.js'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r520 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r520 invalid '+label+' bounds');return{start,end:close+6}}
function replaceRuntime(source,anchor,replacement,label){const b=bounds(source,anchor,label);return source.slice(0,b.start)+replacement+source.slice(b.end)}
for(const [src,label] of [[specialRuntime,'special'],[screenRuntime,'screen'],[summaryRuntime,'summary'],[finalRuntime,'final']]){try{new Function(src)}catch(e){throw new Error('r520 '+label+' syntax '+String(e?.message||e))}}
js=replaceRuntime(js,"window.__ctR512Marker='r519-f1+wwe-ppv-single-special-owner+ufc-retired'",specialRuntime,'r512');
js=replaceRuntime(js,"window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch'",screenRuntime,'r513');
js=replaceRuntime(js,"window.__ctR516SpecialSummary={version:'0.3.46'",summaryRuntime,'r516');
js=replaceRuntime(js,"window.__ctR519Marker='wwe-ppv-special-series+ufc-ui-retired+f1-preserved'",finalRuntime,'r519-final');
try{new Function(js)}catch(e){throw new Error('r520 full bundle syntax '+String(e?.message||e))}
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r520-official-0.3.47';").replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.47 • $'+'{REVISION}');
html=html.replaceAll('app-v519.js','app-v520.js').replaceAll('app-v519.css','app-v520.css').replaceAll('v0.3.46','v0.3.47').replaceAll('r519-official-0.3.46','r520-official-0.3.47');
css+='\n/* r520 — F1 + UFC + WWE PPV coexist; no special-series feature removed. */\n';
sw=sw.replaceAll('ct-media-r519','ct-media-r520').replaceAll('app-v519.js','app-v520.js').replaceAll('app-v519.css','app-v520.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.47',revision:'r520-official-0.3.47',base:'r519+r520-three-special-series',
 scope:'f1+ufc+wwe-ppv-three-special-series',
 special_series:'F1, UFC and WWE Pay-Per-View coexist. Each opens a full-screen year/season view and keeps its own canonical watch writer.',
 ufc:'restored as an active special series using canonical v518 season data plus bounded TMDB completion',
 wwe_ppv:'kept as a third special series; main PPV/PLE brands are grouped by year and historical gaps are completed from TMDB only when that season is opened',
 f1:'preserved unchanged with canonical r462 writer and historical race fallback',
 preserved:'Raw, SmackDown, Home Movies, Discover, Top 10, Pra Você, Profile, generic Sports and Android 1.0.20/10062 unchanged'
});
await Promise.all([
 writeFile(resolve(dist,'app-v520.js'),js),writeFile(resolve(dist,'app-v520.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v519.js'),{force:true}),rm(resolve(dist,'app-v519.css'),{force:true})]);
for(const need of [
 "window.__ctR520Marker='f1+ufc+wwe-ppv-three-special-series+no-feature-removal'",
 "window.__ctR512Marker='r520-f1+ufc+wwe-three-special-series'",
 "window.__ctR513SeriesScreenMarker='r520-three-special-series-screen+year-select+optimistic-watch'",
 "cinetracker_ufc_series_v518","cinetracker_wwe_ppv_series_v519","cinetracker_f1_series_v512",
 "cinetracker_ufc_watch_v512","cinetracker_wwe_ppv_watch_v519","cinetracker_f1_watch_sync_v462",
 "WWE Pay-Per-View","UFC","Fórmula 1","r520-official-0.3.47"
])if(!js.includes(need))throw new Error('r520 missing '+need);
if(js.includes("window.__ctR512Marker='r519-f1+wwe-ppv-single-special-owner+ufc-retired'"))throw new Error('r520 retained retired owner');
console.log('WEB_R520_READY F1 + UFC + WWE PPV');
