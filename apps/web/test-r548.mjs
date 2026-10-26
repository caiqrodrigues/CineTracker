import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const [js,html,release,source,drawer]=await Promise.all([
 readFile('dist/app-v548.js','utf8'),readFile('dist/index.html','utf8'),
 readFile('dist/release.json','utf8').then(JSON.parse),
 readFile('runtime-r548-web-home-premieres.js','utf8'),
 readFile('runtime-r548-wwe-drawer-hook.js','utf8')
]);
new Function(js);
assert.match(js,/const REVISION='r548-official-0\.3\.75'/);
assert.match(html,/app-v548\.js/);
assert.equal(release.revision,'r548-official-0.3.75');
assert.ok(js.includes('window.__ctR548Home={'));
assert.ok(js.includes('window.__ctR548WweDetail={'));
assert.ok(js.includes('cinetracker_home_series_watch_state_v4'));
assert.ok(drawer.includes('cinetracker_unmark_history_item_v426'));
assert.ok(drawer.includes('IntersectionObserver'));
assert.ok(!source.includes('window.location.reload('));
assert.ok(!source.includes('router.refresh('));

const events={};
class FixedDate extends Date{
 constructor(...args){super(...(args.length?args:['2026-10-26T12:00:00Z']))}
 static now(){return Date.parse('2026-10-26T12:00:00Z')}
}
const context={
 window:{__ctCoreR471:{route:()=>'',authReady:()=>true},addEventListener:(event,fn)=>{events[event]=fn}},
 document:{addEventListener(){},querySelector:()=>null,documentElement:{dataset:{}}},
 setTimeout:()=>0,clearTimeout:()=>{},Date:FixedDate,Intl,Promise,Map,Set,Array,Number,String,
 console
};
vm.runInNewContext(source,vm.createContext(context));
const {selectEpisode,mediaId}=context.window.__ctR548Home;
const watch=keys=>[{tmdb_id:4656,watched_episodes:1,watched_keys:keys}];
const show={watched_episodes:3,source_state:'UpToDate',raw_tmdb:{last_episode_to_air:{season_number:34,episode_number:42,air_date:'2026-10-19'}}};
const recent={season_number:34,episode_number:42,air_date:'2026-10-19',name:'Raw — 19/10/2026'};
assert.equal(mediaId({tmdb_id:-1690860703,title:'WWE Friday Night SmackDown'}),1549);
assert.equal(mediaId({tmdb_id:-1181321610,title:'Lupin'}),96677);
// An episode the user already watched must not appear just because older WWE backlog exists.
assert.equal(selectEpisode(4656,show,watch([{s:34,e:42,at:'2026-10-20T10:00:00Z'}]),{last_episode_to_air:recent},null,null),null);
assert.equal(selectEpisode(4656,show,watch([]),{last_episode_to_air:recent},null,null).episode,42);
// A weekly WWE episode dated today must not be offered before its evening broadcast.
assert.equal(selectEpisode(4656,show,watch([{s:34,e:42,at:'2026-10-20T10:00:00Z'}]),{last_episode_to_air:{...recent,episode_number:43,air_date:'2026-10-26'}},null,null),null);
// Lupin Part 4: TMDB/DB still reports 2023 S2E7, Netflix confirms 2026 S3E1..E8.
const old={season_number:2,episode_number:7,air_date:'2023-10-05',name:'Capítulo 7'};
const lupinState=[{tmdb_id:96677,watched_episodes:17,watched_keys:[{s:2,e:7,at:'2023-10-05T19:00:00Z'},{s:3,e:7,at:'2023-10-05T19:00:00Z'}]}];
const lupin=selectEpisode(96677,{watched_episodes:17,source_state:'UpToDate'},lupinState,{last_episode_to_air:old},null,null);
assert.equal(lupin.season,3);
assert.equal(lupin.episode,1);
assert.equal(lupin.available,8);
assert.equal(lupin.air,'2026-10-23');
// Once S3E1 is marked after release, the suggested episode advances to S3E2.
lupinState[0].watched_keys.push({s:3,e:1,at:'2026-10-24T18:00:00Z'});
assert.equal(selectEpisode(96677,{source_state:'UpToDate'},lupinState,{last_episode_to_air:old},null,null).episode,2);
lupinState[0].watched_keys.push(...Array.from({length:7},(_,i)=>({s:3,e:i+2,at:'2026-10-25T20:00:00Z'})));
assert.equal(selectEpisode(96677,{source_state:'UpToDate'},lupinState,{last_episode_to_air:old},null,null),null);
assert.equal(selectEpisode(96677,{watched_episodes:0,source_state:'WatchLater'},[{tmdb_id:96677,watched_episodes:0,watched_keys:[]}],{last_episode_to_air:old},null,null),null);

console.log('WEB_R548_TEST_OK: premiered series, watched exclusion, WWE scoped drawer and Web-only build');
