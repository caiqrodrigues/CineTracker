import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1055.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r297-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw Error('Android 1.0.55 baseline unavailable');
let js=html.slice(a+marker.length,b);
function replaceOnce(source,from,to,label){
 const matches=source.split(from).length-1;
 if(matches!==1)throw Error('r298 '+label+': expected one match, got '+matches);
 return source.replace(from,to);
}
js=replaceOnce(js,"const REVISION='r297-android-official-1.0.55';",
 "const REVISION='r298-android-official-1.0.56';",'revision');
js=replaceOnce(js,
 "window.__ctWebBuild='1.0.55';window.__ctOfficialVersion='1.0.55';window.__ctAndroidOfficialVersion='1.0.55';window.__ctAndroidOfficialCode=10097;",
 "window.__ctWebBuild='1.0.56';window.__ctOfficialVersion='1.0.56';window.__ctAndroidOfficialVersion='1.0.56';window.__ctAndroidOfficialCode=10098;",'metadata');
const start=js.indexOf('/* Android 1.0.36 r278 — ONLY Descobrir > Pra Você.');
const end=js.indexOf('/* CineTracker Android 1.0.37/r279',start);
if(start<0||end<=start)throw Error('r278 authenticated seven-card interaction owner missing');
let controller=js.slice(start,end);
function patch(from,to,label){controller=replaceOnce(controller,from,to,label)}

// Prevent a background reconciliation from changing a legitimately selected
// card just because the epoch changed without changing the visible DOM.
patch('let owner=actualUser(),auditing=null,viewEpoch=-1;',
 'let owner=actualUser(),auditing=null,viewEpoch=-1,lastForYouRoot=null;',
 'stable navigation identity');
patch(" if(viewEpoch!==window.__ctR286VisitEpoch){viewEpoch=window.__ctR286VisitEpoch;picked.clear()}\n const root=q('[data-discover-content]');",
 " const root=q('[data-discover-content]');\n if(root!==lastForYouRoot){picked.clear();lastForYouRoot=root}\n viewEpoch=window.__ctR286VisitEpoch;",
 'do not reset selected cards on redundant background fetch');

// Keep the current valid card and its DOM instead of picking an unseen
// candidate whenever older async listeners request reconciliation.
patch("  let candidate=usable.find(x=>mediaRef(x)===override)||\n   usable.find(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x)&&mediaRef(x)===mediaRef(suggested[key]))||",
 "  let candidate=usable.find(x=>mediaRef(x)===override)||\n   usable.find(x=>mediaRef(x)===mediaIn(slot))||\n   usable.find(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x)&&mediaRef(x)===mediaRef(suggested[key]))||",
 'stable card priority');

// Trocar may only return unseen candidates. Never recycle the same title or
// an already shown alternative when the pool is exhausted; the existing
// authenticated bounded refill stays in place and then gives a clear toast.
patch(" if(newRows.length)return newRows;\n const allowed=available.filter(x=>!blockedMemory(key,x));return allowed.length?allowed:available;",
 " return newRows;",
 'do not repeat prior Trocar choices');

// Disabling/re-enabling action buttons must not rebuild their HTML. This
// was causing visible trembling and scroll/layout changes on rapid taps.
patch(" const fingerprint=ref+'|'+key+'|'+nChoices+'|'+(busy.has(key)?'busy':'ready');\n if(bar.dataset.ct277Fingerprint===fingerprint)return;",
 " const fingerprint=ref+'|'+key;\n if(bar.dataset.ct277Fingerprint===fingerprint){\n  for(const button of bar.querySelectorAll('button[data-ct277-action]')){\n   const disabled=busy.has(key);\n   if(button.disabled!==disabled)button.disabled=disabled;\n  }\n  return;\n }",
 'no action bar remount on busy flip');

js=js.slice(0,start)+controller+js.slice(end);
js=js.replaceAll('CineTracker • v1.0.55','CineTracker • v1.0.56')
 .replaceAll("JSON.stringify({version:'1.0.55',revision:REVISION","JSON.stringify({version:'1.0.56',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.55'","window.__ctAndroidRelease='1.0.56'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r298-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1055','ct-android-v1056')
 .replaceAll('content="1.0.55"','content="1.0.56"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_56_READY: no action bar remount on busy changes, stable reconciled card, no previously shown swap candidate; only embedded Android runtime changed.');
