import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Android 1.0: fix TV/anime eligibility and eliminate repeated loading work.
// No change to Web, Supabase, native Java, media state or release signature.
const root=resolve(process.cwd());
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const oldTag='<script data-ct-android="r327-android-stable-js">';
const newTag='<script data-ct-android="r328-android-stable-js">';
let html=await readFile(target,'utf8').catch(()=>null);
if(!html?.includes(oldTag)&&!html?.includes(newTag)){
 execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r327.mjs')],{cwd:root,stdio:'inherit'});
 html=await readFile(target,'utf8');
}
if(html.includes(newTag)){
 console.log('CINETRACKER_ANDROID_1_0_R328_ALREADY_PREPARED');process.exit(0);
}
const begin=html.indexOf(oldTag),end=html.indexOf('</script>',begin+oldTag.length);
if(begin<0||end<=begin)throw Error('Official Android r327 baseline missing');
let js=html.slice(begin+oldTag.length,end);
function once(before,after,label){
 const n=js.split(before).length-1;
 if(n!==1)throw Error('Android r328 '+label+': expected 1 anchor; found '+n);
 js=js.replace(before,after);
}
once("const REVISION='r327-android-official-1.0';",
 "const REVISION='r328-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10128;',
 'window.__ctAndroidOfficialCode=10129;','version code');

// r265 mistakenly treated a 24-minute anime TV episode as a prohibited short
// movie. Preserve the 40-minute film threshold, YouTube, reality and stand-up
// exclusions. This same guard is reused by r307 TMDB refill and r314 ForYou.
once("if(runtime>0&&runtime<40||origin.includes('youtube')||origin.includes('youtu.be'))return false;",
 "if((x.media_type==='movie'&&runtime>0&&runtime<40)||origin.includes('youtube')||origin.includes('youtu.be'))return false;",
 'movie-only short-runtime filter');

// A Home entry previously launched up to four concurrent TMDB season scans,
// while a 650ms background warmup competed with the first real screen.
// Both processes remain enabled; just lower contention while the user loads.
once('Math.min(4,selected.length)},worker)',
 'Math.min(2,selected.length)},worker)','Home premiere background concurrency');
once('laterA26(()=>ct163PreloadAll(),650)',
 'laterA26(()=>ct163PreloadAll(),1700)','background prefetch pacing');

// The r314 ForYou controller discarded an already-audited six-pool response on
// every tab reentry and blocked on v498/v525 again. Reuse only a recent,
// authenticated same-account/same-day snapshot. A watched/Watchlist mutation
// invalidates it; no unverified recommendation is ever admitted.
once("let model=blank(),owner='',visit=-1,request=null,serial=0,lastError='',succeeded=0,swaps=0,clicks=0;",
 "let model=blank(),owner='',visit=-1,request=null,serial=0,lastError='',succeeded=0,swaps=0,clicks=0;\nlet ct328CacheAt=0,ct328CacheDay='';",
 'ForYou same-account memory');
once("owner=id;serial++;model=blank();visit=-1;request=null;excluded.clear();locks.clear();lastError='';",
 "owner=id;serial++;model=blank();visit=-1;request=null;excluded.clear();locks.clear();lastError='';ct328CacheAt=0;ct328CacheDay='';",
 'ForYou account isolation');
once('  model=updated;\n  if(preserve){',
 '  model=updated;ct328CacheAt=Date.now();ct328CacheDay=localDay();\n  if(preserve){',
 'ForYou audit completion');
once(" if(visit!==navSeq){visit=navSeq;serial++;request=null;model=blank()}\n void load(true,false);return true;",
 " if(visit!==navSeq){\n  visit=navSeq;serial++;request=null;\n  if(complete()&&ct328CacheAt>0&&ct328CacheDay===localDay()&&Date.now()-ct328CacheAt<120000){\n   for(const slot of SLOTS){const old=current(slot);const next=choose(slot,identity(old))||old;\n    if(next)setCurrent(slot,next,false)}\n   document.documentElement.dataset.ct328ForYouLoad='verified-memory';\n   paint();return true;\n  }\n  model=blank();\n }\n document.documentElement.dataset.ct328ForYouLoad='authenticated-refresh';\n void load(true,false);return true;",
 'ForYou instant verified tab reentry');
once("window.addEventListener('cinetracker:data-changed',()=>{\n if(active()&&!locks.size&&complete())void load(false,true);\n});",
 "window.addEventListener('cinetracker:data-changed',()=>{\n ct328CacheAt=0;\n if(active()&&!locks.size&&complete())void load(false,true);\n});",
 'ForYou mutation invalidation');

new Function(js);
html=html.slice(0,begin)+newTag+js+'</script>'+html.slice(end+'</script>'.length);
await writeFile(target,html,'utf8');
console.log('CINETRACKER_ANDROID_1_0_R328_READY: anime TV runtime fixed, verified ForYou memory and bounded background loading; Web frozen.');
