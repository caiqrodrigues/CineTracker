import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
await import('./build-r296-official.mjs');
const runtime=await readFile('runtime-r296-recommendations-sports-stadium.js','utf8');
let bin='';for(const x of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}
if(!bin)throw Error('Chromium unavailable');
const dir='/tmp/ct-r296-browser';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const page=resolve(dir,'index.html'),safe=s=>s.replaceAll('</script>','<\\/script>');
const fixed=Date.parse('2026-09-15T15:00:00-03:00');
const pre=`Date.now=()=>${fixed};window.user={id:'u1'};window.__rpc=[];window.route=()=>document.body.dataset.route||'discover';
window.rpc=async(name,args)=>{window.__rpc.push([name,args]);if(name==='cinetracker_shown_recommendations_recent_v296')return[];if(name==='cinetracker_shown_recommendations_record_v296')return 7;if(name==='cinetracker_sports_stadium_summary_v296')return{stadium_events:3};if(name==='cinetracker_sports_watch_history_v296')return[];return{}};
window.__ctR288R263={type263:x=>String(x.media_type||x.type||'tv')==='movie'?'movie':'tv',id263:x=>Number(x.tmdb_id||x.id||0),title263:x=>x.title||x.name||'',poster263:x=>x.poster_path||null,year263:x=>String(x.release_date||x.first_air_date||'').slice(0,4),score263:x=>Number(x.vote_average||0),discover263:{tab:'foryou',forYou:null}};
window.ct288State={watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0}};
window.paintForYou263=function(){const d=window.__ctR288R263.discover263.forYou||{};document.querySelector('#host').innerHTML='<div data-ct288-foryou>'+[...(d.watch||[]),...(d.picks||[]),(d.fresh||[])[0]].filter(Boolean).map(x=>'<i data-ct288-card="'+(x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id+'"></i>').join('')+'</div>'};
window.SPORT_TABS255=[['next','Próximos'],['live','Ao vivo'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];window.sport255={tab:'next',sport:'all',payload:{events:[],watch_history:[]},at:0};
window.sportRows255=()=>[];window.loadSports255=async()=>window.sport255.payload;window.sportCard255=(e)=>'<article class="ct255-sport-card"><button data-ct255-watch="'+(e.provider_event_id||'e')+'" data-provider="'+(e.provider||'p')+'" data-watched="'+(e.is_watched?'1':'0')+'">watch</button></article>';
window.renderProfile=async()=>{document.querySelector('#profile').innerHTML='<div data-profile><div class="stats"></div></div>'};window.paintSports255=()=>{};window.toast=()=>{};window.navSeq=1;`;
const post=`(async()=>{const D=window.__ctR288R263.discover263,base={poster_path:'/p.jpg',vote_average:8.4,release_date:'2020-01-01'},tv={poster_path:'/p.jpg',vote_average:8.5,first_air_date:'2021-01-01'};
D.forYou={watch:[{...base,media_type:'movie',tmdb_id:11,title:'Watch Movie'},{...tv,media_type:'tv',tmdb_id:12,name:'Watch Series',genre_ids:[18,35]},{...tv,media_type:'tv',tmdb_id:13,name:'Watch Anime',genre_ids:[16],original_language:'ja'}],fresh:[
{...base,media_type:'movie',tmdb_id:21,title:'Fresh Movie A'},{...base,media_type:'movie',tmdb_id:22,title:'Fresh Movie B'},{...base,media_type:'movie',tmdb_id:23,title:'Fresh Movie C'},
{...tv,media_type:'tv',tmdb_id:24,name:'Fresh Series',genre_ids:[35]},{...tv,media_type:'tv',tmdb_id:25,name:'Fresh Anime',genre_ids:[16],original_language:'ja'},
{...base,media_type:'movie',tmdb_id:26,title:'WWE WrestleMania'},{...base,media_type:'movie',tmdb_id:27,title:'Drama Only',genre_ids:[18]},
{...base,media_type:'movie',tmdb_id:28,title:'Low',vote_average:7.4},{...base,media_type:'movie',tmdb_id:29,title:'Old',release_date:'1990-01-01'}]};
paintForYou263();await new Promise(r=>setTimeout(r,40));const sel=window.__ctR296Test.selection,keys=sel.map(x=>x.key);
document.body.dataset.rec=String(sel.length===7&&new Set(keys).size===7&&sel.find(x=>x.slot==='daily')?.media_type==='movie'&&!keys.includes('movie:26')&&!keys.includes('movie:27')&&!keys.includes('movie:28')&&!keys.includes('movie:29'));
const now=Date.now(),events=[{id:'today',starts_at:new Date(now+3600000).toISOString()},{id:'yday',starts_at:new Date(now-24*3600000).toISOString(),status:'finished'},{id:'old',starts_at:new Date(now-80*3600000).toISOString(),status:'finished'},{id:'fav',starts_at:new Date(now+48*3600000).toISOString(),has_favorite:true}];
const T=window.__ctR296Test;document.body.dataset.sports=String(T.sportsRows296({events},'next').map(x=>x.id).join(',')==='today'&&T.sportsRows296({events},'previous').map(x=>x.id).join(',')==='yday'&&T.sportsRows296({events},'favorites').map(x=>x.id).join(',')==='fav'&&window.SPORT_TABS255.length===4&&!window.SPORT_TABS255.some(x=>x[0]==='live'));
document.body.dataset.route='profile';await renderProfile(1);await new Promise(r=>setTimeout(r,20));document.body.dataset.profile=String(document.querySelector('[data-ct296-stadium-stat] b')?.textContent==='3');
document.body.dataset.marker=String(window.__ctR296==='strict-foryou-four-sports-stadium-web-polish');document.body.dataset.done='1'})().catch(e=>{document.body.dataset.error=String(e);document.body.dataset.done='1'})`;
await writeFile(page,`<!doctype html><html><body data-route="discover"><div id="host"></div><div id="profile"></div><script>${safe(pre)}</script><script>${safe(runtime)}</script><script>${safe(post)}</script></body></html>`,'utf8');
try{
 const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1280,900','--virtual-time-budget=1800','--dump-dom','file://'+page],{encoding:'utf8',timeout:30000,maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']});
 for(const x of['data-done="1"','data-rec="true"','data-sports="true"','data-profile="true"','data-marker="true"'])if(!out.includes(x))throw Error('R296_BROWSER missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''));
 console.log('R296_BROWSER_OK strict recommendation composition + four Sports windows + stadium profile metric');
}finally{await rm(dir,{recursive:true,force:true})}
