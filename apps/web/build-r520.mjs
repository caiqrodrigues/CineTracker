import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r519.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,catalog,special,screen,summary,homeSports,finalRuntime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v519.js'),'utf8'),
 readFile(resolve(dist,'app-v519.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r520-catalog.js'),'utf8'),
 readFile(resolve(root,'runtime-r520-special.js'),'utf8'),
 readFile(resolve(root,'runtime-r520-series-screen.js'),'utf8'),
 readFile(resolve(root,'runtime-r520-summary.js'),'utf8'),
 readFile(resolve(root,'runtime-r520-home-sports.js'),'utf8'),
 readFile(resolve(root,'runtime-r520-final.js'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r520 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r520 invalid '+label+' bounds');
 return{start,end:close+6};
}
function replaceRuntime(source,anchor,replacement,label){
 const b=bounds(source,anchor,label);return source.slice(0,b.start)+replacement.trim()+source.slice(b.end)
}
function replaceKnownRuntime(source,startNeedle,anchor,replacement,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r520 missing '+label+' anchor');
 const start=source.lastIndexOf(startNeedle,at);if(start<0)throw new Error('r520 missing '+label+' start');
 const close=source.indexOf('\n})();',at);if(close<0)throw new Error('r520 missing '+label+' close');
 return source.slice(0,start)+replacement.trim()+'\n'+source.slice(close+6)
}

js=replaceRuntime(js,"window.__ctR512Marker='r519-f1+wwe-ppv-single-special-owner+ufc-retired';",catalog+'\n'+special,'r512 special owner');
try{new Function(js)}catch(e){throw new Error('r520 syntax after r512: '+e.message)}
js=replaceKnownRuntime(js,"/* CineTracker r519 — single full-screen owner for F1 + WWE Pay-Per-View. */\n(()=>{","window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch';",screen,'r513 series screen');
try{new Function(js)}catch(e){throw new Error('r520 syntax after r513: '+e.message)}
js=replaceKnownRuntime(js,"(()=>{\n'use strict';\nconst core=()=>window.__ctCoreR471||null;\nlet summary=null,task=null;\nconst cacheKey='ct519:special-summary';","window.__ctR516SpecialSummary={version:'0.3.46'",summary,'r516 summary');
try{new Function(js)}catch(e){throw new Error('r520 syntax after r516: '+e.message)}
js=replaceKnownRuntime(js,"/* CineTracker Web 0.3.46 r519 — WWE PPV/PLE replaces mistaken UFC special-series UI. */\n(()=>{","window.__ctR519Marker='wwe-ppv-special-series+ufc-ui-retired+f1-preserved';",finalRuntime,'r519 final retirement');
try{new Function(js)}catch(e){throw new Error('r520 syntax after r519: '+e.message)}

for(const runtime of [catalog,special,screen,summary,homeSports,finalRuntime])new Function(runtime);
js+='\n'+homeSports+'\n';

js=js.replace(/const REVISION='[^']+';/,"const REVISION='r520-official-0.3.47';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.47 • ${REVISION}');
html=html.replaceAll('app-v519.js','app-v520.js').replaceAll('app-v519.css','app-v520.css').replaceAll('r519-official-0.3.46','r520-official-0.3.47').replaceAll('v0.3.46','v0.3.47');

css+='\n/* CineTracker Web 0.3.47 r520 — sticky Home + sports details. */\n'
 +'html body [data-page="home"] .search-global{position:sticky!important;top:8px!important;z-index:160!important;margin-bottom:10px!important;background:rgba(3,10,15,.97)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important;box-shadow:0 8px 20px rgba(0,0,0,.24)!important}\n'
 +'html body [data-home]>.home-tabs,html body [data-home] .home-tabs{position:fixed!important;top:var(--ct520-tabs-top,58px)!important;left:var(--ct520-tabs-left,var(--ct505-tabs-left,164px))!important;z-index:155!important;pointer-events:auto!important;background:rgba(3,10,15,.97)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important}\n'
 +'html body [data-home] .home-tabs [data-home-tab]{pointer-events:auto!important;touch-action:manipulation!important;user-select:none!important}\n'
 +'html body [data-page="home"] [data-global-results],html body [data-page="home"] .global-results{z-index:170!important}\n'
 +'html body .ct255-sport-card .ct255-match>div:has(img),html body .ct255-sport-card .ct255-sport-top span{cursor:pointer!important}.ct255-sport-card .ct255-match>div:has(img):hover strong,.ct255-sport-card .ct255-sport-top span:hover{text-decoration:underline!important}\n'
 +'html.ct520-detail-open{overflow:hidden!important}.ct520-detail-backdrop{position:fixed;inset:0;z-index:10120;background:rgba(0,0,0,.76);backdrop-filter:blur(12px);display:grid;place-items:center;padding:18px}.ct520-detail-dialog{width:min(980px,96vw);max-height:92vh;overflow:auto;border:1px solid rgba(110,202,255,.22);border-radius:20px;background:#07131bf7;box-shadow:0 28px 90px rgba(0,0,0,.62);padding:16px}.ct520-detail-dialog>header{position:sticky;top:-16px;z-index:3;display:flex;justify-content:space-between;align-items:center;gap:14px;background:#07131bf7;padding:16px 0 12px}.ct520-detail-dialog>header>div{display:flex;align-items:center;gap:12px}.ct520-detail-dialog>header img{width:48px;height:48px;object-fit:contain}.ct520-detail-dialog h2{margin:2px 0 0}.ct520-detail-dialog small{color:#7f9aaa}.ct520-detail-list{display:grid;gap:9px}.ct520-detail-event{border:1px solid #203f52;background:#091821;border-radius:14px;padding:11px}.ct520-detail-league{display:flex;align-items:center;gap:7px;color:#8aabbc;font-size:10px}.ct520-detail-league img{width:22px;height:22px;object-fit:contain}.ct520-detail-league small{margin-left:auto}.ct520-detail-match{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:10px;align-items:center;margin:10px 0}.ct520-detail-match>div{text-align:center;min-width:0}.ct520-detail-match img{width:46px;height:46px;object-fit:contain;display:block;margin:0 auto 5px}.ct520-detail-match b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct520-detail-match strong{font-size:18px}.ct520-detail-watch{width:100%}.ct520-detail-watch.on{opacity:.8}\n'
 +'@media(max-width:700px){html body [data-page="home"] .search-global{top:6px!important}html body [data-home]>.home-tabs,html body [data-home] .home-tabs{left:11px!important;top:var(--ct520-tabs-top,56px)!important;max-width:calc(100vw - 22px)!important}.ct520-detail-backdrop{padding:7px}.ct520-detail-dialog{width:100%;max-height:96vh;border-radius:16px;padding:12px}.ct520-detail-dialog>header{top:-12px;padding:12px 0 10px}}\n';

sw=sw.replaceAll('r519','r520').replaceAll('app-v519.js','app-v520.js').replaceAll('app-v519.css','app-v520.css');
const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.47',
 revision:'r520-official-0.3.47',
 base:'r519+r520-scoped-special-sports-home',
 scope:'f1+ufc+wwe-complete-catalog+sticky-home+deterministic-movies+sports-team-league',
 special_series:'F1, UFC and WWE Pay-Per-View coexist; all-time totals come from Jolpica, UFCStats and WWE supercards; season views use canonical remote catalogs plus existing watched writers',
 home:'global search remains sticky; Series/Movies controls remain fixed under search; movie intent is applied on pointerdown and old Home rendering remains otherwise untouched',
 sports:'team crest opens last five completed games; league name opens latest round; detail watch/unwatch writes through cinetracker_sport_mark_watched_v1 and emits the canonical sports change event',
 profile:'unchanged',discover:'unchanged',raw_smackdown:'unchanged',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v520.js'),js),
 writeFile(resolve(dist,'app-v520.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v519.js'),{force:true}),rm(resolve(dist,'app-v519.css'),{force:true})]);

for(const need of [
 "window.__ctR520CatalogMarker='jolpica+ufcstats+wikipedia-three-special-series'",
 "window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner'",
 "window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'",
 "window.__ctR520HomeSportsMarker='sticky-search+tabs+deterministic-movies+team-last5+league-latest-round'",
 "window.__ctR520Marker='f1+ufc+wwe-complete+sticky-home+sports-team-league'",
 'cinetracker_sports_team_recent_v520',
 'cinetracker_sports_league_latest_round_v520',
 'cinetracker_sport_mark_watched_v1',
 'ct-special-series-summary',
 'r520-official-0.3.47'
])if(!js.includes(need))throw new Error('r520 missing '+need);

if(js.includes("window.__ctR519Marker='wwe-ppv-special-series+ufc-ui-retired+f1-preserved'"))throw new Error('r519 UFC retirement survived');
new Function(js);
console.log('WEB_R520_READY three special series + Home sticky + sports detail');
