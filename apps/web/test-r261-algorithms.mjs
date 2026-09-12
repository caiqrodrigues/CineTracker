import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const src=await readFile(new URL('./runtime-r261-video-ground-truth-series.js',import.meta.url),'utf8');
const noop=()=>{};
const document={querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop};
const storage=()=>{const m=new Map();return{getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}};
const ctx={console,Date,Intl,Map,Set,Promise,Symbol,JSON,Math,Number,String,Array,Object,RegExp,encodeURIComponent,
 document,localStorage:storage(),sessionStorage:storage(),requestAnimationFrame:fn=>0,setTimeout:()=>0,clearTimeout:noop,
 rpc:async()=>({}),tmdb:async()=>({}),fetch:async()=>({ok:true,json:async()=>({MRData:{RaceTable:{Races:[]}}})}),
 renderDiscover:async()=>{},renderHome:async()=>{},paintHome:()=>{},homeCache:{series:[]},navSeq:1,route:()=> 'home',
 setApp:noop,shell:()=>'',loading:()=>'',go:noop};
ctx.window=ctx;ctx.window.addEventListener=noop;
vm.createContext(ctx);vm.runInContext(src,ctx,{filename:'runtime-r261.js'});
const t=ctx.__ctR261Test;if(!t)throw new Error('R261 test hooks missing');
const raw={title:'Raw',tmdb_id:4656,watched_episodes:245,history_missing_episodes:1495,home_bucket:'continue',next_season_number:1,next_episode_number:14,next_episode_title:'Episode 14'};
t.provisionalWeekly261(raw);
if(raw.home_bucket!=='up_to_date'||raw.history_missing_episodes!==0||raw.next_episode_number!==null)throw new Error('Raw historical backlog was not neutralized before first paint');
const seq={pending:[{season_number:34,episode_number:36,name:'Episode 36',air_date:'2026-09-07'}],next:{season_number:34,episode_number:36,name:'Episode 36',air_date:'2026-09-07'},detail:{status:'Returning Series'}};
t.applyWeekly261(raw,seq);
if(raw.home_bucket!=='continue'||raw.history_missing_episodes!==1||raw.next_season_number!==34||raw.next_episode_number!==36)throw new Error('Raw exact frontier failed');
if(t.specialKind261('Formula 1')!=='f1'||t.specialKind261('NFL Super Bowls')!=='superbowl')throw new Error('Imported special series recognition failed');
const race={raceName:'Austria',date:'2026-06-28',time:'13:00:00Z',Circuit:{circuitName:'Red Bull Ring'},FirstPractice:{date:'2026-06-26',time:'11:30:00Z'},Qualifying:{date:'2026-06-27',time:'14:00:00Z'}};
const eps=t.f1Episodes261([race],2026);
if(eps.length!==3||eps[0].episode_number!==1||eps.at(-1).name!=='Austria (Race)')throw new Error('F1 session episode synthesis failed');
if(t.f1time261(eps[0])==='—'||!t.f1time261(eps[0]).includes('2026'))throw new Error('F1 air_date formatting failed');
if(t.roman261(60)!=='LX'||t.roman261(61)!=='LXI')throw new Error('Super Bowl roman numbering failed');
const st={episodes:Array.from({length:60},(_,i)=>({season_number:1,episode_number:i+1}))};
if(t.watchedSet261(st,1).size!==60)throw new Error('Super Bowl 60/62 progress failed');
console.log('R261_ALGORITHMS_OK');
