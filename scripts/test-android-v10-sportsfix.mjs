import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r304-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Stable 1.0 r304 runtime missing');
const js=html.slice(a+tag.length,b);new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
for(const marker of [
 "const REVISION='r304-android-official-1.0'",
 'window.__ctAndroidOfficialCode=10105',
 'ct304-sports-only',
 "card.dataset.ct304Stable==='1'",
 "window.addEventListener('click',sportsClick304,true)",
 'const originalSportsClick271=sportsClick271;',
 'window.__ctR303SinglePaint',
 'window.__ctR296WweHome',
 'window.__ctR293Gate',
 'cinetracker_recommendation_filter_v525',
 "[['previous','Anteriores'],['upcoming','Próximos']]",
 "data-ct111-f1"
])assert.ok(js.includes(marker),'Missing original or Sports r304 marker '+marker);
assert.ok(!js.includes("window.addEventListener('click',sportsClick271,true);"),
 'Old Sports handler must not also register');
assert.ok(js.includes("if(row?.sport_slug==='formula_1')return originalSportsClick271(event)"),
 'F1 must continue through its unchanged original click handler');
assert.ok(js.includes("function canonicalSport120(card){if(!card||card.dataset.ct304Stable==='1'"),
 'Legacy Sports normalizer must not relocate fixed action buttons');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'"));
assert.ok(gradle.includes('versionCode 10105'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes('signingConfig signingConfigs.official'));

const newHandlerStart=js.indexOf('const originalSportsClick271=sportsClick271;');
const newHandlerEnd=js.indexOf("window.addEventListener('click',sportsClick304,true);",newHandlerStart);
assert.ok(newHandlerStart>0&&newHandlerEnd>newHandlerStart);
const newHandler=js.slice(newHandlerStart,newHandlerEnd);
assert.ok(newHandler.includes("Number(result.event_id)!==id"),'Must verify server-confirmed event ID');
assert.ok(newHandler.includes("typeof result.is_watched!=='boolean'"),'Must verify server confirmation');
assert.ok(newHandler.includes("setWatch271(id,before)"),'Failed RPC must roll back optimistically');
assert.ok(newHandler.includes("sportsLocks271.has(id)"),'Rapid double clicks must be blocked');
assert.ok(!newHandler.includes('paintSports(')&&!newHandler.includes('renderSports('),
 'Mark watched must not re-render all event cards');

const locks=new Set(),buttonState=new Map(),toasts=[],calls=[],userSession={access_token:'test-session'};
let response={event_id:710,is_watched:true,sports_stats:{watched_events:1}};
const row={id:710,sport_slug:'soccer',is_watched:false};
const events=[row];const sportsCache={events,watch_history:[]};
let originalF1=0;
const registered={};
const oldEvent={preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
const button=(id)=>({
 dataset:{sportWatched:String(id),on:'0',watched:'0'},isConnected:true,disabled:false,
 closest(){return null}
});
const watchedBtn=button(710);
const f1Btn=button(711);
const missingBtn=button(0);
const all=[watchedBtn,f1Btn,missingBtn];
function update(id,on){for(const x of events)if(x.id===id)x.is_watched=on;const found=all.filter(x=>Number(x.dataset.sportWatched)===id);for(const x of found){x.dataset.on=on?'1':'0';x.dataset.watched=on?'1':'0'}return found}
const listeners=new Function('sportsClick271','buttonSelector271','watchState271','sportsLocks271','route','session','setWatch271','rpc','sportsCache','ct163Write','profileCacheObj','localStorage','toast','window',
 "let profileCache=null;"+newHandler+"return sportsClick304;")(
 ()=>{originalF1++},'[data-sport-watch],[data-sport-watched],[data-ct263-sport-watch]',
 id=>id===710?row:id===711?{id:711,sport_slug:'formula_1',is_watched:false}:null,
 locks,()=> 'sports',userSession,update, (...args)=>{calls.push(args);return Promise.resolve(response)},
 sportsCache,()=>{}, {},{removeItem(){}},m=>toasts.push(m),{__ctA26PersistSports(){}}
);
function click(b){return{...oldEvent,target:{closest:()=>b},prevented:false,stopped:false,
 preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}}}
const c1=click(watchedBtn);listeners(c1);assert.ok(c1.prevented&&c1.stopped);
assert.equal(row.is_watched,true,'Mark-watched should update only clicked card optimistically');
listeners(click(watchedBtn));assert.equal(calls.length,0,'Second rapid tap cannot cause a second RPC');
await Promise.resolve();await Promise.resolve();await new Promise(setImmediate);
assert.equal(calls.length,1);
assert.equal(calls[0][0],'cinetracker_sport_mark_watched_v1');
assert.equal(calls[0][1].p_event_id,710);
assert.equal(calls[0][1].p_watched,true);
assert.equal(watchedBtn.disabled,false);
assert.ok(toasts.some(x=>x.includes('marcado como assistido')));
assert.equal(sportsCache.watch_history.length,1,'Persisted mark should keep Sports history locally');
response={event_id:710,is_watched:false,sports_stats:{watched_events:0}};
listeners(click(watchedBtn));
await Promise.resolve();await Promise.resolve();await new Promise(setImmediate);
assert.equal(row.is_watched,false);
assert.equal(sportsCache.watch_history.length,0);
assert.equal(calls.length,2);
listeners(click(f1Btn));assert.equal(originalF1,1,'F1 must use existing unmodified handler');
listeners(click(missingBtn));assert.equal(calls.length,2,'Invalid ID must not make a network call');
assert.ok(toasts.some(x=>x.includes('identificação válida')),'Invalid event needs visible error');

const styleStart=js.indexOf("const style=document.createElement('style');style.id='ct304-sports-only';");
const styleEnd=js.indexOf('document.head.appendChild(style);',styleStart);
assert.ok(styleStart>0&&styleEnd>styleStart);
const css=js.slice(styleStart,styleEnd);
assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'));
assert.ok(css.includes('height:42px!important'));
assert.ok(css.includes('[data-sports] .event-grid>article.live'));
assert.ok(!css.includes('[data-home]')&&!css.includes('[data-discover]')&&!css.includes('[data-profile]'));
console.log('CINETRACKER_1_0_R304_TEST_OK: unchanged commercial version 1.0; direct watched/unwatch confirmation + optimistic rollback, rapid-tap guard, visible errors, F1 unmodified; only Sports red border and equal buttons changed.');
