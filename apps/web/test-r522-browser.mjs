import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r522.mjs');
const [css,sports,opener]=await Promise.all([
 readFile(resolve('dist/app-v522.css'),'utf8'),
 readFile(resolve('runtime-r522-sports-only.js'),'utf8'),
 readFile(resolve('runtime-r522-special-open.js'),'utf8')
]);
const prelude=`
let currentRoute='home',nativeMovieClicks=0,openCalls=[],watchedWrites=0;
window.onerror=(m,s,l,c)=>{document.documentElement.dataset.ct522browser='error:'+String(m)+'@'+l+':'+c};
const rows=v=>Array.isArray(v)?v:[];
window.__ctCoreR471={route:()=>currentRoute,rpc:async(name,args)=>{
 if(name==='cinetracker_sports_team_recent_v520')return {entity:{id:10,name:'Time A'},events:Array.from({length:5},(_,i)=>({id:500+i,competition_name:'Liga Teste',home_name:'Time A',away_name:'Time B',home_score:String(i),away_score:'0',starts_at:'2026-10-0'+(i+1)+'T12:00:00Z',is_watched:false}))};
 if(name==='cinetracker_sports_league_latest_round_v520')return {entity:{id:100,name:'Liga Teste'},round:'10',events:Array.from({length:4},(_,i)=>({id:600+i,competition_name:'Liga Teste',home_name:'Time A',away_name:'Time B',home_score:'1',away_score:'0',starts_at:'2026-10-0'+(i+1)+'T12:00:00Z',is_watched:false}))};
 if(name==='cinetracker_sport_mark_watched_v1'){watchedWrites++;return{}}
 throw new Error(name)
}};
window.__ctR371={selectByUser:k=>{if(k==='movies')nativeMovieClicks++;document.querySelectorAll('[data-home-tab]').forEach(b=>b.classList.toggle('active',b.dataset.homeTab===k));document.querySelectorAll('[data-home-view]').forEach(v=>{v.hidden=v.dataset.homeView!==k;v.classList.toggle('hidden',v.hidden)})}};
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-home-tab]');if(b)window.__ctR371.selectByUser(b.dataset.homeTab)},false);
window.__ctR513SeriesScreen={open:async type=>{openCalls.push(type);const names={f1:'Fórmula 1',ufc:'UFC',wwe:'WWE Pay-Per-View'};let x=document.querySelector('[data-ct513-series-screen]');if(!x){x=document.createElement('div');x.dataset.ct513SeriesScreen='1';document.body.appendChild(x)}x.innerHTML='<h1>'+names[type]+'</h1><button data-test-close>Fechar</button>';return true}};
document.addEventListener('click',e=>{if(e.target.closest?.('[data-test-close]'))e.target.closest('[data-ct513-series-screen]')?.remove()},true);
`;
const probe=`
(async()=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms)),ok=(v,m)=>{if(!v)throw new Error(m)};
 try{
  await sleep(20);
  const tabsStyle=getComputedStyle(document.querySelector('.home-tabs')),searchStyle=getComputedStyle(document.querySelector('.search-global'));
  ok(tabsStyle.position!=='fixed','Home tabs fixed');ok(searchStyle.position!=='fixed'&&searchStyle.position!=='sticky','Home search pinned');
  document.querySelector('[data-home-tab="movies"]').click();await sleep(10);
  ok(nativeMovieClicks===1,'native Home click intercepted '+nativeMovieClicks);ok(!document.querySelector('[data-home-view="movies"]').hidden,'Movies did not open');
  window.__ctR371.selectByUser('series');
  for(const [type,title] of [['f1','Fórmula 1'],['ufc','UFC'],['wwe','WWE Pay-Per-View']]){
   const card=document.querySelector('[data-ct512-special="'+type+'"]');
   card.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerType:'mouse'}));await sleep(20);
   ok(openCalls.at(-1)===type,type+' opener not called');ok(document.querySelector('[data-ct513-series-screen] h1')?.textContent===title,type+' title');
   document.querySelector('[data-test-close]').click();await sleep(5);
  }
  ok(openCalls.join(',')==='f1,ufc,wwe','unexpected open sequence '+openCalls.join(','));
  currentRoute='sports';
  document.getElementById('sports').innerHTML='<article class="ct255-sport-card"><div class="ct255-sport-top"><span>⚽ Liga Teste</span></div><div class="ct255-match"><div><img><strong>Time A</strong></div><em>1 : 0</em><div><img><strong>Time B</strong></div></div><div><button data-ct255-fav="100">Liga Teste</button><button data-ct255-fav="10">Time A</button><button data-ct255-fav="20">Time B</button></div></article>';
  document.querySelector('.ct255-match img').click();await sleep(20);ok(document.querySelectorAll('.ct520-detail-event').length===5,'Sports team detail lost');
  document.querySelector('[data-ct520-detail-watch]').click();await sleep(20);ok(watchedWrites===1,'Sports writer lost');
  document.documentElement.dataset.ct522browser='ok';
 }catch(e){document.documentElement.dataset.ct522browser='fail:'+String(e?.stack||e)}
})();
`;
const cards=['f1','ufc','wwe'].map(t=>'<div class="media-row ct512-special-card" data-ct512-special="'+t+'" data-ct513-open="'+t+'" role="button" tabindex="0">'+t+'</div>').join('');
const html='<!doctype html><html><head><style>'+css+'.hidden{display:none}.search-global{height:42px}.home-tabs{display:flex}.media-row{display:grid}</style></head><body><div class="app" data-page="home"><main><div class="search-global"><input></div><div data-home><div class="home-tabs"><button data-home-tab="series" class="active">Séries</button><button data-home-tab="movies">Filmes</button></div><div data-home-view="series">'+cards+'</div><div data-home-view="movies" class="hidden" hidden>Filmes</div></div><div id="sports"></div></main></div><script src="/prelude.js"></script><script src="/sports.js"></script><script src="/opener.js"></script><script src="/probe.js"></script></body></html>';
const assets=new Map([['/',{type:'text/html',body:html}],['/prelude.js',{type:'application/javascript',body:prelude}],['/sports.js',{type:'application/javascript',body:sports}],['/opener.js',{type:'application/javascript',body:opener}],['/probe.js',{type:'application/javascript',body:probe}]]);
const server=createServer((req,res)=>{const item=assets.get(new URL(req.url,'http://127.0.0.1').pathname);if(!item){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':item.type+'; charset=utf-8','cache-control':'no-store'});res.end(item.body)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=1200','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},30000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));const m=out.match(/data-ct522browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R522_BROWSER '+state+' DOM='+out.slice(-4500));
console.log('R522_BROWSER_OK native-home+f1+ufc+wwe+sports');
