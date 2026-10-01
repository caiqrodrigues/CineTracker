import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import vm from 'node:vm';

if(process.env.CT_R422_SKIP_BUILD!=='1')await import('./build-r422.mjs');
const [runtime,built,html,releaseRaw]=await Promise.all([
 readFile(resolve('runtime-r422-audit-performance.js'),'utf8'),
 readFile(resolve('dist/app-v422.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
new Function(runtime);new Function(built);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r422 runtime forbidden '+bad);
for(const need of [
 "window.__ctR422Marker='coalesced-foreground+strict-7.5-1990-drama-doc+persisted-7d-foryou+stable-actions+profile-unified-collapse'",
 'cinetracker_shown_recommendations_recent_v296','cinetracker_shown_recommendations_record_v296',
 'scoreOf','yearOf','pureDramaDocumentary','syncProfileCollapse'
])if(!runtime.includes(need))throw new Error('r422 runtime missing '+need);
for(const bad of [
 'const ct244Observer=new MutationObserver',
 'new MutationObserver(queue237)',
 'new MutationObserver(()=>queue246',
 'new MutationObserver(()=>{if(routeNow()===\'discover\'',
 'new MutationObserver(()=>{if([\'profile\',\'perfil\'].includes(routeNow())'
])if(built.includes(bad))throw new Error('r422 built still contains redundant observer '+bad);
if((built.match(/new MutationObserver/g)||[]).length)throw new Error('r422 built contains global MutationObserver');
for(const need of [
 "window.__ctWebBuild='1.0.213'","r422-official-1.0.213",
 "if(action==='swap')void window.__ctR422?.swapForYou?.(slot)",
 'p_limit:48','window.__ctR422Eligibility.filterRows',
 "window.__ctR421?.toggleF1?.(f1)"
])if(!built.includes(need))throw new Error('r422 built missing '+need);
if(!html.includes('app-v422.js')||!html.includes('app-v422.css'))throw new Error('r422 assets not bound');
const release=JSON.parse(releaseRaw);if(release.version!=='1.0.213'||release.revision!=='r422-official-1.0.213')throw new Error('r422 release identity invalid');

const source=runtime+'\n;globalThis.__out=window.__ctR422Eligibility;';
const context={
 window:{__ctR412Eligibility:{reasonSync:()=>'',eligible:async()=>true,filterRows:async v=>v,detail:async x=>x},__ctR413Eligibility:{isReality:()=>false}},
 document:{querySelector:()=>null,querySelectorAll:()=>[],documentElement:{dataset:{}},addEventListener:()=>{}},
 localStorage:{getItem:()=>null,setItem:()=>{}},requestAnimationFrame:fn=>fn(),setTimeout,clearTimeout,CustomEvent:function(){},
 rpc:async()=>[],console,location:{pathname:'/'}
};
context.window.window=context.window;context.window.document=context.document;context.window.addEventListener=()=>{};context.window.requestAnimationFrame=context.requestAnimationFrame;context.window.localStorage=context.localStorage;
vm.createContext(context);vm.runInContext(source,context);
const E=context.__out;
const mk=(score,year,genres)=>({media_type:'movie',tmdb_id:1,title:'Teste',poster_path:'/x.jpg',vote_average:score,release_date:String(year)+'-01-01',genres});
if(!E)throw new Error('r422 eligibility export missing');
if(!String(E.supplementalReason(mk(7.4,2025,[{id:28,name:'Ação'}]))).includes('rating'))throw new Error('rating <7.5 not blocked');
if(!String(E.supplementalReason(mk(8.0,1990,[{id:28,name:'Ação'}]))).includes('year'))throw new Error('year <=1990 not blocked');
if(!E.pureDramaDocumentary(mk(8.0,2025,[{id:18,name:'Drama'},{id:99,name:'Documentário'}])))throw new Error('pure drama/documentary not blocked');
if(E.pureDramaDocumentary(mk(8.0,2025,[{id:18,name:'Drama'},{id:28,name:'Ação'}])))throw new Error('Drama + valid genre incorrectly blocked');

for(const p of ['runtime-r422-audit-performance.js','build-r422.mjs','test-r422.mjs'])execFileSync(process.execPath,['--check',p],{stdio:'inherit'});
console.log('R422_TEST_OK strict eligibility + persisted history hooks + zero global observers + F1 delegation');
