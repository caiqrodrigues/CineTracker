import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r318-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>0&&b>a,'Official 1.0/r318 embedded runtime missing');
const js=html.slice(a+tag.length,b);
new Function(js);
for(const phrase of [
 "const REVISION='r318-android-official-1.0';",
 "window.__ctAndroidOfficialCode=10119",
 "window.__ctR316Discover={show,ensureTop10,restore,detailVisible,",
 "window.__ctR314ForYou={load,mount,swap,action,choose,paint,poolFor,stats:",
 "window.__ctR315DiscoverCards=",
 "window.__ctR313Session=",
 "window.__ctR308Home=",
 "window.__ctR303SinglePaint",
 "window.addEventListener('click',sportsClick304,true);",
 "if(events)events.remove();",
 "cinetracker_recommendation_filter_v525",
 "cinetracker_discover_fresh_v421",
 "cinetracker_discover_watch_unseen_v421",
 "data-ct314-slot"
])assert.ok(js.includes(phrase),'Missing preserved application behavior: '+phrase);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'")&&gradle.includes('versionCode 10119'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes('signingConfig signingConfigs.official'));

const start=js.indexOf('async function auditedPools(id){');
const end=js.indexOf('\nasync function load(',start);
assert.ok(start>0&&end>start,'r314 auditedPools not present');
const auditedSrc=js.slice(start,end);
assert.ok(!auditedSrc.includes('ct186Context(true)'),'Legacy context enrichment MUST NOT block ForYou');
assert.ok(!auditedSrc.includes('results[6]'),'ForYou cannot depend on an obsolete seventh dashboard promise');
assert.ok(auditedSrc.includes('Promise.allSettled(keys.map('),'All 6 pool categories must be fetched');
assert.ok(auditedSrc.includes('taste()?.warm?.(false)'),'User taste warm-up remains best-effort');
assert.ok(auditedSrc.includes('window.__ctR279Audit.auditData(raw)'),'Server audit remains mandatory');
assert.ok(auditedSrc.includes("if(!verifyData(audited))throw Error("),'Must fail closed if audit incomplete');
assert.ok(auditedSrc.includes("data._ct279AuditedFor")===false,'Do not forge audit metadata');
assert.ok(!auditedSrc.includes('window.location.reload(')&&!auditedSrc.includes('router.refresh('));

const seen=[];
let auditPartial=false;
const uid=()=> 'user-a';
const kinds=['movie','series','anime'];
const mk=(group,kind)=>({tmdb_id:group==='fresh'?17:19,media_type:kind==='movie'?'movie':'tv',media_kind:kind,group,__ct421_eligible:true,title:group+' '+kind});
const audit={
 async auditData(data){
  seen.push('audit');
  // Canonical v525 may drop candidates. The renderer must use its answer.
  if(!auditPartial){
   data._ct279AuditedFor='user-a';data._ct280AuditPartial=false;
   data._ct186_fresh.movie=[]; // simulate an already-watched movie
  }else data._ct280AuditPartial=true;
  return data;
 }
};
const background={started:0,warm(){this.started++;return new Promise(()=>{})}};
const test=new Function('window','KINDS','fetchPool','timebox','taste','userId','blank','empty','arr','canUse','verifyData','rawSource',
 'let ct186ForYouData=null,ct166ForYouData=null;'+auditedSrc+
 'return {run:auditedPools,state:()=>({ct186ForYouData,ct166ForYouData})};')(
 {__ctR279Audit:audit},kinds,
 async(group,kind)=>{seen.push(group+':'+kind);return [mk(group,kind)];},
 x=>Promise.resolve(x),()=>background,uid,
 ()=>({watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},selected:new Map()}),
 ()=>({movie:[],series:[],anime:[]}),
 x=>Array.isArray(x)?x:[],
 (x,kind,watch)=>x.__ct421_eligible===true&&x.media_kind===kind&&x.group===(watch?'watch':'fresh'),
 data=>!data._ct280AuditPartial&&!!data._ct279AuditedFor&&!!data._ct186_watchlist&&!!data._ct186_fresh,{});
const started=Date.now();
const result=await Promise.race([test.run('user-a'),new Promise((_,reject)=>setTimeout(()=>reject(Error('ForYou waiting on dashboard')),700))]);
assert.ok(Date.now()-started<700,'ForYou still blocked on the unused profile enrichment chain');
assert.equal(result.fresh.movie.length,0,'Movie blocked by the server must never display');
assert.equal(result.fresh.series.length,1);
assert.equal(result.fresh.anime.length,1);
assert.equal(result.watch.movie.length,1);
assert.equal(result.watch.series.length,1);
assert.equal(result.watch.anime.length,1);
assert.ok(seen.includes('audit')&&seen.filter(x=>x.includes(':')).length===6);
assert.equal(test.state().ct186ForYouData.__ct283ServerAudited,true);
await Promise.resolve();
assert.equal(background.started,1,'Taste learning must be independent of the loading result');
auditPartial=true;
await assert.rejects(()=>test.run('user-a'),/servidor não conseguiu confirmar/i,
 'A partial v525 audit must reject all cards, not silently bypass filtering');
// Reproduce the original crash in an isolated runtime, not only a grep.
// r270 had previousDiscoverRows270 declared AFTER the override, making
// Populares/Em alta/Novidades/etc invoke the override recursively forever.
const capture="const previousDiscoverRows270=discoverRows;";
const delegate="discoverRows=async function(tab){return String(tab)==='foryou'?startRec(false):previousDiscoverRows270(tab)};";
const at=js.indexOf(capture),isAt=js.indexOf(delegate);
assert.ok(at>0&&isAt>at,'Base renderer reference must precede replacement');
assert.equal(js.indexOf(capture,at+capture.length),-1,'Exactly one non-ForYou delegate');
const wrapped=new Function('discoverRows','startRec',capture+'\n'+delegate+'\nreturn discoverRows;');
const calls=[];
const original=async tab=>{calls.push(tab);return [{id:123,tab}]};
const forYou=async()=>({daily:{title:'valid sample',__ct421_eligible:true}});
const fixed=wrapped(original,forYou);
const allTabs=['top10','trending','popular','new','releases','anticipated','top','calendar'];
for(const tab of allTabs){
 const rows=await Promise.race([fixed(tab),new Promise((_,reject)=>setTimeout(()=>reject(Error('Recursive tab: '+tab)),1500))]);
 assert.deepEqual(rows,[{id:123,tab}],'Incorrect or recursive delegate in '+tab);
}
assert.deepEqual(calls,allTabs,'Every non-ForYou tab must hit original fetcher exactly once');
assert.deepEqual(await fixed('foryou'),{daily:{title:'valid sample',__ct421_eligible:true}},
 'Existing seven-slot recommendations must remain under their own controller');
assert.equal(calls.length,allTabs.length,'ForYou must never call non-ForYou pipeline');
const src=await readFile('apps/android/runtime-r270-v1028-profile-foryou-history.js','utf8');
assert.ok(src.indexOf(capture)>0&&src.indexOf(capture)<src.indexOf(delegate),
 'Committed source must also be non-recursive, not only the bundled APK');
console.log('ANDROID_1_0_R318_TEST_OK: ForYou renders after six authenticated v421 pools + mandatory v525 audit even if profile taste stays pending; partially audited results fail closed; 7-slot owner/Top10/all pages retained; no reload or version bump in name.');
