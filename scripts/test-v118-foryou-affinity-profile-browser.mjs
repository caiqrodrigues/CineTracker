import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),patch=(await readFile(resolve(root,'apps/web/runtime-r224-v118-foryou-affinity-profile-watchlist.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v118-browser';await mkdir(dir,{recursive:true});const file=resolve(dir,'index.html');
const pre=`<script>
let opened=[],discoverCache={clear(){}};
function esc(x){return String(x)} function mediaTmdb(x){return Number(x.tmdb_id||x.id||0)} function mediaType(x){return x.media_type==='movie'?'movie':'tv'} function mediaPoster(x){return x.poster_path||null}
function ct186Anime(x){return x.media_kind==='anime'||(x.media_type!=='movie'&&(x.genre_ids||[]).includes(16)&&(x.origin_country||[]).includes('JP'))}
function ct186DashHistory(x){return !!(x.is_seen||x.is_completed||x.is_in_progress||x.last_watched_at)} function ct186DashWatchlist(x){return !!x.is_watchlist}
function strictQuality(x){const y=Number(String(x.release_date||x.first_air_date||'').slice(0,4)),g=x.genre_ids||[];return Number(x.vote_average)>7.8&&y>1990&&!g.some(v=>[18,99,10766].includes(Number(v)))}
function ct186FreshEligible(x,c){return strictQuality(x)&&!c.blocked?.has((x.media_type==='movie'?'movie':'tv')+':'+x.id)}
async function ct186FreshPools(){return{movie:[],series:[],anime:[]}} async function ct186PopularPool(){return['OLD_POPULAR']}
function ctR180StatCard(label,value,wide=false){return '<div class="stat '+(wide?'wide':'')+'"><small>'+label+'</small><b>'+value+'</b></div>'}
async function addWatchlist(){return true}
window.__ctV117OpenWatchlist=async kind=>{opened.push(kind);document.body.dataset.opened=opened.join(',')};
const M=(id,g,v=8.5,y=2024,extra={})=>({id,media_type:'movie',title:'M'+id,poster_path:'/m'+id+'.jpg',genre_ids:g,vote_average:v,vote_count:500,release_date:y+'-05-01',original_language:'en',...extra});
const T=(id,g,v=8.5,y=2024,extra={})=>({id,media_type:'tv',name:'T'+id,poster_path:'/t'+id+'.jpg',genre_ids:g,vote_average:v,vote_count:500,first_air_date:y+'-05-01',original_language:'en',...extra});
async function safeTmdb(path){
 if(path==='/movie/1/recommendations')return{results:[M(101,[878,12],8.4),M(102,[35],9.7),M(103,[878,12],7.8),M(104,[878,12],9,1990),M(105,[878,18],9),M(106,[878,12],9)]};
 if(path==='/movie/2/recommendations')return{results:[M(101,[878,12],8.4),M(107,[878,53],8.7)]};
 if(path==='/movie/3/recommendations')return{results:[M(101,[878,12],8.4),M(108,[28,878],8.3)]};
 if(path==='/movie/1/similar')return{results:[M(101,[878,12],8.4),M(109,[12,878],8.2)]};
 if(path==='/movie/2/similar')return{results:[M(107,[878,53],8.7)]};
 if(path==='/tv/11/recommendations')return{results:[T(201,[80,9648],8.6),T(202,[10751],9.5)]};
 if(path==='/tv/11/similar')return{results:[T(201,[80,9648],8.6)]};
 if(path==='/tv/21/recommendations')return{results:[T(301,[16,10759],8.8,2025,{origin_country:['JP'],original_language:'ja'}),T(302,[80],9.2)]};
 if(path==='/tv/21/similar')return{results:[T(301,[16,10759],8.8,2025,{origin_country:['JP'],original_language:'ja'})]};
 if(path==='/movie/99/recommendations'||path==='/movie/99/similar')return{results:[M(990,[35],9.9)]};
 return{};
}
const ctx={blocked:new Set(['movie:106']),dash:[
 {id:1,tmdb_id:1,media_type:'movie',title:'Recent SciFi',poster_path:'/s1.jpg',genre_ids:[878,12],original_language:'en',is_seen:true,last_watched_at:'2026-09-08T10:00:00Z'},
 {id:2,tmdb_id:2,media_type:'movie',title:'Older SciFi',poster_path:'/s2.jpg',genre_ids:[878,53],original_language:'en',is_seen:true,last_watched_at:'2026-08-20T10:00:00Z'},
 {id:3,tmdb_id:3,media_type:'movie',title:'WL Action SciFi',poster_path:'/s3.jpg',genre_ids:[28,878],original_language:'en',is_watchlist:true},
 {id:11,tmdb_id:11,media_type:'tv',media_kind:'series',name:'Crime Series',poster_path:'/s11.jpg',genre_ids:[80,9648],original_language:'en',is_in_progress:true,last_watched_at:'2026-09-07T10:00:00Z'},
 {id:21,tmdb_id:21,media_type:'tv',media_kind:'anime',name:'Action Anime',poster_path:'/s21.jpg',genre_ids:[16,10759],origin_country:['JP'],original_language:'ja',is_seen:true,last_watched_at:'2026-09-06T10:00:00Z'}
]};
window.TEST_CTX=ctx;
</script>`;
const run=`<script>(async()=>{try{
 const p=await window.__ctV118AffinityPools(window.TEST_CTX);document.body.dataset.movie=String(p.movie[0]?.id||0);document.body.dataset.series=String(p.series[0]?.id||0);document.body.dataset.anime=String(p.anime[0]?.id||0);document.body.dataset.bad=String([...p.movie,...p.series,...p.anime].some(x=>[102,103,104,105,106,202,302].includes(x.id)));document.body.dataset.popular=String((await ct186PopularPool('movie',window.TEST_CTX)).length);
 const noCtx={blocked:new Set(),dash:[{id:99,tmdb_id:99,media_type:'movie',title:'History Seed',poster_path:'/99.jpg',genre_ids:[36],is_seen:true,last_watched_at:'2026-09-08T11:00:00Z'}]};const no=await window.__ctV118PoolForKind(noCtx,'movie');document.body.dataset.unrelated=String(no.length);
 const web=document.createElement('div');web.innerHTML=ctR180StatCard('Séries Watchlist','7')+ctR180StatCard('Filmes Watchlist','5');document.body.appendChild(web);const wb=[...web.querySelectorAll('[data-ct118-watchlist]')];document.body.dataset.buttons=wb.map(x=>x.tagName+':'+x.dataset.ct118Watchlist+':'+x.dataset.ct117WatchlistStat).join('|');wb[0].click();wb[1].click();
 window.__ctAndroidOfficialVersion='1.0.18';const mobile=document.createElement('div');mobile.innerHTML=ctR180StatCard('Séries Watchlist','7');document.body.appendChild(mobile);mobile.querySelector('[data-ct118-watchlist]').click();document.body.dataset.openedFinal=opened.join(',');
 }catch(e){document.body.dataset.err=String(e?.stack||e)}finally{document.body.dataset.done='1'}})()</script>`;
const html=`<!doctype html><html><head></head><body>${pre}<script>${patch}</script>${run}</body></html>`;await writeFile(file,html);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser']){try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=3500','--dump-dom','file://'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:12000});if(out)break}catch{}}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const must of ['data-done="1"','data-movie="101"','data-series="201"','data-anime="301"','data-bad="false"','data-popular="0"','data-unrelated="0"','data-buttons="BUTTON:series:series|BUTTON:movie:movie"','data-opened-final="series,movie,series"'])if(!out.includes(must))throw new Error('V118 contract missing '+must+'\n'+out.slice(-12000));
if(out.includes('data-err='))throw new Error('V118 browser runtime error\n'+out.slice(-6000));
console.log('V118_BROWSER_OK foryou=recent+watchlist affinity=genre+recommendations independent=movie+series+anime no-unrelated-fill profile=direct-stat-buttons web+android');
