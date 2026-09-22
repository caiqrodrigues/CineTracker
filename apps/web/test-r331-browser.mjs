import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r331.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR331,T=window.__ctR321Test;
 ok(X&&T,'r331 bridge unavailable');
 ok(window.__ctOfficialVersion==='1.0.122','version stale');

 /* Cached Home must render and release navigation immediately even if refresh is slow. */
 history.replaceState({},'','/home');
 const payload={__ctHistoryAuthoritative:true,series:[],movie_watchlist:[],history_episodes:[{id:1,media_id:1,tmdb_id:1,media_title:'Histórico',watched_at:'2026-09-22T10:00:00Z',season_number:1,episode_number:1,plays:1}],history_movies:[]};
 try{homeCache=payload;ct274CanonicalHome=payload;navSeq=991}catch(e){throw new Error('Home globals unavailable '+e)}

 const t0=performance.now();const result=await Promise.race([window.__ctR331RenderHomeTest(991),new Promise((_,rej)=>setTimeout(()=>rej(new Error('cached Home render blocked')),500))]);
 const elapsed=performance.now()-t0;
 ok(elapsed<500,'cached Home held navigation '+elapsed.toFixed(1)+'ms');
 ok(document.querySelector('[data-home] .home-tabs'),'cached Home did not paint');
 X.normalizeHistory();
 const hist=document.querySelector('[data-ct274-history="episodes"]');
 ok(hist&&hist.dataset.ct331History==='natural','history not normalized');
 ok(!hist.querySelector('[data-ct275-history-toggle],[data-ct324-history-toggle]'),'history toggle survived');
 ok(getComputedStyle(hist.querySelector('.ct274-history-stack')).overflowY!=='auto'&&getComputedStyle(hist.querySelector('.ct274-history-stack')).overflowY!=='scroll','history still has inner scroller');

 /* ForYou stale draft is hidden during v326 audit, then three actions share one row. */
 history.replaceState({},'','/discover');
 const app=document.querySelector('#app');app.innerHTML='<div data-ct329-foryou style="width:176px"><div class="ct329-actions"><button class="ct329-action">+ Watchlist</button><button class="ct329-action">✓ Visto</button><button class="ct329-action ct329-swapbtn">↻ Trocar</button></div></div><div data-ct319-types data-ct328-always="1"><button class="chip">Todos</button><button class="chip">Filmes</button><button class="chip">Séries</button><button class="chip">Animes</button></div>';
 document.documentElement.dataset.ct326FyFiltering='1';
 const fy=document.querySelector('[data-ct329-foryou]');ok(getComputedStyle(fy).visibility==='hidden','stale ForYou draft visible during audit');
 delete document.documentElement.dataset.ct326FyFiltering;X.normalizeForYou();
 ok(getComputedStyle(fy).visibility!=='hidden','final ForYou stayed hidden');
 const buttons=[...fy.querySelectorAll('.ct329-actions>button')],tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));
 ok(buttons.length===3&&new Set(tops).size===1,'ForYou actions wrapped');
 ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'ForYou button text can wrap');
 ok(document.querySelector('[data-ct319-types]').children.length===4,'ForYou filters missing');

 /* Preserve strict Top10 refill + watched exclusion. */
 const media=(id,type,title,original)=>({id,tmdb_id:id,media_type:type,title,name:title,original_title:original||title,original_name:original||title,poster_path:'/p'+id+'.jpg',vote_average:8.2,release_date:'2020-01-01',first_air_date:'2020-01-01'});
 const hp=[671,672,673,674,675,767,12444,12445];
 T.setDiscover('top10','all');
 T.setTestBridge({
  topPage:async(provider,page)=>{
   const base=(page-1)*20;
   return{movies:page===1?hp.map((id,i)=>media(id,'movie','Harry Potter '+(i+1),'Harry Potter '+(i+1))).concat(Array.from({length:12},(_,i)=>media(50000+i,'movie','Livre '+i))):Array.from({length:20},(_,i)=>media(60000+base+i,'movie','Livre P'+page+' '+i)),series:Array.from({length:20},(_,i)=>media(70000+base+i,'tv','Serie '+page+' '+i))};
  },
  exact:async items=>({blocked_keys:items.filter(x=>hp.includes(x.tmdb_id)).map(x=>'movie:'+x.tmdb_id),watch_keys:[],seen_keys:items.filter(x=>hp.includes(x.tmdb_id)).map(x=>'movie:'+x.tmdb_id),not_interested_keys:[]})
 });
 const top=await T.topRaw321(9,true);
 ok(top.movies.length===10&&top.series.length===10,'Top10 did not fill 10+10');
 ok(top.movies.every(x=>!hp.includes(Number(x.tmdb_id))),'watched Harry Potter survived Top10');
 T.setTestBridge(null);

 document.documentElement.dataset.ct331done='1';
}catch(e){document.documentElement.dataset.ct331probe='fail:'+String(e?.stack||e)}},5000)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct331done="1"/.test(out)){const m=out.match(/data-ct331probe="([^"]*)"/);throw new Error('R331_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R331_BROWSER_OK cache-first Home + natural history + guarded ForYou + strict Top10');
