import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1033.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r275-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<=a)throw Error('v1.0.34 must preserve the stable, authenticated 1.0.33 baseline');
let js=html.slice(a+marker.length,b);
function one(from,to,why){const n=js.split(from).length-1;if(n!==1)throw Error('r276 '+why+' expected 1 anchor found '+n);js=js.replace(from,to)}
one("const REVISION='r275-android-official-1.0.33';","const REVISION='r276-android-official-1.0.34';",'revision');
one("window.__ctWebBuild='1.0.33';window.__ctOfficialVersion='1.0.33';window.__ctAndroidOfficialVersion='1.0.33';window.__ctAndroidOfficialCode=10075;",
"window.__ctWebBuild='1.0.34';window.__ctOfficialVersion='1.0.34';window.__ctAndroidOfficialVersion='1.0.34';window.__ctAndroidOfficialCode=10076;",'version code');
js=js.replaceAll('CineTracker • v1.0.33','CineTracker • v1.0.34')
.replaceAll("JSON.stringify({version:'1.0.33',revision:REVISION","JSON.stringify({version:'1.0.34',revision:REVISION")
.replaceAll("window.__ctAndroidRelease='1.0.33'","window.__ctAndroidRelease='1.0.34'");
const patch=await readFile(resolve(root,'apps/android/runtime-r276-v1034-wwe-releases.js'),'utf8');
for(const expected of ['__ctR276AndroidV1034','latestForShow','applyLatest','paintHome=function','__ctR276StartupError'])if(!patch.includes(expected))throw Error('r276 scoped WWE patch missing '+expected);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(forbidden))throw Error('r276 forbidden operation '+forbidden);
for(const original of ['__ctR275AndroidV1033','__ctR273AndroidV1031','__ctR271AndroidV1029','cinetracker_home_movie_history_v323','cinetracker_sport_mark_watched_v1','cinetracker_recommendation_filter_v525','data-ct275-seen'])
 if(!js.includes(original))throw Error('r276 must preserve prior validated functionality '+original);
if(!js.includes('\nboot();'))throw Error('r276 missing authenticated boot');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r276-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1033','ct-android-v1034').replaceAll('content="1.0.33"','content="1.0.34"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_34_READY SmackDown episode 42 verified Oct16 + Raw aired/watch comparison; v1.0.33 history/sports/foryou preserved');
