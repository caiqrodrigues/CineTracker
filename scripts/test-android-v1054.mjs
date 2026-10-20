import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r296-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'r296 Android runtime missing');
const js=html.slice(a+marker.length,b);
new Function(js);
const owner=(await readFile('apps/android/runtime-r296-v1054-wwe-home-owner.js','utf8')).trimEnd();
new Function(owner);
assert.equal(js.split(owner).length-1,1,'r296 WWE owner must be embedded once');
assert.equal(js.includes('window.__ctR295HomeTest={capture,restore'),false,'Old clone restorer still installed');
for(const token of [
 "const REVISION='r296-android-official-1.0.54'",
 'window.__ctAndroidOfficialCode=10096',
 'function ct295Protect()',
 'function ct296Ready(target)',
 'if(!ct296Ready(target))',
 'if(attempt<90)requestAnimationFrame',
 'window.__ctR293Gate?.beforeRoute?.()',
 'authenticated-v525-seven-slots',
 'window.__ctR293AddWatchlist(type,id)',
 'cinetracker_discover_fresh_v421',
 'cinetracker_discover_watch_unseen_v421',
 'cinetracker_recommendation_filter_v525',
 'window.__ctR296WweHome',
 "window.__ctR293Gate={"
])assert.ok(js.includes(token),'Missing Android r296 guard '+token);
assert.ok(html.includes('name="ct-official-version" content="1.0.54"'));
const begin=js.indexOf('function ct296Ready(target)');
const end=js.indexOf('function commit(value,target)',begin);
assert.ok(begin>0&&end>begin,'Readiness function missing from canonical gate');
const ready=new Function(js.slice(begin,end)+'return ct296Ready;')();
const keys=['daily:movie','watchlist:movie','watchlist:series',
 'watchlist:anime','fresh:movie','fresh:series','fresh:anime'];
function slot(key,kind='filled',correct=true){
 const actions=key.startsWith('watchlist:')?['seen','swap']:['watchlist','seen','swap'];
 return {
  dataset:{ct241SlotKey:key},
  querySelector(selector){
   if(selector==='.discover-card')return kind==='filled'?{}:null;
   if(selector==='button[data-media]')return kind==='filled'?{}:null;
   if(selector==='[data-ct277-empty]')return kind==='empty'?{}:null;
   return null;
  },
  querySelectorAll(selector){
   return selector==='.ct277-actions [data-ct277-action]'&&kind==='filled'?
    (correct?actions:actions.slice(0,-1)).map(x=>({dataset:{ct277Action:x}})):[];
  }
 };
}
const layout=arr=>({querySelectorAll:()=>arr});
assert.equal(ready(layout(keys.map(k=>slot(k)))),true,'Seven fully interactive slots rejected');
assert.equal(ready(layout(keys.map((k,i)=>slot(k,i===3?'empty':'filled')))),true,'Empty Anime watchlist incorrectly blocks');
assert.equal(ready(layout(keys.map((k,i)=>slot(k,i===3?'loading':'filled')))),false,'Partial loading screen incorrectly locked');
assert.equal(ready(layout(keys.map((k,i)=>slot(k,'filled',i!==4)))),false,'Missing Trocar action incorrectly locked');
assert.equal(ready(layout(keys.slice(0,6).map(k=>slot(k)))),false,'Six-slot partial screen incorrectly locked');
assert.equal(ready(layout(keys.map((k,i)=>slot(i===6?keys[0]:k)))),false,'Duplicate slots incorrectly locked');

for(const token of ['snapshots.delete(id)','saved.node.dataset.ct296Retained','stack.appendChild(saved.node)',
 'Date.now()-saved.verifiedAt>600000','const oldPaint=paintHome',
 'observer.observe(root,{subtree:true,childList:true})']){
 assert.ok(owner.includes(token),'WWE row continuity missing '+token);
}
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'setInterval(']){
 assert.ok(!owner.includes(forbidden),'Forbidden Android behavior '+forbidden);
}
console.log('ANDROID_1_0_54_TEST_OK: only complete seven-slot authenticated Discover is pinned; partial Watchlist allowed, loading not pinned; physical WWE rows survive async paint; watched clicks invalidate snapshots; Web unchanged.');
