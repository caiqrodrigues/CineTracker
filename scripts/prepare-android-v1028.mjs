import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1027.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r269-android-js">';
const a=html.indexOf(tag),b=html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Android r270 requires r269 exact shell');
let js=html.slice(a+tag.length,b);
function once(oldText,newText,label){
 const n=js.split(oldText).length-1;
 if(n!==1)throw Error('r270 '+label+' expected one anchor, found '+n);
 js=js.replace(oldText,newText);
}
function between(start,end,fn,label){
 const a=js.indexOf(start),b=js.indexOf(end,a+start.length);
 if(a<0||b<=a||js.indexOf(start,a+1)>=0)throw Error('r270 '+label+' region missing/ambiguous');
 const current=js.slice(a,b),replacement=fn(current);
 if(replacement===current)throw Error('r270 '+label+' not changed');
 js=js.slice(0,a)+replacement+js.slice(b);
}
between('async function ct186FreshPools(c){','function ct186WatchPools(c){',s=>{
 const n=(s.match(/,6\)/g)||[]).length;
 if(n!==3)throw Error('r270 movie/tv/anime initial pool count '+n);
 return s.replace(/,6\)/g,',2)');
},'initial movie/tv/anime requests');
between('async function ct186PopularPool(kind,c){','function ct186Hash(s){',s=>{
 const n=(s.match(/,6\)/g)||[]).length;
 if(n!==3)throw Error('r270 fallback pool count '+n);
 return s.replace(/,6\)/g,',2)');
},'bounded missing-category fallback');
once("const REVISION='r269-android-official-1.0.27';","const REVISION='r270-android-official-1.0.28';",'revision');
once("window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';window.__ctAndroidOfficialVersion='1.0.27';window.__ctAndroidOfficialCode=10069;",
 "window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';window.__ctAndroidOfficialVersion='1.0.28';window.__ctAndroidOfficialCode=10070;",'version');
js=js.replaceAll('CineTracker • v1.0.27','CineTracker • v1.0.28')
 .replaceAll("JSON.stringify({version:'1.0.27',revision:REVISION","JSON.stringify({version:'1.0.28',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.27'","window.__ctAndroidRelease='1.0.28'");
const patch=await readFile(resolve(root,'apps/android/runtime-r270-v1028-corrections.js'),'utf8');
for(const value of ['__ctR270AndroidV1028','markSportWatched159=async function','cinetracker_android_movie_history_v1028','ct163PreloadAll=function','IntersectionObserver','lazyPosterHtml270'])if(!patch.includes(value))throw Error('r270 feature missing '+value);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver','location.assign('])if(patch.includes(bad))throw Error('r270 forbidden behavior '+bad);
if(!js.includes('\nboot();'))throw Error('r270 boot point not found');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r270-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1027','ct-android-v1028').replaceAll('content="1.0.27"','content="1.0.28"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_28_READY movie-history-450+no-refresh-sports+faster-strict-foryou+lazy-posters');