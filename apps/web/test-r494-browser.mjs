import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r494.mjs');

let html=await readFile(resolve('dist/index.html'),'utf8');
const css=await readFile(resolve('dist/app-v494.css'),'utf8');
const js=await readFile(resolve('dist/app-v494.js'),'utf8');
const sw=await readFile(resolve('dist/service-worker.js'),'utf8');

const media=(type,kind,base,buckets=['continue','dust','up_to_date','not_started','completed'])=>Array.from({length:12},(_,i)=>({
 media_type:type,media_kind:kind,media_id:base+i,tmdb_id:base+i,title:(kind||type)+' '+i,poster_path:'/p.jpg',
 release_year:2025,runtime_minutes:100,vote_average:8.4,watched_episodes:i+1,released_episodes:12,total_episodes:12,
 home_bucket:buckets[Math.min(buckets.length-1,Math.floor(i/3))]
}));
const series=media('tv','series',1000);
const movies=media('movie','movie',2000);
const summary={
 series:media('tv','series',3000),movies:media('movie','movie',4000),
 series_favorites:media('tv','series',5000),movie_favorites:media('movie','movie',6000),
 actors:Array.from({length:12},(_,i)=>({tmdb_person_id:7000+i,actor_name:'Actor '+i,profile_path:'/a.jpg'})),
 counts:{series:249,movies:962,series_favorites:17,movie_favorites:45,actors:21}
};
const history={history_episodes:[{media_id:1000,tmdb_id:1000,title:'series 0',season_number:1,episode_number:2,watched_at:'2026-10-07T12:00:00Z'}],history_movies:[{media_id:2000,tmdb_id:2000,title:'movie 0',watched_at:'2026-10-07T11:00:00Z'}]};
const quick={stats:{total_minutes:212892,episodes_watched:12731,movies_watched:962,series_minutes:164781,movie_minutes:48111},series_stats:{completed_series:170,in_progress_series:30,up_to_date_series:51,not_started_series:583},remaining:{watchlist_series:583,watchlist_movies:1387},sports_stats:{sports_minutes:17790,watched_events:172}};
const session={access_token:'local-valid-token',refresh_token:'refresh-token',expires_at:Math.floor(Date.now()/1000)+3600,user:{email:'teste@cinetracker.local'}};

const shim=String.raw`
<script data-ct494-test-shim>
localStorage.setItem('cinetracker_session',JSON.stringify(${JSON.stringify(session)}));
window.__ct494FetchLog=[];
const ct494Json=(data,status=200)=>Promise.resolve(new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}}));
window.fetch=(input,init={})=>{
 const u=String(input?.url||input),m=u.match(/\/rpc\/([^?]+)/),name=m?decodeURIComponent(m[1]):'';
 if(name)window.__ct494FetchLog.push(name);
 if(u.includes('/auth/v1/user')){
  return new Promise((resolve,reject)=>{
   const sig=init?.signal;if(sig?.aborted)return reject(new DOMException('Aborted','AbortError'));
   sig?.addEventListener?.('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true});
  });
 }
 if(u.includes('/auth/v1/token'))return ct494Json(${JSON.stringify(session)});
 if(name==='cinetracker_home_series_v492')return new Promise(r=>setTimeout(()=>r(new Response(JSON.stringify({rows:${JSON.stringify(series)},counts:{continue:3,dust:3,up_to_date:3,not_started:3,completed:0}}),{status:200,headers:{'content-type':'application/json'}})),180));
 if(name==='cinetracker_home_history_v391')return new Promise(r=>setTimeout(()=>r(new Response(JSON.stringify(${JSON.stringify(history)}),{status:200,headers:{'content-type':'application/json'}})),900));
 if(name==='cinetracker_home_movies_v405')return new Promise(r=>setTimeout(()=>r(new Response(JSON.stringify({rows:${JSON.stringify(movies)},count:1387}),{status:200,headers:{'content-type':'application/json'}})),220));
 if(name==='cinetracker_profile_summary_v489')return new Promise(r=>setTimeout(()=>r(new Response(JSON.stringify(${JSON.stringify(summary)}),{status:200,headers:{'content-type':'application/json'}})),180));
 if(name==='cinetracker_profile_quick_stats_v1')return ct494Json(${JSON.stringify(quick)});
 if(name==='cinetracker_profile_stats')return ct494Json([${JSON.stringify(quick.stats)}]);
 if(name==='cinetracker_sports_stadium_summary_v296')return ct494Json({stadium_events:1,watched_events:172});
 if(name==='cinetracker_activity_by_day_v320')return ct494Json([{day:'2026-10-07',count:2,episodes:1,movies:1,sports:0}]);
 if(u.includes('/functions/v1/tmdb-image'))return Promise.resolve(new Response('',{status:404}));
 if(u.includes('/functions/v1/'))return ct494Json({results:[]});
 if(name)return ct494Json({});
 return ct494Json({});
};
</script>
`;
html=html.replace('</head>',shim+'</head>');
const probe=String.raw`
<script data-ct494-probe>
(async()=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms)),ok=(v,m)=>{if(!v)throw new Error(m)};
 try{
  await sleep(120);
  ok(!document.querySelector('[data-ct479-preboot-ui]'),'gold preboot visible');
  ok(!document.documentElement.hasAttribute('data-ct461-series-gate'),'legacy series gate set');
  const app=document.querySelector('.app[data-page="home"]');ok(app,'current Home shell missing while auth validation hangs');
  ok(document.querySelector('.home-tabs'),'Home tabs missing');
  const logo=document.querySelector('.logo'),color=getComputedStyle(logo).color;
  ok(color!=='rgb(214, 181, 91)','gold logo returned '+color);
  await sleep(360);
  const first=document.querySelector('[data-home-view="series"] [data-ct388-series-section] h3,[data-home-view="series"] .home-section h3');
  ok(first&&/Continuar assistindo/i.test(first.textContent),'series did not progressively paint');
  ok(document.querySelector('[data-ct388-history="episodes"]'),'history shell missing');

  document.querySelector('[data-home-tab="movies"]').click();
  await sleep(30);
  ok(!document.querySelector('[data-home-view="movies"]').hidden,'movie tab not immediate');
  await sleep(320);
  ok(document.querySelectorAll('.ct489-movie-card').length===12,'movie cards missing');
  const poster=document.querySelector('.ct489-movie-card .poster').getBoundingClientRect();
  ok(poster.width>0&&Math.abs(poster.height/poster.width-1.5)<0.05,'movie ratio '+poster.width+'x'+poster.height);

  document.querySelector('[data-nav="profile"]').click();
  await sleep(650);
  const root=document.querySelector('[data-profile]');ok(root,'Profile did not open');
  ok(!window.__ct494FetchLog.includes('cinetracker_profile_screen_v491'),'heavy Profile RPC returned');
  const labels=['Séries','Filmes','Séries Favoritas','Filmes Favoritos','Atores Favoritos'];
  for(const label of labels){
   const panel=[...root.querySelectorAll('section.panel,.panel')].find(p=>p.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent?.trim()===label);
   ok(panel,'profile panel '+label);
   ok(panel.querySelectorAll('.ct491-profile-grid>.card').length===12,'profile 12 '+label);
  }
  document.documentElement.dataset.ct494browser='ok';
 }catch(e){document.documentElement.dataset.ct494browser='fail:'+String(e?.stack||e)}
})();
</script>
`;
html=html.replace('</body>',probe+'</body>');

const assets=new Map([
 ['/home',{type:'text/html; charset=utf-8',body:html}],['/',{type:'text/html; charset=utf-8',body:html}],
 ['/app-v494.css',{type:'text/css; charset=utf-8',body:css}],['/app-v494.js',{type:'application/javascript; charset=utf-8',body:js}],
 ['/service-worker.js',{type:'application/javascript; charset=utf-8',body:sw}],['/favicon.svg',{type:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg"/>'}]
]);
const server=createServer((req,res)=>{
 const path=new URL(req.url,'http://127.0.0.1').pathname,item=assets.get(path)||assets.get('/home');
 res.writeHead(200,{'content-type':item.type,'cache-control':'no-store'});res.end(item.body);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port;
let bin='';
for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=4500','--dump-dom','http://127.0.0.1:'+port+'/home'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},50000);
const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1800));
const match=out.match(/data-ct494browser="([^"]*)"/),state=match?.[1]||'';
if(state!=='ok')throw new Error('R494_BROWSER '+state+' STDERR='+err.slice(-1600)+' DOM='+out.slice(-7000));
console.log('R494_BROWSER_OK exact bundle local-first boot + Home + Profile');
