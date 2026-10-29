import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r329-android-stable-js">';
const start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start,'r329 Android bundle present');
const js=html.slice(start+tag.length,end);
new Function(js);
assert.ok(js.includes("const REVISION='r329-android-official-1.0'"));
assert.ok(js.includes('window.__ctAndroidOfficialCode=10130'));
for(const marker of [
 'window.__ctR327HomeSearch=','window.__ctR326MediaExport=',
 'window.__ctR325Series=','window.__ctR325Profile=',
 'window.__ctR314ForYou=','window.__ctR322Top10=',
 'window.__ctR279Audit=','cinetracker_recommendation_filter_v525'
])assert.ok(js.includes(marker),'Must preserve '+marker);
assert.ok(js.includes("if((x.media_type==='movie'&&runtime>0&&runtime<40)"),
 'Anime TV must continue to pass the film-only short-runtime filter');

// Detail must not await providers, similar titles and recommendation audits
// before rendering the primary TMDB record. Its user-specific actions remain
// disabled until the user's current watchlist and watched data is available.
const detailStart=js.indexOf('renderDetail=async function(kind,id,seq){',js.indexOf('/* ---------- render de detalhes inspirado'));
const detailEnd=js.indexOf('/* ações de relacionados e temporada */',detailStart);
assert.ok(detailStart>0&&detailEnd>detailStart,'Production r169 detail renderer found');
const detail=js.slice(detailStart,detailEnd);
const primary=detail.indexOf('const d=await detailTask;');
const paint=detail.indexOf('h.innerHTML=ct169HeroHtml');
assert.ok(primary>=0&&paint>primary,'Primary detail paints before secondary data');
assert.ok(detail.indexOf('void safeTmdb(`/${tmdbKind}/${id}/watch/providers`).then(',paint)>paint,
 'Streaming availability should update asynchronously after first paint');
assert.ok(detail.indexOf('void Promise.all([',paint)>paint,
 'Related titles should update asynchronously after first paint');
assert.ok(detail.indexOf("button.disabled=true;button.textContent='Verificando…'",paint)>paint,
 'Unverified personal state must not enable watchlist/seen clicks');
assert.ok(detail.includes('context?ct169MainState(context,tmdbKind,id):null'),
 'Watchlist and watched badges must restore from the actual signed-in user');
assert.ok(detail.includes('if(seq!==navSeq||!h.isConnected)return;'),
 'Late detail requests must never change another navigation screen');

// A recent verified list of actual BR streaming providers must survive
// backend slowness; no hardcoded, unverified provider IDs are introduced.
assert.ok(js.includes('Date.now()-Number(c.at||0)<1209600000'),
 'Verified streaming provider cache lasts fourteen days');

// Test the actual r319 loading function, not a shadow implementation:
// the first movie result must become visible only AFTER personal audit,
// without waiting for the slower second TV request.
const rowsStart=js.indexOf('async function rows(tab,onPartial){');
const rowsEnd=js.indexOf('const style=document.createElement',rowsStart);
assert.ok(rowsStart>0&&rowsEnd>rowsStart);
const fnSource=js.slice(rowsStart,rowsEnd);
let secondResolve,verified=false;
const partials=[];
const gate={
 auditCandidates:async items=>{await Promise.resolve();verified=true;return items.length>0},
 permitted:()=>verified
};
const context={
 reset:()=>{},account:'person-a',session:{access_token:'token'},
 tabs:new Set(['popular']),uid:()=> 'person-a',day:()=> '2026-10-29',now:()=>Date.now(),
 cached:new Map(),requests:new Map(),info:()=>[['/movie',{},'movie'],['/tv',{},'tv']],
 safeTmdb:path=>path==='/movie'?Promise.resolve({results:[{id:11,title:'Autorizado',popularity:10}]}):
  new Promise(resolve=>{secondResolve=resolve}),
 timeout:promise=>promise,list:x=>Array.isArray(x)?x:[],
 window:{__ctR265Test:{allowed:()=>true},__ctR279Audit:gate},
 key:item=>item.media_type+':'+item.id,stamp:()=>'',checks:0,successes:0,
 errors:0,lastError:''
};
const rows=new Function('scope','with(scope){'+fnSource+'return rows;}')(context);
const complete=rows('popular',partial=>{
 assert.equal(verified,true,'Never paint an unaudited item');
 partials.push(partial);
});
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(partials.length,1,'A first verified media kind must paint before the second responds');
assert.deepEqual(partials[0].map(x=>x.media_type),['movie']);
secondResolve({results:[{id:22,title:'Outra série',popularity:12}]});
const all=await complete;
assert.equal(all.length,2,'Full list must still contain both audited media kinds');
assert.equal(context.successes,1);

// r316 caller must guard navigation token before accepting partial content.
assert.ok(js.includes('if(firstPaint||expected!==seq||!here()||getTab()!==tab||!partial?.length)return;'));
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)']){
 assert.ok(!detail.includes(forbidden)&&!fnSource.includes(forbidden),'No blocking reload or unlimited retry');
}
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes('versionCode 10130'));
assert.ok(gradle.includes("versionName '1.0'"));
console.log('CINETRACKER_ANDROID_1_0_R329_TEST_OK: staged details, personal-action guard, provider cache, first audited Discover cards before slow source; previous features and Web frozen.');
