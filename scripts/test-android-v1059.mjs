import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r301-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android 1.0.59 embedded script missing');
const js=html.slice(a+tag.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0.59"'));
for(const marker of [
 "const REVISION='r301-android-official-1.0.59'",
 'window.__ctAndroidOfficialCode=10101',
 "[['previous','Anteriores'],['upcoming','Próximos']]",
 'function ct300SportsRange(p)',
 'function ct301Exposed(key,ref)',
 'swapping.add(key);changeOne(key)',
 'swapping.delete(key);busy.delete(key)',
 'function ct300Choice(rows)',
 'function ct297Status(label)',
 'window.__ctR296WweHome',
 'const restoreCached=()=>',
 "row.dataset.ct301VerifiedWwe=String(id)",
 'cinetracker_recommendation_filter_v525',
 'return newRows;',
 'const isWwe=showId===4656||showId===1549'
])assert.ok(js.includes(marker),'r301 missing '+marker);
assert.ok(!js.includes("[['previous','Anteriores'],['upcoming','Próximos'],['favorites','Favoritos']]"),
 'Favorites top-level tab not removed');
const begin=js.indexOf('/* r290 Discover guarded extension */');
const finish=js.indexOf('/* r291 scoped 0 */',begin);
assert.ok(begin>=0&&finish>begin);
const legacy=js.slice(begin,finish);
for(const extra of [
 'function check(revision){','function schedule(){',
 'for(const ms of [60,280,950,2600])',
 "document.addEventListener('click',e=>",
 "window.addEventListener('cinetracker:data-changed',()=>",
 'discoverRows=async function(tab){',
 'window.__ctR278Test?.reconcile?.()'
])assert.ok(!legacy.includes(extra),'Legacy r290 still competes: '+extra);
assert.ok(legacy.includes('if(!valid(data)&&valid(stable))'),
 'Legacy unaudited paint guard must remain');
const cStart=js.indexOf('/* Android 1.0.36 r278');
const cEnd=js.indexOf('/* CineTracker Android 1.0.37/r279',cStart);
const controller=js.slice(cStart,cEnd);
assert.ok(!controller.includes("window.addEventListener('cinetracker:data-changed',()=>{if(isVisible())schedule()})"),
 'Cross-module state must not force a global Pra Voce repaint');
assert.ok(controller.includes('if(swapping.has(key))continue;'),
 'In-flight swaps must keep the currently rendered card stable');
assert.ok(controller.includes('!ct301Exposed(key,mediaRef(x))'),'No-repeat shared memory missing');
const ruleA=controller.indexOf('function ct301Exposed(key,ref){');
const ruleB=controller.indexOf('function candidates(key,current){',ruleA);
assert.ok(ruleA>0&&ruleB>ruleA);
const histories=new Map([
 ['daily:movie',new Set(['movie:20'])],
 ['fresh:movie',new Set(['movie:30'])],
 ['fresh:series',new Set(['tv:10'])],
 ['fresh:anime',new Set(['tv:100'])],
 ['watchlist:movie',new Set(['movie:5'])]
]);
const exposure=new Function('watchKind','seenIn',
 controller.slice(ruleA,ruleB)+'return ct301Exposed;')(
 key=>key.startsWith('watchlist:'),key=>histories.get(key)||new Set()
);
assert.equal(exposure('fresh:movie','movie:20'),true,'Daily title must not recur in new Movie');
assert.equal(exposure('daily:movie','movie:30'),true,'New Movie title must not recur in Daily');
assert.equal(exposure('fresh:series','tv:100'),true,'New Anime title must not recur as New Series');
assert.equal(exposure('watchlist:movie','movie:5'),true,'Watchlist retains independent history');
assert.equal(exposure('watchlist:movie','movie:20'),false,'Watchlist must not be blocked by New recommendations');
assert.equal(exposure('fresh:movie','movie:876'),false,'New eligible item must remain possible');

const wwStart=js.indexOf('/* Android r294: isolated WWE sync */');
const wwEnd=js.indexOf('/* r295 Raw/SmackDown durable Home rows */',wwStart);
const wwe=js.slice(wwStart,wwEnd);
assert.ok(wwe.includes("const record=data.get(id),episode=latest.get(id)||record?.latest_episode_to_air"));
assert.ok(wwe.includes("const status=list(watches).find(x=>Number(x.tmdb_id)===id)"),
 'WWE must use actual authenticated per-user watched result');
assert.ok(wwe.includes("!Number.isFinite(age)||age<0||age>16"),'Old WWE episodes must not be resurrected');
assert.ok(wwe.includes("!(Number(record.media_id)>0)"),'Unowned WWE row must never be invented');
assert.ok(wwe.includes("watchSet(watches,id).has(sn+':'+en)"),'Watched WWE must not be resurrected');
assert.ok(wwe.includes("target.appendChild(row)"),'Missing first-load WWE must be created from verified record');
assert.ok(wwe.includes('lastValid=null;checkedAt=0;'),'Watched clicks must invalidate cached state');
const stableStart=js.indexOf('/* r295 Raw/SmackDown durable Home rows */');
const stable=js.slice(stableStart);
assert.ok(stable.includes("window.__ctR294Wwe?.restoreCached?.()"),'A later Home repaint must reapply fresh user-verified WWE');
assert.ok(stable.includes('saved.verifiedAt=Date.now()'),'A visible retained WWE row must not expire after ten minutes');
const stripped=controller.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g,'');
assert.ok(!stripped.includes('window.location.reload(')&&!stripped.includes('router.refresh('));
console.log('ANDROID_1_0_59_TEST_OK: only 2 Sports tabs; r290 timer repaint removed; stable in-flight swaps; all fresh slots share no-repeat memory; Raw/SmackDown rehydrated from authenticated user rows and v4 watched state, with no watched or old-episode resurrection.');
