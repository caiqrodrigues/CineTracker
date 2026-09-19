import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r316.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR316Test;ok(T,'r316 test bridge unavailable');
 history.replaceState({},'','/profile');
 const p=document.createElement('main');p.innerHTML='<div data-profile><section class="panel ct-r180-stats-panel"><div class="panel-head"><h2>Estatísticas</h2><button data-ct-r180-stats-toggle aria-expanded="true"><span>Recolher</span><b>⌃</b></button></div><div data-ct-r180-stats-body><div class="stats">'+
 ['Episódios','Filmes','Séries Watchlist','Filmes Watchlist','Tempo em Séries','Tempo em Filmes','Tempo de série em Watchlist','Tempo de filme em Watchlist','Tempo total de tela','Tempo total em Watchlist'].map((x,i)=>'<div class="stat"><small>'+x+'</small><b>'+(i+1)+'</b></div>').join('')+
 '</div></div></section><section class="panel"><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stats"><div class="stat"><small>Tempo assistido</small><b>149h 00min</b></div><div class="stat" data-ct299-history="all"><small>Eventos assistidos</small><b>68</b></div><div class="stat" data-ct299-history="stadium"><small>Jogos no Estádio</small><b>1</b></div></div></section></div>';document.body.appendChild(p);
 window.__ctR316.decorateProfile();
 const root=p.querySelector('[data-profile]'),grid=root.querySelector('.ct237-profile-stats');ok(grid,'r237 stats grid not restored');
 ok(getComputedStyle(grid).gridTemplateColumns.split(' ').length>=2,'requested grid not active');
 const screen=[...grid.querySelectorAll('.stat')].find(x=>x.textContent.includes('Tempo total de tela'));const watchTotal=[...grid.querySelectorAll('.stat')].find(x=>x.textContent.includes('Tempo total em Watchlist'));
 ok(screen?.dataset.ct237ProfileStat==='screen-total'&&watchTotal?.dataset.ct237ProfileStat==='watch-total','wide totals not mapped');
 const sw=[...grid.querySelectorAll('.stat')].find(x=>x.textContent.includes('Séries Watchlist')),mw=[...grid.querySelectorAll('.stat')].find(x=>x.textContent.includes('Filmes Watchlist'));
 ok(sw?.dataset.ct316Watchlist==='series'&&mw?.dataset.ct316Watchlist==='movie','Watchlist stats not clickable');
 ok(getComputedStyle(sw).pointerEvents!=='none','r315 static blocker still active');
 T.setTestBridge({watchRows:async kind=>kind==='series'?[{media_type:'tv',tmdb_id:10,title:'Série Teste',poster_path:null,is_watchlist:true,total_episodes:8,watched_episodes:0}]:[{media_type:'movie',tmdb_id:20,title:'Filme Teste',poster_path:null,is_watchlist:true}]});
 sw.click();await new Promise(r=>setTimeout(r,80));ok(document.querySelector('[data-ct316-watch-modal="series"]'),'Series Watchlist modal did not open');ok(document.querySelector('[data-ct316-media="tv:10"]'),'Series Watchlist row missing');document.querySelector('[data-ct316-watch-close]')?.click();
 mw.click();await new Promise(r=>setTimeout(r,80));ok(document.querySelector('[data-ct316-watch-modal="movie"]'),'Movie Watchlist modal did not open');document.querySelector('[data-ct316-watch-close]')?.click();
 history.replaceState({},'','/sports');const s=document.createElement('main');s.innerHTML='<section class="ct255-f1hub" data-ct255-f1><div class="ct255-f1-tabs"><button data-ct255-f1tab="overview">Visão geral</button><button data-ct255-f1tab="calendar">Calendário</button><button data-ct255-f1tab="standings">Classificações</button><button data-ct255-f1tab="drivers">Pilotos</button><button data-ct255-f1tab="teams">Equipes</button><button data-ct255-f1tab="circuits">Circuitos</button></div><div class="ct255-f1-content"><div class="ct255-f1-hero"><span>Próxima etapa</span><h3>Temporada encerrada</h3><p></p><b>—</b></div><div class="ct255-f1-summary"><div><small>Temporada</small><b>2026</b></div><div><small>Último GP</small><b>Spanish Grand Prix</b></div><div><small>Próximo</small><b>—</b></div></div></div></section>';document.body.appendChild(s);
 T.normalizeF1316();ok(!s.textContent.includes('Temporada encerrada'),'false season-ended text survived');ok(s.textContent.includes('Agenda ainda não sincronizada'),'incomplete schedule label missing');ok(!s.querySelector('[data-ct255-f1tab="drivers"]')&&!s.querySelector('[data-ct255-f1tab="teams"]'),'legacy F1 tabs survived');
 document.documentElement.dataset.ct316done='1';
}catch(e){document.documentElement.dataset.ct316probe='fail:'+String(e?.stack||e)}},4500)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=12000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));if(!/data-ct316done="1"/.test(out)){const m=out.match(/data-ct316probe="([^"]*)"/);throw new Error('R316_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R316_BROWSER_OK exact stat order + Watchlist modals + F1 truth');
