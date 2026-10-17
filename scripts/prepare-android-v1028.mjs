import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1027.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r269-android-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
if(start<0||end<=start)throw new Error('r270 requires compiled Android 1.0.27 baseline');
let js=html.slice(start+tag.length,end);
function once(a,b,label){const n=js.split(a).length-1;if(n!==1)throw new Error('r270 '+label+' expected 1 occurrence, found '+n);js=js.replace(a,b)}
function scope(a,b,fn,label){const from=js.indexOf(a),to=js.indexOf(b,from+a.length);if(from<0||to<=from||js.indexOf(a,from+1)>=0)throw Error('r270 scope '+label);
 js=js.slice(0,from)+fn(js.slice(from,to))+js.slice(to)}
// Shorter cache prevents a previous movie-history snapshot from masquerading as
// current information. Cached content still paints immediately if recent.
once("if(v&&Date.now()-Number(v.at||0)<1000*60*60*24*7)return v.data",
 "if(v&&Date.now()-Number(v.at||0)<(k==='home'?120000:k.startsWith('discover:foryou')?600000:k==='sports'?900000:1000*60*60*24))return v.data",
 'reduce Home and recommendation stale-cache lifetime');
// The r186 first render previously did 18 candidate TMDB pages and then up to
// 18 MORE reserve pages BEFORE painting. r267 already does extra pool refill
// asynchronously. Limit the first paint to 2 pages for each kind.
scope('async function ct186FreshPools(c){','function ct186WatchPools(c){',part=>{
 const hits=part.match(/,'(movie|tv)',6\)/g)||[];
 if(hits.length!==3)throw Error('r270 expected exactly 3 six-page first-paint pools; got '+hits.length);
 return part.replace(/,'(movie|tv)',6\)/g,",'$1',2)");
},'first-paint recommendations');
once("await Promise.all(['movie','series','anime'].filter(k=>need[k]).map(k=>ct186PopularPool(k,c).then(v=>{reserve[k]=v})));",
 "/* r270: do not block 7 first-paint slots on up to 18 more TMDB pages. The bounded r267 eligible refill runs after first paint. */",
 'remove blocking reserve from initial Pra Você render');
// r269 Top10 first page also issued 8 calls at once. Start with 2 parallel
// pages per media type, and load subsequent audited pages only if needed.
once("for(const numbers of [[1,2,3,4],[5,6,7,8],[9,10]])",
 "for(const numbers of [[1,2],[3,4],[5,6],[7,8],[9,10]])",
 'progressive Top10 pagination');
// Suppress the 10+ background prefetch requests that used to compete with
// foreground Home, Discover, Sports, and with TMDB artwork download.
once("function ct163WarmOnIdle(){if(!session)return;setTimeout(()=>{if(session)void ct163PreloadAll()},6500)}",
 "function ct163WarmOnIdle(){/* r270 foreground-first: tabs populate their own caches on first visit. */}",
 'remove competing global background RPC/TMDB preloading');
once("const REVISION='r269-android-official-1.0.27';","const REVISION='r270-android-official-1.0.28';",'revision');
once("window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';window.__ctAndroidOfficialVersion='1.0.27';window.__ctAndroidOfficialCode=10069;",
 "window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';window.__ctAndroidOfficialVersion='1.0.28';window.__ctAndroidOfficialCode=10070;",
 'version');
js=js.replaceAll('CineTracker • v1.0.27','CineTracker • v1.0.28')
 .replaceAll("JSON.stringify({version:'1.0.27',revision:REVISION","JSON.stringify({version:'1.0.28',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.27'","window.__ctAndroidRelease='1.0.28'");
const patch=await readFile(resolve(root,'apps/android/runtime-r270-v1028-home-discover-posters.js'),'utf8');
for(const tag of ['__ctR270AndroidV1028','mergeHistory','thumbToLazy','cinetracker_profile_media_dashboard_v0991','content-visibility:auto'])if(!patch.includes(tag))throw Error('r270 patch missing '+tag);
for(const banned of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(banned))throw Error('r270 prohibited '+banned);
if(!js.includes('\nboot();'))throw Error('r270 boot insertion missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,start)+'<script data-ct-android="r270-android-js">'+js+'</script>'+html.slice(end+'</script>'.length);
html=html.replaceAll('ct-android-v1027','ct-android-v1028').replaceAll('content="1.0.27"','content="1.0.28"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_28_READY home recent history plus dashboard reconcile; Lazy TMDB thumbnails; recommendation 6 first pages not 36; progressive Top10 and zero global competing preloads. Web r541 unchanged.');
