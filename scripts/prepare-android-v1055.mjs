import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1054.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r296-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Android 1.0.54 runtime unavailable');
let js=html.slice(a+tag.length,b);
function once(from,to,label){
 const count=js.split(from).length-1;
 if(count!==1)throw Error('Android r297 '+label+': expected one match, got '+count);
 js=js.replace(from,to);
}
once("const REVISION='r296-android-official-1.0.54';",
 "const REVISION='r297-android-official-1.0.55';",'revision');
once("window.__ctWebBuild='1.0.54';window.__ctOfficialVersion='1.0.54';window.__ctAndroidOfficialVersion='1.0.54';window.__ctAndroidOfficialCode=10096;",
 "window.__ctWebBuild='1.0.55';window.__ctOfficialVersion='1.0.55';window.__ctAndroidOfficialVersion='1.0.55';window.__ctAndroidOfficialCode=10097;",'metadata');

const start=js.indexOf('/* CineTracker Android 1.0.42 / r284');
const end=js.indexOf('/* CineTracker Android r285',start);
if(start<0||end<=start)throw Error('Authenticated r284 recommendations module not found');
let module=js.slice(start,end);
function patch(from,to,label){
 const count=module.split(from).length-1;
 if(count!==1)throw Error('Android r297 '+label+': expected one match, got '+count);
 module=module.replace(from,to);
}
// v525 screens each initial candidate against the current user's watched
// episodes and manual states. A smaller FIRST batch prevents six oversized
// concurrent candidate reads + too many large v525 audit batches.
// r278 retains its bounded, authenticated refill when the user taps Trocar.
patch("const limit=group==='watchlist'?30:48;",
 "const limit=group==='watchlist'?16:24;",'bounded initial pools');
patch('if(found.length||attempt===1)return found;',
 'return found;','a legitimately empty Watchlist is not a request failure');
patch('await new Promise(resolve=>setTimeout(resolve,300));',
 'await new Promise(resolve=>setTimeout(resolve,150));','bounded error retry');

// The old r284 error returned an unaudited empty data object. The r293
// canonical painter correctly refused it, leaving "Carregando títulos..."
// on screen forever. Report the failure INSIDE Pra Você instead, with a
// scoped retry that preserves navigation and every other app screen.
const message=String.raw`
function ct297Status(label){
 if(!isForYou()||!owner())return;
 const target=document.querySelector('[data-discover-content]');
 if(!target||target.querySelector('[data-ct241-slot-key]'))return;
 target.innerHTML='<section class="panel ct297-foryou-status"><div class="panel-head"><h2>Pra Você</h2></div>'+
 '<p>'+label+'</p><button type="button" class="btn" data-ct297-retry>Tentar novamente</button></section>';
}
`;
patch('function moreThanZero(data){',message+'function moreThanZero(data){','explicit loading failure state');
patch('  if(moreThanZero(next)){\n   const auditor=',
 "  if(!moreThanZero(next)){\n   document.documentElement.dataset.ct284ForYou='empty';\n   ct297Status('Nenhuma indicação elegível foi recebida. Tente novamente.');\n   return next;\n  }\n  if(moreThanZero(next)){\n   const auditor=",'empty pools cannot leave a perpetual spinner');
patch("if(isForYou())document.documentElement.dataset.ct284ForYou='retry';",
 "if(isForYou()){\n   document.documentElement.dataset.ct284ForYou='retry';\n   ct297Status('Não foi possível carregar as indicações agora.');\n  }",'error shows retry rather than invisible noncanonical data');
patch('const oldDiscover=discoverRows;',
`
document.addEventListener('click',event=>{
 const button=event.target?.closest?.('[data-ct297-retry]');
 if(!button||!isForYou()||!owner()||button.disabled)return;
 event.preventDefault();event.stopImmediatePropagation();
 button.disabled=true;
 const panel=document.querySelector('[data-discover-content]');
 if(panel)panel.innerHTML='<section class="panel ct297-foryou-status"><p>Atualizando indicações...</p></section>';
 // All six v421 categories and the v525 audit are still authenticated.
 // This never calls render(), setApp(), router.refresh() or a page reload.
 void loadRecommendations(true);
},true);
const oldDiscover=discoverRows;`, 'isolated asynchronous retry');
js=js.slice(0,start)+module+js.slice(end);
js=js.replaceAll('CineTracker • v1.0.54','CineTracker • v1.0.55')
 .replaceAll("JSON.stringify({version:'1.0.54',revision:REVISION","JSON.stringify({version:'1.0.55',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.54'","window.__ctAndroidRelease='1.0.55'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r297-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1054','ct-android-v1055')
 .replaceAll('content="1.0.54"','content="1.0.55"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_55_READY: smaller server-audited candidate batches, no empty-category refetch, explicit retry for failed/empty Pra Voce, no Web modification.');
