import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Compile the signed r322 baseline unchanged; modify only its Pra Você data
// loader so Android uses the actual current Web r542 recommendations pipeline.
const root=resolve(process.cwd());
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const oldTag='<script data-ct-android="r322-android-stable-js">';
let html=await readFile(target,'utf8').catch(()=>null);
if(!html?.includes(oldTag)){
 execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r322.mjs')],{
  cwd:root,stdio:'inherit'
 });
 html=await readFile(target,'utf8');
}
const start=html.indexOf(oldTag),end=start<0?-1:html.indexOf('</script>',start+oldTag.length);
if(start<0||end<start)throw Error('Official r322 Android source not found');
let js=html.slice(start+oldTag.length,end);
function once(before,after,label){
 const n=js.split(before).length-1;
 if(n!==1)throw Error('Android r323 '+label+': expected one anchor, found '+n);
 js=js.replace(before,after);
}
once("const REVISION='r322-android-official-1.0';",
 "const REVISION='r323-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10123;',
 'window.__ctAndroidOfficialCode=10124;','internal version');

const functionStart='async function auditedPools(id){';
const functionEnd='async function load(force=false,preserve=false){';
const a=js.indexOf(functionStart),b=a<0?-1:js.indexOf(functionEnd,a+functionStart.length);
if(a<0||b<=a||js.indexOf(functionStart,a+functionStart.length)!==-1)
 throw Error('Android r323 Pra Você loader boundary is ambiguous');
const loader=(await readFile(resolve(root,'apps/android/runtime-r323-web-foryou-pools.js'),'utf8')).trim();
if(!loader.startsWith('// Android Pra Você:')||!loader.includes('cinetracker_foryou_payload_v498')||
 !loader.includes('cinetracker_recommendation_filter_v525')&&!loader.includes('window.__ctR279Audit.auditData(raw)'))
 throw Error('Android r323 missing Web payload or authenticated audit');
js=js.slice(0,a)+loader+'\n'+js.slice(b);
new Function(js);
html=html.slice(0,start)+'<script data-ct-android="r323-android-stable-js">'+js+
 '</script>'+html.slice(end+'</script>'.length);
await writeFile(target,html,'utf8');
console.log('ANDROID_1_0_R323_READY: current Web v498/v485/v421 pools, v525 audit; all other Android and Web behavior preserved.');
