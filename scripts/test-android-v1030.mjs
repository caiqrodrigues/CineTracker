import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r272-android-js">';
const a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'Android r272 JS absent');
const app=html.slice(a+marker.length,b);
new Function(app);
const patch=await readFile('apps/android/runtime-r272-v1030-history-authority.js','utf8');
new Function(patch);
for(const part of [
 'name="ct-official-version" content="1.0.30"',
 "const REVISION='r272-android-official-1.0.30'",
 'window.__ctAndroidOfficialCode=10072',
 "window.__ctR272AndroidV1030='all-movies-plus-recent-plays+lazy-after-repaint+safe-foryou-cache'",
 'window.__ctR271AndroidV1029','window.__ctR270AndroidV1028',
 'cinetracker_home_movie_history_v323','cinetracker_sport_mark_watched_v1',
 'sportsClick271,true','ct186FreshEligible',
 'cinetracker_sports_stadium_summary_v296'
])assert.ok((part.startsWith('name=')?html:app).includes(part),'missing '+part);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(bad),'forbidden '+bad);
const fn=patch.slice(patch.indexOf('function mergeHistory272('),patch.indexOf('/* The full history loader'));
assert.match(fn,/return all.sort/);
const env={Date,Number,Map,String,Array};
vm.createContext(env);
vm.runInContext('const asRows=x=>Array.isArray(x)?x:[];\n'+fn,env);
const older=[
 {id:1,media_id:101,watched_at:'2026-08-22T10:00:00Z',media_title:'Antes'},
 {id:2,media_id:102,watched_at:'2026-09-19T12:00:00Z',media_title:'Pokémon',plays:1},
 {id:3,media_id:103,watched_at:'2026-09-18T12:00:00Z',media_title:'Uma Reprise'}
];
const actual=[
 {media_id:104,watched_at:'2026-10-13T22:24:30Z',media_title:'Filme de Outubro',plays:1},
 {media_id:103,watched_at:'2026-10-11T22:00:00Z',media_title:'Uma Reprise',plays:2},
 {media_id:102,watched_at:'2026-09-19T12:00:00Z',media_title:'Pokémon',poster_path:'/pokemon.jpg',plays:3}
];
const joined=env.mergeHistory272(older,actual);
assert.equal(joined.length,5,'older movies plus October rewatch must be preserved');
assert.equal(joined[0].media_title,'Filme de Outubro');
assert.equal(joined[1].plays,2,'October rewatch must remain in history');
assert.equal(joined.filter(x=>x.media_id===102).length,1,'same event cannot duplicate');
assert.equal(joined.find(x=>x.media_id===102).plays,3);
assert.equal(joined.at(-1).media_title,'Antes');
assert.ok(patch.includes("window.__ctR270Test?.watchPosters?.()"),'poster observer must restart after replacing history');
assert.ok(patch.includes('visibleCount272=120'),'initial DOM must be limited to newest 120 movie cards');
assert.ok(patch.includes("visibleCount272+100"),'older history must be available in paginated batches');
assert.ok(patch.includes('ct186ContextValue'),'Pra Voce snapshot must be audited before use');
const sports=app.slice(app.indexOf('function sportsClick271(event){'),app.indexOf("window.addEventListener('click',sportsClick271,true)"));
assert.ok(!sports.includes('paintSports(')&&!sports.includes('sportsPayload('),'sports clicks must not force reload');
console.log('ANDROID_1_0_30_TEST_OK: Oct play events + 948 legacy merge, repeats+poster metadata, lazy after paged repaint, sports no scroll and audited recommendations');
