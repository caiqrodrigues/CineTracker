import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1050.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r292-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Android r292 validated baseline missing');
let js=html.slice(a+tag.length,b);
const replace=(before,after,reason)=>{
 const count=js.split(before).length-1;
 if(count!==1)throw Error('r293 '+reason+' expected one match, found '+count);
 js=js.replace(before,after);
};
replace("const REVISION='r292-android-official-1.0.50';",
 "const REVISION='r293-android-official-1.0.51';",'version');
replace("window.__ctWebBuild='1.0.50';window.__ctOfficialVersion='1.0.50';window.__ctAndroidOfficialVersion='1.0.50';window.__ctAndroidOfficialCode=10092;",
 "window.__ctWebBuild='1.0.51';window.__ctOfficialVersion='1.0.51';window.__ctAndroidOfficialVersion='1.0.51';window.__ctAndroidOfficialCode=10093;",'android metadata');
// ESSENTIAL: the original r158 paintDiscover DOM sink is still reachable via
// saved originalPaint references in r279, r281 and r282. Wrapping the LATEST
// paintDiscover alone never intercepted those asynchronous callbacks.
replace(
 "function paintDiscover(rows){\n  const h=$('[data-discover-content]');if(!h)return;if(discoverState.tab==='foryou'){h.innerHTML=renderForYou158(rows||{});return}",
 "function paintDiscover(rows){\n  if(discoverState.tab==='foryou'&&window.__ctR293Gate?.shouldBlockPaint?.(rows))return;\n  const h=$('[data-discover-content]');if(!h)return;if(discoverState.tab==='foryou'){h.innerHTML=renderForYou158(rows||{});window.__ctR293Gate?.afterPaint?.(rows,h);return}",
 'original r158 DOM sink');
// Realtime mutation / previous screens used to call renderDiscover which
// replaces the entire shell BEFORE painting. Block ONLY when seven correct
// cards are already live, without blocking the initial page/login or tabs.
replace(
 "async function renderDiscover(seq){\n  if(discoverState.tab==='foryou')",
 "async function renderDiscover(seq){\n  if(discoverState.tab==='foryou'&&window.__ctR293Gate?.beforeRoute?.())return;\n  if(discoverState.tab==='foryou')",
 'original r158 route renderer');
// Stop the async r279 server-auditor from directly calling its historical
// painter reference. It must defer to the live original DOM sink guard.
replace("try{originalPaint.call(this,d)}finally{pendingRepaint=false}",
 "try{if(!window.__ctR293Gate?.locked?.())paintDiscover(d)}finally{pendingRepaint=false}",
 'r279 late audit paint');
replace(
 "window.addEventListener('cinetracker:data-changed',()=>{\n // The canonical Dashboard and user-specific v525 RPC",
 "window.addEventListener('cinetracker:data-changed',()=>{\n if(window.__ctR293Gate?.locked?.()){window.__ctR293Gate.restoreData();return;}\n // The canonical Dashboard and user-specific v525 RPC",
 'r279 avoid post-Watchlist full refresh');
// Root fix: legacy r116 copies stale authenticated Watchlist HTML into the
// three slots after an asynchronous request, bypassing ALL paintDiscover
// wrappers. The final v421/v525 renderer owns these slots exclusively.
replace(
 "async function hydrateWatch116(force=false){\n try{",
 "async function hydrateWatch116(force=false){\n if(window.__ctR293Gate&&route()==='discover'&&discoverState?.tab==='foryou')return;\n try{",
 'r116 async Watchlist HTML overwrite');
// r282's independent TMDB category callbacks directly overwrite the
// authoritative pool, even without a click, commonly after ~5 seconds.
replace(
 "function display(s){\n if(!visible(s))return;",
 "function display(s){\n if(window.__ctR293Gate&&route()==='discover'&&discoverState?.tab==='foryou')return;\n if(!visible(s))return;",
 'r282 late TMDB display');
// Keep the per-slot Optimistic UI context alive when +Watchlist persists.
// invalidate196 otherwise nulls all context and dispatches a global update.
replace(
 "function invalidate196(){\n  try{homeCache=null}catch{}",
 "function invalidate196(){\n  if(window.__ctR293Gate&&route()==='discover'&&discoverState?.tab==='foryou'){\n   homeCache=null;profileCache=null;discoverCache.clear();ct171SeenMap=null;\n   document.documentElement.dataset.ct293WatchlistUpdate='in-place';return;\n  }\n  try{homeCache=null}catch{}",
 'r196 Watchlist optimistic local mutation');
// Supabase realtime currently triggers ct186RefreshVisible 120ms after
// +Watchlist, recreating the old page. Update the picked card only.
replace(
 "function ct186RealtimeChange(table,data){\n  if(!ct186RealtimeRelevant(table,data))return;",
 "function ct186RealtimeChange(table,data){\n  if(!ct186RealtimeRelevant(table,data))return;\n  if(window.__ctR293Gate&&route()==='discover'&&discoverState?.tab==='foryou'){\n   const x=data?.record||{},old=data?.old_record||{},id=Number(x.media_id||old.media_id||0);\n   if(id>0&&String(data?.type||'')!=='DELETE')void ct186ResolveMediaKey(id).then(ref=>{\n    if(ref){ct186LocalBlocked.add(ref);try{window.__ctR278Test?.reconcile?.()}catch{}}\n   }).catch(()=>{});\n   document.documentElement.dataset.ct293Realtime='local-only';return;\n  }",
 'r186 realtime avoid full visible refetch');
// r284 global invalidator was still able to discard the v525 source.
replace(
 "window.addEventListener('cinetracker:data-changed',()=>{\n if(isForYou()&&window.__ctR289DiscoverV1047",
 "window.addEventListener('cinetracker:data-changed',()=>{\n if(window.__ctR293Gate&&isForYou()){historyStamp=0;return;}\n if(isForYou()&&window.__ctR289DiscoverV1047",
 'r284 prevent global recommendation invalidation');
const patch=(await readFile(resolve(root,'apps/android/runtime-r293-v1051-foryou-single-owner.js'),'utf8')).trimEnd();
new Function(patch);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 if(patch.includes(forbidden))throw Error('Forbidden full page action '+forbidden);
replace('\nboot();','\n/* r293 final scoped Discover owner */\ntry{\n'+patch+
 '\n}catch(error){document.documentElement.dataset.ct293StartupError=String(error?.message||error);console.error(error)}\nboot();',
 'final owner before boot');
if(js.indexOf('window.__ctR293Gate=')<js.indexOf('\n})();\n\n/* r264:'))throw Error('r293 final owner injected too early');
js=js.replaceAll('CineTracker • v1.0.50','CineTracker • v1.0.51')
 .replaceAll("JSON.stringify({version:'1.0.50',revision:REVISION","JSON.stringify({version:'1.0.51',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.50'","window.__ctAndroidRelease='1.0.51'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r293-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1050','ct-android-v1051').replaceAll('content="1.0.50"','content="1.0.51"');
await writeFile(path,html,'utf8');
console.log('ANDROID_1_0_51_READY audited v525 DOM sink protected against pre-captured r279/r282 callbacks; Watchlist/Seen update one slot without route shell refresh; Web r541 frozen');
