import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1056.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r298-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw Error('Android 1.0.56 base script missing');
let js=html.slice(a+marker.length,b);
function once(source,from,to,label){
 const count=source.split(from).length-1;
 if(count!==1)throw Error('Android r299 '+label+' expected one match, got '+count);
 return source.replace(from,to);
}
js=once(js,"const REVISION='r298-android-official-1.0.56';",
           "const REVISION='r299-android-official-1.0.57';",'revision');
js=once(js,"window.__ctWebBuild='1.0.56';window.__ctOfficialVersion='1.0.56';window.__ctAndroidOfficialVersion='1.0.56';window.__ctAndroidOfficialCode=10098;",
           "window.__ctWebBuild='1.0.57';window.__ctOfficialVersion='1.0.57';window.__ctAndroidOfficialVersion='1.0.57';window.__ctAndroidOfficialCode=10099;",'version metadata');

const first=js.indexOf('/* Android 1.0.50 / r292 — one DOM owner');
const second=js.indexOf('/* r293 final scoped Discover owner',first);
if(first<0||second<=first)throw Error('r292 legacy after-action reconciler not found');
let r292=js.slice(first,second);
// Older r292 still woke the r278 renderer at 0/100/350/850/1700/3200 ms
// after every tap AND each network completion. r278 owns each local action;
// r293 guards the seven-slot DOM against true legacy paints.
r292=once(r292,
 "  requestAnimationFrame(()=>{try{window.__ctR278Test?.reconcile?.()}catch{}});\n  return null;",
 "  return null;",
 'no extra reconciliation on blocked legacy paint');
const start292=r292.indexOf('function afterAction(){');
const end292=r292.indexOf('window.__ctR292DiscoverTest=',start292);
if(start292<0||end292<=start292)throw Error('Timed r292 listeners boundaries not found');
r292=r292.slice(0,start292)+
 '// r299: no timed callback, click listener, data listener or discoverRows wrapper.\n'+
 '// Authenticated r278 controls exclusively reconcile their own local changes.\n'+
 r292.slice(end292);
r292=once(r292,
 'window.__ctR292DiscoverTest={syncVisit,reconcile,afterAction,verified,getVisit:()=>visit,getBlocked:()=>blocked,getCommitted:()=>committed};',
 'window.__ctR292DiscoverTest={syncVisit,reconcile,verified,getVisit:()=>visit,getBlocked:()=>blocked,getCommitted:()=>committed};',
 'remove obsolete timer reference');
r292=once(r292,"let visit='',committed=false,blocked=0,generation=0;",
 "let visit='',committed=false,blocked=0;",'remove dead action epoch');
js=js.slice(0,first)+r292+js.slice(second);

const gateA=js.indexOf('/* CineTracker Android 1.0.51/r293 — absolute final owner');
const gateB=js.indexOf('/* Android r294',gateA);
if(gateA<0||gateB<=gateA)throw Error('r293 final DOM gate missing');
let r293=js.slice(gateA,gateB);
// Ignore changes INSIDE authenticated buttons and posters. Still repair
// old painters replacing a complete slot/section/root.
const structural=[
 ' observer=new MutationObserver(records=>{',
 '  if(!same())return;',
 "  const isSlotNode=node=>node?.nodeType===1&&",
 "   (node.matches?.('[data-ct241-slot-key]')||node.querySelector?.('[data-ct241-slot-key]'));",
 '  for(const change of records){',
 '   if(change.target===root){schedule();return}',
 "   if(change.target?.closest?.('[data-ct241-slot-key]'))continue;",
 '   if([...change.addedNodes,...change.removedNodes].some(isSlotNode)){schedule();return}',
 '  }',
 ' });',
 ' observer.observe(root,{childList:true,subtree:true});'
].join('\n');
r293=once(r293,
 " observer=new MutationObserver(()=>{if(same())schedule()});\n observer.observe(root,{childList:true,subtree:true});",
 structural,'structural mutation observer');
js=js.slice(0,gateA)+r293+js.slice(gateB);
js=js.replaceAll('CineTracker • v1.0.56','CineTracker • v1.0.57')
 .replaceAll("JSON.stringify({version:'1.0.56',revision:REVISION","JSON.stringify({version:'1.0.57',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.56'","window.__ctAndroidRelease='1.0.57'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r299-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1056','ct-android-v1057')
 .replaceAll('content="1.0.56"','content="1.0.57"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_57_READY: removed six legacy timer repaints per click and narrowed DOM observation to structural slot replacement; authenticated r278 is sole action owner. Web untouched.');
