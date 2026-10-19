import{readFile,writeFile}from'node:fs/promises';
import{resolve}from'node:path';
import{execFileSync}from'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1034.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r276-android-js">',a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('r277 requires exact 1.0.34 baseline');
let js=html.slice(a+tag.length,b);
function one(from,to,where){const n=js.split(from).length-1;if(n!==1)throw Error('r277 '+where+' expected 1 occurrence, got '+n);js=js.replace(from,to)}
// Replace only the Pra Você event owners. Do NOT disable r237 outside the
// seven-slot screen or touch the native, Home, Sports, F1 or Top10 sources.
one("function activateSwap237(e){\n  if(!isForYou237())return;",
    "function activateSwap237(e){\n if(!isForYou237()||window.__ctR277AndroidV1035)return;",'legacy r237 swap');
one("function dress(){\n if(route()!=='discover'||discoverState?.tab!=='foryou')return;",
    "function dress(){\n if(window.__ctR277AndroidV1035||route()!=='discover'||discoverState?.tab!=='foryou')return;",'legacy r275 overlapping buttons');
one(" const button=event.target?.closest?.('[data-ct275-seen]');if(!button)return;",
    " if(window.__ctR277AndroidV1035)return;\n const button=event.target?.closest?.('[data-ct275-seen]');if(!button)return;",'old Seen delegated click');
one(" const button=event.target?.closest?.('[data-ct275-watchlist]');",
    " if(window.__ctR277AndroidV1035)return;\n const button=event.target?.closest?.('[data-ct275-watchlist]');",'old Watchlist delegated click');
one("const dailyHtml=s.daily?'<div class=\"foryou-grid ct166-daily-grid\">'+ct186Slot('Filme',s.daily,'daily:movie',f.movie?.length||0)+'</div>':'<div class=\"empty\">Nenhuma indicação elegível agora.</div>';",
    "const dailyHtml='<div class=\"foryou-grid ct166-daily-grid\">'+ct186Slot('Filme',s.daily,'daily:movie',f.movie?.length||0)+'</div>';","seven slots even when daily eligible pool empty");
one("window.addEventListener('cinetracker:data-changed',()=>{ct186Invalidate();if(route()==='discover'&&discoverState?.tab==='foryou')void ct186RefreshVisible()});",
"window.addEventListener('cinetracker:data-changed',()=>{if(window.__ctR277AndroidV1035&&route()==='discover'&&discoverState?.tab==='foryou')return;ct186Invalidate();if(route()==='discover'&&discoverState?.tab==='foryou')void ct186RefreshVisible()});",
'prevent page-scale refresh on seven-slot action');
one("function ct186Block(type,id){id=Number(id||0);if(!(id>0))return;ct186LocalBlocked.add((type==='movie'?'movie':'tv')+':'+id);ct186PaintCurrent()}",
"function ct186Block(type,id){id=Number(id||0);if(!(id>0))return;ct186LocalBlocked.add((type==='movie'?'movie':'tv')+':'+id);if(!(window.__ctR277AndroidV1035&&route()==='discover'&&discoverState?.tab==='foryou'))ct186PaintCurrent()}",
'optimistic local watchlist and seen without rerendering whole page');
one("function ct186Unblock(type,id){ct186LocalBlocked.delete((type==='movie'?'movie':'tv')+':'+Number(id||0));ct186PaintCurrent()}",
"function ct186Unblock(type,id){ct186LocalBlocked.delete((type==='movie'?'movie':'tv')+':'+Number(id||0));if(!(window.__ctR277AndroidV1035&&route()==='discover'&&discoverState?.tab==='foryou'))ct186PaintCurrent()}",
'rollback only clicked slot');
one("const REVISION='r276-android-official-1.0.34';","const REVISION='r277-android-official-1.0.35';",'revision');
one("window.__ctWebBuild='1.0.34';window.__ctOfficialVersion='1.0.34';window.__ctAndroidOfficialVersion='1.0.34';window.__ctAndroidOfficialCode=10076;",
"window.__ctWebBuild='1.0.35';window.__ctOfficialVersion='1.0.35';window.__ctAndroidOfficialVersion='1.0.35';window.__ctAndroidOfficialCode=10077;",'release');
js=js.replaceAll('CineTracker • v1.0.34','CineTracker • v1.0.35')
.replaceAll("JSON.stringify({version:'1.0.34',revision:REVISION","JSON.stringify({version:'1.0.35',revision:REVISION")
.replaceAll("window.__ctAndroidRelease='1.0.34'","window.__ctAndroidRelease='1.0.35'");
const patch=await readFile(resolve(root,'apps/android/runtime-r277-v1035-foryou-single-owner.js'),'utf8');
for(const must of ['__ctR277AndroidV1035','data-ct277-action','ct277-control','ct186WatchEligible','ct186FreshEligible','ct277-foryou-single-owner'])if(!patch.includes(must))throw Error('r277 missing '+must);
for(const illegal of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(illegal))throw Error('r277 forbidden '+illegal);
if(!js.includes('\nboot();'))throw Error('r277 boot insertion missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r277-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1034','ct-android-v1035').replaceAll('content="1.0.34"','content="1.0.35"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_35_READY Pra Voce only: 7 filtered cards, one action handler, no double plus, optimistic Watchlist/Seen, in-place Trocar');
