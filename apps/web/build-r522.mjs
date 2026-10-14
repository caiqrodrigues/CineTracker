import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r521.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,sports,specialOpen,finalRuntime,retired]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v521.js'),'utf8'),readFile(resolve(dist,'app-v521.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r522-sports-only.js'),'utf8'),readFile(resolve(root,'runtime-r522-special-open.js'),'utf8'),
 readFile(resolve(root,'runtime-r522-final.js'),'utf8'),readFile(resolve(root,'runtime-r522-home-retired.js'),'utf8')
]);
function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r522 missing '+label);
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r522 invalid '+label);return{start,end:close+6}
}
function replaceKnownRuntime(source,header,anchor,replacement,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r522 missing '+label+' marker');
 const start=source.lastIndexOf(header,at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r522 invalid '+label+' boundary');
 return source.slice(0,start)+replacement.trim()+'\n'+source.slice(close+6)
}
js=replaceKnownRuntime(js,"/* CineTracker Web 0.3.47 r520 — sticky Home chrome + team/league sports detail. */","window.__ctR520HomeSportsMarker='sticky-search+tabs+deterministic-movies+team-last5+league-latest-round'",sports,'r520 Home/Sports');
js=replaceKnownRuntime(js,"/* CineTracker Web 0.3.48 r521 — same-row Home controls; r520 Sports drilldown preserved. */","window.__ctR521HomeSportsMarker='same-row-search+tabs+no-click-leak+sports-r520-preserved'",retired,'r521 Home owner');
for(const x of [sports,specialOpen,finalRuntime,retired])new Function(x);
js+='\n'+specialOpen.trim()+'\n'+finalRuntime.trim()+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r522-official-0.3.49';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.49 • ${REVISION}');
html=html.replaceAll('app-v521.js','app-v522.js').replaceAll('app-v521.css','app-v522.css').replaceAll('r521-official-0.3.48','r522-official-0.3.49').replaceAll('v0.3.48','v0.3.49');
css+='\n/* r522 - restore pre-r520 Home geometry. */\n';
css+='html body [data-page="home"] .search-global{position:relative!important;top:auto!important;left:auto!important;z-index:auto!important;margin-left:0!important;width:auto!important;max-width:none!important;background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important}\n';
css+='html body [data-home]>.home-tabs,html body [data-home] .home-tabs{position:static!important;top:auto!important;left:auto!important;z-index:auto!important;margin-left:0!important;max-width:none!important;background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}\n';
sw=sw.replaceAll('r521','r522').replaceAll('app-v521.js','app-v522.js').replaceAll('app-v521.css','app-v522.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.49',revision:'r522-official-0.3.49',base:'r521+r522-home-rollback-special-open',
 scope:'restore-r518-home-behavior+direct-f1-ufc-wwe-open+sports-detail-preserved',
 home:'r520/r521 fixed Home ownership removed; inherited r518/r519 Home Series/Movies owners remain authoritative',
 special_series:'F1, UFC and WWE PPV retain r521 catalogs and use a final pointerup/click/keyboard opener before generic media-card handlers',
 sports:'r520 team/league drilldown preserved without owning Home controls',
 profile:'unchanged',discover:'unchanged',raw_smackdown:'unchanged',android:'unchanged-1.0.20/10062'
});
await Promise.all([writeFile(resolve(dist,'app-v522.js'),js),writeFile(resolve(dist,'app-v522.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v521.js'),{force:true}),rm(resolve(dist,'app-v521.css'),{force:true})]);
for(const need of [
 "window.__ctR522SportsMarker='sports-only-no-home-interception'",
 "window.__ctR522SpecialOpenMarker='pointerup-owner-f1-ufc-wwe'",
 "window.__ctR522Marker='home-r518-restored+three-special-open+sports-preserved'",
 "window.__ctR521HomeRetired='r522-native-home-restored'",
 "window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'",
 'r522-official-0.3.49'
])if(!js.includes(need))throw new Error('r522 missing '+need);
for(const bad of [
 "window.__ctR520HomeSportsMarker='sticky-search+tabs+deterministic-movies+team-last5+league-latest-round'",
 "window.__ctR521HomeSportsMarker='same-row-search+tabs+no-click-leak+sports-r520-preserved'"
])if(js.includes(bad))throw new Error('r522 legacy Home owner survived: '+bad);
new Function(js);
console.log('WEB_R522_READY native Home + three special open');
