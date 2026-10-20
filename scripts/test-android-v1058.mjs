import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r300-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Embedded Android r300 script missing');
const js=html.slice(a+tag.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0.58"'));
for(const marker of [
 "const REVISION='r300-android-official-1.0.58'",
 'window.__ctAndroidOfficialCode=10100',
 "[['previous','Anteriores'],['upcoming','Próximos'],['favorites','Favoritos']]",
 'function ct300SportsRange(p)',
 'function ct300Choice(rows)',
 'return ct300Choice(options);',
 'return seen.has(latestKey)?[]:[latest]',
 'function ct297Status(label)',
 'window.__ctR296WweHome',
 'cinetracker_recommendation_filter_v525',
 'data-ct111-f1'
])assert.ok(js.includes(marker),'Missing '+marker);
assert.ok(!js.includes("if(tabs&&!tabs.querySelector('[data-sports-tab=\"recent\"]'))"));
assert.ok(!js.includes("if(tabs&&!tabs.querySelector('[data-sports-tab=\"yesterday\"]'))"));

const rangeStart=js.indexOf('function ct300SportsRange(p){');
const rangeEnd=js.indexOf('sportsFiltered=function(p){',rangeStart);
assert.ok(rangeStart>0&&rangeEnd>rangeStart);
const state={tab:'previous',sport:'all'};
const range=new Function('sportsState',js.slice(rangeStart,rangeEnd)+'return ct300SportsRange;')(state);
const yesterday=new Date(Date.now()-86400000).toISOString(),tomorrow=new Date(Date.now()+86400000).toISOString();
const sportRows={events:[
 {id:1,sport_slug:'soccer',starts_at:yesterday,status:'finished'},
 {id:2,sport_slug:'formula_1',starts_at:tomorrow,status:'scheduled'},
 {id:3,sport_slug:'soccer',starts_at:yesterday,status:'live'}
]};
assert.deepEqual(range(sportRows).map(x=>x.id),[1],'Anteriores are completed/past events');
state.tab='upcoming';
assert.deepEqual(range(sportRows).map(x=>x.id),[3,2],'Próximos includes live events and future events');
state.sport='formula_1';assert.deepEqual(range(sportRows).map(x=>x.id),[2],'F1 filter is preserved');

const choiceStart=js.indexOf('function ct300Random(){');
const choiceEnd=js.indexOf('function candidates(key,current){',choiceStart);
assert.ok(choiceStart>0&&choiceEnd>choiceStart);
let random=0;
const choose=new Function('globalThis',js.slice(choiceStart,choiceEnd)+'return ct300Choice;')(
 {crypto:{getRandomValues(a){a[0]=Math.floor(random*4294967296)}}}
);
const options=[{tmdb_id:1,vote_average:7},{tmdb_id:2,vote_average:8},{tmdb_id:3,vote_average:9}];
random=0;assert.equal(choose(options).tmdb_id,1);
random=.99;assert.equal(choose(options).tmdb_id,3);
assert.equal(choose([]),null);
assert.ok(js.includes('!seenIn(key).has(mediaRef(x))'));
assert.ok(js.includes('const newRows=available.filter(x=>!seenIn(key).has(mediaRef(x))'));
assert.ok(js.includes('return newRows;'));

const epStart=js.indexOf('async function ct176ReleasedUnwatched(showId,watched,limit=6){');
const epEnd=js.indexOf('async function ct176PrimeWithWatched(',epStart);
assert.ok(epStart>0&&epEnd>epStart);
let calls=0;
const yesterdayDate=new Date(Date.now()-86400000).toISOString().slice(0,10);
const todayDate=new Date().toISOString().slice(0,10);
const shows={
 4656:{status:'Returning Series',last_episode_to_air:{season_number:33,episode_number:42,air_date:yesterdayDate,name:'Raw recente'},seasons:[{season_number:1},{season_number:33}]},
 1549:{status:'Returning Series',last_episode_to_air:{season_number:27,episode_number:51,air_date:yesterdayDate,name:'SmackDown recente'},seasons:[{season_number:1},{season_number:27}]},
 5555:{status:'Returning Series',last_episode_to_air:{season_number:3,episode_number:7,air_date:yesterdayDate},seasons:[{season_number:1},{season_number:3}]}
};
const episodes={
 '5555:1':[{episode_number:1,air_date:yesterdayDate},{episode_number:2,air_date:yesterdayDate}],
 '5555:3':[{episode_number:5,air_date:yesterdayDate},{episode_number:6,air_date:yesterdayDate},{episode_number:7,air_date:tomorrow}]
};
const queue=new Function('localDay','tmdb','ct172Season','ct176EpisodeKey',
 js.slice(epStart,epEnd)+'return ct176ReleasedUnwatched;')(
 ()=>todayDate,
 async path=>shows[Number(path.split('/').at(-1))],
 async (id,sn)=>{calls++;return{episodes:episodes[id+':'+sn]||[]}},
 (sn,en)=>sn+':'+en
);
const raw=await queue(4656,new Set(['1:1','1:2','33:41']),6);
assert.deepEqual(raw.map(x=>[x.season,x.episode]),[[33,42]]);
assert.equal(calls,0,'WWE cannot crawl thousands of historical episodes');
assert.deepEqual(await queue(4656,new Set(['33:42']),6),[],'Latest watched WWE remains caught up');
assert.deepEqual((await queue(1549,new Set(['1:13','27:50']),6)).map(x=>x.episode),[51]);
assert.equal(calls,0,'SmackDown must be resolved directly from latest aired');
const normal=await queue(5555,new Set(['1:1','3:5']),6);
assert.deepEqual(normal.map(x=>[x.season,x.episode]),[[3,6]],'Next actual progression takes priority over old gap');
const fromStart=await queue(5555,new Set(),6);
assert.equal(fromStart[0].season,1);
assert.equal(fromStart[0].episode,1);
console.log('ANDROID_1_0_58_TEST_OK: Sports three tabs + F1 continuity, v525-weighted varied no-repeat swap, Raw/SmackDown latest released, sequential normal next episode; signed builds pending.');
