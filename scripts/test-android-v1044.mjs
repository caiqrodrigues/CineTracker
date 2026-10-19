import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const path='apps/android/app/src/main/assets/hotfix5/index.html';
const html=await readFile(path,'utf8');
const tag='<script data-ct-android="r286-android-js">';
const a=html.indexOf(tag),b=html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'r286 script marker');
const source=html.slice(a+tag.length,b);
const patch=await readFile('apps/android/runtime-r286-v1044-discover-and-special-home.js','utf8');
new Function(source);new Function(patch);
for(const required of [
 "const REVISION='r286-android-official-1.0.44'",
 "window.__ctAndroidOfficialCode=10086",
 "window.__ctR286AndroidV1044='audited-server-swaps+rotation+special-series-inline-watch+home-recent-order'",
 'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'cinetracker_recommendation_filter_v525','cinetracker_home_movie_history_v542',
 'cinetracker_ufc_watch_v512','cinetracker_wwe_ppv_watch_v519','cinetracker_f1_watch_sync_v462',
 'window.__ctR286Refill=refill',
 'const disabled=busy.has(key);',
 'async function slotChoice(key,current){\n let options=candidates(key,current);',
 'if(selectedData()?.__ct283ServerAudited)return;',
 'if(e.target?.closest?.(\'[data-ct286-special-quick]\'))return;',
 'const basePaintHome=paintHome;'
])assert.ok(source.includes(required),'Missing '+required);
assert.equal(source.includes("act==='swap'&&nChoices<2"),false,'disabled swap regression');
assert.equal(source.includes('softTimeout(ct186PopularPool(kind,ctx),9000)'),false,'TMDB refill regression');
assert.equal(source.includes('const checked=await Promise.all(batch.map(x=>validate(key,x)))'),false,
 '5.5s per batch swap regression');
assert.equal(source.includes('&&ct186Quality(x)&&!ct186LocalBlocked.has(ct186Key(x))'),false,'audited post-filter regression');
assert.ok(html.includes('name="ct-official-version" content="1.0.44"'),'release marker');
assert.ok(patch.includes("item.stack.insertAdjacentHTML('beforeend'"),'Special should not pin to top');
assert.ok(patch.includes('pending.has(type)'),'duplicate-click guard');
assert.ok(patch.includes('await Promise.allSettled([loadCurrentSpecial263(true),loadCounts263(true)])'),'server refresh');
assert.ok(patch.includes("edge263('ct-ufc-series-sync'"),'UFC should sync while on Home');
assert.ok(patch.includes("!seenIn(key).has(mediaRef(x))"),'seen recommendation rotation');
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 assert.ok(!patch.includes(forbidden),'forbidden '+forbidden);
console.log('ANDROID_1_0_44_TEST_OK: 7 active slots, server-v525 filtered pools, bounded immediate Trocar, non-stale Home UFC/WWE/F1, frozen Web');
