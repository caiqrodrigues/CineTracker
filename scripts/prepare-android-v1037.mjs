import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1036.mjs')],{cwd:root,stdio:'inherit'});
execFileSync(process.execPath,[resolve(root,'scripts/test-android-v1036.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r278-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('r279 requires validated Android v1.0.36 runtime');
let js=html.slice(a+tag.length,b);
function once(from,to,label){
 const count=js.split(from).length-1;
 if(count!==1)throw Error('r279 '+label+': required one exact anchor, found '+count);
 js=js.replace(from,to);
}
const legacySpecial="window.addEventListener('pointerdown',e=>{const c=e.target?.closest?.('[data-ct263-special]');if(!c)return;e.preventDefault();e.stopImmediatePropagation();void openSpecial263(String(c.dataset.ct263Special||''))},true);";
const tapGesture="/* Only open a special-series card after a confirmed tap. */\nlet ct279SpecialPointer=null;\nwindow.addEventListener('pointerdown',e=>{\n const card=e.target?.closest?.('[data-ct263-special]');\n if(!card||route263()!=='home'||e.isPrimary===false){ct279SpecialPointer=null;return}\n const scrolling=card.closest('.home-viewport')||document.scrollingElement;\n ct279SpecialPointer={card,pointerId:e.pointerId,x:e.clientX,y:e.clientY,t:Date.now(),\n  scroll:scrolling,scrollTop:Number(scrolling?.scrollTop||0),moved:false,up:false};\n},true);\nwindow.addEventListener('pointermove',e=>{\n const p=ct279SpecialPointer;if(!p||p.pointerId!==e.pointerId)return;\n if(Math.hypot(Number(e.clientX)-p.x,Number(e.clientY)-p.y)>10)p.moved=true;\n},true);\nwindow.addEventListener('pointerup',e=>{\n const p=ct279SpecialPointer;if(!p||p.pointerId!==e.pointerId)return;\n if(Math.hypot(Number(e.clientX)-p.x,Number(e.clientY)-p.y)>10)p.moved=true;\n if(Math.abs(Number(p.scroll?.scrollTop||0)-p.scrollTop)>4)p.moved=true;\n p.up=true;\n},true);\nwindow.addEventListener('pointercancel',()=>{ct279SpecialPointer=null},true);\nwindow.addEventListener('click',e=>{\n const card=e.target?.closest?.('[data-ct263-special]');\n if(!card||route263()!=='home')return;\n e.preventDefault();e.stopImmediatePropagation();\n const p=ct279SpecialPointer;\n const keyboard=e.detail===0;\n const tapped=keyboard||(p&&p.up&&p.card===card&&!p.moved&&Date.now()-p.t<800\n  &&Math.abs(Number(p.scroll?.scrollTop||0)-p.scrollTop)<=4);\n ct279SpecialPointer=null;\n if(tapped)void openSpecial263(String(card.dataset.ct263Special||''));\n},true);\nwindow.addEventListener('keydown',e=>{\n const card=e.target?.closest?.('[data-ct263-special]');\n if(!card||route263()!=='home'||(e.key!=='Enter'&&e.key!==' '))return;\n e.preventDefault();e.stopImmediatePropagation();\n void openSpecial263(String(card.dataset.ct263Special||''));\n},true);";
once(legacySpecial,tapGesture,'special-card opens on pointerdown during scroll');
const oldExpansion="const base=Array.isArray(candidates)?candidates.filter(x=>contentAllowed(x,key,ctx)&&!rejected.has(mediaRef(x))):[];";
const newExpansion="try{await window.__ctR279Audit?.auditCandidates(candidates)}catch{}\\n  const base=Array.isArray(candidates)?candidates.filter(x=>contentAllowed(x,key,ctx)&&!rejected.has(mediaRef(x))&&window.__ctR279Audit?.permitted(x,false)):[];".replace('\\n','\n');
once(oldExpansion,newExpansion,'expanded recommendation pool requires v525 audit before Trocar');
once("const REVISION='r278-android-official-1.0.36';","const REVISION='r279-android-official-1.0.37';",'revision');
once("window.__ctWebBuild='1.0.36';window.__ctOfficialVersion='1.0.36';window.__ctAndroidOfficialVersion='1.0.36';window.__ctAndroidOfficialCode=10078;",
"window.__ctWebBuild='1.0.37';window.__ctOfficialVersion='1.0.37';window.__ctAndroidOfficialVersion='1.0.37';window.__ctAndroidOfficialCode=10079;",'Android version');
js=js.replaceAll('CineTracker • v1.0.36','CineTracker • v1.0.37')
 .replaceAll("JSON.stringify({version:'1.0.36',revision:REVISION","JSON.stringify({version:'1.0.37',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.36'","window.__ctAndroidRelease='1.0.37'");
const patch=await readFile(resolve(root,'apps/android/runtime-r279-v1037-server-audit.js'),'utf8');
for(const needed of ['__ctR279AndroidV1037','cinetracker_recommendation_filter_v525','auditCandidates','watchlisted','checked'])if(!patch.includes(needed))throw Error('r279 audit missing '+needed);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(forbidden))throw Error('r279 forbidden '+forbidden);
if(!js.includes('\nboot();'))throw Error('r279 boot injection point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r279-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1036','ct-android-v1037').replaceAll('content="1.0.36"','content="1.0.37"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_37_READY verified user-specific v525 exclusions and drag-safe UFC WWE F1 cards; web untouched');
