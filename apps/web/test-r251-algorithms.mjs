import {readFile} from 'node:fs/promises';
const runtime=await readFile(new URL('./runtime-r251-ground-truth.js',import.meta.url),'utf8');
const pre=`
const listeners={};globalThis.window=globalThis;globalThis.document={querySelector:()=>null,querySelectorAll:()=>[],addEventListener:(n,f)=>{(listeners[n]??=[]).push(f)},documentElement:{},hidden:false};
globalThis.localStorage={m:new Map(),getItem(k){return this.m.has(k)?this.m.get(k):null},setItem(k,v){this.m.set(k,String(v))}};
globalThis.requestAnimationFrame=f=>f();globalThis.addEventListener=()=>{};
let homeCache=null,profileCache=null,navSeq=1,user={id:'u'};let paintHome=()=>{},renderHome=async()=>{},renderDiscover=async()=>{},renderSports=async()=>{},paintSports=()=>{},sportsPayload=async()=>{},renderProfile=async()=>{};
let sportsState={},discoverState={};function route(){return 'none'}function shell(){return''}function setApp(){}function loading(){return''}function fail(){return''}function rpc(){return Promise.resolve({})}function api(){return Promise.resolve([])}function pages(){return Promise.resolve([])}function safeTmdb(){return Promise.resolve({results:[]})}function img(){return''}function fmtMinutes(v){return String(v)}function tz(){return'UTC'}function render(){}function toast(){};
`;
const post=`
const A=(c,m)=>{if(!c)throw new Error(m)};
let raw={media_id:1,tmdb_id:100,title:'Raw',home_bucket:'continue',watched_episodes:999,last_season:34,last_episode:40,history_missing_episodes:1200};
let pair={current:{season_number:1,episode_number:1,air_date:'2010-01-01'}};let r=window.__ctR251Test.applySeries(raw,pair,new Date('2026-09-11T12:00:00Z'));A(r.state==='up_to_date','Raw current frontier');A(raw._ct251LegacyMissing===1200,'legacy backlog kept');
pair={current:{season_number:34,episode_number:41,air_date:'2026-09-10'}};r=window.__ctR251Test.applySeries(raw,pair,new Date('2026-09-11T12:00:00Z'));A(r.state==='continue','new release wins');
A(window.__ctR251Test.isWwe({title:'WWE Friday Night SmackDown'}),'WWE');A(!window.__ctR251Test.eligiblePublic({id:2,title:'Drama',poster_path:'/x',vote_average:8.5,release_date:'2022-01-01',genre_ids:[18],media_type:'movie'}),'pure drama');A(window.__ctR251Test.eligiblePublic({id:3,title:'Action',poster_path:'/x',vote_average:8.5,release_date:'2022-01-01',genre_ids:[28],media_type:'movie'}),'eligible');
const now=new Date('2026-09-11T15:00:00Z'),events=[{id:1,starts_at:'2026-09-11T18:00:00Z'},{id:2,starts_at:'2026-09-11T10:00:00Z'},{id:3,starts_at:'2026-09-10T18:00:00Z'},{id:4,starts_at:'2026-09-07T18:00:00Z'},{id:5,starts_at:'2026-09-12T18:00:00Z',has_favorite:true},{id:6,starts_at:'2026-09-09T18:00:00Z',is_watched:true}];
A(window.__ctR251Test.sportFilter(events,'next',now).map(x=>x.id).join(',')==='1','next today');A(window.__ctR251Test.sportFilter(events,'previous',now).some(x=>x.id===3)&&!window.__ctR251Test.sportFilter(events,'previous',now).some(x=>x.id===4),'previous 72h');A(window.__ctR251Test.sportFilter(events,'favorites',now).map(x=>x.id).join(',')==='5','favorites');A(window.__ctR251Test.sportFilter(events,'watched',now).map(x=>x.id).join(',')==='6','watched');
console.log('R251_ALGORITHMS_OK');`;
const source=pre+'\n'+runtime+'\n'+post;
await import('node:fs/promises').then(fs=>fs.writeFile('/tmp/r251-algo-combined.js',source));
await import('node:child_process').then(({execFileSync})=>execFileSync(process.execPath,['/tmp/r251-algo-combined.js'],{stdio:'inherit'}));