import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),runtime=await readFile(resolve(root,'apps/web/runtime-r211-v107-behavior.js'),'utf8');
if(runtime.includes('cinetracker_mark_episode_v0994'))throw new Error('nonexistent episode RPC leaked');
const fixture=resolve('/tmp','sports-v107-fixture.html');
const f1={season:2026,next:{round:'18',raceName:'Fixture GP',date:'2026-09-20',Circuit:{circuitName:'Fixture Circuit'},FirstPractice:{date:'2026-09-18',time:'10:00:00Z'},Qualifying:{date:'2026-09-19',time:'14:00:00Z'}},races:[{round:'18',raceName:'Fixture GP',date:'2026-09-20',Circuit:{circuitName:'Fixture Circuit'}}],drivers:{MRData:{StandingsTable:{StandingsLists:[{DriverStandings:[{position:'1',points:'250',Driver:{givenName:'Max',familyName:'Fixture'},Constructors:[{name:'Team A'}]}]}]}}},constructors:{MRData:{StandingsTable:{StandingsLists:[{ConstructorStandings:[{position:'1',points:'400',Constructor:{name:'Team A'}}]}]}}},results:{MRData:{RaceTable:{Races:[{Results:[{position:'1',Driver:{givenName:'Max',familyName:'Fixture'},Constructor:{name:'Team A'},Time:{time:'1:30:00'}}]}]}}},qualifying:{MRData:{RaceTable:{Races:[{QualifyingResults:[]} ]}}},sprint:null,pitstops:null,laps:null};
const pre=`<script>
window.homeCache=null;window.profileCache=null;window.discoverCache=new Map();window.ct169DrawerState={showId:456,seasonNo:1};
window.mediaTmdb=x=>Number(x?.id||x?.tmdb_id||0);window.discoverRows=async()=>({});window.go=()=>{};window.toast=()=>{};
window.ensureMedia=async(type,id)=>({id:type==='movie'?9001:9002,title:type==='movie'?'Movie Fixture':'Series Fixture',runtime_minutes:100});
window.rpc=async(name,args)=>{if(name==='cinetracker_rewatch_counts_v104')return [{item_type:'movie',tmdb_id:123,plays:1},{item_type:'episode',tmdb_id:456,season_number:1,episode_number:2,plays:2}];if(name==='cinetracker_recommendation_state_v107')return {fresh_excluded:[],watchlist:[]};if(name==='cinetracker_mark_watch_v0994')return {plays:3};return []};
window.fetch=async()=>({ok:true,json:async()=>${JSON.stringify(f1)}});
</script>`;
const post=`<script>{let n=0;const t=setInterval(()=>{n++;const b=document.querySelector('[data-ct107-rewatch="episode"]');if(b){clearInterval(t);b.click()}else if(n>30)clearInterval(t)},100)}</script>`;
const html=`<!doctype html><html><head></head><body><div class="version"></div><main data-sports><div class="sports-summary card">10 jogos · 3 favoritos · 4 eventos</div><div class="card" id="keep-event">EVENT CARD PRESERVED</div><section><h2>Histórico recente</h2><div class="media-row" data-media="movie:123"><b>History Movie</b></div></section><div class="detail-view" data-media="movie:123"><button>✓ ASSISTIDO</button></div><div class="episode-row" data-media="tv:456" data-episode-number="2">E2 · Assistido</div></main>${pre}<script>${runtime.replaceAll('</script>','<\\/script>')}</script>${post}</body></html>`;
await writeFile(fixture,html,'utf8');
let out='';for(const bin of ['google-chrome','chromium','chromium-browser']){try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=4000','--dump-dom','file://'+fixture],{encoding:'utf8',stdio:['ignore','pipe','pipe']});if(out)break}catch{}}
await rm(fixture,{force:true});if(!out)throw new Error('Chrome/Chromium unavailable');
for(const must of ['EVENT CARD PRESERVED','id="ct-f1-v107"','Fixture GP','Fixture Circuit','data-ct107-rewatch="movie"','data-ct107-rewatch="episode"','Reassistir 3x','CineTracker • v1.0.7'])if(!out.includes(must))throw new Error('Browser behavior missing '+must);
if(out.includes('sports-summary'))throw new Error('Old Sports summary still visible');
console.log('V107_BROWSER_BEHAVIOR_OK f1=visible rewatch=movie+episode+history canonical=mark_watch sports_summary=removed event=preserved');
