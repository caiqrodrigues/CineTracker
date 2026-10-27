import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {TextEncoder} from 'node:util';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {tmpdir} from 'node:os';

const source=await readFile('apps/android/runtime-r326-media-export.js','utf8');
new Function(source);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 assert.ok(!source.includes(forbidden),'Export may not reload or run an unbounded loop');

const media=[
 {id:1,tmdb_id:101,media_type:'movie',media_kind:'movie',title:'O Filme, Especial',release_year:2025},
 {id:2,tmdb_id:202,media_type:'tv',media_kind:'anime',title:'Dragon Ball',release_year:2026,total_episodes:20},
 {id:3,tmdb_id:303,media_type:'sport',media_kind:'event',title:'F1 GP',release_year:2026},
 {id:4,tmdb_id:404,media_type:'movie',media_kind:'movie',title:'Filme visto importado',release_year:2024}
];
const overrides=[
 {id:1,media_id:1,state:'Seen',watched_at:'2026-10-20T18:00:00Z'},
 {id:2,media_id:1,state:'Liked'},
 {id:3,media_id:2,state:'WatchLater'},
 {id:4,media_id:3,state:'Liked'},
 {id:5,media_id:4,state:'AlreadySeen'},
 {id:6,media_id:1,state:'AddedToWatchlist'}
];
const progress=[
 {id:1,media_id:2,season_number:1,episode_number:1,watched:true,watched_at:'2026-10-11T18:00:00Z'},
 {id:2,media_id:2,season_number:1,episode_number:2,watched:true,watched_at:'2026-10-18T18:00:00Z'},
 {id:3,media_id:2,season_number:1,episode_number:3,watched:true,watched_at:'2026-10-27T21:54:50Z'},
 {id:4,media_id:3,season_number:1,episode_number:1,watched:true,watched_at:'2026-10-27T20:00:00Z'}
];
const history=[
 {id:1,media_id:1,item_type:'movie',watched_at:'2026-10-20T18:00:00Z'},
 {id:2,media_id:2,item_type:'episode',season_number:1,episode_number:3,watched_at:'2026-10-27T21:54:50Z'},
 {id:3,media_id:3,item_type:'sport',watched_at:'2026-10-27T18:00:00Z'}
];
const listeners=new Map();let saved=null;
const button={disabled:false,textContent:'Exportar snapshot',dataset:{},
 removeAttribute(k){this.removed=k}};
const root={querySelector:query=>query==='[data-export]'?button:null};
const ctx={
 window:{addEventListener:()=>{},CineTrackerNative:{exportBackup:(name,content,mime)=>{saved={name,content,mime}}}},
 document:{querySelector:query=>query==='[data-configs]'?root:query==='[data-ct326-export-media]'?button:null,
  addEventListener:(name,fn)=>listeners.set(name,fn)},
 session:{user:{id:'36b0cbb9-0046-48c0-a756-5fa4db9fbc42'},access_token:'signed-in'},
 user:{id:'36b0cbb9-0046-48c0-a756-5fa4db9fbc42'},route:()=> 'configs',
 renderConfigs:async()=>true,localDay:()=> '2026-10-27',toast:()=>{},TextEncoder,btoa,
 api:async path=>{
  if(path.startsWith('media_overrides?'))return overrides;
  if(path.startsWith('episode_progress?'))return progress;
  if(path.startsWith('watch_history?'))return history;
  if(path.startsWith('media?'))return media;
  throw Error('Unexpected export endpoint: '+path);
 }
};
new Function('ctx','with(ctx){'+source+'}')(ctx);
const module=ctx.window.__ctR326MediaExport;
assert.ok(module);
await ctx.renderConfigs(1);
assert.equal(button.dataset.ct326ExportMedia,'1','Existing JSON snapshot is replaced by ZIP export');
assert.equal(button.removed,'data-export','Legacy sport-inclusive snapshot is unavailable');
assert.equal(await module.exportZip(),true);
assert.equal(saved.mime,'application/zip');
assert.match(saved.name,/CineTracker-series-filmes-2026-10-27\.zip/);
const bytes=Buffer.from(saved.content,'base64');
assert.equal(bytes.readUInt32LE(0),0x04034b50,'Native Android bridge receives a real ZIP');
const temp=await mkdtemp(join(tmpdir(),'cinetracker-r326-'));
try{
 const path=join(temp,'CineTracker-series-filmes.zip');
 await writeFile(path,bytes);
 try{execFileSync('unzip',['-t',path],{stdio:'pipe'})}
 catch(error){throw Error('ZIP structure rejected by unzip: '+error.stdout?.toString())}
}finally{await rm(temp,{recursive:true,force:true})}
const names=new Map();let p=0;
while(p+30<=bytes.length&&bytes.readUInt32LE(p)===0x04034b50){
 const len=bytes.readUInt32LE(p+18),nameLen=bytes.readUInt16LE(p+26),extra=bytes.readUInt16LE(p+28);
 const name=bytes.subarray(p+30,p+30+nameLen).toString('utf8');
 const content=bytes.subarray(p+30+nameLen+extra,p+30+nameLen+extra+len).toString('utf8');
 names.set(name,content);p+=30+nameLen+extra+len;
}
assert.equal(names.size,8,'CSV ZIP has six data files plus manifest and documentation');
for(const name of ['filmes.csv','series.csv','episodios.csv','historico.csv','watchlist.csv','favoritos.csv'])
 assert.ok(names.has(name),name);
assert.match(names.get('filmes.csv'),/"O Filme, Especial"/,'CSV commas are escaped');
assert.match(names.get('filmes.csv'),/Filme visto importado,2024,watched,true/,
 'AlreadySeen import state is exported as watched even without a watch_history row');
assert.match(names.get('watchlist.csv'),/Dragon Ball/,'WatchLater status must be included');
assert.match(names.get('watchlist.csv'),/"O Filme, Especial"/,'AddedToWatchlist status must be included');
assert.match(names.get('episodios.csv'),/2026-10-27T21:54:50Z/,'Dragon Ball episode progress is included');
assert.match(names.get('historico.csv'),/2026-10-27T21:54:50Z/,'Individual history timestamps are included');
assert.ok(![...names.values()].join(' ').includes('F1 GP'),'No sport items in export');
assert.ok(!names.has('esportes.csv'));
const manifest=JSON.parse(names.get('manifest.json'));
assert.equal(manifest.counts.movies,2);
assert.equal(manifest.counts.series,1);
assert.equal(manifest.counts.episodes,3);
assert.equal(manifest.sports_included,false);
assert.equal(module.stats().successes,1);
assert.equal(button.disabled,false);
// The Profile's quick counter must settle before a slow library request.
const profileSource=await readFile('apps/android/runtime-r325-profile-immediate-sync.js','utf8');
let releaseDashboard;
const delayedDashboard=new Promise(resolve=>{releaseDashboard=resolve});
const profileCtx={
 window:{addEventListener(){}},document:{addEventListener(){},querySelector:()=>null},
 session:ctx.session,user:ctx.user,route:()=> 'home',homeCache:null,
 profileCache:{stats:{episodes_watched:4},dashboard:[{media_id:1}]},
 ct163Read:()=>null,ct163Write:()=>{},ct168MergeQuick:(base,quick)=>({...base,...quick}),
 syncProfile263:()=>{},ct169RenderActivity:()=>{},tz:()=> 'America/Sao_Paulo',
 rpc:async name=>name==='cinetracker_profile_quick_stats_v1'?{stats:{episodes_watched:5}}:
  name==='cinetracker_profile_media_dashboard_v0991'?delayedDashboard:[],
 setTimeout,clearTimeout
};
new Function('ctx','with(ctx){'+profileSource+'}')(profileCtx);
const profileJob=profileCtx.window.__ctR325Profile.prewarm(true);
await new Promise(resolve=>setTimeout(resolve,20));
assert.equal(profileCtx.profileCache.stats.episodes_watched,5,
 'Fast Profile stats must not wait for a 15-second dashboard RPC');
releaseDashboard([{media_id:1,watched_episodes:3}]);
await profileJob;
assert.equal(profileCtx.profileCache.dashboard[0].watched_episodes,3);
const built=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
assert.ok(built.includes('data-ct-android="r326-android-stable-js"'));
assert.ok(built.includes('window.__ctR326MediaExport='));
assert.ok(built.includes('window.__ctR325Series='));
assert.ok(built.includes('window.__ctR325Profile='));
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1\.0'/);
assert.match(gradle,/versionCode 10127/);
console.log('CINETRACKER_ANDROID_1_0_R326_TEST_OK: real ZIP, six CSVs, movie/TV only, episode history, dates, favorites, watchlist, native file picker, r325 Home+Profile preserved; Web frozen.');
