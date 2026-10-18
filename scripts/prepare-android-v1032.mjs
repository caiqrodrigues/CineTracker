import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1031.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r273-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<=a)throw Error('Android 1.0.32 requires LOGIN-WORKING v1.0.31 base');
let js=html.slice(a+marker.length,b);
const once=(from,to,label)=>{const count=js.split(from).length-1;if(count!==1)throw Error('r274 '+label+' must match once, got '+count);js=js.replace(from,to)};
/* Modify the candidate count ONLY in the r263 Pra Voce post-audit owner. Neither
   audit263 nor Top10 / other Discover tabs are modified. Server filtering
   and TMDB runtime/origin validation remain fully enabled. */
const from='try{const baseLoadForYou263=ct186LoadForYou;ct186LoadForYou=async function(force=false){';
const to='try{const baseDiscoverRows263=discoverRows;';
const start=js.indexOf(from),end=start<0?-1:js.indexOf(to,start+from.length);
if(start<0||end<=start)throw Error('r274 isolated 7-slot audit owner was not found');
const audit=js.slice(start,end);
if((audit.match(/'fresh',45/g)||[]).length!==3||(audit.match(/'watchlist',30/g)||[]).length!==3)
 throw Error('r274 audit expectations changed');
js=js.slice(0,start)+audit.replaceAll("'fresh',45","'fresh',12").replaceAll("'watchlist',30","'watchlist',8")+js.slice(end);
once('const CT186_CONTEXT_TTL=15000;','const CT186_CONTEXT_TTL=60000;','fast audited Pra Você context TTL');
once("const REVISION='r273-android-official-1.0.31';","const REVISION='r274-android-official-1.0.32';",'revision');
once("window.__ctWebBuild='1.0.31';window.__ctOfficialVersion='1.0.31';window.__ctAndroidOfficialVersion='1.0.31';window.__ctAndroidOfficialCode=10073;",
 "window.__ctWebBuild='1.0.32';window.__ctOfficialVersion='1.0.32';window.__ctAndroidOfficialVersion='1.0.32';window.__ctAndroidOfficialCode=10074;",'version code');
js=js.replaceAll('CineTracker • v1.0.31','CineTracker • v1.0.32')
 .replaceAll("JSON.stringify({version:'1.0.31',revision:REVISION","JSON.stringify({version:'1.0.32',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.31'","window.__ctAndroidRelease='1.0.32'");
const patch=await readFile(resolve(root,'apps/android/runtime-r274-v1032-foryou-only.js'),'utf8');
for(const term of ['__ctR274AndroidV1032','ct186FreshPools=async function','__ct274AuditedSnapshot','ct274-foryou-only','data-ct274-seen','__ctR274StartupError'])
 if(!patch.includes(term))throw Error('r274 missing one of seven-slot scoped improvements: '+term);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(bad))throw Error('r274 forbidden full-reload / observer operation '+bad);
if(!js.includes('\nboot();'))throw Error('r274 missing boot insertion point');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r274-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1031','ct-android-v1032').replaceAll('content="1.0.31"','content="1.0.32"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_32_READY ONLY_D​ISCOVER_FORYOU full 1.0.31 base + strict audited seven slots + no-overlap card actions + fast cached first paint');
