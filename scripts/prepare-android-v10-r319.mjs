import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Official CineTracker 1.0 / r319 — Discover load & geometry + genre wrapping.
// Build on audited r318, preserving everything else byte-for-byte.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r318.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r318-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Official Android 1.0/r318 baseline missing');
let js=html.slice(a+tag.length,b);
function once(before,after,name){
 const count=js.split(before).length-1;
 if(count!==1)throw Error('r319 '+name+' expected exactly one match, got '+count);
 js=js.replace(before,after);
}
once("const REVISION='r318-android-official-1.0';",
     "const REVISION='r319-android-official-1.0';",'diagnostic version');
once('window.__ctAndroidOfficialCode=10119;',
     'window.__ctAndroidOfficialCode=10120;','internal update code');
// r316 alone owns non-ForYou Discover. Replace its legacy 20+ network-wrapper
// data source while preserving its presentation, Top 10 and tab click owner.
once('const promise=discoverRows(tab);',
     'const promise=window.__ctR319Discover.rows(tab);',
     'only r316 non-ForYou data source');
// Do not reconfigure r314's seven authenticated recommendation slots, Top10
// or the fixed r270 recursion delegate; only add this new module before boot.
const patch=await readFile(resolve(root,'apps/android/runtime-r319-discover-direct.js'),'utf8');
for(const marker of [
 'window.__ctR319Discover={rows,stats:',
 'const tabs=new Set',
 'window.__ctR279Audit',
 "style.id='ct319-discover-sized-genres'",
 "'[data-detail] .ct169-meta",
 'audit.auditCandidates(candidates)',
 'verified!==true'
]){
 if(!patch.includes(marker))throw Error('Missing r319 scope/audit marker: '+marker);
}
once('boot();\n})();',patch+'\nboot();\n})();','append scoped r319 module');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r319-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_R319_READY: bounded direct Discover non-ForYou queries with v525 confirmed user-state exclusion, compact 2:3 mobile cards and line-wrap for genre metadata; other routes unchanged.');
