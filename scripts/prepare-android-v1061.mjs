import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1060.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r302-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Android 1.0.60 baseline missing');
let js=html.slice(a+tag.length,b);
function once(s,old,next,label){const n=s.split(old).length-1;if(n!==1)throw Error('r303 '+label+' found '+n+' expected one');return s.replace(old,next)}
js=once(js,"const REVISION='r302-android-official-1.0.60';","const REVISION='r303-android-official-1.0.61';",'revision');
js=once(js,"window.__ctWebBuild='1.0.60';window.__ctOfficialVersion='1.0.60';window.__ctAndroidOfficialVersion='1.0.60';window.__ctAndroidOfficialCode=10102;",
 "window.__ctWebBuild='1.0.61';window.__ctOfficialVersion='1.0.61';window.__ctAndroidOfficialVersion='1.0.61';window.__ctAndroidOfficialCode=10103;",'metadata');
const start=js.indexOf('/* Android 1.0.36 r278 — ONLY Descobrir > Pra Você.');
const end=js.indexOf('/* CineTracker Android 1.0.37/r279',start);
if(start<0||end<=start)throw Error('r278 authenticated owner not found');
let r278=js.slice(start,end);
r278=once(r278,
 'function selectedData(){return ct186ForYouData||ct166ForYouData||null}',
 'function selectedData(){return window.__ctR303SinglePaint?.data?.()||window.__ctR293Gate?.data?.()||ct186ForYouData||ct166ForYouData||null}',
 'pin audited data when legacy network callbacks change the global pool');
r278=once(r278,
 "let owner=actualUser(),auditing=null,viewEpoch=-1,lastForYouRoot=null;",
 "let owner=actualUser(),auditing=null,viewEpoch=-1,lastForYouRoot=null,paintedRoot=null,paintedAccount='';",'stable scene');
r278=once(r278,
 " const root=q('[data-discover-content]');\n if(root!==lastForYouRoot){picked.clear();lastForYouRoot=root}\n viewEpoch=window.__ctR286VisitEpoch;",
 " const root=q('[data-discover-content]');\n if(root!==lastForYouRoot){picked.clear();lastForYouRoot=root;paintedRoot=null}\n if(root===paintedRoot&&paintedAccount===currentUser&&root?.querySelectorAll('[data-ct241-slot-key]').length===7)return;\n viewEpoch=window.__ctR286VisitEpoch;",'no passive 7-slot reselection');
r278=once(r278,
 "  controls(slot,key,candidate,1+pool.filter(x=>!occupiedOthers.has(mediaRef(x))&&!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x)).length);\n }\n}",
 "  controls(slot,key,candidate,1+pool.filter(x=>!occupiedOthers.has(mediaRef(x))&&!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x)).length);\n }\n if(root.querySelectorAll('[data-ct241-slot-key]').length===7){paintedRoot=root;paintedAccount=currentUser}\n}",
 'mark initial scene stable');
const optimistic=[
 ' ct186LocalBlocked.add(ref);',
 ' picked.delete(key);',
 ' const successor=ct300Choice(candidates(key,ref));',
 ' if(successor){const successorRef=mediaRef(successor);picked.set(key,successorRef);takeSeen(key,successorRef);changeOne(key)}',
 ' else emptySlot(live,key);',
 ' try{'
].join('\n');
r278=once(r278,
 " ct186LocalBlocked.add(ref);\n picked.delete(key);\n reconcile();\n try{",
 optimistic,'single-slot watched optimistic mutation');
r278=once(r278,
 "  ct186LocalBlocked.delete(ref);\n  picked.set(key,ref);\n  try{toast(String(error?.message||'Não foi possível atualizar'))}catch{}",
 "  ct186LocalBlocked.delete(ref);\n  picked.set(key,ref);\n  changeOne(key);\n  try{toast(String(error?.message||'Não foi possível atualizar'))}catch{}",
 'rollback touched card only');
r278=once(r278,
 "  busy.delete(key);\n  schedule();\n }\n}",
 "  busy.delete(key);\n  changeOne(key);\n }\n}",
 'no global repaint after watched');
js=js.slice(0,start)+r278+js.slice(end);
// r286's authenticated refill MUST use the same pinned data object that
// r278 uses, rather than a global reassigned by obsolete async callbacks.
js=once(js,"if(!visible()||!uid()||!ct186ForYouData)return false;",
 "if(!visible()||!uid()||!(window.__ctR303SinglePaint?.data?.()||ct186ForYouData))return false;",'r286 refill guarded pool');
js=once(js,"const account=uid(),data=ct186ForYouData,epoch=window.__ctR286VisitEpoch;",
 "const account=uid(),data=window.__ctR303SinglePaint?.data?.()||ct186ForYouData,epoch=window.__ctR286VisitEpoch;",'r286 refill captured authenticated pool');
js=once(js,"if(uid()!==account||ct186ForYouData!==data||epoch!==window.__ctR286VisitEpoch)return false;",
 "if(uid()!==account||(window.__ctR303SinglePaint?.data?.()||ct186ForYouData)!==data||epoch!==window.__ctR286VisitEpoch)return false;",'r286 no cross-scene refill');
js=once(js,"if(uid()!==account||ct186ForYouData!==data)return false;",
 "if(uid()!==account||(window.__ctR303SinglePaint?.data?.()||ct186ForYouData)!==data)return false;",'r286 post-audit scene validation');

const single=[
 '/* Android r303: absolute single-paint owner for authenticated Pra Voce */',
 "(()=>{'use strict';",
 'if(window.__ctR303SinglePaint)return;',
 'const former=paintDiscover;',
 "const active=()=>route()==='discover'&&discoverState?.tab==='foryou'&&!!(session?.user?.id||user?.id);",
 "const verified=data=>Boolean(data?.__ct288Canonical===true&&data?.__ct283ServerAudited===true&&data?._ct186_fresh&&data?._ct186_watchlist);",
 "let owner='',lastRoot=null,lastNav=-1,sceneData=null,paints=0,suppressed=0;",
 'paintDiscover=function(data,...args){',
 ' if(!active())return former.apply(this,arguments);',
 ' if(!verified(data)){suppressed++;return null}',
 " const uid=String(session?.user?.id||user?.id||''),root=document.querySelector('[data-discover-content]');",
 ' if(!root)return null;',
 " const ready=root.querySelectorAll('[data-ct241-slot-key]').length===7;",
 ' if(uid===owner&&root===lastRoot&&lastNav===navSeq&&ready){suppressed++;return null}',
 " const holder=document.createElement('div');",
 ' holder.innerHTML=ct186RenderForYou(data);',
 ' ct186ForYouData=data;ct166ForYouData=data;',
 ' root.replaceChildren(...Array.from(holder.childNodes));',
 ' // Mount every real action in the same turn, before the first browser paint.',
 ' window.__ctR278Test?.reconcile?.();',
 ' owner=uid;lastRoot=root;lastNav=navSeq;sceneData=data;paints++;',
 " root.dataset.ct303SingleOwner='1';",
 " document.documentElement.dataset.ct303ForYou='one-direct-paint-per-view';",
 ' window.__ctR293Gate?.commit?.(data,root);',
 ' return true;',
 '};',
 "const style=document.createElement('style');style.id='ct303-no-foryou-animations';",
 "style.textContent='[data-discover-content] [data-ct241-slot-key],'+",
 " '[data-discover-content] [data-ct241-slot-key] .discover-card,'+",
 " '[data-discover-content] [data-ct241-slot-key] .ct277-actions,'+",
 " '[data-discover-content] [data-ct241-slot-key] .ct277-control'+",
 " '{animation:none!important;transition:none!important}';",
 'document.head.appendChild(style);',
 'window.__ctR303SinglePaint={stats:()=>({paints,suppressed,owner,slots:lastRoot?.querySelectorAll("[data-ct241-slot-key]")?.length||0}),data:()=>active()&&String(session?.user?.id||user?.id||\'\')===owner&&document.querySelector(\'[data-discover-content]\')===lastRoot&&navSeq===lastNav?sceneData:null,active,verified};',
 '})();'
].join('\n')+'\n';
js=once(js,'boot();\n})();',single+'boot();\n})();','install final painter before boot');
js=js.replaceAll('CineTracker • v1.0.60','CineTracker • v1.0.61')
 .replaceAll("JSON.stringify({version:'1.0.60',revision:REVISION","JSON.stringify({version:'1.0.61',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.60'","window.__ctAndroidRelease='1.0.61'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r303-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1060','ct-android-v1061').replaceAll('content="1.0.60"','content="1.0.61"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_61_READY: no 26 legacy painter wrappers on authenticated Pra Voce; one direct first paint, passive callbacks ignored, Seen and Trocar update one slot. Web/Sports/WWE/F1 unchanged.');
