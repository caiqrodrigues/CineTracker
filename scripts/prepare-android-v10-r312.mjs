import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
// Official 1.0/r312 retains r311 Home + Discover and hardens ONLY
// Android authenticated network entrypoints against expired access JWTs.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r311.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r311-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('r311 official APK runtime baseline missing');
let js=html.slice(a+tag.length,b);
function once(from,to,why){
 const n=js.split(from).length-1;
 if(n!==1)throw Error('r312 '+why+': expected 1 anchor, got '+n);
 js=js.replace(from,to);
}
once("const REVISION='r311-android-official-1.0';",
 "const REVISION='r312-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10112;',
 'window.__ctAndroidOfficialCode=10113;','APK versionCode');
const module=await readFile(resolve(root,'apps/android/runtime-r312-auth-transport.js'),'utf8');
if(!module.includes('window.__ctR312Transport=')||!module.includes('authenticated(true)'))
 throw Error('r312 verified auth gate missing');
once('boot();\n})();',module+'\nboot();\n})();','auth gate before startup');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r312-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(path,html,'utf8');
console.log('CINETRACKER_1_0_R312_READY: preflight Supabase access token, one refresh at a time, bounded TMDB queue, prioritized series/movie detail, upstream 401 storm circuit-breaker; r311 Home/Discover preserved.');
