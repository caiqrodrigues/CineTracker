import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const runtime=await readFile(new URL('./runtime-r252-source-ui-recovery.js',import.meta.url),'utf8');
const dir=await mkdtemp(join(tmpdir(),'ct-r252-')),file=join(dir,'algo.cjs');
const pre=`
global.window=global;global.document={querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{},createElement:()=>({}),documentElement:{}};
global.localStorage={m:new Map(),getItem(k){return this.m.has(k)?this.m.get(k):null},setItem(k,v){this.m.set(k,String(v))}};
global.addEventListener=()=>{};global.requestAnimationFrame=f=>f();
let homeCache=null,user={id:'u'},navSeq=1;let paintHome=()=>{},renderConfigs=async()=>{},discoverRows=async()=>[],paintDiscover=()=>{},sportsState={},discoverState={tab:'foryou',type:'all'};
function route(){return'none'}function mediaCard(){return''}function setApp(){}function shell(){return''}function tz(){return'America/Sao_Paulo'}function localDay(d=new Date()){return d.toISOString().slice(0,10)}
async function rpc(){return[]}async function api(){return[]}async function pages(){return[]}async function safeTmdb(){return{results:[]}}
`;
const post=`
const T=window.__ctR252Test,A=(c,m)=>{if(!c)throw new Error(m)},now=new Date('2026-09-11T15:00:00Z');
let row={title:'Série nunca iniciada',watched_episodes:0};A(T.classifySeries(row,null,now)==='not_started'&&row.home_bucket==='not_started','never started');
row={title:'Série parada',watched_episodes:5,last_season:1,last_episode:5,last_watched_at:'2026-08-01T12:00:00Z',home_bucket:'continue'};let pair={current:{season_number:1,episode_number:5,air_date:'2026-07-20'}};A(T.classifySeries(row,pair,now)==='dust'&&row.home_bucket==='dust','30 day dust');
row={title:'Série com episódio novo',watched_episodes:5,last_season:1,last_episode:5,last_watched_at:'2026-07-01T12:00:00Z'};pair={current:{season_number:1,episode_number:6,air_date:'2026-09-10'}};A(T.classifySeries(row,pair,now)==='continue'&&row.home_bucket==='continue','recent unseen wins over dust');
row={title:'WWE Raw',watched_episodes:1200,last_season:34,last_episode:40,last_watched_at:'2026-09-08T12:00:00Z',history_missing_episodes:900};pair={current:{season_number:2,episode_number:3,air_date:'2010-01-01'}};A(T.classifySeries(row,pair,now)==='up_to_date'&&row.home_bucket==='up_to_date','Raw legacy backlog ignored');A(row.history_missing_episodes===900,'legacy backlog not mutated');
pair={current:{season_number:34,episode_number:41,air_date:'2026-09-10'}};A(T.classifySeries(row,pair,now)==='continue','Raw recent release surfaces');
row={title:'Formula 1',watched_episodes:50,last_season:2026,last_episode:16,last_watched_at:'2026-09-08'};A(T.classifySeries(row,{current:{season_number:2020,episode_number:1,air_date:'2020-01-01'}},now)==='up_to_date','F1 old backlog ignored');
A(T.isLegacySeries({title:'WWE SmackDown'}),'SmackDown legacy');A(T.isLegacySeries({title:'Super Bowl'}),'Super Bowl legacy');
const good={id:1,title:'Ação boa',media_type:'movie',poster_path:'/p.jpg',vote_average:8.2,release_date:'2024-01-01',genre_ids:[28]};
A(T.eligiblePublic(good),'eligible public');A(!T.eligiblePublic({...good,id:2,vote_average:7.4}),'score floor');A(!T.eligiblePublic({...good,id:3,release_date:'1990-01-01'}),'year floor');A(!T.eligiblePublic({...good,id:4,genre_ids:[18]}),'pure drama');A(!T.eligiblePublic({...good,id:5,genre_ids:[99]}),'pure documentary');A(T.eligiblePublic({...good,id:6,genre_ids:[18,28]}),'mixed drama allowed');A(!T.eligiblePublic({...good,id:7,title:'WWE WrestleMania'}),'WWE excluded');
console.log('R252_ALGORITHMS_OK home=30d+recent+legacy discover=strict-filters');
`;
await writeFile(file,pre+'\n'+runtime+'\n'+post,'utf8');
try{execFileSync(process.execPath,[file],{stdio:'inherit'})}finally{await rm(dir,{recursive:true,force:true})}
