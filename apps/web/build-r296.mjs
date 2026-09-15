import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r295-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch,polish]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v295.js'),'utf8'),
 readFile(resolve(dist,'app-v295.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r296-recommendations-sports-stadium.js'),'utf8'),
 readFile(resolve(root,'r296-web-polish.css'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r296 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r296 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r296 missing '+x)};
for(const x of[
 "window.__ctR296='strict-foryou-four-sports-stadium-web-polish';",
 "window.__ctR296ForYou='score-7.5+year-1990+genre+wwe+seven-day+exact-slots+zero-duplicates';",
 "window.__ctR296Sports='today+72h+favorites+watched+stadium';",
 "cinetracker_shown_recommendations_recent_v296",
 "cinetracker_shown_recommendations_record_v296",
 "cinetracker_sports_watch_set_v296",
 "cinetracker_sports_watch_history_v296",
 "cinetracker_sports_stadium_summary_v296",
 "🏟️ No Estádio",
 "Jogos no Estádio"
])must(patch,x);
for(const x of[".ct296-watch-popover",".ct296-stadium-badge","[data-home] .ct264-watch-btn","[data-profile] .stat","[data-settings] input",".sidebar"])must(polish,x);
must(js,"window.__ctR295='discover-personal-authority-calendar-daily-actions';");
js=once(js,"window.__ctWebBuild='1.0.86';window.__ctOfficialVersion='1.0.86';","window.__ctWebBuild='1.0.87';window.__ctOfficialVersion='1.0.87';",'version');
js=once(js,"const REVISION='r295-official-1.0.86';","const REVISION='r296-official-1.0.87';",'revision');
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=`\n${polish}\n`;
html=html.replaceAll('app-v295.js','app-v296.js').replaceAll('app-v295.css','app-v296.css').replaceAll('CineTracker • v1.0.86','CineTracker • v1.0.87');
sw=sw.replaceAll('ct-web-1.0.86-r295','ct-web-1.0.87-r296').replaceAll('app-v295.js','app-v296.js').replaceAll('app-v295.css','app-v296.css');
const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.87',
 revision:'r296-official-1.0.87',
 base:'r295-production',
 scope:'strict-foryou-four-sports-stadium-polish-web-only',
 discover_foryou_rules:'tmdb>=7.5+year>1990+no-pure-drama-documentary+no-wwe',
 discover_foryou_repeat_window:'7-days-shown_recommendations+local-fallback',
 discover_foryou_structure:'daily-movie+watchlist-movie-series-anime+fresh-movie-series-anime+zero-duplicates',
 sports_tabs:'next-today+previous-72h+favorites+watched',
 sports_attendance:'attended_in_person+stadium_name+profile-total',
 web_polish:'home+profile+settings+sidebar',
 android:'1.0.20/10062'
};
await Promise.all([
 writeFile(resolve(dist,'app-v296.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v296.css'),css,'utf8'),
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v295.js'),{force:true}),rm(resolve(dist,'app-v295.css'),{force:true})]);
console.log('WEB_R296_READY strict For You + four-tab Sports + stadium attendance + restrained Web polish; Android preserved');
