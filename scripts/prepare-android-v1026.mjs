import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1025.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r267-android-js">';
const at=html.indexOf(tag),close=at<0?-1:html.indexOf('</script>',at+tag.length);
if(at<0||close<at)throw new Error('Android v1026 missing v1025 baseline');
let js=html.slice(at+tag.length,close);
const once=(from,to,label)=>{
 const n=js.split(from).length-1;
 if(n!==1)throw new Error('r268 '+label+' anchor must be unique: '+n);
 js=js.replace(from,to);
};
function region(from,to,body,label){
 const a=js.indexOf(from),b=a<0?-1:js.indexOf(to,a+from.length);
 if(a<0||b<=a||js.indexOf(from,a+1)>=0)throw new Error('r268 invalid bounds '+label);
 js=js.slice(0,a)+body+'\n'+js.slice(b);
}
const authority=await readFile(resolve(root,'apps/android/runtime-r268-v1026-direct-authority.js'),'utf8');
const slice=(start,end)=>{
 const a=authority.indexOf(start),b=authority.indexOf(end,a);
 if(a<0||b<=a)throw new Error('r268 authority region '+start);
 return authority.slice(a,b).trim();
};
region('function ct186DailyPick(pool,used){','function ct186Pick(pool,key,used){',
 slice('function ct186History268(){','//__CT268_DAILY_END__'),'rotate daily recommendation and keep history');
region('function pick237(key,current){','function placeSwap237(slot){',
 slice('function pick237(key,current){','//__CT268_SWAP_END__'),'persist Daily Trocar in active tap handler');
region('function bodyF111(d,tab){','function ensureF111Shell(){',
 slice('function bodyF111(d,tab){','//__CT268_F1_END__'),'compact F1 overview');
once("ct186Slot('Filme',s.daily,'daily:movie',1)",
 "ct186Slot('Filme',s.daily,'daily:movie',f.movie?.length||0)",
 'Daily Trocar receives real pool count');
once("return count>1?'<button type=\"button\" class=\"btn btn-secondary ct166-swap ct237-swap\" data-ct237-swap=\"'+esc(key)+'\">↻ Trocar</button>':'';",
 "return '<button type=\"button\" class=\"btn btn-secondary ct166-swap ct237-swap\" data-ct237-swap=\"'+esc(key)+'\"'+(count>1?'':' disabled title=\"Sem alternativa elegível nesta categoria\"')+'>↻ Trocar</button>';",
 'Trocar controls all categories');
{
 const start='async function refillKind(kind,context,data){',end='async function fillMissing(data){';
 const a=js.indexOf(start),b=js.indexOf(end,a+start.length);
 if(a<0||b<=a)throw Error('r268 refill bounds missing');
 let body=js.slice(a,b);
 const needle=' return changed;\n}';
 const addition=[
 " if((pool[kind]||[]).length<target){",
 "  try{",
 "   const result=await elapsed(ct186PopularPool(kind,context),9500);",
 "   const eligible=(Array.isArray(result)?result:[]).filter(x=>ct186FreshEligible(x,context)&&allowed(x)&&(kind==='movie'?ct186Type(x)==='movie'&&!ct186Anime(x):kind==='anime'?ct186Type(x)==='tv'&&ct186Anime(x):ct186Type(x)==='tv'&&!ct186Anime(x)));",
 "   if(eligible.length){const before=pool[kind].length;pool[kind]=ct186MergeRows(pool[kind],eligible);if(pool[kind].length>before){changed=true;recompute(data)}}",
 "  }catch{}",
 " }",
 " return changed;",
 "}"
 ].join('\n');
 if(body.split(needle).length!==2)throw Error('r268 refill return anchor missing');
 js=js.slice(0,a)+body.replace(needle,addition)+js.slice(b);
}
once("const REVISION='r267-android-official-1.0.25';","const REVISION='r268-android-official-1.0.26';",'revision');
once("window.__ctWebBuild='1.0.25';window.__ctOfficialVersion='1.0.25';window.__ctAndroidOfficialVersion='1.0.25';window.__ctAndroidOfficialCode=10067;",
"window.__ctWebBuild='1.0.26';window.__ctOfficialVersion='1.0.26';window.__ctAndroidOfficialVersion='1.0.26';window.__ctAndroidOfficialCode=10068;",'version');
js=js.replaceAll('CineTracker • v1.0.25','CineTracker • v1.0.26')
.replaceAll("JSON.stringify({version:'1.0.25',revision:REVISION","JSON.stringify({version:'1.0.26',revision:REVISION")
.replaceAll("window.__ctAndroidRelease='1.0.25'","window.__ctAndroidRelease='1.0.26'");
const patch=await readFile(resolve(root,'apps/android/runtime-r268-v1026-consolidated.js'),'utf8');
for(const need of ['__ctR268AndroidV1026','ct186Select=function(data)','ct268-f1-overview'])if(!patch.includes(need))throw Error('r268 patch missing '+need);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(bad))throw Error('r268 forbidden '+bad);
if(!js.includes('\nboot();'))throw Error('r268 boot insertion point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,at)+'<script data-ct-android="r268-android-js">'+js+'</script>'+html.slice(close+'</script>'.length);
html=html.replaceAll('ct-android-v1025','ct-android-v1026').replaceAll('content="1.0.25"','content="1.0.26"');
for(const need of ['r268-android-js',"window.__ctAndroidOfficialCode=10068",'ct186SaveDaily268','ct268-f1-overview','data-ct237-swap'])if(!html.includes(need))throw Error('r268 release missing '+need);
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_26_READY Daily rotate + strict seven slots + compact F1 podium + preserved Android native');
