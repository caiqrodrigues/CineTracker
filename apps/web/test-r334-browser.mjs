import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r334.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v334.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const diag='<script>window.__ctDiagErrors=[];window.addEventListener("error",e=>window.__ctDiagErrors.push(String((e.filename||"inline")+":"+(e.lineno||0)+":"+(e.colno||0)+":"+(e.error?.stack||e.message||e))));window.addEventListener("unhandledrejection",e=>window.__ctDiagErrors.push("PROMISE:"+String(e.reason?.stack||e.reason||e)))</script>';
const base=baseRaw.replace('</head>',diag+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR334,T=window.__ctR321Test;
 if(!(X&&T)){
   const markers=Object.keys(window).filter(k=>/^__ctR(32|33|334)/.test(k)).sort().map(k=>k+'='+String(window[k]?.version||window[k])).slice(-40);
   throw new Error('r334 bridges unavailable markers='+markers.join(',')+' errors='+(window.__ctDiagErrors||[]).join(' || '));
 }
 ok(window.__ctOfficialVersion==='1.0.125','web version stale');

 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home><div class="home-tabs"><button class="active" data-home-tab="series">Séries</button></div><div data-home-view="series"><section data-ct274-history="episodes" class="is-collapsed"><div class="panel-head"><h3>Histórico recente</h3><button data-ct275-history-toggle>Ver histórico</button></div><div class="ct275-history-shell" aria-hidden="true"><div class="ct274-history-stack" style="max-height:0;overflow:auto"><div data-at="old">antigo</div><div data-at="new">recente</div></div></div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir</h3></div></section></div></div></div>';
 X.normalizeHome();
 const hist=document.querySelector('[data-ct274-history]');
 ok(!document.querySelector('[data-ct275-history-toggle]'),'history toggle survived');
 ok(hist.classList.contains('is-open'),'history not natural-flow');
 ok(getComputedStyle(document.querySelector('.ct274-history-stack')).overflow==='visible','history kept nested scroller');
 ok(document.querySelector('.ct274-history-stack').lastElementChild.dataset.at==='new','history order changed');

 history.replaceState({},'','/discover');
 document.body.innerHTML='<div id="app"><div data-ct319-discover><div class="ct319-tab-shell"><button data-ct319-prev>‹</button><div data-ct319-tabs><button data-ct319-tab="foryou">Pra você</button></div><button data-ct319-next>›</button><button data-ct319-filter>☷</button></div><div data-ct319-types hidden></div><div data-ct319-content></div></div>'+
 '<div data-ct309-foryou><div class="ct309-slot" data-ct309-slot="fresh:movie"><div class="ct309-actions"><button>Watchlist</button><button>Visto</button><button>Trocar</button></div></div><div class="ct309-slot" data-ct309-slot="fresh:series"><div class="ct309-actions"><button>Watchlist</button><button>Visto</button><button>Trocar</button></div></div></div>'+
 '<div data-ct328-foryou><div data-ct328-kind="movie"><div class="ct328-actions"><button>Watchlist</button><button>Visto</button><button>Trocar</button></div></div></div>'+
 '<div data-ct329-foryou><div data-ct329-kind="movie"><div class="ct329-actions"><button>Watchlist</button><button>Visto</button><button>Trocar</button></div></div></div></div>';
 T.setDiscover('foryou','all');X.normalizeDiscover();
 ok(!document.querySelector('[data-ct319-prev]')&&!document.querySelector('[data-ct319-next]')&&!document.querySelector('[data-ct319-filter]'),'obsolete Discover controls survived');
 const types=document.querySelector('[data-ct319-types]'),labels=[...types.querySelectorAll('button')].map(b=>b.textContent.trim()).join('|');
 ok(!types.hidden&&labels==='Todos|Filmes|Séries|Animes','ForYou filters wrong: '+labels);
 for(let i=0;i<40;i++)X.normalizeDiscover();
 ok(types.querySelectorAll('button').length===4,'filter normalization duplicated DOM');
 const rows=[...document.querySelectorAll('.ct309-actions,.ct328-actions,.ct329-actions')];
 for(const row of rows){
   const buttons=[...row.querySelectorAll(':scope > button')];ok(buttons.length===3,'action row missing button');
   ok(new Set(buttons.map(b=>Math.round(b.getBoundingClientRect().top))).size===1,'action row wrapped');
   ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'action text may wrap');
 }
 const movieFilter=types.querySelector('[data-ct334-fy-kind="movie"]');movieFilter.click();
 ok(document.querySelector('[data-ct309-slot="fresh:series"]').hidden,'series slot not hidden by Filmes filter');
 ok(!document.querySelector('[data-ct309-slot="fresh:movie"]').hidden,'movie slot hidden by Filmes filter');

 T.setTestBridge({
  topPage:async(provider,page)=>({
   movies:Array.from({length:10},(_,i)=>({media_type:'movie',tmdb_id:(page-1)*10+i+1,id:(page-1)*10+i+1,title:'M'+((page-1)*10+i+1),poster_path:'/x.jpg'})),
   series:Array.from({length:10},(_,i)=>({media_type:'tv',tmdb_id:100+(page-1)*10+i+1,id:100+(page-1)*10+i+1,name:'S'+((page-1)*10+i+1),poster_path:'/x.jpg'}))
  }),
  exact:async items=>({blocked_keys:items.filter(x=>(x.tmdb_id>=1&&x.tmdb_id<=8)||(x.tmdb_id>=101&&x.tmdb_id<=108)).map(x=>x.media_type+':'+x.tmdb_id),watch_keys:[],seen_keys:[],not_interested_keys:[]})
 });
 const top=await window.__ctR321.topRaw(8,true);
 ok(top.movies.length===10&&top.series.length===10,'Top10 did not refill to ten');
 ok(top.movies[0].tmdb_id===9&&top.movies[2].tmdb_id===11,'Top10 movies did not continue after exclusions');
 ok(top.series[0].tmdb_id===109&&top.series[2].tmdb_id===111,'Top10 series did not continue after exclusions');

 document.documentElement.dataset.ct334done='1';
}catch(e){document.documentElement.dataset.ct334probe='fail:'+String(e?.stack||e)}},5200)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct334done="1"/.test(out)){const m=out.match(/data-ct334probe="([^"]*)"/);throw new Error('R334_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R334_BROWSER_OK natural Home + stable filters/actions + Top10 refill');
