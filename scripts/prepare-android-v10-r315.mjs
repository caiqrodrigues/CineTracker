import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Android official 1.0/r315: only UFC Home action sizing and Discover cards.
// Preserve r314 verified 7-slot ForYou and all authenticated functions.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r314.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r314-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Official 1.0/r314 base runtime unavailable');
let js=html.slice(a+tag.length,b);
const original=js;
function once(from,to,label){
 const hits=js.split(from).length-1;
 if(hits!==1)throw Error('r315 '+label+' expected 1 match, got '+hits);
 js=js.replace(from,to);
}
once("const REVISION='r314-android-official-1.0';",
 "const REVISION='r315-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10115;',
 'window.__ctAndroidOfficialCode=10116;','internal version code');
const patch=await readFile(resolve(root,'apps/android/runtime-r315-discover-home-ui.js'),'utf8');
for(const required of ['window.__ctR315DiscoverCards=',"discoverCard158=function(x)","window.__ctR315TasteAdapter=",
 'if(window.__ctR315DiscoverCards)return;', 'window.__ctR307Taste',
 'data-ct315-meta','data-ct315-runtime',
 'data-ct315-seen','data-ct263-special="ufc"'])
 if(!patch.includes(required))throw Error('r315 scope marker missing: '+required);
once('boot();\n})();',patch+'\nboot();\n})();','append scoped Android module only');
new Function(js);
const restored=js.replace(patch+'\nboot();\n})();','boot();\n})();')
 .replace("const REVISION='r315-android-official-1.0';","const REVISION='r314-android-official-1.0';")
 .replace('window.__ctAndroidOfficialCode=10116;','window.__ctAndroidOfficialCode=10115;');
if(original!==restored)throw Error('r315 would change existing working feature source');
html=html.slice(0,a)+'<script data-ct-android="r315-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(path,html,'utf8');
console.log('CINETRACKER_1_0_R315_READY: UFC action matches 52px; Discover non-ForYou metadata and seen/watchlist buttons; r314 ForYou Web pools intact with corrected Watchlist taste namespace; no other changes.');