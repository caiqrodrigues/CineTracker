import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r343.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v343.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>
window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};
window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)));
</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 ok(window.__ctR343&&window.__ctR342&&window.__ctR336&&window.__ctR309Test,'r343 lineage missing '+window.__ctDiagErrors.join(' || '));
 ok(window.__ctOfficialVersion==='1.0.134','version stale');

 /* Discover: establish the final r336 DOM, then invoke every legacy painter that used to take over seconds later. */
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div data-ct319-discover><div data-ct319-content></div></div>';
 const item=(id,type,title)=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8,release_date:'2026-01-01',first_air_date:'2026-01-01'});
 const m=item(101,'movie','Filme Final'),s=item(102,'tv','Série Final'),a={...item(103,'tv','Anime Final'),genre_ids:[16],original_language:'ja'};
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[m],series:[s],anime:[a]},freshPools:{movie:[item(201,'movie','Novo Filme')],series:[item(202,'tv','Nova Série')],anime:[{...item(203,'tv','Novo Anime'),genre_ids:[16],original_language:'ja'}]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[item(301,'movie','Diário')],dailyIndex:0,complete:true,
  initial:{watch:{movie:m,series:s,anime:a},fresh:{movie:item(201,'movie','Novo Filme'),series:item(202,'tv','Nova Série'),anime:{...item(203,'tv','Novo Anime'),genre_ids:[16],original_language:'ja'}},daily:item(301,'movie','Diário')}
 });
 ok(window.__ctR336.paintForYou(),'final r336 paint failed');
 const host=document.querySelector('[data-ct319-content]');
 const finalOk=()=>!!host.querySelector('[data-ct336-foryou]')&&!host.querySelector('[data-ct309-foryou]')&&!host.querySelector('[data-ct328-foryou]:not([data-ct336-foryou])')&&!host.querySelector('[data-ct329-foryou]:not([data-ct336-foryou])');
 ok(finalOk(),'final DOM not established');
 const before=host.innerHTML;
 await window.__ctR309.buildForYou(false);
 window.__ctR328Test?.paintForYou328?.();
 window.__ctR329Test?.paintForYou329?.();
 await sleep(700);
 ok(finalOk(),'legacy ForYou renderer replaced r336 DOM');
 ok(host.innerHTML===before,'legacy painter mutated final ForYou DOM');

 /* Home preparation: live episode metadata must exist before the first real Home paint is allowed. */
 history.replaceState({},'','/');
 window.__ctR325Test?.setTestBridge?.({
  seriesState:async ids=>ids.map(id=>({tmdb_id:id,canonical_media_id:9001,watched_episodes:1,watched_keys:['1:1'],media_ids:[9001],last_season_number:1,last_episode_number:1})),
  show:async()=>({number_of_episodes:8,status:'Returning Series',last_episode_to_air:{season_number:1,episode_number:8,air_date:'2026-09-20'},seasons:[{season_number:1,episode_count:8}]}),
  firstUnseen:async()=>({season_number:1,episode_number:2,name:'O Episódio Completo',vote_average:8.7,air_date:'2026-09-22'})
 });
 const payload={series:[{tmdb_id:777,media_id:9001,title:'Série Teste',home_bucket:'continue',watched_episodes:1,released_episodes:8,total_episodes:8,last_season_number:1,last_episode_number:1,next_season_number:1,next_episode_number:2,next_episode_title:'Episódio 2',next_episode_rating:null,next_episode_air_date:null}],movie_watchlist:[],history_episodes:[],history_movies:[],__ctHistoryAuthoritative:true};
 ok(await window.__ctR343.prepareHomePayload(payload),'Home preparation failed');
 const prepared=window.__ctR343.prepared?.[0];
 ok(prepared,'prepared Home row missing');
 ok(prepared.next_episode_title==='O Episódio Completo','episode title not ready: '+prepared.next_episode_title);
 ok(Number(prepared.next_episode_rating)===8.7,'episode rating not ready');
 ok(prepared.next_episode_air_date==='2026-09-22','episode date not ready');
 ok(payload.__ct343Prepared===true,'payload not marked prepared');

 document.documentElement.dataset.ct343done='1';
}catch(e){document.documentElement.dataset.ct343probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1680,900','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct343done="1"/.test(out)){const m=out.match(/data-ct343probe="([^"]*)"/);throw new Error('R343_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R343_BROWSER_OK legacy Discover painters cannot replace r336 DOM; Home episode title/rating/date are prepared before paint');
