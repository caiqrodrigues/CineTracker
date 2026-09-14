import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v269.js','app-v269.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const ok=(cond,msg)=>{if(!cond)throw new Error('R269 regression: '+msg)};
const has=(s,x,msg=x)=>ok(s.includes(x),msg);
has(js,"window.__ctWebBuild='1.0.60';window.__ctOfficialVersion='1.0.60';",'version identity');
has(js,"const REVISION='r269-official-1.0.60';",'revision identity');
has(js,"window.__ctR269='video-history-r3+series-watch-inline'",'r269 marker');
has(js,"window.__ctR269Home='canonical-r3-history+orphan-watch-reparent'",'Home marker');
has(js,"rpc('cinetracker_home_live_v0997_r3'",'history uses canonical r3 source');
has(js,'homeCache.history_episodes=ct269State.history.episodes;homeCache.history_movies=ct269State.history.movies;','canonical history merged into Home cache');
has(js,'function ct269PaintHistory()','history DOM painter');
has(js,'function ct269RepairSeriesWatch()','series watch structural repair');
has(js,"if(el.matches?.('[data-ct266-watch],.ct266-watch-action,[aria-label*=\"assistido\" i],[title*=\"assistido\" i]'))return el;",'orphan watched action recognition');
has(js,"if(action.parentElement!==row)row.appendChild(action);",'watched action reparented into row');
has(js,"row.classList.add('ct269-inline-watch-host')",'row inline host marker');
has(css,'[data-home-view="series"] .media-row.ct269-inline-watch-host{position:relative!important;padding-right:52px!important','series row reserves right action space');
has(css,'>.ct269-inline-watch-action{position:absolute!important;right:12px!important','watch action anchored right');
has(css,'top:50%!important','watch action vertically centered');
has(css,'transform:translateY(-50%)!important','watch action center transform');
for(const x of[
 "window.__ctR268='home-history-authority+history-first+inline-right-watch'",
 "window.__ctR267Discover='atomic-tabs+recursive-personal-exclusions'",
 "window.__ctR267Detail='r169-rich-producer-local-x'",
 "window.__ctR267Sports='r266-stable-preserved'"
])has(js,x,'preserve '+x);
ok(!/ct26[5-9]AfterF1Paint/.test(js),'no forbidden Sports callback');
has(html,'app-v269.js','new JS asset');has(html,'app-v269.css','new CSS asset');ok(!html.includes('app-v268.js')&&!html.includes('app-v268.css'),'no r268 asset refs in HTML');
const meta=JSON.parse(release);ok(meta.version==='1.0.60'&&meta.revision==='r269-official-1.0.60','release identity');ok(meta.home_history_source==='cinetracker_home_live_v0997_r3'&&meta.home_history_restored===true&&meta.home_series_watch_inline===true,'release Home flags');ok(meta.discover==='r268-preserved'&&meta.detail==='r268-preserved'&&meta.sports==='r268-preserved','frozen Web surfaces');ok(meta.android==='1.0.20/10062','Android preserved');
has(sw,"const CACHE='ct-web-1.0.60-r269';",'service worker cache');has(sw,'app-v269.js','service worker JS');has(sw,'app-v269.css','service worker CSS');
console.log('R269_STATIC_OK canonical-r3-history orphan-watch-reparent frozen-surfaces-preserved');
