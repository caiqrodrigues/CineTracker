import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r283-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v283.js'),'utf8'),readFile(resolve(dist,'app-v283.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r284-stable-imported-detail.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r284 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r284 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r284 missing '+x)};
for(const x of["window.__ctR284='stable-home-episodes+imported-covers+episode-watch+f1-season-switch';","window.__ctR284Home='fresh-before-episode-meta+no-stale-flash';","window.__ctR284Imported='formula1+superbowl-covers+watch-actions';","window.__ctR284F1='race-safe-season-switch';",'ct275ReconcileOne=async function(row)','ct276EpisodeCard=function(row)','async function ct284Mark(btn)','async function ct284RenderF1(st,year)'])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.74';window.__ctOfficialVersion='1.0.74';","window.__ctWebBuild='1.0.75';window.__ctOfficialVersion='1.0.75';",'version');
js=once(js,"const REVISION='r283-official-1.0.74';","const REVISION='r284-official-1.0.75';",'revision');
must(js,"window.__ctR283='history-action-isolation+fresh-availability+legacy-frontier-next'");
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.75 r284 — imported-series covers, local season/episode rails. */
[data-home] .ct284-cover{position:relative!important;background-image:linear-gradient(145deg,#081527,#15355b)!important;overflow:hidden!important}
[data-home] .ct284-cover::after{position:absolute;inset:0;display:grid;place-items:center;font-size:12px;font-weight:900;letter-spacing:.08em;color:#fff;text-shadow:0 1px 6px #000;content:'SERIES'}
[data-home] .ct284-cover-f1::after{content:'FORMULA 1'}[data-home] .ct284-cover-superbowl::after{content:'SUPER BOWL'}
.ct284-hero{display:flex;align-items:stretch;gap:20px}.ct284-poster{width:160px;min-width:160px;aspect-ratio:2/3;border-radius:16px;display:flex;flex-direction:column;justify-content:flex-end;padding:16px;box-sizing:border-box;background:radial-gradient(circle at 75% 20%,rgba(255,255,255,.22),transparent 25%),linear-gradient(145deg,#07111f,#17375e);overflow:hidden}.ct284-poster span{font-size:44px;font-weight:1000;line-height:1}.ct284-poster b{font-size:13px;margin-top:8px}.ct284-poster-superbowl{background:radial-gradient(circle at 25% 20%,rgba(255,255,255,.2),transparent 25%),linear-gradient(145deg,#0a1729,#234d78)}.ct284-live{display:inline-flex;margin-top:10px;color:#6ee7b7}.ct284-season-rail,.ct284-episode-list{display:flex;flex-wrap:nowrap;gap:10px;overflow-x:auto;overflow-y:hidden;max-width:100%;padding-bottom:8px;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y}.ct284-season-rail .chip{flex:0 0 auto}.ct284-episode{display:flex;flex-direction:column;flex:0 0 230px;min-height:142px;padding:12px;border:1px solid rgba(148,163,184,.18);border-radius:14px;background:rgba(15,23,42,.58);box-sizing:border-box;white-space:normal}.ct284-episode small,.ct284-episode span,.ct284-episode em{font-size:11px;color:#94a3b8}.ct284-episode>b{margin:6px 0}.ct284-episode>div{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto}.ct284-watch{width:34px;height:34px;border-radius:10px;border:1px solid rgba(52,211,153,.35);background:rgba(16,185,129,.14);color:#6ee7b7;font-weight:900;cursor:pointer}.ct284-episode.watched{border-color:rgba(52,211,153,.28)}
@media(max-width:700px){.ct284-hero{gap:14px}.ct284-poster{width:112px;min-width:112px}.ct284-poster span{font-size:32px}.ct284-episode{flex-basis:210px}}
`;
html=html.replaceAll('app-v283.js','app-v284.js').replaceAll('app-v283.css','app-v284.css').replaceAll('CineTracker • v1.0.74','CineTracker • v1.0.75');
sw=sw.replaceAll('ct-web-1.0.74-r283','ct-web-1.0.75-r284').replaceAll('app-v283.js','app-v284.js').replaceAll('app-v283.css','app-v284.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.75',revision:'r284-official-1.0.75',base:'r283-production',home_episode_state:'fresh-canonical-stable',home_episode_stale_flash_blocked:true,imported_series_covers:['formula_1','super_bowl','stuart'],imported_series_episode_watch_actions:true,formula_1_season_switch:true,formula_1_season_race_guard:true,super_bowl_season_switch:true,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v284.js'),js),writeFile(resolve(dist,'app-v284.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v283.js'),{force:true}),rm(resolve(dist,'app-v283.css'),{force:true})]);
console.log('WEB_R284_READY home=stable imported=covers+watch f1=season-switch');
