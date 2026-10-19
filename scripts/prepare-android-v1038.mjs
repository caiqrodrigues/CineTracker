import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1037.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const marker='<script data-ct-android="r279-android-js">';
const at=html.indexOf(marker),end=at<0?-1:html.indexOf('</script>',at+marker.length);
if(at<0||end<=at)throw Error('Android 1.0.38 requires validated r279 baseline');
let js=html.slice(at+marker.length,end);
function exact(text,next,label){const n=js.split(text).length-1;if(n!==1)throw Error('r280 '+label+': '+n+' anchors');js=js.replace(text,next)}
function replaceBlock(start,stop,replacement,label){
 const a=js.indexOf(start),b=a<0?-1:js.indexOf(stop,a+start.length);
 if(a<0||b<=a||js.indexOf(start,a+1)>=0)throw Error('r280 '+label+' invalid bounds');
 js=js.slice(0,a)+replacement+'\n'+js.slice(b);
}
exact("const REVISION='r279-android-official-1.0.37';","const REVISION='r280-android-official-1.0.38';",'revision');
exact("window.__ctWebBuild='1.0.37';window.__ctOfficialVersion='1.0.37';window.__ctAndroidOfficialVersion='1.0.37';window.__ctAndroidOfficialCode=10079;",
 "window.__ctWebBuild='1.0.38';window.__ctOfficialVersion='1.0.38';window.__ctAndroidOfficialVersion='1.0.38';window.__ctAndroidOfficialCode=10080;",'release version');
js=js.replaceAll('CineTracker • v1.0.37','CineTracker • v1.0.38')
 .replaceAll("JSON.stringify({version:'1.0.37',revision:REVISION","JSON.stringify({version:'1.0.38',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.37'","window.__ctAndroidRelease='1.0.38'");
exact("function ct163WarmOnIdle(){if(!session)return;setTimeout(()=>{if(session)void ct163PreloadAll()},6500)}",
 "function ct163WarmOnIdle(){/* r280: visible tabs own their fetch; do not launch 10 unrelated background requests */}",
 'background RPC flood during Home/Discover/Profile launch');
const startAudit=js.indexOf('/* CineTracker Android 1.0.37/r279');
if(startAudit<0)throw Error('r280 cannot locate r279 audited recommendation module');
let audit=js.slice(startAudit);
function aOnce(oldText,newText,label){const n=audit.split(oldText).length-1;if(n!==1)throw Error('r280 audit '+label+': '+n);audit=audit.replace(oldText,newText)}
function aRegion(start,stop,replacement,label){
 const a=audit.indexOf(start),b=a<0?-1:audit.indexOf(stop,a+start.length);
 if(a<0||b<=a||audit.indexOf(start,a+1)>=0)throw Error('r280 audit region '+label);
 audit=audit.slice(0,a)+replacement+'\n'+audit.slice(b);
}
aOnce('const active=new WeakMap();','const active=new WeakMap(),rawPools=new WeakMap();','source preservation');
aOnce('const bag=data?.[name];if(!bag)continue;', 'const bag=rawPools.get(data)?.[name]||data?.[name];if(!bag)continue;','read original candidates on retries');
aOnce('.slice(0,50)', '.slice(0,16)','bounded first audit candidates per category');
const filter=[
'function filterData(data){',
' if(!data||typeof data!=="object")return data;',
' const source=rawPools.get(data)||{};',
' for(const kind of bags){',
'  for(const name of ["_ct186_fresh","_ct186_watchlist"]){',
'   const original=source[name]?.[kind]||data[name]?.[kind]||[];',
'   if(!data[name])data[name]={movie:[],series:[],anime:[]};',
'   data[name][kind]=(Array.isArray(original)?original:[]).filter(x=>permitted(x,name==="_ct186_watchlist"));',
'  }',
'  const reserve=source._ct186_reserve?.[kind]||data._ct186_reserve?.[kind]||[];',
'  if(data._ct186_reserve)data._ct186_reserve[kind]=(Array.isArray(reserve)?reserve:[]).filter(x=>permitted(x,false));',
' }',
' data._ct186_fallback={movie:[],series:[],anime:[]};',
' data._ct166_fresh=data._ct186_fresh;',
' data._ct166_watchlist=data._ct186_watchlist;',
' data._ct279AuditedFor=identity;',
' return data;',
'}'
].join('\n');
aRegion('function filterData(data){','function unverified(data){',filter,'non-destructive audited projection');
const auditData=[
'async function auditData(data){',
' if(!data||typeof data!=="object")return data;',
' resetIfNewUser();',
' let source=rawPools.get(data);',
' if(!source){source={};rawPools.set(data,source)}',
' // Keep newly fetched candidates available for authenticated verification.',
' for(const name of ["_ct186_fresh","_ct186_watchlist","_ct186_reserve"]){',
'  const current=data[name]||{};',
'  if(!source[name])source[name]={movie:[],series:[],anime:[]};',
'  for(const kind of bags){',
'   const target=source[name][kind]||[];',
'   const known=new Set(target.map(ref));',
'   for(const row of Array.isArray(current[kind])?current[kind]:[]){',
'    const key=ref(row);if(key&&!known.has(key)){target.push(row);known.add(key)}',
'   }',
'   source[name][kind]=target.slice(0,90);',
'  }',
' }',
' const inFlight=active.get(data);if(inFlight)return inFlight;',
' if(!unverified(data)&&data._ct279AuditedFor===identity)return data;',
' const owner=identity;',
' const promise=(async()=>{',
'  document.documentElement.dataset.ct279Audit="pending";',
'  const success=await auditCandidates(candidatesOf(data));',
'  if(owner!==identityKey())return data;',
'  filterData(data);',
'  data._ct280AuditPartial=!success;',
'  document.documentElement.dataset.ct279Audit=success?"ready":"partial";',
'  if(!success&&Number(data._ct280AuditRetries||0)<2){',
'   data._ct280AuditRetries=Number(data._ct280AuditRetries||0)+1;',
'   setTimeout(()=>{if(identity===identityKey()&&route()==="discover"&&discoverState?.tab==="foryou"){',
'    void auditData(data).then(d=>{if(route()==="discover"&&discoverState?.tab==="foryou")paintDiscover(d)}).catch(()=>{})',
'   }},2000*data._ct280AuditRetries);',
'  }',
'  return data;',
' })().finally(()=>active.delete(data));',
' active.set(data,promise);return promise;',
'}'
].join('\n');
aRegion('async function auditData(data){','const originalLoad=ct186LoadForYou;',auditData,'bounded, resumable authenticated audits');
js=js.slice(0,startAudit)+audit;
const patch=await readFile(resolve(root,'apps/android/runtime-r280-v1038-profile-audit-resilience.js'),'utf8');
for(const key of ['__ctR280AndroidV1038','cinetracker_profile_screen_v495','ct280-profile-status','ct280-audit-banner'])
 if(!patch.includes(key))throw Error('r280 resilience patch missing '+key);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 if(patch.includes(bad))throw Error('r280 forbidden operation '+bad);
if(!js.includes('\nboot();'))throw Error('r280 boot insertion missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,at)+'<script data-ct-android="r280-android-js">'+js+'</script>'+html.slice(end+'</script>'.length);
html=html.replaceAll('ct-android-v1037','ct-android-v1038').replaceAll('content="1.0.37"','content="1.0.38"');
await writeFile(path,html,'utf8');
console.log('ANDROID_1_0_38_READY: visible user-scoped Profile fallback, resumable authenticated v525 Pra Voce, no ten-RPC background flood; Web r541 frozen');
