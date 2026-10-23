import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Android-only: preserve the tested official 1.0/r321 baseline byte-for-byte
// outside Descobrir > Pra Você and the selected-streaming Top 10 source.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r321.mjs')],{
 cwd:root,stdio:'inherit'
});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r321-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Certified Android 1.0/r321 baseline missing');
let js=html.slice(a+tag.length,b);
function once(from,to,reason){
 const n=js.split(from).length-1;
 if(n!==1)throw Error('Android r322 '+reason+': expected one match, got '+n);
 js=js.replace(from,to);
}
function replaceBlock(start,end,replacement,reason){
 const a=js.indexOf(start),b=a<0?-1:js.indexOf(end,a+start.length);
 if(a<0||b<=a||js.indexOf(start,a+start.length)>=0)throw Error('Android r322 '+reason+': ambiguous boundary');
 js=js.slice(0,a)+replacement+js.slice(b);
}
once("const REVISION='r321-android-official-1.0';",
 "const REVISION='r322-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10122;',
 'window.__ctAndroidOfficialCode=10123;','code');

// Web r464 uses random selection among eligible alternatives. Android r314
// substituted a deterministic taste sort, always putting the same titles first.
// Keep the same six authenticated v421 pools and the v525 audit, but restore
// the Web's random choice and remember past choices for the signed-in account.
replaceBlock('function seenFor(slot){','function setCurrent(slot,item,remember=true){',
`function seenFor(slot){
 if(!excluded.has(slot)){
  let saved=[];
  try{
   const parsed=JSON.parse(localStorage.getItem('ct:r322:shown:'+owner+':'+slot)||'[]');
   if(Array.isArray(parsed))saved=parsed.filter(x=>/^(movie|tv):[1-9]\\d*$/.test(String(x))).slice(-150);
  }catch{}
  excluded.set(slot,new Set(saved));
 }
 return excluded.get(slot);
}
function rememberSeen(slot){
 try{localStorage.setItem('ct:r322:shown:'+owner+':'+slot,
  JSON.stringify([...seenFor(slot)].slice(-150)))}catch{}
}
function randomness(){
 try{if(globalThis.crypto?.getRandomValues){const n=new Uint32Array(1);globalThis.crypto.getRandomValues(n);return n[0]/4294967296}}catch{}
 return Math.random();
}
function choose(slot,skip='',recycle=true){
 const occupied=selectedRefs(slot),seen=seenFor(slot);
 const pool=poolFor(slot).filter(x=>admissible(slot,x)&&
  !occupied.has(identity(x))&&identity(x)!==skip);
 let available=pool.filter(x=>!seen.has(identity(x)));
 if(!available.length&&recycle&&pool.length){seen.clear();available=pool}
 if(!available.length)return null;
 return available[Math.floor(randomness()*available.length)]||null;
}
`, 'Web random rotation and account-scoped no-repeat');
once('if(item){model.selected.set(slot,item);seenFor(slot).add(identity(item));',
 'if(item){model.selected.set(slot,item);seenFor(slot).add(identity(item));rememberSeen(slot);',
 'persist authenticated slot impressions');
once('if(visit!==navSeq){visit=navSeq;serial++;request=null;excluded.clear();model=blank()}',
 'if(visit!==navSeq){visit=navSeq;serial++;request=null;model=blank()}',
 'preserve history of choices across tab revisits');
const swapStart=js.indexOf('async function swap(slot){'),swapEnd=js.indexOf('async function action(type,slot){',swapStart);
if(swapStart<0||swapEnd<=swapStart)throw Error('Android r322 swap boundary missing');
const oldSwap=js.slice(swapStart,swapEnd);
if(!oldSwap.includes('let next=choose(slot,oldKey);')||
   !oldSwap.includes("if(!next){toast('Não há outra indicação elegível neste momento.');return false}"))
 throw Error('Android r322 selected-slot rotation hook changed');
const newSwap=oldSwap.replace('let next=choose(slot,oldKey);',
 'let next=choose(slot,oldKey,false);').replace(
 "if(!next){toast('Não há outra indicação elegível neste momento.');return false}",
 "if(!next)next=choose(slot,oldKey,true);\n  if(!next){toast('Não há outra indicação elegível neste momento.');return false}");
js=js.slice(0,swapStart)+newSwap+js.slice(swapEnd);

const top10=await readFile(resolve(root,'apps/android/runtime-r322-top10-complete.js'),'utf8');
for(const marker of ['MAX_PAGES=15','gate.auditCandidates(toAudit)',
 'gate.permitted(x,false)===true','api.topRows=topRows;'])
 if(!top10.includes(marker))throw Error('Android r322 Top 10 audit missing '+marker);
once('boot();\n})();',top10+'\nboot();\n})();','register complete Top 10 provider source');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r322-android-stable-js">'+
 js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_R322_READY: Web-parity random audited recommendations, account-scoped no-repeat, adaptive audited 10+10 Top 10; Web unchanged.');
