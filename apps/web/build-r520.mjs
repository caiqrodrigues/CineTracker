import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r519.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,special,screen,summary,home,sports]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v519.js'),'utf8'),readFile(resolve(dist,'app-v519.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r520-special-series.js'),'utf8'),readFile(resolve(root,'runtime-r520-series-screen.js'),'utf8'),
 readFile(resolve(root,'runtime-r520-summary.js'),'utf8'),readFile(resolve(root,'runtime-r520-home-controls.js'),'utf8'),
 readFile(resolve(root,'runtime-r520-sports-drill.js'),'utf8')
]);
function replaceCommentedRuntime(source,anchor,header,replacement,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r520 missing '+label+' anchor');
 const start=source.lastIndexOf(header,at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r520 invalid '+label+' bounds');
 return source.slice(0,start)+replacement.trim()+'\n'+source.slice(close+6)
}
function replaceSummaryRuntime(source,anchor,replacement){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r520 missing r516 summary anchor');
 const signature="\n(()=>{\n'use strict';\nconst core=()=>window.__ctCoreR471||null;\nlet summary=null,task=null;\nconst cacheKey='ct519:special-summary';";
 const raw=source.lastIndexOf(signature,at),start=raw<0?-1:raw+1,close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r520 invalid r516 summary bounds');
 return source.slice(0,start)+replacement.trim()+'\n'+source.slice(close+6)
}
function syntax(source,label){try{new Function(source)}catch(e){throw new Error('r520 '+label+' syntax: '+String(e?.message||e))}}
const A512="window.__ctR512Marker='r519-f1+wwe-ppv-single-special-owner+ufc-retired'";
const A513="window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch'";
const A516="window.__ctR516SpecialSummary={version:'0.3.46'";
const A519="window.__ctR519Marker='wwe-ppv-special-series+ufc-ui-retired+f1-preserved'";
for(const [source,label] of [[special,'r520 special source'],[screen,'r520 screen source'],[summary,'r520 summary source'],[home,'r520 home source'],[sports,'r520 sports source']])syntax(source,label);
js=replaceCommentedRuntime(js,A512,'/* CineTracker Web 0.3.39 r512',special,'r512 special owner');syntax(js,'after r512');
js=replaceCommentedRuntime(js,A513,'/* CineTracker r519 — single full-screen owner for F1 + WWE Pay-Per-View. */',screen,'r513 series screen');syntax(js,'after r513');
js=replaceSummaryRuntime(js,A516,summary);syntax(js,'after r516');
js=replaceCommentedRuntime(js,A519,'/* CineTracker Web 0.3.46 r519 — WWE PPV/PLE replaces mistaken UFC special-series UI. */',"(()=>{'use strict';window.__ctR520Marker='f1+ufc+wwe-full-catalogs+fixed-home-controls+movies-2x3+sports-drill';window.__ctR520={version:'0.3.47',scope:'special-series+home-controls+sports-drill'};})();",'r519 final');syntax(js,'after r519');
js+='\n'+home.trim()+'\n'+sports.trim()+'\n';syntax(js,'after appended runtimes');
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r520-official-0.3.47';").replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.47 • $'+'{REVISION}');
html=html.replaceAll('app-v519.js','app-v520.js').replaceAll('app-v519.css','app-v520.css').replaceAll('v0.3.46','v0.3.47').replaceAll('r519-official-0.3.46','r520-official-0.3.47');
css+='\n/* r520 — full F1/UFC/WWE catalogs + fixed Home controls + sports team/league drill-down. */\n';
sw=sw.replaceAll('ct-media-r519','ct-media-r520').replaceAll('app-v519.js','app-v520.js').replaceAll('app-v519.css','app-v520.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.47',revision:'r520-official-0.3.47',base:'r519+r520-full-special-catalogs-home-controls-sports-drill',
 scope:'f1+ufc+wwe-full-catalogs+fixed-home-controls+movies-2x3+sports-team-league-drill',
 special_series:'F1, UFC and WWE PPV/PLE coexist; global totals come from full public catalogs and historical seasons hydrate on demand',
 f1:'Jolpica is the historical Grand Prix authority since 1950; mapped seasons preserve canonical session-level writer r462',
 ufc:'UFC restored as a special Series; each season syncs UFCStats + ESPN before canonical DB/TMDB merge',
 wwe_ppv:'WWE PPV/PLE seasons since 1985 hydrate from the WWE supercard catalog; personal state is reconciled by canonical event key',
 home:'global search plus Series/Movies are fixed at the top with pointer priority; movie Watchlist is forced to strict 2:3 176x264 desktop / 154x231 mobile',
 sports_drill:'clicking a team crest/name opens its last five games; clicking the league name opens the latest round/slate; watched toggles use cinetracker_sport_mark_watched_v1 and update sports stats/time',
 preserved:'Raw/SmackDown, Discover, Top 10, Pra Você, Profile, F1 Hub and Android 1.0.20/10062 remain outside scope'
});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v520.js'),js),writeFile(resolve(dist,'app-v520.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v519.js'),{force:true}),rm(resolve(dist,'app-v519.css'),{force:true})]);
for(const need of [
 "window.__ctR520Marker='f1+ufc+wwe-full-catalogs+fixed-home-controls+movies-2x3+sports-drill'",
 "window.__ctR512Marker='r520-f1+ufc+wwe-canonical-special-owner+full-season-catalogs'",
 "window.__ctR513SeriesScreenMarker='r520-three-special-series+full-catalog-season-screen+optimistic-watch'",
 'ct-wwe-ppv-series-sync','ct-ufc-series-sync','cinetracker_special_series_progress_v520','cinetracker_wwe_ppv_status_by_keys_v520',
 'cinetracker_sport_entity_recent_v520','cinetracker_sport_competition_latest_round_v520','ct520-home-controls-style','ct520-sports-drill-style','r520-official-0.3.47'
])if(!js.includes(need))throw new Error('r520 missing '+need);
if(js.includes("window.__ctR519Marker='wwe-ppv-special-series+ufc-ui-retired+f1-preserved'"))throw new Error('r520 old final marker survived');
console.log('WEB_R520_READY full catalogs + fixed Home + sports drill');