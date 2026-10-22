import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
// Official Android 1.0/r316: critical Discover-only rollback of conflicting
// asynchronous render ownership. Preserve r315 UFC/Home and r314 seven slots.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r315.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r315-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Official 1.0/r315 baseline missing');
let js=html.slice(a+tag.length,b),old=js;
function one(a,b,label){const n=js.split(a).length-1;if(n!==1)throw Error('r316 '+label+' expected 1 occurrence, found '+n);js=js.replace(a,b)}
one("const REVISION='r315-android-official-1.0';","const REVISION='r316-android-official-1.0';",'revision');
one('window.__ctAndroidOfficialCode=10116;','window.__ctAndroidOfficialCode=10117;','internal version code');
// The already installed r315 card enricher owns its data cache. Expose only
// its existing row ingestion so the r316 route can render directly without
// invoking outdated page painters or re-running expensive network work.
one('window.__ctR315DiscoverCards={card,data,details,enrichVisible,schedule,stats:',
 'window.__ctR315DiscoverCards={card,data,details,enrichVisible,schedule,'+
 'setRows:rows=>{itemData.clear();for(const x of Array.isArray(rows)?rows:[]){const id=idOf(x);if(id)itemData.set(typeOf(x)+":"+id,x)}},stats:',
 'direct Discover row hydration');
const patch=await readFile(resolve(root,'apps/android/runtime-r316-discover-critical.js'),'utf8');
for(const required of ['window.__ctR316Discover=','window.ctR217RenderTop10','Top 10','window.__ctR315DiscoverCards?.setRows',
 'discoverCarousel158','data-ct316-duration','window.addEventListener(\'click\'',
 'const oldSetApp=setApp','renderDiscover=async function'])
 if(!patch.includes(required))throw Error('Missing scoped r316 recovery marker '+required);
one('boot();\n})();',patch+'\nboot();\n})();','append only Discover authority');
new Function(js);
const restored=js.replace(patch+'\nboot();\n})();','boot();\n})();')
 .replace('window.__ctR315DiscoverCards={card,data,details,enrichVisible,schedule,'+
 'setRows:rows=>{itemData.clear();for(const x of Array.isArray(rows)?rows:[]){const id=idOf(x);if(id)itemData.set(typeOf(x)+":"+id,x)}},stats:',
 'window.__ctR315DiscoverCards={card,data,details,enrichVisible,schedule,stats:')
 .replace("const REVISION='r316-android-official-1.0';","const REVISION='r315-android-official-1.0';")
 .replace('window.__ctAndroidOfficialCode=10117;','window.__ctAndroidOfficialCode=10116;');
if(restored!==old)throw Error('Out-of-scope Android source changed');
html=html.slice(0,a)+'<script data-ct-android="r316-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(path,html,'utf8');
console.log('ANDROID_1_0_R316_READY: Top10 restored, non-ForYou navigation no longer overwritten by stale painters, real runtime metadata enriched; seven-slot ForYou/other routes unchanged.');
