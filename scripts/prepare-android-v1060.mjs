import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

// This release changes no business rules, TMDB pools, Sports or WWE.
// It removes redundant DOM writers instead of adding another renderer.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1059.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r301-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('r302: Android 1.0.59 baseline not embedded');
let js=html.slice(a+tag.length,b);
function one(s,from,to,label){
 const hits=s.split(from).length-1;
 if(hits!==1)throw Error('r302 '+label+': expected 1 target, found '+hits);
 return s.replace(from,to);
}
function scoped(begin,end,patch,label){
 const start=js.indexOf(begin),finish=start<0?-1:js.indexOf(end,start+begin.length);
 if(start<0||finish<=start)throw Error('r302 '+label+': module boundaries missing');
 const before=js.slice(start,finish),after=patch(before);
 if(before===after)throw Error('r302 '+label+': no modifications');
 js=js.slice(0,start)+after+js.slice(finish);
}

js=one(js,"const REVISION='r301-android-official-1.0.59';",
 "const REVISION='r302-android-official-1.0.60';",'revision');
js=one(js,"window.__ctWebBuild='1.0.59';window.__ctOfficialVersion='1.0.59';window.__ctAndroidOfficialVersion='1.0.59';window.__ctAndroidOfficialCode=10101;",
 "window.__ctWebBuild='1.0.60';window.__ctOfficialVersion='1.0.60';window.__ctAndroidOfficialVersion='1.0.60';window.__ctAndroidOfficialCode=10102;",'native version');

// Existing authenticated r278 is the only component allowed to change
// a recommendation card after first paint. No new renderer is introduced.
scoped('/* Android 1.0.36 r278 — ONLY Descobrir > Pra Você.',
 '/* CineTracker Android 1.0.37/r279',
 section=>one(section,
 ' if(isVisible())schedule();\n return result;\n};',
 ' if(isVisible()&&!window.__ctR293Gate?.locked?.())schedule();\n return result;\n};',
 'stop post-commit r278 reconcile from historic painter'),
 'r278 owner');

// Previously the r284 fetcher tried to reselect seven cards every time it
// suppressed a redundant network response. That is the user's observed
// tremedeira: pool resolution MUST NOT repaint the already selected cards.
scoped('/* CineTracker Android 1.0.42 / r284',
 '/* CineTracker Android r285',
 section=>{
  section=one(section,
   '  queueMicrotask(()=>{try{window.__ctR278Test?.reconcile?.()}catch{}});\n  document.documentElement.dataset.ct291SuppressedRepaint=',
   '  document.documentElement.dataset.ct291SuppressedRepaint=',
   'remove r284 redundant seven-card reconciliation');
  section=one(section,
   ' const result=await loadRecommendations(true);\n if(isForYou())renderData(result);\n return result;',
   ' return loadRecommendations(true);',
   'remove duplicate full render after authenticated fetch');
  return section;
 },'r284 data source');

// r288 already paints once through its original first-paint path;
// its extra animation-frame reconcile executes AFTER r278 and may undo Trocar.
scoped('/* CineTracker Android 1.0.46/r288',
 '/* CineTracker Android r289',
 section=>{
  const from='  requestAnimationFrame(()=>{\n   if(!active()||ct186ForYouData!==stable)return;\n   try{window.__ctR278Test?.reconcile?.()}catch(e){\n    document.documentElement.dataset.ct288ReconcileError=String(e?.message||e)\n   }\n  });\n';
  return one(section,from,'','remove r288 delayed full-slot reconcile');
 },'r288 last after-paint writer');

// r293 retains the verified whole-structure DOM for true legacy HTML
// replacements. It must not listen to every routine click/data event or
// trigger another recommendation selection during a repair.
scoped('/* CineTracker Android 1.0.51/r293 — absolute final owner',
 '/* Android r294',
 section=>{
  section=one(section,
   ' if(ct294Restored)try{window.__ctR278Test?.reconcile?.()}catch(e){\n  document.documentElement.dataset.ct293ReconcileError=String(e?.message||e)\n }\n',
   '',
   'no random reselection when restoring verified DOM nodes');
  section=one(section,
   ' paintBlockCount++;\n restoreData();schedule();\n document.documentElement.dataset.ct293BlockedPaints=',
   ' paintBlockCount++;\n restoreData();\n document.documentElement.dataset.ct293BlockedPaints=',
   'blocked legacy paint should not repaint');
  section=one(section,
   ' routeBlockCount++;\n restoreData();schedule();\n document.documentElement.dataset.ct293BlockedRouteRenders=',
   ' routeBlockCount++;\n restoreData();\n document.documentElement.dataset.ct293BlockedRouteRenders=',
   'blocked route repaint should not repaint');
  const from=section.indexOf("document.addEventListener('click',event=>{");
  const to=section.indexOf("// A stale async callback can change the dataset",from);
  if(from<0||to<=from)throw Error('r302 r293 click/data listeners not found');
  section=section.slice(0,from)+
   "// r302: ordinary clicks/data-changed are owned by r278. Structural\n"+
   "// MutationObserver protects verified slots only when legacy DOM actually changes.\n"+
   "window.addEventListener('popstate',()=>{clearIfLeaving()},false);\n"+
   section.slice(to);
  return section;
 },'r293 structural gate');

// Keep footer and diagnostics tied only to the binary's actual revision.
js=js.replaceAll('CineTracker • v1.0.59','CineTracker • v1.0.60')
 .replaceAll("JSON.stringify({version:'1.0.59',revision:REVISION","JSON.stringify({version:'1.0.60',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.59'","window.__ctAndroidRelease='1.0.60'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r302-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1059','ct-android-v1060').replaceAll('content="1.0.59"','content="1.0.60"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_60_READY: one canonical initial painter and one local action owner; removed competing r284/r288/r293 reconciliation callbacks. No Web, Supabase, Sports, WWE, or selection rules changed.');
