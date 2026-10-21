import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
// Official Android 1.0/r307: strict patches to Home display and Discover > Pra Voce.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r306-home.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r306-android-stable-js">';
const begin=html.indexOf(tag),end=begin<0?-1:html.indexOf('</script>',begin+tag.length);
if(begin<0||end<begin)throw Error('CineTracker 1.0/r306 certified baseline missing');
let js=html.slice(begin+tag.length,end);
function one(from,to,label){
 const hits=js.split(from).length-1;
 if(hits!==1)throw Error('Android 1.0/r307 '+label+' expected 1 match, got '+hits);
 js=js.replace(from,to);
}
one("const REVISION='r306-android-official-1.0';","const REVISION='r307-android-official-1.0';",'version revision');
one("window.__ctAndroidOfficialCode=10107;","window.__ctAndroidOfficialCode=10108;",'versionCode');
one("let owner=actualUser(),auditing=null,viewEpoch=-1,lastForYouRoot=null,paintedRoot=null,paintedAccount='';",
 "let owner=actualUser(),auditing=null,viewEpoch=-1,lastForYouRoot=null,paintedRoot=null,paintedAccount='',paintedVisit='';",
 'r278 reentry tracking');
one("if(root===paintedRoot&&paintedAccount===currentUser&&root?.querySelectorAll('[data-ct241-slot-key]').length===7)return;",
 "const visit=String(navSeq)+':'+localDay();\n if(root===paintedRoot&&paintedAccount===currentUser&&paintedVisit===visit&&root?.querySelectorAll('[data-ct241-slot-key]').length===7)return;",
 'allow genuine new recommendation visits');
one("if(root.querySelectorAll('[data-ct241-slot-key]').length===7){paintedRoot=root;paintedAccount=currentUser}",
 "if(root.querySelectorAll('[data-ct241-slot-key]').length===7){paintedRoot=root;paintedAccount=currentUser;paintedVisit=visit}",
 'pin reconciled visit');
one("let candidate=usable.find(x=>mediaRef(x)===override)||\n   usable.find(x=>mediaRef(x)===mediaIn(slot))||\n   ct300Choice(usable.filter(x=>!ct301Exposed(key,mediaRef(x))&&!blockedMemory(key,x)))||null;",
 "let candidate=usable.find(x=>mediaRef(x)===override)||\n   window.__ctR307Taste?.choose?.(key,usable, '')||\n   usable.find(x=>mediaRef(x)===mediaIn(slot))||\n   ct300Choice(usable.filter(x=>!ct301Exposed(key,mediaRef(x))&&!blockedMemory(key,x)))||null;",
 'choose audited candidate by user taste and long-term no-repeat');
one("picked.set(key,ref);\n  takeSeen(key,ref);\n  void verifyInBackground(key,candidate);",
 "picked.set(key,ref);\n  window.__ctR307Taste?.shown?.(key,candidate);\n  takeSeen(key,ref);\n  void verifyInBackground(key,candidate);",
 'remember rendered impression');
one("async function slotChoice(key,current){\n let options=candidates(key,current);\n if(!options.length){await expandPool(key);options=candidates(key,current)}\n return ct300Choice(options);\n}",
 "async function slotChoice(key,current){\n let options=candidates(key,current);\n if(!options.length){await expandPool(key);options=candidates(key,current)}\n if(window.__ctR307Taste?.next)return await window.__ctR307Taste.next(key,current,options);\n return ct300Choice(options);\n}",
 'adaptive and replenished Trocar');
one("if(key==='daily:movie')try{ct186SaveDaily268(next)}catch{}\n   changeOne(key);",
 "if(key==='daily:movie')try{ct186SaveDaily268(next)}catch{}\n   window.__ctR307Taste?.feedback?.(key,current,'swap');\n   window.__ctR307Taste?.shown?.(key,next);\n   changeOne(key);",
 'save swaps as feedback and diversify across days');
one("if(action==='seen')await markSeen(type,id);\n  else await window.__ctR293AddWatchlist(type,id);",
 "if(action==='seen')await markSeen(type,id);\n  else await window.__ctR293AddWatchlist(type,id);\n  window.__ctR307Taste?.feedback?.(key,current,action);",
 'learn only from successfully saved watched/watchlist actions');
one("window.__ctR305MovieHistory={refresh,merge,restore:()=>{if(active()&&fresh.length)bridge.getPainter()(homeCache?.history_movies||[])},stats:",
 "window.__ctR305MovieHistory={refresh,merge,latestRows:()=>fresh,restore:()=>{if(active()&&fresh.length)bridge.getPainter()(homeCache?.history_movies||[])},stats:",
 'expose server-confirmed recent movie records for stale-paint guard');
const module=await readFile(resolve(root,'apps/android/runtime-r307-taste-home.js'),'utf8');
if(!module.includes('window.__ctR307Taste=')||!module.includes('window.__ctR307HomeGuard='))throw Error('r307 owners missing');
one('boot();\n})();',module+'\nboot();\n})();','install final Android-only module');
new Function(js);
html=html.slice(0,begin)+'<script data-ct-android="r307-android-stable-js">'+js+'</script>'+html.slice(end+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('CINETRACKER_1_0_R307_READY: orphan Home check removed, recent movie authority protected, audited adaptive affinity and non-repeat recommendations; all other app features unchanged.');
