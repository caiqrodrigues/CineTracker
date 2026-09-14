import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
await import('./build-r283-official.mjs');
const runtime=await readFile(resolve('runtime-r283-history-actions-availability.js'),'utf8');
let bin='';for(const x of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r283-browser';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const page=resolve(dir,'index.html'),safe=s=>s.replaceAll('</script>','<\\/script>');
await writeFile(page,`<!doctype html><html><body>
<div data-media="tv:113962"><button id="rewatch" data-ct274-rewatch="episode">↻</button><button id="undo" data-ct273-history-undo="episode">↶</button></div>
<script>
let nav=0,rewatch=0,undo=0;
document.addEventListener('click',e=>{if(e.target.closest('[data-media]'))nav++},true);
function localDay(){return '2026-09-14'}
function ct274AvailableText(x){const n=Number(x?.available_episodes||0);return n+' legacy'}
async function ct275FirstReleasedUnseen(){return {season_number:1,episode_number:1,name:'Ancient'}}
async function ct275ReconcileOne(row){return row}
async function ct275ReloadHome(){return {}}
let ct274ReloadHome=ct275ReloadHome,ct273ReloadHome=ct275ReloadHome;
function ct275Tmdb(x){return Number(x?.tmdb_id||0)}
async function ct275ShowData(){return null}
const seasonMap=new Map();
async function ct275SeasonDataFresh(t,s){return seasonMap.get(t+':'+s)||null}
async function ct275Rewatch(){rewatch++}
async function ct273UndoHistory(){undo++}
</script><script>${safe(runtime)}</script><script>
const keys=(s,n)=>Array.from({length:n},(_,i)=>({s,e:i+1}));
const lioness={tmdb_id:113962,__ct275WatchedKeys:[...keys(1,8),...keys(2,8),...keys(3,5)]};
const lionessShow={seasons:[{season_number:1,episode_count:8},{season_number:2,episode_count:8},{season_number:3,episode_count:8}],last_episode_to_air:{season_number:3,episode_number:7,air_date:'2026-09-13'}};
ct283ApplyFreshAvailability(lioness,lionessShow);
const magnatas={tmdb_id:236235,__ct275WatchedKeys:keys(1,8)};
const magnatasShow={seasons:[{season_number:1,episode_count:8},{season_number:2,episode_count:8}],last_episode_to_air:{season_number:2,episode_number:8,air_date:'2026-09-03'}};
ct283ApplyFreshAvailability(magnatas,magnatasShow);
const raw={tmdb_id:4656,title:'Raw',__ct275WatchedKeys:[...keys(1,245),{s:34,e:36}]};
const rawShow={seasons:[{season_number:1,episode_count:1490},{season_number:33,episode_count:211},{season_number:34,episode_count:38}],last_episode_to_air:{season_number:34,episode_number:38,air_date:'2026-09-14'}};
seasonMap.set('4656:34',{episodes:Array.from({length:38},(_,i)=>({episode_number:i+1,name:'Raw '+(i+1),air_date:'2026-09-14'}))});ct283ApplyFreshAvailability(raw,rawShow);
const smack={tmdb_id:1549,title:'WWE Friday Night SmackDown',__ct275WatchedKeys:[...keys(1,195),...keys(27,37),{s:28,e:37}]};
const smackShow={seasons:[{season_number:1,episode_count:1176},{season_number:27,episode_count:200},{season_number:28,episode_count:38}],last_episode_to_air:{season_number:28,episode_number:38,air_date:'2026-09-12'}};
seasonMap.set('1549:28',{episodes:Array.from({length:38},(_,i)=>({episode_number:i+1,name:'Smack '+(i+1),air_date:'2026-09-12'}))});ct283ApplyFreshAvailability(smack,smackShow);
Promise.all([ct283FirstAfterFrontier(raw,rawShow),ct283FirstAfterFrontier(smack,smackShow)]).then(([rn,sn])=>{
 document.querySelector('#rewatch').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
 document.querySelector('#undo').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
 document.body.dataset.nav=String(nav);document.body.dataset.rewatch=String(rewatch);document.body.dataset.undo=String(undo);
 document.body.dataset.lioness=String(lioness.available_episodes);document.body.dataset.magnatas=String(magnatas.available_episodes);document.body.dataset.raw=String(raw.available_episodes);document.body.dataset.smack=String(smack.available_episodes);
 document.body.dataset.rawnext=rn?rn.season_number+':'+rn.episode_number:'';document.body.dataset.smacknext=sn?sn.season_number+':'+sn.episode_number:'';
 document.body.dataset.liontext=ct283AvailableText(lioness);document.body.dataset.magtext=ct283AvailableText(magnatas);
 document.body.dataset.done='true';
});
</script></body></html>`,'utf8');
try{for(const width of[420,1200]){const profile=resolve(dir,'profile-'+width);const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${profile}`,`--window-size=${width},900`,'--virtual-time-budget=1500','--dump-dom','file://'+page],{encoding:'utf8',timeout:40000,maxBuffer:12*1024*1024,stdio:['ignore','pipe','pipe']});for(const x of['data-done="true"','data-nav="0"','data-rewatch="1"','data-undo="1"','data-lioness="2"','data-magnatas="8"','data-raw="1493"','data-smack="1181"','data-rawnext="34:37"','data-smacknext="28:38"','data-liontext="2 episódios disponíveis para ver"','data-magtext="8 episódios disponíveis para ver"'])if(!out.includes(x))throw new Error('R283 browser '+width+' missing '+x)}console.log('R283_BROWSER_OK history actions isolated; Lioness=2 Magnatas=8 Raw=1493 SmackDown=1181; legacy next uses current frontier mobile+desktop')}finally{await rm(dir,{recursive:true,force:true})}
