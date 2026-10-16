import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const file='apps/android/app/src/main/assets/hotfix5/index.html';
const html=await readFile(file,'utf8'),a=html.indexOf('<script data-ct-android="r265-android-js">'),b=html.indexOf('</script>',a);
assert.ok(a>=0&&b>a);
const js=html.slice(a+'<script data-ct-android="r265-android-js">'.length,b);
for(const need of [
 'name="ct-official-version" content="1.0.23"',
 "const REVISION='r265-android-official-1.0.23';",
 "window.__ctAndroidOfficialCode=10065",
 "window.__ctR265AndroidV1023='f1-gp-weekend+sports-fast-first-paint+phone-fit+strict-foryou'",
 "window.__ctR264AndroidV1022=",
 "window.__ctR263AndroidV1021=",
 "window.__ctR243Fix=",
 "window.__ctR226V120=",
 "window.__ctR265F1?.setData(d)",
 'cinetracker_special_series_counts_v540',
 'cinetracker_f1_watch_sync_v462',
 'cinetracker_ufc_watch_v512',
 'cinetracker_wwe_ppv_watch_v519',
 'cinetracker_sports_watch_set_v296',
 'cinetracker_sports_payload_v1',
 'cinetracker_recommendation_filter_v525',
 'cinetracker_activity_items_by_day_v518',
 'cinetracker_sports_team_recent_v525',
 'data-ct265-race',
 'data-ct265-gp-dialog',
 'ct265-empty-slot',
 '100dvh',
 'overflow-y:auto',
 'data-home-viewport'
])assert.ok((need.startsWith('name="')?html:js).includes(need),'missing '+need);
const patch=await readFile('apps/android/runtime-r265-v1023-device-parity.js','utf8');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.equal(patch.includes(bad),false,'forbidden '+bad);
assert.ok(js.includes('aew|all elite wrestling'));
new Function(js);new Function(patch);
const listeners={};
const el=(tag='div')=>({tagName:tag,style:{},dataset:{},textContent:'',appendChild(){},setAttribute(){},querySelector(){return null},querySelectorAll(){return[]},closest(){return null}});
const sandbox={
 window:{},document:{head:{appendChild(){}},documentElement:{dataset:{}},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(t,f){listeners[t]=f}},
 console,Date,Intl,Promise,Map,Set,URL,requestAnimationFrame:f=>f(),queueMicrotask:f=>f(),setTimeout,clearTimeout,
 ct186Select:d=>({daily:d._ct186_fresh?.movie?.[0]||null,wm:d._ct186_watchlist?.movie?.[0]||null,ws:null,wa:null,fm:d._ct186_fresh?.movie?.[1]||null,fs:null,fa:null,wmPool:d._ct186_watchlist?.movie||[],wsPool:[],waPool:[]}),
 ct186LoadForYou:async()=>({}),ct186Slot:()=>'<b>slot</b>',
 sportsPayload:async()=>({}),renderSports:async()=>{},sportsCache:null,
};
sandbox.window.document=sandbox.document;
vm.createContext(sandbox);vm.runInContext(patch,sandbox,{timeout:1000});
const T=sandbox.window.__ctR265Test;assert.ok(T);
const valid={id:4,title:'Um Filme Elegível',poster_path:'/poster.jpg',vote_average:9};
const aeW={id:5,title:'AEW Revolution 2026',poster_path:'/aew.jpg',vote_average:9};
assert.equal(T.allowed(aeW),false,'AEW forbidden');
assert.equal(T.allowed({...aeW,title:'WWE Backlash'}),false);
assert.equal(T.allowed({...aeW,title:'Stand-Up Comedy Special'}),false);
assert.equal(T.allowed({...aeW,title:'Youtube Original',homepage:'https://www.youtube.com/watch/xyz'}),false);
assert.equal(T.allowed({...aeW,title:'Curta de 29 minutos',runtime:29}),false);
assert.equal(T.allowed(valid),true);
const fresh={_ct186_fresh:{movie:[aeW,valid],series:[],anime:[]},_ct186_watchlist:{movie:[aeW,valid],series:[],anime:[]},_ct186_fallback:{movie:[valid],series:[],anime:[]}};
T.sanitize(fresh);assert.equal(fresh._ct186_fresh.movie.length,1);assert.equal(fresh._ct186_fresh.movie[0].title,valid.title);assert.equal(fresh._ct186_fallback.movie.length,0);
assert.equal(sandbox.ct186Select(fresh).daily.title,valid.title);
const race={round:'3',date:'2026-04-20',time:'17:00:00Z',FirstPractice:{date:'2026-04-18',time:'14:00:00Z'},Qualifying:{date:'2026-04-19',time:'18:00:00Z'}};
const sessions=T.sessions(race,2026);assert.equal(sessions.length,3);assert.ok(sessions.some(x=>x.id==='f1:2026:3:race'));
const ranks=T.resultsList({MRData:{RaceTable:{Races:[{Results:[{grid:'1',position:'1'}]}]}}});assert.equal(ranks.length,1);
console.log('ANDROID_1_0_23_TEST_OK AEW+WWE+YouTube+runtime+F1-weekend+native-parity+phone-layout');
