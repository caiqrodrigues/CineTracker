import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';
if(process.env.CT_R412_SKIP_BUILD!=='1')await import('./build-r412.mjs');
const [runtime,app,html,sw,pkg,rootPkg,releaseRaw,migration]=await Promise.all([
 readFile(resolve('runtime-r412-global-recommendation-eligibility.js'),'utf8'),readFile(resolve('dist/app-v412.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260930143000_r412_global_recommendation_eligibility.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
for(const need of ['const MIN_RUNTIME=40','youtube originals','10766','novela','filterRows','repairForYou','data-ct411-action="swap"'])ok(runtime.toLowerCase().includes(need.toLowerCase()),'runtime missing '+need);
for(const need of ['cinetracker_discover_watch_unseen_v412','cinetracker_discover_fresh_v412','cinetracker_home_series_v412','window.__ctR412Eligibility.filterRows(personalCandidates'])ok(app.includes(need),'app missing '+need);
ok(html.includes('app-v412.js')&&!html.includes('app-v411.js'),'html');
ok(sw.includes('ct-web-1.0.203-r412'),'sw');
ok(JSON.parse(pkg).version==='1.0.203'&&JSON.parse(rootPkg).version==='1.0.203','packages');
ok(JSON.parse(releaseRaw).version==='1.0.203','release');
ok(migration.includes('p_require_movie_runtime')&&migration.includes('runtime_minutes < 40'),'migration runtime floor');

const details={
 'movie:1':{id:1,runtime:15,production_companies:[],genres:[],keywords:{keywords:[]}},
 'movie:2':{id:2,runtime:105,production_companies:[],genres:[{id:28,name:'Action'}],keywords:{keywords:[]}},
 'movie:3':{id:3,runtime:99,production_companies:[{name:'YouTube Originals'}],genres:[],keywords:{keywords:[]}},
 'tv:4':{id:4,networks:[],genres:[{id:10766,name:'Soap'}],keywords:{results:[]}},
 'tv:5':{id:5,networks:[{name:'HBO'}],genres:[{id:18,name:'Drama'}],keywords:{results:[]}}
};
const document={querySelector:()=>null,querySelectorAll:()=>[],documentElement:{dataset:{}}};
const window={addEventListener:()=>{},__ctR288R263:{discover263:{tab:'x'}}};window.window=window;
const context={window,document,route:()=>'',setTimeout,queueMicrotask,console,getComputedStyle:()=>({}),tmdb:async path=>{const p=path.split('/');return details[p[1]+':'+p[2]]||{}}};
vm.createContext(context);vm.runInContext(runtime,context);
const E=context.window.__ctR412Eligibility;
const result=await E.filterRows([
 {media_type:'movie',tmdb_id:1,title:'Short'},
 {media_type:'movie',tmdb_id:3,title:'YouTube'},
 {media_type:'tv',tmdb_id:4,name:'Novela'},
 {media_type:'movie',tmdb_id:2,title:'Long'},
 {media_type:'tv',tmdb_id:5,name:'Valid'}
],{limit:2,maxScan:5,requireOriginDetail:true,excludeWwe:true});
ok(result.length===2&&result[0].tmdb_id===2&&result[1].tmdb_id===5,'dynamic replacement/eligibility failed');
ok(E.reasonSync({media_type:'movie',tmdb_id:7,runtime_minutes:39})==='short','short movie accepted');
ok(E.reasonSync({media_type:'tv',tmdb_id:8,networks:[{name:'YouTube Premium'}]})==='youtube','YouTube accepted');
ok(E.reasonSync({media_type:'tv',tmdb_id:9,genre_ids:[10766]})==='novela','novela accepted');
console.log('R412_STATIC_AND_ELIGIBILITY_OK 40m + YouTube + novela + ordered replacement');
