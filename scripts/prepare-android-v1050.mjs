import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1049.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r291-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Missing 1.0.49 source');
let js=html.slice(a+tag.length,b);
function replace(from,to,label){
 const count=js.split(from).length-1;
 if(count!==1)throw Error('r292 '+label+': expected 1 match, found '+count);
 js=js.replace(from,to);
}
replace("const REVISION='r291-android-official-1.0.49';",
 "const REVISION='r292-android-official-1.0.50';",'revision');
replace("window.__ctWebBuild='1.0.49';window.__ctOfficialVersion='1.0.49';window.__ctAndroidOfficialVersion='1.0.49';window.__ctAndroidOfficialCode=10091;",
 "window.__ctWebBuild='1.0.50';window.__ctOfficialVersion='1.0.50';window.__ctAndroidOfficialVersion='1.0.50';window.__ctAndroidOfficialCode=10092;",'metadata');
// Original RPC v540 counts all historical events; the r290 card wrongly used
// s.watched_episodes and s.released_episodes (ONLY this calendar season).
replace(
 "const label=d?.series?seen+'/'+(released||'?')+' · '+(pending?'Faltam '+pending:'Em dia'):'Sincronização pendente';",
 "const historical=countFor263(k);const label=d?.series?(historical?.total?num263(historical.watched).toLocaleString('pt-BR')+' de '+num263(historical.total).toLocaleString('pt-BR')+' episódios assistidos'+(pending?' · '+pending+' recente'+(pending===1?'':'s')+' pendente'+(pending===1?'':'s'):''):'Sincronizando histórico completo'):'Sincronização pendente';",
 'all-time RPC counter rather than single-season counter');
// The old shadow Formula 1 (tmdb -1321137963, poster null) still appears
// as a generic media row. Remove DOM duplicate only; NEVER delete DB data.
replace(
 "for(const el of qa('[data-ct263-special]',view))if(!el.closest('[data-ct290-home-special]'))el.remove();",
 "for(const el of qa('[data-ct263-special]',view))if(!el.closest('[data-ct290-home-special]'))el.remove();\n  removeSpecialDuplicates263('f1');",
 'hide only duplicate legacy F1');
// r290 restored the entire OLD page from cached data on a missing slot;
// it caused Watchlist recommendations to snap back when Trocar was clicked.
replace(
 "previous.call(null,stable);\n   document.documentElement.dataset.ct290Recovered=",
 "window.__ctR278Test?.reconcile?.();\n   document.documentElement.dataset.ct290Recovered=",
 'prohibit stale whole-section Discover repaint');
const extra=await Promise.all([
 readFile(resolve(root,'apps/android/runtime-r292-v1050-home-counter-and-duplicate.js'),'utf8'),
 readFile(resolve(root,'apps/android/runtime-r292-v1050-discover-single-owner.js'),'utf8')
]);
for(const text of extra){
 new Function(text);
 for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
  if(text.includes(forbidden))throw Error('Forbidden r292 action '+forbidden);
}
const guarded=(script,i)=>'/* r292 scoped extension '+i+' */\ntry{\n'+script+'\n}catch(error){document.documentElement.dataset.ct292Module'+i+'Error=String(error?.message||error);console.error(error)}\n';
replace('\nboot();','\n'+extra.map(guarded).join('\n')+'\nboot();','post-owner scoped runtime');
js=js.replaceAll('CineTracker • v1.0.49','CineTracker • v1.0.50')
 .replaceAll("JSON.stringify({version:'1.0.49',revision:REVISION","JSON.stringify({version:'1.0.50',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.49'","window.__ctAndroidRelease='1.0.50'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r292-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1049','ct-android-v1050').replaceAll('content="1.0.49"','content="1.0.50"');
await writeFile(path,html,'utf8');
console.log('ANDROID_1_0_50_READY lifetime UFC WWE F1 NFL episode counters; no duplicate generic Formula 1; canonical Pra Voce never repaints on Trocar; Web r541 frozen');
