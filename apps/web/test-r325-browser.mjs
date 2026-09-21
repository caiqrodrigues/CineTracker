import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r325.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist');execFileSync(process.execPath,['--check',resolve(dist,'app-v325.js')],{stdio:'inherit'});const base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR325,XT=window.__ctR325Test;
 ok(X&&XT,'r325 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.116','web version stale');
 ok(window.__ctR324?.version==='1.0.115','r324 regression base unavailable');

 const merged=XT.mergeHistory325(
  {history_episodes:[],history_movies:[]},
  {history_episodes:[{media_title:'Reacher',season_number:4,episode_number:4}],history_movies:[{media_title:'Na Zona Cinzenta'}]}
 );
 ok(merged.__ctHistoryAuthoritative===true,'Home history not authoritative');
 ok(merged.history_episodes.length===1&&merged.history_movies.length===1,'hidden histories not preloaded');

 const rows=[{tmdb_id:108978,media_id:2490,watched_episodes:26,last_season_number:4,last_episode_number:2,last_watched_at:'2026-09-04T00:00:00Z'}];
 XT.applyWatchState325(rows,new Map([[108978,{
  tmdb_id:108978,canonical_media_id:9590,media_ids:[2490,9590],watched_episodes:28,
  watched_keys:[{s:4,e:1},{s:4,e:2},{s:4,e:3},{s:4,e:4}],
  last_season_number:4,last_episode_number:4,last_watched_at:'2026-09-17T11:28:37Z'
 }]]));
 ok(rows[0].media_id===9590,'canonical duplicate media id not applied');
 ok(rows[0].watched_episodes===28,'duplicate watched count not unified');
 ok(rows[0].last_season_number===4&&rows[0].last_episode_number===4,'last watched S/E not unified');

 X.setTestBridge({
  show:async()=>({
   status:'Returning Series',number_of_episodes:32,
   seasons:[{season_number:1,episode_count:8},{season_number:2,episode_count:8},{season_number:3,episode_count:8},{season_number:4,episode_count:8}],
   last_episode_to_air:{season_number:4,episode_number:6,air_date:'2026-09-19',name:'Plum deu Azar'},
   next_episode_to_air:{season_number:4,episode_number:7,air_date:'2026-09-26',name:'Vote em Sampson'}
  }),
  firstUnseen:async()=>({season_number:4,episode_number:5,name:'A Ponte',air_date:'2026-09-19',vote_average:6.8}),
  refreshTv:async()=>({refreshed:0})
 });
 const row={tmdb_id:108978,watched_episodes:28,total_episodes:32,released_episodes:28,home_bucket:'up_to_date'};
 await X.reconcileOne(row);
 ok(row.released_episodes===30,'fresh released count not updated');
 ok(row.home_bucket==='continue','new released episode did not move series to continue');
 ok(row.next_season_number===4&&row.next_episode_number===5,'fresh next episode wrong');
 ok(row.available_episodes===2,'available episode count wrong');
 ok(row.__ct325NewEpisode===true,'recent released episode not marked new');

 document.documentElement.dataset.ct325done='1';
}catch(e){document.documentElement.dataset.ct325probe='fail:'+String(e?.stack||e)}},4800)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=15000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct325done="1"/.test(out)){const m=out.match(/data-ct325probe="([^"]*)"/);throw new Error('R325_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R325_BROWSER_OK history preload + duplicate S/E union + fresh released episodes');
