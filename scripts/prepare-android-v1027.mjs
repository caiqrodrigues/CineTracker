import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1026.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r268-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<=a)throw new Error('v1.0.27 requires tested r268 baseline');
let js=html.slice(a+marker.length,b);
function once(oldText,newText,label){
 const n=js.split(oldText).length-1;
 if(n!==1)throw new Error('r269 '+label+' must be unique, found '+n);
 js=js.replace(oldText,newText);
}
once('ct171ProviderList=null;const providers=await ct171Providers();',
 'const providers=await ct171Providers();',
 'Top 10 provider list was being reset before every visit');
once("host.innerHTML=loading('Montando Top 10...');",
 "if(!host.querySelector('.ct171-top-section'))host.innerHTML=loading('Montando Top 10...');",
 'cached Top 10 must not be replaced by spinner');
once("function ct163WarmOnIdle(){if(!session)return;const run=()=>void ct163PreloadAll();if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:900});else setTimeout(run,350)}",
 "function ct163WarmOnIdle(){if(!session)return;setTimeout(()=>{if(session)void ct163PreloadAll()},6500)}",
 'delay expensive multi-query preloading behind initial page paint');
once("if(!q113('[data-ct113-f1-grid]',tabs)){",
 "if(false&&!q113('[data-ct113-f1-grid]',tabs)){",
 'legacy Grid de largada must not create fifth F1 tab');
once("async function getF111(force=false){\n if(!force&&f111Data&&Date.now()-f111At<120000)return f111Data;",
 "async function getF111(force=false){\n if(!force&&!f111Data){try{const y=new Date().getFullYear();const cached=JSON.parse(localStorage.getItem('ct:v111:f1:'+y)||'null');if(cached?.d?.races?.length&&Date.now()-Number(cached.t||0)<8*60*60*1000){f111Data=cached.d;f111At=Date.now();return f111Data}}catch{}}\n if(!force&&f111Data&&Date.now()-f111At<120000)return f111Data;",
 'F1 Hub should paint existing real-data cache before network');
once("const REVISION='r268-android-official-1.0.26';","const REVISION='r269-android-official-1.0.27';",'revision');
once("window.__ctWebBuild='1.0.26';window.__ctOfficialVersion='1.0.26';window.__ctAndroidOfficialVersion='1.0.26';window.__ctAndroidOfficialCode=10068;",
 "window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';window.__ctAndroidOfficialVersion='1.0.27';window.__ctAndroidOfficialCode=10069;",'version');
js=js.replaceAll('CineTracker • v1.0.26','CineTracker • v1.0.27')
 .replaceAll("JSON.stringify({version:'1.0.26',revision:REVISION","JSON.stringify({version:'1.0.27',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.26'","window.__ctAndroidRelease='1.0.27'");
const patch=await readFile(resolve(root,'apps/android/runtime-r269-v1027-phone-performance.js'),'utf8');
for(const need of ['__ctR269AndroidV1027','ct-r269-phone-geometry','grid-template-columns:repeat(4,minmax(0,1fr))','ct171TopRows=async function','renderSports=function'])if(!patch.includes(need))throw Error('r269 patch missing '+need);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(bad))throw Error('r269 forbidden operation '+bad);
if(!js.includes('\nboot();'))throw Error('r269 missing boot anchor');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r269-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1026','ct-android-v1027').replaceAll('content="1.0.26"','content="1.0.27"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_27_READY F1 one-row 4 tabs + body compact; seven-card layout no overlap; Top10 4 parallel pages + persistent cache; Home priority; Sports/F1 real cached first');
