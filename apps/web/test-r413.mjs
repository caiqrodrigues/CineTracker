import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';
if(process.env.CT_R413_SKIP_BUILD!=='1')await import('./build-r413.mjs');
const [runtime,app,html,sw,pkg,rootPkg,releaseRaw,migration]=await Promise.all([
 readFile(resolve('runtime-r413-home-foryou-reality.js'),'utf8'),readFile(resolve('dist/app-v413.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260930170000_r413_reality_home_entry_foryou_actions.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
for(const need of ['REALITY_GENRE_ID=10764','reality','ct413HomeEntering','alignHomeNow','ensureSwapButtons','data-ct411-action="swap"','↻ Trocar'])ok(runtime.includes(need),'runtime missing '+need);
for(const need of ['cinetracker_discover_watch_unseen_v413','cinetracker_discover_fresh_v413','cinetracker_home_series_v413','window.__ctR413Eligibility.filterRows(personalCandidates','window.__ctR413Eligibility.filterRows(rawList'])ok(app.includes(need),'app missing '+need);
ok(html.includes('app-v413.js')&&!html.includes('app-v412.js'),'html');
ok(sw.includes('ct-web-1.0.204-r413'),'sw');
ok(JSON.parse(pkg).version==='1.0.204'&&JSON.parse(rootPkg).version==='1.0.204','packages');
ok(JSON.parse(releaseRaw).version==='1.0.204','release');
for(const need of ['10764','reality','cinetracker_recommendation_eligible_v413'])ok(migration.toLowerCase().includes(need.toLowerCase()),'migration '+need);

const listeners={};
const document={
 documentElement:{dataset:{}},
 querySelector:()=>null,querySelectorAll:()=>[],
 createElement:tag=>({tagName:tag.toUpperCase(),dataset:{},className:'',hidden:false,setAttribute(){},removeAttribute(){},appendChild(){},style:{setProperty(){}}})
};
const base={
 reasonSync:x=>Number(x?.runtime_minutes||0)>0&&Number(x.runtime_minutes)<40?'short':'',
 eligible:async x=>!(Number(x?.runtime_minutes||0)>0&&Number(x.runtime_minutes)<40),
 filterRows:async(input,opts)=>input.filter(x=>!(Number(x?.runtime_minutes||0)>0&&Number(x.runtime_minutes)<40)).slice(0,opts.limit),
 clearCache:()=>{}
};
const window={
 window:null,__ctR412Eligibility:base,__ctR288R263:{discover263:{tab:'other'}},
 addEventListener:(n,fn)=>{listeners[n]=fn},scrollTo(){},requestAnimationFrame:fn=>fn()
};window.window=window;
const context={window,document,route:()=>'',history:{},queueMicrotask:()=>{},setTimeout:()=>0,requestAnimationFrame:fn=>fn(),console};
vm.createContext(context);vm.runInContext(runtime,context);
const E=context.window.__ctR413Eligibility;
ok(E.reasonSync({media_type:'tv',genre_ids:[10764]})==='reality','Reality genre id accepted');
ok(E.reasonSync({media_type:'tv',genres:[{name:'Reality'}]})==='reality','Reality name accepted');
ok(E.reasonSync({media_type:'movie',runtime_minutes:20})==='short','r412 short rule lost');
const filtered=await E.filterRows([
 {media_type:'tv',tmdb_id:1,genre_ids:[10764],title:'Reality'},
 {media_type:'movie',tmdb_id:2,runtime_minutes:20,title:'Short'},
 {media_type:'movie',tmdb_id:3,runtime_minutes:100,title:'Valid'}
],{limit:2,maxScan:3});
ok(filtered.length===1&&filtered[0].tmdb_id===3,'Reality/short dynamic exclusion failed');
console.log('R413_STATIC_AND_ELIGIBILITY_OK Reality + strict r412 rules + Home entry + Trocar repair');
