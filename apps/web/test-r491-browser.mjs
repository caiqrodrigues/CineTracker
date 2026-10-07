import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r491.mjs');

const js=await readFile(resolve('dist/app-v491.js'),'utf8');
const runtime=await readFile(resolve('runtime-r491-final.js'),'utf8');
const cs=js.indexOf('/* CT_R491_CORE_START */');
const ce=js.indexOf('/* CT_R491_CORE_END */');
if(cs<0||ce<0)throw new Error('core probe missing');
const core=js.slice(cs,ce+'/* CT_R491_CORE_END */'.length);
const ma="window.__ctR464Marker='discover-foryou-visible-owner-v421';";
const mi=js.indexOf(ma),ms=js.lastIndexOf('(()=>{',mi),me=js.indexOf('\n})();',mi);
if(mi<0||ms<0||me<0)throw new Error('r464 probe missing');
const r464=js.slice(ms,me+6);

const items=(type,kind,base)=>Array.from({length:4},(_,i)=>({
 media_type:type,media_kind:kind,tmdb_id:base+i,title:(kind||type)+' '+i,poster_path:'/p.jpg',
 release_year:2025,runtime_minutes:100,vote_average:8.2
}));
const payload={
 watch:{movie:items('movie','movie',100),series:items('tv','series',200),anime:items('tv','anime',300)},
 fresh:{movie:items('movie','movie',400),series:items('tv','series',500),anime:items('tv','anime',600)}
};
const summary={
 series:items('tv','series',1000).concat(items('tv','series',1010),items('tv','series',1020)).slice(0,12),
 movies:items('movie','movie',1100).concat(items('movie','movie',1110),items('movie','movie',1120)).slice(0,12),
 series_favorites:items('tv','series',1200).concat(items('tv','series',1210),items('tv','series',1220)).slice(0,12),
 movie_favorites:items('movie','movie',1300).concat(items('movie','movie',1310),items('movie','movie',1320)).slice(0,12),
 actors:Array.from({length:12},(_,i)=>({tmdb_person_id:1400+i,actor_name:'Actor '+i,profile_path:'/a.jpg'})),
 counts:{series:249,movies:962,series_favorites:17,movie_favorites:45,actors:21}
};
const screen={
 stats:{total_minutes:212892,episodes_watched:12731,movies_watched:962,series_minutes:164781,movie_minutes:48111},
 series_stats:{completed_series:170,in_progress_series:30,up_to_date_series:51,not_started_series:583},
 remaining:{watchlist_series:583,watchlist_movies:1387},
 activity:[{day:'2026-10-07',count:2,episodes:1,movies:1,sports:0}],
 summary,sports:{sports_minutes:17790,watched_events:172},stadium:{stadium_events:1,watched_events:172}
};

const prelude=`
document.documentElement.dataset.ct491browser='boot';
window.onerror=(m,s,l,c)=>{document.documentElement.dataset.ct491browser='error:'+String(m)+'@'+String(l)+':'+String(c)};
let navSeq=1,currentRoute='profile',profileCache=null;
const route=()=>currentRoute,tz=()=> 'America/Sao_Paulo',localDay=()=> '2026-10-07',fmtMinutes=n=>n+' min';
const esc=v=>String(v??''),img=p=>p,$=(s,r=document)=>r.querySelector(s),shell=(a,b,c,d)=>d;
const setApp=h=>document.getElementById('app').innerHTML=h,fail=m=>'<div class="error">'+m+'</div>';
const mediaCard=x=>'<article class="card"><button data-media="'+(x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id+'"><div class="poster"></div><div class="card-body"><b>'+x.title+'</b></div></button></article>';
const rpc=async(name)=>{
 if(name==='cinetracker_profile_screen_v491')return ${JSON.stringify(screen)};
 if(name==='cinetracker_foryou_payload_v490')return ${JSON.stringify(payload)};
 throw new Error(name)
};
function ct168PaintProfile(){
 const root=document.querySelector('[data-profile]');
 root.innerHTML='<section class="panel"><div class="panel-head"><h2>Estatísticas</h2></div></section>'+
 ['Séries','Filmes','Séries Favoritas','Filmes Favoritos','Atores Favoritos'].map(t=>'<section class="panel"><div class="panel-head"><h2>'+t+'</h2><small>0</small></div><div class="row"></div></section>').join('')+
 '<section class="panel"><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stats"><div class="stat"><small>Tempo assistido</small><b>0</b></div><div class="stat"><small>Eventos assistidos</small><b>0</b></div></div></section>'+
 '<section class="panel"><div class="panel-head"><h2>Episódios por dia</h2></div></section>';
}
function ct169RenderActivity(){}
window.__ctR388={renderHome:async()=>{
 document.getElementById('app').innerHTML='<div data-home><div data-home-view="series"><section class="home-section"><h3>Continuar assistindo</h3></section><section class="home-section"><h3>Histórico recente</h3></section></div><div data-home-view="movies"><div class="ct388-movie-stack ct489-movie-grid"><article class="ct489-movie-card"><div class="poster"></div><div class="card-body"><b>Movie</b></div></article></div></div></div>';
 return true
}};
window.__ctCoreR471={route:()=>currentRoute,authReady:()=>true,rpc:(n,a)=>rpc(n,a),mediaCard};
window.__ctR288R263={discover263:{tab:'foryou'}};
window.__ctR365={persistDirect:async()=>true};
`;

const probe=`
(async()=>{
 const ok=(v,m)=>{if(!v)throw new Error(m)};
 try{
  await renderProfile491(1);
  const panels=[...document.querySelectorAll('[data-profile] section.panel')];
  for(const title of ['Séries','Filmes','Séries Favoritas','Filmes Favoritos','Atores Favoritos']){
   const p=panels.find(x=>x.querySelector('h2')?.textContent===title);
   ok(p,'panel '+title);
   ok(p.querySelectorAll('.ct491-profile-grid>.card').length===12,'12 cards '+title);
   ok(p.querySelectorAll('.ct491-profile-more').length===1,'header more '+title);
   ok(!p.querySelector('.ct471-more-card,.ct472-more-card'),'large more '+title);
  }
  const sp=panels.find(x=>x.querySelector('h2')?.textContent==='Esportes assistidos');
  ok(sp.textContent.includes('172'),'sports 172');
  ok(sp.textContent.includes('1'),'stadium 1');

  currentRoute='home';
  await renderHome491(1);
  const hs=[...document.querySelectorAll('[data-home-view="series"] h3')].map(x=>x.textContent);
  ok(hs[0]==='Continuar assistindo','Continue first');
  ok(hs.indexOf('Histórico recente')>0,'History after Continue');
  const poster=document.querySelector('.ct489-movie-card .poster'),pr=poster.getBoundingClientRect();
  ok(pr.width>0&&Math.abs(pr.height/pr.width-1.5)<0.03,'movie 2:3 '+pr.width+'x'+pr.height);

  currentRoute='discover';
  document.querySelector('[data-ct319-content]').innerHTML='';
  await window.__ctR464.load(false);
  const fy=document.querySelector('[data-ct464-foryou]');
  ok(fy,'ForYou root');
  const slotCount=fy.querySelectorAll('[data-ct464-slot]').length;ok(slotCount===7,'ForYou seven slots '+slotCount+' '+fy.innerHTML.slice(0,800));
  ok(!fy.textContent.includes('Sem indicação elegível agora'),'ForYou empty');
  ok(fy.querySelectorAll('[data-ct464-action="swap"]').length===7,'seven swaps');
  fy.querySelector('[data-ct464-slot="fresh:movie"] [data-ct464-action="swap"]').click();
  await new Promise(r=>setTimeout(r,0));
  ok(fy.querySelector('[data-ct464-slot="fresh:movie"] [data-media]'),'swap retained card');

  document.querySelector('[data-ct319-content]').innerHTML='<div class="ct319-top-row"><div class="ct319-item"><article class="ct288-card"><button class="ct288-open"><div class="ct288-poster"></div></button></article></div></div>';
  await new Promise(r=>requestAnimationFrame(()=>r()));
  const top=document.querySelector('.ct288-poster').getBoundingClientRect();
  ok(top.width>0&&Math.abs(top.height/top.width-1.5)<0.04,'Top10 2:3 '+top.width+'x'+top.height);

  document.documentElement.dataset.ct491browser='ok';
 }catch(e){
  document.documentElement.dataset.ct491browser='fail:'+String(e?.stack||e);
 }
})();
`;

const html='<!doctype html><html><head><style>'+
'body{margin:0}.hidden{display:none}.card{width:150px}.poster{width:100%}.ct319-item{width:120px}.ct288-poster{width:120px}'+
'</style></head><body><div id="app"></div><div data-ct319-content></div>'+
'<script src="/prelude.js"></script><script src="/core.js"></script><script src="/r464.js"></script><script src="/runtime.js"></script><script src="/probe.js"></script>'+
'</body></html>';

const assets=new Map([
 ['/','text/html; charset=utf-8',html],
 ['/prelude.js','application/javascript; charset=utf-8',prelude],
 ['/core.js','application/javascript; charset=utf-8',core],
 ['/r464.js','application/javascript; charset=utf-8',r464],
 ['/runtime.js','application/javascript; charset=utf-8',runtime],
 ['/probe.js','application/javascript; charset=utf-8',probe]
].map(([path,type,body])=>[path,{type,body}]));

const server=createServer((req,res)=>{
 const item=assets.get(new URL(req.url,'http://127.0.0.1').pathname);
 if(!item){res.writeHead(404);res.end();return}
 res.writeHead(200,{'content-type':item.type,'cache-control':'no-store'});
 res.end(item.body);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port;

let bin='';
for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){
 try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}
}
if(!bin)throw new Error('Chromium unavailable');

const child=spawn(bin,[
 '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
 '--virtual-time-budget=12000','--dump-dom','http://127.0.0.1:'+port+'/'
],{stdio:['ignore','pipe','pipe']});
let out='',err='';
child.stdout.on('data',d=>out+=d);
child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},25000);
const code=await new Promise(r=>child.on('close',r));
clearTimeout(killer);
await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1500));
const match=out.match(/data-ct491browser="([^"]*)"/);
const state=match?.[1]||'';
if(state!=='ok')throw new Error('R491_BROWSER '+(state||'probe did not finish')+' STDERR='+err.slice(-1200)+' DOM='+out.slice(-4000));
console.log('R491_BROWSER_OK requested-screen DOM behavior');
