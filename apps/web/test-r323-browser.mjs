import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r323.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR321Test,R=window.__ctR321,X=window.__ctR323,XT=window.__ctR323Test;
 ok(T&&R&&X&&XT,'r323 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.114','web version global stale');
 ok(window.__ctR322==='discover-indexed-user-filter+fast-top10','r322 baseline missing');
 ok(window.__ctR323==='home-movie-play-history+watchlist-sort+discover-legacy-alias','r323 marker missing');

 const alias=T.candidatePayload321([{media_type:'movie',tmdb_id:150540,title:'Divertida Mente',original_title:'Inside Out',release_date:'2015-06-17',poster_path:'/x.jpg'}])[0];
 ok(alias?.original_title==='Inside Out'&&alias?.release_year===2015,'legacy original-title alias not sent');

 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,original_title:title,original_name:title,poster_path:'/p'+id+'.jpg',vote_average:8.2,release_date:'2026-01-01',first_air_date:'2026-01-01'});
 T.setTestBridge({
  topPage:async(provider,page)=>({
   movies:Array.from({length:10},(_,i)=>media((page-1)*10+i+1,'movie','M'+((page-1)*10+i+1))),
   series:Array.from({length:10},(_,i)=>media(100+(page-1)*10+i+1,'tv','S'+((page-1)*10+i+1)))
  }),
  exact:async items=>({
   blocked_keys:items.filter(x=>(x.tmdb_id>=1&&x.tmdb_id<=7)||(x.tmdb_id>=101&&x.tmdb_id<=107)).map(x=>x.media_type+':'+x.tmdb_id),
   watch_keys:[],seen_keys:[],not_interested_keys:[]
  })
 });
 const top=await T.topRaw321(9,true);
 ok(top.movies.length===10&&top.series.length===10,'Top 10 did not refill to ten');
 ok(top.movies[0].tmdb_id===8&&top.movies[3].tmdb_id===11,'movie ranking did not continue onto next page');
 ok(top.series[0].tmdb_id===108&&top.series[3].tmdb_id===111,'series ranking did not continue onto next page');

 document.body.innerHTML='<div id="app"></div><div data-ct309-foryou><section class="ct309-daily">daily</section><div class="ct309-slot" data-ct309-slot="fresh:movie">movie</div><div class="ct309-slot" data-ct309-slot="fresh:series">series</div><div class="ct309-slot" data-ct309-slot="fresh:anime">anime</div></div>';
 window.__ctR319Test.state.fyKind='movie';window.__ctR319.applyForYouFilter();
 ok(document.querySelector('[data-ct309-foryou]').dataset.ct319FyFilter==='movie','Pra você movie filter state missing');
 ok(getComputedStyle(document.querySelector('[data-ct309-slot="fresh:series"]')).display==='none','Pra você series slot not hidden by movie filter');
 ok(getComputedStyle(document.querySelector('[data-ct309-slot="fresh:movie"]')).display!=='none','Pra você movie slot hidden incorrectly');

 const merged=XT.mergeHome323({history_movies:[{media_title:'Me Time'}]},[{media_title:'Na Zona Cinzenta',watched_at:'2026-09-20T21:03:48Z'}]);
 ok(merged.history_movies.length===1&&merged.history_movies[0].media_title==='Na Zona Cinzenta','Home movie history was not replaced by canonical list');

 X.setTestBridge({watchRows:async()=>[
  {media_type:'movie',tmdb_id:1,title:'Zulu',release_year:2020,added_at:'2026-01-01T00:00:00Z'},
  {media_type:'movie',tmdb_id:2,title:'Alpha',release_year:2024,added_at:'2026-09-20T00:00:00Z'},
  {media_type:'movie',tmdb_id:3,title:'Beta',release_year:2022,added_at:'2026-05-01T00:00:00Z'}
 ]});
 await X.openWatchlist('movie');
 const select=document.querySelector('[data-ct323-watch-sort]');ok(select,'Watchlist sort selector missing');
 ok(select.value==='added-desc','Watchlist default sort is not last added');
 let first=document.querySelector('[data-ct323-watch-list] .ct316-watch-copy b')?.textContent;ok(first==='Alpha','last-added sort wrong: '+first);
 select.value='alpha-asc';select.dispatchEvent(new Event('change',{bubbles:true}));
 first=document.querySelector('[data-ct323-watch-list] .ct316-watch-copy b')?.textContent;ok(first==='Alpha','alphabetical sort wrong: '+first);
 ok([...select.options].some(o=>o.textContent.includes('Último adicionado')),'last-added option missing');
 ok([...select.options].some(o=>o.textContent.includes('Ordem alfabética')),'alphabetical option missing');

 document.documentElement.dataset.ct323done='1';
}catch(e){document.documentElement.dataset.ct323probe='fail:'+String(e?.stack||e)}},4600)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'||p==='/profile'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=14000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct323done="1"/.test(out)){const m=out.match(/data-ct323probe="([^"]*)"/);throw new Error('R323_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R323_BROWSER_OK legacy alias + true Top 10 + Home history + Watchlist sorting + version');
