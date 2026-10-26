import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const [js,html,release,wwe,guard,resume]=await Promise.all([
 readFile('dist/app-v549.js','utf8'),readFile('dist/index.html','utf8'),
 readFile('dist/release.json','utf8').then(JSON.parse),
 readFile('runtime-r549-wwe-final-owner.js','utf8'),
 readFile('runtime-r549-home-render-guard.js','utf8'),
 readFile('runtime-r549-home-auth-resume.js','utf8')
]);
new Function(js);
assert.equal(release.revision,'r549-official-0.3.76');
assert.match(html,/app-v549\.js/);
assert.match(js,/const REVISION='r549-official-0\.3\.76'/);
assert.ok(!html.includes('app-v548.js'));
const finalOwner=js.indexOf('const ct549WweShowIds=');
assert.ok(finalOwner>js.lastIndexOf('ct169DrawerEpisode=function(ep,sn,watched)'),'WWE owner must execute AFTER r174');
assert.ok(finalOwner>js.lastIndexOf('ct169OpenSeasonDrawer=async function(showId,seasonNo,jumpEp=0)'),'WWE owner must execute AFTER r181');
assert.ok(finalOwner>js.indexOf('async function ct181DecorateSeasons(showId)'),'WWE owner must execute AFTER r181');
assert.ok(js.indexOf('ct549ApplyReleasedToVisibleHome();')>js.indexOf('function renderSeries404(){'));
assert.ok(js.indexOf('ct549ApplyReleasedToVisibleHome();')<js.indexOf('const data=rows(series404)'));
assert.ok(js.includes('window.__ctR549HomeAuth='));
for(const source of [wwe,guard,resume]){
 assert.ok(!source.includes('window.location.reload('));
 assert.ok(!source.includes('router.refresh('));
}

const listeners={};
const sandbox={
 window:{addEventListener:(name,fn)=>{listeners[name]=fn}},
 document:{documentElement:{dataset:{}},querySelectorAll:()=>[],querySelector:()=>null},
 rpc:async(name,args)=>{
  assert.equal(name,'cinetracker_home_series_watch_state_v4');
  assert.equal(args.p_tmdb_ids[0],4656);
  return [{tmdb_id:4656,watched_keys:[{s:34,e:42},{s:35,e:1}],media_ids:[2111]}];
 },
 setTimeout,clearTimeout,Date,Promise,Map,Set,Number,String,Array,CustomEvent:class{},
 console
};
const boot=`
 let ct169WatchedSet=async()=>new Set(['old:1']);
 let ct169DrawerEpisode=(ep,sn,watched)=>{
  const seen=watched.has(sn+':'+ep.episode_number);
  return '<button type="button" '+(seen?'data-ct174-unmark-episode="'+sn+':'+ep.episode_number+'"':'data-ct169-mark-episode="'+sn+':'+ep.episode_number+'"')+'>'+(seen?'✓ Assistido':'○ Assistido')+'</button>';
 };
 let ct169DrawerState={showId:4656,seasonNo:34,episodes:[{episode_number:42}],watched:new Set(['34:42'])};
 let ct181DecorateSeasons=async()=>true;
 let ct181SeasonDecorateSeq=0,ct181SeasonWatched=null,ct181SeasonWatchedShow=0;
 let ct181Watched=async()=>new Set(['34:42']);
 let ct181Season=async()=>({episodes:[]});
 let ct181SeasonState=()=>({total:0,seen:0});
 let ct181SetCardToggle=()=>{};
 let ct169OpenSeasonDrawer=async()=>true;
 let ct181OpenSeasonDrawerBase=async()=>true;
 let ct181RefreshSeasonControl=async()=>true;
 let route=()=> 'series';
 let ct174ReplaceDrawerEpisode=()=>{},homeCache={},profileCache={};
 let ensureMedia=async()=>({id:2111}),api=async()=>[],toast=()=>{};
`;
const c=vm.createContext(sandbox);
vm.runInContext(boot+wwe+`\n globalThis.verifyWwe={watch:ct169WatchedSet,episode:ct169DrawerEpisode,open:ct169OpenSeasonDrawer};`,c);
const watched=await sandbox.verifyWwe.watch(4656);
assert.equal(watched.has('34:42'),true);
assert.equal(watched.has('35:1'),true,'the watched state must cover ALL WWE seasons');
const watchedMarkup=sandbox.verifyWwe.episode({episode_number:42},34,watched);
assert.ok(watchedMarkup.includes('data-ct549-wwe-toggle="34:42"'));
assert.ok(watchedMarkup.includes('Desmarcar'));
const unwatchedMarkup=sandbox.verifyWwe.episode({episode_number:43},34,watched);
assert.ok(unwatchedMarkup.includes('Marcar visto'));
assert.ok(listeners.click,'optimistic episode click owner missing');

const state=vm.createContext({
 window:{__ctR548Home:{selected:new Map([[4656,{row:{title:'Raw'},episode:{season:34,episode:43,name:'Raw novo',air:'2026-10-26',available:1}}]]),mediaId:x=>Number(x.tmdb_id||0)}},
 series404:[{title:'Raw',tmdb_id:4656,home_bucket:'up_to_date',next_episode_number:null}],
 Math,Number,Map
});
vm.runInContext(guard+`\nct549ApplyReleasedToVisibleHome();`,state);
assert.equal(state.series404[0].home_bucket,'continue');
assert.equal(state.series404[0].next_episode_number,43);
state.window.__ctR548Home.selected.clear();
vm.runInContext('ct549ApplyReleasedToVisibleHome();',state);
assert.equal(state.series404[0].home_bucket,'up_to_date','restores previous bucket once aired episode is watched');

console.log('WEB_R549_TEST_OK: last WWE owner, multi-season watch state, episode toggles, actual r404 Home owner and rollback');
