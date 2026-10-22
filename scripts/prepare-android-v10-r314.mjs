import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Android official 1.0 / r314. Zero modifications to working modules.
// Install web-compatible Discover > Pra Voce at the end of certified r313.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r313.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r313-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Official 1.0/r313 baseline missing');
let js=html.slice(a+tag.length,b);
const original=js;
function one(from,to,label){
 const count=js.split(from).length-1;
 if(count!==1)throw Error('r314 '+label+' anchor count '+count);
 js=js.replace(from,to);
}
one("const REVISION='r313-android-official-1.0';",
 "const REVISION='r314-android-official-1.0';",'revision');
one('window.__ctAndroidOfficialCode=10114;',
 'window.__ctAndroidOfficialCode=10115;','code');
const module=await readFile(resolve(root,'apps/android/runtime-r314-web-foryou.js'),'utf8');
if(!module.includes('window.__ctR314ForYou=')||
 !module.includes('cinetracker_discover_fresh_v421')||
 !module.includes('cinetracker_discover_watch_unseen_v421')||
 !module.includes('window.__ctR279Audit.auditData(raw)')||
 !module.includes("if(discoverState?.tab!=='foryou')return oldRender.apply(this,arguments);"))
 throw Error('r314 Web-parity route boundaries missing');
one('boot();\n})();',module+'\nboot();\n})();','append only FY owner');
new Function(js);
const reverted=js.replace(module+'\nboot();\n})();','boot();\n})();')
 .replace("const REVISION='r314-android-official-1.0';","const REVISION='r313-android-official-1.0';")
 .replace('window.__ctAndroidOfficialCode=10115;','window.__ctAndroidOfficialCode=10114;');
if(reverted!==original)throw Error('A working r313 feature was altered');
html=html.slice(0,a)+'<script data-ct-android="r314-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('CINETRACKER_1_0_R314_READY: Web v421 + v525 audited Pra Voce, 7 same-layout slots, persistent taste, single-action updates; all r313 non-ForYou functions byte-identical.');
