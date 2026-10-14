import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r520.mjs');
const [catalog,special,screen,summary,homeSports]=await Promise.all([
 'runtime-r520-catalog.js','runtime-r520-special.js','runtime-r520-series-screen.js','runtime-r520-summary.js','runtime-r520-home-sports.js'
].map(x=>readFile(resolve(x),'utf8')));
const items=(kind,base)=>Array.from({length:3},(_,i)=>({title:(kind==='ufc'?'UFC Fight Night ':kind==='wwe'?'WWE Event ':'Grand Prix ')+(i+1),season:2026,episode_number:base+i,round:i+1,session_kind:'race',starts_at:'2026-09-0'+(i+1)+'T12:00:00Z',runtime_minutes:180,released:true,is_watched:i===0,event_id:base+i,event_kind:kind==='ufc'?'Fight Night':'PPV / PLE'}));
const series=(kind,base)=>({series:{title:kind,season:2026,home_bucket:'up_to_date',total_episodes:3,released_episodes:3,watched_episodes:1,available_episodes:0},seasons:[2026,2025],events:items(kind,base)});
const teamEvents=Array.from({length:5},(_,i)=>({id:500+i,provider:'espn:soccer',provider_event_id:'e'+i,competition_id:100,competition_name:'Liga Teste',competition_logo:'/league.png',home_id:10,home_name:'Time A',home_logo:'/a.png',away_id:20,away_name:'Time B',away_logo:'/b.png',home_score:String(i),away_score:'0',starts_at:'2026-10-0'+(i+1)+'T12:00:00Z',is_watched:false}));
const leagueEvents=teamEvents.slice(0,4);
const prelude=`
let currentRoute='home',watchedWrites=0,movieSelections=0;\nwindow.onerror=(m,src,line,col)=>{document.documentElement.dataset.ct520script='error:'+String(m)+'@'+line+':'+col};\nwindow.onunhandledrejection=e=>{document.documentElement.dataset.ct520script='reject:'+String(e?.reason?.stack||e?.reason||e)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
window.__ctCoreR471={
 route:()=>currentRoute,
 rpc:async(name,args)=>{
  if(name==='cinetracker_f1_series_v512')return ${JSON.stringify(series('f1',1000))};
  if(name==='cinetracker_ufc_series_v518')return ${JSON.stringify(series('ufc',2000))};
  if(name==='cinetracker_wwe_ppv_series_v519')return ${JSON.stringify(series('wwe',3000))};
  if(name==='cinetracker_wwe_ppv_episode_status_v520')return [];
  if(name==='cinetracker_sports_team_recent_v520')return {entity:{id:10,name:'Time A',logo_url:'/a.png'},events:${JSON.stringify(teamEvents)}};
  if(name==='cinetracker_sports_league_latest_round_v520')return {entity:{id:100,name:'Liga Teste',logo_url:'/league.png'},round:'10',season:'2026',events:${JSON.stringify(leagueEvents)}};
  if(name==='cinetracker_sport_mark_watched_v1'){watchedWrites++;return {sports_stats:{watched_events:173}}}
  if(name.includes('watch')||name.includes('mark'))return {};
  if(name==='cinetracker_special_series_progress_v520')return {f1:{watched:10,mapped_races:66},ufc:{watched:20,known_events:338},wwe_ppv:{watched:30,known_events:61}};
  throw new Error(name)
 },
 edge:async(name,args)=>{
  if(name==='ct-special-series-summary')return {f1:{watched:10,total:1130,source:'jolpica'},ufc:{watched:20,total:780,source:'ufcstats'},wwe:{watched:30,total:558,source:'wikipedia'}};
  if(name==='ct-ufc-series-sync')return {ok:true,events:${JSON.stringify(items('ufc',2000))}};
  if(name==='ct-wwe-ppv-series-sync')return {ok:true,events:${JSON.stringify(items('wwe',4000000).map((x,i)=>({...x,event_key:'wwe-'+i,episode_number:4000000+i})))}};
  if(name==='cinetracker-f1-v1')return {season:2026,races:[]};
  throw new Error(name)
 }
};
window.__ctR371={selectByUser:k=>{movieSelections+=k==='movies'?1:0;document.querySelectorAll('[data-home-tab]').forEach(b=>b.classList.toggle('active',b.dataset.homeTab===k));document.querySelectorAll('[data-home-view]').forEach(v=>{v.hidden=v.dataset.homeView!==k;v.classList.toggle('hidden',v.hidden)})},applyTab:k=>window.__ctR371.selectByUser(k)};
window.__ctR388={loadMovies:async()=>[],renderMoviesAll:()=>true};
`;
const probe=`
(async()=>{
 const ok=(v,m)=>{if(!v)throw new Error(m)};
 try{
  await sleep(80);
  await window.__ctR512Special.loadCurrent(true);await sleep(80);
  ok(document.querySelectorAll('[data-ct512-special]').length===3,'three special cards');
  const txt=document.querySelector('[data-home-view="series"]').textContent;
  ok(txt.includes('Fórmula 1')&&txt.includes('UFC')&&txt.includes('WWE Pay-Per-View'),'special titles');
  ok(txt.includes('1.130')&&txt.includes('780')&&txt.includes('558'),'global totals');
  const movies=document.querySelector('[data-home-tab="movies"]');movies.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'mouse'}));await sleep(20);
  ok(movieSelections>0,'movies intent');ok(!document.querySelector('[data-home-view="movies"]').hidden,'movies visible');
  window.__ctR371.selectByUser('series');
  document.querySelector('[data-ct512-special="ufc"]').click();await sleep(80);
  ok(document.querySelector('[data-ct513-series-screen] h1')?.textContent==='UFC','UFC screen');
  document.querySelector('[data-ct513-series-close]').click();await sleep(20);
  currentRoute='sports';
  document.getElementById('sports').innerHTML='<article class="ct255-sport-card"><div class="ct255-sport-top"><span>⚽ Liga Teste</span></div><div class="ct255-match"><div><img src="/a.png"><strong>Time A</strong></div><em>1 : 0</em><div><img src="/b.png"><strong>Time B</strong></div></div><div class="ct255-fav-row"><button data-ct255-fav="100">☆ Liga Teste</button><button data-ct255-fav="10">☆ Time A</button><button data-ct255-fav="20">☆ Time B</button></div></article>';
  document.querySelector('.ct255-match img').click();await sleep(50);
  ok(document.querySelectorAll('.ct520-detail-event').length===5,'team last five');
  document.querySelector('[data-ct520-detail-watch]').click();await sleep(40);ok(watchedWrites===1,'canonical sports writer');
  document.querySelector('[data-ct520-detail-close]').click();await sleep(10);
  document.querySelector('.ct255-sport-top span').click();await sleep(50);ok(document.querySelectorAll('.ct520-detail-event').length===4,'league latest round');
  document.documentElement.dataset.ct520browser='ok';
 }catch(e){document.documentElement.dataset.ct520browser='fail:'+String(e?.stack||e)}
})();
`;
const html='<!doctype html><html><head><style>.hidden{display:none}.search-global{height:42px}.home-tabs{display:flex}.media-row{display:grid}.ct520-detail-backdrop{position:fixed}</style></head><body><div class="app" data-page="home"><main class="content"><div class="search-global"><input data-global-search></div><div data-home><div class="home-tabs"><button data-home-tab="series" class="active">Séries</button><button data-home-tab="movies">Filmes</button></div><div data-home-view="series"><section><div class="panel-head"><h3>Continuar assistindo</h3><small>0</small></div><div class="stack"></div></section><section><div class="panel-head"><h3>Em dia</h3><small>0</small></div><div class="stack"></div></section></div><div data-home-view="movies" class="hidden" hidden></div></div><div id="sports"></div></main></div><script src="/prelude.js"></script><script src="/catalog.js"></script><script src="/special.js"></script><script src="/screen.js"></script><script src="/summary.js"></script><script src="/homeSports.js"></script><script src="/probe.js"></script></body></html>';
const assets=new Map([['/',{type:'text/html',body:html}],['/prelude.js',{type:'application/javascript',body:prelude}],['/catalog.js',{type:'application/javascript',body:catalog}],['/special.js',{type:'application/javascript',body:special}],['/screen.js',{type:'application/javascript',body:screen}],['/summary.js',{type:'application/javascript',body:summary}],['/homeSports.js',{type:'application/javascript',body:homeSports}],['/probe.js',{type:'application/javascript',body:probe}]]);
const server=createServer((req,res)=>{const item=assets.get(new URL(req.url,'http://127.0.0.1').pathname);if(!item){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':item.type.includes('charset')?item.type:item.type+'; charset=utf-8','cache-control':'no-store'});res.end(item.body)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=3000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},30000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const m=out.match(/data-ct520browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R520_BROWSER '+state+' STDERR='+err.slice(-1000)+' DOM='+out.slice(-6000));
console.log('R520_BROWSER_OK three-series+home-tabs+sports-details');
