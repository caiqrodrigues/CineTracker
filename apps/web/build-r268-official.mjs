import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r268.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v268.js','app-v268.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r268 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.59';window.__ctOfficialVersion='1.0.59';",
 "const REVISION='r268-official-1.0.59';",
 "window.__ctR268='home-history-authority+inline-right-watch'",
 "window.__ctR268Home='canonical-history+same-row-right-watch'",
 "window.__ctR268Frozen='discover+detail+sports+android-r267-preserved'",
 'CT268_HOME_FIX_START','CT268_HOME_FIX_END','__ctHistoryAuthoritative=false','__ctFastHomeCache=true','__ctHistoryAuthoritative=true',
 "window.__ctR267Discover='atomic-tabs+recursive-personal-exclusions'",
 "window.__ctR267Detail='r169-rich-producer-local-x'",
 "window.__ctR267Sports='r266-stable-preserved'",
 'cinetracker_profile_home_payload_v0997_r5','cinetracker_mark_watch_v0994'
])must(js,x);
const falseCount=(js.match(/__ctHistoryAuthoritative=false/g)||[]).length;if(falseCount<2)throw new Error('r268 must mark both fast Home caches non-authoritative');
for(const x of['[data-home] .media-row.ct266-home-watch-host{position:relative!important;padding-right:48px!important}','[data-home] .media-row.ct266-home-watch-host>.ct266-watch-action{position:absolute!important;right:10px!important'])must(css,x);
if(js.includes('ct265AfterF1Paint')||js.includes('ct266AfterF1Paint')||js.includes('ct267AfterF1Paint')||js.includes('ct268AfterF1Paint'))throw new Error('r268 contains forbidden Sports callback');
must(html,'app-v268.js');must(html,'app-v268.css');if(/app-v267\.(?:js|css)/.test(html))throw new Error('r268 html references r267 assets');
must(release,'"version": "1.0.59"');must(release,'"revision": "r268-official-1.0.59"');must(release,'"home_history_authority": true');must(release,'"home_watch_inline_right": true');must(release,'"android": "1.0.20/10062"');
must(sw,"const CACHE='ct-web-1.0.59-r268';");must(sw,'app-v268.js');must(sw,'app-v268.css');
console.log('WEB_1_0_59_OFFICIAL_OK r268 canonical-history inline-right-watch');
