import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r296.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v296.js','app-v296.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r296 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.87';window.__ctOfficialVersion='1.0.87';",
 "const REVISION='r296-official-1.0.87';",
 "window.__ctR295='discover-personal-authority-calendar-daily-actions'",
 "window.__ctR296='strict-foryou-four-sports-stadium-web-polish'",
 "score-7.5+year-1990+genre+wwe+seven-day+exact-slots+zero-duplicates",
 "today+72h+favorites+watched+stadium",
 "cinetracker_sports_watch_set_v296"
])must(js,x);
for(const x of['app-v296.js','app-v296.css'])must(html,x);
for(const x of['.ct296-watch-popover','.ct296-stadium-badge','[data-home] .ct264-watch-btn','[data-settings] input'])must(css,x);
const m=JSON.parse(release);
if(m.version!=='1.0.87'||m.revision!=='r296-official-1.0.87'||m.discover_foryou_repeat_window!=='7-days-shown_recommendations+local-fallback'||m.sports_tabs!=='next-today+previous-72h+favorites+watched'||m.sports_attendance!=='attended_in_person+stadium_name+profile-total'||m.android!=='1.0.20/10062')throw new Error('r296 release identity');
must(sw,"const CACHE='ct-web-1.0.87-r296';");
console.log('WEB_1_0_87_OFFICIAL_OK r296 strict recommendations + Sports stadium + visual polish; Android preserved');
