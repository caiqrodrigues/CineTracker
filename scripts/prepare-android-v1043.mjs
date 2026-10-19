import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1042.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r284-android-js">',a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('r285 requires validated Android 1.0.42 baseline');
let js=html.slice(a+tag.length,b);
function once(oldValue,newValue,label){
 const count=js.split(oldValue).length-1;
 if(count!==1)throw Error('r285 '+label+' expected exactly one anchor, found '+count);
 js=js.replace(oldValue,newValue);
}
once("const REVISION='r284-android-official-1.0.42';","const REVISION='r285-android-official-1.0.43';",'revision');
once("window.__ctWebBuild='1.0.42';window.__ctOfficialVersion='1.0.42';window.__ctAndroidOfficialVersion='1.0.42';window.__ctAndroidOfficialCode=10084;",
"window.__ctWebBuild='1.0.43';window.__ctOfficialVersion='1.0.43';window.__ctAndroidOfficialVersion='1.0.43';window.__ctAndroidOfficialCode=10085;",'metadata');
// Supabase v421 + personal v525 are final authorities. The old local TMDB
// rating threshold was silently deleting their approved cards and swaps.
once("&&window.__ctR265Test?.allowed?.(x)===true&&(watch||ct186Quality(x))&&!ct186LocalBlocked.has(ct186Key(x))",
"&&window.__ctR265Test?.allowed?.(x)===true&&!ct186LocalBlocked.has(ct186Key(x))",
'remove redundant post-audit rating filter');
once("if(typeof allowed!=='function'||!allowed(x)||(!watchKind(key)&&!ct186Quality(x))||ct186LocalBlocked.has(ct186Key(x)))return false;",
"if(typeof allowed!=='function'||!allowed(x)||ct186LocalBlocked.has(ct186Key(x)))return false;"+
"if(!selectedData()?.__ct283ServerAudited&&!ct186Quality(x))return false;",
'align card reconciler with audited recommendation pools');
// The r277 optimistic owner mutates only one card; the old broad event
// cleared r279 verification and destroyed unrelated already-verified slots.
for(const action of ['r186-watchlist','r186-seen']){
 const oldValue="try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'"+action+"'";
 const newValue="try{if(!(window.__ctR285AndroidV1043&&route()==='discover'&&discoverState?.tab==='foryou'))window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'"+action+"'";
 once(oldValue,newValue,'avoid global Discover rebuild for '+action);
}
js=js.replaceAll('CineTracker • v1.0.42','CineTracker • v1.0.43')
 .replaceAll("JSON.stringify({version:'1.0.42',revision:REVISION","JSON.stringify({version:'1.0.43',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.42'","window.__ctAndroidRelease='1.0.43'");
const runtime=await readFile(resolve(root,'apps/android/runtime-r285-v1043-scoped-recovery.js'),'utf8');
new Function(runtime);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 if(runtime.includes(forbidden))throw Error('r285 forbidden action '+forbidden);
if(!js.includes('\nboot();'))throw Error('r285 boot marker missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r285-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1042','ct-android-v1043').replaceAll('content="1.0.42"','content="1.0.43"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_43_READY compact daily + audited seven slots + no broad Watchlist rebuild + progressive Profile, Web frozen');
