import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
// CineTracker official Android 1.0/r310 — fixes ONLY Profile + Discover > Pra Você.
// Certified r309 Home/Sports/F1 functionality remains byte-identical.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r309.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r309-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Official Android 1.0/r309 baseline missing');
let js=html.slice(a+tag.length,b);
function once(from,to,label){
 const n=js.split(from).length-1;
 if(n!==1)throw Error('Android r310 '+label+': expected 1 match, got '+n);
 js=js.replace(from,to);
}
once("const REVISION='r309-android-official-1.0';","const REVISION='r310-android-official-1.0';",'diagnostic revision');
once('window.__ctAndroidOfficialCode=10110;','window.__ctAndroidOfficialCode=10111;','native update code');
// The r303 painter freezes the same data for a visit on purpose. r278 must
// discard a previous visit's PINNED selection at a real new navigation, but
// must not touch the current visit after swaps (r293 keeps those nodes stable).
once("const visit=String(navSeq)+':'+localDay();\n if(root===paintedRoot",
 "const visit=String(navSeq)+':'+localDay();\n if(window.__ctR310Discover?.begin?.(visit))picked.clear();\n if(root===paintedRoot",
 'new visit clears old slot choices exactly once');
once("let candidate=usable.find(x=>mediaRef(x)===override)||\n   window.__ctR307Taste?.choose?.(key,usable, '')||",
 "let candidate=usable.find(x=>mediaRef(x)===override)||\n   window.__ctR307Taste?.choose?.(key,usable, '')||",
 'existing adaptive selection anchor');
// User taste r307: always choose a varied candidate inside an audited pool,
// not the same deterministic top-1. Retain 21-day anti-repeat impressions.
// System entropy changes across app launches; no artificial profile facts.
once(" const chosen=[...safe].sort((a,b)=>\n  score(key,b,seed,counts.get(ref(b))||0)-score(key,a,seed,counts.get(ref(a))||0))[0];\n selected++;return chosen||null;",
 " const ranked=[...safe].sort((a,b)=>\n  score(key,b,seed,counts.get(ref(b))||0)-score(key,a,seed,counts.get(ref(a))||0)).slice(0,12);\n const strengths=ranked.map(x=>Math.exp(Math.max(-12,Math.min(12,(score(key,x,seed,counts.get(ref(x))||0)-score(key,ranked[0],seed,counts.get(ref(ranked[0]))||0))*0.75))));\n const sum=strengths.reduce((n,x)=>n+x,0);\n let draw=Math.random()*sum,index=0;\n for(;index<strengths.length-1;index++){draw-=strengths[index];if(draw<0)break}\n const chosen=ranked[index];selected++;return chosen||null;",
 'stochastic personalized sampling');
once("async function warm(){\n reset();const id=account;",
 "async function warm(force=false){\n reset();const id=account;",
 'revalidate real affinity when asked');
once("if(profileRows.length&&now()-profileLoadedAt<12*60*1000)return true;",
 "if(!force&&profileRows.length&&now()-profileLoadedAt<12*60*1000)return true;",
 'do not reuse stale taste snapshot after new visit');
once("async function next(key,current,options){\n const p=list(options);\n if(p.length)return choose(key,p,current);",
 "async function next(key,current,options){\n const p=list(options);\n if(p.length){if(p.length<=2&&!key.startsWith('watchlist:'))void refill(key);return choose(key,p,current)}",
 'nonblocking audited expansion of small pools');
once("window.__ctR307Taste={choose,shown,feedback,next,refill,warm,profile,stats:tasteStats,",
 "function ingest(incoming){\n reset();if(!account||!Array.isArray(incoming))return false;\n const next=incoming.map(row=>({genre_ids:genre(row),is_seen:!!row.is_seen,is_completed:!!row.is_completed,\n is_in_progress:!!row.is_in_progress,is_up_to_date:!!row.is_up_to_date,watched_episodes:Number(row.watched_episodes)||0,\n last_watched_at:row.last_watched_at||null,is_watchlist:!!row.is_watchlist,is_favorite:!!row.is_favorite})).filter(row=>row.genre_ids.length).slice(0,2400);\n profileRows=next;profileLoadedAt=now();prefs=null;prefsAt=0;\n try{localStorage.setItem('ct:r307:genre-profile:'+account,JSON.stringify({at:profileLoadedAt,rows:next}))}catch{}\n return true;\n}\nwindow.__ctR307Taste={choose,shown,feedback,next,refill,warm,ingest,profile,stats:tasteStats,",
 'accept server-verified latest watches to reweight genre affinity');
const module=await readFile(resolve(root,'apps/android/runtime-r310-profile-discover.js'),'utf8');
if(!module.includes('window.__ctR310Profile=')||!module.includes('window.__ctR310Discover='))throw Error('r310 owners missing');
once('boot();\n})();',module+'\nboot();\n})();','inject final Profile + Discover-only patch');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r310-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('CINETRACKER_1_0_R310_READY: Profile TV last-watch verified on entry; stale profile library cannot overwrite latest; Discover refreshes taste + nonrepeating sampled picks each visit; all other features unchanged.');
