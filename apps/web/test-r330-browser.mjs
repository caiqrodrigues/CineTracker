import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r330.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR330,T=window.__ctR321Test;
 ok(X&&T,'r330 bridge unavailable');
 ok(window.__ctOfficialVersion==='1.0.121','version stale');

 /* Home must paint synchronously from the already-fetched DB payload, without awaiting TMDB reconciliation. */
 history.replaceState({},'','/home');
 const app=document.querySelector('#app');app.innerHTML='<div class="page" data-home></div>';
 const payload={__ctHistoryAuthoritative:true,series:[],movie_watchlist:[],history_episodes:[],history_movies:[]};
 try{homeCache=payload;ct274CanonicalHome=payload;ct285HomePayload=null;ct285CommittedRows=null}catch(e){throw new Error('Home globals unavailable '+e)}
 const t0=performance.now();window.__ctR285Test.paintHome();const elapsed=performance.now()-t0;
 ok(document.querySelector('[data-home] .home-tabs'),'Home did not paint on first call');
 ok(window.__ctR330HomeFirstPaintAt,'Home immediate paint marker missing');
 ok(elapsed<500,'synthetic first paint blocked for '+elapsed.toFixed(1)+'ms');
 history.replaceState({},'','/discover');

 /* Pra voce buttons must be three visible controls on one row. */
 app.innerHTML='<div data-ct329-foryou style="width:154px"><div class="ct329-actions" data-ct329-actions><button class="chip ct329-action ct329-watchlist">+ Watchlist</button><button class="chip ct329-action ct329-seen">✓ Visto</button><button class="chip ct329-action ct329-swapbtn">↻ Trocar</button></div></div>';
 const buttons=[...document.querySelectorAll('.ct329-actions>button')];
 ok(buttons.length===3,'Pra voce does not have three actions');
 const tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));
 ok(new Set(tops).size===1,'Pra voce buttons wrapped');
 ok(buttons.every(b=>getComputedStyle(b).visibility==='visible'&&getComputedStyle(b).display!=='none'),'Pra voce button hidden');
 ok(X.actionRowsHaveThree(document),'r330 three-button contract false');

 /* Top10 has no duplicate textual provider/title heading. */
 app.insertAdjacentHTML('beforeend','<section class="ct288-top-shell"><div class="ct288-top-title"><h2>Top 10</h2></div><div class="ct288-provider-row"><button class="ct288-provider active">HBO Max</button></div><div data-ct321-top-content><div class="ct288-top-name"><b>HBO Max</b></div></div></section>');
 X.normalizeDiscover(document);
 ok(!document.querySelector('.ct288-top-title'),'Top10 title duplicate survived');
 ok(!document.querySelector('.ct288-top-name'),'provider duplicate survived');
 ok(document.querySelector('.ct288-provider.active')?.textContent.includes('HBO Max'),'provider pill lost');

 /* Progressive Top10 must reject blocked watched titles and refill from later pages. */
 const media=(id,type,title,original)=>({id,tmdb_id:id,media_type:type,title,name:title,original_title:original||title,original_name:original||title,poster_path:'/p'+id+'.jpg',vote_average:8.2,release_date:'2020-01-01',first_air_date:'2020-01-01'});
 const hp=[671,672,673,674,675,767,12444,12445];
 T.setDiscover('top10','all');
 T.setTestBridge({
  topPage:async(provider,page)=>{
   const base=(page-1)*20;
   const movies=page===1
    ?hp.map((id,i)=>media(id,'movie','Harry Potter '+(i+1),'Harry Potter '+(i+1))).concat(Array.from({length:12},(_,i)=>media(50000+i,'movie','Livre '+i)))
    :Array.from({length:20},(_,i)=>media(60000+base+i,'movie','Livre P'+page+' '+i));
   const series=Array.from({length:20},(_,i)=>media(70000+base+i,'tv','Serie '+page+' '+i));
   return{movies,series};
  },
  exact:async items=>({blocked_keys:items.filter(x=>hp.includes(x.tmdb_id)).map(x=>'movie:'+x.tmdb_id),watch_keys:[],seen_keys:items.filter(x=>hp.includes(x.tmdb_id)).map(x=>'movie:'+x.tmdb_id),not_interested_keys:[]})
 });
 const top=await T.topRaw321(9,true);
 ok(top.movies.length===10&&top.series.length===10,'Top10 did not fill 10+10');
 ok(top.movies.every(x=>!hp.includes(Number(x.tmdb_id))),'watched Harry Potter survived Top10');
 T.setTestBridge(null);

 document.documentElement.dataset.ct330done='1';
}catch(e){document.documentElement.dataset.ct330probe='fail:'+String(e?.stack||e)}},4800)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=15000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct330done="1"/.test(out)){const m=out.match(/data-ct330probe="([^"]*)"/);throw new Error('R330_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R330_BROWSER_OK immediate Home + stable Discover buttons + strict compact Top10');
