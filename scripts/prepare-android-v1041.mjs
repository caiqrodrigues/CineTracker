import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1040.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r282-android-js">',start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
if(start<0||end<start)throw Error('r283 requires verified r282 baseline');
let js=html.slice(start+tag.length,end);
function once(from,to,label){const n=js.split(from).length-1;if(n!==1)throw Error(label+': expected one anchor, got '+n);js=js.replace(from,to)}
function region(from,to,body,label){const a=js.indexOf(from),b=a<0?-1:js.indexOf(to,a+from.length);if(a<0||b<=a||js.indexOf(from,a+1)>=0)throw Error('r283 '+label+' bounds missing');js=js.slice(0,a)+body+'\n'+js.slice(b)}
const recycler=[
 'function contentAllowed(x,key,ctx){',
 ' if(!x||!ctx)return false;',
 ' const kind=kindOf(key),type=ct186Type(x),anime=ct186Anime(x);',
 " if(kind==='movie'?(type!=='movie'||anime):kind==='anime'?(type!=='tv'||!anime):(type!=='tv'||anime))return false;",
 ' const allowed=window.__ctR265Test?.allowed;',
 " if(typeof allowed!=='function'||!allowed(x)||!ct186Quality(x)||ct186LocalBlocked.has(ct186Key(x)))return false;",
 ' // Authenticated v525 verdict replaces only a stale local context.',
 ' if(window.__ctR283AndroidV1041&&selectedData()?.__ct283ServerAudited)',
 '  return Boolean(window.__ctR279Audit?.permitted?.(x,watchKind(key)));',
 ' return watchKind(key)?ct186WatchEligible(x,ctx):ct186FreshEligible(x,ctx);',
 '}'
].join('\n');
region('function contentAllowed(x,key,ctx){','function poolFor(data,key,ctx){',recycler,'r277 stale re-filter');
once('s.data[bag][kind]=ct186MergeRows(s.data[bag][kind],passed);','s.data[bag][kind]=ct186MergeRows(s.data[bag][kind],passed);s.data.__ct283ServerAudited=true;', 'mark only verified v525 responses');
once('  s.done=true;\n });','  s.done=true;if(visible(s))display(s);\n });','final empty-state repaint');
once("const REVISION='r282-android-official-1.0.40';","const REVISION='r283-android-official-1.0.41';",'revision');
once("window.__ctWebBuild='1.0.40';window.__ctOfficialVersion='1.0.40';window.__ctAndroidOfficialVersion='1.0.40';window.__ctAndroidOfficialCode=10082;",
"window.__ctWebBuild='1.0.41';window.__ctOfficialVersion='1.0.41';window.__ctAndroidOfficialVersion='1.0.41';window.__ctAndroidOfficialCode=10083;",'native metadata');
js=js.replaceAll('CineTracker • v1.0.40','CineTracker • v1.0.41')
 .replaceAll("JSON.stringify({version:'1.0.40',revision:REVISION","JSON.stringify({version:'1.0.41',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.40'","window.__ctAndroidRelease='1.0.41'");
const patch=await readFile(resolve(root,'apps/android/runtime-r283-v1041-history-discover.js'),'utf8');
for(const marker of ['__ctR283AndroidV1041','__ct283ServerAudited','AlreadySeen','cinetracker_profile_media_dashboard_v0991','__ctR283History'])if(!js.includes(marker)&&!patch.includes(marker))throw Error('r283 missing '+marker);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(bad))throw Error('forbidden '+bad);
if(!js.includes('\nboot();'))throw Error('r283 boot anchor missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');new Function(js);
html=html.slice(0,start)+'<script data-ct-android="r283-android-js">'+js+'</script>'+html.slice(end+'</script>'.length);
html=html.replaceAll('ct-android-v1040','ct-android-v1041').replaceAll('content="1.0.40"','content="1.0.41"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_41_READY dated authenticated movie overrides + dashboard & v525 seven-slot authority, Web r541 frozen');
