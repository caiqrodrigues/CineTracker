import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1032.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r274-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<=a)throw Error('1.0.33 requires tested 1.0.32 startup base');
let js=html.slice(a+marker.length,b);
function one(from,to,name){const n=js.split(from).length-1;if(n!==1)throw Error('r275 '+name+' anchor expected once, got '+n);js=js.replace(from,to);}
const older=await readFile(resolve(root,'apps/android/runtime-r274-v1032-foryou-only.js'),'utf8');
const newer=await readFile(resolve(root,'apps/android/runtime-r275-v1033-foryou-fixed.js'),'utf8');
one(older,newer,'replace original r274 Pra Você owner, not overlay another runtime');
one("const REVISION='r274-android-official-1.0.32';","const REVISION='r275-android-official-1.0.33';",'revision');
one("window.__ctWebBuild='1.0.32';window.__ctOfficialVersion='1.0.32';window.__ctAndroidOfficialVersion='1.0.32';window.__ctAndroidOfficialCode=10074;",
"window.__ctWebBuild='1.0.33';window.__ctOfficialVersion='1.0.33';window.__ctAndroidOfficialVersion='1.0.33';window.__ctAndroidOfficialCode=10075;",'version');
js=js.replaceAll('CineTracker • v1.0.32','CineTracker • v1.0.33')
 .replaceAll("JSON.stringify({version:'1.0.32',revision:REVISION","JSON.stringify({version:'1.0.33',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.32'","window.__ctAndroidRelease='1.0.33'");
for(const must of ['__ctR275AndroidV1033','ct275-foryou-only','data-ct275-seen','ct275Watchlist','cinetracker_recommendation_filter_v525','cinetracker_f1_watch_sync_v462'])
 if(!js.includes(must))throw Error('r275 release missing '+must);
for(const disallowed of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 if(newer.includes(disallowed))throw Error('r275 forbidden '+disallowed);
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r275-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1032','ct-android-v1033').replaceAll('content="1.0.32"','content="1.0.33"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_33_READY isolated Pra Você: full audit, working Watchlist seen + fresh Watchlist/Seen/Swap, post-swap UI, no overlap, snapshot cache. Other screens preserved.');
