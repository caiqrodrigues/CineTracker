import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const runtime=await readFile(new URL('./runtime-r253-single-authority-live-data.js',import.meta.url),'utf8');
const noop=()=>{};
const document={querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop};
const storage=new Map();
const context={
 console,Date,Intl,Math,Number,String,Boolean,Array,Set,Map,Promise,JSON,encodeURIComponent,queueMicrotask,
 window:{},document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v))},
 renderHome:async()=>{},renderSports:async()=>{},renderDiscover:async()=>{},renderProfile:async()=>{},
 setApp:noop,shell:()=>'',loading:()=>'',fail:()=>'',paintHome:noop,mediaCard:()=>'',safeTmdb:async()=>({results:[]}),api:async()=>[],rpc:async()=>({}),toast:noop,
 route:()=>'',navSeq:1,homeCache:null,profileCache:null,user:{id:'u'},tz:()=> 'America/Sao_Paulo',sportsEvent:()=>'<article class="event"></article>'
};
context.window.window=context.window;context.window.document=document;context.window.localStorage=context.localStorage;
vm.createContext(context);vm.runInContext(runtime,context,{filename:'runtime-r253-single-authority-live-data.js'});
const T=context.window.__ctR253Test,A=(c,m)=>{if(!c)throw new Error('R253_ALGO '+m)};
A(T,'test exports');
let r={watched_episodes:0,is_watchlist:true,home_bucket:'dust'};T.normalizeHomeRow253(r);A(r.home_bucket==='not_started','unstarted => not_started');
r={watched_episodes:12,released_episodes:12,is_caught_up:true,last_watched_at:'2025-01-01',home_bucket:'dust'};T.normalizeHomeRow253(r);A(r.home_bucket==='up_to_date','caught-up old watch must not dust');
r={watched_episodes:12,released_episodes:12,is_caught_up:true,status:'Ended',home_bucket:'dust'};T.normalizeHomeRow253(r);A(r.home_bucket==='completed','ended caught-up => completed');
r={watched_episodes:12,released_episodes:18,is_caught_up:false,history_missing_episodes:0,home_bucket:'dust'};T.normalizeHomeRow253(r);A(r.home_bucket==='up_to_date','no real missing episodes => up_to_date');
r={watched_episodes:12,released_episodes:18,is_caught_up:false,history_missing_episodes:6,home_bucket:'dust'};T.normalizeHomeRow253(r);A(r.home_bucket==='dust','real pending stale series stays dust');
r={title:'WWE Friday Night SmackDown',watched_episodes:100,released_episodes:120,is_caught_up:false,history_missing_episodes:20,home_bucket:'dust',last_season_number:28,last_episode_number:37,latest_released_season_number:28,latest_released_episode_number:37};T.normalizeHomeRow253(r);A(r.home_bucket==='up_to_date','legacy backlog at current frontier => up_to_date');
const now=new Date('2026-09-11T18:00:00-03:00'),events=[
 {id:1,starts_at:'2026-09-11T22:00:00-03:00'},
 {id:2,starts_at:'2026-09-11T14:00:00-03:00',has_favorite:true},
 {id:3,starts_at:'2026-09-10T17:00:00-03:00'},
 {id:4,starts_at:'2026-09-07T17:00:00-03:00'}
],watch_history=Array.from({length:48},(_,i)=>({id:100+i,is_watched:true,starts_at:'2026-09-01T12:00:00-03:00'})),p={events,watch_history};
A(T.sportsRows253(p,'next',now).map(x=>x.id).join(',')==='1','next only future today');
A(T.sportsRows253(p,'previous',now).some(x=>x.id===2)&&T.sportsRows253(p,'previous',now).some(x=>x.id===3)&&!T.sportsRows253(p,'previous',now).some(x=>x.id===4),'previous 72h');
A(T.sportsRows253(p,'favorites',now).length===1,'favorites only');
A(T.sportsRows253(p,'watched',now).length===48,'canonical watched history count');
const good={id:1,media_type:'movie',title:'Ação Boa',poster_path:'/p.jpg',vote_average:8.1,release_date:'2024-01-01',genre_ids:[28,18]};
A(T.publicEligible253(good),'mixed genre eligible');
A(!T.publicEligible253({...good,id:2,title:'WWE WrestleMania'}),'WWE excluded');
A(!T.publicEligible253({...good,id:3,title:'Drama',genre_ids:[18]}),'pure drama excluded');
A(!T.publicEligible253({...good,id:4,title:'Velho',release_date:'1989-01-01'}),'pre-1991 excluded');
A(T.fmtHM253(32750)==='545h 50min','sports minute formatting');
console.log('R253_ALGORITHMS_PASS');
