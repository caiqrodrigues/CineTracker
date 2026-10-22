import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Android Discover only. Compile from the certified 1.0/r320 runtime.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r320.mjs')],{
 cwd:root,stdio:'inherit'
});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r320-android-stable-js">';
const begin=html.indexOf(tag),end=begin<0?-1:html.indexOf('</script>',begin+tag.length);
if(begin<0||end<begin)throw Error('Android 1.0/r320 baseline not found');
let js=html.slice(begin+tag.length,end);
function once(before,after,label){
 const n=js.split(before).length-1;
 if(n!==1)throw Error('Android r321 '+label+': expected one anchor, found '+n);
 js=js.replace(before,after);
}
function scoped(startMarker,endMarker,before,after,label){
 const start=js.indexOf(startMarker),end=start<0?-1:js.indexOf(endMarker,start+startMarker.length);
 if(start<0||end<start)throw Error('Android r321 '+label+': missing handler boundary');
 const block=js.slice(start,end),n=block.split(before).length-1;
 if(n!==1)throw Error('Android r321 '+label+': expected one anchor, found '+n);
 js=js.slice(0,start)+block.replace(before,after)+js.slice(end);
}
once("const REVISION='r320-android-official-1.0';",
 "const REVISION='r321-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10121;',
 'window.__ctAndroidOfficialCode=10122;','update code');

// A revisit previously cleared the seven slots but adopted an in-flight
// request from a prior page. Its stale ticket then refused to paint anything.
// Invalidate that request synchronously and begin a fresh generation.
scoped('function mount(){','// Wrap only the ForYou route.',
 'if(visit!==navSeq){visit=navSeq;excluded.clear();model=blank()}',
 'if(visit!==navSeq){visit=navSeq;serial++;request=null;excluded.clear();model=blank()}',
 'Pra Você re-entry loading deadlock');

// The daily recommendation occupies one of the three identical card columns,
// matching Movie/Series/Anime rather than a 190px oversize desktop card.
once("'[data-ct314-foryou] .ct314-rail.daily{grid-template-columns:minmax(0,min(190px,100%))!important}',",
 "'[data-ct314-foryou] .ct314-rail.daily{grid-template-columns:repeat(3,minmax(0,1fr))!important}',",
 'daily poster 2:3 standard column');

// The personal audit is mandatory; do not wait for the old dashboard.
// Bound the two actual phases to avoid an apparently infinite spinner.
scoped('async function fetchPool(group,kind){','async function auditedPools(id){',
 'timebox(rpc(name,{p_kind:kind,p_limit}),16000)',
 'timebox(rpc(name,{p_kind:kind,p_limit}),10000)','ForYou v421 deadline');
scoped('async function auditedPools(id){','async function load(force=false,preserve=false){',
 'timebox(window.__ctR279Audit.auditData(raw),20000)',
 'timebox(window.__ctR279Audit.auditData(raw),18000)','ForYou mandatory v525 deadline');
scoped('async function loadTab(tab,expected){','async function show(tab){',
 "timer=setTimeout(()=>reject(Error('Tempo limite ao carregar Descobrir')),14000);",
 "timer=setTimeout(()=>reject(Error('Tempo limite ao carregar Descobrir')),19000);",
 'non-ForYou source plus audit deadline');

const module=await readFile(resolve(root,'apps/android/runtime-r321-discover-recovery.js'),'utf8');
for(const marker of [
 'window.__ctR321Discover={topRows:providerRows,',
 'api.topRows=providerRows;',
 'gate.auditCandidates(candidates)',
 'gate.permitted(x,false)===true',
 'with_watch_monetization_types',
 '22500'
])if(!module.includes(marker))throw Error('r321 authenticated Top 10 incomplete: '+marker);
once('boot();\n})();',module+'\nboot();\n})();','append Android Discover recovery');
new Function(js);
html=html.slice(0,begin)+'<script data-ct-android="r321-android-stable-js">'+
 js+'</script>'+html.slice(end+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_R321_READY: Pra Você re-entry and 2:3 standard sizing, bounded audited sources, fast selected-provider Top 10, Web untouched.');
