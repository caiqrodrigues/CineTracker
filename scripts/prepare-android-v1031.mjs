import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
/* Bootstrap from the last login-working r271 / 1.0.29, NOT the broken r272.
   r272 was loaded as an independent IIFE and referenced private r271 symbols;
   it threw ReferenceError before boot() and produced a black app screen. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1029.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r271-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<=a)throw Error('1.0.31 requires validated r271 1.0.29 bootstrap');
let js=html.slice(a+marker.length,b);
const one=(from,to,why)=>{const n=js.split(from).length-1;if(n!==1)throw Error('r273 '+why+' expected 1 found '+n);js=js.replace(from,to)};
const oldExposing='window.__ctR271Test={sportsClick271,setWatch271,sorted271,paintMovieHistory271,fetchAllMovies271,persistForYou271};';
const bridge=[
 'window.__ctR271Bridge={',
 ' getFetcher:()=>fetchAllMovies271,',
 ' setFetcher:fn=>{if(typeof fn==="function")fetchAllMovies271=fn},',
 ' getPainter:()=>paintMovieHistory271,',
 ' setPainter:fn=>{if(typeof fn==="function")paintMovieHistory271=fn}',
 '};'
].join('\n');
one(oldExposing,bridge+'\n'+oldExposing,'explicit scoped bridge');
one("const REVISION='r271-android-official-1.0.29';","const REVISION='r273-android-official-1.0.31';",'revision');
one("window.__ctWebBuild='1.0.29';window.__ctOfficialVersion='1.0.29';window.__ctAndroidOfficialVersion='1.0.29';window.__ctAndroidOfficialCode=10071;",
"window.__ctWebBuild='1.0.31';window.__ctOfficialVersion='1.0.31';window.__ctAndroidOfficialVersion='1.0.31';window.__ctAndroidOfficialCode=10073;",'version/code');
js=js.replaceAll('CineTracker • v1.0.29','CineTracker • v1.0.31')
 .replaceAll("JSON.stringify({version:'1.0.29',revision:REVISION","JSON.stringify({version:'1.0.31',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.29'","window.__ctAndroidRelease='1.0.31'");
const patch=await readFile(resolve(root,'apps/android/runtime-r273-v1031-safe-history-bridge.js'),'utf8');
for(const required of ['__ctR273AndroidV1031','__ctR271Bridge','mergeHistory273','cinetracker_home_movie_history_v323','StartupError'])
 if(!patch.includes(required))throw Error('r273 patch missing '+required);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 if(patch.includes(forbidden))throw Error('forbidden '+forbidden);
if(!js.includes('\nboot();'))throw Error('1.0.31 bootstrap missing boot()');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r273-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1029','ct-android-v1031').replaceAll('content="1.0.29"','content="1.0.31"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_31_READY r271 login boot restored; scoped history bridge integrated; guarded r273; Web r541 frozen');
