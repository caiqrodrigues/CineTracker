import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r317.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR317Test;ok(T,'r317 bridge unavailable');
 history.replaceState({},'','/profile');
 const p=document.createElement('main');
 p.innerHTML='<div data-profile><section class="panel"><div class="panel-head"><h2>Estatísticas</h2></div><div class="stats">'+
 ['Tempo de filme em Watchlist','Episódios','Filmes','Séries Watchlist','Filmes Watchlist','Tempo em Séries','Tempo em Filmes','Tempo de série em Watchlist','Tempo total de tela','Tempo total em Watchlist']
 .map((x,i)=>'<div class="stat"><small>'+x+'</small><b>'+(i+1)+'</b></div>').join('')+
 '</div></section></div>';document.body.appendChild(p);
 T.decorate317(p.querySelector('[data-profile]'));
 const root=p.querySelector('[data-profile]'),grid=root.querySelector('.ct317-profile-stats');ok(grid,'profile grid missing');
 const ordered=[...grid.querySelectorAll('.stat')].sort((a,b)=>Number(a.style.order||99)-Number(b.style.order||99)).map(x=>x.querySelector('small').textContent);
 ok(ordered[0]==='Episódios'&&ordered[1]==='Filmes'&&ordered[2]==='Séries Watchlist'&&ordered[3]==='Filmes Watchlist','top row order wrong '+ordered.slice(0,4).join('|'));
 ok(ordered[7]==='Tempo de filme em Watchlist','singular movie Watchlist time not placed at slot 8');
 const movie=[...grid.querySelectorAll('.stat')].find(x=>x.textContent.includes('Filmes Watchlist'));
 ok(movie?.dataset.ct317Watchlist==='movie','movie Watchlist decoration missing');
 window.__ctR316Test?.setTestBridge?.({watchRows:async kind=>kind==='movie'?[{media_type:'movie',tmdb_id:88,title:'Filme Watchlist Teste',is_watchlist:true}]:[]});
 movie.removeAttribute('data-ct317-watchlist');movie.removeAttribute('data-ct316-watchlist');movie.removeAttribute('data-ct117-watchlist-stat');
 movie.click();await new Promise(r=>setTimeout(r,120));
 ok(document.querySelector('[data-ct316-watch-modal="movie"]'),'movie Watchlist did not open from label-only capture');
 ok(document.querySelector('[data-ct316-media="movie:88"]'),'movie Watchlist list did not render');
 document.querySelector('[data-ct316-watch-close]')?.click();
 document.documentElement.dataset.ct317done='1';
}catch(e){document.documentElement.dataset.ct317probe='fail:'+String(e?.stack||e)}},4500)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=12000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct317done="1"/.test(out)){const m=out.match(/data-ct317probe="([^"]*)"/);throw new Error('R317_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R317_BROWSER_OK movie Watchlist opens by label-only first capture + exact order');
