import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r300-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v300.js'),'utf8'),readFile(resolve(dist,'app-v300.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r301-profile-sports-f1-order.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r301 missing '+x)};
for(const x of["window.__ctWebBuild='1.0.91';window.__ctOfficialVersion='1.0.91';","const REVISION='r300-official-1.0.91';","window.__ctR300='discover-bounded-recovery+four-sports-tabs+watchlist-stat-style'",'window.__ctR298ForYou'])must(js,x);
for(const x of["window.__ctR301='f1-calendar-interactive+sports-next-wide+discover-fast-1-3-3+profile-stable'","window.__ctR301F1='no-drivers-tab+calendar-detail+canonical-watch'","window.__ctR301Sports='f1-first+next-120d+four-tabs'","window.__ctR301Discover='fast-exact-1+3+3+stable-watchlist-actions'","window.__ctR301Profile='stable-stats+watchlist-match-stadium-style'",'buildForYou301','f1CalendarHtml301','cinetracker_sports_watch_set_v296','120*86400000'])must(runtime,x);
if(!js.includes('\nboot();'))throw new Error('r301 boot insertion missing');
js=js.replace("window.__ctWebBuild='1.0.91';window.__ctOfficialVersion='1.0.91';","window.__ctWebBuild='1.0.92';window.__ctOfficialVersion='1.0.92';")
 .replace("const REVISION='r300-official-1.0.91';","const REVISION='r301-official-1.0.92';")
 .replace('\nboot();','\n'+runtime+'\nboot();');
css+=String.raw`
/* CineTracker Web 1.0.92 r301 — interactive F1 calendar, stable Profile and fast exact Pra Você. */
.ct301-f1-calendar{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}.ct301-f1-event{appearance:none;text-align:left;border:1px solid var(--border,#2a2a2a);background:var(--panel,#151515);color:inherit;border-radius:14px;padding:12px;display:grid;gap:5px;cursor:pointer;min-width:0}.ct301-f1-event:hover{transform:translateY(-1px)}.ct301-f1-event.watched{outline:1px solid currentColor}.ct301-f1-event span,.ct301-f1-event small,.ct301-f1-event em{opacity:.78;font-style:normal}.ct301-f1-event em{margin-top:4px;font-weight:700}.ct301-f1-modal-backdrop{position:fixed;inset:0;z-index:10050;background:rgba(0,0,0,.72);display:grid;place-items:center;padding:18px}.ct301-f1-modal{width:min(560px,100%);max-height:min(760px,92vh);overflow:auto;background:var(--panel,#141414);border:1px solid var(--border,#303030);border-radius:18px;padding:18px;box-shadow:0 24px 80px rgba(0,0,0,.45)}.ct301-f1-modal header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.ct301-f1-modal header button{border:0;background:transparent;color:inherit;font-size:28px;cursor:pointer}.ct301-f1-modal-body{display:grid;gap:8px;margin:16px 0}.ct301-f1-modal-body p{margin:0}.ct301-f1-modal footer{display:flex;justify-content:flex-end}.ct301-f1-upcoming{opacity:.75;font-size:.9rem}.ct301-fy-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.ct301-daily-card{max-width:240px}.ct301-watchlist-stat svg,.ct301-watchlist-stat img,.ct301-watchlist-stat .icon,.ct301-watchlist-stat [data-icon]{display:none!important}@media(max-width:720px){.ct301-f1-calendar{grid-template-columns:1fr}.ct301-fy-grid{grid-template-columns:repeat(3,minmax(150px,1fr));overflow-x:auto}.ct301-f1-modal-backdrop{padding:10px}}
`;
html=html.replaceAll('app-v300.js','app-v301.js').replaceAll('app-v300.css','app-v301.css').replaceAll('CineTracker • v1.0.91','CineTracker • v1.0.92');
sw=sw.replaceAll('ct-web-1.0.91-r300','ct-web-1.0.92-r301').replaceAll('app-v300.js','app-v301.js').replaceAll('app-v300.css','app-v301.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.92',revision:'r301-official-1.0.92',base:'r300-production',scope:'f1-calendar-sports-next-discover-fast-profile-stable-web-only',sports_tabs:'next+previous+watched+favorites',sports_next_days:120,f1_drivers_tab:false,f1_calendar_interactive:true,f1_watch_profile_sync:true,discover_for_you:'1+3+3',discover_fast_pipeline:true,discover_watchlist_action_stable:true,profile_stats_stable:true,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v301.js'),js),writeFile(resolve(dist,'app-v301.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v300.js'),{force:true}),rm(resolve(dist,'app-v300.css'),{force:true})]);
console.log('WEB_R301_READY F1 calendar interactive + Sports next 120d + fast exact Pra Você + stable Profile; Android preserved');
