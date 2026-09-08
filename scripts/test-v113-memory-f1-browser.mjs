import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),patch=(await readFile(resolve(root,'apps/web/runtime-r219-v113-memory-f1-grid.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v113-browser';await mkdir(dir,{recursive:true});const file=resolve(dir,'index.html');
const now=Date.now(),d10=new Date(now-10*86400000).toISOString(),d40=new Date(now-40*86400000).toISOString();
const pre=`<script>
const mediaTmdb=x=>Number(x?.tmdb_id||x?.id||0),mediaType=x=>x?.media_type==='movie'?'movie':'tv',mediaPoster=x=>x?.poster_path||'/p.jpg';
const genreIds158=x=>x?.genre_ids||[],isAnime158=x=>x?.media_type==='tv'&&((x?.genre_ids||[]).includes(16)||(x?.origin_country||[]).includes('JP'));
let discoverCache=new Map(),ct166SwapIndex={},ct186LocalBlocked=new Set(),ct186ForYouData=null,ct186ContextAt=0,discoverState={tab:'foryou'};
const mem=[
 {tmdb_id:101,slot:'fresh:movie',action:'shown',shown_at:'2020-01-01T00:00:00Z'},
 {tmdb_id:201,slot:'watchlist:movie',action:'shown',shown_at:'${d10}'},
 {tmdb_id:202,slot:'watchlist:movie',action:'shown',shown_at:'${d40}'},
 {tmdb_id:203,slot:'watchlist:movie',action:'swapped',shown_at:'${d40}'}
];
const rpc=async(name,args)=>name==='cinetracker_recommendation_memory_v113'?mem:name==='cinetracker_recommendation_record_v113'?{}:{};
const edge=async()=>({next:{raceName:'GP Teste'},nextQualifying:{MRData:{RaceTable:{Races:[{raceName:'GP Teste',QualifyingResults:[{position:'1',Driver:{givenName:'Ayrton',familyName:'Teste'},Constructor:{name:'Equipe A'},Q3:'1:20.000'},{position:'2',Driver:{givenName:'Bruno',familyName:'Teste'},Constructor:{name:'Equipe B'},Q3:'1:20.100'}]}]}}}});
let source={_ct186_fresh:{movie:[
 {id:101,media_type:'movie',vote_average:9,release_date:'2020-01-01',genre_ids:[28]},
 {id:102,media_type:'movie',vote_average:7.8,release_date:'2020-01-01',genre_ids:[28]},
 {id:103,media_type:'movie',vote_average:7.9,release_date:'1990-01-01',genre_ids:[28]},
 {id:104,media_type:'movie',vote_average:8.2,release_date:'2020-01-01',genre_ids:[18,28]},
 {id:105,media_type:'movie',vote_average:8.2,release_date:'2020-01-01',genre_ids:[99]},
 {id:106,media_type:'movie',vote_average:8.2,release_date:'2020-01-01',genre_ids:[28]}
],series:[
 {id:110,media_type:'tv',vote_average:8.4,first_air_date:'2021-01-01',genre_ids:[10766],origin_country:['BR']},
 {id:111,media_type:'tv',vote_average:8.5,first_air_date:'2022-01-01',genre_ids:[35],origin_country:['KR']},
 {id:112,media_type:'tv',vote_average:8.5,first_air_date:'2022-01-01',genre_ids:[35],origin_country:['US']}
],anime:[{id:120,media_type:'tv',vote_average:8.5,first_air_date:'2022-01-01',genre_ids:[16],origin_country:['JP']}]},_ct186_watchlist:{movie:[
 {id:201,media_type:'movie',vote_average:8.5,release_date:'2021-01-01',genre_ids:[28]},
 {id:202,media_type:'movie',vote_average:8.5,release_date:'2021-01-01',genre_ids:[28]},
 {id:203,media_type:'movie',vote_average:8.5,release_date:'2021-01-01',genre_ids:[28]}
],series:[],anime:[]},_ct186_fallback:{movie:[{id:999,media_type:'movie',vote_average:9,release_date:'2024-01-01',genre_ids:[28]}],series:[],anime:[]}};
async function discoverRows(){return structuredClone(source)} function paintDiscover(){} function swapNow237(){return true} function route(){return 'discover'} function render(){}
</script>`;
const hub=`<section id="ct-f1-v111"><div class="ct111-f1-head"><div><small>FÓRMULA 1</small><h2>F1 Hub</h2></div><div class="ct111-f1-tabs"><button data-ct111-f1="overview">Visão geral</button></div></div><div data-ct111-f1-body></div></section>`;
const post=`<script>(async()=>{try{
 const d=await discoverRows('foryou'),ids=a=>(a||[]).map(x=>x.id).join(',');
 document.body.dataset.fm=ids(d._ct186_fresh.movie);document.body.dataset.fs=ids(d._ct186_fresh.series);document.body.dataset.fa=ids(d._ct186_fresh.anime);document.body.dataset.wm=ids(d._ct186_watchlist.movie);
 document.body.dataset.blockFresh=String(window.__ctV113MemoryBlocked('fresh:movie',101));document.body.dataset.blockWl10=String(window.__ctV113MemoryBlocked('watchlist:movie',201));document.body.dataset.blockWl40=String(window.__ctV113MemoryBlocked('watchlist:movie',202));document.body.dataset.blockSwap=String(window.__ctV113MemoryBlocked('watchlist:movie',203));
 await new Promise(r=>setTimeout(r,80));document.querySelector('[data-ct113-f1-toggle]').click();document.body.dataset.collapsed=String(document.querySelector('#ct-f1-v111').classList.contains('ct113-f1-collapsed'));document.querySelector('[data-ct113-f1-toggle]').click();document.querySelector('[data-ct113-f1-grid]').click();await new Promise(r=>setTimeout(r,80));document.body.dataset.grid=document.querySelector('[data-ct111-f1-body]').textContent.replace(/\\s+/g,' ').trim();
 }catch(e){document.body.dataset.err=String(e.message||e)}finally{document.body.dataset.done='1'}})()</script>`;
const html=`<!doctype html><html><body>${hub}${pre}<script>${patch}</script>${post}</body></html>`;await writeFile(file,html);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser']){try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=1200','--dump-dom','file://'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe']});if(out)break}catch{}}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const must of ['data-done="1"','data-fm="106"','data-fs="112"','data-fa="120"','data-wm="202"','data-block-fresh="true"','data-block-wl10="true"','data-block-wl40="false"','data-block-swap="true"','data-collapsed="true"','data-ct113-grid-rendered'])if(!out.includes(must))throw new Error('V113 contract missing '+must+'\n'+out.slice(-6000));
const gm=out.match(/data-grid="([^"]*)"/);if(!gm||!gm[1].includes('P1Ayrton TesteEquipe A1:20.000')||!gm[1].includes('P2Bruno TesteEquipe B1:20.100'))throw new Error('V113 grid text missing '+String(gm?.[1]||'none'));
if(out.includes('data-err='))throw new Error('V113 browser runtime error');console.log('V113_BROWSER_OK fresh=never-repeat watchlist=30d swapped=never quality=>7.8 year=>1990 bad-genres=blocked no-fill f1=collapse+grid');
