import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),patch=(await readFile(resolve(root,'apps/web/runtime-r221-v115-watchlist-f1-sessions.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v115-browser';await mkdir(dir,{recursive:true});const file=resolve(dir,'index.html');
const pre=`<script>
const mediaTmdb=x=>Number(x?.tmdb_id||x?.id||0),mediaType=x=>x?.media_type==='movie'?'movie':'tv',mediaPoster=x=>x?.poster_path||x?.raw_tmdb?.poster_path||null;
let ct186ContextValue=null,ct186ContextAt=0,ct186LocalBlocked=new Set(),ct166SwapIndex={},sportsCache=null;
const c={dash:[
 {tmdb_id:101,media_type:'movie',media_kind:'movie',title:'Drama Low Score',is_watchlist:true,raw_tmdb:{}},
 {tmdb_id:202,media_type:'tv',media_kind:'series',title:'Drama Series',is_watchlist:true,raw_tmdb:{}},
 {tmdb_id:303,media_type:'tv',media_kind:'anime',title:'Anime',is_watchlist:true,raw_tmdb:{}},
 {tmdb_id:404,media_type:'movie',media_kind:'movie',title:'Started',is_watchlist:true,is_in_progress:true,raw_tmdb:{}}
],watchMovieIds:new Set([101,404]),watchTvIds:new Set([202,303])};
async function ct186Context(){return c} function ct186WatchPools(){return{movie:[],series:[],anime:[]}}
function ct186InWatchlist(x,ctx){return (x.media_type==='movie'?ctx.watchMovieIds:ctx.watchTvIds).has(Number(x.tmdb_id||x.id))}
function ct186Select(){return{daily:null,fm:null,fs:null,fa:null}}
async function discoverRows(){return{_ct186_fresh:{movie:[],series:[],anime:[]},_ct186_watchlist:{movie:[],series:[],anime:[]}}}
window.__ctV113MemoryBlocked=()=>true;
async function safeTmdb(path){const id=Number(path.split('/').pop()),tv=path.includes('/tv/');return{id,title:tv?undefined:'X',name:tv?'X':undefined,vote_average:5.1,poster_path:'/p.jpg',release_date:tv?undefined:'1985-01-01',first_air_date:tv?'1989-01-01':undefined,genres:[{id:18}],genre_ids:[18],origin_country:tv?['KR']:['US']}}
const f1={races:[{round:'16',raceName:'Italian Grand Prix',date:'2099-09-12',time:'13:00:00Z',Circuit:{circuitName:'Monza'},FirstPractice:{date:'2099-09-10',time:'11:30:00Z'},SecondPractice:{date:'2099-09-10',time:'15:00:00Z'},ThirdPractice:{date:'2099-09-11',time:'10:30:00Z'},Qualifying:{date:'2099-09-11',time:'14:00:00Z'}}]};
async function edge(){return f1} async function sportsPayload(){return{sports:[{slug:'formula_1',name:'Fórmula 1'}],events:[],favorites:[],preferences:{}}}
</script>`;
/* Use relative dates for the F1 fixture so the production 16-day window is exercised. */
const html=`<!doctype html><html><body>${pre}<script>${patch}</script><script>(async()=>{try{
 const now=new Date(),race=new Date(now);race.setDate(race.getDate()+3);const qual=new Date(now);qual.setDate(qual.getDate()+2);const fp1=new Date(now);fp1.setDate(fp1.getDate()+1);
 const day=x=>x.toISOString().slice(0,10);f1.races[0].date=day(race);f1.races[0].Qualifying.date=day(qual);f1.races[0].FirstPractice.date=day(fp1);delete f1.races[0].SecondPractice;delete f1.races[0].ThirdPractice;
 const ctx=await ct186Context(true),p=ctx.__ct115WatchPools||await window.__ctV115BuildWatchPools(ctx);document.body.dataset.wm=String(p.movie?.[0]?.tmdb_id||0);document.body.dataset.ws=String(p.series?.[0]?.tmdb_id||0);document.body.dataset.wa=String(p.anime?.[0]?.tmdb_id||0);document.body.dataset.started=String(p.movie?.some(x=>Number(x.tmdb_id)===404));
 const data={_ct186_fresh:{movie:[],series:[],anime:[]},_ct186_watchlist:p},sel=ct186Select(data);document.body.dataset.soft=String(!!sel.wm&&!!sel.ws&&!!sel.wa);
 const s=window.__ctV115F1Sessions(f1),titles=s.map(x=>x.title);document.body.dataset.qual=String(titles.some(x=>x.includes('Classificação')));document.body.dataset.race=String(titles.some(x=>x.includes('Corrida')));document.body.dataset.practice=String(titles.some(x=>x.includes('Treino Livre 1')));
 const sp=await sportsPayload(true);document.body.dataset.merged=String((sp.events||[]).filter(x=>x.sport_slug==='formula_1').length>=3);
 }catch(e){document.body.dataset.err=String(e.message||e)}finally{document.body.dataset.done='1'}})()</script></body></html>`;
await writeFile(file,html);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser']){try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=2200','--dump-dom','file://'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe']});if(out)break}catch{}}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const must of ['data-done="1"','data-wm="101"','data-ws="202"','data-wa="303"','data-started="false"','data-soft="true"','data-qual="true"','data-race="true"','data-practice="true"','data-merged="true"'])if(!out.includes(must))throw new Error('V115 contract missing '+must+'\n'+out.slice(-6000));
if(out.includes('data-err='))throw new Error('V115 browser runtime error');
console.log('V115_BROWSER_OK watchlist=known-allowed started=blocked quality-not-shared memory=soft-fallback f1=practice+qualifying+race generic-sports=merged');
