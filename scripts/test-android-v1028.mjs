import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r270-android-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>0&&b>a,'Android r270 embedded script missing');
const js=html.slice(a+marker.length,b),patch=await readFile('apps/android/runtime-r270-v1028-home-discover-posters.js','utf8');
new Function(js);new Function(patch);
assert.ok(html.includes('name="ct-official-version" content="1.0.28"'));
for(const expected of [
 "const REVISION='r270-android-official-1.0.28'",
 'window.__ctAndroidOfficialCode=10070',
 "window.__ctR270AndroidV1028='fast-foryou+home-recent-history+lazy-posters+top10-priority'",
 'window.__ctR269AndroidV1027=','window.__ctR268AndroidV1026=','window.__ctR267AndroidV1025=',
 'cinetracker_home_live_v0997_r3','cinetracker_profile_media_dashboard_v0991',
 'cinetracker_sports_watch_set_v296','cinetracker_sports_stadium_summary_v296'
])assert.ok(js.includes(expected),'missing '+expected);
assert.ok(js.includes("k==='home'?120000"),'Home cache must be short lived');
assert.ok(!js.includes("function ct163WarmOnIdle(){if(!session)return;setTimeout(()=>{if(session)void ct163PreloadAll()},6500)}"),'background prefetch still competes');
assert.ok(js.includes('function ct163WarmOnIdle(){/* r270 foreground-first: tabs populate their own caches on first visit. */}'));
assert.ok(!js.includes("for(const numbers of [[1,2,3,4],[5,6,7,8],[9,10]])"));
assert.ok(js.includes("for(const numbers of [[1,2],[3,4],[5,6],[7,8],[9,10]])"));
assert.ok(!js.includes("await Promise.all(['movie','series','anime'].filter(k=>need[k]).map(k=>ct186PopularPool"));
const section=js.slice(js.indexOf('async function ct186FreshPools(c){'),js.indexOf('function ct186WatchPools(c){'));
assert.equal((section.match(/,'(movie|tv)',2\)/g)||[]).length,3,'three movie/tv/anime candidate queries must use 2 first pages');
for(const banned of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(banned),'forbidden '+banned);
const saved=[];
const sandbox={
 window:{addEventListener(){}},document:{head:{appendChild(o){saved.push(o)}},createElement(){return{rel:'',href:'',textContent:'',crossOrigin:''}},querySelector(){return null}},
 homeMovieRow158:()=>'<div class="thumb" style="background-image:url(\'https://image.tmdb.org/t/p/w154/poster.jpg\')"></div>',
 homeSeriesRow158:()=>'<div class="thumb" style="background-image:url(\'https://image.tmdb.org/t/p/w154/tv.jpg\')"></div>',
 homeEpisodeHistory158:()=>'<div class="thumb"></div>',
 paintHome:()=>{},route:()=> 'none',session:null,user:null,
 ct163Write:()=>{},rpc:async()=>[],homeCache:null,
 localDay:()=> '2026-10-17',Date,Promise,Math,Set,Map,setTimeout:()=>0
};
vm.createContext(sandbox);vm.runInContext(patch,sandbox,{timeout:1000});
const T=sandbox.window.__ctR270Test;assert.ok(T);
const thumb=sandbox.homeMovieRow158({});
assert.ok(thumb.includes('loading="lazy"')&&thumb.includes('decoding="async"')&&thumb.includes('poster.jpg'));
assert.ok(!thumb.includes('background-image:'),'Home posters should be truly browser-native lazy images');
const server={history_movies:[
 {media_id:44,tmdb_id:144,title:'Pokémon: O Filme',watched_at:'2026-09-19T14:00:00.000Z'}
]};
const dash=[
 {media_id:44,tmdb_id:144,media_type:'movie',title:'Pokémon: O Filme',is_seen:true,last_watched_at:'2026-09-19T14:00:00Z'},
 {media_id:45,tmdb_id:145,media_type:'movie',title:'Filme mais novo',poster_path:'/new.jpg',is_seen:true,last_watched_at:'2026-10-15T23:20:00Z'},
 {media_id:46,tmdb_id:146,media_type:'movie',title:'Pendente',is_watchlist:true,last_watched_at:'2026-10-16T00:00:00Z'},
 {media_id:47,tmdb_id:147,media_type:'tv',title:'Série',is_seen:true,last_watched_at:'2026-10-16T00:00:00Z'}
];
assert.equal(T.mergeHistory(server,dash),true);
assert.equal(server.history_movies.length,2,'only verified seen movies should be reconciled');
assert.equal(server.history_movies[0].title,'Filme mais novo','newest seen movie should be latest');
assert.equal(server.history_movies[1].title,'Pokémon: O Filme','must retain existing movie');
assert.equal(T.mergeHistory(server,dash),false,'no duplicates on repeated rendering');
assert.ok(saved.some(x=>x.rel==='preconnect'&&String(x.href).includes('image.tmdb.org')));
assert.ok(saved.some(x=>String(x.textContent).includes('.ct270-lazy-thumb>img')));
console.log('ANDROID_1_0_28_TEST_OK: history reconciliation and chronology, exclude not-seen, true lazy posters, fewer 6-page recommendations, incremental Top10 and no bulk prefetch');
